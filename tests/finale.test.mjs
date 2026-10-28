import {startingMoveIds} from '../dist/moveset-identity.js';
import {migrateMemorialMoves} from '../dist/finale-rules.js';
import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {instance} from '../dist/engine.js';
import {initializeProgress,unitGrowthRates,STAT_KEYS} from '../dist/progression.js';
import {FINALE_TRAINERS,BURIAL_LINES,SUN_ROAD,SPORE_ROAD,finaleRoute} from '../dist/finale-data.js';
import {finaleState,finaleUnlocked,finishBurialLine,grantMemorialPartners,acceptPeachQuest,readPeachClue,turnOathRune,turnBridgeWeight,canMeetFinalUnique,settleFinalUnique,settleFinalLeader,settleDariusFinale,createCommission,canFightFinale} from '../dist/finale-rules.js';
import {legalMoves} from '../dist/route-roster.js';
import {NEW_MAPS,NEW_DOORS,newBlocked,newSpots} from '../dist/expansion-world.js';
const create=(id,level,uid)=>initializeProgress({...instance(DATA.species.find(s=>s.id===id),level,[]),uid});
let s={party:[create('004',85,'original')],reserve:[],dead:[],money:0,defeatedTrainers:[],fates:{'LDR-06':'EXECUTED'},botrune:{walterCalmed:true},humanLives:{'CHR-PATE':{lifeState:'DEAD'},'CHR-TRADE':{lifeState:'DEAD'}}};
assert(finaleUnlocked(s));assert(!finaleUnlocked({fates:{'LDR-06':'SPARED'}}));assert(!grantMemorialPartners(s,create));
for(let i=0;i<BURIAL_LINES.length;i++){assert(!finishBurialLine(s,i+1));assert(finishBurialLine(s,i));assert(!finishBurialLine(s,i));s=JSON.parse(JSON.stringify(s));}
assert(finaleState(s).buried);assert.equal(s.storyHistory.length,1);assert(grantMemorialPartners(s,create,()=>0));const receipt=JSON.stringify(s.finale.legacies);assert(!grantMemorialPartners(s,()=>{throw Error('duplicate legacy');}));assert.equal(s.party.length,3);assert.notEqual(s.party[1].species.id,s.party[2].species.id);
for(const u of s.party.slice(1)){assert.equal(u.level,80);assert.equal(u.lives,1);const base=unitGrowthRates({...u,memorialLegacy:undefined});for(const k of STAT_KEYS)assert.equal(unitGrowthRates(u)[k]-base[k],15);}
assert.equal(JSON.stringify(s.finale.legacies),receipt);assert.equal(s.humanLives['CHR-PATE'].lifeState,'DEAD');assert.equal(s.humanLives['CHR-TRADE'].lifeState,'DEAD');
const full=JSON.parse(JSON.stringify(s));full.party=Array.from({length:6},(_,i)=>create('004',80,'full-'+i));full.finale.legacies=null;assert(grantMemorialPartners(full,create,()=>.999));assert.equal(full.reserve.length,2);
for(const key of ['guan','fei']){assert(acceptPeachQuest(s,key));assert(!acceptPeachQuest(s,key));assert(!canMeetFinalUnique(s,key));assert(readPeachClue(s,key));}
for(const rune of ['faith','shelter','crossing'])assert(turnOathRune(s,rune));assert(!s.finale.quests.guan.solved);for(const rune of ['shelter','faith','crossing'])assert(turnOathRune(s,rune));
for(const [i,n]of [[0,1],[1,3],[2,2]])for(let j=0;j<n;j++)assert(turnBridgeWeight(s,i));assert(s.finale.quests.fei.solved);
s.defeatedTrainers.push('TRN-FN-GUAN','TRN-FN-FEI');
for(const key of ['guan','fei']){assert(canMeetFinalUnique(s,key));const reload=JSON.parse(JSON.stringify(s));assert(canMeetFinalUnique(reload,key));assert(settleFinalUnique(s,key,'captured'));assert(!settleFinalUnique(s,key,'defeated'));assert(!canMeetFinalUnique(s,key));}
assert(!canFightFinale(s,'LDR-08'));assert(settleDariusFinale(s));assert(!settleDariusFinale(s));assert(canFightFinale(s,'LDR-08'));assert(canMeetFinalUnique(s,'crux'));s.dead.push(create('174',102,'lost-sovereign'));assert(!canMeetFinalUnique(s,'crux'));
for(const id of ['LDR-07','LDR-08'])for(const fate of ['SPARED','EXECUTED']){const q=JSON.parse(JSON.stringify(s));q.pendingFate={id};assert(settleFinalLeader(q,id,fate));assert(!settleFinalLeader(q,id,fate));assert(q.finale[id==='LDR-07'?'mirrorLead':'gateRevealed']);assert.equal(q.fates[id],fate);}
let n=s.finale.commissions.length;const work=createCommission(s,s.party[0].uid,{palette:'river',shape:'open',tool:'wash'});assert.equal(work.score,3);assert.equal(s.finale.commissions.length,n+1);assert.equal(s.money,800+(work.partnerAffinity?100:0));assert(!createCommission(s,'absent',{palette:'river',shape:'open',tool:'wash'}));
for(const t of FINALE_TRAINERS)for(const slot of t.team){assert.equal(t.team.length,t.id.startsWith('LDR-')||t.finaleDouble?6:slot&&t.team.length);const legal=legalMoves(slot.species_id,slot.level);for(const m of slot.current_form_legal_move_ids)assert(legal.includes(m));}
assert.equal(FINALE_TRAINERS.find(t=>t.id==='LDR-08').team.at(-1).species_id,'071');assert.equal(FINALE_TRAINERS.find(t=>t.id==='LDR-08').team.at(-1).level,105);
for(const r of [...SUN_ROAD,...SPORE_ROAD,['sporeGrotto'],['sporeCanopy']])for(const table of finaleRoute(r[0]).tables){assert.equal(table.slots.length,6);assert.equal(table.slots.reduce((n,v)=>n+v.weight,0),100);}
assert(['sporeRim','sporeDepths','sporeBridge','sporeGrotto','sporeCanopy'].every(room=>NEW_MAPS[room]?.finaleArt?.startsWith('spore-')));
assert(NEW_MAPS.sporeDepths.gates.some(g=>g.to==='sporeGrotto'));
assert(NEW_MAPS.sporeBridge.gates.some(g=>g.to==='sporeCanopy'));
assert(['cayfen','ramelle'].every(room=>NEW_MAPS[room].spots.filter(p=>p.id.startsWith('fn-')).length>=4));
const flood=(room,start)=>{const q=[start],seen=new Set();for(let i=0;i<q.length;i++){const [x,y]=q[i],k=x+','+y;if(seen.has(k)||newBlocked(room,x,y))continue;seen.add(k);q.push([x-1,y],[x+1,y],[x,y-1],[x,y+1]);}return seen;};
for(const [room,m]of Object.entries(NEW_MAPS).filter(([,m])=>m.finale)){
 const seen=flood(room,m.finaleInterior||room==='afterlifeThreshold'?[24,24]:[3,m.road[0][1]]);assert(seen.size>30,room);
 for(const g of m.gates){assert(seen.has(g.x+','+g.y),room+' gate '+g.id);assert(!newBlocked(g.to,...g.arrival.slice(0,2)),g.id+' safe arrival');}
 for(const p of newSpots(room))assert([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((p.x+dx)+','+(p.y+dy))),room+' interact '+p.id);
}
for(const [id,d]of Object.entries(NEW_DOORS).filter(([,d])=>['cayfen','ramelle'].includes(d.room)))assert(!newBlocked(d.room,d.x,d.y),id+' visible door');
console.log('PASS: full finale navigation, saved burial and personal legacies, two distinct guardian puzzles/unique deaths, eight-leader outcomes and gate access, gallery commissions and Lv105 Fairy/Dragon ace');

