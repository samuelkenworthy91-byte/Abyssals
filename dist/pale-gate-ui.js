import {FERRY_FORKS,ferryWindow,paleState,PRINCE_ID} from './pale-gate.js?v=0.90.62';
import {PALE_TRAINERS} from './finale-data.js?v=0.90.62';

const records={
 'file-a':'Docket A · Nell | ash token | 3rd bell | Witness stamp only | Departed.',
 'file-b':'Docket B · Bertram | birch token | 3rd bell | Witness stamp only | Waiting.',
 'file-c':'Docket C · Maud | ash token | 3rd bell | Witness and ferry stamps | Departed.',
 receipt:'Ash tokens board north and birch tokens board south. North carried one passenger at the third bell. South first sailed at the fourth bell. The witness stamps at intake. The ferryman stamps the same docket after boarding.'
};
const orchard={
 'bell-tag':'The tag was clipped to the bird bell. Its owner’s name has four letters.',
 bowl:'The chipped bowl is scratched with L__K. Beneath the scratches is a little bird.',
 roster:'Lark carried the bird bell. Linn carried the blue cord. Lorn looked after the west gate.'
};
export const PALE_REED_START=5;
export function turnReedLamp(bits,i){return bits^([3,7,6][i]);}

export function paleNotesHTML(state,escape){
 const q=state.paleGate;
 if(!q)return '';
 const groups=[['Intake dockets and ferry receipts',records],['Return a Name',orchard]];
 const notes=groups.map(([title,entries])=>{
  const read=Object.entries(entries).filter(([key])=>q.records[key]);
  return read.length?'<details><summary>'+title+'</summary>'+read.map(([,text])=>'<p>'+escape(text)+'</p>').join('')+'</details>':'';
 }).join('');
 const memorial=q.named?'<p>Memorial · Lark, the orchard watch’s Pennkit. He wore the bird bell and slept with his head on his handler’s boot.</p>':'';
 return notes||memorial?'<section class="site-notebook"><h3>Pale Gate records</h3>'+notes+memorial+'</section>':'';
}

