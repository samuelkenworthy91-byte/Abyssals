// The board is the only puzzle state needed to resume an unfinished expedition.
// Reading, guardian, choice and reward flags remain owned by the campaign.
const rotate=(board,index,modulus)=>{
 const next=[...board];
 next[index]=(next[index]+1)%modulus;
 return next;
};
const cycle=(names,options)=>names.map((name,index)=>({
 label:'Turn '+name,
 step:board=>rotate(board,index,options[index].length)
}));
const settings=(names,options,board)=>names.map((name,index)=>name+' '+options[index][board[index]]);
const panel=(names,options,initial,report)=>({
 initial,actions:cycle(names,options),
 inspect:board=>{
  const outcome=report(board);
  return {solved:outcome.every(item=>item.pass),lines:[...settings(names,options,board),...outcome.map(item=>item.text)]};
 }
});

const shelter=panel(
 ['Intake vane','Chimney vane','Hearth'],
 [['towards the hall','towards the nursery'],['towards the nursery','outside'],['out','lit']],
 [0,0,0],([intake,vent,hearth])=>[
  {pass:!!(hearth&&intake),text:'Nursery temperature '+(hearth&&intake?'warm':'cold')},
  {pass:!!(hearth&&vent),text:'Smoke '+(!hearth?'none':vent?'leaving through the chimney':'entering the nursery')}
 ]);
const loads=['Shaft','Burrow','Outlet'];
const lift={
 initial:[3,0,3],
 actions:loads.map((name,index)=>({label:'Pull '+name+' cable',step:board=>{
  const next=rotate(board,index,5);
  return rotate(next,(index+1)%3,5);
 }})),
 inspect:board=>{
  const arms=board.map((weight,index)=>weight*[2,4,1][index]);
  const solved=arms[0]===4&&arms.every(value=>value===arms[0]);
  return {solved,lines:loads.map((name,index)=>name+' load '+board[index]+' · pull '+arms[index]).concat(
   solved?'The carriage is level at the landing.':arms.every(value=>value===arms[0])?'Level, but the carriage misses the landing.':'The carriage tilts towards '+loads[arms.indexOf(Math.max(...arms))]+'.')};
 }
};

const pipes=panel(
 ['Intake elbow','Junction','Filter sleeve','Outlet elbow'],
 [['spring','runoff'],['waste','filter','bypass'],['backwards','forwards'],['cistern','waste']],
 [1,0,0,1],([inlet,branch,filter,outlet])=>{
  const travels=branch===2||branch===1&&filter===1;
  const feeds=outlet===0&&travels;
  const clean=feeds&&inlet===0&&branch===1;
  return [
   {pass:clean,text:'Cistern '+(clean?'filtered spring water':feeds?'cloudy water':'dry')},
   {pass:branch===1&&filter===1,text:'Filter '+(branch!==1?'isolated':filter?'flowing forwards':'blocked by its check valve')}
  ];
 });
const furnace={
 initial:[2,5,0],
 actions:[
  {label:'Open vent',step:([heat,pressure,held])=>forge(heat-1,pressure-2,held)},
  {label:'Work bellows',step:([heat,pressure,held])=>forge(heat+2,pressure+1,held)},
  {label:'Quench the lining',step:([heat,pressure,held])=>forge(heat-2,pressure+1,held)},
  {label:'Hold and watch',step:([heat,pressure,held])=>forge(heat,pressure,held)}
 ],
 inspect:([heat,pressure,held])=>({solved:held===2,lines:[
  'Heat '+heat+' · pressure '+pressure,
  'Safe readings held for '+held+' of 2 turns.'
 ]})
};
function forge(heat,pressure,held){
 heat=Math.min(8,Math.max(0,heat));pressure=Math.min(8,Math.max(0,pressure));
 return [heat,pressure,heat>=4&&heat<=5&&pressure>=2&&pressure<=3?Math.min(2,held+1):0];
}

const beacon=panel(
 ['Watch mirror','Spur mirror','Ridge mirror'],
 [['towards the spur','towards the quarry'],['towards the cove','towards the ridge'],['towards the cliff','towards the convoy']],
 [1,0,0],([watch,spur,ridge])=>[
  {pass:!watch,text:'Watch beam '+(watch?'stopped by the quarry wall':'reaches the spur')},
  {pass:!!spur,text:'Spur beam '+(watch?'unlit':spur?'reaches the ridge':'points into the decoy cove')},
  {pass:!!ridge,text:'Ridge beam '+(watch||!spur?'unlit':ridge?'reaches the safe convoy':'hits the cliff')}
 ]);

export const expeditionMechanisms={
 marchMeadow:{
  ...shelter,title:'Nursery hearth and chimney',
  note:'The watch crew connected its smoke fires to the nursery chimney. Keep the nesting room warm, and give the smoke a way out that avoids the hatchlings.',
  rules:'The intake vane directs heat from the hearth. The chimney vane sends smoke either outdoors or into the nursery.'
 },
 burrowHollow:{
  ...lift,title:'Counterweight carriage',
  note:'The surveyors could raise a loaded carriage without tilting it. Equal pulls keep it level. At the landing, all three cables pull as hard as four marks on the outlet beam.',
  rules:'Each handle advances its load and the next load around the cable. The last cable loops back to the first. Drums wrap after four. Read the pull markings as well as the loads.'
 },
 glassSluice:{
  ...pipes,title:'Cistern inlet and sediment filter',
  note:'Silt settled here before spring water entered the cistern. There are separate inlets for the spring and roadside runoff, and a filter with a one-way valve.',
  rules:'The junction directs water to waste, through the filter or around it. A reversed filter blocks flow. Restore filtered spring water to the cistern.'
 },
 emberQuarry:{
  ...furnace,title:'Forge heat and pressure',
  note:'The forge lining cracked when the chamber was fired under too much pressure. Hold heat at 4–5 and pressure at 2–3 for two consecutive turns.',
  rules:'Vent drops heat by one and pressure by two. Bellows add two heat and one pressure. Quenching drops two heat and adds one pressure. Holding advances one turn with the same settings.'
 },
 stormBluffs:{
  ...beacon,title:'Stormwatch relay mirrors',
  note:'A safe signal used to reach the convoy below the ridge. The quarry wall absorbs light, and the cove signal would draw ships into the wrong channel.',
  rules:'Only the watch mirror is lit at the start of the beam. Each receiving mirror can send the beam onwards or into a dead end.'
 }
};

export function mechanismState(quest,definition){
 if(quest.mechanism?.version!==1)quest.mechanism={version:1,board:[...definition.initial],moves:0,hint:0};
 return quest.mechanism;
}

export function mechanismPath(definition,start){
 const queue=[{board:start,path:[]}],seen=new Set([JSON.stringify(start)]);
 for(const {board,path} of queue){
  if(definition.inspect(board).solved)return path;
  for(const [index,action] of definition.actions.entries()){
   const next=action.step(board),key=JSON.stringify(next);
   if(seen.has(key))continue;
   seen.add(key);queue.push({board:next,path:[...path,index]});
  }
 }
 return null;
}
