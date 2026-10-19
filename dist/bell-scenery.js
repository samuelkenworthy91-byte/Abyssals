// World-space woodland mechanisms: the art shares the collision opening at x44/y8.
const gateMotion=new WeakMap();
export const bellLanternHit=(sw,x,y)=>Math.abs(x-sw.x)<=1&&y>=sw.y-4&&y<=sw.y;
function stone(c,x,y,w,h){
 c.fillStyle='#263832';c.fillRect(x-1,y-1,w+2,h+2);
 const grad=c.createLinearGradient(x,y,x+w,y);grad.addColorStop(0,'#687467');grad.addColorStop(.3,'#a3ac8a');grad.addColorStop(.65,'#737f6b');grad.addColorStop(1,'#3c5144');c.fillStyle=grad;c.fillRect(x,y,w,h);
 c.fillStyle='#c4c3a0';c.fillRect(x+1,y,w-2,2);c.fillStyle='#33463b';c.fillRect(x+w-3,y+2,3,h-2);
 for(let row=10;row<h;row+=12){c.fillStyle='#3a4d40';c.fillRect(x,y+row,w,1);c.fillRect(x+(row%24?Math.floor(w*.35):Math.floor(w*.7)),y+row-10,1,10);}
 c.fillStyle='#4f703b';for(let i=0;i<w;i+=5)c.fillRect(x+i,y+2+(i%3),4,3);
}
function emblem(c,x,y,i,color){
 c.strokeStyle=color;c.fillStyle=color;c.lineWidth=1.5;c.beginPath();
 if(i===0){c.moveTo(x-6,y+3);c.lineTo(x-7,y-5);c.lineTo(x-3,y-1);c.lineTo(x,y-7);c.lineTo(x+3,y-1);c.lineTo(x+7,y-5);c.lineTo(x+6,y+3);c.closePath();c.stroke();c.fillRect(x-5,y+5,10,2);}
 else if(i===1){c.ellipse(x,y,7,5,0,0,Math.PI*2);c.stroke();c.beginPath();c.ellipse(x,y,4,2,0,0,Math.PI*2);c.stroke();}
 else{c.moveTo(x,y-7);c.lineTo(x,y+2);c.stroke();c.beginPath();c.arc(x,y+4,3,0,Math.PI*2);c.fill();}
}
export function drawBellLantern(c,sw,i,lit,time=0,reduce=false){
 const x=sw.x*16+8,y=sw.y*16+10,t=reduce?0:time/210+i*1.8;
 c.save();c.fillStyle='#172d2580';c.beginPath();c.ellipse(x,y+2,22,7,0,0,Math.PI*2);c.fill();
 if(lit){const glow=c.createRadialGradient(x,y-39,1,x,y-39,43);glow.addColorStop(0,'#ffd36d66');glow.addColorStop(.5,'#ffae3530');glow.addColorStop(1,'#ff9a1500');c.fillStyle=glow;c.fillRect(x-45,y-83,90,90);}
 stone(c,x-16,y-6,32,8);stone(c,x-12,y-32,24,26);stone(c,x-17,y-38,34,7);
 c.fillStyle='#1f3933';c.fillRect(x-8,y-27,16,18);c.strokeStyle='#b2aa7d';c.strokeRect(x-8,y-27,16,18);emblem(c,x,y-18,i,lit?'#ffe7a2':'#91a893');
 // Brass oil bowl and forged uprights, distinct from the old sewer valve.
 c.fillStyle='#2b3630';c.fillRect(x-11,y-45,22,7);c.fillStyle='#a89559';c.fillRect(x-12,y-46,24,3);c.fillStyle='#d3bd79';c.fillRect(x-9,y-43,18,2);c.fillStyle='#4c583e';c.fillRect(x-11,y-53,2,10);c.fillRect(x+9,y-53,2,10);
 if(lit){
  const sway=Math.sin(t)*3,stretch=Math.sin(t*1.7)*3;
  c.fillStyle='#f47426';c.beginPath();c.moveTo(x-9,y-45);c.bezierCurveTo(x-13,y-54,x+2+sway,y-57,x+sway,y-70-stretch);c.bezierCurveTo(x+12+sway,y-61,x+13,y-48,x+7,y-45);c.closePath();c.fill();
  c.fillStyle='#ffc649';c.beginPath();c.moveTo(x-6,y-45);c.bezierCurveTo(x-8,y-54,x-1+sway,y-53,x+1+sway,y-63-stretch);c.bezierCurveTo(x+8,y-52,x+8,y-47,x+4,y-45);c.closePath();c.fill();
  c.fillStyle='#fff1b8';c.beginPath();c.moveTo(x-3,y-45);c.quadraticCurveTo(x-4,y-51,x+1,y-55);c.quadraticCurveTo(x+6,y-48,x+3,y-45);c.fill();
  if(!reduce)for(let n=0;n<3;n++){const rise=(time/42+n*9+i*3)%28;c.globalAlpha=(1-rise/28)*.7;c.fillRect(x+Math.sin(t+n)*8,y-52-rise,1.5,2);}c.globalAlpha=1;
 }else{c.fillStyle='#182926';c.fillRect(x-8,y-44,16,2);}
 c.font='bold 7px serif';c.textAlign='center';c.fillStyle='#172b23';c.fillRect(x-23,y+7,46,10);c.fillStyle=lit?'#ffe6a1':'#c7d3b0';c.fillText(['CROWN','RIM','CLAPPER'][i],x,y+15);c.restore();
}
export function drawAncientBellGate(c,q,room,open,time=0,reduce=false){
 let rooms=gateMotion.get(q);if(!rooms){rooms=new Map();gateMotion.set(q,rooms);}let motion=rooms.get(room);
 if(!motion){motion={open,from:open?1:0,start:time};rooms.set(room,motion);}
 const progress=()=>reduce?(motion.open?1:0):motion.from+((motion.open?1:0)-motion.from)*Math.min(1,Math.max(0,(time-motion.start)/1100));
 if(motion.open!==open){motion.from=progress();motion.open=open;motion.start=time;}
 const raw=progress(),p=raw*raw*(3-2*raw),x=44*16+8,top=6*16,bottom=11*16;
 c.save();c.fillStyle='#17332888';c.fillRect(x-15,top+3,37,bottom-top+5);
 // Doors retract north/south into the stone housings, leaving the y8 road clear.
 c.save();c.beginPath();c.rect(x-12,top+11,25,bottom-top-20);c.clip();
 for(const side of [-1,1]){const start=side<0?top+11:8.5*16,shift=side*p*43;
  stone(c,x-10,start+shift,20,29);c.fillStyle='#334c39';c.fillRect(x-6,start+shift+3,12,23);c.strokeStyle='#a49a61';c.strokeRect(x-6,start+shift+3,12,23);
  c.fillStyle='#a8a778';for(let k=0;k<3;k++)c.fillRect(x-4,start+shift+7+k*7,8,2);
  c.fillStyle='#42682e';c.fillRect(x-10,start+shift+5,5,13);c.fillStyle='#789746';c.fillRect(x-9,start+shift+4,3,7);
 }c.restore();
 stone(c,x-18,top-5,36,19);stone(c,x-18,bottom-11,36,19);
 c.fillStyle='#6f8c44';for(let side of [top-6,bottom-12])for(let n=0;n<9;n++){const xx=x-18+n*4;c.fillRect(xx,side,4,4);c.fillStyle=n%2?'#829e50':'#527338';c.fillRect(xx+1,side+3,2,5+n%4);}
 c.strokeStyle='#415e32';c.lineWidth=2;for(const sign of [-1,1]){c.beginPath();c.moveTo(x+sign*19,top-8);c.bezierCurveTo(x+sign*25,top+8,x+sign*13,top+20,x+sign*18,top+31);c.stroke();c.fillStyle='#739548';for(let k=0;k<4;k++)c.fillRect(x+sign*(17+k%2*4),top+k*8,5,3);}
 emblem(c,x,top+4,room==='relicGrove'?0:1,open?'#ffe2a0':'#b4b48d');
 if(p>.95){c.fillStyle='#e1ce8366';c.fillRect(x-5,8*16+6,10,4);}
 if(open&&p<.98&&!reduce){c.fillStyle='#cebc8277';for(let n=0;n<5;n++)c.fillRect(x-14+((n*11+time/60)%29),top+20+n*8,2,2);}
 c.restore();
}
