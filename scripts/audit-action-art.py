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
 im=Image.open(p);assert im.size==(768,768) and im.mode=='RGBA',e['name']
 assert im.getextrema()[3][0]==0,e['name']
 assert e['frameCount']==16 and e['logicalCell']==192,e['name']
for p in (root/'dist/assets/vfx').glob('*.webp'):
 if p.name.startswith('moves-'):assert Image.open(p).size==(768,1152),p.name
 if p.name.startswith('signature-'):assert Image.open(p).size==(576,768),p.name
atlas_entries=json.loads((root/'art-library/action-vfx/atlas-detail-provenance.json').read_text())
assert len(atlas_entries)==22
for e in atlas_entries:
 p=root/'dist/assets/vfx'/e['file']
 assert hashlib.sha256(p.read_bytes()).hexdigest()==e['runtimeSha256'],e['file']
print('PASS: 63 committed pixel animations and all 22 high-detail atlases.')

# This pre-existing empty prop also blocked review-image verification.
with Image.open(root/'dist/assets/pixel/berry-shop-cabinet.webp') as im:
 assert im.width>0 and im.height>0
 im.verify()


# Subsequent canonical move art is tracked independently from the 63 protected
# original action sheets. Do not rewrite the Mercy source or the original hashes.
batches=[json.loads(p.read_text()) for p in sorted((root/'art-library/action-vfx').glob('batch-*.json'))]
moves=[m for batch in batches for m in batch['moves']]
assert len({m['id'] for m in moves})==len(moves)
assert len(batches[0]['moves'])==12
new_signatures=[]
for m in moves:
 p=root/'dist/assets/vfx/action'/m['filename']
 assert p.is_file(),m['filename']
 with Image.open(p) as im:
  assert im.size==(768,768),m['filename']
  assert im.mode=='P' and 'transparency' in im.info,m['filename']
  art=im.convert('RGBA')
  assert art.getextrema()[3][0]==0 and art.getextrema()[3][1]==255,m['filename']
  assert all(art.crop((i%4*192,i//4*192,(i%4+1)*192,(i//4+1)*192)).getbbox() for i in range(16)),m['filename']
  assert len({hashlib.sha256(art.crop((i%4*192,i//4*192,(i%4+1)*192,(i//4+1)*192)).tobytes()).digest() for i in range(16)})>=12,m['filename']
 new_signatures.append(hashlib.sha256(p.read_bytes()).hexdigest())
assert len(set(new_signatures))==len(moves)
print(f'PASS: {len(moves)} additional 192px animation sheets have unique frame content; artistic approval is tracked separately')
