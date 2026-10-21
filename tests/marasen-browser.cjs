// Test-only access is injected into the served response, never shipped.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__mrQA={boot(target='marasen',x=30,y=20,progress={}){closeDialogue();closeModal();$('#toast').classList.remove('visible');setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState);Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,nextUnitId:2,money:1000,emergencyEvacs:2,fates:{'LDR-01':'SPARED','LDR-03':'SPARED','LDR-04':'SPARED'},party:[newUnit(byId('004'),80)],...progress});resumeSnapshot({state:fixture,room:target,player:{x,y,facing:'up'},phaseElapsed:0,worldRandom:123});},pos:()=>({room,x:player.x,y:player.y,money:state.money,blocked:blocked(player.x,player.y)}),place(x,y,facing='up'){closeDialogue();closeModal();setPlayer(x,y,facing);},close(){closeDialogue();closeModal();},reload(){closeDialogue();closeModal();resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},persist,history(){const lost=newUnit(byId('005'),42);Object.assign(lost,{hp:0,dead:true});state.dead.push(lost);const q=marasenState(state);q.encounters={peach:'captured',tellurion:'defeated'};q.quests.mill={accepted:true,records:[0,1,2],rings:[2,4,4],solved:true,order:[],choice:'workers',claimed:true};persist();},protected:()=>JSON.stringify({dead:state.dead.map(u=>({uid:u.uid,species:u.species.id,dead:u.dead,hp:u.hp})),quests:state.marasen.quests,encounters:state.marasen.encounters}),visit(){recordTravelVisit(state,'marasen');},target:()=>closestInteract()?.id,evac(){state.lastPriestRest={room:'marasen'};return commitEvacTravel(evacDestination(state));}};`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__mrQA);fs.mkdirSync('build/qa',{recursive:true});
 // Existing canal save is automatically recovered, survives save/reload and can walk.
 await page.evaluate(()=>window.__mrQA.boot());let pos=await page.evaluate(()=>window.__mrQA.pos());assert(!pos.blocked);assert.notDeepEqual([pos.x,pos.y],[30,20]);await page.keyboard.down('ArrowRight');await page.waitForTimeout(550);await page.keyboard.up('ArrowRight');await page.waitForTimeout(100);assert((await page.evaluate(()=>window.__mrQA.pos())).x>pos.x);await page.evaluate(()=>{window.__mrQA.persist();window.__mrQA.reload();});assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked);
 // Actual A-button caravan menu, payment and arrival, followed by real movement.
 await page.evaluate(()=>{window.__mrQA.boot('cossenne',30,20);window.__mrQA.visit();});await page.locator('#console-a').click();await page.locator('[data-travel-to="marasen"]').click();await page.locator('#travel-confirm').click();await page.waitForFunction(()=>window.__mrQA.pos().room==='marasen');await page.waitForTimeout(350);pos=await page.evaluate(()=>window.__mrQA.pos());assert.deepEqual([pos.x,pos.y,pos.money,pos.blocked],[32,19,900,false]);await page.keyboard.down('ArrowRight');await page.waitForTimeout(550);await page.keyboard.up('ArrowRight');await page.waitForTimeout(100);assert((await page.evaluate(()=>window.__mrQA.pos())).x>32);await page.locator('#viewport').screenshot({path:'build/qa/marasen-caravan-safe.png'});
 await page.evaluate(()=>window.__mrQA.evac());pos=await page.evaluate(()=>window.__mrQA.pos());assert.deepEqual([pos.room,pos.x,pos.y,pos.blocked],['marasen',20,26,false]);
 // Actual blocked gate tells an old deeper save where to return and whom to find.
 await page.evaluate(()=>window.__mrQA.boot('commonDam',45,17));await page.evaluate(()=>window.__mrQA.place(45,17,'right'));await page.locator('#console-a').click();let text=await page.locator('.dialogue-text').innerText();assert(text.includes('Return west')&&text.includes('Maryam')&&text.includes('Refugee Kitchens'));await page.screenshot({path:'build/qa/marasen-exact-directions.png'});await page.evaluate(()=>window.__mrQA.close());
 await page.locator('#objective-short').click();assert((await page.locator('#modal-root').innerText()).includes('Required road expedition'));await page.evaluate(()=>window.__mrQA.close());
 for(const [room,x,y] of [['greenFern',24,6],['greenLantern',44,17],['greenTerrace',44,17],['commonCamp',44,17],['commonSpill',3,17],['marasen',24,26],['marasenBridges',44,17],['marasenRapids',3,17],['marasenCitadel',27,19]]){await page.evaluate(({room,x,y})=>window.__mrQA.boot(room,x,y),{room,x,y});await page.waitForTimeout(200);await page.locator('#viewport').screenshot({path:'build/qa/entrances-'+room+'.png'});}
 // Every Exchange floor renders independent props; furniture saves recover and real stairs/counters work.
 for(let floor=0;floor<6;floor++){
  const target='marasenExchange'+floor;
  await page.evaluate(target=>window.__mrQA.boot(target,6,16),target);
  assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked,'furniture save recovery '+target);
  await page.evaluate(()=>{window.__mrQA.persist();window.__mrQA.reload();});
  assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked);
  await page.evaluate(()=>window.__mrQA.place(24,14,'up'));
  await page.locator('#console-a').click();assert((await page.locator('#modal-root').innerText()).length>100,'floor stock opens');
  await page.evaluate(()=>{window.__mrQA.close();window.__mrQA.place(24,25);});
  await page.waitForTimeout(200);await page.locator('#viewport').screenshot({path:'build/qa/exchange-floor-'+floor+'.png'});
  if(floor<5){
   await page.evaluate(()=>window.__mrQA.place(40,11,'up'));
   if(floor===0){await page.waitForTimeout(150);await page.locator('#viewport').screenshot({path:'build/qa/exchange-staircase.png'});}
   await page.keyboard.down('ArrowUp');await page.waitForTimeout(180);await page.keyboard.up('ArrowUp');
   if((await page.evaluate(()=>window.__mrQA.pos())).room===target)await page.locator('#console-a').click();
   await page.waitForFunction(expected=>window.__mrQA.pos().room===expected,'marasenExchange'+(floor+1));await page.waitForTimeout(350);
   assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked);
   await page.evaluate(()=>window.__mrQA.place(7,10,'up'));await page.locator('#console-a').click();
   await page.waitForFunction(expected=>window.__mrQA.pos().room===expected,target);await page.waitForTimeout(350);
   assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked);
  }
 }
 // Existing save at a newly solid display recovers without reviving losses or resetting quests/unique encounters.
 await page.evaluate(()=>{window.__mrQA.boot('marasenExchange1',24,25);window.__mrQA.history();window.__mrQA.place(10,16);window.__mrQA.persist();});
 const protectedState=await page.evaluate(()=>window.__mrQA.protected());
 await page.evaluate(()=>window.__mrQA.reload());
 assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked);
 assert.equal(await page.evaluate(()=>window.__mrQA.protected()),protectedState);
 // Every exterior facade opens a real building; exits use its current outside doorstep.
 for(const [outside,id,x,y,inside]of [
  ['marasen','mr-exchange-entry',10,15,'marasenExchange0'],
  ['marasen','marasenArchive',36,14,'marasenArchive'],
  ['marasen','marasenApothecary',10,29,'marasenApothecary'],
  ['marasen','marasenMill',36,29,'marasenMill'],
  ['marasenBridges','marasenMarket',18,13,'marasenMarket'],
  ['marasenRapids','marasenArena',24,17,'marasenArena']
 ]){
  await page.evaluate(({outside,x,y})=>window.__mrQA.boot(outside,x,y),{outside,x,y});
  assert.equal(await page.evaluate(()=>window.__mrQA.target()),id);
  await page.locator('#console-a').click();await page.waitForFunction(expected=>window.__mrQA.pos().room===expected,inside);await page.waitForTimeout(350);
  assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked);
  await page.evaluate(isExchange=>window.__mrQA.place(24,isExchange?27:26,'down'),inside==='marasenExchange0');
  await page.locator('#console-a').click();await page.waitForFunction(expected=>window.__mrQA.pos().room===expected,outside);await page.waitForTimeout(350);
  assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked);
 }
 // Open-air street transitions work with A and leave a safe walkable arrival.
 for(const [from,x,y,facing,to]of [
  ['marasen',44,3,'up','marasenCitadel'],['marasenCitadel',44,28,'down','marasen'],
  ['marasen',24,28,'down','marasenBridges'],['marasenBridges',32,3,'up','marasen'],
  ['marasen',45,28,'right','marasenRapids'],['marasenRapids',2,28,'left','marasen'],
  ['marasenBridges',45,17,'right','marasenCitadel'],['marasenCitadel',2,17,'left','marasenBridges']
 ]){
  await page.evaluate(({from,x,y,facing})=>{window.__mrQA.boot(from,x,y);window.__mrQA.place(x,y,facing);},{from,x,y,facing});
  await page.locator('#console-a').click();await page.waitForFunction(expected=>window.__mrQA.pos().room===expected,to);await page.waitForTimeout(350);
  assert(!(await page.evaluate(()=>window.__mrQA.pos())).blocked);
 }
 assert.deepEqual(errors,[]);console.log('PASS: old canal save recovery/reload and walking, A-button paid caravan and walking, Emergency Evac, blocked-route exact directions, touch objective Journal, six floor stock menus/stair round trips, all building entrances/exits, eight street transitions and entrance rendering');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
