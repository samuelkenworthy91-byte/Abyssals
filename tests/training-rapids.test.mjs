import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {activeDraughts,buyTrainingDraught,trainingGrowthBonus,advanceTrainingEffects} from '../dist/training-draughts.js';
import {growthTonic,beginRapids,finishRapids,speedRaceScore,exchangeScrolls} from '../dist/marasen-activities-ui.js';
import {levelTonicQuote,queueLevelTonics} from '../dist/training-tonics.js';
import {EXCHANGE_STATUS_MOVES,installExchangeTechniques} from '../dist/exchange-techniques.js';
import {canLearnScroll} from '../dist/side-adventures.js';
import {instance,applyMove} from '../dist/engine.js';
const unit=(uid='learner',level=20)=>({uid,level,hp:100,exp:37,moves:[],species:{id:'test',name:'Test',types:['WATER'],ability_names:{primary:'None'}},stats:{speed:250}});
let u=unit(),s={cybressa:{trialMarks:100000},money:1000000,party:[u],reserve:[]};
for(let n=0;n<10;n++)assert(buyTrainingDraught(s,u,'speed',5));
assert.equal(activeDraughts(u).length,10);assert.equal(trainingGrowthBonus(u,'speed'),200);
const marks=s.cybressa.trialMarks;assert(!buyTrainingDraught(s,u,'hp',1));assert.equal(s.cybressa.trialMarks,marks);
advanceTrainingEffects(u);assert.equal(activeDraughts(u).length,10);assert(activeDraughts(u).every(e=>e.remaining===4));
for(let n=0;n<4;n++)advanceTrainingEffects(u);assert.equal(activeDraughts(u).length,0);
u.marasenTonicDoses=5;
for(let n=0;n<5;n++)assert(growthTonic(s,u.uid,'focused','speed'));
assert.equal(u.marasenTonicDoses,10);assert.equal(u.marasenGrowth.speed,25);
const purse=s.money;assert(!growthTonic(s,u.uid,'balanced'));assert.equal(s.money,purse);
s.trainingTonics=15;u.level=195;
assert.equal(levelTonicQuote(s,u).maximum,5);
for(const count of [0,-1,1.5,6,NaN])assert(!queueLevelTonics(s,u.uid,count));
assert(queueLevelTonics(s,u.uid,5));assert.equal(s.trainingTonics,10);assert.equal(u.exp,37);
assert.deepEqual(s.rewardQueue,[{kind:'tonic-grow',uid:u.uid,remaining:5}]);
assert(!queueLevelTonics(s,u.uid,1));
assert.equal(JSON.parse(JSON.stringify(s)).rewardQueue[0].remaining,5);

const stock=exchangeScrolls(),stockIds=new Set(stock.map(x=>+x.id));assert(stock.length>100);
for(const m of EXCHANGE_STATUS_MOVES){
 assert(stockIds.has(m.id));assert(DATA.moves.some(x=>x.id===m.id));
 const compatible=unit();compatible.species.types=[m.tutorTypes[0]];assert(canLearnScroll(compatible,m.id));
 compatible.dead=true;assert(!canLearnScroll(compatible,m.id));
 const actor=instance(DATA.species[0],20,[m]),foe=instance(DATA.species[0],20,[]);
 // A plain neutral target isolates the move's supported status effect.
 foe.species={...foe.species,types:['NORMAL'],ability_names:{primary:'None'},abilities:{}};
 actor.species={...actor.species,ability_names:{primary:'None'},abilities:{}};
 applyMove(actor,foe,{...m,left:m.pp},()=>.1);assert.equal(foe.status,m.effects[0].status,m.name);
}
const count=DATA.moves.length;installExchangeTechniques(DATA);assert.equal(DATA.moves.length,count);
for(const m of DATA.moves.filter(m=>m.signature_owner_family||m.signature_owner_name))assert(!stockIds.has(m.id));

assert.equal(speedRaceScore(100,100,0),.9);assert.equal(speedRaceScore(100,100,1),1);
assert(speedRaceScore(100,100,0)>speedRaceScore(80,100,1));
s={money:10000,party:[unit('swimmer')],reserve:[]};
assert(!beginRapids(s,{mode:'invalid'}));
assert(beginRapids(s,{unitId:'swimmer',mode:'speed',stake:500,betLane:0,betPlace:1,random:()=>.5}));
assert.equal(s.money,9500);const saved=JSON.parse(JSON.stringify(s));
const a=finishRapids(s),b=finishRapids(saved,{perfect:999,good:999});assert.deepEqual(a,b);
assert.equal(a.mode,'speed');assert.equal(a.results[0].name,'Test');assert.equal(a.payout,1000);
const settled=s.money;assert.equal(finishRapids(s),null);assert.equal(s.money,settled);
assert(beginRapids(s,{unitId:'swimmer',mode:'rhythm',event:'sprint',random:()=>.5}));assert(finishRapids(s,{perfect:100}));
console.log('PASS: ten boosts/doses, bulk-tonic validation and persistence, expanded compatible status lessons and real status effects, 90/10 Speed races, saved luck and single settlement');
