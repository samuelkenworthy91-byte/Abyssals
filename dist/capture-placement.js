// Record the choice with the creature so saving/reloading cannot bypass it.
export function holdCapturedPartner(state,unit){
 if([...state.party,...state.reserve].some(u=>u.uid===unit.uid))return false;
 unit.capturePlacementPending=true;state.reserve.push(unit);return true;
}
export function placeCapturedPartner(state,uid,destination){
 const unit=[...state.party,...state.reserve].find(u=>u.uid===uid);
 if(!unit?.capturePlacementPending||!['party','reserve'].includes(destination))return false;
 if(destination==='party'&&state.party.filter(u=>u.uid!==uid).length>=6)return false;
 state.party=state.party.filter(u=>u.uid!==uid);state.reserve=state.reserve.filter(u=>u.uid!==uid);
 if(destination==='reserve'){unit.hp=unit.maxHp;unit.status=null;unit.confusion=0;unit.stages={};unit.moves.forEach(m=>m.left=m.pp);state.reserve.push(unit);}
 else {state.party.push(unit);if(!state.leadUid)state.leadUid=uid;}
 delete unit.capturePlacementPending;return true;
}
