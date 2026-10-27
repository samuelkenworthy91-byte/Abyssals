import {DATA} from './data.js?v=0.90.41';
import {EVOLUTIONS} from './evolution-data.js?v=0.90.41';
import {tunedEvolution} from './evolution-tuning.js?v=0.87.0';
import {rootForm,legalForm,legalMoves} from './route-roster.js?v=0.87.0';
import {typeEffectiveness,TYPES} from './type-rules.js?v=0.87.0';
import {rng} from './engine.js?v=0.90.41';

// The shared type, six level slots and tactical school are permanent.
// Species and ace are chosen independently for each save, then never rerolled.
export const LEADER_SCHOOLS=Object.freeze({
 'LDR-01':{type:'STEEL',town:'dorelem',plan:'Iron discipline: screens and defensive pivots'},
 'LDR-02':{type:'FAIRY',town:'philomere',plan:'Hospice covenant: restoration and resilient special attackers'},
 'LDR-03':{type:'GROUND',town:'cybressa',plan:'Civic balance: hazard control and physical breakers'},
 'LDR-04':{type:'GRASS',town:'cossenne',plan:'Living orchard: recovery and field control'},
 'LDR-05':{type:'WATER',town:'marasen',plan:'Canal current: swift pivots and rain pressure'},
 'LDR-06':{type:'DARK',town:'botrune',plan:'Black tribunal: disruption and finishing priority'},
 'LDR-07':{type:'PSYCHIC',town:'cayfen',plan:'Studio mind: screens and precise special coverage'},
 'LDR-08':{type:'DRAGON',town:'ramelle',plan:'Hierophant ascent: setup and a formidable ace'}
});
export const isEightLeader=t=>!!LEADER_SCHOOLS[t?.rematchOf||t?.id];
const species=id=>DATA.species.find(s=>s.id===id);
const move=id=>DATA.moves.find(m=>String(m.id)===String(id));
const hash=value=>{let n=2166136261;for(const c of String(value))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0||1;};
const legendary=s=>!!(s.legendaryRoamer||s.mythic||s.legendary||s.unique||/legendary|mythic|unique|sovereign/i.test([s.power_class,s.role].join(' ')));
const minimum=p=>Number.isFinite(p.condition?.minimum_level)?p.condition.minimum_level:30;
const roleBySlot=['opener','breaker','wall','support','sweeper','ace'];
function legalStage(s,level,type){
 if(legalForm(s.id,level)!==s.id)return false;
 return !EVOLUTIONS.some(p=>p.from_species_id===s.id&&minimum(tunedEvolution(p,s))<=level&&species(p.to_species_id)?.types.includes(type));
}
function fullMoves(id,level){
 const ids=new Set(legalMoves(id,level)),seen=new Set([id]);let current=id;
 while(true){
  const p=EVOLUTIONS.find(p=>p.to_species_id===current&&!seen.has(p.from_species_id));
  if(!p)break;
  const ancestor=species(p.from_species_id);
  if(!ancestor)break;
  const ancestorLevel=Math.min(level,minimum(tunedEvolution(p,ancestor)));
  for(const mid of legalMoves(ancestor.id,ancestorLevel))ids.add(mid);
  seen.add(ancestor.id);current=ancestor.id;
 }
 return [...ids].map(move).filter(m=>m?.category);
}
const effects=m=>m.effects||[];
const utility=m=>effects(m).some(e=>['weather','terrain','screen','heal','heal_by_format','party_heal','pivot','healing_relay','relay','protect','effigy','inflict_status','recurring_status','stat_stage'].includes(e.effect_id));
function battleMoves(s,level,role,theme,covered){
 const pool=fullMoves(s.id,level),attack=pool.filter(m=>m.power>0),support=pool.filter(m=>m.category==='STATUS'&&utility(m)),chosen=[];
 const physical=(s.base_stats?.attack||0)>=(s.base_stats?.sp_attack||0);
 const attackScore=m=>{
  const accuracy=m.accuracy==='ALWAYS'?1:Number(m.accuracy??100)/100;
  return m.power*accuracy*(s.types.includes(m.type_id)?1.5:1)*(physical===(m.category==='PHYSICAL')?1.2:.85)+(covered.has(m.type_id)?0:20)+(m.priority>0?14:0);
 };
 const supportScore=m=>effects(m).reduce((score,e)=>{
  if(e.effect_id==='weather'&&((theme==='WATER'&&e.weather==='RAIN')||(theme==='GROUND'&&e.weather==='SAND')))return score+80;
  if(e.effect_id==='screen')return score+(role==='opener'||role==='wall'?80:45);
  if(['heal','heal_by_format','party_heal','healing_relay'].includes(e.effect_id))return score+(role==='wall'||role==='support'?80:42);
  if(['pivot','relay'].includes(e.effect_id))return score+70;
  if(['inflict_status','recurring_status'].includes(e.effect_id))return score+64;
  if(e.effect_id==='stat_stage'&&e.target==='SELF'&&e.stages>0)return score+(role==='ace'?80:42);
  if(e.effect_id==='terrain')return score+(theme==='GRASS'?68:28);
  return score+12;
 },0);
 const orderedAttack=[...attack].sort((a,b)=>attackScore(b)-attackScore(a)),orderedSupport=[...support].sort((a,b)=>supportScore(b)-supportScore(a));
 const push=m=>{if(m&&chosen.length<4&&!chosen.some(x=>x.id===m.id))chosen.push(m);};
 push(orderedAttack.find(m=>s.types.includes(m.type_id))||orderedAttack[0]);
 push(orderedAttack.find(m=>m.type_id!==chosen[0]?.type_id)||orderedAttack[1]);
 if(['opener','wall','support','ace'].includes(role))push(orderedSupport[0]);
 for(const m of orderedAttack)push(m);
 for(const m of orderedSupport)push(m);
 for(const m of pool)push(m);
 return chosen.map(m=>m.id);
}
function candidates(level,type){
 const families=new Map();
 for(const s of DATA.species){
  if(!s.types?.includes(type)||legendary(s)||!legalStage(s,level,type)||!fullMoves(s.id,level).some(m=>m.power>0))continue;
  const family=rootForm(s.id),bst=s.bst||Object.values(s.base_stats||{}).reduce((n,v)=>n+(Number(v)||0),0);
  const current=families.get(family);
  if(!current||bst>current.bst)families.set(family,{s,bst,family});
 }
 return [...families.values()];
}
function candidateScore(c,role,selected,theme,random){
 const {s,bst}=c,a=s.base_stats||{},bulk=(a.hp||0)+(a.defence||0)+(a.sp_defence||0),offence=Math.max(a.attack||0,a.sp_attack||0);
 const defensive=TYPES.filter(t=>typeEffectiveness(t,s.types)<=.5).length;
 const weaknesses=TYPES.filter(t=>typeEffectiveness(t,s.types)>1);
 const overlapping=selected.reduce((n,p)=>n+weaknesses.filter(t=>typeEffectiveness(t,p.s.types)>1).length,0);
 const secondary=s.types.filter(t=>t!==theme),novel=secondary.some(t=>!selected.some(p=>p.s.types.includes(t)));
 const roleScore=role==='wall'||role==='support'?bulk*.5:role==='sweeper'?(a.speed||0)*.8+offence*.65:role==='ace'?offence*.85+bulk*.3:offence*.65+bulk*.18;
 return roleScore+bst*.11+defensive*8+(novel?35:0)-overlapping*10+random()*25;
}
function rollTeam(t,theme,seed){
 const rand=rng(hash(seed+':'+t.id+':leader-school-v1')),chosen=[],used=new Set();
 for(let i=0;i<t.team.length;i++){
  const slot=t.team[i],role=roleBySlot[Math.min(i,5)],pool=candidates(slot.level,theme);
  const open=pool.filter(c=>!used.has(c.family)),available=open.length?open:pool;
  if(!available.length)throw Error('No legal '+theme+' roster for '+t.id+' at level '+slot.level);
  let best=null,score=-Infinity;
  for(const c of available){const x=candidateScore(c,role,chosen,theme,rand);if(x>score){score=x;best=c;}}
  used.add(best.family);
  const covered=new Set(chosen.flatMap(c=>c.coverage)),moves=battleMoves(best.s,slot.level,role,theme,covered);
  chosen.push({s:best.s,coverage:moves.map(move).filter(m=>m?.power).map(m=>m.type_id),
   slot:{...slot,slot:i+1,level:slot.level,species_id:best.s.id,
    current_form_legal_move_ids:fullMoves(best.s.id,slot.level).map(m=>m.id),battle_move_ids:moves}});
 }
 return chosen.map(x=>x.slot);
}
export function lockedLeaderRoster(state,t){
 const id=t?.rematchOf||t?.id,theme=LEADER_SCHOOLS[id];if(!theme)return t;
 state.leaderRosters??={version:1,seed:hash(Date.now()+':'+Math.random()),teams:{}};
 state.leaderRosters.teams??={};
 let team=state.leaderRosters.teams[id];
 if(!Array.isArray(team)||team.length!==t.team.length){team=rollTeam({...t,id},theme.type,state.leaderRosters.seed);state.leaderRosters.teams[id]=structuredClone(team);}
 const count=id==='LDR-08'?3:['LDR-06','LDR-07'].includes(id)?2:1;
 return {...t,ai_tier:'Leader',leaderTactician:true,leaderSchool:theme.type,leaderPlan:theme.plan,
  team:structuredClone(team),prodigyPolicy:{count,bonus:id==='LDR-08'?35:id==='LDR-07'?30:Math.max(20,16+Number(id.slice(-2))*2)},
  sourceHeldRoles:t.sourceHeldRoles?.length?t.sourceHeldRoles:[{slot:1,role:'STATUS'},{slot:3,role:'GUARD'},{slot:team.length,role:'OFFENSE'}]};
}
export function lockLeadersForRegion(state,room,trainers,prepare=t=>t){
 const target=Object.entries(LEADER_SCHOOLS).find(([,s])=>room===s.town||room?.startsWith(s.town+'Fort')||room?.startsWith(s.town+'Hall'));
 if(!target)return;
 const trainer=trainers.find(t=>t.id===target[0]);if(trainer)lockedLeaderRoster(state,prepare(trainer));
}
