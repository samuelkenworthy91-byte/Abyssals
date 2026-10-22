// Release 0.88.2 — encounter access and illustrated trade proposals.
// APK patch v0.88.1: Living Water mercantile and rapids expansion.
// Release 0.87.0 — The Green Road, Marasen and the broken bridle.
// Build-local caches keep HTML and its modules together. Updates wait until
// every previous game window closes; never replace an expedition mid-fight.
importScripts('./offline-assets.js');
const CACHE='abyssals-'+self.ABYSSALS_OFFLINE_VERSION+(self.ABYSSALS_OFFLINE_REVISION?'-r'+self.ABYSSALS_OFFLINE_REVISION:'');
const ROOT=new URL('./',self.location.href);
const URLS=self.ABYSSALS_OFFLINE_ASSETS.map(path=>new URL(path,ROOT).href);
const ALLOWED=new Set(URLS.map(url=>new URL(url).pathname));
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);let cursor=0;
 try{await Promise.all(Array.from({length:6},async()=>{while(cursor<URLS.length){const url=URLS[cursor++],response=await fetch(new Request(url,{cache:'reload'}));if(!response.ok||new URL(response.url).origin!==ROOT.origin||!['basic','default'].includes(response.type))throw Error('Offline download incomplete');await cache.put(url,response);}}));}
 catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('abyssals-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==ROOT.origin)return;
 const navigation=request.mode==='navigate'&&(url.pathname===ROOT.pathname||url.pathname===ROOT.pathname+'index.html');
 if(!navigation&&!ALLOWED.has(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),key=navigation?new URL('index.html',ROOT).href:request;
  const stored=await cache.match(key,{ignoreSearch:true});if(stored)return stored;
  return fetch(request);
 })());
});
self.addEventListener('message',event=>{if(event.data?.type==='OFFLINE_STATUS')event.ports[0]?.postMessage({ready:true,version:self.ABYSSALS_OFFLINE_VERSION});});
