import assert from 'node:assert/strict';
import {specialistStrength, SPECIALIST_FOODS} from '../dist/specialist-supplies.js';
import {capturePreview,resolveCapture} from '../dist/route-rules.js';
import {GAME_DAY_MS as DAY,FISH_DAYLIGHT_MS as LIGHT,enterCompetition,nextFishingEncounter,recordFishingCatch,finishCompetition,claimFishingPrize,availableFishingPrizes,fishingReadyAt,fishingCanSubmit,canEnterCompetition,sideObjective} from '../dist/side-adventures.js';
import {DATA} from '../dist/data.js';

const target={species:{capture_rate:45},level:65,hp:1,maxHp:300};
assert.deepEqual([1,2,3,4,20].map(r=>specialistStrength('quickbites',target,r)),[40,12,3,1,1]);
const chances=[1,2,3,4].map(r=>capturePreview(target,specialistStrength('quickbites',target,r)).chance);
assert(chances[0]>.59&&chances[0]<.62);
assert(chances.every((p,i)=>i===0||p<chances[i-1]));
for(const level of [60,65,70])for(const hp of [1,3]){
 const u={...target,level,hp};
 const p=capturePreview(u,specialistStrength('quickbites',u,1));
 assert(p.chance>.52&&p.chance<.71);
 assert.equal(resolveCapture(u,()=>0,{foodModifier:40}).chance,p.chance);
 assert(resolveCapture(u,()=>0,{foodModifier:40}).success);
 assert(!resolveCapture(u,()=>.99999,{foodModifier:40}).success);
}
assert.equal(specialistStrength('slowStews',target,101),101);
assert(SPECIALIST_FOODS.find(i=>i.key==='quickbites').text.includes('40×'));

const fresh=()=>({money:100000,playerName:'Test',sideAdventures:{fishing:{rod:true,lastEnteredDay:-1,contest:null}}});
const water=DATA.species.find(s=>s.types.includes('WATER'));
const keeper={uid:'keeper',species:water,level:10,maxHp:50,stats:{attack:10,defence:10,sp_attack:10,sp_defence:10,speed:10}};
const claim=s=>{assert(claimFishingPrize(s,availableFishingPrizes(s)[0].id));assert(!claimFishingPrize(s,'entrant-bread'));};
const s=fresh(),start=10000,caught=20000,submitted=30000;
assert(enterCompetition(s,start,()=>.3));
const battle=nextFishingEncounter(s,null,caught);
assert(recordFishingCatch(s,keeper,battle,caught));
assert.equal(sideObjective(s,'anglersReach',caught).text,'Submit your keeper to the warden now');
assert(!nextFishingEncounter(s,null,caught));
assert(fishingCanSubmit(s.sideAdventures.fishing.contest,caught));
assert(finishCompetition(s,submitted)); // daylight, long before nightfall
assert(!finishCompetition(s,submitted));
assert.equal(fishingReadyAt(s),submitted+DAY);
assert(!enterCompetition(s,LIGHT+1));
assert(!enterCompetition(s,DAY+submitted)); // collect prize first
claim(s);
assert(!enterCompetition(s,DAY+submitted-1));
// Save/reload and travelling leave the absolute game-clock wait unchanged.
const reload=JSON.parse(JSON.stringify(s)); reload.room='marasen';
assert.equal(fishingReadyAt(reload),submitted+DAY);
assert(!enterCompetition(reload,DAY+submitted-1));
assert(enterCompetition(reload,DAY+submitted,()=>.4));
assert.equal(reload.sideAdventures.fishing.contest.day,1);

const late=fresh();assert(enterCompetition(late,1));
const lateBattle=nextFishingEncounter(late,null,100);
assert(recordFishingCatch(late,keeper,lateBattle,100));
assert(finishCompetition(late,3*DAY+100)); // returning days later retains keeper
claim(late);assert.equal(fishingReadyAt(late),4*DAY+100);
assert(!canEnterCompetition(late,4*DAY+99));
assert(canEnterCompetition(late,4*DAY+100));

const empty=fresh();assert(enterCompetition(empty,1));
assert(!fishingCanSubmit(empty.sideAdventures.fishing.contest,LIGHT-1));
assert(!finishCompetition(empty,LIGHT-1));
assert.equal(nextFishingEncounter(empty,null,LIGHT),null);
assert(finishCompetition(empty,LIGHT)); // no keeper resolves after deadline
claim(empty);
assert(!enterCompetition(empty,LIGHT+DAY)); // cooldown ends at night; wait for day
assert(enterCompetition(empty,2*DAY));

const legacy=fresh();assert(enterCompetition(legacy,1));
const c=legacy.sideAdventures.fishing.contest;
c.entry={uid:'old',score:100};
assert(finishCompetition(legacy,100)); // old unsubmitted keeper works immediately
claim(legacy);
delete c.submittedAt;
assert.equal(fishingReadyAt(legacy),LIGHT+DAY); // safe fallback for older results
assert(!enterCompetition(legacy,LIGHT+DAY));
assert(enterCompetition(legacy,2*DAY));
console.log('Quickbite odds and fishing submission/cooldown regressions passed',chances.map(p=>(100*p).toFixed(1)+'%'));
