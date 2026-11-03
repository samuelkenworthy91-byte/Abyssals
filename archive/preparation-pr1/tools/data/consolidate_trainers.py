"""Recover authored slot/ability/bag contracts without inventing AI weights."""
import re

def enrich(trainers,species,moves,learnsets):
    names={s['id']:s['name'] for s in species}
    legal={s['id']:[] for s in species}
    for row in learnsets:legal[row['species_id']].append(row)
    role_items={'SPEED':'HELD_COURIERS_SPUR','STATUS':'HELD_VOTIVE_THREAD','SUSTAIN':'HELD_PILGRIM_CUP','TERRAIN':'HELD_FIELDGLASS'}
    for t in trainers:
        t['team_version']=1
        t['unresolved_fields']=[]
        last=len(t['team'])
        for i,s in enumerate(t['team'],1):
            s['slot']=i
            s['growth_seed_contract']='trainerId | teamVersion | teamSlot' if t['id'].startswith('TRN-') else 'permanent named individual seed; stable across checkpoints'
            s['ability_resolver']='STABLE_A1_A2'
            if (t['ai_tier']=='Leader-lite' or t['id'].startswith('LDR-')) and i==last:s['ability_resolver']='HA'
            if t['id'].startswith('WRD-') and i in [3,6]:s['ability_resolver']='HA'
            if t['id']=='NAM-SEVERIN':s['ability_resolver']=['HA','A2','HA','A1','HA','HA'][i-1]
            s['current_form_legal_move_ids']=sorted({r['move_id'] for r in legal[s['species_id']] if r['level']<=s['level'] and not r['unresolved_fields']})
            s['held_role']=None
        if t['id'].startswith('TRN-'):
            held,bag=t['loadout_contract'].split(' • ')
            t['bag_count']=int(re.search(r'\d+',bag)[0])
            for slot,role in re.findall(r'(ace|slot\d+) ([A-Z]+)',held):
                ix=last-1 if slot=='ace' else int(slot[4:])-1
                t['team'][ix]['held_role']=role
        elif t['id'].startswith('LDR-'):
            c=t['source_contract'];t['bag_count']=int(re.search(r'\d+',c['Bag'])[0])
            hi=c['Held / ability highlights']
            for s in t['team']:
                match=re.search(re.escape(names[s['species_id']])+r'(?::)?\s+([^;]+)',hi)
                if match:
                    roles=re.findall(r'OFFENSE|GUARD|SPEED|STATUS|SUSTAIN|TERRAIN',match[1])
                    if roles:s['held_role']=roles[0]
                    if 'HA' in match[1]:s['ability_resolver']='HA'
            target=[1,1,2,2,3,3,4,4][int(t['id'][-2:])-1]
            actual=sum(s['held_role'] is not None for s in t['team'])
            t['held_slot_count_contract']=target
            if actual!=target:t['unresolved_fields'].append(f'Checklist 04 body 59 specifies {target} held slots; body 108 names {actual}. Resolve exact slot allocations without deleting authored highlights.')
        elif t['id'].startswith('WRD-'):
            t['bag_count']=0;t['held_roles']=t['source_contract']['Held-role set'].split(' / ')
            t['unresolved_fields'].append('Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.')
        else:
            match=re.search(r'(\d+) bag',t['source_contract']['AI / items']);t['bag_count']=int(match[1]) if match else 0
            if t['id']!='NAM-AERIC':t['unresolved_fields'].append('Named roster specifies held count but not all held-role/slot assignments (Checklist 04 body 104).')
        maxlevel=max(s['level'] for s in t['team'])
        t['bag_item_id']=('ITEM_HEAL_POULTICE' if maxlevel<=30 else 'ITEM_HEAL_FIELD_SALVE' if maxlevel<=60 else 'ITEM_HEAL_GREATER_REMEDY' if maxlevel<=99 else 'ITEM_HEAL_GRAND_RESTORATIVE') if t['bag_count'] else None
        for s in t['team']:
            role=s['held_role']
            if role in role_items:s['held_item_id']=role_items[role]
            elif role=='GUARD':s['held_item_resolver']={'condition':'effective_permanent_defence < effective_permanent_sp_defence','then_item_id':'HELD_IRON_MANTLE','else_item_id':'HELD_VEIL_CHARM'}
            elif role=='OFFENSE':s['held_item_resolver']={'kind':'strongest_legal_STAB_type_sigil','tie_order':['primary_type','secondary_type']}
