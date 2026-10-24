// Test-only access is injected into the served response and never shipped.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const {expAward}=await import('../dist/progression.js');
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:720},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__fieldQA={
 boot(level=60){if(battle)hideBattleSurface();closeDialogue();closeModal();presentationLocked=false;setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState),party=['010','025','004'].map((id,i)=>{const u=newUnit(byId(id),level);u.uid=['qa-first','qa-second','qa-observer'][i];return u;});Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,party,reserve:Array.from({length:25},()=>newUnit(byId('010'),20)),nextUnitId:10000,money:1000000,slowStews:5,sideAdventures:{fishing:{rod:true,lastEnteredDay:-1,contest:null}}});resumeSnapshot({state:fixture,room:'town',player:{x:24,y:20,facing:'up'},phaseElapsed:10000,worldRandom:123});},
 walter:aericMenu,close:closeModal,injure(){state.party[0].hp=1;},rested:()=>state.party[0].hp===state.party[0].maxHp,
 night(){room='anglersReach';phaseElapsed=GAME_DAY_MS*.75;lastClock=performance.now();fishingWarden();},clock(t){phaseElapsed=t;lastClock=performance.now();},fish:fishingWarden,
 keeper(){const e=nextFishingEncounter(state,lead(),phaseElapsed),u=newUnit(byId(e.speciesId),e.level);recordFishingCatch(state,u,e,phaseElapsed);persist();fishingWarden();},ready:()=>fishingReadyAt(state),
 load(){closeDialogue();closeModal();selectSlot(1);resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},
 startCapture(share){closeModal();state.binocularBattles=share?8:0;room='march';startWild({speciesId:'364',level:60,phase:'DAY'});battle.enemies[0].status='SLEEP';battle.enemies[0].statusTurns=6;},
 startDouble(){closeModal();room='relicGrove3';startRelicDouble();battle.alliedRivet.moves.forEach(m=>m.left=0);battle.enemies.forEach(u=>u.moves.forEach(m=>m.left=0));},
 battleReady:()=>!!battle&&!battle.busy&&!battle.sendOut,swap:()=>wildTurn({switchUid:'qa-second'}),
 capture(){battle.round=100;const e=battle.relicDouble?doubleLivingTargets(battle)[0].u:battle.enemies[0];battle.targetIndex=battle.enemies.indexOf(e);e.hp=1;e.status='SLEEP';e.statusTurns=6;return wildTurn({food:'slowStews'});},
 meta:()=>({target:battle.enemies[battle.targetIndex||0].level,allied:battle.alliedRivet?{uid:battle.alliedRivet.uid,level:battle.alliedRivet.level}:null,party:state.party.map(u=>({uid:u.uid,level:u.level}))}),
 pendingCapture:()=>battle?.outcome==='captured'&&!battle.rewardsCommitted,
 rewards:()=>({units:[...state.party,...state.reserve].map(u=>({uid:u.uid,id:u.species.id,exp:u.exp||0})),rows:state.rewardQueue.filter(c=>c.kind==='exp').map(c=>({uid:c.uid,amount:c.amount})),binoculars:state.binocularBattles}),
 floor(i){closeModal();room=CAVE_FLOORS[i].room;routeGuide();return areaRoute().tables.find(t=>t.phase===phaseAt(phaseElapsed)).slots.map(s=>({id:s.species_id,name:byId(s.species_id).name,weight:s.weight}));}
 };`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__fieldQA);fs.mkdirSync('build/qa',{recursive:true});
 for(const viewport of [{width:1280,height:720},{width:430,height:932},{width:932,height:430}]){
  await page.setViewportSize(viewport);await page.evaluate(()=>{window.__fieldQA.boot();window.__fieldQA.injure();window.__fieldQA.walter();});
  const box=await page.locator('.modal').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,client:el.clientWidth,scroll:el.scrollWidth};});
  assert(box.x>=0&&box.y>=0&&box.right<=viewport.width+1&&box.bottom<=viewport.height+1,'Walter fits the window');assert(box.scroll<=box.client+1,'no horizontal overflow');
  assert.equal(await page.locator('.walter-actions button').count(),10);
  for(const button of await page.locator('.walter-actions button').all()){await button.scrollIntoViewIfNeeded();const r=await button.boundingBox();assert(r.x>=0&&r.x+r.width<=viewport.width+1&&r.y>=0&&r.y+r.height<=viewport.height+1,'every Walter action is reachable');}
  await page.locator('#aeric-rest').click();assert(await page.evaluate(()=>window.__fieldQA.rested()));
  await page.evaluate(()=>window.__fieldQA.walter());await page.locator('#relearn').click();assert(await page.locator('[data-relearn-unit]').count()>20);
  await page.locator('[data-relearn-unit]').last().scrollIntoViewIfNeeded();assert(await page.locator('#close-modal').isVisible());
 }
 await page.evaluate(()=>window.__fieldQA.walter());await page.screenshot({path:'build/qa/walter-window-scroll.png'});
 await page.setViewportSize({width:430,height:932});await page.evaluate(()=>{window.__fieldQA.boot();window.__fieldQA.night();});
 assert(await page.locator('#fish-enter').isEnabled());assert((await page.locator('.modal').innerText()).includes('day or night'));await page.locator('#fish-enter').click();await page.evaluate(()=>window.__fieldQA.keeper());
 await page.locator('#fish-weigh-in').click();for(let n=0;n<3;n++)await page.locator('#fish-reveal').click();await page.locator('[data-fish-prize]').first().click();
 const ready=await page.evaluate(()=>window.__fieldQA.ready());
 await page.evaluate(t=>{window.__fieldQA.close();window.__fieldQA.clock(t-10000);window.__fieldQA.fish();},ready);assert.equal(await page.locator('#fish-enter').count(),0);
 await page.reload({waitUntil:'networkidle'});await page.evaluate(t=>{window.__fieldQA.load();window.__fieldQA.close();window.__fieldQA.clock(t+1000);window.__fieldQA.fish();},ready);
 assert(await page.locator('#fish-enter').isEnabled());await page.locator('#fish-enter').click();await page.evaluate(()=>window.__fieldQA.fish());assert((await page.locator('.modal').innerText()).includes('Casting time left'));
 await page.screenshot({path:'build/qa/fishing-night-entry.png'});
 for(const share of [false,true]){
  await page.evaluate(s=>{window.__fieldQA.boot();window.__fieldQA.startCapture(s);},share);await page.waitForFunction(()=>window.__fieldQA.battleReady());await page.evaluate(()=>window.__fieldQA.swap());await page.waitForFunction(()=>window.__fieldQA.battleReady());
  await page.evaluate(()=>{void window.__fieldQA.capture();});await page.waitForFunction(()=>window.__fieldQA.pendingCapture());
  // Reload the already-saved successful capture before reward presentation finishes.
  await page.reload({waitUntil:'networkidle'});await page.evaluate(()=>window.__fieldQA.load());await page.waitForFunction(()=>window.__fieldQA.rewards().rows.length>0);
  const rewards=await page.evaluate(()=>window.__fieldQA.rewards()),expected=expAward(60,60,6);assert.deepEqual(rewards.rows.map(r=>r.uid),share?['qa-first','qa-second','qa-observer']:['qa-first','qa-second']);assert(rewards.rows.every(r=>r.amount===expected));assert.equal(rewards.units.find(u=>u.id==='364').exp,0);assert.equal(rewards.binoculars,share?7:0);
  await page.reload({waitUntil:'networkidle'});await page.evaluate(()=>window.__fieldQA.load());assert.deepEqual(await page.evaluate(()=>window.__fieldQA.rewards()),rewards,'reloading cannot award twice');
 }
 await page.screenshot({path:'build/qa/capture-experience.png'});
 await page.evaluate(()=>{window.__fieldQA.boot(20);window.__fieldQA.startDouble();});await page.waitForFunction(()=>window.__fieldQA.battleReady());await page.evaluate(()=>window.__fieldQA.swap());await page.waitForFunction(()=>window.__fieldQA.battleReady());
 const meta=await page.evaluate(()=>window.__fieldQA.meta());await page.evaluate(()=>window.__fieldQA.capture());const double=await page.evaluate(()=>window.__fieldQA.rewards());
 assert.deepEqual(new Set(double.rows.map(r=>r.uid)),new Set(['qa-first','qa-second',meta.allied.uid]));for(const row of double.rows){const level=row.uid===meta.allied.uid?meta.allied.level:meta.party.find(u=>u.uid===row.uid).level;assert.equal(row.amount,expAward(meta.target,level,1,2));}
 const seen=new Set();await page.evaluate(()=>window.__fieldQA.boot());for(let i=0;i<5;i++){const slots=await page.evaluate(i=>window.__fieldQA.floor(i),i);const text=await page.locator('.encounter-table').innerText();for(const slot of slots){assert(text.includes(slot.name));if(slot.id==='364'){assert.equal(slot.weight,i<3?3:5);continue;}assert(!seen.has(slot.id));seen.add(slot.id);}}
 await page.screenshot({path:'build/qa/fort-floor-five-encounters.png'});
 assert.deepEqual(errors,[]);console.log('PASS: Walter fits/scrolls in desktop, portrait and landscape; night contest entry/cooldown/reload; real captures and EXP with switched partners, Binoculars, double battle and save/reload; all five distinct fort sighting boards.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
