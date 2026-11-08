import {atlasCell} from './mountain-art.js?v=0.90.60';

export const CROSSING_ROOM='passSummit';
export const CROSSING_SIGN='windscar-crossing-inscription';
export const CROSSING_ENTRY=[5,10];
export const CROSSING_EXIT=[5,2];
const route=[[5,9],[5,8],[4,8],[3,8],[3,7],[3,6],[4,6],[5,6],[6,6],[7,6],[7,5],[7,4],[6,4],[5,4],[5,3]];
const code=(x,y)=>y*48+x;

export const crossingTile=(room,x,y)=>room===CROSSING_ROOM&&x>=3&&x<=7&&y>=3&&y<=9;
export function crossingWalkable(room,x,y){
 if(crossingTile(room,x,y))return true;
 if(room!==CROSSING_ROOM||x<2||x>8||y<2||y>10)return null;
 return x===5&&(y===2||y===10);
}
export function installInvisibleCrossing(maps){
 const map=maps[CROSSING_ROOM];
 map.sidePaths.push({points:[[5,17],[5,10]]});
 map.spots.push({id:CROSSING_SIGN,label:'Read the Mist Crossing inscription',x:6,y:11,questProp:true,siteTablet:true});
}
export function crossingState(state){
 if(!state.invisibleCrossing){
  const seed=[...String(state.playerName||'Aimon')].reduce((sum,char)=>sum+char.codePointAt(0),0);
  state.invisibleCrossing={seed,discoveredSafeCells:[],solved:false,falls:0,preview:2};
 }
 return state.invisibleCrossing;
}
export function crossingRoute(seed){
 return route.map(([x,y])=>[seed%2?10-x:x,y]);
}
export function crossingSafe(state,x,y){
 return crossingRoute(crossingState(state).seed).some(([sx,sy])=>sx===x&&sy===y);
}
export function recordCrossingStep(state,x,y){
 const q=crossingState(state);
 if(x===CROSSING_EXIT[0]&&y===CROSSING_EXIT[1])q.solved=true;
 else if(!q.discoveredSafeCells.includes(code(x,y)))q.discoveredSafeCells.push(code(x,y));
}
export function revealCrossingHint(state){
 const q=crossingState(state),safe=crossingRoute(q.seed);
 const revealed=safe.findIndex(([x,y],index)=>index>=q.preview&&!q.discoveredSafeCells.includes(code(x,y)));
 if(revealed===-1)return false;
 q.preview=revealed+1;return true;
}


const gorge={x:3*16,y:3*16,w:5*16,h:7*16};
const frost=['#344758','#53697c','#78909f','#a8becb','#d7e4e8'];
let lastFall;
export function markCrossingFall(x,y){lastFall={x,y,at:globalThis.performance?.now()||0};}

