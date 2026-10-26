import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DATA} from '../dist/data.js';
import {instance,applyMove,cleanupRound} from '../dist/engine.js';
import {beginAbilities,abilityMultiplier,heldStat,enterAbility,leaveAbility,abilityMemory} from '../dist/abilities.js';
import {eggTypes,eggArtHTML} from '../dist/egg-art.js';
import {TYPES} from '../dist/type-rules.js';
import {canLearnScroll} from '../dist/side-adventures.js';
const species=id=>DATA.species.find(s=>s.id===id),unit=(id='510')=>{const u=instance(structuredClone(species(id)),40,[]);u.uid=id+Math.random();u.hp=u.maxHp=500;u.stats={hp:500,attack:70,defence:70,sp_attack:70,sp_defence:70,speed:70};return u;},move=id=>({...structuredClone(DATA.moves.find(m=>m.id===id)),left:20});
for(const id of ['510','511','512','513','514']){const name=species(id).ability_names.primary;assert.equal(DATA.species.filter(s=>Object.values(s.ability_names||{}).includes(name)).length,1,name+' is unique');}
const pivot=move(741);assert.equal(pivot.type_id,'FIGHTING');assert.equal(pivot.category,'PHYSICAL');assert(pivot.power>0);assert(canLearnScroll(unit('511'),741));assert(DATA.learnsets.some(l=>l.species_id==='511'&&l.move_id===741&&l.level===0));
{
 const a=unit('511'),b=unit(),foe=unit();beginAbilities(a,[foe],[a,b],{});a.stages.attack=2;a.teamcraftTargetUid=b.uid;
 const result=applyMove(a,foe,pivot,()=>.5,{floor:0});assert(result.damage>0);assert.equal(result.replacementUid,b.uid);assert.equal(b.stages.attack||0,0,'damaging pivot never passes stages');assert(!a.abilityState);assert(b.abilityState);assert(b.actedThisRound);
 leaveAbility(b,{switching:true,nextUnit:a});enterAbility(a,foe,{party:[a,b],field:{}});assert.equal(abilityMultiplier(a,foe,move(735)),1.25,'re-entry refreshes Sovereign Charge');
}
for(const kind of ['miss','immune','blocked','trapped','no-bench','contact-ko']){
 const a=unit('511'),b=unit(),foe=unit();beginAbilities(a,[foe],kind==='no-bench'?[a]:[a,b],{});a.teamcraftTargetUid=b.uid;let m=move(741),random=()=>.5;
 if(kind==='miss'){m.accuracy=0;}
 if(kind==='immune')foe.species.types=['GHOST'];
 if(kind==='blocked')foe.moveState.protection={kind:'protect'};
 if(kind==='trapped')a.trapped=3;
 if(kind==='contact-ko'){a.hp=1;foe.heldItem='HELD_REPRISAL_HELM';}
 const result=applyMove(a,foe,m,random,{floor:0});assert(!result.replacementUid,kind);if(['trapped','no-bench'].includes(kind))assert(result.damage>0,kind+' still attacks');
}
{
 const a=unit('514'),foe=unit();beginAbilities(a,[foe],[a],{});applyMove(a,foe,move(739),()=>.5,{floor:0});assert(abilityMemory(a).flags.fixerPrepared);const special=move(730);assert.equal(abilityMultiplier(a,foe,special),1.3);applyMove(a,foe,{...special,accuracy:0},()=>.5,{floor:0});assert(abilityMemory(a).flags.fixerPrepared,'miss retains bonus');
 applyMove(a,foe,move(735),()=>.5,{floor:0});assert(abilityMemory(a).flags.fixerPrepared,'physical attack retains bonus');applyMove(a,foe,move(730),()=>.5,{floor:0});assert(!abilityMemory(a).flags.fixerPrepared,'special damage spends bonus');
 applyMove(a,foe,move(739),()=>.5,{floor:0});applyMove(a,foe,move(739),()=>.5,{floor:0});assert.equal(abilityMultiplier(a,foe,special),1.3,'cannot stack');leaveAbility(a,{switching:true});enterAbility(a,foe,{party:[a],field:{}});assert.equal(abilityMultiplier(a,foe,special),1,'switch clears bonus');
}
for(const [id,key,value]of [['DUELIST_GRIP','attack',1.2],['SCHOLAR_BEAD','sp_attack',1.2],['FLEET_ANKLET','speed',1.15],['BASTION_PLATE','defence',1.2]]){const a=unit();a.heldItem='HELD_'+id;assert.equal(heldStat(a,key),value);}
{
 const a=unit(),foe=unit();beginAbilities(a,[foe],[a],{});foe.heldItem='HELD_SHELTER_CLASP';assert.equal(abilityMultiplier(a,foe,move(735)),.8);foe.hp--;assert.equal(abilityMultiplier(a,foe,move(735)),1);
 a.hp=100;a.heldItem='HELD_SIPHON_CHARM';const hp=a.hp,result=applyMove(a,foe,move(735),()=>.5,{floor:0});assert.equal(a.hp-hp,Math.max(1,Math.floor(result.damage/8)));assert.equal(a.heldItem,'HELD_SIPHON_CHARM');
}
for(const s of DATA.species){const egg={speciesId:s.id,seed:123,remaining:200},before=JSON.stringify(egg),types=eggTypes(egg);assert.deepEqual(types,[s.types[0],s.types[1]||s.types[0]],s.name);assert.equal(JSON.stringify(egg),before);const html=eggArtHTML(egg);for(const t of types)assert(html.includes('assets/eggs/'+t.toLowerCase()+'.webp'));assert(html.includes('aria-label='));}
for(const t of TYPES)assert(fs.existsSync(new URL('../dist/assets/eggs/'+t.toLowerCase()+'.webp',import.meta.url)));
assert.deepEqual(eggTypes({speciesId:'unknown'}),['NORMAL','NORMAL']);assert(eggArtHTML({speciesId:'505'},{ready:true}).includes('egg-ready'));
console.log('PASS: Fighting pivot and re-entry, no stage passing; miss, immunity, protect, trap, solo and contact KO; singles Fixer preparation; six held items; all 513 species egg halves match fixed hatchling types without mutation.');
