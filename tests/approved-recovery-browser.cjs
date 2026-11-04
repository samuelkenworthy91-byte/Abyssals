const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const fixture=String.raw`
window.__recoveryQA={
 async play(id,side,targetIndex=0){
  setMotionPreference('full');const b=battle,m=moveId(id),actor=side==='enemy'?b.enemies[1]:side==='ally'?b.alliedRivet:b.player;
  const target=side==='enemy'?b.alliedRivet:b.enemies[targetIndex];
  for(const u of [b.player,b.alliedRivet,...b.enemies]){u.species={...u.species,types:['NORMAL'],ability_names:{primary:'Plain'}};u.hp=u.maxHp=5000;u.stats={hp:5000,attack:50,sp_attack:50,defence:150,sp_defence:150,speed:100};u.stages={};u.status=null;u.confusion=0;u.heldItem=null;u.moveState={};}
  initializeBattleAbilities(b);renderBattle();const result=applyMove(actor,target,{...m,left:m.pp},()=>.25,{floor:0});holdBeforeImpact(result);
  const context={actor,target};const expected=['SELF','ACTIVE_SIDE'].includes(m.target)?actor:target;
  const {ACTION_ART}=await import('./action-vfx.js?v=0.90.53');const bounds=ACTION_ART[id].frameBounds;const seen=[];let saved='';const observer=new MutationObserver(()=>{const anchor=document.querySelector('#fx .fx-anchor'),node=anchor?.querySelector('[data-fx-move="'+id+'"]');if(!node)return;const r=battleUnitNode(expected)?.getBoundingClientRect(),v=document.querySelector('#viewport').getBoundingClientRect();const pixel=node.querySelector('.pixel-move-art').getBoundingClientRect(),visible=[pixel.left+bounds[0]/192*pixel.width-v.left,pixel.top+bounds[1]/192*pixel.height-v.top,pixel.left+bounds[2]/192*pixel.width-v.left,pixel.top+bounds[3]/192*pixel.height-v.top];seen.push({visible,viewport:[v.width,v.height],actor:anchor.dataset.fxActor,target:anchor.dataset.fxTarget,delta:r?[parseFloat(anchor.style.left)-(r.left+r.width/2-v.left),parseFloat(anchor.style.top)-(r.top+r.height/2-v.top)]:null});saved=anchor.outerHTML;});observer.observe(document.querySelector('#fx'),{subtree:true,childList:true});
  const start=performance.now();await animateResult(side,result,m,context);observer.disconnect();
  // Keep a labelled, paused impact rendering after real playback has completed,
  // so screenshot latency cannot capture an already-cleared effect container.
  document.querySelector('#fx').innerHTML=saved;const art=document.querySelector('#fx .pixel-move-art'),animation=art?.getAnimations()[0];if(animation){animation.pause();animation.currentTime=Number(animation.effect.getTiming().duration)*.5;}
  return {id,side,targetIndex,seen,expected:expected.uid,actor:actor.uid,elapsed:performance.now()-start,hitCount:result.hitCount,remainingFx:!!saved,field:actor.field};
 },clear(){document.querySelector('#fx').innerHTML='';}
};`;
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+'\n'+fs.readFileSync('tests/finale-fixture.js','utf8')+'\n'+fixture});});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__recoveryQA);
 await page.evaluate(()=>{window.__fnQA.boot('sporeCrown');window.__fnQA.startDouble();});await page.waitForSelector('[data-double-menu="fight"]:not([disabled])');
 fs.mkdirSync('build/qa/recovery',{recursive:true});const results=[];
 for(const width of [390,1280]){await page.setViewportSize({width,height:width===390?844:900});
 for(const [id,side,index]of [[162,'enemy',0],[196,'enemy',0],[199,'enemy',0],[374,'enemy',0],[71,'ally',0],[738,'enemy',0],[710,'player',1],[810,'player',1]]){
  const r=await page.evaluate(async ([id,side,index])=>Promise.race([window.__recoveryQA.play(id,side,index),new Promise((_,reject)=>setTimeout(()=>reject(Error('Playback froze '+id)),15000))]),[id,side,index]);
  assert(r.seen.length,'actual animation rendered '+id);for(const seen of r.seen){assert.equal(seen.actor,r.actor);assert.equal(seen.target,r.expected);assert(seen.delta?.every(x=>Math.abs(x)<1),'actual recipient anchor '+id);assert(seen.visible[0]>=3&&seen.visible[1]>=3&&seen.visible[2]<=seen.viewport[0]-3&&seen.visible[3]<=seen.viewport[1]-3,'unclipped frame bounds '+id+' '+JSON.stringify(seen));}
  if(id===738)assert.equal(r.hitCount,2);assert(Number.isFinite(r.elapsed)&&r.elapsed<15000);results.push({...r,width});
  await page.screenshot({path:'build/qa/recovery/paused-impact-'+id+'-'+side+'-'+width+'.png'});await page.evaluate(()=>window.__recoveryQA.clear());
 }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);fs.writeFileSync('build/qa/recovery/playback.json',JSON.stringify({results,errors,missing,screenshots:'Paused impact rendered after completed real playback; screenshots are not proof of full motion.'},null,2));
 await browser.close();console.log('PASS: enemy/player/ally actual playback, physical/special/self, weather/terrain, two-hit move, Mercy Ray, Nectarbane and exact double recipient anchors.');
})().catch(e=>{console.error(e);process.exit(1)});
