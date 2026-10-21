"""Deterministic update packaging. Native wrapper stays compatible with v0.89.1.

All entries use ZIP_STORED, fixed timestamps, permissions and four-byte alignment.
This permits the signed block produced privately by Android's apksigner to be
reattached on GitHub without exposing the keystore. Hashes pin the exact payload.
"""
from pathlib import Path
import argparse,zipfile,struct,hashlib,re

def manifest(raw,version,version_code):
 d=bytearray(raw);off=8;renamed=0
 # Rebuild the UTF-16 string-pool entry, including its length and all later
 # offsets. Patch versions may contain more than one digit.
 while off<len(d):
  kind,head,size=struct.unpack_from('<HHI',d,off)
  if kind==1:
   count,styles,flags,start,style_start=struct.unpack_from('<IIIII',d,off+8)
   assert not flags&0x100 and styles==0,'Expected the pinned wrapper UTF-16 pool'
   offsets=list(struct.unpack_from('<'+'I'*count,d,off+head))
   for i,pos in enumerate(offsets):
    a=off+start+pos;n=struct.unpack_from('<H',d,a)[0];assert n<0x8000
    if d[a+2:a+2+n*2].decode('utf-16le')!='0.89.1':continue
    encoded=version.encode('utf-16le');replacement=struct.pack('<H',len(encoded)//2)+encoded+b'\0\0'
    old_size=2+n*2+2;delta=len(replacement)-old_size
    pool=bytearray(d[off:off+size]);local=a-off
    pool[local:local+old_size]=replacement
    padding=(-len(pool))%4;pool.extend(bytes(padding))
    for j,p in enumerate(offsets):
     struct.pack_into('<I',pool,head+j*4,p+(delta if p>pos else 0))
    struct.pack_into('<I',pool,4,len(pool));d[off:off+size]=pool
    struct.pack_into('<I',d,4,len(d));size=len(pool);renamed+=1
    break
  off+=size
 assert renamed==1
 off=8;changed=0
 while off<len(d):
  kind,head,size=struct.unpack_from('<HHI',d,off)
  if kind==0x102:
   start,stride,count=struct.unpack_from('<HHH',d,off+24)
   for i in range(count):
    a=off+16+start+i*stride
    if d[a+15]==0x10 and struct.unpack_from('<I',d,a+16)[0]==100:struct.pack_into('<I',d,a+16,version_code);changed+=1
  off+=size
 assert changed==1
 assert 'uk.co.abyssals.game'.encode('utf-16le') in d
 return d

def write_entry(out,name,data):
 z=zipfile.ZipInfo(name,(2000,1,1,0,0,0));z.compress_type=zipfile.ZIP_STORED;z.create_system=3;z.external_attr=0o100644<<16
 offset=out.fp.tell()+30+len(name.encode('utf-8'));pad=(-offset-4)%4;z.extra=struct.pack('<HH',0xd935,pad)+bytes(pad)
 out.writestr(z,data)

def build(base,dist,dest,version,version_code):
 assert re.fullmatch(r'0\.\d{2}\.\d+',version) and version_code>100
 assert hashlib.sha256(base.read_bytes()).hexdigest()=='5d1a90da4a821309be885aad936761c1a335e4f7c56e255ecc28495e01622ee2','Wrong native base APK'
 dest.parent.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(base) as old,zipfile.ZipFile(dest,'w') as out:
  for n in sorted(old.namelist()):
   if n.endswith('/') or n.startswith(('META-INF/','assets/game/')):continue
   data=old.read(n);write_entry(out,n,manifest(data,version,version_code) if n=='AndroidManifest.xml' else data)
  for f in sorted(dist.rglob('*')):
   rel=f.relative_to(dist)
   if f.is_file() and f.name!='package.json' and not any(p.startswith('.') for p in rel.parts):write_entry(out,'assets/game/'+rel.as_posix(),f.read_bytes())
 print('Rebuilt update payload:',dest,hashlib.sha256(dest.read_bytes()).hexdigest())
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--base',type=Path,required=True);p.add_argument('--dist',type=Path,default=Path('dist'));p.add_argument('--output',type=Path,default=Path('build/unsigned-0.89.2.apk'));p.add_argument('--version',default='0.89.2');p.add_argument('--version-code',type=int,default=101);a=p.parse_args();build(a.base,a.dist,a.output,a.version,a.version_code)
