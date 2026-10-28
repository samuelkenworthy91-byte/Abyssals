import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {capturePreview} from '../dist/route-rules.js';
import {FORTIFIED_RATION,FORTIFIED_RATION_MODIFIER} from '../dist/fortified-ration.js';
import {shopStock,buySupplies} from '../dist/shopkeepers.js';
import {FINALE_ASSETS} from '../dist/finale-art.js';
import {NEW_MAPS} from '../dist/expansion-world.js';
assert.equal(FORTIFIED_RATION_MODIFIER,21);
const box=DATA.species.find(s=>s.id==='174');
assert(box&&/Box Legendary/i.test(box.power_class));
const target={species:box,level:102,hp:250,maxHp:1000,dead:false,status:null};
const p=capturePreview(target,FORTIFIED_RATION_MODIFIER);
assert(p.chance>.19&&p.chance<.21,'No-status quarter-HP Cruxwyrm should be about 20%');
assert(capturePreview(target,16).chance<p.chance,'Fixed-strength ration exceeds 16× food');
assert.equal(capturePreview(target,FORTIFIED_RATION_MODIFIER).chance,p.chance,'Capture chance does not ramp with turns');
for(const room of ['botruneShop','cayfenShop','ramelleShop'])assert(shopStock(room).some(i=>i.key===FORTIFIED_RATION.key),room);
assert(!shopStock('dorelemShop').some(i=>i.key===FORTIFIED_RATION.key));
const s={money:FORTIFIED_RATION.price*2,fortifiedRations:0};
assert(buySupplies(s,FORTIFIED_RATION,2));assert.equal(s.fortifiedRations,2);assert.equal(s.money,0);
for(const room of ['sporeRim','sporeDepths','sporeBridge','sporeGrotto','sporeCanopy']){
 const id=NEW_MAPS[room].finaleArt;
 assert(FINALE_ASSETS['finale-'+id]?.endsWith('.svg'),room+' should have individual SVG terrain');
}
assert(NEW_MAPS.ramelleFortress.spots.some(p=>p.id==='fn-fortress-custodian'));
console.log('PASS: 21× fixed ration, quarter-HP Cruxwyrm probability, town unlocks, and five distinct Sporefall environments');
