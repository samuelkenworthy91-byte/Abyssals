const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`
 window.__prodigyQA={
 boot(){closeDialogue();closeModal();setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState);Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,party:[newUnit(byId('003'),90)],money:100000,nextUnitId:900});resumeSnapshot({state:fixture,room:'sunTerraces',player:{x:3,y:17,facing:'right'},phaseElapsed:0,worldRandom:43});},
 challenge(){challengeTrainer(EXPANSION.trainers.find(t=>t.id==='TRN-FN-TERRACE'));},
 advance(){nextLine();},
 read(){return {battle:!!battle,ready:!!battle&&!battle.busy,enemies:(battle?.enemies||[]).map(u=>({uid:u.uid,name:u.species.name,stats:u.stats,inheritance:u.breedingInheritance,history:u.evolutionHistory}))};},
 reload(){resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},
 summary(){hideBattleSurface();closeDialogue();const u=state.party[0];u.breedingInheritance={version:2,speciesId:'001',donorIndex:1,growth:{stat:'attack',baseline:40,donorRate:90,rate:90},lineageGrowth:[],moveId:null};u.evolutionHistory=[{from:'001',to:'002',level:20},{from:'002',to:'003',level:40}];partnerSummary(u.uid);document.querySelector('#summary-flip').click();}
 };`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__prodigyQA);await page.evaluate(()=>window.__prodigyQA.boot());
 await page.evaluate(()=>{window.__prodigyQA.challenge();window.__prodigyQA.advance();});
 const warning=await page.locator('#dialogue').innerText();assert(warning.includes('Warning:'));assert(warning.includes('Greymaw'));assert(warning.includes('Prodigy'));assert(!(await page.evaluate(()=>window.__prodigyQA.read())).battle,'warning precedes battle creation');
 fs.mkdirSync('build/qa',{recursive:true});await page.screenshot({path:'build/qa/prodigy-warning-phone.png'});
 // The warning must fit in the scrollable dialogue and leave both choices usable.
 await page.getByRole('button',{name:'Not yet',exact:true}).click();assert(!(await page.evaluate(()=>window.__prodigyQA.read())).battle);
 await page.evaluate(()=>{window.__prodigyQA.challenge();window.__prodigyQA.advance();});assert.equal(await page.locator('#dialogue').innerText(),warning);
 await page.getByRole('button',{name:'Begin the challenge',exact:true}).click();await page.waitForFunction(()=>window.__prodigyQA.read().ready);
 const before=await page.evaluate(()=>window.__prodigyQA.read()),prodigies=before.enemies.filter(u=>u.inheritance);assert.equal(prodigies.length,1);assert.equal(prodigies[0].name,'Greymaw');assert(prodigies[0].history.length>0);assert.equal(prodigies[0].inheritance.growth.rate-prodigies[0].inheritance.growth.baseline,25);
 await page.evaluate(()=>window.__prodigyQA.reload());await page.waitForFunction(()=>window.__prodigyQA.read().ready);assert.deepEqual((await page.evaluate(()=>window.__prodigyQA.read())).enemies,before.enemies,'reload keeps exact enemy stats and inheritance');
 await page.evaluate(()=>window.__prodigyQA.summary());assert((await page.locator('#modal-root').innerText()).includes('original bonus +50 × 3 = +150'));await page.screenshot({path:'build/qa/prodigy-growth-phone.png'});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS phone: named pre-battle warning, decline/retry, actual Prodigy opponent, exact battle save/reload and stacked growth summary');
})().catch(e=>{console.error(e);process.exit(1)});
