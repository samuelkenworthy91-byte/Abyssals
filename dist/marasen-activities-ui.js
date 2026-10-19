// Marasen: commercial floors, permanent growth, and the Rapids Arena.
// All permanent transactions are committed through the game's save rollback guard.
import {DATA} from './data.js?v=0.87.0';
import {HELD_ITEMS} from './held-data.js?v=0.87.0';
import {EVOLUTION_ITEMS} from './evolution-items.js?v=0.87.0';
import {STAT_KEYS,STAT_LABELS,unitGrowthPercent} from './progression.js?v=0.87.0';
const FLOOR_NAMES=['General Provisions','Technique Library','Relic Gallery','Evolution Atelier','Growth Apothecary','Merchant’s Terrace'];
const money=n=>Math.floor(n||0).toLocaleString('en-GB');
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function data(s){s.marasen??={version:2,walk:[],quests:{},encounters:{},seeds:{},serviceDays:[]};s.marasen.exchange??={receipts:[]};s.marasen.rapids??={runs:0,wins:0,race:null,results:[],daily:[]};return s.marasen;}
const owned=s=>[...(s.party||[]),...(s.reserve||[])].filter(u=>u&&u.hp>0&&!u.dead);
const activeWater=s=>owned(s).filter(u=>u.species?.types?.includes('WATER'));
const scrolls=()=>{
 const moves=DATA.moves.filter(m=>m&&m.id&&m.power>=40&&m.power<=90&&m.category!=='STATUS'&&!m.signature_owner_family&&!m.questTutor&&!m.signature_owner_name&&!m.signature_owner&&DATA.learnsets.some(l=>l.move_id===m.id));
 const selected=[],types=new Set();for(const m of moves){if(!types.has(m.type_id)&&selected.length<16){selected.push(m);types.add(m.type_id);}}
 return selected.map(m=>({id:String(m.id),name:m.name,description:`${m.type_id} / ${m.category} · power ${m.power} · single-use Codex`,price:m.power>=75?5500:3500}));
};
function storeItems(floor){
 if(floor===1)return scrolls().map(m=>({...m,kind:'codex'}));
 if(floor===2)return HELD_ITEMS.filter(i=>Number(i.buy_price)>0&&!i.id.startsWith('HELD_QUEST_')).slice(0,26).map(i=>({kind:'held',id:i.id,name:i.name,description:i.effect_text,price:Math.max(1800,i.buy_price)}));
 if(floor===3)return EVOLUTION_ITEMS.filter(i=>Number(i.buy_price)>0).map(i=>({kind:'evolution',id:i.id,name:i.name,description:i.effect_text,price:Number(i.buy_price)}));
 if(floor===4)return [{kind:'training',id:'trainingTonics',name:'Level Training Tonic',description:'Raises a living Abyssal one level; separate from permanent growth tonics.',price:7500},{kind:'growth',id:'focused',name:'Focused Growth Tonic',description:'Choose one stat. +5 percentage points of future growth. Maximum five growth doses per Abyssal.',price:25000},{kind:'growth',id:'balanced',name:'Balanced Growth Tonic',description:'+1 percentage point to future growth in all six stats. Maximum five growth doses per Abyssal.',price:30000}];
 if(floor===5)return [{kind:'supply',id:'riverBait',name:'River Bait',description:'Specialist capture food suited to aquatic encounters.',price:950},{kind:'supply',id:'emergencyEvacs',name:'Emergency Evac',description:'Return a living expedition safely to its recovery location.',price:2500},{kind:'supply',id:'lifeEmbers',name:'Life Ember',description:'A rare second chance for a living Abyssal. One per expedition.',price:40000}];
 return [];
}
const price=entry=>entry.price;
function purchase(s,item){if(!item||!Number.isFinite(item.price)||item.price<1||s.money<item.price)return false;
 const m=data(s);if(item.id==='lifeEmbers'&&m.exchange.receipts.includes('lifeEmbers'))return false;
 if(item.kind==='growth')return false;
 s.money-=item.price;
 if(item.kind==='codex'){s.moveScrolls??={};s.moveScrolls[item.id]=(s.moveScrolls[item.id]||0)+1;}
 else if(item.kind==='held'){s.heldItems??={};s.heldItems[item.id]=(s.heldItems[item.id]||0)+1;}
 else if(item.kind==='evolution'){s.evolutionItems??={};s.evolutionItems[item.id]=(s.evolutionItems[item.id]||0)+1;}
 else s[item.id]=(s[item.id]||0)+1;
 if(item.id==='lifeEmbers')m.exchange.receipts.push('lifeEmbers');return true;
}
export function growthTonic(s,uid,kind,stat){const u=owned(s).find(u=>u.uid===uid);if(!u||!['focused','balanced'].includes(kind)||(u.marasenTonicDoses||0)>=5||kind==='focused'&&!STAT_KEYS.includes(stat))return false;
 const cost=kind==='focused'?25000:30000;if((s.money||0)<cost)return false;
 s.money-=cost;u.marasenTonicDoses=(u.marasenTonicDoses||0)+1;u.marasenGrowth??={};
 for(const key of kind==='focused'?[stat]:STAT_KEYS)u.marasenGrowth[key]=(u.marasenGrowth[key]||0)+(kind==='focused'?5:1);
 return true;
}
function showFloor(a,floor){const {state,openModal,$,document,rewardTransaction,shop}=a,items=storeItems(floor);
 if(floor===0){shop('marasenMarket');return;}
 openModal('Grand Exchange · '+FLOOR_NAMES[floor],`<p>Marasen is the commercial centre of the Living Water basin. <b>${money(state.money)} doubloons</b> available.</p><div class="mr-merch-floor"><span>FLOOR ${floor+1} / 6</span><b>${FLOOR_NAMES[floor]}</b></div>${items.map((it,i)=>`<article class="mr-stock"><div><b>${safe(it.name)}</b><p>${safe(it.description)}</p>${it.kind==='codex'?`<small>In backpack: ${state.moveScrolls?.[it.id]||0}</small>`:''}</div><button data-mr-buy="${i}" ${state.money<it.price||it.id==='lifeEmbers'&&data(state).exchange.receipts.includes('lifeEmbers')?'disabled':''}>${money(it.price)} ⛁</button></article>`).join('')}<p class="mr-note">Moves are stored in your Bag → Training → Move Scrolls. Permanent growth tonics are applied directly to an individual, with a five-dose lifetime cap.</p>`);
 for(const btn of document.querySelectorAll('[data-mr-buy]'))btn.onclick=()=>{const it=items[Number(btn.dataset.mrBuy)];if(!it)return;
 if(it.kind==='growth'){showTonic(a,it);return;}
 if(state.money<it.price)return;
 if(rewardTransaction(()=>purchase(state,it))){a.refresh?.();showFloor(a,floor);}
 };
}
function showTonic(a,item){const {state,openModal,document,$,rewardTransaction}=a;
 const pool=owned(state);
 openModal(item.name,`<p>${safe(item.description)}</p><p>Cost: <b>${money(item.price)} doubloons</b>. The improvement affects <b>future levels only</b>, not current stats, and cannot be inherited by offspring.</p><div class="summary-list">${pool.map(u=>`<button data-mr-tonic-uid="${safe(u.uid)}" ${(u.marasenTonicDoses||0)>=5||state.money<item.price?'disabled':''}><b>${safe(u.nickname||u.species.name)} · Lv. ${u.level}</b><small>Lifetime doses ${(u.marasenTonicDoses||0)} / 5 · ${safe(u.species.types.join(' / '))}</small></button>`).join('')}</div>`);
 for(const el of document.querySelectorAll('[data-mr-tonic-uid]'))el.onclick=()=>{
  const uid=el.dataset.mrTonicUid,u=pool.find(x=>x.uid===uid);if(!u)return;
  const selector=item.id==='focused'?`<label>Stat to improve<select id="mr-tonic-stat">${STAT_KEYS.map(k=>`<option value="${k}">${STAT_LABELS[k]} · ${unitGrowthPercent(u,k).toFixed(1)}% → ${(unitGrowthPercent(u,k)+5).toFixed(1)}%</option>`).join('')}</select></label>`:'<p>All six growth rates increase by 1 percentage point.</p>';
  openModal('Confirm permanent growth',`<p>Give <b>${safe(u.nickname||u.species.name)}</b> a ${safe(item.name)}?</p>${selector}<p>Doses after purchase: <b>${(u.marasenTonicDoses||0)+1}/5</b>. This cannot be reversed.</p><button id="mr-tonic-approve" class="primary">Apply tonic · ${money(item.price)} doubloons</button><button id="mr-tonic-abort">Cancel</button>`);
  $('#mr-tonic-abort').onclick=()=>showTonic(a,item);
  $('#mr-tonic-approve').onclick=()=>{let applied=false;const key=$('#mr-tonic-stat')?.value||null;if(rewardTransaction(()=>{applied=growthTonic(state,uid,item.id,key);})&&applied){a.refresh?.();showFloor(a,4);}else showTonic(a,item);};
 };
}
const RACE_EVENTS={
 open:{name:'Open Rapids',fee:0,duration:22000,prizes:[1800,1100,600],unlock:0},
 sprint:{name:'Merchants’ Sprint',fee:500,duration:14000,prizes:[3000,1750,850],unlock:1},
 cup:{name:'Waterfall Cup',fee:1500,duration:30000,prizes:[6500,3500,1500],unlock:2},
 championship:{name:'Marasen Championship',fee:4000,duration:38000,prizes:[18000,7500,3000],unlock:4}
};
const WATER_COMPETITORS=[
 {id:'111',name:'Ragegill',speed:158},
 {id:'398',name:'Selkiora',speed:145},
 {id:'145',name:'Lusivolt',speed:165},
 {id:'080',name:'Liontide',speed:120},
 {id:'259',name:'Surfwisp',speed:160},
 {id:'260',name:'Spindrill',speed:172}
];
const sequenceNumber=s=>data(s).rapids.runs+1;
function raceEntrants(s,uid){const live=activeWater(s),unit=live.find(u=>u.uid===uid),seed=sequenceNumber(s);
 const ai=[0,1,2,3].map((_,i)=>WATER_COMPETITORS[(seed+i*2)%WATER_COMPETITORS.length]).map((p,i)=>({id:'ai-'+i,name:p.name,species:p.id,speed:p.speed+(seed*17+i*23)%21-10,isPlayer:false}));
 if(unit)return [{id:unit.uid,name:unit.nickname||unit.species.name,species:unit.species.id,speed:unit.stats?.speed||40,isPlayer:true},...ai.slice(0,3)];
 return ai;
}
export function beginRapids(s,{unitId=null,betLane=0,betPlace=1,stake=0,event='open'}={}){
 const r=data(s).rapids;if(r.race)return false;const competition=RACE_EVENTS[event];if(!competition||r.runs<competition.unlock)return false;const fee=unitId?competition.fee:0;
 if(!Number.isSafeInteger(stake)||stake<0||stake+fee>(s.money||0)||!Number.isInteger(betLane)||betLane<0||betLane>3||![1,2,3].includes(betPlace))return false;
 if(unitId&&!activeWater(s).some(u=>u.uid===unitId))return false;
 const entrants=raceEntrants(s,unitId),seed=r.runs+1;
 s.money-=stake+fee;r.runs++;
 r.race={seed,unitId,entrants,betLane,betPlace,stake,event,fee,startedAt:Date.now(),status:'ready'};return true;
}
function rankRunners(r,perfect,good,miss){const n=Math.max(1,Math.ceil(RACE_EVENTS[r.event||'open'].duration/840));
 const records=r.entrants.map((u,i)=>{
  const skill=u.isPlayer?Math.max(0,Math.min(1,(perfect+.58*good)/n)):.50+((r.seed*19+i*37)%39)/100;
  const speed=Math.max(0,Math.min(1,u.speed/(u.speed+125)));
  return {...u,index:i,score:.6*skill+.4*speed+(i===0?0:(((r.seed+i*3)*11)%7-3)/1000),skill};
 });
 records.sort((a,b)=>b.score-a.score||a.index-b.index);
 return records.map((x,i)=>({...x,place:i+1}));
}
export function finishRapids(s,{perfect=0,good=0,miss=0}={}){const r=data(s).rapids,bet=r.race;if(!bet)return null;
 const results=rankRunners(bet,perfect,good,miss),chosen=results.find(x=>x.index===bet.betLane);
 const paid=chosen.place===bet.betPlace?bet.stake*2:0;
 const own=results.find(x=>x.isPlayer),day=new Date().toISOString().slice(0,10);
 let racePrize=0;const event=bet.event||'open',dailyKey=day+':'+event;if(own&&own.place<=3&&!r.daily.includes(dailyKey)){racePrize=RACE_EVENTS[event].prizes[own.place-1];r.daily.push(dailyKey);if(own.place===1)r.wins++;}
 s.money+=paid+racePrize;
 const record={seed:bet.seed,event,entryFee:bet.fee||0,entrant:bet.entrants[bet.betLane].name,betPlace:bet.betPlace,actualPlace:chosen.place,stake:bet.stake,payout:paid,racePrize,results:results.map(x=>({name:x.name,place:x.place,species:x.species,isPlayer:x.isPlayer}))};
 r.results.push(record);r.results=r.results.slice(-12);r.race=null;return record;
}
function raceMenu(a){const {state,openModal,$,document,rewardTransaction}=a,r=data(state).rapids;
 if(r.race){racePlaying(a);return;}
 const avail=activeWater(state),choices=avail.map(u=>`<option value="${safe(u.uid)}">${safe(u.nickname||u.species.name)} · Speed ${u.stats?.speed||0}</option>`).join('');
 openModal('Marasen Rapids · Race & wager',`<div class="mr-race-intro"><b>THE LIVING WATER CUP</b><p>Race your Water Abyssal, or watch four independent competitors. Tap bubbles near the gold target as they approach; perfect timing gives your racer a boost. Raw Speed also matters.</p></div><label>Choose event<select id="mr-event">${Object.entries(RACE_EVENTS).map(([id,c])=>`<option value="${id}" ${r.runs<c.unlock?'disabled':''}>${c.name} · ${money(c.fee)} entry · ${Math.round(c.duration/1000)}s${r.runs<c.unlock?' · Unlock after '+c.unlock+' races':''}</option>`).join('')}</select></label><label>Your racer<select id="mr-racer"><option value="">Spectate only (no entry fee)</option>${choices}</select></label><div id="mr-runners-preview"></div><label>Back an entrant<select id="mr-bet-lane"></select></label><label>Predicted finish<select id="mr-bet-place"><option value="1">1st place</option><option value="2">2nd place</option><option value="3">3rd place</option></select></label><label>Wager doubloons<input id="mr-wager" type="number" inputmode="numeric" step="1" min="0" max="${Math.max(0,state.money)}" value="0"></label><p class="mr-note">Only in-game doubloons. Correct entrant AND exact predicted place (1st–3rd) pays <b>2× your stake in total</b>; all other predictions lose the stake. Last place cannot be backed. Spectating is free, and wagering is optional.</p><button id="mr-bet-go" class="primary">Enter Rapids race</button><small>Available: ${money(state.money)} doubloons · ${r.runs} races completed</small>`);
 const preview=()=>{const unitId=$('#mr-racer').value,entrants=raceEntrants(state,unitId);$('#mr-bet-lane').innerHTML=entrants.map((x,i)=>`<option value="${i}">${safe(x.name)} · Speed ${Math.round(x.speed)}</option>`).join('');$('#mr-runners-preview').innerHTML=entrants.map((x,i)=>`<div class="mr-preview-runner"><img src="assets/rapids/${safe(x.species)}.webp" alt=""><span>Lane ${i+1}: ${safe(x.name)}</span></div>`).join('');};
 $('#mr-racer').onchange=preview;preview();
 $('#mr-bet-go').onclick=()=>{let started=false;const stake=Number($('#mr-wager').value);if(!Number.isSafeInteger(stake)||stake<0||stake+($('#mr-racer').value?RACE_EVENTS[$('#mr-event').value].fee:0)>state.money){$('#mr-wager').setCustomValidity('Choose a whole-number wager you can afford.');$('#mr-wager').reportValidity();return;}const args={unitId:$('#mr-racer').value||null,betLane:Number($('#mr-bet-lane').value),betPlace:Number($('#mr-bet-place').value),stake,event:$('#mr-event').value};if(rewardTransaction(()=>{started=beginRapids(state,args);})&&started){a.refresh?.();racePlaying(a);}};
}
function racePlaying(a){const {state,openModal,$,document,rewardTransaction}=a,rap=data(state).rapids,bet=rap.race;if(!bet)return raceMenu(a);
 const racers=bet.entrants;
 openModal('Rapids · '+(bet.unitId?'Your race':'Spectator race'),`<div class="mr-race-viewport" id="mr-race-viewport">${racers.map((u,i)=>`<div class="mr-swimlane" data-lane="${i}"><div class="mr-swimtrack"><img class="mr-race-sprite" id="mr-racer-${i}" src="assets/rapids/${safe(u.species)}.webp" alt="${safe(u.name)}"></div><small>${safe(u.name)}${u.isPlayer?' · YOUR ABYSSAL':''}</small></div>`).join('')}</div><div class="mr-rhythm" id="mr-rhythm"><div id="mr-bubble-track"><span class="mr-bubble-target">◎</span><button id="mr-bubble" aria-label="Tap bubble when it reaches the golden target">●</button></div><b id="mr-race-rating">Ready · timing matters!</b></div><p id="mr-race-clock" role="status">${Math.round(RACE_EVENTS[bet.event||'open'].duration/1000)} seconds to the finish</p><p>Wager: ${money(bet.stake)} ⛁ on ${safe(racers[bet.betLane].name)}, ${bet.betPlace}${bet.betPlace===1?'st':bet.betPlace===2?'nd':'rd'} place. Correct pick pays ${money(bet.stake*2)}.</p><button id="mr-race-begin" class="primary">${bet.unitId?'Start race':'Watch race'}</button><p class="mr-note">You can close and resume this race later. Your stake is charged once when you register and will never be charged again.</p>`);
 let timer=null,started=false,perfect=0,good=0,miss=0,bubbleNote=-1,currentNote=-1,cleared=false,startAt=0;
 const duration=RACE_EVENTS[bet.event||'open'].duration,notes=Math.ceil(duration/840),step=duration/notes;
 const tap=()=>{if(!started||cleared||!bet.unitId)return;const now=performance.now(),elapsed=now-startAt,index=Math.round(elapsed/step-.43);if(index<0||index>=notes||index===bubbleNote)return;
  const ideal=(index+.43)*step,error=Math.abs(elapsed-ideal);bubbleNote=index;
  if(error<=135){perfect++;$('#mr-race-rating').textContent='PERFECT! + current';}
  else if(error<=280){good++;$('#mr-race-rating').textContent='GOOD! Hold the current';}
  else {miss++;$('#mr-race-rating').textContent='Too early / late';}
 };
 $('#mr-bubble').onclick=tap;
 const finish=()=>{if(cleared)return;cleared=true;if(timer)clearInterval(timer);let record=null;const ok=rewardTransaction(()=>{record=finishRapids(state,{perfect,good,miss});});if(!ok||!record)return raceMenu(a);a.refresh?.();raceResults(a,record);};
 $('#mr-race-begin').onclick=()=>{if(started)return;started=true;$('#mr-race-begin').disabled=true;$('#mr-race-begin').textContent='Race in progress';startAt=performance.now();let last=-1;
  timer=setInterval(()=>{if(!document.getElementById('mr-race-clock')){clearInterval(timer);return;}const elapsed=performance.now()-startAt,fraction=Math.min(1,elapsed/duration),noteIdx=Math.floor(elapsed/step),phase=elapsed%step/step;
   if(noteIdx!==last&&last>=0&&bet.unitId&&bubbleNote!==last)miss++;last=noteIdx;
   const bubble=$('#mr-bubble');if(bubble){bubble.style.left=(phase*100)+'%';bubble.style.visibility=bet.unitId?'visible':'hidden';}
   for(let i=0;i<racers.length;i++){const u=racers[i],speed=u.speed/(u.speed+125),skill=u.isPlayer?Math.min(1,(perfect+.58*good)/Math.max(1,noteIdx+1)):.50+((bet.seed*19+i*37)%39)/100;const pace=.4*speed+.6*skill;const pos=Math.min(94,fraction*(66+pace*26));const el=$('#mr-racer-'+i);if(el)el.style.left=pos+'%';}
   $('#mr-race-clock').textContent=Math.max(0,Math.ceil((duration-elapsed)/1000))+' seconds to the finish · PERFECT '+perfect+' · GOOD '+good+' · MISSED '+miss;
   if(elapsed>=duration)finish();
  },45);
 };
}
function raceResults(a,record){const {openModal,$,state}=a;
 openModal('Rapids · Finish and settlement',`<div class="mr-race-results"><h3>${safe(RACE_EVENTS[record.event||'open'].name)} — Race ${record.seed}</h3>${record.results.map(u=>`<div class="mr-podium"><b>${u.place}${u.place===1?'st':u.place===2?'nd':u.place===3?'rd':'th'}</b><img src="assets/rapids/${safe(u.species)}.webp" alt=""><span>${safe(u.name)}${u.isPlayer?' · your entrant':''}</span></div>`).join('')}</div><p>You predicted <b>${safe(record.entrant)}</b> in place ${record.betPlace}. It finished <b>${record.actualPlace}</b>.</p><p>Entry fee: ${money(record.entryFee)} · Stake: ${money(record.stake)} · Wager payout: <b>${money(record.payout)}</b> · Daily race prize: <b>${money(record.racePrize)}</b>.</p><p>Current doubloons: <b>${money(state.money)}</b>.</p><button id="mr-race-again" class="primary">Return to race programme</button>`);
 $('#mr-race-again').onclick=()=>raceMenu(a);
}
export function marasenExtraInteract(id,a){const {room,AREA_GATES,state,warp,showDialogue,line,openModal,$}=a;
 const gate=AREA_GATES[room]?.find(g=>g.id===id);
 if(gate?.action==='marasen-directory'){showDialogue([line('Grand Exchange directory','1F Provisions · 2F Technique Library · 3F Relic Gallery · 4F Evolution Atelier · 5F Growth Apothecary · 6F Merchant’s Terrace. Corner staircases connect every floor. Descend to 1F to leave.')]);return true;}
 if(['marasen-ground-landing','marasen-top-landing'].includes(gate?.action)){showDialogue([line('Exchange landing',gate.action==='marasen-ground-landing'?'This is the ground floor. The exit is at the bottom centre of the room.':'This is the top floor. Use the west corner staircase to descend.')]);return true;}
 if(gate?.action==='marasen-city'){void warp(gate.to,...gate.arrival);return true;}
 if(gate?.action==='marasen-main-darius'){
  showDialogue([line('Survey warning','The old path is occupied. Darius’s followers have captured Tellurion and taken control of the spillway. Maryam is evacuating the families below.'),line('Farid’s margin note','A landslide is still a disaster if it happens on someone else’s doorstep. Find the refugee kitchens; the crest is not safe until the lower bell rings.')],()=>void warp(gate.to,...gate.arrival));return true;
 }
 if(gate?.action==='marasen-main-out'){
  if(!(state.defeatedTrainers||[]).includes('TRN-MR-DARIUS')){showDialogue([line('The broken bridle','Darius still holds the reservoir. You cannot reach the city without confronting him.')]);return true;}
  void warp(gate.to,...gate.arrival);return true;
 }
 if(id==='mr-main-warning'||id==='mr-main-watch'||id==='mr-main-camp'||id==='mr-main-bell'){
  const pages={
   'mr-main-warning':['The supply wagon has been stripped of its warning lamps. Fresh bootprints follow the stream to a new armed camp.','Farid’s map names the families below the spillway. Darius’s name has been written across the reservoir crest.'],
   'mr-main-watch':['From the cliff you can see two groups: a convoy of evacuees moving downhill, and soldiers manoeuvring a bound figure near the upper reservoir.','The climbing trail is narrow. The next safe path descends to Maryam’s kitchens before turning towards the broken sluice.'],
   'mr-main-camp':['Maryam’s register records refugees and deserters from both armies. Beside each name is a safe crossing, not a casualty tally.','The kitchens are running out of time. Reopen the quarry overflow before Darius can force the reservoir demonstration.'],
   'mr-main-bell':['The bell ropes lead downstream to houses still inside the flood line. A proper warning must follow repairs to the quarry overflow.','Find Alice at the station. Ringing a bell before clearing the channel gives the families nowhere safe to go.']
  };
  const text=pages[id];showDialogue(text.map(t=>line('Living Water · field record',t)));return true;
 }
 if(id==='mr-exchange-counter'||id==='mr-exchange-clerk'&&room.startsWith('marasenExchange')){
  const floor=Number(room.slice('marasenExchange'.length));showFloor(a,Number.isInteger(floor)&&floor>=0&&floor<6?floor:0);return true;
 }
 if(id==='mr-merchant-guild'){
  const guild=data(state).exchange,done=guild.receipts.includes('guild-compact'),has=(state.bread||0)>=5&&(state.poultices||0)>=3;
  showDialogue([line('Registrar Mariam','Our river brought wealth to the upper terraces, but the crews at the spillway still wait for emergency provisions.'),line('Registrar Mariam',done?'The Five-Bank Accord is filed in your name. Our messengers have carried the supplies to the displaced households.':'The Five-Bank Accord needs five Trail Breads and three Poultices. Donate them and we will pay 4,500 doubloons, plus an Awakening Sigil for your long-term service.'),{...line('Registrar Mariam',done?'You have already earned this commission. The terrace still welcomes your business.':has?'Shall I enter your contribution in the guild record?':'You do not yet have the requested supplies. The lower floors can help.'),choices:[{text:done?'Review the record.':has?'Deliver supplies and sign.':'Return after shopping.',action:()=>{if(done||!has)return;let claimed=false;if(a.rewardTransaction(()=>{const m=data(state).exchange;if(!m.receipts.includes('guild-compact')&&(state.bread||0)>=5&&(state.poultices||0)>=3){state.bread-=5;state.poultices-=3;state.money+=4500;state.awakeningSigils=(state.awakeningSigils||0)+1;m.receipts.push('guild-compact');claimed=true;}})&&claimed){a.refresh?.();a.openModal('The Five-Bank Accord','<p>The guild has filed the document in the public archive. A relief caravan leaves at dawn with your provisions.</p><p>Received <b>4,500 doubloons and one Awakening Sigil</b>.</p>');}}},{text:'Keep the supplies.',action:()=>{}}]}]);return true;
 }
 if(id==='mr-race-marshal'||id==='mr-race-board'){raceMenu(a);return true;}
 if(id==='mr-city-bazaar'||id==='mr-city-archive'||id==='mr-city-headwaters'||id==='mr-brunswick'||id==='mr-water-warden'){
  const talks={
   'mr-city-bazaar':['The Grand Exchange has six floors. Supplies on the ground level, Move Codices, held relics, evolution wares, permanent growth tonics, and the merchant roof terrace.','The eastern canal leads to the Rapids Arena. Here you can enter a Water Abyssal or watch, and stake doubloons on a finishing position.'],
   'mr-city-archive':['Every floodgate in the basin has a written account. The Seven Bridges were built above ordinary homes, not in place of them.','Check the Highwater Citadel to understand who profits from the river.'],
   'mr-city-headwaters':['Those upper arches carry fresh water to a palace perched over the falls. The city was built around the headwaters, not by draining them.','The Civic Fort is inside Highwater Citadel; Khalid’s guards will test you there.'],
   'mr-brunswick':['Water rises through the merchant district, spills below our footbridges, and gathers at the racing rapids. I ferry villagers between all three levels.'],
   'mr-water-warden':['The Highwater Citadel has held through siege and spring floods. Today we must answer for what happened at Darius’s spillway.']
  };
  showDialogue(talks[id].map(t=>line('Marasen citizen',t)));return true;
 }
 if(id==='area-sign'&&room.startsWith('marasen')){
  const map={marasen:'Lower Cascades: exchange, market, archive, east to Rapids, south to bridges, north to the Citadel.',marasenBridges:'Seven Bridges: aqueducts, mills, canals, households, crossing to the Citadel.',marasenRapids:'The Rapids: Water Abyssal races, precise bubble tapping, and optional doubloon wagering.',marasenCitadel:'Highwater Citadel: waterfalls, civic fort, and the city leader.'};
  const floor=Number(room.slice('marasenExchange'.length));const text=room.startsWith('marasenExchange')?'Grand Exchange · '+FLOOR_NAMES[floor]+'. Use the left/down and right/up stairs.':map[room];
  if(text){openModal('Marasen city guide','<p>'+safe(text)+'</p>');return true;}
 }
 return false;
}
