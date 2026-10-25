"""Package only the release's offline runtime inventory; no source archives or signing files."""
from pathlib import Path
import json,zipfile,hashlib
root=Path(__file__).resolve().parents[1];cfg=json.loads((root/'release-config.json').read_text());text=(root/'dist/offline-assets.js').read_text();paths=set(json.loads(text[text.index('['):text.rfind(']')+1]))|{'offline-assets.js'}
assert all(not Path(p).is_absolute() and '..' not in Path(p).parts for p in paths)
assert {'index.html','sw.js','manifest.webmanifest','evolution-renewal-data.js','assets/504.webp','assets/followers/504.webp'}<=paths
assert cfg['version'] in text
out=root/'build'/cfg['pwa_filename'];out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(paths):
  f=root/'dist'/p;assert f.is_file(),p;z.write(f,p)
with zipfile.ZipFile(out) as z:assert z.testzip() is None
out.with_name(out.name+'.sha256').write_text(hashlib.sha256(out.read_bytes()).hexdigest()+'  '+out.name+'\n');print('Built offline PWA:',out.name,'files:',len(paths))
