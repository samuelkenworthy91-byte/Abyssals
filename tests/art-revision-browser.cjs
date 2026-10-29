const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const data=fs.readFileSync('dist/action-vfx-data.js','utf8'),prefix='export const ACTION_ART=';
const art=JSON.parse(data.slice(data.indexOf(prefix)+prefix.length).trim().replace(/;$/,''));
const ids=Object.values(art).filter(a=>a.batch&&(!process.env.ART_BATCH||a.batch===process.env.ART_BATCH)).map(a=>a.id);
const fixture=String.raw`
const artPrepare=(u,m,player=false)=>{u.species={...u.species,types:['NORMAL'],ability_names:{primary:'Plain'}};u.hp=u.maxHp=5000;u.stats={hp:5000,attack:50,sp_attack:50,defence:150,sp_defence:150,speed:player?200:50};u.stages={};u.status=null;u.heldItem=null;u.moves=[{...m,left:m.pp}];};
const artEquip=id=>{const p=battle.player,m=moveId(id);artPrepare(p,m,true);if([11,97,352,353].includes(id))p.hp=2000;if(id===352)p.status='POISON';if(m.allyTarget)p.teamcraftTargetUid=p.uid;const fixed=()=>.1;fixed.state=()=>123;battle.random=fixed;renderBattle();return {id,power:m.power,target:m.target,allyTarget:m.allyTarget,player:p.uid,foes:battle.enemies.slice(0,2).map(u=>u.uid)};};
window.__artQA={
 boot(id,leader=null,motion='full'){
  window.__fnQA.boot('cayfen');setMotionPreference(motion);const p=lead(),t=leader?openingTrainer(EXPANSION.trainers.find(t=>t.id===leader),state):null;
  const enemies=(t?t.team:[{species_id:'010',level:100,slot:1}]).map(s=>{const u=instance(byId(s.species_id),s.level,[moveId(1)]);u.uid='art-foe-'+s.slot;artPrepare(u,moveId(1));return u;});
  battle={kind:'wild',trainer:t,total:enemies.length,index:0,random:rng(123),player:p,enemies,round:1,encounterPhase:'DAY',history:[],participants:[p.uid],defeats:[],busy:false,finished:false,phase:'ready',artReady:true,log:'Artwork gameplay verification.'};
  artEquip(id);initializeBattleAbilities(battle);closeDialogue();closeModal();showBattleSurface();renderBattle();return artEquip(id);
 },
 doubleStart(){window.__fnQA.boot('sporeCrown');startFinaleDouble();},
 doubleEquip(id){for(const u of [battle.alliedRivet,...battle.enemies])artPrepare(u,moveId(1));return artEquip(id);},
 async turn(index=null){const p=battle.player,before={player:p.hp,foes:battle.enemies.slice(0,2).map(u=>u.hp)};if(index===null)await wildTurn({move:0,teamcraftChosen:true});else await relicDoubleTurn({move:0,targetIndex:index,teamcraftChosen:true});return {before,after:{player:p.hp,foes:battle.enemies.slice(0,2).map(u=>u.hp)},stages:p.stages,status:p.status,round:battle.round,busy:battle.busy,fx:document.querySelector('#fx').textContent,enabled:!!document.querySelector('#battle button:not(:disabled)')};}
};`;
function verify(id,r,target=0){
 assert.equal(r.round,2);assert.equal(r.busy,false);assert(r.enabled);assert.equal(r.fx,'');
 if([11,97,352].includes(id)){assert(r.after.player>r.before.player);assert.deepEqual(r.after.foes,r.before.foes);}
 else if([1,10,12].includes(id)){assert.deepEqual(r.after.foes,r.before.foes);assert(r.stages[id===1?'defence':id===10?'accuracy':'speed']>0);}
 else {assert(r.after.foes[target]<r.before.foes[target],'damage for '+id);if(r.before.foes.length>1)assert.equal(r.after.foes[1-target],r.before.foes[1-target]);}
 if(id===352)assert.equal(r.status,null);
 if(id===353)assert(r.after.player>r.before.player,'selected ally healed by Concord Pact');
 if(id===17)assert(r.after.player<r.before.player,'actual recoil');
 if(id===15)assert(r.stages.speed<0,'actual commitment cost');
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+'\n'+fs.readFileSync('tests/finale-fixture.js','utf8')+'\n'+fixture});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__artQA);
 const dir='build/qa/action-review';fs.mkdirSync(dir,{recursive:true});
 async function capture(id,name){
  const fx=page.locator('[data-fx-move="'+id+'"]');await fx.waitFor({state:'attached'});
  await fx.locator('.pixel-move-art').evaluate((el,impact)=>{const a=el.getAnimations()[0];if(a){a.pause();a.currentTime=Number(a.effect.getTiming().duration)*impact;}},art[id].impact);
  const placement=await fx.locator('..').evaluate(el=>{const uid=el.dataset.fxTarget,card=document.getElementById('double-unit-'+uid);if(!card)return null;const target=card.querySelector('img')||card,r=target.getBoundingClientRect(),v=document.getElementById('viewport').getBoundingClientRect();return {uid,delta:[parseFloat(el.style.left)-(r.left+r.width/2-v.left),parseFloat(el.style.top)-(r.top+r.height/2-v.top)]};});await page.screenshot({path:dir+'/'+name+'.png'});return placement;
 }
 for(const leader of [null,...Array.from({length:8},(_,i)=>'LDR-0'+(i+1))])for(const id of (leader?[59,98,352]:ids)){
  await page.evaluate(({id,leader})=>window.__artQA.boot(id,leader),{id,leader});
  const turn=page.evaluate(()=>window.__artQA.turn());await capture(id,(leader||'single')+'-'+id);verify(id,await turn);
 }
 for(const id of ids)for(const targetIndex of [0,1]){
  await page.evaluate(()=>window.__artQA.doubleStart());await page.waitForSelector('[data-double-menu="fight"]:not([disabled])');
  const m=await page.evaluate(id=>window.__artQA.doubleEquip(id),id),turn=page.evaluate(index=>window.__artQA.turn(index),targetIndex);
  const placement=await capture(id,'double-'+targetIndex+'-'+id),uid=m.target==='SELF'||m.target==='ACTIVE_SIDE'||m.allyTarget&&!m.power?m.player:m.foes[targetIndex];
  assert.equal(placement.uid,uid);assert(placement.delta.every(x=>Math.abs(x)<1),'effect follows actual recipient bounds');verify(id,await turn,targetIndex);
 }
 for(const id of ids){await page.evaluate(id=>window.__artQA.boot(id,null,'reduced'),id);verify(id,await page.evaluate(()=>window.__artQA.turn()));}
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await browser.close();console.log('PASS: '+ids.length+' revised actions in live singles and both double targets; priority moves in eight leader layouts; mechanics, recipient bounds, command recovery and reduced motion.');
})().catch(e=>{console.error(e);process.exit(1)});
