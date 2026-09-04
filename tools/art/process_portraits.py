#!/usr/bin/env python3
"""Reproducible boundary-connected portrait keying and reviewed body normalization.

Originals are read-only. Near-background removal requires a reviewed configuration;
enclosed gaps and labels require explicit seeds/rectangles. No generated pixels.
"""
from pathlib import Path
import argparse, collections, hashlib, json, math, io
from PIL import Image
import numpy as np
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parents[2]
CANVAS = (2048, 2048)
BODY_HEIGHT = 1536
BASELINE = 1920
PADDING = 64

def save_png(image, path):
    buffer = io.BytesIO(); image.save(buffer, 'PNG', optimize=True)
    raw = buffer.getvalue(); temporary = path.with_suffix('.tmp')
    temporary.write_bytes(raw)
    if temporary.read_bytes() != raw: raise OSError('Incomplete PNG write: '+str(path))
    with Image.open(io.BytesIO(raw)) as check: check.load()
    temporary.replace(path)

def background_mask(image, config):
    rgb = np.asarray(image.convert('RGB'), dtype=np.float32)
    h, w = rgb.shape[:2]
    # Per-row edge samples accommodate the supplied background gradients.
    edges = np.concatenate([rgb[:, :4], rgb[:, -4:]], axis=1)
    background = np.median(edges, axis=1)[:, None, :]
    distance = np.max(np.abs(rgb-background), axis=2)
    candidate = distance <= config.get('background_tolerance', 32)
    seeds = np.zeros((h,w), bool)
    seeds[0] = seeds[-1] = True; seeds[:,0] = seeds[:,-1] = True
    for x,y in config.get('background_seeds', []):
        if not candidate[y,x]: raise ValueError(f'Background seed outside candidate: {x},{y}')
        seeds[y,x] = True
    mask = ndi.binary_propagation(seeds & candidate, mask=candidate)
    mask |= np.all(rgb == (255,0,255), axis=2)
    # Tiny isolated compression slivers immediately beside an approved boundary.
    tiny, _ = ndi.label(candidate & ~mask)
    counts = np.bincount(tiny.ravel()); counts[0] = 999999
    close = ndi.distance_transform_edt(~mask) <= 4
    mask |= (counts[tiny] <= 11) & close & (distance <= 8)
    return mask, rgb, background, candidate

