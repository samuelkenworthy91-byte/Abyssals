import {isReducedMotion} from './motion.js?v=0.87.0';
import {DATA} from './data.js?v=0.87.0';
import {SIDE_POOLS,ROAD_POOLS} from './encounter-pools.js?v=0.87.0';
import {CYBRESSA_ROUTES} from './cybressa-data.js?v=0.87.0';
import {legalForm,rootForm} from './route-roster.js?v=0.87.0';
import {encounterWeights} from './expedition-abilities.js?v=0.87.0';
import {hashSeed} from './progression.js?v=0.87.0';
export const JETTIES=[
 ['medicinePath','Floodplain jetty',['051','079','139'],10,14],
 ['glassSluice','Mineral-water jetty',['051','139'],10,16],
 ['reedSanctuary','Reed-bed jetty',['079','133','139','382','387','396'],18,24],
 ['coralGrotto','Coral-cove jetty',['376','381','079','396'],22,28],
 ['moonlitDepths','Moonpool jetty',['378','053','139','396'],28,34],
 ['philomereBackwaters','Backwater jetty',['051','079','139','387'],30,36],
 ['smugglersWeir','Weir jetty',['051','133','139','388'],34,40],
 ['rivercause','Rivercause jetty',['051','079','139'],28,34]
].map(([room,name,extra,min,max])=>({id:'jetty-'+room,room,name,extra,min,max,x:33,y:28}));
export const jettyFor=room=>JETTIES.find(j=>j.room===room);
export function jettyWater(room,x,y){return !!jettyFor(room)&&x>=30&&x<=36&&y>=26&&y<=29;}
export function jettyWalkable(room,x,y){return !!jettyFor(room)&&x>=32&&x<=34&&y>=25&&y<=28;}
export function installJetties(maps){for(const j of JETTIES){const m=maps[j.room];if(!m)continue;m.jetty=j.id;m.sidePaths??=[];m.sidePaths.push({points:[[28,17],[28,24],[33,24],[33,28]]});m.spots.push({id:j.id,label:j.name+' · free fishing',x:j.x,y:j.y,jetty:true});}}
export function jettySlots(room,phase='DAY'){
 const j=jettyFor(room);if(!j)return [];const pool=SIDE_POOLS[room]||ROAD_POOLS[room]||CYBRESSA_ROUTES[room];
 const ids=[...new Set([...(pool?.[phase]||[]).map(rootForm),...j.extra])].filter(id=>DATA.species.find(s=>s.id===id)?.types.includes('WATER'));
 return ids.map((species_id,i)=>({species_id,weight:['387','396'].includes(species_id)?8:j.extra.includes(species_id)&&+species_id>=376?2:i<3?25:8,rarity:['387','396'].includes(species_id)?'Uncommon':+species_id>=376?'Rare':i<3?'Common':'Uncommon'}));
}
export function nextJettyEncounter(state,room,phase,random,leader=null){
 const j=jettyFor(room),slots=jettySlots(room,phase);if(!j||!slots.length||!state.sideAdventures?.fishing?.rod)return null;
 const bounds=SIDE_POOLS[room]||ROAD_POOLS[room]||CYBRESSA_ROUTES[room]||j,min=bounds.min??j.min,max=bounds.max??j.max;
 const weights=encounterWeights(slots,leader);let roll=random()*weights.reduce((n,v)=>n+v,0),index=0;for(;index<weights.length-1;index++){roll-=weights[index];if(roll<0)break;}
 const level=min+Math.min(max-min,Math.floor(random()*(max-min+1)));state.jettyCasts??={};const cast=state.jettyCasts[room]=(state.jettyCasts[room]||0)+1;
 return {speciesId:legalForm(slots[index].species_id,level),level,phase,tableId:j.id+'-'+phase,jettyId:j.id,seed:'jetty:'+room+':'+cast+':'+hashSeed(String(random()))};
}
// Transfer exactly once, including legacy finished contests with leftover bait.
export function keepContestBait(state){const c=state.sideAdventures?.fishing?.contest;state.riverBait=Number.isSafeInteger(state.riverBait)&&state.riverBait>=0?state.riverBait:0;if(!c||c.baitInBag)return false;state.riverBait+=Math.max(0,Math.floor(c.bait||0));c.baitInBag=true;return true;}
export function canOfferRiverBait(state,battle){
 if(!(state.riverBait>0)||!battle||battle.trainer||battle.questGuard||!battle.enemies?.[0]?.species.types.includes('WATER'))return false;
 if(battle.jettyId)return JETTIES.some(j=>j.id===battle.jettyId);
 const c=state.sideAdventures?.fishing?.contest;return !!c&&!c.finished&&!c.entry&&c.day===battle.fishingDay;
}
export function spendRiverBait(state,battle){if(!canOfferRiverBait(state,battle))return false;state.riverBait--;const c=state.sideAdventures?.fishing?.contest;if(!battle.jettyId&&c?.day===battle.fishingDay)c.bait=Math.max(0,c.bait-1);return true;}
export function drawJetty(ctx,room,time=0){const j=jettyFor(room);if(!j)return;time=isReducedMotion()?0:time;ctx.save();
 const x=30*16,y=26*16;ctx.fillStyle='#214b61';ctx.fillRect(x,y,7*16,4*16);ctx.strokeStyle='#74bfca88';ctx.lineWidth=1;for(let n=0;n<14;n++){const wx=x+5+(n*29)%105,wy=y+5+(n*13)%55;ctx.beginPath();ctx.moveTo(wx,wy);ctx.quadraticCurveTo(wx+4,wy+Math.sin(time/700+n)*2,wx+9,wy);ctx.stroke();}
 for(let py=25;py<=28;py++)for(let px=32;px<=34;px++){const sx=px*16,sy=py*16;ctx.fillStyle='#2e2824';ctx.fillRect(sx,sy,16,16);for(let n=0;n<4;n++){ctx.fillStyle=['#ba9061','#a77c50','#c5a070','#ad8055'][(n+py)%4];ctx.fillRect(sx+1,sy+n*4,14,3);ctx.fillStyle='#ead2a0';ctx.fillRect(sx+2,sy+n*4,12,1);ctx.fillStyle='#514333';ctx.fillRect(sx+3,sy+n*4+2,1,1);ctx.fillRect(sx+12,sy+n*4+2,1,1);}}
 for(const px of [32,35])for(const py of [25,28]){const sx=px*16-3,sy=py*16;ctx.fillStyle='#342b24';ctx.fillRect(sx,sy-9,6,22);ctx.fillStyle='#b99361';ctx.fillRect(sx+1,sy-10,4,20);ctx.fillStyle='#e0c79b';ctx.fillRect(sx,sy-11,6,3);ctx.strokeStyle='#ac9670';ctx.beginPath();ctx.moveTo(sx+3,sy-5);ctx.lineTo(sx+3,(py===25?28:25)*16-5);ctx.stroke();}
 ctx.fillStyle='#745132';ctx.fillRect(32*16+4,27*16-4,10,10);ctx.strokeStyle='#d5bd85';ctx.strokeRect(32*16+5,27*16-3,8,8);ctx.beginPath();ctx.moveTo(34*16+4,28*16);ctx.lineTo(34*16+13,28*16-19);ctx.stroke();ctx.restore();
}
