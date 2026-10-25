import {installSiteTablets} from './site-tablets.js?v=0.89.4';
import {installAquaticMarasen} from './marasen-aquatic.js?v=0.90.40';
import {VERDANT_ROAD,MARASEN_BRANCHES} from './marasen-data.js?v=0.87.0';
import {registerBiome} from './biome-world.js?v=0.90.20';
const gate=(id,label,x,y,to,arrival,action)=>({id,label,x,y,to,arrival,action,door:true});
const actor=(id,label,x,y,portrait)=>({id,label,x,y,sprite:0,...(portrait?{revoltCharacter:portrait}:{})});
const winding=[[[1,17],[8,17],[8,8],[19,8],[19,24],[32,24],[32,11],[41,11],[41,17],[46,17]],[[1,17],[11,17],[11,25],[24,25],[24,7],[36,7],[36,17],[46,17]],[[1,17],[7,17],[7,9],[20,9],[20,22],[37,22],[37,17],[46,17]]];
function map(name,kind,n){return {name,terrain:'forest',verdantKind:kind,bloom:true,road:winding[n%3].map(p=>[...p]),grass:[[5,5,15,11],[15,20,27,27],[30,5,42,12]],sidePaths:[{points:[[24,7],[24,25]]}],props:[],gates:[],spots:[{id:'area-sign',label:'Read route noticeboard',x:5,y:16,routeSign:true}]};}
export function installMarasenWorld(maps,doors){
 const entry=maps.cossenne.gates.find(g=>g.id==='cs-boundary');entry.to='greenCut';entry.arrival=[3,17,'right'];entry.action='marasen-road';entry.label='Stonecut Steps · Marasen';
 for(const [n,[room,name,kind]] of VERDANT_ROAD.entries()){
  maps[room]=map(name,kind,n);maps[room].area='MR-'+room;registerBiome(room,kind==='brook'||kind==='falls'?'wetland':'forest');
  maps[room].gates=[gate(room+'-back',n?VERDANT_ROAD[n-1][1]:'Cossenne',1,17,n?VERDANT_ROAD[n-1][0]:'cossenne',[44,17,'left']),gate(room+'-forward',n<9?VERDANT_ROAD[n+1][1]:'Marasen',46,17,n<9?VERDANT_ROAD[n+1][0]:'marasen',[3,17,'right'])];
 }
 for(const [n,room]of ['greenCut','greenCanopy','greenMeadow','greenBraid','greenVault','greenTerrace'].entries())maps[room].spots.push(actor('TRN-MR-ROAD-'+n,'Dawn Bloom road watch',24,19,'LDR-05'));
 const branches=[['greenFern','mill',['millRace','millRoots','millWheel']],['greenFalls','peach',['peachTrace','peachPools','peachOath','peachSanctuary']],['greenLantern','darius',['commonCamp','commonSpill','commonDam','commonCrown','commonBinding']]];
 for(const [base,key,rooms] of branches){
  if(key!=='darius')maps[base].gates.push(gate('mr-'+key+'-entry','Expedition · '+MARASEN_BRANCHES[rooms[0]].name,24,4,rooms[0],[3,17,'right'],'marasen-side-entry'));if(key!=='darius')maps[base].sidePaths.push({points:[[24,7],[24,4]]});
  for(const [n,room] of rooms.entries()){
   const r=MARASEN_BRANCHES[room];maps[room]=map(r.name,r.kind,n+1);maps[room].grass=[];registerBiome(room,'forest');maps[room].gates=[gate(room+'-back',n?MARASEN_BRANCHES[rooms[n-1]].name:'Return to green road',1,17,n?rooms[n-1]:base,n?[44,17,'left']:[24,6,'down']),gate(room+'-forward',n<rooms.length-1?'Continue expedition':'Return to green road',46,17,n<rooms.length-1?rooms[n+1]:base,n<rooms.length-1?[3,17,'right']:[24,6,'down'],n<rooms.length-1?'marasen-expedition':undefined)];
   maps[room].spots.push({id:'mr-'+key+'-record-'+n,label:'Read the site account',x:24,y:16,questProp:true});
   maps[room].sidePaths.push({points:[[24,7],[24,24]]});
   if(n===0)maps[room].spots.push(actor('mr-'+key+'-keeper',key==='mill'?'Hugh atte Mill':key==='darius'?'Maryam bint Salim':'Peach sanctuary marker',12,17,key==='mill'?'REV-HUGH':key==='darius'?'REV-MARYAM':null));
  }
 }
 const add=(room,spot)=>maps[room].spots.push(spot);
 add('millRoots',{id:'mr-mill-control',label:'Coupled watermill controls',x:26,y:23,questProp:true});add('millWheel',actor('TRN-MR-HUGH','Hugh atte Mill',32,23,'REV-HUGH'));add('millWheel',{id:'mr-mill-choice',label:'Allocate the restored flour',x:38,y:22,questProp:true});
 add('peachOath',{id:'mr-peach-bells',label:'The three oath bells',x:26,y:23,questProp:true});add('peachSanctuary',{id:'mr-peach-encounter',label:'Liubeirow at the spring',x:38,y:22,questProp:true});
 add('commonSpill',{id:'mr-darius-control',label:'Spillway controls',x:26,y:23,questProp:true});add('commonSpill',actor('TRN-MR-FARID','Farid ibn Yunus',33,23,'REV-FARID'));
 add('commonDam',actor('TRN-MR-ALICE','Alice atte Ford',33,23,'REV-ALICE'));add('commonDam',{id:'mr-evacuate',label:'Send the evacuation signal',x:38,y:22,questProp:true});
 add('commonCrown',actor('TRN-MR-DARIUS','Darius',37,22,'REV-DARIUS'));add('commonBinding',{id:'mr-tellurion-encounter',label:'Tellurion beyond the broken bridle',x:38,y:22,questProp:true});

 // The Common Cause expedition is mandatory on the main road.
 // Existing expedition saves retain their rooms and progress.
 const terraceGate=maps.greenTerrace.gates.find(g=>g.id==='greenTerrace-forward');
 Object.assign(terraceGate,{label:'Occupied Spillway · Darius’s trail',to:'commonCamp',arrival:[3,17,'right'],action:'marasen-main-darius'});
 Object.assign(maps.commonCamp.gates[0],{label:'The Hundred Terraces',to:'greenTerrace',arrival:[44,17,'left']});
 Object.assign(maps.commonBinding.gates[1],{label:'Marasen Water Gardens',to:'greenApproach',arrival:[3,17,'right'],action:'marasen-main-out'});
 Object.assign(maps.greenApproach.gates[0],{label:'Broken Bridle · Upper Reservoir',to:'commonBinding',arrival:[44,17,'left']});
 // A descriptive preview at each stage signals the expedition before the boss.
 const supply=(room,id,label,x,y)=>maps[room].spots.push({id,label,x,y,questProp:true});
 supply('greenVault','mr-main-warning','Broken supply wagon · read Darius’s warning',31,22);
 supply('greenTerrace','mr-main-watch','Surveyors’ lookout · inspect the occupied spillway',18,24);
 supply('commonCamp','mr-main-camp','Read the evacuation register',30,23);
 supply('commonDam','mr-main-bell','Inspect the flood-warning bell',17,25);
 maps.greenVault.sidePaths.push({points:[[24,22],[31,22]]});
 maps.greenTerrace.sidePaths.push({points:[[18,22],[18,24]]});
 maps.commonCamp.sidePaths.push({points:[[24,23],[30,23]]});
 maps.greenVault.verdantKind='cliffs';maps.greenVault.marasenWater=[[8,3,11,11],[38,20,43,30]];
 maps.greenBraid.verdantKind='watermeadow';maps.greenBraid.marasenWater=[[8,4,10,10],[29,23,33,29]];
 maps.greenFalls.verdantKind='cascades';maps.greenFalls.marasenWater=[[6,5,10,12],[35,20,39,29]];
 maps.greenTerrace.verdantKind='cliffs';maps.greenTerrace.marasenWater=[[7,3,11,12]];
 maps.commonCrown.verdantKind='cascades';maps.commonCrown.marasenWater=[[4,5,8,13],[37,19,41,28]];
 maps.commonSpill.verdantKind='watermeadow';maps.commonSpill.marasenWater=[[6,22,13,28],[36,4,42,10]];
  maps.marasen={name:'Marasen · City of Living Water',terrain:'forest',verdantKind:'city',hub:true,bloom:true,road:[[1,17],[46,17]],grass:[],sidePaths:[{points:[[9,11],[9,27]]},{points:[[23,10],[23,27]]},{points:[[36,11],[36,27]]}],props:[{asset:'marasenMarket',x:4,y:4,w:10,h:7},{asset:'marasenApothecary',x:4,y:21,w:10,h:6},{asset:'marasenArchive',x:18,y:3,w:10,h:8},{asset:'marasenKeep',x:30,y:2,w:15,h:9},{asset:'marasenMill',x:29,y:22,w:13,h:6}],spots:[actor('mr-water','Canal households',18,15),actor('mr-levy','Levy clerk',28,20),actor('local-aeric','Chaplain Walter',22,19),actor('mr-farid-city','Farid ibn Yunus',18,24,'REV-FARID'),{id:'mr-letters',label:'Trade’s forwarding box',x:26,y:13,questProp:true}],gates:[gate('marasen-back','Water Gardens',1,17,'greenApproach',[44,17,'left']),gate('marasen-next','Botrune road · chapter boundary',46,17,null,null,'marasen-boundary'),gate('mr-fort-entry','Marasen Civic Fort',36,11,'marasenGate',[3,17,'right'],'marasen-fort')]};maps.marasen.marasenWater=[[16,5,17,11],[28,22,29,28]];registerBiome('marasen','forest');
 doors.marasenMarket={room:'marasen',x:9,y:11,name:'Seed Exchange and Supplies'};doors.marasenApothecary={room:'marasen',x:9,y:27,name:'Waterside Apothecary'};doors.marasenArchive={room:'marasen',x:23,y:11,name:'Household Archive and Dispatches'};doors.marasenMill={room:'marasen',x:36,y:28,name:'Working Mill · seed sorting'};
 for(const [n,room]of ['marasenGate','marasenHall'].entries()){
  maps[room]=map(MARASEN_BRANCHES[room].name,'fort',n);maps[room].marasenFort=true;maps[room].grass=[];maps[room].props=[{asset:'fortWall',x:2,y:5,w:44,h:1,decorative:true},{asset:'fortWall',x:2,y:29,w:44,h:1,decorative:true},{asset:'fortBanner',x:14,y:7,w:2,h:4,decorative:true},{asset:'fortBanner',x:39,y:7,w:2,h:4,decorative:true},{asset:'shelf',x:5,y:23,w:3,h:2},{asset:'table',x:8,y:24,w:4,h:2},{asset:'fortCarpet',x:35,y:15,w:7,h:10,decorative:true}];maps[room].gates=[gate(room+'-back',n?'Gate Court':'Marasen',1,17,n?'marasenGate':'marasen',n?[44,17,'left']:[36,13,'down']),gate(room+'-forward',n?'Return to Marasen':'Assembly Hall',46,17,n?'marasen':'marasenHall',n?[36,13,'down']:[3,17,'right'],n?undefined:'marasen-fort-hall')];registerBiome(room,'forest');
 }

 // Marasen's external districts: four connected, geographically distinct areas.
 function district(id,name,kind,props,spots){
  const m=map(name,kind,2);m.hub=true;m.grass=[];m.area='MR-'+id;m.props=props;m.spots=[{id:'area-sign',label:'Read Marasen city guide',x:5,y:15,routeSign:true},...spots];maps[id]=m;registerBiome(id,kind==='rapids'?'wetland':'forest');return m;
 }
 const civic=(id,label,x,y)=>({id,label,x,y,questProp:true});
 const exchange='marasenExchange0';
 maps.marasen.name='Marasen · Lower Cascades';maps.marasen.marasenWater=[[14,3,16,11],[27,20,30,29]];
 maps.marasen.gates.push(gate('mr-city-bridges','Seven Bridges',24,27,'marasenBridges',[23,6,'down'],'marasen-city'));
 maps.marasen.gates.push(gate('mr-city-rapids','The Rapids',42,25,'marasenRapids',[4,17,'right'],'marasen-city'));
 maps.marasen.gates.push(gate('mr-city-citadel','Highwater Citadel',39,12,'marasenCitadel',[3,17,'right'],'marasen-city'));
 maps.marasen.gates.push(gate('mr-exchange-entry','Grand Mercantile Exchange',9,11,exchange,[24,24,'up'],'marasen-city'));
 maps.marasen.spots.push(civic('mr-city-bazaar','Meet the mercantile guildmaster',26,24));
 maps.marasen.sidePaths.push({points:[[42,17],[42,25]]},{points:[[39,17],[39,12]]});
 const bridges=district('marasenBridges','Marasen · Seven Bridges','watermeadow',[{asset:'marasenMill',x:3,y:3,w:9,h:8},{asset:'marasenArchive',x:30,y:3,w:12,h:9}], [actor('mr-brunswick','Seven Bridges boatman',18,17),civic('mr-city-archive','Read the aqueduct charter',33,17)]);
 bridges.marasenWater=[[6,3,9,29],[22,3,24,29],[38,3,40,29]];
 bridges.sidePaths.push({points:[[23,4],[23,22]]},{points:[[33,22],[33,17]]});
 bridges.gates=[gate('mr-bridges-home','Lower Cascades',23,4,'marasen',[24,24,'up'],'marasen-city'),gate('mr-bridges-citadel','Highwater Citadel',46,17,'marasenCitadel',[3,17,'right'],'marasen-city')];
 const rapids=district('marasenRapids','Marasen · Rapids Arena','rapids',[{asset:'marasenMill',x:4,y:4,w:12,h:9}], [actor('mr-race-marshal','Rapids Marshal',24,19),civic('mr-race-board','Race programme and wagering board',34,19)]);
 rapids.marasenWater=[[8,3,12,30],[17,3,20,30],[27,3,30,30],[39,3,42,30]];
 rapids.sidePaths.push({points:[[24,22],[24,19]]},{points:[[34,22],[34,19]]});
 rapids.gates=[gate('mr-rapids-back','Lower Cascades',1,17,'marasen',[40,24,'left'],'marasen-city'),gate('mr-rapids-bridges','Seven Bridges',46,17,'marasenBridges',[3,17,'right'],'marasen-city')];
 const citadel=district('marasenCitadel','Marasen · Highwater Citadel','citadel',[{asset:'marasenCitadelHero',x:16,y:2,w:26,h:14},{asset:'marasenKeep',x:32,y:20,w:12,h:8}], [actor('mr-water-warden','Highwater civil warden',20,17),civic('mr-city-headwaters','Inspect the sky aqueduct',31,25)]);
 citadel.marasenWater=[[12,3,15,13],[43,3,46,13]];
 citadel.sidePaths.push({points:[[31,22],[31,25]]});
 const formerFortGate=maps.marasen.gates.find(g=>g.id==='mr-fort-entry');Object.assign(formerFortGate,{label:'Highwater upper stair',to:'marasenCitadel',arrival:[3,17,'right'],action:'marasen-city'});
 Object.assign(maps.marasenGate.gates[0],{label:'Highwater Citadel',to:'marasenCitadel',arrival:[35,19,'left']});
 citadel.gates=[gate('mr-citadel-back','Lower Cascades',1,17,'marasen',[37,8,'down'],'marasen-city'),gate('mr-citadel-bridges','Seven Bridges',46,17,'marasenBridges',[43,17,'left'],'marasen-city'),gate('mr-citadel-fort','Highwater civic fort',36,18,'marasenGate',[3,17,'right'],'marasen-fort')];
 // Walkable multistorey building: counters on each floor and stairs at either end.
 const floors=['General Provisions','Technique Library','Relic Gallery','Evolution Atelier','Growth Apothecary','Merchant’s Terrace'];
 for(let i=0;i<floors.length;i++){
  const id='marasenExchange'+i,m=map('Grand Mercantile Exchange · '+floors[i],'exchange',i);m.hub=true;m.grass=[];m.area='MR-'+id;
  m.props=[{asset:'marasenArchive',x:4,y:3,w:9,h:8,decorative:true},{asset:'marasenMarket',x:31,y:3,w:11,h:8,decorative:true},{asset:'shelf',x:5,y:25,w:9,h:2},{asset:'shelf',x:35,y:25,w:9,h:2},{asset:'table',x:20,y:13,w:8,h:3}];
  m.spots=[civic('mr-exchange-counter','Browse '+floors[i],24,18),actor('mr-exchange-clerk','Exchange '+(i+1)+'F attendant',20,21)];
  if(i===5)m.spots.push(civic('mr-merchant-guild','Five-Bank Accord · merchant guild registrar',30,23));
  m.gates=[gate('mr-exchange-leave',i?'Return to Lower Cascades':'Leave exchange',24,28,'marasen',[9,13,'down'],'marasen-city')];
  if(i>0)m.gates.push(gate('mr-exchange-down','Down one floor',5,17,'marasenExchange'+(i-1),[41,17,'left'],'marasen-city'));
  if(i<5)m.gates.push(gate('mr-exchange-up','Up one floor',42,17,'marasenExchange'+(i+1),[6,17,'right'],'marasen-city'));
  maps[id]=m;registerBiome(id,'forest');
 }
  maps.marasen.gates.push(gate('mr-fort-return','Inner hall return',42,11,'marasenHall',[44,17,'left'],'marasen-fort-return'));
 add('marasenGate',actor('TRN-MR-GATE','Marasen canal guard',11,17,'LDR-05'));add('marasenGate',{id:'mr-fort-control',label:'Archive lock controls',x:26,y:23,questProp:true});
 add('marasenHall',actor('TRN-MR-INNER','Marasen reservoir guard',24,16,'LDR-05'));add('marasenHall',actor('mr-leader','Castellan Khalid ibn Hasan',38,22,'LDR-05'));
 for(const [room,m]of Object.entries(maps).filter(([,m])=>m.verdantKind&&!m.hub)){
  for(const spot of m.spots){
   const points=[];
   for(const path of [m.road,...m.sidePaths.map(p=>p.points)])for(let i=1;i<path.length;i++){const [ax,ay]=path[i-1],[bx,by]=path[i];for(let x=Math.min(ax,bx);x<=Math.max(ax,bx);x++)for(let y=Math.min(ay,by);y<=Math.max(ay,by);y++)points.push([x,y]);}
   const end=[spot.x,spot.y+1],nearest=points.sort((a,b)=>Math.abs(a[0]-end[0])+Math.abs(a[1]-end[1])-Math.abs(b[0]-end[0])-Math.abs(b[1]-end[1]))[0];
   if(nearest)m.sidePaths.push({points:[nearest,[end[0],nearest[1]],end]});
  }
 }

 installAquaticMarasen(maps,doors);
 installSiteTablets(maps);
 // Structural entrances share their exact interaction tile; no floating destinations.
 for(const m of Object.values(maps).filter(m=>m.verdantKind&&!Number.isInteger(m.exchangeFloor))){
  for(const g of m.gates){
   const building=m.aquaticBuildings?.find(b=>b.door?.[0]===g.x&&b.door?.[1]===g.y);
   g.entrance={asset:building||g.street?null:g.to==='commonSpill'||g.to==='millRoots'?'biomecavemouth':'fortArch',x:g.x-1,y:g.y-3,w:3,h:4};
  }
 }

}
