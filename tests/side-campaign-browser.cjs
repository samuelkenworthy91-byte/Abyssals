const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox']});
 const errors=[];let page,stageLabel='game start';
 try{
  page=await browser.newPage({viewport:{width:430,height:932},hasTouch:true,serviceWorkers:'block'});
  page.on('pageerror',error=>errors.push(error.message));
  await page.route(/\/app\.js(?:\?.*)?$/,async route=>{
   const response=await route.fetch();
   await route.fulfill({response,body:await response.text()+`
const renderedLecterns=new Set();
const originalFillRect=ctx.fillRect.bind(ctx);
ctx.fillRect=(x,y,w,h)=>{
 if(ctx.fillStyle==='#b8ad78'&&x===-9&&y===-26&&w===19&&h===8)renderedLecterns.add(room);
 originalFillRect(x,y,w,h);
};
window.campaignQA={
 inventory:()=>SIDE_CAMPAIGNS.flatMap(c=>[0,1,2].map(stage=>[c.key,campaignRoom(c,stage),stage])),
 boot(key,target,stage){
  closeDialogue();closeModal();setMotionPreference('reduced');selectSlot(1);
  const fixture=structuredClone(initialExpeditionState);
  Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,test:true,departed:true,nextUnitId:2,party:[newUnit(byId('004'),80)],escortSteps:500});
  const c=SIDE_CAMPAIGNS.find(c=>c.key===key);
  campaignState(fixture,c).accepted=true;
  resumeSnapshot({state:fixture,room:target,player:{x:3,y:17,facing:'right'},phaseElapsed:0,worldRandom:123});
  trainerGrace=performance.now()+30000;
  const spot=spots.find(s=>s.id==='sc-'+key+'-clue-'+stage);
  const direction=Object.entries(dirs).find(([, [dx,dy]])=>{
   const x=spot.x-dx,y=spot.y-dy;
   return !blocked(x,y)&&pathfind([3,17],[x,y],blocked,...roomGrid(room)).length;
  });
  if(!direction)throw Error('No reachable clue approach: '+target+' '+spot.id);
  const [facing,[dx,dy]]=direction;
  setPlayer(spot.x-dx,spot.y-dy,facing);
  return spot.id;
 },
 target:()=>closestInteract()?.id,
 location:()=>room,
 atGate(stage,defeated){
  closeDialogue();closeModal();
  if(defeated)state.defeatedTrainers.push(campaignGuard(campaignArea(room).c,stage));
  setPlayer(43,17,'right');
 },
 close:closeDialogue,
 rendered:room=>renderedLecterns.has(room),
 visible(id){
  const spot=spots.find(s=>s.id===id),rect=canvas.getBoundingClientRect();
  const x=Math.round((view.ox+spot.x*16*view.scale)*canvas.width/rect.width);
  const y=Math.round((view.oy+(spot.y*16-10)*view.scale)*canvas.height/rect.height);
  const {data}=ctx.getImageData(x-1,y-1,3,3);
  return Array.from({length:9},(_,n)=>n*4).some(n=>data[n]===184&&data[n+1]===173&&data[n+2]===120&&data[n+3]===255);
 },
 point(id){
  const spot=spots.find(s=>s.id===id),rect=canvas.getBoundingClientRect();
  return {x:rect.left+view.ox+(spot.x*16+8)*view.scale,y:rect.top+view.oy+(spot.y*16-5)*view.scale};
 },
 read(key,stage){return state.sideCampaigns[key].clues.includes(stage);},
 saved(key,stage){return JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')).state.sideCampaigns[key].clues.includes(stage);},
 clearRead(key){state.sideCampaigns[key].clues=[];},
 atMechanism(key){
  closeDialogue();
  const control=spots.find(s=>s.id==='sc-'+key+'-mechanism-0');
  const direction=Object.entries(dirs).find(([, [dx,dy]])=>!blocked(control.x-dx,control.y-dy));
  const [facing,[dx,dy]]=direction;
  setPlayer(control.x-dx,control.y-dy,facing);
 },
 solved(key){return JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')).state.sideCampaigns[key].solved;},
 async crossingBoot(){this.boot('marchMeadow','marchMeadow',0);await warp(CROSSING_ROOM,...CROSSING_ENTRY,'up');},
 crossingSnapshot(){return {room,x:player.x,y:player.y,...crossingState(state),cost:[state.escortSteps,state.money,state.party.map(unit=>unit.hp),state.dead.length]};},
 restoreCrossing(){resumeSnapshot(JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')));},
 tile(x,y){
  const rect=canvas.getBoundingClientRect();
  return [rect.left+view.ox+(x*16+8)*view.scale,rect.top+view.oy+(y*16+8)*view.scale];
 }


};`});
  });
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.campaignQA);
  const {expeditionMechanisms,mechanismPath}=await import('../dist/side-campaign-mechanisms.js');
  const inventory=await page.evaluate(()=>campaignQA.inventory());
  fs.mkdirSync('build/qa',{recursive:true});
  for(const [key,room,stage] of inventory){
   stageLabel=room;
   const id=await page.evaluate(([key,room,stage])=>campaignQA.boot(key,room,stage),[key,room,stage]);
   assert.equal(await page.evaluate(()=>campaignQA.target()),id,room+' A target');
   await page.waitForFunction(room=>campaignQA.rendered(room),room,{timeout:4000});
   if(key==='marchMeadow'&&stage===0)await page.waitForFunction(id=>campaignQA.visible(id),id,{timeout:4000});
   if(stage===0&&['marchMeadow','relicCrags','anglersReach'].includes(key)){
    await page.locator('#viewport').screenshot({path:'build/qa/side-clue-'+room+'.png'});
   }
   await page.locator('#console-a').tap();
   await page.waitForFunction(([key,stage])=>campaignQA.read(key,stage),[key,stage],{timeout:4000});
   assert(await page.evaluate(([key,stage])=>campaignQA.saved(key,stage),[key,stage]),room+' A saved');
   await page.evaluate(key=>{campaignQA.close();campaignQA.clearRead(key);},key);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const point=await page.evaluate(id=>campaignQA.point(id),id);
   await page.touchscreen.tap(point.x,point.y);
   await page.waitForFunction(([key,stage])=>campaignQA.read(key,stage),[key,stage],{timeout:4000});
   assert(await page.evaluate(([key,stage])=>campaignQA.saved(key,stage),[key,stage]),room+' canvas tap saved');
   if(stage===1&&expeditionMechanisms[key]){
    const definition=expeditionMechanisms[key];
    await page.evaluate(key=>campaignQA.atMechanism(key),key);
    await page.locator('#console-a').tap();
    const artwork=page.locator('.expedition-mechanism-art');
    await artwork.waitFor();
    await page.waitForFunction(()=>document.querySelector('.expedition-mechanism-art')?.naturalWidth>0);
    if(['marchMeadow','stormBluffs','smugglersWeir','anglersReach'].includes(key)){
     await page.locator('#modal-root .modal').screenshot({path:'build/qa/expedition-mechanism-'+key+'.png'});
    }
    for(const n of mechanismPath(definition,definition.initial))await page.locator('[data-sc-control="'+n+'"]').tap();
    assert(await page.evaluate(key=>campaignQA.solved(key),key),room+' mechanism solved and saved');
    await page.locator('#modal-root').getByText('Route restored',{exact:true}).waitFor();
   }
   if(stage<2){
    await page.evaluate(stage=>campaignQA.atGate(stage,false),stage);
    await page.locator('#console-a').tap();
    await page.locator('#dialogue').getByText(/win the challenge/i).waitFor();
    assert.equal(await page.evaluate(()=>campaignQA.location()),room,room+' remains gated before the warden is defeated');
    await page.evaluate(stage=>campaignQA.atGate(stage,true),stage);
    await page.locator('#console-a').tap();
    await page.waitForFunction(next=>campaignQA.location()===next,key+'Trail'+(stage+2),{timeout:4000});
    await page.locator('#world-warp').waitFor({state:'hidden'});
   }
   console.log('PASS',room,id,'A and canvas tap');
  }
  stageLabel='Windscar Mist Crossing';
  const {CROSSING_EXIT,crossingRoute}=await import('../dist/invisible-crossing.js');
  await page.evaluate(()=>campaignQA.crossingBoot());
  const initial=await page.evaluate(()=>campaignQA.crossingSnapshot());
  await page.locator('#viewport').screenshot({path:'build/qa/windscar-mist-crossing-entry.png'});
  assert.equal(initial.room,'passSummit');
  const route=crossingRoute(initial.seed);
  async function tapTile(cell){await page.touchscreen.tap(...await page.evaluate(cell=>campaignQA.tile(...cell),cell));}
  async function at(cell){await page.waitForFunction(([x,y])=>{const p=campaignQA.crossingSnapshot();return p.x===x&&p.y===y;},cell);}
  await tapTile(route[2]);
  assert.equal((await page.evaluate(()=>campaignQA.crossingSnapshot())).discoveredSafeCells.length,0);
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(50);
  await page.keyboard.up('ArrowUp');
  await at(route[0]);
  await tapTile([4,9]);await at([5,10]);
  const fell=await page.evaluate(()=>campaignQA.crossingSnapshot());
  assert.equal(fell.falls,1);
  assert.equal(fell.discoveredSafeCells.length,1);
  assert.deepEqual(fell.cost,initial.cost,'fall consumed no HP, supplies or lives');
  await tapTile(route[0]);await at(route[0]);
  await page.evaluate(()=>campaignQA.restoreCrossing());
  await at([5,10]);
  assert.equal((await page.evaluate(()=>campaignQA.crossingSnapshot())).discoveredSafeCells.length,1);
  for(const cell of [...route,CROSSING_EXIT]){await tapTile(cell);await at(cell);}
  assert((await page.evaluate(()=>campaignQA.crossingSnapshot())).solved);
  await page.locator('#viewport').screenshot({path:'build/qa/windscar-mist-crossing.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS',inventory.length,'mobile reading props via both inputs and save persistence');
 }catch(error){
  console.error('Browser stage:',stageLabel,'Page errors:',errors);
  if(page){fs.mkdirSync('build/qa',{recursive:true});await page.screenshot({path:'build/qa/expedition-check-failure.png',timeout:4000}).catch(()=>{});}
  throw error;
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
