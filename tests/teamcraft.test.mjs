import {validateTransferSnapshot} from '../dist/save-transfer.js';
import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {ABILITIES} from '../dist/ability-data.js';
import {instance,applyMove,cleanupRound} from '../dist/engine.js';
import {beginAbilities,leaveAbility,enterAbility} from '../dist/abilities.js';
import {MOVE_SCENES} from '../dist/move-scenes.js';
import {normalizeTeamcraftUnit,buyPPTonic,tonicQuote,migrateTeamcraftState} from '../dist/teamcraft-progress.js';
import {canonicalMoveId,codexCompatible} from '../dist/teamcraft-data.js';
import {secondaryChance,prepareSpecialistMove,stabMultiplier} from '../dist/teamcraft-battle.js';
const move=id=>DATA.moves.find(m=>m.id===id);
const unit=(id='001',ability='Unfazed')=>{const species=structuredClone(DATA.species.find(s=>s.id===id));species.ability_names={primary:ability};const u=instance(species,20,[]);u.uid=Math.random().toString();u.hp=u.maxHp=1000;u.stats={hp:1000,attack:70,defence:70,sp_attack:70,sp_defence:70,speed:70};return u;};
const use=(a,t,id,random=()=>.5)=>{const m={...move(id),left:move(id).pp};const r=applyMove(a,t,m,random,{floor:0});return {r,m};};
assert.equal(DATA.moves.length,566);assert.equal(ABILITIES.length,156);assert.equal(new Set(DATA.moves.map(m=>m.name)).size,566);assert(!DATA.moves.some(m=>/^Plain /.test(m.name)));assert.equal(DATA.learnsets.filter(l=>[700,701,702].includes(l.move_id)).length,3);
for(const m of DATA.moves){assert(MOVE_SCENES[m.id]?.layers?.length,m.name);assert(Number.isInteger(MOVE_SCENES[m.id].teamcraftScore),m.name);}
assert.equal(new Set(DATA.moves.map(m=>MOVE_SCENES[m.id].teamcraftScore)).size,566);
assert.deepEqual([711,712,713].map(id=>[move(id).name,move(id).type_id]),[['Full Release','FIGHTING'],['Latent Power','DARK'],['Mind Unbound','PSYCHIC']]);
{
 const a=unit(),b=unit();beginAbilities(a,[b],[a],{});use(a,b,700);const hp=a.hp;const hit=use(b,a,8).r;assert(hit.blocked);assert.equal(a.hp,hp);cleanupRound(a,b,()=>.5);assert(!a.moveState.protection);use(a,b,700);assert(!a.moveState.protection,'second protection fails with 0.5 roll');
}
{
 const a=unit(),b=unit(),next=unit();beginAbilities(a,[b],[a,next],{});a.stages={attack:2,defence:-2,evasion:5};use(a,b,701);assert.equal(a.hp,750);assert.equal(a.moveState.decoy.hp,250);const hp=a.hp;use(b,a,8,()=>.01);assert.equal(a.hp,hp);const field=a.field;leaveAbility(a,{switching:true,nextUnit:next});enterAbility(next,b,{party:[a,next],field});assert.equal(next.stages.attack,2);assert.equal(next.stages.defence,-2);assert.equal(next.stages.evasion,undefined);assert(next.moveState.decoy.hp<250);assert(next.moveState.relayFatigue>0);
}
{
 const a=unit(),b=unit(),next=unit();beginAbilities(a,[b],[a,next],{});a.teamcraftTargetUid=next.uid;a.stages={sp_attack:3,speed:-1};const {r}=use(a,b,702);assert.equal(r.replacementUid,next.uid);assert.equal(next.stages.sp_attack,3);assert.equal(next.stages.speed,-1);assert(!next.moveState.decoy);next.teamcraftTargetUid=a.uid;const {r:blocked,m}=use(next,b,702);assert(blocked.skipped);assert.equal(m.left,10);
}
{
 const a=unit(),b=unit('010','False Front');beginAbilities(a,[b],[a],{});let r=use(a,b,8).r;assert.equal(r.damage,0);assert.equal(b.hp,875);const hp=b.hp;r=use(a,b,8).r;assert(r.damage>0);assert(b.hp<hp);leaveAbility(b);enterAbility(b,a,{party:[b],field:a.field});assert(b.abilityBattle.flags.falseFront);
}
{
 const a=unit('001','Fortune Thread');assert.equal(secondaryChance(a,{secondary:true,chance_percent:30}),60);assert.equal(secondaryChance(a,{secondary:true,chance_percent:80}),80);assert.equal(secondaryChance(a,{chance_percent:100}),100);
 const b=unit('004','Sage Mind'),m={power:100,category:'SPECIAL',effects:[{effect_id:'inflict_status',chance_percent:10,secondary:true},{effect_id:'hp_cost',fraction:[1,4]}]};const prepared=prepareSpecialistMove(b,m);assert.equal(prepared.power,130);assert.equal(prepared.effects[0].effect_id,'hp_cost');assert.equal(m.effects.length,2);
 const c=unit('001','Native Force');assert.equal(stabMultiplier(c,{type_id:'DARK'}),1.8);assert.equal(stabMultiplier(c,{type_id:'WATER'}),1);
}
{
 const a=unit(),b=unit();beginAbilities(a,[b],[a],{});use(a,b,712,()=>.01);for(const stat of ['attack','defence','sp_attack','sp_defence','speed'])assert.equal(a.stages[stat],1);assert.equal(a.stages.hp,undefined);
}
{
 const a=unit();a.moves=[{...move(11),left:2},{...move(11),id:41,left:4}];a.ppBonusByMoveId={11:3,41:7};normalizeTeamcraftUnit(a,DATA.moves);assert.equal(a.moves.length,1);assert.equal(a.moves[0].pp,12);assert.equal(a.moves[0].left,2);assert.equal(a.ppBonusByMoveId[11],7);const state={money:1000000};const q=tonicQuote(state,a,11,2);assert.equal(q.cost,145000);assert(buyPPTonic(state,a,11,2));assert.equal(a.moves[0].pp,14);assert.equal(a.moves[0].left,2);normalizeTeamcraftUnit(a,DATA.moves);assert.equal(a.moves[0].pp,14);assert.equal(a.moves[0].left,2);assert.equal(canonicalMoveId(41),11);assert(codexCompatible(a.species,700,DATA));
}
{const a=unit(),b=unit('159','Weather Calm');beginAbilities(a,[b],[a],{weather:'RAIN'});const {r,m}=use(a,b,387);assert(r.skipped);assert.equal(m.left,move(387).pp,'suppressed weather cannot spend Rain Mantle PP');}
{const u=unit();u.breedingInheritance={moveId:41};u.moves=[];const state={party:[u],nursery:{eggs:[{inheritance:{moveId:41}}]}};migrateTeamcraftState(state,DATA.moves);assert.equal(u.breedingInheritance.moveId,11);assert.equal(state.nursery.eggs[0].inheritance.moveId,11);assert(state.nursery.eggs[0].inheritance.teamcraftAliasMigration);}
{const u=unit();u.moves=[{id:41,left:1}];const snapshot={version:1,state:{begun:true,playerName:'Aimon',money:0,party:[u],reserve:[],dead:[]},room:'town',player:{x:20,y:20,facing:'up'}};const options={speciesIds:new Set(DATA.species.map(s=>s.id)),moveIds:new Set(DATA.moves.map(m=>m.id)),rooms:new Set(['town'])};assert(validateTransferSnapshot(snapshot,options));u.moves=[{id:999999,left:1}];assert.throws(()=>validateTransferSnapshot(snapshot,options));}
console.log('PASS Teamcraft: 566 distinct moves/scenes, type releases, protection, effigies, relay/fatigue, False Front, proc modifiers, STAB and investment-safe aliases.');

