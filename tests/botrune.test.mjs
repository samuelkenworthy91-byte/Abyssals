import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {NEW_MAPS,newBlocked,newSpots} from '../dist/expansion-world.js';
import {STORM_ROAD,TRIAL_BEATS,BOTRUNE_TRAINERS,BOTRUNE_GUARDS,botruneRoute} from '../dist/botrune-data.js';
import {botruneState,finishTrialBeat,botruneCanFight,botruneBlocked,trialVictims,botruneUnlocked} from '../dist/botrune-rules.js';
import {legalForm,legalMoves} from '../dist/route-roster.js';
import {settleLeaderRewards} from '../dist/leader-outcomes.js';
function flood(room,start,s){const seen=new Set(),q=[start];for(let i=0;i<q.length;i++){const [x,y]=q[i],k=x+','+y;if(seen.has(k)||newBlocked(room,x,y)||s&&botruneBlocked(s,room,x,y))continue;seen.add(k);q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}return seen;}
const near=(p,seen)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([x,y])=>seen.has((p.x+x)+','+(p.y+y)));
for(const room of [...STORM_ROAD.map(r=>r[0]),'botruneShelter']){
 const seen=flood(room,room==='botruneShelter'?[24,24]:[3,17]);assert(seen.size>100,room);
 for(const g of NEW_MAPS[room].gates){assert(seen.has(g.x+','+g.y),room+' unreachable '+g.id);if(g.to)assert(!newBlocked(g.to,...g.arrival.slice(0,2)),g.id+' arrival');}
 for(const p of NEW_MAPS[room].spots)assert(near(p,seen),room+' inaccessible '+p.id);
 if(room==='botruneShelter')continue;
 for(const t of botruneRoute(room).tables){assert.equal(t.slots.length,5);assert.equal(t.slots.reduce((n,s)=>n+s.weight,0),100);assert(t.slots.some(x=>DATA.species.find(s=>s.id===x.species_id).types.includes('GROUND')));assert(t.slots.some(x=>DATA.species.find(s=>s.id===x.species_id).types.includes('DARK')));assert(t.slots.filter(x=>DATA.species.find(s=>s.id===x.species_id).types.includes('ELECTRIC')).length>=3);for(const slot of t.slots)assert.equal(legalForm(slot.species_id,slot.min_level),slot.species_id);}
}
let s={defeatedTrainers:[],fates:{'LDR-05':'SPARED'},party:[],reserve:[]};assert(botruneUnlocked(s));assert(!botruneUnlocked({}));assert(!botruneCanFight(s,'LDR-06'));assert(!botruneCanFight(s,BOTRUNE_GUARDS[0].id));
for(let i=0;i<TRIAL_BEATS.length;i++){
 assert(!finishTrialBeat(s,i+1));assert(finishTrialBeat(s,i));assert(!finishTrialBeat(s,i));
 s=JSON.parse(JSON.stringify(s)); // Save/reload at every beat.
 if(i===6){assert.equal(s.humanLives['CHR-PATE'].lifeState,'DEAD');assert(!s.humanLives['CHR-TRADE']);}
}
assert.equal(botruneState(s).phase,'gauntlet');assert.equal(trialVictims(s).length,5);assert.equal(s.storyHistory.length,1);assert.equal(s.humanLives['CHR-TRADE'].lifeState,'DEAD');assert.equal(s.human_life_state['CHR-PATE'],'DEAD');assert.equal(s.human_life_state['CHR-TRADE'],'DEAD');assert.equal(s.pate_progress_state,'CONFIRMED_DEAD');assert.equal(s.trade_progress_state,'CONFIRMED_DEAD');assert.deepEqual(s.human_memorial_entries,['CHR-PATE','CHR-TRADE']);assert.deepEqual(s.human_restored_ids,[]);assert.equal(s.human_restoration_budget_total,5);
for(let i=0;i<3;i++){
 const seen=flood('botrune',[3,24],s);assert(near(NEW_MAPS.botrune.spots.find(p=>p.id===BOTRUNE_GUARDS[i].id),seen));assert(!seen.has('37,7'),'cannot bypass guard '+i);assert(botruneCanFight(s,BOTRUNE_GUARDS[i].id));for(const t of BOTRUNE_GUARDS.slice(i+1))assert(!botruneCanFight(s,t.id));s.defeatedTrainers.push(BOTRUNE_GUARDS[i].id);s=JSON.parse(JSON.stringify(s));
}
const seen=flood('botrune',[3,24],s);assert(seen.has('37,7'));assert(botruneCanFight(s,'LDR-06'));for(const p of NEW_MAPS.botrune.spots)assert(near(p,seen),p.id);for(const g of NEW_MAPS.botrune.gates)assert(seen.has(g.x+','+g.y));
const leader=BOTRUNE_TRAINERS.find(t=>t.id==='LDR-06');assert.equal(leader.team.length,6);
for(const slot of leader.team){const spec=DATA.species.find(x=>x.id===slot.species_id);assert(spec.base_stats.attack>spec.base_stats.sp_attack);assert.equal(slot.battle_move_ids.length,4);for(const id of slot.battle_move_ids){assert(legalMoves(slot.species_id,slot.level).includes(id));assert.equal(DATA.moves.find(m=>m.id===id).category,'PHYSICAL');}}
s.fates['LDR-06']='EXECUTED';assert(settleLeaderRewards(s,leader,()=>({uid:'gift',species:{id:'373'}})));assert.equal(s.money,50000);assert(!settleLeaderRewards(s,leader,()=>({})));assert.equal(s.money,50000);assert.equal(s.humanLives['CHR-PATE'].lifeState,'DEAD');
console.log('PASS: 7 storm maps, shelter, gate returns, 14 legal day/night tables; persistent independent deaths; all 3 unbypassable guard cordons; 6 physical leader slots; once-only judgement rewards');
const {drawStormWeather}=await import('../dist/botrune-art.js');
function weatherStrokes(time,reduced){let strokes=0;const c={save(){},restore(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){strokes++;}};drawStormWeather(c,'stormGlass',time,reduced);return strokes;}
assert.equal(weatherStrokes(200,false),33);assert.equal(weatherStrokes(1000,false),32);assert.equal(weatherStrokes(200,true),0);
console.log('PASS: distant lightning is intermittent; reduced motion disables lightning and rain');
