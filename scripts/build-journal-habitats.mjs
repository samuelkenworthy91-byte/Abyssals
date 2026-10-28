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
import {NEW_MAPS,newGrass,newBlocked} from '../dist/expansion-world.js';
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

import {EXPANSION_HABITATS} from '../dist/full-encounters.js';
import {ORCHARD_ROUTES} from '../dist/cossenne-data.js';
import {VERDANT_ROAD,MARASEN_BRANCHES} from '../dist/marasen-data.js';
import {STORM_ROAD} from '../dist/botrune-data.js';
import {SUN_ROAD,SPORE_ROAD} from '../dist/finale-data.js';
import {COURT_ROOMS} from '../dist/paladin-quest.js';
const towns=new Map();
const assign=(rooms,town)=>rooms.forEach(r=>towns.set(r,town));
assign(['town','march','march2','rescueGlade','anglersReach'],'Civeton');
assign(['scrub','scrub2','tunnels','tunnels2','relicGrove','relicGrove2','relicGrove3',...Array.from({length:5},(_,i)=>'waranCave'+(i+1))],'Dorelem');
assign(['northRoad','northRoad2','northRoad3','hospiceRoad','hospiceRoad2','medicinePath','medicinePath2','philomereBackwaters'],'Philomere');
for(const room of Object.keys(NEW_MAPS))if(/^(pass|rivercause|smugglersWeir|saltFlats)/.test(room))towns.set(room,'Cybressa');
assign([...Object.keys(ORCHARD_ROUTES),...COURT_ROOMS,'verdantJungle'],'Cossenne');
assign([...VERDANT_ROAD.map(r=>r[0]),...Object.keys(MARASEN_BRANCHES),'marasenBridges','marasenRapids','marasenCitadel'],'Marasen');
assign([...STORM_ROAD.map(r=>r[0]),'stormRelay','stormCrags','stormWatch','stormShelter'],'Botrune');assign(SUN_ROAD.map(r=>r[0]),'Cayfen');assign(SPORE_ROAD.map(r=>r[0]),'Ramelle');
assign(['guanApproach','guanShrine','feiApproach','feiCrossing'],'Cayfen');
// Sporefall's optional branches use Ramelle's encounter ecology and rumours.
assign(['sporeGrotto','sporeCanopy'],'Ramelle');
for(const h of EXPANSION_HABITATS){towns.set(h.room,towns.get(h.parent));for(const suffix of ['Trail2','Trail3'])towns.set(h.room+suffix,towns.get(h.parent));}
for(const root of ['philomereBackwaters','smugglersWeir','saltFlats','rescueGlade','anglersReach'])for(const suffix of ['Trail2','Trail3'])towns.set(root+suffix,towns.get(root));
const rows={},add=(id,row)=>{if(!rows[id])rows[id]=[];if(!rows[id].some(r=>JSON.stringify(r)===JSON.stringify(row)))rows[id].push(row);};
for(const room of ['march',...Object.keys(NEW_MAPS)]){
 let found=room==='march';for(let y=0;y<32&&!found;y++)for(let x=0;x<48;x++)if(newGrass(room,x,y)&&!newBlocked(room,x,y)){found=true;break;}
 if(!found)continue;
 const route=expandEncounterRoute(paladinEncounterRoute(jungleRoute(room)||courtRoute(room)||baseAreaRoute(room)));
 const town=towns.get(room)||(/^storm/.test(room)?'Botrune':null);if(!town)throw Error('Missing explicit journal town: '+room);
 for(const table of route.tables||[])for(const slot of table.slots||[])add(slot.species_id,{room,area:NEW_MAPS[room]?.name||'Civeton March',town,phase:table.phase,levels:slot.min_level+'–'+slot.max_level});
}
for(const j of JETTIES)for(const phase of ['DAY','NIGHT'])for(const slot of jettySlots(j.room,phase))add(slot.species_id,{room:j.room,area:j.name||'Fishing waters',town:towns.get(j.room)||'Marasen',phase,levels:(slot.min_level??j.min)+'–'+(slot.max_level??j.max)});
fs.writeFileSync('dist/journal-habitats.js','// Generated from live encounter pipelines by scripts/build-journal-habitats.mjs.\nexport const JOURNAL_HABITATS='+JSON.stringify(rows)+';\n');
console.log('Journal: '+Object.keys(rows).length+' wild species indexed from current playable habitats');
