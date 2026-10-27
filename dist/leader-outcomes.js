import {eliteLeaderTeam,advanceLeaderForm,leaderLegalMoves,leaderMoves} from './elite-leaders.js?v=0.90.46';
import {DATA} from './data.js?v=0.90.41';
import {rootForm,legalForm,legalMoves} from './route-roster.js?v=0.87.0';
export const EXECUTION_BOUNTIES={'LDR-01':10000,'LDR-02':18000,'LDR-03':26000,'LDR-04':34000,'LDR-05':42000,'LDR-06':50000,'LDR-07':60000,'LDR-08':70000};
export function leaderOutcomeState(state){state.leaderOutcomes??={version:1,bounties:{},gifts:{},rematches:{}};return state.leaderOutcomes;}
export function leaderAceBaby(leader){const ace=[...leader.team].sort((a,b)=>b.level-a.level||b.slot-a.slot)[0];return rootForm(ace.species_id);}
export const NURSERY_GROWTH_BONUS=15;
export const NURSERY_SHINY_CHANCE=.25;
function markNurseryLegacy(unit,leaderId,random,preserveShiny=false){
 if(unit.nurseryLegacy?.version===1)return false;
 // Gift UIDs are fixed per leader, so roll independently and persist the result.
 const shinyRoll=random();
 unit.nurseryLegacy={version:1,leaderId,growthBonus:NURSERY_GROWTH_BONUS,shinyRoll};
 unit.shiny=Boolean(preserveShiny&&unit.shiny)||shinyRoll<NURSERY_SHINY_CHANCE;
 return true;
}
export function settleLeaderRewards(state,leader,create,{random=Math.random}={}){
 if(state.fates?.[leader.id]!=='EXECUTED')return false;
 const q=leaderOutcomeState(state);let changed=false;
 if(!q.bounties[leader.id]){state.money=(state.money||0)+EXECUTION_BOUNTIES[leader.id];q.bounties[leader.id]=EXECUTION_BOUNTIES[leader.id];changed=true;}
 const receipt=q.gifts[leader.id];
 if(receipt){
  // Upgrade an existing gift once. A missing, released or dead gift is never replaced.
  const unit=[...(state.party||[]),...(state.reserve||[]),...(state.dead||[])].find(u=>u.uid===receipt.uid);
  if(unit)changed=markNurseryLegacy(unit,leader.id,random,true)||changed;
 }else if(create){
  const id=leaderAceBaby(eliteLeaderTeam(state,leader)),s=DATA.species.find(s=>s.id===id);
  if(s&&!s.legendaryRoamer&&!(/legendary|mythic/i.test(s.power_class||'')||/^(mythic|mythical|legendary)$/i.test(s.role||''))){
   const u=create(id,1,'leader-legacy:'+leader.id);u.originalStarter=false;u.lives=1;u.growthMultiplier=1;u.giftOrigin=leader.name+'’s surrendered nursery';
   markNurseryLegacy(u,leader.id,random);(state.party.length<6?state.party:state.reserve).push(u);q.gifts[leader.id]={uid:u.uid,speciesId:id};changed=true;
  }
 }
 return changed;
}
export function makeLeaderRematch(state,leader){if(state.fates?.[leader.id]!=='SPARED')return null;const q=leaderOutcomeState(state),wins=q.rematches[leader.id]?.wins||0,boost=Math.min(10,3+wins);return {...leader,id:'REMATCH-'+leader.id+'-'+(wins+1),rematchOf:leader.id,rematchNumber:wins+1,portraitId:leader.id,ai_tier:'Leader',nonlethal:true,expeditionTeam:true,team:leader.team.map(s=>{const level=Math.min(200,s.level+boost),species_id=leader.eliteLeader?advanceLeaderForm(s.species_id,level,leader.specialty):legalForm(s.species_id,level),species=DATA.species.find(u=>u.id===species_id);return {...s,level,species_id,...(leader.eliteLeader?{current_form_legal_move_ids:leaderLegalMoves(species,level).map(m=>m.id),battle_move_ids:leaderMoves(species,level,s.leaderRole,leader.specialty),abilitySlot:species.ability_names?.[s.abilitySlot]?s.abilitySlot:'primary'}:{current_form_legal_move_ids:legalMoves(species_id,level)})};})};}
export function completeLeaderRematch(state,id){const match=/^REMATCH-(LDR-\d+)-(\d+)$/.exec(id);if(!match||state.fates?.[match[1]]!=='SPARED'||!state.defeatedTrainers?.includes(id)||!state.trainerPayouts?.includes(id))return false;const q=leaderOutcomeState(state),previous=q.rematches[match[1]]?.wins||0;if(+match[2]!==previous+1)return false;q.rematches[match[1]]={wins:previous+1};return true;}
