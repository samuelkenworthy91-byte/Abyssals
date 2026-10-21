import assert from 'node:assert/strict';
import {NEW_MAPS,NEW_DOORS,newBlocked,newSpots,newWalkable} from '../dist/expansion-world.js';
import {EXCHANGE_STAIRS,exchangeProps,exchangeStairSolid} from '../dist/marasen-aquatic.js';
for(const room of ['marasen','marasenBridges','marasenRapids','marasenCitadel']){
 const m=NEW_MAPS[room],entries=newSpots(room).filter(s=>s.door);
 for(const b of m.aquaticBuildings){
  assert(b.door,room+' facade must be enterable');
  const [x,y]=b.door;
  assert.equal(entries.filter(s=>s.x===x&&s.y===y).length,1,room+' exactly one doorway per facade');
  assert(!newBlocked(room,x,y+1),room+' clear doorstep');
 }
 for(const e of entries){
  if(e.street){assert(e.x<=1||e.x>=46||e.y===2||e.y===29,e.id+' must be a screen-edge street');assert(!e.entrance?.asset,e.id+' must not render a portal');}
  else assert(m.aquaticBuildings.some(b=>b.door?.[0]===e.x&&b.door?.[1]===e.y),room+' floating doorway '+e.id);
 }
}
assert.equal(NEW_DOORS.marasenMarket.room,'marasenBridges');
assert(!NEW_DOORS.marasenMarket.hiddenEntrance);
for(let floor=0;floor<6;floor++){
 const room='marasenExchange'+floor;
 assert(exchangeProps(floor).filter(p=>p[0].startsWith('exchange')).length>=5,'stocked independent fixtures');
 for(const s of EXCHANGE_STAIRS){
  for(let y=s.y;y<s.y+s.h;y++)for(let x=s.x;x<s.x+s.w;x++)assert.equal(newWalkable(room,x,y),!exchangeStairSolid(x,y),'stair art and rail collision');
  assert(!newBlocked(room,...s.gate));
  assert(!newBlocked(room,s.gate[0],s.y+s.h),'clear stair approach');
 }
}
console.log('PASS: every city facade has a unique real entrance, all district exits are open-air edge streets, six floors share furniture/rail collision and clear stair approaches');
