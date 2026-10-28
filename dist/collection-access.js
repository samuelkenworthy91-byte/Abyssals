import {EVOLUTIONS} from './evolution-data.js?v=0.90.48';
// All descendants of a branching evolution belong to that branch, including its later stages.
const children=new Map();for(const e of EVOLUTIONS){if(!children.has(e.from_species_id))children.set(e.from_species_id,[]);children.get(e.from_species_id).push(e.to_species_id);}
export const SPLIT_WILD_REPLACEMENTS={};
for(const [base,branches]of children)if(branches.length>1){const queue=[...branches],seen=new Set();while(queue.length){const id=queue.shift();if(seen.has(id))continue;seen.add(id);SPLIT_WILD_REPLACEMENTS[id]=base;queue.push(...children.get(id)||[]);}}
// First-form habitats deliberately sit on earlier roads, rather than demanding breeding.
export const FIRST_FORM_HABITATS={orchardCanopy:{id:'087',phase:'DAY',min:20,max:24},glassSluice:{id:'062',phase:'NIGHT',min:12,max:16}};
export function wildCollectionForm(id){return SPLIT_WILD_REPLACEMENTS[id]||id;}
export function collectionEncounterRoute(route){if(!route?.tables||route.collectionAccess===1)return route;const habitat=FIRST_FORM_HABITATS[route.room];return {...route,collectionAccess:1,tables:route.tables.map(t=>{let slots=t.slots.map(s=>({...s,species_id:wildCollectionForm(s.species_id)}));if(habitat&&t.phase===habitat.phase&&!slots.some(s=>s.species_id===habitat.id)){const donor=slots.reduce((a,b)=>a.weight>b.weight?a:b);if(donor.weight>4){donor.weight-=4;slots.push({species_id:habitat.id,weight:4,min_level:habitat.min,max_level:habitat.max,rarity:'Rare',authoredSlot:true});}}return {...t,slots};})};}

