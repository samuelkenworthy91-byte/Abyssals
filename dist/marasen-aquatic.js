// Marasen geometry is shared by collision, bridge art, furniture and entrances.
export const AQUATIC_ASSETS=Object.fromEntries(['exchange','arena','citadel','pavilion','pearl','water','bridge','teal'].map(n=>['aquatic'+n[0].toUpperCase()+n.slice(1),'aquatic-'+n+'-v089.webp']));
export const EXCHANGE_FLOORS=['General Provisions','Technique Library','Relic Gallery','Evolution Atelier','Growth Apothecary','Merchant’s Terrace'];
const palettes=[['#d6d2ad','#4e827a'],['#b8c7d2','#335f85'],['#d0cdc1','#657c85'],['#c4d3bd','#527b68'],['#bdcfb7','#466e57'],['#dfd7b5','#977b48']];
const furniture=[
 [['shelf',6,16,6,3],['shelf',36,16,6,3],['sack',7,23,3,2],['chest',37,23,3,2]],
 [['shelf',6,15,7,3],['shelf',35,15,7,3],['table',8,22,5,3],['table',35,22,5,3]],
 [['table',7,17,6,3],['table',35,17,6,3],['chest',8,23,3,2],['chest',37,23,3,2]],
 [['table',7,17,6,3],['table',35,21,6,3],['shelf',36,15,6,3]],
 [['shelf',6,17,6,3],['shelf',36,17,6,3],['table',7,23,5,2],['table',36,23,5,2]],
 [['table',7,17,6,3],['table',35,17,6,3],['shelf',7,23,6,2]]
];
export function exchangeProps(floor){return [['desk',20,10,9,3],...furniture[floor],['verdantGarden',16,16,2,2],['verdantGarden',31,22,2,2]];}
const contains=(r,x,y)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;
const inRects=(rs,x,y)=>rs?.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d)||false;
export function exchangeWalkable(m,x,y){return x>=3&&x<=44&&y>=7&&y<=28&&!exchangeProps(m.exchangeFloor).some(([,a,b,w,h])=>x>=a&&x<a+w&&y>=b&&y<b+h);}
export function aquaticWalkable(m,x,y){if(m.aquaticBuildings?.some(b=>contains(b,x,y)&&!(b.door?.[0]===x&&b.door?.[1]===y)))return false;if(inRects(m.marasenWater,x,y))return m.aquaticBridges.some(b=>contains(b,x,y));return true;}
export function installAquaticMarasen(maps,doors){
 const gate=(id,label,x,y,to,arrival,action='marasen-city')=>({id,label,x,y,to,arrival,action,door:true});
 for(let i=0;i<6;i++){
  const m=maps['marasenExchange'+i];Object.assign(m,{exchangeFloor:i,name:'Grand Exchange · '+(i+1)+'F · '+EXCHANGE_FLOORS[i],terrain:'interior',verdantKind:'exchangeInterior',props:[],road:[],sidePaths:[],grass:[],marasenWater:[]});
  m.spots=[{id:'mr-exchange-counter',label:'Browse '+EXCHANGE_FLOORS[i],x:24,y:13,questProp:true},{id:'mr-exchange-clerk',label:'Exchange '+(i+1)+'F attendant',x:25,y:9,sprite:0}];
  if(i===5)m.spots.push({id:'mr-merchant-guild',label:'Five-Bank Accord · merchant guild registrar',x:33,y:25,questProp:true});
  m.gates=[i?gate('mr-exchange-directory','Floor directory',24,28,null,null,'marasen-directory'):gate('mr-exchange-leave','Leave exchange',24,28,'marasen',[10,16,'down']),i?gate('mr-exchange-down','Down to '+i+'F',7,9,'marasenExchange'+(i-1),[40,12,'down']):gate('mr-exchange-ground','Ground floor landing',7,9,null,null,'marasen-ground-landing'),i<5?gate('mr-exchange-up','Up to '+(i+2)+'F',40,9,'marasenExchange'+(i+1),[7,12,'down']):gate('mr-exchange-roof','Top floor landing',40,9,null,null,'marasen-top-landing')];
 }
 const building=(asset,x,y,w,h,door,label)=>({asset,x,y,w,h,door,label});
 const bridge=(x,y,w,h,axis)=>({x,y,w,h,axis});
 const setup=(m,kind,buildings,water,bridges,road,paths=[])=>Object.assign(m,{aquaticCity:true,terrain:'aquaticCity',verdantKind:kind,props:[],aquaticBuildings:buildings,aquaticBridges:bridges,aquaticSolids:[],marasenWater:water,road,sidePaths:paths.map(points=>({points}))});
 const city=maps.marasen;
 setup(city,'aquaticCity',[
  building('aquaticExchange',3,1,14,14,[10,14],'GRAND EXCHANGE'),
  building('aquaticPavilion',31,3,11,11,[36,13],'ARCHIVE'),
  building('aquaticPavilion',3,23,14,6,[10,28],'APOTHECARY'),
  building('marasenMill',29,23,14,6,[36,28],'WATER MILL')
 ],[[24,0,26,19],[0,20,47,22]],[bridge(24,16,3,3,'h'),bridge(19,20,3,3,'v'),bridge(26,20,3,3,'v')],[[1,17],[46,17]],[[[10,14],[10,28]],[[36,13],[36,28]],[[24,24],[24,28]],[[44,12],[44,28],[46,28]]]);
 const move=(m,id,x,y)=>{const s=m.spots.find(s=>s.id===id);if(s)Object.assign(s,{x,y});};
 for(const [id,x,y]of [['mr-water',19,18],['mr-levy',30,18],['local-aeric',20,25],['mr-farid-city',27,25],['mr-letters',39,16],['mr-city-bazaar',18,26]])move(city,id,x,y);
 for(const [id,x,y]of [['marasenMarket',10,14],['marasenApothecary',10,28],['marasenArchive',36,13],['marasenMill',36,28]])Object.assign(doors[id],{x,y,hiddenEntrance:id==='marasenMarket'});
 // The old market remains resumable, but its doorway no longer overlaps the Exchange gate.
 Object.assign(city.gates.find(g=>g.id==='mr-exchange-entry'),{x:10,y:14,arrival:[24,25,'up']});
 Object.assign(city.gates.find(g=>g.id==='mr-city-rapids'),{x:46,y:28,arrival:[3,17,'right']});
 Object.assign(city.gates.find(g=>g.id==='mr-fort-entry'),{x:44,y:12,to:'marasenCitadel',arrival:[3,17,'right'],action:'marasen-city'});
 Object.assign(city.gates.find(g=>g.id==='mr-city-bridges'),{x:24,y:28,arrival:[3,17,'right']});
 city.gates=city.gates.filter(g=>!['mr-city-citadel','mr-fort-return'].includes(g.id));
 const bridges=maps.marasenBridges;
 setup(bridges,'aquaticBridges',[],[[10,0,12,31],[23,0,25,31],[36,0,38,31]],[bridge(10,16,3,3,'h'),bridge(23,16,3,3,'h'),bridge(36,16,3,3,'h'),bridge(10,7,3,3,'h'),bridge(23,7,3,3,'h'),bridge(23,25,3,3,'h'),bridge(36,25,3,3,'h')],[[1,17],[46,17]],[[[5,8],[30,8]],[[18,26],[43,26]]]);
 bridges.gates=[gate('mr-bridges-home','Lower Cascades',1,17,'marasen',[24,26,'up']),gate('mr-bridges-citadel','Highwater Citadel',46,17,'marasenCitadel',[3,17,'right'])];move(bridges,'area-sign',5,14);
 const rapids=maps.marasenRapids;
 setup(rapids,'aquaticArena',[building('aquaticArena',8,1,32,16,null,'RAPIDS ARENA')],[[0,22,47,24]],[bridge(3,22,3,3,'v'),bridge(23,22,3,3,'v'),bridge(43,22,3,3,'v')],[[1,17],[46,17]],[[[4,17],[4,28],[44,28],[44,17]],[[24,19],[24,28]]]);
 move(rapids,'mr-race-marshal',24,20);move(rapids,'mr-race-board',34,27);move(rapids,'area-sign',7,19);rapids.gates[0].arrival=[44,28,'left'];
 const citadel=maps.marasenCitadel;
 setup(citadel,'aquaticCitadel',[building('aquaticCitadel',15,1,25,17,[27,17],'HIGHWATER CITADEL')],[[0,22,47,24]],[bridge(7,22,3,3,'v'),bridge(36,22,3,3,'v')],[[1,17],[10,17],[10,20],[44,20],[44,17],[46,17]],[[[8,20],[8,28],[38,28],[38,20]],[[27,17],[27,20]]]);
 move(citadel,'mr-water-warden',20,20);move(citadel,'area-sign',5,19);move(citadel,'mr-city-headwaters',31,27);
 Object.assign(citadel.gates.find(g=>g.id==='mr-citadel-fort'),{x:27,y:17});citadel.gates[0].arrival=[44,14,'down'];maps.marasenGate.gates[0].arrival=[27,19,'down'];
 const hallExit=maps.marasenHall.gates.find(g=>g.to==='marasen');if(hallExit)Object.assign(hallExit,{to:'marasenCitadel',arrival:[27,19,'down']});
}
function plaque(c,x,y,text,width=100){c.fillStyle='#163e4f';c.fillRect(x-width/2,y,width,14);c.fillStyle='#d9d5ad';c.fillRect(x-width/2,y,width,1);c.font='bold 8px sans-serif';c.textAlign='center';c.fillText(text,x,y+10);}
function stairs(c,x,y,up,colour){c.fillStyle='#254654';c.fillRect(x*16,y*16,5*16,4*16);for(let i=0;i<7;i++){c.fillStyle=i%2?'#b9c6be':'#dae0cb';c.fillRect(x*16+8,y*16+5+i*7,64,5);c.fillStyle='#718d8f';c.fillRect(x*16+8,y*16+10+i*7,64,2);}c.fillStyle=colour;c.fillRect(x*16,y*16,5,4*16);c.fillRect((x+5)*16-5,y*16,5,4*16);plaque(c,(x+2.5)*16,(y+4)*16,up,76);}
export function drawExchangeInterior(c,m,asset){const i=m.exchangeFloor,[floor,accent]=palettes[i];c.save();c.fillStyle='#112b37';c.fillRect(0,0,768,512);
 for(let y=7;y<=28;y++)for(let x=3;x<=44;x++){asset(c,'aquaticTeal',x,y,1,1,{x:x%16*16,y:y%16*16,w:16,h:16});c.fillStyle=floor;c.globalAlpha=.72;c.fillRect(x*16,y*16,16,16);c.globalAlpha=1;if((x+y)%2===0){c.fillStyle=accent;c.globalAlpha=.12;c.fillRect(x*16,y*16,15,15);c.globalAlpha=1;}}
 c.fillStyle=accent;c.fillRect(22*16,14*16,5*16,14*16);c.strokeStyle='#ddd3a1';c.lineWidth=1;c.strokeRect(22*16+4,14*16+4,5*16-8,14*16-8);
 for(let x=2;x<=45;x++){asset(c,'fortWall',x,5,1,2);asset(c,'fortWall',x,29,1,1);}for(let y=7;y<29;y++){asset(c,'fortWall',2,y,1,1);asset(c,'fortWall',45,y,1,1);}
 stairs(c,5,7,i?'DOWN '+i+'F':'GROUND',accent);stairs(c,38,7,i<5?'UP '+(i+2)+'F':'TOP FLOOR',accent);
 for(const p of exchangeProps(i))asset(c,...p);
 plaque(c,24*16,6*16,`${i+1}F · ${EXCHANGE_FLOORS[i].toUpperCase()}`,230);asset(c,'mat',23,27,3,2);plaque(c,24*16,30*16,i?'DIRECTORY':'EXIT TO MARASEN',130);c.restore();}
