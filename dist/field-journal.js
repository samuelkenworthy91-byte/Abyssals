import {hasVisitedTown} from './fast-travel.js?v=0.90.46';
import {DATA} from './data.js?v=0.90.48';
import {JOURNAL_HABITATS} from './journal-habitats.js?v=0.90.46';
import {SIDE_CONTENT} from './exploration-data.js?v=0.90.48';
import {FOSSILS} from './mountain-quests.js?v=0.90.16';
import {BREEDING_ONLY_FIRST_FORMS} from './encounter-access.js?v=0.90.18';
import {EVOLUTIONS} from './evolution-data.js?v=0.90.48';
import {growthPercent,STAT_KEYS,STAT_LABELS,unitGrowthRates} from './progression.js?v=0.90.41';

// Small, append-only observations. A captured species stays registered after
// evolution, rehoming or permanent death. Ownership is calculated from the
// current living roster rather than a stale flag in the save file.
const validId=id=>typeof id==='string'&&DATA.species.some(s=>s.id===id);
const safeRecord=v=>v&&typeof v==='object'&&!Array.isArray(v);
export function ensureFieldJournal(state){
 if(!safeRecord(state.fieldJournal)||state.fieldJournal.version!==1)state.fieldJournal={version:1,seen:{},owned:{}};
 const journal=state.fieldJournal;
 if(!safeRecord(journal.seen))journal.seen={};
 if(!safeRecord(journal.owned))journal.owned={};
 const owned=[...(state.party||[]),...(state.reserve||[]),...(state.dead||[])];
 if(state.starter?.species)owned.push(state.starter);
 for(const unit of owned){
  const id=unit?.species?.id;
  if(validId(id)){journal.owned[id]=true;journal.seen[id]??={room:null};}
  for(const entry of unit?.evolutionHistory||[]){
   for(const stage of [entry?.from,entry?.to]){
    if(validId(stage)){journal.owned[stage]=true;journal.seen[stage]??={room:null};}
   }
  }
 }
 return journal;
}
export function recordFieldSighting(state,speciesId,room=null){
 if(!validId(speciesId))return false;
 const journal=ensureFieldJournal(state);
 if(journal.seen[speciesId])return false;
 journal.seen[speciesId]={room:typeof room==='string'?room:null};
 return true;
}
export function recordFieldBattle(state,battle,room){
 if(!battle?.enemies?.length||['trainer','calling'].includes(battle.phase))return false;
 const indices=battle.activeEnemyIndices?.length?battle.activeEnemyIndices:
  battle.relicDouble?[0,1]:[battle.kind==='wild'||battle.kind==='lesson'?0:(battle.index||0)];
 let changed=false;
 for(const i of indices)if(i>=0&&battle.enemies[i]&&!battle.enemies[i].withdrawn)changed=recordFieldSighting(state,battle.enemies[i].species?.id,room)||changed;
 return changed;
}
export function fieldJournalStatus(state,id){
 const journal=ensureFieldJournal(state);
 const owned=!!journal.owned[id],seen=owned||!!journal.seen[id];
 if(!seen)return 'unknown';
 if(!owned)return 'seen';
 const present=[...(state.party||[]),...(state.reserve||[])].some(u=>u.species?.id===id&&u.hp>0&&!u.dead);
 return present?'living':'owned';
}
export function fieldJournalCounts(state){
 const result={total:DATA.species.length,seen:0,owned:0,living:0};
 for(const s of DATA.species){
  const status=fieldJournalStatus(state,s.id);
  if(status!=='unknown')result.seen++;
  if(status==='owned'||status==='living')result.owned++;
  if(status==='living')result.living++;
 }
 return result;
}
export function fieldJournalLiving(state,id){
 return [...(state.party||[]),...(state.reserve||[])].filter(u=>u.species?.id===id&&u.hp>0&&!u.dead);
}
export function fieldJournalLosses(state,id){
 return (state.dead||[]).filter(u=>u.species?.id===id).length;
}
export function fieldJournalGrowth(species,ownedUnit=null){
 const original=Object.fromEntries(STAT_KEYS.map(key=>[key,growthPercent(species,key)]));
 return {original,individual:ownedUnit?unitGrowthRates(ownedUnit):null};
}
export {STAT_KEYS,STAT_LABELS};
export function fieldJournalEvolutions(id){
 return EVOLUTIONS.filter(e=>e.from_species_id===id||e.to_species_id===id).map(e=>({
  from:DATA.species.find(s=>s.id===e.from_species_id),
  to:DATA.species.find(s=>s.id===e.to_species_id),
  condition:e.condition
 })).filter(e=>e.from&&e.to);
}
export function fieldJournalMoves(id){
 return DATA.learnsets.filter(l=>l.species_id===id).map(l=>({
  level:Number(l.level)||1,
  move:DATA.moves.find(m=>String(m.id)===String(l.move_id))
 })).filter(r=>r.move).sort((a,b)=>a.level-b.level||a.move.name.localeCompare(b.move.name));
}

