import {registerBiome} from './biome-world.js?v=0.90.60';

export const SHADOW_ROOM='shadowBridge';
export const SHADOW_SIGN='shadow-bridge-inscription';
export const SHADOW_END='shadow-bridge-far-stone';
export const SHADOW_ENTRY=[3,17];

const spans=[
 {start:12,end:15,rail:10,light:7,row:15},
 {start:24,end:27,rail:22,light:19,row:19}
];
const initialRows=[17,17];
const railTop=15,railBottom=19;
const spanAt=x=>spans.findIndex(span=>x>=span.start&&x<=span.end);
const rows=state=>state.shadowBridge?.pillars||initialRows;

export function installShadowBridge(maps){
 const parent=maps.relicGrove2;
 const entry='shadow-bridge-entry';
 parent.sidePaths.push({gateId:entry,points:[[13,7],[18,7],[18,4]]});
 parent.gates.push({id:entry,label:'Optional · Shadow Bridge',x:18,y:4,to:SHADOW_ROOM,arrival:[...SHADOW_ENTRY,'right'],door:true,action:'shadow-bridge-travel',
  entrance:{asset:'fortArch',x:17,y:2,w:3,h:3}});
 maps[SHADOW_ROOM]={
  name:'Briarbell Wood · Shadow Bridge',area:'SHADOW-BRIDGE',terrain:'ridge',bloom:false,
  road:[[1,17],[36,17]],sidePaths:[],grass:[],props:[],
  gates:[{id:'shadow-bridge-back',label:'Return to Bellroot Walk',x:1,y:17,to:'relicGrove2',arrival:[18,6,'down'],door:true,action:'shadow-bridge-travel'}],
  spots:[{id:SHADOW_SIGN,label:'Read the shadow inscription',x:5,y:15,siteTablet:true,questProp:true},
   {id:SHADOW_END,label:'Read the far-bank inscription',x:36,y:17,siteTablet:true,questProp:true}]
 };
 registerBiome(SHADOW_ROOM,'forest');
}

// The base map supplies terrain and valid save coordinates. Live collision
// opens each channel only on the row where its shrouded torch casts a shadow.
export function shadowBridgeGround(room,x,y){
 if(room!==SHADOW_ROOM)return null;
 return x>=2&&x<=37&&y>=13&&y<=21;
}
export function shadowBridgePillar(state,room,x,y){
 return room===SHADOW_ROOM?spans.findIndex((span,i)=>x===span.rail&&rows(state)[i]===y):-1;
}
export function shadowBridgeBlocked(state,room,x,y){
 if(room!==SHADOW_ROOM)return false;
 if(shadowBridgePillar(state,room,x,y)>=0||spans.some(span=>x===span.light&&y===span.row))return true;
 const i=spanAt(x);
 return i>=0&&(y!==spans[i].row||rows(state)[i]!==y);
}

export function pushShadowPillar(state,index,dx,dy){
 if(!spans[index]||dx!==0||Math.abs(dy)!==1)return false;
 const next=rows(state)[index]+dy;
 if(next<railTop||next>railBottom)return false;
 const pillars=[...rows(state)];
 pillars[index]=next;
 state.shadowBridge={...state.shadowBridge,pillars};
 return true;
}
export function resetShadowBridge(state){
 state.shadowBridge={...state.shadowBridge,pillars:[...initialRows]};
}
export function finishShadowBridge(state){
 state.shadowBridge={...state.shadowBridge,complete:true};
}

export function shadowBridgeObjective(state,room){
 if(room!==SHADOW_ROOM)return null;
 return state.shadowBridge?.complete
  ?{spot:'shadow-bridge-back',text:'Shadow Bridge crossed · return to Bellroot Walk'}
  :{spot:rows(state).every((row,i)=>row===spans[i].row)?SHADOW_END:SHADOW_SIGN,text:'Cross the two shadows to reach the far-bank inscription'};
}

function rect(ctx,color,x,y,w,h){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}

function drawTorch(ctx,x,y){
 rect(ctx,'#17251d',x+2,y+9,13,5);
 rect(ctx,'#272521',x+4,y-4,9,17);
 rect(ctx,'#84664b',x+5,y+3,7,10);
 rect(ctx,'#c19b62',x+5,y+4,2,8);
 rect(ctx,'#4c4537',x+3,y+10,11,3);
 rect(ctx,'#a47848',x+4,y-1,9,3);
 rect(ctx,'#be6239',x+6,y-7,5,7);
 rect(ctx,'#f6b85f',x+7,y-9,3,8);
 rect(ctx,'#ffeda8',x+8,y-6,1,5);
 rect(ctx,'#ffbc6550',x+1,y-2,15,3);
}

function drawRavine(ctx,span,drawAsset){
 const {start,end}=span;
 const left=start*16,width=(end-start+1)*16,top=13*16;
 rect(ctx,'#172629',left,top,width,9*16);
 for(let y=13;y<=21;y++)for(let x=start;x<=end;x++){
  const edge=x===start||x===end;
  const material=edge?'biomeforestwall':'biomewetlandwater';
  drawAsset(ctx,material,x,y,1,1,{x:(x%5)*16,y:(y%7)*16,w:16,h:16});
  rect(ctx,edge?'#0b191c65':'#081721b0',x*16,y*16,16,16);
 }
 for(let y=13;y<=21;y++){
  const lip=y%3;
  rect(ctx,'#121d20',left+10+lip,y*16+2,3,10);
  rect(ctx,'#617460',left+1,y*16+lip,3+lip,2);
  rect(ctx,'#78806b',left+width-4-lip,y*16+5,4+lip,2);
 }
}

function drawSpan(ctx,start,end,row){
 const y=row*16,left=start*16,width=(end-start+1)*16;
 rect(ctx,'#121a2a',left,y+1,width,14);
 rect(ctx,'#a49db2',left,y+1,width,1);
 rect(ctx,'#76728d',left,y+13,width,1);
 for(let x=start;x<=end;x++){
  const tile=x*16;
  rect(ctx,'#42475d',tile+1,y+4,14,7);
  rect(ctx,'#53576a',tile+3,y+5,9,1);
  rect(ctx,'#71768a',tile+4,y+7,2,1);
  rect(ctx,'#71768a',tile+10,y+9,2,1);
 }
}
export function drawShadowBridge(ctx,state,room,drawAsset){
 if(room!==SHADOW_ROOM)return;
 ctx.save();
 spans.forEach((span,i)=>{
  const {start,end,rail,light,row}=span;
  drawRavine(ctx,span,drawAsset);
  for(let y=railTop;y<=railBottom;y++){
   rect(ctx,'#4d5448',rail*16+2,y*16,12,16);
   rect(ctx,'#8a886e',rail*16+3,y*16,1,16);
   rect(ctx,'#a09a7d',rail*16+12,y*16,1,16);
   rect(ctx,'#30392f',rail*16+4,y*16+7,8,2);
  }
  rect(ctx,'#ba9b5d3d',(light+1)*16,row*16+3,(start-light-1)*16,10);
  rect(ctx,'#d4aa685c',(light+1)*16,row*16+7,(start-light-1)*16,2);
  if(rows(state)[i]===row)drawSpan(ctx,start,end,row);
  drawTorch(ctx,light*16,row*16);
  const pillar=rows(state)[i];
  drawAsset(ctx,'fortPier',rail-.04,pillar-1,1.08,2);
  rect(ctx,'#859052',rail*16+4,pillar*16+11,3,2);
  rect(ctx,'#a8a36e',rail*16+6,pillar*16+10,2,1);
 });
 ctx.restore();
}
