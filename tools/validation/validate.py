#!/usr/bin/env python3
"""Repository integrity gate; --content adds strict full-content readiness."""
import argparse, collections, hashlib, json, sys
from pathlib import Path
try:
    from jsonschema import Draft202012Validator
    from PIL import Image
    import numpy as np
except ImportError as e:
    raise SystemExit('Missing tooling dependency. Activate .venv and run python3 -m pip install -r requirements-tools.txt: '+str(e))

ROOT = Path(__file__).resolve().parents[2]

def reject_duplicate_keys(pairs):
    out = {}
    for key, value in pairs:
        if key in out:
            raise ValueError('Duplicate JSON key: '+key)
        out[key] = value
    return out

def load(path):
    return json.loads(path.read_text(encoding='utf-8'), object_pairs_hook=reject_duplicate_keys)

def unique(records, key, label, errors):
    ids = [r.get(key) for r in records if r.get(key) is not None]
    for id_, n in collections.Counter(ids).items():
        if n > 1:
            errors.append(f'{label}: duplicate {key} {id_}')

def resolve_path(root, rel):
    path = (root/rel).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError('Path escapes repository: '+rel)
    return path

REFERENCE_FIELDS = {
    'species_id':'species', 'from_species_id':'species', 'to_species_id':'species',
    'player_starter_species_id':'species', 'pate_starter_species_id':'species', 'trade_starter_species_id':'species',
    'move_id':'moves', 'move_ids':'moves', 'moves':'moves',
    'type_id':'types', 'types':'types', 'trainer_id':'trainers', 'trainer_ids':'trainers',
    'trainer_class_id':'trainer_classes', 'character_id':'characters', 'character_ids':'characters',
    'speaker_id':'characters', 'warden_id':'characters', 'reserve_access_character_id':'characters',
    'location_id':'locations', 'location_ids':'locations', 'area_id':'areas',
    'item_id':'items', 'held_item_id':'items', 'item_ids':'items', 'shop_id':'shops',
    'scene_id':'scenes', 'scene_ids':'scenes', 'next_scene_id':'scenes', 'required_scene_id':'scenes',
    'faction_id':'factions', 'field_id':'fields', 'battle_id':'battles', 'table_id':'tables',
    'family_id':'families', 'signature_owner_family':'families', 'member_species_ids':'species',
    'anchor_scene_ids':'scenes', 'world_event_id':'scenes', 'current_form_legal_move_ids':'moves',
    'bag_item_id':'items', 'then_item_id':'items', 'else_item_id':'items',
}

def validate_references(value, registries, errors, trail='data'):
    if isinstance(value, dict):
        for key, v in value.items():
            at = trail+'.'+key
            if key in REFERENCE_FIELDS and v is not None:
                refs = v if isinstance(v, list) else [v]
                for ref_ in refs:
                    if isinstance(ref_, (str,int)) and not isinstance(ref_,bool) and ref_ not in registries.get(REFERENCE_FIELDS[key], set()):
                        errors.append(f'{at}: unknown {REFERENCE_FIELDS[key]} reference {ref_}')
            validate_references(v, registries, errors, at)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            validate_references(v, registries, errors, f'{trail}[{i}]')

def content_counts(registries, errors):
    for key, n in [('species',187),('evolutions',98),('learnsets',1893),('types',18)]:
        if len(registries.get(key,set())) != n:
            errors.append(f'CONTENT: {key} requires {n} records; found {len(registries.get(key,set()))}')

