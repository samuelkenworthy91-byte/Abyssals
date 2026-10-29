import {companionArt,drawCompanion} from './companion.js?v=0.90.52';
export const PEACH_ORCHARD_MYTHICS=Object.freeze({Feirong:'175',Guanrong:'183',Liubeirow:'184'});
export const HUNT_DURATION=9600;
const lerp=(a,b,p)=>a+(b-a)*p;
function along(points,p){const lengths=points.slice(1).map((b,i)=>Math.hypot(b[0]-points[i][0],b[1]-points[i][1])),total=lengths.reduce((a,b)=>a+b,0);let distance=Math.max(0,Math.min(1,p))*total;for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){const a=points[i],b=points[i+1],t=lengths[i]?distance/lengths[i]:0;return {x:lerp(a[0],b[0],t),y:lerp(a[1],b[1],t),facing:b[0]<a[0]?'left':b[0]>a[0]?'right':b[1]<a[1]?'up':'down'};}distance-=lengths[i];}}
export function huntFrame(elapsed,player={x:24,y:23},reduced=false){
 const t=Math.max(0,Math.min(HUNT_DURATION,elapsed));let stage='cornered',caption='Liubeirow is cornered against the broken cistern wall. Waranwei closes in.',hunter={x:36,y:17,facing:'right'},prey={x:40,y:17,facing:'left'},camera={x:38,y:17};
 if(t>=1600&&t<2400){stage='strike';caption='Waranwei smashes Liubeirow against the stone!';hunter.x=reduced?38:36+2*Math.sin((t-1600)/800*Math.PI);prey.x=40.5;}
 if(t>=2400&&t<3200){stage='breakout';caption='Liubeirow drives a desperate blow into Waranwei and breaks free!';hunter={x:35,y:17,facing:'right'};prey={x:39,y:17,facing:'left'};}
 if(t>=3200&&t<6800){stage='escape';caption='Wounded but alive, Liubeirow darts past you and flees up the bastion stairs.';prey=along([[40.5,17],[24,17],[24,23],[10,23],[10,17],[-3,17]],(t-3200)/3600);camera={x:lerp(38,player.x,Math.min(1,(t-3200)/1800)),y:lerp(17,player.y,Math.min(1,(t-3200)/1800))};hunter={x:37,y:17,facing:'left'};}
 if(t>=6800){prey=null;camera={x:player.x,y:player.y};stage=t<7800?'rage':'charge';caption=t<7800?'Its meal has escaped. Waranwei turns on you, shaking with rage.':'Waranwei charges!';hunter=t<7800?{x:37,y:17,facing:'left'}:along([[37,17],[24,17],[player.x,player.y]],(t-7800)/1800);}
 return {stage,caption,hunter,prey,camera,impact:!reduced&&(t>=1850&&t<2100||t>=2500&&t<2750),elapsed:t,done:t===HUNT_DURATION};
}
export async function prepareHuntArt(){await Promise.all(['184','185'].map(id=>{const image=companionArt(id);if(image.complete&&image.naturalWidth)return;return new Promise((resolve,reject)=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',()=>reject(Error('Cave sprite could not load')),{once:true});if(image.complete&&!image.naturalWidth)image.src=`assets/followers/${id}.webp?v=0.90.52&retry=${Date.now()}`;});}));}
export function drawHuntActor(ctx,pose,species,time,reduced=false,moving=false){if(!pose)return;drawCompanion(ctx,{unit:{species},px:pose.x*16+8,py:pose.y*16+8,facing:pose.facing,stride:0,reactionUntil:0,step:moving?{elapsed:(time%320)/1000,duration:.32}:null},time,reduced);}
export function drawHuntScene(ctx,frame,species,time,reduced=false){
 drawHuntActor(ctx,frame.hunter,species('185'),time,reduced,['charge','strike'].includes(frame.stage));drawHuntActor(ctx,frame.prey,species('184'),time,reduced,frame.stage==='escape');
 if(frame.impact){ctx.save();ctx.strokeStyle='#fff5d5';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(38*16,16*16);ctx.lineTo(41*16,18*16);ctx.moveTo(41*16,16*16);ctx.lineTo(38*16,18*16);ctx.stroke();ctx.restore();}
 if(frame.stage==='rage'){ctx.save();ctx.fillStyle='#ffb5a0';ctx.font='bold 18px system-ui';ctx.textAlign='center';ctx.fillText('!',frame.hunter.x*16+8,frame.hunter.y*16-32);ctx.restore();}
}
export async function playHunt({onFrame,player,reduced=false,wait,visible=()=>true}){
 const step=reduced?800:80;for(let t=0;t<=HUNT_DURATION;t+=step){while(!visible())await wait(80);onFrame(huntFrame(t,player,reduced));await wait(reduced?350:step);}
}
export function shouldStartHunt(state,room,player){const q=state.exploration||{};return room==='waranCave5'&&!q.mythic&&!q.huntSeen&&!q.huntBattlePending&&player.x>=24;}

