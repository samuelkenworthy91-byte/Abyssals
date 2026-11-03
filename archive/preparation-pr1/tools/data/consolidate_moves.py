"""Reviewed move metadata extraction; unresolved source semantics fail readiness."""
import re
from source_readers import workbook_rows

# These explicit row lists were reviewed against the authored Visual action text,
# using Checklist 12's action/intent test. Runtime never guesses from move names.
PHYSICAL = set([5,6,7,8,9,14,15,16,17,21,23,24,28,30,31,37,38,39,
 42,43,44,47,51,52,53,56,64,65,66,67,70,73,75,79,80,81,82,83,85,87,88,90,91,
 102,103,104,105,110,112,118,119,120,121,122,123,126,127,128,129,130,131,132,133,
 138,142,144,145,147,153,154,155,157,158,162,163,164,165,166,
 176,177,178,179,180,181,183,184,186,211,213,214,215,216,217,222,
 225,227,228,229,231,232,234,237,239,240,241,242,243,245,246,247,248,
 253,254,261,263,272,273,274,276,282,283,284,286,292,293,294,295,296,297,298,
 301,302,303,304,305,310,313,314,315,316,317,318,319,323,324,325,326,327,328,330])
SPECIAL = set([2,18,19,20,25,27,36,46,55,57,59,63,69,71,72,76,77,78,84,86,92,
 98,99,101,115,116,137,141,146,159,167,172,174,175,182,189,190,191,192,193,
 194,195,196,197,200,201,202,203,204,205,207,208,212,218,226,238,252,256,258,
 260,262,265,267,268,270,271,275,277,280,281,285,287,291,300,308,309,312,322,
 331,332,333,334,335,336,337,338,340,341,342,343,344,345,346,347,349,350,353])

STAT={'Attack':'attack','Defense':'defence','Sp. Atk':'sp_attack','Sp. Def':'sp_defence',
      'Speed':'speed','accuracy':'accuracy','evasion':'evasion'}

