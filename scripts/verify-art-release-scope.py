"""Validate the explicitly requested interim artwork release; full releases retain100% gates."""
import argparse,hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(path):return json.loads((ROOT/path).read_text())
def validate(scope,cfg,coverage,environments):
 assert scope['releaseVersion']==cfg['version'],'Scope version mismatch'
 assert scope['mode']=='interim' and scope['requestedByUser'] is True,'Missing explicit interim scope'
 assert scope['expectedPlayableActions']==coverage['totals']['total'],'Playable inventory changed'
 assert scope['expectedDedicatedSheets']==coverage['totals']['dedicated'],'Dedicated coverage changed'
 assert scope['remainingWithoutDedicatedSheets']==coverage['totals']['missing'],'Remaining coverage misreported'
 assert not coverage['orphanArtIds'],'Unregistered animation assets'
 installed={m['id']:m for m in coverage['moves'] if m.get('art',{} ) and m['art']['exists']}
 expected={m['id']:m for m in scope['moves']}
 assert len(expected)==len(scope['moves']) and set(expected)==set(installed),'Move scope mismatch'
 for id,m in installed.items():
  e=expected[id];art=m['art'];p=ROOT/'dist'/art['src']
  assert p.is_file() and p.stat().st_size>0,'Missing artwork '+str(id)
  digest=hashlib.sha256(p.read_bytes()).hexdigest()
  assert e['sha256']==art['sha256']==digest,'Artwork hash changed '+str(id)
  assert e['src']==art['src'] and e['reviewStatus']==m['status'],'Scope metadata changed '+str(id)
  assert m['status']!='requires-revision','Known rejected artwork '+str(id)
 assert environments['totals']['technicalIssues']==0,'Environment navigation failure'
 maps={m['id']:m for m in environments['maps']}
 expected_ids={'sporeRim','sporeDepths','sporeBridge','sporeCrown','sporeGrotto','sporeCanopy'}
 assert {m['id'] for m in scope['redesignedMaps']}==expected_ids,'Sporefall scope mismatch'
 for e in scope['redesignedMaps']:
  m=maps[e['id']]
  assert m['status']=='approved' and not m['technicalIssues'],'Environment approval incomplete'
  assert e['sha256']==m['sha256']==hashlib.sha256((ROOT/m['source']).read_bytes()).hexdigest(),'Environment art changed'
  assert e['geometrySha256']==m['geometrySha256'],'Environment geometry changed'
 return {'version':cfg['version'],'dedicated':len(installed),'playable':coverage['totals']['total'],'redesignedMaps':len(expected_ids),'pendingVisualReview':sum(m['status']!='approved' for m in installed.values())}

def main():
 cfg=read('release-config.json');mode=cfg.get('artwork_release_mode','full')
 if mode=='full':
  for script in ['build-art-coverage.mjs','build-environment-qa.mjs']:subprocess.run(['node',str(ROOT/'scripts'/script),'--check','--release'],cwd=ROOT,check=True)
 elif mode=='interim':
  scope_path=Path(cfg['artwork_scope_path']);assert not scope_path.is_absolute() and '..' not in scope_path.parts
  print(json.dumps(validate(read(str(scope_path)),cfg,read('docs/move-coverage.json'),read('docs/finale-environment-qa.json'))))
 else:raise ValueError('Unknown artwork release mode: '+mode)
if __name__=='__main__':main()

