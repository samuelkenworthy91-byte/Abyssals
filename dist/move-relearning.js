import {relearnPool} from './evolution.js?v=0.87.0';
// Revalidate at confirmation; never charge money or refresh unrelated moves.
export function applyRelearn(unit,moveId,slot){
 if(!unit||unit.dead||unit.hp<=0)return false;
 const move=relearnPool(unit).find(m=>m.id===moveId);if(!move)return false;
 if(slot===-1){if(unit.moves.length>=4)return false;unit.moves.push({...move,left:move.pp});}
 else {if(!Number.isInteger(slot)||slot<0||slot>=unit.moves.length)return false;unit.moves[slot]={...move,left:move.pp};}
 return true;
}
