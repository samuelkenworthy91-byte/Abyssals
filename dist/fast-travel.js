// Paid caravans open after the first leader; each destination requires a recorded visit.
export const TRAVEL_HUBS=[
 {id:'caravan-cayfen',room:'cayfen',name:'Cayfen',x:24,y:25,arrival:[24,26,'up'],fare:150},
 {id:'caravan-ramelle',room:'ramelle',name:'Ramelle',x:24,y:25,arrival:[24,26,'up'],fare:175},
 {id:"caravan-botrune",room:"botrune",name:"Botrune",x:36,y:24,arrival:[36,25,"up"],fare:125},
 {id:"caravan-marasen",room:"marasen",name:"Marasen",x:32,y:18,arrival:[32,19,"up"],fare:100},
 {id:'caravan-town',room:'town',name:'Civeton',x:26,y:20,arrival:[26,21,'up'],fare:100},
 {id:'caravan-dorelem',room:'dorelem',name:'Dorelem',x:30,y:20,arrival:[30,21,'up'],fare:100},
 {id:'caravan-philomere',room:'philomere',name:'Philomere',x:24,y:20,arrival:[24,21,'up'],fare:100},
 {id:'caravan-cybressa',room:'cybressa',name:'Cybressa',x:24,y:20,arrival:[24,21,'up'],fare:100},
 {id:'caravan-cossenne',room:'cossenne',name:'Cossenne',x:30,y:19,arrival:[30,20,'up'],fare:100},
 {id:'caravan-fort',room:'waranCave1',name:'Sunken Fort',x:6,y:16,arrival:[6,17,'up'],fare:150}
];
export const fastTravelUnlocked=state=>(state.defeatedTrainers||[]).includes('LDR-01')||['SPARED','EXECUTED'].includes(state.fates?.['LDR-01']);
const townForRoom=room=>room?.startsWith('cayfen')?'cayfen':room?.startsWith('ramelle')?'ramelle':room==='botrune'?'botrune':room?.startsWith('marasen')?'marasen':room==='town'||['pate','trade','shop'].includes(room)?'town':room?.startsWith('cossenne')?'cossenne':room?.startsWith('cybressa')?'cybressa':room?.startsWith('dorelem')?'dorelem':room?.startsWith('philomere')||room==='hospice'?'philomere':/^waranCave[1-5]$/.test(room||'')?'waranCave1':null;
export function visitedTravelRooms(state){
 if(Array.isArray(state.travelVisitedRooms))return state.travelVisitedRooms;
 // Older expeditions had no visit ledger. Recover only visits evidenced by progress.
 const rooms=new Set(['town']),defeated=state.defeatedTrainers||[],fates=state.fates||{};
 const leader=n=>defeated.includes('LDR-0'+n)||['SPARED','EXECUTED'].includes(fates['LDR-0'+n]);
 if(leader(1)||state.dorelemClues)rooms.add('dorelem');
 if(leader(2)||state.hospiceQuest?.cityVisited||state.philomereClues)rooms.add('philomere');
 if(leader(4)||state.cossenne?.walk?.length)rooms.add('cossenne');
 if(leader(3)||state.cybressa?.investigation||state.cybressa?.grain||defeated.some(id=>id.startsWith('TRN-CY-WH-')))rooms.add('cybressa');
 if(defeated.some(id=>/^TRN-CAVE-[1-5]$/.test(id))||state.exploration?.huntSeen||state.exploration?.mythic||(state.exploration?.claims||[]).some(id=>id.startsWith('waranCave'))||(state.exploration?.finds||[]).some(id=>id.startsWith('explore-find-cave-')))rooms.add('waranCave1');
 if(leader(7))rooms.add('cayfen');if(leader(8))rooms.add('ramelle');
 const rested=townForRoom(state.lastPriestRest?.room);if(rested)rooms.add(rested);
 if(rooms.has('cybressa'))rooms.add('philomere');if(rooms.has('philomere'))rooms.add('dorelem');
 state.travelVisitedRooms=[...rooms];return state.travelVisitedRooms;
}
export function recordTravelVisit(state,room){
 const visits=visitedTravelRooms(state),hub=townForRoom(room);
 if(hub&&!visits.includes(hub))visits.push(hub);
 // These roads lie beyond towns already crossed in the linear main story.
 const beyondPhilomere=/^(rivercause|cybressa)/.test(room||'');
 const beyondDorelem=beyondPhilomere||/^(northRoad|hospiceRoad|medicinePath|philomere)/.test(room||'')||room==='hospice';
 for(const crossed of [beyondDorelem?'dorelem':null,beyondPhilomere?'philomere':null])if(crossed&&!visits.includes(crossed))visits.push(crossed);
 return hub;
}
export const travelDestinations=(state,from)=>TRAVEL_HUBS.filter(h=>h.room!==from&&visitedTravelRooms(state).includes(h.room));
export function travelQuote(state,from,to){
 const source=TRAVEL_HUBS.find(h=>h.room===from),destination=TRAVEL_HUBS.find(h=>h.room===to);
 const reason=!fastTravelUnlocked(state)?'Defeat the first city leader to open the caravan routes.':!source||!destination?'Travel is available only between caravan hubs.':!visitedTravelRooms(state).includes(to)?'Visit this destination on foot before taking a caravan there.':from===to?'You are already here.':state.wiped||!state.party?.some(u=>u.hp>0&&!u.dead)?'A living expedition is required.':!Number.isSafeInteger(state.money)||state.money<destination.fare?'Not enough doubloons.':null;
 return {ok:!reason,reason,destination,cost:destination?.fare||0};
}
export function payTravelFare(state,from,to){const quote=travelQuote(state,from,to);if(!quote.ok)return false;state.money-=quote.cost;return true;}

// Journal and travel consult the same ledger, including its legacy migration.
export function hasVisitedTown(state,name){const hub=TRAVEL_HUBS.find(h=>h.name.toLowerCase()===String(name).toLowerCase());return !!hub&&visitedTravelRooms(state).includes(hub.room);}
