import {has,abilityMemory,abilityBattle,changeStage,restoreHP,healingMultiplier,isContact,inflictStatus,changeWeather,setTerrain,weatherSuppressed,heldInfo} from './abilities.js?v=0.90.55';
import {menagerieParty} from './menagerie-rules.js?v=0.90.55';
import {unitName} from './names.js?v=0.90.55';

const alive=u=>u&&u.hp>0&&!u.dead&&!u.captured;
const opposite=(a,b)=>a!==b&&(!a.side||!b.side||a.side!==b.side);
const active=(u,extra=[])=>[...new Set([u,...menagerieParty(u),...extra])].filter(x=>alive(x)&&(x===u||x.abilityState));
const memory=u=>abilityMemory(u).dossier??={};
const flags=u=>abilityBattle(u).dossier??={};
const note=(u,s)=>`${unitName(u)}: ${s}`;
export function bloomActive(actor){return active(actor).some(u=>u.side===actor.side&&has(u,'Symbiotic Bloom'));}

// Only move recovery enters this hook. Items, berries, passives and ability healing
// continue to use restoreHP. The ledger is shared across targets of one action.
export function healDossierMove(actor,recipient,amount,context={}){
 if(!alive(recipient))return 0;
 if(!bloomActive(actor)||actor.side&&recipient.side&&actor.side!==recipient.side)return restoreHP(recipient,amount);
 const multiplier=healingMultiplier(recipient),key=recipient.uid||recipient.species.id;
 const ledger=context.dossierHealing??={},remaining=Math.max(0,Math.floor(recipient.maxHp*.75)-(ledger[key]||0));
 const restored=restoreHP(recipient,Math.min(Math.floor(amount*2*multiplier),remaining)/multiplier);ledger[key]=(ledger[key]||0)+restored;return restored;
}
export function dossierEnter(u,foe,messages){
 const m=memory(u);m.entryRound=abilityBattle(u).turn;m.activeRounds=0;
 const units=[...active(u),...active(foe||u)];
 if(has(u,'Rainwake')){messages.push(...changeWeather('RAIN',units,5),note(u,'Rainwake summons rain for five rounds.'));}
 if(has(u,'Stormbed')){if(setTerrain('ELECTRIC',units)){u.field.terrainTurns=5;delete u.field.orchardCarpet;messages.push(note(u,'Stormbed sets Electric Terrain for five rounds.'));}else messages.push('World Anchor prevents Electric Terrain.');}
 if(has(u,'Whiteout Pelt'))m.veil=3;
 if(has(u,'Bedrock Engine')){u.preventForcedSwitch=3;m.groundReady=true;}
}
export function dossierPriority(move,u){return u&&move.category==='STATUS'&&has(u,'Third Eye')&&!memory(u).thirdEye?1:0;}
export function dossierEvasion(u,key,foe){return key==='evasion'&&has(u,'Snowshroud')&&['HAIL','SNOW'].includes(u.field?.weather)&&!weatherSuppressed(u,foe||u)?1:0;}
export function dossierCritBonus(actor,target,move){
 const m=memory(actor);return has(actor,'Assassin’s Cadence')&&move.power&&m.chainMove===move.id?Math.min(.3,(m.chain||0)*.1):0;
}
export function dossierIncomingCritStage(target){return target&&has(target,'Cinderweave')?1:0;}
export function prepareDossierAction(actor,move,context={}){
 const m=memory(actor);m.actionBoost=1;m.boosted=false;m.fuelSpent=false;m.wasStatus=move.category==='STATUS';
 if(m.chainMove!==move.id||!move.power){m.chain=0;m.chainMove=null;}
 if(move.category==='STATUS'&&has(actor,'Third Eye')&&!m.thirdEye){m.thirdEye=true;context.dossierThirdEye=true;}
 if(has(actor,'Bramble Furnace')&&m.fuel&&move.power&&move.type_id==='FIRE'&&move.category==='PHYSICAL'){m.actionBoost*=1.2;m.fuel=0;m.fuelSpent=true;}
 if(has(actor,'Thundercoil')&&(m.coils||0)>=2&&move.power&&move.type_id==='ELECTRIC'&&move.category==='PHYSICAL'){m.actionBoost*=1.2;m.coils=0;m.boosted=true;}
 if(has(actor,'Overclock Dynamo')&&m.dynamo>0&&move.power&&move.type_id==='ELECTRIC'){m.actionBoost*=1.25;m.dynamo=0;m.boosted=true;}
 if(has(actor,'Bedrock Engine')&&m.groundReady&&move.power&&move.type_id==='GROUND'){m.actionBoost*=1.2;m.groundReady=false;}
}
export function dossierMultiplier(actor,target,move){return (memory(actor).actionBoost||1)*(has(target,'Flying Buttress')&&!flags(target).buttress?.8:1)*(has(target,'Palimpsest')&&abilityMemory(target).moves.includes(move.id)?.75:1);}
export function dossierDamaged(actor,target,move,damage,{floor=0,random=Math.random}={},messages=[]){
 if(damage<=0||!opposite(actor,target))return;
 const a=memory(actor),t=memory(target);
 if(has(target,'Flying Buttress')&&!flags(target).buttress){flags(target).buttress=true;if(alive(target))changeStage(target,'defence',1,target,messages);}
 if(has(actor,'Lantern Thirst')&&alive(actor)&&['BUG','GHOST'].includes(move.type_id)){
  const room=Math.max(0,Math.floor(actor.maxHp/8)-(a.lanternHealed||0)),n=restoreHP(actor,Math.min(room,Math.floor(damage*.2))/healingMultiplier(actor));a.lanternHealed=(a.lanternHealed||0)+n;
  if(n)messages.push(note(actor,`Lantern Thirst restores ${n} HP.`));
 }
 if(isContact(move)&&alive(actor)){
  if(has(target,'Molten Carapace')&&heldInfo(target)?.effect?.operation!=='contact_helmet'){const fraction=t.lastType==='STEEL'?1/8:1/12,loss=Math.min(Math.max(0,actor.hp-floor),Math.max(1,Math.floor(actor.maxHp*fraction)));actor.hp-=loss;messages.push(note(target,`Molten Carapace costs the attacker ${loss} HP.`));}
  if(alive(target)&&has(target,'Pitfall Crown')){const b=flags(target),uid=actor.uid||actor.species.id;b.pitfall??=[];if(!b.pitfall.includes(uid)){b.pitfall.push(uid);changeStage(actor,'speed',-1,target,messages);}}
  if(alive(target)&&has(target,'Whiteout Pelt')&&t.veil>0&&random()<.3)changeStage(actor,'speed',-1,target,messages);
 }
}
export function finishDossierAction(actor,target,move,result,{actorHP,targetHP,context={}}={}){
 const m=memory(actor),messages=result.messages,success=!result.skipped&&!result.missed&&!result.immune&&!result.blocked;
 if(!success){m.chain=0;m.chainMove=null;}
 else if(move.power&&result.damage>0&&opposite(actor,target)){
  if(has(actor,'Assassin’s Cadence')){m.chain=Math.min(3,(m.chainMove===move.id?m.chain:0)+1);m.chainMove=move.id;}
  if(has(actor,'Bramble Furnace')&&move.type_id==='GRASS'){m.fuel=2;m.fuelNew=true;}
  if(has(actor,'Thundercoil')&&move.type_id==='ELECTRIC'&&!m.boosted)m.coils=Math.min(2,(m.coils||0)+1);
  if(has(actor,'Overclock Dynamo')&&isContact(move)&&!m.boosted)m.dynamo=3;
 }
 if(m.fuel&&!m.fuelNew&&!m.fuelSpent)m.fuel--;delete m.fuelNew;
 if(success&&move.category==='STATUS'&&has(actor,'Canopy Blessing'))m.canopy=true;
 if(!result.skipped)m.lastType=move.type_id;
 if(result.damage>0&&opposite(actor,target)&&alive(target)&&targetHP>target.maxHp/2&&target.hp<=target.maxHp/2){
  const b=flags(target);
  if(has(target,'Royal Temper')&&!b.temper){b.temper=true;changeStage(target,'attack',1,target,messages);changeStage(target,'speed',1,target,messages);}
  if(has(target,'Heartwood Vigil')&&!b.vigil){b.vigil=true;const n=restoreHP(target,Math.max(1,Math.floor(target.maxHp/12)));changeStage(target,'defence',1,target,messages);messages.push(note(target,`Heartwood Vigil restores ${n} HP.`));}
 }
 delete m.actionBoost;
}
export function nectarbane(actor,target,messages,random,context){if(inflictStatus(target,'POISON',messages,random,actor)){const n=healDossierMove(actor,actor,Math.max(1,Math.floor(actor.maxHp/8)),context);messages.push(note(actor,`Nectarbane restores ${n} HP.`));}}
export function tagDossierStatus(target,source){if(source&&opposite(source,target)&&bloomActive(source))target.dossierBloomStatus=true;}
export function dossierStatusFactor(target,units){return target.dossierBloomStatus||units.some(u=>alive(u)&&opposite(u,target)&&has(u,'Symbiotic Bloom'))?1.1:1;}
export function endDossierRound(units,poisoned,messages,random=Math.random){
 const stats=['attack','defence','sp_attack','sp_defence','speed'];
 for(const u of units){if(!alive(u))continue;const m=memory(u);m.activeRounds=(m.activeRounds||0)+1;
  if(has(u,'Ancient Counsel')&&!m.counsel){m.counsel=true;changeStage(u,'sp_defence',1,u,messages);const n=restoreHP(u,Math.floor(u.maxHp/(u.field?.weather&&!weatherSuppressed(...units)?12:16)));if(n)messages.push(note(u,`Ancient Counsel restores ${n} HP.`));}
  if(has(u,'Devil Orchard')&&m.activeRounds%3===0)changeStage(u,stats[Math.min(4,Math.floor(random()*5))],1,u,messages);
  if(has(u,'Canopy Blessing')&&m.canopy){const n=restoreHP(u,Math.floor(u.maxHp/(u.field?.terrain==='GRASSY'?10:16)));if(n)messages.push(note(u,`Canopy Blessing restores ${n} HP.`));}delete m.canopy;
  if(has(u,'Whiteout Pelt')&&m.veil>0){if(['SNOW','HAIL'].includes(u.field?.weather)&&!weatherSuppressed(...units))restoreHP(u,Math.floor(u.maxHp/16));m.veil--;}
  if(has(u,'Carrion Thirst')&&poisoned.some(t=>opposite(u,t))){const n=restoreHP(u,Math.floor(u.maxHp/16));if(n)messages.push(note(u,`Carrion Thirst restores ${n} HP.`));}
  if(m.dynamo>0)m.dynamo--;m.lanternHealed=0;
 }
}
// Queries never consume RNG. Call this once when committing a voluntary switch.
export function attemptDossierSwitch(unit,opponents,{random=Math.random,forced=false,scripted=false}={}){
 if(!alive(unit)||forced||scripted||has(unit,'Wayfarer','Bindproof'))return true;
 return !opponents.some(u=>alive(u)&&opposite(u,unit)&&has(u,'Cinderweave'))||random()>=.8;
}
