import {beginStep,advanceStep} from './movement.js?v=0.87.0';
import {pathfind} from './engine.js?v=0.90.51';

// Hand-authored patrols always take precedence over generated routes.
const patrols={
 'TRN-C01-002':[[42,20],[42,23],[40,23],[40,20]],
 'TRN-C01-003':[[32,24],[35,24],[35,22],[32,22]],
 'TRN-C02-001':[[12,13],[12,11],[15,11],[12,11]],
 'TRN-C02-002':[[31,20],[31,23],[33,23],[31,23]]
};
const directions={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]};
const headings=Object.keys(directions);
const validPoint=(x,y,solid)=>x>=2&&x<=45&&y>=2&&y<=29&&!solid(x,y);
function clearSegment(a,b,solid){
 if(a[0]!==b[0]&&a[1]!==b[1])return false;
 const dx=Math.sign(b[0]-a[0]),dy=Math.sign(b[1]-a[1]);
 for(let x=a[0],y=a[1];x!==b[0]||y!==b[1];){x+=dx;y+=dy;if(!validPoint(x,y,solid))return false;}
 return true;
}
// Deterministic, local, wall-safe loops: no generated patrol crosses a gate or obstacle.
export function localPatrol(spot,solid){
 const x=spot.x,y=spot.y,home=[x,y];
 if(!validPoint(x,y,solid))return null;
 for(const [dx,dy] of [[2,2],[-2,2],[2,-2],[-2,-2]]){
  const route=[home,[x+dx,y],[x+dx,y+dy],[x,y+dy]];
  if(route.every((p,i)=>clearSegment(p,route[(i+1)%route.length],solid)))return route;
 }
 for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){
  const target=[x+dx,y+dy];
  if(clearSegment(home,target,solid))return [home,target];
 }
 return null;
}
function roamingSlot(id){let hash=0;for(const char of id)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;return hash%3===0;}

// All bona fide field trainers get an actor, even when they have no patrol.
// Story/civilian actors are not eligible simply because they have a battle portrait.
export function createTrainers(spots,{eligibleIds=null,solid=()=>false,roaming=false}={}){
 return spots.filter(s=>s.sprite!==undefined&&s.id?.startsWith('TRN-')&&(!eligibleIds||eligibleIds.has(s.id))).map(s=>{
  const canRoam=typeof roaming==='function'?roaming(s):roaming;
  const route=s.patrol||patrols[s.id]||(canRoam&&roamingSlot(s.id)?localPatrol(s,solid):null);
  const moving=Array.isArray(route)&&route.length>1;
  return {...s,trainerActor:true,route:moving?route:null,x:s.x,y:s.y,
   px:s.x*16+8,py:s.y*16+8,facing:directions[s.facing]?s.facing:'down',
   scanAllDirections:!moving&&!directions[s.facing],next:moving?1:0,
   wait:1,scanWait:1.5,step:null,stride:0};
 });
}
export function seesPlayer(n,player,solid,range=n.sightRange??6){
 if(n.step||player.step||n.x===player.x&&n.y===player.y)return false;
 const visibleHeadings=n.scanAllDirections?headings:[n.facing];
 for(const heading of visibleHeadings){
  const [dx,dy]=directions[heading]||directions.down;
  for(let i=1;i<=range;i++){
   const x=n.x+dx*i,y=n.y+dy*i;
   if(x===player.x&&y===player.y){n.facing=heading;return true;}
   if(solid(x,y))break;
  }
 }
 return false;
}
export function updateTrainers(list,dt,solid,player,defeated,onSeen,targetId=null,canChallenge=()=>true){
 for(const n of list){
  if(n.step){advanceStep(n,dt);continue;}
  if(!defeated.includes(n.id)&&canChallenge(n)&&seesPlayer(n,player,solid)){onSeen(n);return;}
  if(n.id===targetId)continue;
  if(!n.route){
   // Idle lookouts visibly scan; explicitly authored facings stay fixed.
   if(n.scanAllDirections){n.scanWait-=dt;if(n.scanWait<=0){n.scanWait=1.5;n.facing=headings[(headings.indexOf(n.facing)+1)%4];}}
   continue;
  }
  n.wait-=dt;if(n.wait>0)continue;
  const [tx,ty]=n.route[n.next];
  if(n.x===tx&&n.y===ty){n.next=(n.next+1)%n.route.length;n.wait=.8;continue;}
  // Never step onto the player, a resident, another trainer or solid terrain.
  // A blocked authored destination is skipped; transient occupancy is retried.
  if(solid(tx,ty)){n.next=(n.next+1)%n.route.length;n.wait=.6;continue;}
  const path=pathfind([n.x,n.y],[tx,ty],solid);
  if(!path.length){n.wait=.5;continue;}
  const [x,y]=path[0];
  if(solid(x,y)||player.x===x&&player.y===y||player.step?.x===x&&player.step?.y===y||list.some(o=>o!==n&&(o.x===x&&o.y===y||o.step?.x===x&&o.step?.y===y))){n.wait=.4;continue;}
  n.facing=x>n.x?'right':x<n.x?'left':y>n.y?'down':'up';
  beginStep(n,x,y,.4);n.wait=.35;
 }
}
