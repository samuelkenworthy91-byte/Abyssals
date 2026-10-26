import {installPromenade,isPromenade,promenadeWalkable,drawPromenade} from './promenade.js?v=0.90.37';
import {glassCraterBlocked} from './storm-props.js?v=0.90.14';
import {installFinaleWorld,finaleWalkable} from './finale-world.js?v=0.90.41';
import {drawFinaleMap} from './finale-art.js?v=0.90.19';
import {installBotruneWorld,botruneWalkable} from './botrune-world.js?v=0.90.41';
import {drawBotruneMap} from './botrune-art.js?v=0.90.20';
import {farmBlocked} from './cossenne-farm.js?v=0.90.20';
import {exchangeWalkable,aquaticWalkable,drawExchangeInterior,drawAquaticNotice} from './marasen-aquatic.js?v=0.90.41';
import {installMarasenWorld} from './marasen-world.js?v=0.90.41';
import {drawMarasenTile,drawMarasenDetails} from './marasen-art.js?v=0.90.20';
import {installRevoltWorld} from './revolt-world.js?v=0.90.41';
import {installCossenneWorld} from './cossenne-world.js?v=0.90.41';
import {drawOrchardTile,drawOrchardDecor} from './cossenne-art.js?v=0.90.20';
import {drawEnvironmentArtwork} from './mountain-art.js?v=0.87.0';
import {installMountainPass,drawPassTile,drawPassDetails} from './mountain-pass.js?v=0.90.20';
import {installJungleWorld} from './paladin-encounters.js?v=0.87.0';
import {installCourtWorld} from './paladin-quest.js?v=0.87.0';
import {drawCourtMap} from './paladin-art.js?v=0.90.20';
import {installJetties,jettyWater,jettyWalkable,drawJetty} from './jetty-fishing.js?v=0.90.20';
import {installCampaignWorld} from './side-campaigns.js?v=0.90.20';
import {installRelicQuestWorld} from './relic-quest.js?v=0.87.0';
import {installCybressaWorld} from './cybressa-world.js?v=0.90.41';
import {installRouteSignposts} from './route-signposts.js?v=0.87.0';
import {biomeAsset,biomeFor,installBiomeWorld,drawBiomeDetails,drawBiomeEntrances} from './biome-world.js?v=0.90.41';
import {installLeaderForts,leaderFortWalkable,drawLeaderFortDecor,drawLeaderFortEntrances} from './leader-fort-world.js?v=0.90.41';
import {fortCoastTile,drawFortTile,drawFortCoast,drawFortExterior,drawFortArchitecture} from './fort-render.js?v=0.87.0';
import {installExpansionHabitats} from './full-expansion-world.js?v=0.90.41';
import {installExplorationWorld,drawExplorationScenery} from './exploration-world.js?v=0.90.43';
import {installSidePaths} from './side-world.js?v=0.90.41';
import {extendRoutes} from './route-progression.js?v=0.90.41';
import {BOARD,onBoard,boardWall} from './tunnel-puzzle.js?v=0.87.0';
import {VALVES} from './tunnel-puzzle.js?v=0.87.0';
// New map geometry within the Civeton → Dorelem → Philomere → Cybressa spine.
const crossing=(id,label,x,to,arrival,action)=>({id,label,x,y:17,to,arrival,action,door:true});
export const NEW_DOORS={dorelemHome:{room:'dorelem',x:10,y:10,name:'Dorelem berry salesman · stablehouse'},dorelemShop:{room:'dorelem',x:10,y:26,name:'Dorelem supplies'},philomereHome:{room:'philomere',x:10,y:10,name:'Philomere waiting room'},hospice:{room:'philomere',x:30,y:10,name:'Philomere hospice'},philomereShop:{room:'philomere',x:10,y:26,name:'Philomere supplies'}};
const person=(id,label,x,y,sprite=2)=>({id,label,x,y,sprite});
export const NEW_MAPS={
 scrub:{name:'Dorelem Scrub',area:'DOR-01',terrain:'ridge',road:[[1,17],[10,17],[10,8],[21,8],[21,23],[33,23],[33,12],[41,12],[41,17],[46,17]],grass:[[11,5,18,11],[23,17,29,26],[35,7,39,16]],gates:[crossing('march-return','Civeton March',1,'march',[44,17,'left']),crossing('scrub-forward','Service Tunnels',46,'tunnels',[3,17,'right'],'siege-entry')],spots:[person('TRN-C02-001','Scout Walter de Bohun',12,13),person('TRN-C02-002','Soldier Ralph de Bohun',31,20),{id:'scrub-shrine-cache',label:'Roadside supply sack',x:30,y:23},person('scrub-refugees','Refugees',20,26,'bystander'),{id:'area-sign',label:'Scrub signpost',x:8,y:18}],props:[{asset:'tent',x:3,y:8,w:6,h:5},{asset:'memorial',x:35,y:25,w:4,h:3}]},
 tunnels:{name:'Dorelem Service Tunnels',area:'DOR-02',terrain:'tunnel',road:[[1,17],[12,17],[12,8],[25,8],[25,24],[38,24],[38,17],[46,17]],grass:[[16,7,21,9],[24,15,26,20]],gates:[crossing('tunnels-back','Dorelem Scrub',1,'scrub',[44,17,'left']),crossing('tunnels-forward','Dorelem',46,'dorelem',[3,17,'right'],'keep-entry')],spots:[...VALVES,{id:'tunnel-provisions',label:'Service keeper’s chest',x:12,y:18},{id:'sluice-notice',label:'Sluice instructions',x:8,y:17},{id:'armory-reliquary',label:'Sealed armory reliquary',x:23,y:8},person('tunnel-guide','Service keeper',11,19,'bystander'),{id:'area-sign',label:'Tunnel notice',x:27,y:12}],props:[{asset:'pipe',x:16,y:12,w:3,h:2},{asset:'pipe',x:30,y:10,w:3,h:2}]},
 dorelem:{name:'Dorelem',terrain:'keep',hub:true,road:[[1,17],[46,17]],gates:[crossing('dorelem-back','Service Tunnels',1,'tunnels',[44,17,'left']),crossing('dorelem-north','North Scrub Road',46,'northRoad',[3,17,'right'],'dorelem-north')],spots:[{id:'keep-treasury-reward',label:'Keep treasury',x:34,y:18},person('stablehand','Stablehand',16,12,1),person('surrendered-soldier','Surrendered soldier',20,21,2),person('local-aeric','Chaplain Walter',28,20,1),person('aldren','Ser Yusuf ibn Salim',34,12,0),{id:'quartermaster-ledger',label:'Requisition ledger',x:37,y:25}],props:[{asset:'house',x:6,y:5,w:8,h:6},{asset:'shop',x:6,y:21,w:8,h:6},{asset:'tent',x:17,y:5,w:6,h:5},{asset:'keep',x:27,y:4,w:15,h:7},{asset:'memorial',x:35,y:22,w:5,h:3}]},
 northRoad:{name:'North Scrub Road',area:'PHI-01',terrain:'ridge',road:[[1,17],[12,17],[12,24],[25,24],[25,8],[38,8],[38,17],[46,17]],grass:[[5,20,10,26],[16,21,22,27],[27,5,34,12]],gates:[crossing('north-back','Dorelem',1,'dorelem',[44,17,'left']),crossing('north-forward','Hospice Road',46,'hospiceRoad',[3,17,'right'])],spots:[{id:'area-sign',label:'Northern signpost',x:24,y:17},person('wounded-column','Wounded travellers',34,12,'bystander')],props:[{asset:'tent',x:30,y:20,w:6,h:5}]},
 hospiceRoad:{name:'Hospice Road',area:'PHI-02',terrain:'wetland',road:[[1,17],[12,17],[12,10],[26,10],[26,23],[39,23],[39,17],[46,17]],grass:[[15,6,22,12],[28,19,35,26]],gates:[crossing('hospice-road-back','North Scrub Road',1,'northRoad',[44,17,'left']),crossing('hospice-road-forward','Flooded Medicine Path',46,'medicinePath',[3,17,'right'])],spots:[person('hospice-volunteer','Hospice volunteer',9,14,1),{id:'area-sign',label:'Hospice sign',x:28,y:16}],props:[{asset:'tent',x:4,y:6,w:6,h:5}]},
 medicinePath:{name:'Flooded Medicine Path',area:'PHI-03',terrain:'wetland',road:[[1,17],[10,17],[10,25],[22,25],[22,9],[36,9],[36,17],[46,17]],grass:[[12,20,18,28],[25,5,32,12]],gates:[crossing('medicine-back','Hospice Road',1,'hospiceRoad',[44,17,'left']),crossing('medicine-forward','Philomere',46,'philomere',[3,17,'right'],'philomere-entry')],spots:[{id:'medicine-cache',label:'Medicine chest',x:28,y:14},{id:'area-sign',label:'Flood marker',x:8,y:20}],props:[{asset:'shelf',x:28,y:12,w:3,h:2}]},
 philomere:{name:'Philomere',terrain:'hospice',hub:true,road:[[1,17],[46,17]],gates:[crossing('philomere-back','Flooded Medicine Path',1,'medicinePath',[44,17,'left']),crossing('philomere-boundary','Rivercause Road',46)],spots:[person('local-aeric','Chaplain Walter',22,20,1),{id:'medicine-chain-reward',label:'Medicine reward',x:23,y:18},person('hospice-nurse','Dawn Bloom nurse',29,14,1),person('yselle','Abbess Aisha bint Ibrahim',35,12,1),person('patients','Waiting patients',18,14,'bystander')],props:[{asset:'house',x:6,y:5,w:8,h:6},{asset:'shop',x:6,y:21,w:8,h:6},{asset:'hospice',x:25,y:4,w:15,h:7},{asset:'tent',x:28,y:23,w:7,h:5},{asset:'shrine',x:17,y:4,w:5,h:5}]}
};
// Interior citizens inherit their settlement; route extensions retain their base faction.
export function territoryBloom(room){const parent=NEW_DOORS[room]?.room||room;return NEW_MAPS[parent]?.bloom??!!NEW_MAPS[parent];}
export const isNewInterior=room=>!!NEW_DOORS[room];
export function newRoad(room,x,y){const map=NEW_MAPS[room];if(!map)return false;const paths=[map.road,...(map.sidePaths||[]).map(p=>p.points)];return paths.some(path=>path.slice(1).some(([bx,by],i)=>{const [ax,ay]=path[i];return ax===bx?Math.abs(x-ax)<=1&&y>=Math.min(ay,by)-1&&y<=Math.max(ay,by)+1:Math.abs(y-ay)<=1&&x>=Math.min(ax,bx)-1&&x<=Math.max(ax,bx)+1;}));}
export function newGrass(room,x,y){return NEW_MAPS[room]?.grass?.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d)&&!newRoad(room,x,y)||false;}
export function newWalkable(room,x,y){if(isPromenade(room))return promenadeWalkable(x,y);const m=NEW_MAPS[room];if(!m)return false;if(m.finale)return finaleWalkable(m,x,y);if(room==='stormGlass'&&glassCraterBlocked(x,y))return false;if(m.stormRods?.some(([a,b])=>x===a&&y===b))return false;if(['square','lower'].includes(m.botruneKind))return botruneWalkable(m,x,y);if(m.stormMountain&&!newRoad(room,x,y)&&!m.spots.some(s=>Math.abs(s.x-x)+Math.abs(s.y-y)<=2)&&!m.gates.some(g=>Math.abs(g.x-x)+Math.abs(g.y-y)<=2)&&!(m.stormTower&&x>=25&&x<=42&&y>=12&&y<=17))return false;if(m.botruneKind==='storm')return !m.stormBoulders.some(([a,b,w,h])=>x>=a&&x<a+w&&y>=b&&y<b+h);if(m.farm)return !farmBlocked(x,y);if(Number.isInteger(m.exchangeFloor))return exchangeWalkable(m,x,y);if(m.aquaticCity)return aquaticWalkable(m,x,y);if(m.aquaticSolids?.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d))return false;if(jettyWater(room,x,y))return jettyWalkable(room,x,y);if(m.marasenWater?.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d)&&!newRoad(room,x,y))return false;if(m.marasenFort)return x===1&&y===17||x>=2&&x<=45&&y>=6&&y<=28&&(!(m.name.includes('Gate Court')?[18,34]:[30]).includes(x)||y>=16&&y<=18);if(m.leaderFort)return leaderFortWalkable(m,x,y);if(Number.isInteger(m.caveFloor)&&x>=39&&x<=41&&y>=20&&y<=22)return false;if(m.fortExterior&&x>=32&&x<=45&&y>=19&&y<=25)return false;if(fortCoastTile(m,x,y))return newRoad(room,x,y)||m.spots.some(s=>Math.abs(s.x-x)+Math.abs(s.y-y)<=1);if(m.docks&&x>=27)return m.docks.some(([left,top,right,bottom])=>x>=left&&x<=right&&y>=top&&y<=bottom);if(room==='tunnels'&&onBoard(x,y))return !boardWall(x,y);if(m.hub||m.courtSanctuary)return true;return newRoad(room,x,y)||newGrass(room,x,y)||(m.signClearings||[]).some(s=>Math.abs(s.x-x)+Math.abs(s.y-y)<=2)||m.spots.some(s=>Math.abs(s.x-x)+Math.abs(s.y-y)<=2);}
export function newBlocked(room,x,y){if(isPromenade(room))return !promenadeWalkable(x,y);const m=NEW_MAPS[room];if(x<0||x>=48||y<2||y>29)return true;if(x<=1||x>=46)return !m.gates.some(g=>g.x===x&&g.y===y);if(Object.values(NEW_DOORS).some(d=>d.room===room&&d.x===x&&d.y===y))return false;return !newWalkable(room,x,y)||m.spots.some(s=>!s.revoltEvent&&(s.questProp||s.sprite!==undefined&&!s.id.startsWith('TRN-'))&&s.x===x&&s.y===y)||m.props.some(p=>!p.decorative&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<p.y+p.h);}
export function newSpots(room){if(room==='dorelemHome')return [{id:'berry-salesman',label:'Mabel Rowan · Berry Pantry',x:24,y:14,sprite:0,revoltCharacter:'NPC-BERRY-MABEL'},{id:'household',label:'Stablehouse household',x:29,y:18,sprite:1},{id:'room-exit',label:'Return to Dorelem',x:24,y:27,door:true}];if(NEW_MAPS[room]?.finale)return [...NEW_MAPS[room].spots,...NEW_MAPS[room].gates,...Object.entries(NEW_DOORS).filter(([,d])=>d.room===room).map(([id,d])=>({id,label:d.name,x:d.x,y:d.y,door:true}))];if(['botruneShop','botruneClinic','botruneInn','botruneRecords'].includes(room))return [{id:({botruneShop:'local-supplies',botruneClinic:'local-aeric',botruneInn:'bt-inn-service',botruneRecords:'bt-records-service'})[room],label:({botruneShop:'Browse Botrune supplies',botruneClinic:'Walter · treatment and reserves',botruneInn:'Rest at the Last Bell',botruneRecords:'Read the civilian records'})[room],x:24,y:15,sprite:0,revoltCharacter:room==='botruneClinic'?'CHR-AERIC':'SHOP-PHI'},{id:'room-exit',label:'Return to lower streets',x:24,y:27,door:true}];if(room==='marasenArena')return [{id:'mr-race-board',label:'Race programme and wagers',x:24,y:15},{id:'mr-race-marshal',label:'Rapids Marshal',x:29,y:18,sprite:0},{id:'room-exit',label:'Return to Rapids',x:24,y:27,door:true}];if(['marasenMarket','marasenApothecary','marasenArchive','marasenMill'].includes(room))return [{id:({marasenMarket:'mr-seed-service',marasenApothecary:'mr-apothecary-service',marasenArchive:'mr-archive-service',marasenMill:'mr-mill-service'})[room],label:'Use this building’s service',x:24,y:15},{id:'local-supplies',label:'Browse specialist supplies',x:29,y:18,sprite:0,shopkeeper:'SHOP-PHI'},{id:'room-exit',label:'Return to Marasen',x:24,y:27,door:true}];const services={cossenneConservatory:['cs-conservatory-work','Pollinator pairs · paid memory game'],cossenneApothecary:['cs-apothecary-work','Apothecary bench · craft medicine'],cossenneFirewatch:['cs-firewatch-work','Relief dispatch board']};if(services[room])return [{id:services[room][0],label:services[room][1],x:24,y:15},{id:'cs-specialist-stock',label:'Browse specialist supplies',x:28,y:18,sprite:0,shopkeeper:'SHOP-PHI'},{id:'room-exit',label:'Leave',x:24,y:27,door:true}];if(room==='hospice')return [{id:'censmoke-care-board',label:'Incense guardian care notes',x:18,y:16,routeSign:true},{id:'hospice-records',label:'Ward records',x:24,y:14},{id:'hospice-ward-nurse',label:'Dawn Bloom ward nurse',x:20,y:18,sprite:1},{id:'hospice-soldier',label:'True Light sergeant',x:28,y:18,sprite:2},{id:'room-exit',label:'Leave',x:24,y:27,door:true}];if(NEW_DOORS[room])return [{id:room.endsWith('Shop')?'local-supplies':room==='hospice'?'hospice-records':'household',label:'Look around',x:24,y:14},{id:'room-exit',label:'Leave',x:24,y:27,door:true}];const m=NEW_MAPS[room];return m?[...m.spots,...m.gates,...Object.entries(NEW_DOORS).filter(([,d])=>d.room===room&&!d.hiddenEntrance).map(([id,d])=>({id,label:d.name,x:d.x,y:d.y,door:true}))]:null;}
export function drawNewMap(c,room,drawAsset){if(isPromenade(room)){drawPromenade(c);return;}const bloom=territoryBloom(room);const substitutions={grass:'bloomGround',path:'bloomPath',tree:'palm',house:'bloomHouse',shop:'bloomShop',keep:'bloomKeep',hospice:'bloomHospice',shrine:'bloomHouse',tent:'bloomShop'};const asset=(ctx,name,...args)=>drawAsset(ctx,biomeAsset(room,name,bloom)??(bloom?(substitutions[name]||name):name),...args);const m=NEW_MAPS[room];if(!m)return;if(drawFinaleMap(c,m,drawAsset))return;if(drawBotruneMap(c,m,room,drawAsset,newRoad,newGrass,newWalkable))return;if(Number.isInteger(m.exchangeFloor)){drawExchangeInterior(c,m,drawAsset);return;}if(drawCourtMap(c,room,newRoad,newGrass,newWalkable,drawAsset,m))return;for(let y=0;y<32;y++)for(let x=0;x<48;x++){
 const road=newRoad(room,x,y),walk=newWalkable(room,x,y),channel=!walk&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>newWalkable(room,x+dx,y+dy));if(drawMarasenTile(c,m,x,y,{road,walk,grass:newGrass(room,x,y)&&!newBlocked(room,x,y)},drawAsset)){}else if(drawOrchardTile(c,m,x,y,{road,walk,grass:newGrass(room,x,y)},drawAsset)){}else if(drawPassTile(c,m,x,y,{road,walk,grass:newGrass(room,x,y)},asset)){}else if(m.terrain==='fort'){drawFortTile(c,m,x,y,walk,newGrass(room,x,y),asset,channel);}else if(room==='anglersReach')asset(c,x>=27?'water':road?'path':'grass',x,y);else if(biomeFor(room)==='grotto'&&m.terrain==='tunnel')asset(c,!walk?(channel?'water':'biomegrottowall'):road?'path':newGrass(room,x,y)?'tallgrass':'grass',x,y);else if(m.terrain==='cave')asset(c,!walk?'biomecavewall':road?'path':newGrass(room,x,y)?'tallgrass':'grass',x,y);else asset(c,m.terrain==='tunnel'?(walk?(road?'path':'sewerFloor'):channel?'sewage':'sewerWall'):road?'path':newGrass(room,x,y)?'tallgrass':m.terrain==='wetland'&&!walk?'water':'grass',x,y);

 }
 if(m.hub){if(!m.verdantKind&&!m.orchardKind){for(let y=3;y<=28;y++)for(const x of [10,22,30,34])asset(c,'path',x,y);for(let x=8;x<=36;x++)asset(c,'path',x,13);}if(!m.orchardKind&&!m.aquaticCity)for(let x=0;x<48;x+=2){asset(c,'tree',x,0,2,3);asset(c,'tree',x,29,2,3);}if(room==='philomere')for(let y=2;y<30;y++)for(let x=41;x<46;x++)if(y<16||y>18)asset(c,'water',x,y);}
 if(!m.passKind&&(m.terrain==='ridge'||m.terrain==='cave'))for(let y=2;y<28;y+=3)for(let x=2;x<44;x+=2){const clear=[0,1].every(dx=>[0,1,2].every(dy=>!newWalkable(room,x+dx,y+dy)&&!m.props.some(p=>x+dx>=p.x&&x+dx<p.x+p.w&&y+dy>=p.y&&y+dy<p.y+p.h)));if(clear&&!fortCoastTile(m,x,y))asset(c,(x+y)%5===0?'tree':'ridge',x,y,2,3);}
 for(const [left,top,right,bottom] of m.docks||[]){for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){asset(c,'water',x,y);asset(c,'dockPlanks',x,y);}}
 if(m.docks){asset(c,'dockEnd',33,17,3,3);asset(c,'dockEnd',30,13,3,3);for(const [x,y] of [[27,19],[30,19],[33,19],[35,19],[30,13],[32,13]])asset(c,'dockPost',x,y,1,1.5);}
 if(m.fortExterior){drawFortCoast(c,m,(x,y)=>newWalkable(room,x,y),asset);drawFortExterior(c,asset);}
 if(m.terrain==='fort')drawFortArchitecture(c,m,(x,y)=>newWalkable(room,x,y),asset);
 if(m.leaderFort)drawLeaderFortDecor(c,m,asset);
 for(const p of m.props)asset(c,p.asset,p.x,p.y,p.w,p.h);
 for(const s of m.spots){if(s.routeSign){if(m.aquaticCity)drawAquaticNotice(c,m,s);else asset(c,'sign',s.x-1,s.y-3,4,3);}else if(s.wallSign)asset(c,'sign',s.x,s.y,1,1);else if(s.id.includes('sign'))asset(c,'sign',s.x,s.y-2,2,2);}
 if(room==='tunnels')for(const v of VALVES)asset(c,'valve',v.x,v.y,1,1);
 for(const d of Object.values(NEW_DOORS).filter(d=>d.room===room&&!d.hiddenEntrance)){if(!m.aquaticCity)asset(c,'mat',d.x,d.y+1);}
 drawLeaderFortEntrances(c,m,asset);
 drawExplorationScenery(c,m,{biome:!!biomeFor(room),asset:drawAsset});
 if(!m.verdantKind&&!m.farm)drawBiomeDetails(c,room,drawAsset,(x,y)=>newWalkable(room,x,y));
 drawPassDetails(c,m,asset,(x,y)=>newWalkable(room,x,y));drawEnvironmentArtwork(c,m,asset,(x,y)=>newWalkable(room,x,y));
 drawMarasenDetails(c,m,drawAsset,(x,y)=>newWalkable(room,x,y));for(const g of m.gates||[]){const e=g.entrance;if(e?.asset)drawAsset(c,e.asset,e.x,e.y,e.w,e.h);}drawOrchardDecor(c,m,drawAsset,(x,y)=>newWalkable(room,x,y));drawBiomeEntrances(c,m,asset);drawJetty(c,room,globalThis.performance?.now?.()||0);
 if(m.terrain==='fort'&&!m.leaderFort){c.save();for(const g of m.gates){const back=g.id.endsWith('-back'),x=back?3:44,y=17;c.fillStyle='#182b3bcc';c.fillRect((x-1)*16,y*16-21,48,16);c.fillStyle='#ffe3a5';c.font='bold 10px sans-serif';c.textAlign='center';c.fillText(back?(m.caveFloor===0?'EXIT ←':'UP ←'):'DOWN →',x*16+8,y*16-9);c.fillRect(x*16,y*16+6,16,3);c.beginPath();c.moveTo((x+(back?0:1))*16,y*16+1);c.lineTo((x+(back?-0.4:1.4))*16,y*16+7);c.lineTo((x+(back?0:1))*16,y*16+13);c.fill();}c.restore();}

}

