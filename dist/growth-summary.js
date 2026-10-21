import {activeDraughts} from './training-draughts.js?v=0.87.0';
import {shinySummaryHTML} from './shinies.js?v=0.90.20';
import {inheritanceSummaryHTML} from './breeding-inheritance.js?v=0.90.18';
import {STAT_KEYS,STAT_LABELS,unitGrowthPercent,inheritedGrowthRate,GROWTH_BONUS_FACTOR} from './progression.js?v=0.90.18';
export function growthDescription(percent,key){
 const increment=key==='hp'?10:1,guaranteed=Math.floor(percent/100)*increment,remainder=Math.round(percent%100*10)/10;
 const parts=[];
 if(guaranteed)parts.push(`+${guaranteed} guaranteed`);
 if(remainder)parts.push(`${remainder}% chance of +${increment}`);
 if(!parts.length)parts.push('No growth');
 return parts.join(' · ');
}
export function trainingDraughtSummaryHTML(unit){
 const effects=activeDraughts(unit);if(!effects.length)return '';
 return `<section aria-label="Training Draughts"><h3>Training Draughts · ${effects.length}/10 effects</h3><ul>${effects.map(e=>`<li>${STAT_LABELS[e.stat]} +20 percentage points · ${e.remaining} battle${e.remaining===1?'':'s'} remaining</li>`).join('')}</ul><p class="growth-help">The growth rates shown include every active draught. Same-stat bonuses add together: two Attack draughts give +40 percentage points, so a 30% growth chance becomes 70%. Every level earned from a battle uses the full boost; even 20 levels count as one battle. Each draught loses one battle of duration after all battle rewards. Party battles count without a level-up; reserves pause unless they participate. Each effect expires independently.</p></section>`;
}
export function growthSummaryHTML(unit){
 const rates=STAT_KEYS.map(key=>({key,rate:unitGrowthPercent(unit,key)}));
 return `${shinySummaryHTML(unit)}${inheritanceSummaryHTML(unit)}${trainingDraughtSummaryHTML(unit)}<div class="growth-heading"><b>${activeDraughts(unit).length?'Active growth per level':unit.growthMultiplier===1.1?'Gift growth per level · +10%':STAT_KEYS.some(key=>inheritedGrowthRate(unit,key)>0)?'Prodigy growth per level':'Base growth per level'}</b><span>Total ${Math.round(rates.reduce((sum,row)=>sum+row.rate,0)*10)/10}%</span></div><div class="stat-grid growth-grid">${rates.map(({key,rate})=>`<div><span>${STAT_LABELS[key]}</span><b>${rate}%</b><small>${growthDescription(rate,key)}</small></div>`).join('')}</div><p class="growth-help">${unit.level>=200?'Level 200 reached: no further growth. ':''}Each successful increment adds <b>10 HP</b> or <b>1 other stat</b>. A successful remainder roll gets one extra roll at ${GROWTH_BONUS_FACTOR*100}% of that remainder chance. For example, 55% gets an 11% bonus roll after success.</p><p class="growth-help">${unit.growthMultiplier===1.1?'The rescue bonus multiplies this form’s rates by 1.10 and remains after evolution. Permanent rescue growth is limited to 300% total; higher permanent totals are reduced proportionally. Temporary draught bonuses add after this cap. These are your final boosted rates':STAT_KEYS.some(key=>inheritedGrowthRate(unit,key)>0)?'Prodigy rates are retained after evolution; higher natural rates take precedence. Other rates follow this form':activeDraughts(unit).length?'These rates include the active draught bonuses':'These are this form’s base rates'}, not a prediction of its next roll. If every stat misses, one weighted stat rises. Evolution changes future rates. The total adds the six rates; it is not a probability.</p>`;
}