// Generated from the same final encounter pipelines as wild battles, including
// expansions, split-form replacement, floor-specific pools and fishing.
const speciesHabitatIndex=new Map(Object.entries(JOURNAL_HABITATS).map(([id,rows])=>[id,rows.map(r=>({...r,key:r.room+'|'+r.phase+'|'+r.levels,area:r.room.startsWith('waranCave')?'Sunken Fort · '+r.area:r.area}))]));
function specialAcquisition(id){
 if(BREEDING_ONLY_FIRST_FORMS.includes(id))return {kind:'breeding',message:'This Abyssal is obtained through breeding.'};
 if(SIDE_CONTENT.some(s=>s.offered===id))return {kind:'trade',message:'This Abyssal can be obtained through a traveller’s trade.'};
 if(['001','004','007'].includes(id))return {kind:'gift',message:'This family begins with a chosen starter gift; breeding can provide another of your chosen family.'};
 if(FOSSILS.some(f=>f.id===id))return {kind:'gift',message:'A special revival gift is needed for this ancient Abyssal.'};
 return {kind:'special',message:'No ordinary wild sighting is recorded. Seek a special encounter, gift or reward as your expedition progresses.'};
}
export function fieldJournalRumours(id,state={}){
 const towns=[...new Set((speciesHabitatIndex.get(id)||[]).map(r=>r.town).filter(Boolean))];
 if(towns.length){const known=towns.filter(t=>hasVisitedTown(state,t));return known.length?'Rumour has it this Abyssal can be found somewhere near '+known.slice(0,2).join(' or ')+'.':'Rumour has it this Abyssal can be found somewhere far off ahead.';}
 if(EVOLUTIONS.some(e=>e.to_species_id===id))return 'Rumour has it this form is reached by evolving another Abyssal, rather than hunting for it here.';
 return specialAcquisition(id).message;
}
export function fieldJournalAvailability(id){
 const locations=speciesHabitatIndex.get(id)||[];
 if(locations.length)return {kind:'wild',message:'Recorded wild habitats'};
 const parents=EVOLUTIONS.filter(e=>e.to_species_id===id).map(e=>DATA.species.find(s=>s.id===e.from_species_id)?.name).filter(Boolean);
 if(parents.length)return {kind:'evolution',message:'Only available through evolution of '+[...new Set(parents)].join(' or ')+'.'};
 return specialAcquisition(id);
}
export function fieldJournalHabitats(id){
 const matches=speciesHabitatIndex.get(id)||[];
 if(matches.length)return matches;
 const evolves=EVOLUTIONS.filter(e=>e.to_species_id===id).map(e=>DATA.species.find(s=>s.id===e.from_species_id)?.name).filter(Boolean);
 if(evolves.length)return evolves.map(name=>({area:'Evolution of '+name,phase:'',levels:''}));
 return [];
}
export function fieldJournalAllSpecies(){return [...DATA.species].sort((a,b)=>Number(a.id)-Number(b.id)||a.name.localeCompare(b.name));}
