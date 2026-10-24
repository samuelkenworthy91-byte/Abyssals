import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {instance} from '../dist/engine.js';
import {STAT_KEYS,growthPercent,unitGrowthRates,inheritedGrowthRate,inheritedGrowthBonus,prodigyMultiplier,prodigyGrowthBonus,growLevel} from '../dist/progression.js';
import {inheritanceOptions,rollInheritance,validateInheritance,inheritanceSummaryHTML} from '../dist/breeding-inheritance.js';
import {TRAINER_PRODIGIES,withTrainerProdigies,trainerProdigyWarning,initializeTrainerGrowth} from '../dist/trainer-prodigies.js';
import {COSSENNE_TRAINERS} from '../dist/cossenne-data.js';
import {MARASEN_TRAINERS} from '../dist/marasen-data.js';
import {BOTRUNE_TRAINERS} from '../dist/botrune-data.js';
import {FINALE_TRAINERS} from '../dist/finale-data.js';
import {makeLeaderRematch} from '../dist/leader-outcomes.js';
const species=id=>DATA.species.find(s=>s.id===id),rates=attack=>Object.fromEntries(STAT_KEYS.map(k=>[k,k==='attack'?attack:50]));
const u=instance({...species('001'),growth_percent:rates(40)},1,[]);u.uid='prodigy-three-stage';
u.breedingInheritance={version:2,speciesId:'001',donorIndex:1,growth:{stat:'attack',baseline:40,donorRate:90,rate:90},lineageGrowth:[],moveId:null};
const birthRecord=JSON.stringify(u.breedingInheritance),statsBefore=JSON.stringify(u.stats);
assert.equal(unitGrowthRates(u).attack,90);assert.equal(prodigyMultiplier(u),1);
u.species={...species('002'),growth_percent:rates(90)};u.evolutionHistory=[{from:'001',to:'002',level:20}];
assert.equal(unitGrowthRates(u).attack,190);assert.equal(prodigyMultiplier(u),2);
u.species={...species('003'),growth_percent:rates(120)};u.evolutionHistory.push({from:'002',to:'003',level:40});
assert.equal(unitGrowthRates(u).attack,270);assert.equal(prodigyMultiplier(u),3);
assert.equal(inheritedGrowthRate(u,'attack'),90);assert.equal(inheritedGrowthBonus(u,'attack'),50);assert.equal(prodigyGrowthBonus(u,'attack'),150);
assert.equal(JSON.stringify(u.breedingInheritance),birthRecord);assert.equal(JSON.stringify(u.stats),statsBefore,'reading rates never rewrites earned stats');
assert.equal(unitGrowthRates(u).defence,50);assert.equal(unitGrowthRates(JSON.parse(JSON.stringify(u))).attack,270);
assert(inheritanceSummaryHTML(u).includes('original bonus +50 × 3 = +150'));
u.trainingEffects=[{stat:'attack',remaining:5}];assert.equal(unitGrowthRates(u).attack,290);delete u.trainingEffects;
u.level=40;u.exp=100;const grown=growLevel(u);assert(grown.rows.find(r=>r.key==='attack').gain>=2,'overflow growth affects actual stats');
assert.equal(prodigyMultiplier(u),3,'level-up does not add another copy');
// Older single-stat records, overlapping lineage entries and multiple stats.
const legacy=structuredClone(u);legacy.breedingInheritance.version=1;delete legacy.breedingInheritance.lineageGrowth;
assert.equal(unitGrowthRates(legacy).attack,270);
u.breedingInheritance.lineageGrowth=[{stat:'attack',baseline:40,rate:70},{stat:'speed',baseline:50,rate:65}];
assert.equal(unitGrowthRates(u).attack,270,'same-stat records use the strongest bonus once');assert.equal(unitGrowthRates(u).speed,95);
const child=species('001'),baseline=growthPercent(child,'attack'),options=inheritanceOptions(child,u),offer=options.growth.find(g=>g.stat==='attack');
assert.equal(offer.donorRate,baseline+50,'donor passes original +50, not the stacked +150 or evolved species growth');assert(offer.prodigy);
const plan={stat:'attack',moveId:null},passed=rollInheritance(child,u,1,plan,()=>.1),missed=rollInheritance(child,u,1,plan,()=>.99);
validateInheritance(passed,child,0);assert.equal(passed.growth.rate-baseline,50);assert.equal(missed.growth,null);
// Independent family carryover likewise retains the original, unstacked rate.
const lineage=rollInheritance(child,u,1,{stat:'',moveId:null},()=>.1,u);assert.equal(lineage.lineageGrowth.find(g=>g.stat==='attack').rate,baseline+50);
const trainers=[...COSSENNE_TRAINERS,...MARASEN_TRAINERS,...BOTRUNE_TRAINERS,...FINALE_TRAINERS];
for(const [id,policy] of Object.entries(TRAINER_PRODIGIES)){
 const raw=trainers.find(t=>t.id===id);assert(raw,id+' must be a playable trainer');const before=JSON.stringify(raw),t=withTrainerProdigies(raw);
 assert.equal(t.team.filter(s=>s.prodigy).length,policy.count,id);assert.equal(JSON.stringify(raw),before,'do not mutate canonical rosters');
 assert.deepEqual(withTrainerProdigies(t),t,'preparation is idempotent');const warning=trainerProdigyWarning(t);assert(warning.startsWith('Warning:'));
 for(const slot of t.team.filter(s=>s.prodigy)){
  assert(warning.includes(species(slot.species_id).name));
  const create=()=>{const n=instance(species(slot.species_id),slot.level,[]);n.uid=t.id+'-'+slot.slot;return initializeTrainerGrowth(n,slot);};
  const n=create();assert.equal(n.species.id,slot.species_id);assert.equal(n.level,slot.level);assert.equal(n.hp,n.maxHp);assert.deepEqual(n.stats,create().stats,'fixed trainer growth survives decline and retry');
  assert.equal(inheritedGrowthBonus(n,slot.prodigy.stat),policy.bonus);
  assert.equal(prodigyGrowthBonus(n,slot.prodigy.stat),policy.bonus*(n.evolutionHistory.length+1));
  const saved=JSON.parse(JSON.stringify(n));assert.deepEqual(unitGrowthRates(saved),unitGrowthRates(n));assert.deepEqual(saved.stats,n.stats);
 }
}
const early={id:'TRN-C01-003',team:[{slot:1,species_id:'001',level:10}]};assert.equal(withTrainerProdigies(early),early);assert.equal(trainerProdigyWarning(early),'');
const hell=withTrainerProdigies({id:'HELL-TEST',name:'Hell challenger',arc:'hell',team:[{slot:1,species_id:'003',level:120},{slot:2,species_id:'006',level:120},{slot:3,species_id:'009',level:120}]});
assert.equal(hell.team.filter(s=>s.prodigy).length,2);assert(hell.team.filter(s=>s.prodigy).every(s=>s.prodigy.bonus===50));assert(trainerProdigyWarning(hell).includes('Prodigies'));
const rematch=makeLeaderRematch({fates:{'LDR-08':'SPARED'}},trainers.find(t=>t.id==='LDR-08'));assert.equal(withTrainerProdigies(rematch).team.filter(s=>s.prodigy).length,3);
console.log('PASS: 90/190/270 three-stage growth, immutable birth bonus, overflow rolls, legacy saves, independent stats, additive draughts, breeding without evolution inflation, all eight trainer policies, named warnings, deterministic battle stats and Hell/rematch policies');

