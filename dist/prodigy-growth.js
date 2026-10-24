// Birth records stay immutable. Only completed evolutions multiply the bonus;
// accumulated evolution bonuses must never become a new breeding baseline.
export function inheritedGrowthRows(unit,key){
 const record=unit.breedingInheritance;
 return [record?.growth,...(record?.lineageGrowth||[])].filter(g=>g?.stat===key&&Number.isFinite(g.rate)&&Number.isFinite(g.baseline));
}
export function inheritedGrowthRate(unit,key){return Math.max(0,...inheritedGrowthRows(unit,key).map(g=>g.rate));}
export function inheritedGrowthBonus(unit,key){return Math.max(0,...inheritedGrowthRows(unit,key).map(g=>g.rate-g.baseline));}
export function prodigyMultiplier(unit){
 const history=unit.evolutionHistory||[];
 let form=unit.breedingInheritance?.speciesId||history[0]?.from||unit.species?.id,steps=0;
 for(const h of history)if(h.from===form&&h.to!==form){form=h.to;steps++;}
 return 1+steps;
}
export function prodigyGrowthBonus(unit,key){return inheritedGrowthBonus(unit,key)*prodigyMultiplier(unit);}
