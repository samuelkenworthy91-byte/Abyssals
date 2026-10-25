import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {rootForm} from '../dist/route-roster.js';
import {STAT_KEYS,growthPercent,inheritedGrowthBonus,unitGrowthRates,hashSeed} from '../dist/progression.js';
import {familyProdigyOptions,familyProdigyChance,rollFamilyProdigies,rollInheritance,validateInheritance,breedingPlanHTML,PRODIGY_INHERITANCE_CHANCE} from '../dist/breeding-inheritance.js';
import {createBreedingEgg,hatchBreedingEgg,validateNurserySnapshot} from '../dist/breeding.js';
const bird=DATA.species.find(s=>s.name==='Wickowl');assert(bird);
const species=DATA.species.find(s=>s.id===rootForm(bird.id));
function parent(uid,bonuses,form=species){return {uid,species:form,hp:10,maxHp:10,level:1,moves:[],abilitySlot:'primary',breedingInheritance:{version:2,speciesId:species.id,donorIndex:1,growth:null,moveId:null,lineageGrowth:Object.entries(bonuses).map(([stat,bonus])=>({stat,baseline:growthPercent(species,stat),rate:growthPercent(species,stat)+bonus}))}};}
const a=parent('defence',{defence:50}),b=parent('speed',{speed:60});
for(const [family,donor] of [[a,b],[b,a]]){
 for(const stat of ['',undefined,'speed','defence']){
  const options=rollInheritance(species,donor,1,{stat:stat===undefined?undefined:stat,moveId:null},()=>0,family);
  // A selected stat absent from the donor's options remains invalid as before.
  if(!options)continue;
  validateInheritance(options,species,0);
  assert.deepEqual(options.lineageGrowth.map(g=>g.stat),['defence','speed']);
  const child={species,breedingInheritance:options};assert.equal(inheritedGrowthBonus(child,'defence'),50);assert.equal(inheritedGrowthBonus(child,'speed'),60);
 }
 const missed=rollInheritance(species,donor,1,{stat:'',moveId:null},()=>.999,family);assert.equal(missed.lineageGrowth.length,0);assert.equal(missed.growth,null);
 const html=breedingPlanHTML(species,donor,0,family);assert(html.includes('Defence'));assert(html.includes('Speed'));assert(html.includes('33.176%'));assert(html.includes('1 in 750'));assert(!html.includes('<option value="speed">'));assert(!html.includes('<option value="defence">'));
}
const all=Object.fromEntries(STAT_KEYS.map(k=>[k,50]));
for(const split of [1,3,5]){
 const first=parent('a',Object.fromEntries(Object.entries(all).slice(0,split))),second=parent('b',Object.fromEntries(Object.entries(all).slice(split)));
 const record=rollInheritance(species,second,1,{stat:'',moveId:null},()=>0,first);validateInheritance(record,species,0);assert.equal(record.lineageGrowth.length,6);assert.equal(record.growth,null);
}
const stronger=parent('strong',{defence:80,speed:20});
const pool=familyProdigyOptions(species,stronger,a);assert.equal(pool.find(g=>g.stat==='defence').rate-growthPercent(species,'defence'),80);
let calls=0;rollFamilyProdigies(pool,()=>{calls++;return 0;});assert.equal(calls,3,'each carrier rolls separately, even after success');
const defence=pool.filter(row=>row.stat==='defence');
for(const [rolls,bonus] of [[[0,.99],50],[[.99,0],80],[[0,0],80],[[.99,.99],0]]){
 let i=0;const result=rollFamilyProdigies(defence,()=>rolls[i++]);assert.equal(i,2);assert.equal(result.length,bonus?1:0);if(bonus)assert.equal(result[0].rate-result[0].baseline,bonus);
}
assert(Math.abs(familyProdigyChance(defence[0])-(1-(1-PRODIGY_INHERITANCE_CHANCE)**2))<1e-15);
assert(breedingPlanHTML(species,stronger,0,a).includes('55.345%'));
const evolved=parent('evolved',{defence:50},DATA.species.find(s=>s.id===species.id));evolved.evolutionHistory=[{from:'001',to:'002'},{from:'002',to:'003'}];
assert.equal(familyProdigyOptions(species,b,evolved).find(g=>g.stat==='defence').rate-growthPercent(species,'defence'),50,'ignore evolution copies');
let generation=a;for(let i=0;i<20;i++){const record=rollInheritance(species,stronger,1,{stat:'defence',moveId:null},()=>0,generation);generation={...generation,breedingInheritance:record};assert.equal(inheritedGrowthBonus(generation,'defence'),80,'no donor-roll or generation inflation');}
assert(Math.abs(PRODIGY_INHERITANCE_CHANCE**6-1/750)<1e-15);
// Exercise the same production roll helper, using a reproducible population.
let seed=24102026,complete=0;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const six=familyProdigyOptions(species,parent('six',all),a),N=2_000_000;
for(let i=0;i<N;i++)if(rollFamilyProdigies(six,random).length===6)complete++;
const expectedSix=six.reduce((n,row)=>n*familyProdigyChance(row),1);assert(Math.abs(complete-N*expectedSix)<6*Math.sqrt(N*expectedSix*(1-expectedSix)),'six-stat frequency within six standard deviations');
// Actual creation, fixed rolls on save/reload, and hatching both possible parents.
for(const pick of [0,.5]){
 let n=0;const state={playerName:'QA',money:10000,fates:{'LDR-02':'SPARED'},party:[structuredClone(a),structuredClone(b)],reserve:[]};
 const egg=createBreedingEgg(state,a.uid,b.uid,{random:()=>n++===0?pick:0,inheritancePlans:[{stat:'',moveId:null},{stat:'',moveId:null}]});assert(egg);assert.equal(egg.inheritance.lineageGrowth.length,2);
 egg.remaining=0;validateNurserySnapshot(state);const snapshot=JSON.parse(JSON.stringify(state)),saved=JSON.stringify(snapshot.nursery.eggs[0].inheritance);
 const child=hatchBreedingEgg(snapshot,egg.id,id=>({uid:'child',species:DATA.species.find(s=>s.id===id),level:1,moves:[]}));assert(child);assert.equal(JSON.stringify(child.breedingInheritance),saved);assert.equal(inheritedGrowthBonus(child,'defence'),50);assert.equal(inheritedGrowthBonus(child,'speed'),60);assert.equal(unitGrowthRates(child).speed,growthPercent(species,'speed')+60);assert.equal(hatchBreedingEgg(snapshot,egg.id,()=>{}),null);
}
// v1 and v2 eggs already committed keep their exact inheritance, without rerolls.
for(const version of [1,2]){const record={version,speciesId:species.id,donorIndex:1,growth:{stat:'defence',baseline:growthPercent(species,'defence'),donorRate:100,rate:105},moveId:null,...(version===2?{lineageGrowth:[]}: {})};validateInheritance(record,species,0);const before=JSON.stringify(record);assert.equal(inheritedGrowthBonus({breedingInheritance:record},'defence'),105-growthPercent(species,'defence'));assert.equal(JSON.stringify(record),before);}
console.log(`PASS: pooled stats, both parent outcomes, 1+5/3+3/5+1, one roll per carrier, strongest successful overlap, immutable bonuses, legacy records, actual egg save/hatch, six-stat simulation ${complete}/${N} (1 in ${(N/complete).toFixed(1)})`);

