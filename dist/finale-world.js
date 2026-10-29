import {SUN_ROAD,SPORE_ROAD} from './finale-data.js?v=0.90.52';
const gate=(id,label,x,y,to,arrival,action='finale-gate')=>({id,label,x,y,to,arrival,action,door:true});
const npc=(id,label,x,y,revoltCharacter)=>({id,label,x,y,sprite:0,revoltCharacter});
const prop=(id,label,x,y)=>({id,label,x,y,questProp:true});
const rect=(x,y,a,b)=>[x,y,a,b];
export function finaleWalkable(m,x,y){if(!m.finale)return null;if(m.finaleSolids?.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d))return false;return m.finaleWalk.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d);}
export function installFinaleWorld(maps,doors){
 const base=(id,name,art,y=17,walk=null)=>maps[id]={name,area:id,bloom:true,hub:false,terrain:'finale',finale:true,finaleArt:art,finaleWalk:walk||[rect(1,y-2,46,y+2),rect(5,13,43,24)],finaleSolids:[],road:[[1,y],[46,y]],sidePaths:[],grass:[],props:[],spots:[],gates:[]};
 for(const [entries,previous,next]of [[SUN_ROAD,'botrune','cayfen'],[SPORE_ROAD,'cayfen','ramelle']])for(const [i,r]of entries.entries()){
  const [id,name,,,art]=r,y=id==='burialGrove'?24:17,m=base(id,name,({'sporeRim':'spore-rim','sporeDepths':'spore-depths','sporeBridge':'spore-bridge'}[id]||art),y);m.grass=id==='burialGrove'?[]:[[6,14,13,15],[33,20,41,23]];
  if(id==='burialGrove')m.finaleWalk=[rect(1,21,46,27),rect(17,15,31,25)];
  if(id.startsWith('spore')){m.finaleWalk=[rect(1,15,46,19),rect(7,13,14,22),rect(20,13,29,22),rect(34,13,42,22)];m.grass=[[8,13,13,14],[35,20,41,22]];}
  const prev=i?entries[i-1][0]:previous,py=prev==='burialGrove'?24:prev==='botrune'?24:17,to=i<entries.length-1?entries[i+1][0]:next,ty=to==='burialGrove'?24:17;
  m.gates=[gate(id+'-back','Return · '+prev,1,y,prev,[44,py,'left']),gate(id+'-forward','Continue · '+to,46,y,to,[3,ty,'right'])];
 }
 Object.assign(maps.botrune.gates.find(g=>g.id==='botrune-next'),{label:'Willowmere · road to Cayfen',to:'sunBank',arrival:[3,17,'right'],action:'finale-entry'});
 maps.sunBank.spots=[npc('TRN-FN-ROAD','Willowmere ranger Alice',32,20,'TRN-SC-orchardCanopy-0'),prop('fn-road-sign','Willowmere waystone',10,20)];
 maps.burialGrove.spots=[npc('fn-burial','Walter · the Remembering Tree',24,20,'CHR-AERIC'),prop('fn-pate-grave','Pate · remember him',20,16),prop('fn-trade-grave','Trade · remember him',29,16)];
 maps.sunFalls.spots=[npc('fn-guan-keeper','Crossing keeper · The Oath at the Crossing',16,20,'REV-MARYAM')];
 maps.sunTerraces.spots=[npc('fn-fei-keeper','Bridge keeper · The Strength to Hold',16,20,'REV-HUGH'),npc('TRN-FN-TERRACE','Terrace keeper Zaynab',35,20,'TRN-SC-orchardCanopy-1')];
 const branch=(parent,key,id,name,art)=>{const y=17,m=base(id,name,art,y,[rect(1,15,46,24),rect(12,8,37,24)]);m.grass=[[6,20,11,23],[34,20,41,23]];m.gates=[gate(id+'-back','Return to Willowmere',1,y,parent,[24,20,'down']),gate(id+'-forward','Enter the guardian sanctuary',46,y,key==='guan'?'guanShrine':'feiCrossing',[3,17,'right'])];maps[parent].gates.push(gate('fn-'+key+'-entry',name,24,21,id,[3,17,'right']));maps[parent].sidePaths.push({points:[[24,17],[24,21]]});return m;};
 branch('sunFalls','guan','guanApproach','Peach Grove · The Oath Road','terraces').spots=[prop('fn-guan-clue','Read the guardian’s inscription',24,12),npc('TRN-FN-GUAN','Shrine requisitioner',36,18,'TRN-SC-stormBluffs-0')];
 const guan=base('guanShrine','Peach Grove · Guanrong’s Oath Shrine','guan',17,[rect(1,15,46,24),rect(12,8,38,24)]);guan.gates=[gate('guanShrine-back','Return to The Oath Road',1,17,'guanApproach',[44,17,'left'])];guan.spots=[prop('fn-guan-clue','Read the guardian’s inscription',24,11),prop('fn-guan-rune-shelter','Rune · Shelter',15,14),prop('fn-guan-rune-faith','Rune · Faith',32,14),prop('fn-guan-rune-crossing','Rune · Crossing',36,21),prop('fn-guan-encounter','Guanrong · the oath guardian',24,16)];
 branch('sunTerraces','fei','feiApproach','Peach Grove · The Burdened Crossing','road').spots=[prop('fn-fei-clue','Read the bridgekeeper’s tally',24,12),npc('TRN-FN-FEI','Bridge toll captain',36,18,'TRN-SC-stormBluffs-1')];
 const fei=base('feiCrossing','Peach Grove · Feirong’s Held Bridge','fei',17,[rect(1,15,46,19),rect(5,12,17,24),rect(30,12,42,24)]);fei.gates=[gate('feiCrossing-back','Return to The Burdened Crossing',1,17,'feiApproach',[44,17,'left'])];fei.spots=[prop('fn-fei-clue','Read the bridgekeeper’s tally',10,13),...[[9,20],[14,20],[34,20]].map(([x,y],i)=>prop('fn-fei-weight-'+i,'Bridge windlass '+(i+1),x,y)),prop('fn-fei-encounter','Feirong · the crossing guardian',24,17)];
 const town=(id,name,art)=>{const m=base(id,name,art,17,[rect(1,15,46,21),rect(8,10,12,29),rect(35,10,40,29),rect(19,10,29,29),rect(6,26,42,29)]);m.hub=true;m.area=null;m.finaleSolids=[rect(2,3,17,9),rect(31,3,45,9),rect(3,22,17,26),rect(31,22,45,26)];return m;};
 const cay=town('cayfen','Cayfen · City of the Open Studios','cayfen');cay.gates=[gate('cayfen-back','Willowmere flowering terraces',1,17,'sunTerraces',[44,17,'left']),gate('cayfen-forward','Sporefall Chasm · Hanging Roots',46,17,'sporeRim',[3,17,'right'])];cay.spots=[npc('local-aeric','Walter · rest and expedition care',22,20,'CHR-AERIC'),npc('fn-cayfen-resident','A mosaic apprentice',27,23,'REV-MARYAM'),npc('fn-cayfen-painter','A street painter and her partner',16,20,'SHOP-PHI')];
 const ram=town('ramelle','Ramelle · The Alabaster City','ramelle');ram.gates=[gate('ramelle-back','Sporefall · The Last Crossing',1,17,'sporeCrown',[44,17,'left'])];ram.spots=[npc('local-aeric','Walter · rest and expedition care',22,20,'CHR-AERIC'),npc('fn-ramelle-resident','A keeper of the water gardens',27,23,'REV-MARYAM'),npc('fn-ramelle-child','A child drawing in chalk',16,20,'SHOP-PHI')];
 const interior=(id,parent,name,art,door,spots)=>{doors[id]={room:parent,x:door[0],y:door[1],name};const m=base(id,name,art,24,[rect(8,10,40,28)]);m.area=null;m.finaleInterior=true;m.spots=spots;m.gates=[gate('fn-exit-'+id,'Return to '+parent,24,27,parent,[door[0],door[1]+(door[1]<20?1:-1),door[1]<20?'down':'up'])];return m;};
 interior('cayfenGallery','cayfen','Cayfen · The Shared Hand Gallery','gallery',[10,11],[npc('fn-gallery-curator','Curator Salma',24,14,'REV-MARYAM'),prop('fn-gallery-water','Where the River Waits',12,11),prop('fn-gallery-fire','Windows Still Lit',24,11),prop('fn-gallery-steel','Hands at Work',36,11),prop('fn-art-commission','Partner art commissions',30,19),prop('fn-gallery-collection','Your expedition’s collection',17,19)]);
 interior('cayfenHall','cayfen','Cayfen · Sun Hall','cayfen-hall',[37,11],[npc('LDR-07','Marshal Ibrahim ibn Ahmad',24,13,'LDR-07'),prop('fn-cayfen-records','The marshal’s mirror records',33,19)]);
 for(const [id,parent,door,art,name]of [['cayfenShop','cayfen',[10,28],'shop','Cayfen provisioner'],['cayfenInn','cayfen',[38,28],'inn','Cayfen · The Painted Lantern'],['ramelleShop','ramelle',[10,28],'shop','Ramelle provisioner'],['ramelleInn','ramelle',[38,28],'sanctuary','Ramelle · The Quiet Cloister']])interior(id,parent,name,art,door,[npc(id.endsWith('Shop')?'local-supplies':'fn-inn-rest',id.endsWith('Shop')?'Browse supplies':'Rest at the inn',24,15,'SHOP-PHI')]);
 interior('ramelleSanctuary','ramelle','Ramelle · Water Garden Sanctuary','sanctuary',[10,11],[npc('local-aeric','Walter · treatment and reserves',24,15,'CHR-AERIC'),npc('fn-sanctuary-keeper','The sanctuary keeper',31,19,'REV-MARYAM')]);
 interior('ramelleFortress','ramelle','Ramelle · Hasan’s Alabaster Fortress','fortress',[37,11],[npc('LDR-08','Hierophant Hasan ibn Ibrahim',24,13,'LDR-08'),prop('fn-fortress-below','The stair beneath the fortress',35,19)]);
 const threshold=base('afterlifeThreshold','Beneath Ramelle · The Answering Mirror','mirror',24,[rect(8,10,40,28)]);threshold.area=null;threshold.gates=[gate('fn-threshold-back','Return to Hasan’s fortress',24,27,'ramelleFortress',[34,19,'left'])];threshold.spots=[prop('fn-afterlife','The answering mirror · afterlife threshold',24,11),npc('fn-threshold-walter','Walter at the threshold',18,20,'CHR-AERIC')];
 maps.sporeRim.spots=[npc('TRN-FN-SPORE','Lantern warden Safiya',25,19,'TRN-SC-stormBluffs-2'),prop('fn-spore-sign','Read the crossing markers',12,20)];maps.sporeDepths.spots=[npc('fn-spore-refugee','A frightened First Light medic',13,20,'SHOP-PHI')];maps.sporeBridge.spots=[npc('TRN-FN-LAST','A fleeing company captain',25,19,'TRN-SC-stormBluffs-1'),npc('fn-wounded-bloom','A wounded Dawnbloom soldier',13,20,'TRN-C01-002')];maps.sporeCrown.spots=[npc('fn-darius','Darius · The Last Peace',28,17,'REV-DARIUS-FINAL'),npc('fn-hasan-ally','Hasan · a shared defence',21,20,'LDR-08'),npc('fn-wounded-first','A wounded First Light soldier',12,20,'TRN-C02-001'),prop('fn-crux-encounter','Cruxwyrm · the freed sovereign',37,20)];
 // The visible northward paths lead to optional habitats, not invisible dead ends.
 for(const [id,parent,art,title] of [
  ['sporeGrotto','sporeDepths','spore-grotto','Sporefall · The Moonpool Grotto'],
  ['sporeCanopy','sporeBridge','spore-canopy','Sporefall · Crown of Roots']
 ]){
  const m=base(id,title,art,14,[rect(1,14,46,15),rect(15,10,37,23)]);m.gates=[gate(id+'-back','Return to Sporefall',1,14,parent,[24,12,'down'])];
  m.spots=id==='sporeGrotto'?[npc('fn-spore-lichen','A lichen surveyor',31,14,'REV-MARYAM'),prop('fn-spore-moonpool','Read the moonpool inscription',19,15)]:[npc('fn-spore-herbalist','A canopy herbalist',30,14,'REV-MARYAM'),prop('fn-spore-bridge-notes','Read the crossing diary',18,15)];
  maps[parent].gates.push(gate('fn-'+id+'-entry',title,24,6,id,[3,14,'right']));
  maps[parent].sidePaths.push({points:[[24,14],[24,6]]});
 }
 maps.ramelleFortress.spots.push(npc('fn-fortress-custodian','Keeper of the old stair',29,14,'REV-MARYAM'));
 maps.cayfen.spots.push(npc('fn-cayfen-courier','A canvas courier',31,17,'REV-MARYAM'),npc('fn-cayfen-chimes','A bell-maker',17,17,'SHOP-PHI'));
 maps.ramelle.spots.push(npc('fn-ramelle-medic','A sanctuary aide',32,15,'REV-MARYAM'),npc('fn-ramelle-archivist','A vault archivist',11,15,'SHOP-PHI'));
 // Geometry follows the finished raster maps, not the initial image prompts.
 const profiles={
 road:{y:21,walk:[[1,21,46,22],[24,2,24,21],[9,16,15,19],[27,18,39,20]]},
 burial:{y:21,walk:[[1,21,46,22],[23,16,25,22],[18,18,31,18]]},
 falls:{y:13,walk:[[1,13,46,14],[6,9,8,14]]},
 terraces:{y:15,walk:[[1,14,46,16],[23,2,25,14]]},
 guan:{y:14,walk:[[1,14,46,15],[17,10,31,17],[23,6,25,10],[23,18,25,23]]},
 fei:{y:14,walk:[[1,14,46,15]]},
 spore:{y:14,walk:[[1,14,46,15],[21,12,27,16]]},
 'spore-rim':{y:16,walk:[[1,15,46,16],[21,14,27,17],[10,10,12,14]]},
 'spore-depths':{y:17,walk:[[1,17,46,18],[21,15,27,19],[24,6,24,17]]},
 'spore-bridge':{y:16,walk:[[1,15,46,16],[21,14,27,18],[24,6,24,16]]},
 'spore-grotto':{y:15,walk:[[1,15,46,16],[18,13,33,20],[20,21,31,22],[23,10,25,13]]},
 'spore-canopy':{y:15,walk:[[1,14,46,15],[12,16,36,17],[16,18,33,18],[20,10,20,14],[20,10,25,11],[23,9,25,11]]},
 darius:{y:15,walk:[[1,14,46,15],[20,13,28,18],[23,9,25,13],[22,19,26,19]]},
 cayfen:{y:17,walk:[[1,16,46,18],[9,11,10,16],[37,11,38,16],[23,19,25,29],[1,29,46,29],[10,27,10,29],[38,27,38,29]]},
 ramelle:{y:15,walk:[[1,15,46,16],[23,2,25,29],[12,10,13,15],[36,10,37,15],[12,27,13,29],[35,27,36,29],[2,29,45,29]]},
 gallery:{walk:[[9,10,39,23],[8,24,40,25],[23,26,25,29],[11,9,36,10]]},
 fortress:{walk:[[10,10,38,22],[23,8,25,29],[19,3,29,6],[22,7,26,9]]},
 mirror:{walk:[[10,15,38,24],[23,25,25,29],[20,12,28,14]]},
 shop:{walk:[[12,12,37,21],[23,22,25,28]]},
 inn:{walk:[[15,11,33,24],[23,25,25,28]]},
 sanctuary:{walk:[[15,12,32,25],[23,26,25,28]]},
 'cayfen-hall':{walk:[[10,13,38,25],[22,9,26,13],[20,6,29,8],[23,26,25,28]]}
 };
 for(const m of Object.values(maps).filter(m=>m.finale)){const p=profiles[m.finaleArt];m.finaleWalk=p.walk;m.finaleSolids=m.finaleArt==='spore-canopy'?[[21,12,27,15]]:m.finaleArt==='spore-rim'?[[23,13,24,14]]:[];if(p.y!==undefined){m.road=[[1,p.y],[46,p.y]];for(const g of m.gates)if(g.x===1||g.x===46)g.y=p.y;}m.grass=[];}
 const position=(room,id,x,y)=>{const p=maps[room].spots.find(p=>p.id===id);if(p)Object.assign(p,{x,y});};
 for(const [room,id,x,y]of [
 ['sunBank','TRN-FN-ROAD',32,22],['sunBank','fn-road-sign',10,22],['burialGrove','fn-burial',24,19],['burialGrove','fn-pate-grave',20,17],['burialGrove','fn-trade-grave',29,17],
 ['sunFalls','fn-guan-keeper',16,14],['sunTerraces','fn-fei-keeper',16,16],['sunTerraces','TRN-FN-TERRACE',35,16],
 ['guanApproach','fn-guan-clue',24,12],['guanApproach','TRN-FN-GUAN',36,15],['guanShrine','fn-guan-clue',24,7],['guanShrine','fn-guan-rune-shelter',18,12],['guanShrine','fn-guan-rune-faith',30,12],['guanShrine','fn-guan-rune-crossing',24,20],['guanShrine','fn-guan-encounter',24,10],
 ['feiApproach','fn-fei-clue',24,17],['feiApproach','TRN-FN-FEI',36,22],['feiCrossing','fn-fei-clue',10,14],['feiCrossing','fn-fei-weight-0',14,14],['feiCrossing','fn-fei-weight-1',23,14],['feiCrossing','fn-fei-weight-2',34,14],['feiCrossing','fn-fei-encounter',28,14],
 ['cayfen','local-aeric',24,20],['cayfen','fn-cayfen-resident',25,23],['cayfen','fn-cayfen-painter',16,18],['ramelle','local-aeric',24,20],['ramelle','fn-ramelle-resident',25,23],['ramelle','fn-ramelle-child',16,16],
 ['cayfenGallery','fn-gallery-water',13,8],['cayfenGallery','fn-gallery-fire',24,8],['cayfenGallery','fn-gallery-steel',34,8],['cayfenHall','LDR-07',24,7],['ramelleFortress','LDR-08',24,5],
 ['sporeRim','TRN-FN-SPORE',25,16],['sporeRim','fn-spore-sign',21,13],['sporeDepths','fn-spore-refugee',23,14],['sporeBridge','TRN-FN-LAST',25,16],['sporeBridge','fn-wounded-bloom',23,15],
 ['sporeCrown','fn-darius',25,11],['sporeCrown','fn-hasan-ally',21,16],['sporeCrown','fn-wounded-first',20,16],['sporeCrown','fn-crux-encounter',28,16],['afterlifeThreshold','fn-threshold-walter',18,20]
 ])position(room,id,x,y);
 for(const [id,x,y]of [['cayfenShop',10,27],['cayfenInn',38,27],['ramelleSanctuary',12,9],['ramelleFortress',36,9],['ramelleShop',13,26],['ramelleInn',36,26]]){Object.assign(doors[id],{x,y});const g=maps[id].gates[0];g.arrival=[x,y+1,'down'];}
 // Door tiles are reserved openings; their approach is always on the visible floor.
 for(const d of Object.values(doors).filter(d=>maps[d.room]?.finale))maps[d.room].finaleWalk.push([d.x,d.y,d.x,d.y+1]);
 Object.assign(maps.sunFalls.gates.find(g=>g.id==='fn-guan-entry'),{x:7,y:9});Object.assign(maps.sunTerraces.gates.find(g=>g.id==='fn-fei-entry'),{x:24,y:2});
 maps.sunFalls.sidePaths=[{points:[[7,13],[7,9]]}];maps.sunTerraces.sidePaths=[{points:[[24,15],[24,2]]}];

 for(const m of Object.values(maps).filter(m=>m.finale))for(const g of m.gates){if(g.x===1||g.x===46){const dest=maps[g.to];if(dest?.finale&&profiles[dest.finaleArt]?.y!==undefined){const ty=profiles[dest.finaleArt].y;g.arrival=[g.x===1?44:3,ty,g.x===1?'left':'right'];}}}
 maps.guanApproach.gates[0].arrival=[7,11,'down'];maps.feiApproach.gates[0].arrival=[24,5,'down'];
 maps.sunFalls.gates.find(g=>g.id==='fn-guan-entry').arrival=[3,15,'right'];maps.sunTerraces.gates.find(g=>g.id==='fn-fei-entry').arrival=[3,21,'right'];maps.botrune.gates.find(g=>g.id==='botrune-next').arrival=[3,21,'right'];
 // Proper habitat strips on safe ground; the cliff and water never host encounters.
 maps.sunBank.grass=[[27,18,39,20]];maps.guanApproach.grass=[];maps.feiApproach.grass=[[27,18,39,20]];
 maps.sunTerraces.grass=[[31,14,39,14]];maps.sporeRim.grass=[[21,14,22,14],[25,14,27,14]];maps.sporeDepths.grass=[[21,15,22,16],[26,15,27,16]];maps.sporeBridge.grass=[[21,14,22,14],[26,14,27,14]];maps.sporeGrotto.grass=[[18,13,21,14],[29,19,32,20]];maps.sporeCanopy.grass=[[17,16,20,17],[30,16,33,17]];
 maps.sunTerraces.spots.push(prop('fn-rare-record-suncub','Read the sun-keeper’s field record',24,4),prop('fn-rare-encounter-suncub','Suncub · the warm terrace',24,7));maps.sporeDepths.spots.push(prop('fn-rare-record-gehennuar','Read the deep warden’s field record',27,15),prop('fn-rare-encounter-gehennuar','Gehennuar · the luminous depths',26,15));
 maps.sporeDepths.gates.find(g=>g.to==='sporeGrotto').arrival=[3,15,'right'];
 maps.sporeDepths.sidePaths=[{points:[[24,17],[24,6]]}];maps.sporeBridge.sidePaths=[{points:[[24,16],[24,6]]}];
 maps.sporeGrotto.gates[0].arrival=[24,14,'down'];maps.sporeCanopy.gates[0].arrival=[24,13,'down'];
 // All town caravan arrivals lie on the broad central boulevard.

}
