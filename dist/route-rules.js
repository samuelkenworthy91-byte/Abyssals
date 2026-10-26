import {statusCaptureMultiplier} from './status-rules.js?v=0.90.24';
import {encounterWeights} from './expedition-abilities.js?v=0.90.41';
import {expandEncounterRoute} from './roster-encounters.js?v=0.90.41';
import {stageLevel} from './route-progression.js?v=0.90.41';
import {legalForm} from './route-roster.js?v=0.87.0';
import {openingEncounterLevel} from './opening-balance.js?v=0.87.0';
import {ROUTE} from './route-data.js?v=0.90.41';
export function phaseAt(elapsed){return Math.floor(Math.max(0,elapsed)/600000)%2?'NIGHT':'DAY';}
export function pickEncounter(phase,random,route=ROUTE,leader=null){route=expandEncounterRoute(route);const table=route.tables.find(t=>t.phase===phase);if(!table?.slots.length)throw Error('Missing encounter table: '+phase);const weights=encounterWeights(table.slots,leader);let value=random()*weights.reduce((a,b)=>a+b,0);const slot=table.slots.find((s,i)=>(value-=weights[i])<0)||table.slots.at(-1);const level=route.room?stageLevel(route.room,random):null;const fallback=openingEncounterLevel(slot.min_level+Math.min(slot.max_level-slot.min_level,Math.floor(random()*(slot.max_level-slot.min_level+1))),route.area);const chosen=slot.approvedExpansion362||slot.authoredSlot?slot.min_level+Math.min(slot.max_level-slot.min_level,Math.floor(random()*(slot.max_level-slot.min_level+1))):slot.approvedExpansion?Math.max(slot.min_level,Math.min(slot.max_level,level??fallback)):(level??fallback);return {speciesId:legalForm(slot.species_id,chosen),level:chosen,phase,tableId:table.id};}
// Four capture checks. Ordinary species use authored catch rates and their normal level factor.
export function captureLevelFactor(level=1){return 1/(1+(Math.max(1,Number.isFinite(level)?level:1)/20)**2);}
// Legendary catching follows Pokemon-like catch-rate tiers rather than stacking a
// second level penalty on already rare species. Pseudo-legendaries and ordinary
// species retain the existing level-based calculation. All capture previews and
// capture rolls use this same function, including specialist food and Slow Stew.
export function captureSpeciesTier(species){
 const name=String(species?.name??'');
 const id=String(species?.id??'');
 const power=String(species?.power_class??'');
 const role=[species?.role,species?.rarity].filter(Boolean).join(' ');
 if(id==='425'||name==='Verdantyr')return {name:'Verdantyr',rate:15,ignoreLevel:true};
 if(species?.approvedPaladin&&species?.legendaryRoamer)return {name:'Paladin',rate:10,ignoreLevel:true};
 if(/pseudo/i.test(power)||/pseudo/i.test(role))return {name:'Pseudo-legendary',rate:45,ignoreLevel:false};
 if(/mythic/i.test(power)||/mythic/i.test(role))return {name:'Mythical',rate:3,ignoreLevel:true};
 if(/box legendary/i.test(power)||/box legendary/i.test(role))return {name:'Major legendary',rate:3,ignoreLevel:true};
 if(/legendary/i.test(power)||/legendary/i.test(role)||species?.legendaryRoamer)return {name:'Legendary Watcher',rate:5,ignoreLevel:true};
 return {name:'Ordinary',rate:species?.capture_rate??ROUTE.prototype_catch_rate,ignoreLevel:false};
}
export function capturePreview(target,foodModifier=1){
 if(!Number.isFinite(target?.hp)||!Number.isFinite(target?.maxHp)||target.hp<=0||target.maxHp<=0||target.dead||!Number.isFinite(foodModifier)||foodModifier<=0)return {a:0,threshold:0,chance:0};
 const tier=captureSpeciesTier(target.species);
 const hp=Math.min(target.hp,target.maxHp);
 const levelFactor=tier.ignoreLevel?1:captureLevelFactor(target.level);
 const a=Math.floor((3*target.maxHp-2*hp)*tier.rate*foodModifier*levelFactor*statusCaptureMultiplier(target)/(3*target.maxHp));
 const threshold=a>=255?65536:a<=0?0:Math.min(65536,Math.floor(1048560/Math.sqrt(Math.sqrt(16711680/a))));
 return {a,threshold,chance:Math.pow(threshold/65536,4)};
}
export function formatCaptureChance(target,foodModifier=1){const p=capturePreview(target,foodModifier).chance;if(p===0)return '0%';if(p===1)return '100%';return (p*100).toFixed(1)+'%';}

export function resolveCapture(target,random,{allowed=true,food=1,foodModifier=1}={}){if(!allowed||target.hp<=0||target.dead||target.maxHp<=0||food<1||foodModifier<=0)return {legal:false,consumed:0,success:false,closeness:0};const preview=capturePreview(target,foodModifier);const rolls=[];let passed=0;while(passed<4){const roll=Math.floor(random()*65536);rolls.push(roll);if(roll>=preview.threshold)break;passed++;}const success=passed===4;const fractional=success?1:preview.threshold/Math.max(1,rolls.at(-1));return {...preview,legal:true,consumed:1,success,passed,rolls,closeness:success?100:Math.min(99,Math.floor((passed+fractional)*25))};}
export function settleStarter(unit){if(unit.hp>0||unit.dead||unit.pendingReturn||!Number.isSafeInteger(unit.lives)||unit.lives<1)return false;unit.lives=Math.max(0,unit.lives-1);if(unit.lives>0)unit.pendingReturn=true;else unit.dead=true;return true;}
export function completeStarterReturn(unit){if(!unit.pendingReturn)return false;unit.hp=Math.max(1,Math.ceil(unit.maxHp*.1));unit.pendingReturn=false;unit.confusion=0;unit.flinched=false;unit.immuneFlinch=0;unit.stages={};return true;}

// Presentation only: reveal the already committed four capture checks without new RNG.
export function captureMilestones(result){if(result.success)return [25,50,75,100];const passed=Math.max(0,Math.min(3,result.passed||0)),steps=Array.from({length:passed},(_,i)=>(i+1)*25),last=Math.min(99,Math.max(passed*25,Math.floor(result.closeness||0)));if(!steps.length||last>steps.at(-1))steps.push(last);return steps;}