extendRoutes(NEW_MAPS);
installSidePaths(NEW_MAPS);
NEW_MAPS.tunnels.road=[[1,17],[12,17],[12,8],[25,8],[25,24],[29,24],[29,17],[46,17]];
NEW_MAPS.tunnels.grass=[];
NEW_MAPS.tunnels.spots=NEW_MAPS.tunnels.spots.filter(s=>!s.id.startsWith('valve-'));
NEW_MAPS.tunnels.spots.find(s=>s.id==='sluice-notice').label='Stone chamber wall sign';
NEW_MAPS.tunnels.spots.find(s=>s.id==='sluice-notice').x=32;
NEW_MAPS.tunnels.spots.find(s=>s.id==='sluice-notice').y=14;
NEW_MAPS.hospiceRoad.spots.push({id:'lost-pilgrim',label:'Lost pilgrim',x:34,y:19,sprite:1});

NEW_MAPS.tunnels.spots.find(s=>s.id==='sluice-notice').wallSign=true;

installExpansionHabitats(NEW_MAPS);
installExplorationWorld(NEW_MAPS);

installCybressaWorld(NEW_MAPS,NEW_DOORS);
installMountainPass(NEW_MAPS);
installCossenneWorld(NEW_MAPS,NEW_DOORS);
installMarasenWorld(NEW_MAPS,NEW_DOORS);

installLeaderForts(NEW_MAPS);

installRelicQuestWorld(NEW_MAPS);
installCampaignWorld(NEW_MAPS);installJetties(NEW_MAPS);
installBiomeWorld(NEW_MAPS);

installRouteSignposts(NEW_MAPS);

installCourtWorld(NEW_MAPS);

installJungleWorld(NEW_MAPS);

installRevoltWorld(NEW_MAPS);

installBotruneWorld(NEW_MAPS,NEW_DOORS);
installFinaleWorld(NEW_MAPS,NEW_DOORS);


installPromenade(NEW_MAPS);

if(NEW_MAPS.emberQuarry&&!NEW_MAPS.emberQuarry.spots.some(s=>s.id==='censmoke-care-board'))NEW_MAPS.emberQuarry.spots.push({id:'censmoke-care-board',label:'Read incense guardian cultivation notes',x:22,y:16,routeSign:true});

