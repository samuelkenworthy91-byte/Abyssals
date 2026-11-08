import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {PHANTOM_FALCHION_ID} from '../dist/dossier-config.js';
import {DATA} from '../dist/data.js';
import {ORCHARD_REACTIONS} from '../dist/tide-orchard-data.js';
import {ACTION_ART,pixelImpactTimes,pixelPlacement} from '../dist/action-vfx.js';
import {effectHTML,effectSpec} from '../dist/effects.js';
const manifest=JSON.parse(fs.readFileSync('art-library/action-vfx/integration-2026-11-04/manifest.json'));
const checks=JSON.parse(fs.readFileSync('art-library/action-vfx/integration-2026-11-04/technical-checks.json'));
const sources=new Map(manifest.sources.filter(s=>s.stage<=checks.stage).map(s=>[s.id,s]));
const moves=[...DATA.moves,...Object.values(ORCHARD_REACTIONS)].filter(m=>m.id!==PHANTOM_FALCHION_ID);
assert.equal(moves.length,615);assert.equal(Object.keys(ACTION_ART).length,moves.length+1);
const cache=fs.readFileSync('dist/offline-assets.js','utf8'),digests=new Set();
for(const [id,s] of sources){
 const a=ACTION_ART[id];for(const cellSize of [192,256])for(const [x,y] of [[20,460],[340,20],[180,240]]){const shift=pixelPlacement({id},{x,y,width:360,height:500,cellSize}),b=a.frameBounds,scale=cellSize/192;assert(x+shift.x+(b[0]-96)*scale>=3.99);assert(y+shift.y+(b[1]-96)*scale>=3.99);assert(x+shift.x+(b[2]-96)*scale<=356.01);assert(y+shift.y+(b[3]-96)*scale<=496.01);}
 assert.equal(a.src,s.art.src);assert.equal(a.sourceId,id);assert(!a.shared);
 const digest=crypto.createHash('sha256').update(fs.readFileSync('dist/'+a.src)).digest('hex');
 assert.equal(digest,s.sha256,'approved content hash '+id);assert(!digests.has(digest),'duplicate source content '+id);digests.add(digest);
 assert(cache.includes(JSON.stringify(a.src)),'offline source '+id);
}
for(const m of moves){
 const a=ACTION_ART[m.id];assert(a,m.name);assert.equal(a.id,m.id);assert(sources.has(a.sourceId));
 const expected=sources.has(m.id)?m.id:sources.has(manifest.partialAssignment[m.id])?manifest.partialAssignment[m.id]:manifest.baselineAssignment[m.id];
 assert.equal(a.sourceId,expected,'intended direct assignment '+m.id);assert.equal(a.src,ACTION_ART[a.sourceId].src);
 if(m.salvation&&ACTION_ART[m.id]?.sourceId!==m.id){assert.equal(effectSpec(m).style,'salvation');continue;}
 assert(effectHTML(m).includes('data-fx-move="'+m.id+'"'),m.name);
 for(const count of [1,2,3,5]){
  const times=pixelImpactTimes(m,{strikes:Array(count).fill({damage:1})},effectSpec(m));
  if(m.id===790&&count>3)continue;
  assert.equal(times.length,count);assert(times.every(Number.isFinite));assert(times.every((x,i)=>x>=0&&x<=effectSpec(m).duration&&(!i||x>=times[i-1])));
 }
}
assert.equal(effectSpec(DATA.moves.find(m=>m.id===470)).pixel,true,'Mercy Edge actually uses its own sheet');assert(effectHTML(DATA.moves.find(m=>m.id===470),{damage:1,remainingHp:1}).includes('1 HP · MERCY'));
assert.equal(manifest.completedOutstandingArtIds.length,58);
assert.equal(manifest.missingUploads.length,0);assert.equal(manifest.recoveredUploads.length,50);assert.equal(manifest.outstandingArtIds.length,0);assert.equal(sources.size,615);assert.equal(manifest.rejectedArenaPilotsInstalled,false);
assert.equal(new Set(moves.map(m=>ACTION_ART[m.id].src)).size,checks.dedicated);
console.log('PASS: stable action inventory, hash-bound direct assignments, unique uploaded sources, offline references, Mercy preservation and finite multi-hit clocks.');
