import {canSwitch,has} from './abilities.js?v=0.90.24';
// Escape immunity wins before the trap check and uses no combat random roll.
export function wildEscape(unit,random){
 if(has(unit,'Wayfarer','Bindproof'))return {success:true,reason:'ability'};
 if(!canSwitch(unit))return {success:false,reason:'trapped'};
 return {success:random()>=.2,reason:'chance'};
}
