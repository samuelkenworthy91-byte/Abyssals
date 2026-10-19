import {drawMountainQuestArtwork} from './mountain-art.js?v=0.87.0';
// Optional mountain stories. No growth or combat-stat bonuses are applied.
export const CAELYNX_ID='windscar-caelynx';
export const CAELYNX_ENCOUNTER={speciesId:'164',level:45,mountainId:CAELYNX_ID,tableId:'WINDSCAR-WATCHER'};
export const SCHOLAR='Scholar Safiyya bint Yusuf';
export const FOSSILS=[
 {id:'176',name:'Paleursa',type:'Rock / Ice',fossil:'Frostbound paw',detail:'A single-stage fossil Abyssal, adapted to cold.'},
 {id:'177',name:'Raptyrale',type:'Rock / Dragon',fossil:'Hooked talon',detail:'A single-stage fossil Abyssal with a draconic lineage.'},
 {id:'178',name:'Sidermite',type:'Rock / Electric',fossil:'Star-metal nodule',detail:'Evolves into Xenolithid at level 40.'},
 {id:'180',name:'Gravodo',type:'Rock / Poison',fossil:'Ridged jaw',detail:'Evolves into Cairnodo at level 28 and Kronodo at level 48.'}
];
export const WATCH_RECORD=[
 'Before the signal towers, porters kept three white cairns on the summit trail. Each held a pale stone with its scratched face turned uphill. In cloud, a traveller could follow one marker to the next. The keepers called the final shelf the Watcher’s Rest: they recorded a white lynx there after heavy snow. Its name was Caelynx.',
 'During the war, signal crews dismantled the cairns for a lookout wall. Soldiers painted over the trail marks so enemy scouts could not use them. Then a winter storm broke the lookout. Two patrols were lost searching for a path that their own men had erased. The watch keeper’s last entry asks whoever returns to restore the markers before attempting the highest shelf.',
 'Three fallen cairns remain beside this trail: the western bend, the central climb and the eastern shoulder. Set each pale marker with its scratched face uphill. Once all three stand, follow their line to the Watcher’s Rest on the highest shelf. Return west to Windscar Pass to leave the summit. The watcher is a wild Abyssal; these stones offer directions, not protection.'
];
export const QUEST_SPOTS=[
 {room:'passSummit',id:'mq-watch-tablet',label:'Watch keeper’s tablet · summit quest',x:8,y:14,kind:'tablet'},
 {room:'passSummit',id:'mq-cairn-west',label:'Restore the western cairn',x:15,y:24,kind:'cairn'},
 {room:'passSummit',id:'mq-cairn-climb',label:'Restore the climbing cairn',x:25,y:18,kind:'cairn'},
 {room:'passSummit',id:'mq-cairn-east',label:'Restore the shoulder cairn',x:34,y:9,kind:'cairn'},
 {room:'passSummit',id:'mq-watcher',label:'Watcher’s Rest · Caelynx',x:40,y:5,kind:'rest'},
 {room:'passCrystalPocket',id:'mq-scholar',label:SCHOLAR+' · fossil investigation',x:35,y:23,kind:'scholar'},
 {room:'passCrystalPocket',id:'mq-bed-shale',label:'Survey the shale bed',x:12,y:5,kind:'fossil'},
 {room:'passCrystalPocket',id:'mq-bed-limestone',label:'Survey the limestone bed',x:24,y:16,kind:'fossil'},
 {room:'passCrystalPocket',id:'mq-bed-nodule',label:'Survey the mineral nodule',x:40,y:12,kind:'fossil'},
 {room:'passCrystalPocket',id:'mq-reanimate',label:'Fossil reanimation workbench',x:33,y:26,kind:'bench'}
];
export const BED_TEXT={
 'mq-bed-shale':'The dark shale splits into thin sheets. Inside are the outline of a hooked talon and the impression of a heavy paw. Safiyya’s labels place this bed beneath the old glacier. You wrap the loose fragments and copy their positions before touching the rock around them.',
 'mq-bed-limestone':'A ridged jaw lies in pale limestone, beside shells and the remains of a shoreline plant. This mountain was once a coast. The quarry’s blasting exposed the bed, but another charge would have destroyed it. You lift a small sample and mark the intact fossil for Safiyya.',
 'mq-bed-nodule':'The nodule feels heavier than the surrounding stone. A segmented shell runs through its metallic centre. Safiyya’s survey calls these star-metal deposits: material buried long before the quarry existed. You recover a loose piece without prying apart the larger specimen.'
};
export function mountainQuestState(state){return state.mountainQuests??={watchAccepted:false,cairns:[],caelynx:null,fossilAccepted:false,beds:[],fossilGift:null};}
export function installMountainQuests(maps,branch){for(const p of QUEST_SPOTS)branch(maps[p.room],{...p,questProp:true,...(p.kind==='scholar'?{sprite:'bystander'}:{})});}
export function mountainFind(state,id){const q=mountainQuestState(state);if(id.startsWith('mq-cairn-')&&QUEST_SPOTS.some(p=>p.id===id)&&q.watchAccepted&&!q.cairns.includes(id)){q.cairns.push(id);return true;}if(BED_TEXT[id]&&q.fossilAccepted&&!q.beds.includes(id)){q.beds.push(id);return true;}return false;}
export function canMeetCaelynx(state){const q=mountainQuestState(state);return q.watchAccepted&&q.cairns.length===3&&!q.caelynx;}
export function resolveCaelynx(state,id,outcome){if(id!==CAELYNX_ID||!['captured','defeated'].includes(outcome)||!canMeetCaelynx(state))return false;mountainQuestState(state).caelynx=outcome;return true;}
export function reviveMountainFossil(state,id,create){const q=mountainQuestState(state);if(!q.fossilAccepted||q.beds.length!==3||q.fossilGift||!FOSSILS.some(f=>f.id===id))return null;const u=create(id,5);u.giftOrigin='Crystal Hollow fossil survey';u.originalStarter=false;u.lives=1;u.growthMultiplier=1;(state.party.length<6?state.party:state.reserve).push(u);q.fossilGift={id,uid:u.uid};return u;}
export function mountainQuestHint(state,room){const q=mountainQuestState(state);if(room==='passSummit')return q.caelynx?'Watcher’s Rest: '+(q.caelynx==='captured'?'Caelynx joined your expedition.':'Caelynx has fallen.') : !q.watchAccepted?'Optional quest: read the watch keeper’s tablet beside the western trail.':q.cairns.length<3?'Restore the three summit cairns · '+q.cairns.length+'/3.':'The cairns lead to Watcher’s Rest on the highest shelf · Caelynx Lv45.';if(room==='passCrystalPocket')return q.fossilGift?'Fossil survey complete · one ancient Abyssal revived.':!q.fossilAccepted?'Optional quest: speak to Dawn Bloom scholar Safiyya at the eastern workbench.':q.beds.length<3?'Survey the shale, limestone and star-metal beds · '+q.beds.length+'/3.':'Return to Safiyya, then choose one fossil at the reanimation workbench.';return '';}
// Quest drawings use actual raster art; their states do not alter collision or rewards.
export function drawMountainQuestScene(c,state,room){const q=mountainQuestState(state);for(const p of QUEST_SPOTS.filter(p=>p.room===room&&p.kind!=='scholar'))drawMountainQuestArtwork(c,p,q.cairns.includes(p.id)||q.beds.includes(p.id));}

export function mountainQuestObjective(state,room){const q=mountainQuestState(state);let spot;if(room==='passSummit'&&!q.caelynx)spot=!q.watchAccepted?'mq-watch-tablet':['mq-cairn-west','mq-cairn-climb','mq-cairn-east'].find(id=>!q.cairns.includes(id))||'mq-watcher';if(room==='passCrystalPocket'&&!q.fossilGift)spot=!q.fossilAccepted?'mq-scholar':['mq-bed-shale','mq-bed-limestone','mq-bed-nodule'].find(id=>!q.beds.includes(id))||'mq-reanimate';return spot?{spot,text:mountainQuestHint(state,room)}:null;}
