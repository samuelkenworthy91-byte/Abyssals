import {BIRD_FAMILIES} from './bird-family.js?v=0.87.0';
import {routeStage} from './route-progression.js?v=0.90.40';
// Family indices match the approved artwork. New birds occupy duplicate common
// habitat slots; original local rarities and unique species remain available.
export const BIRD_HABITATS=[
 {family:7,room:'march',replace:'137',day:6,night:12},
 {family:16,room:'marchMeadow',replace:'040',day:10,night:4},
 {family:9,room:'scrub',replace:'081',day:8,night:5},
 {family:2,room:'northRoad',replace:'018',day:8,night:5},
 {family:0,room:'hospiceRoad',replace:'101',day:8,night:5},
 {family:4,room:'medicinePath',replace:'317',day:8,night:4},
 {family:3,room:'emberQuarry',replace:'023',day:8,night:5},
 {family:1,room:'stormBluffs',replace:'137',day:8,night:6},
 {family:11,room:'orchardCanopy',replace:'141',day:8,night:4},
 {family:12,room:'reedSanctuary',replace:'317',day:8,night:6},
 {family:5,room:'relicCrags',replace:'127',day:8,night:5},
 {family:17,room:'rivercause2',replace:'258',day:8,night:4},
 {family:10,room:'passFoothills',replace:'047',day:8,night:5},
 {family:15,room:'passRidge',replace:'055',day:6,night:3},
 {family:14,room:'passSummit',replace:'194',day:8,night:4},
 {family:6,room:'orchardBend',replace:'192',day:4,night:10},
 {family:8,room:'pilgrimGrove',replace:'101',day:8,night:5},
 {family:13,room:'greenTerrace',replace:'101',day:8,night:6}
];
const replaceable=new Set(['010','014','025','042','051','079','139','043','140','061','026','052','078','106']);
export function birdEncounterRoute(route){
 if(!route||route.birdsExpanded||!route.tables?.length)return route;
 const parent=route.room?.replace(/Trail[23]$/,''),base=routeStage(route.room)?.base;
 const habitat=BIRD_HABITATS.find(h=>h.room===parent||h.room===base);if(!habitat)return route;
 const species_id=BIRD_FAMILIES[habitat.family].baseId;
 return {...route,birdsExpanded:true,tables:route.tables.map(t=>{
  if(t.slots.some(s=>s.species_id===species_id))return t;
  const slots=t.slots.map(s=>({...s})),wanted=habitat[t.phase==='NIGHT'?'night':'day'];
  const replaced=slots.find(s=>s.species_id===habitat.replace)||slots.filter(s=>replaceable.has(s.species_id)&&s.weight>=14).sort((a,b)=>b.weight-a.weight)[0];
  if(!replaced)throw Error('No duplicate common slot for '+route.room+' '+species_id);
  const regular=slots.filter(s=>s.weight>=10),min=Math.min(...regular.map(s=>s.min_level)),max=Math.max(...regular.map(s=>s.max_level));
  const oldWeight=replaced.weight,delta=wanted-oldWeight;
  Object.assign(replaced,{species_id,min_level:min,max_level:max,weight:wanted,rarity:wanted>=8?'Uncommon':'Rare',authoredSlot:true,approvedBird:true});
  delete replaced.localRare;delete replaced.biodiversityResident;
  if(delta>0){let left=delta;for(const s of slots.filter(s=>s!==replaced&&s.weight>=10).sort((a,b)=>b.weight-a.weight)){const take=Math.min(left,s.weight-6);s.weight-=take;left-=take;if(left===0)break;}if(left>0)throw Error('No bird encounter budget: '+route.room);}
  else if(delta<0){const donor=slots.filter(s=>s!==replaced&&s.weight>=10).sort((a,b)=>b.weight-a.weight)[0];if(!donor)throw Error('No common bird budget recipient');donor.weight-=delta;}
  return {...t,slots};
 })};
}
