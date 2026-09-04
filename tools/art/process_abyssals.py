#!/usr/bin/env python3
"""Reproduce reviewed front cutouts from pristine sheets. No redraw, back sprites or gameplay."""
import argparse,hashlib,io,json
from pathlib import Path
import numpy as np
from scipy import ndimage as ndi
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]

def rgba_cutout(rgb,mask):
    """Preserve interior pixels; unmix white only in the two-pixel exterior antialias band."""
    alpha=mask.astype(np.float64)
    inner=ndi.binary_erosion(mask,iterations=2)
    if inner.any():
        _,index=ndi.distance_transform_edt(~inner,return_indices=True)
        reference=rgb[tuple(index)].astype(np.float64)
        observed=rgb.astype(np.float64)
        band=mask & ~inner
        # Use the darkest reference channel for a stable white-background alpha estimate.
        channel=np.argmin(reference,axis=2)
        ref=np.take_along_axis(reference,channel[:,:,None],axis=2)[:,:,0]
        obs=np.take_along_axis(observed,channel[:,:,None],axis=2)[:,:,0]
        eligible=band & (ref<220) & (obs>ref)
        alpha[eligible]=np.clip((255-obs[eligible])/(255-ref[eligible]),0,1)
        out=observed.copy()
        mixed=eligible & (alpha>0.02)
        out[mixed]=np.clip((observed[mixed]-255*(1-alpha[mixed,None]))/alpha[mixed,None],0,255)
    else:out=rgb.astype(np.float64)
    result=np.dstack((np.rint(out).astype(np.uint8),np.rint(alpha*255).astype(np.uint8)))
    result[result[:,:,3]==0,:3]=0
    return Image.fromarray(result)

def sheet_components(rgb,sheet,config):
    h,w=rgb.shape[:2];working=rgb.copy()
    for x0,y0,x1,y1 in sheet['annotation_exclusions']:
        working[max(0,y0):min(h,y1),max(0,x0):min(w,x1)]=255
    candidate=(working.min(2)>=config['background_min_channel']) & (working.max(2).astype(int)-working.min(2).astype(int)<=config['background_max_chroma'])
    boundary=np.zeros((h,w),bool);boundary[0,:]=boundary[-1,:]=boundary[:,0]=boundary[:,-1]=True
    foreground=~ndi.binary_propagation(boundary&candidate,mask=candidate)
    for x0,y0,x1,y1 in sheet['annotation_exclusions']:
        foreground[max(0,y0):min(h,y1),max(0,x0):min(w,x1)]=False
    cc,_=ndi.label(foreground,structure=np.ones((3,3)))
    for removed in sheet['removed_arrow_components']:foreground[cc==removed['component_id']]=False
    cc,_=ndi.label(foreground,structure=np.ones((3,3)))
    return cc

def save_checked(image,path):
    buffer=io.BytesIO();image.save(buffer,format='PNG',compress_level=9);payload=buffer.getvalue()
    path.parent.mkdir(parents=True,exist_ok=True);temp=path.with_suffix('.tmp')
    temp.write_bytes(payload)
    assert temp.read_bytes()==payload,'Incomplete PNG write'
    with Image.open(temp) as check:check.load()
    temp.replace(path)
    return hashlib.sha256(payload).hexdigest()

def unmix_reviewed_shadows(image,rgb,regions,protected=(),min_channel=135,max_chroma=40):
    """Convert white-matted neutral ground shadows only within reviewed floor rectangles.

    Flood from each rectangle's sides/bottom; dark figure outlines block the flood.
    No top-edge seed and no global grey/white replacement.
    """
    out=np.array(image)
    original=out.copy()
    for x0,y0,x1,y1 in regions:
        crop=rgb[y0:y1,x0:x1].astype(float)
        candidate=(crop.min(2)>=min_channel)&((crop.max(2)-crop.min(2))<=max_chroma)
        seed=np.zeros(candidate.shape,bool);seed[:,-1]=seed[:,0]=seed[-1,:]=True
        background=ndi.binary_propagation(seed&candidate,mask=candidate)
        region=out[y0:y1,x0:x1];background &= region[:,:,3]>0
        level=crop.mean(2)
        region[background,:3]=0
        region[background,3]=np.minimum(region[background,3],np.rint(255-level[background]).astype(np.uint8))
    for x0,y0,x1,y1 in protected:out[y0:y1,x0:x1]=original[y0:y1,x0:x1]
    return Image.fromarray(out)

