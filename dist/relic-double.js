import {menagerieParty} from './menagerie-rules.js?v=0.87.0';
import {specialistAIPool} from './teamcraft-battle.js?v=0.90.48';
import {applyMove,cleanupRound,priority,stageMultiplier} from './engine.js?v=0.90.48';
import {effectiveStage,speedFactor} from './abilities.js?v=0.90.48';
import {moveUsable} from './move-rules.js?v=0.90.48';
import {captureHealth,healthChanges} from './health-presentation.js?v=0.87.0';
// Four simultaneous combatants, one selected player target, one independent AI action per other actor.
export function doubleLivingTargets(b){return b.enemies.map((u,i)=>({u,i})).filter(({u,i})=>(!b.activeEnemyIndices||b.activeEnemyIndices.includes(i))&&u.hp>0&&!u.captured&&!u.withdrawn&&!(u.boundSovereign&&u.hp<=1));}
export function refillDoubleFoes(b){if(!b.activeEnemyIndices)return;const active=new Set(doubleLivingTargets(b).map(t=>t.i));for(let slot=0;slot<b.activeEnemyIndices.length;slot++){if(active.has(b.activeEnemyIndices[slot]))continue;while(b.reserveCursor<b.enemies.length&&b.enemies[b.reserveCursor].hp<=0)b.reserveCursor++;b.activeEnemyIndices[slot]=b.reserveCursor<b.enemies.length?b.reserveCursor++:-1;}if(!doubleLivingTargets(b).some(t=>t.i===b.targetIndex))b.targetIndex=doubleLivingTargets(b)[0]?.i??0;}
export function doubleRound(b,playerMove=null,targetIndex=0){
 const foes=doubleLivingTargets(b),events=[];if(!foes.length)return events;
 const target=foes.find(f=>f.i===targetIndex)?.u||foes[0].u,field=b.player.field||{};
 const pool=u=>specialistAIPool(u,b.player,u.moves.filter(m=>moveUsable(u,m)));
 const plans=[];if(playerMove&&b.player.hp>0)plans.push({actor:b.player,target,move:playerMove,side:'player'});
 if(b.alliedRivet.hp>1){const ms=pool(b.alliedRivet);if(ms.length)plans.push({actor:b.alliedRivet,target,move:ms[Math.floor(b.random()*ms.length)],side:'ally'});}
 for(const {u}of foes){const ms=pool(u),allies=[b.player,b.alliedRivet].filter(a=>a.hp>0&&(a!==b.alliedRivet||a.hp>1));if(ms.length&&allies.length)plans.push({actor:u,target:allies[Math.floor(b.random()*allies.length)],move:ms[Math.floor(b.random()*ms.length)],side:'enemy'});}
 for(const p of plans){p.rank=priority(p.move,p.actor);p.speed=p.actor.stats.speed*stageMultiplier(effectiveStage(p.actor,'speed',p.target))*speedFactor(p.actor,p.target);p.tie=b.random();}
 plans.sort((a,c)=>c.rank-a.rank||c.speed-a.speed||a.tie-c.tie);
 for(const p of plans){if(p.actor.withdrawn||p.actor.hp<=0||p.actor===b.alliedRivet&&p.actor.hp<=1||p.actor.captured)continue;
  if(p.target.withdrawn||p.target.hp<=0||p.target===b.alliedRivet&&p.target.hp<=1){const alternatives=p.side==='enemy'?[b.player,b.alliedRivet].filter(u=>u.hp>0&&(u!==b.alliedRivet||u.hp>1)):doubleLivingTargets(b).map(t=>t.u);p.target=alternatives[0];if(!p.target)continue;}
  const targets=p.move.target==='ALL_FOES'?(p.side==='enemy'?[b.player,b.alliedRivet].filter(u=>u.hp>0&&(u!==b.alliedRivet||u.hp>1)):doubleLivingTargets(b).map(t=>t.u)):[p.target];
  let remaining=null;const procContext={};
  for(const victim of targets){
   // One action and one PP expenditure, with independent hit checks per opponent.
   const result=applyMove(p.actor,victim,p.move,b.random,{floor:victim===b.alliedRivet||victim.boundSovereign?1:0,continuation:remaining!==null,procContext});
   if(remaining===null)remaining=p.move.left;else p.move.left=remaining;
   if(result.replacementUid){const next=menagerieParty(p.actor).find(u=>u.uid===result.replacementUid);if(next){if(p.actor===b.player)b.player=next;else if(p.actor===b.alliedRivet)b.alliedRivet=next;else{const i=b.enemies.indexOf(p.actor),j=b.enemies.indexOf(next);if(i>=0&&j>=0)[b.enemies[i],b.enemies[j]]=[next,p.actor];}for(const plan of plans)if(plan.target===p.actor)plan.target=next;}}events.push({...p,target:victim,result});
   if(victim===b.alliedRivet&&victim.hp===1)result.messages.push(b.finaleDouble?'Hasan withdraws his wounded partner behind the line.':'Rivet retreats behind your partner, its armour barely holding.');if(victim.boundSovereign&&victim.hp<=1){victim.withdrawn=true;result.messages.push('Cruxwyrm breaks Darius’s command and withdraws from the company.');}
   if(result.skipped||p.actor.hp<=0)break;
  }
 }
 const active=[b.player,...(b.alliedRivet.hp>1?[b.alliedRivet]:[]),...doubleLivingTargets(b).map(t=>t.u)].filter(u=>u.hp>0&&!u.captured&&!u.withdrawn);for(const u of active)u.field=field;
 const before=captureHealth(...active),messages=cleanupRound(...active,b.random);if(messages.length)events.push({actor:b.player,target:b.player,side:'player',move:null,result:{messages,damage:0,hpChanges:healthChanges(before,...active)}});
 if(b.alliedRivet.hp<=0)b.alliedRivet.hp=1;for(const u of b.enemies)if(u.boundSovereign&&u.hp<=1){u.hp=1;u.withdrawn=true;}
 return events;
}

