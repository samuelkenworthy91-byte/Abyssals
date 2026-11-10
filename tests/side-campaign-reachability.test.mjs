import assert from 'node:assert/strict';
import {NEW_MAPS,newBlocked,newSpots} from '../dist/expansion-world.js';
import {
 SIDE_CAMPAIGNS,campaignRoom,campaignState,campaignGuard,campaignGiverSpot,campaignClueId,
 campaignBlocked,campaignGateOpen,campaignClue,campaignPuzzle,campaignChoose,claimCampaign,drawCampaignClue
} from '../dist/side-campaigns.js?v=0.90.62';
import {mechanismPath} from '../dist/side-campaign-mechanisms.js?v=0.90.62';
import {siteTabletHit} from '../dist/site-tablets.js?v=0.90.62';

const cardinal=[[0,1],[0,-1],[1,0],[-1,0]];
const key=(x,y)=>x+','+y;
const neighbours=({x,y})=>cardinal.map(([dx,dy])=>[x+dx,y+dy]);
const near=(spot,seen)=>neighbours(spot).some(([x,y])=>seen.has(key(x,y)));
const blocked=(state,room,x,y)=>newBlocked(room,x,y)||campaignBlocked(state,room,x,y);
const reload=state=>JSON.parse(JSON.stringify(state));

function flood(state,room,arrival){
 const seen=new Set(),queue=[arrival];
 for(const [x,y] of queue){
  if(seen.has(key(x,y))||blocked(state,room,x,y))continue;
  seen.add(key(x,y));
  queue.push(...neighbours({x,y}));
 }
 return seen;
}

function assertClueDrawn(room,spots,clue){
 const translations=[];
 const canvas=new Proxy({}, {get:(_,property)=>property==='translate'?
  (x,y)=>translations.push([x,y]):()=>{}});
 drawCampaignClue(canvas,spots);
 assert(translations.some(([x,y])=>x===clue.x*16+8&&y===clue.y*16+14),room+' clue lectern draw');
}

const rooms=new Set();
for(const c of SIDE_CAMPAIGNS){
 let state={defeatedTrainers:[]};
 const campaign=()=>campaignState(state,c);
 for(let stage=0;stage<3;stage++){
  const room=campaignRoom(c,stage),spots=newSpots(room),map=NEW_MAPS[room];
  assert(map&&!rooms.has(room),room);rooms.add(room);
  const clueId=campaignClueId(c,stage),clues=spots.filter(s=>s.id===clueId);
  assert.equal(clues.length,1,clueId);
  const [clue]=clues;
  assert(clue.questProp&&clue.siteTablet&&clue.label.startsWith('Read '),clueId);
  assert.equal(spots.filter(s=>s.x===clue.x&&s.y===clue.y).length,1,clueId+' collision');
  assert(siteTabletHit(clue,clue.x,clue.y-1)&&siteTabletHit(clue,clue.x,clue.y));
  assert(!siteTabletHit(clue,clue.x,clue.y-2));
  assertClueDrawn(room,spots,clue);
  const arrivals=Object.values(NEW_MAPS).flatMap(m=>m.gates.filter(g=>g.to===room).map(g=>g.arrival));
  assert(arrivals.length,room+' inbound routes');
  for(const arrival of arrivals){
   const seen=flood(state,room,arrival);
   assert(near(clue,seen),clueId+' reachable from '+arrival);
   assert(near(spots.find(s=>s.id===campaignGuard(c,stage)),seen),room+' warden');
   if(!stage)assert(near(spots.find(s=>s.id===campaignGiverSpot(c)),seen),room+' quest giver');
   if(stage===1)for(const spot of spots.filter(s=>s.id.startsWith('sc-'+c.key+'-mechanism-')))assert(near(spot,seen),spot.id);
   if(stage===2)assert(near(spots.find(s=>s.id==='sc-'+c.key+'-resolution'),seen),room+' decision register');
   for(const gate of map.gates){
    if(gate.action==='side-campaign-gate')assert(seen.has(key(43,17)),gate.id+' locked approach');
    else assert(seen.has(key(gate.x,gate.y)),gate.id+' reachable exit');
   }
  }
  if(stage===0){assert(!campaignClue(state,c,stage));campaign().accepted=true;}
  assert(!campaignGateOpen(state,c,stage));
  assert(campaignClue(state,c,stage));
  state=reload(state);
  assert(campaign().clues.includes(stage));
  assert(!campaignClue(state,c,stage));
  assert(!campaignGateOpen(state,c,stage),room+' guard required');
  if(stage===2)assert(!campaignChoose(state,c,'a'));
  state.defeatedTrainers.push(campaignGuard(c,stage));
  if(stage===1){
   assert(!campaignGateOpen(state,c,stage),room+' mechanism required');
   const actions=c.mechanism?mechanismPath(c.mechanism,c.mechanism.initial):c.puzzleKind==='weights'?c.solution.flatMap((n,i)=>Array(n).fill(i)):
    c.puzzleKind==='lanterns'?c.solution.map((v,i)=>c.solution.slice(0,i+1).filter(Boolean).length%2?i:null).filter(i=>i!==null):c.solution;
   for(const action of actions)assert(campaignPuzzle(state,c,action));
   assert(campaign().solved);
  }
  assert(campaignGateOpen(state,c,stage));
  if(stage<2)assert(flood(state,room,[3,17]).has(key(46,17)),room+' open forward gate');
 }
 assert(!claimCampaign(state,c));
 assert(campaignChoose(state,c,'a'));
 assert(!campaignChoose(state,c,'b'));
 assert(claimCampaign(state,c));
 state=reload(state);
 const saved=structuredClone(state);
 assert(!claimCampaign(state,c));
 assert.deepEqual(state,saved);
 assert.equal(state.storyChoices['side_'+c.key],'a');
 assert([0,1,2].every(stage=>campaignGateOpen(state,c,stage)));
}
assert.equal(rooms.size,SIDE_CAMPAIGNS.length*3);
console.log('PASS:',rooms.size,'clue lecterns, live terrain and gates, with',SIDE_CAMPAIGNS.length,'complete model quest and reward flows.');
