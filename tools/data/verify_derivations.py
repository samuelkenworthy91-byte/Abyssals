#!/usr/bin/env python3
"""Compare current extracted records with the pristine supplied source summaries.

This detects accidental value changes in import conversion. Additional sources
must receive explicit precedence mappings; never rewrite originals to pass.
"""
from pathlib import Path
import csv,json,sys
ROOT=Path(__file__).resolve().parents[2]
def check(root=ROOT):
    source=root/'docs/source_archive/handoff_v1/data/canon'
    def read(p):return json.loads(p.read_text())
    errors=[]
    original=read(source/'encounter_area_summary.json')['areas']
    actual={a['id']:a for a in read(root/'data/encounters/areas.json')['records']}
    for a in original:
        if a['area_id'] not in actual:errors.append('Missing source area '+a['area_id']);continue
        for k,value in a.items():
            if k!='area_id' and actual[a['area_id']].get(k)!=value:errors.append('Changed source area value '+a['area_id']+'.'+k)
    chars={c['id']:c for c in read(root/'data/characters/characters.json')['records']}
    for c in read(source/'characters.json'):
        if not all(chars.get(c['id'],{}).get(k)==v for k,v in c.items()):errors.append('Changed handoff identity '+c['id'])
    targets=list(csv.DictReader((root/'docs/source_archive/portrait_package/documentation/TARGET_STATUS_100.csv').open(encoding='utf-8-sig')))
    for t in targets:
        id_=t['id_or_packaging_label']
        if not id_.startswith('CORE-') and chars.get(id_,{}).get('name')!=t['name']:errors.append('Changed portrait queue identity '+id_)
    if read(source/'learnset_rules.json')!=read(root/'data/progression/learnset_rules.json'):errors.append('Changed learnset rules')
    if read(source/'state_model.json')!=read(root/'data/story/state_model.json'):errors.append('Changed state model')
    print('SOURCE DERIVATIONS '+('PASS' if not errors else 'FAIL'))
    for e in errors:print('- '+e)
    return errors
if __name__=='__main__':sys.exit(bool(check()))
