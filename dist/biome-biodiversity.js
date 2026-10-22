import {legalForm} from './route-roster.js?v=0.87.0';
import {routeStage} from './route-progression.js?v=0.87.0';
// Shared stretches retain their habitat identity. These are ordinary capturable
// residents, not a catalogue-wide roll or an arena simulation.
export const BIOME_ADDITIONS={
 march:['040','137'],scrub:['081','047'],tunnels:['329','333'],
 northRoad:['018','219'],hospiceRoad:['101','192'],medicinePath:['258','317'],
 marchMeadow:['033','040'],burrowHollow:['329','066'],glassSluice:['194','103'],
 emberQuarry:['023','240'],stormBluffs:['055','137'],orchardCanopy:['101','192'],
 reedSanctuary:['258','317'],coralGrotto:['258','135'],moonlitDepths:['135','319'],
 relicCrags:['127','198'],rivercause:['258','018'],rivercause2:['033','258'],
 philomereBackwaters:['258','317'],smugglersWeir:['258','319'],saltFlats:['081','047'],
 passFoothills:['047','055'],passLowerTunnel:['329','127'],passUpperTunnel:['127','198'],
 passRidge:['055','137'],passEastSlope:['081','047'],passCrystalPocket:['194','207'],passSummit:['137','194'],
 orchardVerge:['101','192'],orchardBend:['119','192'],orchardFirebreak:['023','113'],
 orchardEmberwood:['023','113'],orchardAshSlope:['113','047'],orchardRenewal:['101','192'],
 pilgrimGrove:['101','192'],pilgrimGrove2:['101','135'],pilgrimGrove3:['101','192'],
 sunkenShrine:['258','317'],sunkenShrine2:['135','319'],sunkenShrine3:['319','127'],
 greenCut:['018','198'],greenFern:['040','101'],greenCanopy:['283','192'],
 greenFalls:['258','135'],greenMeadow:['044','101'],greenBraid:['258','317'],
 greenLantern:['357','319'],greenVault:['055','198'],greenTerrace:['228','101'],greenApproach:['135','150'],
 relicGrove:['040','101','192'],courtTurn:['040','101','192'],bannerwood:['040','101','192'],
 courtProcession:['040','101','192'],courtPlinths:['040','076','192'],crownfall:['040','101','192'],
 courtApproach:['040','101','192'],verdantJungle:['040','101','192'],
 waranCave1:['329','127'],waranCave2:['317','152'],waranCave3:['127','198'],
 waranCave4:['135','325'],waranCave5:['319','198'],
 rescueGlade:['018','101','040'],anglersReach:['258','135','317']
};
export function biodiversityEncounterRoute(route){
 if(!route||route.biodiversityExpanded||!route.tables?.length)return route;
 const base=route.room?.replace(/Trail[23]$/,'').replace(/^relicGrove[23]$/,'relicGrove');
 const ids=BIOME_ADDITIONS[base]||BIOME_ADDITIONS[routeStage(route.room)?.base];
 if(!ids)return route;
 return {...route,biodiversityExpanded:true,tables:route.tables.map(table=>{
  if(!table.slots.length)return table;
  // Reserve up to two regular habitat slots (three in the formerly tiny groves).
  // Keep every existing rarity, including 1% pseudo-legendary first forms.
  const roomLeft=Math.max(0,7-table.slots.length),oldIds=new Set(table.slots.map(s=>s.species_id));
  const additions=ids.filter(id=>!oldIds.has(id)).slice(0,roomLeft);
  if(!additions.length)return table;
  const bounds=table.slots.filter(s=>s.weight>=10),source=bounds.length?bounds:table.slots;
  const min=Math.min(...source.map(s=>s.min_level)),max=Math.max(...source.map(s=>s.max_level));
  const slots=table.slots.map(s=>({...s}));
  const budget=additions.length*6;
  // Take weight from common residents, never from the local rare slots.
  let left=budget;
  for(const donor of [...slots].filter(s=>s.weight>=10).sort((a,b)=>b.weight-a.weight)){
   const take=Math.min(left,donor.weight-6);donor.weight-=take;left-=take;if(left===0)break;
  }
  if(left>0)throw Error('Insufficient habitat encounter budget: '+route.room);
  for(const id of additions){
   // A base form stays a base form even on a high-level road: players train it.
   if(legalForm(id,min)!==id)throw Error('Habitat resident below legal level: '+id);
   slots.push({species_id:id,min_level:min,max_level:max,weight:6,rarity:'Uncommon',authoredSlot:true,biodiversityResident:true});
  }
  return {...table,slots};
 })};
}
