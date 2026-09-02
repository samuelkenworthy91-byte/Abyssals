#!/usr/bin/env python3
from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
required=["AGENTS.md","CONTEXT.md","docs/canon/ACTIVE_CANON.md","data/canon/core_rules.json","data/canon/state_model.json"]
for rel in required:
    if not (ROOT/rel).exists(): errors.append(f"missing required file: {rel}")
for p in (ROOT/'data/canon').glob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f"invalid JSON {p.relative_to(ROOT)}: {e}")
area=ROOT/'data/canon/encounter_area_summary.json'
if area.exists():
    d=json.loads(area.read_text())
    if d.get('area_count') != len(d.get('areas',[])): errors.append('encounter area_count does not match rows')
    if d.get('table_count') != d.get('area_count',0)*2: errors.append('encounter table_count must be area_count*2')
if errors:
    print('VALIDATION FAILED')
    for e in errors: print('-',e)
    sys.exit(1)
print('VALIDATION OK')
