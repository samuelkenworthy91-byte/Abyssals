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

export function drawInvisibleCrossing(ctx,state,room){
 if(room!==CROSSING_ROOM)return;
 const q=crossingState(state),safe=crossingRoute(q.seed);
 const marked=new Set(safe.slice(0,q.solved?safe.length:q.preview).map(([x,y])=>code(x,y)).concat(q.discoveredSafeCells));
 ctx.save();
 ctx.fillStyle='#213448';ctx.fillRect(3*16,3*16,5*16,7*16);
 for(let y=3;y<=9;y++)for(let x=3;x<=7;x++){
  ctx.strokeStyle='#506c7e';ctx.strokeRect(x*16+.5,y*16+.5,15,15);
  if(!marked.has(code(x,y)))continue;
  ctx.fillStyle='#abcdd0';ctx.fillRect(x*16+3,y*16+3,10,10);
  ctx.fillStyle='#334653';ctx.fillRect(x*16+7,y*16+7,2,2);
 }
 for(const [x,y] of [CROSSING_ENTRY,CROSSING_EXIT]){
  ctx.fillStyle='#ccd1b5';ctx.fillRect(x*16+1,y*16+1,14,14);
  ctx.fillStyle='#526958';ctx.fillRect(x*16+5,y*16+5,6,6);
 }
 ctx.restore();
}
