#!/usr/bin/env python3
"""Check complete source-to-data joins independently of the import writer."""
import argparse
import hashlib
import json
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'tools/data'))
from source_readers import document_blocks, workbook_rows

def reconcile(root=ROOT):
    errors=[];counts={}
    def read(p):return json.loads((root/p).read_text())
    def rows(p):return read(p)['records']
    def require(test,label):
        if not test:errors.append(label)
    active=root/'docs/source_archive/canon_sources/active'
    index=read('data/manifests/extracted_sources.json')['files']
    require(len(index)==35,'Expected all 35 extracted detailed sources')
    for entry in index:
        p=root/entry['source'];actual=read(entry['extracted'])
        require(actual['source_sha256']==hashlib.sha256(p.read_bytes()).hexdigest(),'Extracted source hash: '+entry['source'])
        key,value=('blocks',document_blocks(p)) if p.suffix=='.docx' else ('sheets',workbook_rows(p)) if p.suffix=='.xlsx' else ('text',p.read_text())
        require(actual[key]==value,'Lossless extraction differs: '+entry['source'])
    counts['detailed_sources']=len(index)
    sp=rows('data/species/species.json');byid={s['id']:s for s in sp};byname={s['name']:s for s in sp}
    require(len(sp)==187 and {s['dex_number'] for s in sp}==set(range(1,188)),'Species exactly 1..187')
    stats=workbook_rows(active/'Regional_Dex_Stats_and_Abilities_COMPLETE_v2.xlsx')['Full Dex']
    for r in stats:
        c=r['cells']
        if c and isinstance(c[0],int) and 1<=c[0]<=187:
            s=byid[f'{c[0]:03}']
            require(s['name']==c[1] and s['types']==[x.upper() for x in c[2:4] if x],f'Species identity {c[0]}')
            require(list(s['base_stats'].values())==c[10:16] and s['bst']==c[16],f'Species stats {c[0]}')
    counts['species']=len(sp)
    w=workbook_rows(active/'Regional_Dex_Progression_Learnsets_v3.xlsx')
    evolution=rows('data/evolutions/evolutions.json');be={e['path_number']:e for e in evolution}
    source_edges=[r for r in w['Evolution Paths'] if r['cells'] and isinstance(r['cells'][0],int)]
    require(len(evolution)==len(source_edges)==98,'Evolution count 98')
    for r in source_edges:
        c=r['cells'];e=be[c[0]]
        require((e['from_species_id'],e['to_species_id'],e['condition']['minimum_level'])==(f'{c[1]:03}',f'{c[3]:03}',c[6]),f'Evolution row {r["row"]}')
        require(e['promotion_delta']=={k:byid[e['to_species_id']]['base_stats'][k]-byid[e['from_species_id']]['base_stats'][k] for k in byid[e['from_species_id']]['base_stats']},f'Promotion {e["id"]}')
    counts['evolution_paths']=len(evolution)
    moves=rows('data/moves/moves.json');bm={m['id']:m for m in moves}
    require(set(bm)==set(range(1,355)) and len(moves)==354,'Move IDs exactly integer 1..354')
    for r in workbook_rows(active/'Pokemon_Fan_Game_354_Move_Catalogue.xlsx')['Moves'][1:]:
        c=r['cells'];m=bm[c[0]]
        require((m['name'],m['type_id'],m['pp'],m['power'],m['effect_text'])==(c[1],c[2].upper(),c[3],c[4] if isinstance(c[4],int) else None,c[5]),f'Move source {c[0]}')
        require(m['priority']==(1 if c[0] in [5,106] else 0),f'Locked priority whitelist {c[0]}')
        require(m['signature_owner_family']==(None if c[6]=='General' else byname[c[6]]['family_id']),f'Signature owner {c[0]}')
    counts['moves']=len(moves)
    learn=rows('data/moves/learnsets.json');bl={r['provenance']['row']:r for r in learn}
    source_learn=[r for r in w['Learnsets'] if r['cells'] and isinstance(r['cells'][0],int)]
    require(len(learn)==len(source_learn)==1893,'Learnset count 1893')
    require({r['species_id'] for r in learn}==set(byid),'All 187 species have learnsets')
    for row in source_learn:
        c=row['cells'];l=bl[row['row']];m=bm[l['move_id']]
        require((l['species_id'],l['level'],m['name'],m['type_id'])==(f'{c[0]:03}',c[2],c[3],c[4].upper()),f'Learnset source row {row["row"]}')
        require(m['signature_owner_family'] in [None,byid[l['species_id']]['family_id']],f'Signature leak {l["id"]}')
    counts['learnset_entries']=len(learn)
    encounter=rows('data/encounters/tables.json');slots={s['provenance']['row']:s for t in encounter for s in t['slots']}
    ew=workbook_rows(active/'ABYSSALS_CHECKLIST_02_DAY_NIGHT_ENCOUNTER_TABLES_LOCKED_v1.0.xlsx')
    require(len(encounter)==144 and len(slots)==864,'Encounter table/slot counts 144/864')
    for r in ew['Encounter Tables'][1:]:
        c=r['cells'];s=slots[r['row']]
        require((s['weight'],s['min_level'],s['max_level'])==(c[11],c[12],c[13]),f'Encounter values row {r["row"]}')
        if c[8]:require(s['species_id']==f'{c[8]:03}',f'Encounter species row {r["row"]}')
        else:
            expected={a:byname[b]['id'] for a,b in [s.split(' → ') for s in c[16].split('; ')]}
            require({case['equals']:case['species_id'] for case in s['resolver']['cases']}==expected,f'Opposite-branch resolver row {r["row"]}')
    counts.update(encounter_tables=len(encounter),encounter_slots=len(slots))
    trainers=rows('data/trainers/trainers.json')
    bt={t['id']:t for t in trainers}
    trainer_source=document_blocks(active/'ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx')
    for b in trainer_source:
        if b['kind']!='table' or b['body_index'] not in [*range(72,97,3),104,108,112]:continue
        for c in b['rows'][1:]:
            team_text=c[3] if b['body_index'] in [104,112] else c[4]
            expected=[(byname[name]['id'],int(level)) for name,level in [part.rsplit('@',1) for part in team_text.split('; ')]]
            require([(s['species_id'],s['level']) for s in bt[c[0]]['team']]==expected,'Exact trainer source team '+c[0])
    incoming={e['to_species_id']:e['condition']['minimum_level'] for e in evolution}
    for t in trainers:
        for s in t['team']:
            require(s['level']>=incoming.get(s['species_id'],1),f'Under-level evolved trainer slot {t["id"]}/{s["slot"]}')
            require(set(s['current_form_legal_move_ids'])=={l['move_id'] for l in learn if l['species_id']==s['species_id'] and l['level']<=s['level'] and not l['unresolved_fields']},f'Trainer legal pool {t["id"]}/{s["slot"]}')
    counts.update(trainer_rosters=len(trainers),trainer_team_slots=sum(len(t['team']) for t in trainers))
    item_by_id={i['id']:i for i in rows('data/items/items.json')}
    for shop in rows('data/shops/shops.json'):
        for stock in shop['inventory']:
            item=item_by_id[stock['item_id']]
            require(stock['price']==item['buy_price'] and shop['currency']==item['currency'],'Shop price/currency mismatch '+shop['id']+'/'+item['id'])
    core=read('data/progression/core_rules.json')
    require('hp_baseline_per_level' not in core['growth'] and core['growth']['failed_roll_increment']==0 and core['growth']['hp_per_success']==10,'Growth C16 reconciliation')
    require(core['human_restoration']['total_uses']==5 and core['human_restoration']['pate_trade_optional'],'Elective restoration lock')
    require(core['starter_lives']['memorial_resurrection_lives']==1,'Starter memorial life lock')
    pm=read('data/manifests/portraits.json');am=read('data/manifests/abyssal_art.json')
    counts.update(runtime_monsters=sum(bool(a['runtime_filename']) for a in am['records']),
        runtime_portraits=sum(bool(a['runtime_filename']) for a in pm['records']),missing_portrait_targets=len(pm['missing_targets']))
    require(counts['runtime_monsters']==187 and counts['runtime_portraits']==79 and counts['missing_portrait_targets']==22,'Accepted art coverage changed')
    return errors,counts

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--json-report',type=Path);args=ap.parse_args()
    try:errors,counts=reconcile()
    except Exception as e:errors,counts=['Source reconciliation failed closed: '+str(e)],{}
    report={'passed':not errors,'errors':errors,'counts':counts}
    if args.json_report:args.json_report.parent.mkdir(exist_ok=True,parents=True);args.json_report.write_text(json.dumps(report,indent=2)+'\n')
    print(('PASS' if not errors else 'FAIL')+' — full source reconciliation; '+str(len(errors))+' errors')
    for e in errors:print('- '+e)
    print(json.dumps(counts,sort_keys=True))
    return bool(errors)
if __name__=='__main__':sys.exit(main())
