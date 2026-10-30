"""A slightly uneven 4x4 source must not leak pieces into adjacent frames."""
import json
from pathlib import Path
import subprocess
import tempfile
from PIL import Image,ImageDraw

ROOT=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as directory:
 source=Path(directory)/'source.png';output=Path(directory)/'packed.png'
 im=Image.new('RGBA',(512,512));draw=ImageDraw.Draw(im)
 colours=[]
 for row,cy in enumerate([65,215,350,470]):
  for column,cx in enumerate([64,192,320,448]):
   i=row*4+column;colour=(32+i*13,40+i*9,220-i*11,255);colours.append(colour[:3])
   draw.rectangle((cx-28,cy-45,cx+28,cy+35),fill=colour)
 im.save(source)
 result=subprocess.run(['python',str(ROOT/'scripts/pack-action-sheet.py'),str(source),str(output)],check=True,capture_output=True,text=True)
 layout=json.loads(result.stdout);assert layout['version']==2
 packed=Image.open(output).convert('RGBA');assert packed.size==(768,768)
 for i,colour in enumerate(colours):
  frame=packed.crop((i%4*192,i//4*192,(i%4+1)*192,(i//4+1)*192))
  visible={p[:3] for p in frame.getdata() if p[3]}
  assert visible=={colour},f'Frame {i+1} contains a neighbouring drawing or lost its own'
  bounds=frame.getbbox();assert bounds and min(bounds[:2])>=8 and max(bounds[2:])<=184
print('PASS: all sixteen unevenly spaced drawings stay whole, separate and at a common scale.')
