import {activeDraughts} from './training-draughts.js?v=0.87.0';
import {shinySummaryHTML} from './shinies.js?v=0.90.20';
import {inheritanceSummaryHTML} from './breeding-inheritance.js?v=0.90.35';
import {STAT_KEYS,STAT_LABELS,unitGrowthPercent,inheritedGrowthRate,GROWTH_BONUS_FACTOR,permanentGrowthDetails} from './progression.js?v=0.90.34';
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
export function permanentGrowthSummaryHTML(unit){
 const d=permanentGrowthDetails(unit),labels={rescue:'Rescue gift',prodigy:'Prodigy',stewardship:'Stewardship',tonics:'Tonics',nursery:'Nursery gift',memorial:'Memorial gift'};
 if(!d.rows.some(row=>row.originalBonus>0))return '';
 return `<details class="permanent-growth-math"><summary>Permanent growth maths · ×${d.multiplier}</summary><p>Current species’ natural growth + original permanent growth points × (1 + completed evolutions). Your multiplier is ${d.multiplier}. This applies equally to existing bonuses and new purchases. Earned stats are never rerolled.</p><ul>${d.rows.filter(row=>row.originalBonus>0).map(row=>`<li><b>${STAT_LABELS[row.key]}</b>: ${row.natural}% natural${row.originalBonus?` + (${Object.entries(row.sources).filter(([,value])=>value>0).map(([source,value])=>labels[source]+' '+value).join(' + ')}) × ${d.multiplier}`:''} = ${row.uncapped}%.</li>`).join('')}</ul><p>Temporary draughts add after this calculation and never multiply. The rescue gift records its original 10% birth-form advantage and stacks that original bonus too. The 300% rescue limit applies only to the initial gift offer. Once in your care, growth percentages have no upper limit.</p></details>`;
}
export function growthSummaryHTML(unit){
 const rates=STAT_KEYS.map(key=>({key,rate:unitGrowthPercent(unit,key)}));
 return `${shinySummaryHTML(unit)}${inheritanceSummaryHTML(unit)}${permanentGrowthSummaryHTML(unit)}${trainingDraughtSummaryHTML(unit)}<div class="growth-heading"><b>${activeDraughts(unit).length?'Active growth per level':unit.growthMultiplier===1.1?'Gift growth per level':STAT_KEYS.some(key=>inheritedGrowthRate(unit,key)>0)?'Prodigy growth per level':permanentGrowthDetails(unit).rows.some(r=>r.originalBonus>0)?'Permanent growth per level':'Base growth per level'}</b><span>Total ${Math.round(rates.reduce((sum,row)=>sum+row.rate,0)*10)/10}%</span></div><div class="stat-grid growth-grid">${rates.map(({key,rate})=>`<div><span>${STAT_LABELS[key]}</span><b>${rate}%</b><small>${growthDescription(rate,key)}</small></div>`).join('')}</div><p class="growth-help">${unit.level>=200?'Level 200 reached: no further growth. ':''}Each successful increment adds <b>10 HP</b> or <b>1 other stat</b>. A successful remainder roll gets one extra roll at ${GROWTH_BONUS_FACTOR*100}% of that remainder chance. For example, 55% gets an 11% bonus roll after success.</p><p class="growth-help">${unit.growthMultiplier===1.1?'The rescue gift stacks its original birth-form bonus once per completed evolution, alongside other permanent bonuses. Its 300% limit applies only when the gift is first generated. Evolution and permanent training can increase it beyond 300%; temporary draughts add normally. These are your final boosted rates':STAT_KEYS.some(key=>inheritedGrowthRate(unit,key)>0)?'All original permanent growth bonuses are added once at birth and once more per completed evolution. See Permanent growth maths for the source breakdown':activeDraughts(unit).length?'These rates include the active draught bonuses':permanentGrowthDetails(unit).rows.some(r=>r.originalBonus>0)?'These rates include every permanent bonus multiplied by completed evolutions plus one':'These are this form’s base rates'}, not a prediction of its next roll. If every stat misses, one weighted stat rises. Evolution changes future rates. The total adds the six rates; it is not a probability.</p>`;
}


