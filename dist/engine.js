import {heldSurvival,finishHeldMove,activateHeldRecovery} from './abilities.js?v=0.90.41';
import {secondaryChance,prepareSpecialistMove,stabMultiplier,actionInvalid,beginAction,blocksTarget,strikeBarrier,teamcraftEffect,endTeamcraft,selectedAlly} from './teamcraft-battle.js?v=0.90.30';
import {enterAbility,leaveAbility} from './abilities.js?v=0.90.41';
import {statusAttackFactor} from './status-rules.js?v=0.90.24';
import {birdPrepareMove,birdAccuracy,birdGroundImmunity,birdThreshold} from './bird-abilities.js?v=0.90.41';
import {menagerieParty} from './menagerie-rules.js?v=0.87.0';
import {resolveSalvationMove} from './salvation.js?v=0.87.0';
import {captureHealth,healthChanges} from './health-presentation.js?v=0.87.0';
import {canPayMoveHP,moveUsable,movePriority,moveDamageMultiplier,trackMove,consumeWard,extraMoveEffect,contactReaction,endMoveEffects} from './move-rules.js?v=0.90.41';
export {moveUsable} from './move-rules.js?v=0.90.41';
import {canSwitch,isContact,effectiveStage,weatherSuppressed,triggerArcticEndurance,has,abilityMemory,abilityBattle,speedFactor,heldStat,heldInfo,restoreHP,blockedByAbility,critChance,ignoresDefence,abilityMultiplier,afterDamage,afterStatusMove,recordMove,failedMove,changeStage,blocksEvasion,inflictStatus,endAbilities,triggerSunWrath} from './abilities.js?v=0.90.41';
import {typeEffectiveness} from './type-rules.js?v=0.87.0';
import {startingStats,STAT_BALANCE_VERSION,EVOLUTION_STAT_VERSION} from './stat-balance.js?v=0.87.0';
import {unitName} from './names.js?v=0.87.0';
// Isolated demonstration rules. These numeric bindings are NOT locked Abyssals canon.
export const PROTOTYPE_RULES = Object.freeze({level:8,statInitialization:'half HP and one-fifth other species base stats',damage:'Gen-III-shaped integer demonstration; type effectiveness and authored abilities',abilities:true,criticalMultiplier:2,confusionTurns:[1,6],supervisedFloor:1});
export function damageScale(level){return Math.min(1,.55+level*.015);}
export function rng(seed=73921){let s=seed>>>0;const next=()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};next.state=()=>s>>>0;return next;}
export function instance(species,level,moves){const stats=startingStats(species);return {evolutionRenewalVersion:1,abilitySlot:'primary',statBalanceVersion:STAT_BALANCE_VERSION,evolutionStatVersion:EVOLUTION_STAT_VERSION,species,level,hp:stats.hp,maxHp:stats.hp,stats,stages:{},moves:moves.map(m=>({...m,left:m.pp})),confusion:0,immuneFlinch:0,flinched:false};}
export function stageMultiplier(stage){const s=Math.max(-6,Math.min(6,stage||0));return s>=0?(2+s)/2:2/(2-s);}
export function priority(move,unit){return movePriority(move,unit);}
export function turnOrder(player,enemy,pm,em,random){const pp=priority(pm,player),ep=priority(em,enemy);if(pp!==ep)return pp>ep?['player','enemy']:['enemy','player'];const ps=player.stats.speed*stageMultiplier(effectiveStage(player,'speed',enemy))*speedFactor(player,enemy),es=enemy.stats.speed*stageMultiplier(effectiveStage(enemy,'speed',player))*speedFactor(enemy,player);return ps===es?(random()<.5?['player','enemy']:['enemy','player']):(ps>es?['player','enemy']:['enemy','player']);}
function resolveMove(actor,target,move,random,{floor=1,continuation=false,procContext={}}={}){
 const selfFloor=actor.combatFloor??floor;procContext.startedFullHP??=actor.hp===actor.maxHp;const messages=[];const movedFirst=!target.actedThisRound;actor.actedThisRound=true;if(actor.hp<=0||target.hp<=0)return {damage:0,messages:['No living target.'],skipped:true};if(!continuation&&actor.flinched){actor.flinched=false;return {damage:0,messages:[`${unitName(actor)} flinched.`],skipped:true};}
 if(!continuation&&!moveUsable(actor,move))return {damage:0,messages:[move.left<=0?'No PP remains.':!canPayMoveHP(actor,move)?`${unitName(actor)} needs more HP to use ${move.name}.`:'That move is sealed.'],skipped:true};
 if(!continuation&&actor.status==='SLEEP'){if(actor.statusTurns>0){actor.statusTurns--;return {damage:0,skipped:true,messages:[`${unitName(actor)} is asleep.`]};}actor.status=null;}
 if(!continuation&&actor.status==='FREEZE'){if(random()<.2)actor.status=null;else return {damage:0,skipped:true,messages:[`${unitName(actor)} is frozen.`]};}
 if(!continuation&&actor.status==='PARALYSIS'&&random()<.25)return {damage:0,skipped:true,messages:[`${unitName(actor)} cannot move: paralysis.`]};
 if(!continuation){const invalid=actionInvalid(actor,move,target);if(invalid)return {damage:0,skipped:true,messages:[invalid]};}beginAction(actor,move,continuation);if(!continuation)move.left--;move=birdPrepareMove(actor,resolveSalvationMove(actor,move),{isContact});if(move.nonlethal)floor=Math.max(1,floor);trackMove(actor,move);if(move.menagerieRule==='WHITEOUT_WALTZ'&&actor.field?.weather==='HAIL'&&!weatherSuppressed(actor,target))move={...move,power:90};move=prepareSpecialistMove(actor,move);if(move.sunPierce&&actor.field?.weather==='SUN'&&!weatherSuppressed(actor,target))move={...move,ignorePositiveDefence:true};
 if(!continuation&&actor.confusion>0){actor.confusion--;if(random()<.33){const damage=Math.min(actor.hp-selfFloor,Math.max(1,Math.floor(actor.maxHp*.1)));actor.hp-=damage;return {damage:0,selfDamage:damage,skipped:true,messages:[`${unitName(actor)} is confused and loses ${damage} HP.`]};}}
 const sure=actor.moveState?.sureHit>0;if(sure)actor.moveState.sureHit--;const cragSight=birdAccuracy(actor,target,move),ignoreEvasion=cragSight||move.effects.some(e=>e.effect_id==='ignore_positive_evasion');
 const accuracy=sure||move.accuracy==='ALWAYS'?Infinity:Math.min(100,(move.accuracy??100)*(heldInfo(actor)?.effect?.operation==='accuracy_multiplier'?heldInfo(actor).effect.multiplier:1)+(move.category==='STATUS'&&heldInfo(actor)?.effect?.operation==='status_accuracy'?heldInfo(actor).effect.add_points:0))*stageMultiplier(cragSight?Math.max(0,actor.stages.accuracy||0):actor.stages.accuracy)/stageMultiplier(ignoreEvasion?Math.min(0,effectiveStage(target,'evasion',actor)):effectiveStage(target,'evasion',actor));
 if(random()*100>=accuracy){failedMove(actor,move);return {damage:0,missed:true,messages:[`${unitName(actor)} used ${move.name}, but missed.`]};}
 if(!['SELF','ACTIVE_SIDE'].includes(move.target)&&blockedByAbility(actor,target,move,messages)){failedMove(actor,move);return {damage:0,immune:true,effectiveness:0,messages};}
 if(blocksTarget(actor,target,move,messages))return {damage:0,blocked:true,messages};
 let damage=0,barrierBlocked=false,critical=false,effectiveness=move.power?typeEffectiveness(move.type_id,target.species.types):1;
 if(move.power&&effectiveness===0){failedMove(actor,move);return {damage:0,critical:false,effectiveness,immune:true,messages:[`${unitName(actor)} used ${move.name}. No effect! ${unitName(target)} is immune to ${move.type_id} (0×).`,...birdGroundImmunity(target,move,{changeStage})]};}
  let hitCount=0;
  if(move.power){
   const special=move.category==='SPECIAL',atk=special?'sp_attack':'attack',def=special?'sp_defence':'defence';
   const strikes=move.hits?Math.max(1,Math.min(5,Math.floor(move.hits.min+random()*(move.hits.max-move.hits.min+1)))):1;
   for(let i=0;i<strikes&&target.hp>floor&&actor.hp>0;i++){
    const strikeCritical=!(target.moveState?.critGuard>0)&&random()<critChance(actor,move,target);
    const a=actor.stats[atk]*(strikeCritical?1:stageMultiplier(actor.stages[atk]))*heldStat(actor,atk)*statusAttackFactor(actor,special);
    const d=target.stats[def]*(strikeCritical?1:stageMultiplier(ignoresDefence(actor,target)||move.ignorePositiveDefence?Math.min(0,target.stages[def]||0):target.stages[def]))*heldStat(target,def);
    const sameType=stabMultiplier(actor,move);
    let strikeDamage=Math.max(1,Math.floor((Math.floor((2*actor.level/5+2)*move.power*a/Math.max(1,d)/50)+2)*sameType*(strikeCritical?2:1)*(.85+random()*.15)*damageScale(actor.level)*effectiveness*moveDamageMultiplier(actor,target,move,{critical:strikeCritical,movedFirst})*abilityMultiplier(actor,target,move,{effectiveness,critical:strikeCritical,movedFirst,switching:!!target.switching})));
    if(has(target,'Ghost Hull')&&target.hp===target.maxHp&&strikeDamage>=target.hp&&!abilityBattle(target).flags.hull){strikeDamage=target.hp-1;abilityBattle(target).flags.hull=true;messages.push(`${unitName(target)} · Ghost Hull: held on at 1 HP.`);}
    strikeDamage=Math.max(0,Math.min(target.hp-floor,strikeDamage));
    const barrier=strikeBarrier(actor,target,move,strikeDamage,{floor},messages);barrierBlocked=barrierBlocked||barrier.blocked;strikeDamage=heldSurvival(target,barrier.damage,messages);target.hp-=strikeDamage;damage+=strikeDamage;critical=critical||strikeCritical;hitCount++;
    consumeWard(target,move,strikeDamage);
    if(strikeDamage){actor.field??={};actor.field.currentMoveDamage??=[];actor.field.currentMoveDamage.push({actor:actor.uid||actor.species.id,victim:target.uid||target.species.id,side:target.side});}
    if(move.hits){
     messages.push(...afterDamage(actor,target,move,strikeDamage,{effectiveness,critical:strikeCritical,floor:selfFloor,random,counterContext:procContext}));
     messages.push(...contactReaction(actor,target,move,strikeDamage,random,{floor:selfFloor}));
    }
   }
  }
 messages.push(`${unitName(actor)} used ${move.name}.${damage?' '+damage+' damage.':''}${critical?' Critical hit!':''}`);
  if(move.hits)messages.push(`Hit ${hitCount} ${hitCount===1?'time':'times'}.`);
 if(move.power&&effectiveness!==1)messages.push(effectiveness>1?`Super effective! ${move.type_id} exploits ${unitName(target)}’s weakness (${effectiveness}×).`:`Not very effective. ${unitName(target)} resists ${move.type_id} (${effectiveness}×).`);
 for(const [ei,original]of move.effects.entries()){let e=original;if(e.when==='TARGET_KO'&&target.hp>0)continue;if(e.when==='USER_STARTED_AT_FULL_HP'&&!procContext.startedFullHP)continue;if(continuation&&e.target==='SELF')continue;if(move.condition==='RAIN'&&(actor.field?.weather!=='RAIN'||weatherSuppressed(actor,target)))continue;if(move.sandSpeed&&e.stats?.includes('speed')&&(actor.field?.weather!=='SAND'||weatherSuppressed(actor,target)))continue;if(move.winterDrop&&actor.field?.weather==='HAIL'&&!weatherSuppressed(actor,target))e={...e,stages:-2};if(move.power&&e.secondary&&damage<=0)continue;if(move.power&&damage===0&&barrierBlocked&&e.target!=='SELF'&&!['recoil','hp_cost'].includes(e.effect_id))continue;const roll=e.secondary?(procContext[ei]??=(random()*100)):random()*100;if(!['recurring_status','contact_status_retaliation'].includes(e.effect_id)&&roll>=secondaryChance(actor,e))continue;const who=e.target==='SELF'?actor:e.target==='PARTNER'?selectedAlly(actor)||actor:target;
 if(teamcraftEffect(actor,target,move,e,messages,{random,changeStage,restoreHP}))continue;
  if(e.effect_id==='party_stage'){const allies=[...new Set([actor,...menagerieParty(actor)])].filter(u=>u.hp>0&&!u.dead&&u.side===actor.side&&(u===actor||u.abilityState));for(const member of allies)for(const stat of e.stats||[e.stat])if(stat)changeStage(member,stat,e.stages,actor,messages);}
   if(e.effect_id==='stat_stage'){if(who.hp<=0||who.dead)continue;let copied=false;for(const stat of e.stats||[e.stat])if(stat){if(who===actor&&stat==='evasion'&&e.stages>0&&blocksEvasion(target)){messages.push(`${unitName(target)} blocks evasion boosts.`);continue;}const gain=changeStage(who,stat,e.stages,actor,messages);if(gain>0&&who===actor&&has(target,'Covetous Mirror')&&!abilityMemory(target).flags.mirror&&!copied){const n=gain;changeStage(target,stat,n,target,messages);abilityMemory(target).flags.mirror=true;copied=true;messages.push(`${unitName(target)} · Covetous Mirror: copied ${stat.replaceAll('_',' ')}.`);}}}
  if(e.effect_id==='flinch'&&!who.actedThisRound&&!who.immuneFlinch&&!has(who,'Unfazed'))who.flinched=true;
  if(e.effect_id==='inflict_status')inflictStatus(who,e.status,messages,random);
  if(e.effect_id==='status_immunity'){who.statusImmunity??={};who.statusImmunity[e.status]=e.turns||5;}
  if(e.effect_id==='prevent_switch'&&!has(who,'Bindproof','Wayfarer'))who.trapped=e.turns||3;
  if(e.effect_id==='prevent_forced_switch')who.preventForcedSwitch=e.turns||5;
  if(e.effect_id==='cure_major_status'){who.status=null;who.toxicCounter=0;messages.push(`${unitName(who)}: major status cured.`);}
  if(e.effect_id==='clear_negative_stat_stages')for(const key in who.stages)if(who.stages[key]<0)who.stages[key]=0;
  if(e.effect_id==='prevent_flinch')actor.immuneFlinch=e.turns||5;
  if(e.effect_id==='party_heal'){for(const member of menagerieParty(actor)){if(member.hp<=0||member.dead||move.activeOnly&&member!==actor&&!member.abilityState)continue;const [n,d]=e.max_hp_fraction;const restored=restoreHP(member,Math.max(1,Math.floor(member.maxHp*n/d)));messages.push(`${unitName(member)} restored ${restored} HP from ${move.name}.`);}}
  if(e.effect_id==='heal'){const [n,d]=e.max_hp_fraction;const restored=heal(who,Math.max(1,Math.floor(who.maxHp*n/d*(has(actor,'Medicinal Sap')?1.15:1))));messages.push(`${unitName(who)} restored ${restored} HP.`);}
  if(e.effect_id==='drain'&&damage){const [n,d]=e.actual_hp_damage_fraction;const restored=heal(actor,Math.max(1,Math.floor(damage*n/d*(has(actor,'Bottomless')?1.25:1))));messages.push(`${unitName(actor)} drained ${restored} HP.`);}
  if(e.effect_id==='recoil'&&damage&&!has(actor,'Hard Head')){const [n,d]=e.fraction;const recoil=Math.min(Math.max(0,actor.hp-selfFloor),Math.max(1,Math.floor((e.basis==='MAX_HP'?actor.maxHp:damage)*n/d)));actor.hp-=recoil;messages.push(`${unitName(actor)} took ${recoil} recoil damage.`);}
  extraMoveEffect(actor,target,move,e,messages,{floor:selfFloor});
 }
 if(move.id===737&&(actor.stages.speed||0)<0){actor.stages.speed=0;messages.push('Hold the Burh restored lowered Speed.');}
 if(move.power&&!move.hits)messages.push(...afterDamage(actor,target,move,damage,{effectiveness,critical,floor:selfFloor,random,counterContext:procContext}));else if(!move.power)messages.push(...afterStatusMove(actor,target));
 if(!move.hits)messages.push(...contactReaction(actor,target,move,damage,random,{floor:selfFloor}));messages.push(...finishHeldMove(actor,target,move,damage,{floor:selfFloor}));recordMove(actor,move);if(move.nonlethal){target.hp=Math.max(1,target.hp);messages.push('First Light Salvation holds back · the target remains alive.');}return {damage,critical,effectiveness,messages,hitCount,category:move.category,remainingHp:target.hp};
}
export function cleanupRound(...args){const random=typeof args.at(-1)==='function'?args.pop():Math.random,units=args;for(const u of units)triggerSunWrath(u);endTeamcraft(units);const residual=endAbilities(units,{floor:units[0]?.combatFloor??0,random});const extra=endMoveEffects(units,random);for(const u of units){residual.push(...birdThreshold(u,{changeStage}));triggerSunWrath(u);if(triggerArcticEndurance(u))residual.push(`${unitName(u)} · Arctic Endurance: Defence and Special Defence rose.`);u.flinched=false;u.actedThisRound=false;if(u.immuneFlinch>0)u.immuneFlinch--;}return [...residual,...extra];}
export function heal(unit,amount=Math.min(50,Math.floor(unit.maxHp/2))){if(unit.hp<1||unit.hp>=unit.maxHp)return 0;return restoreHP(unit,amount);}
export function pathfind(start,end,blocked,width=48,height=32){const key=([x,y])=>`${x},${y}`;const queue=[start],seen=new Set([key(start)]),parents=new Map();let reached=false;for(let i=0;i<queue.length;i++){const p=queue[i];if(key(p)===key(end)){reached=true;break;}for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]]){const n=[p[0]+dx,p[1]+dy],k=key(n);if(n[0]<0||n[1]<0||n[0]>=width||n[1]>=height||blocked(n[0],n[1])||seen.has(k))continue;seen.add(k);parents.set(k,p);queue.push(n);}}if(!reached)return [];const path=[];let p=end;while(key(p)!==key(start)){path.push(p);p=parents.get(key(p));}return path.reverse();}

