import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {DATA} from '../dist/data.js';
import {ORCHARD_REACTIONS} from '../dist/tide-orchard-data.js';
import {ACTION_ART,pixelImpactTimes} from '../dist/action-vfx.js';
import {effectHTML,effectSpec} from '../dist/effects.js';
const manifest=JSON.parse(fs.readFileSync('art-library/action-vfx/integration-2026-11-04/manifest.json'));
const checks=JSON.parse(fs.readFileSync('art-library/action-vfx/integration-2026-11-04/technical-checks.json'));
const sources=new Map(manifest.sources.filter(s=>s.stage<=checks.stage).map(s=>[s.id,s]));
const moves=[...DATA.moves,...Object.values(ORCHARD_REACTIONS)];
assert.equal(moves.length,615);assert.equal(Object.keys(ACTION_ART).length,moves.length);
const cache=fs.readFileSync('dist/offline-assets.js','utf8'),digests=new Set();
for(const [id,s] of sources){
 const a=ACTION_ART[id];assert.equal(a.src,s.art.src);assert.equal(a.sourceId,id);assert(!a.shared);
 const digest=crypto.createHash('sha256').update(fs.readFileSync('dist/'+a.src)).digest('hex');
 assert.equal(digest,s.sha256,'approved content hash '+id);assert(!digests.has(digest),'duplicate source content '+id);digests.add(digest);
 assert(cache.includes(JSON.stringify(a.src)),'offline source '+id);
}
for(const m of moves){
 const a=ACTION_ART[m.id];assert(a,m.name);assert.equal(a.id,m.id);assert(sources.has(a.sourceId));
 const expected=sources.has(m.id)?m.id:sources.has(manifest.partialAssignment[m.id])?manifest.partialAssignment[m.id]:manifest.baselineAssignment[m.id];
 assert.equal(a.sourceId,expected,'intended direct assignment '+m.id);assert.equal(a.src,ACTION_ART[a.sourceId].src);
 if(m.salvation&&m.id!==710){assert.equal(effectSpec(m).style,'salvation');continue;}
 assert(effectHTML(m).includes('data-fx-move="'+m.id+'"'),m.name);
 for(const count of [1,2,3,5]){
  const times=pixelImpactTimes(m,{strikes:Array(count).fill({damage:1})},effectSpec(m));
  if(m.id===790&&count>3)continue;
  assert.equal(times.length,count);assert(times.every(Number.isFinite));assert(times.every((x,i)=>x>=0&&x<=effectSpec(m).duration&&(!i||x>=times[i-1])));
 }
}
assert.equal(manifest.missingUploads.length,50);assert.equal(manifest.rejectedArenaPilotsInstalled,false);
assert.equal(new Set(Object.values(ACTION_ART).map(a=>a.src)).size,checks.dedicated);
console.log('PASS: stable action inventory, hash-bound direct assignments, unique uploaded sources, offline references, Mercy preservation and finite multi-hit clocks.');
