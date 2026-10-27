import {restoreHP,healingMultiplier} from './abilities.js?v=0.90.47';
const item=(key,id,name,price,text,extra={})=>({key,id,name,price,text,icon:'assets/cossenne/'+id+'.webp',...extra});
export const SPECIALIST_FOODS=[
 item('resinLoaves','resin-loaf','Resin Loaf',1200,'8× capture strength for Bug or Grass types; 1× otherwise.',{types:['BUG','GRASS']}),
 item('mineralCrumbles','mineral-crumble','Mineral Crumble',1200,'8× capture strength for Rock or Ground types; 1× otherwise.',{types:['ROCK','GROUND']}),
 item('hearthfruit','hearthfruit','Hearthfruit',1200,'8× capture strength for Fire types; 1× otherwise.',{types:['FIRE']}),
 item('tideParcels','tide-parcel','Tide Parcel',1200,'8× capture strength for Water types, in any ordinary wild encounter; 1× otherwise.',{types:['WATER']}),
 item('quickbites','quickbite','Quickbite',1000,'40× on round 1, 12× on round 2, 3× on round 3, then 1× from round 4. Refused food is consumed.'),
 item('slowStews','slow-stew','Slow Stew',1000,'Starts at 1× capture strength; gains 1× each round, with no upper limit. Refused food is consumed.')
];
export const SPECIALIST_MEDICINES=[
 item('fieldDressings','field-dressing','Field Dressing',900,'Restore up to 200 HP to a living partner.',{amount:200}),
 item('restorativeDraughts','restorative-draught','Restorative Draught',2600,'Restore 75% of maximum HP to a living partner.',{fraction:.75}),
 item('cleansingBalms','cleansing-balm','Cleansing Balm',1800,'Restore 45% of maximum HP and cure major status. Cannot revive a lost partner.',{fraction:.45,cure:true})
];
export const SPECIALIST_SUPPLIES=[...SPECIALIST_FOODS,...SPECIALIST_MEDICINES];
export const specialistFood=key=>SPECIALIST_FOODS.find(i=>i.key===key);
export const specialistMedicine=key=>SPECIALIST_MEDICINES.find(i=>i.key===key);
export function specialistStrength(key,enemy,round=1){const i=specialistFood(key);if(!i)return null;const r=Math.max(1,Math.floor(Number(round)||1));if(key==='quickbites')return [40,12,3][r-1]||1;if(key==='slowStews')return r;return i.types.some(t=>enemy?.species?.types?.includes(t))?8:1;}
export function medicinePreview(u,key){const i=specialistMedicine(key);if(!i||!u||u.dead||u.hp<=0)return {hp:0,cure:false,usable:false};const hp=Math.max(0,Math.min(u.maxHp-u.hp,Math.floor((i.amount||Math.max(1,Math.floor(u.maxHp*i.fraction)))*healingMultiplier(u)))),cure=!!(i.cure&&u.status);return {hp,cure,usable:hp>0||cure};}
export function useSpecialistMedicine(state,u,key){const p=medicinePreview(u,key),i=specialistMedicine(key);if(!p.usable||!(state[key]>0))return null;state[key]--;const hp=restoreHP(u,i.amount||Math.max(1,Math.floor(u.maxHp*i.fraction)));if(p.cure){u.status=null;u.statusTurns=0;u.toxicCounter=0;}return {hp,cured:p.cure};}
export function specialistBagHTML(state,medicine=false){return (medicine?SPECIALIST_MEDICINES:SPECIALIST_FOODS).map(i=>`<div class="bag-item-heading"><h3><img class="capture-food-icon" src="${i.icon}" alt="">${i.name}</h3><b>× ${state[i.key]||0}</b></div><p>${i.text}</p>${medicine?`<button data-special-medicine="${i.key}" ${state[i.key]>0?'':'disabled'}>Use on a partner</button>`:''}`).join('');}
