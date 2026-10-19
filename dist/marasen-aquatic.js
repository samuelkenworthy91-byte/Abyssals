export const AQUATIC_ASSETS=Object.fromEntries(['exchange','arena','citadel','pavilion','pearl','water','bridge','teal'].map(n=>['aquatic'+n[0].toUpperCase()+n.slice(1),'aquatic-'+n+'-v089.webp']));
for(let i=0;i<6;i++)AQUATIC_ASSETS['aquaticFloor'+i]='aquatic-exchange-'+i+'-v089.webp';
export const EXCHANGE_FLOORS=['General Provisions','Technique Library','Relic Gallery','Evolution Atelier','Growth Apothecary','Merchant’s Terrace'];
const FURNITURE=[[[3,12,7,25],[9,12,13,24],[15,16,18,24],[30,16,33,24],[35,12,39,24],[41,12,44,25]],[[3,10,10,14],[4,17,12,25],[14,14,17,23],[31,14,34,23],[37,10,44,14],[36,17,44,25]],[[6,14,17,23],[31,14,42,23]],[[7,14,18,24],[30,14,41,24]],[[3,12,12,25],[14,16,19,25],[29,16,34,25],[36,12,44,25]],[[3,15,15,25],[34,15,44,25]]];
const inside=(r,x,y)=>r.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d);
export function exchangeWalkable(m,x,y){return x>=2&&x<=45&&y>=8&&y<=29&&(y!==29||x>=23&&x<=25)&&!(y<12&&x>10&&x<37)&&!inside(FURNITURE[m.exchangeFloor],x,y);}
export function installAquaticMarasen(maps,doors){
 const gate=(id,label,x,y,to,arrival,action='marasen-city')=>({id,label,x,y,to,arrival,action,door:true});
 for(let i=0;i<6;i++){
  const m=maps['marasenExchange'+i];Object.assign(m,{exchangeFloor:i,name:'Grand Exchange · '+(i+1)+'F · '+EXCHANGE_FLOORS[i],terrain:'interior',verdantKind:'exchangeInterior',props:[],road:[],sidePaths:[],grass:[],marasenWater:[]});
  m.spots=[{id:'mr-exchange-counter',label:'Browse '+EXCHANGE_FLOORS[i],x:24,y:13,questProp:true},{id:'mr-exchange-clerk',label:'Exchange '+(i+1)+'F attendant',x:25,y:12,sprite:0}];
  if(i===5)m.spots.push({id:'mr-merchant-guild',label:'Five-Bank Accord · merchant guild registrar',x:29,y:26,questProp:true});
  m.gates=[i?gate('mr-exchange-directory','Floor directory',24,28,null,null,'marasen-directory'):gate('mr-exchange-leave','Leave exchange',24,28,'marasen',[11,18,'down']),i?gate('mr-exchange-down','Down to '+i+'F',6,8,'marasenExchange'+(i-1),[42,9,'down']):gate('mr-exchange-ground','Ground floor landing',6,8,null,null,'marasen-ground-landing'),i<5?gate('mr-exchange-up','Up to '+(i+2)+'F',42,8,'marasenExchange'+(i+1),[6,9,'down']):gate('mr-exchange-roof','Top floor landing',42,8,null,null,'marasen-top-landing')];
 }
 const prop=(asset,x,y,w,h)=>({asset,x,y,w,h,decorative:true});
 const aquatic=(m,kind,props,solids,water,road,paths=[])=>Object.assign(m,{aquaticCity:true,terrain:'aquaticCity',verdantKind:kind,props,aquaticSolids:solids,marasenWater:water,road,sidePaths:paths.map(points=>({points}))});
 const city=maps.marasen;
 aquatic(city,'aquaticCity',[prop('aquaticExchange',2,1,17,15),prop('aquaticPavilion',21,2,9,8),prop('aquaticCitadel',31,1,16,12),prop('aquaticPavilion',3,21,12,7),prop('aquaticPavilion',32,22,12,7)],[[2,1,19,14],[21,2,29,9],[31,1,46,11],[3,21,14,26],[32,22,43,27]],[[19,0,20,31],[29,0,30,31],[0,20,47,21]],[[1,17],[46,17]],[[[11,15],[11,20],[24,20],[24,27]],[[9,17],[9,28]],[[23,11],[23,20]],[[39,13],[39,20],[42,20],[42,25]],[[36,20],[36,29]],[[44,17],[44,24],[46,24]]]);
 const move=(m,id,x,y)=>{const s=m.spots.find(s=>s.id===id);if(s)Object.assign(s,{x,y});};
 for(const [id,x,y]of [['mr-water',20,16],['mr-levy',28,19],['local-aeric',24,21],['mr-farid-city',22,25],['mr-letters',26,12],['mr-city-bazaar',26,24]])move(city,id,x,y);
 for(const [id,x,y]of [['marasenMarket',11,16],['marasenApothecary',9,28],['marasenArchive',25,11],['marasenMill',38,28]])Object.assign(doors[id],{x,y});
 Object.assign(city.gates.find(g=>g.id==='mr-exchange-entry'),{x:11,y:16,arrival:[24,25,'up']});
 Object.assign(city.gates.find(g=>g.id==='mr-city-rapids'),{x:46,y:24});
 Object.assign(city.gates.find(g=>g.id==='mr-fort-entry'),{x:39,y:13});city.gates=city.gates.filter(g=>g.id!=='mr-city-citadel');
 Object.assign(city.gates.find(g=>g.id==='mr-fort-return'),{x:44,y:13,to:'marasenCitadel',arrival:[3,17,'right'],action:'marasen-city'});
 const bridges=maps.marasenBridges;
 aquatic(bridges,'aquaticBridges',[prop('aquaticPavilion',2,2,13,10),prop('aquaticPavilion',31,2,13,10)],[[3,2,14,10],[32,2,43,10]],[[3,3,10,29],[21,3,25,29],[38,3,44,29]],[[1,17],[46,17]],[[[23,4],[23,22]],[[33,22],[33,17]]]);
 const rapids=maps.marasenRapids;
 aquatic(rapids,'aquaticArena',[prop('aquaticArena',3,0,42,23)],[[7,1,42,21]],[[0,0,47,22]],[[1,17],[4,17],[4,26],[44,26],[44,17],[46,17]],[[[24,23],[24,28]],[[34,23],[34,27]]]);
 move(rapids,'mr-race-marshal',24,24);move(rapids,'mr-race-board',34,25);move(rapids,'area-sign',5,25);rapids.gates[0].arrival=[44,24,'left'];
 const citadel=maps.marasenCitadel;
 aquatic(citadel,'aquaticCitadel',[prop('aquaticCitadel',13,0,31,19)],[[13,1,43,17]],[[0,0,47,17]],[[1,17],[8,17],[8,23],[45,23],[45,17],[46,17]],[[[29,19],[29,26]],[[31,23],[31,26]]]);
 move(citadel,'mr-water-warden',20,22);move(citadel,'area-sign',5,21);
 Object.assign(citadel.gates.find(g=>g.id==='mr-citadel-fort'),{x:29,y:20});citadel.gates[0].arrival=[39,15,'down'];maps.marasenGate.gates[0].arrival=[29,22,'down'];
}
export function drawExchangeInterior(c,m,asset){c.fillStyle='#173b4d';c.fillRect(0,0,768,512);asset(c,'aquaticFloor'+m.exchangeFloor,0,0,48,32);c.save();c.font='bold 10px sans-serif';c.textAlign='center';for(const [x,text]of [[6,m.exchangeFloor?'DOWN '+m.exchangeFloor+'F':'GROUND'],[42,m.exchangeFloor<5?'UP '+(m.exchangeFloor+2)+'F':'TOP']]){c.fillStyle='#123b4de8';c.fillRect(x*16-27,7*16-14,70,16);c.fillStyle='#e9e5bd';c.fillText(text,x*16+8,7*16-3);}c.restore();}
export function drawAquaticSurface(c,m,x,y,flags,asset){const wet=inside(m.marasenWater||[],x,y),name=flags.road&&wet?'aquaticBridge':wet?'aquaticWater':'aquaticPearl';c.fillStyle=wet?'#359cab':'#cbd5c6';c.fillRect(x*16,y*16,16,16);asset?.(c,name,x,y,1,1,{x:x%16*16,y:y%16*16,w:16,h:16});}
export function drawAquaticDetails(c,m){c.save();c.strokeStyle='#b8e2e1';c.lineWidth=2;for(const [a,b,d,e]of m.marasenWater||[]){c.strokeRect(a*16,b*16,(d-a+1)*16,(e-b+1)*16);}c.restore();}
export function drawAquaticNotice(c,m,s){c.save();c.fillStyle='#16485a';c.strokeStyle='#d6cb8d';c.lineWidth=2;c.fillRect((s.x-2)*16,(s.y-2)*16,80,24);c.strokeRect((s.x-2)*16,(s.y-2)*16,80,24);c.font='bold 9px sans-serif';c.textAlign='center';c.fillStyle='#fff2c5';c.fillText(m.verdantKind==='aquaticArena'?'RAPIDS':m.verdantKind==='aquaticCitadel'?'HIGHWATER':'CITY GUIDE',s.x*16+8,s.y*16-16);c.restore();}
