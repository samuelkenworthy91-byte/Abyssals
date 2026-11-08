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
// Reuse byte-identical artwork and audio from the preceding verified PWA cache.
// Fresh installs and missing cache entries still download normally.
const PREVIOUS_ASSET_CACHE='abyssals-0.90.60-r1';
const REUSE_BINARY=path=>/^(?:assets\/|icons\/).*\.(?:webp|png|jpg|jpeg|gif|svg|mp3|m4a|ogg|avif)$/i.test(path);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE),previous=await caches.open(PREVIOUS_ASSET_CACHE);let cursor=0;
 try{await Promise.all(Array.from({length:6},async()=>{while(cursor<URLS.length){const i=cursor++,url=URLS[i],path=self.ABYSSALS_OFFLINE_ASSETS[i];const cached=REUSE_BINARY(path)?await previous.match(url):null;if(cached){await cache.put(url,cached);continue;}const response=await fetch(new Request(url,{cache:'reload'}));if(!response.ok||new URL(response.url).origin!==ROOT.origin||!['basic','default'].includes(response.type))throw Error('Offline download incomplete');await cache.put(url,response);}}));}
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
  const stored=await cache.match(key,{ignoreSearch:true});if(stored){
   // Android WebView and browsers seek MP3/AAC using byte ranges, including offline.
   const range=request.headers.get('range');
   if(range&&url.pathname.includes('/assets/music/')){
    const bytes=await stored.arrayBuffer(),size=bytes.byteLength,m=/^bytes=(\d*)-(\d*)$/.exec(range);
    let start=m?.[1]?Number(m[1]):0,end=m?.[2]?Number(m[2]):size-1;
    if(m&&!m[1]&&m[2]){start=Math.max(0,size-Number(m[2]));end=size-1;}
    if(!m||!m[1]&&!m[2]||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
    end=Math.min(end,size-1);const headers=new Headers(stored.headers);headers.set('Content-Range',`bytes ${start}-${end}/${size}`);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');
    return new Response(bytes.slice(start,end+1),{status:206,headers});
   }
   return stored;
  }
  return fetch(request);
 })());
});
self.addEventListener('message',event=>{if(event.data?.type==='OFFLINE_STATUS')event.ports[0]?.postMessage({ready:true,version:self.ABYSSALS_OFFLINE_VERSION});});
