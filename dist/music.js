// Replace these routes as the soundtrack expands. All modes share the Sound setting.
export const MUSIC_TRACKS={overworld:'assets/music/adventure1.mp3',battle:'assets/music/BattleTheme1.mp3'};

export function createMusicController({createAudio=()=>new Audio(),tracks=MUSIC_TRACKS}={}){
 const players=new Map(),pending=new Map();
 let mode=null,wanted=null,signature='',blocked=false,requestVersion=0;
 function pauseOthers(){for(const [key,audio]of players)if(key!==wanted)audio.pause();}
 function play(){
  pauseOthers();
  if(!wanted||blocked||pending.has(wanted))return;
  const key=wanted,version=requestVersion;
  let audio=players.get(key);
  if(!audio){audio=createAudio();audio.preload='none';audio.loop=true;audio.volume=.35;audio.src=tracks[key];players.set(key,audio);}
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
  update({active=false,battle=false,enabled=false,hidden=false}={}){
   const next=active?(battle?'battle':'overworld'):null;
   const nextSignature=[next,!!enabled,!!hidden].join(':');
   if(nextSignature===signature)return;
   signature=nextSignature;requestVersion++;
   if(mode==='battle'&&next!=='battle'){const audio=players.get('battle');if(audio){audio.pause();try{audio.currentTime=0;}catch{}}}
   mode=next;wanted=enabled&&!hidden?mode:null;blocked=false;play();
  },
  // A real input gesture can unlock a restored save on Android/browser autoplay policies.
  unlock(){blocked=false;play();},
  stop(){requestVersion++;wanted=null;mode=null;signature='';pauseOthers();},
 };
}
