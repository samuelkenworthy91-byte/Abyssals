import {SIDE_CONTENT,CAVE_FLOORS} from './exploration-data.js?v=0.90.41';
export function installExplorationWorld(maps){
 for(const c of SIDE_CONTENT){const m=maps[c.room],i=c.index;
  // Alternating detours, loops and clearings give each habitat its own silhouette.
  const upper=i%2?9:12,lower=i%3?24:22;
  m.road=[[1,17],[9,17],[9,upper],[22,upper],[22,lower],[37,lower],[37,17],[46,17]];
  m.grass=[[5,5,19,upper-3],[12,upper+4,19,27],[26,5,41,lower-4],[28,lower+2,42,28]].filter(([a,b,d,e])=>b<=e);
  m.area=c.room;m.explorationTheme=c.theme;m.sidePaths=[{points:[[22,lower],[25,lower],[25,27]]},{points:[[37,lower],[37,12]]}];
  m.spots.push({id:c.id+'-cache',label:'Hidden exploration cache',x:25,y:27},{id:c.id+'-npc',label:c.name,x:36,y:12,sprite:'bystander'});
  m.props.push({asset:c.theme==='relic'?'memorial':c.theme==='embers'?'pipe':c.theme==='orchard'?'tree':'ridge',x:30,y:7,w:4,h:4,decorative:true});
  const key=c.room==='orchardCanopy'?'orchard':c.room==='relicCrags'?'relic':null;
  if(key)for(const [n,x,y]of [[1,9,6],[2,22,20],[3,37,26]]){m.sidePaths.push({points:[[x,17],[x,y]]});m.spots.push({id:`explore-find-${key}-${n}`,label:key==='orchard'?'Heirloom seed packet':'Shellstone inscription',x,y});}
 }
 const parent=maps.scrub2;parent.fortExterior=true;parent.sidePaths.push({gateId:'veilroot-entry',points:[[22,24],[22,28],[39,28],[39,26]]});parent.gates.push({id:'veilroot-entry',label:'Veilroot Bastion · Lv. 12–60',x:39,y:26,to:'waranCave1',arrival:[3,17,'right'],door:true});parent.spots.push({id:'veilroot-sign',label:'Bastion rampart history signs',x:20,y:25});
 for(const f of CAVE_FLOORS){const i=f.index,turn=i%2?10:23;
  maps[f.room]={name:f.name,area:f.room,base:f.room,caveFloor:i,terrain:'fort',bloom:false,explorationTheme:f.theme,road:[[1,17],[10,17],[10,turn],[24,turn],[24,17],[38,17],[46,17]],grass:[[12,12,21,22],[27,10,35,24]],sidePaths:[{points:[[4,17],[4,22]]},{points:[[10,turn],[10,6]]},{points:[[38,17],[38,26]]},{points:[[38,24],[40,24],[40,22]]}],props:[],spots:[...(i?[{id:f.room+'-healer',label:'Fort healer · heal, reserves & nursery',x:6,y:16,sprite:'bystander'}]:[]),{id:f.room+'-lift',label:'Fort lift · return to explored levels',x:40,y:22},{id:'area-sign',label:'Bastion floor plan',x:4,y:22},{id:f.room+'-npc',label:f.npc,x:9,y:7,sprite:'bystander'},{id:f.trainerId,label:f.trainerName,x:36,y:18,sprite:2},{id:f.room+'-cache',label:'Salvaged relic chest',x:38,y:26},{id:i<3?'explore-find-cave-'+(i+1):'veilroot-plaque-'+(i+1),label:'Bastion history plaque',x:24,y:turn},...(i===4?[{id:'veilroot-mythic',label:'Waranwei · Enraged hunter · Lv. 60',x:37,y:17}]:[])],gates:[{id:f.room+'-back',label:i?'Ascend to '+CAVE_FLOORS[i-1].name:'Return to Dorelem Scrub',x:1,y:17,to:i?CAVE_FLOORS[i-1].room:'scrub2',arrival:i?[44,17,'left']:[39,28,'down'],door:true},...(i<4?[{id:f.room+'-down',label:'Descend · Lv. '+CAVE_FLOORS[i+1].min+'–'+CAVE_FLOORS[i+1].max,x:46,y:17,to:CAVE_FLOORS[i+1].room,arrival:[3,17,'right'],action:'cave-descent',door:true}]:[])]};
 }
}
// Map-native pixel scenery uses the same 16px grid as collision and terrain.
export function drawExplorationScenery(c,m,{biome=false,asset=null}={}){if(!m.explorationTheme)return;const theme=m.explorationTheme,cave=m.terrain==='fort',colors={hedgerow:'#b9ad59',burrows:'#c8a374',glass:'#70c8d9',embers:'#f49a56',storm:'#a6c5de',orchard:'#d38b52',reeds:'#9cbb79',coral:'#e1a0a4',moon:'#ad9bd0',relic:'#bbc6bc'},accent=colors[theme]||'#c4b78e';c.save();
 if(cave){
  // Matching the Grand Exchange lift, placed above the eastern chest bay.
  if(asset)asset(c,'exchangeLift',39,19,3,3);
  c.fillStyle='#e6cf8b';c.fillRect(40*16+3,20*16+4,11,8);
  c.fillStyle='#183944';c.font='bold 8px sans-serif';c.textAlign='center';
  c.fillText(String(m.caveFloor+1)+'F',40*16+8,20*16+11);
 }
 else if(!biome){c.fillStyle=accent;c.globalAlpha=.22;for(const [x,y,w,h]of [[5,5,14,4],[28,6,12,5],[28,25,13,3]])c.fillRect(x*16,y*16,w*16,h*16);c.globalAlpha=1;for(let n=0;n<20;n++){const x=5+(n*13+m.spots.length)%37,y=5+(n*7)%22;c.fillStyle=accent;c.fillRect(x*16+5,y*16+9,3,3);if(['orchard','reeds','hedgerow'].includes(theme)){c.fillStyle='#516f45';c.fillRect(x*16+6,y*16+12,1,4);}if(theme==='embers'){c.fillStyle='#6c403c';c.fillRect(x*16+2,y*16+13,9,2);}}}
 for(const s of m.spots){const x=s.x*16,y=s.y*16;if(((s.id.startsWith('explore-find-')&&!s.id.includes('orchard'))||s.id.startsWith('veilroot-plaque-'))){c.fillStyle=s.id.includes('orchard')?'#dcc483':'#74767c';c.fillRect(x+2,y+3,12,12);c.fillStyle=accent;c.fillRect(x+5,y+5,6,2);c.fillRect(x+5,y+9,4,2);}if(s.id==='veilroot-mythic'){c.fillStyle='#637e78';c.fillRect(x-12,y-9,40,28);c.fillStyle='#244d61';c.fillRect(x-6,y-3,28,16);c.fillStyle='#b2a98b';c.fillRect(x-12,y-10,16,4);c.fillRect(x+17,y+15,10,4);}}

 c.restore();}

