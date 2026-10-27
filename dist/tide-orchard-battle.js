import {ORCHARD_IDS as I,ORCHARD_REACTIONS} from './tide-orchard-data.js?v=0.90.47';
import {has,heldInfo,consumedBerry,activateHeldRecovery,abilityBattle,restoreHP,changeStage,canSwitch} from './abilities.js?v=0.90.47';
import {menagerieParty} from './menagerie-rules.js?v=0.87.0';
import {selectedAlly} from './teamcraft-battle.js?v=0.90.47';
import {unitName} from './names.js?v=0.87.0';
const ms=u=>u.moveState??={};
const alive=u=>u&&u.hp>0&&!u.dead&&!u.captured;
const sameSide=(a,b)=>a===b||a.side&&a.side===b.side;
export const orchardGrounded=u=>!u.species.types.includes('FLYING')&&!has(u,'Hovercore');
export function orchardUsable(u,m){const s=ms(u),lock=s.orchardEncore;return !(s.orchardTaunt>0&&m.category==='STATUS')&&!(lock?.turns>0&&u.moves?.some(x=>x.id===lock.id&&x.left>0)&&m.id!==lock.id);}
export function orchardInvalid(u,m,target){const s=ms(u),id=m.id;
 if(!orchardUsable(u,m))return 'Goading Glance or Refrain Lock prevents that move.';
 if(id===I.supper&&!heldInfo(u)?.effect?.berry)return 'There is no held berry to eat.';
 if(id===I.refill&&(u.heldItem||!abilityBattle(u).berry))return 'There is no eaten berry to recover, or the held slot is occupied.';
 if(id===I.sleepTalk&&u.status!=='SLEEP')return 'Dream Murmur requires sleep.';
 if(id===I.relay){const ally=selectedAlly(u);if(!alive(ally)||ally===u||ally.abilityState||!canSwitch(u)||(s.relayFatigue||0)>0)return 'Choose a living benched ally; trapping and relay fatigue prevent passing.';}
 if(id===I.encore&&(!target?.moveState?.lastMove||!target.moves?.some(x=>x.id===target.moveState.lastMove&&x.left>0)))return 'There is no previous move with PP to repeat.';
 return null;
}
export function orchardPrepare(u,t,m){if(m.orchardRule==='LOW_HP'&&t.hp<=t.maxHp/2)return {...m,power:130};if(m.orchardRule==='SPECIAL_REPLY'&&ms(u).lastSpecial?.turn===abilityBattle(u).turn)return {...m,power:120};return m;}
export function eatOrchardBerry(u,messages){const item=heldInfo(u),e=item?.effect;if(!e?.berry)return false;
 if(e.cure){u.status=null;u.statusTurns=0;u.toxicCounter=0;if(e.cure==='ALL')u.confusion=0;}
 if(e.pp){const target=u.moves?.filter(m=>m.left<m.pp).sort((a,b)=>a.left-b.left)[0];if(target)target.left=Math.min(target.pp,target.left+e.pp);}
 const amount=e.stat?0:e.amount??(e.healFraction?Math.max(1,Math.floor(u.maxHp*e.healFraction)):0);
 messages.push(...consumedBerry(u,menagerieParty(u),amount));if(e.stat)changeStage(u,e.stat,e.stages||1,u,messages);messages.push(`${unitName(u)} eats ${item.name}.`);return true;
}
function recoverBerry(u){const b=abilityBattle(u);if(u.heldItem||!b.berry)return false;u.heldItem=b.berry;u.heldDefinition=b.berryDefinition;return true;}
export function orchardEffect(a,t,m,e,messages){const s=ms(a),f=a.field??={},say=x=>messages.push(x);switch(e.effect_id){
 case 'orchard_mist':(f.orchardMist??={})[a.side||'player']=5;say('Veil of Quiet protects this side for five turns.');return true;
 case 'undertow_mark':if(t.species.types.includes('DARK'))say('The dark current cannot mark this foe.');else{ms(t).drowned={turns:4};say(`${unitName(t)} bears Drowned Mark for four turn ends.`);}return true;
 case 'blank_horizon':for(const u of [...new Set([a,t,...menagerieParty(a),...menagerieParty(t)])])if(alive(u)&&(u===a||u===t||u.abilityState))u.stages={};say('Blank Horizon clears every active stat stage.');return true;
 case 'berry_supper':eatOrchardBerry(a,messages);return true;
 case 'pantry_refill':if(recoverBerry(a))say(`${unitName(a)} recovers its eaten berry.`);return true;
 case 'orchard_tailwind':(f.orchardTailwind??={})[a.side||'player']=4;say('Orchard Updraft doubles this side’s Speed for four turns.');return true;
 case 'draining_roots':if(t.species.types.includes('GRASS'))say('Grass resists the draining roots.');else if(ms(t).roots)say('Roots already cover this foe.');else{ms(t).roots={side:a.side||'player'};say(`${unitName(t)} is caught in Draining Roots.`);}return true;
 case 'orchard_carpet':if(f.terrain==='GRASSY')f.orchardCarpet=true;return true;
 case 'breeze_relay':s.breezeOnly=true;s.relayRequested=selectedAlly(a)?.uid;delete s.effigyHandoff;say('Breeze Relay carries only the effigy to the chosen partner.');return true;
 case 'orchard_taunt':ms(t).orchardTaunt=3;say(`${unitName(t)} cannot use status moves for three turns.`);return true;
 case 'orchard_rest':a.status=null;a.statusTurns=0;a.toxicCounter=0;restoreHP(a,a.maxHp);a.status='SLEEP';a.statusTurns=2;say(`${unitName(a)} fully recovers and sleeps for two actions.`);return true;
 case 'dream_murmur':return true; // Engine calls the selected legal equipped move without PP cost.
 case 'binding_eddy':if(!has(t,'Bindproof','Wayfarer')){ms(t).eddy=4;t.trapped=Math.max(t.trapped||0,4);say('Binding Eddy holds the foe for four turn ends.');}return true;
 case 'orchard_safeguard':(f.orchardSafeguard??={})[a.side||'player']=5;say('Sanctuary Air wards this side against new status for five turns.');return true;
 case 'wakeful_seed':if(!t.species.types.includes('GRASS')){if(t.status==='SLEEP'){t.status=null;t.statusTurns=0;}ms(t).wakeful=5;say('Wakeful Seed prevents sleep for five turns.');}else say('Grass rejects the wakeful seed.');return true;
 case 'clearcut_breeze':f.screens={};for(const u of [a,t,...menagerieParty(a),...menagerieParty(t)]){u.hazards=[];if(u.field?.hazards)u.field.hazards={};}changeStage(t,'evasion',-1,a,messages);say('Clearcut Breeze clears both sides’ screens and entry hazards.');return true;
 case 'refrain_lock':ms(t).orchardEncore={id:ms(t).lastMove,turns:3};say('Refrain Lock binds the last selected move for three turns.');return true;
 default:return false;
}}
export function brineVeil(a,random,messages){const s=ms(a),n=s.brineChain||0;s.brineChain=n+1;if(random()<3**(-n)){s.brineVeil=true;s.brineSpent=false;messages.push('Brine Veil halves special damage and readies one water reply.');}else messages.push('Brine Veil fails after repeated protection.');}
export function orchardHit(a,t,m,damage){if(damage<=0||m.tidePassive||sameSide(a,t))return [];if(m.category!=='SPECIAL')return [];ms(t).lastSpecial={damage,turn:abilityBattle(t).turn,attacker:a.uid||a.species.id};const replies=[];
 if(has(t,'Stillwater')&&alive(t)){const s=ms(t);s.stillwaterHits=(s.stillwaterHits||0)+1;if(s.stillwaterHits>=3){s.stillwaterHits=0;replies.push({move:ORCHARD_REACTIONS.counter,hits:3});}}
 if(alive(t)&&ms(t).brineVeil&&!ms(t).brineSpent){ms(t).brineSpent=true;replies.push({move:ORCHARD_REACTIONS.veilReply,hits:1});}return replies;
}
export function endOrchard(units,{floor=0,random=Math.random}={}){const out=[],f=units[0]?.field||{},queue=(u,move,target=u,damage=0)=>{(f.orchardFX??=[]).push({who:u.side||'player',move,result:{damage,effectiveness:1,messages:[],hitCount:1},targetSide:target.side});};
 for(const u of units){if(!alive(u))continue;const s=ms(u),limit=u.combatFloor??floor;
 const hurt=(fraction,why)=>{const loss=Math.min(Math.max(0,u.hp-limit),Math.max(1,Math.floor(u.maxHp*fraction)));u.hp-=loss;if(loss)out.push(`${unitName(u)} loses ${loss} HP to ${why}.`);return loss;};
 if(s.drowned?.turns>0){hurt(1/16,'Drowned Mark');if(--s.drowned.turns===0)delete s.drowned;}
 if(alive(u)&&s.roots){const loss=hurt(1/8,'Draining Roots'),recipient=units.find(v=>v!==u&&v.side===s.roots.side&&alive(v));if(recipient){const gain=restoreHP(recipient,loss);if(gain)out.push(`${unitName(recipient)} receives ${gain} HP through Draining Roots.`);if(loss>0)queue(recipient,ORCHARD_REACTIONS.rootTick,u,loss);}}
 if(alive(u)&&s.eddy>0){hurt(1/8,'Binding Eddy');if(--s.eddy===0){delete s.eddy;u.trapped=0;}}
 if(alive(u)&&f.terrain==='GRASSY'&&f.orchardCarpet&&orchardGrounded(u)){const gain=restoreHP(u,Math.max(1,Math.floor(u.maxHp/16)));if(gain)out.push(`Orchard Carpet restores ${gain} HP to ${unitName(u)}.`);}
 if(alive(u)&&has(u,'Berry Pantry')&&!u.heldItem&&abilityBattle(u).berry&&random()<(f.terrain==='GRASSY'?.75:.25)&&recoverBerry(u)){out.push(`${unitName(u)} · Berry Pantry: its eaten berry regrows.`);queue(u,ORCHARD_REACTIONS.berry);out.push(...activateHeldRecovery(u,menagerieParty(u)));}
 delete s.brineVeil;delete s.brineSpent;
 for(const key of ['orchardTaunt','wakeful'])if(s[key]>0)s[key]--;
 if(s.orchardEncore&&--s.orchardEncore.turns<=0)delete s.orchardEncore;
 }
 for(const name of ['orchardTailwind','orchardMist','orchardSafeguard'])for(const side in f[name]||{})if(--f[name][side]<=0)delete f[name][side];return out;
}
