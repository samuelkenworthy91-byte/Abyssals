import {BERRY_SHOP_ASSETS,drawBerryShop,berryShopBlocked} from './berry-shop.js?v=0.90.41';
import {roomGrid,isPromenade,promenadeWalkable,drawPromenade,promenadeGate} from './promenade.js?v=0.90.37';
import {FINALE_ASSETS} from './finale-art.js?v=0.90.19';
import {BOTRUNE_ASSETS} from './botrune-art.js?v=0.90.20';
import {onCourtArtChange} from './paladin-art.js?v=0.90.20';
import {COSSENNE_ACTIVITY_ROOMS} from './cossenne-services.js?v=0.87.0';
import {REVOLT_EVENTS,REVOLT_CAST} from './revolt-data.js?v=0.90.41';
import {LIFE_EMBER_PICKUPS} from './extra-lives.js?v=0.87.0';
import {TRAVEL_HUBS} from './fast-travel.js?v=0.90.46';
import {BIOME_ASSETS,biomeAsset,drawBiomeDetails} from './biome-world.js?v=0.90.41';
import {SHOPKEEPERS} from './shopkeepers.js?v=0.90.41';
import {EXTRA_TRAINERS} from './route-progression.js?v=0.90.41';
import {INTERIORS,interiorBlocked,drawInterior} from './interiors.js?v=0.90.13';
import {NEW_MAPS,NEW_DOORS,newRoad,newGrass,newBlocked,newSpots,drawNewMap} from './expansion-world.js?v=0.90.41';
// Authored prototype geometry. All movement/collision is defined here, independently of art.
export const TILE=16, WIDTH=48, HEIGHT=32;
export const AREA_GATES={town:[{id:'exit',x:46,y:17,to:'march',arrival:[3,17,'right'],action:'departure'}],march:[{id:'town-return',x:1,y:17,to:'town',arrival:[44,17,'left']},{id:'march-stage-forward',x:46,y:17,to:'march2',arrival:[3,17,'right'],action:undefined}],scrub:[{id:'march-return',x:1,y:17,to:'march',arrival:[44,17,'left']},{id:'scrub-boundary',x:46,y:17}]};
for(const [room,m] of Object.entries(NEW_MAPS))AREA_GATES[room]=m.gates;
export function gateAt(room,x,y){if(isPromenade(room))return promenadeGate(AREA_GATES[room],x,y);return AREA_GATES[room]?.find(g=>g.x===x&&g.y===y||NEW_MAPS[room]?.sidePaths?.some(p=>p.gateId===g.id)&&Math.abs(g.x-x)<=1&&g.y===y);}
export const DOORS={pate:{x:9,y:10},trade:{x:21,y:10},shop:{x:9,y:26}};
Object.assign(DOORS,NEW_DOORS);
const outdoor=[
 {id:'TRN-C01-002',label:'Recruit Roger de Warenne',x:42,y:20,sprite:2},
 {id:'pate',label:'Pate’s home',x:9,y:10,n:1,door:true},
 {id:'trade',label:'Trade’s home',x:21,y:10,n:2,door:true},
 {id:'kurg',label:'General William',x:36,y:13,n:3,sprite:0},
 {id:'aeric',label:'Chaplain Walter',x:28,y:13,n:4,sprite:1},
 {id:'beric',label:'Enlistment test',x:40,y:14,n:5,sprite:2},
 {id:'shop',label:'Supplies',x:9,y:26,door:true},
 {id:'shrine',label:'True Light shrine',x:30,y:9},
 {id:'memorial',label:'Memorial',x:37,y:25},
 {id:'hill',label:'Childhood Hill',x:24,y:4},
 {id:'exit',label:'Enter Civeton March',x:46,y:17,n:6,door:true}
];
for(const e of REVOLT_EVENTS.filter(e=>e.room==='town'))outdoor.push({id:'revolt-'+e.id,label:REVOLT_CAST[e.character].name,x:e.at[0],y:e.at[1],sprite:0,revoltEvent:e.id,revoltCharacter:e.character,facing:'down'});
for(const pickup of LIFE_EMBER_PICKUPS)NEW_MAPS[pickup.room].spots.push({...pickup});
for(const hub of TRAVEL_HUBS){const spot={id:hub.id,label:hub.name+' caravan hub',x:hub.x,y:hub.y,sprite:0,shopkeeper:'CHR-SALVAGER'};(hub.room==='town'?outdoor:NEW_MAPS[hub.room].spots).push(spot);}
export const MARCH_GRASS=[[12,6,18,12],[23,6,30,13],[23,19,29,27],[33,20,40,27],[37,12,43,18]];
export const MARCH_ROAD=[[1,17],[14,17],[14,9],[25,9],[25,23],[37,23],[37,17],[46,17]];
export function isRouteRoad(x,y){return MARCH_ROAD.slice(1).some(([bx,by],i)=>{const [ax,ay]=MARCH_ROAD[i];return ax===bx?Math.abs(x-ax)<=1&&y>=Math.min(ay,by)-1&&y<=Math.max(ay,by)+1:Math.abs(y-ay)<=1&&x>=Math.min(ax,bx)-1&&x<=Math.max(ax,bx)+1;});}
function inGrass(x,y){return MARCH_GRASS.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d);}
export function isMarchWalkable(x,y){return isRouteRoad(x,y)||inGrass(x,y)||(x>=2&&x<=12&&y>=14&&y<=26);}
export function isEncounterTerrain(room,x,y){return (NEW_MAPS[room]?.area?(NEW_MAPS[room]?.base==='tunnels'?x>2&&x<45:newGrass(room,x,y)):room==='march'&&inGrass(x,y)&&!isRouteRoad(x,y)&&!isBlocked(room,x,y))&&!isBlocked(room,x,y);}
const routeSpots=[{id:'march-provisions',label:'Abandoned hemp sack',x:7,y:20},{id:'town-return',label:'Return to Civeton',x:1,y:17,door:true},{id:'bystander',label:'Taming lesson',x:8,y:15,sprite:'bystander',n:1},{id:'route-sign',label:'Read route noticeboard',x:5,y:18,routeSign:true},{id:'march-stage-forward',label:'Continue Civeton March',x:46,y:17,n:2,door:true}];
routeSpots.push(...EXTRA_TRAINERS.filter(t=>t.room==='march').map(t=>({id:t.id,label:t.name,x:t.x,y:t.y,sprite:2,patrol:[[14,16],[14,12],[14,16],[11,16]]})));
const scrubSpots=[{id:'march-return',label:'Return to Civeton March',x:1,y:17,door:true},{id:'scrub-boundary',label:'Beyond the entrance',x:46,y:17,door:true}];
const roomNames={scrub:'Dorelem Scrub',march:'Civeton March',pate:'Pate’s home',trade:'Trade’s home',shop:'Civeton supplies'};
export function roomName(room){return NEW_MAPS[room]?.name||NEW_DOORS[room]?.name||roomNames[room]||'Civeton';}
export function spotsFor(room){if(COSSENNE_ACTIVITY_ROOMS.includes(room))return newSpots(room);if(SHOPKEEPERS[room])return [{id:'local-supplies',label:SHOPKEEPERS[room].name,x:24,y:14,sprite:0,shopkeeper:SHOPKEEPERS[room].id},{id:'room-exit',label:'Leave',x:24,y:27,door:true}];if(newSpots(room))return newSpots(room);return room==='town'?outdoor:room==='march'?routeSpots:room==='scrub'?scrubSpots:[{id:room,label:room==='pate'?'Unfinished breakfast':room==='trade'?'Empty writing desk':'Browse supplies',x:24,y:14,n:room==='pate'?1:room==='trade'?2:undefined},{id:'room-exit',label:'Return to Civeton',x:24,y:27,door:true}];}
const props=[
 {asset:'house',x:5,y:5,w:8,h:6,solid:[5,5,12,10]},
 {asset:'house',x:17,y:5,w:8,h:6,solid:[17,5,24,10]},
 {asset:'shop',x:5,y:21,w:8,h:6,solid:[5,21,12,26]},
 {asset:'shrine',x:28,y:5,w:5,h:5,solid:[29,5,31,8]},
 {asset:'tent',x:34,y:5,w:7,h:6,solid:[34,5,40,10]},
 {asset:'tent',x:41,y:7,w:5,h:5,solid:[41,7,45,11]},
 {asset:'memorial',x:35,y:22,w:5,h:4,solid:[35,22,39,24]}
];
export function isBlocked(room,x,y){if(room==='dorelemHome')return berryShopBlocked(x,y)||newSpots(room).some(s=>s.sprite!==undefined&&s.x===x&&s.y===y);
 if(isPromenade(room))return !promenadeWalkable(x,y);
 if(x<0||y<0||x>=WIDTH||y>=HEIGHT)return true;
 if(NEW_MAPS[room])return newBlocked(room,x,y);
 if(room==='hospice'&&newSpots(room).some(s=>s.sprite!==undefined&&s.x===x&&s.y===y))return true;
 if(COSSENNE_ACTIVITY_ROOMS.includes(room)){if(newSpots(room).some(s=>s.sprite!==undefined&&s.x===x&&s.y===y))return true;}else if(SHOPKEEPERS[room]&&x===24&&y===14)return true;if(INTERIORS[room])return interiorBlocked(room,x,y);
 if(['town','march','scrub'].includes(room)&&(x<=1||x>=46))return !AREA_GATES[room].some(g=>g.x===x&&g.y===y);
 if(room==='scrub')return !(x>=2&&x<=45&&y>=16&&y<=18);
 if(room==='march')return !isMarchWalkable(x,y)||(x===8&&y===15)||(x===5&&y===18);
 if(room!=='town'){
  if(x<14||x>34||y<7||y>27)return true;
  if(y===27&&x!==24)return true;
  return (x>=16&&x<=19&&y>=8&&y<=13)||(x>=29&&x<=33&&y>=8&&y<=10)||(x>=21&&x<=26&&y>=11&&y<=13);
 }
 if(Object.values(DOORS).some(d=>!d.room&&d.x===x&&d.y===y))return false;
 if((x<2||x>45||y<2||y>29)&&!(y>=16&&y<=18))return true;
 if(props.some(p=>{const [a,b,c,d]=p.solid;return x>=a&&x<=c&&y>=b&&y<=d;}))return true;
 if(outdoor.some(s=>s.sprite!==undefined&&!s.id.startsWith('TRN-')&&s.x===x&&s.y===y))return true;
 return false;
}
const assetFiles={fortBanner:'fort-banner-v037.webp',fortCarpet:'fort-carpet-v037.webp',fortGate:'fort-gate-v037.webp',fortStone:'fort-stone-v037.webp',fortBastion:'fort-bastion-v037.webp',fortFloor:'fort-floor-v037.webp',fortWall:'fort-wall-v037.webp',fortArch:'fort-arch-v037.webp',fortPier:'fort-pier-v037.webp',dockPlanks:'dock-planks-v0303.webp',dockEnd:'dock-end-v0303.webp',dockPost:'dock-post-v0303.webp',fishingCrate:'fishing-crate-v0303.webp',sewerFloor:'sewer-floor.webp',sewerWall:'sewer-wall.webp',sewage:'sewage.webp',sluice:'sluice.webp',chest:'chest.webp',sack:'sack.webp',valve:'valve.webp',pipe:'pipe.webp',bloomHouse:'bloom-house.webp',bloomShop:'bloom-shop.webp',bloomKeep:'bloom-keep.webp',bloomHospice:'bloom-hospice.webp',bloomGround:'bloom-ground.webp',bloomPath:'bloom-path.webp',palm:'palm.webp',rug:'rug.webp',keep:'tile-keep-v13.webp',hospice:'tile-hospice-v13.webp',ridge:'tile-ridge-v13.webp',tallgrass:'tile-tallgrass.png',sign:'tile-sign.png',bramble:'tile-bramble.png',fence:'tile-fence.png',grass:'tile-grass.png',path:'tile-path.png',water:'tile-water.png',floor:'tile-floor.png',tree:'tile-tree.png',house:'tile-house.png',shop:'tile-shop.png',shrine:'tile-shrine.png',tent:'tile-tent.png',memorial:'tile-memorial.png',table:'tile-table.png',desk:'tile-desk.png',bed:'tile-bed.png',shelf:'tile-shelf.png',wall:'tile-wall.png',mat:'tile-mat.png'};
Object.assign(assetFiles,BERRY_SHOP_ASSETS,BIOME_ASSETS,BOTRUNE_ASSETS,FINALE_ASSETS);
const art={};for(const [name,file]of Object.entries(assetFiles)){const im=new Image();im.onload=()=>mapCache.clear();im.src='assets/pixel/'+file;art[name]=im;}
const mapCache=new Map();
onCourtArtChange(()=>mapCache.clear());
export function drawWorldAsset(ctx,name,x,y,w=1,h=1,crop=null){if(name==='water')name='biomewetlandwater';const im=art[name];if(im?.complete&&im.naturalWidth){if(name.startsWith('aquatic')){ctx.save();ctx.imageSmoothingEnabled=false;if(crop)ctx.drawImage(im,crop.x,crop.y,crop.w,crop.h,x*TILE,y*TILE,w*TILE,h*TILE);else ctx.drawImage(im,x*TILE,y*TILE,w*TILE,h*TILE);ctx.restore();return;}if(crop)ctx.drawImage(im,crop.x,crop.y,crop.w,crop.h,x*TILE,y*TILE,w*TILE,h*TILE);else if(name==='sign')ctx.drawImage(im,16,12,34,42,x*TILE,y*TILE,w*TILE,h*TILE);else if(name.startsWith('biome')&&/ground|path|grass|wall|water/.test(name)&&w===1&&h===1)ctx.drawImage(im,(x%8)*16,(y%8)*16,16,16,x*TILE,y*TILE,TILE,TILE);else ctx.drawImage(im,x*TILE,y*TILE,w*TILE,h*TILE);}}
const asset=(ctx,name,...args)=>drawWorldAsset(ctx,name,...args);
function buildMap(room){const surface=document.createElement('canvas');surface.width=WIDTH*TILE;surface.height=HEIGHT*TILE;const c=surface.getContext('2d');c.imageSmoothingEnabled=false;
 const asset=(ctx,name,...args)=>drawWorldAsset(ctx,biomeAsset(room,name)??name,...args);
 if(room==='dorelemHome'){drawBerryShop(c,drawWorldAsset);}else if(NEW_MAPS[room]){drawNewMap(c,room,drawWorldAsset);
 }else if(room==='scrub'){
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)asset(c,y>=16&&y<=18?'path':'grass',x,y);
  for(let x=0;x<WIDTH;x+=2){asset(c,'bramble',x,12,2,4);asset(c,'bramble',x,19,2,4);asset(c,'tree',x,5,2,3);asset(c,'tree',x,25,2,3);}
 }else if(room==='march'){
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)asset(c,'grass',x,y);
  for(const [x0,y0,x1,y1] of MARCH_GRASS)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)asset(c,'tallgrass',x,y);
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)if(isRouteRoad(x,y))asset(c,'path',x,y);else if(!isMarchWalkable(x,y))asset(c,'biomesnowwall',x,y);
  for(let y=0;y<HEIGHT-2;y+=3)for(let x=0;x<WIDTH-1;x+=2)if([0,1].every(dx=>[0,1,2].every(dy=>!isMarchWalkable(x+dx,y+dy))))asset(c,'tree',x,y,2,3);
  asset(c,'bramble',18,14,4,5);asset(c,'bramble',29,15,3,4);asset(c,'sign',4,15,4,3);
  for(let x=4;x<=10;x+=3)asset(c,'fence',x,12,3,2);
  asset(c,'tent',5,5,6,6);
 }else if(room==='town'){
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)asset(c,y<3?'biomesnowwall':'grass',x,y);
  for(let y=16;y<=18;y++)for(let x=0;x<WIDTH;x++)asset(c,'path',x,y);
  for(let x=23;x<=25;x++)for(let y=3;y<=29;y++)asset(c,'path',x,y);
  for(const d of Object.values(DOORS).filter(d=>!d.room))for(let y=d.y;y<=(d.y<17?17:26);y++)asset(c,'path',d.x,y);
  for(let y=18;y<=26;y++)asset(c,'path',9,y);
  for(let x=25;x<=42;x++)asset(c,'path',x,13);
  for(let y=13;y<=17;y++)asset(c,'path',40,y);
  for(let y=18;y<=26;y++)asset(c,'path',37,y);
  for(let x=24;x<=37;x++)asset(c,'path',x,26);
  for(let x=0;x<48;x+=2){asset(c,'tree',x,0,2,3);asset(c,'tree',x,29,2,3);}
  for(let y=2;y<29;y+=3)if(y<14||y>18){asset(c,'tree',0,y,2,3);asset(c,'tree',46,y,2,3);}
  props.forEach(p=>asset(c,p.asset,p.x,p.y,p.w,p.h));
  for(const d of Object.values(DOORS).filter(d=>!d.room))asset(c,'mat',d.x,d.y+1);
 }else{drawInterior(c,room,drawWorldAsset);
 }
 for(const gate of AREA_GATES[room]||[]){
  // Main exits retain doorway mats; directions live on the single route board.
  if(gate.entrance||NEW_MAPS[room]?.sidePaths?.some(p=>p.gateId===gate.id))continue;
  asset(c,'mat',gate.x,gate.y);
 }
 if(!NEW_MAPS[room])drawBiomeDetails(c,room,drawWorldAsset,(x,y)=>!isBlocked(room,x,y));
 return surface;
}
export function drawMap(ctx,room){if(isPromenade(room)){drawPromenade(ctx);return;}if(!art.grass.complete||!art.floor.complete)return;if(!mapCache.has(room))mapCache.set(room,buildMap(room));const map=mapCache.get(room);if(map)ctx.drawImage(map,0,0);}

export function nearestWalkable(room,x,y){if(!isBlocked(room,x,y))return [x,y];let best=[24,23],distance=Infinity;for(let ty=0;ty<roomGrid(room)[1];ty++)for(let tx=0;tx<roomGrid(room)[0];tx++){const d=Math.abs(tx-x)+Math.abs(ty-y);if(d<distance&&!isBlocked(room,tx,ty)){distance=d;best=[tx,ty];}}return best;}

