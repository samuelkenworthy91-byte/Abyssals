const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:780,height:560},serviceWorkers:'block'});
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
   const {drawHighwaterHallTile,drawHighwaterHallDecor}=await import('./highwater-hall.js?v=0.90.62');
   const c=document.createElement('canvas');c.width=768;c.height=512;c.id='preview-highwater-canvas';
   const ctx=c.getContext('2d',{alpha:false});for(let y=0;y<32;y++)for(let x=0;x<48;x++)drawHighwaterHallTile(ctx,x,y);
   drawHighwaterHallDecor(ctx);document.body.replaceChildren(c);document.body.style='margin:0;background:#102a3b';
   const image=ctx.getImageData(0,0,768,512).data;let diverse=new Set();for(let i=0;i<image.length;i+=83*4)diverse.add(image[i]+','+image[i+1]+','+image[i+2]);
   return {width:c.width,height:c.height,colours:diverse.size};
  });
  assert.equal(result.width,768);assert.equal(result.height,512);assert(result.colours>30,'interior needs meaningful mosaic and water detail');
  fs.mkdirSync('build/qa',{recursive:true});await page.locator('#preview-highwater-canvas').screenshot({path:'build/qa/highwater-hall-preview.png'});
  console.log('PASS: rendered Highwater interior visual',result);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
