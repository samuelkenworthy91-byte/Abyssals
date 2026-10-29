import {claimChoiceReward,choiceRewardText} from './choice-rewards.js?v=0.90.52';
// A staged supply quest: discover the need in Philomere, win the cache battle,
// then make one recorded allocation. No quest state changes on field inspection.
export const MEDICINE_GUARD=Object.freeze({id:'hospice-medicine',speciesId:'140',level:40,moveIds:[43,87,358,40],hpMultiplier:1.25});
export const MEDICINE_RECIPIENTS=Object.freeze({nurses:'DAWNBLOOM_PATIENTS',soldier:'TRUE_LIGHT_SOLDIERS'});
export function migrateHospiceQuest(state){
 if(state.hospiceQuest?.version===1)return state;
 const delivered=!!(state.fates?.['LDR-02']||state.supplyClaims?.includes('medicine-chain-reward')||state.collectedRelics?.includes('medicine-chain-reward'));
 const found=!!state.medicineFound||delivered;
 state.hospiceQuest={version:1,cityVisited:found||!!state.philomereClues||!!state.matchedPrayer,requested:found,guardSeen:found,guardDefeated:found,recipient:delivered?'nurses':null,legacy:found};
 if(found)state.medicineFound=true;
 if(delivered){state.storyChoices??={};state.storyChoices.hospice_medicine_choice??=MEDICINE_RECIPIENTS.nurses;}
 return state;
}
export function hospiceQuest(state){return state.hospiceQuest||{version:1,cityVisited:false,requested:false,guardSeen:false,guardDefeated:false,recipient:null};}
export function requestHospiceMedicine(state,room){
 if(!['philomere','hospice'].includes(room))return false;
 migrateHospiceQuest(state);const q=state.hospiceQuest;q.cityVisited=true;
 if(q.requested)return false;q.requested=true;return true;
}
export function canFightMedicineGuard(state){const q=hospiceQuest(state);return !!q.requested&&!state.medicineFound&&!q.guardDefeated&&!q.recipient;}
export function defeatMedicineGuard(state){
 if(!canFightMedicineGuard(state))return false;
 const q=state.hospiceQuest;q.guardSeen=true;q.guardDefeated=true;state.medicineFound=true;return true;
}
export function carryingHospiceMedicine(state){return !!state.medicineFound&&!hospiceQuest(state).recipient;}
export function deliverHospiceMedicine(state,recipient,room){
 const q=hospiceQuest(state);
 if(room!=='hospice'||!MEDICINE_RECIPIENTS[recipient]||!q.requested||!q.guardDefeated||!carryingHospiceMedicine(state))return false;
 q.recipient=recipient;state.storyChoices??={};state.storyChoices.hospice_medicine_choice=MEDICINE_RECIPIENTS[recipient];
 state.storyHistory??=[];const event='HOSPICE-MEDICINE-'+MEDICINE_RECIPIENTS[recipient];if(!state.storyHistory.includes(event))state.storyHistory.push(event);claimChoiceReward(state,'medicine',recipient);return true;
}
export function hospiceReady(state){return !!hospiceQuest(state).recipient;}
export function hospiceFieldSpots(spots,state){return spots.map(s=>s.id==='yselle'&&!hospiceReady(state)?{id:'abbess-door',label:'Closed hospice wing',x:s.x,y:s.y,door:true}:s.id==='medicine-cache'&&!hospiceQuest(state).requested?{...s,label:'Stranded chest'}:s);}
// Return only the next task already learned by the player. Caller supplies the
// current map's gates so markers correctly follow either direction across stages.
export function hospiceObjective(state,room,map){
 const q=hospiceQuest(state),east=map?.gates?.find(g=>g.x===46)?.id,west=map?.gates?.find(g=>g.x===1)?.id;
 if(room==='hospice')return !q.requested?{spot:'hospice-ward-nurse',text:'Ask the nurses what the hospice needs'}:carryingHospiceMedicine(state)?{spot:'hospice-ward-nurse',text:'Decide who receives the medicine'}:!hospiceReady(state)?{spot:'room-exit',text:'Return to the flooded path for the medicine'}:!state.philomereClues?{spot:'room-exit',text:'Enter the hospice fort to speak to the abbess'}:null;
 if(room==='philomere')return !q.requested?{spot:'hospice-nurse',text:'Ask the hospice staff about Pate and Trade'}:!state.medicineFound?{spot:west,text:'Return to the flooded path for the medicine'}:carryingHospiceMedicine(state)?{spot:'hospice',text:'Take the medicine into the hospice'}:!state.philomereClues?{spot:'philomere-fort-entry',text:'Enter the hospice fort to speak to the abbess'}:!state.fates?.['LDR-02']?{spot:'philomere-fort-entry',text:'Enter the hospice fort for the formal challenge'}:{spot:'philomere-boundary',text:'Take Rivercause Road to Cybressa'};
 if(map?.base==='medicinePath'||room==='medicinePath'){
  if(!q.requested)return {spot:east,text:'Continue along the road east'};
  if(carryingHospiceMedicine(state))return {spot:east,text:'Return the medicine to Philomere'};
  if(hospiceReady(state))return {spot:east,text:'Continue along the flooded road'};
  return room==='medicinePath'?{spot:'medicine-cache',text:q.guardSeen?'Defeat the Deltacroc guarding the medicine':'Recover the stranded medicine chest'}:{spot:west,text:'Return to the stranded medicine chest'};
 }
 if(['northRoad','hospiceRoad'].includes(map?.base)||['northRoad','hospiceRoad'].includes(room))return {spot:east,text:q.requested&&!hospiceReady(state)?carryingHospiceMedicine(state)?'Return the medicine to Philomere':'Find the medicine on the flooded path':'Follow the road east'};
 return null;
}
export function journalSummary(state,room){
 const q=hospiceQuest(state);
 if(['philomere','hospice'].includes(room)||room.startsWith('medicinePath')){
  if(!q.requested)return 'People here may know what happened to Pate and Trade.';
  if(!state.medicineFound)return q.guardSeen?'The stranded chest is guarded. Recovering it will take a battle.':'The war has left the hospice short of treatment supplies.';
  if(carryingHospiceMedicine(state))return 'You are carrying the sealed supplies. There is enough for one ward.';
  if(!state.philomereClues||!state.fates?.['LDR-02'])return q.recipient==='nurses'?'The medicine was allocated to the Dawn Bloom patients. The abbess will now receive you.':'The medicine was allocated to the True Light soldiers so they can fight again. The abbess will now receive you.';
  return 'Your business with the abbess is settled.';
 }
 if(state.routeReached)return 'You are following the road Pate and Trade took.';
 if(state.test)return 'You have passed the test and can join the road.';
 if(state.kurg)return 'Prove you can look after yourself.';
 if(state.trade)return 'Trade left you a note. You want an explanation.';
 return 'Pate promised you would leave together.';
}
