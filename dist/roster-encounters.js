import {tideOrchardRoute} from './tide-orchard-habitats.js?v=0.90.52';
import {branchEncounterRoute} from './branch-families.js?v=0.90.52';
import {caveRoute} from './exploration-rules.js?v=0.90.52';
import {collectionEncounterRoute} from './collection-access.js?v=0.90.52';
import {accessEncounterRoute} from './encounter-access.js?v=0.90.52';
import {birdEncounterRoute} from './bird-encounters.js?v=0.90.52';
import {biodiversityEncounterRoute} from './biome-biodiversity.js?v=0.90.52';
import {orchardRoute} from './cossenne-data.js?v=0.90.52';
import {courtRoute} from './paladin-quest.js?v=0.90.52';
import {jungleRoute,paladinEncounterRoute} from './paladin-encounters.js?v=0.90.52';
import {menagerieEncounterRoute} from './menagerie-encounters.js?v=0.90.52';
import {aquaticEncounterRoute} from './approved-aquatic.js?v=0.90.52';
import {relicGroveRoute} from './relic-quest.js?v=0.90.52';
import {relicEncounterRoute} from './relic-family.js?v=0.90.52';
import {cybressaRoute} from './cybressa-data.js?v=0.90.52';
import {pacedEncounterRoute} from './encounter-pacing.js?v=0.90.52';
import {expandFullRoute} from './full-encounter-rules.js?v=0.90.52';
import {normalizeEncounterRoute} from './encounter-audit.js?v=0.90.52';
import {routeStage} from './route-progression.js?v=0.90.52';
// Habitats placed along the currently playable road. Later forms never appear below evolution level.
export const ROSTER_ENCOUNTERS=[
 ['188','march','NIGHT',5,8,8],['190','march','BOTH',5,9,10],
 ['192','northRoad','BOTH',20,28,8],['194','northRoad','BOTH',20,27,7],['196','northRoad','BOTH',20,27,7],
 ['199','northRoad','BOTH',24,32,6],['193','hospiceRoad','BOTH',30,38,6],['198','hospiceRoad','BOTH',28,36,7],
 ['189','hospiceRoad','NIGHT',28,38,5],['191','hospiceRoad','BOTH',28,38,5],
 ['200','medicinePath','BOTH',34,42,7],['195','medicinePath','BOTH',36,46,6],['197','medicinePath','BOTH',38,48,4]
].map(([species_id,base,phase,min_level,max_level,weight])=>({species_id,base,phase,min_level,max_level,weight}));
function expandLegacyEncounterRoute(route){
 if(route.rosterExpanded)return route;const stage=routeStage(route.room);if(!stage)return route;
 const tables=route.tables.map(table=>{const added=ROSTER_ENCOUNTERS.filter(s=>s.base===stage.base&&(s.phase==='BOTH'||s.phase===table.phase)&&s.min_level<=stage.max&&s.max_level>=stage.min).map(s=>({...s,min_level:Math.max(s.min_level,stage.min),max_level:Math.min(s.max_level,stage.max),approvedExpansion:true}));
 const share=added.reduce((n,s)=>n+s.weight,0),total=table.slots.reduce((n,s)=>n+s.weight,0);const old=table.slots.map(s=>({...s,weight:Math.floor(s.weight*(100-share)/total),remainder:s.weight*(100-share)/total%1}));let left=100-share-old.reduce((n,s)=>n+s.weight,0);for(const s of [...old].sort((a,b)=>b.remainder-a.remainder)){if(left--<=0)break;s.weight++;}return {...table,slots:[...added,...old.map(({remainder,...s})=>s)]};});return {...route,tables,rosterExpanded:true};
}

function existingEncounterRoute(route){if(route.relicExpanded||route.aquaticExpanded)return route;if(['relicGrove','relicGrove2','relicGrove3'].includes(route.room))return relicGroveRoute(route.room);const city=cybressaRoute(route.room);if(city)return city;return aquaticEncounterRoute(relicEncounterRoute(normalizeEncounterRoute(pacedEncounterRoute(route)??(route.explorationTable?route:expandFullRoute(expandLegacyEncounterRoute(route))))));}

function expandExistingEncounterRoute(route){const orchard=orchardRoute(route?.room);if(orchard)return orchard;const special=route&&paladinEncounterRoute(jungleRoute(route.room)||courtRoute(route.room));if(special)return special;if(route.menagerieExpanded)return route;return menagerieEncounterRoute(existingEncounterRoute(route));}

function authoredEncounterRoute(route){if(route?.birdsExpanded)return accessEncounterRoute(route);if(route?.biodiversityExpanded)return accessEncounterRoute(birdEncounterRoute(route));return accessEncounterRoute(birdEncounterRoute(biodiversityEncounterRoute(expandExistingEncounterRoute(route))));}

export function expandEncounterRoute(route){const fort=caveRoute(route?.room);if(fort)return collectionEncounterRoute(fort);return tideOrchardRoute(branchEncounterRoute(collectionEncounterRoute(authoredEncounterRoute(route))));}
