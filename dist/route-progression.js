import {EXPANSION_HABITATS} from './full-encounters.js?v=0.90.52';
import {CAVE_FLOORS} from './exploration-data.js?v=0.90.52';
// Play-test route pacing overlay, deliberately separate from imported canon tables.
export const ROUTE_STAGES={
 march:{base:'march',stage:1,count:2,min:5,max:7},march2:{base:'march',stage:2,count:2,min:8,max:10},
 scrub:{base:'scrub',stage:1,count:2,min:11,max:13},scrub2:{base:'scrub',stage:2,count:2,min:14,max:16},
 tunnels:{base:'tunnels',stage:1,count:2,min:16,max:18},tunnels2:{base:'tunnels',stage:2,count:2,min:18,max:20},
 northRoad:{base:'northRoad',stage:1,count:3,min:20,max:22},northRoad2:{base:'northRoad',stage:2,count:3,min:23,max:25},northRoad3:{base:'northRoad',stage:3,count:3,min:26,max:28},
 hospiceRoad:{base:'hospiceRoad',stage:1,count:2,min:28,max:30},hospiceRoad2:{base:'hospiceRoad',stage:2,count:2,min:31,max:33},
 medicinePath:{base:'medicinePath',stage:1,count:2,min:33,max:35},medicinePath2:{base:'medicinePath',stage:2,count:2,min:36,max:38}
};
export const EXTRA_TRAINERS=[
 ['TRN-RT-001','Roadwatch Agnes de Clare','march',14,16,['010','014'],[7,7]],
 ['TRN-RT-002','Recruit William FitzRobert','march2',16,10,['013','018'],[9,10]],
 ['TRN-RT-003','Border Scout Robert Giffard','scrub',20,8,['025','027'],[12,13]],
 ['TRN-RT-004','Patrolwoman Matilda de Beaumont','scrub2',33,17,['010','033'],[15,16]],
 ['TRN-RT-005','Drainwatch Hugh le Ferrer','tunnels2',16,24,['090','101'],[19,19]],
 ['TRN-RT-006','Passage Guard Walter de Vesci','tunnels2',35,17,['038','057'],[20,20]],
 ['TRN-RT-007','Ridge Scout Khadija bint Musa','northRoad',12,24,['141','099'],[21,22]],
 ['TRN-RT-008','Caravan Guard Aisha bint Hasan','northRoad2',20,24,['045','051'],[24,25]],
 ['TRN-RT-009','Warden of the Road Yusuf ibn Ahmad','northRoad3',33,17,['066','160'],[27,28]],
 ['TRN-RT-010','Hospice Runner Fatima bint Ali','hospiceRoad',26,10,['060','141'],[29,30]],
 ['TRN-RT-011','Volunteer Maryam bint Yusuf','hospiceRoad2',33,17,['090','062'],[32,33]],
 ['TRN-RT-012','Medicine Escort Zaynab bint Ahmad','medicinePath',22,25,['110','051'],[34,35]],
 ['TRN-RT-013','Floodwatch Ibrahim ibn Salim','medicinePath2',33,17,['133','152'],[37,38]]
].map(([id,name,room,x,y,species,levels])=>({id,name,room,x,y,species,levels}));
for(const h of EXPANSION_HABITATS)ROUTE_STAGES[h.room]={base:h.room,stage:1,count:1,min:h.min,max:h.max,expansionHabitat:true};
for(const f of CAVE_FLOORS)ROUTE_STAGES[f.room]={base:f.room,stage:f.index+1,count:5,min:f.min,max:f.max,expansionHabitat:true,cave:true};
export const routeStage=room=>ROUTE_STAGES[room];
export function stageLevel(room,random){const s=routeStage(room);return s?s.min+Math.min(s.max-s.min,Math.floor(random()*(s.max-s.min+1))):null;}
export function extendRoutes(maps){
 const bases=['scrub','tunnels','northRoad','hospiceRoad','medicinePath'];
 for(const base of bases){const original=maps[base],last=original.gates[1],n=routeStage(base).count;
  original.base=base;original.bloom=!['scrub','tunnels'].includes(base);
  for(let i=2;i<=n;i++){const id=base+i;maps[id]={...original,name:original.name+' · '+i+' / '+n,base,stage:i,spots:[{id:'area-sign',label:'Route signpost',x:4,y:19}],props:[],road:[[1,17],[12,17],[12,i%2?10:24],[25,i%2?10:24],[25,17],[46,17]],grass:[[7,12,18,21],[27,12,40,22]],gates:[{id:id+'-back',label:original.name,x:1,y:17,to:i===2?base:base+(i-1),arrival:[44,17,'left'],door:true},{...last,id:i===n?last.id:id+'-forward',to:i===n?last.to:base+(i+1),action:i===n?last.action:undefined,arrival:i===n?last.arrival:[3,17,'right']}]};}
  original.gates[1]={...last,id:base+'-stage-forward',to:base+'2',arrival:[3,17,'right'],action:undefined};
  original.spots.filter(s=>s.id==='area-sign').forEach(s=>{s.x=4;s.y=19;});
 }
 maps.march2={name:'Civeton March · 2 / 2',base:'march',area:'CIV-01',bloom:false,terrain:'ridge',road:[[1,17],[12,17],[12,8],[25,8],[25,17],[46,17]],grass:[[6,6,19,12],[27,12,40,24]],spots:[{id:'area-sign',label:'March signpost',x:4,y:19},{id:'TRN-C01-003',label:'Scout Matilda de Warenne',x:32,y:24,sprite:2}],props:[],gates:[{id:'march2-back',label:'Civeton March clearing',x:1,y:17,to:'march',arrival:[44,17,'left'],door:true},{id:'route-forward',label:'Dorelem Scrub',x:46,y:17,to:'scrub',arrival:[3,17,'right'],action:'routeEnd',door:true}]};
 for(const [room,prev] of [['scrub','march2'],['tunnels','scrub2'],['dorelem','tunnels2'],['hospiceRoad','northRoad3'],['medicinePath','hospiceRoad2'],['philomere','medicinePath2']]){const gate=maps[room].gates.find(g=>g.x===1);gate.to=prev;}
 maps.scrub.spots=maps.scrub.spots.filter(s=>s.id!=='TRN-C02-002');maps.scrub2.spots.push({id:'TRN-C02-002',label:'Soldier Ralph de Bohun',x:31,y:20,sprite:2});
 for(const t of EXTRA_TRAINERS)if(maps[t.room])maps[t.room].spots.push({id:t.id,label:t.name,x:t.x,y:t.y,sprite:2,patrol:[[t.x,t.y],[t.x+2,t.y],[t.x+2,t.y+1],[t.x,t.y+1]]});
}

