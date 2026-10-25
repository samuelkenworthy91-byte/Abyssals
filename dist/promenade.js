// A real 360-tile crossing, viewed at one ninth the usual map scale.
// Collision, movement, egg progress and saving all use the ordinary tile grid.
export const PROMENADE_ROOM='willowglassBridge';
export const PROMENADE_SCALE=9;
export const PROMENADE_ENDS=[[36,144],[396,144]];
export const isPromenade=room=>room===PROMENADE_ROOM;
export const roomGrid=room=>isPromenade(room)?[432,288]:[48,32];
export function promenadeWalkable(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>=18&&x<=408&&y>=142&&y<=146;}
export function promenadeTap(x,y){
 if(y<106||y>182||x<5||x>422)return null;
 if(x<27)return [18,144];
 if(Math.abs(x-36)<=18)return [36,144];
 if(Math.abs(x-396)<=26)return [396,144];
 return [Math.max(18,Math.min(408,x)),144];
}
export function installPromenade(maps){
 maps.philomere.gates.push({id:'willowglass-entry',label:'Willowglass Viaduct',x:22,y:28,to:PROMENADE_ROOM,arrival:[36,144,'right'],door:true});
 maps[PROMENADE_ROOM]={name:'Philomere · Willowglass Viaduct',terrain:'promenade',road:[[18,144],[408,144]],grass:[],props:[],spots:[],gates:[{id:'willowglass-return',label:'Return to Philomere',x:18,y:144,to:'philomere',arrival:[22,26,'up'],door:true}]};
}
export const PROMENADE_Y_OFFSET=-24;
export const PROMENADE_ART='assets/scenery/willowglass-marsh-v09036.webp';
const backdrop=typeof Image==='undefined'?null:new Image();
if(backdrop){backdrop.decoding='async';backdrop.src=PROMENADE_ART;}
export const promenadeArtReady=()=>!!backdrop?.complete&&backdrop.naturalWidth>0;
export function drawPromenade(c){
 c.save();c.imageSmoothingEnabled=false;
 if(promenadeArtReady())c.drawImage(backdrop,0,0,768,512);
 else{c.fillStyle='#203e40';c.fillRect(0,0,768,512);}
 c.restore();
}
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
export function drawPromenadeEntrance(c){
 c.save();const x=22*16,y=28*16;
 // A small timber garden arch echoes the old bridge beyond the town wall.
 for(const dx of [-23,23]){rect(c,'#332f26',x+dx,y-43,7,48);rect(c,'#806c48',x+dx+1,y-42,3,46);rect(c,'#a28c61',x+dx,y-42,1,44);}
 rect(c,'#473e2b',x-26,y-46,59,8);rect(c,'#a48b5b',x-26,y-46,59,2);
 for(let i=0;i<18;i++){const dx=i%2?-23:25,dy=-42+(i*7)%43;rect(c,i%3?'#507452':'#78905c',x+dx-2+(i%3)*2,y+dy,6,4);}
 for(const dx of [-19,26]){rect(c,'#d2b66e',x+dx-3,y-32,6,9);rect(c,'#ffdfa0',x+dx-1,y-30,2,5);rect(c,'#3d3929',x+dx-4,y-34,8,2);}
 c.restore();
}
