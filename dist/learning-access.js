// One source of truth for learning previews and confirmation. CODEX is a route,
// not an automatic level-up entitlement. Already owned techniques remain valid.
export function actualFormIds(unit){
 return new Set([unit?.species?.id,...(unit?.evolutionHistory||[]).flatMap(h=>[h.from,h.to])]);
}
export function rememberOwnedMoves(unit){
 if(!unit)return;
 unit.learnedMoveIds=[...new Set([...(unit.learnedMoveIds||[]),...(unit.moves||[]).map(m=>m.id)])];
}
export function learningState(unit,row,{preview=false}={}){
 if(preview)return {available:false,label:'Evolution preview'};
 const known=new Set([...(unit?.learnedMoveIds||[]),...(unit?.moves||[]).map(m=>m.id)]);
 if(row.method==='CODEX')return known.has(row.move_id)
  ?{available:true,label:'Previously learned · free relearning'}
  :{available:false,label:'Codex teaching · Grand Exchange'};
 if(row.level<=unit.level&&actualFormIds(unit).has(row.species_id))
  return {available:true,label:'Available at Walter’s free move relearning'};
 return {available:false,label:'Upcoming level choice'};
}
export function relearnMoveIds(unit,rows){
 const ids=actualFormIds(unit);
 return [...new Set([
  ...rows.filter(l=>ids.has(l.species_id)&&learningState(unit,l).available).map(l=>l.move_id),
  ...(unit.learnedMoveIds||[]),...(unit.legacyRelearnMoveIds||[]),
  ...(unit.breedingInheritance?.moveId?[unit.breedingInheritance.moveId]:[])
 ])];
}
