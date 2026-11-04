import {SOUNDTRACK} from './soundtrack.js?v=0.90.53';
export const MUSIC_TRACKS=Object.fromEntries(Object.entries(SOUNDTRACK).map(([id,file])=>[id,'assets/music/'+file]));

export function createMusicController({createAudio=()=>new Audio(),tracks=MUSIC_TRACKS,fadeMs=0}={}){
 const players=new Map(),pending=new Map();
 let mode=null,wanted=null,signature='',blocked=false,requestVersion=0,timer=null,transition=0;
 let savedPositions={};
 const volume=.35;
 function cancelFade(){transition++;if(timer!==null)clearTimeout(timer);timer=null;}
 function fade(audio,to,done){const token=transition,from=audio.volume,start=Date.now();const step=()=>{if(token!==transition)return;const n=Math.min(1,(Date.now()-start)/fadeMs);audio.volume=from+(to-from)*n;if(n<1)timer=setTimeout(step,25);else{timer=null;done?.();}};step();}
 function reset(key){const audio=players.get(key);if(audio){audio.pause();try{audio.currentTime=0;}catch{}}savedPositions[key]=0;}
 function pauseOthers(){for(const [key,audio]of players)if(key!==wanted)audio.pause();}
 function play(){
  pauseOthers();
  if(!wanted||blocked||pending.has(wanted))return;
  const key=wanted,version=requestVersion;
  let audio=players.get(key);
  if(!audio){audio=createAudio();audio.preload='none';audio.loop=true;audio.volume=volume;audio.src=tracks[key];const position=savedPositions[key];if(Number.isFinite(position)&&position>0){const seek=()=>{try{audio.currentTime=position;}catch{}};seek();audio.addEventListener?.('loadedmetadata',seek,{once:true});}players.set(key,audio);}
  audio.volume=volume;
  if(!audio.paused)return;
  // Autoplay/decoder failures must never interrupt a turn or movement.
  try{
   const attempt=Promise.resolve(audio.play()).then(()=>{if(wanted!==key)audio.pause();},()=>{if(wanted===key&&version===requestVersion)blocked=true;}).finally(()=>{if(pending.get(key)===attempt){pending.delete(key);
    // Hiding/muting can abort play() before its promise settles. If the same
    // track was requested again meanwhile, retry only that newer request.
    if(version!==requestVersion&&wanted===key&&audio.paused&&!blocked)play();
   }});
   pending.set(key,attempt);
  }catch{blocked=true;}
 }
 return {
  update({active=false,battle=false,enabled=false,hidden=false,cue=null}={}){
   const next=active?(tracks[cue]?cue:battle?'battle':'overworld'):null;
   const nextSignature=[next,!!enabled,!!hidden].join(':');
   if(nextSignature===signature)return;
   signature=nextSignature;requestVersion++;cancelFade();
   const previous=mode;
   // Battle themes restart per encounter; story and exploration positions survive interruptions.
   if(mode==='battle'&&next!=='battle')reset('battle');
   mode=next;const target=enabled&&!hidden?mode:null;blocked=false;
   const outgoing=players.get(previous);
   if(fadeMs>0&&target&&previous!==target&&outgoing&&!outgoing.paused){
    wanted=null;fade(outgoing,0,()=>{outgoing.pause();outgoing.volume=volume;wanted=target;play();});
   }else{wanted=target;play();}
  },
  // A real input gesture can unlock a restored save on Android/browser autoplay policies.
  unlock(){blocked=false;play();},
  positions(){return {...savedPositions,...Object.fromEntries([...players].map(([id,a])=>[id,Number.isFinite(a.currentTime)?a.currentTime:0]))};},
  restore(positions={}){this.stop();savedPositions=Object.fromEntries(Object.entries(positions||{}).filter(([id,n])=>tracks[id]&&Number.isFinite(n)&&n>=0));for(const [id,a]of players){try{a.currentTime=savedPositions[id]||0;}catch{}}},
  stop(){cancelFade();requestVersion++;wanted=null;mode=null;signature='';pauseOthers();},
 };
}
