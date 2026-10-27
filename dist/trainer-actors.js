import {beginStep,advanceStep} from './movement.js?v=0.87.0';
import {pathfind} from './engine.js?v=0.90.47';
const patrols={
 'TRN-C01-002':[[42,20],[42,23],[40,23],[40,20]],
 'TRN-C01-003':[[32,24],[35,24],[35,22],[32,22]],
 'TRN-C02-001':[[12,13],[12,11],[15,11],[12,11]],
 'TRN-C02-002':[[31,20],[31,23],[33,23],[31,23]]
};
const directions={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]};
export function createTrainers(spots){return spots.filter(s=>patrols[s.id]||s.patrol).map(s=>({...s,trainerActor:true,route:s.patrol||patrols[s.id],x:s.x,y:s.y,px:s.x*16+8,py:s.y*16+8,facing:'down',next:1,wait:1,step:null,stride:0}));}
export function seesPlayer(n,player,solid,range=6){if(n.step||player.step)return false;const [dx,dy]=directions[n.facing];for(let i=1;i<=range;i++){const x=n.x+dx*i,y=n.y+dy*i;if(x===player.x&&y===player.y)return true;if(solid(x,y))return false;}return false;}
export function updateTrainers(list,dt,solid,player,defeated,onSeen,targetId=null){for(const n of list){
 if(n.step){advanceStep(n,dt);continue;}
 if(!defeated.includes(n.id)&&seesPlayer(n,player,solid)){onSeen(n);return;}
 if(n.id===targetId)continue;
 n.wait-=dt;if(n.wait>0)continue;const [tx,ty]=n.route[n.next];
 if(n.x===tx&&n.y===ty){n.next=(n.next+1)%n.route.length;n.wait=1.1;continue;}
 // Route around corners instead of repeatedly trying the same blocked axis.
 // A temporarily occupied patrol point waits; an invalid point is skipped.
 const path=pathfind([n.x,n.y],[tx,ty],solid);
 if(!path.length){if(solid(tx,ty))n.next=(n.next+1)%n.route.length;n.wait=.5;continue;}
 const [x,y]=path[0];
 n.facing=x>n.x?'right':x<n.x?'left':y>n.y?'down':'up';
 if(solid(x,y)||player.x===x&&player.y===y||player.step?.x===x&&player.step?.y===y||list.some(o=>o!==n&&(o.x===x&&o.y===y||o.step?.x===x&&o.step?.y===y))){n.wait=.5;continue;}
 beginStep(n,x,y,.4);n.wait=.35;
}}

