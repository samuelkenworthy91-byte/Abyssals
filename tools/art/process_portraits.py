#!/usr/bin/env python3
"""Exact-colour portrait audit and reproducible, fail-closed normalization.

No fuzzy keying, segmentation, inpainting, text removal, or inferred identity.
Review anchors must measure body crown/soles, excluding raised props/hats.
"""
from pathlib import Path
import argparse, collections, hashlib, json, math
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
CANVAS = (1536, 2048)
BODY_HEIGHT = 1536
BASELINE = 1920
PADDING = 64

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

def normalize(image, anchors):
    if not inspect(image)['background_gate_passed']:
        raise ValueError('Non-exact background remains; original or approved precise matte required.')
    cleaned, removed = remove_exact_magenta(image)
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
    return out, {'source_opaque_bounds': list(box), 'scale': scale, 'offset': [x, y], 'removed_exact_pixels': removed}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=ROOT)
    ap.add_argument('--write', action='store_true', help='Write only fully reviewed eligible runtime records.')
    ap.add_argument('--report', type=Path)
    args = ap.parse_args()
    manifest = json.loads((args.root/'data/manifests/portraits.json').read_text())
    report = []
    for row in manifest['records']:
        path = args.root/row['source_filename']
        with Image.open(path) as image:
            findings = inspect(image)
            eligible = (row['selection_status'] in ['canonical', 'variant'] and row['id'] is not None)
            result = {'asset_id': row['asset_id'], **findings, 'output_written': False}
            if eligible and args.write:
                try:
                    out, transform = normalize(image, row.get('anchors'))
                    rel = row['planned_runtime_filename']
                    dest = (args.root/rel).resolve()
                    if not dest.is_relative_to((args.root/'assets/portraits/runtime').resolve()):
                        raise ValueError('Runtime path escapes portrait output directory.')
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    out.save(dest, 'PNG', optimize=True)
                    row.update(runtime_filename=rel, runtime_dimensions=list(CANVAS),
                               runtime_sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
                               processing_status='ready', transform=transform)
                    result['output_written'] = True
                except ValueError as error:
                    result['blocked_reason'] = str(error)
            report.append(result)
    if args.write:
        (args.root/'data/manifests/portraits.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2)+'\n')
    print(f'Audited {len(report)} originals; {sum(r["background_gate_passed"] for r in report)} clearable borders; {sum(r["output_written"] for r in report)} runtime images written.')

if __name__ == '__main__':
    main()