def effect_payload(id_,text,power):
    t=text.replace('’',"'").rstrip('.')
    effects=[];unresolved=[]
    # Explicit composites use actual authored quantities and conditions.
    special={
      34:[{'effect_id':'stat_stage','target':'SELF','stat':'sp_defence','stages':1}, {'effect_id':'status_immunity','status':'BURN','turns':5,'target':'SELF'}],
      35:[{'effect_id':'stat_stage','target':'SELF','stats':['attack','speed'],'stages':1},{'effect_id':'hp_cost','basis':'MAX_HP','fraction':[1,8]}],
      36:[{'effect_id':'inflict_status','status':'BURN','chance_percent':30},{'effect_id':'power_multiplier','multiplier':1.2,'when':{'user_type':'GHOST'}}],
      37:[{'effect_id':'inflict_status','status':'BURN','chance_percent':20},{'effect_id':'power_multiplier','multiplier':1.25,'when':{'foe_status':'CONFUSION'}}],
      38:[{'effect_id':'stat_stage','target':'SELF','stat':'speed','stages':1,'timing':'AFTER_DAMAGE'}],
      39:[{'effect_id':'flinch','chance_percent':20},{'effect_id':'stat_stage','target':'SELF','stat':'speed','stages':1,'when':'TARGET_KO'}],
      61:[{'effect_id':'stat_stage','target':'SELF','stat':'speed','stages':2},{'effect_id':'stat_stage','target':'SELF','stat':'defence','stages':-1}],
      71:[{'effect_id':'recurring_status','status':'PARALYSIS','chance_percent':25,'turns':3,'target':'FOE_SIDE'}],
      76:[{'effect_id':'inflict_status','status':'PARALYSIS','chance_percent':20},{'effect_id':'ignore_positive_evasion'}],
      95:[{'effect_id':'contact_retaliation','fraction':[1,8],'turns':5,'basis':None}],
      97:[{'effect_id':'heal_by_format','singles':{'target':'SELF','max_hp_fraction':[1,2]},'doubles':{'target':'ACTIVE_SIDE','max_hp_fraction':[1,4]}}],
      98:[{'effect_id':'stat_stage','target':'SELF','stat':'defence','stages':1,'timing':'AFTER_DAMAGE','when':'USER_STARTED_AT_FULL_HP'}],
      99:[{'effect_id':'stat_stage','target':'SELF','stat':'defence','stages':1,'timing':'AFTER_DAMAGE'}],
      124:[{'effect_id':'prevent_forced_switch','target':'SELF','turns':None},{'effect_id':'stat_stage','target':'SELF','stat':'defence','stages':1}],
      134:[{'effect_id':'stat_stage','target':'SELF','stat':'attack','stages':2},{'effect_id':'inflict_status','target':'SELF','status':'CONFUSION','chance_percent':100}],
      135:[{'effect_id':'inflict_status','target':'ALL_FOES','status':'POISON','chance_percent':100}],
      143:[{'effect_id':'contact_status_retaliation','status':'POISON','chance_percent':30,'turns':5}],
      150:[{'effect_id':'inflict_status','status':'BAD_POISON','chance_percent':100},{'effect_id':'stat_stage','target':'SINGLE_FOE','stat':'sp_defence','stages':-1}],
      171:[{'effect_id':'prevent_flinch','turns':5,'target':'SELF'},{'effect_id':'prevent_forced_switch','turns':5,'target':'SELF'}],
      172:[{'effect_id':'power_multiplier','multiplier':1.25,'when':'USER_MOVED_AFTER_TARGET'}],
      188:[{'effect_id':'stat_stage','target':'SELF','stat':'speed','stages':2},{'effect_id':'stat_stage','target':'SELF','stat':'defence','stages':-1}],
      189:[{'effect_id':'inflict_status','status':'CONFUSION','chance_percent':20}],
      199:[{'effect_id':'next_move_cannot_miss','target':'SELF','uses':1}],
      210:[{'effect_id':'stat_stage','target':'SELF','stats':['sp_attack','sp_defence'],'stages':1},{'effect_id':'stat_stage','target':'SINGLE_FOE','stat':'attack','stages':-1}],
      219:[{'effect_id':'stat_stage','target':'ACTIVE_SIDE','type_filter':'BUG','stat':'attack','stages':1}],
      220:[{'effect_id':'stat_stage','target':'SELF','stat':'speed','stages':1},{'effect_id':'clear_negative_stat_stages','target':'SELF'}],
      224:[{'effect_id':'next_hit_damage_multiplier','multiplier':.5,'uses':1,'target':'SELF'}],
      244:[{'effect_id':'stat_stage','target':'SELF','stat':'defence','stages':1},{'effect_id':'critical_damage_multiplier','multiplier':.5,'turns':5,'target':'SELF'}],
      250:[{'effect_id':'disable_last_move','target':'SINGLE_FOE','turns':3}],
      251:[{'effect_id':'prevent_switch','target':'SINGLE_FOE','turns':3}],
      278:[{'effect_id':'stat_stage','target':'SELF','stats':['attack','sp_attack'],'stages':1},{'effect_id':'stat_stage','target':'SELF','stat':'speed','stages':-1}],
      288:[{'effect_id':'stat_stage','target':'SELF','stats':['attack','sp_attack','speed'],'stages':1},{'effect_id':'hp_cost','basis':'MAX_HP','fraction':[1,6]}],
      290:[{'effect_id':'incoming_type_damage_multiplier','type_id':'DARK','multiplier':1.25,'turns':3,'target':'SINGLE_FOE'}],
      306:[{'effect_id':'stat_stage','target':'SELF','stat':'speed','stages':2},{'effect_id':'stat_stage','target':'SELF','stat':'accuracy','stages':-1}],
      308:[{'effect_id':'power_multiplier','multiplier':1.5,'when':'TARGET_HAS_POSITIVE_STAT_STAGE'}],
      309:[{'effect_id':'power_multiplier','multiplier':2,'when':'TARGET_USED_STATUS_MOVE_LAST_TURN'}],
      310:[], # Checklist 12's explicit +1 whitelist supersedes catalogue conditional priority.
      320:[{'effect_id':'next_hit_damage_multiplier','category':'PHYSICAL','multiplier':.5,'uses':1,'target':'SELF'}],
      330:[{'effect_id':'power_multiplier','multiplier':1.5,'when':'FOE_DAMAGED_ALLY_PREVIOUS_TURN'}],
      352:[{'effect_id':'heal','target':'SELF','max_hp_fraction':[1,2]},{'effect_id':'cure_major_status','target':'SELF','count':1}],
      353:[{'effect_id':'heal','target':'PARTNER','max_hp_fraction':[1,8],'format':'DOUBLES'}],
      354:[{'effect_id':'stat_stage','target':'SELF','stats':['defence','sp_defence'],'stages':1},{'effect_id':'prevent_forced_switch','target':'SELF','turns':5}],
    }
    if id_ in special:
        if id_==95:unresolved.append('effect.contact_retaliation: source does not identify whose maximum HP supplies the 1/8 basis')
        if id_==124:unresolved.append('effect.prevent_forced_switch: duration/expiry is not specified')
        return special[id_],unresolved
    for part in t.split('; '):
        chance=100
        if part=='No secondary effect':continue
        if part.startswith('High critical-hit ratio'):
            effects.append({'effect_id':'high_critical_ratio','stage_bonus':None});unresolved.append('effect.high_critical_ratio: exact stage/critical formula absent');continue
        m=re.fullmatch(r'(\d+)% chance to (flinch|burn|paralyze|confuse|freeze|poison|badly poison|put target to sleep)',part)
        if m:
            status={'burn':'BURN','paralyze':'PARALYSIS','confuse':'CONFUSION','freeze':'FREEZE','poison':'POISON','badly poison':'BAD_POISON','put target to sleep':'SLEEP','flinch':'FLINCH'}[m[2]]
            effects.append({'effect_id':'flinch' if status=='FLINCH' else 'inflict_status','status':status,'chance_percent':int(m[1])});continue
        m=re.fullmatch(r'Restores (\d+)% max HP',part)
        if m:effects.append({'effect_id':'heal','target':'SELF','max_hp_fraction':[int(m[1]),100]});continue
        m=re.fullmatch(r'Restores HP equal to (\d+)% of damage dealt',part)
        if m:effects.append({'effect_id':'drain','actual_hp_damage_fraction':[int(m[1]),100]});continue
        m=re.fullmatch(r'[Uu]ser takes (\d+)/(\d+)( max HP)? recoil',part)
        if m:
            effects.append({'effect_id':'recoil','fraction':[int(m[1]),int(m[2])],'basis':'MAX_HP' if m[3] else None})
            if not m[3]:unresolved.append('effect.recoil: damage-dealt versus maximum-HP basis is unspecified')
            continue
        if part=='Target cannot switch next turn 20% of the time':effects.append({'effect_id':'prevent_switch','target':'SINGLE_FOE','turns':1,'chance_percent':20});continue
        # Canonical stat sentences; any nonmatching clause remains unresolved.
        m=re.match(r'(\d+)% chance to (?:lower|raise) ',part)
        if m:chance=int(m[1]);part=part[m.end():];direction=-1 if 'lower' in m[0] else 1
        else:direction=-1 if ('Lowers' in part or 'falls' in part) else 1
        pct=re.search(r' (\d+)% of the time',part)
        if pct:chance=int(pct[1]);part=part[:pct.start()]
        amount=re.search(r'(\d+) stage',part)
        if amount:
            target='SINGLE_FOE' if "foe's" in part else 'SELF'
            fragment=part
            for x in ['Raises ',"Lowers foe's ","foe's ","User's ","user's "]:
                fragment=fragment.replace(x,'')
            fragment=re.split(r' (?:rises|falls|\d+ stage)',fragment)[0]
            names=fragment.split(' and ')
            if all(n in STAT for n in names):
                effects.append({'effect_id':'stat_stage','target':target,'stats':[STAT[n] for n in names],'stages':direction*int(amount[1]),'chance_percent':chance});continue
        effects.append({'effect_id':'UNRESOLVED','source_clause':part})
        unresolved.append('effect clause: '+part)
    return effects,unresolved

