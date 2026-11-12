import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {NEW_MAPS,newBlocked} from '../dist/expansion-world.js';
import {FINALE_ASSETS} from '../dist/finale-art.js';
import {DATA} from '../dist/data.js';
import {PALE_TRAINERS} from '../dist/finale-data.js';
import {handleFinale} from '../dist/finale-ui.js';
import {PALE_ART,PALE_ROOMS,paleState,FERRY_FORKS,ferryWindow,namefogMultiplier} from '../dist/pale-gate.js';
import {PALE_REED_START,paleNotesHTML,turnReedLamp} from '../dist/pale-gate-ui.js';
import {beginAbilities,changeWeather,endAbilities,setTerrain} from '../dist/abilities.js';
import {isHellRegion} from '../dist/branch-families.js';

const state={finale:{mirrorArrivalSeen:true},defeatedTrainers:[]};
const q=paleState(state),gates=Object.fromEntries(PALE_ROOMS.map(id=>[id,NEW_MAPS[id].gates]));
let room='afterlifeThreshold',position,dialogue,dialogueEnd,trainer,wild,screen;
const elements=new Map(),frames=new Map(),style={setProperty(){}};
let tick=0,nextFrame=1;
const element=key=>{
 if(!elements.has(key))elements.set(key,{style,classList:{toggle(){}},textContent:'Wait for the gate',setAttribute(){},focus(){},closest:()=>({addEventListener(){}})});
 return elements.get(key);
};
globalThis.document={hidden:false,hasFocus:()=>true,querySelectorAll:()=>[0,1,2].map(i=>Object.assign(element('lane'+i),{dataset:{pgLane:String(i)}}))};
globalThis.requestAnimationFrame=fn=>{const key=nextFrame++;frames.set(key,fn);return key;};
globalThis.cancelAnimationFrame=key=>frames.delete(key);
let onClose;
const api={
 state,AREA_GATES:gates,line:(speaker,text,portrait)=>({speaker,text,portrait}),
 showDialogue:(lines,onEnd)=>{dialogue=lines;dialogueEnd=onEnd;},warp:(r,...coords)=>{room=r;position=coords;},
 rewardTransaction:fn=>{fn();return true;},buildMarkers(){},
 challengeTrainer:t=>{trainer=t;},startWild:e=>{wild=e;},$:element,
 openModal:(title,html,onEnd)=>{screen={title,html};onClose=onEnd;},
 closeModal:()=>{screen=null;onClose?.();},blip(){}
};
const act=id=>assert(handleFinale(id,{...api,room}),id);
const choice=i=>dialogue[0].choices[i].action();
const advance=ms=>{for(let i=0;i<=ms/50;i++){const now=[...frames];frames.clear();for(const [,fn] of now)fn(tick);tick+=50;}};

