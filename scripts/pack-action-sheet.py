"""Slice an authored 4x4 alpha sheet; preserve aspect and the existing game size."""
import argparse
from PIL import Image
p=argparse.ArgumentParser(description=__doc__);p.add_argument('source');p.add_argument('output');a=p.parse_args()
source=Image.open(a.source).convert('RGBA')
assert source.getextrema()[3][0]==0,'Source requires genuine alpha'
sheet=Image.new('RGBA',(768,768))
for i in range(16):
 x,y=i%4,i//4
 frame=source.crop((round(x*source.width/4),round(y*source.height/4),round((x+1)*source.width/4),round((y+1)*source.height/4)))
 scale=176/max(frame.size);frame=frame.resize((round(frame.width*scale),round(frame.height*scale)),Image.Resampling.NEAREST)
 sheet.alpha_composite(frame,(x*192+(192-frame.width)//2,y*192+(192-frame.height)//2))
alpha=sheet.getchannel('A');packed=sheet.convert('RGB').quantize(colors=255,dither=Image.Dither.NONE)
# Reserve an actual palette entry for transparency, not an out-of-range index.
packed.putpalette((packed.getpalette()+[0]*768)[:768]);packed.paste(255,mask=alpha.point(lambda v:255 if v<80 else 0))
packed.save(a.output,optimize=True,transparency=255)
assert Image.open(a.output).convert('RGBA').getextrema()[3]==(0,255)
