import {BREEDING_ONLY_FIRST_FORMS,TRADE_ONLY_FAMILIES,RESERVED_STARTERS} from './encounter-access.js?v=0.90.18';
import {keepContestBait} from './jetty-fishing.js?v=0.90.20';
import {FISH_POOL,FISH_ENTRY_FEE,FISH_RIVALS,fishingResident,fishingSpecies} from './fishing-habitats.js?v=0.90.18';
export {FISH_POOL,FISH_ENTRY_FEE} from './fishing-habitats.js?v=0.90.18';
import {startingMoveIds} from './moveset-identity.js?v=0.87.0';
import {TYPES} from './type-rules.js?v=0.87.0';
import {EVOLUTIONS} from './evolution-data.js?v=0.87.0';
import {DATA} from './data.js?v=0.87.0';
import {instance,rng} from './engine.js?v=0.90.24';
import {hashSeed,initializeProgress,STAT_KEYS,unitGrowthRates} from './progression.js?v=0.90.18';
// Ordinary starting forms only; exclude special rarity classes across the whole family.
const specialFamily=s=>DATA.species.some(other=>other.family_id===s.family_id&&/legend|myth|pseudo|fossil/i.test(other.power_class));
export const RESCUE_GIFTS=DATA.species.filter(s=>![...BREEDING_ONLY_FIRST_FORMS,...TRADE_ONLY_FAMILIES,...RESERVED_STARTERS].includes(s.id)&&!specialFamily(s)&&!EVOLUTIONS.some(e=>e.to_species_id===s.id)&&Object.values(unitGrowthRates({species:s,growthMultiplier:1.1})).reduce((n,v)=>n+Math.round(v*10),0)<=3000).map(s=>s.id);
export const validRescueTypes=types=>Array.isArray(types)&&types.length===3&&new Set(types).size===3&&types.every(t=>TYPES.includes(t));
export function rescueGiftPool(types){return validRescueTypes(types)?RESCUE_GIFTS.filter(id=>DATA.species.find(s=>s.id===id).types.some(t=>types.includes(t))):[];}
export function chooseRescueTypes(state,types,random=Math.random){const q=adventureState(state).rescue;if(!q.rescued||q.giftUid||validRescueTypes(q.selectedTypes)||!validRescueTypes(types))return false;const pool=rescueGiftPool(types);if(new Set(pool.map(id=>DATA.species.find(s=>s.id===id).family_id)).size<3)return false;q.selectedTypes=[...types];delete q.giftChoices;return rescueGiftChoices(state,random).length===3;}
export function rescueGiftChoices(state,random=Math.random){const q=adventureState(state).rescue;if(!q.rescued||q.giftUid||!validRescueTypes(q.selectedTypes))return [];
 let pool=rescueGiftPool(q.selectedTypes);const family=id=>DATA.species.find(s=>s.id===id).family_id;
 if(q.giftChoices?.length===3&&q.giftChoices.every(id=>pool.includes(id))&&new Set(q.giftChoices.map(family)).size===3)return q.giftChoices;
 if(new Set(pool.map(family)).size<3)return [];
 q.giftChoices=[];for(let i=0;i<3;i++){const index=Math.max(0,Math.min(pool.length-1,Math.floor(random()*pool.length))),id=pool[index];q.giftChoices.push(id);pool=pool.filter(candidate=>family(candidate)!==family(id));}return q.giftChoices;
}
export const RESCUE_SOLDIERS=[{name:'Dawn Bloom scout Ali ibn Salim',speciesId:'025',level:15},{name:'Dawn Bloom soldier Maryam bint Ahmad',speciesId:'030',level:15},{name:'Dawn Bloom soldier Hafsa bint Hasan',speciesId:'027',level:16},{name:'Dawn Bloom corporal Hasan ibn Yusuf',speciesId:'073',level:16}];
export const GAME_DAY_MS=1200000;
// Precompute a small batch; later casts are generated and saved on demand.
export const FISH_INITIAL_DRAWS=8;
export const FISH_DAYLIGHT_MS=GAME_DAY_MS/2;
export const fishingStart=c=>Number.isFinite(c?.enteredAt)?c.enteredAt:c.day*GAME_DAY_MS;
export const fishingDeadline=c=>fishingStart(c)+FISH_DAYLIGHT_MS;
export const fishingClosed=(c,elapsed)=>!!c&&elapsed>=fishingDeadline(c);
// Saved absolute game-clock timestamps: travel and save/reload cannot reset the wait.
export const fishingCanSubmit=(c,elapsed)=>!!c&&!c.finished&&(!!c.entry||fishingClosed(c,elapsed));
export function fishingReadyAt(state){const f=state.sideAdventures?.fishing,c=f?.contest;if(c?.finished)return Math.max(c.caughtAt??0,c.submittedAt??fishingDeadline(c))+GAME_DAY_MS;return !c&&f?.lastEnteredDay>=0?(f.lastEnteredDay+1)*GAME_DAY_MS:0;}
export function canEnterCompetition(state,elapsed){const f=state.sideAdventures?.fishing;return !!f?.rod&&Number.isFinite(elapsed)&&elapsed>=0&&(!f.contest||f.contest.prizeClaimed)&&elapsed>=fishingReadyAt(state)&&Number.isFinite(state.money)&&state.money>=FISH_ENTRY_FEE;}