def process(config_path,output,write=False,only=None):
    config=json.loads(config_path.read_text());config_sha=hashlib.sha256(config_path.read_bytes()).hexdigest();manifest_path=ROOT/'data/manifests/abyssal_art.json';manifest=json.loads(manifest_path.read_text());byid={r['species_id']:r for r in manifest['records']}
    done=[]
    for sheet in config['sheets']:
        if only and not any(r['species_id']==only for r in sheet['records']):continue
        src=ROOT/sheet['source_filename'];source_sha=hashlib.sha256(src.read_bytes()).hexdigest()
        assert all(byid[r['species_id']]['sha256']==source_sha for r in sheet['records'])
        rgb=np.array(Image.open(src).convert('RGB'));cc=sheet_components(rgb,sheet,config)
        near=(rgb.min(2)>=config['background_min_channel']) & (rgb.max(2).astype(int)-rgb.min(2).astype(int)<=config['background_max_chroma'])
        near_components,_=ndi.label(near)
        for row in sheet['records']:
            if only and row['species_id']!=only:continue
            if write and row.get('visual_review')!='approved':raise ValueError('Unreviewed sprite '+row['species_id'])
            mask=np.isin(cc,row['component_ids'])
            for x0,y0,x1,y1 in row.get('exclude_regions',[]):mask[y0:y1,x0:x1]=False
            # Reviewed enclosed-background seeds remove only connected near-white gaps.
            for x,y in row.get('background_seeds',[]):
                component=near_components[y,x]
                if not component:raise ValueError('Background seed is not near-white')
                mask[near_components==component]=False
            im=rgba_cutout(rgb,mask)
            im=unmix_reviewed_shadows(im,rgb,row.get('shadow_regions',[]),row.get('shadow_protect_regions',[]),row.get('shadow_min_channel',135),row.get('shadow_max_chroma',40))
            bbox=im.getbbox()
            if not bbox:raise ValueError('Empty figure '+row['species_id'])
            im=im.crop(bbox);scale=min(1,944/im.width,944/im.height)
            if scale<1:im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
            canvas=Image.new('RGBA',(1024,1024));offset=((1024-im.width)//2,976-im.height);canvas.alpha_composite(im,offset)
            entry=byid[row['species_id']];name=Path(entry['planned_runtime_filename']).name if write else f"{row['species_id']}_{row['name']}.png"
            path=output/name;sha=save_checked(canvas,path)
            if write:entry.update({'runtime_filename':str(path.relative_to(ROOT)),'runtime_sha256':sha,'runtime_dimensions':[1024,1024],'status':'ready','source_bbox':list(bbox),'runtime_scale':scale,'runtime_offset':list(offset),'processing_config':str(config_path.relative_to(ROOT)),'processing_config_sha256':config_sha,'visual_review':'approved'})
            done.append(row['species_id'])
    if write:
        assert len(done)==187 and len(set(done))==187
        manifest.update({'runtime_file_count':187,'runtime_status':'ready','unresolved':[]});manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
    print(('RUNTIME' if write else 'DRAFT')+': '+str(len(done))+' front sprites reproduced')

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--config',type=Path,default=ROOT/'tools/art/species_extraction.json');p.add_argument('--write',action='store_true');p.add_argument('--species');p.add_argument('--draft-dir',type=Path,default=ROOT/'.reports/abyssal_drafts');a=p.parse_args()
    if a.write and a.species:p.error('--write requires full 187-species pass')
    process(a.config,ROOT/'assets/abyssals/runtime' if a.write else a.draft_dir,a.write,a.species)
