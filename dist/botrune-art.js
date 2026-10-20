import {STORM_ROAD,BOTRUNE_GUARDS} from './botrune-data.js?v=0.90.0';
import {botruneState,btDefeated,trialVictims} from './botrune-rules.js?v=0.90.0';
const victims=[['prisoner-1',17,'TRN-C02-001'],['prisoner-2',21,'TRN-C02-002'],['prisoner-3',25,'TRN-C01-002'],['CHR-PATE',29,'CHR-PATE'],['CHR-TRADE',33,'CHR-TRADE']];
export function drawBotruneMap(c,m,room,asset,road,grass,walkable){
 if(!m.botruneKind)return false;
 const square=m.botruneKind==='square';
 for(let y=0;y<32;y++)for(let x=0;x<48;x++){
  const path=road(room,x,y),walk=walkable(room,x,y);
  asset(c,square?'fortFloor':path?'biomequarrypath':grass(room,x,y)?'biomequarrygrass':walk?'biomequarryground':'biomequarrywall',x,y);
  if(!square){c.fillStyle=path?'#95a5b011':'#18283e55';c.fillRect(x*16,y*16,16,16);}
 }
 if(square){
  c.fillStyle='#172130';c.fillRect(0,0,768,48);c.fillRect(0,48,12*16,18*16);c.fillRect(41*16,48,7*16,18*16);
  for(const [x,w]of [[12,8],[29,12]]){c.fillStyle='#292735';c.fillRect(x*16,10*16,w*16,11*16);for(let yy=10;yy<21;yy++){c.fillStyle=yy%2?'#474155':'#3b3548';c.fillRect(x*16,yy*16,w*16,3);}}
  for(let y=10;y<=20;y++){c.fillStyle=y%2?'#a59783':'#695f59';c.fillRect(20*16,y*16,9*16,16);c.fillStyle='#d5c1a5';c.fillRect(20*16,y*16,9*16,2);}
  c.fillStyle='#3b253f';c.fillRect(13*16,3*16,27*16,6*16);for(let y=3;y<9;y++){c.fillStyle='#98794e';c.fillRect(13*16,y*16+15,27*16,1);}
  asset(c,'fortBanner',12,3,2,5);asset(c,'fortBanner',39,3,2,5);asset(c,'shelf',36,4,3,2);
  for(const x of [16,20,24,28,32]){c.fillStyle='#8a7157';c.fillRect(x*16,7*16,18,4);c.fillStyle='#3d3130';c.fillRect(x*16+3,7*16+4,3,7);}
  asset(c,'bloomKeep',1,3,9,12);asset(c,'bloomHouse',41,4,7,10);
  c.fillStyle='#d1b87a';c.font='bold 11px serif';c.textAlign='center';c.fillText('BOTRUNE · ABBEY SQUARE',24*16,33);
 }else{
  // Existing quarry ground/cliffs and fort architecture are reused; the conductor
  // structures are native pixel drawings, with collision restricted to terrain.
  for(const x of [5,18,32,43]){const y=4+(x*3)%9;c.fillStyle='#2d3441';c.fillRect(x*16-4,y*16-45,8,49);c.fillStyle='#8e8d81';c.fillRect(x*16-2,y*16-45,3,44);c.fillStyle='#bd9b5c';c.fillRect(x*16-13,y*16-39,27,4);c.fillStyle='#8d919b';c.fillRect(x*16-13,y*16-44,3,12);c.fillRect(x*16+11,y*16-44,3,12);}
  for(let n=0;n<9;n++){const x=3+(n*13)%42,y=3+(n*7)%25;if(!road(room,x,y)){c.strokeStyle='#a0b6b577';c.lineWidth=1;c.beginPath();c.moveTo(x*16,y*16);c.lineTo(x*16+12,y*16+5);c.lineTo(x*16+5,y*16+14);c.stroke();}}
  for(const p of m.props)asset(c,p.asset,p.x,p.y,p.w,p.h);
  for(const s of m.spots)if(s.routeSign)asset(c,'sign',s.x-1,s.y-3,4,3);
 }
 for(const g of m.gates)asset(c,'mat',g.x,g.y);
 return true;
}
export function drawBotrunePeople(c,s,room,time,reduced,drawHuman,presentation){
 if(room!=='botrune')return;
 const dead=trialVictims(s),q=botruneState(s);
 for(const [id,x,portrait]of victims){const falling=presentation?.victim===id,down=dead.includes(id)&&!falling;c.save();if(down||falling){c.translate(x*16+8,6*16+8);c.rotate(-Math.PI/2*(down?1:presentation.progress));c.translate(-x*16-8,-6*16-8);c.globalAlpha=.82;}drawHuman(c,{id,revoltCharacter:id.startsWith('CHR-')&&q.cursor<4?'TRN-C01-002':portrait,x,y:6,px:x*16+8,py:6*16+8,facing:'down'});c.restore();}
 if(presentation){const target=presentation.x;drawHuman(c,{id:'bt-executioner',revoltCharacter:'LDR-06',x:target,y:7,px:target*16+8,py:7*16+8,facing:'up'});if(presentation){c.save();c.translate(target*16+12,7*16-20);c.rotate(-1.3+presentation.progress*2);c.fillStyle='#cbd5db';c.fillRect(-2,-28,4,27);c.fillStyle='#b6985f';c.fillRect(-6,-2,12,3);c.fillRect(-2,0,4,8);c.restore();}}
 // A silent crowd, spaced clear of the walkable staircase.
 for(const [i,[x,y]]of [[5,22],[11,27],[17,23],[31,23],[36,27],[43,26]].entries())drawHuman(c,{id:'bt-crowd-'+i,revoltCharacter:i%2?'SHOP-PHI':'SHOP-DOR',x,y,px:x*16+8,py:y*16+8,facing:'up'});
 for(const [n,y]of [20,15,10].entries())if(!btDefeated(s,BOTRUNE_GUARDS[n].id)){c.fillStyle='#452942';c.fillRect(20*16,y*16+6,9*16,5);c.fillStyle='#ad8d59';c.fillRect(20*16,y*16+6,9*16,1);}
}
export function drawStormWeather(c,room,time,reduced){
 if(!STORM_ROAD.some(r=>r[0]===room))return;
 c.save();c.fillStyle='#111c3033';c.fillRect(0,0,768,512);
 if(!reduced){
  c.strokeStyle='#a8b5cc44';c.lineWidth=1;for(let i=0;i<32;i++){const x=(i*89+time*.026)%800,y=(i*53+time*.14)%540;c.beginPath();c.moveTo(x,y);c.lineTo(x-5,y+12);c.stroke();}
  const period=9700,beat=time%period;if(beat<420){const alpha=Math.sin(beat/420*Math.PI)*.8,x=110+Math.floor(time/period*149)%550;c.strokeStyle=`rgba(211,224,255,${alpha})`;c.lineWidth=2;c.beginPath();c.moveTo(x,-4);c.lineTo(x-17,22);c.lineTo(x+3,20);c.lineTo(x-19,57);c.lineTo(x-8,53);c.lineTo(x-32,94);c.stroke();c.fillStyle=`rgba(176,200,245,${alpha*.055})`;c.fillRect(0,0,768,512);}
 }
 c.restore();
}
