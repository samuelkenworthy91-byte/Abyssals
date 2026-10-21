"""Reproduce selected runtime sprites from preserved source; no archive enters dist."""
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
for name in ['potions','books','armour','stairs','counter']:
    image=Image.open(root/'art-library/marasen-store/source'/f'{name}.png').convert('RGBA')
    image=image.crop(image.getchannel('A').point(lambda a:255 if a>12 else 0).getbbox())
    size=(384,192) if name in ['potions','books','armour'] else (240,240) if name=='stairs' else (432,144)
    image.resize(size,Image.Resampling.LANCZOS).save(root/'dist/assets/pixel'/f'exchange-{name}-v09012.webp',quality=88,method=6)
for floor in range(6):
    image=Image.open(root/'dist/assets/pixel'/f'aquatic-exchange-{floor}-v089.webp')
    image.crop((0,0,image.width,75)).resize((672,80),Image.Resampling.LANCZOS).save(root/'dist/assets/pixel'/f'exchange-frieze-{floor}-v09012.webp',quality=85,method=6)