export function drawAquaticSurface(c,m,x,y,flags,asset){const wet=inRects(m.marasenWater,x,y);c.fillStyle=wet?'#319aa9':'#c3c8af';c.fillRect(x*16,y*16,16,16);asset?.(c,wet?'verdantWaterA':'aquaticPearl',x,y,1,1,{x:x%8*16,y:y%8*16,w:16,h:16});if(flags.road&&!wet){c.save();c.globalAlpha=.2;c.fillStyle='#4b9296';c.fillRect(x*16,y*16,16,16);c.restore();}}
function drawBridge(c,b,asset){c.save();for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){c.fillStyle=(x+y)%2?'#c0c6b8':'#d5d6c1';c.fillRect(x*16,y*16,16,16);c.fillStyle='#789c9c';c.fillRect(x*16,y*16+15,16,1);c.fillRect(x*16+15,y*16,1,16);c.fillStyle='#f2ead0';c.fillRect(x*16+1,y*16+1,14,2);}const v=b.axis==='v';c.fillStyle='#345d70';c.strokeStyle='#e5dfbd';c.lineWidth=2;
 if(v){for(const x of [b.x*16,(b.x+b.w)*16-3]){c.fillRect(x,b.y*16,3,b.h*16);for(let y=b.y*16;y<=(b.y+b.h)*16;y+=16){c.fillRect(x-2,y-3,7,6);c.strokeRect(x-2,y-3,7,6);}}}else{for(const y of [b.y*16,(b.y+b.h)*16-3]){c.fillRect(b.x*16,y,b.w*16,3);for(let x=b.x*16;x<=(b.x+b.w)*16;x+=16){c.fillRect(x-3,y-2,6,7);c.strokeRect(x-3,y-2,6,7);}}}c.restore();}