def validate(root=ROOT, content=False):
    errors, warnings = [], []
    required = ['AGENTS.md','CODEX.md','ARENA_AI.md','README.md','docs/canon/README.md',
                'docs/audit/IMPORT_AUDIT.md','docs/audit/CONFLICTS_AND_RESOLUTIONS.md','docs/audit/UNRESOLVED_ITEMS.md',
                'docs/implementation/IMPLEMENTATION_ROADMAP.md','docs/implementation/FIRST_CODEX_TASK.md',
                'docs/playtesting/BUILD_AND_RUN.md','docs/playtesting/PLAYTEST_PLAN.md','docs/playtesting/BUG_REPORT_TEMPLATE.md',
                'docs/playtesting/BALANCE_TESTING.md','docs/playtesting/IRONMAN_TESTING.md']
    for rel in required:
        if not (root/rel).is_file():errors.append('Missing required file: '+rel)
    parsed = {}
    for p in sorted((root/'data').rglob('*.json')):
        try:parsed[str(p.relative_to(root))] = load(p)
        except Exception as e:errors.append(f'{p.relative_to(root)}: {e}')
    if errors:return errors,warnings
    registry = parsed['data/manifests/schema_registry.json']['files']
    unique(registry,'path','schema registry',errors)
    registered = {r['path'] for r in registry}
    actual = {k for k in parsed if not k.startswith('data/schemas/')}
    if registered != actual:errors.append(f'Schema coverage mismatch: {sorted(registered ^ actual)}')
    for path, schema in parsed.items():
        if path.startswith('data/schemas/'):
            try:Draft202012Validator.check_schema(schema)
            except Exception as e:errors.append(f'{path}: invalid JSON Schema: {e}')
    for r in registry:
        if r['schema'] not in parsed:errors.append('Missing schema '+r['schema']);continue
        if r['path'] not in parsed:continue
        for e in Draft202012Validator(parsed[r['schema']]).iter_errors(parsed[r['path']]):
            errors.append(f'{r["path"]} {e.json_path}: {e.message}')
    registries = {}
    datasets = parsed['data/manifests/datasets.json']['datasets']
    unique(datasets,'path','dataset index',errors)
    aliases = {'trainer_classes':'trainer_classes','terrain':'fields'}
    for d in datasets:
        value = parsed.get(d['path'])
        if value is None:errors.append('Missing dataset '+d['path']);continue
        rows = value['records'];key=Path(d['path']).stem
        if key=='classes':key='trainer_classes'
        registries[key] = {r['id'] for r in rows if 'id' in r}
        unique(rows,'id',d['path'],errors)
        if len(rows)!=d['record_count'] or value['status']!=d['status']:errors.append('Stale dataset index '+d['path'])
        for row in rows:
            for e in Draft202012Validator(parsed[d['record_schema']]).iter_errors(row):
                errors.append(f'{d["path"]} {row.get("id")} {e.json_path}: {e.message}')
        for source in value['sources']:
            if not resolve_path(root,source).is_file():errors.append('Missing provenance source '+source)
        if value['status']!='complete_for_supplied_source':
            warnings.append(f'{d["path"]}: {value["status"]}; {len(rows)} records')
            if content:errors.append('CONTENT: incomplete dataset '+d['path'])
    for d in datasets:validate_references(parsed[d['path']]['records'],registries,errors,d['path'])
    rules=parsed['data/progression/core_rules.json']
    validate_references(rules,registries,errors,'core_rules')
    if rules['species']['count']!=187:errors.append('Locked species count must remain 187')
    if rules['species']['back_sprites_required'] or rules['battle']['player_active_rendered']:errors.append('First-person/back-sprite lock violated')
    if len(registries['characters'])!=100: warnings.append('Character count differs from the 100-target canonical portrait queue, including recovered Nharos.')
    if {f'LDR-{i:02}' for i in range(1,9)}-registries['characters']:errors.append('Missing canonical leader IDs')
    areas=parsed['data/encounters/areas.json']['records'];tables=parsed['data/encounters/tables.json']['records']
    if len(areas)!=72 or len(tables)!=144:errors.append('Expected 72 area summaries and 144 phase descriptors')
    area_by_id={a['id']:a for a in areas}
    seen_phases=collections.Counter()
    for a in areas:
        if a['min_level']>a['max_level']:errors.append('Reversed area levels '+a['id'])
        if (a['phase_1'],a['phase_2']) not in [('DAY','NIGHT'),('PALE','DARK')]:errors.append('Invalid phase pair '+a['id'])
    for t in tables:
        seen_phases[(t['area_id'],t['phase'])]+=1
        if t['slots'] is not None:
            if sum(x['weight'] for x in t['slots'])!=100:errors.append('Encounter weights must total 100: '+t['id'])
            for s in t['slots']:
                if s['min_level']>s['max_level']:errors.append('Reversed slot levels '+t['id'])
        elif content:errors.append('CONTENT: missing encounter slots '+t['id'])
    expected={(a['id'],phase) for a in areas for phase in [a['phase_1'],a['phase_2']]}
    if set(seen_phases)!=expected or any(n!=1 for n in seen_phases.values()):errors.append('Encounter phase coverage mismatch/duplicate')
    sources=parsed['data/manifests/source_files.json']
    unique(sources['files'],'source_id','source inventory',errors)
    for row in [*sources['files'],*sources['prior_repository_files'],*sources.get('recovered_canon_sources',[])]:
        try:
            p=resolve_path(root,row['repository_path'])
            if not p.is_file():errors.append('Missing source '+row['repository_path']);continue
            if p.stat().st_size!=row['size'] or hashlib.sha256(p.read_bytes()).hexdigest()!=row['sha256']:errors.append('Source checksum/size mismatch '+row['repository_path'])
        except ValueError as e:errors.append(str(e))
    pm=parsed['data/manifests/portraits.json'];am=parsed['data/manifests/abyssal_art.json']
    unique(pm['records'],'asset_id','portrait assets',errors);unique(am['records'],'asset_id','monster assets',errors)
    if am.get('identity_status')=='complete':
        unique(am['records'],'species_id','canonical species art',errors)
        if len(am['records'])!=187 or {r['species_id'] for r in am['records']}!=registries['species']:
            errors.append('Species art identity coverage must be exactly 187/187')
        if len({r['source_filename'] for r in am['records']})!=am['source_file_count']:
            errors.append('Monster source-sheet count does not match mapping')
        species_by_id={r['id']:r for r in parsed['data/species/species.json']['records']}
        for row in am['records']:
            species=species_by_id.get(row['species_id'],{})
            if row['canonical_name']!=species.get('name') or row['dex_number']!=species.get('dex_number'):
                errors.append('Species artwork identity/name mismatch '+row['asset_id'])
    active=[r for r in pm['records'] if r['selection_status']=='canonical']
    unique(active,'id','canonical portraits',errors)
    unique(pm['missing_targets'],'id','missing portrait targets',errors)
    if {r['id'] for r in active} & {r['id'] for r in pm['missing_targets']}:errors.append('Portrait target marked both supplied and missing')
    for target in pm['missing_targets']:
        if target['id'] not in registries['characters']:errors.append('Missing portrait target has unknown character '+target['id'])
    runtime=[]
    for manifest,kind in [(pm,'portraits'),(am,'abyssals')]:
        for row in manifest['records']:
            src=resolve_path(root,row['source_filename'])
            if not src.is_file():errors.append('Missing asset '+row['source_filename']);continue
            source_sha=row.get('source_sha256',row.get('sha256'))
            if hashlib.sha256(src.read_bytes()).hexdigest()!=source_sha:errors.append('Asset checksum mismatch '+str(src.relative_to(root)))
            try:
                with Image.open(src) as image:
                    image.load()
                    if list(image.size)!=row['dimensions'] or image.format!=row['file_type']:errors.append('Asset dimensions/format mismatch '+row['source_filename'])
            except Exception as e:errors.append('Unreadable image '+row['source_filename']+': '+str(e))
            id_=row.get('id') if kind=='portraits' else row.get('species_id')
            registry_name='characters' if kind=='portraits' else 'species'
            if id_ is not None and id_ not in registries[registry_name]:errors.append('Unknown asset entity '+id_)
            rel=row['runtime_filename']
            if rel is None:
                if content and (kind=='abyssals' or row.get('selection_status')=='canonical'):errors.append('CONTENT: runtime asset missing '+row['asset_id'])
                continue
            path=resolve_path(root,rel);runtime.append(rel)
            if not path.is_relative_to((root/'assets'/kind/'runtime').resolve()):errors.append('Invalid runtime directory '+rel)
            if id_ is None:errors.append('Runtime asset has no canonical identity '+rel)
            if kind=='portraits' and row['selection_status'] not in ['canonical','variant']:errors.append('Legacy/alternate leaked to runtime '+rel)
            if not path.is_file():errors.append('Missing runtime '+rel);continue
            if hashlib.sha256(path.read_bytes()).hexdigest()!=row.get('runtime_sha256'):errors.append('Runtime checksum mismatch '+rel)
            with Image.open(path) as image:
                image.load()
                if kind=='abyssals':
                    if image.mode!='RGBA' or image.size!=(1024,1024) or image.format!='PNG':errors.append('Abyssal canvas/mode mismatch '+rel)
                    alpha=image.convert('RGBA').getchannel('A');bbox=alpha.getbbox()
                    if not bbox or alpha.getextrema()[0]!=0:errors.append('Abyssal has no figure/transparency '+rel)
                    elif min(bbox[0],bbox[1],1024-bbox[2],1024-bbox[3])<32:errors.append('Abyssal padding/clipping failure '+rel)
                    if row.get('status')!='ready' or row.get('visual_review')!='approved':errors.append('Unreviewed Abyssal used at runtime '+rel)
                    if row.get('runtime_dimensions')!=[1024,1024]:errors.append('Abyssal manifest canvas mismatch '+rel)
                    if not row.get('processing_config') or not resolve_path(root,row['processing_config']).is_file():errors.append('Missing reproducible sprite extraction config '+rel)
                    elif row.get('processing_config_sha256')!=hashlib.sha256(resolve_path(root,row['processing_config']).read_bytes()).hexdigest():errors.append('Sprite extraction configuration changed without regeneration '+rel)
                if kind=='portraits':
                    if image.mode!='RGBA' or image.size!=(pm['canvas']['width'],pm['canvas']['height']):errors.append('Portrait canvas/mode mismatch '+rel)
                    rgba=image.convert('RGBA');alpha=rgba.getchannel('A')
                    if alpha.getbbox() is None or alpha.getextrema()[0]==255:errors.append('Portrait has no figure/transparency '+rel)
                    pixels=np.asarray(rgba)
                    if np.any(np.all(pixels[:,:,:3]==(255,0,255),axis=2) & (pixels[:,:,3]>0)):errors.append('Opaque exact magenta remains '+rel)
                    if row['processing_status']!='ready':errors.append('Unready portrait used at runtime '+rel)
                    bbox=alpha.getbbox()
                    if bbox and min(bbox[0],bbox[1],image.width-bbox[2],image.height-bbox[3])<pm['canvas']['padding_px']:errors.append('Portrait padding/clipping failure '+rel)
                    if row.get('visual_review')!='approved':errors.append('Unreviewed portrait used at runtime '+rel)
                    config=row.get('processing_config')
                    if not config or not resolve_path(root,config).is_file():errors.append('Missing portrait processing configuration '+rel)
                    elif hashlib.sha256(resolve_path(root,config).read_bytes()).hexdigest()!=row.get('processing_config_sha256'):errors.append('Portrait configuration changed without regeneration '+rel)
                    anchors=row.get('anchors',{});transform=row.get('transform',{})
                    span=anchors.get('soles_y',0)-anchors.get('crown_y',0)
                    if abs(span*transform.get('scale',0)-pm['canvas']['body_height_px'])>.01:errors.append('Portrait body scale mismatch '+rel)
                    bounds=transform.get('source_opaque_bounds',[0,0,0,0]);offset=transform.get('offset',[0,0]);scale=transform.get('scale',0)
                    if abs(offset[1]+(anchors.get('soles_y',0)-bounds[1])*scale-pm['canvas']['soles_baseline_y'])>1:errors.append('Portrait baseline mismatch '+rel)
                    if abs(offset[0]+(anchors.get('body_center_x',0)-bounds[0])*scale-image.width/2)>1:errors.append('Portrait body centering mismatch '+rel)
    unique([{'path':x} for x in runtime],'path','runtime manifest',errors)
    actual_runtime={str(p.relative_to(root)) for kind in ['portraits','abyssals'] for p in (root/'assets'/kind/'runtime').glob('*') if p.suffix.lower() in ['.png','.webp','.jpg']}
    if actual_runtime!=set(runtime):errors.append('Runtime files and manifests differ')
    if len(active)+len(pm['missing_targets'])!=100:errors.append('Portrait target coverage must reconcile to 100')
    aliases=parsed['data/manifests/id_aliases.json']['character_aliases'];unique(aliases,'source_id','character aliases',errors)
    for a in aliases:
        if a['canonical_id'] and a['canonical_id'] not in registries['characters']:errors.append('Unresolved canonical alias '+a['source_id'])
    if content:
        content_counts(registries,errors)
        dex=[r['dex_number'] for r in parsed['data/species/species.json']['records']]
        if set(dex)!=set(range(1,188)) or len(dex)!=187:errors.append('CONTENT: canonical Dex numbers must be exactly 1..187')
        mapped=[r['species_id'] for r in am['records'] if r['species_id'] and r['runtime_filename']]
        if set(mapped)!=registries['species'] or len(mapped)!=187:errors.append('CONTENT: exactly 187 canonical species runtime mappings required')
        if pm['missing_targets']:errors.append('CONTENT: missing named portraits: '+str(len(pm['missing_targets'])))
        if any(a['canonical_id'] is None for a in aliases):errors.append('CONTENT: unresolved character alias')
    return errors,warnings

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=ROOT);ap.add_argument('--content',action='store_true');ap.add_argument('--json-report',type=Path)
    args=ap.parse_args()
    try:errors,warnings=validate(args.root,args.content)
    except Exception as e:errors,warnings=['Validator failed closed: '+str(e)],[]
    report={'mode':'content' if args.content else 'integrity','passed':not errors,'errors':errors,'warnings':warnings}
    if args.json_report:
        args.json_report.parent.mkdir(parents=True,exist_ok=True);args.json_report.write_text(json.dumps(report,indent=2)+'\n')
    print(('PASS' if not errors else 'FAIL')+' — '+report['mode']+f'; {len(errors)} errors, {len(warnings)} incomplete datasets')
    for x in (errors[:20] if errors else warnings):print('- '+x)
    if len(errors)>20:print(f'- {len(errors)-20} further errors; use --json-report for all.')
    return 1 if errors else 0
if __name__=='__main__':sys.exit(main())
