import {participantExpMultiplier} from './relic-family.js?v=0.87.0';
import {trainingGrowthBonus} from './training-draughts.js?v=0.87.0';
import {experienceMultiplier} from './opening-balance.js?v=0.87.0';
import {prodigyGrowthBonus} from './prodigy-growth.js?v=0.90.31';
export {inheritedGrowthRate,inheritedGrowthBonus,prodigyMultiplier,prodigyGrowthBonus} from './prodigy-growth.js?v=0.90.31';
// Authored BST-derived percentages; standard overflow plus one bounded bonus.
// Each increment is +10 HP or +1 other stat. Rolls are independent of combat RNG.
export const GROWTH_RULES_VERSION=3;
export const GROWTH_BONUS_FACTOR=.2;
export const STAT_KEYS=['hp','attack','defence','sp_attack','sp_defence','speed'];
export const STAT_LABELS={hp:'HP',attack:'Attack',defence:'Defence',sp_attack:'Special Attack',sp_defence:'Special Defence',speed:'Speed'};
export function hashSeed(text){let h=2166136261;for(const c of String(text)){h=Math.imul(h^c.charCodeAt(0),16777619);}h=Math.imul(h^(h>>>16),2246822507);h=Math.imul(h^(h>>>13),3266489909);return (h^(h>>>16))>>>0||1;}
export function normalizeProgress(unit){if(!Number.isSafeInteger(unit.evolutionBlockedLevel))unit.evolutionBlockedLevel=unit.level;unit.exp=Math.max(0,Math.floor(unit.exp||0));unit.growthSeed??=hashSeed(unit.uid+':'+unit.species.id);return unit;}
// Uncapped catch-up EXP, approved 21 October 2026. Round once after all bonuses.
// Weaker opponents retain their existing cubic reduction and rounding.
export function expAward(enemyLevel,ownLevel,multiplier=1,participantMultiplier=1){
 const gap=enemyLevel-ownLevel;
 if(gap<=-10)return 0;
 const yieldMultiplier=multiplier===6?6:1;
 if(gap<0)return Math.max(1,Math.round(25*experienceMultiplier(ownLevel)*Math.pow((10+gap)/10,3)))*yieldMultiplier*participantMultiplier;
 return Math.round((25+5*gap+gap*gap/48)*experienceMultiplier(ownLevel)*participantMultiplier*yieldMultiplier);
}
export function growthPercent(species,key){const authored=species.growth_percent?.[key];if(Number.isFinite(authored))return Math.max(10,authored);const base=species.base_stats,bst=STAT_KEYS.reduce((n,k)=>n+base[k],0);return Math.max(10,Math.floor((32+.06*(bst-300))*Math.pow(base[key]/(bst/6),2.25)+.5));}
export function unitGrowthRates(unit){
 const nurseryBonus=(unit.nurseryLegacy?.version===1?15:0)+(unit.memorialLegacy?.version===1?15:0);
 const stewardship=key=>Math.max(0,unit.stewardship?.[key]||0);
 const tenths=STAT_KEYS.map(key=>Math.round((growthPercent(unit.species,key)+prodigyGrowthBonus(unit,key))*(unit.growthMultiplier===1.1?1.1:1)*10));
 const total=tenths.reduce((n,v)=>n+v,0),cap=unit.giftOrigin==='Roadside rescue'?Math.max(0,3000-STAT_KEYS.reduce((sum,k)=>sum+stewardship(k)*10,0)):null;
 if(cap!==null&&total>cap){const exact=tenths.map(v=>v*cap/total),scaled=exact.map(Math.floor);let remaining=cap-scaled.reduce((n,v)=>n+v,0);
  const order=exact.map((v,i)=>({i,remainder:v-scaled[i]})).sort((a,b)=>b.remainder-a.remainder||a.i-b.i);for(const {i} of order){if(remaining--<=0)break;scaled[i]++;}return Object.fromEntries(STAT_KEYS.map((key,i)=>[key,scaled[i]/10+stewardship(key)+trainingGrowthBonus(unit,key)+(unit.marasenGrowth?.[key]||0)+nurseryBonus]));
 }return Object.fromEntries(STAT_KEYS.map((key,i)=>[key,tenths[i]/10+stewardship(key)+trainingGrowthBonus(unit,key)+(unit.marasenGrowth?.[key]||0)+nurseryBonus]));
}
export function unitGrowthPercent(unit,key){return unitGrowthRates(unit)[key];}
export function statGain(percent,roll,key,bonusRoll=1){
 const rate=Number.isFinite(percent)?Math.max(0,percent):0;
 const guaranteed=Math.floor(rate/100),chance=(rate%100)/100;
 const increment=key==='hp'?10:1;
 if(roll>=chance)return guaranteed*increment;
 // Only a fractional success unlocks one smaller roll. Never recurse or carry
 // chance into the next level; exact multiples of 100 stay guaranteed-only.
 return (guaranteed+1+(bonusRoll*100<(rate%100)*GROWTH_BONUS_FACTOR?1:0))*increment;
}
// Each call consumes exactly 100 EXP. The reward queue repeats this through all
// earned levels, preserving the remainder even at the existing level-200 ceiling.
export function growLevel(unit){normalizeProgress(unit);if(unit.dead||unit.hp<=0||unit.exp<100||unit.level>=200)return null;unit.exp-=100;unit.level++;unit.growthRulesVersion=GROWTH_RULES_VERSION;const rows=STAT_KEYS.map(key=>{const before=key==='hp'?unit.maxHp:unit.stats[key];const roll=hashSeed(`${unit.growthSeed}:${unit.level}:${key}`)/4294967296;const bonusRoll=hashSeed(`${unit.growthSeed}:${unit.level}:${key}:bounded-bonus`)/4294967296;const gain=statGain(unitGrowthPercent(unit,key),roll,key,bonusRoll);unit.stats[key]=before+gain;if(key==='hp'){unit.maxHp=before+gain;unit.hp=Math.min(unit.maxHp,unit.hp+gain);}return {key,before,after:before+gain,gain};});if(rows.every(row=>row.gain===0)){const weights=STAT_KEYS.map(key=>unitGrowthPercent(unit,key)),total=weights.reduce((n,w)=>n+w,0);let pick=hashSeed(`${unit.growthSeed}:${unit.level}:guaranteed`)/4294967296*total;const index=weights.findIndex(w=>(pick-=w)<0),row=rows[Math.max(0,index)],gain=row.key==='hp'?10:1;row.gain=gain;row.after+=gain;row.guaranteed=true;unit.stats[row.key]=row.after;if(row.key==='hp'){unit.maxHp=row.after;unit.hp=Math.min(unit.maxHp,unit.hp+gain);}}return {kind:'level',uid:unit.uid,level:unit.level,rows};}
export function rewardsFor(defeats,party,{shareAll=false,warbond=null}={}){const multiplier=participantExpMultiplier(defeats,party,{shareAll,warbond}),amounts=new Map();for(const defeat of defeats){for(const uid of new Set(shareAll?party.map(u=>u.uid):defeat.participants)){const unit=party.find(u=>u.uid===uid&&u.hp>0&&!u.dead&&u.level<200);if(unit){const award=expAward(defeat.level,unit.level,defeat.expMultiplier,multiplier);if(award>0)amounts.set(uid,(amounts.get(uid)||0)+award);}}}return [...amounts].map(([uid,amount])=>({uid,amount,...(multiplier===2?{ability:'Warbond',multiplier}: {})}));}

export function initializeProgress(unit){normalizeProgress(unit);const target=unit.level;unit.level=1;for(let level=2;level<=target;level++){unit.exp=100;growLevel(unit);}unit.exp=0;unit.hp=unit.maxHp;unit.evolutionBlockedLevel=unit.level;return unit;}
