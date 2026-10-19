import {routeStage} from './route-progression.js?v=0.87.0';
import {legalForm} from './route-roster.js?v=0.87.0';
export function normalizeEncounterRoute(route){
 if(route.encountersAudited)return route;const stage=routeStage(route.room);if(!stage)return route;
 const tables=route.tables.map(table=>({...table,slots:table.slots.flatMap(s=>{
  const min=s.approvedExpansion362||s.authoredSlot?s.min_level:s.approvedExpansion?Math.max(s.min_level,stage?.min??s.min_level):stage?.min??s.min_level;
  const max=s.approvedExpansion362||s.authoredSlot?s.max_level:s.approvedExpansion?Math.min(s.max_level,stage?.max??s.max_level):stage?.max??s.max_level;
  if(!Number.isInteger(min)||!Number.isInteger(max)||max<min||!(s.weight>0))throw Error('Invalid encounter slot: '+route.room+' '+s.species_id);
  const runs=[];for(let level=min;level<=max;level++){const id=legalForm(s.species_id,level),last=runs.at(-1);if(last?.species_id===id)last.max_level=level;else runs.push({...s,species_id:id,min_level:level,max_level:level,authoredSlot:true});}
  return runs.map(r=>({...r,weight:s.weight*(r.max_level-r.min_level+1)/(max-min+1)}));
 })}));return {...route,tables,encountersAudited:true};
}
