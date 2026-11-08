import {ACTION_ART} from './action-vfx-data.js?v=0.90.60';
export {ACTION_ART};
// Keep the render clock and battle impact clock identical. Mercy's original
// First Light scene deliberately retains its authored timing.
export const readableDuration=(move,duration)=>move?.salvation?duration:Math.round(duration*1.35);
export function pixelPlacement(move,{x,y,width,height,cellSize}){
 const b=ACTION_ART[move?.id]?.frameBounds||[0,0,192,192],scale=cellSize/192;
 const offset=(at,min,max,limit)=>Math.min(Math.max(0,4-at-(min-96)*scale),limit-4-at-(max-96)*scale);
 return {x:offset(x,b[0],b[2],width),y:offset(y,b[1],b[3],height)};
}
// Match per-strike HP presentation to the atlas clock without undefined times.
export function pixelImpactTimes(move,result,spec){
 const count=result.strikes?.length||1;
 if(move.id===790){const frames=count===1?[1]:count===2?[1,4]:[1,4,7],total=count===1?12:count===2?15:16;return frames.map(f=>f/total*spec.duration);}
 const beats=spec.beats?.length===count?spec.beats:Array.from({length:count},(_,i)=>count===1?spec.impact:(4+i*8/Math.max(1,count-1))/16);
 return beats.map(b=>b*spec.duration);
}
const loading=new Map();
export function pixelArtReady(move){
 const s=ACTION_ART[move?.id];if(!s||typeof Image==='undefined')return Promise.resolve(true);
 if(!loading.has(s.src))loading.set(s.src,new Promise(resolve=>{
  const img=new Image();let settled=false;const finish=ok=>{if(settled)return;settled=true;clearTimeout(timeout);if(!ok)loading.delete(s.src);resolve(ok);};
  const timeout=setTimeout(()=>finish(false),5000);img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=s.src;
 }));return loading.get(s.src);
}
export function actionFrames(move,result={}){
 if(result.missed||result.skipped||result.immune||result.blocked||result.hitCount===0&&move.power>0)return [];
 if(move.id!==790)return Array.from({length:16},(_,i)=>i);
 const hits=result.hitCount??3;
 if(hits<=0)return [];
 // Omit unsuccessful cuts when the target faints or the safety floor is reached.
 const cuts=hits===1?[0,1,2,3]:hits===2?[0,1,2,3,4,5,6]:[0,1,2,3,4,5,6,7];
 return [...cuts,8,9,10,11,12,13,14,15];
}
export function pixelSceneHTML(move,result={}){
 const s=ACTION_ART[move.id];if(!s)return '';
 const frames=actionFrames(move,result);if(!frames.length)return '<div class="fx-message">'+(result.missed?'MISS':result.blocked?'BLOCKED':result.skipped?'INTERRUPTED':'NO EFFECT')+'</div>';
 const key='pixel-'+s.id+'-'+frames.length;
 const position=i=>((i%4)*100/3)+'% '+(Math.floor(i/4)*100/3)+'%';
 const css=frames.map((frame,i)=>(i*100/frames.length).toFixed(3)+'%{background-position:'+position(frame)+'}').join('')+'100%{background-position:'+position(frames.at(-1))+'}';
 return '<div class="pixel-action of-'+s.key+'" data-fx-move="'+s.id+'" data-action-art="'+s.key+'" '+(s.orchard?'data-orchard-art="'+s.key+'" ':'')+'data-hit-count="'+(result.hitCount??'')+'" style="--pixel-duration:'+readableDuration(move,s.duration)+'ms"><style>@keyframes '+key+'{'+css+'}</style><i class="pixel-move-art '+(s.orchard?'orchard-ink':'')+'" aria-hidden="true" style="background-image:url('+s.src+');animation-name:'+key+'"></i></div>';
}

