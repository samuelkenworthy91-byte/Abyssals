export const ESCORT_STEPS=200;
export const PRIEST_RETURNS={cayfen:{room:'cayfen',x:24,y:19,facing:'down',name:'Walter · Cayfen'},cayfenInn:{room:'cayfenInn',x:24,y:18,facing:'up',name:'The Painted Lantern'},ramelle:{room:'ramelle',x:24,y:19,facing:'down',name:'Walter · Ramelle'},ramelleInn:{room:'ramelleInn',x:24,y:18,facing:'up',name:'The Quiet Cloister'},ramelleSanctuary:{room:'ramelleSanctuary',x:24,y:18,facing:'up',name:'Walter · Ramelle sanctuary'},botruneClinic:{room:'botruneClinic',x:24,y:17,facing:'up',name:'Walter · Botrune infirmary'},botrune:{room:"botrune",x:6,y:26,facing:"down",name:"Walter · Botrune"},botruneShelter:{room:"botruneShelter",x:21,y:18,facing:"up",name:"Walter · Roadside Shelter"},marasen:{room:"marasen",x:20,y:26,facing:"up",name:"Walter · Marasen"},cossenne:{room:'cossenne',x:22,y:20,facing:'up',name:'Walter · Cossenne'},cybressa:{room:'cybressa',x:22,y:21,facing:'up',name:'Walter · Cybressa'},town:{room:'town',x:28,y:14,facing:'up',name:'Walter · Civeton'},dorelem:{room:'dorelem',x:28,y:21,facing:'up',name:'Walter · Dorelem'},philomere:{room:'philomere',x:22,y:21,facing:'up',name:'Walter · Philomere'}};
// Each reached Fort floor has a staffed care point on its entrance corridor.
for(let floor=1;floor<=5;floor++){const room='waranCave'+floor;PRIEST_RETURNS[room]={room,x:6,y:17,facing:'up',name:'Sunken Fort healer · Floor '+floor};}
export function rememberPriestRest(state,room){const point=PRIEST_RETURNS[room];if(!point)return false;state.lastPriestRest={...point};return true;}
export function evacDestination(state){return {...(PRIEST_RETURNS[state.lastPriestRest?.room]||PRIEST_RETURNS.town)};}
export function activateEscort(state){if(!(state.armedEscorts>0)||state.escortSteps>0)return false;state.armedEscorts--;state.escortSteps=ESCORT_STEPS;return true;}
// The last covered tile stays protected even though its counter reaches zero.
export function advanceEscortStep(state){if(!(state.escortSteps>0))return false;state.escortSteps=Math.max(0,Math.floor(state.escortSteps)-1);return true;}
export function consumeEvac(state){if(!(state.emergencyEvacs>0))return false;state.emergencyEvacs--;return true;}

