import {drawCompanion,companionArt} from './companion.js?v=0.90.52';
export const FARM_SPECIES={plough:'048',piglet:'047',goat:'025',goose:'142',cooler:'211'};
export const FARM_PEN={left:4,top:6,right:18,bottom:19,gateX:18,gateTop:14,gateBottom:16};
export const FARM_FIELD={left:28,top:5,right:44,bottom:25};
export const FARM_ROUTES=[
 {id:'goat',species:'025',points:[[7,9],[13,9],[13,13],[7,13]],speed:.43},
 {id:'piglet',species:'047',points:[[7,16],[11,16],[11,13],[7,13]],speed:.36},
 {id:'goose',species:'142',points:[[13,16],[16,16],[16,11],[13,11]],speed:.5}
];
export const PLOUGH_ROUTE=[[30,22],[30,8],[33,8],[33,22],[36,22],[36,8],[39,8],[39,22],[42,22],[42,8],[30,8]];
export function farmPose(points,time,speed=.6,phase=0){const lengths=points.map((p,i)=>{const n=points[(i+1)%points.length];return Math.abs(n[0]-p[0])+Math.abs(n[1]-p[1]);});const total=lengths.reduce((a,b)=>a+b,0);let t=((time/1000*speed+phase)%total+total)%total;for(let i=0;i<points.length;i++){if(t>lengths[i]){t-=lengths[i];continue;}const a=points[i],b=points[(i+1)%points.length],dx=Math.sign(b[0]-a[0]),dy=Math.sign(b[1]-a[1]);return{x:a[0]+dx*t,y:a[1]+dy*t,facing:dx>0?'right':dx<0?'left':dy>0?'down':'up',progress:t%1};}return{x:points[0][0],y:points[0][1],facing:'up',progress:0};}
export function farmBlocked(x,y){const p=FARM_PEN,f=FARM_FIELD;if(x>=f.left&&x<=f.right&&y>=f.top&&y<=f.bottom&&(x===f.left||x===f.right||y===f.top||y===f.bottom))return !(x===f.left&&y>=14&&y<=16);const fence=x>=p.left&&x<=p.right&&y>=p.top&&y<=p.bottom&&(x===p.left||x===p.right||y===p.top||y===p.bottom);return fence&&!(x===p.gateX&&y>=p.gateTop&&y<=p.gateBottom);}
export function installCossenneFarm(maps,register){
 const town=maps.cossenne;town.farmTown=true;
 town.spots=town.spots.filter(s=>!['cs-farmer','cs-farm-notice'].includes(s.id));
 town.gates.push({id:'cs-farm-entry',label:'Communal farm · Khadija and the working partners',x:28,y:4,to:'cossenneFarm',arrival:[24,26,'up'],door:true,action:'cossenne-farm'});town.sidePaths.push({points:[[28,4],[28,17]]});
 maps.cossenneFarm={name:'Cossenne · Communal Farm',farm:true,orchardKind:'farm',terrain:'orchardFarm',hub:true,bloom:true,grass:[],props:[],road:[[24,6],[24,28]],sidePaths:[{points:[[18,15],[28,15]]},{points:[[8,27],[26,27]]}],gates:[{id:'cs-farm-home',label:'Return to Cossenne market',x:24,y:28,to:'cossenne',arrival:[28,6,'down'],door:true,action:'cossenne-farm'}],spots:[{id:'cs-farmer',label:'Farmer Khadija bint Ahmad',x:23,y:22,sprite:'bystander'}]};register('cossenneFarm','forest');
}
function fence(c,x,y,vertical=false){c.fillStyle='#483c28';c.fillRect(x*16+4,y*16+1,6,16);c.fillStyle='#bea36d';c.fillRect(x*16+5,y*16,4,15);c.fillStyle='#e7cc8c';c.fillRect(x*16+5,y*16,4,2);c.fillStyle='#a48a57';if(vertical){c.fillRect(x*16+6,y*16,3,17);}else{c.fillRect(x*16,y*16+5,17,3);c.fillRect(x*16,y*16+11,17,3);}}
function bed(c,x,y,w,h){c.fillStyle='#55472c';c.fillRect(x*16,y*16,w*16,h*16);for(let row=0;row<h;row++){c.fillStyle='#997748';c.fillRect(x*16+2,(y+row)*16+3,w*16-4,4);for(let col=0;col<w;col++){c.fillStyle='#608344';c.fillRect((x+col)*16+4,(y+row)*16+5,7,5);c.fillStyle='#9db65a';c.fillRect((x+col)*16+6,(y+row)*16+3,3,5);}}}
export function drawFarmTile(c,m,x,y,road,asset){asset(c,road?'bloomPath':'biomeorchardground',x,y);return true;}
export function drawFarmDecor(c,m,asset){const p=FARM_PEN,f=FARM_FIELD;
 for(let y=p.top;y<=p.bottom;y++)for(let x=p.left;x<=p.right;x++)if((x===p.left||x===p.right||y===p.top||y===p.bottom)&&!(x===p.gateX&&y>=p.gateTop&&y<=p.gateBottom))fence(c,x,y,x===p.left||x===p.right);
 // The gate is visibly hinged open; its three-tile opening is also walkable.
 for(const y of [p.gateTop,p.gateBottom]){c.fillStyle='#cdb778';c.fillRect((p.gateX-2)*16,y*16+5,3*16,3);}
 asset(c,'sack',5,7,2,2);c.fillStyle='#6b8b8b';c.fillRect(14*16,7*16,3*16,15);c.fillStyle='#84cbd1';c.fillRect(14*16+3,7*16+3,3*16-6,8);
 for(let yy=f.top;yy<=f.bottom;yy++)for(let xx=f.left;xx<=f.right;xx++)asset(c,'biomeorchardpath',xx,yy);c.save();c.globalAlpha=.68;c.fillStyle='#614b31';c.fillRect(f.left*16,f.top*16,(f.right-f.left+1)*16,(f.bottom-f.top+1)*16);c.restore();
 for(let x=f.left+1;x<f.right;x++){c.fillStyle=x%3===0?'#3b302399':'#8d6e4288';c.fillRect(x*16+2,(f.top+1)*16,5,(f.bottom-f.top-1)*16);c.fillStyle='#b08b52';c.fillRect(x*16+8,(f.top+1)*16,2,(f.bottom-f.top-1)*16);}
 for(let x=f.left;x<=f.right;x++){fence(c,x,f.top);fence(c,x,f.bottom);}for(let y=f.top+1;y<f.bottom;y++){if(y<14||y>16)fence(c,f.left,y,true);fence(c,f.right,y,true);}
 bed(c,5,22,12,2);asset(c,'chest',5,25,2,1);asset(c,'sack',14,25,2,2);
 asset(c,'orchardScenery',3,1,3,4,{x:0,y:0,w:64,h:64});asset(c,'orchardScenery',43,1,3,4,{x:0,y:0,w:64,h:64});

}
export function drawFarmTown(c,m,asset){for(const [x,y,w,h]of [[15,22,2,2],[29,22,3,2],[43,12,3,2],[17,1,8,2]])bed(c,x,y,w,h);for(let x=26;x<=30;x++)if(x!==28)fence(c,x,4);}
function plough(c,pose){const dx=pose.facing==='right'?1:pose.facing==='left'?-1:0,dy=pose.facing==='down'?1:pose.facing==='up'?-1:0;const bx=pose.x*16+8,by=pose.y*16+4,x=bx-dx*29,y=by-dy*29;c.save();c.strokeStyle='#b89b60';c.lineWidth=2;c.beginPath();c.moveTo(bx-dx*10-5*dy,by-dy*10+5*dx);c.lineTo(x+dx*8,y+dy*8);c.moveTo(bx-dx*10+5*dy,by-dy*10-5*dx);c.lineTo(x+dx*8,y+dy*8);c.stroke();c.translate(x,y);c.rotate(Math.atan2(dy,dx));
 // A timber beam, two trailing handles, iron mouldboard and depth wheel.
 c.fillStyle='#392e23';c.fillRect(-14,-3,27,7);c.fillStyle='#9b713e';c.fillRect(-13,-3,25,4);c.fillStyle='#d0aa6b';c.fillRect(-11,-3,22,1);c.strokeStyle='#76512d';c.lineWidth=3;c.beginPath();c.moveTo(-3,-2);c.lineTo(-13,-9);c.lineTo(-19,-9);c.moveTo(-3,2);c.lineTo(-13,9);c.lineTo(-19,9);c.stroke();
 c.fillStyle='#4e5c60';c.beginPath();c.moveTo(-8,2);c.quadraticCurveTo(7,1,8,12);c.lineTo(-4,10);c.quadraticCurveTo(-11,7,-8,2);c.fill();c.strokeStyle='#bac9c6';c.lineWidth=2;c.beginPath();c.moveTo(-7,3);c.quadraticCurveTo(4,2,7,10);c.stroke();c.strokeStyle='#392e23';c.lineWidth=3;c.beginPath();c.arc(5,-6,5,0,Math.PI*2);c.stroke();c.strokeStyle='#a69267';c.lineWidth=1;c.beginPath();c.moveTo(0,-6);c.lineTo(10,-6);c.moveTo(5,-11);c.lineTo(5,-1);c.stroke();c.restore();}
