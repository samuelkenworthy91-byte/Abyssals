// Deterministic irregular renewal schedule. Every gap, including the cycle seam,
// is 2–25 seconds; weather is presentation only and never consumes game RNG.
let seed=0x6c8e9cf5,total=0;
export const STORM_FLASH_SCHEDULE=Array.from({length:128},(_,i)=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;const gap=2000+seed%23001;total+=gap;return {at:total,gap,x:.15+((seed>>>8)%700)/1000};});
export const STORM_FLASH_CYCLE=total;
export function stormFlash(time){const t=((time%total)+total)%total;let last=STORM_FLASH_SCHEDULE.at(-1),at=last.at-total;for(const e of STORM_FLASH_SCHEDULE){if(e.at>t)break;last=e;at=e.at;}const age=t-at;return {active:age>=0&&age<850,age,alpha:age>=0&&age<850?.58*Math.sin(Math.min(1,age/110)*Math.PI/2)*Math.pow(1-age/850,1.7):0,x:last.x};}
export const isStormRoom=room=>room.startsWith('storm');
// A branching discharge, with short irregular leaders and thinner forks growing
// from real junctions. This PRNG is local to artwork and cannot alter battle RNG.
export function lightningPaths(seed,width,height,x=.52){
 let v=(seed|0)||0x4e612b;const random=()=>{v^=v<<13;v^=v>>>17;v^=v<<5;return (v>>>0)/4294967296;};
 const main=[[width*x,-8]];let px=width*x;const drift=(random()-.5)*width*.3;
 for(let i=1;i<=26;i++){px+=drift/26+(random()-.5)*width*.065;main.push([px,height*i/26*.96]);}
 const paths=[{points:main,width:2.2}];
 for(const [n,at]of [4,7,10,14,18,21].entries()){
  const from=main[at],sign=n%2?1:-1,points=[from];let bx=from[0],by=from[1];
  for(let i=1;i<=9;i++){bx+=sign*width*(.018+random()*.018)+(random()-.5)*width*.025;by+=height*(.012+random()*.016);points.push([bx,by]);}
  paths.push({points,width:1.15-at*.025});
  if(n<3){const branch=[points[4]];let [tx,ty]=points[4];for(let j=0;j<5;j++){tx+=sign*width*(.014+random()*.015);ty+=height*(.006+random()*.014);branch.push([tx,ty]);}paths.push({points:branch,width:.55});}
 }
 return paths;
}
let lastBoltKey='',lastBolt=[];
export function drawStormScreen(c,room,time,reduced,width,height){
 if(reduced||!isStormRoom(room))return;const f=stormFlash(time);if(!f.active)return;
 c.save();c.fillStyle=`rgba(225,235,255,${f.alpha})`;c.fillRect(0,0,width,height);
 const seed=Math.floor(time-f.age),key=[seed,width,height].join(':');if(key!==lastBoltKey){lastBoltKey=key;lastBolt=lightningPaths(seed,width,height,f.x);}
 c.lineCap='round';c.lineJoin='round';
 for(const glow of [true,false]){c.strokeStyle=`rgba(${glow?'151,191,255':'245,250,255'},${Math.min(1,f.alpha*(glow?.55:2))})`;c.shadowColor='#c5dfff';c.shadowBlur=glow?15:3;
  for(const path of lastBolt){c.lineWidth=path.width*(glow?3:1);c.beginPath();path.points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
 }
 c.restore();
}
