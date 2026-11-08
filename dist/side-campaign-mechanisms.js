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

const waterBeds=['New cuttings','Deep orchard roots','Nursery runners'];
const irrigation={
 initial:[6,0,0],
 actions:waterBeds.map((name,index)=>({
  label:'Release water from '+name,
  step:board=>{
   if(!board[index])return board;
   const next=[...board];next[index]--;next[(index+1)%3]++;
   return next;
  }
 })),
 inspect:board=>{
  const needs=[1,3,2],solved=board.every((amount,index)=>amount===needs[index]);
  return {solved,lines:board.map((amount,index)=>waterBeds[index]+' · '+amount+' drops · '+(amount===needs[index]?'healthy':amount<needs[index]?'dry':'waterlogged'))};
 }
};
const filterMedia=['Coarse grate','Gravel bed','Reed mat'];
function swap(board,a,b){const next=[...board];[next[a],next[b]]=[next[b],next[a]];return next;}
const filterChain={
 initial:[2,1,0,0],
 actions:[
  {label:'Swap intake and middle trays',step:board=>swap([...board.slice(0,3),0],0,1)},
  {label:'Swap middle and nursery trays',step:board=>swap([...board.slice(0,3),0],1,2)},
  {label:'Test the water',step:board=>[...board.slice(0,3),1]}
 ],
 inspect:([first,middle,last,tested])=>{
  const clean=first===0&&middle===1&&last===2;
  return {solved:!!(tested&&clean),lines:[
   'Intake → '+[first,middle,last].map(n=>filterMedia[n]).join(' → ')+' → nursery',
   !tested?'Water test pending.':clean?'The nursery receives clear water.':first!==0?'Leaves clog the first tray.':'Fine silt reaches the nursery.'
  ]};
 }
};

const chambers=['Walkway','Reef lock','Deep basin'];
function equalise(board,a,b){
 const next=[...board],difference=board[a]-board[b],flow=Math.trunc(difference/2);
 next[a]-=flow;next[b]+=flow;return next;
}
const reefLock={
 initial:[7,0,1],
 actions:[
  {label:'Equalise walkway and reef lock',step:board=>equalise(board,0,1)},
  {label:'Equalise reef lock and deep basin',step:board=>equalise(board,1,2)}
 ],
 inspect:board=>({
  solved:board[0]<=3&&board[1]>=3&&board[2]>=2,
  lines:[...board.map((n,i)=>chambers[i]+' water level '+n),board[0]<=3?'Walkway exposed.':'Walkway submerged.']
 })
};

const stars=['Lantern','Oar','Anchor','Empty channel'];
const lamps=['Cove lantern','Archive lantern','Landing lantern'];
const beams=[[[0],[0,3],[1]],[[1,3],[1],[2,3]],[[0,3],[1,3],[2]]];
const memorial={
 initial:[1,0,0],
 actions:lamps.map((name,index)=>({label:'Turn '+name,step:board=>rotate(board,index,3)})),
 inspect:board=>{
  const light=board.flatMap((value,index)=>beams[index][value]);
  return {solved:stars.every((_,i)=>light.includes(i)===(i!==3)),lines:[
   ...board.map((n,i)=>lamps[i]+' lights '+beams[i][n].map(star=>stars[star]).join(' and ')),
   ...stars.map((name,i)=>name+' · '+(light.includes(i)?'lit':'dark'))
  ]};
 }
};

function evidence(witnesses,events,contradiction,timeline){
 return {
  initial:[-1,-1,-1,-1],
  actions:[
   ...witnesses.map((label,index)=>({label:'Reject '+label,step:board=>[index,...board.slice(1)]})),
   ...events.map((label,index)=>({label:'Place '+label,step:board=>{
    const slot=board.indexOf(-1,1);
    if(slot===-1||board.slice(1).includes(index))return board;
    const next=[...board];next[slot]=index;return next;
   }})),
   {label:'Clear timeline',step:board=>[board[0],-1,-1,-1]}
  ],
  inspect:([rejected,...entries])=>({
   solved:rejected===contradiction&&entries.every((entry,i)=>entry===timeline[i]),
   lines:[
    'Rejected statement: '+(witnesses[rejected]||'none'),
    'Timeline: '+entries.map(entry=>events[entry]||'open slot').join(' → ')
   ]
  })
 };
}

