import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {instance,applyMove,moveUsable} from '../dist/engine.js';
import {moveHPCost} from '../dist/move-rules.js';
import {beginAbilities} from '../dist/abilities.js';
import {captureSpeciesTier,capturePreview,resolveCapture} from '../dist/route-rules.js';
import {CAVE_FLOORS,CAVE_MYTHIC} from '../dist/exploration-data.js';
import {PRIEST_RETURNS,rememberPriestRest,evacDestination} from '../dist/field-items.js';
import {NEW_MAPS} from '../dist/expansion-world.js';
globalThis.Image=class {};
const {isBlocked}=await import('../dist/world.js');
const costs=DATA.moves.filter(m=>m.effects?.some(e=>e.effect_id==='hp_cost'));
assert(costs.length>0);
for(const m of costs)for(const side of ['player','enemy'])for(const offset of [-1,0,1]){
 const actor=instance(DATA.species.find(s=>s.id===CAVE_MYTHIC.speciesId),60,[]),foe=instance(DATA.species[0],60,[]),move={...m,left:m.pp};
 actor.uid='payer';foe.uid='foe';actor.maxHp=actor.hp=1000;foe.hp=foe.maxHp=10000;beginAbilities(actor,[foe],[actor],{});actor.side=side;actor.combatFloor=0;
 const cost=moveHPCost(actor,move);actor.hp=cost+offset;const stages={...actor.stages},pp=move.left,hp=actor.hp;
 assert.equal(moveUsable(actor,move),offset>0,m.name+' affordability');const result=applyMove(actor,foe,move,()=>.5,{floor:0});
 if(offset<=0){assert(result.skipped,m.name);assert.equal(actor.hp,hp);assert.deepEqual(actor.stages,stages);assert.equal(move.left,pp);assert(result.messages.some(s=>s.includes('needs more HP')));}
 else{assert(!result.skipped,m.name);assert.equal(actor.hp,hp-cost,m.name+' exact payment');assert.equal(actor.hp,1);}
}
const rare=DATA.species.filter(s=>/mythic|legendary/i.test(s.role+' '+s.power_class)&&!/pseudo/i.test(s.role+' '+s.power_class)||s.legendaryRoamer);
assert(rare.some(s=>s.id===CAVE_MYTHIC.speciesId));
for(const s of rare){
 const tier=captureSpeciesTier(s);assert(tier.ignoreLevel,s.name);const expected=s.approvedPaladin&&s.legendaryRoamer?10:/mythic|box legendary/i.test(s.role+' '+s.power_class)?3:5;assert.equal(tier.rate,expected,s.name);
 const u={species:s,hp:1,maxHp:1000,level:1},chance=capturePreview(u,6);u.level=200;assert.deepEqual(capturePreview(u,6),chance,s.name+' level independence');
 for(const status of [null,'SLEEP','FREEZE','PARALYSIS','BURN','POISON']){u.status=status;assert.equal(resolveCapture(u,()=>0,{foodModifier:6}).chance,capturePreview(u,6).chance);}
}
assert.equal(captureSpeciesTier(DATA.species.find(s=>s.id==='425')).rate,15);
assert.deepEqual(captureSpeciesTier({power_class:'Pseudo-Legendary'}),{name:'Pseudo-legendary',rate:45,ignoreLevel:false});assert.equal(captureSpeciesTier({rarity:'Legendary'}).ignoreLevel,true);
for(const f of CAVE_FLOORS){
 const map=NEW_MAPS[f.room],point=PRIEST_RETURNS[f.room],healer=map.spots.find(s=>s.id===f.room+(f.index?'-healer':'-npc'));assert(healer);assert(point);assert(!isBlocked(f.room,point.x,point.y));assert(!isBlocked(f.room,healer.x,healer.y+1));
 const state={};assert(rememberPriestRest(state,f.room));assert.deepEqual(evacDestination(state),point);
 const visited=new Set(),queue=[[3,17]];while(queue.length){const [x,y]=queue.shift(),key=x+','+y;if(visited.has(key)||isBlocked(f.room,x,y))continue;visited.add(key);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,y+dy]);}
 assert(visited.has(healer.x+','+(healer.y+1)),f.room+' connected healer');assert(visited.has('44,17'),f.room+' connected stairs');
}
console.log(`PASS: ${costs.length} HP-cost moves on both sides at cost−1/cost/cost+1; ${rare.length} legendary/mythic tiers; five reachable healers and care/evac points.`);
