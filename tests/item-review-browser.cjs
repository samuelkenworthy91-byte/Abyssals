const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:430,height:932},serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://**/*',r=>r.abort());await page.route('http://**/*',r=>r.abort());
 await page.goto('file://'+path.resolve('build/review/Abyssals-Items-and-Branch-Evolutions.html'),{waitUntil:'load'});await page.waitForFunction(()=>window.reviewReady);
 await page.waitForFunction(()=>[...document.images].filter(i=>i.id!=='zoom-image').every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('[data-item]').count(),280);assert.equal(await page.locator('[data-creature]').count(),10);assert.equal(await page.locator('[data-new-item]').count(),8);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'phone page must not overflow horizontally');
 fs.mkdirSync('build/qa',{recursive:true});await page.screenshot({path:'build/qa/item-review-phone.png'});
 await page.selectOption('#category','Evolution');assert.equal(await page.locator('[data-item]').count(),21);await page.locator('[data-item] [data-zoom]').first().click();assert(await page.locator('#zoom').evaluate(el=>el.open));await page.locator('#zoom-theme').click();assert(await page.locator('#zoom').evaluate(el=>el.classList.contains('dark')));await page.locator('#zoom-close').click();
 await page.selectOption('#category','all');await page.fill('#search','Slow Stew');assert.equal(await page.locator('[data-item]').count(),1);assert((await page.locator('[data-item]').innerText()).includes('Slow Stew'));await page.fill('#search','');await page.selectOption('#category','Codexes');assert.equal(await page.locator('[data-item]').count(),191);
 await page.fill('#search','FIRE');assert(await page.locator('[data-item]').count()>0);await page.fill('#search','');await page.selectOption('#category','all');
 await page.locator('#flask').scrollIntoViewIfNeeded();assert.equal(await page.locator('#exp-output').innerText(),'50 EXP');await page.check('#warbond');assert.equal(await page.locator('#exp-output').innerText(),'100 EXP');await page.fill('#base-exp','500');assert.equal(await page.locator('#exp-output').innerText(),'500 EXP');
 for(const id of ['flaskling','vainglulus','wrathulus','slothulus','gulomunc','scruffox','arthox','alfredox','ronnifox','reggifox']){
  await page.locator('#'+id).scrollIntoViewIfNeeded();assert(await page.locator('#'+id+' img').first().evaluate(i=>i.naturalWidth>0));
 }
 await page.locator('#arthox').scrollIntoViewIfNeeded();await page.screenshot({path:'build/qa/item-review-arthox.png'});await page.locator('#alfredox').scrollIntoViewIfNeeded();await page.screenshot({path:'build/qa/item-review-alfredox.png'});
 await page.locator('#waranwei').scrollIntoViewIfNeeded();await page.waitForTimeout(350);const a=await page.locator('#walk-before').evaluate(c=>c.toDataURL()),b=await page.locator('#walk-after').evaluate(c=>c.toDataURL());assert.notEqual(a,b,'corrected right-facing animation differs from the old one');await page.locator('[data-direction="left"]').click();assert.equal(await page.locator('#walk-before').evaluate(c=>c.toDataURL()),await page.locator('#walk-after').evaluate(c=>c.toDataURL()),'left animation unchanged');await page.locator('[data-direction="right"]').click();await page.locator('#pause-walk').click();await page.screenshot({path:'build/qa/item-review-walking.png'});
 await page.setViewportSize({width:1440,height:1000});await page.locator('#fox').scrollIntoViewIfNeeded();await page.screenshot({path:'build/qa/item-review-desktop.png'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop page overflow');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: self-contained review works with all network requests blocked; 280 item rows, 191 codexes, 10 creature designs, 8 new items, mobile filters/zoom, half-EXP calculator and Waranwei before/after animation.');
})().catch(e=>{console.error(e);process.exit(1)});