def clean_background(image, config):
    if not config.get('reviewed_background'):
        raise ValueError('Reviewed background configuration required.')
    mask, rgb, background, candidate = background_mask(image, config)
    rgba = np.asarray(image.convert('RGBA')).copy()
    rgba[mask,3] = 0
    # Only a narrow band bordering approved background is unmatted. Interior
    # costume colours remain byte-for-byte unchanged before resampling.
    width = config.get('edge_width', 3)
    band = ndi.binary_dilation(mask, iterations=width) & ~mask
    interior = ~ndi.binary_dilation(mask, iterations=width+1)
    if interior.any():
        indices = ndi.distance_transform_edt(~interior, return_distances=False, return_indices=True)
        ys,xs = np.nonzero(band)
        fg = rgb[indices[0,ys,xs], indices[1,ys,xs]]
        near_bg = ndi.distance_transform_edt(~mask, return_distances=False, return_indices=True)
        bg = rgb[near_bg[0,ys,xs], near_bg[1,ys,xs]]
        delta = fg-bg
        alpha = np.clip(np.sum((rgb[ys,xs]-bg)*delta,axis=1)/np.maximum(np.sum(delta*delta,axis=1),1),0,1)
        residual = np.max(np.abs(rgb[ys,xs]-(bg+alpha[:,None]*delta)),axis=1)
        mixed = (alpha < .995) & (residual < config.get('edge_residual', 24))
        yy,xx = ys[mixed],xs[mixed]; aa = alpha[mixed]
        unmatte = (rgb[yy,xx]-(1-aa[:,None])*bg[mixed])/np.maximum(aa[:,None],.01)
        rgba[yy,xx,:3] = np.clip(np.rint(unmatte),0,255).astype(np.uint8)
        rgba[yy,xx,3] = np.rint(aa*rgba[yy,xx,3]).astype(np.uint8)
    for x0,y0,x1,y1 in config.get('reviewed_shadow_regions', []):
        region = rgb[y0:y1,x0:x1]
        bg = background[y0:y1]
        fraction = np.clip(np.sum(region*bg,axis=2)/np.maximum(np.sum(bg*bg,axis=2),1),0,1)
        residual = np.max(np.abs(region-fraction[:,:,None]*bg),axis=2)
        # These individually reviewed floor regions contain no purple costume.
        # Include colour-shifted JPEG shadow edges as well as a linear matte.
        magenta_shadow = (np.minimum(region[:,:,0],region[:,:,2])-region[:,:,1] > 45) & (region[:,:,0]>75) & (region[:,:,2]>75)
        shadow = ((residual <= 16) & (region[:,:,0] >= 110) & (region[:,:,2] >= 100)) | magenta_shadow
        patch = rgba[y0:y1,x0:x1]
        patch[shadow,:3] = 0
        patch[shadow,3] = np.rint(255*(1-fraction[shadow])).astype(np.uint8)
        # Do not reintroduce pixels already classified as pure background.
        patch[mask[y0:y1,x0:x1],3] = 0
    components, _ = ndi.label(rgba[:,:,3] > 32)
    sizes = np.bincount(components.ravel()); sizes[0] = 0
    body_component = sizes.argmax()
    for x0,y0,x1,y1 in config.get('excluded_label_rectangles', []):
        # A caption ornament may overlap the feet's Y range. Never apply a
        # horizontal crop through the character's connected silhouette.
        region = rgba[y0:y1,x0:x1,3]
        region[components[y0:y1,x0:x1] != body_component] = 0
    for component in config.get('reviewed_enclosed_components', []):
        if component['decision'] != 'retain_art': continue
        x0,y0,x1,y1 = component['bbox']
        protected = candidate[y0:y1,x0:x1] & ~mask[y0:y1,x0:x1]
        patch = rgba[y0:y1,x0:x1]
        original = np.asarray(image.convert('RGBA'))[y0:y1,x0:x1]
        patch[protected] = original[protected]
    return Image.fromarray(rgba), {'removed_background_pixels':int(mask.sum()),
        'edge_band_pixels':int(band.sum()), 'background_model':'per_row_median_outer_four_columns'}

def remove_exact_magenta(image):
    rgba = np.array(image.convert('RGBA')).copy()
    mask = np.all(rgba[:, :, :3] == (255, 0, 255), axis=2)
    rgba[mask, 3] = 0
    return Image.fromarray(rgba), int(mask.sum())

def inspect(image):
    rgba = np.array(image.convert('RGBA'))
    exact = np.all(rgba[:, :, :3] == (255, 0, 255), axis=2)
    border = np.concatenate([rgba[0], rgba[-1], rgba[:, 0], rgba[:, -1]])
    permitted = (border[:, 3] == 0) | np.all(border[:, :3] == (255, 0, 255), axis=1)
    common = collections.Counter(map(tuple, border[:, :3].tolist())).most_common(3)
    return {
        'exact_magenta_pixels': int(exact.sum()),
        'total_pixels': int(exact.size),
        'exact_magenta_fraction': float(exact.mean()),
        'border_clearable_fraction': float(permitted.mean()),
        'dominant_border_colours': [{'rgb': list(rgb), 'count': n} for rgb, n in common],
        'background_gate_passed': bool(permitted.all()),
    }

