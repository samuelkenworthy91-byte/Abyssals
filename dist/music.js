import {SOUNDTRACK,ROUTE_PLAYLIST,BATTLE_PLAYLIST} from './soundtrack.js?v=0.90.57';
export const MUSIC_TRACKS=Object.fromEntries(Object.entries(SOUNDTRACK).map(([id,file])=>[id,'assets/music/'+file]));

// Each player retains its actual media position. Only natural endings consume a bag.
export function createMusicController({createAudio=()=>new Audio(),tracks=MUSIC_TRACKS,fadeMs=0,random=Math.random}={}){
 const players=new Map(),pending=new Map(),pools={route:ROUTE_PLAYLIST,battle:BATTLE_PLAYLIST};
 let wanted=null,blocked=false,requestVersion=0,context={},mode=null,signature='',savedPositions={},bags={},selected={},last={},previousBattle=false,previousEncounter=null,evolutionToken=null;
 const volume=.35;
 function reset(key){const a=players.get(key);a?.pause();try{if(a)a.currentTime=0;}catch{}savedPositions[key]=0;}
 function pauseOthers(){for(const [key,a]of players)if(key!==wanted)a.pause();}
 function draw(group){
  let bag=bags[group]||[];
  if(!bag.length){bag=pools[group].filter(id=>tracks[id]);for(let i=bag.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}if(bag.length>1&&bag[0]===last[group])[bag[0],bag[1]]=[bag[1],bag[0]];}
  const key=bag.shift();bags[group]=bag;selected[group]=key;last[group]=key;reset(key);return key;
 }
 function ended(key){
  if(wanted!==key||context.hidden||!context.enabled)return;
  if(key==='evolution'){reset(key);play();return;}
  const group=context.evolution?null:context.playlist;
  if(group&&selected[group]===key){draw(group);apply();}
 }
 function play(){
  pauseOthers();if(!wanted||blocked||pending.has(wanted))return;
  const key=wanted,version=requestVersion;let a=players.get(key);
  if(!a){a=createAudio();a.preload='none';a.volume=volume;a.src=tracks[key];a.loop=!(context.playlist&&pools[context.playlist]?.includes(key))||key==='evolution';const position=savedPositions[key];if(Number.isFinite(position)&&position>0){const seek=()=>{try{a.currentTime=savedPositions[key]||0;}catch{}};seek();a.addEventListener?.('loadedmetadata',seek,{once:true});}a.addEventListener?.('ended',()=>ended(key));players.set(key,a);}
  a.loop=key==='evolution'||!(context.playlist&&pools[context.playlist]?.includes(key));a.volume=volume;
  if(!a.paused)return;
  try{const attempt=Promise.resolve(a.play()).then(()=>{if(wanted!==key)a.pause();},()=>{if(wanted===key&&version===requestVersion)blocked=true;}).finally(()=>{if(pending.get(key)===attempt){pending.delete(key);if(version!==requestVersion&&wanted===key&&a.paused&&!blocked)play();}});pending.set(key,attempt);}catch{blocked=true;}
 }
 function apply(){
  const {active,enabled,hidden,cue,battle,playlist,evolution}=context;
  const next=active?(evolution?'evolution':playlist?(selected[playlist]||draw(playlist)):tracks[cue]?cue:battle?'battle':'overworld'):null;
  const sig=[next,!!enabled,!!hidden,playlist||'',evolution||''].join(':');if(sig===signature)return;
  signature=sig;requestVersion++;blocked=false;mode=next;wanted=enabled&&!hidden?next:null;play();
 }
 return {
  update({active=false,battle=false,enabled=false,hidden=false,cue=null,playlist=null,evolution=null,encounter=null}={}){
   if(!pools[playlist])playlist=null;
   // An evolution suspends combat too; it must not end/restart the encounter.
   if(battle&&(!previousBattle||previousEncounter!==null&&encounter!==previousEncounter)&&!evolution&&playlist==='battle')draw('battle');
   if(previousBattle&&!battle&&!evolution){for(const id of [...BATTLE_PLAYLIST,'leader'])reset(id);}
   if(evolution!==evolutionToken){if(evolution)reset('evolution');else if(evolutionToken)reset('evolution');evolutionToken=evolution;}
   if(!evolution&&context.cue==='leader'&&cue!=='leader')reset('leader');
   context={active,battle,enabled,hidden,cue,playlist,evolution,encounter};previousBattle=battle;previousEncounter=encounter;apply();
  },
  unlock(){blocked=false;play();},
  positions(){return {...savedPositions,...Object.fromEntries([...players].map(([id,a])=>[id,Number.isFinite(a.currentTime)?a.currentTime:0]))};},
  snapshot(){return {version:2,positions:this.positions(),bags:JSON.parse(JSON.stringify(bags)),selected:{...selected},last:{...last},battle:previousBattle,evolution:evolutionToken};},
  restore(positions={},snapshot={}){
   snapshot=snapshot&&typeof snapshot==='object'?snapshot:{};this.stop();savedPositions=Object.fromEntries(Object.entries(positions||{}).filter(([id,n])=>tracks[id]&&Number.isFinite(n)&&n>=0));
   bags={};selected={};last={};for(const [g,pool]of Object.entries(pools)){bags[g]=[...new Set(Array.isArray(snapshot.bags?.[g])?snapshot.bags[g]:[])].filter(id=>pool.includes(id)&&tracks[id]);if(pool.includes(snapshot.selected?.[g]))selected[g]=snapshot.selected[g];if(pool.includes(snapshot.last?.[g]))last[g]=snapshot.last[g];}
   previousBattle=!!snapshot.battle;evolutionToken=typeof snapshot.evolution==='string'?snapshot.evolution:null;
   for(const [id,a]of players){try{a.currentTime=savedPositions[id]||0;}catch{}}
  },
  suspend(){requestVersion++;wanted=null;signature='';pauseOthers();},
  stop(){requestVersion++;wanted=null;mode=null;signature='';context={};previousBattle=false;previousEncounter=null;evolutionToken=null;pauseOthers();},
 };
}
