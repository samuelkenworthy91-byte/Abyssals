// Deterministic irregular renewal schedule. Every gap, including the cycle seam,
// is 2–25 seconds; weather is presentation only and never consumes game RNG.
let seed=0x6c8e9cf5,total=0;
export const STORM_FLASH_SCHEDULE=Array.from({length:128},(_,i)=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;const gap=2000+seed%23001;total+=gap;return {at:total,gap,x:.15+((seed>>>8)%700)/1000};});
export const STORM_FLASH_CYCLE=total;
export function stormFlash(time){const t=((time%total)+total)%total;let last=STORM_FLASH_SCHEDULE.at(-1),at=last.at-total;for(const e of STORM_FLASH_SCHEDULE){if(e.at>t)break;last=e;at=e.at;}const age=t-at;return {active:age>=0&&age<850,age,alpha:age>=0&&age<850?.58*Math.sin(Math.min(1,age/110)*Math.PI/2)*Math.pow(1-age/850,1.7):0,x:last.x};}
export const isStormRoom=room=>room.startsWith('storm');
export function drawStormScreen(c,room,time,reduced,width,height){if(reduced||!isStormRoom(room))return;const f=stormFlash(time);if(!f.active)return;c.save();c.fillStyle=`rgba(225,235,255,${f.alpha})`;c.fillRect(0,0,width,height);const x=width*f.x;c.strokeStyle=`rgba(244,249,255,${Math.min(1,f.alpha*2)})`;c.shadowColor='#b6d8ff';c.shadowBlur=18;c.lineWidth=3;c.beginPath();c.moveTo(x,0);c.lineTo(x-width*.08,height*.2);c.lineTo(x+width*.015,height*.17);c.lineTo(x-width*.1,height*.48);c.lineTo(x-width*.04,height*.43);c.lineTo(x-width*.16,height*.86);c.stroke();c.restore();}
