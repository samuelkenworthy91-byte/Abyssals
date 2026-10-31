import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DATA} from '../dist/data.js';
import {instance} from '../dist/engine.js';
import {eligibleEvolutions} from '../dist/evolution.js';
import {settleLeaderFateEvolutions} from '../dist/leader-outcomes.js';

const forms=[
 {base:'070',spared:'071',executed:'072',minimum:32,name:'Cairant'},
 {base:'073',spared:'074',executed:'075',minimum:30,name:'Flaggrim'},
 {base:'092',spared:'093',executed:'094',minimum:30,name:'Jerbune'}
];
let seq=0;
function unit(id,level,opts={}){
 const species=DATA.species.find(s=>s.id===id);
 assert(species,'Species '+id+' exists');
 const u=instance(species,level,[]);
 u.uid='alignment-'+(++seq);
 u.evolutionBlockedLevel=level; // Newly caught: no further level gained yet.
 return Object.assign(u,opts);
}
function state(fate,leader='LDR-01'){
 return {fates:{[leader]:fate},party:[],reserve:[],dead:[],rewardQueue:[],
  storyChoices:{cairant_oath_choice:'BROKEN',flaggrim_banner_choice:'TORN',jerbune_alliance_choice:'REJECTED'}};
}
// All eight leaders can awaken either moral path, independently of location.
for(let i=1;i<=8;i++)for(const fate of ['SPARED','EXECUTED']){
 const leader='LDR-'+String(i).padStart(2,'0'),s=state(fate,leader);
 s.party=forms.map(f=>unit(f.base,f.minimum));
 const expected=forms.map(f=>fate==='SPARED'?f.spared:f.executed);
 // Original story choices deliberately contradict the chosen leader outcome.
 const evolved=settleLeaderFateEvolutions(s,leader,fate);
 assert.deepEqual(s.party.map(u=>u.species.id),expected,leader+' / '+fate);
 assert.deepEqual(evolved.map(r=>r.to),expected);
 assert.equal(s.leaderFateEvolutionNotices.filter(x=>x.kind==='evolved').length,3);
 assert.equal(s.leaderFateEvolutionReceipts[leader].evolved.length,3);
 for(const u of s.party){
  assert.equal(u.evolutionHistory.length,1);
  assert.equal(u.evolutionBlockedLevel,u.level);
  assert(u.hp>0&&!u.dead);
 }
 assert.deepEqual(settleLeaderFateEvolutions(s,leader,fate),[],'Decision cannot replay');
 assert.equal(s.leaderFateEvolutionNotices.filter(x=>x.kind==='evolved').length,3,'No duplicate presentations');
 const loaded=JSON.parse(JSON.stringify(s));
 assert.deepEqual(settleLeaderFateEvolutions(loaded,leader,fate),[],'Save/reload is idempotent');
 assert.deepEqual(loaded.party.map(u=>u.species.id),expected,'Saved form is permanent');
}
// A below-threshold creature must still be in the party at a later city leader judgement.
for(const f of forms){
 const s=state('SPARED');
 s.party=[unit(f.base,f.minimum-1)];
 assert.deepEqual(settleLeaderFateEvolutions(s,'LDR-01','SPARED'),[]);
 assert.equal(s.party[0].species.id,f.base);
 s.party[0].level=f.minimum;
 s.fates['LDR-02']='EXECUTED';
 assert.equal(settleLeaderFateEvolutions(s,'LDR-02','EXECUTED').length,1);
 assert.equal(s.party[0].species.id,f.executed);
}
// Reserve, deceased and knocked-out units are never evolved by a leader fate.
for(const fate of ['SPARED','EXECUTED']){
 const s=state(fate);
 s.reserve=[unit('070',45)];
 s.dead=[unit('073',45,{dead:true,hp:0})];
 s.party=[unit('092',40,{hp:0}),unit('070',32)];
 assert.equal(settleLeaderFateEvolutions(s,'LDR-01',fate).length,1);
 assert.equal(s.reserve[0].species.id,'070');
 assert.equal(s.dead[0].species.id,'073');
 assert.equal(s.party[0].species.id,'092');
}
// Existing story flags alone can no longer trigger the affected branches.
for(const f of forms){
 const s=state('SPARED');const u=unit(f.base,f.minimum);
 u.evolutionBlockedLevel=f.minimum-1;
 assert.deepEqual(eligibleEvolutions(u,s),[],f.name+' requires an actual leader judgement');
}
// No non-leader event, missing fate, or mismatch may trigger an evolution.
for(const [id,fate,saved] of [['TRN-001','SPARED','SPARED'],['LDR-01','SPARED',undefined],['LDR-01','EXECUTED','SPARED']]){
 const s=state(saved);s.party=[unit('070',32)];
 assert.equal(settleLeaderFateEvolutions(s,id,fate).length,0);
 assert.equal(s.party[0].species.id,'070');
}
// Other evolution systems still work normally: Censmoke is stat-driven,
// Triskit uses items; neither receives an alignment event.
const c=unit('057',30);c.evolutionBlockedLevel=29;
assert(eligibleEvolutions(c).some(p=>p.condition.method==='STAT'));
const t=unit('115',30);t.evolutionBlockedLevel=29;
assert.equal(eligibleEvolutions(t).length,0);
assert.equal(eligibleEvolutions(t,{evolutionItems:{ITEM_EVOLUTION_TIDE_PEARL:1}},'ITEM_EVOLUTION_TIDE_PEARL').length,1);
// The app integration must capture leader fate writes through the central transaction
// and present saved result cards only after dialogue / on reload.
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
assert.match(app,/!backup\.fates\?\.\[id\].*settleLeaderFateEvolutions\(state,id,fate\)/);
assert.match(app,/fn\?\.\(\);refresh\(\);persist\(\);showLeaderFateEvolutionResults\(\)/);
assert.match(app,/state\.leaderFateEvolutionNotices\?\.length&&!state\.rewardQueue\?\.length\)showLeaderFateEvolutionResults\(\)/);
console.log('PASS: eight leaders, both aligned branches of all three families, one-time party-only evolution, legacy flags, save/reload, level gates and retained non-story evolutions');
