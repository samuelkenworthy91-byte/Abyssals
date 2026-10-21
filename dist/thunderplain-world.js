import {registerBiome} from './biome-world.js?v=0.90.13';
const gate=(id,label,x,y,to,arrival,action)=>({id,label,x,y,to,arrival,action,door:true});
const actor=(id,label,x,y,portrait)=>({id,label,x,y,sprite:0,revoltCharacter:portrait});
export const BOTRUNE_BUILDINGS=[
 {id:'botruneShop',asset:'btHouse',x:3,y:3,w:12,h:11,door:[9,13],name:'Garrison provisioner'},
 {id:'botruneRecords',asset:'btScriptorium',x:31,y:2,w:13,h:12,door:[37,13],name:'Civilian records office'},
 {id:'botruneClinic',asset:'btHouse',x:3,y:20,w:12,h:9,door:[9,28],name:'Lantern infirmary'},
 {id:'botruneInn',asset:'btHouse',x:31,y:20,w:13,h:9,door:[37,28],name:'The Last Bell · lodging house'}
];
export function botruneBuildingBlocked(m,x,y){return (m.botruneBuildings||[]).some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h&&!(x===b.door[0]&&y===b.door[1]));}
export function installThunderplainWorld(maps,doors){
 const addBranch=(base,id,label,x,y,to,arrival)=>{maps[base].gates.push(gate(id,label,x,y,to,arrival,'storm-side'));maps[base].sidePaths.push({points:[[x,17],[x,y]],gateId:id});};
 addBranch('stormGlass','bt-relay-entry','North trail · Stormcatch Relay',24,2,'stormRelay',[3,17,'right']);
 addBranch('stormWatch','bt-darius-entry','North ascent · Broken Banner Camp',24,2,'stormDariusCamp',[3,17,'right']);
 Object.assign(maps.stormWatch.gates.find(g=>g.id==='stormWatch-forward'),{action:'storm-cart',x:42,label:'Cart road · Botrune causeway'});
 maps.stormWatch.spots.push(actor('bt-cart-driver','Driver · broken cart wheel',40,19,'SHOP-DOR'));
 const side=(id,name)=>{maps[id]={name,area:id,bloom:true,hub:true,terrain:'ridge',botruneKind:'storm',stormSide:true,stormMountain:id!=='stormRelay',stormBoulders:[[5,23,3,3],[36,4,4,3]],stormRods:[[7,7],[20,7],[36,10]],road:[[1,17],[46,17]],grass:[[5,5,16,12],[31,20,42,27]],sidePaths:[{points:[[24,7],[24,26]]}],props:[],spots:[],gates:[]};registerBiome(id,'quarry');return maps[id];};
 const relay=side('stormRelay','Thunderplain · Stormcatch Relay');relay.gates=[gate('stormRelay-back','Glass Scars',1,17,'stormGlass',[24,4,'down'])];relay.spots=[actor('bt-relay-engineer','Relay keeper Samira',18,20,'REV-MARYAM'),{id:'bt-relay-control',label:'Stormcatch · route lightning into the receivers',x:25,y:12,questProp:true}];
 relay.props=[{asset:'btConductor',x:22,y:5,w:5,h:7,decorative:true}];relay.stormRods.push([25,11]);
 const camp=side('stormDariusCamp','Thunderplain · Broken Banner Camp');camp.gates=[gate('stormDariusCamp-back','Abandoned Watch',1,17,'stormWatch',[24,4,'down']),gate('stormDariusCamp-forward','Last Banner Ridge',46,17,'stormDariusRidge',[3,17,'right'],'storm-darius-accepted')];camp.props=[{asset:'tent',x:5,y:3,w:9,h:8,decorative:true},{asset:'fortBanner',x:30,y:4,w:2,h:5,decorative:true}];camp.spots=[actor('bt-storm-deserter','A deserter from Darius’s company',19,19,'REV-FARID'),{id:'bt-storm-camp-note',label:'Read the torn banner',x:30,y:21,questProp:true}];
 const ridge=side('stormDariusRidge','Thunderplain · Last Banner Ridge');ridge.gates=[gate('stormDariusRidge-back','Broken Banner Camp',1,17,'stormDariusCamp',[44,17,'left']),gate('stormDariusRidge-forward','Storm Crown',46,17,'stormDariusCrown',[3,17,'right'],'storm-darius-watch')];ridge.spots=[actor('TRN-BT-HOLDOUT','Last-banner holdout',34,17,'REV-FARID'),{id:'bt-storm-ledger',label:'Read the last supply ledger',x:26,y:22,questProp:true}];
 const crown=side('stormDariusCrown','Thunderplain · Storm Crown');crown.gates=[gate('stormDariusCrown-back','Last Banner Ridge',1,17,'stormDariusRidge',[44,17,'left'])];crown.spots=[actor('TRN-BT-DARIUS','Darius · Last Thunder',30,17,'REV-DARIUS-STORM'),{id:'bt-storm-tether',label:'Inspect the copper tether',x:37,y:22,questProp:true}];crown.props=[{asset:'btConductor',x:34,y:7,w:6,h:10,decorative:true}];crown.stormRods.push([37,16]);
 camp.spots.push(actor('bt-wounded-firstlight','Injured First Light patrol',12,20,'TRN-C02-001'),actor('bt-deserter-two','Former Common Cause scout',28,19,'TRN-SC-stormBluffs-0'),actor('TRN-BT-ASCENT','Ridge sentry',37,17,'TRN-C02-002'));
 ridge.spots.push(actor('bt-wounded-dawnbloom','Injured Dawnbloom patrol',13,20,'TRN-C01-002'),actor('bt-deserter-three','A disillusioned follower',20,21,'SHOP-PHI'),actor('TRN-BT-CAVE','Cave guardian',24,17,'TRN-C02-001'),{id:'bt-storm-paintings',label:'Ancient paintings · the storm sovereign',x:18,y:10,questProp:true});
 for(const m of [camp,ridge,crown]){m.road=[[1,17],[11,17],[11,24],[24,24],[24,17],[37,17],[37,10],[46,10],[46,17]];m.sidePaths.push({points:[[13,20],[24,20]]},{points:[[18,10],[18,17]]});}
 crown.stormTower=true;crown.sidePaths.push({points:[[37,17],[37,22]]});ridge.stormCave=true;
 maps.botrune.gates.push(gate('bt-lower-street','South street · Botrune lower town',24,29,'botruneLower',[24,4,'down']));
 maps.botruneLower={name:'Botrune · Lower Garrison Streets',area:'botruneLower',bloom:true,hub:true,terrain:'keep',botruneKind:'lower',botruneBuildings:BOTRUNE_BUILDINGS,road:[[1,17],[46,17]],sidePaths:[{points:[[24,2],[24,29]]},{points:[[9,13],[9,29]]},{points:[[37,13],[37,29]]}],grass:[],props:[],spots:[actor('bt-street-resident','A Botrune resident',19,19,'SHOP-DOR'),actor('bt-street-guard','A shaken garrison soldier',28,24,'TRN-SC-stormBluffs-0')],gates:[gate('bt-upper-street','North street · Abbey square',24,2,'botrune',[24,27,'up'])]};registerBiome('botruneLower','quarry');
 for(const b of BOTRUNE_BUILDINGS)doors[b.id]={room:'botruneLower',x:b.door[0],y:b.door[1],name:b.name};
}
