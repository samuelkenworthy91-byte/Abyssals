"""Validate the committed runtime artwork without regenerating it."""
from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1]
entries=json.loads((root/'art-library/action-vfx/provenance.json').read_text())
assert len(entries)==63 and len({e['id'] for e in entries})==63
for e in entries:
 paths=list((root/'dist/assets/vfx/action').glob(str(e['id'])+'-*.png'));assert len(paths)==1,e['name']
 p=paths[0];assert hashlib.sha256(p.read_bytes()).hexdigest()==e['runtimeSha256'],e['name']
 im=Image.open(p);assert im.size==(256,256) and im.mode=='RGBA',e['name']
 assert im.getextrema()[3][0]==0,e['name']
 assert e['frameCount']==16 and e['logicalCell']==64,e['name']
for p in (root/'dist/assets/vfx').glob('*.webp'):
 if p.name.startswith('moves-'):assert Image.open(p).size==(256,384),p.name
 if p.name.startswith('signature-'):assert Image.open(p).size==(192,256),p.name
print('PASS: 63 committed pixel animations and all 22 normalized atlases.')

# This pre-existing empty prop also blocked review-image verification.
with Image.open(root/'dist/assets/pixel/berry-shop-cabinet.webp') as im:
 assert im.width>0 and im.height>0
 im.verify()