export function drawAquaticDetails(c,m,asset){c.save();
 // Stone coping follows actual water, while bridges are drawn last so railings remain continuous.
 c.strokeStyle='#99bdba';c.lineWidth=2;for(const [a,b,d,e]of m.marasenWater||[])c.strokeRect(a*16,b*16,(d-a+1)*16,(e-b+1)*16);
 for(const b of m.aquaticBridges)drawBridge(c,b,asset);
 for(const b of m.aquaticBuildings){asset(c,b.asset,b.x,b.y,b.w,b.h);if(b.door){const [x,y]=b.door;asset(c,'mat',x-1,y,3,1);plaque(c,x*16+8,(y+1)*16+1,b.label,110);}else plaque(c,(b.x+b.w/2)*16,(b.y+b.h)*16,b.label,120);}
 if(m.verdantKind==='aquaticCity'){asset(c,'fortArch',43,9,3,4);plaque(c,44*16+8,14*16,'HIGHWATER →',100);plaque(c,24*16+8,29*16,'SEVEN BRIDGES ↓',115);plaque(c,43*16,29*16,'RAPIDS →',76);}
 c.restore();}
export function drawAquaticNotice(c,m,s){c.save();plaque(c,s.x*16+8,(s.y-1)*16,m.verdantKind==='aquaticArena'?'RAPIDS':m.verdantKind==='aquaticCitadel'?'HIGHWATER':'CITY GUIDE',85);c.restore();}
