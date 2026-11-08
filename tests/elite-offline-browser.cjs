const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow',reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('abyssals-motion','reduced'));
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'load'});
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{},{timeout:150000});
 const cached=await page.evaluate(async version=>{const key=(await caches.keys()).find(k=>k.startsWith('abyssals-'+version));return key?(await(await caches.open(key)).keys()).length:0;},JSON.parse(fs.readFileSync('release-config.json','utf8')).version);assert(cached>=1978);
 await context.setOffline(true);await page.reload({waitUntil:'networkidle'});await page.locator('#title-continue').click();await page.locator('#new-game').click();
 assert(await page.locator('.modal').isVisible(),'offline new expedition opens name dialog');
 const files=['elite-leaders.js','journal-habitats.js','elite-leaders.css','side-campaign-mechanisms.js','invisible-crossing.js',...Array.from({length:8},(_,i)=>'assets/LDR-0'+(i+1)+'.webp')];
 for(const file of files){const ok=await page.evaluate(async f=>{const r=await fetch(f+'?offline-check=1');return r.ok&&(await r.arrayBuffer()).byteLength>100;},file);assert(ok,'offline cached '+file);}
 fs.mkdirSync('build/qa',{recursive:true});await page.screenshot({path:'build/qa/elite-offline-name-entry.png'});
 await page.evaluate(()=>{
  const stats={hp:200,attack:150,defence:150,sp_attack:150,sp_defence:150,speed:150};
  const unit={uid:'unit-1',species:{id:'004'},level:80,hp:200,maxHp:200,stats,moves:[]};
  const accepted={version:1,accepted:true,clues:[],puzzle:[],lights:[false,false,false],weights:[0,0,0],solved:false,choice:null,claimed:false};
  const state={begun:true,openingDone:true,tamingTaught:true,test:true,departed:true,playerName:'Offline QA',money:0,party:[unit],reserve:[],dead:[],nextUnitId:2,escortSteps:500,sideCampaigns:{marchMeadow:accepted},defeatedTrainers:[]};
  localStorage.setItem('abyssals-expedition-slot-1',JSON.stringify({version:1,state,room:'marchMeadow',player:{x:15,y:13,facing:'up'},phaseElapsed:0,worldRandom:123}));
 });
 await page.reload({waitUntil:'networkidle'});
 await page.locator('#title-continue').click();
 await page.locator('#load-game').click();
 await page.locator('[data-load-slot="1"]').click();
 await page.locator('#console-a').click();
 await page.locator('#dialogue').getByText(/wool lining/i).waitFor();
 assert(await page.evaluate(()=>JSON.parse(localStorage.getItem('abyssals-expedition-slot-1')).state.sideCampaigns.marchMeadow.clues.includes(0)));
 await page.screenshot({path:'build/qa/offline-snowbreak-lectern.png'});assert.deepEqual(errors,[]);await browser.close();console.log('PASS: complete 1978-file service-worker install, network disconnected reload, interactive new-game flow, all eight leader images and new modules and a saved expedition clue served offline');
})().catch(e=>{console.error(e);process.exit(1)});