def normalize(image, anchors, config=None):
    if config is None:
        if not inspect(image)['background_gate_passed']:
            raise ValueError('Non-exact background requires reviewed constrained cleanup.')
        cleaned, removed = remove_exact_magenta(image)
        audit = {'removed_exact_pixels':removed}
    else:
        cleaned, audit = clean_background(image, config)
    box = cleaned.getchannel('A').getbbox()
    if box is None:
        raise ValueError('No foreground remains.')
    if not anchors or not anchors.get('reviewed_full_body_and_props') or not anchors.get('reviewed_no_baked_text'):
        raise ValueError('Reviewed body anchors and full-body/text checks required.')
    crown, soles = anchors['crown_y'], anchors['soles_y']
    if not box[1] <= crown < soles < box[3]:
        raise ValueError('Invalid body anchors.')
    scale = BODY_HEIGHT / (soles - crown)
    w, h = round((box[2] - box[0]) * scale), round((box[3] - box[1]) * scale)
    x = round(CANVAS[0] / 2 - (anchors['body_center_x'] - box[0]) * scale)
    y = round(BASELINE - (soles - box[1]) * scale)
    if min(x, y) < PADDING or x+w > CANVAS[0]-PADDING or y+h > CANVAS[1]-PADDING:
        raise ValueError('Props do not fit the shared canvas; do not shrink this character or crop.')
    crop = cleaned.crop(box).resize((w, h), Image.Resampling.LANCZOS)
    out = Image.new('RGBA', CANVAS, (0, 0, 0, 0))
    out.alpha_composite(crop, (x, y))
    # Unmatting and integer resampling can round a contaminated edge back to
    # the reserved key colour. Enforce the same exact-key contract at export.
    out, final_key_pixels = remove_exact_magenta(out)
    return out, {'source_opaque_bounds': list(box), 'scale': scale, 'offset': [x, y], 'final_exact_key_pixels':final_key_pixels, **audit}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=ROOT)
    ap.add_argument('--write', action='store_true', help='Write only fully reviewed eligible runtime records.')
    ap.add_argument('--report', type=Path)
    ap.add_argument('--drafts', action='store_true')
    ap.add_argument('--only', type=int, nargs='*', help='Source manifest indices for focused review.')
    args = ap.parse_args()
    manifest = json.loads((args.root/'data/manifests/portraits.json').read_text())
    config_path = args.root/'tools/art/portrait_processing.json'
    configs = json.loads(config_path.read_text()) if config_path.exists() else {'records':{}}
    report = []
    for index,row in enumerate(manifest['records']):
        if args.only is not None and index not in args.only: continue
        path = args.root/row['source_filename']
        with Image.open(path) as image:
            findings = inspect(image)
            eligible = (row['selection_status'] in ['canonical', 'variant'] and row['id'] is not None)
            result = {'asset_id': row['asset_id'], **findings, 'output_written': False}
            if eligible and (args.write or args.drafts):
                try:
                    config = configs['records'][row['asset_id']]
                    out, transform = normalize(image, config['anchors'], config)
                    rel = row['planned_runtime_filename']
                    dest = (args.root/rel).resolve()
                    if not dest.is_relative_to((args.root/'assets/portraits/runtime').resolve()):
                        raise ValueError('Runtime path escapes portrait output directory.')
                    if args.drafts: dest = args.root/'.reports/portrait_drafts'/f'{index:02}.png'
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    save_png(out, dest)
                    if args.write: row.update(runtime_filename=rel, runtime_dimensions=list(CANVAS),
                               runtime_sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
                               processing_status='ready', transform=transform, anchors=config['anchors'],
                               processing_config='tools/art/portrait_processing.json',
                               processing_config_sha256=hashlib.sha256(config_path.read_bytes()).hexdigest())
                    result['output_written'] = True
                except ValueError as error:
                    result['blocked_reason'] = str(error)
            report.append(result)
    if args.write:
        (args.root/'data/manifests/portraits.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2)+'\n')
    label = 'draft' if args.drafts else 'runtime'
    print(f'Audited {len(report)} originals; {sum(r["output_written"] for r in report)} {label} images written.')

if __name__ == '__main__':
    main()
