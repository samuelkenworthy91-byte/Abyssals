"""Decode active environment backgrounds; connectivity and visual approval are separate."""
import json
from pathlib import Path
from PIL import Image
report=json.loads(Path('docs/finale-environment-qa.json').read_text())
seen=set()
for m in report['maps']:
 p=Path(m['source'])
 if p in seen:continue
 seen.add(p)
 assert p.stat().st_size>0,p
 if p.suffix=='.webp':
  with Image.open(p) as im:
   assert im.width>=640 and im.height>=400,p
   im.verify()
 else:assert '<svg' in p.read_text(),p
print(f'PASS: {len(seen)} active authored environment backgrounds decode; visual approval is tracked separately')
