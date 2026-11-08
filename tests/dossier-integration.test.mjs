import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DATA} from '../dist/data.js';
import {DOSSIER_CONFIG as C} from '../dist/dossier-config.js';
import {DOSSIER_IDS as I,DOSSIER_EVOLUTIONS,NECTARBANE_ID} from '../dist/dossier-data.js';
import {ABILITIES} from '../dist/ability-data.js';
import {instance,applyMove,cleanupRound,turnOrder} from '../dist/engine.js';
import {beginAbilities,enterAbility,leaveAbility,critChance,effectiveStage,inflictStatus,restoreHP,abilityBattle} from '../dist/abilities.js';
import {healDossierMove,attemptDossierSwitch,prepareDossierAction} from '../dist/dossier-battle.js';
import {dossierEncounterRoute,DOSSIER_TRADE_ONLY,tradeReceiptKey} from '../dist/dossier-encounters.js';
import {SIDE_CONTENT} from '../dist/exploration-data.js';
import {exchangeAbyssal} from '../dist/exploration-rules.js';
import {breedable,breedingPair} from '../dist/breeding.js';
import {eligibleEvolutions,promote} from '../dist/evolution.js';
import {EVOLUTION_ITEMS} from '../dist/evolution-items.js';
import {SHINY_PALETTES} from '../dist/shiny-palettes.js';
import {effectHTML} from '../dist/effects.js';
const make=(name,slot='primary')=>{const species=DATA.species.find(s=>s.id===I[name]||s.id===name);assert(species,name);const u=instance(species,50,[]);u.uid=name+'-'+Math.random();u.stats={hp:1000,attack:100,defence:100,sp_attack:100,sp_defence:100,speed:100};u.hp=u.maxHp=1000;u.abilitySlot=slot;return u;};
const move=id=>{const m=DATA.moves.find(m=>m.id===id);assert(m,'Move '+id);return {...m,left:m.pp};};
const use=(a,b,id,r=()=>.5)=>applyMove(a,b,move(id),r,{floor:0});
const fixture=(aName,bName='001',slot='primary')=>{const a=make(aName,slot),b=make(bName);beginAbilities(a,[b],[a],{});return [a,b];};
assert.equal(C.species.length,55);assert.equal(DATA.species.length,573);assert.equal(new Set(DATA.species.map(s=>s.id)).size,573);assert.equal(new Set(C.species.map(s=>s.name.toLowerCase())).size,55);for(const s of C.species)assert.equal(DATA.species.filter(x=>x.name.toLowerCase()===s.name.toLowerCase()).length,1,s.name);
for(const s of C.species){assert.equal(Object.values(s.base_stats).reduce((a,b)=>a+b,0),s.bst,s.name);assert(Object.values(s.growth_percent).every(n=>Number.isFinite(n)&&n>=10&&n<=120));for(const name of Object.values(s.ability_names))assert(ABILITIES.some(a=>a.name===name),name);const rows=DATA.learnsets.filter(l=>l.species_id===s.id);assert(rows.some(l=>l.level===1&&DATA.moves.find(m=>m.id===l.move_id)?.power),s.name+' usable hatch move');for(const l of rows){const m=DATA.moves.find(m=>m.id===l.move_id);assert(m);assert(!m.signature_owner_family||m.signature_owner_family===s.family_id,s.name+' exclusive move leak');}assert(fs.statSync('dist/assets/'+s.id+'.webp').size>1000);assert(SHINY_PALETTES[s.id],s.name+' shiny');assert(breedable(make(s.id)));}
assert.equal(DOSSIER_EVOLUTIONS.length,28);
// Move-based doubling, per-action ceiling, allied scope, held multiplier and passive exclusion.
{
 const[a,b]=fixture('Thornexus');a.hp=1;use(a,b,96);assert.equal(a.hp,751);
 a.hp=1;const ctx={};healDossierMove(a,a,600,ctx);healDossierMove(a,a,600,ctx);assert.equal(a.hp,751);
 a.hp=1;restoreHP(a,100);assert.equal(a.hp,101,'passives not doubled');
 const ally=make('Luton');beginAbilities(a,[b],[a,ally],{});ally.side='player';enterAbility(ally,b,{party:[a,ally],field:a.field});ally.hp=1;use(ally,b,96);assert.equal(ally.hp,751,'active ally gets aura');b.hp=1;use(b,a,11);assert.equal(b.hp,251,'enemy receives no aura');
 a.hp=1;a.heldDefinition={effect:{operation:'healing_received',multiplier:1.5}};use(a,b,96);assert.equal(a.hp,751,'cap is after held multipliers');
}
// Nectarbane heals only after a newly applied eligible poison.
{
 const[a,b]=fixture('Thornexus');a.hp=100;use(a,b,NECTARBANE_ID,()=>.1);assert.equal(b.status,'POISON');assert.equal(a.hp,350);use(a,b,NECTARBANE_ID,()=>.1);assert.equal(a.hp,350);
 const steel=make('Ferrub');beginAbilities(a,[steel],[a],{});a.hp=100;use(a,steel,NECTARBANE_ID,()=>.1);assert.equal(a.hp,100);assert(!steel.status);assert(effectHTML(move(NECTARBANE_ID)).includes('810-nectarbane'));
}
// Terrain setter is live, shared and timed; Static Field retains paralysis.
{
 const[a,b]=fixture('Voltinix');assert.equal(a.field.terrain,'ELECTRIC');assert.equal(a.field.terrainTurns,5);assert.equal(a.stages.speed||0,0);
 use(b,a,71);assert.equal(a.field.terrain,'ELECTRIC');assert(b.field.moveFields);assert.equal(inflictStatus(b,'SLEEP',[],()=>.5),false,'Electric Terrain prevents new sleep for grounded targets');
 for(let n=0;n<5;n++)cleanupRound(a,b,()=>.99);assert.equal(a.field.terrain,null);assert.equal(a.stages.speed||0,0);
 const c=make('001');c.species={...c.species,ability_names:{primary:'World Anchor'}};beginAbilities(a,[c],[a],{});assert.notEqual(a.field.terrain,'ELECTRIC');
}
// Guaranteed and ordinary crit rules preserve the existing cap.
{
 const[a,b]=fixture('Roguorchid');a.stats.speed=1e5;for(let n=0;n<4;n++)use(a,b,23,()=>.5);assert(critChance(a,move(23),b)<=.5);a.stages.accuracy=-1;use(a,b,23,()=>.999);assert.equal(a.abilityState.dossier.chain,0);leaveAbility(a,{switching:true});enterAbility(a,b,{party:[a],field:b.field});assert(!a.abilityState.dossier.chain);
}
// A boosted contact Electric action cannot recharge its own Dynamo.
{
 const[a,b]=fixture('Voltoceros');use(a,b,64);assert.equal(a.abilityState.dossier.dynamo,3);use(a,b,64);assert.equal(a.abilityState.dossier.dynamo,0);use(a,b,64);assert.equal(a.abilityState.dossier.dynamo,3);
}
// Fuel survives only two subsequent actions; Thundercoil counts actions, not hits.
{
 const[a,b]=fixture('Blazebramble','001','hidden');use(a,b,79);assert.equal(a.abilityState.dossier.fuel,2);use(a,b,93);assert.equal(a.abilityState.dossier.fuel,1);use(a,b,93);assert.equal(a.abilityState.dossier.fuel,0);
 const[c,d]=fixture('Thunderbasilisk','001','hidden');const multi={...move(64),hits:{min:2,max:2}};applyMove(c,d,multi,()=>.5,{floor:0});assert.equal(c.abilityState.dossier.coils,1);use(c,d,64);assert.equal(c.abilityState.dossier.coils,2);use(c,d,64);assert.equal(c.abilityState.dossier.coils,0);
}
// Snowshroud is an effective modifier, never a permanent stage mutation.
{
 const[a,b]=fixture('Gratzel');a.field.weather='HAIL';assert.equal(effectiveStage(a,'evasion',b),1);assert(!a.stages.evasion);a.stages.evasion=6;assert.equal(effectiveStage(a,'evasion',b),6);a.field.weather=null;assert.equal(effectiveStage(a,'evasion',b),6);
}
// Third Eye is priority once per entry, not every turn.
{
 const[a,b]=fixture('Omenluna');a.stats.speed=1;b.stats.speed=100;assert.equal(turnOrder(a,b,move(206),move(8),()=>.5)[0],'player');use(a,b,206);assert.equal(turnOrder(a,b,move(206),move(8),()=>.5)[0],'enemy');
}
// Failed web roll consumes no RNG during queries; forced/scripted switches bypass it.
{
 const[a,b]=fixture('Luton','Sapphyrax');let calls=0;const random=()=>{calls++;return .5;};assert.equal(attemptDossierSwitch(a,[b],{random}),false);assert.equal(calls,1);assert(attemptDossierSwitch(a,[b],{random,forced:true}));assert(attemptDossierSwitch(a,[b],{random,scripted:true}));assert.equal(calls,1);b.hp=0;assert(attemptDossierSwitch(a,[b],{random}));
}
// Trade-only descendants never leak into encounters and the overlay is idempotent.
{
 for(const room of ['reedSanctuary','moonlitDepths','orchardCanopy','waranCave1']){const route={room,tables:[{phase:'DAY',slots:[{species_id:I.Brookisk,weight:10},{species_id:'001',weight:90,min_level:10,max_level:10}]}]};const r=dossierEncounterRoute(route);assert.deepEqual(dossierEncounterRoute(r),r);assert.equal(r.tables[0].slots.reduce((n,s)=>n+s.weight,0),100);assert(!r.tables[0].slots.some(s=>DOSSIER_TRADE_ONLY.has(s.species_id)));}
 const c=SIDE_CONTENT.find(c=>c.room==='reedSanctuary'),old=make('152'),state={party:[old],reserve:[],exploration:{trades:[c.id]},leadUid:old.uid};const result=exchangeAbyssal(state,c,old.uid,(s,l)=>({...instance(s,l,[move(53)]),uid:'new-trade'}));assert(result);assert.equal(result.species.id,I.Brookisk);assert(state.exploration.trades.includes(c.id));assert(state.exploration.trades.includes(tradeReceiptKey(c)));assert.equal(exchangeAbyssal(state,c,result.uid,()=>null),null);
}
// All evolution paths stay save-stable and item evolution has a real source/item.
{
 const a=make('Voltisl');a.evolutionBlockedLevel=49;const st={evolutionItems:{ITEM_DOSSIER_THUNDER_SHARD:1}};const path=eligibleEvolutions(a,st,'ITEM_DOSSIER_THUNDER_SHARD')[0];assert(path);assert.equal(path.to_species_id,I.Thunderaze);assert(EVOLUTION_ITEMS.some(i=>i.id==='ITEM_DOSSIER_THUNDER_SHARD'));
 assert(breedingPair(make('Brookisk'),make('Torravyr')).ok);
}
console.log('PASS: 55 species, growth/learnsets/assets/shinies, capped allied recovery, poison-heal success, terrain, crit cap, contact charges, once-per-action hooks, web exceptions, old-save trades and item evolution.');
