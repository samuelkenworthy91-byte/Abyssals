const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.error(e.stack);});
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`
 window.__pouchQA={
 boot(){closeDialogue();closeModal();setMotionPreference('reduced');selectSlot(1);const parents=['pouch-a','pouch-b'].map(uid=>{const u=newUnit(byId('001'),1);u.uid=uid;return u;}),fixture=structuredClone(initialExpeditionState);Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,party:parents,reserve:[],money:700000,nextUnitId:900,running:true,fates:{'LDR-02':'SPARED'}});resumeSnapshot({state:fixture,room:'philomereShop',player:{x:24,y:17,facing:'up'},phaseElapsed:0,worldRandom:43});closeDialogue();for(let i=0;i<3;i++)createBreedingEgg(state,'pouch-a','pouch-b',{random:()=>0,inheritancePlans:[{stat:'',moveId:null},{stat:'',moveId:null}]});persist();shop('philomereShop');},
 read(){return {room,locked:presentationLocked,x:player.x,y:player.y,moving:!!player.step,path:player.path.length,capacity:eggCapacity(state),tier:state.nursery?.pouchTier||0,money:state.money,eggs:structuredClone(state.nursery?.eggs||[]),hatched:state.nursery?.hatched?.length||0,reserve:state.reserve.length,party:state.party.length};},
 pairing(){closeModal();room='philomere';confirmBreeding('pouch-a','pouch-b');},
 nursery(){closeModal();nurseryMenu();},
 town(){closeModal();room='philomere';setPlayer(45,17,'right');buildMarkers();persist();},
 point(x,y){const r=canvas.getBoundingClientRect(),scale=isPromenade(room)?PROMENADE_SCALE:1;return {x:r.left+(x*16+8)/scale*view.scale+view.ox,y:r.top+((y*16+8)/scale+(isPromenade(room)?PROMENADE_Y_OFFSET:0))*view.scale+view.oy};},
 export(){return makeSaveFile({version:1,state:structuredClone(state),room,player:{x:player.x,y:player.y,facing:player.facing},phaseElapsed,worldRandom:worldRandom.state()},saveTransferOptions());},
 reload(){resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},
 pause(){openModal('The river below','<p>Watch the water.</p>');},
 lock(){closeModal();closeDialogue();delete state.fates['LDR-02'];room='philomere';setPlayer(45,17,'right');buildMarkers();persist();},
 legacyLocked(){closeDialogue();room='willowglassBridge';setPlayer(395,144,'right');buildMarkers();persist();},
 close(){closeModal();closeDialogue();}
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
 let point=await page.evaluate(()=>window.__pouchQA.point(46,17));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>{const r=window.__pouchQA.read();return r.room==='willowglassBridge'&&!r.locked;});await page.waitForTimeout(250);await page.waitForFunction(async()=>{const m=await import('/promenade.js?v=0.90.37');return m.promenadeArtReady();});
 let before=await page.evaluate(()=>window.__pouchQA.read());assert(before.eggs.every(e=>e.remaining===511),'one actual step to the town gate');
 await page.waitForTimeout(400);assert.deepEqual((await page.evaluate(()=>window.__pouchQA.read())).eggs,before.eggs);await page.screenshot({path:'build/qa/willowglass-aerial-phone.png'});
 // A tap high up the full-height right edge still walks along the actual deck.
 point=await page.evaluate(()=>window.__pouchQA.point(420,25));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>window.__pouchQA.read().x>=80);await page.evaluate(()=>window.__pouchQA.pause());await page.waitForFunction(()=>!window.__pouchQA.read().moving);const paused=await page.evaluate(()=>window.__pouchQA.read());await page.waitForTimeout(400);assert.deepEqual((await page.evaluate(()=>window.__pouchQA.read())).eggs,paused.eggs);
 const exported=JSON.parse(await page.evaluate(()=>window.__pouchQA.export()));assert.equal(exported.snapshot.player.x,paused.x);assert(exported.snapshot.player.x>48);assert.equal(exported.snapshot.state.nursery.eggs.length,10);
 await page.evaluate(()=>window.__pouchQA.close());await page.evaluate(()=>window.__pouchQA.reload());assert.deepEqual((await page.evaluate(()=>window.__pouchQA.read())).eggs,paused.eggs);assert.equal((await page.evaluate(()=>window.__pouchQA.read())).capacity,10);await page.waitForTimeout(150);
 point=await page.evaluate(()=>window.__pouchQA.point(420,25));const started=Date.now();await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>{const r=window.__pouchQA.read();return r.room==='rivercause'&&!r.locked;},{},{timeout:24000});assert(Date.now()-started<24000,'crossing is substantially faster than the previous 36-second run');
 const across=await page.evaluate(()=>window.__pouchQA.read());assert(across.eggs.every(e=>e.remaining===151),'360 completed steps across, plus town entrance step');assert.equal(across.x,3);assert.equal(across.y,17);
 // Rivercause’s western edge returns to the bridge, rather than skipping it.
 await page.waitForTimeout(200);point=await page.evaluate(()=>window.__pouchQA.point(1,17));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>{const r=window.__pouchQA.read();return r.room==='willowglassBridge'&&!r.locked;}).catch(async error=>{console.error('Return-gate diagnostics',await page.evaluate(()=>window.__pouchQA.read()),await page.locator('#dialogue').innerText());await page.screenshot({path:'build/qa/willowglass-return-failure.png'});throw error;});await page.waitForTimeout(200);assert.equal((await page.evaluate(()=>window.__pouchQA.read())).x,396);
 // A tap near the bottom of the left edge crosses the full bridge into town.
 point=await page.evaluate(()=>window.__pouchQA.point(5,270));await page.mouse.click(point.x,point.y);await page.locator('#hatch-done').waitFor({timeout:24000});const hatched=await page.evaluate(()=>window.__pouchQA.read());assert.equal(hatched.eggs.length,0);assert.equal(hatched.hatched,10);assert.equal(hatched.party,6);assert.equal(hatched.reserve,6);assert.equal(hatched.capacity,10);await page.screenshot({path:'build/qa/willowglass-hatch-phone.png'});await page.locator('#hatch-done').click();await page.evaluate(()=>window.__pouchQA.town());
 await page.evaluate(()=>window.__pouchQA.lock());await page.waitForTimeout(150);point=await page.evaluate(()=>window.__pouchQA.point(46,17));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>!document.querySelector('#dialogue').hidden);assert.equal((await page.evaluate(()=>window.__pouchQA.read())).room,'philomere');assert((await page.locator('#dialogue').innerText()).includes('abbess'));
 await page.evaluate(()=>window.__pouchQA.legacyLocked());await page.waitForTimeout(150);point=await page.evaluate(()=>window.__pouchQA.point(420,25));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>!document.querySelector('#dialogue').hidden);assert.equal((await page.evaluate(()=>window.__pouchQA.read())).room,'willowglassBridge');assert((await page.locator('#dialogue').innerText()).includes('abbess'));
 await page.evaluate(()=>window.__pouchQA.close());point=await page.evaluate(()=>window.__pouchQA.point(5,270));await page.mouse.click(point.x,point.y);await page.waitForFunction(()=>{const r=window.__pouchQA.read();return r.room==='philomere'&&!r.locked;},{},{timeout:24000});
 assert.deepEqual(errors,[]);console.log('PASS: phone upgrade purchases, ten real eggs, full-capacity UI, mandatory town/bridge/Rivercause route both ways, full-height edge taps, larger aerial figure, faster 360-step crossings, pause/idling, ten eggs progressed, bridge export/reload, hatching and original story gate');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
