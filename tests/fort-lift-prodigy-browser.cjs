const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');

(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{
  const response=await route.fetch();
  const injected="\nwindow.__patchQA={"+
   "boot(){if(battle)hideBattleSurface();closeDialogue();closeModal();presentationLocked=false;setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState);const party=['010','025','004'].map((id,i)=>{const u=newUnit(byId(id),35);u.uid=['qa-first','qa-second','qa-third'][i];return u;});Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,party,reserve:[],nextUnitId:1000,money:1000000,fates:{'LDR-02':'SPARED'}});resumeSnapshot({state:fixture,room:'waranCave1',player:{x:5,y:17,facing:'down'},phaseElapsed:10000,worldRandom:123});state.party[1].heldItem='HELD_DUELIST_GRIP';state.party[0].breedingInheritance={speciesId:state.party[0].species.id,growth:{stat:'attack',rate:120,baseline:40},lineageGrowth:[]};recordFortVisit(room);refresh();persist();},"+
   "visit(i){closeDialogue();closeModal();room=CAVE_FLOORS[i].room;recordFortVisit(room);refresh();persist();},"+
   "lift:()=>fortLiftMenu(),"+
   "stats:()=>partnerSummary('qa-second'),"+
   "parents:()=>nurseryParentMenu(),"+
   "room:()=>room,"+
   "party:()=>state.party.map(u=>u.uid),"+
   "known:()=>[...knownFortFloors()]"+
   "};";
  await route.fulfill({response,body:await response.text()+injected});
 });
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>!!window.__patchQA);
 await page.evaluate(()=>window.__patchQA.boot());

 // Lift starts with only the entered floor; a deeper floor unlocks all traversed floors.
 assert.equal(await page.locator('#fort-lift [data-fort-destination="waranCave2"]').isDisabled(),true);
 assert.equal(await page.locator('#fort-lift [data-fort-destination="waranCave5"]').isDisabled(),true);
 await page.evaluate(()=>window.__patchQA.visit(2));
 assert.equal(await page.locator('#fort-lift [data-fort-destination="waranCave2"]').isEnabled(),true);
 assert.equal(await page.locator('#fort-lift [data-fort-destination="waranCave4"]').isDisabled(),true);
 await page.evaluate(()=>window.__patchQA.lift());
 await page.locator('.modal [data-fort-destination="waranCave2"]').click();
 await page.waitForFunction(()=>window.__patchQA.room()==='waranCave2');
 assert.equal(await page.locator('#fort-lift [data-fort-destination="waranCave2"]').isDisabled(),true);

 // Equipment's real effective stat multiplier appears alongside the held item.
 await page.evaluate(()=>window.__patchQA.stats());
 assert.match(await page.locator('.held-summary').innerText(),/Duelist Grip/);
 assert.match(await page.locator('.held-stat-list').innerText(),/Attack.*×1\.20/s);
 assert.equal(await page.locator('#summary-lead').isEnabled(),true);
 await page.locator('#summary-lead').click();
 assert.equal((await page.evaluate(()=>window.__patchQA.party()))[0],'qa-second');

 // Every selectable parent card has six markers and an accessible pre-selection detail action.
 await page.evaluate(()=>window.__patchQA.parents());
 await page.waitForSelector('.partner-card-meta .prodigy-pips');
 const first=page.locator('[data-breeding-parent="qa-first"]');
 assert.equal(await first.locator('.prodigy-pip').count(),6);
 assert.equal(await first.locator('.prodigy-pip.is-prodigy').count(),1);
 assert.match(await first.locator('.prodigy-pip.is-prodigy').getAttribute('title'),/Attack/);
 await page.locator('.summary-list').getByRole('button',{name:'Details'}).first().click();
 assert.match(await page.locator('.modal-header').innerText(),/Partner details/);
 fs.mkdirSync('build/qa',{recursive:true});
 await page.screenshot({path:'build/qa/fort-lift-prodigy-portrait.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS: visited-only lift, held item combat stats, first-party-slot action and six Prodigy markers.');
 await browser.close();
})().catch(err=>{console.error(err);process.exit(1)});
