import assert from 'node:assert/strict';
import {selectSoundtrack,explorationCue,TOWN_CUES,MOUNTAIN_ROOMS,SOUNDTRACK} from '../dist/soundtrack.js';
import {NEW_MAPS,NEW_DOORS} from '../dist/expansion-world.js';
const DOORS=NEW_DOORS;
import {finishTrialBeat} from '../dist/botrune-rules.js';
import {TRIAL_BEATS,BOTRUNE_GUARDS} from '../dist/botrune-data.js';
import {finishBurialLine} from '../dist/finale-rules.js';
import {createMusicController,MUSIC_TRACKS} from '../dist/music.js';
const state={fates:{},defeatedTrainers:[]}, context={state,room:'botrune',doors:DOORS,maps:NEW_MAPS};
const cue=(extra={})=>selectSoundtrack({...context,...extra});
assert.equal(cue(),'botrune','entering town alone does not start execution');
state.soundtrack={executionStarted:true};
for(let i=0;i<TRIAL_BEATS.length;i++){assert.equal(cue(),'execution');assert(finishTrialBeat(state,i));assert.equal(cue(),'execution');}
for(const guard of BOTRUNE_GUARDS){assert.equal(cue({battle:{trainer:guard}}),'execution');state.defeatedTrainers.push(guard.id);assert.equal(cue(),'execution');}
assert.equal(cue({room:'botruneLower'}),'execution');
assert.equal(cue({room:'town'}),'overworld','departure suspends story music');
assert.equal(cue(),'execution','return restores gauntlet');
assert.equal(cue({battle:{trainer:{id:'LDR-06'}}}),'battle','actual Fatima battle takes over');
state.soundtrack.executionEnded=true;assert.equal(cue(),'botrune','escape from Fatima never retriggers execution');
const legacy={botrune:{phase:'gauntlet',cursor:9},defeatedTrainers:[]};
assert.equal(cue({state:JSON.parse(JSON.stringify(legacy))}),'execution','legacy gauntlet save');
legacy.fates={'LDR-06':'SPARED'};assert.equal(cue({state:legacy}),'botrune');
for(const [room,expected]of Object.entries(TOWN_CUES))assert.equal(explorationCue(room,{doors:DOORS,maps:NEW_MAPS}),expected,room);
for(const [room,d]of Object.entries(DOORS))if(TOWN_CUES[d.room])assert.equal(explorationCue(room,{doors:DOORS,maps:NEW_MAPS}),TOWN_CUES[d.room],room);
assert.equal(explorationCue('sunBank',{maps:NEW_MAPS}),'journey');assert.equal(explorationCue('sporeRim',{maps:NEW_MAPS}),'dark');assert.equal(explorationCue('march',{maps:NEW_MAPS}),'overworld');assert.equal(explorationCue('march2',{maps:NEW_MAPS}),'overworld');
for(const room of MOUNTAIN_ROOMS){assert.equal(cue({state:{},room}),'descent');assert.equal(cue({state:{},room,battle:{trainer:{id:'TRN-BT-DARIUS'}}}),'descent');assert.equal(cue({state:{},room,battle:{stormId:'tianzhar'}}),'descent');assert.equal(cue({state:{thunderplain:{darius:{outcome:'captured'}}},room}),'dark');}
assert.equal(cue({state:{},room:'stormWatch'}),'dark');
assert.equal(cue({state:{},room:'cossenne',dialogue:{lines:[{portrait:'REV-DARIUS'}]}}),'darius');
assert.equal(cue({state:{},room:'sporeCrown',battle:{finaleDouble:true}}),'battle','final confrontation not assigned early Darius theme');
const funeral={finale:{burialCursor:0,buried:false},soundtrack:{burialActive:true}};
for(let n=0;n<14;n++){assert.equal(cue({state:funeral,room:'burialGrove'}),'burial');assert(finishBurialLine(funeral,n));}
assert.equal(cue({state:funeral,room:'burialGrove'}),'burial','gift aftermath keeps funeral');
funeral.soundtrack.burialActive=false;assert.equal(cue({state:funeral,room:'burialGrove'}),'journey');
assert.equal(cue({state:funeral,room:'burialGrove'}),'journey','later tree visit does not replay');
// Same playback instance through nine beats and three guards, save/restore and fading.
const players=[];const music=createMusicController({createAudio:()=>{const a={currentTime:0,paused:true,volume:0,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};players.push(a);return a;}});
const update=cue=>music.update({cue,active:true,enabled:true});
update('execution');players[0].currentTime=83;for(let i=0;i<20;i++)update('execution');assert.equal(players.length,1);assert.equal(players[0].currentTime,83);
update('overworld');assert(players[0].paused);update('execution');assert.equal(players[0].currentTime,83);
const positions=JSON.parse(JSON.stringify(music.positions()));music.restore(positions);update('execution');assert.equal(players[0].currentTime,83);
update('battle');assert(players[0].paused);music.stop();
const fades=createMusicController({fadeMs:30,createAudio:()=>{const a={currentTime:0,paused:true,volume:.35,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};players.push(a);return a;}});
fades.update({cue:'execution',active:true,enabled:true});fades.update({cue:'battle',active:true,enabled:true});assert(players.filter(a=>!a.paused).length<=1);
await new Promise(r=>setTimeout(r,70));assert.equal(players.filter(a=>!a.paused).length,1);assert(players.find(a=>!a.paused).src.endsWith('BattleTheme1.mp3'));fades.stop();
assert.equal(Object.keys(SOUNDTRACK).length,15);assert(!Object.values(MUSIC_TRACKS).some(p=>p.endsWith('.m4a')));
console.log('PASS: nine towns/interiors, routes, complete execution/guards/Fatima, legacy saves, mountain, Darius, funeral/aftermath, positions and nonoverlapping fade.');
