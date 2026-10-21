"""Selected transparent runtime props; source PNGs stay outside dist."""
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
for name,limit in [('mountain-steps',640),('broken-cart',640),('glass-crater',768)]:
 im=Image.open(root/'art-library/storm-polish-v09014/source'/f'{name}.png').convert('RGBA')
 im=im.crop(im.getbbox());im.thumbnail((limit,limit),Image.Resampling.LANCZOS)
 out=root/'dist/assets/pixel'/f'bt-{name}-v09014.webp';im.save(out,quality=88,method=6)
 print(out.relative_to(root),im.size,out.stat().st_size)
