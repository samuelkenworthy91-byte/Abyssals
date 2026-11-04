import assert from 'node:assert/strict';
import {createMusicController,MUSIC_TRACKS} from '../dist/music.js';
const players=[];
let reject=false,deferBattle=false,release;
const controller=createMusicController({createAudio(){const a={paused:true,currentTime:0,calls:0,pause(){this.paused=true;},play(){this.calls++;if(reject)return Promise.reject(Error('Autoplay blocked'));this.paused=false;return deferBattle&&this.src===MUSIC_TRACKS.battle?new Promise(resolve=>{release=resolve;}):Promise.resolve();}};players.push(a);return a;}});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const context={active:true,enabled:true};
controller.update({active:false,enabled:true});assert.equal(players.length,0,'title is silent');
controller.update(context);await tick();assert.equal(players[0].src,MUSIC_TRACKS.overworld);assert(players[0].loop);players[0].currentTime=42;
for(let n=0;n<100;n++)controller.update(context);assert.equal(players[0].calls,1,'render ticks do not restart music');
controller.update({...context,battle:true});await tick();assert(players[0].paused);assert.equal(players[1].src,MUSIC_TRACKS.battle);assert(!players[1].paused);players[1].currentTime=10;
controller.update(context);await tick();assert(players[1].paused);assert.equal(players[1].currentTime,0,'next fight starts at beginning');assert.equal(players[0].currentTime,42,'overworld resumes its position');
controller.update({...context,hidden:true});assert(players.every(a=>a.paused));controller.update(context);await tick();assert(!players[0].paused);assert.equal(players[0].currentTime,42);
controller.update({...context,enabled:false});assert(players.every(a=>a.paused));controller.unlock();assert(players.every(a=>a.paused),'input never bypasses mute');
reject=true;controller.update(context);await tick();const attempts=players[0].calls;for(let n=0;n<100;n++)controller.update(context);assert.equal(players[0].calls,attempts,'blocked autoplay does not retry every frame');
reject=false;controller.unlock();await tick();assert(!players[0].paused,'real input retries blocked playback');
controller.stop();assert(players.every(a=>a.paused));
deferBattle=true;controller.update({...context,battle:true});controller.update(context);release();await tick();assert(players[1].paused,'late play resolution cannot overlap the new scene');assert(!players[0].paused);
controller.stop();
console.log('PASS: scene routing, looping, no render restarts, resumed overworld, fresh battles, mute/hidden pause, autoplay recovery and late-play isolation.');

// A hide/show transition can interrupt an unresolved play on the SAME track.
// Its stale AbortError must neither block nor lose the newer resume request.
let abortFirst;
const interruptedAudio={paused:true,calls:0,pause(){this.paused=true;},play(){this.calls++;this.paused=false;return this.calls===1?new Promise((resolve,reject)=>{abortFirst=reject;}):Promise.resolve();}};
const resumed=createMusicController({createAudio:()=>interruptedAudio});
resumed.update(context);resumed.update({...context,hidden:true});resumed.update(context);
assert.equal(interruptedAudio.calls,1,'wait for interrupted play to settle before retrying');
abortFirst(Error('AbortError: play interrupted by pause'));await tick();
assert.equal(interruptedAudio.calls,2,'newer visible request is retried');assert(!interruptedAudio.paused,'same track resumes without another gesture');
resumed.stop();
console.log('PASS: immediate hide/show during pending same-track playback recovers from stale AbortError.');
