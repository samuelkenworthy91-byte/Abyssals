import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JETTIES,jettySlots} from '../dist/jetty-fishing.js';
import {PEACH_FINAL} from '../dist/finale-data.js';
import {SPLIT_WILD_REPLACEMENTS} from '../dist/collection-access.js';
import {FISH_POOL} from '../dist/fishing-habitats.js';
import {PALADIN_IDS} from '../dist/paladin-data.js';
import {cybressaRoute} from '../dist/cybressa-data.js';
import {DATA} from '../dist/data.js';
import {EVOLUTIONS} from '../dist/evolution-data.js';
import {EXPANSION} from '../dist/expansion-data.js';
import {ROUTE} from '../dist/route-data.js';
import {NEW_MAPS} from '../dist/expansion-world.js';
import {expandEncounterRoute} from '../dist/roster-encounters.js';
import {finaleRoute} from '../dist/finale-data.js';
import {botruneRoute} from '../dist/botrune-data.js';
import {marasenRoute} from '../dist/marasen-data.js';
import {orchardRoute} from '../dist/cossenne-data.js';
import {campaignRoute} from '../dist/side-campaigns.js';
import {caveRoute} from '../dist/exploration-rules.js';
import {paladinEncounterRoute,jungleRoute} from '../dist/paladin-encounters.js';
import {courtRoute} from '../dist/paladin-quest.js';
import {SIDE_CONTENT} from '../dist/exploration-data.js';
import {FOSSILS} from '../dist/mountain-quests.js';
function baseAreaRoute(room){const fn=finaleRoute(room);if(fn)return fn;if(NEW_MAPS[room]?.finale)return {room,area:{rate:'LOW'},tables:[]};const bt=botruneRoute(room);if(bt)return bt;const green=marasenRoute(room);if(green)return green;const orchard=orchardRoute(room);if(orchard)return orchard;if(room.startsWith('cossenne'))return {room,area:{rate:'LOW'},tables:[]};const campaign=campaignRoute(room);if(campaign)return campaign;const city=cybressaRoute(room);if(city)return city;if(['cybressa','cybressaWarehouse','cybressaTrial','cybressaFort'].includes(room))return {room,area:{rate:'LOW'},tables:[]};const cave=caveRoute(room);if(cave)return expandEncounterRoute(cave);const area=EXPANSION.areas.find(a=>a.id===NEW_MAPS[room]?.area);return expandEncounterRoute(area?{room,area,tables:EXPANSION.tables.filter(t=>t.area_id===area.id)}:{...ROUTE,room});}
const routes=[...new Set(['march',...Object.keys(NEW_MAPS)])].map(room=>expandEncounterRoute(paladinEncounterRoute(jungleRoute(room)||courtRoute(room)||baseAreaRoute(room))));
const sources=new Map();const add=(id,source)=>{if(!sources.has(id))sources.set(id,[]);sources.get(id).push(source);};
for(const r of routes)for(const t of r.tables||[])for(const s of t.slots)add(s.species_id,r.room+':'+t.phase);
for(const t of SIDE_CONTENT)add(t.offered,'trade:'+t.room);
for(const id of FISH_POOL)add(id,'fishing contest');for(const id of PALADIN_IDS)add(id,'court roamer');for(const id of ['164','165','173','174','175','183','184','185'])add(id,'unique quest');

for(const j of JETTIES)for(const phase of ['DAY','NIGHT'])for(const slot of jettySlots(j.room,phase))add(slot.species_id,'jetty:'+j.room+':'+phase);
for(const [key,spec]of Object.entries(PEACH_FINAL))add(spec.id,'finale unique:'+key+' (before leader eight)');
const paths=new Map(sources);let changed=true;while(changed){changed=false;for(const e of EVOLUTIONS)if(paths.has(e.from_species_id)&&!paths.has(e.to_species_id)){paths.set(e.to_species_id,['evolve '+e.from_species_id+' / '+e.condition.method,...paths.get(e.from_species_id)]);changed=true;}}
const exceptions=new Map();const exempt=(root,label)=>{exceptions.set(root,label);let change=true;while(change){change=false;for(const e of EVOLUTIONS)if(exceptions.has(e.from_species_id)&&!exceptions.has(e.to_species_id)){exceptions.set(e.to_species_id,label);change=true;}}};
for(const id of ['001','004','007'])exempt(id,'Chosen starter family; other two excluded');for(const f of FOSSILS)exempt(f.id,'Chosen fossil family; other three excluded');
const missing=DATA.species.filter(s=>!paths.has(s.id)&&!exceptions.has(s.id));assert.deepEqual(missing.map(s=>[s.id,s.name]),[],'Every eligible species has an acquisition/evolution path before leader eight');
for(const r of routes)for(const t of r.tables||[]){assert(Math.abs(t.slots.reduce((n,s)=>n+s.weight,0)-100)<.001,r.room+' weights');for(const slot of t.slots)assert(!SPLIT_WILD_REPLACEMENTS[slot.species_id],r.room+' wild split '+slot.species_id);}
for(const j of JETTIES)for(const phase of ['DAY','NIGHT'])for(const slot of jettySlots(j.room,phase))assert(!SPLIT_WILD_REPLACEMENTS[slot.species_id],'Jetty split '+slot.species_id);
const report={catalogue:DATA.species.length,eligible:DATA.species.filter(s=>!exceptions.has(s.id)).length,missing:missing.length,splitFormsRemoved:Object.keys(SPLIT_WILD_REPLACEMENTS),species:DATA.species.map(s=>({id:s.id,name:s.name,sources:paths.get(s.id)||[],exception:exceptions.get(s.id)||null}))};
if(process.argv.includes('--report')){fs.writeFileSync('docs/collection-before-eighth-leader.json',JSON.stringify(report,null,2)+'\n');}
console.log('PASS: '+report.catalogue+' catalogue entries; '+report.eligible+' eligible entries reachable through actual wild tables, fishing, trades, unique quests or evolution; no missing eligible species; no wild split branches.');
