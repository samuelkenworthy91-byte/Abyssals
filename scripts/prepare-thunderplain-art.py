"""Optimize reviewed source illustrations; references never enter the APK."""
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=root/'art-library/thunderplain-v09013/source'
for name,limit in [('conductor',512),('abbey',1024),('garrison-house',640),('scriptorium',640),('pate-panel',900),('trade-panel',900),('darius-storm',768)]:
 im=Image.open(source/(name+'.png')).convert('RGBA' if name not in ['pate-panel','trade-panel'] else 'RGB')
 if im.mode=='RGBA':im=im.crop(im.getbbox())
 im.thumbnail((limit,limit),Image.Resampling.LANCZOS)
 out=root/('dist/assets/REV-DARIUS-STORM.webp' if name=='darius-storm' else 'dist/assets/pixel/bt-'+name+'-v09013.webp')
 im.save(out,quality=86,method=6)
 print(out.relative_to(root),out.stat().st_size)
