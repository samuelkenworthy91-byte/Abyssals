"""Run actual action battles and persist their exit status and exact asset hashes."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time
import urllib.request

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--batch',required=True)
p.add_argument('--ids')
p.add_argument('--skip-leaders',action='store_true')
p.add_argument('--label',default='full')
a=p.parse_args()
root=Path(__file__).resolve().parents[1]
os.chdir(root)
art=json.loads(Path('dist/action-vfx-data.js').read_text().split('export const ACTION_ART=',1)[1].strip().rstrip(';'))
selected={int(i) for i in a.ids.split(',')} if a.ids else None
def hashes():
 return {str(v['id']):hashlib.sha256((Path('dist')/v['src']).read_bytes()).hexdigest() for v in art.values() if v.get('batch')==a.batch and (selected is None or v['id'] in selected)}
before=hashes()
choreography={i:hashlib.sha256(json.dumps(art[i],sort_keys=True,separators=(',',':')).encode()).hexdigest() for i in before}
assert before,'No installed action assets selected'
folder=Path('build/qa');folder.mkdir(parents=True,exist_ok=True)
prefix=f'action-batch-{a.batch}-{a.label}'
log=folder/(prefix+'.log')
env=dict(os.environ,ART_BATCH=a.batch)
if a.ids:env['ART_IDS']=a.ids
if a.skip_leaders:env['ART_SKIP_LEADERS']='1'
server=subprocess.Popen(['python','-m','http.server','8765','--bind','127.0.0.1','--directory','dist'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
code=1
try:
 for _ in range(30):
  try:
   with urllib.request.urlopen('http://127.0.0.1:8765/',timeout=1):break
  except OSError:time.sleep(.1)
 with log.open('w') as stream:
  code=subprocess.call(['node','tests/art-revision-browser.cjs'],env=env,stdout=stream,stderr=subprocess.STDOUT)
 current_art=json.loads(Path('dist/action-vfx-data.js').read_text().split('export const ACTION_ART=',1)[1].strip().rstrip(';'))
 current_choreography={i:hashlib.sha256(json.dumps(current_art[i],sort_keys=True,separators=(',',':')).encode()).hexdigest() for i in before}
 if hashes()!=before or choreography!=current_choreography:
  code=1
  with log.open('a') as stream:stream.write('\nAsset or choreography hashes changed during verification.\n')
finally:
 server.terminate()
 report={'batch':a.batch,'status':'passed' if code==0 else 'failed','exitCode':code,'suite':'tests/art-revision-browser.cjs','ids':sorted(map(int,before)),'assetSha256':before,'choreographySha256':choreography,'log':str(log),'leaderChecks':not a.skip_leaders,'viewport':'390x844'}
 (folder/(prefix+'.json')).write_text(json.dumps(report,indent=2)+'\n')
print(log.read_text())
raise SystemExit(code)
