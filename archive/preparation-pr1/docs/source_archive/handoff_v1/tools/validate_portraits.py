#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import argparse, sys
ap=argparse.ArgumentParser(); ap.add_argument('dir'); a=ap.parse_args(); d=Path(a.dir)
files=sorted(d.glob('*.png')); errors=[]; dims=set()
for p in files:
    im=Image.open(p).convert('RGBA'); dims.add(im.size)
    if im.getchannel('A').getbbox() is None: errors.append(f'{p.name}: entirely transparent')
    # production files should not contain opaque exact magenta
    for r,g,b,alpha in im.getdata():
        if alpha and (r,g,b)==(255,0,255): errors.append(f'{p.name}: opaque #FF00FF remains'); break
if len(dims)>1: errors.append(f'inconsistent dimensions: {sorted(dims)}')
if errors:
    print('PORTRAIT VALIDATION FAILED'); [print('-',e) for e in errors]; sys.exit(1)
print(f'PORTRAIT VALIDATION OK: {len(files)} files, dimensions={next(iter(dims),None)}')
