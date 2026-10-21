import {frameCombatArt} from './combat-frame.js?v=0.87.0';
import {shinyCanvas} from './shinies.js?v=0.90.20';
import {relicArtPath,RELIC_ART} from './relic-art.js?v=0.87.0';
// Retain decoded fronts and retry transient failures. DOM redraws reuse ready PNGs.
const fronts=new Map();
export function preloadCombatArt(ids){for(const id of new Set(ids))void combatArtReady(id);}
export function unitArtId(u){return typeof u==='string'?u:u?.species?.id==='381'&&u.sunWrath?.active?'381-wrath':u?.species?.id;}
export function combatArtSrc(id){if(id?.shiny===true){const key=unitArtId(id)+':shiny';void combatArtReady(id);return fronts.get(key)?.src||relicPlaceholder(key);}id=unitArtId(id);if(relicArtPath(id)){void combatArtReady(id);return fronts.get(id)?.src||relicPlaceholder(id);}return fronts.get(id)?.src||`assets/${id}.webp?v=0.87.0`;}
const relicPlaceholder=id=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><title>Loading ${id}</title></svg>`);
export function combatArtReady(subject){
 const id=unitArtId(subject);if(subject?.shiny===true){const key=id+':shiny';if(fronts.has(key))return fronts.get(key).ready;const entry={src:null,ready:null};fronts.set(key,entry);entry.ready=combatArtReady(id).then(ok=>new Promise(resolve=>{if(!ok){fronts.delete(key);resolve(false);return;}const im=new Image();im.onload=()=>{try{entry.src=shinyCanvas(im,id).toDataURL('image/png');if(typeof document.querySelectorAll==='function')for(const node of document.querySelectorAll('img'))if(node.getAttribute('src')===relicPlaceholder(key))node.src=entry.src;resolve(true);}catch{fronts.delete(key);resolve(false);}};im.onerror=()=>{fronts.delete(key);resolve(false);};im.src=fronts.get(id).src;}));return entry.ready;}
 if(fronts.has(id))return fronts.get(id).ready;
 const entry={src:null,ready:null};fronts.set(id,entry);
 entry.ready=new Promise(resolve=>{let attempt=0;
  const load=()=>{const im=new Image();im.decoding='async';let settled=false;
   const fail=()=>{if(settled)return;settled=true;clearTimeout(timer);if(++attempt<2)load();else{fronts.delete(id);resolve(false);}};
   const timer=setTimeout(fail,8000);
   im.onerror=fail;im.onload=async()=>{if(settled)return;try{await im.decode();}catch{}if(settled)return;settled=true;clearTimeout(timer);
    // Fit the complete visible silhouette, not transparent atlas/square padding.
    try{entry.src=frameCombatArt(im,id,RELIC_ART).toDataURL('image/png');}catch{entry.src=im.src;}
    if(relicArtPath(id)&&typeof document.querySelectorAll==='function')for(const node of document.querySelectorAll('img'))if(node.getAttribute('src')===relicPlaceholder(id))node.src=entry.src;
    resolve(true);
   };im.src=`${relicArtPath(id)||'assets/'+id+'.webp'}?v=0.87.0${attempt?'&retry='+attempt:''}`;
  };load();
 });return entry.ready;
}
export function battleArtReady(...units){return Promise.all(units.filter(Boolean).map(u=>combatArtReady(u)));}
