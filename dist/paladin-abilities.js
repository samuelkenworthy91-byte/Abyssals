// Court abilities use battle-scoped flags, never permanent stat mutations.
const name=u=>u.species.ability_names?.[u.abilitySlot||'primary'];
const memory=u=>{u.abilityBattle??={flags:{},turn:0};u.abilityBattle.flags??={};return u.abilityBattle.flags;};
const raise=(u,keys)=>{u.stages??={};for(const k of keys)u.stages[k]=Math.min(6,(u.stages[k]||0)+1);};
export function paladinEnter(u){const a=name(u),f=memory(u),out=[];
 if(a==='Imperial Standard'&&!f.imperial){f.imperial=true;raise(u,['defence','sp_defence']);out.push(u.species.name+' · Imperial Standard: both defences rose.');}
 if(a==='Wandering Gale'&&!f.gale){f.gale=true;raise(u,['speed']);out.push(u.species.name+' · Wandering Gale: Speed rose.');}
 if(a==='Pastoral Guard')f.pastoral=false;
 if(a==='Veiled Counsel'&&(u.stages?.accuracy||0)<0)u.stages.accuracy=0;
 return out;
}
export const paladinStatProtected=(u,k)=>name(u)==='Measured Courage'&&['attack','speed'].includes(k)||name(u)==='Veiled Counsel'&&k==='accuracy';
export function paladinMultiplier(actor,target,move,{critical,effectiveness}){const a=name(actor),t=name(target),af=actor.abilityBattle?.flags||{},tf=target.abilityBattle?.flags||{};let n=1;
 if(a==='Righteous Edge'&&critical)n*=1.1;
 if(a==='Broken Allegiance'&&Object.values(target.stages||{}).some(v=>v>0))n*=1.2;
 if(a==="Giant's Temper"&&af.temper&&move.type_id==='FIRE')n*=1.25;
 if(a==='Flowering Oath'&&af.oath&&move.type_id==='DRAGON')n*=1.25;
 if(t==='Pastoral Guard'&&!tf.pastoral)n*=.75;
 if(t==="Counsellor's Watch"&&!tf.counsel&&move.category==='SPECIAL')n*=.7;
 return n;
}
export function paladinAfterDamage(actor,target,move,damage,{effectiveness}){const out=[],a=name(actor),t=name(target),af=memory(actor),tf=memory(target),say=(u,text)=>out.push(u.species.name+' · '+name(u)+': '+text);
 if(!damage)return out;
 if(a==="Giant's Temper"&&move.type_id==='FIRE')af.temper=false;
 if(a==='Flowering Oath'&&move.type_id==='DRAGON')af.oath=false;
 if(t==='Pastoral Guard')tf.pastoral=true;
 if(t==="Counsellor's Watch"&&move.category==='SPECIAL'&&!tf.counsel){tf.counsel=true;if(target.hp>0){raise(target,['sp_defence']);say(target,'Special Defence rose.');}}
 if(t==='Last Horn'&&target.hp>0&&target.hp<target.maxHp/2&&!tf.horn){tf.horn=true;raise(target,['attack']);say(target,'Attack rose.');}
 if(t==='Awakened Vanguard'&&effectiveness>1&&target.hp>0&&!tf.vanguard){tf.vanguard=true;raise(target,['defence','sp_defence']);say(target,'both defences rose.');}
 if(t==="Giant's Temper"&&move.category==='PHYSICAL'&&target.hp>0)tf.temper=true;
 if(a==="Bayard's Stride"&&move.type_id==='GROUND'&&af.strideTurn!==actor.abilityBattle.turn){af.strideTurn=actor.abilityBattle.turn;raise(actor,['speed']);say(actor,'Speed rose.');}
 if(a==='Bordeaux Current'&&move.type_id==='WATER'&&actor.hp>0&&af.currentTurn!==actor.abilityBattle.turn){af.currentTurn=actor.abilityBattle.turn;const heal=Math.min(actor.maxHp-actor.hp,Math.max(1,Math.floor(actor.maxHp/16)));actor.hp+=heal;if(heal)say(actor,'restored '+heal+' HP.');}
 if(move.paladinRule==='huonquet'&&(actor.stages?.speed||0)<0)actor.stages.speed=0;
 return out;
}
export function paladinAfterStatus(u){if(name(u)==='Flowering Oath')memory(u).oath=true;}
export const paladinCritStage=(u,target)=>name(u)==='Righteous Edge'&&target?.species.types.includes('DARK')?1:0;
export const preventsCritical=u=>!!u?.species?.critical_immune||['Battle Armour','Shell Armour'].includes(name(u||{species:{}}));

export function paladinLeave(u){const f=u.abilityBattle?.flags;if(f){delete f.temper;delete f.oath;}}