export const FISH_BAIT=12;
export const WATER_BAIT_MODIFIER=1.7;

export const FISH_PRIZES=[
 {id:'tide-pearl',name:'Tide Pearl',rank:1,kind:'evolution',item:'ITEM_EVOLUTION_TIDE_PEARL',quantity:1,text:'Evolve Triskit into Phlegacorn from level 30.'},
 {id:'stormglass',name:'Stormglass',rank:1,kind:'evolution',item:'ITEM_EVOLUTION_STORMGLASS',quantity:1,text:'Evolve Pebbettle into Prodiglow from level 28.'},
 {id:'champion-tonics',name:'Training Tonic × 3',rank:1,kind:'tonic',quantity:3,text:'Each tonic raises one living Abyssal by exactly one level, with growth and move learning.'},
 {id:'veil-charm',name:'Veil Charm',rank:1,kind:'held',item:'HELD_VEIL_CHARM',quantity:1,text:'A held item that improves Special Defence.'},
 {id:'foam-scroll',name:'Foam Lance scroll',rank:1,kind:'scroll',moveId:45,quantity:1,text:'Teach Foam Lance to an Abyssal whose species or previous form has it in its learnset.'},
 {id:'silver-tonic',name:'Training Tonic',rank:2,kind:'tonic',quantity:1,text:'Raise one living Abyssal by one level.'},
 {id:'iron-mantle',name:'Iron Mantle',rank:2,kind:'held',item:'HELD_IRON_MANTLE',quantity:1,text:'A held item that improves Defence.'},
 {id:'bronze-supplies',name:'Poultice × 2',rank:3,kind:'supply',key:'poultices',quantity:2,text:'Two medicines for your journey.'},
 {id:'entrant-bread',name:'Trail Bread × 1',rank:99,kind:'supply',key:'bread',quantity:1,text:'A small participation gift.'}
];
export function adventureState(state){state.sideAdventures??={version:1,rescue:{seen:false,rescued:false,giftUid:null,giftSpeciesId:null},fishing:{rod:false,lastEnteredDay:-1,contest:null}};return state.sideAdventures;}
export const gameDay=elapsed=>Math.floor(Math.max(0,Number(elapsed)||0)/GAME_DAY_MS);
export function rescueReady(state){return !!state.sideAdventures?.rescue?.rescued;}
export function completeRescue(state){const q=adventureState(state).rescue;if(q.rescued)return false;q.seen=true;q.rescued=true;state.storyChoices??={};state.storyChoices.roadside_rescue='TRUE_LIGHT_SOLDIER_RESCUED';return true;}
export function claimRescueGift(state,unit){const q=adventureState(state).rescue;if(!q.rescued||q.giftUid||!rescueGiftChoices(state).includes(unit?.species?.id)||unit.level!==1)return false;unit.growthMultiplier=1.1;unit.giftOrigin='Roadside rescue';unit.originalStarter=false;unit.lives=1;(state.party.length<6?state.party:state.reserve).push(unit);q.giftUid=unit.uid;q.giftSpeciesId=unit.species.id;return true;}
export function waterBaitModifier(unit){return fishingResident(unit)?WATER_BAIT_MODIFIER:0;}
export function fishScore(unit){return Math.round(unit.maxHp+STAT_KEYS.filter(k=>k!=='hp').reduce((n,k)=>n+unit.stats[k],0));}
export function fishEntry(unit,name){return {uid:unit.uid,speciesId:unit.species.id,speciesName:unit.species.name,name,level:unit.level,score:fishScore(unit),stats:{...unit.stats,hp:unit.maxHp}};}
function fishUnit(id,level,seed){const species=DATA.species.find(s=>s.id===id);const moves=startingMoveIds(DATA,species,level).map(id=>DATA.moves.find(m=>m.id===id));const unit=instance(species,level,moves);unit.uid=seed;return initializeProgress(unit);}
// Independent draws with replacement, just like a wild encounter table.
export function rollFishingEncounter(day,cast,random,seed,leader=null){const speciesRoll=random(),level=8+Math.floor(random()*5),speciesId=fishingSpecies(speciesRoll,level,leader);return {speciesId,level,seed:'fishing:'+day+':'+seed+':cast:'+cast,speciesRoll};}
function fishingSchedule(day,seed){const random=rng(hashSeed('anglers-draws:v4:'+day+':'+seed));return Array.from({length:FISH_INITIAL_DRAWS},(_,cast)=>rollFishingEncounter(day,cast,random,seed));}
export function createCompetition(day,seed=hashSeed('anglers-reach:v4:'+day)){const random=rng(hashSeed('anglers-rivals:'+day+':'+seed)),encounters=fishingSchedule(day,seed);const rivals=FISH_RIVALS.map((name,i)=>{const candidates=Array.from({length:3},(_,j)=>{const e=rollFishingEncounter(day,j,random,seed);return fishUnit(e.speciesId,e.level,'fishing:'+day+':'+seed+':rival:'+i+':'+j);});return {...fishEntry(candidates.sort((a,b)=>fishScore(b)-fishScore(a))[0],name),portraitIndex:i};});return {encounterVersion:5,seed,day,casts:0,bait:FISH_BAIT,encounters,rivals,entry:null,finished:false,prizeClaimed:false};}
// Paid entry and already-used casts are never charged or rerolled by a save upgrade.
export function upgradeFishingSchedule(c){if(!c||c.encounterVersion===5||c.finished||c.entry)return;const seed=c.seed??hashSeed('anglers-legacy:v5:'+c.day),schedule=fishingSchedule(c.day,seed);c.encounters??=[];for(let i=c.casts;i<FISH_INITIAL_DRAWS;i++)c.encounters[i]=schedule[i];c.encounterVersion=5;c.seed=seed;}

