import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DATA} from '../dist/data.js';
import {PHANTOM_FALCHION_ID as signature} from '../dist/dossier-config.js';
import {instance,applyMove} from '../dist/engine.js';
import {beginAbilities,enterAbility,leaveAbility} from '../dist/abilities.js';
import {doubleRound} from '../dist/relic-double.js';
import {readSave,selectSlot,writeSave} from '../dist/save.js';
import {growLevel} from '../dist/progression.js';
import {JOURNAL_HABITATS} from '../dist/journal-habitats.js';
import {relicArtPath} from '../dist/relic-art.js';
import {ACTION_ART} from '../dist/action-vfx.js';
import {effectHTML,effectSpec} from '../dist/effects.js';

const species=DATA.species.find(s=>s.name==='Merrigami');
assert.equal(relicArtPath(species.id),'assets/574.webp','the field companion uses the approved portrait');
const move=id=>{const m=DATA.moves.find(m=>m.id===id);return {...m,left:m.pp};};
const use=(a,b,m,roll=.9,options={})=>applyMove(a,b,m,()=>roll,{floor:0,...options});
function fixture(type='FIGHTING'){
 const a=instance(species,33,[]);
 const b=instance({...DATA.species[0],types:[type],abilities:{}},33,[]);
 for(const u of [a,b]){u.hp=u.maxHp=20000;u.stats={hp:20000,attack:100,defence:100,sp_attack:100,sp_defence:100,speed:100};}
 beginAbilities(a,[b]);
 return [a,b];
}
const rows=DATA.learnsets.filter(r=>r.species_id===species.id);
assert.deepEqual(rows.map(r=>[r.level,r.move_id]),[[1,265],[5,1],[9,12],[13,2],[17,203],[21,249],[25,465],[29,259],[33,signature],[39,101],[45,262],[51,125],[57,207],[63,306]]);
assert.deepEqual(DATA.learnsets.filter(r=>r.move_id===signature).map(r=>r.species_id),[species.id]);
assert.equal(move(465).accuracy,'ALWAYS');
assert.equal(move(signature).target,'SINGLE_FOE');
assert.equal(move(signature).category,'SPECIAL');
assert.deepEqual(new Set(JOURNAL_HABITATS[species.id].map(h=>h.room)),new Set(['burrowHollow','burrowHollowTrail2','burrowHollowTrail3']));
assert(JOURNAL_HABITATS[species.id].filter(h=>h.room==='burrowHollow').every(h=>h.levels==='15–16'));

