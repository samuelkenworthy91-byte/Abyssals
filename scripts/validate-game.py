"""Check that offline packaging includes every referenced local game module."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]/'dist';text=(root/'offline-assets.js').read_text();assets=set(json.loads(text[text.index('['):text.rfind(']')+1]))
missing=[name for name in assets if not (root/name).is_file()]
assert not missing,missing
for path in root.glob('*.js'):
 for name in re.findall(r'''(?:from\s*|import\s*)['"](\./[^'"?]+)''',path.read_text()):
  target=(path.parent/name).resolve();assert target.is_file(),(path.name,name)
  assert target.relative_to(root).as_posix() in assets,(path.name,name,'not available offline')
assert {'cossenne-farm.js','site-tablets.js'}<=assets
print('PASS:',len(assets),'offline assets and all local module imports')
