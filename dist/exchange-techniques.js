// Ordinary, type-compatible status lessons sold by the Grand Exchange.
const lesson=(id,name,type,status,accuracy,pp,tutorTypes,action)=>({id,name,type_id:type,category:'STATUS',power:null,accuracy,pp,priority:0,target:'SINGLE_FOE',effects:[{effect_id:'inflict_status',status,chance_percent:100}],effect_text:`${status==='BAD_POISON'?'Badly poisons':status==='SLEEP'?'Puts to sleep':status==='FREEZE'?'Freezes':status==='FROSTBITE'?'Inflicts frostbite on':status==='PARALYSIS'?'Paralyses':status==='BURN'?'Burns':'Poisons'} the foe. Accuracy: ${accuracy}%.`,tutorTypes,exchangeLesson:true,authored_visual_action:action,provenance:{authoring:'User-requested department-store status lessons, 21 October 2026'}});
export const EXCHANGE_STATUS_MOVES=[
 lesson(518,'Slumber Mist','PSYCHIC','SLEEP',80,15,['PSYCHIC','FAIRY','GRASS','GHOST','NORMAL'],'Soft violet mist settles around the foe as slow rings fade into sleep.'),
 lesson(519,'Rime Seal','ICE','FREEZE',65,10,['ICE','WATER'],'A pale-blue seal closes around the foe and crystallises into frost.'),
 lesson(520,'Nerve Spark','ELECTRIC','PARALYSIS',90,20,['ELECTRIC','GRASS','BUG','PSYCHIC'],'Fine golden sparks form a brief paralysing net around the foe.'),
 lesson(521,'Venom Mark','POISON','BAD_POISON',90,10,['POISON','BUG','DARK'],'A deep violet venom mark pulses beneath the foe and dissolves into toxic vapour.'),
 lesson(522,'Cinder Hex','FIRE','BURN',85,15,['FIRE','GHOST','DARK'],'A ring of floating embers settles into a small burning sigil around the foe.'),
 lesson(523,'Poison Haze','POISON','POISON',100,20,['POISON','BUG','GRASS'],'Green-purple haze gathers around the foe before drifting away.'),
 lesson(524,'Hoarfrost Hex','ICE','FROSTBITE',85,15,['ICE','WATER','GHOST'],'White frost curls around the foe, dulling its special attacks.')
];
export function installExchangeTechniques(data){for(const m of EXCHANGE_STATUS_MOVES)if(!data.moves.some(x=>x.id===m.id))data.moves.push(m);}
