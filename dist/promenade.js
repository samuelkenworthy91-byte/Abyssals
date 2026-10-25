// A real 360-tile crossing, viewed at one ninth the usual map scale.
// Collision, movement, egg progress and saving all use the ordinary tile grid.
export const PROMENADE_ROOM='willowglassBridge';
export const PROMENADE_SCALE=9;
export const PROMENADE_ENDS=[[36,144],[396,144]];
export const isPromenade=room=>room===PROMENADE_ROOM;
export const roomGrid=room=>isPromenade(room)?[432,288]:[48,32];
export function promenadeWalkable(x,y){
 return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<432&&y>=0&&y<288&&(x<=36||x>=396||y>=142&&y<=146);
}
export function promenadeTap(x,y){
 // Both full-height edges act as generous exit targets, including letterboxing.
 if(x<=54)return [36,144];
 if(x>=370)return [396,144];
 if(y<106||y>182)return null;
 return [Math.max(36,Math.min(396,x)),144];
}
export function promenadeGate(gates,x,y){return gates?.find(g=>g.edgeSide==='west'?x<=36:g.edgeSide==='east'?x>=396:false);}
export const promenadeTravelDuration=running=>(running?.1:.2)/3;
export const PROMENADE_PLAYER_SIZE=.75,PROMENADE_COMPANION_SIZE=.36;
export function installPromenade(maps){
 const east=maps.philomere.gates.find(g=>g.id==='philomere-boundary');
 Object.assign(east,{label:'Willowglass Viaduct · Rivercause Road',to:PROMENADE_ROOM,arrival:[36,144,'right']});
 maps.philomere.gates=maps.philomere.gates.filter(g=>g.id!=='willowglass-entry');
 Object.assign(maps.rivercause.gates.find(g=>g.id==='rivercause-back'),{label:'Willowglass Viaduct · Philomere',to:PROMENADE_ROOM,arrival:[396,144,'left']});
 maps[PROMENADE_ROOM]={name:'Philomere · Willowglass Viaduct',terrain:'promenade',road:[[36,144],[396,144]],grass:[],props:[],spots:[],gates:[
  {id:'willowglass-return',label:'West · Philomere',x:36,y:144,edgeSide:'west',to:'philomere',arrival:[44,17,'left'],door:true},
  {id:'willowglass-forward',label:'East · Rivercause Road',x:396,y:144,edgeSide:'east',to:'rivercause',arrival:[3,17,'right'],door:true}
 ]};
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
 drawPromenadeWayfinding(c);c.restore();
}
export function drawPromenadeWayfinding(c){
 c.save();c.fillStyle='#152c2de8';c.fillRect(10,461,183,38);c.fillRect(498,461,260,38);
 c.strokeStyle='#cbb78b';c.lineWidth=1;c.strokeRect(10.5,461.5,182,37);c.strokeRect(498.5,461.5,259,37);
 c.fillStyle='#fff0bf';c.font='bold 18px system-ui';c.textAlign='left';c.fillText('← PHILOMERE',22,486);c.textAlign='right';c.fillText('RIVERCAUSE ROAD →',746,486);
 // Big edge chevrons remain legible when the whole marsh fits a portrait screen.
 c.strokeStyle='#17312be6';c.lineWidth=9;
 for(const [x,d]of [[24,-1],[744,1]]){c.beginPath();c.moveTo(x-d*10,218);c.lineTo(x+d*2,233);c.lineTo(x-d*10,248);c.stroke();}
 c.strokeStyle='#ffe5a0';c.lineWidth=4;
 for(const [x,d]of [[24,-1],[744,1]]){c.beginPath();c.moveTo(x-d*10,218);c.lineTo(x+d*2,233);c.lineTo(x-d*10,248);c.stroke();}
 c.restore();
}
