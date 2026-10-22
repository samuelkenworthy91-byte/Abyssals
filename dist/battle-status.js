import {statusCaptureMultiplier} from './status-rules.js?v=0.90.24';
export function statusDetails(u){const loss=n=>Math.max(1,Math.floor(u.maxHp*n)),s=u.moveState||{},out=[];
 if(u.status==='BURN')out.push(`Burn: Attack ×0.5 on physical moves; loses ${loss(1/8)} HP at turn end.`);
 if(u.status==='FROSTBITE')out.push(`Frostbite: Special Attack ×0.5 on special moves; loses ${loss(1/8)} HP at turn end.`);
 if(u.status==='POISON')out.push(`Poison: loses ${loss(1/8)} HP at turn end.`);
 if(u.status==='BAD_POISON')out.push(`Bad poison: next turn loses ${loss(Math.min(15,(u.toxicCounter||0)+1)/16)} HP; increases each turn; switching resets escalation.`);
 if(u.status==='PARALYSIS')out.push('Paralysis: Speed ×0.5; 25% chance to lose an action.');
 if(u.status==='SLEEP')out.push(`Sleep: ${u.statusTurns||0} blocked actions remain (randomly 1–6 when inflicted); then wakes.`);
 if(u.status==='FREEZE')out.push('Freeze: 20% thaw chance before each action.');
 if(u.status&&out.length)out[out.length-1]+=` Capture strength ×${statusCaptureMultiplier(u)}.`;
 if(u.confusion>0)out.push(`Confusion: ${u.confusion} actions remain; 33% chance to hurt itself for ${loss(.1)} HP.`);
 if(u.trapped>0)out.push(`Trapped: cannot switch or escape for ${u.trapped} turns.`);
 if(s.disabled?.turns>0)out.push(`Move sealed: ${u.moves.find(m=>m.id===s.disabled.moveId)?.name||'previous move'} (${s.disabled.turns} turns).`);
 if(s.ward?.uses>0)out.push(`Ward: next ${s.ward.category==='PHYSICAL'?'physical ':''}hit deals ${s.ward.multiplier*100}% damage.`);
 if(s.mark?.turns>0)out.push(`Marked: ${s.mark.type_id} damage taken ×${s.mark.multiplier} (${s.mark.turns} turns).`);
 if(s.sureHit>0)out.push('Future Read: next move cannot miss.');
 if(s.thorns?.turns>0)out.push(`Thorn Guard: contact attackers lose 1/8 maximum HP (${s.thorns.turns} turns).`);
 if(s.coat?.turns>0)out.push(`Venom Coat: contact attackers risk ${s.coat.chance_percent}% poison (${s.coat.turns} turns).`);
 if(s.criticalWard?.turns>0)out.push(`Critical ward: critical damage ×${s.criticalWard.multiplier} (${s.criticalWard.turns} turns).`);
 for(const [status,turns] of Object.entries(u.statusImmunity||{}))out.push(`${status.toLowerCase()} immunity: ${turns} turns.`);
 const f=u.field||{};if(f.weather)out.push(`${f.weather}: ${f.weatherTurns||0} turns${f.weather==='RAIN'?' · Water ×1.5, Fire ×0.5':f.weather==='SUN'?' · Fire ×1.5, Water ×0.5':''}.`);
 if(f.terrain)out.push(`${f.terrain} terrain${f.terrainTurns?' · '+f.terrainTurns+' turns':''}.`);
 for(const [cat,turns] of Object.entries(f.screens?.[u.side]||{}))if(turns>0)out.push(`${cat==='PHYSICAL'?'Physical':'Special'} screen: damage ×0.5 (${turns} turns).`);
 const area=f.moveFields?.[u.side];if(area)out.push(`Static Field: ${area.chance_percent}% paralysis chance each turn (${area.turns} turns).`);
 return out;
}
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function statusHTML(u){return statusDetails(u).map(text=>`<small class="combat-condition ${u.status?'afflicted':''}">${escape(text)}</small>`).join('');}
