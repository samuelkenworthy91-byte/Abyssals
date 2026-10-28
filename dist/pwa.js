const nativeAndroid=!!globalThis.AbyssalsNative;
const BUILD_VERSION='0.90.48';
const install=document.querySelector('#install-game'),status=document.querySelector('#pwa-status');
let prompt=null;
const installed=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone;
function installationState(){if(installed()){install.hidden=true;}else install.hidden=false;}
async function preserveSaves(){try{await navigator.storage?.persist?.();}catch{}}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;installationState();});
window.addEventListener('appinstalled',()=>{prompt=null;installationState();preserveSaves();status.textContent='Installed · saves stay on this device';});
install.onclick=async()=>{
 if(prompt){const current=prompt;prompt=null;await current.prompt();await current.userChoice;installationState();await preserveSaves();}
 else status.textContent=/iPad|iPhone|iPod/.test(navigator.userAgent)?'Open in Safari → Share → Add to Home Screen.':'Use your browser menu → Install app or Add to Home screen.';
};
status.textContent='v'+BUILD_VERSION+' · Checking offline files';installationState();if(installed())preserveSaves();
if(!nativeAndroid&&'serviceWorker' in navigator&&window.isSecureContext){
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(registration=>{
  function check(){const worker=navigator.serviceWorker.controller;if(!worker)return;const channel=new MessageChannel();channel.port1.onmessage=event=>{if(event.data?.ready){status.textContent='v'+BUILD_VERSION+' · Offline ready · saves stay on this device';channel.port1.close();}};worker.postMessage({type:'OFFLINE_STATUS'},[channel.port2]);}
  function waiting(){if(registration.waiting)status.textContent='v'+BUILD_VERSION+' · Update ready · close all game windows and reopen to apply';}
  check();waiting();registration.update().catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',check);
  registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){navigator.serviceWorker.controller?waiting():status.textContent='Offline download complete · ready to play';}else if(worker.state==='redundant')status.textContent='Offline download paused · reconnect and reopen to retry';});});
  window.addEventListener('online',()=>registration.update().catch(()=>{}));
 }).catch(()=>{status.textContent='Play online · saves stay on this device';});
}else status.textContent='Saves stay on this device';



