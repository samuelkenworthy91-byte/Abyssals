"""Authored world, shops, story and rule contracts; no gameplay implementation."""
import re

def build_world(g, local):
    # Shared import helpers passed explicitly to keep one reproducible entry point.
    read,write,source,doc,table,dataset,prov,slug,table_records = [g[k] for k in
        ['read','write','source','doc','table','dataset','provenance','slug','table_records']]
    cp,cb,tp,tb,items,trainers,ep,eb = [local[k] for k in ['cp','cb','tp','tb','items','trainers','ep','eb']]
    wp=source('WORLD_TOWNS_ROUTES_REFERENCE*')
    sections=[];section=None
    for number,line in enumerate(wp.read_text().splitlines(),1):
        if line.startswith('## ' ) or line.startswith('### '):
            title=line.lstrip('# ').strip()
            section={'id':'WORLD-'+slug(title),'name':title,'entries':[],
                'provenance':prov(wp,line=number)};sections.append(section)
        elif section and line.strip():section['entries'].append({'line':number,'text':line.strip()})
    dataset('data/locations/world_routes.json',sections,[wp],representation='structured_authoring_specification')
    locations=read('data/locations/locations.json')['records']
    areas=read('data/encounters/areas.json')['records']
    for a in areas:
        locations.append({'id':'LOC-'+a['id'],'name':a.get('location',a.get('name',a['id'])),
            'area_id':a['id'],'map_data':None,'id_origin':'technical_area_key',
            'provenance':a.get('provenance',{'file':'data/encounters/areas.json'})})
    # Re-running the importer must not duplicate previously derived locations.
    locations=list({r['id']:r for r in locations}.values())
    dataset('data/locations/locations.json',locations,[wp,local['ap']],
        ['Authored settlements/routes and 72 ecological area records are recovered. Tile maps, per-screen dimensions, collision grids, doorway coordinates and trigger placements have not been authored in the supplied sources.'],schema='location')
    # Stock additions are explicit; later towns inherit all preceding routine stock.
    names={i['name']:i for i in items}
    itemids={i['id']:i for i in items}
    additions=[['Trail Bread','Poultice','Antivenom','Cooling Balm','Nerve Tonic','Waking Salts','Thawing Draught','Smoke Bomb'],
      ['Seasoned Jerky','Field Salve','Might Draught','Guard Draught','Mystic Draught','Resolve Draught','Haste Draught'],
      ['River Grub','Focus Tonic'],['Familiar Stew','Panacea'],['Patient Ration'],
      ['Royal Feast','Greater Remedy','Iron Mantle','Veil Charm'],
      ['Youngroot Mash','Deep Tonic',"Courier's Spur",'Votive Thread','Pilgrim Cup','Fieldglass'],[],
      ['Grand Restorative','Elixir'],['Grand Elixir']]
    shops=[];stock=[]
    for n,c in enumerate(table(cb,65)[1:]):
        stock += [names[x]['id'] for x in additions[n]]
        if n==5:stock += [i['id'] for i in items if i['id'].startswith('HELD_TYPE_SIGIL_')]
        # Evolution stock is a separate authored specialist, not ordinary medicine stock.
        inventory=[{'item_id':id_,'price':itemids[id_]['buy_price']} for id_ in stock]
        settlement='Ramelle' if c[0]=='Postgame Ramelle' else c[0]
        shops.append({'id':'SHOP_'+slug(c[0]),'name':c[0]+' standard stock','location_id':'LOC-'+slug(settlement),
            'currency':'STANDARD','inventory':inventory,'unlock':{'kind':'settlement_access','settlement':settlement,'postgame_required':n==9},
            'essential_stock_survives_fate':True,'provenance':prov(cp,body_index=65,table_row=n+2)})
    shops.append({'id':'SHOP_RAMELLE_RELICS','name':'Ramelle relic/alchemy specialist','location_id':'LOC-RAMELLE','currency':'STANDARD',
        'inventory':[{'item_id':i['id'],'price':i['buy_price']} for i in items if i['category']=='evolution' and i['buy_price'] is not None],
        'unlock':{'kind':'ramelle_specialist_access'},'provenance':prov(cp,body_index=54)})
    shops.append({'id':'SHOP_CYBRESSA_PROVEN_GROUNDS','name':'The Proven Grounds','location_id':'LOC-CYBRESSA','currency':'CURRENCY_TRIAL_MARK',
        'inventory':[{'item_id':i['id'],'price':i['buy_price']} for i in items if i['category']=='growth_training'],
        'unlock':{'kind':'cybressa_market_access'},'provenance':prov(cp,body_index=133)})
    dataset('data/shops/shops.json',shops,[cp],schema='shop')
    dataset('data/shops/threshold_stock.json',[{'id':'HELL_THRESHOLD_ESSENTIALS','item_ids':[names[n]['id'] for n in
        ['Trail Bread','Seasoned Jerky','Royal Feast','Field Salve','Greater Remedy','Grand Restorative','Panacea','Focus Tonic','Deep Tonic','Smoke Bomb']],
        'prices':'same_as_mortal_shops','placement':'eligible_safe_thresholds','provenance':prov(cp,body_index=68)}],[cp])
    dataset('data/progression/trial_contracts.json',table_records(cp,cb,85,'TRIAL-RANK-'),[cp])

    storyp,story=doc('Pokemon_Story_Bible_Full_Plot_LOCKED*')
    statep,state=doc('ABYSSALS_CHECKLIST_10_*')
    scenes=[];scene=None
    for b in story:
        t=b.get('text','')
        m=re.match(r'^(CH\d{2}-[EO]\d{2})\s*\|\s*(.+)',t)
        if m:
            scene={'id':m[1],'name':'','chapter':int(m[1][2:4]),'required':m[2]=='MANDATORY',
                'source_blocks':[],'provenance':prov(storyp,body_index=b['body_index']),
                'state_policy':'Apply Checklist 10 state translations and later locked overlays; source prose is not an executable event script.'}
            scenes.append(scene)
        elif t.startswith('CHAPTER ') or (b['body_index']>=820):scene=None
        elif scene:
            if not scene['name'] and t:scene['name']=t
            elif t:
                scene['source_blocks'].append({'body_index':b['body_index'],'text':t})
                for prefix,key in [('Trigger:','trigger_text'),('State effects:','legacy_state_effects_text'),('Battle:','battle_text')]:
                    if t.startswith(prefix):scene[key]=t.removeprefix(prefix).strip()
    for c in table(eb,17)[1:]:
        anchors=re.findall(r'CH\d{2}-E\d{2}',c[1])
        scenes.append({'id':c[0],'name':c[2].replace('_',' '),'required':True,'anchor_scene_ids':anchors,
            'state_write':{'field':c[2],'from':'UNRESOLVED','values':c[3].split(' → ')[1].split(' or ')},
            'provenance':prov(ep,body_index=17)})
    dataset('data/story/scenes.json',scenes,[storyp,statep,ep],
        ['All authored CHxx scene IDs and four WLD story-evolution events are extracted. Per-screen trigger bindings, full conditional dialogue and executable event actions remain to be authored against these scene specifications; legacy source-state text must use Checklist 10 translations.'],schema='scene')
    chapters=table_records(statep,state,99,'CHAPTER-')
    for i,r in enumerate(chapters):r['id']=f'CHAPTER-{i:02}'
    dataset('data/story/chapters.json',chapters,[statep])
    state_records=[]
    for index in [25,32,37,42,47,52,58,63,67,72,79,83,90,96,104,128]:
        state_records+=table_records(statep,state,index,f'STATE-{index:03}-')
    dataset('data/story/state_contracts.json',state_records,[statep])

    # Verbatim dialogue already authored in the story. No new lines or inferred speakers.
    quotes=[(103,'CHR-TRADE','If you’re ready.'),(123,'CHR-TRADE','Don’t follow us.'),
      (292,'LDR-04','If your light teaches mercy and mine teaches mercy, what exactly are we killing one another over?'),
      (308,'CHR-KURG','Duty is what remains when certainty fails.'),(388,'LDR-07','It was.'),
      (570,'CHR-KURG','Duty is what remains when certainty fails.'),(745,'CHR-PATE','Aimon?')]
    dialogue=[]
    for index,speaker,text in quotes:
        block=next(b for b in story if b['body_index']==index)
        assert text in block['text'], (index,text)
        owner=next(s for s in scenes if any(b['body_index']==index for b in s.get('source_blocks',[])))
        dialogue.append({'id':f'DIALOGUE-STORY-{index:03}','speaker_id':speaker,'text':text,'scene_id':owner['id'],
            'delivery':'memory_echo' if index==570 else 'written_note' if index==123 else 'speech',
            'provenance':prov(storyp,body_index=index)})
    dataset('data/dialogue/dialogue.json',dialogue,[storyp],
        ['Seven explicitly attributed verbatim lines extracted. The story is predominantly scene direction rather than a complete spoken script; remaining dialogue, branch-specific line wording and the approximately 40 farewell messages requested by Checklist 16 require authored text.'],schema='dialogue')
    characters=read('data/characters/characters.json')['records']
    dataset('data/characters/characters.json',characters,
        read('data/characters/characters.json')['sources']+[str(storyp.relative_to(g['ROOT']))],schema='character')
    # Battle records distinguish actual combat gates from reference rosters.
    battles=[]
    for t in trainers:
        cid=t['character_id']
        if cid in ['CHR-KURG','CHR-AERIC']:continue
        mode='WARDEN' if t['id'].startswith('WRD-') else 'MORTAL_LEADER' if t['id'].startswith('LDR-') else 'RIVAL_NONLETHAL' if cid=='CHR-RHOSWEN' else 'SUPERVISED_NONLETHAL' if t['id']=='TRN-C01-001' else 'TRAINER'
        battles.append({'id':'BATTLE-'+t['id'],'name':t['name'],'trainer_id':t['id'],'mode':mode,
            'capture_allowed':False,'retreat_mode':'FORBIDDEN' if mode=='WARDEN' or cid=='CHR-SEVERIN' else 'PARLEY',
            'provenance':t['provenance']})
    dataset('data/battles/battles.json',battles,[tp,storyp],
        ['Fixed trainer encounters are indexed. Illyr/Nharos manifestation numeric phase payloads and Mirra illusion trigger timings are not specified by the source story/terrain contracts. Tutorial dummy stats and complete map-trigger bindings also remain unauthored.'],schema='battle')

    # Every locked checklist table is now addressable without opening Word. These
    # are authored contracts, explicitly distinct from executable runtime payloads.
    contracts=[]
    for num in ['01','07','08','09','13','14','15','16','17']:
        pattern='ABYSSALS_CHECKLIST_'+num+'_*'
        if num=='09':pattern='ABYSSALS_CHECKLIST_09_*v1.1.docx'
        p,blocks=doc(pattern)
        for b in blocks:
            if b['kind']=='table' and len(b['rows'])>1:
                contracts+=table_records(p,blocks,b['body_index'],f'LOCK-{num}-{b["body_index"]:03}-')
    p,blocks=doc('ABYSSALS_CHECKLIST_09_*v1.2*')
    for b in blocks:
        if b['kind']=='table' and len(b['rows'])>1:contracts+=table_records(p,blocks,b['body_index'],f'LOCK-09-V12-{b["body_index"]:03}-')
    dataset('data/progression/locked_contracts.json',contracts,
        sorted({r['provenance']['file'] for r in contracts}),
        representation='source_contract_index_not_runtime_payload',
        authority_policy='Apply docs/canon/SUPERSESSIONS.md. Checklist 09 v1.2 overrides v1.1 restoration; Checklist 13 overrides older HP-on-evolution wording. Raw source fields are retained as evidence, never directly executed.')

    core=read('data/progression/core_rules.json')
    core['growth'].pop('hp_baseline_per_level',None)
    core['growth'].update(hp_per_success=10,other_stat_per_success=1,failed_roll_increment=0,
        minimum_successes_per_level=0,rounding='nearest_half_up',immutable_instance_seed=True,
        authority=prov(source('ABYSSALS_CHECKLIST_01_*'),body_index=18))
    core['species']['runtime_assets_verified_in_this_import']=True
    core['battle']['leader_mutual_ko_player_victory']='only_if_living_reserve_exists_after_starter_life_resolution'
    core['battle'].update(replacement_style='SET',residual_layer_order=['FIELD','PERSISTENT_STATUS','HELD_SUSTAIN','OTHER_AUTHORED','CLEANUP'])
    core['evolution']={'promotion':'signed_target_minus_source_base_stats','preserve_current_hp':'clamp(1,new_max,half_up(old_current*new_max/old_max))','rolls_at_evolution':0}
    core['training']={'slots_per_instance':5,'modifier_points_per_slot':20,'durations':[1,2,3,4,5],
        'tick':'after_each_level_growth','allow_same_stat_stacking':True,'clear_on_evolution':False,'usable_at_cap':False}
    core['economy']={'starting_money':2000,'wild_money':0,'routine_stack_limit':999,'held_evolution_stack_limit':99,
        'ordinary_sell_ratio':.5,'sell_rounding':'floor','rare_sale_confirmation':True,'trial_mark_money_exchange':False,
        'trainer_payout':{'Basic':[10,50],'Advanced':[16,50],'Leader-lite':[24,75],'Leader':[50,50],'Rival':[50,50],'Warden':[0,0],'Final':[0,0],'Severin':[0,0]},
        'payout_formula':'round_to_nearest_10(level_coefficient * highest_team_level + size_coefficient * team_size)'}
    core['escape']={'formula':'floor(128*A/max(1,B))+30*C','automatic_threshold':255,'rng_integer_inclusive':[0,254],'success':'r < score'}
    core['parley']={'weights':{'MONEY':50,'HELD':25,'EVOLUTION':15,'OTHER':10},'money_loss_fraction':.15,
        'money_rounding':'floor','remove_empty_categories':True,'renormalize_remaining':True,'immune':['KEY_ITEMS','TRIAL_MARKS']}
    core['memorial']={'restore_same_instance':True,'cost_distinct_living_reserve_species':10,'sacrifices_enter_memorial':False,
        'unlock':'first permanent Abyssal death followed by Civeton revisit','separate_from_human_restoration':True}
    core['human_restoration']={'total_uses':5,'elective':True,'pate_trade_optional':True,'preserve_historical_fate':True,
        'eligible':['CHR-PATE','CHR-TRADE']+[f'LDR-{i:02}' for i in range(1,9)]}
    core['starter_lives']={'initial':3,'bound_to_original_instances':True,'return_timing':'round_end_before_wipe',
        'return_hp':'max(1,ceil(max_hp*0.10))','max_lives_lost_per_action':1,
        'clear_lethal_status_on_return':True,'preserve_pp':True,'retain_held_item_on_nonfinal_loss':True,
        'return_to_same_active_slot':True,'lost_queued_action_remains_lost':True,
        'memorial_resurrection_lives':1,'bonus_lives_regenerate':False}
    core['world'].update(camera='fixed_authored_screens',step_tiles=1,footprint_tiles=1,
        walk_tiles_per_second=4,run_tiles_per_second=7,run_unlock='after_starter_and_opening_release',
        interaction='single_tile_in_front',clear_buffered_input_after_modal=True,
        trainer_sight_tiles=[1,6],trainer_sight='straight_cardinal_ray_blocked_by_solids',
        collision_authority='authored_grid_and_objects_not_art',
        npc_modes=['STATIONARY','BOUNDED_RANDOM_WALK','PATROL_LOOP','SCRIPTED'],
        carriage={'hell':False,'unlock':'physical_town_visit_and_courier_introduction','fare':'small_nonzero_authored_tuning'},
        watercraft={'unlock':'after_Philomere','embark_disembark':'authored_access_tiles','party_species_gate':False})
    core['encounters']={'check_on':'completed_eligible_tile_step','initial_tuning_percent':{'LOW':6,'NORMAL':10,'HIGH':14},
        'rates_status':'source_approved_initial_tuning_not_immutable_constants',
        'rate_authority':prov(source('ABYSSALS_CHECKLIST_17_*'),body_index=68),
        'no_checks_on':['WALL_BUMP','TURN_IN_PLACE','IDLE','MENU','DIALOGUE','SCRIPTED_MOVEMENT','WARP_ENTRY'],
        'resonator':'generate_once_then_suppress_if_wild_level<=first_living_party_level-5','reroll_suppressed':False,
        'phase_selected_at':'encounter_creation','dynamic_level_scaling':False}
    write('data/progression/core_rules.json',core)
    savep,saveb=doc('ABYSSALS_CHECKLIST_15_*')
    save=read('data/save_schema/contracts.json')
    save.update(status='locked_persistence_contract_extracted_not_runtime_save_format',
        sources=[str(savep.relative_to(g['ROOT']))],unresolved=[],
        ordering_key='commit_seq',timestamp_is_ordering_authority=False,
        transaction_states=['PREPARED','COMMITTED'],
        write_order=['PREPARE_JOURNAL','BUILD_CANDIDATE_WITHOUT_MUTATING_CURRENT','WRITE_AND_VERIFY_CANDIDATE',
                     'ATOMIC_ADVANCE_POINTER_AND_COMMIT','ROTATE_BACKUPS_AND_COMPACT'],
        acknowledgement='only_after_durable_verified_commit',storage_failure='pause_at_boundary_and_retry_or_recover',
        recovery='highest_valid_commit_seq_with_deterministic_journal_replay',
        battle_prepared_state=['selected_command','targets','move_or_item','action_transaction_id','pre_action_rng_state'],
        migrations={'direction':'forward_only','verify_before_current':True,'protect_pre_migration_generation':True,
                    'failure':'leave_original_untouched','unsupported_newer':'refuse_destructive_downgrade'},
        writer={'per_slot':1,'lease_required':True,'stale_lock_recovery':True,'revalidate_commit_before_grant':True},
        manual_save={'rollback_point_created':False,'battle':'stable_command_boundary','during_action':'queue_until_durable_boundary'},
        softlock_recovery={'relocation_only':True,'restore_losses':False,'free_abyssal':False},
        source_tables={str(index):table(saveb,index) for index in [19,23,37,45,58,63,68,71,74,83,89]},
        engineering_choices=['storage engine','checksum/hash algorithm','journal encoding','versioned runtime payload schema'])
    write('data/save_schema/contracts.json',save)
