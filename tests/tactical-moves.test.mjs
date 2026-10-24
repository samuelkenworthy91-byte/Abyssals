import {canonicalMoveId} from '../dist/teamcraft-data.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DATA} from '../dist/data.js';
import {TACTICAL_MOVES,TACTICAL_BRANCH_LEARNSETS} from '../dist/tactical-moves.js';
import {RELIC_BRANCHES} from '../dist/relic-family.js';
import {instance,applyMove} from '../dist/engine.js';
import {beginAbilities} from '../dist/abilities.js';
import {bindMenagerieParty} from '../dist/menagerie-rules.js';
import {canLearnScroll} from '../dist/side-adventures.js';
import {exchangeScrolls} from '../dist/marasen-activities-ui.js';
import {MOVE_SCENES} from '../dist/move-scenes.js';
const get=id=>DATA.moves.find(m=>m.id===canonicalMoveId(id));
const unit=id=>instance(DATA.species.find(s=>s.id===id),70,[]);
assert.equal(TACTICAL_MOVES.length,32);
assert.equal(new Set(TACTICAL_MOVES.map(m=>m.id)).size,32);
assert.equal(TACTICAL_MOVES.filter(m=>m.hits).length,9);
for(const m of TACTICAL_MOVES){assert(get(m.id));if(canonicalMoveId(m.id)===m.id)assert.equal(get(m.id)?.name,m.name);assert(!m.signature_owner_family);assert(m.tutorTypes.length);assert(MOVE_SCENES[m.id]?.layers?.length, 'scene for '+m.name);}
assert.equal(RELIC_BRANCHES.length,18);
for(const b of RELIC_BRANCHES){const ids=TACTICAL_BRANCH_LEARNSETS[b.key];assert.equal(ids.length,3,'three role techniques for '+b.key);for(const [level,id] of ids){for(const speciesId of b.ids)assert(DATA.learnsets.some(l=>l.species_id===speciesId&&l.move_id===canonicalMoveId(id)&&(canonicalMoveId(id)!==id||l.level===level))||canLearnScroll(unit(speciesId),canonicalMoveId(id)),b.key+' retains learning or merged-codex access to '+id);}}
const shop=exchangeScrolls();for(const m of TACTICAL_MOVES)assert(shop.some(s=>s.id===String(canonicalMoveId(m.id))),m.name+' appears in general Codex shop');
const steelSpecies=DATA.species.find(s=>s.id!=='365'&&!RELIC_BRANCHES.some(b=>b.ids.includes(s.id))&&s.types.includes('STEEL'));
assert(steelSpecies);
assert(canLearnScroll(instance(steelSpecies,20,[]),538),'non-Rivet Steel species may learn shared multi-hit move');
{
 const a=unit('371'),foe=unit('010'),m={...get(538),left:get(538).pp};
 foe.hp=foe.maxHp=4000;foe.stats.defence=100;beginAbilities(a,[foe],[a],{});
 const before=foe.hp,r=applyMove(a,foe,m,()=>.5,{floor:0});
 assert(r.hitCount>=2&&r.hitCount<=4,'actual strike count');assert.equal(before-foe.hp,r.damage,'aggregate equals actual hits');assert(r.damage>0);assert.equal(m.left,get(538).pp-1,'one PP per multi-hit move');
 assert(r.messages.some(s=>s.includes('Hit '+r.hitCount)));
}
{
 const a=unit('481'),ally=unit('483'),foe=unit('010'),move={...get(568),left:get(568).pp};
 beginAbilities(a,[foe],[a,ally],{});ally.abilityState={flags:{}};bindMenagerieParty([a,ally]);
 applyMove(a,foe,move,()=>.5);
 assert.equal(a.stages.defence,1);assert.equal(a.stages.sp_defence,1);
 assert.equal(ally.stages.defence,1);assert.equal(ally.stages.sp_defence,1);
}
{
 const a=unit('487'),ally=unit('483'),foe=unit('010'),move={...get(549),left:get(549).pp};
 beginAbilities(a,[foe],[a,ally],{});bindMenagerieParty([a,ally]);
 a.hp=Math.floor(a.maxHp/2);ally.hp=Math.floor(ally.maxHp/2);
 const before=[a.hp,ally.hp];
 applyMove(a,foe,move,()=>.5);
 assert(a.hp>before[0]);assert.equal(ally.hp,before[1],'ordinary chorus does not heal benches');ally.abilityState={flags:{}};ally.side=a.side;applyMove(a,foe,{...get(549),left:3},()=>.5);assert(ally.hp>before[1],'heals a living active ally');
 ally.hp=0;applyMove(a,foe,{...get(549),left:8},()=>.5);assert.equal(ally.hp,0,'no revival');
}
{
 const a=unit('501'),foe=unit('010'),m={...get(559),left:1};beginAbilities(a,[foe],[a],{});
 a.hp=Math.floor(a.maxHp*.4);const before=m.left;
 const invalid=applyMove(a,foe,m,()=>.5);assert(invalid.skipped);assert.equal(m.left,before,'invalid HP cost does not spend PP');
 a.hp=a.maxHp;applyMove(a,foe,m,()=>.5);
 assert.equal(a.stages.attack,3);assert.equal(a.stages.sp_attack,3);assert.equal(a.stages.speed,3);
 assert.equal(a.stages.defence,-2);assert.equal(a.stages.sp_defence,-2);assert.equal(a.hp,a.maxHp-Math.max(1,Math.floor(a.maxHp/2)),'50% max-HP cost respects integer HP rounding');
}
const offline=fs.readFileSync('dist/offline-assets.js','utf8');
assert(offline.includes('"tactical-moves.js"'));
assert(offline.includes("'"+JSON.parse(fs.readFileSync("release-config.json","utf8")).version+"'"));
console.log('PASS: shared tactical pool, 18 selective learnsets, type tutors, scenes, multihit, ally buffs, healing and high-cost safeguards.');
