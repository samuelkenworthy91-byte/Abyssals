import {routeStage} from './route-progression.js?v=0.90.40';
const routeArea=room=>routeStage(room)?.base||room;
export function enterTrainerArea(state,room){const area=routeArea(room);if(state.trainerStandDown?.room!==area)state.trainerStandDown={room:area,ids:[]};return state.trainerStandDown;}
export function trainerStandingDown(state,room,id){return state.trainerStandDown?.room===routeArea(room)&&state.trainerStandDown.ids.includes(id);}
export function standDownTrainer(state,room,id){const record=enterTrainerArea(state,room);if(!record.ids.includes(id))record.ids.push(id);}
