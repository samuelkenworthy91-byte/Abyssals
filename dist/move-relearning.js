import {normalizeTeamcraftUnit} from './teamcraft-progress.js?v=0.90.52';
import {DATA} from './data.js?v=0.90.52';
import {relearnPool} from './evolution.js?v=0.90.52';
import {rememberOwnedMoves} from './learning-access.js?v=0.90.52';
// Revalidate at confirmation; never charge money or refresh unrelated moves.
export function applyRelearn(unit,moveId,slot){
 if(!unit||unit.dead||unit.hp<=0)return false;
 const move=relearnPool(unit).find(m=>m.id===moveId);if(!move)return false;
 if(slot===-1){if(unit.moves.length>=4)return false;rememberOwnedMoves(unit);unit.moves.push({...move,left:move.pp});}
 else {if(!Number.isInteger(slot)||slot<0||slot>=unit.moves.length)return false;rememberOwnedMoves(unit);unit.moves[slot]={...move,left:move.pp};}
 rememberOwnedMoves(unit);
 normalizeTeamcraftUnit(unit,DATA.moves);return true;
}