// User's two four-trait parents: three shared and two distinct gives five total.
const first=parent('four-a',Object.fromEntries(STAT_KEYS.slice(0,4).map(k=>[k,81]))),second=parent('four-b',Object.fromEntries([...STAT_KEYS.slice(0,3),STAT_KEYS[4]].map(k=>[k,81])));
const five=familyProdigyOptions(species,second,first);
assert.equal(five.length,5);
for(const effects of [{},{charm:true},{enhancer:'feed'},{charm:true,enhancer:'feed'},{enhancer:'thread',threadStat:STAT_KEYS[4]},{charm:true,enhancer:'thread',threadStat:STAT_KEYS[4]}]){
 let hits=0;const count=500000,expected=five.reduce((n,row)=>n*familyProdigyChance(row,effects),1);
 for(let i=0;i<count;i++)if(rollFamilyProdigies(five,random,effects).length===5)hits++;
 assert(Math.abs(hits-count*expected)<6*Math.sqrt(count*expected*(1-expected)));
 const html=breedingPlanHTML(species,second,0,first,effects);assert(html.includes('All 5 together: about 1 in '+(1/expected).toFixed(1)));
 console.log('FIVE-TRAIT SIM',JSON.stringify(effects),hits+'/'+count,'observed 1 in '+(count/hits).toFixed(2),'exact 1 in '+(1/expected).toFixed(2));
}
// Both parents carrying all six: exactly twelve draws and six result records.
const sharedSix=familyProdigyOptions(species,parent('all-b',all),parent('all-a',all));calls=0;
assert.equal(rollFamilyProdigies(sharedSix,()=>{calls++;return 0;}).length,6);assert.equal(calls,12);
assert(Math.abs(sharedSix.reduce((n,row)=>n*familyProdigyChance(row),1)-(1-(1-PRODIGY_INHERITANCE_CHANCE)**2)**6)<1e-15);
