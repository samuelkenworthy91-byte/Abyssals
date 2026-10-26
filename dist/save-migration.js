import {migrateRenewalEconomy,rememberLegacyRenewalMoves} from './evolution-renewal.js?v=0.90.38';
import {migrateTeamcraftState} from './teamcraft-progress.js?v=0.90.30';
import {DATA} from './data.js?v=0.90.41';
import {migrateGeneralStores} from './shopkeepers.js?v=0.90.41';
import {visitedTravelRooms} from './fast-travel.js?v=0.87.0';
import {migrateMemorialMoves} from './finale-rules.js?v=0.90.19';
import {cossenneServices} from './cossenne-services.js?v=0.87.0';
import {SPECIALIST_SUPPLIES} from './specialist-supplies.js?v=0.87.0';
import {migrateChoiceRewards} from './choice-rewards.js?v=0.90.41';
import {keepContestBait} from './jetty-fishing.js?v=0.90.20';
import {migrateCharacterNames} from './character-names.js?v=0.87.0';
import {memorialState} from './memorial.js?v=0.87.0';
import {normalizeBinoculars} from './binoculars.js?v=0.87.0';
import {adventureState} from './side-adventures.js?v=0.90.41';
import {migrateHospiceQuest} from './hospice-quest.js?v=0.87.0';
const sources={ITEM_EVOLUTION_SUNSCAR_GLASS:'scrub-shrine-cache',ITEM_EVOLUTION_IRON_SIGIL:'armory-reliquary',ITEM_EVOLUTION_GILDED_IDOL:'keep-treasury-reward',ITEM_EVOLUTION_SAINT_S_TONIC:'medicine-chain-reward',ITEM_EVOLUTION_WAYFARER_FEATHER:'lost-pilgrim'};
export function migrateProgress(state){
 migrateTeamcraftState(state,DATA.moves);cossenneServices(state);migrateGeneralStores(state,visitedTravelRooms(state));
 for(const u of [...(state.party||[]),...(state.reserve||[])])if(u.abilitySlot==='hidden')u.hiddenAbilityUnlocked=true;migrateCharacterNames(state);normalizeBinoculars(state);if(!Number.isSafeInteger(state.lifeEmbers)||state.lifeEmbers<0)state.lifeEmbers=0;memorialState(state);
 for(const key of ['emergencyEvacs','armedEscorts','escortSteps','heartyFood','patientRations','freshMeat',...SPECIALIST_SUPPLIES.map(i=>i.key)])if(!Number.isSafeInteger(state[key])||state[key]<0)state[key]=0;
 // Retired food converts once, including imported pre-patch saves.
 if(state.patientRations>0){state.slowStews+=state.patientRations;state.patientRations=0;}
 state.generalStoreSupplies=state.generalStoreSupplies?.filter(k=>k!=='patientRations');
 state.lastPriestRest??=null;
 state.heldItems??={};state.supplyClaims??=[];state.tunnelPuzzle??={sequence:[],solved:false};
 state.trainerPayouts=[...new Set([...(state.trainerPayouts||[]),...(state.prizeClaims||[])])];
 state.evolutionItems={...(state.evolutionInventory||{}),...(state.evolutionItems||{})};
 migrateRenewalEconomy(state);for(const u of [...(state.party||[]),...(state.reserve||[]),...(state.dead||[])])rememberLegacyRenewalMoves(u);
 state.collectedRelics=[...new Set([...(state.collectedRelics||[]),...(state.evolutionClaims||[]).map(id=>sources[id]).filter(Boolean)])];
 state.rewardQueue=(state.rewardQueue||[]).map(card=>card.kind==='evolution-check'?{...card,kind:'evolve-check'}:card);
 for(const id of ['scrub-shrine-cache','lost-pilgrim','medicine-chain-reward'])if(state.collectedRelics?.includes(id)&&!state.supplyClaims.includes(id))state.supplyClaims.push(id);
 delete state.prizeClaims;delete state.evolutionInventory;delete state.evolutionClaims;
 adventureState(state);keepContestBait(state);state.trainingTonics??=0;if(!state.levelEvolutionMigration){state.trainingTonics+=Object.entries(state.evolutionItems||{}).filter(([id])=>!id.startsWith('ITEM_RELIC_')).reduce((n,[id,v])=>n+(Number.isSafeInteger(v)&&v>0?v:0),0);state.evolutionItems=Object.fromEntries(Object.entries(state.evolutionItems||{}).filter(([id])=>id.startsWith('ITEM_RELIC_')));state.levelEvolutionMigration=true;}state.moveScrolls??={};migrateHospiceQuest(state);migrateChoiceRewards(state);migrateMemorialMoves(state);return state;
}

