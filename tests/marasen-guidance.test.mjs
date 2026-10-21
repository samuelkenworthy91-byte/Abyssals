import assert from 'node:assert/strict';
import {NEW_MAPS,newBlocked,newSpots} from '../dist/expansion-world.js';
import {MARASEN_BRANCHES,VERDANT_ROAD} from '../dist/marasen-data.js';
import * as r from '../dist/marasen-rules.js';
import {marasenInteract} from '../dist/marasen-ui.js';
import {TRAVEL_HUBS} from '../dist/fast-travel.js';
import {PRIEST_RETURNS} from '../dist/field-items.js';
const fresh=()=>({fates:{'LDR-04':'SPARED'},defeatedTrainers:[],party:[],money:0});
const s=fresh();
function check(room,spot,words){const goal=r.marasenObjective(s,room);assert.equal(goal.spot,spot,goal.text);assert(goal.text.includes(words),goal.text);assert(newSpots(room).some(s=>s.id===goal.spot),room+' objective must exist');return goal.text;}
check('commonDam','commonDam-back','Maryam');
assert(r.acceptMarasenQuest(s,'darius'));check('commonCamp','mr-darius-record-0','A camp without a banner');
r.readMarasenRecord(s,'darius',0);check('commonCamp','commonCamp-forward','Spillway Tunnels');check('commonSpill','mr-darius-record-1','stone tablet');
r.readMarasenRecord(s,'darius',1);check('commonSpill','mr-darius-control','two recorded tablet clues');
r.questState(s,'darius').solved=true;check('commonSpill','TRN-MR-FARID','Farid');assert(!r.passageOpen(s,'darius',1));
s.defeatedTrainers.push('TRN-MR-FARID');assert(r.passageOpen(s,'darius',1));check('commonSpill','commonSpill-forward','Lower Warning');
check('commonDam','mr-darius-record-2','stone tablet');r.readMarasenRecord(s,'darius',2);check('commonDam','TRN-MR-ALICE','Alice');
s.defeatedTrainers.push('TRN-MR-ALICE');check('commonDam','mr-evacuate','send the last carts');assert(!r.passageOpen(s,'darius',2));assert(r.evacuateValley(s));assert(r.passageOpen(s,'darius',2));
r.readMarasenRecord(s,'darius',3);check('commonCrown','TRN-MR-DARIUS','Darius');s.defeatedTrainers.push('TRN-MR-DARIUS');assert(r.passageOpen(s,'darius',3));check('commonBinding','mr-darius-record-4','stone tablet');r.readMarasenRecord(s,'darius',4);check('commonBinding','mr-tellurion-encounter','optional');
check('marasen','mr-water','north bank');r.recordMarasenWalk(s,'water');check('marasen','mr-levy','east of');r.recordMarasenWalk(s,'levy');check('marasen','mr-letters','northeast');r.recordMarasenWalk(s,'letters');check('marasen','mr-fort-entry','northeast street');check('marasenCitadel','mr-citadel-fort','canal guard');check('marasenGate','TRN-MR-GATE','canal guard');
s.defeatedTrainers.push('TRN-MR-GATE');check('marasenGate','mr-fort-control','six-measure');r.questState(s,'fort').solved=true;check('marasenGate','marasenGate-forward','reservoir guard');s.defeatedTrainers.push('TRN-MR-INNER');check('marasenHall','mr-leader','Khalid');
// Gate dialogue must describe missing work even when an older save is deeper than its progress.
let text='';const old=fresh();marasenInteract('commonDam-forward',{state:old,room:'commonDam',AREA_GATES:{commonDam:NEW_MAPS.commonDam.gates},line:(speaker,text)=>({speaker,text}),showDialogue:pages=>text=pages[0].text});assert(text.includes('Return west')&&text.includes('Maryam')&&text.includes('Refugee Kitchens'));
for(const [key,room]of [['mill','millRoots'],['peach','peachOath']]){const z=fresh(),goal=r.marasenObjective(z,room);assert(goal.text.includes('Return west'));assert(newSpots(room).some(s=>s.id===goal.spot));}
function flood(room,start){const seen=new Set(),q=[start];for(let i=0;i<q.length;i++){const [x,y]=q[i],k=x+','+y;if(seen.has(k)||newBlocked(room,x,y))continue;seen.add(k);q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}return seen;}
const rooms=[...VERDANT_ROAD.map(r=>r[0]),...Object.keys(MARASEN_BRANCHES),'marasen','marasenBridges','marasenCitadel','marasenRapids'];
for(const room of rooms){const seen=flood(room,[3,17]);for(const g of NEW_MAPS[room].gates){assert(g.entrance,room+' needs visible entrance '+g.id);assert(seen.has(g.x+','+g.y),room+' unreachable gate '+g.id);if(g.to&&g.arrival)assert(!newBlocked(g.to,...g.arrival.slice(0,2)),g.id+' unsafe arrival');}for(const spot of NEW_MAPS[room].spots)assert([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((spot.x+dx)+','+(spot.y+dy))),room+' unreachable interaction '+spot.id);}
assert(!NEW_MAPS.greenLantern.gates.some(g=>g.to==='commonCamp'),'duplicate Darius access removed');assert(!rooms.some(room=>NEW_MAPS[room].gates.some(g=>g.action==='marasen-shortcut')));
const hub=TRAVEL_HUBS.find(h=>h.room==='marasen'),seen=flood('marasen',[3,17]);assert(seen.has(hub.arrival.slice(0,2).join(',')));assert(!newBlocked('marasen',hub.x,hub.y));assert(seen.has([PRIEST_RETURNS.marasen.x,PRIEST_RETURNS.marasen.y].join(',')));assert(newBlocked('marasen',30,20),'old caravan spawn must be reproduced');
assert(r.marasenJournal(s,'commonDam').includes('Required road expedition'));assert(!r.marasenObjective(s,'greenTerrace').text.includes('side expeditions are optional'));
console.log('PASS: progress-specific required road, civic and old-save directions; all road/district entrance footprints, gate arrivals, services and Marasen travel/rest landings');
