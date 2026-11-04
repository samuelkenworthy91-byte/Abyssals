"""Install only hash-verified, already-uploaded sheets from the keyed recovery manifest."""
import argparse,hashlib,json,re,shutil,subprocess
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'art-library/action-vfx/integration-2026-11-04'
args=argparse.ArgumentParser();args.add_argument('--stage',type=int,choices=[0,1,2,3,4],required=True);args=args.parse_args()
manifest=json.loads((P/'manifest.json').read_text());sources={str(x['id']):x for x in manifest['sources'] if x['stage']<=args.stage}
art={};checks=[]
for id,s in sources.items():
 source=ROOT/s['source'];assert hashlib.sha256(source.read_bytes()).hexdigest()==s['sha256'],source
 with Image.open(source) as im:
  assert im.size==(768,768),source
  image=im.convert('RGBA');alpha_min,alpha_max=image.getextrema()[3]
  # Spectral effects may be intentionally translucent throughout. Genuine empty
  # pixels and strong visible content are required; fully opaque paint is not.
  assert alpha_min==0 and alpha_max>=240,source
  frames=[image.crop((i%4*192,i//4*192,(i%4+1)*192,(i//4+1)*192)) for i in range(16)]
  boxes=[f.getchannel('A').getbbox() for f in frames]
  distinct=len({hashlib.sha256(f.tobytes()).digest() for f in frames})
  gutter=min(min(b[0],b[1],192-b[2],192-b[3]) for b in boxes if b)
  # Historic approved originals retain their exact bytes. All new upload packs
  # require sixteen different occupied frames and transparent cell boundaries.
  if s['art'].get('revision')=='approved-upload':assert all(boxes) and distinct==16 and gutter>=2,(source,distinct,gutter)
 target=ROOT/'dist'/s['art']['src'];target.parent.mkdir(parents=True,exist_ok=True)
 if source!=target:shutil.copyfile(source,target)
 art[id]={**s['art'],'sourceId':int(id)}
 art[id]['frameBounds']=[min(b[0] for b in boxes if b),min(b[1] for b in boxes if b),max(b[2] for b in boxes if b),max(b[3] for b in boxes if b)]
 checks.append({'id':int(id),'sha256':s['sha256'],'source':s['source'],'src':s['art']['src'],'frames':16,'distinctFrames':distinct,'nonemptyFrames':sum(bool(b) for b in boxes),'minimumGutter':gutter})
for id,baseline in manifest['baselineAssignment'].items():
 if id in art:continue
 preferred=str(manifest['partialAssignment'][id]);source=preferred if preferred in sources else str(baseline)
 assert source in sources,(id,source)
 original=art[source]
 # A direct binding keeps the target's stable ID, but explicitly declares the
 # actual source. It never pretends to be a unique or independently reviewed sheet.
 art[id]={**original,'id':int(id),'key':'shared-'+id+'-from-'+source,'sourceId':int(source),'individual':False,'shared':True,'batch':'shared-recovery'}
assert len(art)==615
(ROOT/'dist/action-vfx-data.js').write_text('export const ACTION_ART='+json.dumps(art,separators=(',',':'))+';\n')
file=ROOT/'dist/offline-assets.js';text=file.read_text();prefix='self.ABYSSALS_OFFLINE_ASSETS='
assets=json.loads(text.split(prefix,1)[1].strip().rstrip(';'));assets=sorted(set(assets)|{x['src'] for x in art.values()})
text=text.split(prefix,1)[0]+prefix+json.dumps(assets,separators=(',',':'))+';\n'
text=re.sub(r'(ABYSSALS_OFFLINE_REVISION=)(\d+)',lambda m:m[1]+str(int(m[2])+1),text);file.write_text(text)
(P/'technical-checks.json').write_text(json.dumps({'stage':args.stage,'sources':checks,'bindings':615,'dedicated':len(sources),'shared':615-len(sources),'battlePlayback':'pending'},indent=2)+'\n')
print(json.dumps({'bindings':len(art),'dedicated':len(sources),'shared':615-len(sources)}))
subprocess.run(['node','scripts/build-art-coverage.mjs'],cwd=ROOT,check=True)
coverage=json.loads((ROOT/'docs/move-coverage.json').read_text())
cfg=json.loads((ROOT/'release-config.json').read_text());file=ROOT/cfg['artwork_scope_path'];scope=json.loads(file.read_text())
scope.update(request='Wire available approved uploaded sheets on main; retain direct shared bindings for absent sheets.',expectedDedicatedSheets=len(sources),expectedBindings=len(art),remainingWithoutDedicatedSheets=615-len(sources))
scope['moves']=[{'id':m['id'],'name':m['name'],'src':m['art']['src'],'sha256':m['art']['sha256'],'sourceId':m['art']['sourceId'],'shared':m['art']['shared'],'reviewStatus':m['status']} for m in coverage['moves'] if m['art'] and m['art']['exists']]
scope['limitation']='Production approval and technical installation are separate from fresh gameplay visual approval. See integration technical and playback reports. No APK build claimed.'
file.write_text(json.dumps(scope,indent=2)+'\n')
