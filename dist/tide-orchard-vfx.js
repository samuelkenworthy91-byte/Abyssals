import {TIDE_ORCHARD_MOVES,ORCHARD_REACTIONS} from './tide-orchard-data.js?v=0.90.48';
import {ACTION_ART,pixelSceneHTML} from './action-vfx.js?v=0.90.48';
const all=[...TIDE_ORCHARD_MOVES,...Object.values(ORCHARD_REACTIONS)];
export const ORCHARD_SCORES=Object.fromEntries(all.map(m=>{
 const art=ACTION_ART[m.id];if(!art)throw Error('Missing authored pixel animation: '+m.name);
 return [m.id,{...art,individual:true,orchard:true,status:m.category==='STATUS',style:art.key}];
}));
export function orchardSceneHTML(move,result={}){return pixelSceneHTML(move,result);}
