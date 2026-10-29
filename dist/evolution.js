import {branchEvolutionAllowed} from './branch-families.js?v=0.90.52';
import {relearnMoveIds} from './learning-access.js?v=0.90.52';
import {statEvolutionAllowed} from './evolution-renewal.js?v=0.90.52';
import {tunedEvolution} from './evolution-tuning.js?v=0.90.52';
import {startingStats,migrateStats} from './stat-balance.js?v=0.90.52';
import {DATA} from './data.js?v=0.90.52';
import {EVOLUTIONS} from './evolution-data.js?v=0.90.52';
import {STAT_KEYS} from './progression.js?v=0.90.52';

export function eligibleEvolutions(unit,state={},itemId=null){
 if(!unit||unit.dead||unit.hp<=0||(unit.evolutionHistory||[]).some(e=>e.level===unit.level))return [];
 return EVOLUTIONS.map(e=>tunedEvolution(e,DATA.species.find(s=>s.id===e.from_species_id))).filter(e=>{const c=e.condition;if(e.from_species_id!==unit.species.id||unit.level<c.minimum_level)return false;
  if(c.method==='STAT')return !itemId&&unit.level>(unit.evolutionBlockedLevel??0)&&statEvolutionAllowed(unit,e);
  if(c.method==='LEVEL')return !itemId&&unit.level>(unit.evolutionBlockedLevel??0);
  if(c.method==='ITEM')return branchEvolutionAllowed(e,state)&&c.item_id===itemId&&(state.evolutionItems?.[itemId]||0)>0;
  // A committed enum is authoritative; history is a compatibility fallback only.
  const choice=state[c.state_field]??state.storyChoices?.[c.state_field];
  return !itemId&&unit.level>(unit.evolutionBlockedLevel??0)&&(choice!==undefined?choice===c.equals:(state.storyHistory||[]).includes(c.history_trigger));
 });
}
export function promote(unit,path){
 if(!statEvolutionAllowed(unit,path)||unit.dead||unit.hp<=0||unit.species.id!==path.from_species_id||unit.level<path.condition.minimum_level||(unit.evolutionHistory||[]).some(e=>e.level===unit.level)||(path.condition.method!=='ITEM'&&unit.level<=(unit.evolutionBlockedLevel??0)))return null;
 const target=DATA.species.find(s=>s.id===path.to_species_id);if(!target)return null;
 migrateStats(unit);
 const from=unit.species.id,oldHp=unit.hp,oldMax=unit.maxHp;
 const rows=STAT_KEYS.map(key=>{const before=key==='hp'?unit.maxHp:unit.stats[key],gain=startingStats(target)[key]-startingStats(unit.species)[key];unit.stats[key]=before+gain;return {key,before,after:before+gain,gain};});
 unit.maxHp=unit.stats.hp;unit.hp=Math.max(1,Math.min(unit.maxHp,Math.floor(oldHp*unit.maxHp/oldMax+.5)));
 unit.evolutionHistory??=[];unit.evolutionHistory.push({pathId:path.id,from,to:target.id,level:unit.level});unit.species=target;unit.evolutionBlockedLevel=unit.level;
 return {kind:'evolved',uid:unit.uid,from,to:target.id,rows};
}
export function levelMoves(unit){return DATA.learnsets.filter(l=>l.species_id===unit.species.id&&l.level===unit.level&&l.method==='LEVEL_UP');}
export function promoteUsingItem(unit,path,state){if(path.condition.method!=='ITEM'||!eligibleEvolutions(unit,state,path.condition.item_id).some(p=>p.id===path.id))return null;const card=promote(unit,path);if(card)state.evolutionItems[path.condition.item_id]--;return card;}
export function entryMoves(unit){return DATA.learnsets.filter(l=>l.species_id===unit.species.id&&l.level===0);}
export function relearnPool(unit){const equipped=new Set(unit.moves.map(m=>m.id));
 return relearnMoveIds(unit,DATA.learnsets).map(id=>DATA.moves.find(m=>m.id===id)).filter(m=>m?.category&&!equipped.has(m.id));
}


