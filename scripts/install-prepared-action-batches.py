"""Install saved, authored action sheets without regenerating source artwork.
Visual approval is deliberately separate; review and test each installed batch.
"""
import argparse,hashlib,json,re,shutil,subprocess
from pathlib import Path
from PIL import Image
p=argparse.ArgumentParser(description=__doc__);p.add_argument('batches',nargs='+');args=p.parse_args()
root=Path(__file__).resolve().parents[1]
pending=json.loads((root/'art-library/action-vfx/pending-production/recovery-2026-10-29/manifest.json').read_text())
coverage=json.loads((root/'docs/move-coverage.json').read_text());moves={m['id']:m for m in coverage['moves']}
file=root/'dist/action-vfx-data.js';prefix='export const ACTION_ART=';art=json.loads(file.read_text().split(prefix,1)[1].strip().rstrip(';'))
for batch in args.batches:
 prepared=root/f'art-library/action-vfx/batch-{batch}/prepared-manifest.json'
 items=json.loads(prepared.read_text())['moves'] if prepared.exists() else [m for m in pending['items'] if m['batch']==batch]
 if not items:items=[json.loads(p.read_text()) for p in sorted((root/f'art-library/action-vfx/batch-{batch}').glob('*-production.json'))]
 if not items:raise ValueError('No authored sources for batch '+batch)
 manifest={'batch':batch,'format':'PNG indexed transparent768x768;16frames of192x192','rasterTechnique':'Authored raster scenes; visual and gameplay approval tracked separately.','moves':[]}
 for m in items:
  id=m['id'];name=moves[id]['name'];key=re.sub('[^a-z0-9]+','-',name.lower()).strip('-');filename=f'{id}-{key}.png';target=root/'dist/assets/vfx/action'/filename
  if str(id) in art and art[str(id)].get('batch')!=batch:raise ValueError('Refusing to replace another batch/original: '+str(id))
  source=root/m['source']
  if not source.is_file() or not source.stat().st_size:raise ValueError('Missing authored source: '+str(source))
  if m.get('prepared'):shutil.copy(root/m['prepared'],target)
  else:subprocess.run(['python',str(root/'scripts/pack-action-sheet.py'),str(source),str(target)],check=True)
  image=Image.open(target).convert('RGBA');assert image.size==(768,768) and image.getextrema()[3]==(0,255),id
  frames=[image.crop((i%4*192,i//4*192,(i%4+1)*192,(i//4+1)*192)) for i in range(16)]
  assert all(f.getbbox() for f in frames) and len({hashlib.sha256(f.tobytes()).digest() for f in frames})>=12,id
  entry={'id':id,'name':key,'filename':filename,'action':name,'revision':m.get('revision','01'),'sequence':m['sequence'],'source':m['source']}
  manifest['moves'].append(entry)
  art[str(id)]={'id':id,'key':key,'name':name,'src':'assets/vfx/action/'+filename,'frames':16,'logicalCell':192,'duration':1500 if moves[id]['category']=='STATUS' else 1350,'impact':m.get('impact',0.5),'beats':[m.get('impact',0.5)],'orchard':False,'sequence':m['sequence'],'individual':True,'batch':batch,'revision':entry['revision']}
 (root/f'art-library/action-vfx/batch-{batch}.json').write_text(json.dumps(manifest,indent=2)+'\n')
file.write_text(prefix+json.dumps(art,separators=(',',':'))+';\n')
file=root/'dist/offline-assets.js';s=file.read_text();prefix='self.ABYSSALS_OFFLINE_ASSETS=';assets=json.loads(s.split(prefix,1)[1].strip().rstrip(';'));assets=sorted(set(assets)|{m['src'] for m in art.values()});s=s.split(prefix,1)[0]+prefix+json.dumps(assets,separators=(',',':'))+';\n';s=re.sub(r'(ABYSSALS_OFFLINE_REVISION=)(\d+)',lambda m:m[1]+str(int(m[2])+1),s);file.write_text(s)
print(json.dumps({'registeredSheets':len(art),'installedBatches':args.batches,'approval':'review pending; no automatic artistic approval'}))

