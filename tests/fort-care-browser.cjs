// Test-only access is injected into the served response and never shipped.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const {expAward}=await import('../dist/progression.js');
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:720},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__fieldQA={
 fort(i){closeDialogue();closeModal();room=CAVE_FLOORS[i].room;player.x=6;player.y=17;state.fates['LDR-02']='SPARED';state.party[0].hp=1;state.party[0].status='POISON';state.party[0].moves[0].left=0;buildMarkers();fortCareDialogue();},
 careState:()=>({room,party:state.party.map(u=>u.uid),reserve:state.reserve.map(u=>u.uid),rested:state.party[0].hp===state.party[0].maxHp&&!state.party[0].status&&state.party[0].moves[0].left===state.party[0].moves[0].pp,point:state.lastPriestRest}),
 boot(level=60){if(battle)hideBattleSurface();closeDialogue();closeModal();presentationLocked=false;setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState),party=['010','025','004'].map((id,i)=>{const u=newUnit(byId(id),level);u.uid=['qa-first','qa-second','qa-observer'][i];return u;});Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,party,reserve:Array.from({length:25},()=>newUnit(byId('010'),20)),nextUnitId:10000,money:1000000,slowStews:5,sideAdventures:{fishing:{rod:true,lastEnteredDay:-1,contest:null}}});resumeSnapshot({state:fixture,room:'town',player:{x:24,y:20,facing:'up'},phaseElapsed:10000,worldRandom:123});},
 walter:aericMenu,close:closeModal,injure(){state.party[0].hp=1;},rested:()=>state.party[0].hp===state.party[0].maxHp,
 night(){room='anglersReach';phaseElapsed=GAME_DAY_MS*.75;lastClock=performance.now();fishingWarden();},clock(t){phaseElapsed=t;lastClock=performance.now();},fish:fishingWarden,
 keeper(){const e=nextFishingEncounter(state,lead(),phaseElapsed),u=newUnit(byId(e.speciesId),e.level);recordFishingCatch(state,u,e,phaseElapsed);persist();fishingWarden();},ready:()=>fishingReadyAt(state),
 load(){closeDialogue();closeModal();selectSlot(1);resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},
 startCapture(share){closeModal();state.binocularBattles=share?8:0;room='march';startWild({speciesId:'364',level:60,phase:'DAY'});battle.enemies[0].status='SLEEP';battle.enemies[0].statusTurns=6;},
 startDouble(){closeModal();room='relicGrove3';startRelicDouble();battle.alliedRivet.moves.forEach(m=>m.left=0);battle.enemies.forEach(u=>u.moves.forEach(m=>m.left=0));},
 battleReady:()=>!!battle&&!battle.busy&&!battle.sendOut,swap:()=>wildTurn({switchUid:'qa-second'}),
 capture(){battle.round=100;const e=battle.relicDouble?doubleLivingTargets(battle)[0].u:battle.enemies[0];battle.targetIndex=battle.enemies.indexOf(e);e.hp=1;e.status='SLEEP';e.statusTurns=6;return wildTurn({food:'slowStews'});},
 meta:()=>({target:battle.enemies[battle.targetIndex||0].level,allied:battle.alliedRivet?{uid:battle.alliedRivet.uid,level:battle.alliedRivet.level}:null,party:state.party.map(u=>({uid:u.uid,level:u.level}))}),
 pendingCapture:()=>battle?.outcome==='captured'&&!battle.rewardsCommitted,
 rewards:()=>({units:[...state.party,...state.reserve].map(u=>({uid:u.uid,id:u.species.id,exp:u.exp||0})),rows:state.rewardQueue.filter(c=>c.kind==='exp').map(c=>({uid:c.uid,amount:c.amount})),binoculars:state.binocularBattles}),
 floor(i){closeModal();room=CAVE_FLOORS[i].room;routeGuide();return areaRoute().tables.find(t=>t.phase===phaseAt(phaseElapsed)).slots.map(s=>({id:s.species_id,name:byId(s.species_id).name,weight:s.weight}));}
 };`});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__fieldQA);fs.mkdirSync('build/qa',{recursive:true});
 await page.setViewportSize({width:430,height:932});
 for(let i=0;i<5;i++){
  await page.evaluate(i=>{window.__fieldQA.boot();window.__fieldQA.fort(i);},i);
  assert((await page.locator('#dialogue').innerText()).includes('contacts with Walter'));
  await page.getByRole('button',{name:'Please heal my Abyssals.',exact:true}).click();
  assert((await page.evaluate(()=>window.__fieldQA.careState())).rested);
  assert.equal((await page.evaluate(()=>window.__fieldQA.careState())).point.room,'waranCave'+(i+1));
  await page.evaluate(i=>window.__fieldQA.fort(i),i);
  await page.getByRole('button',{name:'Swap party and reserve Abyssals.',exact:true}).click();
  const before=await page.evaluate(()=>window.__fieldQA.careState());
  await page.locator('[data-withdraw]').first().click();
  const after=await page.evaluate(()=>window.__fieldQA.careState());assert.equal(after.party.length,before.party.length+1);assert.equal(after.reserve.length,before.reserve.length-1);
  await page.evaluate(i=>window.__fieldQA.fort(i),i);
  await page.getByRole('button',{name:'Nursery and eggs.',exact:true}).click();
  assert(await page.locator('#nursery-pair').isEnabled());await page.locator('#nursery-pair').click();assert(await page.locator('[data-breeding-parent]').count()>1);
  await page.locator('[data-breeding-parent]').first().click();await page.locator('[data-breeding-parent]:not([disabled])').first().click();assert(await page.locator('#breed-confirm').isEnabled());await page.locator('#breed-confirm').click();assert((await page.locator('.egg-list').innerText()).includes('Egg 1'));
  await page.screenshot({path:'build/qa/fort-care-floor-'+(i+1)+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS: five floor healers heal, set return points, move reserves into party and create eggs on a portrait phone.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
