import {drawSiteTablet} from './site-tablets.js?v=0.89.4';
import {AQUATIC_ASSETS,drawAquaticSurface,drawAquaticDetails} from './marasen-aquatic.js?v=0.89.2';
import {drawCompanion} from './companion.js?v=0.87.0';
export const MARASEN_ASSETS=Object.fromEntries(['Tree','Gate','Keep','Market','Apothecary','Archive','Mill','Binding'].map(n=>['marasen'+n,'marasen-'+n.toLowerCase()+'-v082.webp']));
Object.assign(MARASEN_ASSETS,AQUATIC_ASSETS);
for(const name of ['Potions','Books','Armour','Stairs','Counter'])MARASEN_ASSETS['exchange'+name]='exchange-'+name.toLowerCase()+'-v09012.webp';
for(let i=0;i<6;i++)MARASEN_ASSETS['exchangeBackdrop'+i]='exchange-frieze-'+i+'-v09012.webp';
const TERRAIN_NAMES=['LawnA','LawnB','PathA','PathB','MeadowA','MeadowB','MeadowC','MeadowD','WaterA','WaterB','WaterC','WaterD','Bank','Floor','TimberV','TimberH'];
for(const name of TERRAIN_NAMES)MARASEN_ASSETS['verdant'+name]='verdant-'+name.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase()+'-v085.webp';
for(const name of ['Oak','Willow','Fern','Reeds','Bridge','Log','Garden','Stones'])MARASEN_ASSETS['verdant'+name]='verdant-'+name.toLowerCase()+'-v085.webp';
MARASEN_ASSETS.marasenCliffRock='mountain-passFoothills-wall-v070.webp';
MARASEN_ASSETS.marasenTree=MARASEN_ASSETS.verdantOak;MARASEN_ASSETS.marasenCitadelHero='marasen-citadel-hero-v088.webp';MARASEN_ASSETS.marasenCliffFace='marasen-cliff-v088.webp';MARASEN_ASSETS.marasenCataract='marasen-cataract-v088.webp';MARASEN_ASSETS.marasenPavilion='marasen-pavilion-v088.webp';
export function marasenWaterTile(m,x,y){return ['falls','brook','cascades','watermeadow','rapids'].includes(m.verdantKind)&&Math.abs(x-(24+Math.floor(4*Math.sin(y/4))))<=2||!!m.marasenWater?.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d);}
export function marasenSurface(m,x,y,{road,walk,grass}){
 if(m.verdantKind==='fort')return 'fort';
 if(road)return marasenWaterTile(m,x,y)?'bridge':'path';
 if(grass)return 'meadow';
 if(marasenWaterTile(m,x,y)&&!walk)return 'water';
 if(!walk&&['falls','brook','cascades','watermeadow','rapids'].includes(m.verdantKind)&&Math.abs(x-(24+Math.floor(4*Math.sin(y/4))))<=4)return 'bank';
 return !walk&&['fern','canopy'].includes(m.verdantKind)?'floor':'lawn';
}
export function drawMarasenDetails(c,m,asset,walkable,time=0){if(!m?.verdantKind)return;if(m.aquaticCity){drawAquaticDetails(c,m,asset);return;}const kind=m.verdantKind;c.save();
 for(let x=0;x<48;x+=4){asset(c,(x%8===0?'verdantOak':'verdantWillow'),x,-1,3.8,4.3);asset(c,(x%8===0?'verdantWillow':'verdantOak'),x,29,3.8,4.3);}
 // Deliberately separate green terraces, blue headwaters and pink sanctuary petals.
 for(let y=3;y<29;y+=4)for(let x=3;x<44;x+=4){if(['falls','brook','cascades','watermeadow','rapids'].includes(kind)&&Math.abs(x-(24+Math.floor(4*Math.sin(y/4))))<=4)continue;if(![0,1,2].every(dx=>[0,1,2,3].every(dy=>!walkable(x+dx,y+dy)))||m.props.some(p=>x<p.x+p.w&&x+3>p.x&&y<p.y+p.h&&y+4>p.y))continue;asset(c,['brook','falls'].includes(kind)?'verdantWillow':'verdantOak',x-.1,y-.3,3.2,4.2);}
 if(kind==='city')for(const [x,y]of [[0,2],[14,1],[27,1],[45,2],[0,25],[44,25]])asset(c,'marasenTree',x,y,3.5,4.5);
 if(kind==='fort'){c.fillStyle='#687d6b';for(const x of m.name.includes('Gate Court')?[18,34]:[30])for(let y=6;y<=28;y++)if(y<16||y>18){c.fillRect(x*16,y*16,16,16);c.fillStyle='#d3cfad';c.fillRect(x*16+2,y*16+2,12,3);c.fillStyle='#687d6b';}asset(c,'marasenGate',4,3,9,7);}

 for(let i=0;i<22;i++){const x=3+(i*17)%40,y=4+(i*11)%23;if([0,1,2].every(dx=>[0,1].every(dy=>!walkable(x+dx,y+dy)))&&!m.props.some(p=>x<p.x+p.w&&x+3>p.x&&y<p.y+p.h&&y+2>p.y)){const water=marasenWaterTile(m,x,y);asset(c,water?'verdantReeds':i%3===0?'verdantLog':'verdantFern',x,y,3,2.2);}}
 if(kind==='city')for(const [x,y]of [[14,3],[18,26],[26,26],[43,22]])asset(c,'verdantGarden',x,y,2.5,1.8);
 // Original multilevel art direction: turquoise cataracts, white limestone
 // cliffs, flying buttresses and a bronze merchant roofline. Never place props
 // over main-route gate tiles or interaction hotspots.
 // Route scenery stays on blocked ground; clear paths, trainers and bridges remain visible.
 if(['cliffs','cascades'].includes(kind)){
  for(let y=3;y<29;y++)for(let x=3;x<45;x++){
   if(walkable(x,y)||m.spots.some(s=>Math.abs(s.x-x)+Math.abs(s.y-y)<3))continue;
   const wet=marasenWaterTile(m,x,y);
   if(wet){asset(c,'verdantWaterB',x,y,1,1,{x:x%8*16,y:y%8*16,w:16,h:16});}
   else if(!marasenWaterTile(m,x,y)&&((x<12&&y<13)||(x>36&&y<12)))asset(c,'marasenCliffRock',x,y,1,1,{x:x%8*16,y:y%8*16,w:16,h:16});
  }
 }
 if(['watermeadow','rapids'].includes(kind)){
  for(const [x,y]of [[4,5],[36,6],[5,23],[37,25]])asset(c,'verdantReeds',x,y,3,3);
  c.fillStyle='rgba(209,239,226,.72)';for(let i=0;i<36;i++){const x=(i*103+53)%700+20,y=(i*71+19)%440+16;if(!walkable(Math.floor(x/16),Math.floor(y/16))){c.fillRect(x,y,5+i%3,1);c.fillRect(x+2,y+4,3,1);}}
 }
 if(kind==='citadel'){
  asset(c,'marasenCitadelHero',16,2,26,14);
  for(const [x,y]of [[4,5],[38,22]])asset(c,'marasenPavilion',x,y,8,7);
 }
 if(kind==='city')asset(c,'marasenPavilion',20,3,8,8);
 if(kind==='exchange')for(const [x,y]of [[3,4],[35,4]])asset(c,'marasenPavilion',x,y,10,8);
 

 for(const s of m.spots){if(s.siteTablet)drawSiteTablet(c,s);if(s.id?.includes('control')||s.id==='mr-peach-bells'){c.fillStyle='#314e45';c.fillRect(s.x*16-18,s.y*16-15,52,22);for(let i=0;i<3;i++){c.strokeStyle=['#e9ca75','#afcfce','#e7b4b8'][i];c.lineWidth=3;c.beginPath();c.arc(s.x*16-10+i*17,s.y*16-5,5,0,Math.PI*2);c.stroke();}}}
 if(m.name.includes('Broken Bridle'))asset(c,'marasenBinding',29,10,10,8);if(m.name.includes('Wheelhouse'))asset(c,'marasenMill',27,3,12,8);
 c.restore();}

