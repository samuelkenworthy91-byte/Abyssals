// Stable, explicit habitats. Base forms arrive before their evolution levels.
export const TIDE_ORCHARD_HABITATS=[
 {room:'glassSluice',id:'515',min:18,max:20,day:8,night:5,reason:'Rillkit practises with clear sluicewater in sheltered channels.'},
 {room:'reedSanctuary',id:'516',min:28,max:30,day:5,night:8,reason:'Undertide patrols the quiet reed banks after dusk.'},
 {room:'sunkenShrine2',id:'517',min:52,max:55,day:3,night:6,reason:'Mournami keeps vigil in the flooded cloister; rare shrine guardian habitat.'},
 {room:'orchardCanopy',id:'518',min:26,max:28,day:8,night:5,reason:'Mewisp feeds in the sheltered subtropical fruit canopy.'},
 {room:'orchardVerge',id:'519',min:44,max:46,day:6,night:3,reason:'Purrchard favours intact fruit groves, away from the firebreak.'},
 {room:'pilgrimGrove2',id:'519',min:50,max:53,day:5,night:5,reason:'A secluded spring terrace provides berries and a safe place to sleep.'}
];
export function tideOrchardRoute(route){if(!route||route.tideOrchardExpanded)return route;const places=TIDE_ORCHARD_HABITATS.filter(h=>h.room===route.room);if(!places.length)return route;
 return {...route,tideOrchardExpanded:true,tables:route.tables.map(t=>{const added=places.map(h=>({species_id:h.id,min_level:h.min,max_level:h.max,weight:t.phase==='NIGHT'?h.night:h.day,rarity:'Uncommon',authoredSlot:true,tideOrchard:true})),share=added.reduce((n,s)=>n+s.weight,0),total=t.slots.reduce((n,s)=>n+s.weight,0);return {...t,slots:[...t.slots.map(s=>({...s,weight:s.weight*(100-share)/total})),...added]};})};}
