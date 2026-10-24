import {DATA} from './data.js?v=0.90.30';
import {EVOLUTIONS} from './evolution-data.js?v=0.87.0';
import {tunedEvolution} from './evolution-tuning.js?v=0.87.0';
import {startingStats} from './stat-balance.js?v=0.87.0';
import {growLevel,normalizeProgress,initializeProgress,growthPercent} from './progression.js?v=0.90.31';
import {promote} from './evolution.js?v=0.90.31';

// Sparse introductions before the afterlife. These are fixed rosters, not rolls
// made when the challenge is accepted, so warning and encounter always agree.
export const TRAINER_PRODIGIES={
 'TRN-C05-005':{count:1,bonus:20},
 'TRN-MR-INNER':{count:1,bonus:25},
 'TRN-BT-GUARD-3':{count:1,bonus:25},
 'TRN-FN-TERRACE':{count:1,bonus:25},
 'TRN-FN-SPORE':{count:2,bonus:30},
 'TRN-FN-LAST':{count:2,bonus:35},
 'LDR-07':{count:2,bonus:30},
 'LDR-08':{count:3,bonus:35}
};
const species=id=>DATA.species.find(s=>s.id===id);
const breedable=s=>s&&!s.legendaryRoamer&&!/legendary|mythic|unique/i.test((s.power_class||'')+' '+(s.role||''));
function evolutionPath(id,seen=new Set()){
 if(seen.has(id))throw Error('Circular evolution path: '+id);
 const previous=EVOLUTIONS.find(e=>e.to_species_id===id);
 return previous?[...evolutionPath(previous.from_species_id,new Set([...seen,id])),tunedEvolution(previous,species(previous.from_species_id))]:[];
}
export function trainerProdigyPolicy(t){
 if(t.prodigies===false)return null;
 if(t.prodigyPolicy)return t.prodigyPolicy;
 // Reserved Hell trainers receive stronger teams through the same warning and
 // growth path. No Hell rooms or story events are invented by this update.
 if(t.arc==='hell'||t.region==='hell'||['Warden','Final','Severin'].includes(t.ai_tier))return {count:['Final','Severin'].includes(t.ai_tier)?3:2,bonus:50};
 return TRAINER_PRODIGIES[t.rematchOf||t.id]||null;
}
export function withTrainerProdigies(t){
 const policy=trainerProdigyPolicy(t);if(!policy)return t;
 const team=t.team.map(s=>({...s})),candidates=team.filter(s=>breedable(species(s.species_id))).sort((a,b)=>b.level-a.level||b.slot-a.slot);
 for(const slot of candidates.slice(0,policy.count)){
  if(slot.prodigy)continue;
  const s=species(slot.species_id),moves=(slot.battle_move_ids||slot.current_form_legal_move_ids||[]).map(id=>DATA.moves.find(m=>m.id===id));
  const physical=moves.filter(m=>m?.power>0&&m.category==='PHYSICAL').length,special=moves.filter(m=>m?.power>0&&m.category==='SPECIAL').length;
  const stat=physical===special?(growthPercent(s,'attack')>=growthPercent(s,'sp_attack')?'attack':'sp_attack'):physical>special?'attack':'sp_attack';
  slot.prodigy={version:1,stat,bonus:policy.bonus};
 }
 return {...t,team};
}
export function trainerProdigyWarning(t){
 const prodigies=t.team.filter(s=>s.prodigy);
 if(!prodigies.length)return '';
 return `Warning: ${t.name} has ${prodigies.length===1?'a Prodigy':'Prodigies'} — ${prodigies.map(s=>species(s.species_id)?.name||'an Abyssal').join(', ')}. Their unusually strong growth builds further with each evolution. Prepare your team before accepting.`;
}
export function initializeTrainerGrowth(unit,slot){
 if(!slot.prodigy)return initializeProgress(unit);
 const {stat,bonus}=slot.prodigy;
 if(!['hp','attack','defence','sp_attack','sp_defence','speed'].includes(stat)||!Number.isFinite(bonus)||bonus<=0)throw Error('Invalid trainer Prodigy');
 // Train from the birth form and actually promote at the legal levels. Merely
 // changing a finished unit's label/rates would leave its battle stats ordinary.
 normalizeProgress(unit);
 const level=unit.level,target=unit.species,path=evolutionPath(target.id),birth=species(path[0]?.from_species_id)||target,baseline=growthPercent(birth,stat);
 unit.breedingInheritance={version:2,speciesId:birth.id,donorIndex:1,growth:{stat,baseline,donorRate:baseline+bonus,rate:baseline+bonus},lineageGrowth:[],moveId:null};
 unit.species=birth;unit.stats=startingStats(birth);unit.hp=unit.maxHp=unit.stats.hp;unit.level=1;unit.exp=0;unit.evolutionHistory=[];unit.evolutionBlockedLevel=0;
 let step=0;
 for(let n=2;n<=level;n++){
  unit.exp=100;growLevel(unit);
  if(path[step]&&n>=path[step].condition.minimum_level){if(promote(unit,path[step]))step++;}
 }
 if(unit.species.id!==target.id)throw Error('Trainer Prodigy evolution is not legal at level '+level+': '+target.id);
 unit.exp=0;unit.hp=unit.maxHp;unit.evolutionBlockedLevel=unit.level;
 return unit;
}
