import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {BRANCH_EVOLUTIONS,BRANCH_ITEMS,branchEncounterRoute} from '../dist/branch-families.js';
import {BROAD_HELD_ITEMS,BERRIES} from '../dist/broad-held-data.js';
import {instance,applyMove,cleanupRound} from '../dist/engine.js';
import {rewardsFor} from '../dist/progression.js';
import {eligibleEvolutions,promoteUsingItem} from '../dist/evolution.js';
import {beginAbilities,activateHeldRecovery,heldInfo,heldStat,changeStage,enterAbility,leaveAbility} from '../dist/abilities.js';
import {moveUsable} from '../dist/move-rules.js';
import {canLearnScroll} from '../dist/side-adventures.js';
const s=id=>DATA.species.find(s=>s.id===id),u=(id='510',ability=null)=>{const a=instance(structuredClone(s(id)),40,[]);a.uid=id+Math.random();if(ability)a.species.ability_names={primary:ability};a.hp=a.maxHp=200;a.stats={hp:200,attack:70,defence:70,sp_attack:70,sp_defence:70,speed:70};return a;};
assert.equal(BRANCH_ITEMS.length,8);assert.equal(BERRIES.length,12);assert.equal(BROAD_HELD_ITEMS.length,26);assert.deepEqual(s('514').types,['FIGHTING','PSYCHIC']);assert(s('514').base_stats.sp_attack>s('514').base_stats.attack);
assert.equal(DATA.learnsets.filter(l=>l.species_id==='505').length,2);assert(!canLearnScroll(u('505'),700));
for(const p of BRANCH_EVOLUTIONS){const a=u(p.from_species_id),state={evolutionItems:{[p.condition.item_id]:2},evolutionRoom:'marasenExchange3'};a.evolutionBlockedLevel=39;
 if(a.species.id==='505'){assert.equal(eligibleEvolutions(a,state,p.condition.item_id).length,0);assert.equal(promoteUsingItem(a,p,state),null);assert.equal(state.evolutionItems[p.condition.item_id],2);state.evolutionRoom='hellGate';a.level=39;assert.equal(eligibleEvolutions(a,state,p.condition.item_id).length,0);a.level=40;}
 assert.equal(eligibleEvolutions(a,state,p.condition.item_id).length,1);assert(promoteUsingItem(a,p,state));assert.equal(a.species.id,p.to_species_id);assert.equal(state.evolutionItems[p.condition.item_id],1);
}
const flask=u('505'),fox=u('510');let defeats=[{level:40,participants:[flask.uid,fox.uid]}];const awards=rewardsFor(defeats,[flask,fox],{warbond:false});assert.equal(awards.find(x=>x.uid===flask.uid).amount,Math.floor(awards.find(x=>x.uid===fox.uid).amount/2));const doubled=rewardsFor(defeats,[flask,fox],{warbond:true});assert.equal(doubled.find(x=>x.uid===flask.uid).amount,awards.find(x=>x.uid===fox.uid).amount);
for(const [room,id]of [['scrub','505'],['northRoad','510']]){const r=branchEncounterRoute({room,tables:[{phase:'DAY',slots:[{species_id:'001',weight:100}]}]});const slot=r.tables[0].slots.find(x=>x.species_id===id);assert(slot&&slot.max_level<=12&&slot.authoredSlot);assert.equal(r.tables[0].slots.reduce((a,b)=>a+b.weight,0),100);}
for(const berry of BERRIES){const a=u('510','Forager');beginAbilities(a,[u()],[a],{});a.heldItem=berry.id;a.hp=40;a.moves=[{id:8,name:'Test',pp:20,left:0}];if(berry.effect.cure){a.status=berry.effect.cure==='ALL'?'BURN':berry.effect.cure[0];a.confusion=3;}const before=a.hp;const messages=activateHeldRecovery(a);assert.equal(a.heldItem,null,berry.name);assert(messages.length,berry.name);assert(a.hp>=before);if(berry.effect.stat)assert.equal(a.stages[berry.effect.stat],1);if(berry.effect.pp)assert.equal(a.moves[0].left,10);if(berry.effect.cure)assert.equal(a.status,null);}
{
 const a=u('510','Berry Hoard'),b=u();beginAbilities(a,[b],[a],{});a.heldItem='HELD_BERRY_HEARTH';a.hp=40;activateHeldRecovery(a);assert(!a.heldItem);a.hp=150;cleanupRound(a,b,()=>.9);assert(!a.heldItem);cleanupRound(a,b,()=>.9);assert.equal(a.heldItem,'HELD_BERRY_HEARTH');a.hp=40;activateHeldRecovery(a);cleanupRound(a,b,()=>.9);cleanupRound(a,b,()=>.9);assert(!a.heldItem,'only one regrowth');
}
{
 const a=u('510','Feast');a.heldItem='HELD_BERRY_HEARTH';a.hp=50;activateHeldRecovery(a);assert.equal(a.hp,125);
 const b=u();b.heldItem='HELD_CLEAR_HERB';b.stages={attack:-2,defence:1};activateHeldRecovery(b);assert.equal(b.stages.attack,0);assert.equal(b.stages.defence,1);assert(!b.heldItem);
 b.heldItem='HELD_VANGUARD_VEST';assert.equal(heldStat(b,'sp_defence'),1.5);assert(!moveUsable(b,{left:10,category:'STATUS',effects:[]}));
}
{
 const a=u(),b=u();a.stats.attack=1000;b.hp=b.maxHp=50;b.heldItem='HELD_LAST_THREAD';beginAbilities(a,[b],[a],{});applyMove(a,b,{...DATA.moves.find(m=>m.id===735),left:10},()=>.5,{floor:0});assert.equal(b.hp,1);assert(!b.heldItem);
}
console.log('PASS: eight branch paths, Hell/level/item gate and non-consumption on failure, half EXP and Warbond, weak early base encounters, Psychic Reggifox, twelve real Berries, regrowth, Feast, broad equipment and survival.');
{
 const a=u('514'),b=u();b.heldItem='HELD_CLEAR_HERB';beginAbilities(a,[b],[a],{});applyMove(a,b,{...DATA.moves.find(m=>m.id===739),left:10},()=>.5,{floor:0});assert.equal(b.stages.attack,0);assert.equal(b.stages.sp_attack,0);assert(!b.heldItem,'one herb clears the complete move, not only its first stat');
 const c=u(),t=u();c.stats.attack=1000;t.hp=t.maxHp=50;t.heldItem='HELD_LAST_THREAD';beginAbilities(c,[t],[c],{});applyMove(c,t,{...DATA.moves.find(m=>m.id===738),left:10},()=>.5,{floor:0});assert.equal(t.hp,0,'a later strike can defeat a Last Thread survivor');
}