export function applyMove(actor,target,move,random,options){const formBefore=new Map([actor,target].map(u=>[u.uid||u.species.id,!!u.sunWrath?.active]));const affected=[...new Set([actor,target,...(move.allyTarget||move.effects?.some(e=>['party_heal','active_cleanse','healing_relay'].includes(e.effect_id))?menagerieParty(actor):[])])];const before=captureHealth(...affected);const result=resolveMove(actor,target,move,random,options);result.messages.push(...birdThreshold(actor,{changeStage}),...birdThreshold(target,{changeStage}));triggerSunWrath(actor);triggerSunWrath(target);for(const u of [actor,target])if(triggerArcticEndurance(u))result.messages.push(`${unitName(u)} · Arctic Endurance: Defence and Special Defence rose.`);const pivot=move.effects?.some(e=>e.effect_id==='pivot')&&result.damage>0&&actor.hp>0&&canSwitch(actor);if(!result.skipped&&(actor.moveState?.relayRequested||pivot)){const next=selectedAlly(actor);if(next&&(!pivot||next!==actor&&!next.abilityState)){const field=actor.field;if(pivot){delete actor.moveState.effigyHandoff;delete actor.moveState.relayRequested;delete actor.moveState.decoy;result.messages.push(`${unitName(actor)} withdraws after Parting Blow.`);}result.messages.push(...leaveAbility(actor,{switching:true,nextUnit:next,passStages:!pivot}),...enterAbility(next,target,{party:menagerieParty(actor),field}));next.actedThisRound=true;result.replacementUid=next.uid;}}result.hpChanges=healthChanges(before,...affected);result.transforms=[actor,target].filter(u=>u.sunWrath?.active&&!formBefore.get(u.uid||u.species.id)).map(u=>({uid:u.uid||u.species.id,side:u.side,speciesId:u.species.id}));return result;}


