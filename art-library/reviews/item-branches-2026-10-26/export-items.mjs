import fs from 'node:fs';
import {HELD_ITEMS} from '../../../dist/held-data.js';
import {EVOLUTION_ITEMS} from '../../../dist/evolution-items.js';
import {itemIcon,itemArt} from '../../../dist/item-art.js';
const file=new URL('./items.json',import.meta.url),d=JSON.parse(fs.readFileSync(file,'utf8')),seen=new Set(d.items.map(i=>i.id));
for(const i of [...HELD_ITEMS,...EVOLUTION_ITEMS])if(!seen.has(i.id)){const art=itemArt(i.id);if(!art)throw Error(i.id);d.items.push({id:i.id,name:i.name,category:i.effect?.berry?'Berries':i.id.startsWith('ITEM_')?'Evolution':'Held items',text:i.effect_text,price:i.buy_price,src:art.src,icon:itemIcon(i.id)});seen.add(i.id);}
fs.writeFileSync(file,JSON.stringify(d,null,2));console.log('Gallery entries:',d.items.length);
