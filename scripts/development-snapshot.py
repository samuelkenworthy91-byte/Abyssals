"""Create or restore a verified development snapshot. GitHub remains authoritative."""
import argparse,hashlib,io,json,subprocess,tarfile,zipfile
from pathlib import Path,PurePosixPath

ROOTS=('dist','scripts','tests','docs','art-library/action-vfx','art-library/finale','art-library/reviews/item-branches-2026-10-26','AGENTS.md','release-config.json','.github/workflows')
def sha(data): return hashlib.sha256(data).hexdigest()
def safe(name):
 p=PurePosixPath(name)
 if p.is_absolute() or '..' in p.parts: raise ValueError('Unsafe archive path: '+name)
 return p

def create(root,out,commit):
 root=Path(root).resolve();out=Path(out).resolve();out.mkdir(parents=True,exist_ok=True)
 paths=set()
 for item in ROOTS:
  p=root/item
  if not p.exists(): raise ValueError('Missing snapshot input: '+item)
  paths.update(x for x in (p.rglob('*') if p.is_dir() else [p]) if x.is_file())
 records=[]
 for p in sorted(paths):
  if p.is_symlink(): raise ValueError('Symlink not allowed: '+str(p))
  data=p.read_bytes();name=p.relative_to(root).as_posix();safe(name)
  records.append({'path':name,'bytes':len(data),'sha256':sha(data)})
 for manifest in (root/'art-library/action-vfx').glob('batch-*/prepared-manifest.json'):
  for item in json.loads(manifest.read_text())['moves']:
   for field in ('source','prepared'):
    p=root/item[field]
    if not p.is_file() or not p.stat().st_size: raise ValueError('Missing or empty artwork: '+str(p))
 state={'schemaVersion':1,'commit':commit,'files':records,'note':'Restore preserves sources and prepared art; inclusion does not grant visual approval.'}
 archive=out/'development-workspace.tar.gz'
 with tarfile.open(archive,'w:gz') as tar:
  for item in records: tar.add(root/item['path'],arcname=item['path'],recursive=False)
 state['archiveSha256']=sha(archive.read_bytes())
 (out/'development-snapshot.json').write_text(json.dumps(state,indent=2)+'\n')
 print(json.dumps({'commit':commit,'files':len(records),'archiveSha256':state['archiveSha256']}))

def restore(artifact,destination,expected_commit=None):
 dest=Path(destination).resolve()
 if dest.exists() and any(dest.iterdir()): raise ValueError('Restore destination must be empty')
 with zipfile.ZipFile(artifact) as z:
  names={Path(n).name:n for n in z.namelist() if not n.endswith('/')}
  state=json.loads(z.read(names['development-snapshot.json']))
  data=z.read(names['development-workspace.tar.gz'])
 if expected_commit and state['commit']!=expected_commit: raise ValueError('Unexpected snapshot commit')
 if sha(data)!=state['archiveSha256']: raise ValueError('Snapshot archive checksum mismatch')
 expected={f['path']:f for f in state['files']}
 with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as tar:
  members=tar.getmembers()
  if len(members)!=len(expected) or len({m.name for m in members})!=len(members): raise ValueError('Snapshot member count mismatch')
  for m in members:
   safe(m.name)
   if not m.isfile() or m.name not in expected: raise ValueError('Unexpected snapshot entry: '+m.name)
   data=tar.extractfile(m).read();item=expected[m.name]
   if len(data)!=item['bytes'] or sha(data)!=item['sha256']: raise ValueError('Snapshot file checksum mismatch: '+m.name)
  dest.mkdir(parents=True,exist_ok=True)
  tar.extractall(dest,filter='data')
 print(json.dumps({'restoredCommit':state['commit'],'verifiedFiles':len(expected),'destination':str(dest)}))

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);sub=p.add_subparsers(dest='command',required=True)
 c=sub.add_parser('create');c.add_argument('--root',default='.');c.add_argument('--output',required=True);c.add_argument('--commit',required=True)
 r=sub.add_parser('restore');r.add_argument('artifact');r.add_argument('destination');r.add_argument('--expected-commit')
 a=p.parse_args()
 if a.command=='create': create(a.root,a.output,a.commit)
 else: restore(a.artifact,a.destination,a.expected_commit)

