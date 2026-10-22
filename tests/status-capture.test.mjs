import assert from 'node:assert/strict';
import {inflictStatus,endAbilities} from '../dist/abilities.js';
import {applyMove} from '../dist/engine.js';
import {damageRange,mechanicsFor} from '../dist/move-details.js';
import {capturePreview,resolveCapture} from '../dist/route-rules.js';
import {randomStatusDuration,statusCaptureMultiplier} from '../dist/status-rules.js';
import {EXCHANGE_STATUS_MOVES} from '../dist/exchange-techniques.js';
import {exchangeScrolls} from '../dist/marasen-activities-ui.js';
import {statusDetails} from '../dist/battle-status.js';
const unit=()=>({uid:'test',species:{id:'test',name:'Test',types:['NORMAL'],capture_rate:120,ability_names:{}},level:40,hp:800,maxHp:800,stats:{hp:800,attack:100,sp_attack:100,defence:100,sp_defence:100,speed:100},moves:[],stages:{},side:'player'});
const move=(category='SPECIAL')=>({id:9999,name:'Test strike',type_id:'NORMAL',category,power:80,accuracy:'ALWAYS',pp:100,left:100,effects:[]});
for(let duration=1;duration<=6;duration++){
 const roll=()=>((duration-1)+.5)/6;
 assert.equal(randomStatusDuration(roll),duration);
 for(const status of ['SLEEP','CONFUSION']){
  let u=unit();inflictStatus(u,status,[],roll);
  const key=status==='SLEEP'?'statusTurns':'confusion';assert.equal(u[key],duration);
  u=JSON.parse(JSON.stringify(u)); // Reload preserves the roll, rather than rerolling.
  const m=move();const target=unit();
  for(let n=0;n<duration;n++){
   const result=applyMove(u,target,m,()=>.5,{floor:0});
   assert.equal(u[key],duration-n-1);
   assert.equal(!!result.skipped,status==='SLEEP');
  }
  assert.ok(applyMove(u,target,m,()=>.5,{floor:0}).damage>0);
 }
}
let u=unit();inflictStatus(u,'CONFUSION',[],()=>0);const self=applyMove(u,unit(),move(),()=>0,{floor:0});assert.equal(self.selfDamage,80);assert.equal(u.confusion,0);
for(const [status,bonus] of Object.entries({SLEEP:3,FREEZE:3,PARALYSIS:2,BURN:1.25,FROSTBITE:1.25,POISON:1.25,BAD_POISON:1.25})){
 const target=unit();target.hp=100;target.status=status;
 assert.equal(statusCaptureMultiplier(target),bonus);
 const expected=Math.floor((3*target.maxHp-2*target.hp)*120*6/(1+(40/20)**2)*bonus/(3*target.maxHp));
 assert.equal(capturePreview(target,6).a,expected);
 assert.deepEqual(resolveCapture(target,()=>0,{foodModifier:6}).chance,capturePreview(target,6).chance);
}
u=unit();u.confusion=6;assert.equal(capturePreview(u).chance,capturePreview(unit()).chance);
u.status='SLEEP';u.species.power_class='Mythical';const legendary=capturePreview(u,6);u.status=null;assert.equal(legendary.a,3*capturePreview(u,6).a);
u.status='FREEZE';assert.equal(capturePreview(u,1e6).chance,1);assert.equal(resolveCapture(u,()=>.9999,{foodModifier:1e6}).success,true);
u.hp=0;assert.equal(capturePreview(u).chance,0);
for(const category of ['PHYSICAL','SPECIAL']){
 for(const status of ['BURN','FROSTBITE']){
  const afflicted=unit();afflicted.status=status;const expected=unit();
  if(status==='FROSTBITE'&&category==='SPECIAL')expected.stats.sp_attack/=2;
  if(status==='BURN'&&category==='PHYSICAL')expected.stats.attack/=2;
  assert.equal(applyMove(afflicted,unit(),move(category),()=>.5,{floor:0}).damage,applyMove(expected,unit(),move(category),()=>.5,{floor:0}).damage);
  assert.deepEqual(damageRange(afflicted,unit(),move(category)),damageRange(expected,unit(),move(category)));
 }
}
u=unit();assert.equal(inflictStatus(u,'FROSTBITE'),true);assert.equal(inflictStatus(u,'SLEEP',[],()=>{throw Error('Must not roll a blocked status');}),false);endAbilities([u],{floor:0});assert.equal(u.hp,700);assert.ok(statusDetails(u).some(s=>/Frostbite: Special Attack/.test(s)&&/1.25/.test(s)));
u.hp=50;endAbilities([u],{floor:0});assert.equal(u.hp,0);
u=unit();u.species.types=['ICE'];assert.equal(inflictStatus(u,'FROSTBITE'),false);
u=unit();inflictStatus(u,'FROSTBITE');inflictStatus(u,'CONFUSION',[],()=>.9999);assert.equal(u.status,'FROSTBITE');assert.equal(u.confusion,6);
// Actual status move consumes the supplied battle RNG for its duration.
for(const status of ['SLEEP','CONFUSION']){const actor=unit(),target=unit(),m={...move('STATUS'),power:null,effects:[{effect_id:'inflict_status',status,chance_percent:100}]};const rolls=[.1,.1,.99999];applyMove(actor,target,m,()=>rolls.shift()??.5);assert.equal(status==='SLEEP'?target.statusTurns:target.confusion,6);}
const lesson=EXCHANGE_STATUS_MOVES.find(m=>m.effects.some(e=>e.status==='FROSTBITE'));assert.ok(lesson);assert.ok(lesson.tutorTypes.includes('WATER'));assert.ok(exchangeScrolls().some(m=>Number(m.id)===lesson.id));assert.ok(JSON.stringify(mechanicsFor(lesson,unit(),unit())).includes('Special Attack'));
console.log('Status combat, duration, immunity, preview, codex and capture checks passed.');
