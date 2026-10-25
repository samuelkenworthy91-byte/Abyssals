import assert from 'node:assert/strict';
import {POUCH_UPGRADES,eggCapacity,buyPouchUpgrade,nextPouchUpgrade,sellsPouchUpgrades} from '../dist/egg-pouch.js';
import {PROMENADE_ROOM,PROMENADE_ENDS,PROMENADE_SCALE,roomGrid,promenadeTap} from '../dist/promenade.js';
import {NEW_MAPS,newBlocked} from '../dist/expansion-world.js';
import {DATA} from '../dist/data.js';
import {pathfind} from '../dist/engine.js';
import {createBreedingEgg,advanceEggSteps,validateNurserySnapshot,hatchBreedingEgg} from '../dist/breeding.js';
import {makeSaveFile,parseSaveFile} from '../dist/save-transfer.js';
const species=DATA.species.find(s=>s.id==='001'),parent=uid=>({uid,species,hp:10,maxHp:10,stats:Object.fromEntries(['hp','attack','defence','sp_attack','sp_defence','speed'].map(s=>[s,10])),level:1,moves:[]});
const state={begun:true,playerName:'QA',money:1000000,party:[parent('a'),parent('b')],reserve:[],dead:[],fates:{'LDR-02':'SPARED'}};
const lay=()=>createBreedingEgg(state,'a','b',{random:()=>0,inheritancePlans:[{stat:'',moveId:null},{stat:'',moveId:null}]});
assert.equal(eggCapacity(state),3);for(let i=0;i<3;i++)assert(lay());let before=JSON.stringify(state);assert.equal(lay(),null);assert.equal(JSON.stringify(state),before);
assert.deepEqual(POUCH_UPGRADES.map(i=>i.price),[10000,20000,40000,80000,160000]);assert.deepEqual(POUCH_UPGRADES.map(i=>i.capacity),[4,5,6,8,10]);
assert(sellsPouchUpgrades('philomereShop'));assert(!sellsPouchUpgrades('shop'));assert(!sellsPouchUpgrades('dorelemShop'));assert(sellsPouchUpgrades('marasen'));
const originalEggs=JSON.stringify(state.nursery.eggs);
for(let tier=0;tier<5;tier++){assert.equal(nextPouchUpgrade(state),POUCH_UPGRADES[tier]);const funds=state.money;assert(buyPouchUpgrade(state,tier));assert.equal(state.money,funds-POUCH_UPGRADES[tier].price);before=JSON.stringify(state);assert(!buyPouchUpgrade(state,tier),'stale confirmation never buys another tier');assert.equal(JSON.stringify(state),before);assert.equal(eggCapacity(state),POUCH_UPGRADES[tier].capacity);}
assert.equal(JSON.stringify(state.nursery.eggs),originalEggs);assert.equal(nextPouchUpgrade(state),null);assert(!buyPouchUpgrade(state));
const poor={money:9999};assert(!buyPouchUpgrade(poor));assert.deepEqual(poor,{money:9999});
for(let i=3;i<10;i++)assert(lay());assert.equal(lay(),null);validateNurserySnapshot(state);
for(const tier of [-1,1.5,6,'5',null]){const bad=structuredClone(state);bad.nursery.pouchTier=tier;assert.throws(()=>validateNurserySnapshot(bad));}
const locked=structuredClone(state);delete locked.nursery.pouchTier;assert.throws(()=>validateNurserySnapshot(locked),'ten eggs require upgrades');
const back=NEW_MAPS[PROMENADE_ROOM].gates[0],entry=NEW_MAPS.philomere.gates.find(g=>g.to===PROMENADE_ROOM);assert(entry);assert(!newBlocked('philomere',entry.x,entry.y));assert(!newBlocked(PROMENADE_ROOM,...entry.arrival.slice(0,2)));assert(!newBlocked(back.to,...back.arrival.slice(0,2)));
const blocked=(x,y)=>newBlocked(PROMENADE_ROOM,x,y),path=pathfind(PROMENADE_ENDS[0],PROMENADE_ENDS[1],blocked,...roomGrid(PROMENADE_ROOM));assert.equal(path.length,360);assert.equal(pathfind(PROMENADE_ENDS[1],PROMENADE_ENDS[0],blocked,...roomGrid(PROMENADE_ROOM)).length,360);
for(let i=0;i<path.length;i++){const prev=i?path[i-1]:PROMENADE_ENDS[0];assert.equal(Math.abs(path[i][0]-prev[0])+Math.abs(path[i][1]-prev[1]),1);assert(!blocked(...path[i]));advanceEggSteps(state);}
assert(state.nursery.eggs.every(e=>e.remaining===152));
const snapshot={version:1,state,room:PROMENADE_ROOM,player:{x:396,y:144,facing:'left'}};const restored=parseSaveFile(makeSaveFile(snapshot)).snapshot;assert.equal(restored.player.x,396);assert.equal(eggCapacity(restored.state),10);assert.equal(restored.state.nursery.eggs.length,10);
for(let i=0;i<360;i++)advanceEggSteps(restored.state);assert(restored.state.nursery.eggs.every(e=>e.remaining===0));validateNurserySnapshot(restored.state);
const egg=restored.state.nursery.eggs[0];assert(hatchBreedingEgg(restored.state,egg.id,id=>({...parent('child'),species:DATA.species.find(s=>s.id===id)})));assert.equal(restored.state.nursery.eggs.length,9);assert.equal(eggCapacity(restored.state),10);
assert.deepEqual(promenadeTap(396,130),PROMENADE_ENDS[1]);assert.deepEqual(promenadeTap(36,160),PROMENADE_ENDS[0]);assert.deepEqual(promenadeTap(18,144),[18,144]);assert.equal(promenadeTap(396,20),null);assert.equal(PROMENADE_SCALE,9);
assert.throws(()=>makeSaveFile({...snapshot,room:'philomere'}),'extended coordinates only valid on bridge');
console.log('PASS: sequential 10/20/40/80/160k upgrades, ten-egg limit, stale/poor purchases, save validation and legacy defaults, 360 real steps each way, ten eggs progressed together, bridge save/import/hatch, safe town connection and phone tap targets');
