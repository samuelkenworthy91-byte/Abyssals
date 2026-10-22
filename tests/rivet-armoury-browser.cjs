// Exercise the shipped UI and artwork; fixture access exists only in this served test response.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
let phase='launch';
const watchdog=setTimeout(()=>{console.error('Rivet browser check stalled at: '+phase);process.exit(1);},120000);watchdog.unref();
const progress=name=>{phase=name;console.log('Rivet QA: '+name);};
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__rivetQA={
 boot(){closeDialogue();closeModal();setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState);Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,nextUnitId:1000,money:300000,party:[newUnit(byId('365'),12)],relicQuest:{bellRestored:true,coreClaimed:null,rescued:true,fragments:['relic-bell-1','relic-bell-2','relic-bell-3']}});resumeSnapshot({state:fixture,room:'relicGrove',player:{x:10,y:9,facing:'up'},phaseElapsed:0,worldRandom:123});},
 choose:questCoreMenu,shop:bellCoreShop,close:closeModal,bag:()=>bagMenu('evolution'),
 meta:()=>({id:state.party[0].species.id,cores:{...state.evolutionItems},money:state.money,queue:state.rewardQueue.map(r=>r.kind)}),
 reload(){closeDialogue();closeModal();selectSlot(1);resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},
 async art(){const ids=RELIC_BRANCHES.flatMap(b=>b.ids).filter(id=>+id>=480);for(const id of ids){const ok=await combatArtReady(id);if(!ok)throw Error('Art unavailable '+id);}return ids.map(id=>({id,src:combatArtSrc(id)}));},
 final(){closeModal();state.rewardQueue=[];state.party[0].level=36;state.party[0].evolutionBlockedLevel=12;state.rewardQueue=[{kind:'evolve',uid:state.party[0].uid}];showRewards();}
 };`});});
 progress('boot and core choices');
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__rivetQA);await page.evaluate(()=>window.__rivetQA.boot());
 await page.evaluate(()=>window.__rivetQA.choose());assert.equal(await page.locator('[data-quest-core]').count(),18);
 await page.locator('[data-quest-core="ITEM_RELIC_NORMAL"]').scrollIntoViewIfNeeded();await page.locator('[data-quest-core="ITEM_RELIC_NORMAL"]').click();await page.locator('#core-confirm').click();
 assert.equal((await page.evaluate(()=>window.__rivetQA.meta())).cores.ITEM_RELIC_NORMAL,1);
 progress('shop and reload');
 await page.evaluate(()=>window.__rivetQA.shop());assert.equal(await page.locator('[data-buy-core]').count(),18);
 await page.locator('[data-buy-core="ITEM_RELIC_FAIRY"]').scrollIntoViewIfNeeded();await page.locator('[data-buy-core="ITEM_RELIC_FAIRY"]').click();await page.locator('#core-buy-confirm').click();
 assert.equal((await page.evaluate(()=>window.__rivetQA.meta())).cores.ITEM_RELIC_FAIRY,1);
 await page.evaluate(()=>window.__rivetQA.reload());assert.equal((await page.evaluate(()=>window.__rivetQA.meta())).cores.ITEM_RELIC_FAIRY,1);
 progress('item evolution cancellation');
 await page.evaluate(()=>window.__rivetQA.bag());await page.locator('[data-evolution-item="ITEM_RELIC_NORMAL"]').click();await page.locator('[data-relic-unit]').click();
 await page.locator('#cancel-evolution').click();assert.equal((await page.evaluate(()=>window.__rivetQA.meta())).id,'365');assert.equal((await page.evaluate(()=>window.__rivetQA.meta())).cores.ITEM_RELIC_NORMAL,1);
 await page.evaluate(()=>window.__rivetQA.bag());await page.locator('[data-evolution-item="ITEM_RELIC_NORMAL"]').click();await page.locator('[data-relic-unit]').click();
 await page.waitForFunction(()=>window.__rivetQA.meta().id==='482');assert.equal((await page.evaluate(()=>window.__rivetQA.meta())).cores.ITEM_RELIC_NORMAL,0);
 progress('final evolution');
 await page.evaluate(()=>window.__rivetQA.final());await page.waitForFunction(()=>window.__rivetQA.meta().id==='483');
 fs.mkdirSync('build/qa',{recursive:true});await page.screenshot({path:'build/qa/rivet-carillodon-evolution.png'});
 progress('decode all new sprites');
 const art=await page.evaluate(()=>window.__rivetQA.art());assert.equal(art.length,24);
 for(const a of art)assert(a.src.startsWith('data:image/png'),'framed sprite '+a.id);
 const decoded=await page.evaluate(async art=>{const result=[];for(const a of art){const im=new Image();im.src=a.src;await im.decode();result.push([a.id,im.naturalWidth,im.naturalHeight]);}return result;},art);
 for(const [id,w,h]of decoded)assert(w>50&&h>50&&w<=512&&h<=512,'valid frame '+id);
 progress('full family reference page');
 await page.goto((process.env.TEST_URL||'http://127.0.0.1:8765')+'/relic-family.html',{waitUntil:'networkidle'});
 assert.equal(await page.locator('#branches > section').count(),18);
 await page.waitForFunction(()=>[...document.querySelectorAll('[data-art]')].every(i=>i.complete&&i.naturalWidth>0&&i.src.startsWith('data:image/png')));
 assert.equal(await page.locator('[data-art]').count(),37);assert.equal(await page.locator('body').evaluate(e=>e.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await browser.close();clearTimeout(watchdog);
 console.log('PASS: phone core choices/shop/reload, real bag cancellation and consumed-core evolution, final evolution, all 24 new framed sprites and complete 18-branch reference page.');
})().catch(e=>{console.error(e);process.exit(1);});
