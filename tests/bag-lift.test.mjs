import assert from 'node:assert/strict';
import fs from 'node:fs';
import {itemArt,codexIcon} from '../dist/item-art.js';
import {HELD_ITEMS} from '../dist/held-data.js';
import {EVOLUTION_ITEMS} from '../dist/evolution-items.js';
import {NURSERY_ITEMS} from '../dist/breeding-items.js';
import {shopStock,GENERAL_STORES} from '../dist/shopkeepers.js';
import {NEW_MAPS,newBlocked} from '../dist/expansion-world.js';
for(const item of [...HELD_ITEMS,...EVOLUTION_ITEMS,...NURSERY_ITEMS]){
 const art=itemArt(item.id);assert(art,item.id+' missing icon');assert(fs.existsSync(new URL('../dist/'+art.src,import.meta.url)));
}
for(const room of [...GENERAL_STORES,'marasenMarket','cossenneConservatory','cossenneApothecary','cossenneFirewatch']){
 const stock=shopStock(room,{generalStoreSupplies:['patientRations'],questUnlocks:{winterRecipe:true}});
 assert(!stock.some(i=>i.key==='patientRations'));
 for(const i of stock){assert(i.icon||itemArt(i.key),i.key+' missing shop icon');}
}
for(let floor=0;floor<6;floor++){
 const room='marasenExchange'+floor,m=NEW_MAPS[room],lifts=m.gates.filter(g=>g.action==='marasen-lift');assert.equal(lifts.length,1);const lift=lifts[0];assert(!newBlocked(room,lift.x,lift.y));assert(!newBlocked(room,floor?24:31,26));assert(!m.gates.some(g=>g.action==='marasen-directory'));
 if(!floor)assert(m.gates.some(g=>g.to==='marasen'),'ground-floor exit preserved');
}
assert.notEqual(codexIcon({type_id:'FIRE'}),codexIcon({type_id:'WATER'}));
console.log('PASS: every held/evolution/nursery item and shop supply has artwork; Patient Rations absent from every shop; all six lift entrances and arrivals are safe.');
