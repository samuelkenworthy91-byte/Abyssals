import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {EXPANSION} from '../dist/expansion-data.js';
import {BOTRUNE_TRAINERS} from '../dist/botrune-data.js';
import {FINALE_TRAINERS} from '../dist/finale-data.js';
import {ELITE_LEADERS,eliteLeaderTeam,legalLeaderForm,leaderLegalMoves,lockVisitedLeaderTeams} from '../dist/elite-leaders.js';
import {openingTrainer} from '../dist/opening-balance.js';
import {instance,rng,applyMove,cleanupRound} from '../dist/engine.js';
import {initializeTrainerGrowth,trainerProdigyWarning} from '../dist/trainer-prodigies.js';
import {unitGrowthRates,growthPercent,prodigyGrowthBonus} from '../dist/progression.js';
import {beginAbilities} from '../dist/abilities.js';
import {chooseArenaBossAction,chooseArenaBossMove,switchArenaBoss,expectedDamage} from '../dist/arena-bosses.js';
import {makeLeaderRematch,settleLeaderRewards,leaderAceBaby,completeLeaderRematch} from '../dist/leader-outcomes.js';
import {recordFieldBattle,fieldJournalStatus,fieldJournalRumours} from '../dist/field-journal.js';
const originals=[...EXPANSION.trainers,...BOTRUNE_TRAINERS,...FINALE_TRAINERS].filter(t=>ELITE_LEADERS[t.id]);
assert.equal(originals.length,8);
const find=id=>DATA.species.find(s=>s.id===id),move=id=>DATA.moves.find(m=>m.id===id);
const state={playerName:'Fox',leaderTeamSeed:1234,party:[],reserve:[],dead:[],fates:{},defeatedTrainers:[]},different={...structuredClone(state),leaderTeamSeed:9876};
const plain=JSON.stringify(originals);let variants=0;
for(const raw of originals){
 const t=openingTrainer(raw,state),other=openingTrainer(raw,different),spec=ELITE_LEADERS[raw.id];
 assert(t.eliteLeader);assert.equal(t.specialty,spec.type);assert.deepEqual(t.team.map(s=>s.level),spec.levels);assert.equal(t.team.length,6);
 assert.deepEqual(t.team,openingTrainer(raw,JSON.parse(JSON.stringify(state))).team,'persist exact roster, set and ace');
 assert.equal(t.team.filter(s=>s.ace).length,1);assert(t.team[5].ace);assert.equal(state.leaderTeams[t.id].aceSpeciesId,t.team[5].species_id);
 variants+=JSON.stringify(t.team.map(s=>s.species_id))!==JSON.stringify(other.team.map(s=>s.species_id));
 assert(new Set(t.team.map(s=>find(s.species_id).family_id)).size===6,'distinct families');
 assert(new Set(t.team.flatMap(s=>find(s.species_id).types)).size>=4,'secondary type diversity');
 const categories=t.team.map(s=>find(s.species_id).base_stats).map(s=>s.attack>=s.sp_attack?'physical':'special');assert(categories.includes('physical')&&categories.includes('special'));
 for(const slot of t.team){
  const s=find(slot.species_id),legal=new Set(leaderLegalMoves(s,slot.level).map(m=>m.id));assert(s.types.includes(spec.type));assert(legalLeaderForm(s,slot.level));
  assert.equal(slot.battle_move_ids.length,4);assert.equal(new Set(slot.battle_move_ids).size,4);assert(slot.battle_move_ids.every(id=>legal.has(id)));
  assert(slot.battle_move_ids.some(id=>move(id).power&&move(id).type_id===spec.type),'signature STAB');
  assert(s.ability_names[slot.abilitySlot]);assert(slot.held_item_id);assert(slot.prodigy);
  const u=instance(s,slot.level,slot.battle_move_ids.map(move));u.uid=t.id+'-'+slot.slot;initializeTrainerGrowth(u,slot);
  assert.equal(u.species.id,slot.species_id);assert.equal(u.level,slot.level);
  for(const stat of slot.prodigy.stats){assert.equal(prodigyGrowthBonus(u,stat),slot.prodigy.bonus*(1+u.evolutionHistory.length));assert(unitGrowthRates(u)[stat]>growthPercent(s,stat));}
  assert.deepEqual(unitGrowthRates(JSON.parse(JSON.stringify(u))),unitGrowthRates(u));
 }
 assert.match(trainerProdigyWarning(t),/Warning:/);
 state.fates[t.id]='SPARED';const rematch=makeLeaderRematch(state,t);assert(rematch.eliteLeader);assert.deepEqual(rematch.team.map(s=>s.species_id),t.team.map(s=>s.species_id));assert(rematch.nonlethal);
 state.defeatedTrainers.push(rematch.id);state.trainerPayouts=[rematch.id];assert(completeLeaderRematch(state,rematch.id));assert(!completeLeaderRematch(state,rematch.id));
 state.fates[t.id]='EXECUTED';state.money=0;settleLeaderRewards(state,raw,(id,l,uid)=>({uid,species:find(id),level:l,hp:10}));
 assert.equal(state.leaderOutcomes.gifts[t.id].speciesId,leaderAceBaby(t));const money=state.money,count=state.party.length+state.reserve.length;settleLeaderRewards(state,raw,()=>assert.fail('duplicate nursery'));assert.equal(state.money,money);assert.equal(state.party.length+state.reserve.length,count);
}
assert(variants>=6);assert.equal(JSON.stringify(originals),plain,'canonical story roster not mutated');
const legacy={playerName:'Old save',party:[{uid:'stable',growthSeed:773}],fates:{'LDR-01':'SPARED'}};
assert.deepEqual(eliteLeaderTeam(structuredClone(legacy),originals[0]),eliteLeaderTeam(structuredClone(legacy),originals[0]));
const visits={leaderTeamSeed:8};lockVisitedLeaderTeams(visits,originals,['town']);assert(!visits.leaderTeams);lockVisitedLeaderTeams(visits,originals,['dorelem']);assert.deepEqual(Object.keys(visits.leaderTeams),['LDR-01']);
// A visible practice replacement must use index, singles use their active front,
// doubles use exactly active slots, never unrevealed reserves. JSON save survives loss.
for(const kind of ['practice','wild','lesson']){
 const s={party:[],reserve:[],dead:[]},enemies=['001','004','007'].map(id=>({species:find(id)}));
 const b={kind,index:kind==='practice'?1:0,enemies,phase:'ready'};assert(recordFieldBattle(s,b,'dorelem'));
 assert.equal(fieldJournalStatus(s,kind==='practice'?'004':'001'),'seen');assert.equal(fieldJournalStatus(s,'007'),'unknown');assert(!recordFieldBattle(s,b,'dorelem'));
 b.activeEnemyIndices=[1,2];recordFieldBattle(s,b,'ramelle');assert.equal(fieldJournalStatus(JSON.parse(JSON.stringify(s)),'007'),'seen');
}
const unknown={travelVisitedRooms:['town']};assert.match(fieldJournalRumours('364',unknown),/far off ahead/);assert(!fieldJournalRumours('364',unknown).includes('Dorelem'));unknown.travelVisitedRooms.push('dorelem');assert.match(fieldJournalRumours('364',unknown),/somewhere near Dorelem/);
// Competitive switching uses a whole action, respects trapping and a cooldown.
function unit(id,type){const s=structuredClone(find(id));s.types=[type];const u=instance(s,70,[{...move(1),power:100,accuracy:100,type_id:type,category:'SPECIAL',effects:[]}]);u.uid=id+type;u.hp=u.maxHp=200;u.stats={hp:200,attack:100,sp_attack:100,defence:100,sp_defence:100,speed:100};return u;}
const p=unit('001','WATER'),a=unit('004','FIRE'),bench=unit('007','GRASS');const b={trainer:{eliteLeader:true,name:'Leader'},player:p,enemies:[a,bench],round:1};beginAbilities(p,b.enemies,[p]);
const act=chooseArenaBossAction(b);assert.equal(act.kind,'switch');const hp=p.hp,pp=bench.moves[0].left;assert(switchArenaBoss(b,act.index));assert.equal(p.hp,hp);assert.equal(bench.moves[0].left,pp,'switch grants no attack');assert(b.enemies[0].actedThisRound);assert.notEqual(chooseArenaBossAction(b).kind,'switch','no repeat in same round');
b.enemies[0]=a;b.enemies[1]=bench;a.trapped=true;b.round=5;assert.notEqual(chooseArenaBossAction(b).kind,'switch');assert.equal(switchArenaBoss(b,1),null);a.trapped=false;
b.leaderSwitchCount=8;assert.notEqual(chooseArenaBossAction(b).kind,'switch','finite switch budget prevents endless cycling');
const bad={...a.moves[0],id:9991,type_id:'FIRE'},good={...bad,id:9992,type_id:'ELECTRIC'};assert.equal(chooseArenaBossMove(b,a,p,[bad,good]).id,9992);
assert.equal(chooseArenaBossAction({...b,trainer:{ai_tier:'Basic'}}),null,'ordinary trainers unaffected');
console.log('PASS: eight persistent legal elite rosters, levels, type and role coverage, four legal moves, real compounded Prodigies, deterministic migrations, nursery and rematches, action-limited switching, sightings and visited-town rumours');
