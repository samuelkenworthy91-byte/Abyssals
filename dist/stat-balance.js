// Starting-stat scaling is independent of rolled growth. Preserve the old baseline for exact save repair.
export const STAT_BALANCE_VERSION=1;
export const EVOLUTION_STAT_VERSION=1;
export function startingStats(species){if((species.approvedExpansion362||species.approvedRimebun)&&species.starting_stats)return {...species.starting_stats};return Object.fromEntries(Object.entries(species.base_stats).map(([key,value])=>[key,Math.max(1,Math.round(value*(key==='hp'?.5:.2)))]));}
function setHealth(unit,oldHp,oldMax){unit.maxHp=unit.stats.hp;unit.hp=oldHp<=0||unit.dead?0:Math.max(1,Math.min(unit.maxHp,Math.round(oldHp*unit.maxHp/oldMax)));}
export function migrateStats(unit){
 const base=startingStats(unit.species),legacy=unit.species.legacy_starting_stats||base;
 if(unit.statBalanceVersion!==STAT_BALANCE_VERSION){const oldMax=unit.maxHp,oldHp=unit.hp;for(const key of Object.keys(base))unit.stats[key]=Math.max(1,(key==='hp'?oldMax:unit.stats[key])-unit.species.base_stats[key]+legacy[key]);setHealth(unit,oldHp,oldMax);unit.statBalanceVersion=STAT_BALANCE_VERSION;}
 if(unit.evolutionStatVersion!==EVOLUTION_STAT_VERSION){
  if(unit.species.legacy_starting_stats){const oldMax=unit.maxHp,oldHp=unit.hp;for(const key of Object.keys(base))unit.stats[key]=(key==='hp'?oldMax:unit.stats[key])+base[key]-legacy[key];setHealth(unit,oldHp,oldMax);}
  unit.evolutionStatVersion=EVOLUTION_STAT_VERSION;
 }
 return unit;
}
