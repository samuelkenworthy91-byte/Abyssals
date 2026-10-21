import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {instance,applyMove,rng} from '../dist/engine.js';
import {initializeProgress} from '../dist/progression.js';
import {beginAbilities} from '../dist/abilities.js';
import {isArenaBossRound,arenaRoundMarks,arenaBossSpec,buildArenaBoss,chooseArenaBossAction,chooseArenaBossMove,switchArenaBoss,orderArenaBossReplacement} from '../dist/arena-bosses.js';
import {createCybressaTrial,continueCybressaTrial,registerCybressaTrial,completeCybressaTrial} from '../dist/cybressa-rules.js';
const move=id=>DATA.moves.find(m=>m.id===id);
function unit(id,ids,level=60){const u=instance(DATA.species.find(s=>s.id===id),level,ids.map(move));u.uid=id;initializeProgress(u);return u;}
for(let round=1;round<=100;round++){
 assert.equal(isArenaBossRound(round),round%5===0);
 assert.equal(arenaRoundMarks(round),round%5===0?round*10:round+2);
 const boss=buildArenaBoss(round,Math.min(200,42+4*(round-1)));
 if(round%5){assert.equal(boss,null);continue;}
 assert.equal(boss.team.length,6);assert.equal(boss.bagUses,2);assert.equal(boss.arenaHealingFraction,.5);
 for(const slot of boss.team){
  assert(slot.level<=200);assert(slot.battle_move_ids.length===4);assert.equal(new Set(slot.battle_move_ids).size,4);
  for(const id of slot.battle_move_ids)assert(slot.current_form_legal_move_ids.includes(id));
  const species=DATA.species.find(s=>s.id===slot.species_id);assert(species.ability_names[slot.abilitySlot]);
 }
}
assert.deepEqual([5,10,15,20,25].map(r=>arenaBossSpec(r).key),['rain','sun','sand','siege','relay']);
assert.equal(arenaBossSpec(30).key,'rain');
// A full run pays each milestone exactly once, and survives saved continuation.
let state={fates:{'LDR-02':'SPARED'},party:[unit('364',[455])],defeatedTrainers:[]},sum=0;
assert(createCybressaTrial(state,rng(42)));
for(let round=1;round<=30;round++){
 const a=state.cybressa.activeTrial;assert.equal(a.round,round);assert.equal(a.marks,arenaRoundMarks(round));
 assert.equal(a.trainer.team.length,round%5===0?6:3);
 if(round%5===0){assert(a.trainer.arenaBoss);assert(a.text.includes('two half-HP healing items'));}
 const expansion={trainers:[{id:a.trainer.id,team:[]}]},voices={};registerCybressaTrial(state,expansion,voices);
 assert.equal(expansion.trainers[0].team.length,a.trainer.team.length);
 assert(voices[a.trainer.id].before.includes('Defeat all '+a.trainer.team.length));
 state.defeatedTrainers.push(a.trainer.id);assert(completeCybressaTrial(state,a.trainer.id));sum+=arenaRoundMarks(round);
 assert(!completeCybressaTrial(state,a.trainer.id));assert.equal(state.cybressa.trialMarks,sum);
 assert.equal(state.cybressa.trialContinuation.lastMarks,arenaRoundMarks(round));
 state=JSON.parse(JSON.stringify(state));if(round<30)assert(continueCybressaTrial(state,rng(round+42)));
}
const trainer={arenaBoss:true,name:'Boss',bagUses:2,arenaHealingFraction:.5};
// Electric attacker threatened by Ground switches to its Ground-immune partner.
let actor=unit('052',[74,57,371,107]),target=unit('037',[165,43]),bench=unit('131',[184,44]);
actor.hp=Math.floor(actor.maxHp*.2);target.stats.attack=actor.stats.defence*30;
let b={trainer,player:target,enemies:[actor,bench],round:1};beginAbilities(actor,[target],[actor,bench],{});
let action=chooseArenaBossAction(b);assert.equal(action.kind,'switch');
const oldHp=actor.hp;assert(switchArenaBoss(b,action.index));assert.equal(b.enemies[0],bench);assert.equal(actor.hp,oldHp);assert(bench.actedThisRound);
assert.notEqual(chooseArenaBossAction(b)?.kind,'switch','no immediate switch loop');assert(!switchArenaBoss(b,8));
// A relay passes boosts to the next partner while preserving the shared field.
actor=unit('400',[480,333]);bench=unit('380',[467,45]);target=unit('364',[102]);
b={trainer,player:target,enemies:[actor,bench],round:4};const field={weather:'RAIN',weatherTurns:4};beginAbilities(actor,[target],[actor,bench],field);
actor.stages={sp_attack:1,speed:1};action=chooseArenaBossAction(b);assert.equal(action.kind,'switch');
switchArenaBoss(b,action.index);assert.equal(bench.stages.sp_attack,1);assert.equal(bench.stages.speed,1);assert.equal(bench.field.weather,'RAIN');
// Healing is finite and fallback still chooses a move.
actor=unit('398',[41,333,57]);target=unit('364',[102]);target.stats.attack=1;actor.hp=Math.floor(actor.maxHp*.25);
b={trainer,player:target,enemies:[actor],round:8,trainerMedicineUsed:0};assert.equal(chooseArenaBossAction(b).kind,'heal');
b.trainerMedicineUsed=2;assert.equal(chooseArenaBossAction(b).kind,'move');
const saved=JSON.parse(JSON.stringify(b));assert.equal(chooseArenaBossAction(saved).kind,'move');
// A rain setter establishes its strategy, then attacks instead of wasting PP.
actor=unit('052',[371,74,57,107]);target=unit('364',[102]);target.stats.attack=1;
b={trainer,player:target,enemies:[actor],round:1};beginAbilities(actor,[target],[actor],{});
assert.equal(chooseArenaBossMove(b,actor,target).id,371);
applyMove(actor,target,actor.moves.find(m=>m.id===371),()=>.1);assert.equal(actor.field.weather,'RAIN');assert.notEqual(chooseArenaBossMove(b,actor,target).id,371);
actor.moves.find(m=>m.id===74).left=0;assert.notEqual(chooseArenaBossMove(b,actor,target).id,74);
// Forced replacement ranks the bench rather than reviving defeated members.
actor=unit('052',[74]);bench=unit('131',[184]);target=unit('037',[165]);target.stats.attack=10000;
b={trainer,player:target,enemies:[actor,bench],round:2};orderArenaBossReplacement(b);assert.equal(b.enemies[0],bench);
console.log('PASS: every fifth-round schedule and reward through round 100; five legal six-partner strategies; saved runs and single payouts; matchup switches, cooldown, relay/weather continuity, finite healing and purposeful moves');

const legacy=()=>({cybressa:{activeTrial:{round:5,baseLevel:42,marks:7,text:'Saved contract.',trainer:{id:'TRN-CY-TRIAL-5',team:[{species_id:'052',level:58},{species_id:'145',level:59},{species_id:'140',level:60}]}}}});
let old=legacy();registerCybressaTrial(old,{trainers:[]},{});assert.equal(old.cybressa.activeTrial.trainer.team.length,6);assert.equal(old.cybressa.activeTrial.marks,50);
old=legacy();registerCybressaTrial(old,{trainers:[]},{},true);assert.equal(old.cybressa.activeTrial.trainer.team.length,3);assert.equal(old.cybressa.activeTrial.marks,50);
