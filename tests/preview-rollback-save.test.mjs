import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {STAT_KEYS,growthPercent,inheritedGrowthBonus} from '../dist/progression.js';
import {validateNurseryItems,validBreedingEffects,prepareBreedingEffects,NURSERY_ITEMS} from '../dist/breeding-items.js';
import {validateNurserySnapshot,hatchBreedingEgg} from '../dist/breeding.js';
const bird=DATA.species.find(s=>s.name==='Wickowl');assert(bird);
const stats=STAT_KEYS.map(stat=>({stat,baseline:growthPercent(bird,stat),rate:growthPercent(bird,stat)+40}));
const effect={version:1,charm:false,warmer:false,enhancer:'spindle',threadStat:null,sealParent:null};
assert(validBreedingEffects(effect),'preview Spindle egg effects must remain recognized');
assert(!prepareBreedingEffects({nurseryItems:{confluenceSpindle:1}},{enhancer:'spindle'}).ok,'rollback must not offer new Spindle eggs');
assert(!NURSERY_ITEMS.some(i=>i.id==='confluenceSpindle'),'rollback removes new purchasable item');
const s={nurseryItems:{confluenceSpindle:2},party:[],reserve:[],nursery:{version:1,serial:1,hatched:[],eggs:[{
 id:'egg-1',serial:1,seed:42,speciesId:bird.id,parents:['a','b'],parentSpecies:[bird.id,bird.id],selectedParent:0,abilitySlot:'primary',shiny:false,remaining:0,total:512,breedingEffects:effect,
 inheritance:{version:2,speciesId:bird.id,donorIndex:1,growth:null,lineageGrowth:stats,moveId:null}
}]}};
validateNurseryItems(s);validateNurserySnapshot(s);
const copy=JSON.parse(JSON.stringify(s));validateNurserySnapshot(copy);
const hatched=hatchBreedingEgg(copy,'egg-1',(speciesId,level,seed)=>({uid:'rollback-hatched',species:DATA.species.find(x=>x.id===speciesId),level,moves:[],hp:10}));
assert(hatched&&hatched.uid==='rollback-hatched');assert.equal(copy.nursery.eggs.length,0);
assert.equal(copy.nurseryItems.confluenceSpindle,2,'inert item ownership is preserved');
assert.equal(STAT_KEYS.filter(stat=>inheritedGrowthBonus(hatched,stat)>0).length,6,'inherited Prodigy stats survive the rollback without rerolls');
validateNurserySnapshot(copy);
console.log('PASS: preview-owned items remain inert, preview-created Spindle egg survives reload/hatches with all Prodigy stats, original gameplay retains no new Spindle mode');
