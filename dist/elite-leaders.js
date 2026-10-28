import {DATA} from './data.js?v=0.90.48';
import {EVOLUTIONS} from './evolution-data.js?v=0.90.48';
import {tunedEvolution} from './evolution-tuning.js?v=0.87.0';
import {legalMoves} from './route-roster.js?v=0.87.0';
import {rng} from './engine.js?v=0.90.48';
import {typeEffectiveness,TYPES} from './type-rules.js?v=0.87.0';

// Identity, specialty and level curve are authored; only the saved roster varies.
export const ELITE_LEADERS={
 'LDR-01':{type:'GROUND',town:'dorelem',title:'The Bastion of Dorelem',levels:[18,18,19,19,20,20]},
 'LDR-02':{type:'FAIRY',town:'philomere',title:'The Hospice Vigil',levels:[36,37,37,38,39,40]},
 'LDR-03':{type:'DARK',town:'cybressa',title:'The River’s Hidden Hand',levels:[40,40,41,41,42,42]},
 'LDR-04':{type:'GRASS',town:'cossenne',title:'The Orchard’s Guardian',levels:[55,56,57,58,59,60]},
 'LDR-05':{type:'WATER',town:'marasen',title:'Warden of Living Water',levels:[66,67,68,69,70,70]},
 'LDR-06':{type:'FIGHTING',town:'botrune',title:'The Iron Sentence',levels:[74,74,75,75,76,77]},
 'LDR-07':{type:'STEEL',town:'cayfen',title:'The Artisan’s Shield',levels:[88,88,89,90,91,92]},
 'LDR-08':{type:'PSYCHIC',town:'ramelle',title:'The Alabaster Oracle',levels:[100,100,101,102,103,105]}
};
export const eliteIdentity=t=>ELITE_LEADERS[t?.rematchOf||t?.id]||null;
const species=id=>DATA.species.find(s=>s.id===id);
export function leaderHash(text){let h=2166136261;for(const c of String(text))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0||1;}
function ancestry(id,seen=new Set()){
 if(seen.has(id))throw Error('Circular leader evolution');
 const prev=EVOLUTIONS.find(e=>e.to_species_id===id);if(!prev)return [];
 return [...ancestry(prev.from_species_id,new Set([...seen,id])),tunedEvolution(prev,species(prev.from_species_id))];
}
export function legalLeaderForm(s,level){
 const path=ancestry(s.id);let at=1;
 // Special branches are deliberately not rolled: no unearned item, story or stat
 // requirement is assumed. Their unevolved parents are excluded when due, too.
 for(const e of path){if(e.condition.method!=='LEVEL')return false;at=Math.max(at+1,e.condition.minimum_level||1);if(at>level)return false;}
 return !EVOLUTIONS.some(e=>e.from_species_id===s.id&&(tunedEvolution(e,s).condition.minimum_level||1)<=level);
}
const moveCache=new Map(),setCache=new Map(),rosterCache=new Map();
// Rematches train the same saved family forward; they never roll a new member.
export function advanceLeaderForm(id,level,type){
 const seen=new Set();
 while(!seen.has(id)){
  seen.add(id);
  const next=EVOLUTIONS.filter(e=>e.from_species_id===id&&e.condition.method==='LEVEL'&&tunedEvolution(e,species(id)).condition.minimum_level<=level&&species(e.to_species_id)?.types.includes(type)).sort((a,b)=>a.to_species_id.localeCompare(b.to_species_id))[0];
  if(!next)break;id=next.to_species_id;
 }
 return id;
}
export function leaderLegalMoves(s,level){
 const key=s.id+':'+level;if(moveCache.has(key))return moveCache.get(key);
 const legal=new Set(legalMoves(s.id,level));
 for(const m of DATA.moves)if(m.exchangeLesson&&m.tutorTypes?.some(t=>s.types.includes(t)))legal.add(m.id);
 const result=DATA.moves.filter(m=>legal.has(m.id)&&m.category&&!m.allyTarget&&!(m.effects||[]).some(e=>['relay','healing_relay','sacrifice','self_destruct'].includes(e.effect_id)));moveCache.set(key,result);return result;
}
const offence=s=>s.base_stats.attack>=s.base_stats.sp_attack?'PHYSICAL':'SPECIAL';
export function leaderMoves(s,level,role,type){
 const key=[s.id,level,role,type].join(':');if(setCache.has(key))return setCache.get(key);
 const legal=leaderLegalMoves(s,level),category=offence(s),chosen=[];
 const attackScore=m=>(m.power||0)*(m.accuracy==='ALWAYS'?1:(m.accuracy??100)/100)*(m.category===category?1.3:.7)*(s.types.includes(m.type_id)?1.5:1)+(m.priority>0?12:0);
 const attacks=legal.filter(m=>m.power>0).sort((a,b)=>attackScore(b)-attackScore(a));
 const take=m=>{if(m&&!chosen.includes(m))chosen.push(m);};
 take(attacks.find(m=>m.type_id===type)||attacks.find(m=>s.types.includes(m.type_id)));
 take(attacks.find(m=>!chosen.some(c=>c.type_id===m.type_id)));
 const support=legal.filter(m=>!m.power).map(m=>{let score=0;for(const e of m.effects||[]){
  if(['heal','heal_by_format'].includes(e.effect_id))score+=role==='bulwark'||role==='support'?100:30;
  if(e.effect_id==='screen')score+=role==='support'?110:45;
  if(e.effect_id==='inflict_status'&&e.target!=='SELF')score+=70;
  if(e.effect_id==='stat_stage'&&e.target==='SELF'&&e.stages>0&&(e.stats||[e.stat]).some(k=>[category==='PHYSICAL'?'attack':'sp_attack','speed'].includes(k)))score+=role==='ace'?100:45;
  if(e.effect_id==='protect')score+=role==='bulwark'?65:15;
  if(e.effect_id==='weather'&&(type==='WATER'&&e.weather==='RAIN'||type==='GRASS'&&e.weather==='SUN'))score+=role==='support'?120:15;
 }return {m,score:score*(m.accuracy==='ALWAYS'?1:(m.accuracy??100)/100)};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
 take(support[0]?.m);
 if(['support','bulwark'].includes(role))take(support.find(x=>!chosen.includes(x.m)&&!chosen.some(c=>c.effects?.some(e=>e.effect_id==='inflict_status')&&x.m.effects?.some(e=>e.effect_id==='inflict_status')))?.m);
 for(const m of attacks)if(chosen.length<4&&!chosen.some(c=>c.power&&c.type_id===m.type_id))take(m);
 for(const m of attacks)if(chosen.length<4)take(m);
 for(const {m} of support)if(chosen.length<4)take(m);
 const result=chosen.slice(0,4).map(m=>m.id);setCache.set(key,result);return result;
}
const poolCache=new Map();
export function leaderCandidatePool(type,level){const key=type+level;if(poolCache.has(key))return poolCache.get(key);const pool=DATA.species.filter(s=>s.types.includes(type)&&!s.legendaryRoamer&&!/legendary|mythic|unique/i.test((s.power_class||'')+' '+(s.role||''))&&legalLeaderForm(s,level)&&leaderLegalMoves(s,level).some(m=>m.power>0&&m.type_id===type)&&leaderMoves(s,level,'ace',type).length===4);poolCache.set(key,pool);return pool;}
function teamScore(team){
 const ss=team.map(x=>species(x.species_id)),second=new Set(ss.flatMap(s=>s.types)),physical=ss.filter(s=>offence(s)==='PHYSICAL').length;
 let score=second.size*12-Math.abs(3-physical)*12;
 for(const type of TYPES){const weak=ss.filter(s=>typeEffectiveness(type,s.types)>1).length,resist=ss.filter(s=>typeEffectiveness(type,s.types)<1).length;score-=Math.max(0,weak-3)*12;score+=resist&&weak?3:0;}
 const speed=ss.map(s=>s.base_stats.speed),bulk=ss.map(s=>s.base_stats.hp+s.base_stats.defence+s.base_stats.sp_defence);
 return score+(Math.max(...speed)-Math.min(...speed))/5+(Math.max(...bulk)-Math.min(...bulk))/15;
}
function abilitySlot(s,role){
 const scored=Object.entries(s.ability_names||{}).filter(([,n])=>n).map(([slot,n])=>({slot,score:/Intimid|Regener|Relay|Natural|Native Force|Adapt|Fortune|Warbond|Sage Mind|Iron Fist|Sheer|Counter|Contact|Rainrunner|Sunstride/i.test(n)?3:/Wayfarer|Doubloon|Rare|Finder|Pickup/i.test(n)?0:1}));
 return scored.sort((a,b)=>b.score-a.score)[0]?.slot||'primary';
}
export function eliteLeaderTeam(state,t){
 const spec=eliteIdentity(t);if(!spec||t.rematchOf||t.eliteLeader)return t;
 state.leaderTeams??={};
 let saved=state.leaderTeams[t.id];
 if(!saved){
  // Legacy migration is deterministic and uses stable save identity, never the
  // changing clock, visit count, victory flags or current battle RNG.
  state.leaderTeamSeed??=leaderHash(JSON.stringify([state.trainerTeamSeed,state.playerName,state.starter?.uid,state.party?.map(u=>[u.uid,u.growthSeed]),state.nextUnitId]));
  const seed=leaderHash(state.leaderTeamSeed+':'+t.id),random=rng(seed),number=Number(t.id.slice(-2)),roles=['support','physical','special','bulwark','speed','ace'];
  const cached=rosterCache.get(t.id+':'+seed);if(cached){state.leaderTeams[t.id]=structuredClone(cached);return eliteLeaderTeam(state,t);}
  let best=null,bestScore=-Infinity;
  const pools=spec.levels.map(l=>leaderCandidatePool(spec.type,l));
  for(let attempt=0;attempt<64;attempt++){
   const team=[],families=new Set();
   for(let i=0;i<6;i++){
    let pool=pools[i].filter(s=>!families.has(s.family_id||s.id));
    if(i===1||i===2){const preferred=pool.filter(s=>offence(s)===(i===1?'PHYSICAL':'SPECIAL'));if(preferred.length)pool=preferred;}
    if(i===3){const bulk=s=>s.base_stats.hp+s.base_stats.defence+s.base_stats.sp_defence,peak=Math.max(...pool.map(bulk));pool=pool.filter(s=>bulk(s)>=peak*.75);}
    if(i===4){const peak=Math.max(...pool.map(s=>s.base_stats.speed));pool=pool.filter(s=>s.base_stats.speed>=peak*.75);}
    if(i===5){const peak=Math.max(...pool.map(s=>s.bst));pool=pool.filter(s=>s.bst>=peak*.85);}
    if(!pool.length)throw Error('Insufficient legal leader pool: '+t.id);
    const s=pool[Math.floor(random()*pool.length)];families.add(s.family_id||s.id);
    const role=roles[i],stat=role==='bulwark'?'defence':role==='speed'?'speed':offence(s)==='PHYSICAL'?'attack':'sp_attack';
    const stats=[stat];if(number>=7&&(i===5||i===3))stats.push(stat==='speed'?'sp_defence':'speed');if(number===8&&i===5)stats.push('sp_defence');
    team.push({slot:i+1,species_id:s.id,level:spec.levels[i],leaderRole:role,ace:i===5,abilitySlot:abilitySlot(s,role),current_form_legal_move_ids:leaderLegalMoves(s,spec.levels[i]).map(m=>m.id),battle_move_ids:leaderMoves(s,spec.levels[i],role,spec.type),prodigy:{version:1,stat,stats:[...new Set(stats)],bonus:20+number*2},held_item_id:role==='support'?'HELD_VOTIVE_THREAD':role==='bulwark'?'HELD_PILGRIM_CUP':role==='speed'?'HELD_COURIERS_SPUR':'HELD_TYPE_SIGIL_'+spec.type});
   }
   const score=teamScore(team);if(score>bestScore){bestScore=score;best=team;}
  }
  saved=state.leaderTeams[t.id]={version:1,seed,type:spec.type,aceSlot:6,aceSpeciesId:best[5].species_id,team:best};
  if(rosterCache.size>=128)rosterCache.delete(rosterCache.keys().next().value);rosterCache.set(t.id+':'+seed,structuredClone(saved));
 }
 return {...t,team:structuredClone(saved.team),eliteLeader:true,specialty:spec.type,leaderTitle:spec.title,expeditionTeam:true,sourceHeldRoles:[],bagUses:t.bagUses??t.bag_count??1};
}
export function lockVisitedLeaderTeams(state,trainers,visited){for(const t of trainers)if(!t.rematchOf&&eliteIdentity(t)&&visited.includes(eliteIdentity(t).town))eliteLeaderTeam(state,t);}

