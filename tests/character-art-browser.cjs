const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&/\/assets\//.test(r.url()))missing.push(r.url());});
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__characterQA={boot(){closeDialogue();closeModal();setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState);Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,nextUnitId:2,money:10000,party:[newUnit(byId('004'),65)]});resumeSnapshot({state:fixture,room:'anglersReach',player:{x:24,y:17,facing:'up'},phaseElapsed:0,worldRandom:123});},async companion(id,shiny=false){const u=newUnit(byId(id),20);u.shiny=shiny;u.nickname='Osiris';state.party=[u];state.leadUid=u.uid;setPlayer(24,17,'up');syncCompanion(companion,u,player,room,blocked);companion.visible=true;companion.x=24;companion.y=18;companion.step=null;companionConversation();},postFight(id){hideBattleSurface();closeDialogue();state.rewardQueue=[];state.rewardHandoff={kind:'trainer',id};showRewards();},dialogue(id){closeDialogue();showDialogue([line('Test trainer','Portrait check',id)]);},async intro(id){closeDialogue();closeModal();const t=EXPANSION.trainers.find(t=>t.id===id);battle={kind:'wild',trainer:t,total:1,index:0,player:lead(),enemies:[newUnit(byId('004'),20)],round:1,history:[],participants:[lead().uid],defeats:[],busy:true,finished:false,phase:'trainer',artReady:true,log:'Preparing a first Abyssal.'};await battleArtReady(battle.player,...battle.enemies);showBattleSurface();renderBattle();},close(){closeDialogue();hideBattleSurface();},stale(){const u=newUnit(byId('447'),20);u.shiny=true;showDialogue([{speaker:'Osiris',text:'First line',abyssalId:'447',abyssalUnit:u},line('Next speaker','No portrait here')]);nextLine();}};`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__characterQA);await page.evaluate(()=>window.__characterQA.boot());
 fs.mkdirSync('build/qa',{recursive:true});
 for(const [id,shiny] of [['365',false],['376',false],['447',false],['004',true]]){
  await page.evaluate(({id,shiny})=>window.__characterQA.companion(id,shiny),{id,shiny});
  await page.waitForFunction(()=>{const i=document.querySelector('.dialogue-creature-art');return i?.complete&&i.naturalWidth>0&&i.src.startsWith('data:image/png');});
  assert((await page.locator('.speaker').innerText()).includes('Osiris'));
  await page.screenshot({path:'build/qa/companion-'+id+(shiny?'-shiny':'')+'.png'});
  await page.evaluate(()=>window.__characterQA.close());
 }
 await page.evaluate(()=>window.__characterQA.stale());await page.waitForTimeout(200);
 assert.equal(await page.locator('.speaker').innerText(),'Next speaker');assert.equal(await page.locator('.dialogue-creature-art').count(),0);
 await page.evaluate(()=>window.__characterQA.postFight('TRN-MR-HUGH'));
 await page.waitForFunction(()=>{const i=document.querySelector('.dialogue-bust img');return i?.complete&&i.naturalWidth>0;});
 assert((await page.locator('.dialogue-bust img').getAttribute('src')).includes('REV-HUGH.webp'));
 await page.screenshot({path:'build/qa/post-fight-mapped-portrait.png'});
 for(const id of ['TRN-MR-ROAD-0','TRN-MR-GATE','TRN-BT-GUARD-1','LDR-05','LDR-06']){
  await page.evaluate(id=>window.__characterQA.intro(id),id);
  await page.waitForFunction(()=>{const i=document.querySelector('.trainer-intro-art img');return i?.complete&&i.naturalWidth>0;});
  assert((await page.locator('.trainer-intro-art img').getAttribute('src')).includes(id==='LDR-05'?'LDR-05-battle':id));
  await page.screenshot({path:'build/qa/full-body-'+id+'.png'});
  await page.evaluate(()=>window.__characterQA.close());
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 console.log('PASS: real atlas and shiny companion conversations, stale async speaker protection, actual post-fight handoff, restored full-body trainer introductions and both leader designs without missing images');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
