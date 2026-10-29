import {EXPANSION_HABITATS} from './full-encounters.js?v=0.90.52';
export function installExpansionHabitats(maps){
 for(const h of EXPANSION_HABITATS){
  const parent=maps[h.parent],[x,y]=h.anchor,gateId='habitat-'+h.room;
  parent.sidePaths??=[];parent.sidePaths.push({gateId,points:[[x,y],[x,4]]});
  parent.gates.push({id:gateId,label:`Side path · ${h.name} · Lv. ${h.min}–${h.max}`,x,y:5,to:h.room,arrival:[3,17,'right'],door:true});
  parent.spots.push({id:'habitat-sign-'+h.room,label:h.name+' signpost',x:x-2,y:7,habitatRoom:h.room});
  maps[h.room]={name:h.name,base:h.room,expansionHabitat:true,bloom:parent.bloom,terrain:h.terrain,road:[[1,17],[10,17],[10,12],[23,12],[23,23],[38,23],[38,17],[46,17]],grass:[[5,5,20,10],[13,16,20,27],[26,5,41,16],[28,25,42,28]],props:[],spots:[{id:'area-sign',label:h.name+' sightings',x:4,y:18}],gates:[{id:h.room+'-back',label:'Return to '+parent.name,x:1,y:17,to:h.parent,arrival:[x,6,'down'],door:true},{id:h.room+'-loop',label:'Return to '+parent.name,x:46,y:17,to:h.parent,arrival:[x,6,'down'],door:true}]};
 }
}
