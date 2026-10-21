import {stormSideObjective} from './thunderplain-rules.js?v=0.90.14';
import {BOTRUNE_GUARDS,TRIAL_BEATS,STORM_ROAD} from './botrune-data.js?v=0.90.17';
export function botruneState(s){return s.botrune??={version:1,cursor:0,phase:'trial',witnesses:[],keepsakes:false};}
export const botruneUnlocked=s=>['SPARED','EXECUTED'].includes(s.fates?.['LDR-05']);
export const btDefeated=(s,id)=>(s.defeatedTrainers||[]).includes(id);
export function finishTrialBeat(s,index){
 const q=botruneState(s);if(q.phase!=='trial'||index!==q.cursor||!TRIAL_BEATS[index])return false;
 const beat=TRIAL_BEATS[index];
 if(beat.death?.startsWith('CHR-')){
  s.humanLives??={};s.human_life_state??={};s.human_memorial_entries??=[];s.human_restored_ids??=[];s.human_restoration_budget_total=5;const previous=s.humanLives[beat.death];
  const life=s.human_life_state[beat.death]==='REVIVED'||previous?.restored?'REVIVED':'DEAD';
  s.human_life_state[beat.death]=life;s[beat.death==='CHR-PATE'?'pate_progress_state':'trade_progress_state']=life==='REVIVED'?'RESOLVED':'CONFIRMED_DEAD';
  if(!s.human_memorial_entries.includes(beat.death))s.human_memorial_entries.push(beat.death);
  // Preserve a future restored state and historical death independently.
  s.humanLives[beat.death]={...previous,id:beat.death,lifeState:life,historicalDeath:{event:'BT-PUBLIC-SENTENCE-20261020',place:'Botrune',cause:'EXECUTED',beat:index},restorationEligible:true};
 }
 q.cursor++;if(q.cursor===TRIAL_BEATS.length){q.phase='gauntlet';s.storyHistory??=[];if(!s.storyHistory.some(e=>e.id==='BT-PUBLIC-SENTENCE-20261020'))s.storyHistory.push({id:'BT-PUBLIC-SENTENCE-20261020',location:'Botrune',pate:'EXECUTED',trade:'EXECUTED',supersedes:'Earlier Emmara Mill companion-death outline'});}
 return true;
}
export const trialVictims=s=>TRIAL_BEATS.slice(0,botruneState(s).cursor).filter(b=>b.death).map(b=>b.death);
export function botruneCanFight(s,id){const q=botruneState(s);if(id==='LDR-06')return q.phase!=='trial'&&BOTRUNE_GUARDS.every(t=>btDefeated(s,t.id));const n=BOTRUNE_GUARDS.findIndex(t=>t.id===id);return n<0||q.phase!=='trial'&&BOTRUNE_GUARDS.slice(0,n).every(t=>btDefeated(s,t.id));}
export function botruneBlocked(s,room,x,y){if(room!=='botrune')return false;const q=botruneState(s);if(q.phase==='trial')return y<20;for(const [n,top]of [20,15,10].entries())if(y===top&&x>=20&&x<=28&&!btDefeated(s,BOTRUNE_GUARDS[n].id))return true;return false;}
export function botruneSpots(s,room,spots){if(room!=='botrune')return spots;return spots.filter(p=>!p.botruneGuard||!btDefeated(s,p.id)).filter(p=>p.id!=='bt-leader'||s.fates?.['LDR-06']!=='EXECUTED').filter(p=>p.id!=='bt-recovery'||botruneState(s).phase!=='trial');}
export function botruneObjective(s,room){
 const side=stormSideObjective(s,room);if(side)return side;
 if(room==='stormWatch'&&!btDefeated(s,'TRN-BT-DARIUS'))return {spot:'bt-darius-entry',text:'The cart blocks the east road. Pate and Trade went ahead for supplies. Investigate the disturbance up the old stone steps north of Abandoned Watch.'};
 if(room==='botruneLower')return {spot:'bt-upper-street',text:botruneState(s).phase==='trial'?'Enter Botrune’s Gothic main street. A proclamation carries from the abbey square to the north. Shops, the infirmary and the inn are open.':'Botrune services: provisioner northwest, infirmary southwest, inn southeast, records northeast. North street returns to the abbey square.'};
 const n=STORM_ROAD.findIndex(r=>r[0]===room);if(n>=0)return {spot:room+'-forward',text:'Cross the Thunderplain · '+(n+1)+'/'+STORM_ROAD.length+' · follow the pale road towards Botrune'};
 if(room==='botruneShelter')return {spot:'bt-shelter-exit',text:'Prepare at the roadside shelter; the Botrune road stays open behind you'};
 if(!room.startsWith('botrune'))return null;
 const q=botruneState(s);if(q.phase==='trial')return {spot:null,text:'A public sentence is being read in Botrune'};
 const guard=BOTRUNE_GUARDS.find(t=>!btDefeated(s,t.id));if(guard)return {spot:guard.id,text:'Reach Fatima on the stage · break the guard cordon '+(BOTRUNE_GUARDS.indexOf(guard)+1)+'/3. You may retreat to prepare.'};
 return !s.fates?.['LDR-06']?{spot:'bt-leader',text:'Confront Canon Fatima on the public stage'}:{spot:!q.keepsakes||!q.walterCalmed?'bt-recovery':'bt-archive',text:!q.keepsakes||!q.walterCalmed?'Return to Pate and Trade on the platform':'Speak to the abbey scholar; Botrune’s archive is protected'};
}
export function botruneJournal(s,room){if(room.startsWith('storm'))return (botruneObjective(s,room)?.text||'Follow the pale road to Botrune.')+' The mountain steps leave Abandoned Watch to the north. The Stormcatch Relay is a separate north trail from Glass Scars.';if(!botruneObjective(s,room))return '';const q=botruneState(s);return q.phase==='trial'?'Pate and Trade’s trail leads across the Thunderplain to Botrune.':q.phase==='gauntlet'?'Fatima executed five prisoners, including Pate and Trade. The crowd did not cheer. Witnesses say the charges were invented. The three guard captains block the stage; completed victories stay saved if you retreat.':'Fatima’s rule has ended. Pate and Trade’s deaths remain recorded separately; neither a victory nor a judgement brings them back. The abbey archive remains under civilian protection.';}
