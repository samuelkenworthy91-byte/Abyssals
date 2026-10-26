import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {MIRRORED_FOLLOWER_FRAMES,drawCompanion} from '../dist/companion.js';
globalThis.Image=class{complete=true;naturalWidth=64;naturalHeight=128;};
const species=DATA.species.find(s=>s.id==='185');
function draw(facing,frame){const calls=[],ctx={save(){},restore(){},beginPath(){},ellipse(){},fill(){},translate(...a){calls.push(['translate',...a])},scale(...a){calls.push(['scale',...a])},drawImage(...a){calls.push(['draw',...a.slice(1)])}};drawCompanion(ctx,{unit:{species},px:100,py:100,facing,stride:0,reactionUntil:0,step:{elapsed:frame?.24:0,duration:.32}},0,false);return calls;}
assert.deepEqual(MIRRORED_FOLLOWER_FRAMES['185'],[6]);
for(const direction of ['down','left','up','right'])for(let frame=0;frame<2;frame++){
 const calls=draw(direction,frame),flips=calls.filter(c=>c[0]==='scale');
 assert.equal(flips.length,direction==='right'&&frame===0?1:0,`${direction} frame ${frame}`);
 const rendered=calls.find(c=>c[0]==='draw');assert.equal(rendered[1],frame*32);assert.equal(rendered[2],{down:0,left:32,up:64,right:96}[direction]);
}
assert.deepEqual(Object.fromEntries(Object.entries(MIRRORED_FOLLOWER_FRAMES).filter(([id])=>id!=='185')),{'181':[3],'230':[7],'342':[5]});
console.log('PASS: Waranwei mirrors only its reversed first right-facing frame; all other frames and species corrections are unchanged.');
