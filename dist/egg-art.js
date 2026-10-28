import {DATA} from './data.js?v=0.90.48';
import {TYPES} from './type-rules.js?v=0.90.41';
// Derive appearance from the already fixed hatchling, never reroll or mutate an egg.
export function eggTypes(egg){
 const species=DATA.species.find(s=>s.id===egg?.speciesId);
 const types=(species?.types||[]).filter(t=>TYPES.includes(t));
 return [types[0]||'NORMAL',types[1]||types[0]||'NORMAL'];
}
export function eggArtHTML(egg,{ready=false}={}){
 const [left,right]=eggTypes(egg),label=(left===right?left:left+' / '+right)+' Abyssal egg';
 return `<span class="type-egg${ready?' egg-ready':''}" role="img" aria-label="${label}" title="${label}"><img class="egg-half-left" src="assets/eggs/${left.toLowerCase()}.webp" alt=""><img class="egg-half-right" src="assets/eggs/${right.toLowerCase()}.webp" alt=""></span>`;
}