{
 const [a,b]=fixture();
 for(let i=0;i<3;i++)assert(use(a,b,move(465)).ancestralAid);
 a.stages.sp_attack=-1;
 assert(!use(a,b,move(465)).ancestralAid);
 assert.equal(a.stages.sp_attack,-1);
 leaveAbility(a,{switching:true});
 enterAbility(a,b);
 assert(use(a,b,{...move(465),hits:{min:3,max:3}}).ancestralAid);
 assert.equal(a.stages.sp_attack,1);
 const context={};
 assert(use(a,b,move(465),.9,{procContext:context}).ancestralAid);
 assert(!use(a,b,move(465),.9,{procContext:context,continuation:true}).ancestralAid);
 assert.equal(a.stages.sp_attack,2);
}
{
 const [a,b]=fixture();
 a.stages.sp_attack=6;
 assert(!use(a,b,move(465)).ancestralAid);
 a.stages.sp_attack=5;
 assert(use(a,b,move(465)).ancestralAid);
 assert.equal(a.stages.sp_attack,6);
 assert.equal(a.abilityState.dossier.ancestralAid,1);
 a.stages.sp_attack=2;
 b.moveState.protection=true;
 assert(!use(a,b,move(465)).ancestralAid);
 assert(!use(a,b,move(1)).ancestralAid);
}
{
 const [a,b]=fixture(),[,c]=fixture(),[,ally]=fixture();
 a.uid='merrigami';b.uid='left';c.uid='right';ally.uid='ally';
 beginAbilities(a,[b,c],[a,ally],{});
 const battle={player:a,enemies:[b,c],alliedRivet:ally,random:()=>.9};
 const spread={...move(465),target:'ALL_FOES'};
 const strikes=doubleRound(battle,spread).filter(event=>event.move===spread);
 assert.equal(strikes.length,2);
 assert.equal(strikes[0].result.damage,strikes[1].result.damage);
 assert.equal(strikes.filter(event=>event.result.ancestralAid).length,1);
 assert.equal(a.stages.sp_attack,1);
 const before=b.hp;
 const finisher=doubleRound(battle,move(signature),1).find(event=>event.move?.id===signature);
 assert.equal(finisher.target,c);
 assert.equal(b.hp,before);
 assert.equal(a.stages.sp_attack,0);
}
{
 const [a,b]=fixture();
 a.uid='saved-merrigami';
 a.moves=[move(signature)];
 for(let i=0;i<3;i++)use(a,b,move(465));
 const memory=new Map();
 globalThis.localStorage={getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value)};
 try{
  selectSlot(1);
  writeSave({state:{party:[a],reserve:[],dead:[]}});
  const restored=readSave(1).state.party[0];
  assert.equal(restored.species.id,species.id);
  assert.equal(restored.moves[0].id,signature);
  assert.equal(restored.abilityState.dossier.ancestralAid,3);
  assert.equal(restored.stages.sp_attack,3);
 }finally{selectSlot(null);delete globalThis.localStorage;}
}
for(const stages of [{},{sp_attack:3},{sp_attack:6},{sp_attack:6,speed:6},{attack:6,defence:6,sp_attack:6,sp_defence:6,speed:6,accuracy:6,evasion:6}]){
 const [a,b]=fixture(),[control,other]=fixture();
 const charge=Object.values(stages).reduce((sum,n)=>sum+n,0);
 a.stages={...stages,accuracy:stages.accuracy??-1};control.stages={...a.stages};
 const result=use(a,b,move(signature),.5);
 const expected=use(control,other,{...move(signature),id:99000,power:70+charge*10},.5);
 assert.equal(result.damage,expected.damage);
 assert.equal(result.phantomCharge,charge);
 assert.equal(a.stages.accuracy,stages.accuracy?0:-1);
 assert(Object.values(a.stages).every(n=>n<=0));
 assert(!result.ancestralAid);
 assert.equal(a.abilityState.dossier.ancestralAid,0);
 assert(use(a,b,move(465)).ancestralAid);
}
for(const kind of ['missed','immune','blocked','skipped']){
 const [a,b]=fixture(kind==='immune'?'NORMAL':'FIGHTING');
 a.stages={sp_attack:3,accuracy:kind==='missed'?-4:0};
 a.abilityState.dossier={ancestralAid:3};
 if(kind==='blocked')b.moveState.protection=true;
 if(kind==='skipped')a.flinched=true;
 const m=move(signature),result=use(a,b,m);
 assert(result[kind],kind);
 assert.equal(a.stages.sp_attack,kind==='skipped'?3:0);
 assert.equal(a.abilityState.dossier.ancestralAid,kind==='skipped'?3:0);
 assert.equal(m.left,kind==='skipped'?10:9);
}
{
 const a=instance(species,1,[]);
 a.uid='merrigami-test';a.growthSeed='merrigami-test';
 const snapshots={};
 for(let i=2;i<=200;i++){
  a.exp=100;assert(growLevel(a));
  if([25,33,60,100,200].includes(i))snapshots[i]=[a.stats.sp_attack,a.stats.speed,a.stats.attack];
 }
 assert(Object.values(snapshots).every(([special,speed,attack])=>special>attack&&speed>attack));
 a.exp=100;assert.equal(growLevel(a),null);
 console.log('Seeded growth at levels 25/33/60/100/200, Sp. Atk / Speed / Attack',snapshots);
}
const art=ACTION_ART[signature];
assert.equal(art.sourceId,signature);
assert.equal(art.frames,16);
assert.equal(effectSpec(move(signature)).duration,850);
assert(effectHTML(move(signature),{phantomCharge:8}).includes('data-phantom-charge="full"'));
assert(fs.statSync('dist/'+art.src).size>1000);
assert(fs.readFileSync('dist/offline-assets.js','utf8').includes(JSON.stringify(art.src)));
console.log('PASS: Merrigami dossier, Ancestral Aid, Phantom Falchion, stable IDs and offline artwork.');
