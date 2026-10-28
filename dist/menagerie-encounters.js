import {DATA} from './data.js?v=0.90.48';
// Reachable habitats; inherited side-campaign tables offer higher levels.
export const MENAGERIE_HABITATS=[
 ['glassSluice','389','BOTH',18,20,8],['relicCrags','389','BOTH',31,33,8],
 ['stormBluffs','392','BOTH',23,25,8],['stormBluffs','404','BOTH',24,25,8],
 ['orchardCanopy','394','NIGHT',26,28,5],['orchardCanopy','399','DAY',26,28,5],['orchardCanopy','410','BOTH',26,28,8],
 ['saltFlats','401','BOTH',34,38,5],['moonlitDepths','406','NIGHT',36,38,5],
 ['stormBluffsTrail3','407','BOTH',27,29,8]
].map(([room,species_id,phase,min_level,max_level,weight])=>({room,species_id,phase,min_level,max_level,weight,rarity:weight===5?'Rare':'Uncommon',approvedMenagerie:true,authoredSlot:true}));
export function menagerieEncounterRoute(route){if(!route||route.menagerieExpanded)return route;const additions=MENAGERIE_HABITATS.filter(s=>s.room===route.room);if(!additions.length)return route;
 const themes={orchardCanopy:['GRASS','POISON'],glassSluice:['WATER'],moonlitDepths:['WATER']};
 return {...route,menagerieExpanded:true,tables:route.tables.map(table=>{const extra=additions.filter(s=>s.phase==='BOTH'||s.phase===table.phase);if(!extra.length)return table;let budget=extra.reduce((n,s)=>n+s.weight,0);const slots=table.slots.map(s=>({...s}));const types=themes[route.room]||[];const themed=s=>DATA.species.find(v=>v.id===s.species_id)?.types.some(t=>types.includes(t));const candidates=slots.filter(s=>!s.localRare&&s.weight>5).sort((a,b)=>Number(themed(a))-Number(themed(b))||b.weight-a.weight);for(const s of candidates){const take=Math.min(budget,s.weight-1);s.weight-=take;budget-=take;if(budget<=0)break;}if(budget>0)throw Error('Insufficient encounter weight in '+route.room);return {...table,slots:[...slots,...extra.map(s=>({...s}))]};})};}
