import {trialState,channelFlow} from './court-trials.js?v=0.87.0';
import {PALADIN_SPECIES} from './paladin-data.js?v=0.90.41';
import {COURT_ROOMS,COURT_TITLES,COURT_SEALS} from './paladin-quest.js?v=0.87.0';
import {drawCompanion,companionArt} from './companion.js?v=0.90.41';
const images=new Map(),artListeners=new Set();
// Map textures load lazily. Every completed load must invalidate cached maps,
// including maps first visited while the network/offline artwork is still cold.
export function onCourtArtChange(listener){artListeners.add(listener);return ()=>artListeners.delete(listener);}
function art(name){if(!images.has(name)){const i=new Image();images.set(name,i);i.onload=i.onerror=()=>{for(const listener of artListeners)listener();};i.src='assets/court/'+name+'.webp';}return images.get(name);}
function sprite(c,name,x,y,w,h=w){const i=art(name);if(i.complete&&i.naturalWidth)c.drawImage(i,x,y,w,h);}
export function drawCourtHuman(c,e,time,reduced){const i=art(e.courtHuman+'-walk');if(!i.complete||!i.naturalWidth){c.fillStyle=e.courtHuman==='commander'?'#ad773f':'#7eaaa1';c.fillRect(e.px-7,e.py-24,14,24);return;}const row=({down:0,left:1,up:2,right:3})[e.facing||'down'],cell=i.naturalWidth/2,frame=!reduced&&e.step?Math.floor(time/180)%2:0;c.drawImage(i,frame*cell,row*cell,cell,cell,e.px-20,e.py-45,40,48);if(e.courtHuman==='commander'){c.font='bold 9px system-ui';c.textAlign='center';c.fillStyle='#101c2be8';c.fillRect(e.px-40,e.py-65,80,14);c.fillStyle='#ffe2a0';c.fillText('Hugh de Mowbray',e.px,e.py-55);}}
export const COURT_POSES=[[24,9],[12,12],[18,12],[30,12],[36,12],[10,17],[16,18],[22,19],[28,19],[34,18],[39,17],[18,24],[30,24]];
export function courtFrame(elapsed,reduced=false){const t=Math.max(0,Math.min(11000,elapsed)),progress=Math.max(0,Math.min(1,(t-3500)/6500));return {elapsed:t,scatter:progress,binding:Math.max(0,1-t/2400),caption:t<2400?'The regalia lifts from its cradle. The ward gives way.':t<3500?'Karolion lowers its crowned mane.':t<9500?'The court scatters into the forest.':'Thirteen empty plinths. Somewhere beyond the trees, a branch cracks.',camera:{x:24,y:17},reduced,done:t>=11000};}
export function drawCourtMap(c,room,road,grass,walk,drawAsset,map){const jungle=room==='verdantJungle',idx=COURT_ROOMS.indexOf(room);if(idx<0&&!jungle)return false;

 c.fillStyle=idx===6?'#575b56':'#294734';c.fillRect(0,0,768,512);
 // Use the continuous forest/stone atlas rather than shrinking one noisy tile
 // repeatedly. Base world assets also provide visible terrain during cold loads.
 for(let y=0;y<32;y++)for(let x=0;x<48;x++){
  const edge=!walk(room,x,y),path=road(room,x,y),encounter=grass(room,x,y)&&!path;
  const name=idx===6?((x<2||x>45||y<2||y>29)&&!path?'fortWall':'fortFloor'):idx===4?(edge?'biomecoastwater':path?'biomequarrypath':'biomewetlandground'):path?(idx===2||idx===3||idx===5?'biomequarrypath':'biomeforestpath'):encounter?'biomeforestgrass':'biomeforestground';
  drawAsset(c,name,x,y);
  if(edge&&idx!==4&&idx!==6){c.fillStyle='#102e252c';c.fillRect(x*16,y*16,16,16);}
  if(path&&idx!==4&&((x*7+y*11)%19===0)){c.fillStyle='#d2c49d88';c.fillRect(x*16+4,y*16+6,5,2);}
 }
 // A dense canopy follows collision boundaries; never conceal the walking lane.
 if(idx!==6)for(let y=0;y<29;y+=3)for(let x=1;x<45;x+=3){
  if([0,1,2].every(dx=>[0,1,2].every(dy=>!walk(room,x+dx,y+dy)))){
   if(idx===4)drawAsset(c,'biomegrottocliff',x,y,3,3);
   else drawAsset(c,'biomeforesttree',x-.25,y-.5,3.5,4);
  }
 }
 if(idx!==6)for(let y=3;y<28;y+=4)for(let x=3;x<44;x+=5)if(!road(room,x,y)&&!grass(room,x,y)&&walk(room,x,y))drawAsset(c,'biomeforestferns',x,y,1.5,1.5);
 if(idx===0){sprite(c,'banner',8*16,5*16,30,62);}
 if(idx===1)for(const[x,y]of [[7,22],[18,5],[30,15],[38,6]])sprite(c,'banner',x*16,y*16,32,62);
 if(idx===2)for(const[x,y]of [[6,6],[17,21],[30,12],[38,6]]){sprite(c,'statue',x*16,y*16,44,62);sprite(c,'plinth',(x-1)*16,(y+3)*16,26,20);}
 if(idx===3||idx===6)for(const[x,y]of COURT_POSES)sprite(c,'plinth',x*16-24,y*16-12,48,36);
 if(idx===3)for(const x of [14,34])sprite(c,'statue',x*16,12*16,44,64);
 if(idx===4){sprite(c,'bridge',27*16,22*16,96,36);drawAsset(c,'tent',13,13,3,3);}
 if(idx===5){for(const[x,y]of [[29,5],[37,5]])sprite(c,'banner',x*16,y*16,30,60);drawAsset(c,'tent',24,20,5,3);}
 if(idx===6){for(let y=10;y<18;y++)for(let x=23;x<26;x++)sprite(c,'carpet',x*16,y*16,16);sprite(c,'throne',21*16,3*16,96,90);for(const x of [8,37])sprite(c,'banner',x*16,4*16,32,64);}

 for(const s of map.spots){if(s.routeSign)drawAsset(c,'sign',s.x-1,s.y-3,4,3);else if(['court-root-channels','court-twin-wardens','court-honours'].includes(s.id))sprite(c,'plinth',s.x*16-30,s.y*16-30,60,45);else if(s.id==='court-monument')sprite(c,'statue',s.x*16-24,s.y*16-56,48,70);else if(s.id.startsWith('court-inscription-'))sprite(c,'statue',s.x*16-18,s.y*16-42,36,48);else if(s.id.startsWith('court-seal-'))sprite(c,'plinth',s.x*16-14,s.y*16-8,28,20);else if(s.id==='court-pack')drawAsset(c,'sack',s.x-1,s.y-2,2,2);else if(['court-orders','court-camp-orders','court-ravine-note'].includes(s.id))sprite(c,'plinth',s.x*16-14,s.y*16-12,28,24);}
 for(const g of map.gates){c.fillStyle='#e4cc8f';c.fillRect(g.x*16,g.y*16+6,16,3);if(g.id.startsWith('court-shortcut'))continue;c.font='bold 9px system-ui';c.textAlign=g.x<24?'left':'right';c.fillStyle='#102330ed';const x=g.x<24?g.x*16+8:g.x*16-140;c.fillRect(x,g.y*16-23,148,17);c.fillStyle='#f4e3b8';c.fillText((g.x<24?'‹ ':'')+g.label+(g.x>=24?' ›':''),g.x<24?x+5:x+143,g.y*16-11,138);}
 return true;
}
export function drawCourtScene(c,state,room,time,reduced,frame){const q=state.paladinCourt;
 if((room==='orchardVerge'||room==='emptyThrone')&&!q?.released){const [x,y]=room==='orchardVerge'?[40,28]:[46,23];c.save();c.globalAlpha=reduced?.65:.55+Math.sin(time/400)*.15;for(let n=0;n<7;n++){c.fillStyle=n%2?'#e0efffcc':'#78cce9aa';c.fillRect(x*16-18+n*6,y*16-34,3,52);}c.restore();}
 if(room==='bannerwood'){const t=trialState(state).channels,f=channelFlow(t.turns),x=26*16-24,y=18*16-32;for(let i=0;i<9;i++){const xx=x+i%3*16,yy=y+Math.floor(i/3)*16;c.fillStyle=f.wet.includes(i)?'#79dbe5':'#b3ac84';c.fillRect(xx,yy,14,14);c.fillStyle='#203d38';const mask=f.masks[i];if(mask&1)c.fillRect(xx+6,yy,3,8);if(mask&2)c.fillRect(xx+6,yy+6,8,3);if(mask&4)c.fillRect(xx+6,yy+6,3,8);if(mask&8)c.fillRect(xx,yy+6,8,3);}if(t.solved){c.fillStyle='#72d8e1';c.fillRect(x+46,y+6,30,3);c.fillRect(x+46,y+22,30,3);c.fillRect(x+46,y+38,30,3);}}
 if(room==='courtProcession'){const t=trialState(state).wardens;for(const [name,x,y]of [['FIRE',23,14],['ICE',27,14]]){sprite(c,'statue',x*16,y*16,30,45);c.font='bold 8px system-ui';c.textAlign='center';c.fillStyle=t.solved?'#b9e5bf':name==='FIRE'?'#ffc67b':'#a9ddfa';c.fillText(name,x*16+15,y*16+49);}}
 if(room==='courtPlinths'){for(const [i,s]of COURT_SEALS.entries()){const x=(14+i*4)*16,y=21*16;c.font='bold 8px system-ui';c.textAlign='center';c.fillStyle=q?.sequence?.includes(s.key)?'#8ce4cb':'#f3dfac';c.fillText(s.label.replace('Tempered ','').replace('Unbarred ','').replace('Living ','').replace('Shared ','').replace('Thawing ','').replace('Banked ',''),x,y+19);if(q?.sequence?.includes(s.key)){c.fillStyle='#d9fff0';c.fillText(String(q.sequence.indexOf(s.key)+1),x,y-5);}}}
if((room==='courtPlinths'&&!q?.puzzle)||(room==='courtApproach'&&!q?.commander)){sprite(c,'oak',42*16,5*16,48,96);}if(room!=='emptyThrone')return;if(!q?.released){if(frame?.elapsed>2000)sprite(c,'plinth',22*16,10*16,64,32);else{sprite(c,'orb',22*16,9*16,32,48);sprite(c,'sceptre',25*16,9*16,32,48);}}if(!q?.released||frame){for(const[s,idx]of PALADIN_SPECIES.filter(s=>s.legendaryRoamer).map((s,i)=>[s,i])){const[x,y]=COURT_POSES[idx],p=frame?.scatter||0,angle=(idx/13)*Math.PI*2,dx=Math.cos(angle),dy=Math.sin(angle);if(p>.92)continue;let xx=x+dx*p*45,yy=y+dy*p*35;if(idx===0&&frame&&frame.elapsed<3500&&frame.elapsed>2400)yy+=Math.sin((frame.elapsed-2400)/1100*Math.PI)*.7;drawCompanion(c,{unit:{species:s},px:xx*16+8,py:yy*16+8,facing:p?(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up'):'down',stride:idx,reactionUntil:0,step:p?{elapsed:(time%300)/1000,duration:.3}:null},time,reduced);if(frame&&p>0&&p<.8)sprite(c,'fx-'+(idx+1),xx*16-8,yy*16+4,32);}}
 if(q?.released&&!frame)sprite(c,'plinth',22*16,10*16,64,32);
 if(frame?.binding>0)sprite(c,'fx-14',20*16,7*16,128,110);
}
export async function prepareCourtArt(){const list=[...PALADIN_SPECIES.filter(s=>s.legendaryRoamer).map(s=>companionArt(s.id)),...['orb','sceptre','throne','plinth'].map(art)];await Promise.all(list.map(i=>i.complete&&i.naturalWidth?Promise.resolve():new Promise((resolve,reject)=>{i.addEventListener('load',resolve,{once:true});i.addEventListener('error',()=>reject(Error('Court artwork could not load')),{once:true});if(i.complete&&!i.naturalWidth)reject(Error('Court artwork could not load'));})));}

