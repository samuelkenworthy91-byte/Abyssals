const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__bagQA={boot(){closeDialogue();closeModal();setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState);Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,nextUnitId:100,money:100000,patientRations:7,slowStews:3,party:[newUnit(byId('004'),40)],heldItems:Object.fromEntries(HELD_ITEMS.map(i=>[i.id,1])),evolutionItems:Object.fromEntries(EVOLUTION_ITEMS.map(i=>[i.id,1])),levelEvolutionMigration:true,moveScrolls:{700:1,701:1,702:1},trade:true,storyFlags:{two_prayers_unlocked:true}});resumeSnapshot({state:fixture,room:'marasenExchange1',player:{x:24,y:26,facing:'down'},phaseElapsed:0,worldRandom:123});},bag:bagMenu,stock:()=>({slow:state.slowStews,patient:state.patientRations}),pos:()=>({room,x:player.x,y:player.y,modal,presentationLocked}),close:closeModal,save:persist,reload(){closeModal();resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},place(floor){closeModal();room='marasenExchange'+floor;setPlayer(floor?24:31,27,'down');buildMarkers();},shop:()=>shop('marasenMarket')};`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__bagQA);fs.mkdirSync('build/qa',{recursive:true});
 await page.evaluate(()=>window.__bagQA.boot());assert.deepEqual(await page.evaluate(()=>window.__bagQA.stock()),{slow:10,patient:0});await page.evaluate(()=>{window.__bagQA.save();window.__bagQA.reload();});assert.deepEqual(await page.evaluate(()=>window.__bagQA.stock()),{slow:10,patient:0});
 for(const pocket of ['medicine','food','field','held','evolution','training','key']){
  await page.evaluate(p=>window.__bagQA.bag(p),pocket);await page.waitForFunction(()=>[...document.querySelectorAll('.bag-item img')].every(i=>i.complete&&i.naturalWidth>0));
  assert(await page.locator('.bag-item img').count()>0,pocket+' pictures');assert(!/Patient Ration/.test(await page.locator('.bag-item').innerText()));
  const missing=await page.locator('.bag-item h3').evaluateAll(rows=>rows.filter(h=>!['Nursery supplies','Move codexes'].includes(h.textContent)&&!h.querySelector('img')).map(h=>h.textContent));assert.deepEqual(missing,[],pocket+' iconless headings');
  assert(await page.locator('.modal').evaluate(el=>el.scrollWidth<=el.clientWidth+1),pocket+' width');
  await page.screenshot({path:'build/qa/bag-'+pocket+'.png'});
 }
 await page.evaluate(()=>window.__bagQA.shop());assert(!/Patient Ration/.test(await page.locator('.modal').innerText()));
 // Walk onto every entrance; ride to every floor through real UI buttons.
 for(let floor=0;floor<6;floor++){
  await page.evaluate(f=>window.__bagQA.place(f),floor);await page.keyboard.down('ArrowDown');await page.waitForFunction(()=>document.querySelector('[data-lift-floor]'));await page.keyboard.up('ArrowDown');
  assert.equal(await page.locator('[data-lift-floor]').count(),6);assert(await page.locator('[data-lift-floor="'+floor+'"]').isDisabled());
  const next=(floor+1)%6;await page.locator('[data-lift-floor="'+next+'"]').click();await page.waitForFunction(n=>window.__bagQA.pos().room==='marasenExchange'+n&&!window.__bagQA.pos().presentationLocked,next);assert.equal((await page.evaluate(()=>window.__bagQA.pos())).modal,false);
  // Reload after travel to verify arrival persists.
  await page.evaluate(()=>window.__bagQA.reload());assert.equal((await page.evaluate(()=>window.__bagQA.pos())).room,'marasenExchange'+next);
 }
 await page.evaluate(()=>window.__bagQA.place(2));await page.keyboard.down('ArrowDown');await page.waitForFunction(()=>document.querySelector('[data-lift-floor]'));await page.keyboard.up('ArrowDown');await page.screenshot({path:'build/qa/exchange-lift-menu.png'});await page.evaluate(()=>window.__bagQA.close());await page.locator('#viewport').screenshot({path:'build/qa/exchange-lift-world.png'});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: portrait bag icons load in all seven pockets; legacy food converts once and survives reload; all six walk-in lift menus and floor journeys save correctly.');
})().catch(e=>{console.error(e);process.exit(1)});
