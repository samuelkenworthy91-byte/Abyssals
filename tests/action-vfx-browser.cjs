const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));const root=process.env.TEST_URL||'http://127.0.0.1:8763';
 fs.mkdirSync('build/qa',{recursive:true});await page.goto(root+'/move-lab.html?move=747&caster=517&target=001',{waitUntil:'networkidle'});
 const report=await page.evaluate(async()=>{
  const {ACTION_ART}=await import('./action-vfx.js?v=0.90.48');
  const results=await Promise.all(Object.values(ACTION_ART).map(a=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({id:a.id,ok:img.naturalWidth===256&&img.naturalHeight===256});img.onerror=()=>resolve({id:a.id,ok:false});img.src=a.src;})));
  return {results,overflow:document.documentElement.scrollWidth>innerWidth};
 });
 assert.equal(report.results.length,63);assert(report.results.every(r=>r.ok),'all actual PNG sheets decode');assert(!report.overflow,'no page overflow on phone');
 await page.waitForTimeout(1850); // Let Move Studio finish its own initial preview.
 for(const id of [747,790,316,390,388,494,705]){
  await page.evaluate(async id=>{
   const {pixelSceneHTML}=await import('./action-vfx.js?v=0.90.48');const {DATA}=await import('./data.js?v=0.90.48');
   const m=DATA.moves.find(m=>m.id===id)||{id,power:50,type_id:'WATER'};document.getElementById('preview-fx').innerHTML='<div class="fx-anchor" style="left:63%;top:45%">'+pixelSceneHTML(m,{hitCount:3})+'</div>';
  },id);
  const art=page.locator('.pixel-move-art');assert(await art.isVisible());assert(['pixelated','crisp-edges'].includes(await art.evaluate(e=>getComputedStyle(e).imageRendering)));
  await page.waitForTimeout(id===790?1250:630);await page.screenshot({path:'build/qa/action-phone-'+id+'.png'});
 }
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.pixel-move-art').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'build/qa/action-desktop-reduced.png'});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 63 real sprite sheets decode, phone layout, distinct action screenshots and reduced motion.');
})().catch(e=>{console.error(e);process.exit(1)});
