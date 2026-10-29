import {MARASEN_RECORDS,MARASEN_BRANCHES,VERDANT_ROAD} from './marasen-data.js?v=0.90.52';
export function marasenState(s){s.marasen??={version:1,walk:[],quests:{},encounters:{},seeds:{},serviceDays:[]};return s.marasen;}
export function questState(s,key){const q=marasenState(s);return q.quests[key]??={accepted:false,records:[],rings:[0,0,0],solved:false,order:[],choice:null,claimed:false};}
export const defeated=(s,id)=>(s.defeatedTrainers||[]).includes(id);
export const marasenUnlocked=s=>['SPARED','EXECUTED'].includes(s.fates?.['LDR-04']);
export const peachUnlocked=s=>['captured','defeated'].includes(s.exploration?.mythic);
export function acceptMarasenQuest(s,key){if(!MARASEN_RECORDS[key]||!marasenUnlocked(s)||key==='peach'&&!peachUnlocked(s))return false;const q=questState(s,key);if(q.accepted)return false;q.accepted=true;if(key==='darius'){s.revolt??={version:1,seen:[],clues:[],goalKnown:false,aid:null};s.revolt.goalKnown=true;s.revolt.doctrine='catastrophic-deterrence';}return true;}
export function readMarasenRecord(s,key,n){const q=questState(s,key);if(!q.accepted||!MARASEN_RECORDS[key]?.[n]||n>0&&!q.records.includes(n-1)||q.records.includes(n))return false;q.records.push(n);return true;}
const targets={mill:[2,4,4],darius:[1,3,0],fort:[3,1,2]};
export function turnMarasenWheel(s,key,index,reset=false){if(!Object.hasOwn(targets,key)||!Number.isInteger(index)||index<0||index>2)return false;const q=questState(s,key);if(key!=='fort'&&(!q.accepted||!q.records.includes(1))||q.solved)return false;if(reset){q.rings=[0,0,0];return true;}q.rings[index]=(q.rings[index]+1)%7;q.rings[(index+1)%3]=(q.rings[(index+1)%3]+2)%7;q.solved=q.rings.every((v,i)=>v===targets[key][i]);return true;}
// Only the final lamp allocation is tested; every handle affects two channels.
export function ringPeachBell(s,bell){const q=questState(s,'peach');if(!q.accepted||!q.records.includes(2)||q.solved||!['healer','shield','caller'].includes(bell))return false;if(q.order.length===6)q.order=[];q.order.push(bell);if(q.order.length===6)q.solved=q.order.every((b,i)=>b===['caller','shield','healer','healer','shield','caller'][i]);return true;}
export function resetPeachBells(s){const q=questState(s,'peach');if(q.solved)return false;q.order=[];return true;}