export function drawMarasenLife(c,state,room,time,reduced,species,asset=null,map=null,walkable=()=>true){
 if(map?.verdantKind&&map.verdantKind!=='fort'){
  c.save();c.strokeStyle='#dcfff4';c.lineWidth=.75;
  for(let i=0;i<28;i++){const x=3+(i*7)%42,y=3+(i*11)%26;if(!marasenWaterTile(map,x,y)||walkable(x,y))continue;const phase=reduced?.5:(Math.sin(time/1100+i)+1)/2;c.globalAlpha=.12+.24*phase;c.beginPath();c.ellipse(x*16+8,y*16+8,2+phase*3,.6+phase*.5,0,0,Math.PI);c.stroke();}c.restore();
  if(asset&&['millRace','millRoots','millWheel'].includes(room)&&state.marasen?.quests?.mill?.solved){
   for(const [x,y]of [[7,5],[14,26],[35,6],[41,24]])if([0,1,2].every(dx=>[0,1].every(dy=>!walkable(x+dx,y+dy))))asset(c,'verdantGarden',x,y,3,2);
   c.save();for(let i=0;i<7;i++){const t=reduced?0:time/1600+i,px=(10+i*4)*16+Math.sin(t)*6,py=(9+i%3*6)*16+Math.cos(t)*4;c.fillStyle=i%2?'#fff2a4':'#93ddea';c.fillRect(px-2,py,2,1);c.fillRect(px+1,py-1,2,1);}c.restore();
  }
 }

 if(room==='marasenGate'||room==='marasenHall'){
  const closed=room==='marasenGate'?[[18,!state.defeatedTrainers?.includes('TRN-MR-GATE')],[34,!state.marasen?.quests?.fort?.solved]]:[[30,!state.defeatedTrainers?.includes('TRN-MR-INNER')]];
  c.save();c.strokeStyle='#cab986';c.lineWidth=3;for(const [x,locked]of closed)if(locked)for(let y=16;y<=18;y++){c.beginPath();c.moveTo(x*16+4,y*16);c.lineTo(x*16+4,y*16+16);c.stroke();}c.restore();
 }
 const key=room==='peachSanctuary'?'peach':room==='commonBinding'?'tellurion':null;
 if(!key||state.marasen?.encounters?.[key])return;
 if(key==='tellurion'&&!state.defeatedTrainers?.includes('TRN-MR-DARIUS'))return;
 drawCompanion(c,{unit:{species:species(key==='peach'?'184':'165')},px:38*16+8,py:22*16+8,facing:'left',stride:0,reactionUntil:0,step:null},time,reduced);
}
export function drawMarasenTile(c,m,x,y,flags,asset=null){
 if(!m.verdantKind)return false;if(m.aquaticCity){drawAquaticSurface(c,m,x,y,flags,asset);return true;}
 const surface=marasenSurface(m,x,y,flags),seed=(x*71+y*139+x*y*13)>>>0;
 c.save();
 if(surface==='fort'){
  c.fillStyle=x>=2&&x<=45&&y>=6&&y<=28?'#b5b49d':'#405b49';c.fillRect(x*16,y*16,16,16);if(flags.walk&&seed%4===0){c.fillStyle='#c4c4ad';c.fillRect(x*16+3,y*16+7,6,2);}
 }else{
  const name={lawn:'verdantLawnB',meadow:'verdantMeadow'+(m.verdantKind==='meadow'?'A':['falls','brook','cascades','watermeadow','rapids'].includes(m.verdantKind)?'B':'C'),path:'verdantPath'+(['city','citadel'].includes(m.verdantKind)?'B':'A'),bridge:'verdantTimberH',water:'verdantWaterA',bank:'verdantBank',floor:'verdantFloor'}[surface];
  c.fillStyle={lawn:'#81ad51',meadow:'#315d35',path:'#c8a871',bridge:'#977141',water:'#359bad',bank:'#47734b',floor:'#497142'}[surface];c.fillRect(x*16,y*16,16,16);
  if(asset){const fx=Math.floor(x/8)%2===1,fy=Math.floor(y/8)%2===1,sx=((x%8)+8)%8,sy=((y%8)+8)%8;c.save();c.translate(x*16+(fx?16:0),y*16+(fy?16:0));c.scale(fx?-1:1,fy?-1:1);asset(c,name,0,0,1,1,{x:(fx?7-sx:sx)*16,y:(fy?7-sy:sy)*16,w:16,h:16});c.restore();}
 }
 c.restore();return true;
}
