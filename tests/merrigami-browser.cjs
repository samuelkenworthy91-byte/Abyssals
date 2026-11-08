const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');

(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route(/\/app\.js(?:\?.*)?$/,async route=>{
   const response=await route.fetch();
   await route.fulfill({response,body:await response.text()+`
window.__merrigami={
 boot(){
  const fixture=structuredClone(initialExpeditionState);
  Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,blessing:true,test:true,departed:true,nextUnitId:9000,playerName:'Fox',party:[newUnit(byId('574'),33)]});
  selectSlot(1);resumeSnapshot({state:fixture,room:'burrowHollow',player:{x:10,y:15,facing:'right'},phaseElapsed:0,worldRandom:123});
  closeDialogue();closeModal();setMotionPreference('full');
  return combatArtReady('574');
 },
 async start(){
  await startWild({speciesId:'001',level:30,phase:'DAY',seed:'merrigami-browser'});
  const a=battle.player,b=battle.enemies[0];
  b.species={...b.species,types:['FIGHTING'],abilities:{}};
  for(const u of [a,b]){
   u.hp=u.maxHp=2000;
   u.stats={hp:2000,attack:50,defence:100,sp_attack:100,sp_defence:100,speed:u===a?150:50};
  }
  a.moves=[465,811].map(id=>({...moveId(id),left:10}));
  b.moves=[{...moveId(1),left:30}];
  battle.random=Object.assign(()=>.5,{state:()=>123});
  renderBattle();
 },
 inspect(){return {busy:battle?.busy,stage:battle?.player.stages.sp_attack,targetHP:battle?.enemies[0].hp,log:battle?.log};}
};`});
  });
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__merrigami);
  assert(await page.evaluate(()=>window.__merrigami.boot()));
  await page.evaluate(()=>window.__merrigami.start());
  const inspect=()=>page.evaluate(()=>window.__merrigami.inspect());
  const select=async index=>{
   const fight=page.locator('[data-battle-menu="fight"]');
   if(await fight.count())await fight.click();
   await page.locator('[data-move="'+index+'"]').click();
  };
  const ready=()=>page.waitForFunction(()=>!window.__merrigami.inspect().busy,{},{timeout:30000});
  await page.evaluate(()=>{
   const check=window.__merrigami;
   check.ancestralCueShown=false;
   const observer=new MutationObserver(records=>{
    for(const record of records)for(const node of record.addedNodes){
     if(!node.querySelector?.('.ancestral-aid-glint'))continue;
     check.ancestralCueShown=true;
     observer.disconnect();
     return;
    }
   });
   observer.observe(document.querySelector('#fx'),{childList:true});
  });
  await select(0);
  await ready();
  assert(await page.evaluate(()=>window.__merrigami.ancestralCueShown),'Ancestral Aid glyph played');
  assert.equal((await inspect()).stage,1);
  const before=(await inspect()).targetHP;
  await select(1);
  const slash=page.locator('[data-action-art="phantom-falchion"][data-phantom-charge="gathered"]');
  await slash.waitFor({state:'attached'});
  assert(!(await inspect()).log.includes('spent its positive stat stages'));
  assert((await slash.locator('i').evaluate(el=>getComputedStyle(el).backgroundImage)).includes('811-phantom-falchion.png'));
  if(process.env.MERRIGAMI_QA_SCREENSHOT){
   fs.mkdirSync('build/merrigami-qa',{recursive:true});
   await page.waitForTimeout(500);
   await page.screenshot({path:'build/merrigami-qa/phantom-falchion-phone.png'});
  }
  await ready();
  assert.equal((await inspect()).stage,0);
  assert((await inspect()).targetHP<before);
  assert.deepEqual(errors,[]);
  console.log('PASS: Merrigami battle portrait loads and Ancestral Aid and Phantom Falchion play through the phone battle UI.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
