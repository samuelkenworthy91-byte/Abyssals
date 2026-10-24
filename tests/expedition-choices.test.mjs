import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {evolutionStage,matchesPartner} from '../dist/partner-filters.js';
import {holdCapturedPartner,placeCapturedPartner} from '../dist/capture-placement.js';
import {shopStock,unlockGeneralStore,migrateGeneralStores,SHOP_STOCK} from '../dist/shopkeepers.js';
import {CAVE_FLOORS} from '../dist/exploration-data.js';
import {caveRoute} from '../dist/exploration-rules.js';
import {expandEncounterRoute} from '../dist/roster-encounters.js';
const unit=(id,uid=id)=>({uid,species:DATA.species.find(s=>s.id===id),hp:1,maxHp:100,moves:[{pp:10,left:2}]});
assert.equal(evolutionStage('001'),0);assert.equal(evolutionStage('002'),1);assert.equal(evolutionStage('003'),2);assert.equal(evolutionStage('364'),'single');assert.equal(evolutionStage('366'),1);
const p=unit('003');p.nickname='Friend';const f={scope:'PARTY',type:'DARK',secondType:'FAIRY',stage:'2',search:'friend'};
assert(matchesPartner(p,f,[p]));assert(!matchesPartner(p,{...f,stage:'1'},[p]));assert(!matchesPartner(p,f,[]));assert(!matchesPartner(p,{...f,secondType:'WATER'},[p]));assert(matchesPartner(p,{...f,type:'FAIRY',secondType:'DARK'},[p]));
let state={party:[unit('010')],reserve:[],leadUid:'010'},caught=unit('021');assert(holdCapturedPartner(state,caught));assert.equal(state.party.length,1);assert(!holdCapturedPartner(state,caught));state=JSON.parse(JSON.stringify(state));assert(state.reserve[0].capturePlacementPending);assert(placeCapturedPartner(state,'021','reserve'));assert.equal(state.party.length,1);assert.equal(state.reserve[0].hp,100);assert(!placeCapturedPartner(state,'021','party'));
caught=unit('255');assert(holdCapturedPartner(state,caught));assert(placeCapturedPartner(state,'255','party'));assert.equal(state.party.length,2);assert.equal(state.party[1].hp,1);assert(!state.reserve.some(u=>u.uid==='255'));
state.party=Array.from({length:6},(_,i)=>unit('010','p'+i));caught=unit('349');holdCapturedPartner(state,caught);assert(!placeCapturedPartner(state,'349','party'));assert(placeCapturedPartner(state,'349','reserve'));assert.equal(state.party.length,6);
state={generalStoreSupplies:[]};const original=SHOP_STOCK.length;assert(!shopStock('shop',state).some(i=>i.key==='heartyFood'));unlockGeneralStore(state,'dorelemShop');state=JSON.parse(JSON.stringify(state));assert(shopStock('shop',state).some(i=>i.key==='heartyFood'));assert.equal(SHOP_STOCK.length,original);assert(!unlockGeneralStore(state,'marasenExchange2'));assert(!unlockGeneralStore(state,'cossenneApothecary'));assert(!shopStock('shop',state).some(i=>i.key==='slowStews'));unlockGeneralStore(state,'cossenneShop');assert(shopStock('shop',state).some(i=>i.key==='slowStews'));assert(!shopStock('cossenneConservatory',state).some(i=>i.key==='smoke'));
const old={};migrateGeneralStores(old,['town','dorelem']);assert(shopStock('shop',old).some(i=>i.key==='heartyFood'));const keys=[...old.generalStoreSupplies];migrateGeneralStores(old,['marasen']);assert.deepEqual(old.generalStoreSupplies,keys);
const seen=new Set();let lastLevel=0,lastPower=0;
for(const [i,floor] of CAVE_FLOORS.entries()){
 assert(floor.min>lastLevel);lastLevel=floor.max;const route=expandEncounterRoute(caveRoute(floor.room));assert.deepEqual(expandEncounterRoute(route),route);let power=0;
 const ids=new Set();for(const t of route.tables){assert.equal(t.slots.reduce((n,s)=>n+s.weight,0),100);assert.equal(t.slots.find(s=>s.species_id==='364').weight,i<3?3:5);for(const s of t.slots)if(s.species_id!=='364')ids.add(s.species_id);}
 for(const id of ids){const species=DATA.species.find(s=>s.id===id);assert(!seen.has(species.family_id),'Repeated family '+species.family_id);seen.add(species.family_id);power+=species.bst;}
 power/=ids.size;assert(power>lastPower,'Deeper floors have stronger species');lastPower=power;
 for(const id of floor.trainer)assert(ids.has(id));
}
assert.equal(seen.size,30);
console.log('PASS: combined filters, evolution branch depth, solo/full-party capture choices and reload, permanent general-store unlocks without specialist leakage, 30 disjoint fort families with ascending levels and species power.');
