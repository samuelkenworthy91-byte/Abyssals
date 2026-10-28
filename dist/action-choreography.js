// Shared ordinary techniques use action vocabulary, not type-coloured random
// motifs. Bespoke action sheets and signature renderers take precedence.
const f=(at,x,y,sx=1,sy=sx,turn=0,opacity=1,px=0)=>({at,x,y,sx,sy,turn,opacity,px});
export function actionIdentity(m){
 const n=m.name.toLowerCase(),has=id=>m.effects?.some(e=>e.effect_id===id);
 if(m.category==='STATUS'){
  if(has('heal')||has('party_heal')||has('heal_by_format'))return 'restore';
  if(has('weather')||has('terrain'))return 'field';
  if(/shelter|guard|ward|curtain|screen|mantle|brace|barrier/.test(n))return 'guard';
  if(/mist|haze|veil|cloud/.test(n))return 'mist';
  return 'prepare';
 }
 if(has('drain'))return 'siphon';
 if(m.hits)return 'volley';
 if(m.sound||/cry|clap|snarl|song|chorus|chime|resonan|roar|knell/.test(n))return 'sound';
 if(/uppercut/.test(n))return 'uppercut';
 if(/lance|needle|pierce|impale|spear|quill/.test(n))return 'pierce';
 if(/kick|heel/.test(n))return 'kick';
 if(/fang|bite|gnaw|maw|tooth/.test(n))return 'bite';
 if(/feint|ambush/.test(n))return 'feint';
 if(/crush|hammer|shoulder|break|crash|slam/.test(n))return 'crush';
 if(/cut|slash|cleave|blade|scissor|rake|claw|reap|rend/.test(n))return 'slash';
 if(/throw|toss|vault/.test(n))return 'throw';
 if(/dash|rush|lunge|pounce|charge|tackle/.test(n))return 'rush';
 if(/wave|tide|surge/.test(n))return 'surge';
 if(/ray|beam|bolt/.test(n))return 'beam';
 return m.category==='PHYSICAL'?'strike':'pulse';
}
function material(m){
 const n=m.name.toLowerCase();
 const entries=[[/cinder|flame|pyre|fire|ember|furnace|infernal|kiln|heat/,'fire'],[/water|tide|foam|brine|rill|rain|monsoon|deluge/,'water'],[/iron|steel|rivet|anvil|metal|alloy|cleaver/,'steel'],[/ice|rime|frost|glacier|frozen|winter|hail/,'ice'],[/venom|poison|toxin|noxious|barb/,'poison'],[/leaf|root|fern|bramble|thorn|thistle|meadow|bamboo|petal/,'grass'],[/stone|shale|flint|crag|rock|geode|basalt|cairn/,'rock'],[/volt|spark|electric|thunder|circuit/,'electric'],[/dream|mind|psychic|thought|prism|oracle/,'psychic'],[/ghost|wraith|spectral|funeral|grave|spirit/,'ghost']];
 return entries.find(([re])=>re.test(n))?.[1]||'normal';
}
export function installActionChoreography(scenes,moves){
 for(const m of moves){
  const s=scenes[m.id];if(!s||s.courtArt)continue;
  const action=actionIdentity(m),heavy=(m.power||0)>=85,impact=heavy?58:48;
  const roots={
   slash:[f(0,1,-14,.05,.05,-35,0),f(25,.6,-24,.5,.08,-35),f(impact,0,0,1.3,.65,-35),f(impact+14,0,18,.7,.12,-35,.8),f(100,0,24,.05,.03,-35,0)],
   pierce:[f(0,1,0,.05,.05,0,0),f(25,.8,0,.35,.08),f(impact,0,0,1.4,.2),f(impact+14,0,0,.6,.15),f(100,0,0,.05,.05,0,0)],
   uppercut:[f(0,.4,80,.1,.1,0,0),f(30,.2,50,.4),f(impact,0,-5,.8,1.2),f(80,0,-55,.6),f(100,0,-75,.1,.1,0,0)],
   kick:[f(0,1,25,.1,.1,-30,0),f(30,.5,15,.7,.2,-20),f(impact,0,0,1.2,.4,0),f(75,.3,10,.5,.15,15),f(100,1,25,.05,.05,0,0)],
   crush:[f(0,.2,-95,.1,.1,0,0),f(30,.1,-70,.7,.9),f(impact,0,10,1.25,.75),f(74,0,0,1.1),f(100,0,25,.5,.2,0,0)],
   rush:[f(0,1,0,.05,.05,0,0),f(30,.8,0,.5,.3),f(impact,0,0,1.2,.8),f(75,-.2,0,.5,.2),f(100,-.4,0,.05,.05,0,0)],
   throw:[f(0,1,15,.05,.05,0,0),f(30,.6,-65,.6,.6,45),f(impact,0,0,1,1,90),f(80,-.2,30,.5,.5,135),f(100,-.3,45,.05,.05,180,0)],
   feint:[f(0,.6,-35,.4,.4,0,0),f(25,.4,-20,.7,.3,0,.8),f(39,.4,-20,.05,.05,0,0),f(impact,0,0,1.1,.35,40),f(70,0,10,.6,.15,40),f(100,0,20,.05,.05,40,0)],
   bite:[f(0,0,-50,.3,.5,0,0),f(25,0,-20,.9,1.25),f(impact,0,0,1.05,.5),f(73,0,0,.85,.6),f(100,0,10,.05,.05,0,0)]
  };
  const status=['restore','field','guard','mist','prepare'].includes(action);
  const root=roots[action]||(status?[f(0,0,35,.1,.1,0,0),f(25,0,15,.5),f(impact,0,0,1),f(82,0,-10,1.1),f(100,0,-25,.7,.7,0,0)]:[f(0,1,0,.1,.1,0,0),f(25,.75,0,.4),f(impact,0,0,1),f(75,0,0,1.2),f(100,0,0,.2,.2,0,0)]);
  const cell=({slash:5,pierce:13,uppercut:8,kick:6,crush:7,rush:4,throw:12,feint:6,bite:7,sound:10,siphon:11,volley:13,surge:10,beam:13,guard:9,restore:10,mist:0,prepare:8,field:11,strike:6,pulse:2})[action];
  const layers=[{role:action,size:status?135:heavy?165:125,frames:root}];
  const repeats=action==='sound'?3:action==='volley'?Math.min(5,m.hits?.max||3):action==='bite'?2:0;
  for(let i=0;i<repeats;i++){
   const shift=i*(action==='sound'?8:10);
   layers.push({role:action+'-beat',size:action==='sound'?65+i*20:55,frames:[f(0,0,0,.05,.05,0,0),f(impact+shift-6,0,action==='bite'?(i?-22:22):0,.25,.25,i?180:0),f(impact+shift,0,0,.9,.9,i?180:0),f(Math.min(99,impact+shift+17),0,0,1.1,1.1,0,0),f(100,0,0,.05,.05,0,0)]});
  }
  // Keep one of the original move-specific secondary tracks as detailing.
  if(s.layers?.[1])layers.push(s.layers[1]);
  Object.assign(s,{atlas:material(m),cell,action,actionIdentity:action,duration:status?1500:heavy?1500:1150,impact:impact/100,layers,sequence:m.authored_visual_action||(m.name+': '+action+' anticipation → '+(status?'effect settles':'readable contact')+' → '+(status?'recovery':'aftermath')),actionFirst:true});
 }
}
