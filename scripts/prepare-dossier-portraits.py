from pathlib import Path
from PIL import Image
import zipfile,io,json,hashlib,math
import sys
R=Path(__file__).resolve().parents[1];C=json.loads((R/'dist/dossier-config.js').read_text().split('export const DOSSIER_CONFIG=')[1].rstrip(';\n'));dst=R/'dist/assets';dst.mkdir(exist_ok=True);arts={};receipts=[]
for p in Path(sys.argv[1]).glob('*.zip'):
 z=zipfile.ZipFile(p)
 for n in z.namelist():
  if n.endswith('.webp'):arts[n.split('/')[-1]]=(z.read(n),p.name,n)
for s in C['species']:
 old={'Brookisk':'Rillisk','Omenluna':'Oraculuna','Frillvolt':'Voltfrill'}.get(s['name'],s['name']);cand=[n for n in arts if n.lower().startswith(old.lower()+'_')]
 if old in ['Thimbril','Carrionyx']:
  n=next(n for n in arts if 'concept_sheet' in n.lower());b,p,entry=arts[n];im=Image.open(io.BytesIO(b)).convert('RGBA');rect=(18,412,119,499) if old=='Thimbril' else (806,402,1067,545);im=im.crop(rect)
  # Source-sheet extraction only: preserve creature pixels, remove connected dark
  # sheet matte. No regeneration, mirroring, added anatomy or repainting.
  px=im.load();w,h=im.size;seen=set();todo=[(x,y) for x in range(w) for y in [0,h-1]]+[(x,y) for y in range(h) for x in [0,w-1]]
  while todo:
   x,y=todo.pop()
   if (x,y) in seen or not(0<=x<w and 0<=y<h):continue
   seen.add((x,y));r,g,bb,a=px[x,y]
   if max(r,g,bb)>66 or r>g+5 or r>bb+3:continue
   px[x,y]=(r,g,bb,0);todo.extend([(x+1,y),(x-1,y),(x,y+1),(x,y-1)])
  bb=im.getbbox();im=im.crop(bb);canvas=Image.new('RGBA',(512,512));im.thumbnail((480,480),Image.Resampling.LANCZOS);canvas.alpha_composite(im,((512-im.width)//2,(512-im.height)//2));bio=io.BytesIO();canvas.save(bio,format='WEBP',lossless=True);b=bio.getvalue();derivation={'source_rect':rect,'method':'Connected sheet-matte extraction; source sprite rows; no redesign'}
 else:
  if len(cand)!=1:raise Exception((old,cand))
  n=cand[0];b,p,entry=arts[n];derivation={'method':'Exact approved WebP bytes'}
 (dst/(s['id']+'.webp')).write_bytes(b);receipts.append({'id':s['id'],'name':s['name'],'sourceArchive':p,'sourceEntry':entry,'sha256':hashlib.sha256(b).hexdigest(),**derivation})
(R/'art-library/dossiers/art-provenance.json').write_text(json.dumps(receipts,indent=2)+'\n')
# Register existing animated portrait follower support, preserving exact approved
# anatomy. No false claim that these are newly authored directional atlases.
# Family-coherent shiny profiles use the existing authored recolour schema.
print('Installed',len(receipts),'portraits; exact sources retained in Drive and provenance receipt.')
