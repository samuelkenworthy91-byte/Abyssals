import {restoreHP,has,isContact,inflictStatus,changeWeather,setTerrain,screenTurns} from './abilities.js?v=0.90.24';
import {unitName} from './names.js?v=0.87.0';
export const SUPPORTED_EFFECTS = new Set(['healing_relay','active_cleanse','protect','effigy','relay','clear_weather','clear_offence','rain_mantle','single_ward','crit_guard','entry_cleanse','ally_cure','aurora_screen','party_heal','party_stage','stat_stage','flinch','high_critical_ratio','heal','recoil','inflict_status','status_immunity','hp_cost','power_multiplier','drain','recurring_status','ignore_positive_evasion','contact_retaliation','heal_by_format','prevent_forced_switch','contact_status_retaliation','prevent_flinch','next_move_cannot_miss','clear_negative_stat_stages','next_hit_damage_multiplier','critical_damage_multiplier','disable_last_move','prevent_switch','incoming_type_damage_multiplier','cure_major_status','weather','terrain','screen']);
export function moveHPCost(actor,move){return (move?.effects||[]).filter(e=>e.effect_id==='hp_cost').reduce((sum,e)=>sum+Math.max(1,Math.floor(actor.maxHp*e.fraction[0]/e.fraction[1])),0);}
export function canPayMoveHP(actor,move){return actor.hp>moveHPCost(actor,move);}
export function moveUsable(u,m){return !!m&&m.left>0&&canPayMoveHP(u,m)&&!(u.moveState?.disabled?.turns>0&&u.moveState.disabled.moveId===m.id);}
export function movePriority(m,u){return (m.priority||0)+(m.id===310&&u?.hp<u?.maxHp/2?1:0);}
export function moveDamageMultiplier(actor,target,move,{critical=false,movedFirst=true}={}){
 let n=1;for(const e of move.effects||[])if(e.effect_id==='power_multiplier'){
 const w=e.when,yes=typeof w==='object'?(!w.user_type||actor.species.types.includes(w.user_type))&&(!w.foe_status||(w.foe_status==='CONFUSION'?target.confusion>0:target.status===w.foe_status)):
 w==='USER_MOVED_AFTER_TARGET'?!movedFirst:w==='TARGET_HAS_POSITIVE_STAT_STAGE'?Object.values(target.stages).some(v=>v>0):w==='TARGET_USED_STATUS_MOVE_LAST_TURN'?target.moveState?.previousCategory==='STATUS':w==='FOE_DAMAGED_ALLY_PREVIOUS_TURN'?target.field?.lastMoveDamage?.some(d=>d.actor===(target.uid||target.species.id)&&d.side===actor.side&&d.victim!==(actor.uid||actor.species.id)):false;if(yes)n*=e.multiplier;
 }
 const s=target.moveState||{};if(s.ward?.uses>0&&(!s.ward.category||s.ward.category===move.category))n*=s.ward.multiplier;
 if(critical&&s.criticalWard?.turns>0)n*=s.criticalWard.multiplier;
 if(s.mark?.turns>0&&s.mark.type_id===move.type_id)n*=s.mark.multiplier;
 const field=actor.field||{},weather=field.weather,calm=has(actor,'Weather Calm')||has(target,'Weather Calm');
 if(!calm&&weather==='RAIN')n*=move.type_id==='WATER'?1.5:move.type_id==='FIRE'?.5:1;
 if(!calm&&weather==='SUN')n*=move.type_id==='FIRE'?1.5:move.type_id==='WATER'?.5:1;
 if(field.terrain==='GRASSY'&&move.type_id==='GRASS')n*=1.2;
 const screen=field.screens?.[target.side]?.[move.category];if(screen>0)n*=.5;
 return n;
}
export function trackMove(actor,move){actor.moveState??={};actor.moveState.currentCategory=move.category;actor.moveState.lastMove=move.id;}
export function consumeWard(target,move,damage){if(damage>0&&target.moveState?.ward?.uses>0&&(!target.moveState.ward.category||target.moveState.ward.category===move.category))if(--target.moveState.ward.uses===0)delete target.moveState.ward;}
export function extraMoveEffect(actor,target,move,e,messages,{floor=0}={}){
 const who=e.target==='SELF'||!e.target?actor:target;who.moveState??={};const s=who.moveState;
 const note=t=>messages.push(`${unitName(who)}: ${t}`);
 if(e.effect_id==='hp_cost'){const cost=Math.max(1,Math.floor(actor.maxHp*e.fraction[0]/e.fraction[1]));if(actor.hp<=cost)return;actor.hp-=cost;messages.push(`${unitName(actor)} pays ${cost} HP.`);}
 if(e.effect_id==='heal_by_format'){const [n,d]=e.singles.max_hp_fraction,amount=restoreHP(actor,Math.floor(actor.maxHp*n/d*(has(actor,'Medicinal Sap')?1.15:1)));messages.push(`${unitName(actor)} restores ${amount} HP.`);}
 if(e.effect_id==='next_move_cannot_miss'){s.sureHit=e.uses||1;note('next move cannot miss.');}
 if(e.effect_id==='next_hit_damage_multiplier'){s.ward={...e};note(`next ${e.category==='PHYSICAL'?'physical ':''}hit deals ${e.multiplier*100}% damage.`);}
 if(e.effect_id==='critical_damage_multiplier'){s.criticalWard={...e};note(`critical damage reduced for ${e.turns} turns.`);}
 if(e.effect_id==='incoming_type_damage_multiplier'){s.mark={...e};note(`${e.type_id} damage taken ×${e.multiplier} for ${e.turns} turns.`);}
 if(e.effect_id==='contact_retaliation'){s.thorns={...e};note(`contact attackers lose 1/8 of their maximum HP for ${e.turns} turns.`);}
 if(e.effect_id==='contact_status_retaliation'){s.coat={...e};note(`contact attackers risk ${e.status.toLowerCase()} for ${e.turns} turns.`);}
 if(e.effect_id==='disable_last_move'){const id=s.lastMove;if(id){s.disabled={moveId:id,turns:e.turns};note(`${who.moves.find(m=>m.id===id)?.name||'last move'} sealed for ${e.turns} turns.`);}else note('has no previous move to seal.');}
 if(e.effect_id==='recurring_status'){actor.field??={};actor.field.moveFields??={};actor.field.moveFields[target.side||'enemy']={...e};messages.push(`${move.name} will test for ${e.status.toLowerCase()} each turn for ${e.turns} turns.`);}
 if(e.effect_id==='weather')messages.push(...changeWeather(e.weather,[actor,target],e.turns));
 if(e.effect_id==='terrain'){if(setTerrain(e.terrain,[actor,target])){actor.field.terrainTurns=e.turns;messages.push(`${e.terrain} terrain lasts ${e.turns} turns.`);}else messages.push('World Anchor prevents terrain changes.');}
 if(e.effect_id==='screen'){actor.field??={};actor.field.screens??={};actor.field.screens[actor.side||'player']??={};actor.field.screens[actor.side||'player'][e.category]=screenTurns(actor,e.turns);messages.push(`${e.category==='PHYSICAL'?'Physical':'Special'} damage to this side is halved for ${screenTurns(actor,e.turns)} turns.`);}
}
export function contactReaction(actor,target,move,damage,random,{floor=0}={}){const out=[],s=target.moveState||{};if(damage<=0||!isContact(move)||actor.hp<=0)return out;
 if(s.thorns?.turns>0){const [n,d]=s.thorns.fraction,loss=Math.min(Math.max(0,actor.hp-floor),Math.max(1,Math.floor(actor.maxHp*n/d)));actor.hp-=loss;out.push(`${unitName(actor)} loses ${loss} HP to Thorn Guard.`);}
 if(actor.hp>0&&s.coat?.turns>0&&random()*100<(s.coat.chance_percent??30))inflictStatus(actor,s.coat.status,out,random);return out;}
export function endMoveEffects(units,random= Math.random){const out=[],field=units[0]?.field||{};
 for(const u of units){if(u.hp>0){const area=field.moveFields?.[u.side||'enemy'];if(area?.turns>0&&random()*100<area.chance_percent)inflictStatus(u,area.status,out,random);}const s=u.moveState;if(!s)continue;
 s.previousCategory=s.currentCategory||null;delete s.currentCategory;
 for(const key of ['criticalWard','mark','thorns','coat','disabled'])if(s[key]?.turns>0&&--s[key].turns===0){delete s[key];out.push(`${unitName(u)}: ${key==='disabled'?'move seal':'temporary '+key} expired.`);}
 }
 for(const side in field.moveFields||{})if(--field.moveFields[side].turns<=0)delete field.moveFields[side];
 for(const side in field.screens||{})for(const cat in field.screens[side])if(--field.screens[side][cat]<=0)delete field.screens[side][cat];
 if(field.terrainTurns>0&&--field.terrainTurns===0){field.terrain=null;out.push('Terrain faded.');}
 field.lastMoveDamage=field.currentMoveDamage||[];field.currentMoveDamage=[];return out;
}


