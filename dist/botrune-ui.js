import {handleStormSide} from './thunderplain-ui.js?v=0.90.13';
import {BOTRUNE_NAME,BOTRUNE_TRAINERS,BOTRUNE_GUARDS,WITNESSES,STORM_RECORD,STORM_ROAD,botruneRoute} from './botrune-data.js?v=0.90.13';
import {botruneState,botruneUnlocked,botruneCanFight,btDefeated,botruneObjective} from './botrune-rules.js?v=0.90.13';
export function handleBotrune(id,a){
 if(handleStormSide(id,a))return true;
 const {state:s,room,line,showDialogue,warp,rewardTransaction:commit,buildMarkers,openModal,escapeHTML:e,challengeTrainer,species,$}=a,q=botruneState(s);
 const say=(speaker,text,portrait)=>showDialogue([line(speaker,text,portrait)]);
 if(id==='marasen-next'){
  if(!botruneUnlocked(s))say('Scribes’ Road','Settle Khalid’s challenge and judgement before leaving Marasen.');
  else showDialogue([line('The last green bank','Beyond Marasen’s final irrigation channel, the earth turns grey. Thunder rolls across an exposed plateau. The copper conductors beside the road have been stripped for the war.'),line('Aimon','Pate and Trade went this way.','CHR-AIMON')],()=>void warp('stormVerge',3,17,'right'));return true;
 }
 if(id==='area-sign'&&STORM_ROAD.some(r=>r[0]===room)){const r=botruneRoute(room);openModal(r.area.name,'<p>'+e(STORM_RECORD)+'</p>'+r.tables.map(t=>'<p><b>'+t.phase+'</b><br>'+t.slots.map(slot=>e(species(slot.species_id).name)+' '+slot.weight+'% · Lv '+slot.min_level+'–'+slot.max_level).join('; ')+'</p>').join(''));return true;}
 if(id==='bt-burrower'){say('Storm shelter keeper','The burrowers do not fear the current. Ground types are immune to Electric attacks. Those black glass veins are old strikes, not a safe trail. Follow the pale road; keep your food for partners you actually mean to approach.','SHOP-DOR');return true;}
 if(id==='bt-wagon'){if(q.wagon)say('Dispatch wagon','The dispatch pouch is empty. You kept the strip of forwarding paper.');else showDialogue([line('Dispatch wagon','A wheel has sunk into fused glass. Inside the pouch is a requisition for an armed escort: “Two First Light prisoners. Deliver to the abbey square.” There are no names.'),line('Aimon','Prisoners. Not the marching column.','CHR-AIMON')],()=>{commit(()=>{q.wagon=true;});buildMarkers();});return true;}
 if(WITNESSES[id]){const [name,text]=WITNESSES[id];say(name,q.phase==='trial'?'The witness watches the stage without speaking.':text);if(q.phase!=='trial'&&!q.witnesses.includes(id))commit(()=>{q.witnesses.push(id);});return true;}
 const trainer=BOTRUNE_TRAINERS.find(t=>t.id===id||id==='bt-leader'&&t.id==='LDR-06');
 if(trainer){
  if(trainer.id==='LDR-06'&&s.fates?.['LDR-06']==='SPARED'){a.rematch(trainer);return true;}
  if(!botruneCanFight(s,trainer.id))say('Blocked stair',q.phase==='trial'?'The crowd and the guard cordon hold you below the platform.':botruneObjective(s,room).text);
  else challengeTrainer(trainer);return true;
 }
 if(id==='bt-recovery'){
  if(!s.fates?.['LDR-06']){say('The platform','The guard line still separates you from Pate and Trade. Face Fatima first.');return true;}
  showDialogue(q.keepsakes?[line('The quiet platform','Pate’s braided friendship cord and Trade’s field notebook are safe in your pack. Their names remain in your record.')]:[line('Aimon','You told me not to follow. I thought you meant I wasn’t good enough.','CHR-AIMON'),line('Aimon','I kept trying to be strong enough to stand beside you. You were only trying to get me home.','CHR-AIMON'),line('Botrune','Walter kneels beside the two bodies. He does not offer an explanation. He helps you wrap Pate’s braided friendship cord around Trade’s closed field notebook.'),line('Aimon','They were my friends. Whatever they did for an army, they were my friends.','CHR-AIMON')],()=>{if(!q.keepsakes)commit(()=>{q.keepsakes=true;});buildMarkers();});return true;
 }
 if(id==='bt-archive'){say('Abbey archive',s.fates?.['LDR-06']?'The abbey scholar has sealed the military orders as evidence. The buried archive remains protected. The road towards Cayfen belongs to a later chapter.':'The abbey doors are locked under military seal. The scholar waits below the stage.');return true;}
 if(id==='botrune-next'){say('War Road',s.fates?.['LDR-06']?'The War Road continues towards Cayfen. This is the current chapter boundary. Botrune, the Thunderplain and earlier regions remain open.':'Fatima’s guard companies hold the War Road. Settle the confrontation on the stage.');return true;}
 return false;
}

export function botruneFateMenu(a){
 const {state:s,openModal,$,rewardTransaction:commit,settleLeaderRewards,create,closeModal,line,showDialogue,buildMarkers,decisionHTML,species}=a;
 if(s.pendingFate?.id!=='LDR-06')return;
 const leader=BOTRUNE_TRAINERS.find(t=>t.id==='LDR-06');
 const choose=fate=>{if(!commit(()=>{s.fates['LDR-06']=fate;s.pendingFate=null;botruneState(s).phase='settled';settleLeaderRewards(s,leader,create);}))return;closeModal();buildMarkers();showDialogue([line('Aimon','I wanted to get here before something happened. Now I don’t know what I was going to say.','CHR-AIMON'),line('Botrune',fate==='SPARED'?'Fatima is disarmed and placed in civilian custody. Scholars secure the sentencing records and take over the archive. Sparing her ends her rule; it does not excuse it.':'Fatima is executed on the platform. The scholars recoil, then carry the sentencing records into the abbey. The archive remains protected. Nothing on the stage has been undone.'),line('Chaplain Walter','You do not have to leave them here alone. Go to your friends.','CHR-AERIC')]);};
 openModal(BOTRUNE_NAME+' is defeated','<p>The guard line has broken. Aimon stands on the same platform where Pate and Trade died. Fatima has surrendered.</p><p>Spare removes her from power and places her in civilian custody. Execute is a separate, permanent decision. The abbey archive and town services remain protected either way.</p><p>'+decisionHTML(leader)+'</p><div class="modal-actions"><button id="bt-spare" class="primary">Spare</button><button id="bt-execute">Execute</button></div>');
 $('#close-modal').hidden=true;$('#bt-spare').onclick=()=>choose('SPARED');$('#bt-execute').onclick=()=>{const executor=species(s.pendingFate.executor);openModal('Confirm execution','<p>Order '+(executor?.name||'your lead partner')+' to execute Fatima? This cannot bring Pate or Trade back. The order is permanent.</p><div class="modal-actions"><button id="bt-reconsider">Reconsider</button><button id="bt-confirm">Give the order</button></div>');$('#close-modal').hidden=true;$('#bt-reconsider').onclick=()=>botruneFateMenu(a);$('#bt-confirm').onclick=()=>choose('EXECUTED');};$('#bt-spare').focus();
}
