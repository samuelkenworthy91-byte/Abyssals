import {ACTION_ART,pixelArtReady} from './action-vfx.js?v=0.90.49';
import {MOVE_SCENES} from './move-scenes.js?v=0.90.49';
export {MOVE_SCENES};
const loaded=new Map();
export function moveArtReady(move){if(ACTION_ART[move?.id])return pixelArtReady(move);const s=MOVE_SCENES[move?.id];if(!s||typeof Image==='undefined')return Promise.resolve(true);const url=`assets/vfx/moves-${s.atlas}.webp?v=0.87.0`;if(!loaded.has(url))loaded.set(url,new Promise(resolve=>{const img=new Image();let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);if(!ok)loaded.delete(url);resolve(ok);};const timer=setTimeout(()=>finish(false),5000);img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=url;}));return loaded.get(url);}
// Each stored score has its own keyframes. Source coordinates follow the actual caster,
// including attacks travelling in the opposite direction and self-targeted statuses.
export function moveSceneHTML(move,result={},color,duration=MOVE_SCENES[move.id]?.duration){const s=MOVE_SCENES[move.id];if(!s)return '';const name=`move${s.id}`,transform=f=>`translate(calc(var(--source-x,0px) * ${f.x} + ${f.px||0}px),calc(var(--source-y,0px) * ${f.x} + ${f.y}px)) rotate(${f.turn}deg) scale(${f.sx},${f.sy})`;
 const css=s.layers.map((layer,i)=>`@keyframes ${name}track${i}{${layer.frames.map(f=>`${f.at}%{opacity:${f.opacity};transform:${transform(f)}}`).join('')}}`).join('');
 const tracks=s.layers.map((layer,i)=>`<span class="move-track role-${layer.role}" style="width:${layer.size}px;height:${layer.size}px;margin:${-layer.size/2}px;animation-name:${name}track${i}"><i class="move-art ${i?'move-detail piece-'+i%4:''}"></i></span>`).join('');
 return `<div class="move-scene ${move.power?'scene-attack':'scene-status'} ${result.critical?'scene-critical':''}" data-fx-move="${s.id}" data-scene="${s.key}" data-action="${s.action}" style="--fx-color:${color};--fx-duration:${duration}ms;--move-atlas:url('assets/vfx/moves-${s.atlas}.webp?v=0.87.0');--cell-x:${s.cell%4*100/3}%;--cell-y:${Math.floor(s.cell/4)*20}%"><style>${css}</style>${tracks}${s.courtArt?`<img class="court-move-art" src="${s.courtArt}" alt="" aria-hidden="true">`:''}</div>`;
}


