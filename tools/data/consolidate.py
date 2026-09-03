#!/usr/bin/env python3
"""Reproducible, source-only preparation. Never generates gameplay or edits source art.

Canonical source rows retain OOXML coordinates. Technical IDs are deterministic
encodings, not new content. Ambiguous mechanics remain explicit blockers.
"""
import collections
import hashlib
import json
import math
import re
from pathlib import Path
from source_readers import document_blocks, workbook_rows

ROOT = Path(__file__).resolve().parents[2]
ACTIVE = ROOT / 'docs/source_archive/canon_sources/active'
STATS = ['hp', 'attack', 'defence', 'sp_attack', 'sp_defence', 'speed']
REGISTRY = {}

def read(rel):
    return json.loads((ROOT / rel).read_text())

def write(rel, value):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')

def source(pattern):
    files = list(ACTIVE.glob(pattern))
    assert len(files) == 1, (pattern, files)
    return files[0]

def rel(p):
    return str(p.relative_to(ROOT))

def slug(s):
    return re.sub('[^A-Z0-9]+', '_', s.upper().replace('’', "'")).strip('_')

def provenance(p, **where):
    return {'file': rel(p), **where}

def book(pattern):
    p = source(pattern)
    return p, workbook_rows(p)

def doc(pattern):
    p = source(pattern)
    return p, document_blocks(p)

def table(blocks, index):
    return next(b['rows'] for b in blocks if b['body_index'] == index)

def numeric(rows):
    return [r for r in rows if r['cells'] and isinstance(r['cells'][0], int)]

def dataset(path, rows, sources, unresolved=(), schema='record', **extra):
    status = 'partial' if unresolved else 'complete_for_supplied_source'
    write(path, {'schema_version': 1, 'status': status,
        'sources': sorted(set(rel(s) if isinstance(s, Path) else s for s in sources)),
        'records': rows, 'unresolved': list(unresolved), **extra})
    REGISTRY[path] = {'path': path, 'schema': 'data/schemas/dataset.schema.json',
        'status': status, 'record_count': len(rows), 'record_schema': f'data/schemas/{schema}.schema.json'}

def table_records(p, blocks, index, prefix):
    rows = table(blocks, index)
    return [{'id': prefix + str(i).zfill(3),
             'fields': dict(zip(rows[0], row)),
             'provenance': provenance(p, body_index=index, table_row=i + 1)}
            for i, row in enumerate(rows[1:], 1)]

