import {endOrchard} from './tide-orchard-battle.js?v=0.90.48';
import {departTeamcraft,damagedTeamcraft} from './teamcraft-battle.js?v=0.90.48';
import {randomStatusDuration} from './status-rules.js?v=0.90.24';
import {birdRecordMove,birdMultiplier,birdAfterDamage,birdAfterStatus,birdLeave} from './bird-abilities.js?v=0.90.41';
import {paladinLeave,paladinEnter,paladinStatProtected,paladinMultiplier,paladinAfterDamage,paladinAfterStatus,paladinCritStage,preventsCritical} from './paladin-abilities.js?v=0.90.41';
import {menagerieParty,bindMenagerieParty,relaySpread,otherPartyDamaged,recordMenagerieDamage} from './menagerie-rules.js?v=0.87.0';
import {ABILITIES} from './ability-data.js?v=0.90.48';
import {HELD_ITEMS} from './held-data.js?v=0.90.48';
import {unitName} from './names.js?v=0.87.0';
export function abilityName(u){return u.species.ability_names?.[u.abilitySlot||'primary']||null;}
export function abilityInfo(u){return ABILITIES.find(a=>a.name===abilityName(u));}
export function has(u,...names){return names.includes(abilityName(u));}
const stage=(u,key,n)=>{u.stages??={};const before=u.stages[key]||0;u.stages[key]=Math.max(-6,Math.min(6,before+n));return u.stages[key]-before;};
const note=(u,text)=>`${unitName(u)} · ${abilityName(u)}: ${text}`;
export function abilityMemory(u){return u.abilityState??={types:[],moves:[],flags:{},charges:0,dealt:0,hits:0};}
export function abilityBattle(u){return u.abilityBattle??={flags:{},turn:0};}
export function heldInfo(u){return HELD_ITEMS.find(i=>i.id===u.heldItem)||u.heldDefinition||null;}
export function heldStat(u,key){const e=heldInfo(u)?.effect;return (e?.operation==='assault_vest'&&key==='sp_defence'?e.multiplier:1)*(e?.operation==='quest_stats'?e.stats[key]||1:1)*(e?.operation==='effective_stat'&&e.stat===key?e.multiplier:1)*(key!=='hp'&&u.sunWrath?.active?1.25:1);}
export function weatherSuppressed(...units){return units.some(u=>u.hp>0&&has(u,'Weather Calm'));}
export function effectiveStage(u,key,foe=null){return Math.max(-6,Math.min(6,u.stages?.[key]||0));}
export function speedFactor(u,opponent){const w=u.field?.weather,suppressed=weatherSuppressed(u,opponent||u);return (u.field?.orchardTailwind?.[u.side||'player']>0?2:1)*(u.status==='PARALYSIS'?.5:1)*heldStat(u,'speed')*(!suppressed&&(has(u,'Rainrunner')&&w==='RAIN'||has(u,'Sunstride')&&w==='SUN'||has(u,'Snowfoot')&&['SNOW','HAIL'].includes(w))?1.5:1);}
export function enterAbility(u,foe,{party=[u],field={},afterFaint=false,newBattle=false}={}){
 bindMenagerieParty(party);u.abilitySlot??='primary';u.abilityState={types:[],moves:[],flags:{},charges:0,dealt:0,hits:0};if(newBattle)u.abilityBattle={flags:{},turn:0};abilityBattle(u);u.field=field;
 u.abilityState.allies=Math.max(0,party.filter(p=>p.hp>0&&!p.dead).length-1);u.abilityState.primaryTypes=new Set(party.filter(p=>p.hp>0&&!p.dead).map(p=>p.species.types[0])).size;
 const messages=[];delete u.fixerBoost;if(triggerSunWrath(u))messages.push(note(u,"Sun God’s Wrath: transformed; all six stats boosted by 25%."));const raise=(keys,text)=>{for(const k of keys)stage(u,k,1);messages.push(note(u,text));};
 if(!newBattle&&!afterFaint){if(heldInfo(u)?.effect?.condition==='switch')abilityBattle(u).flags.defenderReady=true;if(has(u,'Tidal Footwork')&&!abilityBattle(u).flags.tidalFootwork){abilityBattle(u).flags.tidalFootwork=true;raise(['speed'],'voluntary switch raised Speed.');}}
 if(has(u,'Clear Judgment')){for(const k in u.stages)if(u.stages[k]<0)u.stages[k]=0;messages.push(note(u,'negative stages cleared; opposing evasion boosts blocked.'));}
 messages.push(...paladinEnter(u));
 if(u.hp>0&&!u.dead&&has(u,'Battle Readiness')){const key=Number(u.stats.attack)>=Number(u.stats.sp_attack)?'attack':'sp_attack';changeStage(u,key,1,u,messages);messages.push(note(u,(key==='attack'?'Attack':'Special Attack')+' rose on entry.'));}
 if(u.hp>0&&!u.dead&&has(u,'Dread Presence')&&foe){for(const opponent of menagerieParty(foe).filter(x=>x.hp>0&&!x.dead&&(x===foe||x.abilityState||(foe.side==='enemy'?field.activeEnemyUids:field.activePlayerUids)?.includes(x.uid))))changeStage(opponent,'attack',-1,u,messages);}
 if(has(u,'Royal Glare')&&foe){changeStage(foe,'speed',-1,u,messages);}
 if(has(u,'Gatekeeper')&&!u.abilityState.allies)raise(['defence','sp_defence'],'last partner: Defence and Special Defence rose.');
 if(has(u,'Last Stand')&&!u.abilityState.allies)raise(['attack','speed'],'last partner: Attack and Speed rose.');
 if(newBattle&&has(u,'Many Banners')&&u.abilityState.primaryTypes>=4)raise(['sp_defence'],'four party types: Special Defence rose.');
 if(afterFaint&&has(u,'Oathkeeper'))raise(['defence','sp_defence'],'an ally fell: Defence and Special Defence rose.');
 if(afterFaint&&has(u,'Protector'))raise(['defence'],'an ally fell: Defence rose.');
 if(has(u,'Whiteout Sovereign')){changeWeather('HAIL',[u,foe].filter(Boolean),5);if(!abilityBattle(u).flags.whiteout){stage(u,'speed',1);abilityBattle(u).flags.whiteout=true;}messages.push(note(u,'five turns of hail; first entry raises Speed once.'));}
 if(has(u,'Celestial Tempest'))messages.push(...changeWeather('TEMPEST',[u,foe].filter(Boolean),5));
 if(has(u,'Sovereign Decree')){field.decree={side:u.side||'player',turns:5};messages.push(note(u,'Decree protects its side for five turns.'));}
 if(has(u,'Floodplain')&&field.weather==='RAIN'){stage(u,'defence',1);u.abilityState.flags.flood=true;messages.push(note(u,'rain raised Defence.'));}
 if(has(u,'Waystone Master')&&u.hazards?.length){u.hazards.shift();messages.push(note(u,'one entry-hazard layer removed.'));}
 messages.push(...activateHeldRecovery(u,party));return messages;
}
export function triggerArcticEndurance(u){const b=abilityBattle(u);if(!has(u,'Arctic Endurance')||u.hp<=0||u.hp>=u.maxHp/2||b.flags.arctic)return false;b.flags.arctic=true;stage(u,'defence',1);stage(u,'sp_defence',1);return true;}
export function triggerSunWrath(u){if(!has(u,"Sun God's Wrath")||u.hp<=0||u.hp>=u.maxHp/2||u.sunWrath?.active)return false;const baseMax=u.maxHp;u.sunWrath={active:true,baseMax};u.maxHp=u.stats.hp=Math.round(baseMax*1.25);u.hp=Math.max(1,Math.round(u.hp*u.maxHp/baseMax));return true;}
export function leaveAbility(u,{switching=false,nextUnit=null,passStages=true}={}){paladinLeave(u);const messages=birdLeave(u,{switching,nextUnit,changeStage,restoreHP}),alive=u.hp>0&&!u.dead;if(switching&&alive&&has(u,'Renewing Tide'))messages.push(note(u,`restored ${restoreHP(u,Math.max(1,Math.floor(u.maxHp/3)))} HP on switching out.`));delete abilityBattle(u).fixerReady;departTeamcraft(u,nextUnit,switching,messages,{passStages});if(u.sunWrath?.active){const max=u.maxHp;u.maxHp=u.stats.hp=u.sunWrath.baseMax;u.hp=u.hp<=0?0:Math.max(1,Math.round(u.hp*u.maxHp/max));delete u.sunWrath;}if(has(u,'Renewal'))u.status=null;u.trapped=0;u.moveState={};u.toxicCounter=0;u.preventForcedSwitch=0;u.immuneFlinch=0;u.statusImmunity={};u.abilityState=null;u.stages={};u.confusion=0;u.flinched=false;u.field={};return messages;}
export function beginAbilities(player,foes,party=[player],field={}){bindMenagerieParty(party);bindMenagerieParty(foes);for(const u of [...party,...foes]){u.abilityBattle={flags:{},turn:0};u.abilityState=null;u.moveState={};u.toxicCounter=0;u.field=field;u.stages={};}for(const u of party)u.side='player';player.side='player';for(const e of foes)e.side='enemy';field.titheUnits=[...party,...foes].filter(u=>has(u,'Tithe Charge')).map(u=>({uid:u.uid,side:u.side}));return [...enterAbility(player,foes[0],{party,field,newBattle:true}),...enterAbility(foes[0],player,{party:foes,field,newBattle:true})];}
export function resumeAbilities(player,foes,party=[player]){bindMenagerieParty(party);bindMenagerieParty(foes);const field=player.field||foes[0]?.field||{};for(const u of [...party,...foes])u.field=field;player.side='player';for(const e of foes)e.side='enemy';}
export function changeStage(u,key,amount,source,messages=[]){const enemy=source&&source!==u;
 const decree=u.field?.decree;const protectedStat=(u.field?.orchardMist?.[u.side||'player']>0)||paladinStatProtected(u,key)||has(u,'Stable Core')||has(u,'Battle Nerve','Rallying Cry')&&key==='attack'||has(u,'Calm Guard')&&key==='sp_defence'||has(u,'Keen Sense')&&key==='accuracy'||has(u,'Surefoot')&&key==='speed'||decree?.turns>0&&decree.side===u.side;
 if(enemy&&amount<0&&protectedStat){messages.push(note(u,'stat reduction blocked.'));return 0;}
 if(amount>0&&key==='evasion'&&has(u,'Heavy Hands'))return 0;
 if(amount>0&&key==='evasion'&&source===u&&u.opponentBlocksEvasion){messages.push('Opposing ability blocks evasion boosts.');return 0;}
 let gain=stage(u,key,amount);if(gain<0&&has(u,'Quick Study')&&!abilityBattle(u).flags.quickStudy){stage(u,key,-gain);abilityBattle(u).flags.quickStudy=true;messages.push(note(u,'restored its first lowered stat.'));gain=0;}if(gain)messages.push(`${unitName(u)}: ${key.replaceAll('_',' ')} ${gain>0?'rose':'fell'}.`);
 return gain;
}
export function blocksEvasion(u){return has(u,'Clear Judgment')||u.field?.decree?.turns>0&&u.field.decree.side===u.side;}
export function canSwitch(u,{forced=false}={}){return forced?!has(u,'Firm Stance','World Anchor')&&!u.preventForcedSwitch:!u.trapped||has(u,'Wayfarer','Bindproof');}
export function canRemoveHeld(u){return !has(u,'Safekeep');}
export function canChangeTerrain(units){return !units.some(u=>u.hp>0&&has(u,'World Anchor'));}
export function setTerrain(terrain,units){if(!canChangeTerrain(units))return false;for(const u of units)u.field.terrain=terrain;return true;}
export function hazardDamage(u,amount){return Math.floor(amount*(has(u,'Trailblazer','Waystone Master')?.5:1));}
export function bindingDamage(u,amount){return Math.floor(amount*(has(u,'Bindproof')?.5:1));}
export function screenTurns(u,turns=5){return turns+(has(u,'Screenmender')?2:0);}
export function changeWeather(weather,units,turns=5){const messages=[];const old=units[0]?.field?.weather;for(const u of units){u.field??={};u.field.weather=weather;u.field.weatherTurns=turns;const a=abilityMemory(u);
 if(old!==weather&&has(u,'Stormsense')&&!a.flags.weather){stage(u,'speed',1);a.flags.weather=true;messages.push(note(u,'weather changed; Speed rose.'));}
 if(weather==='RAIN'&&has(u,'Floodplain')&&!a.flags.flood){stage(u,'defence',1);a.flags.flood=true;messages.push(note(u,'rain raised Defence.'));}}
 return messages;
}
export function isContact(m){return m.contact??(m.category==='PHYSICAL'&&!/shot|arrow|projectile|launch|beam|wave|pulse/i.test(m.name));}
export function isSound(m){return m.sound??(/roar|cry|call|chorus|song|chant|howl|chime|echo|shriek|resonance|sound|sonic/i.test(m.name));}
export function inflictStatus(u,status,messages=[],random=Math.random){if(u.hp<=0)return false;if(u.field?.orchardSafeguard?.[u.side||'player']>0||status==='SLEEP'&&u.moveState?.wakeful>0)return false;if(status==='CONFUSION'){u.confusion=randomStatusDuration(random);messages.push(`${unitName(u)} is confused.`);messages.push(...activateHeldRecovery(u));return true;}
 if(u.status||u.statusImmunity?.[status]||has(u,'Toxinproof')&&['POISON','BAD_POISON'].includes(status)||has(u,'Coldproof')&&status==='FREEZE'||['POISON','BAD_POISON'].includes(status)&&u.species.types.some(t=>['POISON','STEEL'].includes(t))||status==='BURN'&&u.species.types.includes('FIRE')||['FREEZE','FROSTBITE'].includes(status)&&u.species.types.includes('ICE')||status==='PARALYSIS'&&u.species.types.includes('ELECTRIC'))return false;
 u.status=status;u.statusTurns=status==='SLEEP'?randomStatusDuration(random):0;u.toxicCounter=0;messages.push(`${unitName(u)} is ${status.toLowerCase().replace('_',' ')}.`);messages.push(...activateHeldRecovery(u));return true;
}
export function blockedByAbility(actor,target,move,messages=[]){
 let why=null;if(has(target,'Hovercore')&&move.type_id==='GROUND')why='Ground immunity';if(has(target,'Soundproof')&&isSound(move))why='sound immunity';
 if(has(target,'Capacitor')&&move.type_id==='ELECTRIC'){stage(target,'sp_attack',1);why='absorbed Electric; Special Attack rose';}
 if(has(target,'Reservoir')&&move.type_id==='WATER'){restoreHP(target,Math.floor(target.maxHp/4));why='absorbed Water; HP restored';}
 if(why){messages.push(note(target,why+'.'));return true;}return false;
}
// Raw permanent Speed gives +6.25 percentage points per extra multiple of foe Speed.
// Temporary Speed stages do not alter this bonus; slower attackers retain their base chance.
export function critChance(actor,move,target){if(target&&preventsCritical(target))return 0;if(move.guaranteedCritical)return 1;let stage=move.effects?.some(e=>e.effect_id==='high_critical_ratio')?1:0;if(stage&&has(actor,'Focus Edge'))stage++;if(has(actor,'Proof by Cut')&&abilityMemory(actor).hits>=2)stage++;stage+=paladinCritStage(actor,target);const ratio=target?Math.max(1,actor.stats.speed/Math.max(1,target.stats.speed)):1;return Math.min(.5,[1/16,1/8,1/4,1/3][Math.min(3,stage)]+(ratio-1)/16);}
export function ignoresDefence(actor,target){const a=actor.abilityState||{};return has(actor,'Sinmark')&&a.mark===(target.uid||target.species.id);}
export function abilityMultiplier(actor,target,move,{effectiveness=1,critical=false,movedFirst=false,switching=false}={}){
 const a=actor.abilityState||{flags:{},charges:0},t=target.abilityState||{flags:{},types:[],moves:[]};let multiplier=paladinMultiplier(actor,target,move,{effectiveness,critical})*birdMultiplier(actor,target,move,{effectiveness});const previous=a.previousType,key=target.uid||target.species.id;
 if(has(actor,'Pack Pursuit')&&otherPartyDamaged(actor,target))multiplier*=1.2;
 if(move.menagerieRule==='GREY_HUNT'&&otherPartyDamaged(actor,target))multiplier*=1.2;
 if(move.menagerieRule==='BAMBOO_REPRISAL'&&abilityBattle(actor).directDamageTurn===abilityBattle(actor).turn)multiplier*=1.25;
 if(has(actor,'Bamboo Discipline')&&a.flags.bamboo&&move.category==='PHYSICAL')multiplier*=1.3;
 if(has(target,'Fortress Curl')&&move.category==='PHYSICAL'&&!t.flags.fortress)multiplier*=.5;
 if(has(actor,'Alternator')&&previous&&previous!==move.type_id)multiplier*=1.1;
 if(has(actor,'Improviser')&&previous&&previous!==move.type_id)multiplier*=1.15;
 if(has(actor,'Ambush')&&!a.flags.attack)multiplier*=1.1;
 if(has(actor,'First Strike')&&movedFirst)multiplier*=1.1;
 if(has(actor,'Chorus','Oath Roar')&&isSound(move))multiplier*=1.2;
 if(has(actor,'Mimic Ear')&&a.flags.echo&&isSound(move))multiplier*=1.5;
 if(has(actor,'Opportunist')&&target.hp<=target.maxHp/2)multiplier*=1.15;
 if(has(actor,'Weakpoint Hunter')&&effectiveness>1)multiplier*=1.1;
 if(has(actor,'Septic Hunger')&&['POISON','BAD_POISON'].includes(target.status))multiplier*=1.2;
 if(has(actor,'Patience')&&a.flags.patient)multiplier*=1.2;
 if(has(actor,'Marked Quarry')&&a.mark===key)multiplier*=1.1;
 if(has(actor,'Revenge Mark')&&a.attacker===key)multiplier*=1.2;
 if(has(actor,'Conqueror\'s Spark')&&a.flags.spark&&['FIRE','ELECTRIC'].includes(move.type_id))multiplier*=1.2;
 if(has(actor,'Stored Charge')&&['ELECTRIC','FIGHTING'].includes(move.type_id))multiplier*=1+a.charges*.15;
 if(has(actor,'Tithe Charge')&&move.type_id==='ELECTRIC')multiplier*=1+(actor.field?.tithe?.[actor.uid]||0)*.1;
 if(has(actor,'Strategem')&&t.repeated)multiplier*=1.15;
 if(has(actor,'Pursuit Instinct')&&switching)multiplier*=1.3;
 if(actor.field?.weather==='TEMPEST')multiplier*=move.type_id==='ELECTRIC'?1.2:move.type_id==='DRAGON'?1.1:1;
 if(has(target,'Bulwark')&&isContact(move))multiplier*=.8;
 if(has(target,'Thick Pelt')&&['FIRE','ICE'].includes(move.type_id))multiplier*=.75;
 if(has(target,'Steamheart')&&move.type_id==='WATER')multiplier*=.5;
 if(has(target,'Pack Guard')&&t.allies>0)multiplier*=.9;
 if(has(target,'Camouflage')&&!t.flags.hit&&effectiveness<=1)multiplier*=.85;
 if(has(target,'Foresight')&&!t.flags.foresight&&effectiveness>1)multiplier*=.8;
 if(has(target,'Adaptable Hide')&&t.types.includes(move.type_id))multiplier*=.8;
 
 if(has(target,'Stoneplate')&&critical)multiplier*=.75;
 if(has(actor,'Forge Balance')&&a.forgeCategory&&a.forgeCategory!==move.category)multiplier*=1.2;
 if(has(target,'Reef Sentinel')&&effectiveness>1&&!target.abilityBattle?.flags?.reefSentinel)multiplier*=.8;
 const ward=heldInfo(target)?.effect,battle=target.abilityBattle||{flags:{}};if(ward?.operation==='quest_ward'&&!battle.flags.questWard&&((ward.condition==='super'&&effectiveness>1)||(ward.condition==='physical'&&move.category==='PHYSICAL')||(ward.condition==='switch'&&battle.flags.defenderReady)))multiplier*=ward.multiplier;
 const held=heldInfo(actor)?.effect;if(held?.operation==='quest_damage'&&held.types.includes(move.type_id)&&held.category===move.category)multiplier*=held.multiplier;
 if(held?.operation==='damage_multiplier'&&(!held.type_id||held.type_id===move.type_id)&&(!held.requires||actor.field?.weather||actor.field?.terrain))multiplier*=held.multiplier;
 if(has(actor,'Peerless Ego')&&move.category==='SPECIAL'&&!Object.values(actor.stages||{}).some(n=>n<0))multiplier*=1.2;
 if(move.prideSignature&&!Object.values(actor.stages||{}).some(n=>n<0))multiplier*=1.2;
 if(has(actor,'Sovereign Charge')&&!a.flags.sovereignSpent)multiplier*=1.25;
 if(has(actor,'The Fixer')&&a.flags.fixerPrepared&&move.category==='SPECIAL')multiplier*=1.3;
 if(ward?.operation==='full_hp_guard'&&target.hp===target.maxHp)multiplier*=ward.multiplier;
 if(has(actor,'Heavy Hands')&&isContact(move))multiplier*=1.15;
 if(has(target,'Unhurried')&&movedFirst)multiplier*=.8;
 if(has(target,'Burhwall')&&effectiveness>1)multiplier*=.75;
 if(held?.operation==='category_damage'&&held.category===move.category)multiplier*=held.multiplier;
 if(held?.operation==='life_orb')multiplier*=held.multiplier;
 return multiplier;
}
export const healingMultiplier=u=>heldInfo(u)?.effect?.operation==='healing_received'?heldInfo(u).effect.multiplier:1;
export function restoreHP(u,n){if(u.hp<=0)return 0;const restored=Math.max(0,Math.min(Math.floor(n*healingMultiplier(u)),u.maxHp-u.hp));u.hp+=restored;return restored;}
export function afterDamage(actor,target,move,damage,{effectiveness=1,critical=false,floor=0,random=Math.random,counterContext={}}={}){
 const messages=[],a=abilityMemory(actor),t=abilityMemory(target),ab=abilityBattle(actor),tb=abilityBattle(target),say=(u,text)=>messages.push(note(u,text));
 a.flags.attack=true;a.flags.patient=false;a.dealt+=damage;a.hits++;if(has(actor,'Proof by Cut')&&a.hits>=3)a.hits=0;
 if(damage&&has(actor,'Marked Quarry','Sinmark')&&!a.flags.marked){a.mark=target.uid||target.species.id;a.flags.marked=true;}
 if(has(actor,'Mimic Ear')&&isSound(move))a.flags.echo=false;
 if(has(actor,'Conqueror\'s Spark')&&['FIRE','ELECTRIC'].includes(move.type_id))a.flags.spark=false;
 if(has(actor,'Stored Charge')&&['ELECTRIC','FIGHTING'].includes(move.type_id))a.charges=0;
 if(has(actor,'Tithe Charge')&&move.type_id==='ELECTRIC'&&actor.field?.tithe)actor.field.tithe[actor.uid]=0;
 if(has(actor,'Revenge Mark'))a.attacker=null;
 if(move.category==='PHYSICAL'&&has(actor,'Bamboo Discipline'))a.flags.bamboo=false;
 if(!damage)return messages;
 if(has(actor,'Sovereign Charge'))a.flags.sovereignSpent=true;
 if(has(target,'Grievance')&&target.hp>0&&effectiveness>1){counterContext.grievance??=new Set();if(!counterContext.grievance.has(target)){counterContext.grievance.add(target);changeStage(target,'attack',1,target,messages);}}
 const helmet=heldInfo(target)?.effect;if(helmet?.operation==='contact_helmet'&&isContact(move)&&actor.hp>0){const loss=Math.min(Math.max(0,actor.hp-floor),Math.max(1,Math.floor(actor.maxHp/6)));actor.hp-=loss;messages.push(`${unitName(actor)} loses ${loss} HP to Reprisal Helm.`);}
 damagedTeamcraft(actor,target,move,damage,{changeStage,messages});
 messages.push(...paladinAfterDamage(actor,target,move,damage,{effectiveness,critical}),...birdAfterDamage(actor,target,move,damage,{effectiveness,floor,changeStage,isContact}));
 recordMenagerieDamage(actor,target);tb.directDamageTurn=tb.turn;
 if(has(target,'Fortress Curl')&&move.category==='PHYSICAL')t.flags.fortress=true;
 if(has(actor,'Venom Grip')&&isContact(move)&&target.hp>0&&random()<.3)inflictStatus(target,'POISON',messages,random);
 if(has(target,'Sensitive Ears')&&move.category==='SPECIAL'&&target.hp>0&&tb.earsTurn!==tb.turn){tb.earsTurn=tb.turn;stage(target,'speed',1);say(target,'special hit raised Speed.');}
 if(has(actor,'Afterglow')&&move.category==='SPECIAL'&&actor.hp>0&&ab.afterglowTurn!==ab.turn){ab.afterglowTurn=ab.turn;say(actor,`restored ${restoreHP(actor,Math.max(1,Math.floor(actor.maxHp/16)))} HP.`);}
 if(has(target,'Arctic Endurance')&&target.hp>0&&target.hp<target.maxHp/2&&!tb.flags.arctic){tb.flags.arctic=true;stage(target,'defence',1);stage(target,'sp_defence',1);say(target,'below half HP: Defence and Special Defence rose.');}

 if(has(actor,'Forge Balance'))a.forgeCategory=move.category;
 if(has(actor,'Lunar Wisdom')&&move.type_id==='PSYCHIC'&&actor.hp>0)say(actor,`restored ${restoreHP(actor,Math.max(1,Math.floor(actor.maxHp/16)))} HP.`);
 if(has(target,'Reef Sentinel')&&effectiveness>1)tb.flags.reefSentinel=true;
 const questWard=heldInfo(target)?.effect;if(questWard?.operation==='quest_ward'&&((questWard.condition==='super'&&effectiveness>1)||(questWard.condition==='physical'&&move.category==='PHYSICAL')||(questWard.condition==='switch'&&tb.flags.defenderReady)))tb.flags.questWard=true;
 t.flags.hit=true;if(effectiveness>1)t.flags.foresight=true;if(!t.types.includes(move.type_id))t.types.push(move.type_id);if(!t.moves.includes(move.id))t.moves.push(move.id);t.attacker=actor.uid||actor.species.id;
 if(effectiveness>0&&effectiveness<1&&target.hp>0&&has(target,'Slipstream Discipline')){stage(target,'speed',2);say(target,'resisted hit raised Speed two stages.');}
 if(triggerSunWrath(target))say(target,'transformed into Sun God’s Wrath; all six stats boosted by 25%.');
 if(has(target,'Mimic Ear')&&isSound(move)){t.flags.echo=true;say(target,'next sound move is empowered.');}
 if(has(target,'Steamheart')&&move.type_id==='WATER'&&!t.flags.steam&&target.hp>0){stage(target,'sp_attack',1);t.flags.steam=true;say(target,'Special Attack rose.');}
 if(damage>0&&target.hp>0&&!target.dead&&has(target,'Countercharge','Countercurrent')){
  const stat=has(target,'Countercurrent')?'sp_attack':'attack';
  if(isContact(move)&&!t.flags.counter){t.flags.counter=true;const n=stage(target,stat,2);if(n)say(target,(stat==='attack'?'Attack':'Special Attack')+' rose two stages after its first contact hit.');}
  if(effectiveness>1){counterContext.effectiveTargets??=new Set();if(!counterContext.effectiveTargets.has(target)){counterContext.effectiveTargets.add(target);const n=stage(target,stat,1);if(n)say(target,(stat==='attack'?'Attack':'Special Attack')+' rose after a super-effective move.');}}
 }
 if(has(target,'Stored Charge')&&isContact(move)&&target.hp>0){t.charges=Math.min(2,t.charges+1);say(target,`${t.charges} Charge${t.charges===1?'':'s'} stored.`);}
 if(has(target,'Heartwood Core')&&target.hp>0&&target.hp<=target.maxHp/3&&!tb.flags.heart){tb.flags.heart=true;say(target,`restored ${restoreHP(target,target.maxHp/4)} HP.`);}
 if(has(actor,'Oath Roar')&&isSound(move)&&!a.flags.oath&&actor.hp>0){stage(actor,'attack',1);a.flags.oath=true;say(actor,'Attack rose.');}
 if(has(actor,'Siege Breaker')){target.screens={};if(target.field?.screens)delete target.field.screens[target.side];say(actor,'opposing screens removed.');}
 if(isContact(move)&&actor.hp>0){if(has(target,'Ugly Rebuke')){const loss=Math.min(Math.max(0,actor.hp-floor),Math.max(1,Math.floor(actor.maxHp/8)));actor.hp-=loss;say(target,`Ugly Rebuke costs the attacker ${loss} HP.`);}if(has(target,'Thornhide')){const loss=Math.min(Math.max(0,actor.hp-floor),Math.max(1,Math.floor(actor.maxHp/16)));actor.hp-=loss;say(target,`contact thorns cost the attacker ${loss} HP.`);}
  if(has(target,'Cinderhide')&&random()<.15)inflictStatus(actor,'BURN',messages,random);
  if(has(target,'Poison Barbs')&&random()<.2)inflictStatus(actor,'POISON',messages,random);
  if(has(target,'Static Hide')&&random()<.2)inflictStatus(actor,'PARALYSIS',messages,random);
 }
 if(target.hp<=0){if(has(actor,'Battle Rush')&&!a.flags.rush){stage(actor,'speed',1);a.flags.rush=true;say(actor,'knockout raised Speed.');}
  if(has(actor,'Conqueror\'s Spark')&&!ab.flags.conqueror){stage(actor,'speed',1);ab.flags.conqueror=true;a.flags.spark=true;say(actor,'knockout raised Speed and charged the next Fire/Electric move.');}
  if(has(actor,'Scavenger')&&!ab.flags.scavenge&&!actor.heldItem&&ab.berry){actor.heldItem=ab.berry;actor.heldDefinition=ab.berryDefinition;ab.flags.scavenge=true;say(actor,'consumed Berry recovered.');}
  // A mark belongs to an active opponent, not the next send-out.
  a.mark=null;
 }
 return messages;
}
export function recordMove(actor,move){birdRecordMove(actor,move);const a=abilityMemory(actor);a.repeated=a.previousMove===move.id;a.previousMove=move.id;if(move.power)a.previousType=move.type_id;}
export function failedMove(actor,move){const a=abilityMemory(actor);if(has(actor,'Bamboo Discipline')&&move.category==='PHYSICAL')a.flags.bamboo=false;a.hits=0;if(move.power)a.flags.attack=true;recordMove(actor,move);}
export function afterStatusMove(actor,target=null){paladinAfterStatus(actor);const a=abilityMemory(actor),messages=birdAfterStatus(actor,target,{changeStage});if(has(actor,'Bamboo Discipline')){a.flags.bamboo=true;messages.push(note(actor,'next physical attack gains 30% power.'));}if(has(actor,'Feintstep')&&!a.flags.feint){a.flags.feint=true;stage(actor,'speed',1);messages.push(note(actor,'successful status move raised Speed.'));}if(has(actor,'The Fixer')){a.flags.fixerPrepared=true;messages.push(note(actor,'prepared a stronger special attack.'));}return messages;}
export function consumedBerry(u,party=[u],amount=0){const b=abilityBattle(u),messages=[];b.berry=u.heldItem;b.berryDefinition=u.heldDefinition;u.heldItem=null;u.heldDefinition=null;const healing=Math.floor(amount*(has(u,'Feast')?1.5:1))+(has(u,'Forager')?Math.max(1,Math.floor(u.maxHp/16)):0);const n=restoreHP(u,healing);if(has(u,'Shared Pantry')&&!b.flags.pantry){const ally=menagerieParty(u).find(v=>v!==u&&v.hp>0&&!v.dead&&v.hp<v.maxHp);if(ally){b.flags.pantry=true;const shared=restoreHP(ally,Math.max(1,Math.floor(ally.maxHp/8)));messages.push(`${unitName(ally)} shares ${shared} HP from the pantry.`);}}if(n)messages.push(`${unitName(u)}'s Berry restored ${n} HP.`);if(has(u,'Berry Hoard')&&!b.flags.hoard){b.flags.hoard=true;b.regrow=b.turn+2;}
 u.field??={};u.field.tithe??={};const ids=new Set([...party.filter(ally=>ally.side===u.side&&has(ally,'Tithe Charge')).map(ally=>ally.uid),...(u.field.titheUnits||[]).filter(ally=>ally.side===u.side).map(ally=>ally.uid)]);for(const uid of ids)u.field.tithe[uid]=Math.min(3,(u.field.tithe[uid]||0)+1);return messages;}
