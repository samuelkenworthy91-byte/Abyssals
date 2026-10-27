// Role-led progression authoring, 2026-10-11. Source rows remain in authoredLearnsets.
import {GROWTH_PROFILES} from './growth-balance.js?v=0.87.0';
export const MOVESET_IDENTITY_VERSION=1;
const themes={NORMAL:['FIGHTING','DARK','GROUND'],FIRE:['GROUND','ROCK','GRASS'],WATER:['GROUND','ICE','GRASS'],ELECTRIC:['ICE','GRASS','DARK'],GRASS:['GROUND','POISON','ROCK'],ICE:['WATER','GROUND','FIGHTING'],FIGHTING:['ROCK','DARK','STEEL'],POISON:['GROUND','DARK','GRASS'],GROUND:['ROCK','ICE','FIGHTING'],FLYING:['FIGHTING','STEEL','DARK'],PSYCHIC:['GHOST','FAIRY','DARK'],BUG:['DARK','GROUND','POISON'],ROCK:['GROUND','FIGHTING','GRASS'],GHOST:['DARK','PSYCHIC','FAIRY'],DRAGON:['FIRE','GROUND','STEEL'],DARK:['FIGHTING','POISON','FAIRY'],STEEL:['GROUND','FIGHTING','ROCK'],FAIRY:['PSYCHIC','GROUND','FIGHTING']};
const explicit={
 '001':{critFocus:true,style:'Fast critical striker',kind:'speed',plan:'Use Speed and priority to strike first; high-critical attacks are the main damage tools, with feints and boosts supporting them.',rows:[[0,310],[1,297],[3,12],[6,368],[10,126],[12,294],[16,9],[20,289],[24,298],[28,14],[32,306],[38,295],[44,301]]},
 '002':{critFocus:true,style:'Fast critical ambusher',kind:'speed',plan:'Set up Speed, threaten high-critical hits, and use priority to finish foes; accuracy disruption remains optional.',rows:[[1,297],[3,12],[6,368],[10,126],[12,294],[16,9],[20,306],[24,298],[28,289],[32,14],[38,305],[44,301],[50,303]]},
 '003':{critFocus:true,style:'Fast critical fae striker',kind:'speed',plan:'Combine fast high-critical Dark attacks with Fairy coverage; Speed and offensive boosts support the critical-hit plan.',rows:[[1,297],[3,12],[4,346],[6,368],[10,126],[12,294],[16,9],[20,306],[24,298],[28,337],[32,14],[36,289],[40,309],[46,303],[52,335],[60,333]]},
 '079':{style:'Physical pressure fighter',plan:'Build Attack, strike first, then break guards with physical Water attacks.',rows:[[1,53],[3,117],[6,359],[10,52],[12,155],[16,44],[20,56],[24,12],[28,48],[36,43],[44,42],[50,47]]},
 '080':{style:'Physical sea-lion bruiser',plan:'Use Battle Focus and priority pressure; trade recoil or Speed for decisive heavy hits.',rows:[[1,53],[3,117],[6,359],[10,52],[12,155],[16,44],[20,130],[24,47],[30,134],[36,43],[44,42],[48,59],[56,118]]},
 '139':{style:'Rain recovery tank',plan:'Guard and recover, then establish rain to support Reservoir and Floodplain.',rows:[[1,53],[3,50],[6,41],[10,58],[12,155],[16,40],[18,371],[22,49],[28,51],[34,47],[42,48],[50,43]]},
 '140':{style:'Floodplain control tank',plan:'Layer mixed defences and rain, recover lost HP, and control foes with Water and Grass coverage.',rows:[[1,53],[3,125],[6,41],[10,58],[12,155],[16,87],[18,371],[22,40],[26,85],[30,49],[36,47],[38,43],[24,358],[42,48],[48,86],[56,92]]}
};
function profile(s){
 const g=s.growth_percent,abilities=Object.values(s.ability_names||{}).join(' '),authored=GROWTH_PROFILES.find(p=>p.id===s.id)?.archetype||s.role||'';
 const category=g.attack>=g.sp_attack?'PHYSICAL':'SPECIAL';
 const defensive=/tank|bulwark|wall|fortress|guardian|defensive|support/i.test(authored)||Math.max(g.defence,g.sp_defence)>Math.max(g.attack,g.sp_attack)*1.15;
 const sustain=/Medicinal Sap|Reservoir|Regenerat|Earthroot|World Anchor|Lifebloom/.test(abilities)||/heal|sustain/i.test(authored);
 const disrupt=/disrupt|control|septic|poison|marked|tactical/i.test(authored)||/Poison Barbs|Septic Hunger|Marked Quarry|Strategem/.test(abilities);
 const kind=sustain?'sustain':defensive?'guard':disrupt?'control':g.speed>Math.max(g.defence,g.sp_defence)?'speed':'power';
 const plans={sustain:'Recover and maintain a favourable field while wearing the foe down.',guard:'Build defences, soften incoming attacks, and answer with reliable damage.',control:'Disrupt the foe before exploiting status or weakened defences.',speed:'Prepare tempo, strike first, and finish with fast category-matched attacks.',power:'Raise offensive pressure and progress from reliable attacks to heavy finishers.'};
 return {style:authored||`${category==='PHYSICAL'?'Physical':'Special'} ${kind} fighter`,plan:plans[kind],kind,category};
}
function supportScore(m,p){
 const effects=m.effects||[],raises=stat=>effects.some(e=>e.effect_id==='stat_stage'&&e.target==='SELF'&&e.stages>0&&e.stats?.includes(stat));
 const heals=effects.some(e=>['heal','heal_by_format'].includes(e.effect_id));
 if(p.kind==='sustain')return heals?0:raises('defence')||raises('sp_defence')?1:8;
 if(p.kind==='guard')return raises('defence')||raises('sp_defence')?0:effects.some(e=>['next_hit_damage_multiplier','critical_damage_multiplier'].includes(e.effect_id))?1:heals?2:8;
 if(p.kind==='control')return effects.some(e=>['inflict_status','disable_last_move','recurring_status','incoming_type_damage_multiplier'].includes(e.effect_id)||e.effect_id==='stat_stage'&&e.target!=='SELF'&&e.stages<0)?0:raises('speed')?2:8;
 return raises(p.category==='PHYSICAL'?'attack':'sp_attack')?0:raises('speed')?1:effects.some(e=>e.effect_id==='next_move_cannot_miss')?2:8;
}
export function applyMovesetIdentity(data){
 if(data.movesetIdentityVersion===MOVESET_IDENTITY_VERSION)return;
 data.authoredLearnsets=data.learnsets.map(l=>structuredClone(l));
 const byId=new Map(data.moves.map(m=>[m.id,m])),original=data.learnsets;
 const rows=[];
 const add=(s,m,level,core=false,old=null)=>{
  if(!m||rows.some(l=>l.species_id===s.id&&l.move_id===m.id))return;
  rows.push({...old,species_id:s.id,move_id:m.id,name:m.name,level,method:level===0?'EVOLUTION':'LEVEL_UP',expansion:true,identity:true,identity_core:core,authored_level:old?.level,provenance:{...old?.provenance,role_authoring:'Moveset identities, 2026-10-11'}});
 };
 for(const s of data.species){
  const p=profile(s);s.moveset_identity={...p,version:MOVESET_IDENTITY_VERSION};
  if(explicit[s.id]){s.moveset_identity={...p,...explicit[s.id],rows:undefined,version:MOVESET_IDENTITY_VERSION};for(const [level,id]of explicit[s.id].rows)add(s,byId.get(id),level,true);continue;}
  const old=original.filter(l=>l.species_id===s.id),legal=m=>!m.signature_owner_family||m.signature_owner_family===s.family_id;
  const typed=data.moves.filter(m=>s.types.includes(m.type_id)&&legal(m)&&!m.signature_owner_family);
  const select=(pool,score)=>pool.sort((a,b)=>score(a)-score(b)||a.id-b.id)[0];
  const family=Number(s.family_id?.match(/\d+/)?.[0]||s.id),variation=m=>(m.id+family+Number(s.id))%7;
  const stab=select(typed.filter(m=>m.category===p.category&&m.power>0&&m.power<=70),m=>Math.abs(m.power-45)*2+variation(m))||select(data.moves.filter(m=>m.type_id==='NORMAL'&&m.category===p.category&&m.power>0&&m.power<=60),m=>Math.abs(m.power-45));
  add(s,stab,1,true);
  const supports=data.moves.filter(m=>m.category==='STATUS'&&!m.signature_owner_family&&(s.types.includes(m.type_id)||m.type_id==='NORMAL'||old.some(l=>l.move_id===m.id)));
  const backup=p.kind==='guard'?[1,40,125,320]:p.kind==='sustain'?[11,41]:p.kind==='control'?[49,161,135]:p.category==='PHYSICAL'?[117,12]:[26,10];
  const support=select([...supports,...backup.map(id=>byId.get(id))],m=>supportScore(m,p)*20+variation(m));
  add(s,support,3,true);
  const follow=select(typed.filter(m=>m.power>0&&m.power<=70&&m.category===p.category&&m.id!==stab?.id),m=>Math.abs(m.power-60)*2+variation(m));
  add(s,follow,6,true);
  const second=select(supports.filter(m=>m.id!==support?.id&&supportScore(m,p)<8),m=>supportScore(m,p)*20+variation(m));
  add(s,second,10,true);
  // Retain all original choices, but postpone finishers and off-role options.
  for(const l of old){const m=byId.get(l.move_id);let level=l.level;
   if(m.signature_owner_family){add(s,m,level,false,l);continue;}
   if(m.power>0){const min=m.power>105?40:m.power>85?28:m.power>70?20:m.power>60?10:1;level=Math.max(level,min);if(m.category!==p.category)level=Math.max(level,24);}
   else if(supportScore(m,p)>=8&&!m.effects.some(e=>['weather','terrain','screen'].includes(e.effect_id)))level=Math.max(level,26);
   add(s,m,level,false,l);
  }
  // Evolved forms gain heavier tactical options rather than copying the base kit.
  if(/Final|Middle/i.test(s.stage||s.role||'')){
   const extraType=s.types[1]||themes[s.types[0]]?.[family%3];
   const extra=select(data.moves.filter(m=>m.type_id===extraType&&m.category===p.category&&m.power>=65&&m.power<=95&&!m.signature_owner_family&&!rows.some(l=>l.species_id===s.id&&l.move_id===m.id)),m=>Math.abs(m.power-75)+variation(m));
   add(s,extra,Math.max(20,Number(s.id)%3*4+20));
  }
 }
 // Every existing animated move remains reachable; keep family signatures exclusive.
 for(const m of data.moves.filter(m=>!rows.some(l=>l.move_id===m.id))){
  const s=data.species.find(s=>m.signature_owner_family?s.family_id===m.signature_owner_family:s.types.includes(m.type_id));
  if(s)add(s,m,m.power>105?44:m.power>85?32:m.power>70?24:16);
 }
 // Different pools, not merely different names or learning levels.
 const seen=new Set();for(const s of data.species){
  const pool=()=>rows.filter(l=>l.species_id===s.id).map(l=>l.move_id).sort((a,b)=>a-b).join(',');
  if(seen.has(pool())){
   const p=s.moveset_identity,allowed=[...s.types,...s.types.flatMap(t=>themes[t]||[])];
   const options=data.moves.filter(m=>allowed.includes(m.type_id)&&!m.signature_owner_family&&!rows.some(l=>l.species_id===s.id&&l.move_id===m.id)&&((m.category===p.category&&m.power>=40&&m.power<=95)||m.category==='STATUS'&&supportScore(m,p)<8));
   for(const m of options.sort((a,b)=>a.id-b.id)){add(s,m,m.power>70?28:16);if(!seen.has(pool()))break;}
  }
  if(seen.has(pool()))throw Error('Duplicate move pool: '+s.name);seen.add(pool());
 }
 data.learnsets=rows.sort((a,b)=>a.species_id.localeCompare(b.species_id)||a.level-b.level||a.move_id-b.move_id);
 data.movesetIdentityVersion=MOVESET_IDENTITY_VERSION;
}
// A new wild partner carries damage, coverage and its role tool, not four late support moves.
export function startingMoveIds(data,species,level){
 if(species.tideOrchard){const legal=new Set(data.learnsets.filter(l=>l.species_id===species.id&&l.method==='LEVEL_UP'&&l.level<=level).map(l=>l.move_id)),preferred=species.family_id==='FAMILY-515'?[751,749,747,742,745,743,748,746]:[765,759,755,760,761,757,701,762],chosen=[];for(const id of preferred){if(!legal.has(id))continue;const m=data.moves.find(m=>m.id===id),attacks=chosen.filter(k=>data.moves.find(m=>m.id===k)?.power);if(m.power&&attacks.length>=1)continue;chosen.push(id);if(chosen.length===4)break;}return chosen;}

 const legal=data.learnsets.filter(l=>l.species_id===species.id&&l.level<=level),moves=new Map(data.moves.map(m=>[m.id,m]));
 const p=species.moveset_identity||{category:species.growth_percent.attack>=species.growth_percent.sp_attack?'PHYSICAL':'SPECIAL'};
 const sorted=legal.slice().sort((a,b)=>b.level-a.level||b.move_id-a.move_id),chosen=[];
 const pick=predicate=>{const l=sorted.find(l=>!chosen.includes(l.move_id)&&predicate(moves.get(l.move_id),l));if(l)chosen.push(l.move_id);};
 if(species.approvedRimebun){
  pick(m=>m.power>0&&m.type_id==='ICE'&&m.category==='SPECIAL');
  pick(m=>m.power>0&&m.type_id==='FAIRY'&&m.category==='SPECIAL');
  pick(m=>m.signature_owner_family===species.family_id);
  if(chosen.length<3)pick(m=>m.effects.some(e=>['heal','heal_by_format'].includes(e.effect_id)));
  pick(m=>m.category==='STATUS');
  for(const l of sorted)if(chosen.length<4&&!chosen.includes(l.move_id))chosen.push(l.move_id);
  return chosen.slice(0,4);
 }
 if(species.specialFightingToolkit)pick(m=>m.power>0&&m.type_id==='FIGHTING'&&m.category==='SPECIAL');
 if(p.critFocus)pick(m=>m.power>0&&species.types.includes(m.type_id)&&m.category===p.category&&m.effects.some(e=>e.effect_id==='high_critical_ratio'));
 if(!chosen.length)pick(m=>m.power>0&&species.types.includes(m.type_id)&&m.category===p.category);
 pick((m,l)=>m.category==='STATUS'&&l.identity_core);
 pick(m=>m.power>0&&m.category===p.category&&!species.types.includes(m.type_id));
 pick(m=>m.signature_owner_family===species.family_id);
 pick(m=>m.power>0&&m.priority>0&&m.category===p.category);
 for(const l of sorted)if(chosen.length<4&&!chosen.includes(l.move_id))chosen.push(l.move_id);
 return chosen.slice(0,4);
}
