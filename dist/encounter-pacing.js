import {ROAD_POOLS,SIDE_POOLS,POOL_WEIGHTS} from './encounter-pools.js?v=0.90.25';
import {legalForm} from './route-roster.js?v=0.87.0';
import {routeStage} from './route-progression.js?v=0.90.41';
const AREA_ROADS={'CIV-01':'march','DOR-01':'scrub','DOR-02':'tunnels','PHI-01':'northRoad','PHI-02':'hospiceRoad','PHI-03':'medicinePath'};
function slot(species_id,i,bounds,local){
 let min=bounds.min;while(min<=bounds.max&&legalForm(species_id,min)!==species_id)min++;
 if(min>bounds.max)throw Error('Curated species is below its evolution level: '+species_id);
 return {species_id,weight:POOL_WEIGHTS[i],min_level:min,max_level:bounds.max,rarity:i<3?'Common':i===3?'Uncommon':'Rare',authoredSlot:true,localRare:local&&i===4};
}
export function pacedEncounterRoute(route){
 if(route.explorationTable)return null;
 const stage=routeStage(route.room),base=stage?.base??(!route.room?AREA_ROADS[route.area?.id]:null),pool=SIDE_POOLS[route.room]??ROAD_POOLS[base];
 if(!pool)return null;
 const bounds=SIDE_POOLS[route.room]??stage??{min:5,max:7};
 return {...route,encounterPacing:true,biome:pool.biome,tables:['DAY','NIGHT'].map(phase=>({id:(route.room??base)+'-'+phase,area_id:route.area?.id??route.room,phase,slots:pool[phase].map((id,i)=>slot(id,i,bounds,!!SIDE_POOLS[route.room]))}))};
}
