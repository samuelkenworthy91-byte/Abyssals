import {DATA} from './data.js?v=0.90.41';
import {ROUTE} from './route-data.js?v=0.90.41';
import {ROAD_POOLS,SIDE_POOLS,FORT_POOLS} from './encounter-pools.js?v=0.90.25';
import {FULL_ENCOUNTERS,EXPANSION_HABITATS} from './full-encounters.js?v=0.87.0';
import {CAVE_FLOORS} from './exploration-data.js?v=0.90.41';
import {EVOLUTIONS} from './evolution-data.js?v=0.90.41';
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
 if(!journal.seen[speciesId])journal.seen[speciesId]={room:typeof room==='string'?room:null};
 return true;
}
export function recordFieldBattle(state,battle,room){
 if(!battle?.enemies?.length)return;
 // A trainer's unrevealed reserves must not be marked seen. Double battles
 // reveal their two active foes, not the entire six-part roster.
 const indices=battle.activeEnemyIndices?.length?battle.activeEnemyIndices:
  battle.relicDouble?[0,1]:[0];
 for(const i of indices)recordFieldSighting(state,battle.enemies[i]?.species?.id,room);
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

// Only use actual authored encounter tables, not guessed locations.
const speciesHabitatIndex=new Map();
const add=(id,area,phase='',levels='')=>{
 if(!validId(id)||!area)return;
 const rows=speciesHabitatIndex.get(id)||[];
 const key=area+'|'+phase+'|'+levels;
 if(!rows.some(r=>r.key===key))rows.push({key,area,phase,levels});
 speciesHabitatIndex.set(id,rows);
};
const habitatNames=Object.fromEntries(EXPANSION_HABITATS.map(h=>[h.room,h.name]));
for(const t of ROUTE.tables||[])for(const s of t.slots||[])add(s.species_id,ROUTE.area?.location||'Civeton March',t.phase||'',s.min_level+'–'+s.max_level);
for(const [room,pool] of Object.entries(ROAD_POOLS))for(const phase of ['DAY','NIGHT'])for(const id of pool[phase]||[])add(id,pool.name||room,phase);
for(const [room,pool] of Object.entries(SIDE_POOLS))for(const phase of ['DAY','NIGHT'])for(const id of pool[phase]||[])add(id,habitatNames[room]||room,phase,pool.min+'–'+pool.max);
for(const [index,pool] of FORT_POOLS.entries())for(const id of pool)add(id,CAVE_FLOORS[index]?.name||'Sunken Fort · floor '+(index+1),'BOTH');
for(const row of FULL_ENCOUNTERS)add(row.species_id,habitatNames[row.room]||row.room,row.phase,row.min_level+'–'+row.max_level);
add('364','Sunken Fort · all explored floors','RARE');
// Rumour locations derive from actual encounter areas, never speculative routes.
const townForHabitat=area=>{
 const name=String(area||'').toLowerCase();
 if(/sunken fort|veilroot|bastion/.test(name))return 'Dorelem';
 if(/civeton|march|meadow|hedgerow/.test(name))return 'Civeton';
 if(/dorelem|scrub|tenrec|burrow|service tunnel|glasswater|quarry|stormglass|relic crags/.test(name))return 'Dorelem';
 if(/philomere|hospice|medicine|reed|coral|moonlit|orchard canopy|north road/.test(name))return 'Philomere';
 if(/cybressa|rivercause|backwater|smuggler|salt flat/.test(name))return 'Cybressa';
 if(/marasen|living water|rapids|aquatic/.test(name))return 'Marasen';
 if(/botrune|gothic/.test(name))return 'Botrune';
 if(/kaivton|snow/.test(name))return 'Kaivton';
 if(/ramelle/.test(name))return 'Ramelle';
 if(/cayfen/.test(name))return 'Cayfen';
 if(/cossenne|orchard|peach|grove/.test(name))return 'Cossenne';
 return null;
};
export function fieldJournalRumours(id){
 const towns=[...new Set((speciesHabitatIndex.get(id)||[]).map(r=>townForHabitat(r.area)).filter(Boolean))];
 if(towns.length)return 'Rumour has it this Abyssal can be found near '+towns.slice(0,2).join(' or ')+'. Search the surrounding routes and hidden paths.';
 if(EVOLUTIONS.some(e=>e.to_species_id===id))return 'Rumour has it this form is reached by evolving another Abyssal, rather than hunting for it here.';
 return 'No ordinary wild sighting is recorded. Seek special encounters, gifts, rewards or trades.';
}
export function fieldJournalAvailability(id){
 const locations=speciesHabitatIndex.get(id)||[];
 if(locations.length)return {kind:'wild',message:'Recorded wild habitats'};
 const parents=EVOLUTIONS.filter(e=>e.to_species_id===id).map(e=>DATA.species.find(s=>s.id===e.from_species_id)?.name).filter(Boolean);
 if(parents.length)return {kind:'evolution',message:'Only available through evolution of '+[...new Set(parents)].join(' or ')+'.'};
 return {kind:'special',message:'No regular wild encounter recorded. Look for special encounters, gifts, rewards or trades.'};
}
export function fieldJournalHabitats(id){
 const matches=speciesHabitatIndex.get(id)||[];
 if(matches.length)return matches;
 const evolves=EVOLUTIONS.filter(e=>e.to_species_id===id).map(e=>DATA.species.find(s=>s.id===e.from_species_id)?.name).filter(Boolean);
 if(evolves.length)return evolves.map(name=>({area:'Evolution of '+name,phase:'',levels:''}));
 return [];
}
export function fieldJournalAllSpecies(){return [...DATA.species].sort((a,b)=>Number(a.id)-Number(b.id)||a.name.localeCompare(b.name));}
