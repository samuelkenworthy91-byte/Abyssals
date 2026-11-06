const http=require('node:http'),path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const root=process.cwd(),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.mp3':'audio/mpeg','.m4a':'audio/mp4'};
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),relative=decodeURIComponent(url.pathname).slice(1),target=path.join(root,relative.startsWith('music-m4a/')?relative:'dist/'+(relative||'index.html'));fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const results={};fs.mkdirSync('build/music-qa',{recursive:true});
 try{
 const page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block',reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{const Native=Audio;window.__audios=[];window.Audio=function(...args){const a=new Native(...args);window.__audios.push(a);return a;};});
 await page.route(/\/app\.js(?:\?.*)?$/,async route=>{const response=await route.fetch();await route.fulfill({response,body:`import {MUSIC_TRACKS} from './music.js?v=0.90.54';\n`+await response.text()+`\nwindow.__soundtrackQA={
 boot(){selectSlot(1);closeDialogue();closeModal();const f=structuredClone(initialExpeditionState);Object.assign(f,{begun:true,openingDone:true,tamingTaught:true,pate:true,trade:true,kurg:true,departed:true,nextUnitId:9000,party:[newUnit(byId('568'),100)],sound:true,fates:{'LDR-05':'SPARED'},botrune:{version:1,cursor:0,phase:'trial',witnesses:[],keepsakes:false}});resumeSnapshot({state:f,room:'town',player:{x:25,y:18,facing:'up'},phaseElapsed:0,worldRandom:123});},
 go:async r=>{closeDialogue();closeModal();await warp(r,24,24,'up');},state:()=>JSON.parse(JSON.stringify(state)),
 guard(id){startRouteTrainer(BOTRUNE_GUARDS.find(t=>t.id===id));return battle?.trainer?.id;},endGuard(id){hideBattleSurface();state.defeatedTrainers.push(id);persist();refresh();},
 leader(){startRouteTrainer(BOTRUNE_TRAINERS.find(t=>t.id==='LDR-06'));},
 reload(){selectSlot(1);closeDialogue();closeModal();botruneSceneBusy=false;finaleSceneBusy=false;resumeSnapshot(readSave(1));},
 data:()=>({guards:BOTRUNE_GUARDS.map(t=>t.id),tracks:MUSIC_TRACKS}),
 hide(hidden){Object.defineProperty(document,'hidden',{configurable:true,value:hidden});document.dispatchEvent(new Event('visibilitychange'));},
 settle(){hideBattleSurface();state.fates['LDR-06']='SPARED';botruneState(state).phase='settled';botruneState(state).walterCalmed=true;persist();refresh();},
 mountainDone(){stormState(state).darius.outcome='captured';refresh();},
 darius(){showDialogue([line('Darius','A controlled conversation.','REV-DARIUS')]);},endDialogue(){closeDialogue();},
 settings(){settingsMenu();},close(){closeModal();},ready:()=>!presentationLocked&&!botruneSceneBusy,
 snapshot(){persist();},title(){state.begun=false;syncMusic();}
 };`});});
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__soundtrackQA);await page.locator('body').click({position:{x:5,y:5}});await page.evaluate(()=>__soundtrackQA.boot());
 const playing=()=>page.evaluate(()=>__audios.filter(a=>!a.paused).map(a=>({src:a.src,time:a.currentTime,error:a.error?.code})));
 const routeFiles=['adventure1.mp3','route-catching-up.m4a','adventure05-where-the-sky-meets-the-sea.m4a','adventure06-beneath-a-restless-heaven.m4a','adventure07-the-unseen-presence.m4a','adventure08-the-emerald-apocalypse.m4a'];
 const expectTrack=async file=>{if(file==='route-catching-up.m4a'){await page.waitForFunction(files=>__audios.some(a=>files.some(f=>a.src.endsWith(f))&&!a.paused&&a.currentTime>.03),routeFiles);const a=await playing();assert.equal(a.length,1);assert(routeFiles.some(f=>a[0].src.endsWith(f)));return a[0].time;}await page.waitForFunction(file=>window.__audios.some(a=>a.src.endsWith(file)&&!a.paused&&a.currentTime>.03),file);const a=await playing();assert.equal(a.length,1,'exactly one soundtrack player');assert(a[0].src.endsWith(file),JSON.stringify(a));assert(!a[0].error);return a[0].time;};
 await expectTrack('route-journey-across-the-realm.mp3');
 for(const [room,file]of Object.entries({dorelem:'town-dorelem.mp3',philomere:'town-philomere.mp3',cybressa:'town-cybressa.mp3',cossenne:'town-cossenne.mp3',botruneLower:'route-ancient-shadows.mp3',cayfen:'town-cayfen.mp3',ramelle:'town-ramelle.mp3',marasen:'adventure1.mp3',town:'route-journey-across-the-realm.mp3'})){await page.evaluate(r=>__soundtrackQA.go(r),room);await expectTrack(file);}
 await page.evaluate(()=>__soundtrackQA.go('cayfen'));const cityTime=await expectTrack('town-cayfen.mp3');await page.evaluate(()=>__soundtrackQA.go('cayfenGallery'));assert(await expectTrack('town-cayfen.mp3')>=cityTime,'interiors preserve position');
 await page.evaluate(()=>__soundtrackQA.go('sunBank'));await expectTrack('route-catching-up.m4a');const sideTrack=(await playing())[0];await page.evaluate(()=>__soundtrackQA.go('sporeRim'));await expectTrack('route-catching-up.m4a');assert.equal((await playing())[0].src,sideTrack.src);assert((await playing())[0].time>=sideTrack.time);
 await page.evaluate(()=>__soundtrackQA.go('cossenne'));await page.evaluate(()=>__soundtrackQA.darius());await expectTrack('character-darius-idealists-burden.mp3');await page.evaluate(()=>__soundtrackQA.endDialogue());await expectTrack('town-cossenne.mp3');
 for(const room of ['stormDariusCamp','stormDariusRidge','stormDariusCrown']){await page.evaluate(r=>__soundtrackQA.go(r),room);await expectTrack('event-darius-descent.mp3');}
 await page.evaluate(()=>__soundtrackQA.mountainDone());await expectTrack('route-catching-up.m4a');
 await page.evaluate(()=>__soundtrackQA.go('botrune'));let executionTime=await expectTrack('event-pate-trade-execution.mp3');
 // Advance the real nine-beat execution via its actual dialogue controls.
 while((await page.evaluate(()=>__soundtrackQA.state())).botrune.phase==='trial'){
  const button=page.locator('#next-line');await button.waitFor();await button.click();
  assert(await expectTrack('event-pate-trade-execution.mp3')>=executionTime);executionTime=(await playing())[0].time;
 }
 console.log('PASS: towns/interiors/routes/Darius/mountain and all nine execution beats.');await page.waitForFunction(()=>__soundtrackQA.ready());
 const data=await page.evaluate(()=>__soundtrackQA.data());
 for(const id of data.guards){assert.equal(await page.evaluate(id=>__soundtrackQA.guard(id),id),id,'real guard battle started');assert(await expectTrack('event-pate-trade-execution.mp3')>=executionTime);await page.evaluate(()=>__soundtrackQA.snapshot());await page.evaluate(id=>__soundtrackQA.endGuard(id),id);await expectTrack('event-pate-trade-execution.mp3');}
 await page.evaluate(()=>__soundtrackQA.snapshot());const saved=await page.evaluate(()=>__soundtrackQA.state());assert.equal(saved.botrune.cursor,9);assert(saved.soundtrack.positions.execution>0);
 await page.reload({waitUntil:'networkidle'});await page.locator('body').click({position:{x:5,y:5}});await page.evaluate(()=>__soundtrackQA.reload());assert(await expectTrack('event-pate-trade-execution.mp3')>=saved.soundtrack.positions.execution-.2);assert.equal((await page.evaluate(()=>__soundtrackQA.state())).botrune.cursor,9);
 await page.evaluate(()=>__soundtrackQA.go('town'));await expectTrack('route-journey-across-the-realm.mp3');await page.evaluate(()=>__soundtrackQA.go('botrune'));await expectTrack('event-pate-trade-execution.mp3');
 await page.evaluate(()=>__soundtrackQA.settings());await page.locator('#menu-sound').click();assert.equal((await playing()).length,0);await page.locator('#menu-sound').click();await page.evaluate(()=>__soundtrackQA.close());await expectTrack('event-pate-trade-execution.mp3');await page.evaluate(()=>__soundtrackQA.hide(true));assert.equal((await playing()).length,0);await page.evaluate(()=>__soundtrackQA.hide(false));await expectTrack('event-pate-trade-execution.mp3');
 await page.screenshot({path:'build/music-qa/execution-gauntlet.png'});
 console.log('PASS: guard battles, gauntlet reload, departure/return and sound/visibility.');await page.evaluate(()=>__soundtrackQA.leader());await expectTrack('battle-city-leader.m4a');assert((await page.evaluate(()=>__soundtrackQA.state())).soundtrack.executionEnded);await page.screenshot({path:'build/music-qa/fatima-takeover.png'});
 await page.evaluate(()=>__soundtrackQA.settle());await expectTrack('route-ancient-shadows.mp3');await page.evaluate(()=>__soundtrackQA.go('burialGrove'));await expectTrack('event-pate-trade-burial.mp3');
 for(let i=0;i<5;i++){await page.locator('#next-line').waitFor();await page.locator('#next-line').click();}
 await page.evaluate(()=>__soundtrackQA.snapshot());const cursor=(await page.evaluate(()=>__soundtrackQA.state())).finale.burialCursor;await page.reload({waitUntil:'networkidle'});await page.locator('body').click({position:{x:5,y:5}});await page.evaluate(()=>__soundtrackQA.reload());await expectTrack('event-pate-trade-burial.mp3');assert.equal((await page.evaluate(()=>__soundtrackQA.state())).finale.burialCursor,cursor);
 while(!(await page.evaluate(()=>__soundtrackQA.state())).finale.buried){await page.locator('#next-line').waitFor();await page.locator('#next-line').click();await expectTrack('event-pate-trade-burial.mp3');}
 await page.locator('#fn-legacy-continue').waitFor();await expectTrack('event-pate-trade-burial.mp3');await page.evaluate(()=>__soundtrackQA.snapshot());await page.reload({waitUntil:'networkidle'});await page.locator('body').click({position:{x:5,y:5}});await page.evaluate(()=>__soundtrackQA.reload());await page.locator('#fn-legacy-continue').waitFor();await expectTrack('event-pate-trade-burial.mp3');await page.locator('#fn-legacy-continue').click();await expectTrack('route-catching-up.m4a');
 await page.evaluate(()=>__soundtrackQA.go('sunBank'));await page.evaluate(()=>__soundtrackQA.go('burialGrove'));await expectTrack('route-catching-up.m4a');
 await page.evaluate(()=>__soundtrackQA.title());assert.equal((await playing()).length,0);assert.deepEqual(errors,[]);results.story='PASS';console.log('PASS: Fatima takeover and funeral/aftermath reloads.');
 // Every original audio stream is decoded and actually played, including uncertain sources.
 results.audio=[];
 // Release browser jobs check out dist only; source-only auditions belong to the
 // dedicated soundtrack job, which also requires all sources via verify-soundtrack.py.
 const sourceAuditions=['music-m4a/city-leader-UNVERIFIED.m4a','music-m4a/catching-up-UNCLASSIFIED.m4a'].filter(file=>fs.existsSync(path.join(root,file)));
 for(const file of [...Object.values(data.tracks),...sourceAuditions]){
  const r=await page.evaluate(async file=>{const a=new Audio(file);a.volume=.01;await a.play();await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('No advancing audio: '+file)),15000);const poll=()=>{if(a.error){clearTimeout(t);reject(Error(a.error.message));}else if(a.currentTime>.08){clearTimeout(t);resolve();}else setTimeout(poll,30);};poll();});const result={file,duration:a.duration,time:a.currentTime,error:a.error?.code||null};a.pause();return result;},file);results.audio.push(r);
 }
 console.log('PASS: '+results.audio.length+' actual audio decodes/playbacks.');
 // Full runtime precache, offline reload, audio range responses and real offline playback.
 const offline=await browser.newContext({serviceWorkers:'allow'}),op=await offline.newPage();await op.goto(base,{waitUntil:'load'});await op.waitForFunction(()=>navigator.serviceWorker.controller,null,{timeout:240000});await offline.setOffline(true);await op.reload({waitUntil:'networkidle'});await op.locator('body').click({position:{x:5,y:5}});
 results.offline=await op.evaluate(async tracks=>{const result=[];for(const file of tracks){const r=await fetch(file);if(!r.ok)throw Error('Missing offline '+file);const range=await fetch(file,{headers:{Range:'bytes=1024-2047'}});if(range.status!==206||(await range.arrayBuffer()).byteLength!==1024)throw Error('Bad range '+file);const a=new Audio(file);await a.play();await new Promise(r=>setTimeout(r,160));if(a.paused||a.error||a.currentTime===0)throw Error('Offline decode '+file);a.pause();result.push(file);}return result;},Object.values(data.tracks));
 await offline.close();fs.writeFileSync('build/music-qa/browser-results.json',JSON.stringify(results,null,2));console.log('PASS: real soundtrack playback, nine beats/three guard boundaries/Fatima, saved reloads, departure, towns/interiors/routes, Darius, funeral/gifts/reload, mute/visibility/title, runtime/source decodes, full offline cache and all registered offline audio/range checks.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
