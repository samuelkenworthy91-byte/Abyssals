import {RELIC_ITEMS} from './relic-family.js?v=0.87.0';
export const RELIC_RESCUE_OPPONENTS=[{id:'117',level:34,moves:[261,79]},{id:'296',level:34,moves:[296,79]}];
export const RIVET_STANDOFF=[{id:'365',x:27,y:17,size:40},{id:'117',x:33,y:15,size:58},{id:'296',x:33,y:19,size:58}];
export const relicRescueBlocked=(state,room,x,y)=>room==='relicGrove'&&!state.relicQuest?.rescued&&RIVET_STANDOFF.some(a=>a.x===x&&a.y===y);
export const relicRescueNearby=(state,room,player)=>room==='relicGrove'&&!state.relicQuest?.rescued&&RIVET_STANDOFF.some(a=>Math.abs(a.x-player.x)+Math.abs(a.y-player.y)<=1);
export const relicRescueHit=(state,room,x,y)=>room==='relicGrove'&&!state.relicQuest?.rescued&&RIVET_STANDOFF.some(a=>Math.abs(x-a.x)<=1&&y>=a.y-Math.ceil(a.size/16)+1&&y<=a.y);
export const BELL_CORE_PRICE=10000;
export const BELL_GUARDS=[
 {fragment:'relic-bell-1',room:'relicGrove',x:42,y:25,id:'117',level:34,hpMultiplier:1.35},
 {fragment:'relic-bell-2',room:'relicGrove2',x:13,y:7,id:'262',level:36,hpMultiplier:1.45},
 {fragment:'relic-bell-3',room:'relicGrove3',x:41,y:8,id:'352',level:40,hpMultiplier:1.6}
];
export const BELL_SWITCHES=[{id:'relic-switch-0',x:9,y:25},{id:'relic-switch-1',x:25,y:7},{id:'relic-switch-2',x:39,y:25}];
export function relicQuestState(state){
 const q=state.relicQuest??={seen:false,rescued:false,rivetUid:null,bellAccepted:false,fragments:[],bellRestored:false,coreClaimed:null};
 q.fragments??=[];q.guards??=[...q.fragments];q.lanterns??=[false,false,false];
 // Repair pre-v0.55 expeditions that recovered the rim but remained trapped.
 const legacyRim=q.lanternGateVersion!==1&&q.fragments.includes('relic-bell-2');
 q.gateSolved=!!(q.gateSolved||q.bellRestored||q.fragments.includes('relic-bell-3')||legacyRim||(q.lanterns[0]&&!q.lanterns[1]&&!q.lanterns[2]));
 q.lanternGateVersion=1;
 if(q.gateSolved)q.lanterns=[true,false,false];
 return q;
}
export function defeatBellGuard(state,id){const q=relicQuestState(state);if(!q.bellAccepted||!BELL_GUARDS.some(g=>g.fragment===id)||q.guards.includes(id))return false;q.guards.push(id);return true;}
export function turnBellSwitch(state,index){const q=relicQuestState(state);if(!q.bellAccepted||q.gateSolved||!Number.isInteger(index)||index<0||index>2)return false;q.lanterns[index]=!q.lanterns[index];if(index<2)q.lanterns[index+1]=!q.lanterns[index+1];q.gateSolved=q.lanterns[0]&&!q.lanterns[1]&&!q.lanterns[2];return true;}
export function bellGateOpen(state,room){const q=relicQuestState(state);return room==='relicGrove'?q.fragments.includes('relic-bell-1'):room==='relicGrove2'?q.fragments.includes('relic-bell-2')&&q.gateSolved:true;}
export function bellPathBlocked(state,room,x,y){return ['relicGrove','relicGrove2'].includes(room)&&x===44&&y>=6&&y<=10&&!bellGateOpen(state,room);}
export function buyQuestCore(state,itemId){const q=relicQuestState(state),item=RELIC_ITEMS.find(i=>i.id===itemId);if(!q.coreClaimed||!item||!(state.money>=BELL_CORE_PRICE)||(state.evolutionItems?.[itemId]||0)>=99)return false;state.evolutionItems??={};state.money-=BELL_CORE_PRICE;state.evolutionItems[itemId]=(state.evolutionItems[itemId]||0)+1;state.levelEvolutionMigration=true;return true;}

