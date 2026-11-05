const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const fixture=String.raw`
window.__fastQA={
 boot(kind='wild'){
  window.__fnQA.boot('cayfen');setMotionPreference('full');
  if(kind==='double'){window.__fnQA.boot('sporeCrown');startFinaleDouble();}
  else {const p=lead(),e=instance(byId('010'),100,[moveId(1)]);e.uid='fast-foe';battle={kind,player:p,enemies:[e],index:0,round:1,random:rng(123),busy:false,finished:false,phase:'ready',artReady:true,history:[],participants:[p.uid],defeats:[],total:1,log:'Animation comparison.'};showBattleSurface();}
  const units=[battle.player,battle.alliedRivet,...battle.enemies].filter(Boolean);
  for(const [index,u] of units.entries()){u.uid='fast-unit-'+index;u.species={...u.species,types:['GRASS'],ability_names:{primary:'Plain'}};u.hp=u.maxHp=5000;u.stats={hp:5000,attack:50,sp_attack:50,defence:150,sp_defence:150,speed:100};u.stages={};u.status=null;u.confusion=0;u.heldItem=null;u.moves=[{...moveId(u===battle.player?738:1),left:20}];u.moveState={};}
  setMotionPreference('full');battle.random=rng(123);initializeBattleAbilities(battle);battle.busy=false;battle.phase='ready';battle.artReady=true;renderBattle();
 }, settings(){settingsMenu();}, close(){closeModal();},
 async turn(kind){const start=performance.now();if(kind==='practice')await battleTurn(0);else if(kind==='double')await relicDoubleTurn({move:0,targetIndex:0,teamcraftChosen:true});else await wildTurn({move:0,teamcraftChosen:true});return {elapsed:performance.now()-start,busy:battle.busy,round:battle.round,history:battle.history,outcome:battle.outcome??null,random:battle.random.state(),units:[battle.player,battle.alliedRivet,...battle.enemies].filter(Boolean).map(u=>({uid:u.uid,hp:u.hp,status:u.status,stages:u.stages,pp:u.moves.map(m=>m.left)}))};}
};`;
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1280,height:900},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+'\n'+fs.readFileSync('tests/finale-fixture.js','utf8')+'\n'+fixture});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__fastQA);
 const results=[];
 for(const kind of ['wild','practice','double']){
  const outcomes=[];
  for(const on of [true,false]){
   await page.evaluate(kind=>window.__fastQA.boot(kind),kind);await page.evaluate(()=>window.__fastQA.settings());
   const toggle=page.locator('#menu-battle-animations');if((await toggle.getAttribute('aria-pressed'))!==String(on))await toggle.click();
   assert.equal(await page.locator('#menu-battle-animations').textContent(),on?'On':'Off');await page.evaluate(()=>window.__fastQA.close());
   let sheets=0;const track=req=>{if(req.url().includes('/assets/vfx/action/'))sheets++;};page.on('request',track);
   const turn=page.evaluate(kind=>window.__fastQA.turn(kind),kind);
   const cue=page.locator(on?'.pixel-move-art':'.quick-hit');await cue.waitFor({state:'attached'});
   if(on){await page.waitForFunction(()=>{const el=document.querySelector('.pixel-move-art');return el&&getComputedStyle(el).backgroundPosition!=='0% 0%';},null,{timeout:1500});}
   else {assert.equal(await page.locator('.pixel-move-art').count(),0);assert.match(await cue.textContent(),/HIT|EFFECT/);}
   const result=await turn;page.off('request',track);assert.equal(result.busy,false);assert.equal(result.round,2);
   if(!on){assert.equal(sheets,0,'fast mode never loads detailed sheets');assert(result.elapsed<1800,'quick contact avoids detailed timing');}
   outcomes.push(result);results.push({kind,on,elapsed:result.elapsed});
  }
  const [{elapsed:a,...full},{elapsed:b,...fast}]=outcomes;assert.deepEqual(fast,full,'identical combat and random outcomes '+kind);assert(b<a,'fast mode is quicker '+kind);
 }
 await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>window.__fastQA);await page.evaluate(()=>{window.__fastQA.boot();window.__fastQA.settings();});assert.equal(await page.locator('#menu-battle-animations').textContent(),'Off','toggle persists after page reload');
 fs.mkdirSync('build/qa',{recursive:true});fs.writeFileSync('build/qa/fast-combat.json',JSON.stringify(results,null,2));await page.screenshot({path:'build/qa/fast-combat-settings.png'});assert.deepEqual(errors,[]);await browser.close();console.log('PASS: settings toggle and reload, real desktop animation frames, quick hit mode with no sheet requests, faster and identical wild/practice/double outcomes.');
})().catch(e=>{console.error(e);process.exit(1)});