const farmHerd=[...FARM_ROUTES.map((a,i)=>({...a,phase:i*4})),{id:'plough',species:'048',points:PLOUGH_ROUTE,speed:.8,phase:0},{id:'cooler',species:'211',points:[[11,26]],speed:0,phase:0}].map(a=>({...a,clock:0}));
let lastFarmTick=null;
function herdPose(a){return a.points.length===1?{x:a.points[0][0],y:a.points[0][1],facing:'down',progress:0}:farmPose(a.points,a.clock,a.speed,a.phase);}
export function farmActors(room){return room==='cossenneFarm'?farmHerd.map(a=>{const p=herdPose(a);return{...p,id:'cs-animal-'+a.id,species:a.species,label:FARM_ANIMAL_TEXT[a.id].name,x:Math.round(p.x),y:Math.round(p.y),px:p.x*16+8,py:p.y*16+8,pose:p,clock:a.clock,farmAnimal:true};}):[];}
// Keep the same positions for drawing, A-button targeting and collision. Working
// partners wait when approached, selected for tap-to-walk, or a conversation opens.
export function advanceFarm(room,time,{paused=false,reduced=false,player=null,destination=null}={}){const dt=lastFarmTick===null?0:Math.max(0,Math.min(50,time-lastFarmTick));lastFarmTick=time;if(room!=='cossenneFarm'||paused||reduced)return;for(const a of farmHerd){const p=herdPose(a);if(destination==='cs-animal-'+a.id||player&&Math.abs(p.x-player.x)+Math.abs(p.y-player.y)<=2.5)continue;a.clock+=dt;}}
export function farmAnimalBlocked(room,x,y){return farmActors(room).some(a=>a.x===x&&a.y===y);}
export function farmAnimalHit(room,wx,wy){return farmActors(room).find(a=>Math.abs(wx-a.px)<=17&&wy>=a.py-35&&wy<=a.py+6)||null;}
export function drawFarmLife(c,time,reduced,species){for(const a of farmActors('cossenneFarm')){if(a.id==='cs-animal-plough')plough(c,a.pose);drawCompanion(c,{unit:{species:species(a.species)},px:a.px,py:a.py,facing:a.facing,stride:Math.floor(a.clock/900)%2,step:reduced||!a.clock?null:{elapsed:a.pose.progress,duration:1},reactionUntil:0},time,reduced);}}
export function warmFarmSprites(){for(const id of Object.values(FARM_SPECIES))companionArt(id);}
export const FARM_ANIMAL_TEXT={
 goat:{species:'025',name:'Caprune',text:'Caprune nibbles the coarse weeds between the orchard rows. It leaves the young fruit trees alone, then comes back to the pasture for water and a rest. Its careful grazing saves Khadija hours of clearing.'},
 piglet:{species:'047',name:'Rutlet',text:'Rutlet noses through the soft ground, turning the fallow soil and finding roots missed by the plough. Khadija keeps this young boar on the lighter work. It snuffles once, then returns to its search.'},
 goose:{species:'142',name:'Ganderiel',text:'Ganderiel searches the grass for slugs and insects before they reach the vegetable beds. It lifts its head to watch you, then resumes patrolling the pasture. The crops need fewer damaged leaves picked away.'},
 plough:{species:'048',name:'Ramporque',text:'Ramporque eases to a halt when you approach. The fully grown boar has been pulling the light plough up each furrow and turning on the headland. It waits patiently beside its harness; Khadija gives it water and a rest between rows.'},
 cooler:{species:'211',name:'Fleecicle',text:'A gentle chill comes from Fleecicle beside the harvest crates. It keeps fruit and medicinal leaves fresh until the market cooks and apothecary collect them. Dry seed is stored separately, away from the cold.'}
};
const FARM_BUSTS={'025':[155,30,215,290],'047':[60,100,300,310],'048':[200,140,300,290],'142':[100,85,210,285],'211':[35,50,300,310]};
export function farmAnimalLine(id){const a=FARM_ANIMAL_TEXT[id.replace(/^cs-animal-/,'')];return a?{speaker:a.name,text:a.text,abyssalId:a.species,farmBust:FARM_BUSTS[a.species]}:null;}

