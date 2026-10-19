import {FULL_ENCOUNTERS,EXPANSION_HABITATS} from './full-encounters.js?v=0.87.0';
// Largest-remainder allocation preserves a 100-point table and positive sightings for every entry.
export function weightSlots(slots,total=100){
 if(!slots.length)return [];
 const sum=slots.reduce((n,s)=>n+s.weight,0),reserve=slots.length;
 if(reserve>total)throw Error('Encounter table exceeds available weight points');
 const scaled=slots.map(s=>{const q=s.weight/sum*(total-reserve);return {...s,weight:1+Math.floor(q),fraction:q%1};});
 let left=total-scaled.reduce((n,s)=>n+s.weight,0);
 for(const s of [...scaled].sort((a,b)=>b.fraction-a.fraction))if(left-->0)s.weight++;
 return scaled.map(({fraction,...s})=>s);
}
export function expandFullRoute(route){
 if(route.fullExpansion362)return route;
 const habitat=EXPANSION_HABITATS.find(h=>h.room===route.room);
 const tables=route.tables.map(table=>{
  const additions=FULL_ENCOUNTERS.filter(s=>s.room===route.room&&(s.phase==='BOTH'||s.phase===table.phase));
  if(habitat)return {...table,id:habitat.room+'-'+table.phase,area_id:habitat.room,slots:weightSlots(additions)};
  if(!additions.length)return table;
  const share=Math.min(35,additions.reduce((n,s)=>n+s.weight,0));
  return {...table,slots:[...weightSlots(additions,share),...weightSlots(table.slots,100-share)]};
 });
 return {...route,tables,fullExpansion362:true};
}