for(const key of ['gehennuar','suncub']){const z={party:[],reserve:[],dead:[],fates:{}};assert(!canMeetFinalUnique(z,key));z.fates['LDR-07']='SPARED';z.finale.rareRecords=[key];assert(canMeetFinalUnique(z,key));assert(settleFinalUnique(z,key,'captured'));assert(!canMeetFinalUnique(z,key));}

for(const u of s.party.filter(u=>u.memorialLegacy)){assert.equal(u.moves.length,4);assert(u.moves.some(m=>m.power>=80));const old=structuredClone(u);delete old.memorialLegacy.movesVersion;old.moves=startingMoveIds(DATA,old.species,1).map(id=>({...DATA.moves.find(m=>m.id===id),left:1}));const state={party:[old],reserve:[]};assert(migrateMemorialMoves(state));assert.deepEqual(old.moves.map(m=>m.id),startingMoveIds(DATA,old.species,80));assert(!migrateMemorialMoves(state));const trained=structuredClone(u);delete trained.memorialLegacy.movesVersion;trained.moves=[{id:999,left:1}];assert(migrateMemorialMoves({party:[trained]}));assert.deepEqual(trained.moves,[{id:999,left:1}]);}
console.log('PASS: memorial partners join with four level-80 moves; legacy migration preserves customized moves and is idempotent.');
