"""Variable-length Android version names must not corrupt binary XML offsets."""
import importlib.util,struct
from pathlib import Path
spec=importlib.util.spec_from_file_location('builder',Path(__file__).resolve().parents[1]/'scripts/build-update.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
strings=['before','0.89.1','uk.co.abyssals.game','after']
body=bytearray();offsets=[]
for text in strings:
 offsets.append(len(body));body+=struct.pack('<H',len(text))+text.encode('utf-16le')+b'\0\0'
start=28+4*len(strings);body+=bytes((-(start+len(body)))%4)
pool=struct.pack('<HHIIIIII',1,28,start+len(body),len(strings),0,0,start,0)+struct.pack('<4I',*offsets)+body
# Binary XML start-element with one integer versionCode attribute.
element=bytearray(56);struct.pack_into('<HHI',element,0,0x102,16,len(element));struct.pack_into('<HHH',element,24,20,20,1);element[51]=0x10;struct.pack_into('<I',element,52,100)
raw=struct.pack('<HHI',3,8,8+len(pool)+len(element))+pool+element
for version in ['0.90.1','0.90.11','0.90.1234']:
 result=m.manifest(raw,version,106);assert struct.unpack_from('<I',result,4)[0]==len(result)
 _,_,size=struct.unpack_from('<HHI',result,8);assert size%4==0
 decoded=[]
 for pos in struct.unpack_from('<4I',result,36):
  a=8+start+pos;n=struct.unpack_from('<H',result,a)[0];decoded.append(result[a+2:a+2+n*2].decode('utf-16le'))
 assert decoded==['before',version,'uk.co.abyssals.game','after']
 assert struct.unpack_from('<I',result,8+size+52)[0]==106
print('PASS: Android UTF-16 pool sizes, string offsets, package and versionCode for multi-digit patch versions')
