import {STORM_ROAD} from './botrune-data.js?v=0.90.0';
import {registerBiome} from './biome-world.js?v=0.87.0';
const gate=(id,label,x,y,to,arrival,action)=>({id,label,x,y,to,arrival,action,door:true});
const person=(id,label,x,y,portrait)=>({id,label,x,y,sprite:0,revoltCharacter:portrait});
export function botruneWalkable(m,x,y){if(m.botruneKind==='square')return y>=21&&y<=28||x>=20&&x<=28&&y>=9&&y<=21||x>=12&&x<=40&&y>=3&&y<=9;return null;}
export function installBotruneWorld(maps){
 Object.assign(maps.marasen.gates.find(g=>g.id==='marasen-next'),{label:'Scribes’ Road · Thunderplain',to:'stormVerge',arrival:[3,17,'right'],action:'botrune-entry'});
 const roads=[[[1,17],[9,17],[9,9],[23,9],[23,23],[37,23],[37,17],[46,17]],[[1,17],[12,17],[12,24],[25,24],[25,8],[39,8],[39,17],[46,17]],[[1,17],[10,17],[10,8],[20,8],[20,23],[34,23],[34,17],[46,17]]];
 for(const [n,[room,name]]of STORM_ROAD.entries()){
  maps[room]={name,area:room,bloom:true,terrain:'ridge',botruneKind:'storm',stormIndex:n,stormRods:[5,18,32,43].map(x=>[x,4+(x*3)%9]),stormBoulders:[[4,22,2,2],[17,14,2,2],[32,18,2,2],[41,4,2,2]],road:roads[n%3],grass:[[5,5,16,12],[17,20,28,27],[32,5,42,12]],sidePaths:[],props:[],spots:[{id:'area-sign',label:'Read Scribes’ Road record',x:5,y:16,routeSign:true}],gates:[gate(room+'-back',n?STORM_ROAD[n-1][1]:'Marasen',1,17,n?STORM_ROAD[n-1][0]:'marasen',[44,17,'left']),gate(room+'-forward',n<6?STORM_ROAD[n+1][1]:'Botrune',46,17,n<6?STORM_ROAD[n+1][0]:'botrune',n<6?[3,17,'right']:[3,24,'right'])]};
  registerBiome(room,'quarry');
 }
 maps.stormPylons.spots.push(person('TRN-BT-ROAD-1','Conductor watch Yusuf',25,21,'TRN-SC-stormBluffs-0'));
 maps.stormCauseway.spots.push(person('TRN-BT-ROAD-2','Black Causeway watch Maryam',34,21,'TRN-SC-stormBluffs-1'));
 maps.stormHollow.spots.push(person('bt-burrower','Storm shelter keeper',20,25,'SHOP-DOR'));
 maps.stormWatch.spots.push({id:'bt-wagon',label:'Search the abandoned dispatch wagon',x:24,y:24,questProp:true});
 maps.stormApproach.gates.push(gate('bt-shelter-enter','Roadside shelter · rest and supplies',24,26,'botruneShelter',[24,24,'up']));
 maps.stormApproach.sidePaths.push({points:[[24,23],[24,26]]});
 maps.botruneShelter={name:'Botrune · Last Roadside Shelter',hub:true,bloom:true,terrain:'keep',botruneKind:'shelter',road:[[2,24],[45,24]],grass:[],sidePaths:[],props:[{asset:'tent',x:9,y:4,w:11,h:9},{asset:'shelf',x:30,y:5,w:9,h:4}],spots:[person('local-aeric','Chaplain Walter',21,17,'CHR-AERIC'),person('local-supplies','Roadside provisioner',31,17,'SHOP-PHI')],gates:[gate('bt-shelter-exit','Return to Road of Unanswered Bells',24,28,'stormApproach',[24,24,'up'])]};registerBiome('botruneShelter','quarry');
 maps.botrune={name:'Botrune · The Silent Square',hub:true,bloom:true,terrain:'keep',botruneKind:'square',road:[[1,24],[46,24]],grass:[],sidePaths:[{points:[[24,24],[24,6]]}],props:[],spots:[
  person('bt-miller','The miller',9,23,'SHOP-DOR'),person('bt-clerk','The sentencing clerk',14,26,'SHOP-PHI'),person('bt-baker','The baker',33,26,'SHOP-DOR'),person('bt-scholar','Abbey scholar',39,23,'SHOP-PHI'),person('local-aeric','Chaplain Walter',6,27,'CHR-AERIC'),
  ...[20,15,10].map((y,n)=>({...person('TRN-BT-GUARD-'+(n+1),'Guard captain '+(n+1),24,y,'TRN-SC-stormBluffs-'+n),botruneGuard:true})),
  person('bt-leader','Canon Fatima bint Musa',37,6,'LDR-06'),{id:'bt-recovery',label:'Pate and Trade · remember them',x:32,y:8,questProp:true},{id:'bt-archive',label:'Abbey archive · civilian records',x:41,y:24,questProp:true}
 ],gates:[gate('botrune-back','Road of Unanswered Bells',1,24,'stormApproach',[44,17,'left']),gate('botrune-next','War Road · chapter boundary',46,24,null,null,'botrune-boundary')]};registerBiome('botrune','quarry');
}
