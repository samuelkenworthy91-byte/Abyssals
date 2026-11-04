import {DOSSIER_CONFIG as C} from './dossier-config.js?v=0.90.54';
export const DOSSIER_TRADE_ONLY=new Set([C.ids.Brookisk,C.ids.Torravyr,C.ids.Mindlarv,C.ids.Omenluna]);
// Apply last, after all biome and collection overlays. Existing residents retain
// their relative shares, protected Rimebun weights remain exact, totals stay 100.
export function dossierEncounterRoute(route){
 if(!route?.tables||route.dossierEncounters===1)return route;
 const additions=C.habitats.filter(h=>h.room===route.room);
 return {...route,dossierEncounters:1,tables:route.tables.map(t=>{
  const incoming=additions.filter(h=>h.phase==='BOTH'||h.phase===t.phase).map(h=>({...h,rarity:'Rare',authoredSlot:true,dossierSpecies:true}));
  let slots=t.slots.filter(s=>!DOSSIER_TRADE_ONLY.has(s.species_id));
  if(!incoming.length&&slots.length===t.slots.length)return t;
  const protectedSlots=slots.filter(s=>s.species_id==='364');slots=slots.filter(s=>s.species_id!=='364');
  for(const h of incoming){const found=slots.find(s=>s.species_id===h.species_id);if(found)Object.assign(found,{...h,weight:found.weight});else slots.push(h);}
  const budget=100-protectedSlots.reduce((n,s)=>n+s.weight,0),total=slots.reduce((n,s)=>n+s.weight,0);
  const scaled=slots.map(s=>{const q=s.weight/total*(budget-slots.length);return {...s,weight:1+Math.floor(q),remainder:q%1};});
  let extra=budget-scaled.reduce((n,s)=>n+s.weight,0);for(const s of [...scaled].sort((a,b)=>b.remainder-a.remainder))if(extra-->0)s.weight++;
  return {...t,slots:[...protectedSlots,...scaled.map(({remainder,...s})=>s)]};
 })};
}
export function installDossierTrades(content){
 for(const replacement of C.trades){const original=content.find(c=>c.room===replacement.room);if(!original)throw Error('Missing trade room '+replacement.room);Object.assign(original,replacement,{legacyId:original.id,tradeKey:original.id+'-dossiers-v1'});}
 return content;
}
export const tradeReceiptKey=content=>content.tradeKey||content.id;
