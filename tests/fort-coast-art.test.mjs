import assert from 'node:assert/strict';
import {NEW_MAPS,newWalkable,newBlocked} from '../dist/expansion-world.js';
import {drawFortCoast,drawFortTide} from '../dist/fort-render.js';

const room='scrub2',map=NEW_MAPS[room],walkable=(x,y)=>newWalkable(room,x,y);
const draws=[],pixels=[];
const ctx={save(){},restore(){},translate(){},rotate(){},fillRect(...bounds){pixels.push(bounds);}};
drawFortCoast(ctx,map,walkable,(_,name,x,y,w,h,crop)=>draws.push({name,x,y,w,h,crop}));
assert.equal(draws.length,32*6);
assert(draws.some(draw=>draw.name==='verdantWaterC'));
assert(draws.some(draw=>draw.name==='fortFloor'));
for(const {name,x,y,w,h,crop} of draws){
 assert.equal(name,walkable(x,y)?'fortFloor':'verdantWaterC');
 assert.deepEqual([w,h,crop.w,crop.h],[1,1,16,16]);
}
for(let x=22;x<=39;x++)assert(!newBlocked(room,x,28),'causeway remains open at '+x);
assert(!newBlocked(room,39,26),'fort entrance remains open');
assert(newBlocked(room,46,31),'open water remains outside the walkable area');

function tide(time,reduced){
 pixels.length=0;drawFortTide(ctx,map,walkable,time,reduced);return [...pixels];
}
const still=tide(0,true);
assert(still.length>0);
assert.deepEqual(tide(2000,true),still);
assert.notDeepEqual(tide(2000,false),still);
for(const [x,y,w] of still){
 assert(!walkable(Math.floor(x/16),Math.floor(y/16)));
 assert.equal(Math.floor(x/16),Math.floor((x+w-1)/16),'ripple stays inside its water tile');
}
console.log('PASS: textured depth, unchanged coast and causeway geometry, and bounded tide animation with reduced motion.');