const ballastLoads=['Grain','Medicine','Ballast'];
const masses=[4,2,1];
const cargoManifest=[[],[0],[1],[2],[0,1],[0,2],[1,2]];
const barges={
 initial:[0,0,0,0],
 actions:cargoManifest.map(load=>({
  label:load.length?'Cross with '+load.map(index=>ballastLoads[index]).join(' and '):'Cross empty',
  step:([bank,...cargo])=>{
   const weight=load.reduce((total,index)=>total+masses[index],0);
   if(weight>5||load.some(index=>cargo[index]!==bank)||bank===0&&load.includes(0)&&!load.includes(2))return [bank,...cargo];
   return [1-bank,...cargo.map((side,index)=>load.includes(index)?1-bank:side)];
  }
 })),
 inspect:([bank,...cargo])=>({solved:!!(bank&&cargo.every(Boolean)),lines:[
  'Ferry · '+(bank?'far quay':'staging quay'),
  ...cargo.map((side,index)=>ballastLoads[index]+' · '+(side?'far quay':'staging quay'))
 ]})
};
const echoes=[[0,2,1],[0,2,1,2],[0,2,1,2,0]],bells=['Low triangle','Middle square','High circle'];
const bellEcho={
 initial:[0,0,0],
 actions:[
  ...bells.map((label,index)=>({label:'Ring '+label,step:([round,progress])=>{
   if(round>=echoes.length)return [round,0,0];
   if(echoes[round][progress]!==index)return [round,0,0];
   return progress+1===echoes[round].length?[round+1,0,0]:[round,progress+1,0];
  }})),
  {label:'Show or hide the shore echo',step:([round,progress,show])=>[round,progress,1-show]}
 ],
 inspect:([round,progress,show])=>({
  solved:round===echoes.length,
  lines:round===echoes.length?['All three echoes returned.']:[
   'Echo '+(round+1)+' of 3 · '+progress+' of '+echoes[round].length+' matched',
   show?echoes[round].map(index=>bells[index]).join(' → '):'The shore is quiet. Replay the echo when you need it.'
  ]
 })
};

const groups=['Wounded','Supplies','Rear guard'],trails=['Covered track','Cart track','Ridge'];
const evacuation=panel(groups,groups.map(()=>trails),[2,0,1],([wounded,supplies,guard])=>[
 {pass:wounded===0,text:wounded===0?'Wounded have shelter.':'Wounded are exposed.'},
 {pass:supplies===1,text:supplies===1?'Supplies can travel on the cart track.':'The supplies need a cart track.'},
 {pass:guard===2,text:guard===2?'Rear guard can see both tracks.':'Rear guard cannot cover the retreat.'},
 {pass:new Set([wounded,supplies,guard]).size===3,text:new Set([wounded,supplies,guard]).size===3?'No trail is crowded.':'A trail is over capacity.'}
]);