function ferry(a,slow){
 const {openModal,closeModal,$,state,warp,rewardTransaction:commit,blip}=a;
 let fork=0,lane=1,elapsed=0,last=null,frame=0,paused=false;
 const stop=()=>cancelAnimationFrame(frame);
 const finish=()=>{
  stop();
  if(!commit(()=>{paleState(state).crossed=true;})){closeModal();return;}
  closeModal();void warp('paleRiver',39,19,'right');
 };
 const fail=reason=>{
  stop();openModal('Back at the landing',`<p>${reason} The ferry drifts back to the quay.</p><button id="pg-retry">Read the riddle and try again</button>`);
  $('#pg-retry').onclick=()=>ferryBrief(a);
 };
 function step(now){
  if(!$('#pg-ferry-signal'))return;
  if(!paused&&!document.hidden&&document.hasFocus()&&last!==null)elapsed+=Math.min(50,now-last);
  last=now;
  const w=ferryWindow(elapsed,slow);
  if(w.expired){fail('The gate closes before the chain rings.');return;}
  $('#pg-ferry-meter').value=elapsed/w.span;
  $('#pg-ferry-track').style.setProperty('--crossing',String(elapsed/w.span));
  const signal=w.open?'Ring now':'Wait for the gate';
  if($('#pg-ferry-signal').textContent!==signal){$('#pg-ferry-signal').textContent=signal;blip?.(650);}
  $('#pg-ferry-track').classList.toggle('aligned',w.open);
  frame=requestAnimationFrame(step);
 }
 function steer(next){
  lane=next;
  $('#pg-ferry-track').style.setProperty('--lane',String(next));
  for(const button of document.querySelectorAll('[data-pg-lane]'))button.setAttribute('aria-pressed',String(Number(button.dataset.pgLane)===lane));
 }
 function ring(){
  if(!ferryWindow(elapsed,slow).open){fail('The chain rings out of time.');return;}
  if(lane!==FERRY_FORKS[fork].correct){fail('That chain answers a different riddle.');return;}
  if(++fork===FERRY_FORKS.length){finish();return;}
  showFork();
 }
 function showFork(){
  stop();elapsed=0;last=null;lane=1;
  const f=FERRY_FORKS[fork];
  openModal(`The Countercurrent · gate ${fork+1} of 3`,`<p>${f.clue}</p><div id="pg-ferry-track"><img src="assets/finale/pg-prop-ferry.webp" alt=""><progress id="pg-ferry-meter" aria-label="Approach to the gate" max="1" value="0"></progress><strong id="pg-ferry-signal" role="status">Wait for the gate</strong></div><div class="pg-lanes" role="group" aria-label="Ferry lanes">${f.lanes.map((n,i)=>`<button data-pg-lane="${i}" aria-pressed="false">${n}</button>`).join('')}</div><div class="modal-actions"><button class="primary" id="pg-ring">Ring the selected chain</button><button id="pg-ferry-pause">Pause crossing</button></div>`,stop);
  for(const button of document.querySelectorAll('[data-pg-lane]'))button.onclick=()=>steer(Number(button.dataset.pgLane));
  $('#pg-ring').onclick=ring;
  $('#pg-ferry-pause').onclick=()=>{
   paused=!paused;
   last=null;
   $('#pg-ring').disabled=paused;
   $('#pg-ferry-pause').textContent=paused?'Resume crossing':'Pause crossing';
  };
  $('#pg-ring').focus();steer(lane);
  $('#pg-ferry-track').closest('.modal').addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
   event.preventDefault();event.stopPropagation();steer((lane+(event.key==='ArrowLeft'?2:1))%3);
  });
  frame=requestAnimationFrame(step);
 }
 showFork();
}
function ferryBrief(a){
 a.openModal('The ferry riddle',`<p>Choose a lane for each answer, then ring its chain when the gate aligns. A bad crossing puts you back on the bank.</p><ol>${FERRY_FORKS.map(f=>`<li>${f.clue}</li>`).join('')}</ol><button class="primary" id="pg-launch">Launch</button><button id="pg-slow">Launch · slower current</button>`);
 a.$('#pg-launch').onclick=()=>ferry(a,false);
 a.$('#pg-slow').onclick=()=>ferry(a,true);
}
export function handlePaleGate(id,a){
 if(!id.startsWith('pg-'))return false;
 const {state:s,line,showDialogue,warp,challengeTrainer,startWild,rewardTransaction:commit,buildMarkers,room}=a;
 const q=paleState(s),say=(n,t,p)=>showDialogue([line(n,t,p)]);
 const choose=(n,t,options,p)=>showDialogue([{...line(n,t,p),choices:options.map(([text,action])=>({text,action}))}]);
 const mark=fn=>{if(commit(fn)){buildMarkers();return true;}return false;};
 const won=t=>s.defeatedTrainers?.includes(t);
 const go=(room,x,y,dir)=>void warp(room,x,y,dir);
 const key=id.slice(3);
 const gate=a.AREA_GATES[room]?.find(g=>g.id===id);
 if(gate){
  if(key==='hall'&&!won('TRN-PG-BAILIFF'))say('The far landing','The Toll Bailiff is waiting by the road.');
  else if(key==='prince'&&!q.restored)say('The archive gate','The ledger must balance before this gate opens.');
  else go(gate.to,...gate.arrival);
  return true;
 }
 switch(key){
  case 'guide':
   if(q.seen)say('Vantis Eldrin','The first names stay on this bank until the Keeper calls them. Pate and Trade are already further in.','SEVERIN-VALE');
   else showDialogue([
    line('Aimon','I thought Hell would look worse than this. It could almost be the hills above Civeton.','CHR-AIMON'),
    line('Vantis Eldrin','On a clear day you can see the snow on the far bank. There are worse places to wait.','SEVERIN-VALE'),
    line('Aimon','Those two are wearing different colours. Are they together?','CHR-AIMON'),
    line('Vantis Eldrin','One had spare thread. The other had a needle. The ferry comes for both.','SEVERIN-VALE')
   ],()=>mark(()=>{q.seen=true;}));
   break;
  case 'blue':say('A soldier at the quay','My arm was worse when I got here. Still takes both hands to tie a knot. She’s been helping me.','PG-BLUE');break;
  case 'red':say('The soldier with the red scarf','We had an Abyssal on the watch. I remember his bell. His name is going. Try the orchard where we used to walk him.','PG-RED');break;
  case 'rest':
   choose('The quay shelter','There’s a fire by the quay. Your partners can recover here before you cross.',[['Rest the expedition.',a.rest],['Open expedition and reserve.',a.reserve],['Keep going.',()=>{}]]);
   break;
  case 'relay-east':case 'relay-west':{
   if(!won(PRINCE_ID)){say('Underway Relay','The far stone is dark. The Keeper must open the inner gate before the stones can be used.');break;}
   const east=key==='relay-east';
   choose('Underway Relay','The other stone answers from '+(east?'the Keeper’s Terrace.':'Arrival Quay.'),[
    ['Travel to '+(east?'the Keeper’s Terrace.':'Arrival Quay.'),()=>east?go('palePrince',37,21,'right'):go('paleQuay',19,21,'left')],
    ['Stay here.',()=>{}]
   ]);
   break;
  }
  case 'launch':
   if(q.crossed)choose('The Countercurrent','The ferryman knows your crossing now.',[['Cross to the far bank.',()=>go('paleRiver',39,19,'right')],['Cross the old way.',()=>ferryBrief(a)],['Stay here.',()=>{}]]);
   else ferryBrief(a);
   break;
  case 'ferry-back':go('paleRiver',6,19,'left');break;
  case 'reeds':go('paleReeds',3,19,'right');break;
  case 'bailiff':challengeTrainer(PALE_TRAINERS[0]);break;
  case 'hound':challengeTrainer(PALE_TRAINERS[1]);break;
  case 'audit':
   if(q.restored){say('The intake ledger','The premature departure has been struck through. The far gate is open.');break;}
   if(!Object.keys(records).every(k=>q.records[k])){say('The intake ledger','Check all three dockets and the ferry receipts.');break;}
   choose('The intake ledger','Compare the tokens, departure bells and order of the stamps. Whose docket was marked Departed before they boarded?',[
    ['Docket A · Nell',()=>{if(mark(()=>{q.restored=true;}))say('The intake ledger','Nell has the witness stamp alone. Maud was aboard the north ferry. Nell’s name returns to the intake board.');}],
    ['Docket B · Bertram',()=>say('The intake ledger','Bertram is already marked Waiting.')],
    ['Docket C · Maud',()=>say('The intake ledger','Maud’s ferry stamp accounts for the one passenger on the north sailing.')]
   ]);break;
  case 'keeper':
   if(!q.restored)say('Hugh FitzAlan','Set the intake ledger right first.','PG-KEEPER');
   else if(!won(PRINCE_ID)&&!q.keeperMet)showDialogue([
    line('Vantis Eldrin','Hugh.', 'SEVERIN-VALE'),
    line('The Keeper’s Terrace','Vantis closes his ledger and slips it inside his coat. Hugh waits until both of his hands are empty.')
   ],()=>{if(mark(()=>{q.keeperMet=true;}))challengeTrainer(PALE_TRAINERS[2]);});
   else challengeTrainer(PALE_TRAINERS[2]);
   break;
  case 'beyond':
   if(!won(PRINCE_ID))say('The inner gate','The Keeper holds the inner gate.');
   else showDialogue([line('Vantis Eldrin','There it is. The House of Unfinished Things. We’ll need to keep our bearings in there.','SEVERIN-VALE'),line('Beyond the Pale Gate','The snow thins beside the arch. The road to the second Circle is open.')]);
   break;
  case 'return-name':
   if(q.named){say('The soldier','Lark. He always slept with his head on my boot. Thank you.','PG-RED');break;}
   if(!Object.keys(orchard).every(k=>q.records[k])){say('The soldier','His tag, his bowl, the old roster. There must be enough here to piece it together.','PG-RED');break;}
   choose('The soldier','What was his name?',[
    ['Linn',()=>say('The soldier','Linn’s name was on a blue cord. Ours wore the bell.')],
    ['Lark',()=>{if(mark(()=>{q.named=true;s.fortifiedRations=(s.fortifiedRations||0)+2;}))showDialogue([line('The orchard','A little bell answers from between the birches. The soldier kneels as Lark settles against her boot.'),line('The soldier','Take these two Fortified Rations. You’ll need them farther in.','PG-RED')]);}],
    ['Lorn',()=>say('The soldier','I remember Lorn. He had the west gate.')]
   ],'PG-RED');break;
  case 'reed-note':
   mark(()=>{q.records[key]=true;});say('The ferryman’s note','Light all three lamps to reveal the flood marker. Every lever flips its own lamp and the lamps directly beside it. There’s no link from north to south. '+['North','Middle','South'].map((n,j)=>n+(((q.reedBits??PALE_REED_START)>>j)&1?' lit':' dark')).join(' · ')+'.');break;
  case 'lamp-north':case 'lamp-middle':case 'lamp-south':{
   if(!q.records['reed-note']){say('The mooring lamp','An old note is posted by the landing.');break;}
   if(q.reedSolved){say('The mooring lamps','All three are alight. The flood marker is visible.');break;}
   const i=['lamp-north','lamp-middle','lamp-south'].indexOf(key);
   if(!mark(()=>{q.reedBits=turnReedLamp(q.reedBits??PALE_REED_START,i);q.reedSolved=q.reedBits===7;}))break;
   say('The mooring lamps',['North','Middle','South'].map((n,j)=>n+((q.reedBits>>j)&1?' lit':' dark')).join(' · '));break;
  }
  case 'reed-cache':
   if(!q.reedSolved){say('The flood marker','The reeds swallow the light. Try lighting all three lamps.');break;}
   choose('The flood marker','Tracks wind from the three lamps to the cold reeds.',[
    ['Search the willows for Rimebun.',()=>startWild({speciesId:'364',level:104,phase:'Frostreed Landing',tableId:'pale-reeds-rimebun'})],
    ['Follow the ice tracks to Frostrill.',()=>startWild({speciesId:'275',level:105,phase:'Frostreed Landing',tableId:'pale-reeds-frostrill'})],
    ['Leave the reed bed.',()=>{}]
   ]);break;
  default:{
   const clue=records[key]??orchard[key];
   if(!clue)return false;
   mark(()=>{q.records[key]=true;});say('The field record',clue);
  }
 }
 return true;
}
