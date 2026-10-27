import {roomGrid} from './promenade.js?v=0.90.37';
import {shinyCanvas} from './shinies.js?v=0.90.20';
import {RELIC_ART,relicArtPath,drawRelicPanel} from './relic-art.js?v=0.90.47';
import {beginStep,advanceStep} from './movement.js?v=0.87.0';
import {unitName} from './names.js?v=0.87.0';
import {behaviourFor} from './companion-lines.js?v=0.87.0';

// Family assignments are explicit: airborne and aquatic bodies never receive paw/tail gestures.
const families={
 hop:[10,76,92,110,141],
 hover:[12,23,33,55,57,60,62,99,124,129,130,132,150,157,159,173,174],
 slither:[51,70,121,144,167,185],
 scuttle:[16,21,38,40,69,107,119,125,148,178],
 float:[53,133,135],
 walk:[1,4,7,14,18,25,27,30,35,42,44,47,49,66,73,77,79,81,83,85,87,90,95,97,101,103,105,113,115,127,137,139,146,152,155,160,162,164,165,166,170,175,176,177,180,183,184,186]
};
const familyMotion=new Map(Object.entries(families).flatMap(([kind,ids])=>ids.map(id=>['FAMILY-'+String(id).padStart(3,'0'),kind])));
export function companionProfile(species){
 const motion=species.companion_motion||familyMotion.get(species.family_id)||'walk';
 const gestures={walk:'takes a few careful steps',hop:'makes a small hop',hover:'drifts through a gentle arc',slither:'moves in a loose, winding curve',scuttle:'makes a quick little shuffle',float:'bobs gently in the air',swim:'glides through a gentle current'};
 return {motion,gesture:gestures[motion],height:species.stage==='Base'?34:species.stage==='Final'?44:39};
}
const vectors={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
export function createCompanion(){return {id:'party-companion',key:null,unit:null,visible:false,step:null,moving:false,stride:0,reactionUntil:0};}
export function resetCompanion(f,unit,player,room,blocked){
 f.key=unit?`${room}:${unit.uid}:${unit.species.id}`:null;f.unit=unit;f.step=null;f.moving=false;f.visible=false;
 if(!unit||unit.hp<=0||unit.dead)return;
 const [dx,dy]=vectors[player.facing]||vectors.down;
 const candidates=[[player.x-dx,player.y-dy],[player.x-1,player.y],[player.x+1,player.y],[player.x,player.y-1],[player.x,player.y+1]];
 const tile=candidates.find(([x,y])=>x>=0&&x<roomGrid(room)[0]&&y>=0&&y<roomGrid(room)[1]&&!blocked(x,y));
 if(!tile)return;
 [f.x,f.y]=tile;f.px=f.x*16+8;f.py=f.y*16+8;f.facing=player.facing;f.visible=true;
}
export function syncCompanion(f,unit,player,room,blocked){
 const key=unit?`${room}:${unit.uid}:${unit.species.id}`:null;
 if(key!==f.key||!unit||unit.hp<=0||unit.dead)resetCompanion(f,unit,player,room,blocked);
 else f.unit=unit;
}
export function followPlayerStep(f,player,duration,blocked){
 if(!f.unit||f.unit.hp<=0)return;
 // Follow the tile Aimon actually left, rather than steering through walls at corners.
 if(!f.visible||Math.abs(f.x-player.x)+Math.abs(f.y-player.y)>1||blocked(f.x,f.y)){
  f.x=player.x;f.y=player.y;f.px=player.px;f.py=player.py;f.step=null;f.visible=true;
 }
 if(f.x===player.x&&f.y===player.y)return;
 const dx=player.x-f.x,dy=player.y-f.y;f.facing=dx>0?'right':dx<0?'left':dy>0?'down':'up';
 beginStep(f,player.x,player.y,duration);
}
export function advanceCompanion(f,dt){if(f.step)advanceStep(f,dt);}
export function recordCompanionStep(unit){if(!unit)return;unit.companion??={};unit.companion.steps=(Number(unit.companion.steps)||0)+1;}
export function companionMood(unit,{night=false,indoors=false}={}){
 if(unit.status)return 'unwell';
 if(unit.hp/Math.max(1,unit.maxHp)<.3)return 'unwell';
 if(unit.hp/Math.max(1,unit.maxHp)<.65)return 'tired';
 const m=unit.companion||{},n=Number(m.talks)||0,steps=Number(m.steps)||0;
 if(!indoors&&steps>0&&steps%180>=160)return 'tired';
 const seed=[...unit.species.id].reduce((a,c)=>a+c.charCodeAt(0),0);
 return ['content','playful','affectionate','watchful'][(n+Math.floor(steps/24)+seed+(night?3:0))%4];
}
export function talkToCompanion(unit,context={}){
 const mood=companionMood(unit,context);unit.companion??={};const m=unit.companion;m.seen??={};
 const count=Number(m.seen[mood])||0;
 // A coprime walk visits all 100 entries before repeating, independently for each mood.
 const seed=Number(unit.species.id)*17;const index=(seed+count*37)%100;
 m.seen[mood]=count+1;m.talks=(Number(m.talks)||0)+1;m.lastMood=mood;
 return {mood,label:mood[0].toUpperCase()+mood.slice(1),text:behaviourFor(index,mood,unitName(unit),companionProfile(unit.species).gesture,unit.species),index};
}
// Waranwei: only the first right-facing source frame points left. Mirror frame 6, not frame 7.
export const MIRRORED_FOLLOWER_FRAMES={'181':[3],'185':[6],'230':[7],'342':[5]};
export const REVISED_FOLLOWERS=new Set(['361','362','363','376','377','380','381','381-wrath','384','387','388']);
const artCache=new Map();
export function companionArt(id){
 if(!artCache.has(id)){const im=new Image();im.src=`${REVISED_FOLLOWERS.has(id)?'assets/followers/'+id+'.webp':relicArtPath(id)||'assets/followers/'+id+'.webp'}?v=0.87.0`;artCache.set(id,im);}return artCache.get(id);
}
export function drawCompanion(ctx,f,time,reduced=false){
 const base=companionArt(f.unit.species.id),im=f.unit.shiny===true?(shinyCanvas(base,f.unit)||base):base;if(!im.complete||!im.naturalWidth)return;
 if(relicArtPath(f.unit.species.id)&&!REVISED_FOLLOWERS.has(f.unit.species.id)){const size=f.unit.species.stage==='Base'?34:42,airborne=f.unit.species.tideOrchard&&f.unit.species.companion_motion==='hover',bob=!reduced&&(f.step||airborne)?Math.sin(time/(airborne?220:70))*1.5:0;ctx.save();ctx.fillStyle='#07142555';ctx.beginPath();ctx.ellipse(f.px,f.py+1,size*.22,2.5,0,0,Math.PI*2);ctx.fill();ctx.translate(f.px,f.py+4-size-bob);if(f.facing===(RELIC_ART[f.unit.species.id]?.facesLeft?'right':'left'))ctx.scale(-1,1);if(!reduced&&f.step)ctx.rotate(Math.sin(time/100)*.045);drawRelicPanel(ctx,im,f.unit.species.id,-size/2,0,size);ctx.restore();return;}
 const p=companionProfile(f.unit.species),rows={down:0,left:1,up:2,right:3},threeFrame=f.unit.species.approvedMiasma;
 const progress=f.step?f.step.elapsed/f.step.duration:0;
 const frame=threeFrame?(reduced||!f.step?1:[1,0,1,2][Math.floor((f.stride+progress)*4)%4]):reduced?0:f.step?Math.floor((f.stride+progress)*2)%2:0;
 const size=f.unit.species.stage==='Base'?32:36;
 const lift=!reduced&&time<f.reactionUntil?Math.abs(Math.sin(time/130))*2:0;
 ctx.save();ctx.fillStyle='#07142555';ctx.beginPath();ctx.ellipse(f.px,f.py+1,size*.22,2.5,0,0,Math.PI*2);ctx.fill();
 ctx.imageSmoothingEnabled=false;const cell=im.naturalWidth/(threeFrame?3:2);
 const row=rows[f.facing]??0,mirrored=MIRRORED_FOLLOWER_FRAMES[f.unit.species.id]?.includes(row*2+frame);if(mirrored){ctx.translate(f.px,0);ctx.scale(-1,1);}
 ctx.drawImage(im,frame*cell,row*cell,cell,cell,mirrored?-size/2:f.px-size/2,f.py+4-size-lift,size,size);ctx.restore();
}

