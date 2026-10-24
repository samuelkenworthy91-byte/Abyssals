import {EXPANSION_MOVES} from './full-expansion.js?v=0.87.0';
import {TACTICAL_MOVES} from './tactical-moves.js?v=0.90.28';
const f=(at,x,y,sx,sy=sx,turn=0,opacity=1,px=0)=>({at,x,y,sx,sy,turn,opacity,px});
export function installExpansionScenes(scenes,moves=EXPANSION_MOVES){
 for(const m of (moves===EXPANSION_MOVES?[...moves,...TACTICAL_MOVES]:moves)){
  const name=m.name.toLowerCase(),seed=m.id-386,heal=m.effects.some(e=>['heal','party_heal','cure_major_status'].includes(e.effect_id));
  const action=m.sceneAction||(heal?'restore':/quill|spine|needle|shard|stitch|barb/.test(name)?'pierce':/coil|ring|halo|spiral|weave/.test(name)?'coil':/tide|wave|surf|wash|chorus|echo|song/.test(name)?'ripple':m.category==='PHYSICAL'?'rake':'pulse');
  const style=heal?'bloom':({pierce:'beam',coil:'vortex',ripple:'wave',rake:'slash',pulse:'nova'})[action];
  const cue=heal?55:50+seed%12,duration=heal?1750:1350+(seed%5)*110,size=110+(m.power||40)*.5,spread=50+seed%7*5;
  const main=heal?[f(0,0,45,.05,.05,0,0),f(18,0,20,.4),f(cue,0,0,1),f(85,0,-10,1.2),f(100,0,-40,.2,.2,0,0)]:[f(0,1,0,.05,.05,-45,0),f(12,1,-20,.35,.35,-40),f(cue-18,.65,action==='coil'?-90:action==='rake'?45:-35,.65,.65,-80),f(cue,0,0,1,1,0),f(cue+14,0,12,1.1,1.1,20,.8),f(100,0,35,.15,.15,45,0)];
  if(action==='coil')main.splice(3,0,f(cue-8,.25,-40,.85,.85,180));
  const layers=[{role:action,size,frames:main}];
  for(let i=0;i<(action==='pierce'?6:heal?7:4);i++){
   const a=(i/(action==='pierce'?6:heal?7:4)*Math.PI*2)+seed*.17,px=Math.round(Math.cos(a)*spread),y=Math.round(Math.sin(a)*spread);
   const frames=heal?[f(0,0,y*1.4,.05,.05,0,0,px*1.4),f(15+i*3,0,y,.3,.3,i*45,1,px),f(cue,0,0,.7,.7,0,1),f(100,0,-25,.05,.05,0,0)]:action==='pierce'?[f(0,1,-30+i*9,.05,.05,0,0,px/4),f(18+i*3,.85,-30+i*9,.35,.15,-20,1,px/4),f(cue+i*2,0,0,.65,.2,15,1),f(100,0,y,.05,.05,50,0,px)]:[f(0,0,0,.05,.05,0,0),f(cue-5+i,0,0,.25,.25,i*40,1),f(cue+20+i*2,0,y,.65,.65,i*65,.9,px),f(100,0,y*1.3,.05,.05,i*90,0,px*1.3)];
   layers.push({role:heal?'petal':action==='pierce'?'needle':'fragment',size:42+seed%8*3+i*2,frames});
  }
  if(m.id===464)for(const layer of layers.slice(1))layer.frames=[f(0,0,0,.05,.05,0,0),f(cue,0,0,.4),f(78,1,-15,.55,.55,120,1),f(100,1,0,.05,.05,180,0)];
  // Each move has a fixed score. Cosmetic animation never consumes the battle RNG.
  scenes[m.id]={id:m.id,key:name.replace(/[^a-z0-9]+/g,'-'),type:m.type_id,atlas:m.type_id.toLowerCase(),cell:heal?20:action==='rake'?5:action==='pierce'?13:action==='ripple'?10:action==='coil'?11:2,action,style,duration,impact:cue/100,sequence:`${m.name}: ${heal?'restorative light gathers around user':'elemental motif forms at caster'} → ${action} → ${heal?'healing settles':'impact and fragments disperse'}`,layers,approvedExpansion362:true};
 }
}
