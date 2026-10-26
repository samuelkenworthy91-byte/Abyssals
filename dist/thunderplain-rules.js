import {DARIUS_STORM_ID} from './thunderplain-data.js?v=0.90.41';
import {typeEffectiveness} from './type-rules.js?v=0.87.0';
export function stormState(s){const q=s.thunderplain??={version:1,relay:{caught:0,attempt:0,claimed:false},darius:{accepted:false,notes:[],released:false,outcome:null}};q.relay??={caught:0,attempt:0,claimed:false};q.darius??={accepted:false,notes:[],released:false,outcome:null};q.relay.clears??=q.relay.claimed?1:0;return q;}
export function acceptStormDarius(s){const q=stormState(s).darius;if(q.accepted)return false;q.accepted=true;return true;}
export function readStormNote(s,id){const q=stormState(s).darius;if(q.notes.includes(id))return false;q.notes.push(id);return true;}
// Persist just the logical signal index, never a wall-clock deadline. Closing/reloading restarts the same safe signal.
export function relaySignal(q){return ((q.attempt*17+q.caught*7+11)^(q.attempt*3))%3;}
export function settleRelaySignal(s,rod,insideWindow){const q=stormState(s).relay;if(q.caught>=5)return false;const ok=insideWindow&&rod===relaySignal(q);q.attempt++;if(ok)q.caught++;return ok;}
export const RELAY_REPEAT_REWARDS=[
 {name:'Repair crew supplies',text:'900 doubloons and two Poultices',money:900,poultices:2},
 {name:'Traveller’s hamper',text:'two Hearty Rations and two Fresh Meat',heartyFood:2,freshMeat:2},
 {name:'Field training pay',text:'1,000 doubloons and one Training Tonic',money:1000,trainingTonics:1},
 {name:'Storm shelter kit',text:'two Poultices and one Smoke Bomb',poultices:2,smoke:1}
];
export function relayReward(s){const n=stormState(s).relay.clears;return n===0?{name:'Beacon restoration cache',text:'2,400 doubloons, three Hearty Rations and one Training Tonic',money:2400,heartyFood:3,trainingTonics:1}:RELAY_REPEAT_REWARDS[(n-1)%RELAY_REPEAT_REWARDS.length];}
export function beginRelayRound(s){const q=stormState(s).relay;if(!q.claimed||q.caught<5)return false;q.caught=0;q.claimed=false;return true;}
export function claimRelay(s){const q=stormState(s).relay;if(q.caught<5||q.claimed)return false;const reward=relayReward(s);q.claimed=true;q.clears++;for(const key of ['money','poultices','heartyFood','freshMeat','trainingTonics','smoke'])s[key]=(s[key]||0)+(reward[key]||0);return true;}

export function recordStormVictory(s,t,enemy){if(t?.id!==DARIUS_STORM_ID)return false;const q=stormState(s).darius;q.defeated=true;if(!q.specimen&&enemy?.species?.id==='173'){q.specimen=structuredClone(enemy);q.specimen.uid='thunderplain-tianzhar';q.specimen.hp=q.specimen.maxHp;q.specimen.dead=false;q.specimen.status=null;q.specimen.stages={};q.specimen.field={};q.specimen.abilityState=null;for(const m of q.specimen.moves)m.left=m.pp;}return true;}
export function canMeetStormDragon(s){const q=stormState(s).darius;return !!q.released&&!q.outcome&&!['party','reserve','dead'].some(k=>(s[k]||[]).some(u=>u.species?.id==='173'));}
export function releaseStormDragon(s){const q=stormState(s).darius;if(!(s.defeatedTrainers||[]).includes(DARIUS_STORM_ID)||q.released)return false;q.released=true;return true;}
export function stormDragonEncounter(s){if(!canMeetStormDragon(s))return null;return {speciesId:'173',level:82,seed:'thunderplain-tianzhar',stormId:'tianzhar',phase:'DAY',tableId:'STORM-UNIQUE-TIANZHAR'};}
export function settleStormDragon(s,outcome){const q=stormState(s).darius;if(!['captured','defeated'].includes(outcome)||!q.released||q.outcome)return false;q.outcome=outcome;return true;}
export const stormBound=(b,e)=>b.trainer?.id===DARIUS_STORM_ID&&e.species.id==='173';
export function stormMedicineAllowed(b,e){return b.trainer?.id!==DARIUS_STORM_ID||e.species.id==='173';}
// All choices use existing legal moves and finite PP. Setup is capped; resisted/immune attacks are avoided where possible.
export function chooseStormMove(b,e,p,pool){if(!b.trainer?.stormAttrition||!pool.length)return null;const effective=pool.filter(m=>m.power&&typeEffectiveness(m.type_id,p.species.types)>0);if(!effective.length)return pool.find(m=>m.power)||pool[0];
 const setup=pool.find(m=>m.id===60);if(setup&&(e.stages.sp_attack||0)<1&&e.hp>e.maxHp*.6)return setup;
 const ward=pool.find(m=>m.id===223);if(ward&&(e.stages.sp_defence||0)<1&&e.hp>e.maxHp*.7)return ward;
 const protection=pool.find(m=>m.id===224);if(protection&&e.hp<e.maxHp*.5&&b.round%4===0)return protection;
 return [...effective].sort((a,c)=>score(c)-score(a))[0];
 function score(m){const attack=m.category==='SPECIAL'?e.stats.sp_attack:e.stats.attack;return m.power*attack*typeEffectiveness(m.type_id,p.species.types)*(e.species.types.includes(m.type_id)?1.5:1)*(m.accuracy==='ALWAYS'?1:(m.accuracy??100)/100);}
}
export function stormSideObjective(s,room){const q=stormState(s);if(room==='stormRelay')return {spot:'bt-relay-control',text:q.relay.claimed?'The relay can be played again for rotating supply rewards, or return south to Glass Scars.':'Catch five safe charges at the lightning relay. Watch the pennants, then route each strike into its matching receiver.'};if(!room.startsWith('stormDarius'))return null;
 if(!q.darius.accepted)return {spot:room==='stormDariusCamp'?'bt-storm-deserter':room+'-back',text:'Speak to the deserter at the Broken Banner Camp, north of Abandoned Watch.'};
 if(room==='stormDariusCamp')return {spot:'stormDariusCamp-forward',text:'Defeat the ridge sentry, then climb the east switchback into Last Banner Ridge and its painted caves.'};
 if(!['TRN-BT-CAVE','TRN-BT-HOLDOUT'].every(t=>(s.defeatedTrainers||[]).includes(t)))return {spot:room==='stormDariusRidge'?(!(s.defeatedTrainers||[]).includes('TRN-BT-CAVE')?'TRN-BT-CAVE':'TRN-BT-HOLDOUT'):room+'-back',text:'Defeat the cave guardian and last-banner holdout on Last Banner Ridge. Read the supply ledger beside the gate.'};
 if(!(s.defeatedTrainers||[]).includes(DARIUS_STORM_ID))return {spot:room==='stormDariusCrown'?DARIUS_STORM_ID:'stormDariusRidge-forward',text:'Darius waits east at the Storm Crown with six partners and Tianzhar. His last three poultices are reserved for the dragon.'};
 return {spot:room==='stormDariusCrown'?'bt-storm-tether':room+'-forward',text:q.darius.outcome?'Tianzhar’s fate is recorded. The return path stays open.':q.darius.released?'The tether is broken. Approach Tianzhar only when prepared.':'Break the copper tether at Storm Crown to free Tianzhar.'};
}