def build_moves(root,mp,mw,lp,species):
    vp=root/'docs/source_archive/canon_sources/active/Pokemon_Fan_Game_AI_VFX_Prompt_Log_354_Moves.xlsx'
    vw=next(iter(workbook_rows(vp).values()));vfx={r['cells'][0]:r for r in vw[1:]}
    family={s['name']:s['family_id'] for s in species};out=[]
    for r in mw['Moves'][1:]:
        c=r['cells'];id_,name,typ,pp,power,effect,owner=c
        power=power if isinstance(power,int) else None
        category='STATUS' if power is None else 'PHYSICAL' if id_ in PHYSICAL else 'SPECIAL' if id_ in SPECIAL else None
        payload,issues=effect_payload(id_,effect,power)
        if category is None:issues.append('category: authored action does not unambiguously establish physical versus special damage')
        target='SINGLE_FOE' if power else 'SELF'
        if not power:
            if id_==71:target='FOE_SIDE'
            elif id_ in [97,219]:target='ACTIVE_SIDE'
            elif id_==135:target='ALL_FOES'
            elif id_ in [32,49,150,161,210,236,250,251,290]:target='SINGLE_FOE'
        accuracy=100 if power is None and target in ['SINGLE_FOE','ALL_FOES'] else 'ALWAYS' if power is None else 100 if power<=90 else 95 if power<=100 else 90
        if id_==250:accuracy=90 # direct three-turn disable, Checklist 12 hard-disable rule.
        vr=vfx[id_];action=re.search(r'Visual action: (.*?)(?: At contact| Show)',vr['cells'][-1])
        out.append({'id':id_,'name':name,'type_id':typ.upper(),'pp':pp,'power':power,'category':category,
            'target':target,'accuracy':accuracy,'priority':1 if id_ in [5,106] else 0,
            'effect_text':effect,'effects':payload,'signature_owner_family':family[owner] if owner!='General' else None,
            'signature_owner_name':None if owner=='General' else owner,
            'authored_visual_action':action[1] if action else None,
            'unresolved_fields':issues,'provenance':{'file':str(mp.relative_to(root)),'sheet':'Moves','row':r['row']},
            'metadata_authority':str(lp.relative_to(root)),
            'intent_provenance':{'file':str(vp.relative_to(root)),'sheet':next(iter(workbook_rows(vp))),'row':vr['row']}})
    return out
