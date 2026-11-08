import assert from 'node:assert/strict';
import {NEW_MAPS,newBlocked} from '../dist/expansion-world.js';
import {CROSSING_ROOM,CROSSING_ENTRY,CROSSING_EXIT,CROSSING_SIGN,crossingTile,crossingRoute,crossingSafe,crossingState,recordCrossingStep,revealCrossingHint} from '../dist/invisible-crossing.js?v=0.90.61';

const cardinal=[[0,1],[0,-1],[1,0],[-1,0]];
const distance=([x,y],[a,b])=>Math.abs(x-a)+Math.abs(y-b);
const sign=NEW_MAPS[CROSSING_ROOM].spots.find(s=>s.id===CROSSING_SIGN);
assert(sign?.siteTablet);
assert(!newBlocked(CROSSING_ROOM,...CROSSING_ENTRY));
assert(!newBlocked(CROSSING_ROOM,...CROSSING_EXIT));

function flood(start,blocked){
 const queue=[start],seen=new Set();
 for(const [x,y] of queue){
  if(seen.has(x+','+y)||blocked(x,y))continue;
  seen.add(x+','+y);
  for(const [dx,dy] of cardinal)queue.push([x+dx,y+dy]);
 }
 return seen;
}
const ordinary=flood([3,17],(x,y)=>newBlocked(CROSSING_ROOM,x,y)||crossingTile(CROSSING_ROOM,x,y));
assert(ordinary.has(CROSSING_ENTRY.join(',')));
assert(!ordinary.has(CROSSING_EXIT.join(',')),'the far landing cannot be reached around the grid');
assert(cardinal.some(([dx,dy])=>ordinary.has((sign.x+dx)+','+(sign.y+dy))));

for(const name of ['Aimon','Porter']){
 let state={playerName:name,party:[{hp:29}],dead:[],money:42};
 const q=crossingState(state),route=crossingRoute(q.seed),full=[CROSSING_ENTRY,...route,CROSSING_EXIT];
 assert.equal(new Set(route.map(cell=>cell.join(','))).size,route.length);
 assert(route.every(cell=>crossingTile(CROSSING_ROOM,...cell)&&crossingSafe(state,...cell)));
 assert(full.slice(1).every((cell,i)=>distance(cell,full[i])===1&&!newBlocked(CROSSING_ROOM,...cell)));
 assert(!crossingSafe(state,4,9));
 recordCrossingStep(state,...route[0]);recordCrossingStep(state,...route[0]);
 assert.equal(q.discoveredSafeCells.length,1);
 const seed=q.seed;
 state=JSON.parse(JSON.stringify(state));
 assert.equal(crossingState(state).seed,seed);
 assert(revealCrossingHint(state));
 for(const cell of full.slice(2))recordCrossingStep(state,...cell);
 assert(crossingState(state).solved);
 assert.equal(crossingState(state).discoveredSafeCells.length,route.length);
 assert.deepEqual([state.party,state.dead,state.money],[[{hp:29}],[],42]);
}
console.log('PASS: both deterministic crossing routes, side-path access, no bypass, and discovery and completion across save reload.');
