export const PALE_ROOMS=['paleQuay','paleRiver','paleHall','palePrince','paleOrchard','paleReeds'];
export const PALE_ART=['pale-quay','pale-river','pale-hall','pale-prince','pale-orchard','pale-reeds'];
export const PRINCE_ID='TRN-PG-PRINCE';
export const PALE_ACTORS=['blue','red','bailiff','keeper','hound','vantis'];
export const PALE_PROPS=['tablet','bell','bowl','buoy','ferry','cache','arch'];
const gate=(id,label,x,y,to,arrival)=>({id:'pg-'+id,label,x,y,to,arrival,door:true,action:'pale-gate'});
const spot=(id,label,x,y,art)=>({id:'pg-'+id,label,x,y,paleArt:art,questProp:true});

export function installPaleGate(maps){
 const names=['Arrival Quay','The Countercurrent','Hall of Misfiled Names','The Keeper’s Terrace','The Winter Orchard','Frostreed Landing'];
 for(const [i,id] of PALE_ROOMS.entries())maps[id]={
  name:'Pale Gate · '+names[i],area:null,terrain:'finale',finale:true,finaleArt:PALE_ART[i],props:[],spots:[],gates:[],grass:[],road:[[1,19],[46,19]],sidePaths:[],finaleSolids:[],
  finaleWalk:i===1?[[1,16,15,24],[32,16,46,24]]:[[1,18,46,22],[9,16,38,23]]
 };
 const {paleQuay:q,paleRiver:r,paleHall:h,palePrince:p,paleOrchard:o,paleReeds:f}=maps;
 r.finaleEntrances=[[3,19],[39,19]];
 q.finaleWalk.push([22,22,26,28]);
 q.gates=[gate('mirror-back','Return to the Answering Mirror',1,19,'afterlifeThreshold',[24,13,'down']),gate('river','The Countercurrent',46,19,'paleRiver',[3,19,'right']),gate('orchard','Winter Orchard',24,28,'paleOrchard',[3,19,'right'])];
 q.spots=[spot('guide','Vantis Eldrin',14,18,'vantis'),spot('blue','A soldier at the quay',29,18,'blue'),spot('red','A soldier mending her scarf',32,21,'red'),spot('rest','Quay shelter',8,18,'bell'),spot('relay-east','Underway Relay',18,21,'arch')];
 r.gates=[gate('quay','Arrival Quay',1,19,'paleQuay',[44,19,'left']),gate('hall','Hall of Misfiled Names',46,19,'paleHall',[3,19,'right'])];
 r.spots=[spot('launch','Read the ferry riddle and launch',14,19,'bell'),spot('ferry-back','Cross back to the quay',33,21,'ferry'),spot('reeds','Frostreed Landing',41,23,'buoy'),spot('bailiff','The Toll Bailiff',42,18,'bailiff')];
 h.gates=[gate('river-back','The Countercurrent',1,19,'paleRiver',[44,19,'left']),gate('prince','The Keeper’s Terrace',46,19,'palePrince',[3,19,'right'])];
 h.spots=[spot('file-a','Intake docket A',12,17,'tablet'),spot('file-b','Intake docket B',20,17,'tablet'),spot('file-c','Intake docket C',28,17,'tablet'),spot('receipt','Ferry receipts',34,22,'tablet'),spot('audit','Correct the intake ledger',39,19,'tablet'),spot('hound','Ledger Hound',33,18,'hound')];
 p.finaleWalk.push([42,11,45,18]);
 p.gates=[gate('hall-back','Hall of Misfiled Names',1,19,'paleHall',[44,19,'left'])];
 p.spots=[spot('keeper','Hugh FitzAlan, Keeper of Names',30,19,'keeper'),spot('beyond','The road to the second Circle',44,11),spot('relay-west','Underway Relay',38,21,'arch')];
 o.gates=[gate('orchard-back','Arrival Quay',1,19,'paleQuay',[24,25,'up'])];
 o.spots=[spot('bell-tag','A bell tag',11,20,'bell'),spot('bowl','A chipped feeding bowl',21,17,'bowl'),spot('roster','The orchard watch roster',29,20,'tablet'),spot('return-name','Return a Name',38,19,'red')];
 f.gates=[gate('reeds-back','The Countercurrent',1,19,'paleRiver',[40,22,'up'])];
 f.spots=[spot('reed-note','An old ferryman’s note',12,20,'tablet'),...['north','middle','south'].map((n,i)=>spot('lamp-'+n,n+' lamp',19+i*6,18,'buoy')),spot('reed-cache','Flood marker',38,19,'cache')];
}
export function paleState(state){return state.paleGate??={seen:false,crossed:false,records:{},named:false,restored:false,reedSolved:false};}
export function paleJournal(state,room){
 if(!PALE_ROOMS.includes(room))return '';
 const q=paleState(state),won=state.defeatedTrainers?.includes(PRINCE_ID);
 if(room==='paleOrchard')return q.named?'The soldier remembers Lark.':'Return a Name · Compare the tag, bowl and watch roster.';
 if(room==='paleReeds')return q.reedSolved?'The flood marker is visible.':'Three Winter Lights · Read the ferryman’s note and align the lamps.';
 if(!q.crossed)return 'Read the ferry riddle at the Countercurrent. You can return through the mirror.';
 if(!q.restored)return 'Read the three intake dockets and the ferry receipts. Then correct the archive.';
 return won?'The Keeper has opened the road deeper into the Hells.':'Face the Keeper of Names on the winter terrace.';
}
export function paleObjective(state,room,x){
 if(!PALE_ROOMS.includes(room))return null;
 const q=paleState(state),won=state.defeatedTrainers??[];
 const spots={
  paleQuay:q.seen?'pg-river':'pg-guide',
  paleRiver:x<24?'pg-launch':won.includes('TRN-PG-BAILIFF')?'pg-hall':'pg-bailiff',
  paleHall:q.restored?'pg-prince':'pg-audit',
  palePrince:won.includes(PRINCE_ID)?'pg-beyond':'pg-keeper',
  paleOrchard:'pg-return-name',
  paleReeds:q.reedSolved?'pg-reed-cache':'pg-reed-note'
 };
 return spots[room];
}
export const FERRY_FORKS=[
 {clue:'I am given to you before you can ask, and other mouths carry me all your life.',lanes:['Ear','Name','Mouth'],correct:1},
 {clue:'Bronze gives me a voice. A rope wakes me, and the whole town hears.',lanes:['Bell','Coin','Trumpet'],correct:0},
 {clue:'I swing on hinges. My iron tongue is caught whenever I shut.',lanes:['Key','Blade','Door'],correct:2}
];
export function ferryWindow(elapsed,slow){const span=slow?16000:12000;return {span,open:elapsed>=span-(slow?6500:4500)&&elapsed<span,expired:elapsed>=span};}
export const NAMEFOG='NAMEFOG';
export function namefogActive(field){return field?.nativeField===NAMEFOG&&!field.weather&&!field.terrain;}
export function namefogMultiplier(field,type){return namefogActive(field)?({GHOST:1.5,PSYCHIC:.5}[type]??1):1;}
export function namefogLabel(field){
 if(namefogActive(field))return 'Namefog · Ghost ×1.5 · Psychic ×0.5';
 const replacement=field?.weather||field?.terrain;
 return replacement?replacement[0]+replacement.slice(1).toLowerCase()+(field.terrain?' terrain':'')+' · Namefog dormant':'Namefog dormant';
}