export function receiveRod(state){const f=adventureState(state).fishing;if(f.rod)return false;f.rod=true;return true;}
export function enterCompetition(state,elapsed,random=Math.random){const f=adventureState(state).fishing,day=gameDay(elapsed);if(!canEnterCompetition(state,elapsed))return false;state.money-=FISH_ENTRY_FEE;f.contest={...createCompetition(day,hashSeed('anglers-entry:'+day+':'+random())),enteredAt:elapsed};f.lastEnteredDay=day;keepContestBait(state);return true;}
export function nextFishingEncounter(state,leader=null,elapsed=null){const c=state.sideAdventures?.fishing?.contest;const now=elapsed??(c?fishingStart(c):0);if(!c||c.finished||c.entry||now<fishingStart(c)||fishingClosed(c,now))return null;upgradeFishingSchedule(c);c.encounters??=[];const index=c.casts;if(!c.encounters[index])c.encounters[index]=rollFishingEncounter(c.day,index,rng(hashSeed('anglers-extra:v5:'+c.day+':'+c.seed+':'+index)),c.seed);const encounter=c.encounters[index];if(Number.isFinite(encounter.speciesRoll))encounter.speciesId=fishingSpecies(encounter.speciesRoll,encounter.level,leader);else if(!DATA.species.find(s=>s.id===encounter.speciesId)?.types.includes('WATER'))encounter.speciesId=fishingSpecies(rng(hashSeed(encounter.seed))(),encounter.level,leader);c.casts++;return {speciesId:encounter.speciesId,level:encounter.level,seed:encounter.seed,fishingDay:c.day,fishingCast:c.casts,phase:Math.floor(now/FISH_DAYLIGHT_MS)%2?'NIGHT':'DAY'};}
export function canUseWaterBait(state,battle){const c=state.sideAdventures?.fishing?.contest;return !!c&&!c.finished&&!c.entry&&c.day===battle?.fishingDay&&c.bait>0&&waterBaitModifier(battle.enemies?.[0])>0;}
export function recordFishingCatch(state,unit,battle,elapsed=null){const c=state.sideAdventures?.fishing?.contest;if(!c||c.finished||c.entry||c.day!==battle?.fishingDay||!fishingResident(unit))return false;c.entry=fishEntry(unit,state.playerName||'Aimon');c.caughtAt=Number.isFinite(elapsed)?Math.max(fishingStart(c),elapsed):fishingStart(c);return true;}
export function fishingResults(state){const c=state.sideAdventures?.fishing?.contest;if(!c)return [];const rows=[...c.rivals.map(r=>({...r,player:false})),{...(c.entry||{name:state.playerName||'Aimon',score:0,speciesName:'No keeper',level:null,stats:null}),player:true,noKeeper:!c.entry}].sort((a,b)=>b.score-a.score);let rank=0,previous=null;return rows.map((row,i)=>{if(row.score!==previous)rank=i+1;previous=row.score;return {...row,rank};});}
export function finishCompetition(state,elapsed=0){const c=state.sideAdventures?.fishing?.contest;if(!fishingCanSubmit(c,elapsed)||!Number.isFinite(elapsed)||elapsed<fishingStart(c))return false;c.finished=true;c.submittedAt=elapsed;c.rank=c.entry?fishingResults(state).find(r=>r.player)?.rank||99:99;return true;}
export function availableFishingPrizes(state){const c=state.sideAdventures?.fishing?.contest;return c?.finished&&!c.prizeClaimed?FISH_PRIZES.filter(p=>p.rank>=c.rank):[];}
export function claimFishingPrize(state,id){const c=state.sideAdventures?.fishing?.contest,p=availableFishingPrizes(state).find(p=>p.id===id);if(!p)return false;const q=p.quantity;if(p.kind==='evolution'){state.evolutionItems??={};state.evolutionItems[p.item]=(state.evolutionItems[p.item]||0)+q;}else if(p.kind==='held'){state.heldItems??={};state.heldItems[p.item]=(state.heldItems[p.item]||0)+q;}else if(p.kind==='tonic')state.trainingTonics=(state.trainingTonics||0)+q;else if(p.kind==='scroll'){state.moveScrolls??={};state.moveScrolls[p.moveId]=(state.moveScrolls[p.moveId]||0)+q;}else state[p.key]=(state[p.key]||0)+q;c.prizeClaimed=true;c.prizeId=id;return true;}
export function canLearnScroll(unit,moveId){const ids=new Set([unit?.species?.id,...(unit?.evolutionHistory||[]).flatMap(h=>[h.from,h.to])]);return !!unit&&unit.hp>0&&!unit.dead&&!unit.moves.some(m=>m.id===moveId)&&(DATA.learnsets.some(l=>ids.has(l.species_id)&&l.move_id===moveId)||(DATA.moves.find(m=>m.id===moveId)?.tutorTypes||[]).some(t=>unit.species.types.includes(t)));}
export function sideObjective(state,room,elapsed=0){if(room==='rescueGlade'){const q=state.sideAdventures?.rescue;return {spot:q?.rescued?q.giftUid?'rescue-back':'rescued-soldier':'rescue-leader',text:q?.rescued?q.giftUid?'Return to the main road':'Choose a rescue gift Abyssal':q?.seen?'Defeat all four soldiers without leaving the battle':'Investigate the soldiers in the glade'};}if(room==='anglersReach'){const f=state.sideAdventures?.fishing,c=f?.contest;return {spot:!f?.rod?'fishing-warden':c&&!c.finished&&!c.entry&&!fishingClosed(c,elapsed)?'fishing-cast':'fishing-warden',text:!f?.rod?'Speak to the angling warden':c&&!c.finished?fishingClosed(c,elapsed)?'Submit your competition result':c.entry?'Submit your keeper to the warden now':'Find one Water-type keeper before time runs out':c&&!c.prizeClaimed?'Collect your competition prize':'Speak to the warden or return to the road'};}return null;}
export function sideJournal(state,room,elapsed=0){if(room==='rescueGlade')return rescueReady(state)?'The young soldier is safe. He wants to thank you.':'A lone True Light soldier is cornered by a Dawn Bloom patrol.';if(room==='anglersReach'){const c=state.sideAdventures?.fishing?.contest;return c&&!c.finished?`Competition day ${c.day+1}: ${c.casts} casts used · ${fishingClosed(c,elapsed)?'Casting time has ended':'Casting window is open'}. ${c.entry?'Your keeper is registered at '+c.entry.score+' total stats; submit it to the warden now.':'You can keep one catch.'}`:'Submit a keeper at any time. Enter again at any time after a full day–night cycle from your last catch or submission, whichever was later. Travel does not reset the wait.';}return null;}
