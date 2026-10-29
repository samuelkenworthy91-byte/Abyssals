import {GLASS_CRATERS,MOUNTAIN_FLIGHTS,MOUNTAIN_ENTRY} from './storm-props.js?v=0.90.52';
import {isStormRoom} from './storm-weather.js?v=0.90.52';
import {drawCompanion} from './companion.js?v=0.90.52';
import {canMeetStormDragon,stormState} from './thunderplain-rules.js?v=0.90.52';
import {DATA} from './data.js?v=0.90.52';
import {STORM_ROAD,BOTRUNE_GUARDS} from './botrune-data.js?v=0.90.52';
import {botruneState,btDefeated,trialVictims} from './botrune-rules.js?v=0.90.52';
export const BOTRUNE_ASSETS={btMountainSteps:'bt-mountain-steps-v09014.webp',btBrokenCart:'bt-broken-cart-v09014.webp',btGlassCrater:'bt-glass-crater-v09014.webp',btConductor:'bt-conductor-v09013.webp',btAbbey:'bt-abbey-v09013.webp',btHouse:'bt-garrison-house-v09013.webp',btScriptorium:'bt-scriptorium-v09013.webp'};
export const victims=[['prisoner-1',17,'TRN-C02-001'],['prisoner-2',21,'TRN-C02-002'],['prisoner-3',25,'TRN-C01-002'],['CHR-PATE',29,'CHR-PATE'],['CHR-TRADE',33,'CHR-TRADE']];
export function drawBotruneMap(c,m,room,asset,road,grass,walkable){
 if(!m.botruneKind)return false;
 const square=m.botruneKind==='square',lower=m.botruneKind==='lower';
 c.save();c.filter=square||lower?'grayscale(.85) brightness(.46)':'grayscale(.85) brightness(.72)';
 for(let y=0;y<32;y++)for(let x=0;x<48;x++){
  const path=road(room,x,y),walk=walkable(room,x,y);
  asset(c,square||lower?'fortFloor':m.stormMountain?(path?'biomepassRidgepath':'biomepassRidgeground'):path?'biomequarrypath':grass(room,x,y)?'biomequarrygrass':'biomequarryground',x,y);
  if(!square&&!lower){c.fillStyle=path?'#95a5b011':'#18283e55';c.fillRect(x*16,y*16,16,16);}
 }
 c.restore();if(square||lower)drawSlate(c,0,0,768,512);
 if(square){
  // The dais and single broad staircase retain the exact unbypassable guard geometry.
  c.fillStyle='#111724';c.fillRect(0,0,768,48);
  asset(c,'btAbbey',9,-8,35,15);
  for(const [x,w]of [[0,12],[41,7]]){for(let y=3;y<21;y++)for(let xx=x;xx<x+w;xx++)asset(c,'fortWall',xx,y,1,1);}
  asset(c,'btHouse',0,3,11,13);asset(c,'btScriptorium',41,3,7,13);
  for(const [x,w]of [[12,8],[29,12]])for(let y=10;y<=20;y++)for(let xx=x;xx<x+w;xx++)asset(c,'fortWall',xx,y,1,1);
  for(let y=10;y<=20;y++){c.fillStyle=y%2?'#90939e':'#626977';c.fillRect(20*16,y*16,9*16,16);c.fillStyle='#c3c6ce';c.fillRect(20*16,y*16,9*16,3);c.fillStyle='#303845';c.fillRect(20*16,y*16+13,9*16,3);}
  c.fillStyle='#413843';c.fillRect(12*16,3*16,29*16,6*16);for(let y=3;y<9;y++){c.fillStyle='#7f6e70';c.fillRect(12*16,y*16+15,29*16,1);}
  for(const x of [12,40]){c.fillStyle='#444957';c.fillRect(x*16,8*16,16,2*16);c.fillStyle='#c3ab75';c.fillRect(x*16+3,8*16,10,3);}
  asset(c,'fortBanner',12,3,2,5);asset(c,'fortBanner',39,3,2,5);asset(c,'shelf',36,4,3,2);
  c.fillStyle='#d1b87a';c.font='bold 11px serif';c.textAlign='center';c.fillText('BOTRUNE · ABBEY SQUARE',24*16,28);
 }else if(lower){
  for(const b of m.botruneBuildings)asset(c,b.asset,b.x,b.y,b.w,b.h);
  for(const [x,y]of [[18,6],[28,6],[18,25],[28,25]]){c.fillStyle='#28303b';c.fillRect(x*16+6,y*16-20,4,36);c.fillStyle='#ffd18a';c.fillRect(x*16+3,y*16-23,10,11);c.fillStyle='#9b7955';c.fillRect(x*16+1,y*16-25,14,3);}
  c.strokeStyle='#756858';c.lineWidth=1;for(const x of [22,26]){c.beginPath();c.moveTo(x*16,2*16);c.lineTo(x*16,30*16);c.stroke();}
  c.fillStyle='#d1b87a';c.font='bold 10px serif';c.textAlign='center';c.fillText('LOWER GARRISON STREETS',24*16,22);
 }else{
  if(room==='stormGlass')for(const p of GLASS_CRATERS)asset(c,'btGlassCrater',p.x,p.y,p.w,p.h);
  // Existing quarry ground/cliffs and fort architecture are reused; the conductor
  // structures are native pixel drawings, with collision restricted to terrain.
  for(const [x,y,w,h]of m.stormBoulders||[])asset(c,'biomequarryrock',x,y-1,w,h+1);
  for(const [x,y]of m.stormRods||[])asset(c,'btConductor',x-1,y-5,3,6);
  for(let n=0;n<(room==='stormGlass'?0:9);n++){const x=3+(n*13)%42,y=3+(n*7)%25;if(!road(room,x,y)){c.strokeStyle='#a0b6b577';c.lineWidth=1;c.beginPath();c.moveTo(x*16,y*16);c.lineTo(x*16+12,y*16+5);c.lineTo(x*16+5,y*16+14);c.stroke();}}
  if(m.stormMountain){
   c.save();c.filter='grayscale(.9) brightness(.7)';for(let y=0;y<32;y++)for(let x=0;x<48;x++)if(!walkable(room,x,y))asset(c,'biomepassRidgewall',x,y,1,1);c.restore();
   for(const p of MOUNTAIN_FLIGHTS)asset(c,'btMountainSteps',p.x,p.y,p.w,p.h);
   if(m.stormCave){for(let x=13;x<23;x++)asset(c,'fortWall',x,5,1,5);c.fillStyle='#130f15';c.fillRect(16*16,8*16,5*16,3*16);}
   if(m.stormTower){drawSlate(c,25*16,2*16,18*16,13*16);asset(c,'btConductor',28,0,10,13);for(const x of [25,42])for(let y=3;y<14;y++)asset(c,'fortWall',x,y,1,1);}
  }
  for(const p of m.props)asset(c,p.asset,p.x,p.y,p.w,p.h);
  for(const s of m.spots)if(s.routeSign)asset(c,'sign',s.x-1,s.y-3,4,3);
 }
 for(const g of m.gates){if(g.action==='storm-side'){if(g.to==='stormDariusCamp'){const p=MOUNTAIN_ENTRY;asset(c,'btMountainSteps',p.x,p.y,p.w,p.h);}else asset(c,'btConductor',g.x-3,g.y-5,3,6);}c.fillStyle='#bcc6bd';c.fillRect(g.x*16+4,g.y*16+6,8,4);}
 return true;
}
export function drawBotrunePeople(c,s,room,time,reduced,drawHuman,presentation){
 if(room!=='botrune')return;
 const dead=trialVictims(s),q=botruneState(s);
 for(const [id,x,portrait]of victims){const falling=presentation?.victim===id,down=dead.includes(id)&&!falling;c.save();if(down||falling){c.translate(x*16+8,6*16+8);c.rotate(-Math.PI/2*(down?1:presentation.progress));c.translate(-x*16-8,-6*16-8);c.globalAlpha=.82;}drawHuman(c,{id,revoltCharacter:portrait,x,y:6,px:x*16+8,py:6*16+8,facing:'down'});c.restore();}
 if(presentation&&!presentation.victim.startsWith('CHR-')){const target=presentation.x;drawHuman(c,{id:'bt-executioner',revoltCharacter:'LDR-06',x:target,y:7,px:target*16+8,py:7*16+8,facing:'up'});if(presentation){c.save();c.translate(target*16+12,7*16-20);c.rotate(-1.3+presentation.progress*2);c.fillStyle='#cbd5db';c.fillRect(-2,-28,4,27);c.fillStyle='#b6985f';c.fillRect(-6,-2,12,3);c.fillRect(-2,0,4,8);c.restore();}}
 // A silent crowd, spaced clear of the walkable staircase.
 for(const [i,[x,y]]of [[5,22],[11,27],[17,23],[31,23],[36,27],[43,26]].entries())drawHuman(c,{id:'bt-crowd-'+i,revoltCharacter:i%2?'SHOP-PHI':'SHOP-DOR',x,y,px:x*16+8,py:y*16+8,facing:'up'});
 for(const [n,y]of [20,15,10].entries())if(!btDefeated(s,BOTRUNE_GUARDS[n].id)){c.fillStyle='#452942';c.fillRect(20*16,y*16+6,9*16,5);c.fillStyle='#ad8d59';c.fillRect(20*16,y*16+6,9*16,1);}
}
export function drawStormWeather(c,room,time,reduced){
 if(!isStormRoom(room))return;
 c.save();c.fillStyle='#111c3033';c.fillRect(0,0,768,512);
 if(!reduced){c.strokeStyle='#a8b5cc44';c.lineWidth=1;for(let i=0;i<32;i++){const x=(i*89+time*.026)%800,y=(i*53+time*.14)%540;c.beginPath();c.moveTo(x,y);c.lineTo(x-5,y+12);c.stroke();}}
 c.restore();
}
let crownStarted=null;let dragonPortrait=null;if(typeof Image!=='undefined'){dragonPortrait=new Image();dragonPortrait.src='assets/173.webp';}
export function drawStormDragon(c,state,room,time,reduced){
 if(room!=='stormDariusCrown')crownStarted=null;else crownStarted??=time;
 const mural=room==='stormDariusRidge',q=stormState(state).darius,loom=room==='stormDariusCrown'&&!q.outcome;
 if(!mural&&!loom)return;
 // A deterministic rise in scale is presentation only; it never consumes game RNG.
 const scale=mural?2.6:q.released?2.2:reduced?4.5:3.2+Math.min(1.3,(time-crownStarted)/6000);
 const x=(mural?18:33)*16+8,y=(mural?10:13)*16+8;
 if(!mural&&dragonPortrait?.naturalWidth){const size=52*scale;c.save();c.imageSmoothingEnabled=true;c.shadowColor='#b8d8ff';c.shadowBlur=16;c.drawImage(dragonPortrait,x-size/2,y-size+8,size,size);c.restore();return;}
 c.save();c.translate(x,y);c.scale(scale,scale);if(mural){c.globalAlpha=.48;c.filter='sepia(1)';}drawCompanion(c,{unit:{species:DATA.species.find(s=>s.id==='173')},px:0,py:0,facing:'down',stride:0,step:null,reactionUntil:0},time,reduced);c.restore();
}

function drawSlate(c,left,top,width,height){c.save();c.beginPath();c.rect(left,top,width,height);c.clip();c.fillStyle='#242c38';c.fillRect(left,top,width,height);const colours=['#353d49','#303844','#39404b','#323946'];for(let y=top;y<top+height;y+=16)for(let x=left-32;x<left+width;x+=32){const xx=x+((y/16)%2?16:0);c.fillStyle=colours[(Math.abs(Math.floor(x/32)*17+Math.floor(y/16)*7))%4];c.fillRect(xx+1,y+1,30,14);c.fillStyle='#51566366';c.fillRect(xx+2,y+1,28,1);}c.restore();}