export function collectBellFragment(state,id){const q=relicQuestState(state);if(!q.bellAccepted||q.bellRestored||!['relic-bell-1','relic-bell-2','relic-bell-3'].includes(id)||q.fragments.includes(id)||!q.guards.includes(id))return false;q.fragments.push(id);return true;}
export function restoreRelicBell(state){const q=relicQuestState(state);if(!q.bellAccepted||q.fragments.length!==3||q.bellRestored)return false;q.bellRestored=true;return true;}
export function claimQuestCore(state,itemId){const q=relicQuestState(state);if(!q.bellRestored||q.coreClaimed||!RELIC_ITEMS.some(i=>i.id===itemId))return false;state.evolutionItems??={};if((state.evolutionItems[itemId]||0)>=99)return false;state.evolutionItems[itemId]=(state.evolutionItems[itemId]||0)+1;state.levelEvolutionMigration=true;q.coreClaimed=itemId;return true;}
export function claimRescuedRivet(state,unit){const q=relicQuestState(state);if(q.rescued||unit?.species?.id!=='365'||unit.hp<=0)return false;unit.originalStarter=false;unit.lives=1;(state.party.length<6?state.party:state.reserve).push(unit);q.rescued=true;q.rivetUid=unit.uid;return true;}
export function relicQuestSpots(spots,state){const q=state.relicQuest;return spots.filter(s=>!(s.id.startsWith('relic-bell-')&&q?.fragments?.includes(s.id))&&!(s.id==='relic-stand-off'&&q?.rescued));}
export function relicQuestObjective(state,room){if(!['relicGrove','relicGrove2','relicGrove3'].includes(room))return null;const q=relicQuestState(state);return !q.bellAccepted?{spot:room==='relicGrove'?'relic-bellkeeper':null,text:'Ask Thomas in Briarbell Wood about the bell'}:!q.bellRestored?{spot:q.fragments.length===3&&room==='relicGrove'?'relic-bellkeeper':null,text:`Bell fragments ${q.fragments.length}/3 · guardians Lv. 34–40${room==='relicGrove2'&&!q.gateSolved?' · solve the lantern switches':''}`} :!q.coreClaimed?{spot:room==='relicGrove'?'relic-bellkeeper':null,text:'Return to Thomas and choose your free evolution core'}:null;}
export function installRelicQuestWorld(maps){
 const parent=maps.scrub2;parent.sidePaths.push({gateId:'relic-grove-path',points:[[25,24],[29,24],[29,5]]});parent.gates.push({id:'relic-grove-path',label:'Briarbell Wood · optional Lv. 34 rescue',x:29,y:5,to:'relicGrove',arrival:[3,17,'right'],door:true});parent.spots.push({id:'relic-grove-sign',label:'Briarbell Wood sign',x:27,y:7,routeSign:true});
 const base={terrain:'ridge',bloom:false,biome:'forest',grass:[[15,20,20,27],[27,6,32,13]],props:[]};
 maps.relicGrove={...base,name:'Briarbell Wood · Outer Boughs',area:'RELIC-GROVE',road:[[1,17],[11,17],[11,24],[22,24],[22,17],[36,17],[36,8],[46,8]],sidePaths:[{points:[[11,17],[11,8]]},{points:[[36,17],[42,17],[42,25]]}],props:[{asset:'memorial',x:7,y:7,w:3,h:3,decorative:true}],gates:[{id:'relic-grove-back',label:'Return to Dorelem Scrub',x:1,y:17,to:'scrub2',arrival:[29,7,'down'],door:true},{id:'relic-gate-1',label:'Crown gate · into the Bellroot Walk',x:46,y:8,to:'relicGrove2',arrival:[3,17,'right'],door:true}],spots:[{id:'relic-stand-off',label:'Help Rivet · double battle',x:27,y:17},{id:'relic-bellkeeper',label:'Bellkeeper Thomas de Ferrers',x:10,y:8,sprite:0},{id:'relic-bell-1',label:'Guarded bell crown · Lv. 34 Harpbriar',x:42,y:25},{id:'area-sign',label:'Briarbell Wood noticeboard',x:5,y:18,routeSign:true}]};
 maps.relicGrove2={...base,name:'Briarbell Wood · Bellroot Walk',area:'RELIC-GROVE-2',road:[[1,17],[9,17],[9,25],[20,25],[20,17],[29,17],[29,8],[46,8]],sidePaths:[{points:[[9,17],[13,17],[13,7]]},{points:[[29,8],[25,8],[25,7]]},{points:[[29,17],[39,17],[39,25]]}],gates:[{id:'relic-walk-back',label:'Return to Outer Boughs',x:1,y:17,to:'relicGrove',arrival:[43,8,'left'],door:true},{id:'relic-gate-2',label:'Lantern gate · into the Silent Bellhouse',x:46,y:8,to:'relicGrove3',arrival:[3,17,'right'],door:true}],spots:[{id:'relic-bell-2',label:'Guarded bell rim · Lv. 36 Scullip',x:13,y:7},...BELL_SWITCHES.map((s,i)=>({...s,label:['Crown','Rim','Clapper'][i]+' lantern switch'})),{id:'relic-lantern-clue',label:'Lantern gate inscription',x:32,y:8},{id:'area-sign',label:'Bellroot Walk noticeboard',x:4,y:18,routeSign:true}]};
 maps.relicGrove3={...base,name:'Briarbell Wood · Silent Bellhouse',area:'RELIC-GROVE-3',road:[[1,17],[10,17],[10,8],[21,8],[21,25],[34,25],[34,8],[41,8]],sidePaths:[],props:[{asset:'memorial',x:40,y:4,w:4,h:3,decorative:true}],gates:[{id:'relic-house-back',label:'Return to Bellroot Walk',x:1,y:17,to:'relicGrove2',arrival:[43,8,'left'],door:true}],spots:[{id:'relic-bell-3',label:'Guarded bell clapper · Lv. 40 Obsidianox',x:41,y:8},{id:'area-sign',label:'Silent Bellhouse noticeboard',x:4,y:18,routeSign:true}]};
}
export function relicGroveRoute(room='relicGrove'){const depth=['relicGrove','relicGrove2','relicGrove3'].indexOf(room);return {room,relicExpanded:true,area:{id:'RELIC-GROVE'+(depth?'-'+(depth+1):''),rate:depth?'HIGH':'LOW'},tables:['DAY','NIGHT'].map(phase=>({id:room+'-'+phase,phase,slots:[{species_id:'042',min_level:26+depth*3,max_level:29+depth*3,weight:40,authoredSlot:true},{species_id:'139',min_level:26+depth*3,max_level:29+depth*3,weight:30,authoredSlot:true},{species_id:'295',min_level:26+depth*3,max_level:29+depth*3,weight:30,authoredSlot:true}]}))};}
