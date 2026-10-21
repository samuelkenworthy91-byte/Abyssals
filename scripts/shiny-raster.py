"""Decode the exact game panel to RGBA for renderer validation; source art is never changed."""
import sys,json,struct
from PIL import Image
q=json.load(sys.stdin)
im=Image.open(q['file']).convert('RGBA')
if q.get('rect'):
 x,y,w,h=q['rect'];im=im.crop((x,y,x+w,y+h))
if q.get('clipRows'):
 data=bytearray(im.tobytes());w,h=im.size;rows={row[0]:row[1:] for row in q['clipRows']}
 for y in range(h):
  spans=rows.get(y,[]);keep=bytearray(w)
  for n in range(0,len(spans),2):keep[spans[n]:spans[n+1]]=b'\1'*(spans[n+1]-spans[n])
  for x in range(w):
   if not keep[x]:data[(y*w+x)*4+3]=0
else:data=im.tobytes()
sys.stdout.buffer.write(struct.pack('<II',*im.size));sys.stdout.buffer.write(data)