function pixels(ctx,colour,x,y,points){
 ctx.fillStyle=colour;
 for(const [dx,dy,w=1,h=1] of points)ctx.fillRect(x+dx,y+dy,w,h);
}
function cliff(ctx,x,y,side,variant){
 ctx.save();ctx.translate(x,y);if(side<0){ctx.translate(16,0);ctx.scale(-1,1);}
 pixels(ctx,'#172632',0,0,[[2,2,14,16],[1,6,5,9]]);
 pixels(ctx,frost[0],0,0,[[0,0,16,4],[1,4,15,4],[3,8,13,3],[6,11,10,3],[9,14,7,2]]);
 pixels(ctx,frost[1],0,0,[[3,4,5,2],[7,7,9,2],[10,11,6,2],[12,14,4,1],[2,0,14,3]]);
 pixels(ctx,frost[2],0,0,[[4,2,4,2],[8,0,8,2],[6,5,3,1],[11,7,5,1],[12,10,3,1]]);
 pixels(ctx,frost[3],0,0,[[6+variant,0,7,1],[10+variant,1,4,1],[14,3,2,1]]);
 pixels(ctx,frost[4],0,0,[[10+variant,0,3,1],[14,1,2,1]]);
 ctx.restore();
}
function slab(ctx,x,y,full,landing=false){
 const left=x*16,top=y*16;
 pixels(ctx,'#172631',left,top,[[2,5,12,10],[1,8,14,4],[4,14,8,2]]);
 pixels(ctx,full?frost[0]:'#3b5364',left,top,[[3,3,10,11],[1,6,14,5],[5,13,7,1]]);
 pixels(ctx,full?frost[2]:'#627d8d',left,top,[[4,2,8,10],[2,5,12,5],[5,11,6,1]]);
 pixels(ctx,full?frost[3]:'#8da4ad',left,top,[[5,2,6,2],[3,5,6,2],[4,7,3,2],[11,5,2,2]]);
 pixels(ctx,full?frost[4]:'#a7bec8',left,top,[[6,2,4,1],[3,5,3,1],[9,4,3,1]]);
 pixels(ctx,landing?'#d7ba7d':'#d7e4e8',left,top,landing?[[7,5,2,6],[5,7,6,2]]:[[7,6,2,1],[6,7,4,1],[7,8,2,2]]);
}
function mist(ctx,time,reduced){
 const {x,y,w,h}=gorge,tick=reduced?0:Math.floor(time/135);
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 ctx.fillStyle='#15232f';ctx.fillRect(x,y,w,h);
 for(let i=0;i<19;i++){
  const dx=(i*29+7)%w,dy=(i*47+8)%h,colour=['#263a49','#213442','#1b2c39'][i%3];
  pixels(ctx,colour,x+dx,y+dy,[[0,0,17+i%7,2],[3,2,11+i%5,2],[7,4,7,1]]);
 }
 for(let i=0;i<13;i++){
  const dx=((i*41+tick*(i%3+1))%(w+48))-24,dy=(i*37+14)%h;
  const colour=['#6d8fa31c','#91b1c323','#a9c7d125'][i%3];
  pixels(ctx,colour,x+dx,y+dy,[[0,0,35,1],[5,1,29,2],[8,3,18,1],[24,-1,17,1]]);
 }
 ctx.restore();
}
function flurries(ctx,x,y,time,reduced){
 const drift=reduced?0:Math.floor(time/110)%4;
 pixels(ctx,'#b6cfdb99',x*16,y*16,[[4,6+drift],[10,3+drift],[7,9]]);
 pixels(ctx,'#e3edf1cc',x*16,y*16,[[7,10,2,1],[11,11],[5,12]]);
}

export function drawInvisibleCrossing(ctx,state,room,player,time,reduced,drawAsset){
 if(room!==CROSSING_ROOM)return;
 const q=crossingState(state),safe=crossingRoute(q.seed);
 const preview=new Set(safe.slice(0,q.preview).map(([x,y])=>code(x,y)));
 const marked=new Set(q.discoveredSafeCells);
 ctx.save();ctx.imageSmoothingEnabled=false;
 // Only shallow guide flecks subdivide the mist. Undiscovered stones share the same terrain.
 mist(ctx,time,reduced);
 for(let y=3;y<=9;y++){
  cliff(ctx,2*16,y*16,-1,y%3);
  cliff(ctx,8*16,y*16,1,y%3);
  for(let x=3;x<=7;x++)pixels(ctx,'#83a4b04a',x*16,y*16,[[0,0,2,1],[0,0,1,2],[15,15]]);
 }
 for(const y of [2,10])for(const x of [3,4,6,7])cliff(ctx,x*16,y*16,x<5?-1:1,x%3);
 if(drawAsset){
  for(const [x,y,slot] of [[1.4,3,0],[8,4,2],[1.4,7.4,2],[8,8.2,1],[3.15,10,0],[6.2,10,1]]){
   drawAsset(ctx,'mountainPropspassSummit',x,y,1.55,1.55,atlasCell(slot));
  }
 }
 slab(ctx,...CROSSING_ENTRY,true,true);
 slab(ctx,...CROSSING_EXIT,true,true);
 for(const [x,y] of safe){
  const id=code(x,y);
  if(q.solved||marked.has(id)||preview.has(id))slab(ctx,x,y,q.solved||marked.has(id));
 }
 // After a missed step, snow gathers faintly on the next nearby stone.
 if(q.falls&&!q.solved&&player){
  const step=safe.findIndex(([x,y])=>x===player.x&&y===player.y);
  const next=step>=0?safe[step+1]:null;
  if(next&&!marked.has(code(...next))&&!preview.has(code(...next)))flurries(ctx,...next,time,reduced);
 }
 if(lastFall&&time-lastFall.at<420){
  const {x,y}=lastFall,spread=reduced?1:Math.min(5,Math.floor((time-lastFall.at)/70));
  pixels(ctx,'#c1d7e0aa',x*16,y*16,[[8-spread,8],[8+spread,8],[8,8-spread],[8,8+spread]]);
 }
 ctx.restore();
}