const pond={rock:5,nest:10,outlet:15};
const vectors=[[0,-1],[1,0],[0,1],[-1,0]];
const netCurrent={
 initial:[0,4],
 actions:['north','east','south','west'].map((name,index)=>({label:'Send the current '+name,step:board=>{
  const [dx,dy]=vectors[index];
  return board.map(cell=>{
   if(cell===pond.outlet)return cell;
   const x=cell%4+dx,y=Math.floor(cell/4)+dy,next=y*4+x;
   if(x<0||x>3||y<0||y>3||[pond.rock,pond.nest].includes(next)||next!==pond.outlet&&board.includes(next))return cell;
   return next;
  });
 }})),
 inspect:board=>({
  solved:board.every(cell=>cell===pond.outlet),
  lines:[
   ...Array.from({length:4},(_,row)=>'Row '+(row+1)+' · '+Array.from({length:4},(_,col)=>{
    const cell=row*4+col;
    if(cell===pond.rock)return 'Rock';
    if(cell===pond.nest)return 'Nest';
    if(cell===pond.outlet)return 'Outlet';
    return board.includes(cell)?'Net':'Water';
   }).join(' | ')),
   'Nets cleared: '+board.filter(cell=>cell===pond.outlet).length+' / 2'
  ]
 })
};

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
 },
 orchardCanopy:{
  ...irrigation,title:'Irrigation beds',
  note:'Cuttings have the shallowest roots. The old orchard roots are deepest. The nursery runners need more than the cuttings and less than the old trees.',
  rules:'Six drops circulate from each bed to the next. A valve moves one drop. Use the condition of each bed to share the water.'
 },
 reedSanctuary:{
  ...filterChain,title:'Three filter trays',
  note:'Leaves clog fine filters. Gravel traps grit and the reed mat catches the fine sediment just before water enters the nursery.',
  rules:'Swap adjacent trays, then test the water to learn which material is out of place.'
 },
 coralGrotto:{
  ...reefLock,title:'Reef pressure lock',
  note:'The walkway emerges when its water drops to three marks or less. The lock needs at least three marks and the deep basin at least two, so both stay flooded while the walkway drains.',
  rules:'Each sluice shares water between its two chambers. An odd drop stays on the fuller side. Look at all three gauges after each change.'
 },
 moonlitDepths:{
  ...memorial,title:'Memorial constellation',
  note:'Three graves carry the marks of the Lantern, the Oar and the Anchor. Light their marks together. Leave the empty channel dark so the names can be reflected in still water.',
  rules:'Each lamp lights one or two marks. Rotating a lamp changes which marks receive light.'
 },
 relicCrags:{
  ...evidence(['Mason','Carrier','Watcher','Scout'],['Cart crossed','Seal fell','Rain began'],2,[0,1,2]),title:'Witnesses and stone traces',
  note:'Mason: I saw the cart cross before the seal came loose. Carrier: I found the fallen seal before it began to rain. Watcher: the cart came through after the rain. Scout: the rain washed across a broken seal. In the stone, cart ruts lie below the fallen seal and rain channels cut across both.',
  rules:'Reject the witness contradicted by the stone. Place the three events from earliest to latest.'
 },
 philomereBackwaters:{
  ...barges,title:'Cargo at the narrows',
  note:'The three barges abandoned grain, medicine and a ballast stone. The small ferry can carry five marks. Grain weighs four, medicine two and ballast one.',
  rules:'The outbound ferry needs the ballast beside the grain to keep that load steady. You may cross empty and load only what is on your quay.'
 },
 smugglersWeir:{
  ...bellEcho,title:'Shore bells',
  note:'The shore watch used three distinct bell marks to answer boats in the fog. The later echoes are longer.',
  rules:'Replay the shore echo and ring the bells in that order. The marks stay on the board until you hide them or ring a bell. A wrong bell restarts only the current echo.'
 },
 saltFlats:{
  ...evidence(['Excise claim','Keeper receipt','Courier docket','Mason receipt'],['Keeper paid','Courier arrived','Mason signed'],0,[0,1,2]),title:'Repair levy ledger',
  note:'The keeper had 12 crowns at dawn and paid 3 at first bell. The courier docket records a delivery at second bell. The mason signed for 4 crowns at third bell. The excise claim lists a further 6 crowns taken before the mason was paid. No other money entered the chest.',
  rules:'Track the balance after each payment. Reject the entry that makes the recorded payments impossible, then order the three supported events.'
 },
 rescueGlade:{
  ...evacuation,title:'Evacuation routes',
  note:'The wounded cannot cross an open ridge. The supply carts fit only on the broad trail. From the ridge the rear guard can watch both other paths.',
  rules:'Choose a trail for each group. Each trail can carry one group at a time. Keep every group within its terrain and cover limits.'
 },
 anglersReach:{
  ...netCurrent,title:'Spawning channel and nets',
  note:'Two nets block the spawning channel. The stone and the protected nest divide the current. The lower outlet has a catch basket.',
  rules:'Each pull sends both loose nets one square in the chosen direction. Nets stop at rocks, the nest, the bank or each other. Guide both to the catch basket.'
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
