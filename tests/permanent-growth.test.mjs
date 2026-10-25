import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {instance} from '../dist/engine.js';
import {EVOLUTIONS} from '../dist/evolution-data.js';
import {promote} from '../dist/evolution.js';
import {STAT_KEYS,growthPercent,unitGrowthRates,permanentGrowthMultiplier,permanentGrowthDetails,growLevel} from '../dist/progression.js';
import {permanentGrowthSummaryHTML} from '../dist/growth-summary.js';
import {growthTonic,growthTonicQuote} from '../dist/marasen-activities-ui.js';
import {stewardshipQuote,applyStewardship} from '../dist/stewardship.js';
import {inheritanceOptions} from '../dist/breeding-inheritance.js';
const rates=n=>Object.fromEntries(STAT_KEYS.map(k=>[k,n]));
const forms=[40,90,120].map((n,i)=>({...DATA.species[i],id:String(i+1),types:['NORMAL'],growth_percent:rates(n)}));
const histories=[[],[{from:'1',to:'2',level:20}],[{from:'1',to:'2',level:20},{from:'2',to:'3',level:40}]];
const inherited={speciesId:'1',growth:{stat:'attack',baseline:40,rate:90}};
const cases=[
 ['prodigy',{breedingInheritance:inherited},[90,190,270]],
 ['stewardship',{stewardship:{attack:2}},[42,94,126]],
 ['focused tonic',{marasenGrowth:{attack:5}},[45,100,135]],
 ['balanced tonic',{marasenGrowth:rates(1)},[41,92,123]],
 ['nursery gift',{nurseryLegacy:{version:1}},[55,120,165]],
 ['memorial gift',{memorialLegacy:{version:1}},[55,120,165]],
 ['both gifts',{nurseryLegacy:{version:1},memorialLegacy:{version:1}},[70,150,210]],
 ['combined',{breedingInheritance:inherited,stewardship:{attack:2},marasenGrowth:{attack:5}},[97,204,291]],
 ['rescue original bonus',{growthMultiplier:1.1,rescueGrowthBonus:rates(4)},[44,98,132]]
];
for(const [name,extra,expected]of cases){const actual=forms.map((species,i)=>{const u={species,...structuredClone(extra),evolutionHistory:histories[i],stats:{attack:23},hp:10,maxHp:10};const saved=JSON.stringify(u);const result=unitGrowthRates(u).attack;assert.equal(JSON.stringify(u),saved,'reading never mutates earned stats or original bonuses');assert.equal(unitGrowthRates(JSON.parse(JSON.stringify(u))).attack,result);return result;});assert.deepEqual(actual,expected,name);console.log(name,actual.join(' → '));}
const combined={uid:'combined',species:forms[2],evolutionHistory:histories[2],breedingInheritance:inherited,stewardship:{attack:2},marasenGrowth:{attack:5},trainingEffects:[{stat:'attack',remaining:5}],level:50,hp:100,maxHp:100,stats:rates(100),exp:100};
assert.equal(unitGrowthRates(combined).attack,311,'temporary +20 stays flat');const text=permanentGrowthSummaryHTML(combined);assert(text.includes('(Prodigy 50 + Stewardship 2 + Tonics 5) × 3 = 291%'));assert(text.includes('Temporary draughts'));
const withoutTemp=structuredClone(combined);withoutTemp.trainingEffects=[];const grown=growLevel(withoutTemp);assert(grown.rows.find(r=>r.key==='attack').gain>=2,'stacked rate feeds actual level-up gains');
// Real promotions use the history appended by the evolution engine, including cancellation/reloads.
const real=instance(DATA.species.find(s=>s.id==='001'),20,[]);real.uid='real';real.evolutionBlockedLevel=1;real.stewardship={attack:2};real.marasenGrowth={attack:5};const receipts=JSON.stringify({stewardship:real.stewardship,tonics:real.marasenGrowth});
for(const to of ['002','003']){real.level=to==='002'?20:40;const path=EVOLUTIONS.find(e=>e.from_species_id===real.species.id&&e.to_species_id===to);assert(path);assert(promote(real,{...path,condition:{...path.condition,minimum_level:1,method:'LEVEL'}}));assert.equal(unitGrowthRates(real).attack,growthPercent(real.species,'attack')+7*permanentGrowthMultiplier(real));assert.equal(JSON.stringify({stewardship:real.stewardship,tonics:real.marasenGrowth}),receipts);assert.equal(promote(real,path),null);}
const rawReal=JSON.stringify(real);unitGrowthRates(real);unitGrowthRates(real);assert.equal(JSON.stringify(real),rawReal);
// Buying before or after evolution yields identical future growth, with original doses unchanged.
const make=(uid,stage=0)=>({uid,species:forms[stage],evolutionHistory:structuredClone(histories[stage]),level:50,hp:10,maxHp:10,moves:[],stats:rates(10)});
let early=make('early'),late=make('late',2),s={money:100000,party:[early,late],reserve:[]};assert(growthTonic(s,'early','focused','attack'));early.species=forms[2];early.evolutionHistory=histories[2];const q=growthTonicQuote(s,'late','focused','attack');assert.equal(q.multiplier,3);assert.equal(q.before.rows.find(r=>r.key==='attack').permanent,120);assert.equal(q.after.rows.find(r=>r.key==='attack').permanent,135);assert(growthTonic(s,'late','focused','attack'));assert.deepEqual(unitGrowthRates(early),unitGrowthRates(late));assert.equal(late.marasenGrowth.attack,5);assert.equal(late.marasenTonicDoses,1);
// Three donors buy two original lessons, currently +6 on a twice-evolved partner.
const target=make('target',2),donors=[123,126,126].map((n,i)=>({...make('d'+i),species:{...forms[0],growth_percent:rates(n)}}));s={party:[target],reserve:donors};const ids=donors.map(u=>u.uid),batch=stewardshipQuote(s,target.uid,'attack',ids);assert(batch.ok);assert.equal(batch.lessons,2);assert.equal(batch.gain,6);assert.equal(batch.after,126);assert(applyStewardship(s,target.uid,'attack',ids));assert.equal(target.stewardship.attack,2);assert.equal(unitGrowthRates(target).attack,126);
// The rescue cap applies only to initial offers; owned growth is uncapped.
const rescue={...make('rescue',2),giftOrigin:'Roadside rescue',growthMultiplier:1.1,rescueGrowthBonus:rates(4),marasenGrowth:{attack:5},marasenTonicDoses:1};
assert.equal(permanentGrowthDetails(rescue).totalPermanent,807);assert(!permanentGrowthDetails(rescue).capped);assert.equal(unitGrowthRates(rescue).attack,147);rescue.trainingEffects=[{stat:'attack',remaining:1}];assert.equal(Object.values(unitGrowthRates(rescue)).reduce((a,b)=>a+Math.round(b*10),0),8270);
s={money:100000,party:[rescue],reserve:[{...make('rescue-donor'),marasenGrowth:{attack:200}}]};assert(growthTonic(s,'rescue','focused','attack'));assert.equal(s.money,75000);assert.equal(unitGrowthRates({...rescue,trainingEffects:[]}).attack,162);assert(stewardshipQuote(s,'rescue','attack',['rescue-donor']).ok);assert(applyStewardship(s,'rescue','attack',['rescue-donor']));assert.equal(unitGrowthRates({...rescue,trainingEffects:[]}).attack,165);
const {RESCUE_GIFTS}=await import('../dist/side-adventures.js');assert(RESCUE_GIFTS.length);for(const id of RESCUE_GIFTS){const gift={species:DATA.species.find(s=>s.id===id),growthMultiplier:1.1};assert(Object.values(unitGrowthRates(gift)).reduce((n,v)=>n+Math.round(v*10),0)<=3000,'initial offer still fits 300%');}
// Older rescue records derive the original bonus from their first saved form.
const oldRescue={...make('old-rescue'),species:DATA.species.find(s=>s.id==='003'),evolutionHistory:[{from:'001',to:'002'},{from:'002',to:'003'}],growthMultiplier:1.1};assert.equal(permanentGrowthDetails(oldRescue).rows.find(r=>r.key==='attack').sources.rescue,Math.round(growthPercent(DATA.species.find(s=>s.id==='001'),'attack'))/10);
// Stewardship and store tonics remain nonheritable; donor gift bonuses never pass evolution copies.
const donor={...make('donor',2),nurseryLegacy:{version:1}},offer=()=>inheritanceOptions(forms[0],donor).growth.find(g=>g.stat==='attack').donorRate;const originalOffer=offer();donor.stewardship={attack:100};donor.marasenGrowth={attack:50};assert.equal(offer(),originalOffer);assert.equal(originalOffer,135);
console.log('PASS: all permanent sources ×1/×2/×3, real evolution and level-up, immutable receipts, post-evolution purchases, scaled stewardship quotes, initial-only rescue limit, uncapped care and legacy fallback, flat temporaries and no breeding inflation');
