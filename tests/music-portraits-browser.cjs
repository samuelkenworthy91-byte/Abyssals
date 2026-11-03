const http=require('node:http'),path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const server=http.createServer((req,res)=>{const file=path.join(process.cwd(),'dist',decodeURIComponent(new URL(req.url,'http://localhost').pathname));const target=file.endsWith('/')?file+'index.html':file;fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg'})[path.extname(target)]||'application/octet-stream');res.end(data);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 try{
 const page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{const NativeAudio=window.Audio;window.__musicElements=[];window.Audio=function(...args){const a=new NativeAudio(...args);window.__musicElements.push(a);return a;};});
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.__musicQA={boot(){closeDialogue();closeModal();setMotionPreference('reduced');selectSlot(1);const fixture=structuredClone(initialExpeditionState);Object.assign(fixture,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,departed:true,nextUnitId:9000,party:[newUnit(byId('568'),35)],sound:true});resumeSnapshot({state:fixture,room:'town',player:{x:25,y:18,facing:'up'},phaseElapsed:0,worldRandom:123});syncMusic();},async begin(kind){startWild({speciesId:kind==='practice'?'568':'569',level:35,phase:'NIGHT',seed:'music-bats'});battle.kind=kind;await battleArtReady(battle.player,battle.enemies[0]);battle.artReady=true;battle.sendOut=false;battle.busy=false;renderBattle();},end(){hideBattleSurface();},settings(){settingsMenu();},close(){closeModal();},hide(value){Object.defineProperty(document,'hidden',{configurable:true,value});document.dispatchEvent(new Event('visibilitychange'));},title(){state.begun=false;syncMusic();}};`});});
 await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__musicQA);await page.locator('body').click({position:{x:5,y:5}});await page.evaluate(()=>window.__musicQA.boot());
 const playing=()=>page.evaluate(()=>window.__musicElements.filter(a=>!a.paused).map(a=>({src:a.src,time:a.currentTime,loop:a.loop,error:a.error?.code})));
 await page.waitForFunction(()=>window.__musicElements.some(a=>!a.paused&&a.currentTime>.15));
 assert((await playing())[0].src.endsWith('adventure1.mp3'));assert((await playing())[0].loop);
 const adventureTime=(await playing())[0].time;
 for(const kind of ['wild','practice','trainer']){
  await page.evaluate(kind=>window.__musicQA.begin(kind),kind);
  await page.waitForFunction(()=>window.__musicElements.some(a=>a.src.endsWith('BattleTheme1.mp3')&&!a.paused&&a.currentTime>.1));
  assert.equal((await playing()).length,1,'battle replaces overworld');assert((await playing())[0].src.endsWith('BattleTheme1.mp3'));
  if(kind==='wild'||kind==='practice'){fs.mkdirSync('build/dossier-qa',{recursive:true});await page.screenshot({path:'build/dossier-qa/approved-'+(kind==='wild'?'carrionyx':'thimbril')+'-live-battle.png'});}
  await page.evaluate(()=>window.__musicQA.end());await page.waitForFunction(()=>window.__musicElements.some(a=>a.src.endsWith('adventure1.mp3')&&!a.paused));
 }
 assert((await playing())[0].time>=adventureTime,'overworld track resumes');
 await page.evaluate(()=>window.__musicQA.settings());await page.locator('#menu-sound').click();assert.equal((await playing()).length,0,'Sound off pauses music');await page.locator('#menu-sound').click();await page.waitForFunction(()=>window.__musicElements.some(a=>!a.paused));
 await page.evaluate(()=>window.__musicQA.hide(true));assert.equal((await playing()).length,0,'hidden page pauses');await page.evaluate(()=>window.__musicQA.hide(false));await page.waitForFunction(()=>window.__musicElements.some(a=>!a.paused));
 const portraits=await page.evaluate(async()=>{const results=[];for(const id of ['568','569']){const im=new Image();im.src='assets/'+id+'.webp';await im.decode();results.push({id,width:im.naturalWidth,height:im.naturalHeight});}return results;});
 assert(portraits.every(p=>p.width>=1200&&p.height>=1000),'native-resolution standalone artwork');
 assert.deepEqual(errors,[]);assert((await playing()).every(a=>!a.error));await page.evaluate(()=>window.__musicQA.title());assert.equal((await playing()).length,0);
 console.log('PASS: native bat portraits in real battle UI; actual MP3 decoding, looping, three battle modes, resumed traversal, sound toggle, hidden-page pause/resume and silent title.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
