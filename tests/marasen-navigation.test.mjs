import assert from 'node:assert/strict';
import {NEW_MAPS,NEW_DOORS,newBlocked,newWalkable,newSpots} from '../dist/expansion-world.js';
import {exchangeProps} from '../dist/marasen-aquatic.js?v=0.89.2';
const rooms=['marasen','marasenBridges','marasenRapids','marasenCitadel',...Array.from({length:6},(_,i)=>'marasenExchange'+i)];
const near=(s,seen)=>[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>seen.has(`${s.x+dx},${s.y+dy}`));
function flood(room,start){const seen=new Set(),q=[start];for(let i=0;i<q.length;i++){const [x,y]=q[i],k=`${x},${y}`;if(seen.has(k)||newBlocked(room,x,y))continue;seen.add(k);q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}return seen;}
let gates=0;
for(const room of rooms){const m=NEW_MAPS[room],seen=flood(room,room.startsWith('marasenExchange')?[24,25]:[3,17]);assert(seen.size>150,room+' must have a connected plaza or broad aisles');
 for(const g of m.gates){assert(seen.has(`${g.x},${g.y}`),room+' gate unreachable '+g.id);if(g.to&&g.arrival){const [x,y]=g.arrival;assert(!newBlocked(g.to,x,y),g.id+' blocked arrival '+g.to+':'+x+','+y);gates++;}}
 for(const s of m.spots)assert(near(s,seen),room+' service unreachable '+s.id);
 for(const d of Object.values(NEW_DOORS).filter(d=>d.room===room)){assert(!newBlocked(room,d.x,d.y+1),room+' unsafe legacy return '+d.name);if(!d.hiddenEntrance)assert(seen.has(`${d.x},${d.y}`),room+' entrance unreachable '+d.name);}
 if(m.aquaticCity)for(let y=2;y<=29;y++)for(let x=2;x<=45;x++)if(m.marasenWater.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d)){const bridge=m.aquaticBridges.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);assert.equal(newWalkable(room,x,y),bridge,room+' visible bridge/collision mismatch');}
 if(Number.isInteger(m.exchangeFloor)){
  for(const [,x,y,w,h]of exchangeProps(m.exchangeFloor))for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)assert(!newWalkable(room,xx,yy),room+' furniture must match collision');
  for(let y=14;y<=27;y++)for(let x=20;x<=29;x++)assert(seen.has(`${x},${y}`),room+' central aisle obstruction');
 }
 const keys=new Set();for(const s of newSpots(room).filter(s=>s.door)){const key=`${s.x},${s.y}`;assert(!keys.has(key),room+' duplicate entry at '+key);keys.add(key);}
}
assert.equal(NEW_MAPS.marasenBridges.aquaticBridges.length,7);
assert(!newSpots('marasen').some(s=>s.id==='marasenMarket'),'old market entrance must not overlap Exchange');
console.log('PASS:',rooms.length,'maps;',gates,'safe gate destinations; furniture, broad aisles, unique entrances and all visible bridge footprints');
