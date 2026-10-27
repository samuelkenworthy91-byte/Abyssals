import {EVOLUTIONS} from './evolution-data.js?v=0.90.47';
// Count actual evolution steps, including item and branching evolutions.
const parents=new Map(),children=new Set();
for(const e of EVOLUTIONS){if(!parents.has(e.to_species_id))parents.set(e.to_species_id,[]);parents.get(e.to_species_id).push(e.from_species_id);children.add(e.from_species_id);}
export function evolutionStage(id,seen=new Set()){
 if(seen.has(id))return 0;
 const previous=parents.get(id);if(!previous?.length)return children.has(id)?0:'single';
 return 1+Math.max(...previous.map(p=>{const n=evolutionStage(p,new Set([...seen,id]));return typeof n==='number'?n:0;}));
}
export function matchesPartner(u,filters,party=[]){
 const types=u.species.types,chosen=[filters.type,filters.secondType].filter(t=>t&&t!=='ALL');
 const scope=filters.scope||'ALL',active=party.some(p=>p.uid===u.uid);
 return (scope==='ALL'||(scope==='PARTY'?active:!active))&&chosen.every(t=>types.includes(t))&&
  (filters.stage===undefined||filters.stage==='ALL'||String(evolutionStage(u.species.id))===filters.stage)&&
  `${u.nickname||''} ${u.species.name}`.toLowerCase().includes((filters.search||'').trim().toLowerCase());
}
