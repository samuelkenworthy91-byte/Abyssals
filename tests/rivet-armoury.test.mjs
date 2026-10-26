import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DATA} from '../dist/data.js';
import {RELIC_BRANCHES,RELIC_ITEMS,RELIC_SPECIES,RELIC_MOVES,participantExpMultiplier} from '../dist/relic-family.js';
import {ARMOURY_BRANCHES,ARMOURY_MOVES} from '../dist/relic-armoury.js';
import {EVOLUTIONS} from '../dist/evolution-data.js';
import {EVOLUTION_ITEMS} from '../dist/evolution-items.js';
import {eligibleEvolutions,promote,promoteUsingItem,entryMoves,relearnPool} from '../dist/evolution.js';
import {claimQuestCore,buyQuestCore} from '../dist/relic-quest.js';
import {instance,applyMove} from '../dist/engine.js';
import {isSound} from '../dist/abilities.js';
import {MOVE_SCENES} from '../dist/move-scenes.js';
import {RELIC_ART,relicArtPath} from '../dist/relic-art.js';
import {SHINY_PALETTES} from '../dist/shiny-palettes.js';
import {startingStats} from '../dist/stat-balance.js';

const species=id=>DATA.species.find(s=>s.id===id);
const unit=(id='365',level=12)=>({...instance(species(id),level,[]),uid:'qa-'+id,evolutionHistory:[]});
assert.equal(RELIC_BRANCHES.length,18);assert.equal(RELIC_SPECIES.length,37);assert.equal(ARMOURY_BRANCHES.length,12);
assert.equal(new Set(RELIC_BRANCHES.map(b=>b.types.filter(t=>t!=='STEEL').join()||'STEEL')).size,18);
assert.equal(DATA.species.length,513);assert.equal(new Set(DATA.species.map(s=>s.id)).size,513);
assert.equal(new Set(DATA.moves.map(m=>m.id)).size,DATA.moves.length);
const offline=fs.readFileSync('dist/offline-assets.js','utf8');
for(const b of RELIC_BRANCHES){
 const core=RELIC_ITEMS.find(i=>i.name===b.item);assert(core);assert(EVOLUTION_ITEMS.some(i=>i.id===core.id));
 const state={money:20000,evolutionItems:{},relicQuest:{bellRestored:true,coreClaimed:null}};
 assert.equal(buyQuestCore(state,core.id),false,'shop stays quest-gated');
 assert(claimQuestCore(state,core.id));assert.equal(claimQuestCore(state,core.id),false,'free reward remains one-time');
 assert(buyQuestCore(state,core.id));assert.equal(state.money,10000);assert.equal(state.evolutionItems[core.id],2);
 let u=unit('365',11);assert.equal(eligibleEvolutions(u,state,core.id).length,0);
 u=unit();const path=eligibleEvolutions(u,state,core.id);assert.equal(path.length,1);assert.equal(path[0].to_species_id,b.ids[0]);
 assert.equal(u.species.id,'365','preview/cancel does not mutate');assert.equal(state.evolutionItems[core.id],2);
 const missing={evolutionItems:{}};assert.equal(promoteUsingItem(unit(),path[0],missing),null);
 const dead=unit();dead.dead=true;dead.hp=0;assert.equal(promoteUsingItem(dead,path[0],state),null);
 assert(promoteUsingItem(u,path[0],state));assert.equal(u.species.id,b.ids[0]);assert.equal(state.evolutionItems[core.id],1);
 assert.equal(promoteUsingItem(u,path[0],state),null,'cannot spend a second core on middle form');
 u.level=b.level-1;assert.equal(eligibleEvolutions(u,state).length,0);
 u.level=b.level;const final=eligibleEvolutions(u,state);assert.equal(final.length,1);assert.equal(final[0].to_species_id,b.ids[1]);
 assert(promote(u,final[0]));assert.equal(u.species.id,b.ids[1]);assert.equal(eligibleEvolutions(u,state).length,0);
 assert(entryMoves(u).some(r=>r.move_id===b.signatureId));assert(relearnPool(u).some(m=>m.id===b.signatureId));
 const saved=JSON.parse(JSON.stringify(u));saved.species=species(saved.species.id);assert.equal(saved.species.ability_names.primary,'Warbond');
 assert.equal(participantExpMultiplier([{participants:[saved.uid]}],[saved]),2);
 for(const id of b.ids){
  assert(RELIC_ART[id]);assert(fs.existsSync('dist/'+relicArtPath(id)));assert(offline.includes(relicArtPath(id)));
  assert.equal(SHINY_PALETTES[id],SHINY_PALETTES['365']);
  for(const row of DATA.learnsets.filter(l=>l.species_id===id))assert(DATA.moves.some(m=>m.id===row.move_id),'resolved move '+row.move_id);
 }
}
for(const b of ARMOURY_BRANCHES){
 assert(b.stats.reduce((n,v)=>n+v,0)<=535);assert(b.growth.reduce((n,v)=>n+v,0)<=350);
 assert.deepEqual(startingStats(species(b.ids[1])),Object.fromEntries(Object.entries(species(b.ids[1]).base_stats).map(([k,v])=>[k,Math.max(1,Math.round(v*(k==='hp'?.5:.2)))])));
}
for(const m of ARMOURY_MOVES){assert(MOVE_SCENES[m.id]?.layers.length);assert.equal(MOVE_SCENES[m.id].sequence,m.authored_visual_action);}
const psychic=RELIC_MOVES.find(m=>m.name==='Mindsteel Cleave');assert.equal(psychic.type_id,'PSYCHIC');assert.equal(psychic.category,'PHYSICAL');
const normal=ARMOURY_BRANCHES.find(b=>b.key==='normal');assert(species(normal.ids[1]).base_stats.sp_attack>species(normal.ids[1]).base_stats.attack);
for(const name of ['Carillon Cannon','Resonant Chime']){
 const m=RELIC_MOVES.find(m=>m.name===name);assert(isSound(m));assert.equal(m.category,'SPECIAL');assert.equal(m.contact,false);
 const a=unit(normal.ids[1],40),foe=unit('010',40);a.stats.sp_attack=100;foe.hp=1000;foe.maxHp=1000;foe.stats.sp_defence=100;
 assert(applyMove(a,foe,{...m,left:m.pp},()=>.5).damage>0);
 const shield=unit('010',40);shield.species={...shield.species,ability_names:{primary:'Soundproof'}};
 assert.equal(applyMove(unit(normal.ids[1],40),shield,{...m,left:m.pp},()=>.5).damage,0,'sound immunity is respected');
}
const oldSave={money:10000,relicQuest:{coreClaimed:'ITEM_RELIC_VIGIL',bellRestored:true},evolutionItems:{ITEM_RELIC_VIGIL:1}};
assert(buyQuestCore(oldSave,'ITEM_RELIC_CARILLON')===false,'unknown item IDs never charge money');
assert(buyQuestCore(oldSave,'ITEM_RELIC_NORMAL'));assert.equal(oldSave.evolutionItems.ITEM_RELIC_VIGIL,1);assert.equal(oldSave.money,0);
assert.equal(EVOLUTIONS.filter(e=>e.from_species_id==='365').length,18);
console.log('PASS: all 18 core choices/purchases, level gates, item consumption, final signatures/relearning, 24 new art/offline/shiny bindings, sound combat and existing-save shop access.');

