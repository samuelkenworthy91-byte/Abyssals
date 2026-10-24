// Test-only state access is injected into the served response, never shipped.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__trainQA={boot(){closeDialogue();state.rewardQueue=[];state.pendingFate=null;closeModal();setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState),learner=newUnit(byId('364'),195),water=newUnit(byId('140'),80);learner.exp=37;water.stats.speed=1000;Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,money:10000000,trainingTonics:12,cybressa:{trialMarks:100000},party:[learner,water],reserve:Array.from({length:35},()=>newUnit(byId('364'),30)),nextUnitId:10000,fates:{'LDR-01':'SPARED','LDR-03':'SPARED','LDR-04':'SPARED'}});resumeSnapshot({state:fixture,room:'cybressa',player:{x:24,y:25,facing:'up'},phaseElapsed:0,worldRandom:123});},tonics:trainingTonicTarget,draughts:cybressaDraughtMenu,stock(floor){room='marasenExchange'+floor;marasenInteract('mr-exchange-counter');},race(){room='marasenRapids';marasenInteract('mr-race-marshal');},read:()=>({level:state.party[0].level,exp:state.party[0].exp,tonics:state.trainingTonics,queue:state.rewardQueue.length,money:state.money,doses:state.party[0].marasenTonicDoses||0,scrolls:state.moveScrolls}),reload(){resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},uid:()=>state.party[0].uid,water:()=>state.party[1].uid,close:closeModal};`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__trainQA);fs.mkdirSync('build/qa',{recursive:true});
 await page.evaluate(()=>{window.__trainQA.boot();window.__trainQA.tonics();});
 const uid=await page.evaluate(()=>window.__trainQA.uid());
 await page.locator('[data-tonic-target="'+uid+'"]').click();
 assert.equal(await page.locator('#tonic-count').getAttribute('max'),'5');
 await page.locator('#tonic-count').fill('6');assert(await page.locator('#tonic-confirm').isDisabled());
 await page.locator('#tonic-count').fill('3');assert((await page.locator('#tonic-preview').innerText()).includes('195 → 198'));
 await page.locator('#tonic-confirm').click();assert.equal((await page.evaluate(()=>window.__trainQA.read())).tonics,9);
 await page.evaluate(()=>window.__trainQA.reload());
 for(let n=0;n<20&&await page.locator('#reward-next').count();n++)await page.locator('#reward-next').click();
 await page.waitForFunction(()=>window.__trainQA.read().queue===0);
 assert.deepEqual(await page.evaluate(()=>{const s=window.__trainQA.read();return [s.level,s.exp,s.tonics];}),[198,37,9]);
 await page.evaluate(()=>window.__trainQA.draughts());assert((await page.locator('.modal').innerText()).includes('/10 effects'));
 await page.evaluate(()=>window.__trainQA.stock(1));
 assert(await page.getByText('Slumber Mist',{exact:true}).count());assert(await page.getByText('Rime Seal',{exact:true}).count());assert(await page.getByText('Venom Mark',{exact:true}).count());assert(await page.getByText('Hoarfrost Hex',{exact:true}).count());
 // Real purchase at the bottom of the long shop must retain its position.
 const buy=page.locator('[data-mr-buy]').last();await buy.scrollIntoViewIfNeeded();
 const top=await page.locator('.modal').evaluate(el=>el.scrollTop);assert(top>500);
 await buy.click();await page.waitForTimeout(100);
 assert(Math.abs(await page.locator('.modal').evaluate(el=>el.scrollTop)-top)<30,'purchase retains list position');
 await page.screenshot({path:'build/qa/exchange-list-position.png'});
 await page.evaluate(()=>window.__trainQA.stock(4));
 const growthTonic=page.locator('.mr-stock').filter({hasText:'Focused Growth Tonic'}).locator('[data-mr-buy]');
 assert.equal(await growthTonic.count(),1,'Growth Apothecary stocks the focused tonic');
 await growthTonic.click();
 // Selecting and returning to a scrolled partner list also retains its position.
 const target=page.locator('[data-mr-tonic-uid]').last();await target.scrollIntoViewIfNeeded();const listTop=await page.locator('.modal').evaluate(el=>el.scrollTop);
 await target.click();await page.locator('#mr-tonic-abort').click();await page.waitForTimeout(100);
 assert(Math.abs(await page.locator('.modal').evaluate(el=>el.scrollTop)-listTop)<30,'return retains partner list position');
 await page.evaluate(()=>window.__trainQA.race());
 assert.equal(await page.locator('#mr-race-mode').inputValue(),'speed');
 const water=await page.evaluate(()=>window.__trainQA.water());await page.locator('#mr-racer').selectOption(water);
 await page.locator('#mr-bet-go').click();assert(await page.locator('#mr-race-auto').count());assert.equal(await page.locator('#mr-bubble').count(),0);
 await page.evaluate(()=>window.__trainQA.reload());await page.evaluate(()=>window.__trainQA.race());
 await page.locator('#mr-race-auto').click();assert(await page.locator('#mr-race-again').count());
 await page.screenshot({path:'build/qa/rapids-automatic-result.png'});
 assert.deepEqual(errors,[]);console.log('PASS: bulk-tonic quantity/validation/reload/overflow, ten-effect text, new status stock, purchase/back scroll retention and automatic race/reload/settlement');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
