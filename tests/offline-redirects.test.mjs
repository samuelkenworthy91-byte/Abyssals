import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
async function install(destination){
 const events={},saved=[],deleted=[];const root='https://game.example/';let work;
 const self={location:{href:root+'sw.js'},ABYSSALS_OFFLINE_VERSION:'test',ABYSSALS_OFFLINE_ASSETS:['index.html','app.js'],addEventListener:(type,fn)=>events[type]=fn};
 const cache={put:async(key)=>saved.push(key)};
 vm.runInNewContext(source,{self,URL,Request,importScripts(){},caches:{open:async()=>cache,delete:async key=>deleted.push(key)},fetch:async request=>({ok:true,type:'basic',redirected:request.url.endsWith('.html'),url:request.url.endsWith('.html')?destination:request.url})});
 events.install({waitUntil:p=>work=p});return {work,saved,deleted};
}
let run=await install('https://game.example/');await run.work;assert.ok(run.saved.includes('https://game.example/index.html'),'canonical HTML redirects retain the offline navigation cache key');assert.equal(run.saved.length,2);assert.equal(run.deleted.length,0);
run=await install('https://other.example/');await assert.rejects(run.work,/Offline download incomplete/);assert.equal(run.deleted.length,1,'cross-origin redirects abort and discard incomplete cache');
console.log('PWA accepts same-origin canonical HTML redirects and rejects cross-origin offline responses.');
