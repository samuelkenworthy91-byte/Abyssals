import {typeEffectiveness} from './type-rules.js?v=0.87.0';
import {stageMultiplier} from './engine.js?v=0.90.41';
import {statusAttackFactor} from './status-rules.js?v=0.90.24';
import {moveUsable} from './move-rules.js?v=0.90.41';
import {canSwitch,leaveAbility,enterAbility,abilityName} from './abilities.js?v=0.90.41';

// The leader sees the actual active opponent, not the player's hidden reserves
// or intended command. Estimated damage is deliberately conservative.
const moves=unit=>(unit?.moves||[]).filter(m=>moveUsable(unit,m));
function estimate(attacker,defender,move){
 if(!move?.power||!attacker?.hp||!defender?.hp)return 0;
 let factor=typeEffectiveness(move.type_id,defender.species.types);
 if(move.type_id==='GROUND'&&['Hovercore','Levitate'].includes(abilityName(defender)))factor=0;
 if(!factor)return 0;
 const special=move.category==='SPECIAL',atk=special?'sp_attack':'attack',def=special?'sp_defence':'defence';
 const attack=(attacker.stats[atk]||1)*stageMultiplier(attacker.stages?.[atk]);
 const defence=(defender.stats[def]||1)*stageMultiplier(defender.stages?.[def]);
 const accuracy=move.accuracy==='ALWAYS'?1:Number(move.accuracy??100)/100;
 const stab=attacker.species.types.includes(move.type_id)?1.5:1;
 const climate=attacker.field?.weather==='RAIN'?(move.type_id==='WATER'?1.5:move.type_id==='FIRE'?.5:1):
  attacker.field?.weather==='SUN'?(move.type_id==='FIRE'?1.5:move.type_id==='WATER'?.5:1):1;
 return Math.max(0,((2*attacker.level/5+2)*move.power*attack/Math.max(1,defence)/50+2)*factor*stab*accuracy*climate*statusAttackFactor(attacker,special));
}
function pressure(attacker,defender){
 return Math.max(0,...moves(attacker).filter(m=>m.power>0).map(m=>estimate(attacker,defender,m)))/Math.max(1,defender.hp);
}
const hazard=(u,p)=>Math.max(0,...moves(p).filter(m=>m.power>0).map(m=>typeEffectiveness(m.type_id,u.species.types)));
function scoreMove(b,actor,target,m){
 const hp=actor.hp/Math.max(1,actor.maxHp),threat=pressure(target,actor),damage=estimate(actor,target,m);
 let score=0;
 if(m.power>0){
  score=damage/Math.max(1,target.hp)*2+(damage>=target.hp?2.5:0)+(m.priority>0&&damage>=target.hp?1.25:0);
  if(m.type_id===b.trainer.leaderSchool)score+=.2;
  if(m.effects?.some(e=>e.effect_id==='inflict_status'&&!target.status))score+=.17;
 }
 for(const e of m.effects||[]){
  if(['heal','heal_by_format'].includes(e.effect_id)&&hp<.75)score=Math.max(score,(1-hp)*2+(threat<.8?.6:0));
  if(e.effect_id==='party_heal'&&b.enemies.some(x=>x.hp>0&&x.hp<x.maxHp*.65))score=Math.max(score,.95);
  if(e.effect_id==='cure_major_status'&&actor.status)score=Math.max(score,.95);
  if(e.effect_id==='weather'&&actor.field?.weather!==e.weather&&(b.trainer.leaderSchool==='WATER'&&e.weather==='RAIN'||b.trainer.leaderSchool==='GROUND'&&e.weather==='SAND'))score=Math.max(score,b.round<=3?1.35:.8);
  if(e.effect_id==='terrain'&&actor.field?.terrain!==e.terrain&&b.trainer.leaderSchool==='GRASS')score=Math.max(score,1.05);
  if(e.effect_id==='screen'&&(actor.field?.screens?.[actor.side]?.[e.category]||0)<2)score=Math.max(score,threat<.9?1.15:.65);
  if(['inflict_status','recurring_status'].includes(e.effect_id)&&!target.status){
   const status=e.status,immune=status==='BURN'&&target.species.types.includes('FIRE')||
    (status==='POISON'||status==='BAD_POISON')&&target.species.types.some(t=>t==='STEEL'||t==='POISON')||
    status==='PARALYSIS'&&target.species.types.includes('ELECTRIC')||
    (status==='FREEZE'||status==='FROSTBITE')&&target.species.types.includes('ICE');
   if(!immune)score=Math.max(score,['SLEEP','FREEZE'].includes(status)?1.15:.87);
  }
  if(e.effect_id==='stat_stage'&&e.target==='SELF'&&e.stages>0&&hp>.52&&threat<.67){
   const stats=e.stats||[e.stat],useful=stats.some(stat=>(actor.stages?.[stat]||0)<2);
   if(useful)score=Math.max(score,b.round<=5?1.4:1);
  }
  if(['pivot','relay'].includes(e.effect_id)&&b.enemies.length>1&&hp<.6)score=Math.max(score,1.05);
  if(['protect','effigy'].includes(e.effect_id)&&threat>.45&&threat<1)score=Math.max(score,.83);
 }
 if(m.category==='STATUS'&&m.effects?.some(e=>e.effect_id==='hp_cost')&&hp<.5)score*=.35;
 return score*(m.accuracy==='ALWAYS'?1:Number(m.accuracy??100)/100);
}
export function leaderMove(b,actor,target){
 const pool=moves(actor);if(!pool.length)return null;
 const ranked=pool.map((m,index)=>({m,index,score:scoreMove(b,actor,target,m)}));
 ranked.sort((a,c)=>c.score-a.score||a.index-c.index);
 // Strategically meaningful alternatives remain possible between equal scores.
 return ranked[0].m;
}
export function chooseLeaderAction(b){
 if(!b?.trainer?.leaderTactician||b.trainer.arenaBoss)return null;
 const actor=b.enemies?.[0],target=b.player;
 if(!actor||actor.hp<=0||!target||target.hp<=0)return null;
 const incoming=pressure(target,actor),outgoing=pressure(actor,target),hp=actor.hp/actor.maxHp;
 if(canSwitch(actor)&&(b.lastLeaderSwitchRound??-99)<=b.round-3&&b.enemies.length>1){
  const candidates=b.enemies.slice(1).map((u,i)=>({u,index:i+1})).filter(({u})=>u.hp>0&&!u.dead).map(c=>{
   const take=pressure(target,c.u),give=pressure(c.u,target);
   const defence=hazard(c.u,target),health=c.u.hp/c.u.maxHp;
   return {...c,take,give,score:give-take*.85+health*.25-(defence>=4?.4:defence>=2?.15:0)};
  }).sort((a,c)=>c.score-a.score);
  const best=candidates[0],currentScore=outgoing-incoming*.85+hp*.25,urgent=incoming>=.65||outgoing<.22||hp<.38||hazard(actor,target)>=2&&incoming>.25,better=best&&best.score>currentScore+.26;
  // A switch spends the entire action and will still be hit if the player attacks.
  // Never surrender an imminent KO unless the substitute survives better.
  if(best&&urgent&&better&&best.take<incoming*.85&&best.take<1.2&&best.u.hp>0)return {kind:'switch',index:best.index};
 }
 const heal=b.trainer.bagUses>(b.trainerMedicineUsed||0);
 if(heal&&hp<.35&&incoming<.85&&outgoing<1)return {kind:'heal'};
 return {kind:'move',move:leaderMove(b,actor,target)};
}
export function switchLeader(b,index){
 const old=b.enemies?.[0],next=b.enemies?.[index];
 if(!b?.trainer?.leaderTactician||!old||!Number.isInteger(index)||index<1||!next||next.hp<=0||next.dead||!canSwitch(old))return null;
 const field=b.player.field||old.field||{};
 next.stages={};const messages=leaveAbility(old,{switching:true,nextUnit:next});
 b.enemies[index]=old;b.enemies[0]=next;b.lastLeaderSwitchRound=b.round;next.actedThisRound=true;
 messages.unshift(b.trainer.name+' withdraws '+old.species.name+' and sends out '+next.species.name+' to cover the matchup.');
 messages.push(...enterAbility(next,b.player,{party:b.enemies,field}));
 return messages;
}
export function orderLeaderReplacement(b){
 if(!b?.trainer?.leaderTactician||b.enemies.length<2)return;
 const ranked=b.enemies.map((u,index)=>({index,score:pressure(u,b.player)-pressure(b.player,u)+u.hp/Math.max(1,u.maxHp)*.2})).sort((a,c)=>c.score-a.score||a.index-c.index);
 if(ranked[0].index>0)[b.enemies[0],b.enemies[ranked[0].index]]=[b.enemies[ranked[0].index],b.enemies[0]];
}
