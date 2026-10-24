const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__choicesQA={
 boot(){if(battle)hideBattleSurface();closeDialogue();presentationLocked=false;selectSlot(1);setMotionPreference('reduced');const fixture=structuredClone(initialExpeditionState),party=[newUnit(byId('003'),60)],reserve=['002','003','364','021'].map(id=>newUnit(byId(id),60));Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,party,reserve,nextUnitId:10000,money:1000000,slowStews:5});resumeSnapshot({state:fixture,room:'town',player:{x:24,y:20,facing:'up'}});},
 list:()=>partyMenu(true),shop:r=>shop(r),start(){room='march';startWild({speciesId:'364',level:60,phase:'DAY'});},ready:()=>!!battle&&!battle.busy&&!battle.sendOut,
 capture(){const e=battle.enemies[0];e.hp=1;e.status='SLEEP';e.statusTurns=6;battle.round=100;return wildTurn({food:'slowStews'});},
 state:()=>({party:state.party.map(u=>u.uid),reserve:state.reserve.map(u=>({uid:u.uid,pending:!!u.capturePlacementPending}))}),
 load(){if(battle)hideBattleSurface();closeDialogue();selectSlot(1);resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},close:closeModal
 };`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__choicesQA);await page.evaluate(()=>{window.__choicesQA.boot();window.__choicesQA.list();});
 const visible=()=>page.locator('.party-row:visible').count();assert.equal(await visible(),5);
 await page.selectOption('#reserve-type','FAIRY');await page.selectOption('#reserve-second-type','DARK');await page.selectOption('#reserve-stage','2');assert.equal(await visible(),2);
 await page.selectOption('#reserve-scope','PARTY');assert.equal(await visible(),1);await page.fill('#reserve-search','impossible-name');assert.equal(await visible(),0);await page.click('#reserve-reset');assert.equal(await visible(),5);await page.selectOption('#reserve-scope','RESERVE');assert.equal(await visible(),4);
 fs.mkdirSync('build/qa',{recursive:true});await page.screenshot({path:'build/qa/combined-partner-filters.png'});
 await page.evaluate(()=>{window.__choicesQA.close();window.__choicesQA.shop('dorelemShop');window.__choicesQA.close();window.__choicesQA.shop('shop');});assert.equal(await page.locator('#buy-hearty-food').count(),1);
 await page.evaluate(()=>{window.__choicesQA.close();window.__choicesQA.start();});await page.waitForFunction(()=>window.__choicesQA.ready());await page.evaluate(()=>window.__choicesQA.capture());await page.waitForSelector('#capture-reserve');
 let s=await page.evaluate(()=>window.__choicesQA.state());assert.equal(s.party.length,1);assert(s.reserve.some(u=>u.pending));assert(await page.locator('#capture-keep').isEnabled());await page.screenshot({path:'build/qa/capture-party-or-reserve.png'});
 await page.reload({waitUntil:'networkidle'});await page.evaluate(()=>window.__choicesQA.load());await page.waitForSelector('#capture-reserve');await page.click('#capture-reserve');s=await page.evaluate(()=>window.__choicesQA.state());assert.equal(s.party.length,1);assert(s.reserve.every(u=>!u.pending));
 await page.evaluate(()=>window.__choicesQA.boot());await page.evaluate(()=>window.__choicesQA.start());await page.waitForFunction(()=>window.__choicesQA.ready());await page.evaluate(()=>window.__choicesQA.capture());await page.waitForSelector('#capture-keep');await page.click('#capture-keep');s=await page.evaluate(()=>window.__choicesQA.state());assert.equal(s.party.length,2);assert(s.reserve.every(u=>!u.pending));
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: phone filters, store propagation, real capture placement and reload preserves solo runs.');
})().catch(e=>{console.error(e);process.exit(1)});
