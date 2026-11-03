#!/usr/bin/env python3
"""Deterministic Abyssals human portrait cleanup.

Removes magenta source background, crops to opaque figure bounds, scales by figure
height and centers on a caller-approved canvas. No default production canvas is
invented: --canvas-width, --canvas-height and --figure-height are required.
"""
from pathlib import Path
from PIL import Image
import argparse

def clean(src:Path,dst:Path,cw:int,ch:int,fh:int,tol:int):
    im=Image.open(src).convert('RGBA')
    px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]
            if abs(r-255)<=tol and g<=tol and abs(b-255)<=tol:
                px[x,y]=(r,g,b,0)
    alpha=im.getchannel('A')
    box=alpha.getbbox()
    if not box: raise ValueError(f'no opaque figure remains: {src}')
    crop=im.crop(box)
    scale=fh/crop.height
    nw=max(1,round(crop.width*scale)); nh=fh
    if nw>cw or nh>ch: raise ValueError(f'figure does not fit requested canvas: {src.name} -> {nw}x{nh} in {cw}x{ch}')
    crop=crop.resize((nw,nh),Image.Resampling.LANCZOS)
    out=Image.new('RGBA',(cw,ch),(0,0,0,0))
    x=(cw-nw)//2; y=ch-nh
    out.alpha_composite(crop,(x,y))
    dst.parent.mkdir(parents=True,exist_ok=True); out.save(dst,'PNG',optimize=True)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('input_dir'); ap.add_argument('output_dir')
    ap.add_argument('--canvas-width',type=int,required=True); ap.add_argument('--canvas-height',type=int,required=True); ap.add_argument('--figure-height',type=int,required=True)
    ap.add_argument('--magenta-tolerance',type=int,default=3)
    a=ap.parse_args(); inp=Path(a.input_dir); out=Path(a.output_dir)
    files=sorted([p for p in inp.iterdir() if p.suffix.lower() in {'.png','.webp','.jpg','.jpeg'}])
    if not files: raise SystemExit('No portrait images found.')
    for p in files:
        clean(p,out/(p.stem+'.png'),a.canvas_width,a.canvas_height,a.figure_height,a.magenta_tolerance)
        print('processed',p.name)
if __name__=='__main__': main()
