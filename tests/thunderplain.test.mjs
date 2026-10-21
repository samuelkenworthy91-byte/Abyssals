import assert from 'node:assert/strict';
import {NEW_MAPS,NEW_DOORS,newBlocked,newSpots} from '../dist/expansion-world.js';
import {BOTRUNE_BUILDINGS} from '../dist/thunderplain-world.js';
import {STORM_SIDE_ROOMS,STORM_TRAINERS,DARIUS_STORM_ID} from '../dist/thunderplain-data.js';
import {stormState,acceptStormDarius,recordStormVictory,releaseStormDragon,canMeetStormDragon,stormDragonEncounter,settleStormDragon,relaySignal,settleRelaySignal,claimRelay,stormMedicineAllowed,stormBound} from '../dist/thunderplain-rules.js';
import {STORM_FLASH_SCHEDULE,STORM_FLASH_CYCLE,stormFlash,drawStormScreen} from '../dist/storm-weather.js';
import {DATA} from '../dist/data.js';
import {legalMoves} from '../dist/route-roster.js';
const flood=(r,start)=>{const seen=new Set(),q=[start];for(let i=0;i<q.length;i++){const [x,y]=q[i],k=x+','+y;if(seen.has(k)||newBlocked(r,x,y))continue;seen.add(k);q.push([x-1,y],[x+1,y],[x,y-1],[x,y+1]);}return seen;};
for(const r of [...STORM_SIDE_ROOMS,'botruneLower']){const seen=flood(r,r==='botruneLower'?[24,4]:[3,17]);for(const g of NEW_MAPS[r].gates){assert(seen.has(g.x+','+g.y),r+' gate '+g.id);assert(!newBlocked(g.to,...g.arrival),g.id+' safe arrival');}for(const p of newSpots(r))assert([[1,0],[-1,0],[0,1],[0,-1]].some(([x,y])=>seen.has((p.x+x)+','+(p.y+y))),r+' interact '+p.id);}
for(const b of BOTRUNE_BUILDINGS){assert.equal(NEW_DOORS[b.id].room,'botruneLower');assert(!newBlocked('botruneLower',...b.door));assert(newBlocked('botruneLower',b.x+2,b.y+2));}
assert.equal(NEW_MAPS.stormWatch.gates.find(g=>g.id==='stormWatch-forward').action,'storm-cart');
assert(NEW_MAPS.stormWatch.gates.find(g=>g.id==='bt-darius-entry').y<5);
for(const t of STORM_TRAINERS)for(const s of t.team){const legal=legalMoves(s.species_id,s.level);for(const id of s.battle_move_ids||[])assert(legal.includes(id));}
const d=STORM_TRAINERS.find(t=>t.id===DARIUS_STORM_ID);assert.equal(d.team.length,6);assert.equal(d.team.at(-1).species_id,'173');assert.equal(d.bagUses,3);assert(!stormMedicineAllowed({trainer:d},{species:{id:'020'}}));assert(stormMedicineAllowed({trainer:d},{species:{id:'173'}}));assert(stormBound({trainer:d},{species:{id:'173'}}));
let s={money:0,party:[],reserve:[],dead:[],defeatedTrainers:[],humanLives:{'CHR-PATE':{lifeState:'DEAD'}}};assert(!canMeetStormDragon(s));assert(acceptStormDarius(s));assert(!acceptStormDarius(s));assert(!releaseStormDragon(s));
const enemy={species:DATA.species.find(s=>s.id==='173'),hp:1,maxHp:500,moves:[{pp:10,left:1}],uid:'trainer',dead:false};recordStormVictory(s,d,enemy);assert.equal(stormState(s).darius.specimen.hp,500);assert.equal(enemy.hp,1);s.defeatedTrainers.push(d.id);assert(releaseStormDragon(s));s=JSON.parse(JSON.stringify(s));assert(canMeetStormDragon(s));assert.equal(stormDragonEncounter(s).stormId,'tianzhar');
for(const outcome of ['captured','defeated']){let q=structuredClone(s);assert(settleStormDragon(q,outcome));q=JSON.parse(JSON.stringify(q));assert(!canMeetStormDragon(q));assert(!settleStormDragon(q,outcome));assert.equal(q.humanLives['CHR-PATE'].lifeState,'DEAD');}
const owned=structuredClone(s);owned.dead.push({species:{id:'173'}});assert(!canMeetStormDragon(owned),'dead unique never recreated');
for(let n=0;n<5;n++){const q=stormState(s).relay;assert(!settleRelaySignal(s,(relaySignal(q)+1)%3,true));assert(settleRelaySignal(s,relaySignal(q),true));s=JSON.parse(JSON.stringify(s));}assert(claimRelay(s));assert(!claimRelay(s));assert.equal(s.money,2400);assert.equal(s.trainingTonics,1);
let previous=0;for(const e of STORM_FLASH_SCHEDULE){assert(e.at-previous<=25000&&e.at-previous>=2000);assert(stormFlash(e.at+100).alpha>.35);previous=e.at;}assert.equal(previous,STORM_FLASH_CYCLE);
const fills=[],c={save(){},restore(){},fillRect(...v){fills.push(v)},beginPath(){},moveTo(){},lineTo(){},stroke(){}};drawStormScreen(c,'stormDariusCrown',STORM_FLASH_SCHEDULE[0].at+100,false,430,932);assert.deepEqual(fills[0],[0,0,430,932]);drawStormScreen(c,'stormGlass',100,true,430,932);assert.equal(fills.length,1);
console.log('PASS: mountain/relay/town navigation and entrance collision, legal Darius team, finite medicine, separate unique wild outcome through saves, no resurrection, once-only minigame supplies and full-screen 2–25s lightning/reduced motion');
