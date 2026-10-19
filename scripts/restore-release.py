from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[1];folder=root/'release/v0.89.1';m=json.loads((folder/'manifest.json').read_text());out=root/'build';out.mkdir(exist_ok=True);apk=out/m['filename']
with apk.open('wb') as target:
 for part in m['parts']:
  data=(folder/part['name']).read_bytes()
  assert len(data)==part['size'] and hashlib.sha256(data).hexdigest()==part['sha256'],part['name']
  target.write(data)
assert apk.stat().st_size==m['size'] and hashlib.sha256(apk.read_bytes()).hexdigest()==m['sha256']
with zipfile.ZipFile(apk) as z:
 assert z.testzip() is None
 files={}
 for n in z.namelist():
  if n.startswith('assets/game/') and not n.endswith('/'):
   rel=n.removeprefix('assets/game/');assert '..' not in Path(rel).parts
   p=root/'dist'/rel;p.parent.mkdir(parents=True,exist_ok=True);data=z.read(n);p.write_bytes(data);files[rel]=hashlib.sha256(data).hexdigest()
(root/'dist/package.json').write_text('{"type":"module"}\n')
(root/'release/v0.89.1/game-files.json').write_text(json.dumps(files,indent=2)+'\n')
(apk.with_suffix('.apk.sha256')).write_text(m['sha256']+'  '+apk.name+'\n')
print('Verified and reconstructed',apk.name,'with',len(files),'game source/art files')
