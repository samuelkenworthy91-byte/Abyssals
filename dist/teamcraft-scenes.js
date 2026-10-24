// Runtime-authored scores reuse the existing raster atlases. Each move gets its
// own deterministic silhouette, anticipation, travel, orbit and impact timing.
// No cosmetic operation reads the battle RNG.
const frame=(at,x,y,sx,sy=sx,turn=0,opacity=1,px=0)=>({at,x,y,sx,sy,turn,opacity,px});
export function installTeamcraftScenes(scenes,moves){for(const m of moves){const old=scenes[m.id],seed=(m.id*2654435761)>>>0,physical=m.category==='PHYSICAL',status=!m.power,heal=m.effects.some(e=>['heal','party_heal','heal_by_format'].includes(e.effect_id)),protect=m.id===700,decoy=m.id===701,relay=m.id===702,release=m.releaseMove;
 const duration=900+(seed%9)*67+(status?300:0)+(m.power>=95?200:0),cue=45+seed%19,angle=seed%110-55,radius=35+seed%48,cell=heal?20:protect?19:decoy?21:relay?11:status?18+seed%5:release?2+seed%3:physical?[5,6,7,12,13][seed%5]:[0,1,2,3,8,9,10,11][seed%8];
 const root=status?[frame(0,0,20,.05,.05,0,0),frame(25,0,-15,.5,.7,angle),frame(cue,0,0,1,1,0),frame(100,0,-45,1.4,.3,90,0)]:[frame(0,1,0,.05,.05,-angle,0),frame(18,1,-20,.35,.6,angle),frame(cue-15,.6,(seed%2?1:-1)*radius,.7,.45,-angle),frame(cue,0,0,physical?1.3:1,physical?.7:1,angle),frame(cue+15,0,10,1.5,1.2,angle+35),frame(100,0,35,.2,.1,angle+80,0)];
 const layers=[{role:protect?'shield':decoy?'effigy':relay?'relay':release?'release':status?'aura':physical?'contact':'projectile',size:(status?125:100)+(m.power||30)*.55+seed%25,frames:root}];
 for(let i=0;i<4+seed%5;i++){const a=i/(4+seed%5)*Math.PI*2+(seed%360)*Math.PI/180,px=Math.round(Math.cos(a)*radius),y=Math.round(Math.sin(a)*radius),at=Math.min(92,cue+9+i*2);layers.push({role:release?'stat-flare':heal?'mend-mote':physical?'impact-chip':'wake',size:22+(seed+i*7)%35,frames:[frame(0,status?0:1,0,.01,.01,0,0),frame(cue-10,status?0:.3,y*.25,.25,.25,i*40,1,px*.25),frame(at,0,y,physical?.9:.6,physical?.25:.6,i*65,1,px),frame(100,0,y*1.7,.01,.01,i*90,0,px*1.5)]});}
 // Retain hand-authored ordinary scenes, but enrich them with one move-specific
 // score layer. Generated scenes get a complete replacement choreography.
 if(old&&(!old.approvedExpansion362||m.signature_owner_family||m.approvedRelic||m.approvedArmoury)){old.layers=[...old.layers,layers[1]];old.teamcraftScore=seed;old.key=m.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');continue;}
 scenes[m.id]={id:m.id,key:m.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),type:m.type_id,atlas:m.type_id.toLowerCase(),cell,action:layers[0].role,style:status?heal?'bloom':'shield':physical?'slash':'nova',duration,impact:cue/100,layers,teamcraftScore:seed,sequence:`${m.name}: anticipation ${18+seed%12} → ${layers[0].role} → individual impact ${cue}`};
}}
