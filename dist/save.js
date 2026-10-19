import {repairSaveStats} from './save-stat-repair.js?v=0.87.0';
export function saveStorage(){const n=globalThis.AbyssalsNative;if(!n)return localStorage;return {getItem:key=>n.getSave(key),setItem:(key,value)=>{if(!n.setSave(key,value))throw Error('Native save failed');},removeItem:key=>{if(!n.removeSave(key))throw Error('Native save failed');}};}
const LEGACY='abyssals-civeton-march-prototype-v1';
const PREFIX='abyssals-expedition-slot-';
let active=null;
function slotKey(slot){if(!Number.isInteger(slot)||slot<1||slot>3)throw Error('Choose a save slot');return PREFIX+slot;}
function decode(text){try{const d=JSON.parse(text);return d?.version===1&&d.state&&Array.isArray(d.state.party)?d:null;}catch{return null;}}
export function selectSlot(slot){if(slot!==null)slotKey(slot);active=slot;}
export function currentSlot(){return active;}
export function readSave(slot=active){if(slot===null)return null;let saved;try{saved=decode(saveStorage().getItem(slotKey(slot)));}catch{return null;}if(saved&&repairSaveStats(saved)){try{saveStorage().setItem(slotKey(slot),JSON.stringify(saved));}catch{/* Keep the readable save; hydration can retry the same idempotent repair. */}}return saved;}
export function listSlots(){return [1,2,3].map(slot=>({slot,save:readSave(slot)}));}
export function migrateLegacy(){const old=decode(saveStorage().getItem(LEGACY));if(!old)return;if(saveStorage().getItem(slotKey(1))===null)saveStorage().setItem(slotKey(1),JSON.stringify(old));saveStorage().removeItem(LEGACY);}
export function writeSave(snapshot){const key=slotKey(active);saveStorage().setItem(key,JSON.stringify({...snapshot,savedAt:new Date().toISOString(),version:1}));}
export function clearSave(){const key=slotKey(active);if(active===1)saveStorage().removeItem(LEGACY);saveStorage().removeItem(key);}
// An explicit target keeps the currently running slot unchanged until import succeeds.
export function writeImportedSave(snapshot,slot){const key=slotKey(slot);saveStorage().setItem(key,JSON.stringify({...snapshot,version:1}));return readSave(slot);}