export function chooseMill(s,choice){const q=questState(s,'mill');if(!q.solved||!q.records.includes(2)||!defeated(s,'TRN-MR-HUGH')||q.choice||!['kitchens','nurseries'].includes(choice))return false;q.choice=choice;if(!q.claimed){s.money=(s.money||0)+3000;if(choice==='kitchens'){s.heartyFood=(s.heartyFood||0)+12;s.poultices=(s.poultices||0)+6;}else{s.trainingTonics=(s.trainingTonics||0)+5;s.lifeEmbers=(s.lifeEmbers||0)+1;}q.claimed=true;}return true;}
export function evacuateValley(s){const q=questState(s,'darius');if(!q.solved||!q.records.includes(2)||!defeated(s,'TRN-MR-ALICE'))return false;if(q.evacuated)return false;q.evacuated=true;s.money=(s.money||0)+2500;s.emergencyEvacs=(s.emergencyEvacs||0)+2;return true;}
export function passageOpen(s,key,stage){const q=questState(s,key);if(!q.accepted)return false;if(stage===0)return q.records.includes(0);if(key==='peach')return stage===1?q.records.includes(1):q.solved&&q.records.includes(2);if(key==='mill')return q.solved&&q.records.includes(1);if(key==='darius')return stage===1?q.solved&&q.records.includes(1)&&defeated(s,'TRN-MR-FARID'):stage===2?q.evacuated:stage===3?defeated(s,'TRN-MR-DARIUS'):true;return false;}
const speciesFor={peach:'184',tellurion:'165'};
export function canMeetMarasen(s,key){if(!speciesFor[key]||marasenState(s).encounters[key])return false;if([...(s.party||[]),...(s.reserve||[]),...(s.dead||[])].some(u=>u.species?.id===speciesFor[key]))return false;return key==='peach'?peachUnlocked(s)&&questState(s,'peach').solved&&questState(s,'peach').records.includes(3):questState(s,'darius').evacuated&&defeated(s,'TRN-MR-DARIUS')&&questState(s,'darius').records.includes(4);}
export function settleMarasenEncounter(s,key,outcome){if(!['captured','defeated'].includes(outcome)||!speciesFor[key]||marasenState(s).encounters[key])return false;marasenState(s).encounters[key]=outcome;return true;}
export function encounterSpec(s,key){if(!canMeetMarasen(s,key))return null;const q=marasenState(s);q.seeds[key]??=(s.playerName||'Aimon')+':marasen-unique:'+key;return {speciesId:speciesFor[key],level:key==='peach'?64:70,seed:q.seeds[key],marasenId:key,phase:'DAY',tableId:'MARASEN-UNIQUE-'+key};}
export function marasenLeaderReady(s){return marasenState(s).walk.length===3&&defeated(s,'TRN-MR-GATE')&&defeated(s,'TRN-MR-INNER')&&questState(s,'fort').solved;}
export function recordMarasenWalk(s,id){if(!['water','levy','letters'].includes(id)||!marasenUnlocked(s))return false;const q=marasenState(s);if(q.walk.includes(id))return false;q.walk.push(id);return true;}
// One progress checklist powers the field objective, journal and blocked passages.
const questRooms=key=>Object.keys(MARASEN_BRANCHES).filter(room=>MARASEN_BRANCHES[room].quest===key);
const at=(room,spot,text)=>({room,spot,text});
export function marasenQuestStep(s,key){
 const q=questState(s,key),rooms=questRooms(key),name=room=>MARASEN_BRANCHES[room].name;
 if(!q.accepted)return at(rooms[0],'mr-'+key+'-keeper','Speak to '+(key==='darius'?'Maryam bint Salim':key==='mill'?'Hugh atte Mill':'the orchard marker')+' at '+name(rooms[0])+' and accept the expedition');
 for(let n=0;n<rooms.length;n++){
  if(!q.records.includes(n))return at(rooms[n],'mr-'+key+'-record-'+n,'Read the stone tablet “'+MARASEN_RECORDS[key][n][0]+'” at '+name(rooms[n]));
  if(n===1&&key!=='peach'){
   if(!q.solved)return at(rooms[n],'mr-'+key+'-control','Restore the '+(key==='darius'?'spillway':'mill')+' with the coupled controls at '+name(rooms[n])+'. Use the two recorded tablet clues in Journal → Recorded site tablets');
   if(key==='darius'&&!defeated(s,'TRN-MR-FARID'))return at(rooms[n],'TRN-MR-FARID','Win Farid ibn Yunus’s crossing challenge at '+name(rooms[n]));
  }
  if(n===2){
   if(key==='darius'){
    if(!defeated(s,'TRN-MR-ALICE'))return at(rooms[n],'TRN-MR-ALICE','Win Alice atte Ford’s crossing challenge at '+name(rooms[n]));
    if(!q.evacuated)return at(rooms[n],'mr-evacuate','Speak to Alice at the evacuation signal beside the east road in '+name(rooms[n])+' to send the last carts');
   }
   if(key==='mill'){
    if(!defeated(s,'TRN-MR-HUGH'))return at(rooms[n],'TRN-MR-HUGH','Win Hugh atte Mill’s milling challenge at '+name(rooms[n]));
    if(!q.claimed)return at(rooms[n],'mr-mill-choice','Sign the flour allocation beside Hugh at '+name(rooms[n]));
   }
   if(key==='peach'&&!q.solved)return at(rooms[n],'mr-peach-bells','Reconstruct the six-stroke oath at the three bells in '+name(rooms[n])+'. The three recorded tablets explain the outward journey and return');
  }
  if(n===3&&key==='darius'&&!defeated(s,'TRN-MR-DARIUS'))return at(rooms[n],'TRN-MR-DARIUS','Challenge Darius beside the bound Tellurion at '+name(rooms[n]));
 }
 if(key==='peach'&&!marasenState(s).encounters.peach)return at(rooms.at(-1),'mr-peach-encounter','Approach Liubeirow at the Quiet Spring for the optional unique encounter');
 if(key==='darius'&&!marasenState(s).encounters.tellurion)return at(rooms.at(-1),'mr-tellurion-encounter','Tellurion is free. Its unique encounter at the Broken Bridle is optional; the east arch leads to Marasen Water Gardens');
 return at(rooms.at(-1),rooms.at(-1)+'-forward',key==='darius'?'Take the east arch to Marasen Water Gardens':'Return through the road arch to the Green Road; this optional expedition is complete');
}
function guideQuest(s,room){
 const key=MARASEN_BRANCHES[room].quest,step=marasenQuestStep(s,key),rooms=questRooms(key),here=rooms.indexOf(room),there=rooms.indexOf(step.room);
 if(here===there)return step;
 const back=there<here,next=rooms[here+(back?-1:1)];
 return {...step,spot:room+(back?'-back':'-forward'),text:(back?'Return west':'Continue east')+' through the arch to '+MARASEN_BRANCHES[next].name+'. Next: '+step.text};
}
export function marasenCivicStep(s){
 const walk=marasenState(s).walk;
 if(!walk.includes('water'))return at('marasen','mr-water','Speak to the Canal households on the north bank, west of the central canal bridge');
 if(!walk.includes('levy'))return at('marasen','mr-levy','Read the Levy clerk’s account on the north bank, east of the central canal bridge');
 if(!walk.includes('letters'))return at('marasen','mr-letters','Collect Trade’s letter from the forwarding box beside the Archive, in northeast Lower Cascades');
 if(!defeated(s,'TRN-MR-GATE'))return at('marasenGate','TRN-MR-GATE','Challenge the canal guard in the Civic Fort · Gate Court');
 if(!questState(s,'fort').solved)return at('marasenGate','mr-fort-control','Solve the household allocation lock at the controls in the Gate Court, using the city’s six-measure account');
 if(!defeated(s,'TRN-MR-INNER'))return at('marasenHall','TRN-MR-INNER','Challenge the reservoir guard in the Assembly Hall, east of the Gate Court');
 return at('marasenHall','mr-leader','Challenge Castellan Khalid ibn Hasan in the east of the Assembly Hall, then decide his fate');
}
export function marasenObjective(s,room){
 if(MARASEN_BRANCHES[room]?.quest)return guideQuest(s,room);
 if(VERDANT_ROAD.some(r=>r[0]===room))return {spot:room+'-forward',text:room==='greenApproach'?'Follow the east road arch to Marasen · Lower Cascades':room==='greenTerrace'?'Take the east arch to Refugee Kitchens. Speak to Maryam to begin the mandatory spillway evacuation; Darius blocks the road to Marasen':'Follow the east road arches towards the Hundred Terraces, then Refugee Kitchens and Marasen. Silent Mill and Peach Orchard are optional north trails'};
 if(!room.startsWith('marasen'))return null;
 if(s.fates?.['LDR-05'])return {spot:room==='marasen'?'marasen-next':null,text:'The city challenge is complete. From Lower Cascades, take the east road arch to the Thunderplain and Botrune'};
 const step=marasenCivicStep(s);
 if(room===step.room)return step;
 const returnCity=step.room==='marasen';
 const links={marasen:returnCity?null:'mr-fort-entry',marasenCitadel:returnCity?'mr-citadel-back':'mr-citadel-fort',marasenBridges:returnCity?'mr-bridges-home':'mr-bridges-citadel',marasenRapids:'mr-rapids-back',marasenGate:returnCity?'marasenGate-back':'marasenGate-forward',marasenHall:'marasenHall-back'};
 const directions={marasen:'Take the northeast street to Highwater Citadel, then enter the large citadel doorway',marasenCitadel:returnCity?'Take the south street to Lower Cascades':'Enter the large citadel doorway to the Gate Court',marasenBridges:returnCity?'Take the north street to Lower Cascades':'Take the east street to Highwater Citadel',marasenRapids:'Take the west waterfront street to Lower Cascades',marasenGate:returnCity?'Return west to Highwater Citadel, then south to Lower Cascades':'Take the east arch to the Assembly Hall',marasenHall:'Return west through the Gate Court'};
 if(room.startsWith('marasenExchange'))return {spot:Number(room.slice(-1))?'mr-exchange-down':'mr-exchange-leave',text:'Use the west stairs down to 1F, then the south exit to Lower Cascades. Next: '+step.text};
 return {spot:links[room]||'room-exit',text:(directions[room]||'Leave this building for Lower Cascades')+'. Next: '+step.text};
}
export function marasenJournal(s,room){
 const objective=marasenObjective(s,room);if(!objective)return null;
 return 'Next: '+objective.text+'. Main road: Cossenne → Green Road → Hundred Terraces → Refugee Kitchens → Spillway Tunnels → Lower Warning → Crown Reservoir → Broken Bridle → Water Gardens → Marasen. '+['darius','mill','peach'].map(key=>(key==='darius'?'Required road expedition':key==='mill'?'Optional Silent Mill':'Optional Peach Orchard')+': '+(key==='peach'&&!peachUnlocked(s)?'Resolve Wei’s encounter on the bottom floor of the Sunken Fort first. Return to Pearlwater Falls and take the north trail':marasenQuestStep(s,key).text)).join('. ')+'.';
}

export function marasenBlocked(s,room,x,y){if(y<16||y>18)return false;if(room==='marasenGate')return x===18&&!defeated(s,'TRN-MR-GATE')||x===34&&!questState(s,'fort').solved;if(room==='marasenHall')return x===30&&!defeated(s,'TRN-MR-INNER');return false;}
