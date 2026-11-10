// Highwater Citadel's *interior* only. Artwork never changes collisions or gates.
// Orthographic 16px pixel clusters; no textures from the exterior are replaced.
const px=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const tile=(n)=>n*16;
function inset(c,x,y,w,h,outer,inner){px(c,x,y,w,h,outer);px(c,x+2,y+2,w-4,h-4,inner);}
export function drawHighwaterHallTile(c,x,y){
 const X=tile(x),Y=tile(y),inside=x>=2&&x<=45&&y>=6&&y<=28;
 if(!inside){
  px(c,X,Y,16,16,'#102a3b');px(c,X,Y,16,2,'#1b5360');
  if((x+y)%3===0){px(c,X+3,Y+6,6,1,'#2b6674');px(c,X+8,Y+11,4,1,'#2a8791');}
  return;
 }
 // Limestone floor: each square is a built tile, with a recessed grout line.
 const marble=(x+y)%2===0?'#b3ccca':'#a2bdbb';
 px(c,X,Y,16,16,'#51747b');px(c,X+1,Y+1,14,14,marble);
 px(c,X+2,Y+2,11,1,'#d8e3d9');px(c,X+2,Y+3,1,9,'#d7dbcf');
 px(c,X+3,Y+13,11,1,'#779d9b');px(c,X+13,Y+3,1,11,'#729296');
 if((x*29+y*17)%7===0){px(c,X+5,Y+6,3,1,'#95b5b2');px(c,X+8,Y+9,2,1,'#88a7a5');}
 // Woven brass-and-tide aisle, echoing the channels of the water city.
 if(y>=16&&y<=18&&x>=3&&x<=44){
  px(c,X,Y,16,16,(x+y)%2?'#245866':'#286b74');
  px(c,X,Y,16,2,'#caa45d');px(c,X,Y+14,16,2,'#caa45d');
  px(c,X+5,Y+3,6,10,'#376e78');px(c,X+7,Y+4,2,8,'#8acbd0');
  if(x%3===0){px(c,X+4,Y+7,8,2,'#d7bb74');px(c,X+7,Y+4,2,8,'#d7bb74');}
 }
 // Inlaid individual water-drop medallions and pearly crossroads.
 if(y>=8&&y<=27&&x>=4&&x<=44&&(x+y)%11===0){
  px(c,X+7,Y+3,2,3,'#f0e3ad');px(c,X+5,Y+6,6,5,'#4b9d9e');
  px(c,X+6,Y+7,4,3,'#bdece3');px(c,X+7,Y+12,2,2,'#b49457');
 }
}
const metal=(c,x,y,w,h)=>{inset(c,x,y,w,h,'#765b43','#d2af6e');px(c,x+3,y+2,w-6,2,'#f3d99d');};
export function drawHighwaterHallDecor(c){
 c.save();
 // Triple-height marble frieze. Drawn AFTER old room assets to replace its
 // flat placeholder walls; player, trainers and locked gates draw afterwards.
 px(c,32,25,704,79,'#244654');
 for(let x=32;x<736;x+=32){px(c,x,25,32,8,(x/32)%2?'#416d73':'#4c7c81');px(c,x,32,2,70,'#274956');px(c,x+3,34,26,4,'#8aa8a1');}
 px(c,32,92,704,10,'#183b4c');px(c,32,101,704,4,'#d0aa6b');px(c,32,107,704,3,'#7b765a');
 // Aquatic stained-glass gallery, bounded by pale carved stone capitals.
 for(const x of [96,240,384,528,672]){
  inset(c,x-27,42,54,53,'#d6d6bd','#385d72');
  px(c,x-21,48,42,39,'#143c58');
  for(let row=0;row<5;row++)for(let col=0;col<6;col++){
   const t=(row*7+col*13+x)%4;
   px(c,x-19+col*7,51+row*7,6,6,['#2b7d91','#55b0ae','#a0d6cb','#407084'][t]);
  }
  px(c,x-1,47,2,42,'#f3d6a0');px(c,x-23,66,45,2,'#c7ac79');
  px(c,x-29,91,58,5,'#baad87');px(c,x-20,43,40,3,'#e9ddae');
 }
 // Layered columns: shadow, polished limestone, turquoise embedded veins.
 for(const x of [49,192,336,480,625,716]){
  px(c,x,72,14,127,'#1d4854');px(c,x+3,72,10,121,'#91aca7');
  px(c,x+5,74,3,112,'#dce3cf');px(c,x+9,77,2,106,'#5d9995');
  metal(c,x-5,68,23,10);metal(c,x-5,191,23,9);
 }
 // Shallow water runnels along the court walls; purely decorative, never impassable.
 for(const side of [43,697]){
  px(c,side,208,29,232,'#36586b');px(c,side+3,208,23,232,'#15546a');
  px(c,side+6,208,15,232,'#258b98');px(c,side+8,208,5,232,'#58c2c2');
  for(let y=218;y<438;y+=31){px(c,side+6,y,16,2,'#a5e1d6');px(c,side+10,y+8,9,1,'#e5efe1');}
  px(c,side-2,207,33,5,'#ddc18b');px(c,side-2,439,33,5,'#ddc18b');
 }
 // Brass tide-compass floor mosaic, leaves the historical centre gate readable.
 const cx=391,cy=356;
 for(let r=57;r>=42;r-=5){c.strokeStyle=r%2?'#b99457':'#376e79';c.lineWidth=2;c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.stroke();}
 for(let k=0;k<8;k++){const a=k*Math.PI/4;px(c,cx+Math.cos(a)*49-3,cy+Math.sin(a)*49-3,6,6,k%2?'#f2d6a0':'#78c9c9');}
 px(c,cx-4,cy-20,8,40,'#ddc68a');px(c,cx-20,cy-4,40,8,'#ddc68a');
 // Leader's dais and ceremonial flowing-water canopy. No NPC positions move.
 metal(c,544,306,171,9);px(c,546,318,166,111,'#2e6673');
 for(let i=0;i<6;i++){const yy=330+i*14;px(c,550,yy,160,2,'#aad4c7');px(c,558+(i%2)*12,yy+5,138,2,'#3c939d');}
 px(c,560,424,139,6,'#d7b77d');px(c,579,300,102,7,'#f1d9a4');
 for(const x of [560,689]){px(c,x,279,9,34,'#e3dfc3');px(c,x+3,282,3,28,'#4b9b9d');}
 // Crown of falling water behind Khalid, subtle enough to keep the sprite visible.
 for(let i=0;i<6;i++){const x=589+i*15;px(c,x,284,8,20,'#3a95a0');px(c,x+2,287,3,18,'#9bddd4');}
 // Foreground entrance threshold: highlighted stone, existing door/gate intact.
 metal(c,39,265,36,6);metal(c,701,265,36,6);
 c.restore();
}
