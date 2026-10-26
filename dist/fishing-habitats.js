import {wildCollectionForm} from './collection-access.js?v=0.90.18';
import {DATA} from './data.js?v=0.90.40';
import {FULL_ENCOUNTERS} from './full-encounters.js?v=0.87.0';
import {SIDE_POOLS,ROAD_POOLS} from './encounter-pools.js?v=0.90.25';
import {rootForm,legalForm} from './route-roster.js?v=0.87.0';
import {encounterWeights} from './expedition-abilities.js?v=0.90.40';
export const FISH_LEVEL_MIN=8,FISH_LEVEL_MAX=12;
export const FISH_ENTRY_FEE=500;
const aquaticRooms=['glassSluice','reedSanctuary','coralGrotto','moonlitDepths'];
const common=['021','051','053','079','133','139'];
// Only Water-typed residents of authored aquatic habitats can enter the contest.
const residents=[...aquaticRooms.flatMap(room=>[...(SIDE_POOLS[room]?.DAY||[]),...(SIDE_POOLS[room]?.NIGHT||[])]),...ROAD_POOLS.medicinePath.DAY,...ROAD_POOLS.medicinePath.NIGHT,...FULL_ENCOUNTERS.filter(s=>aquaticRooms.includes(s.room)).map(s=>s.species_id)];
const waterType=id=>DATA.species.find(s=>s.id===id)?.types.includes('WATER');
export const FISH_SLOTS=[...common.filter(waterType).map(species_id=>({species_id,weight:14,rarity:'Common'})),...[...new Set([...residents.map(rootForm),'376','378','381','382'])].filter(id=>!common.includes(id)&&waterType(id)).map(species_id=>({species_id,weight:1,rarity:'Rare'}))];
export const FISH_POOL=FISH_SLOTS.map(s=>s.species_id);
export const fishingResident=unit=>!!unit?.species?.types?.includes('WATER');
export function fishingSpecies(roll,level,leader=null){const weights=encounterWeights(FISH_SLOTS,leader),total=weights.reduce((a,b)=>a+b,0);let n=Math.max(0,Math.min(.999999999,roll))*total;let slot=FISH_SLOTS.at(-1);for(let i=0;i<weights.length;i++){n-=weights[i];if(n<0){slot=FISH_SLOTS[i];break;}}return wildCollectionForm(legalForm(slot.species_id,level));}
export const FISH_RIVALS=['Alice Giffard','Old Walter FitzHugh','Agnes FitzRobert','Robert de Vesci','Matilda de Montfort'];
