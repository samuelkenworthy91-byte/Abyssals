import {FINALE_TRAINERS} from '../dist/finale-data.js';
import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {EXPANSION} from '../dist/expansion-data.js';
import {BOTRUNE_TRAINERS} from '../dist/botrune-data.js';
import {settleLeaderRewards,EXECUTION_BOUNTIES,NURSERY_SHINY_CHANCE} from '../dist/leader-outcomes.js';
import {unitGrowthRates,STAT_KEYS} from '../dist/progression.js';
const leaders=[...EXPANSION.trainers,...BOTRUNE_TRAINERS,...FINALE_TRAINERS].filter(t=>EXECUTION_BOUNTIES[t.id]);
const unique=[...new Map(leaders.map(t=>[t.id,t])).values()];assert.equal(unique.length,8);
const create=(id,level)=>({uid:'gift-'+id,level,species:DATA.species.find(s=>s.id===id),hp:10,maxHp:10,stats:{},growthSeed:123,shiny:true});
for(const leader of unique){
 let s={money:0,fates:{[leader.id]:'EXECUTED'},party:[],reserve:[],dead:[]};
 assert(settleLeaderRewards(s,leader,create));const u=s.party[0];assert.equal(u.level,1);assert.equal(u.lives,1);
 assert.equal(u.shiny,u.nurseryLegacy.shinyRoll<NURSERY_SHINY_CHANCE,'new gift overrides normal shiny roll');
 for(const species of [u.species,DATA.species.find(s=>s.id===leader.team.at(-1).species_id)]){
  u.species=species;const boosted=unitGrowthRates(u),normal=unitGrowthRates({...u,nurseryLegacy:undefined});
  for(const key of STAT_KEYS)assert.equal(boosted[key]-normal[key],15,key+' retains bonus after evolution');
 }
 s=JSON.parse(JSON.stringify(s));const before=JSON.stringify(s);assert(!settleLeaderRewards(s,leader,()=>{throw Error('duplicate gift');}));assert.equal(JSON.stringify(s),before);
 const old=s.party.pop();delete old.nurseryLegacy;old.dead=true;old.hp=0;old.shiny=true;s.dead.push(old);
 assert(settleLeaderRewards(s,leader,create));assert(old.shiny,'migration preserves prior shinies');assert.equal(old.hp,0);assert(old.dead);assert.equal(s.party.length,0);assert.equal(s.money,EXECUTION_BOUNTIES[leader.id]);assert(!settleLeaderRewards(s,leader,create));
 s.dead=[];assert(!settleLeaderRewards(s,leader,()=>{throw Error('released gift replaced');}));
 s.fates[leader.id]='SPARED';assert(!settleLeaderRewards(s,leader,create));
}
// A fixed population checks the 1/4 threshold without a flaky random test.
let shinies=0;const leader=unique[0];for(let i=0;i<10000;i++){
 const s={fates:{[leader.id]:'EXECUTED'},party:[],reserve:[]};settleLeaderRewards(s,leader,(id,level)=>({...create(id,level),uid:'leader-legacy:'+leader.id,shiny:false}),{random:()=>i/10000});if(s.party[0].shiny)shinies++;
}
assert.equal(shinies,2500);console.log('PASS: eight execution gifts, +15 every growth across evolution, fixed 25% shiny rolls, reload idempotence, old/dead/released gift migration');
