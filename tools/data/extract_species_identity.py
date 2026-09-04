#!/usr/bin/env python3
"""Extract source-backed species identities and map reviewed family artwork; no game logic."""
import json,hashlib,collections
from pathlib import Path
from source_readers import workbook_rows
ROOT=Path(__file__).resolve().parents[2]
SOURCE='docs/source_archive/canon_sources/active/'
STATS=SOURCE+'Regional_Dex_Stats_and_Abilities_COMPLETE_v2.xlsx'
PROGRESSION=SOURCE+'Regional_Dex_Progression_Learnsets_v3.xlsx'

def write(path,value):
    (ROOT/path).write_text(json.dumps(value,indent=2,ensure_ascii=False)+'\n')

def extract():
    raw=[r for r in workbook_rows(ROOT/STATS)['Full Dex'] if r['cells'] and isinstance(r['cells'][0],int)]
    species=[]
    for source in raw:
        c=source['cells'];stats=dict(zip(['hp','attack','defence','sp_attack','sp_defence','speed'],c[10:16]))
        assert sum(stats.values())==c[17],(c[1],'BST mismatch')
        species.append({'id':f'{c[0]:03}','dex_number':c[0],'name':c[1],'types':[v.upper() for v in c[2:4] if v],
            'base_stats':stats,'bst':sum(stats.values()),'ability_names':{'primary':c[7],'secondary':c[8],'hidden':c[9]},
            'role':c[4],'power_class':c[5],'capture_rate':None,'unresolved_fields':['capture_rate'],
            'provenance':{'file':STATS,'sheet':'Full Dex','row':source['row']}})
    assert [s['dex_number'] for s in species]==list(range(1,188))
    bynum={s['dex_number']:s for s in species}
    parent={n:n for n in bynum}
    def root(n):
        while parent[n]!=n:n=parent[n]
        return n
    edges=[r['cells'] for r in workbook_rows(ROOT/PROGRESSION)['Evolution Paths'] if r['cells'] and isinstance(r['cells'][0],int)]
    assert len(edges)==98
    for e in edges:
        assert bynum[e[1]]['name']==e[2] and bynum[e[3]]['name']==e[4]
        parent[root(e[3])]=root(e[1])
    families=collections.defaultdict(list)
    for n in bynum:families[root(n)].append(n)
    assert len(families)==89
    # Visually reviewed layouts. Artwork labels establish identity; artwork arrows do not define evolution rules.
    branches={'Censmoke','Votress','Cairant','Jerbune','Pebbettle','Styxlet','Triskit','Pilgrimp','Acremink'}
    records=[];family_rows=[]
    for base,ids in sorted(families.items()):
        name=bynum[base]['name'];src=f'assets/abyssals/source/{name}.webp';path=ROOT/src
        assert path.is_file(),src
        checksum=hashlib.sha256(path.read_bytes()).hexdigest()
        if name=='Flaggrim':positions=['left','labelled_upper_middle','labelled_lower_middle']
        elif name in branches:positions=['left']+(['upper_right','lower_right'] if len(ids)==3 else ['upper_right','middle_right','lower_right'])
        elif len(ids)==1:positions=['centre']
        elif len(ids)==2:positions=['left','right']
        else:positions=['left','middle','right']
        family_rows.append({'root_species_id':f'{base:03}','species_ids':[f'{n:03}' for n in ids],'source_filename':src})
        for n,position in zip(ids,positions):
            s=bynum[n];records.append({'asset_id':f'ABYSSAL-{n:03}-FRONT','species_id':s['id'],'dex_number':n,
                'canonical_name':s['name'],'source_label':s['name'],'source_filename':src,
                'source_figure_position':position,'source_figure_count':len(ids)+(2 if name=='Flaggrim' else 0),
                'runtime_filename':None,'planned_runtime_filename':f"assets/abyssals/runtime/abyssal_{n:03}_{s['name'].lower()}.png",
                'dimensions':[1448,1086],'file_type':'WEBP','sha256':checksum,'status':'identity_mapped_extraction_pending',
                'identity_evidence':{'file':STATS,'sheet':'Full Dex','row':s['provenance']['row'],'method':'Exact labelled name plus canonical evolution-family membership; all 89 sheets visually reviewed'},
                'uncertainty':[]})
    assert {x['source_filename'] for x in records}=={str(p.relative_to(ROOT)) for p in (ROOT/'assets/abyssals/source').glob('*.webp')}
    manifest={'schema_version':1,'expected_species_count':187,'verified_canonical_species_count':187,
        'source_file_count':89,'runtime_file_count':0,'identity_status':'complete','runtime_status':'pending_phase_c',
        'records':sorted(records,key=lambda r:r['dex_number']),'families':family_rows,'unresolved_species':[],
        'supplemental_unlabelled_art':[{'source_filename':'assets/abyssals/source/Flaggrim.webp','position':p,'status':'preserved_unassigned','reason':'Two unlabelled additional illustrations have no additional canonical Dex species. Named figures establish all three family mappings; retain extras without inventing identities.'} for p in ['upper_far_right','lower_far_right']],
        'label_conflicts':[{'species_id':'032','source_filename':'assets/abyssals/source/Bantisk.webp','observed':['Poison','Flying','Dragon'],'canonical':['Poison','Dragon'],'resolution':'Dex controls types; source label removed from runtime crop, pristine source retained.'}],
        'unresolved':['Individual runtime extraction, framing and transparency QA pending Phase C.']}
    write('data/species/species.json',{'schema_version':1,'status':'partial','sources':[STATS,PROGRESSION],'expected_count':187,'records':species,'unresolved':['Species identities, types, exact stats and ability names extracted. Capture rates and remaining runtime bindings must be audited in Phase E; null is not a capture rule.']})
    names=['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy']
    write('data/types/types.json',{'schema_version':1,'status':'partial','sources':[SOURCE+'ABYSSALS_CHECKLIST_09_Leader_Trainer_Fate_System_LOCKED_v1.2_CORRECTION.docx',STATS],'expected_count':18,'records':[{'id':n.upper(),'name':n} for n in names],'unresolved':['Type identities are complete; effectiveness matrix and exact interaction authority to be audited in Phase E.']})
    write('data/manifests/abyssal_art.json',manifest)
    index=json.loads((ROOT/'data/manifests/datasets.json').read_text())
    for d in index['datasets']:
        if d['path'] in ['data/species/species.json','data/types/types.json']:d['record_count']=187 if '/species/' in d['path'] else 18
    write('data/manifests/datasets.json',index)
    status=json.loads((ROOT/'data/manifests/import_status.json').read_text());status.update({'preparation_phase':'B','verified_species':187,'species_art_mapped':187,'source_art_coverage_basis':'187 exact labelled figures visually reconciled with numeric Dex and 89 canonical evolution families','unlabelled_supplemental_monster_illustrations':2});write('data/manifests/import_status.json',status)
    print('SPECIES IDENTITY/ART MAPPING PASS: 187/187 species; 89/89 source sheets; 98 canonical evolution links; no unresolved species identities; two unlabelled supplemental illustrations retained.')
if __name__=='__main__':extract()
