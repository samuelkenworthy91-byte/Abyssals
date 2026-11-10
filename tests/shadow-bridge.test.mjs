import assert from 'node:assert/strict';
import {NEW_MAPS,newBlocked} from '../dist/expansion-world.js';
import {bellPathBlocked} from '../dist/relic-quest.js?v=0.90.62';
import {SHADOW_ROOM,SHADOW_SIGN,SHADOW_END,SHADOW_ENTRY,shadowBridgeBlocked,pushShadowPillar,resetShadowBridge,finishShadowBridge,shadowBridgeObjective} from '../dist/shadow-bridge.js?v=0.90.62';

const adjacent=[[1,0],[-1,0],[0,1],[0,-1]];
function reachable(start,blocked){
 const pending=[start],seen=new Set();
 for(const [x,y] of pending){
  const key=x+','+y;
  if(seen.has(key)||blocked(x,y))continue;
  seen.add(key);
  for(const [dx,dy] of adjacent)pending.push([x+dx,y+dy]);
 }
 return (x,y)=>seen.has(x+','+y);
}
const parent='relicGrove2';
const entry=NEW_MAPS[parent].gates.find(gate=>gate.to===SHADOW_ROOM);
const back=NEW_MAPS[SHADOW_ROOM].gates.find(gate=>gate.to===parent);
assert.deepEqual(entry.arrival.slice(0,2),SHADOW_ENTRY);
const forest=reachable([3,17],(x,y)=>newBlocked(parent,x,y)||bellPathBlocked({},parent,x,y));
assert(forest(entry.x,entry.y));
assert(forest(...back.arrival));

let state={money:42,party:[{hp:25}],relicQuest:{gateSolved:true}};
const shore=()=>reachable(SHADOW_ENTRY,(x,y)=>newBlocked(SHADOW_ROOM,x,y)||shadowBridgeBlocked(state,SHADOW_ROOM,x,y));
assert(shore()(5,16),'the near-bank tablet is readable on an old save');
assert(!shore()(16,15),'unlit gap cannot be bypassed');
assert(!pushShadowPillar(state,0,1,0),'pillars stay on their rails');
assert.equal(shadowBridgeObjective(state,SHADOW_ROOM).spot,SHADOW_SIGN);
assert(pushShadowPillar(state,0,0,-1));
assert(pushShadowPillar(state,0,0,-1));
assert(!pushShadowPillar(state,0,0,-1),'pillars stop at the rail end');
assert(shore()(16,15),'the first span opens');
assert(!shore()(28,19),'the second span remains shut');
state=JSON.parse(JSON.stringify(state));
assert(shore()(16,15),'a save keeps the cast shadow');
assert(pushShadowPillar(state,1,0,1));
assert(pushShadowPillar(state,1,0,1));
assert(shore()(35,17),'the far-bank inscription is now reachable');
assert.equal(shadowBridgeObjective(state,SHADOW_ROOM).spot,SHADOW_END);
const returnPath=reachable([35,17],(x,y)=>newBlocked(SHADOW_ROOM,x,y)||shadowBridgeBlocked(state,SHADOW_ROOM,x,y));
assert(returnPath(back.x,back.y),'a completed crossing has a return path');
finishShadowBridge(state);
resetShadowBridge(state);
assert.deepEqual(state.shadowBridge,{pillars:[17,17],complete:true});
assert.deepEqual([state.money,state.party,state.relicQuest],[42,[{hp:25}],{gateSolved:true}]);
console.log('PASS: optional branch, old saves, push limits, both shadow spans, return path, and safe reset.');
