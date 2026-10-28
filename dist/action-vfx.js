import {ACTION_ART} from './action-vfx-data.js?v=0.90.48';
export {ACTION_ART};
const loading=new Map();
export function pixelArtReady(move){
 const s=ACTION_ART[move?.id];if(!s||typeof Image==='undefined')return Promise.resolve(true);
 if(!loading.has(s.src))loading.set(s.src,new Promise(resolve=>{
  const img=new Image();let settled=false;const finish=ok=>{if(settled)return;settled=true;clearTimeout(timeout);if(!ok)loading.delete(s.src);resolve(ok);};
  const timeout=setTimeout(()=>finish(false),5000);img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=s.src;
 }));return loading.get(s.src);
}
export function actionFrames(move,result={}){
 if(move.id!==790)return Array.from({length:16},(_,i)=>i);
 const hits=result.hitCount??3;
 if(hits<=0)return [];
 // Omit unsuccessful cuts when the target faints or the safety floor is reached.
 const cuts=hits===1?[0,1,2,3]:hits===2?[0,1,2,3,4,5,6]:[0,1,2,3,4,5,6,7];
 return [...cuts,8,9,10,11,12,13,14,15];
}
export function pixelSceneHTML(move,result={}){
 const s=ACTION_ART[move.id];if(!s)return '';
 const frames=actionFrames(move,result);if(!frames.length)return '<div class="fx-message">NO EFFECT</div>';
 const key='pixel-'+s.id+'-'+frames.length;
 const position=i=>((i%4)*100/3)+'% '+(Math.floor(i/4)*100/3)+'%';
 const css=frames.map((frame,i)=>(i*100/frames.length).toFixed(3)+'%{background-position:'+position(frame)+'}').join('')+'100%{background-position:'+position(frames.at(-1))+'}';
 return '<div class="pixel-action of-'+s.key+'" data-fx-move="'+s.id+'" data-action-art="'+s.key+'" '+(s.orchard?'data-orchard-art="'+s.key+'" ':'')+'data-hit-count="'+(result.hitCount??'')+'" style="--pixel-duration:'+s.duration+'ms"><style>@keyframes '+key+'{'+css+'}</style><i class="pixel-move-art '+(s.orchard?'orchard-ink':'')+'" aria-hidden="true" style="background-image:url('+s.src+');animation-name:'+key+'"></i></div>';
}
