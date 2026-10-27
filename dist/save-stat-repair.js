import {DATA} from './data.js?v=0.90.47';
import {migrateStats} from './stat-balance.js?v=0.87.0';
// Repair stored slots as they are read, including reserve, memorial and suspended battles.
// Only baseline differences change; earned growth, EXP, moves and life records are retained.
export function repairSaveStats(snapshot){
 let changed=false;
 const units=[...(snapshot.state?.party||[]),...(snapshot.state?.reserve||[]),...(snapshot.state?.dead||[]),...(snapshot.battle?.enemies||[]),...(snapshot.battle?.alliedRivet?[snapshot.battle.alliedRivet]:[])];
 for(const raw of units){const species=DATA.species.find(s=>s.id===raw.species?.id);if(!species||!raw.stats)continue;
  const unit=migrateStats({...raw,species,stats:{...raw.stats}});
  for(const key of ['stats','hp','maxHp','statBalanceVersion','evolutionStatVersion'])if(JSON.stringify(raw[key])!==JSON.stringify(unit[key])){raw[key]=unit[key];changed=true;}
 }
 return changed;
}
