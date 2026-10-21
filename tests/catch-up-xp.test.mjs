import assert from 'node:assert/strict';
import {expAward,rewardsFor,growLevel,STAT_KEYS} from '../dist/progression.js';
import {defeatExpMultiplier} from '../dist/rimebun.js';

const makeUnit=(uid,level=1,extra={})=>({uid,level,exp:0,hp:100,maxHp:100,stats:Object.fromEntries(STAT_KEYS.map(k=>[k,k==='hp'?100:10])),species:{id:'test',growth_percent:Object.fromEntries(STAT_KEYS.map(k=>[k,50])),ability_names:{primary:'None'}},...extra});
const rivet=makeUnit('rivet',30,{species:{id:'365',ability_names:{primary:'Warbond'}}});
const defeat=(level,participants=['learner'],expMultiplier=1)=>({level,participants,expMultiplier});
const amount=(rows,uid)=>rows.find(r=>r.uid===uid)?.amount??0;

// Approved examples: one ordinary enemy, level-1 recipient, Warbond.
for(const [enemy,expected] of [[10,287],[25,628],[50,1280],[100,2897],[150,4930],[200,7380]]){
 assert.equal(expAward(enemy,1,1,2),expected);
}
assert.equal(expAward(150,1),2465);
assert.equal(expAward(10,10,1,2),100);
assert.equal(expAward(150,1,6,2),29581); // Round once after yield and Warbond.
assert.equal(defeatExpMultiplier({species:{id:'364'}}),6);
for(const own of [1,49,50,99,100,150]){
 const bonus=own<50?2:own<100?1.25:1;
 for(let gap=0;gap<=200-own;gap++)assert.equal(expAward(own+gap,own,1,2),Math.round((25+5*gap+gap*gap/48)*bonus*2));
 for(let gap=-15;gap<0;gap++){
  const previous=gap<=-10?0:Math.max(1,Math.round(25*bonus*((10+gap)/10)**3));
  assert.equal(expAward(own+gap,own,6,2),previous*12);
 }
}
assert(expAward(200,1)>expAward(150,1));
const learner=makeUnit('learner');
let rewards=rewardsFor([defeat(150,['learner','rivet'])],[learner,rivet]);
assert.equal(amount(rewards,'learner'),4930);
assert.equal(rewards.find(r=>r.uid==='learner').ability,'Warbond');
const observer=makeUnit('observer',60),dead=makeUnit('dead',1,{dead:true}),fainted=makeUnit('fainted',1,{hp:0}),capped=makeUnit('capped',200);
const party=[learner,rivet,observer,dead,fainted,capped];
rewards=rewardsFor([defeat(150,['rivet'])],party,{shareAll:true});
assert.equal(amount(rewards,'learner'),4930);
assert.equal(amount(rewards,'observer'),expAward(150,60,1,2));
assert.notEqual(amount(rewards,'observer'),4930);
for(const uid of ['dead','fainted','capped','reserve'])assert.equal(amount(rewards,uid),0);
assert.equal(amount(rewardsFor([defeat(150,['rivet'])],party),'learner'),0);
assert.equal(amount(rewardsFor([defeat(150)],party,{shareAll:true,warbond:false}),'learner'),2465);
assert.equal(amount(rewardsFor([defeat(150)], [learner,rivet,{...rivet,uid:'rivet2'}],{shareAll:true}),'learner'),4930);
assert.equal(amount(rewardsFor([defeat(150),defeat(150)],party,{shareAll:true}),'learner'),9860);

// Real growth loop consumes every earned level, preserving remainder and Lv.200 cap.
learner.exp=4930;
let levels=0;
while(growLevel(learner))levels++;
assert.equal(levels,49);assert.equal(learner.level,50);assert.equal(learner.exp,30);
learner.exp+=100000;
while(growLevel(learner)){}
assert.equal(learner.level,200);assert(learner.exp>0);assert.equal(growLevel(learner),null);
console.log('PASS: approved uncapped curve, rounding, weaker opponents, Warbond, Binoculars, eligibility, yields, multiple enemies, level overflow and level-200 limit');