def main():
    # Searchable, lossless evidence. It is NOT a second authority or runtime dataset.
    evidence = []
    for p in sorted([*ACTIVE.iterdir(),*(ACTIVE.parent/'superseded').iterdir()]):
        if p.suffix == '.docx': payload = {'blocks': document_blocks(p)}
        elif p.suffix == '.xlsx': payload = {'sheets': workbook_rows(p)}
        else: payload = {'text': p.read_text()}
        out = 'data/reference/' + p.stem + '.json'
        write(out, {'source': rel(p), 'source_sha256': hashlib.sha256(p.read_bytes()).hexdigest(),
                    'authority': 'NON-AUTHORITATIVE superseded history' if p.parent.name=='superseded' else 'Evidence only; apply docs/canon/SUPERSESSIONS.md before use.', **payload})
        evidence.append({'source': rel(p), 'extracted': out})
    write('data/manifests/extracted_sources.json', {'schema_version': 1, 'files': evidence})

    sp = read('data/species/species.json')['records']
    by_name = {s['name']: s for s in sp}
    by_id = {s['id']: s for s in sp}
    species_id = lambda name: by_name[name]['id']
    pp, pw = book('Regional_Dex_Progression_Learnsets_v3.xlsx')
    gp, gw = book('Regional_Dex_Growth_and_Evolution_VALIDATED_v4.xlsx')
    statp, statw = book('Regional_Dex_Stats_and_Abilities_COMPLETE_v2.xlsx')
    ep, eb = doc('ABYSSALS_EVOLUTION_IMPLEMENTATION_ADDENDUM*')
    cp, cb = doc('ABYSSALS_CHECKLIST_06_*')
    tp, tb = doc('ABYSSALS_CHECKLIST_04_*')
    fp, fb = doc('ABYSSALS_CHECKLIST_05_*')
    mp, mw = book('Pokemon_Fan_Game_354_Move_Catalogue.xlsx')
    lp, lb = doc('ABYSSALS_CHECKLIST_12_*')

    families = {}
    for r in numeric(pw['Dex Progression']):
        c = r['cells']; s = by_id[f'{c[0]:03}']
        members = c[4].split(' / ')
        fid = 'FAMILY-' + species_id(members[0])
        s.update(family_id=fid, stage=c[5], progression_provenance=provenance(pp, sheet='Dex Progression', row=r['row']))
        families[fid] = {'id': fid, 'name': c[4], 'member_species_ids': [species_id(n) for n in members]}
    dataset('data/evolutions/families.json', list(families.values()), [pp])
    for r in numeric(gw['Full Dex + Growth']):
        c=r['cells'];s=by_id[f'{c[0]:03}']; percentages={}
        for i,k in enumerate(STATS):
            value=max(10, math.floor((32 + .06*(s['bst']-300))*(s['base_stats'][k]/(s['bst']/6))**2.25 + .5))
            assert value==c[11+i], (s['id'],k,value,c[11+i])
            percentages[k]=value
        s['growth_percent']=percentages
        s['growth_provenance']=provenance(gp,sheet='Full Dex + Growth',row=r['row'])
    abilities=[]
    for r in statw['Ability Glossary']:
        c=r['cells']
        if len(c)>2 and c[0] and c[1] in ['Regular','Hidden','Standard','Signature','Normal']:
            pass  # Header-independent filter below uses actual species ability names.
        names={n for s in sp for n in s['ability_names'].values() if n}
        if c and c[0] in names:
            abilities.append({'id':'ABILITY_'+slug(c[0]),'name':c[0],'class':c[1],
                'effect_text':c[2],'species_usage_text':c[3], 'hidden_users_text':c[4],
                'design_intent':c[5], 'provenance':provenance(statp,sheet='Ability Glossary',row=r['row'])})
    aid={a['name']:a['id'] for a in abilities}
    for s in sp:s['abilities']={k:aid[n] for k,n in s['ability_names'].items() if n}
    from consolidate_abilities import enrich
    enrich(abilities)
    dataset('data/species/abilities.json',abilities,[statp],
        [f"{a['id']}: {issue}" for a in abilities for issue in a['unresolved_fields']] +
        ['Move contact/sound tags and generic weather/hazard/screen/berry contracts are not fully enumerated by the supplied catalogue. Preserve these authored ability dependencies; do not invent Berry items or copy conventional battle defaults.'])
    dataset('data/species/species.json',sp,[statp,pp,gp],
        ['capture_rate: no per-species numeric catch-rate table appears in the 35 detailed references or original handoff. Supply an approved 187-row catch-rate table; do not derive rates from BST or rarity.'],schema='species')

    # Item IDs named by Checklist 06 win; evolution IDs are technical name encodings.
    items=[]
    def item(id_,name,category,price,effect,payload,index,row,**kw):
        items.append({'id':id_,'name':name,'category':category,'buy_price':price,
            'currency':'STANDARD','stack_limit':99 if category in ['held','evolution'] else 999,
            'effect_text':effect,'effect':payload,'provenance':provenance(cp,body_index=index,table_row=row),**kw})
    for index,category in [(24,'healing'),(29,'status_cure'),(31,'pp'),(33,'battle_stat')]:
        for i,c in enumerate(table(cb,index)[1:],2):
            price=int(c[3].replace(',',''));payload={}
            if category=='healing':payload={'operation':'restore_hp','amount': 'ALL' if 'all HP' in c[2] else int(re.search(r'\d+',c[2])[0]),'living_only':True}
            if category=='status_cure':payload={'operation':'cure_status','status':c[2].removeprefix('Cure ').rstrip('.').upper() if i<7 else 'ANY_PERSISTENT'}
            if category=='pp':payload={'operation':'restore_pp','amount':'ALL' if 'Fully' in c[2] else 10,'scope':'ALL_MOVES' if 'every' in c[2] or 'all moves' in c[2] else 'ONE_MOVE'}
            if category=='battle_stat':payload={'operation':'stat_stage','stat':STATS[i-1], 'stages':1} if i<4 else {'operation':'stat_stage','stat':{4:'sp_attack',5:'sp_defence',6:'speed'}[i],'stages':1}
            item(c[0],c[1],category,price,c[2],payload,index,i)
    item('ITEM_UTILITY_SMOKE_BOMB','Smoke Bomb','utility',400,'Guarantees escape only from escapable ordinary wild encounters.',{'operation':'escape','requires':'ordinary_wild_and_escape_allowed'},37,1)
    food_functions=[{'kind':'constant','value':1},{'kind':'constant','value':1.5},{'kind':'constant','value':2},{'kind':'guaranteed'},
        {'kind':'target_type','types':['WATER','BUG'],'match':3,'otherwise':1},
        {'kind':'previously_caught_species','match':3,'otherwise':1},
        {'kind':'turns','expression':'min((turns+10)/10,4)'}, {'kind':'target_level','expression':'max((40-level)/10,1)'}]
    for i,c in enumerate(table(cb,42)[1:]):
        item(c[0],c[1],'capture_food',None if c[4]=='Not sold' else int(c[4].replace(',','')),c[2]+'; '+c[3],food_functions[i],42,i+2,first_stock=c[5])
    for i,c in enumerate(table(cb,51)[1:],2):
        a,b=c[1].split(' → ')
        item('ITEM_EVOLUTION_'+slug(c[0]),c[0],'evolution',None if c[5]=='Not routine stock' else int(c[5].replace(',','')),
             c[1],{'operation':'evolve','from_species_id':species_id(a),'to_species_id':species_id(b),'minimum_level':int(c[2]),'consumed':True},51,i,
             guaranteed_source=c[3],renewable_source=c[4])
    types=read('data/types/types.json')['records']
    dataset('data/types/types.json',types,[mp,source('ABYSSALS_CHECKLIST_09_*v1.2*')],
        ['All 18 canonical type identities are recovered. The source package names a Gen III-style battle foundation but does not supply an explicit 18x18 effectiveness matrix (including Fairy) or a versioned import contract. Supply/approve that exact matrix; do not assume a conventional generation.'],schema='type')
    for i,c in enumerate(table(cb,58)[1:],2):
        if i==2:
            for t in types:item('HELD_TYPE_SIGIL_'+t['id'],t['name']+' Type Sigil','held',1200,c[3],{'operation':'damage_multiplier','type_id':t['id'],'multiplier':1.1},58,i,held_role='OFFENSE')
        else:
            payload={'HELD_IRON_MANTLE':{'operation':'effective_stat','stat':'defence','multiplier':1.1},'HELD_VEIL_CHARM':{'operation':'effective_stat','stat':'sp_defence','multiplier':1.1},'HELD_COURIERS_SPUR':{'operation':'effective_stat','stat':'speed','multiplier':1.1},'HELD_VOTIVE_THREAD':{'operation':'status_accuracy','add_points':10,'cap':100},'HELD_PILGRIM_CUP':{'operation':'end_turn_heal','max_hp_fraction':[1,16],'living_only':True},'HELD_FIELDGLASS':{'operation':'damage_multiplier','multiplier':1.1,'requires':'non_neutral_field'}}[c[2]]
            item(c[2],c[1],'held',int(c[4].replace(',','')),c[3],payload,58,i,held_role=c[0])
    for i,c in enumerate(table(cb,88)[1:]):
        for j,t in enumerate(table(cb,89)[1:],1):
            item(c[4]+'_'+t[0],c[1]+' '+t[0],'growth_training',2*j,c[3],{'operation':'growth_training','stat':STATS[i],'modifier_points':20,'remaining_levels':j},88,i+2,duration_provenance=provenance(cp,body_index=89,table_row=j+1))
            items[-1]['currency']='CURRENCY_TRIAL_MARK'
    for i,c in enumerate(table(cb,113)[1:],2):
        item(c[0],c[1],'treasure',None,'Sell-only treasure',{'operation':'sell','value':int(c[2].replace(',',''))},113,i,sell_price=int(c[2].replace(',','')))
    dataset('data/items/items.json',items,[cp],schema='item')
    item_by_name={i['name'].replace('’',"'"):i['id'] for i in items}

    # All 98 paths, checked against the higher timing-validation workbook.
    timing={r['cells'][0]:r for r in numeric(gw['Evolution Validation'])}
    story_bindings={c[5]:c for c in table(eb,20)[1:]}
    worlds={c[2].split('_')[0].capitalize():c for c in table(eb,17)[1:]}
    evolutions=[]
    for r in numeric(pw['Evolution Paths']):
        c=r['cells'];v=timing[c[0]];assert c[6]==v['cells'][17]
        condition={'method':c[5].replace(' ','_'),'minimum_level':c[6]}
        if c[7]:condition.update(item_id=item_by_name[c[7]],consumed=True)
        if c[5]=='STORY CHOICE':
            b=story_bindings[c[4]];w=worlds[c[2]]
            assert c[8]==b[4]
            condition.update(state_field=w[2],equals=b[2],world_event_id=w[0],history_trigger=b[3],legacy_derived_flag=b[4])
        a=by_id[f'{c[1]:03}'];b=by_id[f'{c[3]:03}']
        evolutions.append({'id':f'EVOLUTION-{c[0]:03}','path_number':c[0],'from_species_id':a['id'],'to_species_id':b['id'],
            'condition':condition,'promotion_delta':{k:b['base_stats'][k]-a['base_stats'][k] for k in STATS},
            'timing_verdict':v['cells'][18],'provenance':provenance(pp,sheet='Evolution Paths',row=r['row']),
            'timing_provenance':provenance(gp,sheet='Evolution Validation',row=v['row'])})
    dataset('data/evolutions/evolutions.json',evolutions,[pp,gp,ep,cp],schema='evolution')

    # Move/category/effect authoring is handled in a separate explicit conversion.
    from consolidate_moves import build_moves
    moves=build_moves(ROOT,mp,mw,lp,sp)
    dataset('data/moves/moves.json',moves,[mp,lp,source('Pokemon_Fan_Game_AI_VFX*')],
        [f"move {m['id']} ({m['name']}): {', '.join(m['unresolved_fields'])}" for m in moves if m['unresolved_fields']],schema='move')
    move_by_name={m['name']:m for m in moves}
    learnsets=[];learn_unresolved=[]
    for r in numeric(pw['Learnsets']):
        c=r['cells'];m=move_by_name[c[3]];s=by_id[f'{c[0]:03}'];issues=[]
        assert c[4].upper()==m['type_id']
        if m['signature_owner_family'] and s['family_id']!=m['signature_owner_family']:
            issues.append('signature_owned_by_other_family')
        rec={'id':f'LEARN-{c[0]:03}-{r["row"]:04}','species_id':s['id'],'move_id':m['id'],'level':c[2],
             'method':c[5].upper().replace(' ','_'),'implementation_note':c[6],'unresolved_fields':issues,
             'provenance':provenance(pp,sheet='Learnsets',row=r['row'])}
        learnsets.append(rec)
        if issues:learn_unresolved.append(f'{rec["id"]}: {s["name"]} -> {m["name"]}; Checklist 12 signature-family exclusivity conflict. Preserve source row; approved replacement required before use.')
    assert len(learnsets)==1893
    dataset('data/moves/learnsets.json',learnsets,[pp,lp,mp],learn_unresolved,schema='learnset')

    # Six weighted entries per table, including explicit opposite-branch resolvers.
    ap,aw=book('ABYSSALS_CHECKLIST_02_DAY_NIGHT*')
    tables=read('data/encounters/tables.json')['records'];bt={t['id']:t for t in tables}
    for t in tables:t.update(slots=[],status='complete')
    for r in aw['Encounter Tables'][1:]:
        c=r['cells'];slot={'species_id':f'{c[8]:03}' if c[8] else None,'weight':c[11],'min_level':c[12],'max_level':c[13],
            'rarity':c[14],'condition_text':c[15],'provenance':provenance(ap,sheet='Encounter Tables',row=r['row'])}
        if c[10]=='Resolver':
            family=c[9].split()[1];slot['resolver']={'state_field':worlds[family][2],
                'cases':[{'equals:a':None}]}
            slot['resolver']['cases']=[{'equals':a,'species_id':species_id(b)} for a,b in [s.split(' → ') for s in c[16].split('; ')]]
            slot['resolver']['unresolved_choice']='flag_invalid_state_for_review'
        bt[c[0]]['slots'].append(slot)
    dataset('data/encounters/tables.json',tables,[ap,ep],schema='encounter')
    special=[]
    rows=aw['Special Non-Random'];headers=rows[0]['cells']
    for r in rows[1:]:
        c=r['cells']
        if c[0]=='POSTGAME RESOLVER TOKEN':break
        if not c[0]:continue
        record={'id':'ACQUISITION-'+(f'{c[0]:03}' if isinstance(c[0],int) else c[0]),
            'name':c[1],'acquisition_class':c[2],'acquisition_text':c[3],'rule_text':c[4],
            'provenance':provenance(ap,sheet='Special Non-Random',row=r['row'])}
        if isinstance(c[0],int):record['species_id']=f'{c[0]:03}'
        else:
            family=c[1].split()[1]
            record['resolver']={'state_field':worlds[family][2],
                'cases':[{'equals':a,'species_id':species_id(b)} for a,b in [s.split(' → ') for s in c[4].split('; ')]]}
        special.append(record)
    dataset('data/encounters/acquisition.json',special,[ap])
    coverage=[]
    for r in aw['Species Coverage'][1:]:
        c=r['cells'];coverage.append({'id':f'AVAILABILITY-{c[0]:03}','species_id':f'{c[0]:03}',
            'acquisition_mode':c[2],'first_access_text':c[3],'implementation_note':c[4],
            'provenance':provenance(ap,sheet='Species Coverage',row=r['row'])})
    dataset('data/encounters/species_availability.json',coverage,[ap])

    fields=[]
    names=[r[2] for r in table(fb,27)[1:]]
    for i,c in enumerate(table(fb,151)[1:]):
        effects=[]
        for bit in c[1].split('; '):
            if bit.startswith('damage_mult:'):
                typ,mult=bit.split(':')[1].split('=');effects.append({'operation':'damage_multiplier','type_id':typ,'multiplier':float(mult)})
            elif bit.startswith('chip='):effects.append({'operation':'end_turn_damage','max_hp_fraction':[1,16]})
            elif bit.startswith('chip_immune='):effects[-1]['immune_types']=bit.split('=')[1].split('|')
            else:
                key,typval=bit.split(':');typ,mult=typval.split('=');effects.append({'operation':'effective_stat','stat':'sp_defence' if key.startswith('spdef') else 'defence','type_id':typ,'multiplier':float(mult)})
        fields.append({'id':c[0],'name':names[i],'warden_id':c[2],'effects':effects,'symmetric':True,
            'native_persistent':True,'replacement':'dormant_until_temporary_expires_or_clears',
            'provenance':provenance(fp,body_index=151,table_row=i+2)})
    dataset('data/terrain/fields.json',fields,[fp],schema='field')

    # Contracts preserve qualitative AI rules; no undocumented scoring constants.
    for index,path,prefix in [(24,'data/trainers/ai_tiers.json','AI-'),(51,'data/trainers/profiles.json','PROFILE-'),
                              (65,'data/progression/chapter_bands.json','BAND-'),(121,'data/battles/modes.json','MODE-')]:
        records=table_records(tp,tb,index,prefix)
        for r in records:r['id']=prefix+slug(next(iter(r['fields'].values())))
        dataset(path,records,[tp])
    classes=read('data/trainer_classes/classes.json')['records']
    for r,c in zip(classes,table(tb,21)[1:]):
        r.update(default_ai=c[2],species_preference=c[3],moveset_identity=c[4],class_family=c[0])
    dataset('data/trainer_classes/classes.json',classes,[tp],schema='trainer_class')
    def team(text):
        out=[]
        for term in text.split('; '):
            n,lev=term.rsplit('@',1);out.append({'species_id':species_id(n),'level':int(lev)})
        return out
    trainers=[]
    for index in range(72,97,3):
        for j,c in enumerate(table(tb,index)[1:],2):
            cls,ai,role=c[3].split(' • ')
            trainers.append({'id':c[0],'character_id':c[0],'name':c[2],'trainer_class_id':'CLASS-'+slug(cls),
                'ai_tier':ai,'role':role,'location_text':c[1],'team':team(c[4]),'loadout_contract':c[5],
                'status':'team_and_contract_recovered','provenance':provenance(tp,body_index=index,table_row=j)})
    for index in [104,108,112]:
        for j,c in enumerate(table(tb,index)[1:],2):
            is_named=index==104;is_warden=index==112
            cid='CHR-'+c[0].split('-')[1] if is_named else c[0]
            rec={'id':c[0],'character_id':cid,'name':c[1],'trainer_class_id':None,
                 'ai_tier':'Warden' if is_warden else ('Leader' if not is_named else ('Severin' if cid=='CHR-SEVERIN' else 'Advanced' if cid=='CHR-AERIC' else 'Leader')),
                 'team':team(c[3] if is_named or is_warden else c[4]),'source_contract':dict(zip(table(tb,index)[0],c)),
                 'status':'team_and_contract_recovered',
                 'provenance':provenance(tp,body_index=index,table_row=j)}
            if is_warden:rec['field_id']=fields[j-2]['id']
            trainers.append(rec)
    from consolidate_trainers import enrich as enrich_trainers
    enrich_trainers(trainers,sp,moves,learnsets)
    dataset('data/trainers/trainers.json',trainers,[tp,lp,cp],
        ['All 95 fixed rosters and current-form legal move pools are recovered. Final four-move loadouts require unresolved move metadata plus a documented deterministic implementation of Checklist 04 qualitative profiles; numeric profile scores are not authored in the sources. Leader-lite tier switch/knowledge inheritance is not explicitly assigned in the seven-tier table.']+
        [f"{t['id']}: {issue}" for t in trainers for issue in t['unresolved_fields']],schema='trainer')
    dataset('data/trainers/companion_checkpoints.json',table_records(tp,tb,101,'COMPANION-'),[tp])
    from consolidate_world import build_world
    build_world(globals(),locals())

    # Registry is derived; existing unchanged datasets are preserved.
    registry=read('data/manifests/datasets.json')['datasets']
    merged={r['path']:r for r in registry};merged.update(REGISTRY)
    write('data/manifests/datasets.json',{'schema_version':1,'datasets':list(merged.values())})
    blockers=[{'dataset':path,'classification':'PARTIAL','record_count':r['record_count'],
        'unresolved':read(path)['unresolved']} for path,r in merged.items() if r['status']=='partial']
    write('data/manifests/readiness_blockers.json',{'schema_version':1,'dataset_blockers':blockers,
        'genuinely_missing_fields':[
            {'field':'species.capture_rate','required_source':'Approved 187-species numeric catch-rate table. No such values occur in the supplied complete references.'},
            {'field':'types.effectiveness','required_source':'Approved 18x18 interaction table, including Fairy, or exact versioned rule import.'},
            {'field':'xp.participant_level_gap_formula','required_source':'Exact level-gap XP amount/formula, rounding and any participation adjustment. Sources specify 100 XP per level and per-participant comparison only.'},
            {'field':'battle.core_numeric_contract','required_source':'Exact versioned damage, critical-hit, status-duration, accuracy/evasion and capture/shake integer contracts, plus level-1 instance initialization. Gen III-style alone does not resolve all custom-18-type and growth-model bindings.'}],
        'missing_portrait_ids':[r['id'] for r in read('data/manifests/portraits.json')['missing_targets']],
        'engineering_work_not_missing_canon':['Choose and version deterministic PRNG/hash/serialization implementations within the locked save/growth contracts.',
            'Implement qualitative trainer-profile scoring transparently; do not present chosen implementation weights as source-authored canon.',
            'Author map geometry and scene trigger placement within the locked world graph.',
            'Implement the game incrementally only after the owner releases the M1 hold.']})
    sr=[]
    old={r['path']:r['schema'] for r in read('data/manifests/schema_registry.json')['files']}
    for p in sorted((ROOT/'data').rglob('*.json')):
        path=rel(p)
        if path.startswith('data/schemas/'):continue
        schema=merged[path]['schema'] if path in merged else old.get(path,'data/schemas/metadata.schema.json')
        sr.append({'path':path,'schema':schema})
    write('data/manifests/schema_registry.json',{'schema_version':1,'files':sr})

if __name__=='__main__':main()
