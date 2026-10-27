import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {EXPANSION} from '../dist/expansion-data.js';
import {CYBRESSA_TRAINERS} from '../dist/cybressa-data.js';
import {COSSENNE_TRAINERS} from '../dist/cossenne-data.js';
import {MARASEN_TRAINERS} from '../dist/marasen-data.js';
import {BOTRUNE_TRAINERS} from '../dist/botrune-data.js';
import {FINALE_TRAINERS} from '../dist/finale-data.js';
import {openingTrainer} from '../dist/opening-balance.js';
import {rootForm,legalForm} from '../dist/route-roster.js';
import {LEADER_SCHOOLS,lockedLeaderRoster,lockLeadersForRegion} from '../dist/leader-rosters.js';
import {withTrainerProdigies,trainerProdigyWarning} from '../dist/trainer-prodigies.js';
import {chooseLeaderAction,leaderMove} from '../dist/leader-tactics.js';
const all=[...EXPANSION.trainers,...CYBRESSA_TRAINERS,...COSSENNE_TRAINERS,...MARASEN_TRAINERS,...BOTRUNE_TRAINERS,...FINALE_TRAINERS];
const byId=id=>all.find(t=>t.id===id);
const species=id=>DATA.species.find(s=>s.id===id);
const original={};
for(const [id,school] of Object.entries(LEADER_SCHOOLS)){
 const authored=byId(id);
 assert(authored,id+' should resolve to an existing town leader');
 const base=openingTrainer(authored);
 original[id]=base;
 const state={leaderRosters:{version:1,seed:90121,teams:{}}};
 const leader=lockedLeaderRoster(state,base);
 assert.equal(leader.team.length,6);
 assert.equal(leader.ai_tier,'Leader');
 assert(leader.leaderTactician);
 assert.deepEqual(leader.team.map(s=>s.level),base.team.map(s=>s.level),id+' retains all six established level slots');
 assert(leader.team.every(s=>species(s.species_id)?.types.includes(school.type)),id+' remains '+school.type+' throughout');
 assert.equal(new Set(leader.team.map(s=>rootForm(s.species_id))).size,6,id+' should have six different families');
 assert(leader.team.every(s=>s.battle_move_ids.length>=1&&s.battle_move_ids.length<=4));
 assert(leader.team.every(s=>s.battle_move_ids.some(mid=>DATA.moves.find(m=>m.id===mid)?.power>0)));
 assert(leader.team.every(s=>legalForm(s.species_id,s.level)===s.species_id),id+' must not pre-evolve');
 assert.deepEqual(lockedLeaderRoster(state,base).team,leader.team,id+' must not reroll on another challenge');
 assert.deepEqual(lockedLeaderRoster(JSON.parse(JSON.stringify(state)),base).team,leader.team,id+' must persist after reload');
 const prodigies=withTrainerProdigies(leader);assert(prodigies.team.every(s=>s.prodigy),id+' must give each partner one real Prodigy stat');
 assert.match(trainerProdigyWarning(prodigies),/Prodig/);
 const arrivals={leaderRosters:{version:1,seed:90121,teams:{}}};
 lockLeadersForRegion(arrivals,school.town,all,t=>openingTrainer(t));
 assert.equal(arrivals.leaderRosters.teams[id]?.length,6,'town arrival must lock the team');
}
for(const id of Object.keys(LEADER_SCHOOLS)){
 const variations=new Set();
 for(let seed=1;seed<=12;seed++){
  const leader=lockedLeaderRoster({leaderRosters:{version:1,seed,teams:{}}},original[id]);
  variations.add(leader.team.map(x=>x.species_id).join('-'));
 }
 assert(variations.size>1,id+' must change at least one family on a fresh save');
}
const stats={hp:100,attack:130,defence:140,sp_attack:130,sp_defence:140,speed:100};
const mon=(id,types,techniques)=>({uid:id,level:65,hp:600,maxHp:600,species:{id,types,ability_names:{primary:'Ordinary'}},stats:{...stats},stages:{},abilitySlot:'primary',moves:techniques.map(m=>({...m,left:20,pp:20})),status:null});
const technique=(type,power=85)=>({id:type,category:'SPECIAL',type_id:type,power,accuracy:100,priority:0,effects:[],pp:20});
const fire=mon('fire',['FIRE'],[technique('FIRE')]);
const grass=mon('grass',['GRASS'],[technique('GRASS')]);
const water=mon('water',['WATER'],[technique('WATER',110)]);
const battle={trainer:{id:'LDR-05',name:'Canal leader',leaderSchool:'WATER',leaderTactician:true,bagUses:0},enemies:[fire,grass],player:water,round:3};
assert.equal(chooseLeaderAction(battle)?.kind,'switch','leaders should withdraw a threatened type-disadvantaged partner');
assert.equal(chooseLeaderAction(battle)?.index,1,'leaders switch to the more resilient counter');
assert.equal(leaderMove({...battle,enemies:[grass,fire]},grass,water).type_id,'GRASS');
console.log('PASS: eight themed leaders; six fixed levels, legal evolved families, tactical moves and Prodigies; save locking, random variation and adverse-matchup switching.');
