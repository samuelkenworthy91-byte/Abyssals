import {courtState} from './paladin-roaming.js?v=0.87.0';
// N,E,S,W. Channels must connect reciprocally; no water may leak into a nest.
export const CHANNEL_BASE=[6,10,10,13,6,10,3,11,10];
export const CHANNEL_LINKS=[1,2,5,0,3,8,7,4,6];
export const CHANNEL_START=[2,1,1,1,2,0,2,0,3];
export const turnMask=(mask,turns)=>{for(let i=0;i<turns%4;i++)mask=((mask<<1)&15)|(mask>>3);return mask;};
export function trialState(state){const q=courtState(state);q.trials??={channels:{turns:q.legacyProgress?Array(9).fill(0):[...CHANNEL_START],moves:0,solved:!!q.legacyProgress},wardens:{positions:q.legacyProgress?[...WARDEN_GOALS]:[0,4,4,0],moves:0,solved:!!q.legacyProgress}};return q.trials;}
export function channelFlow(turns){const masks=CHANNEL_BASE.map((m,i)=>turnMask(m,turns[i])),wet=new Set(),queue=[];if(masks[3]&8){wet.add(3);queue.push(3);}let leaks=0;const directions=[[0,-1,1,4],[1,0,2,8],[0,1,4,1],[-1,0,8,2]];
 while(queue.length){const i=queue.shift(),x=i%3,y=Math.floor(i/3);for(const[dx,dy,bit,opposite]of directions){if(!(masks[i]&bit))continue;const xx=x+dx,yy=y+dy;if(xx<0||xx>2||yy<0||yy>2){if(!(x===0&&y===1&&bit===8)&&!(x===2&&bit===2))leaks++;continue;}const next=yy*3+xx;if(!(masks[next]&opposite)){leaks++;continue;}if(!wet.has(next)){wet.add(next);queue.push(next);}}}
 const outlets=[2,5,8].map(i=>wet.has(i)&&!!(masks[i]&2));return {masks,wet:[...wet],leaks,outlets,solved:outlets.every(Boolean)&&leaks===0&&wet.size===9};
}
export function rotateChannel(state,index){const q=courtState(state),t=trialState(state).channels;if(!q.accepted||t.solved||!Number.isInteger(index)||index<0||index>8)return false;t.turns[index]=(t.turns[index]+1)%4;const linked=CHANNEL_LINKS[index];t.turns[linked]=(t.turns[linked]+3)%4;t.moves++;t.solved=channelFlow(t.turns).solved;return true;}
export const WARDEN_WALLS=[[2,1],[1,3],[3,3]];
export const WARDEN_GOALS=[3,0,1,0];
export const WARDEN_START=[0,4,4,0];
export function moveWardens(positions,direction){const d={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]}[direction];if(!d)return null;const valid=(x,y)=>x>=0&&x<5&&y>=0&&y<5&&!WARDEN_WALLS.some(p=>p[0]===x&&p[1]===y);const result=[...positions];for(let i=0;i<2;i++){const n=i*2,sign=i===0?1:-1,x=positions[n]+d[0]*sign,y=positions[n+1]+d[1]*sign;if(valid(x,y)){result[n]=x;result[n+1]=y;}}if(result[0]===result[2]&&result[1]===result[3])return null;return result;}
export function stepWardens(state,direction){const q=courtState(state),t=trialState(state).wardens;if(!q.accepted||t.solved)return false;const next=moveWardens(t.positions,direction);if(!next||next.every((v,i)=>v===t.positions[i]))return false;t.positions=next;t.moves++;t.solved=next.every((v,i)=>v===WARDEN_GOALS[i]);return true;}
export function resetTrial(state,key){const q=courtState(state),trials=trialState(state);if(!q.accepted||!['channels','wardens'].includes(key)||trials[key].solved)return false;if(key==='channels')trials.channels={turns:[...CHANNEL_START],moves:0,solved:false};else trials.wardens={positions:[...WARDEN_START],moves:0,solved:false};return true;}
export const trialsReady=state=>{const t=trialState(state);return t.channels.solved&&t.wardens.solved;};