export function activateHeldRecovery(u,party=menagerieParty(u)){
 if(!u||u.hp<=0||u.dead)return [];const item=heldInfo(u),e=item?.effect;if(!e)return [];const messages=[];
 if(e.operation==='white_herb'&&Object.values(u.stages||{}).some(n=>n<0)){for(const k in u.stages)if(u.stages[k]<0)u.stages[k]=0;u.heldItem=null;u.heldDefinition=null;messages.push(`${unitName(u)} consumed Clear Herb; lowered stages restored.`);return messages;}
 if(!e.berry)return messages;
 const cure=e.cure==='ALL'?(!!u.status||u.confusion>0):Array.isArray(e.cure)&&e.cure.includes(u.status);
 const empty=e.pp&&u.moves?.find(m=>m.left===0),low=e.threshold!==undefined&&u.hp<=u.maxHp*e.threshold;
 const useful=low&&(e.stat?(u.stages?.[e.stat]||0)<6:u.hp<u.maxHp);
 if(!cure&&!empty&&!useful)return messages;
 if(cure){u.status=null;u.statusTurns=0;u.toxicCounter=0;if(e.cure==='ALL')u.confusion=0;messages.push(`${unitName(u)} consumed ${item.name}; status cured.`);}
 if(empty){const n=Math.min(e.pp,empty.pp);empty.left=n;messages.push(`${unitName(u)} consumed ${item.name}; ${empty.name} recovered ${n} PP.`);}
 const amount=low&&!e.stat?(e.amount??Math.max(1,Math.floor(u.maxHp*(e.healFraction||.25)))):0;
 messages.push(...consumedBerry(u,party,amount));if(e.stat){stage(u,e.stat,e.stages||1);messages.push(`${unitName(u)} consumed ${item.name}; ${e.stat.replace('_',' ')} rose.`);}return messages;
}
export function heldSurvival(target,damage,messages){if(heldInfo(target)?.effect?.operation==='focus_sash'&&target.hp===target.maxHp&&damage>=target.hp&&target.hp>1){target.heldItem=null;target.heldDefinition=null;messages.push(`${unitName(target)} consumed Last Thread and held on at 1 HP.`);return target.hp-1;}return damage;}
export function finishHeldMove(actor,target,move,damage,{floor=0}={}){const messages=[];if(damage>0&&move.category==='SPECIAL'&&has(actor,'The Fixer'))delete abilityMemory(actor).flags.fixerPrepared;const siphon=heldInfo(actor)?.effect;if(damage>0&&siphon?.operation==='damage_heal'&&actor.hp>0){const n=restoreHP(actor,Math.max(1,Math.floor(damage*siphon.fraction[0]/siphon.fraction[1])));if(n)messages.push(`${unitName(actor)} · Siphon Charm: restored ${n} HP.`);}if(damage>0&&heldInfo(actor)?.effect?.operation==='life_orb'&&actor.hp>0){const loss=Math.min(Math.max(0,actor.hp-floor),Math.max(1,Math.floor(actor.maxHp/10)));actor.hp-=loss;messages.push(`${unitName(actor)} loses ${loss} HP to Pressure Orb.`);}messages.push(...activateHeldRecovery(actor),...activateHeldRecovery(target));return messages;}
export function endAbilities(units,{floor=0,party=units,random=Math.random}={}){const messages=[];const field=units[0]?.field||{},suppressed=weatherSuppressed(...units);
 for(const u of units){if(u.hp<=0)continue;const a=abilityMemory(u),b=abilityBattle(u);b.turn++;
  if(has(u,'Patience'))a.flags.patient=a.dealt===0&&!(u.moveState?.protectChain>1);
  if(has(u,'Truce')&&a.dealt===0&&!a.flags.truce){stage(u,'sp_defence',1);a.flags.truce=true;messages.push(note(u,'a turn without damage raised Special Defence.'));}
  const held=heldInfo(u)?.effect;if(held?.operation==='end_turn_heal'&&(!held.holderType||u.species.types.includes(held.holderType))){const [n,d]=held.max_hp_fraction;const restored=restoreHP(u,Math.max(1,Math.floor(u.maxHp*n/d)));if(restored)messages.push(`${unitName(u)} · ${heldInfo(u).name}: restored ${restored} HP.`);}
  messages.push(...activateHeldRecovery(u,party));
  if(has(u,'Berry Hoard')&&b.regrow<=b.turn&&!u.heldItem&&b.berry){u.heldItem=b.berry;u.heldDefinition=b.berryDefinition;delete b.regrow;messages.push(note(u,'Berry regrew.'));}
  if(has(u,'Warm Current')&&field.weather==='SUN'&&!suppressed){const n=restoreHP(u,Math.max(1,Math.floor(u.maxHp/16)));if(n)messages.push(note(u,`sunlight restored ${n} HP.`));}
  if(has(u,'Earthroot','World Anchor')&&['GRASSY','GROUND'].includes(field.terrain)){const n=restoreHP(u,Math.max(1,Math.floor(u.maxHp/16)));if(n)messages.push(note(u,`terrain restored ${n} HP.`));}
  let residual=0;if(['BURN','FROSTBITE','POISON'].includes(u.status))residual=Math.max(1,Math.floor(u.maxHp/8));if(u.status==='BAD_POISON')residual=Math.max(1,Math.floor(u.maxHp*(u.toxicCounter=Math.min(15,(u.toxicCounter||0)+1))/16));
  if(!suppressed&&field.weather==='SAND'&&!has(u,'Sandcoat','Sand Reservoir')&&!u.species.types.some(t=>['ROCK','GROUND','STEEL'].includes(t)))residual+=Math.max(1,Math.floor(u.maxHp/16));
  if(!suppressed&&field.weather==='HAIL'&&!u.species.types.includes('ICE'))residual+=Math.max(1,Math.floor(u.maxHp/16));
  const loss=Math.min(Math.max(0,u.hp-(u.combatFloor??floor)),residual);u.hp-=loss;if(loss)messages.push(`${unitName(u)} loses ${loss} HP to ${u.status?.toLowerCase()||'weather'}.`);
  messages.push(...activateHeldRecovery(u,party));a.dealt=0;if(u.trapped>0)u.trapped--;if(u.preventForcedSwitch>0)u.preventForcedSwitch--;for(const key in u.statusImmunity||{})if(--u.statusImmunity[key]<=0)delete u.statusImmunity[key];
 }
 // Miasma resolves after this turn's residual damage, so new poison starts next turn.
 for(const source of units){if(source.hp<=0||source.captured||!has(source,'Miasma'))continue;
  for(const foe of units){if(foe===source||foe.hp<=0||foe.captured||foe.status||foe.statusImmunity?.POISON||foe.statusImmunity?.BAD_POISON||has(foe,'Toxinproof')||foe.species.types.some(t=>['POISON','STEEL'].includes(t)))continue;
   if(source.side&&foe.side&&source.side===foe.side)continue;
   if(random()<.33&&inflictStatus(foe,'BAD_POISON',messages,random))messages.push(note(source,'venomous mist badly poisoned '+unitName(foe)+'.'));
  }
 }
 messages.push(...endOrchard(units,{floor,random}));
 if(field.weatherTurns>0&&--field.weatherTurns===0){messages.push(...changeWeather(null,units,0));}
 if(field.decree?.turns>0)field.decree.turns--;return messages;
}

export function abilityImmunity(target,move){return has(target,'Hovercore')&&move.type_id==='GROUND'||has(target,'Soundproof')&&isSound(move)||has(target,'Capacitor')&&move.type_id==='ELECTRIC'||has(target,'Reservoir')&&move.type_id==='WATER';}


