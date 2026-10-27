import assert from 'node:assert/strict';
import {DATA}from '../dist/data.js';
import {ORCHARD_IDS as I,TIDE_ORCHARD_SPECIES,TIDE_ORCHARD_MOVES,ORCHARD_REACTIONS}from '../dist/tide-orchard-data.js';
import {ORCHARD_SCORES}from '../dist/tide-orchard-vfx.js';
import {effectHTML}from '../dist/effects.js';
import {instance,applyMove,cleanupRound}from '../dist/engine.js';
import {beginAbilities,leaveAbility,enterAbility,speedFactor,consumedBerry,inflictStatus}from '../dist/abilities.js';
import {moveUsable}from '../dist/move-rules.js';
import {eligibleEvolutions,promote}from '../dist/evolution.js';
import {expandEncounterRoute}from '../dist/roster-encounters.js';
import {TIDE_ORCHARD_HABITATS,tideOrchardRoute}from '../dist/tide-orchard-habitats.js';
import {JOURNAL_HABITATS}from '../dist/journal-habitats.js';
import {canLearnScroll}from '../dist/side-adventures.js';
const make=(id='515')=>{const s=structuredClone(DATA.species.find(s=>s.id===id)),u=instance(s,55,[]);u.uid=id+'-'+Math.random();u.hp=u.maxHp=2000;u.stats={hp:2000,attack:100,defence:100,sp_attack:100,sp_defence:100,speed:100};return u;};
const move=key=>({...DATA.moves.find(m=>m.id===(I[key]||key)),left:30});
const use=(a,b,k,random=()=>.5)=>applyMove(a,b,move(k),random,{floor:0});
const fixture=(id='517',other='001')=>{const a=make(id),b=make(other);beginAbilities(a,[b],[a],{});return [a,b];};
assert.equal(TIDE_ORCHARD_SPECIES.length,5);assert.equal(new Set(DATA.species.map(s=>s.id)).size,DATA.species.length);assert.equal(new Set(DATA.moves.map(m=>m.name)).size,DATA.moves.length);
for(const m of TIDE_ORCHARD_MOVES){assert(ORCHARD_SCORES[m.id]?.svg,m.name);assert(effectHTML(m).includes('data-orchard-art'),m.name);}
assert.equal(new Set(TIDE_ORCHARD_MOVES.map(m=>ORCHARD_SCORES[m.id].svg)).size,TIDE_ORCHARD_MOVES.length,'distinct artwork for every new move');
// Third special hit: three real Water attacks, no extra PP or chosen-action consumption.
{
 const[a,b]=fixture();const hp=b.hp;const m=move('waterPulse');b.moves=[m];const third=[];
 for(let n=0;n<3;n++)third.push(applyMove(b,a,m,()=>.5,{floor:0}));
 assert.equal(third[0].reactions.length,0);assert.equal(third[1].reactions.length,0);assert.equal(third[2].reactions.length,1);assert.equal(third[2].reactions[0].result.hitCount,3);assert(b.hp<hp);assert.equal(m.left,27);assert(!a.actedThisRound);
 assert.equal(a.moveState.stillwaterHits,0);leaveAbility(a,{switching:true});enterAbility(a,b,{party:[a],field:b.field});assert(!a.moveState.stillwaterHits);
}
// Multi-hit special strikes count separately, substitutes/physical hits do not.
{
 const[a,b]=fixture();const special={...move('waterPulse'),hits:{min:3,max:3}};const r=applyMove(b,a,special,()=>.5,{floor:0});assert.equal(r.reactions.length,1);
 a.moveState.stillwaterHits=0;a.moveState.decoy={hp:1000};applyMove(b,a,move('waterPulse'),()=>.5,{floor:0});assert.equal(a.moveState.stillwaterHits,0);
 delete a.moveState.decoy;applyMove(b,a,{...move('waterPulse'),category:'PHYSICAL'},()=>.5,{floor:0});assert.equal(a.moveState.stillwaterHits,0);
}
// No chain between two Stillwaters, no reply after lethal damage, nonlethal floor retained.
{
 const[a,b]=fixture('517','517');a.moveState.stillwaterHits=2;b.moveState.stillwaterHits=2;const r=use(b,a,'waterPulse');assert.equal(r.reactions.length,1);assert.equal(b.moveState.stillwaterHits,2);
 a.hp=1;a.moveState.stillwaterHits=2;assert.equal(use(b,a,'hydro').reactions.length,0);
 const[c,d]=fixture();c.moveState.stillwaterHits=2;d.hp=1;const q=applyMove(d,c,move('waterPulse'),()=>.5,{floor:1});assert.equal(d.hp,1,'supervised reply cannot kill');assert.equal(q.reactions[0].result.damage,0);
}
// Exactly 25% and 75%, one recovery roll per active turn, no once-battle limit.
{
 const[a,b]=fixture('519');a.heldItem='HELD_BERRY_HEARTH';consumedBerry(a,[a]);assert(!a.heldItem);cleanupRound(a,b,()=>.25);assert(!a.heldItem);cleanupRound(a,b,()=>.249);assert.equal(a.heldItem,'HELD_BERRY_HEARTH');
 consumedBerry(a,[a]);a.field.terrain='GRASSY';a.field.terrainTurns=1;cleanupRound(a,b,()=>.749);assert.equal(a.heldItem,'HELD_BERRY_HEARTH');assert.equal(a.field.terrain,null,'final terrain turn uses 75% before expiry');
 consumedBerry(a,[a]);cleanupRound(a,b,()=>.249);assert(a.heldItem,'repeat recovery in the same battle');
 a.heldItem='HELD_BERRY_HEARTH';let rolls=0;cleanupRound(a,b,()=>{rolls++;return .01});assert.equal(rolls,0,'occupied slot never rolls');
}
// Roots heal actual damage, respect Grass and effigies, survive user switch but clear on target switch.
{
 const[a,b]=fixture('519');a.hp=1000;use(a,b,'roots');const old=b.hp;cleanupRound(a,b,()=>.9);assert.equal(b.hp,old-250);assert.equal(a.hp,1250);
 b.hp=7;a.hp=1000;cleanupRound(a,b,()=>.9);assert.equal(a.hp,1007);
 const[c,d]=fixture('519','519');use(c,d,'roots');assert(!d.moveState.roots);
 const[e,f]=fixture('519');f.moveState.decoy={hp:50};assert(use(e,f,'roots').blocked);assert(!f.moveState.roots);delete f.moveState.decoy;use(e,f,'roots');leaveAbility(f,{switching:true});assert(!f.moveState.roots);
}
// Effigy-only relay does not transfer boosts or unrelated status/counters.
{
 const[a,b]=fixture('519'),next=make('515');beginAbilities(a,[b],[a,next],{});a.moves=[move('relay')];a.teamcraftTargetUid=next.uid;a.stages={attack:6,defence:3};a.moveState.decoy={hp:900,maxHp:900};const r=use(a,b,'relay');assert.equal(r.replacementUid,next.uid);assert.deepEqual(next.stages,{});assert.equal(next.moveState.decoy.hp,500);assert(next.moveState.relayFatigue>0);
}
// New disruption, berry, terrain and healing moves execute their advertised effects.
{
 const[a,b]=fixture('519');b.moves=[move('waterPulse'),move('nap')];use(a,b,'taunt');assert(!moveUsable(b,b.moves[1]));assert(moveUsable(b,b.moves[0]));
 for(let n=0;n<3;n++)cleanupRound(a,b,()=>.9);assert(moveUsable(b,b.moves[1]));
 use(b,a,'waterPulse');use(a,b,'encore');assert(!moveUsable(b,b.moves[1]));
 use(a,b,'safeguard');assert(!inflictStatus(a,'POISON',[],()=>.5));
 a.status='BURN';a.hp=10;use(a,b,'rest');assert.equal(a.hp,a.maxHp);assert.equal(a.status,'SLEEP');assert.equal(a.statusTurns,2);
 a.moves=[move('sleepTalk'),move('waterPulse')];const pp=a.moves[1].left;const talk=applyMove(a,b,a.moves[0],()=>.5,{floor:0});assert(talk.damage>0);assert.equal(a.moves[1].left,pp);
}
{
 const[a,b]=fixture('519');const s=speedFactor(a,b);use(a,b,'tailwind');assert.equal(speedFactor(a,b),s*2);use(a,b,'terrain');assert.equal(a.field.terrain,'GRASSY');assert(a.field.orchardCarpet);assert(canLearnScroll(a,I.roots));
 const[c,d]=fixture();use(c,d,'veil');const hit=use(d,c,'waterPulse');assert(hit.reactions.some(r=>r.move.id===793));assert(!use(d,c,'waterPulse').reactions.some(r=>r.move.id===793),'one veil reply');
}
// Paths keep existing level-up/evolution and inheritance machinery.
for(const id of ['515','516','518']){const u=make(id);u.evolutionBlockedLevel=0;const e=eligibleEvolutions(u)[0];assert(e,id);assert(promote(u,e));}
for(const h of TIDE_ORCHARD_HABITATS){assert(JOURNAL_HABITATS[h.id]?.some(r=>r.room===h.room),'live journal habitat '+h.id+' '+h.room);const r=tideOrchardRoute({room:h.room,tables:['DAY','NIGHT'].map(phase=>({phase,slots:[{species_id:'001',min_level:10,max_level:10,weight:100}]}))});assert.equal(tideOrchardRoute(r),r);for(const t of r.tables){assert(Math.abs(t.slots.reduce((n,s)=>n+s.weight,0)-100)<1e-8);assert(t.slots.some(s=>s.species_id===h.id));} }
console.log('PASS: Tide & Orchard species, branded moves, unique artwork, three-slash counters, floor safety, berry probabilities, final terrain tick, roots, relay and disruption.');
