import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../art-library/reviews/item-branches-2026-10-26/',import.meta.url),read=n=>JSON.parse(fs.readFileSync(new URL(n,root),'utf8'));
const {items}=read('items.json'),p=read('proposals.json');assert.equal(items.length,308);assert.equal(items.filter(i=>i.category==='Codexes').length,191);assert(!items.some(i=>i.name.includes('Patient Ration')));assert.equal(new Set(items.map(i=>i.id)).size,items.length);
for(const i of items)assert(fs.existsSync(new URL('../dist/'+i.src,import.meta.url)),i.name);
assert.equal(p.creatures.length,10);assert.equal(p.creatures.filter(c=>c.item).length,8);assert.equal(new Set(p.creatures.filter(c=>c.item).map(c=>c.item.id)).size,8);
for(const c of p.creatures){assert.equal(c.stats.length,6);assert.equal(c.growth.length,6);assert(fs.existsSync(new URL('art/'+c.id+'.webp',root)));if(c.item){assert(fs.existsSync(new URL('art/'+c.item.id+'.webp',root)));assert.equal(c.stats.reduce((a,b)=>a+b,0),c.family==='fox'?520:560);}}
assert.equal(p.evolutionRules.flask.minimumLevel,40);assert.equal(p.evolutionRules.flask.region,'Hell');assert.equal(p.evolutionRules.flask.experienceMultiplier*2,1);assert(!p.evolutionRules.fox.reputationLock);
console.log('PASS: 308 unique pictured entries, 191 codexes, 10 complete creature proposals and eight item branches; final level 40 / Hell / half-EXP rules and equal within-family base-stat totals.');
