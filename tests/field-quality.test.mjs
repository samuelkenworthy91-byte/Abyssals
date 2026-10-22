import assert from 'node:assert/strict';
import {completedBattleOpponents,battleExperienceRecipients} from '../dist/battle-experience.js';
import {rewardsFor,expAward} from '../dist/progression.js';
import {DATA} from '../dist/data.js';
import {caveRoute} from '../dist/exploration-rules.js';
import {expandEncounterRoute} from '../dist/roster-encounters.js';
import {CAVE_FLOORS} from '../dist/exploration-data.js';
import {legalForm} from '../dist/route-roster.js';
import {GAME_DAY_MS as DAY,FISH_DAYLIGHT_MS as WINDOW,enterCompetition,nextFishingEncounter,recordFishingCatch,finishCompetition,claimFishingPrize,availableFishingPrizes,fishingReadyAt,fishingDeadline,canEnterCompetition} from '../dist/side-adventures.js';
const u=(uid,id='010',level=20)=>({uid,species:DATA.species.find(s=>s.id===id),level,hp:100,maxHp:100,exp:0,stats:{attack:10,defence:10,sp_attack:10,sp_defence:10,speed:10}});
let first=u('first'),second=u('second'),observer=u('observer'),caught=u('caught','364');
let b={player:second,participants:['first','second'],enemies:[caught]},party=[first,second,observer,caught];
const records=completedBattleOpponents(b,'captured');
assert.deepEqual(records,completedBattleOpponents(b,'defeated'));
assert.equal(records[0].expMultiplier,6);
let rewards=rewardsFor(records,battleExperienceRecipients(b,party));
assert.deepEqual(rewards.map(r=>r.uid),['first','second']);
assert(rewards.every(r=>r.amount===expAward(20,20,6)));
rewards=rewardsFor(records,battleExperienceRecipients(b,party),{shareAll:true});
assert.deepEqual(rewards.map(r=>r.uid),['first','second','observer']);
assert.deepEqual(completedBattleOpponents(b,'escaped'),[]);
assert.deepEqual(completedBattleOpponents(b,'wipe'),[]);
// A newly caught Rivet cannot retroactively give Warbond or learn from itself.
caught=u('caught','365');b.enemies=[caught];party=[first,second,observer,caught];
rewards=rewardsFor(completedBattleOpponents(b,'captured'),battleExperienceRecipients(b,party),{shareAll:true});
assert(rewards.every(r=>r.amount===expAward(20,20)&&!r.ability));
// Real double-battle participants keep defeated and captured rewards; the fleeing foe grants none.
const ally=u('ally','365'),ko=u('ko'),fleeing=u('fleeing');
b={...b,relicDouble:true,alliedRivet:ally,capturedUid:caught.uid,enemies:[ko,caught,fleeing],participants:['first','second','ally'],defeats:[{enemyUid:'ko',level:20,expMultiplier:1,participants:['first','ally']}]};
let rows=completedBattleOpponents(b,'captured');assert.deepEqual(rows.map(r=>r.enemyUid),['ko','caught']);assert.equal(b.defeats.length,1);
assert.deepEqual(completedBattleOpponents(JSON.parse(JSON.stringify(b)),'captured'),rows);
rewards=rewardsFor(rows,battleExperienceRecipients(b,[first,second,observer,caught],[ally]),{shareAll:false});
assert.equal(rewards.find(r=>r.uid==='first').amount,2*expAward(20,20,1,2));
assert.equal(rewards.find(r=>r.uid==='second').amount,expAward(20,20,1,2));
assert.equal(rewards.find(r=>r.uid==='ally').amount,2*expAward(20,20,1,2));
b.defeats.push(rows[1]);assert.equal(completedBattleOpponents(b,'captured').length,2);

for(const phase of ['DAY','NIGHT']){
 const previous=new Set();
 for(const [i,floor] of CAVE_FLOORS.entries()){
  const route=expandEncounterRoute(caveRoute(floor.room));assert.deepEqual(expandEncounterRoute(route),route);
  const slots=route.tables.find(t=>t.phase===phase).slots;
  assert.equal(slots.reduce((n,s)=>n+s.weight,0),100);
  assert.equal(slots.filter(s=>s.species_id==='364').length,1);
  assert.equal(slots.find(s=>s.species_id==='364').weight,i<3?3:5);
  for(const slot of slots){
   assert(DATA.species.some(s=>s.id===slot.species_id));
   assert.equal(legalForm(slot.species_id,slot.min_level),slot.species_id);
   if(slot.species_id==='364')continue;
   assert(!previous.has(slot.species_id),'Repeated fort resident '+slot.species_id+' on '+floor.room);
   previous.add(slot.species_id);
  }
 }
}

const state={money:100000,sideAdventures:{fishing:{rod:true,lastEnteredDay:-1,contest:null}}},night=DAY*.75;
assert(enterCompetition(state,night,()=>.3));let contest=state.sideAdventures.fishing.contest;
assert.equal(contest.enteredAt,night);assert.equal(fishingDeadline(contest),night+WINDOW);
assert.equal(nextFishingEncounter(state,null,night+1).phase,'NIGHT');
assert.equal(nextFishingEncounter(state,null,DAY+1).phase,'DAY','midnight does not close a paid contest');
const water=u('water','021');assert(recordFishingCatch(state,water,{fishingDay:contest.day},DAY+1));
assert(finishCompetition(state,DAY+2));assert(claimFishingPrize(state,availableFishingPrizes(state)[0].id));
assert.equal(fishingReadyAt(state),2*DAY+2);
assert(!canEnterCompetition(state,2*DAY+1));
const reloaded=JSON.parse(JSON.stringify(state));assert(enterCompetition(reloaded,2*DAY+2,()=>.4));
const nightFinish={money:100000,sideAdventures:{fishing:{rod:true,lastEnteredDay:-1,contest:null}}};
assert(enterCompetition(nightFinish,night));contest=nightFinish.sideAdventures.fishing.contest;
assert(recordFishingCatch(nightFinish,water,{fishingDay:contest.day},night+1));assert(finishCompetition(nightFinish,night+2));assert(claimFishingPrize(nightFinish,availableFishingPrizes(nightFinish)[0].id));
assert(enterCompetition(nightFinish,night+2+DAY),'next contest may start at night exactly one cycle later');
console.log('PASS: capture XP for participants/observers, no self XP or retroactive Warbond, double-battle capture records; five distinct fort pools with unchanged Rimebun rarity; anytime fishing, full-cycle cooldown and reload.');
