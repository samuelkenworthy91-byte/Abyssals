import {orchardPrepare} from './tide-orchard-battle.js?v=0.90.47';
import {prepareSpecialistMove,stabMultiplier,secondaryChance} from './teamcraft-battle.js?v=0.90.47';
import {statusAttackFactor} from './status-rules.js?v=0.90.24';
import {resolveSalvationMove} from './salvation.js?v=0.87.0';
import {moveDamageMultiplier,movePriority} from './move-rules.js?v=0.90.47';
import {statusDetails} from './battle-status.js?v=0.90.47';
import {has,abilityMultiplier,abilityImmunity,heldStat,ignoresDefence,speedFactor,critChance,healingMultiplier} from './abilities.js?v=0.90.47';
import {typeEffectiveness,effectivenessLabel,categorySymbol} from './type-rules.js?v=0.87.0';
import {stageMultiplier,damageScale} from './engine.js?v=0.90.47';
const names={attack:'Attack',defence:'Defense',sp_attack:'Special Attack',sp_defence:'Special Defense',speed:'Speed',accuracy:'Accuracy',evasion:'Evasion'};
export function damageRange(actor,target,move){move=orchardPrepare(actor,target,resolveSalvationMove(actor,move));
 if(!move.power)return null;
 move=prepareSpecialistMove(actor,move);
 const guaranteed=critChance(actor,move,target)===1,special=move.category==='SPECIAL',a=special?'sp_attack':'attack',d=special?'sp_defence':'defence';
 const atk=actor.stats[a]*(guaranteed?1:stageMultiplier(actor.stages[a]))*heldStat(actor,a)*statusAttackFactor(actor,special),def=target.stats[d]*(guaranteed?1:stageMultiplier(ignoresDefence(actor,target)||move.ignorePositiveDefence?Math.min(0,target.stages[d]||0):target.stages[d]))*heldStat(target,d);
 const base=Math.floor((2*actor.level/5+2)*move.power*atk/Math.max(1,def)/50)+2;
 const bonus=stabMultiplier(actor,move);
 const effectiveness=abilityImmunity(target,move)?0:typeEffectiveness(move.type_id,target.species.types),movedFirst=actor.stats.speed*stageMultiplier(actor.stages.speed)*speedFactor(actor,target)>=target.stats.speed*stageMultiplier(target.stages.speed)*speedFactor(target,actor),scale=(guaranteed?2:1)*damageScale(actor.level)*effectiveness*moveDamageMultiplier(actor,target,move,{movedFirst})*abilityMultiplier(actor,target,move,{effectiveness,movedFirst,critical:guaranteed});
 const cap=move.nonlethal?Math.max(0,target.hp-1):Infinity;const lo=move.hits?.min||1,hi=move.hits?.max||1;return {effectiveness,min:Math.min(cap,effectiveness===0?0:Math.max(1,Math.floor(base*bonus*.85*scale))*lo),max:Math.min(cap,effectiveness===0?0:Math.max(1,Math.floor(base*bonus*scale))*hi),sameType:bonus>1,attack:names[a],defense:names[d],hits:move.hits||null};
}
export function mechanicsFor(move,actor,target){move=orchardPrepare(actor,target,resolveSalvationMove(actor,move));
 const details=[];if(move.id>=700||move.releaseMove)details.push(move.effect_text);if(has(actor,'Native Force'))details.push('Native Force: matching-type attacks receive 1.8× STAB, replacing the normal 1.5×.');if(has(actor,'Fortune Thread'))details.push('Fortune Thread doubles eligible secondary-effect chances, capped at 60% without lowering an existing higher chance. Accuracy and dedicated status moves are unchanged.');if(move.hits)details.push(`Strikes ${move.hits.min}–${move.hits.max} times; damage and critical hits are rolled separately for each strike; one PP is spent per move.`);if(move.description)details.push(move.description);if(move.nonlethal)details.push(move.effect_text);if(move.power&&move.category==='SPECIAL'&&has(actor,'Sage Mind')){move=prepareSpecialistMove(actor,move);details.push('Sage Mind boosts eligible Special attacks by 30%, removing tagged optional benefits but preserving all costs.');}if(move.power)details.push(`Critical chance: ${(critChance(actor,move,target)*100).toFixed(1)}%, including Speed advantage. Critical hits deal 2× damage and ignore all Attack and Defence stages, including special stats. Held items, burn, frostbite and damage-reducing abilities still apply.`);
 for(const e of move.effects){
  if(e.effect_id==='party_stage')details.push(`Raises ${e.stats.map(k=>names[k]||k).join(' and ')} by ${e.stages} stage(s) for the user and active allies.`);
  if(e.effect_id==='stat_stage'){
   for(const stat of e.stats||[e.stat])if(stat){const who=e.target==='SELF'?actor:target;const current=who.stages?.[stat]||0,next=Math.max(-6,Math.min(6,current+e.stages));details.push(`${e.chance_percent??100}% chance: ${e.target==='SELF'?'your':'foe’s'} ${names[stat]||stat} ${e.stages>0?'rises':'falls'} ${Math.abs(e.stages)} stage. Current ${stageMultiplier(current).toFixed(2)}× → ${stageMultiplier(next).toFixed(2)}×${next===current?' (stage limit reached)':''}.`);}
  }
  if(e.effect_id==='flinch')details.push(`${e.chance_percent??100}% flinch chance. Stops the foe’s action only if it has not acted this round; blocked by flinch protection.`);
  if(e.effect_id==='inflict_status'&&e.status==='CONFUSION')details.push(`${e.chance_percent}% confusion chance. Practice: lasts a uniformly random 1–6 eligible actions; 33% chance per action to lose 10% maximum HP instead of using the move.`);

  if(e.effect_id==='prevent_flinch')details.push(`Blocks flinching for ${e.turns||5} turns, including this turn.`);
  if(e.effect_id==='prevent_forced_switch')details.push('Authored protection against forced switching. This slice has no forced-switch actions, so that part has no effect here.');
  if(e.effect_id==='heal')details.push(`Restores ${e.max_hp_fraction[0]/e.max_hp_fraction[1]*100*healingMultiplier(actor)}% of maximum HP, capped at full HP. Cannot revive.`);
  if(e.effect_id==='drain')details.push(`Restores ${e.actual_hp_damage_fraction[0]/e.actual_hp_damage_fraction[1]*100*healingMultiplier(actor)}% of actual HP damage dealt, capped at full HP.`);
  if(e.effect_id==='recoil')details.push(e.basis==='MAX_HP'?`Recoil costs ${e.fraction[0]/e.fraction[1]*100}% of your maximum HP after a damaging hit.`:`Slice recoil binding: ${e.fraction[0]/e.fraction[1]*100}% of actual damage dealt.`);
 }
 if(move.id===310)details.push('Below half HP: priority +1, ahead of normal-priority moves.');
 for(const e of move.effects){
 if(e.effect_id==='inflict_status'&&e.status!=='CONFUSION')details.push(`${e.chance_percent??100}% chance of ${e.status.toLowerCase().replaceAll('_',' ')}. ${statusDetails({...target,status:e.status,statusTurns:e.status==='SLEEP'?'1–6':0,toxicCounter:0}).filter(t=>t.toLowerCase().startsWith(e.status.toLowerCase().replace('_',' '))).join(' ')}`);
 if(e.effect_id==='hp_cost')details.push(`Costs ${Math.round(e.fraction[0]/e.fraction[1]*100)}% of your maximum HP.`);
 if(e.effect_id==='next_move_cannot_miss')details.push('The next attempted move ignores accuracy and evasion. Immunity still applies.');
 if(e.effect_id==='ignore_positive_evasion')details.push('Ignores positive foe evasion stages. Accuracy penalties still apply.');
 if(e.effect_id==='next_hit_damage_multiplier')details.push(`Next ${e.category==='PHYSICAL'?'physical ':''}damaging hit deals ${e.multiplier*100}% damage; other attacks do not consume this ward.`);
 if(e.effect_id==='critical_damage_multiplier')details.push(`Critical damage ×${e.multiplier} for ${e.turns} turns.`);
 if(e.effect_id==='incoming_type_damage_multiplier')details.push(`${e.type_id} damage taken ×${e.multiplier} for ${e.turns} turns.`);
 if(e.effect_id==='disable_last_move')details.push(`Seals the foe’s last attempted move for ${e.turns} turns. Fails if it has no previous move. Switching clears the seal.`);
 if(e.effect_id==='recurring_status')details.push(`${e.chance_percent}% ${e.status.toLowerCase()} chance at each of ${e.turns} turn ends. The field stays on the opposing side through switching.`);
 if(e.effect_id==='contact_retaliation')details.push(`Contact attackers lose 12.5% of their maximum HP for ${e.turns} turns. This is the slice binding of the source’s unspecified HP basis.`);
 if(e.effect_id==='contact_status_retaliation')details.push(`Contact attackers risk ${e.chance_percent}% ${e.status.toLowerCase()} for ${e.turns} turns.`);
 if(e.effect_id==='heal_by_format')details.push('Singles: restores '+50*healingMultiplier(actor)+'% maximum HP, capped at full. Cannot revive.');
 if(e.effect_id==='pivot')details.push('After dealing damage, switch to a chosen living benched partner if able; no stat stages are passed. Misses, protection and immunity do not switch.');
 if(e.effect_id==='prevent_switch')details.push(`Blocks voluntary switching and escape for ${e.turns||3} turns unless Bindproof or Wayfarer applies.`);
 if(e.effect_id==='status_immunity')details.push(`${e.status.toLowerCase()} immunity for ${e.turns} turns.`);
 if(e.effect_id==='cure_major_status')details.push('Cures the current major status; confusion is separate.');
 if(e.effect_id==='clear_negative_stat_stages')details.push('Clears stat drops and retains positive boosts.');
 }
 if(!details.length)details.push(move.effects.length?'See the move’s effect description above.':'No secondary effect.');
 const range=damageRange(actor,target,move);
 return {details,range,accuracy:actor.moveState?.sureHit>0||move.accuracy==='ALWAYS'?100:Math.min(100,(move.accuracy??100)*stageMultiplier(actor.stages.accuracy)/stageMultiplier(move.effects.some(e=>e.effect_id==='ignore_positive_evasion')?Math.min(0,target.stages.evasion||0):target.stages.evasion)),order:movePriority(move,actor)>0?'Before normal-priority moves':'Normal priority; faster partner acts first',category:move.category==='PHYSICAL'?'Physical':move.category==='SPECIAL'?'Special':'Status',target:move.target==='SELF'?'Your partner':'One foe'};
}
export function detailsHTML(move,actor,target,{supervised=true}={}){move=orchardPrepare(actor,target,resolveSalvationMove(actor,move));const d=mechanicsFor(move,actor,target);return `<div class="move-detail-heading"><b>${move.name}</b><span>${categorySymbol(move.category)} ${move.type_id} · ${d.category}</span></div><p>${move.effect_text}</p><dl class="move-stats"><div><dt>Power</dt><dd>${move.power??'—'}</dd></div><div><dt>Accuracy</dt><dd>${move.accuracy==='ALWAYS'?'Always':(move.accuracy??100)+'%'}</dd></div><div><dt>PP</dt><dd>${move.left??move.pp} / ${move.pp}</dd></div><div><dt>Target</dt><dd>${d.target}</dd></div></dl><p class="mechanic-order">${d.order}. ${move.accuracy==='ALWAYS'?'Always hits; ignores accuracy and evasion stages.':'Current hit chance: '+Math.round(d.accuracy)+'%.'}</p>${d.range?`<p>Uses <b>${d.range.attack}</b> against <b>${d.range.defense}</b>. ${effectivenessLabel(d.range.effectiveness)}. Normal-hit estimate: <b>${d.range.min}–${d.range.max} HP</b>${d.range.sameType?' · includes 1.5× same-type bonus':''}. ${supervised?'The referee stops damage at 1 HP.':'There is no referee: zero HP is lethal.'}</p>`:''}<ul>${d.details.map(t=>`<li>${t}</li>`).join('')}</ul><small class="practice-note">Type matchups apply to damaging moves; abilities and held items apply. Estimates exclude critical hits and assume the current Speed order.</small>`;}

