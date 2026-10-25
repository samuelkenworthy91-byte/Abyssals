const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.error(e.stack);});
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`
 window.__pouchQA={
 boot(){closeDialogue();closeModal();setMotionPreference('reduced');selectSlot(1);const parents=['pouch-a','pouch-b'].map(uid=>{const u=newUnit(byId('001'),1);u.uid=uid;return u;}),fixture=structuredClone(initialExpeditionState);Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,party:parents,reserve:[],money:700000,nextUnitId:900,running:true,fates:{'LDR-02':'SPARED'}});resumeSnapshot({state:fixture,room:'philomereShop',player:{x:24,y:17,facing:'up'},phaseElapsed:0,worldRandom:43});closeDialogue();for(let i=0;i<3;i++)createBreedingEgg(state,'pouch-a','pouch-b',{random:()=>0,inheritancePlans:[{stat:'',moveId:null},{stat:'',moveId:null}]});persist();shop('philomereShop');},
 read(){return {room,x:player.x,y:player.y,moving:!!player.step,path:player.path.length,capacity:eggCapacity(state),tier:state.nursery?.pouchTier||0,money:state.money,eggs:structuredClone(state.nursery?.eggs||[]),party:state.party.length};},
 pairing(){closeModal();room='philomere';confirmBreeding('pouch-a','pouch-b');},
 nursery(){closeModal();nurseryMenu();},
 town(){closeModal();room='philomere';setPlayer(22,27,'down');buildMarkers();persist();},
 point(x,y){const r=canvas.getBoundingClientRect(),scale=isPromenade(room)?PROMENADE_SCALE:1;return {x:r.left+(x*16+8)/scale*view.scale+view.ox,y:r.top+((y*16+8)/scale+(isPromenade(room)?PROMENADE_Y_OFFSET:0))*view.scale+view.oy};},
 export(){return makeSaveFile({version:1,state:structuredClone(state),room,player:{x:player.x,y:player.y,facing:player.facing},phaseElapsed,worldRandom:worldRandom.state()},saveTransferOptions());},
 reload(){resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},
 pause(){openModal('The river below','<p>Watch the water.</p>');},
 close(){closeModal();}
 };`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__pouchQA);await page.evaluate(()=>window.__pouchQA.boot());
 fs.mkdirSync('build/qa',{recursive:true});assert.equal((await page.evaluate(()=>window.__pouchQA.read())).capacity,3);
 for(const [price,capacity]of [[10000,4],[20000,5],[40000,6],[80000,8],[160000,10]]){
  await page.locator('#shop-pouch-upgrade').click();const text=await page.locator('#modal-root').innerText();assert(text.includes(price.toLocaleString('en-GB')));assert(text.includes('to '+capacity+' eggs'));
  await page.locator('#pouch-buy-confirm').click();assert.equal((await page.evaluate(()=>window.__pouchQA.read())).capacity,capacity);
 }
 assert.equal(await page.locator('#shop-pouch-upgrade').count(),0);await page.screenshot({path:'build/qa/ten-egg-pouch-phone.png'});
 assert.equal((await page.evaluate(()=>window.__pouchQA.read())).money,387000);
 for(let i=3;i<10;i++){await page.evaluate(()=>window.__pouchQA.pairing());await page.locator('#breed-stat-0').selectOption('');await page.locator('#breed-stat-1').selectOption('');await page.locator('#breed-confirm').click();assert.equal((await page.evaluate(()=>window.__pouchQA.read())).eggs.length,i+1);}
 assert(await page.locator('#nursery-pair').isDisabled());assert((await page.locator('#modal-root').innerText()).includes('10/10'));
 await page.evaluate(()=>window.__pouchQA.town());await page.waitForTimeout(150);await page.screenshot({path:'build/qa/willowglass-town-entrance-phone.png'});
 let point=await page.evaluate(()=>window.__pouchQA.point(22,28));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>window.__pouchQA.read().room==='willowglassBridge');await page.waitForTimeout(250);await page.waitForFunction(async()=>{const m=await import('/promenade.js?v=0.90.36');return m.promenadeArtReady();});
 let before=await page.evaluate(()=>window.__pouchQA.read());assert(before.eggs.every(e=>e.remaining===511),'one actual step to the town gate');
 // Merely entering and idling never grants bridge progress.
 await page.waitForTimeout(400);assert.deepEqual((await page.evaluate(()=>window.__pouchQA.read())).eggs,before.eggs);await page.screenshot({path:'build/qa/willowglass-aerial-phone.png'});
 point=await page.evaluate(()=>window.__pouchQA.point(396,130));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>window.__pouchQA.read().x>=42);await page.evaluate(()=>window.__pouchQA.pause());await page.waitForFunction(()=>!window.__pouchQA.read().moving);const paused=await page.evaluate(()=>window.__pouchQA.read());await page.waitForTimeout(400);assert.deepEqual((await page.evaluate(()=>window.__pouchQA.read())).eggs,paused.eggs);
 await page.evaluate(()=>window.__pouchQA.close());point=await page.evaluate(()=>window.__pouchQA.point(396,130));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>{const r=window.__pouchQA.read();return r.x===396&&!r.moving&&!r.path;},{},{timeout:60000});
 const across=await page.evaluate(()=>window.__pouchQA.read());assert(across.eggs.every(e=>e.remaining===151),'360 completed steps across, plus town entrance step');
 const exported=JSON.parse(await page.evaluate(()=>window.__pouchQA.export()));assert.equal(exported.snapshot.player.x,396);assert.equal(exported.snapshot.state.nursery.eggs.length,10);
 await page.evaluate(()=>window.__pouchQA.reload());assert.deepEqual((await page.evaluate(()=>window.__pouchQA.read())).eggs,across.eggs);assert.equal((await page.evaluate(()=>window.__pouchQA.read())).capacity,10);await page.waitForTimeout(150);
 point=await page.evaluate(()=>window.__pouchQA.point(36,158));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>{const r=window.__pouchQA.read();return r.x===36&&!r.moving&&!r.path;},{},{timeout:60000});assert((await page.evaluate(()=>window.__pouchQA.read())).eggs.every(e=>e.remaining===0));
 await page.evaluate(()=>window.__pouchQA.nursery());await page.locator('[data-hatch-egg]').first().click();await page.locator('#egg-hatch-confirm').click();const hatched=await page.evaluate(()=>window.__pouchQA.read());assert.equal(hatched.eggs.length,9);assert.equal(hatched.party,3);assert.equal(hatched.capacity,10);await page.screenshot({path:'build/qa/willowglass-hatch-phone.png'});
 await page.evaluate(()=>window.__pouchQA.close());await page.waitForTimeout(100);point=await page.evaluate(()=>window.__pouchQA.point(18,144));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>window.__pouchQA.read().room==='philomere',{},{timeout:10000});
 assert.deepEqual(errors,[]);console.log('PASS: phone upgrade purchases, ten real eggs, full-capacity UI, visible town connection, zoomed-out taps, pause/idling, 360 real steps each way, ten eggs progressed, bridge export/reload, hatching and exit');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
