import {restoreHP as healRelayHP} from './abilities.js?v=0.90.40';
import {menagerieParty} from './menagerie-rules.js?v=0.87.0';
import {unitName} from './names.js?v=0.87.0';
export const PASS_STATS=['attack','defence','sp_attack','sp_defence','speed'];
const has=(u,n)=>u?.species?.ability_names?.[u.abilitySlot||'primary']===n;
const battle=u=>(u.abilityBattle??={flags:{},turn:0});
const flags=u=>(battle(u).flags??={});
const ms=u=>(u.moveState??={});
const living=u=>u&&u.hp>0&&!u.dead&&!u.withdrawn;
export const selectedAlly=u=>menagerieParty(u).find(v=>v.uid===u.teamcraftTargetUid&&living(v));
export function secondaryChance(u,e){const p=e.chance_percent??100;return e.secondary&&has(u,'Fortune Thread')?Math.max(p,Math.min(60,p*2)):p;}
export function prepareSpecialistMove(u,m){if(!m.power)return m;let effects=m.effects||[];if(has(u,'Sage Mind')&&m.category==='SPECIAL'&&effects.some(e=>e.secondary))return {...m,power:m.power*1.3,effects:effects.filter(e=>!e.secondary)};return m;}
export const stabMultiplier=(u,m)=>u.species.types.includes(m.type_id)?has(u,'Native Force')?1.8:1.5:1;
export const soundMove=m=>m.sound??/roar|cry|call|chorus|song|echo|sound|sonic/i.test(m.name);
export function actionInvalid(u,m,foe=null){
 if(m.effects.some(e=>e.effect_id==='effigy')){const cost=Math.max(1,Math.floor(u.maxHp/4));if(u.hp<=cost||ms(u).decoy)return 'Not enough HP, or an effigy already exists.';}
 if(m.effects.some(e=>['relay','healing_relay'].includes(e.effect_id))){if((u.trapped&&!has(u,'Wayfarer')&&!has(u,'Bindproof'))||(ms(u).relayFatigue||0)>0||!selectedAlly(u)||selectedAlly(u)===u)return 'Choose a living benched partner; trapped or fatigued partners cannot relay.';}
 if(m.effects.some(e=>e.effect_id==='clear_weather')&&!u.field?.weather)return 'There is no weather to clear.';
 if(m.effects.some(e=>e.effect_id==='rain_mantle')&&(u.field?.weather!=='RAIN'||(has(u,'Weather Calm')||has(foe,'Weather Calm'))))return 'Rain Mantle requires active rain.';
 if(m.effects.some(e=>e.effect_id==='aurora_screen')&&(u.field?.weather!=='HAIL'||(has(u,'Weather Calm')||has(foe,'Weather Calm'))))return 'Aurora Reprieve requires active hail.';
 if(m.allyTarget&&!selectedAlly(u))return 'Choose a living ally.';
 return null;
}
export function beginAction(u,m,continuation=false){if(continuation)return;const s=ms(u);if(!m.effects.some(e=>e.effect_id==='protect'))s.protectChain=0;delete s.protection;}
export function blocksTarget(u,t,m,messages){if(u===t||['SELF','ACTIVE_SIDE','PARTNER'].includes(m.target))return false;if(ms(t).protection){messages.push(`${unitName(t)} holds fast; the move is blocked.`);return true;}if(!m.power&&ms(t).decoy&&!soundMove(m)){messages.push(`${unitName(t)}’s effigy blocks the status move.`);return true;}return false;}
export function strikeBarrier(actor,target,move,damage,{floor=0}={},messages=[]){
 const s=ms(target),f=flags(target);
 if(has(target,'False Front')&&!f.falseFront&&damage>0){f.falseFront=true;const n=Math.min(Math.max(0,target.hp-floor),Math.max(1,Math.floor(target.maxHp/8)));target.hp-=n;messages.push(`${unitName(target)} · False Front shatters; ${n} HP paid.`);return {damage:0,blocked:true};}
 if(s.decoy&&!soundMove(move)&&damage>0){const n=Math.min(s.decoy.hp,damage);s.decoy.hp-=n;messages.push(`The effigy absorbs ${n} damage.${s.decoy.hp<=0?' It breaks!':''}`);if(s.decoy.hp<=0)delete s.decoy;return {damage:0,blocked:true};}
 if(s.critGuard>0){} // Critical prevention is applied before the damage roll.
 if(s.oneWard&&(!s.oneWard.category||s.oneWard.category===move.category)&&(!s.oneWard.moveId||s.oneWard.moveId===move.id)){damage=Math.max(1,Math.floor(damage*s.oneWard.multiplier));delete s.oneWard;}
 return {damage,blocked:false};
}
export function teamcraftEffect(actor,target,move,e,messages,hooks){const {random,changeStage,restoreHP}=hooks,s=ms(actor),f=flags(actor),ally=selectedAlly(actor);const weather=actor.field?.weather,calm=has(actor,'Weather Calm')||has(target,'Weather Calm');
 if(e.effect_id==='protect'){const chain=s.protectChain||0;s.protectChain=chain+1;if(random()<3**(-chain)){s.protection=true;messages.push(`${unitName(actor)} holds fast.`);}else messages.push('Holdfast fails after repeated protection.');return true;}
 if(e.effect_id==='effigy'){const hp=Math.max(1,Math.floor(actor.maxHp/4));actor.hp-=hp;s.decoy={hp,maxHp:hp};s.effigyHandoff=true;messages.push(`An effigy takes the front · ${hp} HP.`);return true;}
 if(e.effect_id==='active_cleanse'){for(const member of menagerieParty(actor).filter(u=>living(u)&&(u===actor||u.abilityState)&&u.side===actor.side)){member.status=null;member.statusTurns=0;member.confusion=0;member.toxicCounter=0;messages.push(`${unitName(member)} is cleansed by Mourning Dew.`);}return true;}
 if(e.effect_id==='healing_relay'){if(!living(ally)||ally===actor)return true;s.healingRelay=true;s.relayRequested=ally.uid;delete s.effigyHandoff;delete s.decoy;messages.push(`${unitName(actor)} prepares a restorative passage for ${unitName(ally)}.`);return true;}
 if(e.effect_id==='relay'){s.relayRequested=ally.uid;messages.push(`${unitName(actor)} passes the standard to ${unitName(ally)}.`);return true;}
 if(e.effect_id==='clear_weather'){actor.field.weather=null;actor.field.weatherTurns=0;messages.push('The sky clears.');return true;}
 if(e.effect_id==='clear_offence'){for(const stat of ['attack','sp_attack'])if(target.stages[stat]>0)target.stages[stat]=0;messages.push('The target’s offensive boosts fade.');return true;}
 if(e.effect_id==='rain_mantle'){actor.status=null;actor.statusTurns=0;actor.toxicCounter=0;changeStage(actor,'sp_defence',1,actor,messages);return true;}
 if(e.effect_id==='single_ward'){s.oneWard={category:e.category,multiplier:e.multiplier};s.wardTurns=e.turns;return true;}
 if(e.effect_id==='crit_guard'){s.critGuard=e.turns;return true;}
 if(e.effect_id==='entry_cleanse'){s.entryCleanse=true;return true;}
 if(e.effect_id==='ally_cure'){if(ally){ally.status=null;ally.statusTurns=0;ally.confusion=0;ally.toxicCounter=0;messages.push(`${unitName(ally)} is cleansed.`);}return true;}
 if(e.effect_id==='aurora_screen'){actor.field.screens??={};actor.field.screens[actor.side]??={};actor.field.screens[actor.side].SPECIAL=Math.max(3,actor.field.screens[actor.side].SPECIAL||0);return true;}
 return false;
}
export function departTeamcraft(u,next,switching,messages=[]){if(!living(u)||!living(next)||!switching)return false;const s=ms(u),f=flags(u);let pass=false;
 if(s.healingRelay){next.stages={};delete ms(next).decoy;delete ms(next).effigyHandoff;const restored=Math.floor(next.maxHp/4*(has(u,'Medicinal Sap')?1.15:1));const before=next.hp;healRelayHP(next,Math.max(1,restored));next.status=null;next.statusTurns=0;next.confusion=0;next.toxicCounter=0;ms(next).relayFatigue=3;messages.push(`${unitName(next)} receives ${next.hp-before} HP and is cleansed.`);return false;}
 if(!(s.relayFatigue>0)&&(s.relayRequested||s.effigyHandoff||has(u,'Relay Plumage'))){next.stages=Object.fromEntries(PASS_STATS.map(k=>[k,Math.max(-6,Math.min(6,u.stages?.[k]||0))]));ms(next).relayFatigue=3;if(s.effigyHandoff&&!s.relayRequested&&s.decoy)ms(next).decoy={...s.decoy};messages.push(`${unitName(next)} inherits five combat stat stages.`);pass=true;}
 if(s.entryCleanse){for(const k in next.stages)if(next.stages[k]<0)next.stages[k]=0;}
 if(has(u,'Sand Reservoir')&&f.silt){ms(next).oneWard={category:'PHYSICAL',multiplier:.8};delete f.silt;}
 if(has(u,'Rain Sluice')&&f.rainCure&&u.field?.weather==='RAIN'){next.status=null;next.statusTurns=0;next.toxicCounter=0;f.rainCure=false;}
 if(has(u,'Margin Note')&&s.recordedMove){ms(next).oneWard={moveId:s.recordedMove,multiplier:.7};}
 return pass;
}
export function damagedTeamcraft(actor,target,move,damage,hooks){if(!damage)return;const {changeStage,messages}=hooks,s=ms(target),f=flags(target);
 if(has(target,'Rain Sluice')&&target.field?.weather==='RAIN'&&!has(actor,'Weather Calm')&&!has(target,'Weather Calm')&&!f.rainUsed&&living(target)){f.rainUsed=true;f.rainCure=true;}
 if(has(target,'Countermelody')&&soundMove(move)&&!s.melodyUsed)s.melodyReady=true;
 if(has(actor,'Countermelody')&&ms(actor).melodyReady&&soundMove(move)){changeStage(target,'sp_attack',-1,actor,messages);ms(actor).melodyReady=false;ms(actor).melodyUsed=true;}
 if(has(target,'Margin Note')){s.moveVisits??={};s.moveVisits[move.id]=(s.moveVisits[move.id]||0)+1;if(s.moveVisits[move.id]>=2)s.recordedMove=move.id;}
}
export function endTeamcraft(units){const suppressed=units.some(u=>u.hp>0&&has(u,'Weather Calm'));for(const u of units){const s=ms(u);delete s.protection;if(s.relayFatigue>0)s.relayFatigue--;if(s.critGuard>0)s.critGuard--;if(s.wardTurns>0&&--s.wardTurns===0)delete s.oneWard;if(has(u,'Sand Reservoir')&&!suppressed&&u.field?.weather==='SAND'&&living(u)){s.sandTurns=(s.sandTurns||0)+1;if(s.sandTurns>=2)flags(u).silt=true;}else s.sandTurns=0;}}
export function specialistAIPool(u,foe,moves){const roster=menagerieParty(u).filter(v=>v!==u&&living(v));u.teamcraftTargetUid=roster.sort((a,b)=>(b.hp/b.maxHp)-(a.hp/a.maxHp))[0]?.uid;return moves.filter(m=>!actionInvalid(u,m,foe)&&(!m.effects.some(e=>e.effect_id==='protect')||(ms(u).protectChain||0)<2)&&(!m.effects.some(e=>e.effect_id==='heal')||u.hp<u.maxHp*.65));}

