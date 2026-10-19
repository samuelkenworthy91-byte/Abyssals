import {DATA} from './data.js?v=0.87.0';
import {ABILITIES} from './ability-data.js?v=0.87.0';
import {QUEST_REWARDS,SECRET_MOVES} from './quest-rewards-data.js?v=0.87.0';
import {RELIC_ITEMS} from './relic-family.js?v=0.87.0';
import {rootForm} from './route-roster.js?v=0.87.0';
export {QUEST_REWARDS,SECRET_MOVES};
export function rewardPending(state,key){return !!state.sideCampaigns?.[key]?.claimed&&!state.sideCampaigns[key].rewardVersion;}
// Fixed offers are saved before selection; no gift is generated again on reopen.
export function nurseryOffers(state){const q=state.sideCampaigns?.marchMeadow;if(!q)return [];return q.giftOffers??=(['361','060','222'].map(rootForm).filter((id,i,a)=>a.indexOf(id)===i));}
export function grantQuestReward(state,key,{gift=null,core=null}={}){
 const q=state.sideCampaigns?.[key],r=QUEST_REWARDS[key];if(!q?.claimed||q.rewardVersion||!r)return false;
 if(r.kind==='gift'&&(!gift||!nurseryOffers(state).includes(gift.species.id)||gift.level!==5||gift.hp<=0))return false;
 if(r.kind==='core'&&!RELIC_ITEMS.some(i=>i.id===core))return false;
 state.questUnlocks??={tutors:[]};state.questUnlocks.tutors??=[];
 if(r.kind==='held'){state.heldItems??={};for(const id of r.items){const item='HELD_QUEST_'+id;state.heldItems[item]=(state.heldItems[item]||0)+1;}}
 if(r.kind==='tutor'&&!state.questUnlocks.tutors.includes(r.move))state.questUnlocks.tutors.push(r.move);
 if(r.kind==='recipe'){state.questUnlocks.winterRecipe=true;state.winterPreserves=(state.winterPreserves||0)+4;}
 if(r.kind==='attunement')state.questUnlocks.attunement=true;
 if(r.kind==='awakening')state.awakeningSigils=(state.awakeningSigils||0)+1;
 if(r.kind==='core'){state.evolutionItems??={};state.evolutionItems[core]=(state.evolutionItems[core]||0)+1;q.rewardCore=core;}
 if(r.kind==='gift'){gift.giftOrigin='Winter Nursery';gift.originalStarter=false;gift.lives=1;gift.growthMultiplier=1;(state.party.length<6?state.party:state.reserve).push(gift);q.giftUid=gift.uid;}
 q.rewardVersion=1;return true;
}
export function canLearnSecret(state,unit,move){return !!unit&&unit.hp>0&&!unit.dead&&!!move?.questTutor&&state.questUnlocks?.tutors?.includes(move.id)&&move.tutorTypes.some(t=>unit.species.types.includes(t))&&!unit.moves.some(m=>m.id===move.id);}
export function teachSecret(state,unit,id,slot){const m=SECRET_MOVES.find(m=>m.id===id);if(!canLearnSecret(state,unit,m))return false;if(slot===-1){if(unit.moves.length>=4)return false;unit.moves.push({...m,left:m.pp});}else{if(!Number.isInteger(slot)||slot<0||slot>=unit.moves.length)return false;unit.moves[slot]={...m,left:m.pp};}return true;}
export function distinctAbilitySlots(unit){const seen=new Set();return ['primary','secondary','hidden'].filter(slot=>{const name=unit?.species?.ability_names?.[slot];if(!name||seen.has(name)||!ABILITIES.some(a=>a.name===name))return false;seen.add(name);return true;});}
export function abilityOptions(state,unit){return distinctAbilitySlots(unit).filter(slot=>slot==='primary'||slot===unit.abilitySlot||slot==='secondary'&&state.questUnlocks?.attunement||slot==='hidden'&&unit.hiddenAbilityUnlocked);}
export function awakenAbility(state,unit){if(!unit||unit.dead||unit.hp<=0||unit.hiddenAbilityUnlocked||!(state.awakeningSigils>0)||!distinctAbilitySlots(unit).includes('hidden'))return false;state.awakeningSigils--;unit.hiddenAbilityUnlocked=true;unit.abilitySlot='hidden';unit.abilityState=null;unit.abilityBattle=null;return true;}
export function selectAbility(state,unit,slot){if(!unit||unit.dead||unit.hp<=0||!abilityOptions(state,unit).includes(slot))return false;unit.abilitySlot=slot;unit.abilityState=null;unit.abilityBattle=null;return true;}
