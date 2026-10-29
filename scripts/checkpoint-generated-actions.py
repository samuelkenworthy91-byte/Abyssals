"""Save already-generated action sources, pack them and record structural checks.

This does not generate artwork or grant gameplay/artistic approval.
"""
import argparse,hashlib,json,shutil,subprocess
from pathlib import Path
from PIL import Image
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('batch');p.add_argument('sources',help='JSON array of id/path mappings')
a=p.parse_args();root=Path(__file__).resolve().parents[1]
folder=root/f'art-library/action-vfx/batch-{a.batch}';folder.mkdir(exist_ok=True)
plan=json.loads((folder/'production-plan.json').read_text())['moves']
sources={x['id']:Path(x['path']) for x in json.loads(Path(a.sources).read_text())}
records=[]
for planned in plan:
 m=dict(planned);id=m['id'];source=folder/f'{id}-source.png';prepared=folder/f'{id}-prepared.png'
 if id in sources:
  incoming=sources[id].read_bytes()
  if source.exists() and source.read_bytes()!=incoming:raise ValueError('Refusing to overwrite source '+str(id))
  if not source.exists():shutil.copyfile(sources[id],source)
 if not source.exists():continue
 m.update(source=str(source.relative_to(root)),prepared=str(prepared.relative_to(root)),generator='built-in image_gen',status='prepared candidate; gameplay and artistic approval pending')
 try:
  if not prepared.exists():subprocess.run(['python',str(root/'scripts/pack-action-sheet.py'),str(source),str(prepared)],check=True,capture_output=True)
  im=Image.open(prepared).convert('RGBA');assert im.size==(768,768) and im.getextrema()[3]==(0,255)
  frames=[im.crop((i%4*192,i//4*192,(i%4+1)*192,(i//4+1)*192)) for i in range(16)]
  assert all(f.getbbox() for f in frames);unique=len({hashlib.sha256(f.tobytes()).hexdigest() for f in frames});assert unique>=12
  m.update(structuralValidation={'frames':16,'uniqueFrames':unique,'logicalCell':192,'transparent':True},preparedSha256=hashlib.sha256(prepared.read_bytes()).hexdigest())
 except Exception as e:m.update(status='requires structural repair',structuralError=str(e))
 m['sourceSha256']=hashlib.sha256(source.read_bytes()).hexdigest()
 (folder/f'{id}-production.json').write_text(json.dumps(m,indent=2)+'\n');records.append(m)
(folder/'prepared-manifest.json').write_text(json.dumps({'batch':a.batch,'status':'source production only; not installed','moves':records},indent=2)+'\n')
print(json.dumps({'batch':a.batch,'saved':len(records),'structurallyValid':sum('structuralValidation' in m for m in records),'repairIds':[m['id'] for m in records if 'structuralError' in m]}))
