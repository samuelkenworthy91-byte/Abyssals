// Small, serializable flags survive a mid-battle save; battle start resets them.
export const BIRD_ABILITIES=[
  {
    "name": "Thornwake",
    "text": "After taking a contact hit, damages the attacker for 1/8 of its maximum HP. Respects supervised battle protection.",
    "class": "Signature",
    "id": "ABILITY_THORNWAKE"
  },
  {
    "name": "Stormdraft",
    "text": "After an Electric attack deals damage, the next Flying attack gains 50% power. Cannot stack; switching clears the charge.",
    "class": "Signature",
    "id": "ABILITY_STORMDRAFT"
  },
  {
    "name": "Rally Wing",
    "text": "Once per battle, voluntarily switching out while alive grants the incoming living partner +1 Attack and +1 Speed.",
    "class": "Signature",
    "id": "ABILITY_RALLY_WING"
  },
  {
    "name": "Coal Updraft",
    "text": "After a Fire attack deals damage, the next Flying attack gains 30% power. Cannot stack; switching clears the charge.",
    "class": "Signature",
    "id": "ABILITY_COAL_UPDRAFT"
  },
  {
    "name": "Plunge Drive",
    "text": "Water attacks gain 30% power against opponents at full HP.",
    "class": "Signature",
    "id": "ABILITY_PLUNGE_DRIVE"
  },
  {
    "name": "Tempered Pinions",
    "text": "The first super-effective damaging hit taken each battle deals 30% less damage.",
    "class": "Signature",
    "id": "ABILITY_TEMPERED_PINIONS"
  },
  {
    "name": "Pridebreaker",
    "text": "Damaging attacks gain 30% power against an opponent with at least one raised stat stage.",
    "class": "Signature",
    "id": "ABILITY_PRIDEBREAKER"
  },
  {
    "name": "Hush Current",
    "text": "Once per battle, the first successful damaging hit ignores the target’s positive Defence and Special Defence stages.",
    "class": "Signature",
    "id": "ABILITY_HUSH_CURRENT"
  },
  {
    "name": "Mercy Plume",
    "text": "Once per battle, voluntarily switching out while alive restores 25% maximum HP to the incoming living partner. Cannot revive.",
    "class": "Signature",
    "id": "ABILITY_MERCY_PLUME"
  },
  {
    "name": "Sandvault",
    "text": "Once per turn, avoiding a Ground attack through Flying immunity raises Speed one stage.",
    "class": "Signature",
    "id": "ABILITY_SANDVAULT"
  },
  {
    "name": "Crag Sight",
    "text": "Rock attacks ignore opposing evasion boosts and the user’s accuracy drops.",
    "class": "Signature",
    "id": "ABILITY_CRAG_SIGHT"
  },
  {
    "name": "Silken Current",
    "text": "The first successful non-damaging move after entering battle lowers the opposing active Abyssal’s Speed one stage. Switching resets this opportunity.",
    "class": "Signature",
    "id": "ABILITY_SILKEN_CURRENT"
  },
  {
    "name": "Venom Vane",
    "text": "Flying attacks gain 30% power against poisoned or badly poisoned opponents.",
    "class": "Signature",
    "id": "ABILITY_VENOM_VANE"
  },
  {
    "name": "Mindwing",
    "text": "Damaging Flying moves use Special Attack against Special Defence, retaining their listed power, contact behaviour and effects.",
    "class": "Signature",
    "id": "ABILITY_MINDWING"
  },
  {
    "name": "Rime Draft",
    "text": "Once per battle, the first Ice attack that deals damage also lowers the target’s Attack one stage.",
    "class": "Signature",
    "id": "ABILITY_RIME_DRAFT"
  },
  {
    "name": "High Horizon",
    "text": "After a Dragon attack deals damage, the next Flying attack ignores opposing positive defensive stages. Cannot stack; switching clears the charge.",
    "class": "Signature",
    "id": "ABILITY_HIGH_HORIZON"
  },
  {
    "name": "Second Wind",
    "text": "The first time each battle HP falls to half or less while still alive, raises Attack and Speed one stage each.",
    "class": "Signature",
    "id": "ABILITY_SECOND_WIND"
  },
  {
    "name": "Gale Relay",
    "text": "Once per battle, voluntarily switching out after landing a Flying attack grants the incoming living partner +2 Speed.",
    "class": "Signature",
    "id": "ABILITY_GALE_RELAY"
  }
];
const name=u=>u?.species?.ability_names?.[u.abilitySlot||'primary'];
const battle=u=>{u.abilityBattle??={flags:{},turn:0};u.abilityBattle.flags??={};return u.abilityBattle;};
const entry=u=>{u.abilityState??={flags:{}};u.abilityState.flags??={};return u.abilityState.flags;};
const message=(u,text)=>u.species.name+' · '+name(u)+': '+text;
export function birdPrepareMove(actor,move,{isContact}){
 let result=move;if(!move.power)return result;
 if(name(actor)==='Mindwing'&&move.type_id==='FLYING'&&move.category==='SPECIAL')result={...result,ignorePositiveDefence:true};
 if(name(actor)==='Hush Current'&&!battle(actor).flags.birdHush||name(actor)==='High Horizon'&&entry(actor).birdHorizon&&move.type_id==='FLYING')result={...result,ignorePositiveDefence:true};
 return result;
}
export function birdAccuracy(actor,target,move){return name(actor)==='Crag Sight'&&move.type_id==='ROCK';}
export function birdMultiplier(actor,target,move,{effectiveness=1}={}){
 const a=name(actor),t=name(target);let n=1;
 if(a==='Stormdraft'&&entry(actor).birdDraft&&move.type_id==='FLYING')n*=1.5;
 if(a==='Coal Updraft'&&entry(actor).birdCoal&&move.type_id==='FLYING')n*=1.3;
 if(a==='Plunge Drive'&&target.hp===target.maxHp&&move.type_id==='WATER')n*=1.3;
 if(a==='Pridebreaker'&&Object.values(target.stages||{}).some(v=>v>0))n*=1.3;
 if(a==='Venom Vane'&&move.type_id==='FLYING'&&['POISON','TOXIC'].includes(target.status))n*=1.3;
 if(t==='Tempered Pinions'&&!battle(target).flags.birdTempered&&effectiveness>1)n*=.7;
 return n;
}
export function birdAfterDamage(actor,target,move,damage,{effectiveness=1,floor=0,changeStage,isContact}){
 if(!(damage>0))return [];const messages=[],a=name(actor),t=name(target),f=entry(actor),af=battle(actor).flags,tf=battle(target).flags;
 if(a==='Hush Current')af.birdHush=true;
 if(a==='Stormdraft'){if(move.type_id==='FLYING')delete f.birdDraft;if(move.type_id==='ELECTRIC')f.birdDraft=true;}
 if(a==='Coal Updraft'){if(move.type_id==='FLYING')delete f.birdCoal;if(move.type_id==='FIRE')f.birdCoal=true;}
 if(a==='High Horizon'){if(move.type_id==='FLYING')delete f.birdHorizon;if(move.type_id==='DRAGON')f.birdHorizon=true;}
 if(a==='Gale Relay'&&move.type_id==='FLYING')af.birdGaleReady=true;
 if(t==='Tempered Pinions'&&effectiveness>1)tf.birdTempered=true;
 if(a==='Rime Draft'&&move.type_id==='ICE'&&!af.birdRime){af.birdRime=true;if(target.hp>0){changeStage(target,'attack',-1,actor,messages);messages.push(message(actor,'the ice strike lowered the opponent’s Attack.'));}}
 if(t==='Thornwake'&&isContact(move)&&actor.hp>0){const hit=Math.min(Math.max(0,actor.hp-(actor.combatFloor??floor)),Math.max(1,Math.floor(actor.maxHp/8)));actor.hp-=hit;if(hit)messages.push(message(target,'thorn feathers dealt '+hit+' contact damage.'));}
 return messages;
}
export function birdAfterStatus(actor,target,{changeStage}){
 if(name(actor)!=='Silken Current'||!target||target.hp<=0||target===actor||entry(actor).birdSilk)return [];
 entry(actor).birdSilk=true;const out=[];changeStage(target,'speed',-1,actor,out);out.push(message(actor,'silken currents lowered the opponent’s Speed.'));return out;
}
export function birdGroundImmunity(target,move,{changeStage}){
 if(name(target)!=='Sandvault'||move.type_id!=='GROUND'||!move.power||!target.species.types.includes('FLYING'))return [];
 const b=battle(target);if(b.flags.birdSandTurn===b.turn)return [];b.flags.birdSandTurn=b.turn;const out=[];changeStage(target,'speed',1,target,out);out.push(message(target,'rode the Ground attack’s updraft; Speed rose.'));return out;
}
export function birdThreshold(u,{changeStage}){
 const out=[];if(name(u)==='Second Wind'&&u.hp>0&&!u.dead&&u.hp<=u.maxHp/2&&!battle(u).flags.birdWind){battle(u).flags.birdWind=true;changeStage(u,'attack',1,u,out);changeStage(u,'speed',1,u,out);out.push(message(u,'second wind raised Attack and Speed.'));}return out;
}
export function birdLeave(u,{switching=false,nextUnit=null,changeStage,restoreHP}){
 const out=[],a=name(u),f=battle(u).flags;if(!switching||u.hp<=0||u.dead||!nextUnit||nextUnit.hp<=0||nextUnit.dead||nextUnit===u)return out;
 if(a==='Rally Wing'&&!f.birdRally){f.birdRally=true;changeStage(nextUnit,'attack',1,nextUnit,out);changeStage(nextUnit,'speed',1,nextUnit,out);out.push(message(u,'rallied '+nextUnit.species.name+'; Attack and Speed rose.'));}
 if(a==='Mercy Plume'&&!f.birdMercy){f.birdMercy=true;const n=restoreHP(nextUnit,Math.max(1,Math.floor(nextUnit.maxHp/4)));if(n)out.push(message(u,'restored '+n+' HP to '+nextUnit.species.name+'.'));}
 if(a==='Gale Relay'&&f.birdGaleReady&&!f.birdGaleUsed){f.birdGaleUsed=true;changeStage(nextUnit,'speed',2,nextUnit,out);out.push(message(u,'passed a gale to '+nextUnit.species.name+'; Speed rose two stages.'));}
 return out;
}


export function birdRecordMove(actor,move){if(move.power&&move.type_id==='FLYING'){const f=entry(actor);delete f.birdDraft;delete f.birdCoal;delete f.birdHorizon;}}
