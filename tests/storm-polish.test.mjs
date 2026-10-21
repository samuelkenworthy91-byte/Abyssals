import assert from 'node:assert/strict';
import {stormState,beginRelayRound,relayReward,settleRelaySignal,relaySignal,claimRelay} from '../dist/thunderplain-rules.js';
import {lightningPaths} from '../dist/storm-weather.js';
import {relayPhase,RELAY_TIMING} from '../dist/storm-relay.js';
import {GLASS_CRATERS,MOUNTAIN_FLIGHTS,MOUNTAIN_ENTRY,glassCraterBlocked} from '../dist/storm-props.js';
import {NEW_MAPS,newBlocked,newRoad} from '../dist/expansion-world.js';
const old={money:9000,heartyFood:8,trainingTonics:2,humanLives:{'CHR-PATE':{lifeState:'DEAD'}},thunderplain:{relay:{caught:5,attempt:12,claimed:true},darius:{outcome:'captured',notes:[]}}};
assert.equal(stormState(old).relay.clears,1);assert(!claimRelay(old));assert(!relayReward(old).text.includes('2,400'));assert(beginRelayRound(old));assert(!beginRelayRound(old));assert.equal(old.money,9000);
let s=JSON.parse(JSON.stringify(old));const rewards=[];
for(let run=0;run<9;run++){const reward=relayReward(s);rewards.push(reward.name);for(let i=0;i<5;i++){const q=stormState(s).relay;assert(!settleRelaySignal(s,relaySignal(q),false));assert(settleRelaySignal(s,relaySignal(q),true));s=JSON.parse(JSON.stringify(s));}assert(claimRelay(s));assert(!claimRelay(s));assert.equal(s.thunderplain.relay.clears,run+2);if(run<8)assert(beginRelayRound(s));}
assert.equal(new Set(rewards).size,4);assert.equal(s.humanLives['CHR-PATE'].lifeState,'DEAD');assert.equal(s.thunderplain.darius.outcome,'captured');
assert.equal(relayPhase(0),'study');assert.equal(relayPhase(RELAY_TIMING.watch-1),'study');assert.equal(relayPhase(RELAY_TIMING.watch),'catch');assert.equal(relayPhase(RELAY_TIMING.watch+RELAY_TIMING.catch),'done');
const paths=lightningPaths(12345,430,932);assert.deepEqual(paths,lightningPaths(12345,430,932));assert.notDeepEqual(paths,lightningPaths(54321,430,932));assert(paths.length>=8);assert(paths.slice(1).every(p=>p.width<paths[0].width));for(const p of paths.slice(1))assert(paths.some(other=>other!==p&&other.points.includes(p.points[0])),'fork attached to parent junction');
for(const c of GLASS_CRATERS){const x=Math.floor(c.x+c.w/2),y=Math.floor(c.y+c.h/2);assert(glassCraterBlocked(x,y));assert(newBlocked('stormGlass',x,y));}
for(let y=2;y<30;y++)for(let x=2;x<46;x++)if(newRoad('stormGlass',x,y))assert(!glassCraterBlocked(x,y),'pale road clear '+x+','+y);
for(const p of MOUNTAIN_FLIGHTS)assert.equal(p.w/p.h,.5);assert(MOUNTAIN_ENTRY.x+MOUNTAIN_ENTRY.w/2===24.5);
const gate=NEW_MAPS.stormWatch.gates.find(g=>g.id==='bt-darius-entry');assert(!newBlocked(gate.to,...gate.arrival));
console.log('PASS: old claimed-cache migration, nine repeat shifts with four rewards/no duplicates, story and unique outcomes preserved, timing phases, deterministic attached lightning forks and all glass craters clear of the main road');
