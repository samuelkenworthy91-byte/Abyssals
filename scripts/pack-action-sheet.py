"""Slice an authored 4x4 alpha sheet; preserve aspect and the existing game size."""
import argparse,json
from PIL import Image
p=argparse.ArgumentParser(description=__doc__);p.add_argument('source');p.add_argument('output');a=p.parse_args()
source=Image.open(a.source).convert('RGBA')
assert source.getextrema()[3][0]==0,'Source requires genuine alpha'
mask=source.getchannel('A').point(lambda v:255 if v>=80 else 0)
def seams(mask,axis):
 length=mask.height if axis=='rows' else mask.width
 cuts=[0]
 for n in range(1,4):
  nominal=round(n*length/4);radius=round(length/16)
  empty=[]
  for k in range(max(1,nominal-radius),min(length-1,nominal+radius)+1):
   strip=mask.crop((0,k,mask.width,k+1) if axis=='rows' else (k,0,k+1,mask.height))
   if strip.getbbox() is None:empty.append(k)
  runs=[]
  for k in empty:
   if not runs or k>runs[-1][-1]+1:runs.append([k])
   else:runs[-1].append(k)
  if not runs:raise ValueError(f'No transparent {axis} gutter near boundary {n}; source requires isolation review')
  run=max(runs,key=lambda r:(len(r),-abs((r[0]+r[-1])/2-nominal)))
  cuts.append(round((run[0]+run[-1])/2))
 return cuts+[length]
rows=seams(mask,'rows');rects=[]
for y in range(4):
 band=mask.crop((0,rows[y],mask.width,rows[y+1]));columns=seams(band,'columns')
 rects.extend((columns[x],rows[y],columns[x+1],rows[y+1]) for x in range(4))
# One common scale retains the relative size of every temporal drawing.
scale=176/max(max(r[2]-r[0],r[3]-r[1]) for r in rects)
sheet=Image.new('RGBA',(768,768))
for i,rect in enumerate(rects):
 x,y=i%4,i//4;frame=source.crop(rect)
 frame=frame.resize((round(frame.width*scale),round(frame.height*scale)),Image.Resampling.NEAREST)
 sheet.alpha_composite(frame,(x*192+(192-frame.width)//2,y*192+(192-frame.height)//2))
alpha=sheet.getchannel('A');packed=sheet.convert('RGB').quantize(colors=255,dither=Image.Dither.NONE)
# Reserve an actual palette entry for transparency, not an out-of-range index.
packed.putpalette((packed.getpalette()+[0]*768)[:768]);packed.paste(255,mask=alpha.point(lambda v:255 if v<80 else 0))
packed.save(a.output,optimize=True,transparency=255)
assert Image.open(a.output).convert('RGBA').getextrema()[3]==(0,255)
print(json.dumps({'version':2,'method':'transparent-gutter extraction; unchanged authored raster','sourceRects':rects,'commonScale':scale,'outputCell':192}))