act('fn-afterlife');choice(0);assert.equal(room,'paleQuay');
assert.deepEqual(position,[3,19,'right']);
act('pg-relay-east');assert.match(dialogue[0].text,/must open/);
act('pg-guide');assert.match(dialogue[0].text,/Hell/);
act('pg-orchard');assert.equal(room,'paleOrchard');
act('pg-return-name');assert.equal(q.named,false);
for(const clue of ['bell-tag','bowl','roster'])act('pg-'+clue);
act('pg-return-name');choice(0);assert.equal(q.named,false);
act('pg-return-name');choice(1);assert.equal(q.named,true);assert.equal(state.fortifiedRations,2);
assert.match(paleNotesHTML(state,String),/Memorial · Lark/);
act('pg-return-name');assert.equal(state.fortifiedRations,2);
act('pg-orchard-back');act('pg-river');
assert.equal(room,'paleRiver');
act('pg-launch');element('#pg-launch').onclick();
advance(2000);element('#pg-ring').onclick();
assert.match(screen.title,/Back at the landing/);
assert.equal(q.crossed,false);
element('#pg-retry').onclick();element('#pg-slow').onclick();
element('#pg-ferry-pause').onclick();advance(18000);
assert.match(screen.title,/gate 1 of 3/);
element('#pg-ferry-pause').onclick();
for(const f of FERRY_FORKS){
 document.querySelectorAll()[f.correct].onclick();advance(10000);element('#pg-ring').onclick();
}
assert.equal(q.crossed,true);
assert.deepEqual(position,[39,19,'right']);
act('pg-hall');assert.equal(room,'paleRiver');
act('pg-reeds');assert.equal(room,'paleReeds');
act('pg-reed-cache');assert.equal(wild,undefined);
act('pg-reed-note');
assert.equal(turnReedLamp(turnReedLamp(turnReedLamp(PALE_REED_START,0),1),2),7);
for(const name of ['north','middle','south'])act('pg-lamp-'+name);
assert(q.reedSolved);
act('pg-reed-cache');choice(0);assert.equal(wild.speciesId,'364');
act('pg-reeds-back');act('pg-bailiff');
state.defeatedTrainers.push(trainer.id);
act('pg-hall');assert.equal(room,'paleHall');
act('pg-prince');assert.equal(room,'paleHall');
for(const clue of ['file-a','file-b','file-c','receipt'])act('pg-'+clue);
assert.match(paleNotesHTML(state,String),/ferryman stamps the same docket/);
act('pg-audit');choice(2);assert.equal(q.restored,false);
act('pg-audit');choice(0);assert.equal(q.restored,true);
act('pg-prince');assert.equal(room,'palePrince');
act('pg-keeper');assert.match(dialogue[1].text,/closes his ledger/);dialogueEnd();
assert.equal(trainer.nativeField,'NAMEFOG');
assert.deepEqual(trainer.team.map(u=>[u.species_id,u.level]),[['132',105],['098',106],['065',107],['063',108],['064',109],['072',110]]);
assert.deepEqual(trainer.team.filter(u=>u.abilitySlot==='hidden').map(u=>u.slot),[3,6]);
assert.equal(trainer.team.at(-1).ace,true);
act('pg-beyond');assert.match(dialogue[0].text,/holds/);
state.defeatedTrainers.push(trainer.id);
act('pg-beyond');assert.match(dialogue.at(-1).text,/second Circle/);
act('pg-relay-west');choice(0);assert.equal(room,'paleQuay');
act('pg-relay-east');choice(0);assert.equal(room,'palePrince');
assert(ferryWindow(11000,false).open);
assert(ferryWindow(12000,false).expired);
assert.equal(namefogMultiplier({nativeField:'NAMEFOG'},'GHOST'),1.5);
assert.equal(namefogMultiplier({nativeField:'NAMEFOG'},'PSYCHIC'),.5);
assert.equal(namefogMultiplier({nativeField:'NAMEFOG',weather:'HAIL'},'GHOST'),1);
assert.equal(namefogMultiplier({nativeField:'NAMEFOG',terrain:'ELECTRIC'},'GHOST'),1);
const field={nativeField:'NAMEFOG'};
const [ally,enemy]=['132','098'].map((id,i)=>({uid:'field-'+i,species:DATA.species.find(s=>s.id===id),hp:100,maxHp:100,moves:[]}));
beginAbilities(ally,[enemy],[ally],field);
assert.equal(ally.field,enemy.field);
changeWeather('SUN',[ally,enemy],1);
assert.equal(namefogMultiplier(field,'GHOST'),1);
endAbilities([ally,enemy]);
assert.equal(namefogMultiplier(field,'GHOST'),1.5);
changeWeather('RAIN',[ally,enemy],5);
setTerrain('ELECTRIC',[ally,enemy]);assert.equal(field.weather,null);
changeWeather('SUN',[ally,enemy],1);assert.equal(field.terrain,null);
endAbilities([ally,enemy]);assert.equal(namefogMultiplier(field,'PSYCHIC'),.5);
assert(PALE_ROOMS.every(isHellRegion));
assert(!isHellRegion('afterlifeThreshold'));

function reachable(room,start){
 const seen=new Set(),stack=[start];
 while(stack.length){const [x,y]=stack.pop(),key=x+','+y;if(seen.has(key)||newBlocked(room,x,y))continue;seen.add(key);stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}
 return (x,y)=>seen.has(x+','+y);
}
for(const room of PALE_ROOMS){
 const m=NEW_MAPS[room],west=reachable(room,[3,19]),east=room==='paleRiver'?reachable(room,[39,19]):west;
 for(const spot of [...m.spots,...m.gates]){
  const reach=room==='paleRiver'&&spot.x>24?east:west;
  assert([[0,0],[0,1],[1,0],[-1,0],[0,-1]].some(([dx,dy])=>reach(spot.x+dx,spot.y+dy)),room+' '+spot.id);
 }
 if(room==='paleRiver')assert(!west(39,19));
 for(const g of m.gates)assert(!newBlocked(g.to,...g.arrival.slice(0,2)),g.id+' arrival');
}
for(const t of PALE_TRAINERS)for(const unit of t.team){
 assert(DATA.species.some(s=>s.id===unit.species_id));
 assert(unit.current_form_legal_move_ids.length>=4);
 assert(unit.battle_move_ids?.every(id=>unit.current_form_legal_move_ids.includes(id))??true);
}
const self={};
vm.runInNewContext(fs.readFileSync(new URL('../dist/offline-assets.js',import.meta.url),'utf8'),{self});
const inventory=self.ABYSSALS_OFFLINE_ASSETS;
for(const [key,path] of Object.entries(FINALE_ASSETS)){
 if(!key.startsWith('pg-')&&!PALE_ART.some(id=>key==='finale-'+id))continue;
 const relative='assets/'+path.replace('../','');
 assert(inventory.includes(relative),relative);
 assert(fs.statSync(new URL('../dist/'+relative,import.meta.url)).size>0);
}
for(const t of PALE_TRAINERS)assert(inventory.includes('assets/'+t.portraitId+'.webp'));
console.log('PASS: mirror entry, both branches, ferry failure and complete crossing, demon and ledger gates, Prince, Namefog, navigation and offline artwork.');
