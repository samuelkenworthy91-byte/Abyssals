import {DATA} from './data.js?v=0.90.47';
import {legalForm,legalMoves} from './route-roster.js?v=0.87.0';
export const SUN_ROAD=[['sunBank','Willowmere · The Quiet Bank',78,81,'road'],['burialGrove','Willowmere · The Remembering Tree',79,82,'burial'],['sunFalls','Willowmere · Silverwater Crossing',81,85,'falls'],['sunTerraces','Cayfen · The Flowering Terraces',83,87,'terraces']];
export const SPORE_ROAD=[['sporeRim','Sporefall · Hanging Roots',89,93,'spore'],['sporeDepths','Sporefall · The Lantern Shelves',91,95,'spore'],['sporeBridge','Sporefall · Broken Companies',93,97,'spore'],['sporeCrown','Sporefall · The Last Crossing',95,99,'darius']];
export const PEACH_FINAL={guan:{id:'183',name:'Guanrong',title:'The Oath at the Crossing',guard:'TRN-FN-GUAN',level:87},fei:{id:'175',name:'Feirong',title:'The Strength to Hold',guard:'TRN-FN-FEI',level:88},crux:{id:'174',name:'Cruxwyrm',level:102},gehennuar:{id:'166',name:'Gehennuar',level:96},suncub:{id:'186',name:'Suncub',level:90}};
export const LEGACY_POOLS={pate:['169','172','161','393'],trade:['346','356','151','358']};
const trainer=(id,name,portraitId,ids,levels,before,after,extra={})=>({id,name,portraitId,faction:'Dawn Bloom',role:id.startsWith('LDR-')?'leader':'Expedition challenger',runtimeAuthored:true,expeditionTeam:true,ai_tier:'Advanced',before,after,team:ids.map((s,i)=>{const level=levels[i],species_id=legalForm(s,level);return {slot:i+1,species_id,level,current_form_legal_move_ids:legalMoves(species_id,level)};}),...extra});
export const FINALE_TRAINERS=[
 trainer('TRN-FN-ROAD','Willowmere ranger Alice','TRN-SC-orchardCanopy-0',['193','274','346','169'],[80,80,81,82],'We keep the crossings open for everyone. A road challenge, if you are ready.','The old tree is beyond the next bank. Walter has already taken the wagon there.'),
 trainer('TRN-FN-TERRACE','Terrace keeper Zaynab','TRN-SC-orchardCanopy-1',['193','151','358','393'],[84,84,85,86],'The studios send their apprentices out here to learn to look. A battle can teach that too.','Cayfen is east. Follow the tiled road, not the orchard paths.'),
 trainer('TRN-FN-GUAN','Shrine requisitioner','TRN-SC-stormBluffs-0',['214','310','371','169'],[84,84,85,86],'The shrine metal belongs to the army. Leave the travellers and their story out of this.','Take the seals. I will leave the crossing alone.'),
 trainer('TRN-FN-FEI','Bridge toll captain','TRN-SC-stormBluffs-1',['048','214','352','393'],[85,85,86,87],'My company controls this bridge. Pay with supplies or turn back.','The refugees may cross. The windlasses are yours.'),
 trainer('TRN-FN-SPORE','Lantern warden Safiya','TRN-SC-stormBluffs-2',['350','356','193','393','172'],[92,92,93,94,94],'The shelves ahead are broken. Show me you can protect a partner before going down.','Follow the pale roots. Two companies went ahead and neither has returned.'),
 trainer('TRN-FN-LAST','A fleeing company captain','TRN-SC-stormBluffs-1',['352','310','371','169','356'],[94,95,95,96,96],'I will not let another armed column through. Not after what is up there.','Both banners broke. A man with a steel dragon is driving everyone back. Hasan is still on the crossing.'),
 trainer('LDR-07','Marshal Ibrahim ibn Ahmad','LDR-07',['151','350','193','169','358','393'],[88,88,89,90,91,92],'I keep soldiers outside the studios. I cannot keep the war outside the walls. If you want my records, face my company under surrender rules.','Enough. My partners have yielded. You asked about a mirror. I will tell you what I know.',{ai_tier:'Leader',nonlethal:true}),
 trainer('LDR-08','Hierophant Hasan ibn Ibrahim','LDR-08',['354','358','151','193','346','071'],[100,100,101,102,103,105],'You have seen me fight. Here the terms are different: we stop when a partner yields. Then I will take you below the fortress.','You have won. Keep your promise to your partners. I will keep mine to you.',{ai_tier:'Leader',nonlethal:true}),
 trainer('TRN-FN-DARIUS','Darius · The Last Peace','REV-DARIUS-FINAL',['174','371','352','169','356','393'],[102,97,96,98,99,100],'Every peace ends with another child learning which banner to hate. There will be no next war when there is no one left to wage it.','The crossing is quiet. Cruxwyrm no longer answers him.',{finaleDouble:true})
];
export const FINAL_DARIUS=FINALE_TRAINERS.at(-1);
export function installFinaleTrainers(expansion,voices={}){for(const t of FINALE_TRAINERS){if(!expansion.trainers.some(x=>x.id===t.id))expansion.trainers.push(t);voices[t.id]={before:t.before,after:t.after,repeat:'The challenge is recorded.'};}}
const daySun=['274','193','161','346','169','172'],nightSun=['358','356','393','350','151','193'];
const daySpore=['193','310','350','352','346','172'],nightSpore=['356','358','393','352','350','169'];
export function finaleRoute(room){const r=[...SUN_ROAD,...SPORE_ROAD].find(r=>r[0]===room)||(['guanApproach','guanShrine','feiApproach','feiCrossing'].includes(room)?[room,'Peach Grove · '+(room.startsWith('guan')?'The Oath Crossing':'The Held Bridge'),83,87]:null);if(!r)return null;const dark=room.startsWith('spore');return {room,explorationTable:true,encounterPacing:true,area:{id:room,name:r[1],rate:room==='burialGrove'?'LOW':'NORMAL'},tables:['DAY','NIGHT'].map((phase,n)=>({id:room+'-'+phase,area_id:room,phase,slots:(dark?(n?nightSpore:daySpore):(n?nightSun:daySun)).map((id,i)=>({species_id:legalForm(id,r[2]),min_level:r[2],max_level:r[3],weight:[28,23,19,14,10,6][i],rarity:i<3?'Common':i<5?'Uncommon':'Rare',authoredSlot:true}))}))};}
export const BURIAL_LINES=[
 ['Willowmere','Walter has brought the wagon from Botrune. Beneath the old tree, two graves wait beside the running water. He takes off his gloves before he speaks.'],
 ['Chaplain Walter','Tell me something about them from before all this. Something you want to remember.','CHR-AERIC'],
 ['Aimon','Pate always walked slower when I came with them. He pretended he was tired. I knew he wasn’t.','CHR-AIMON'],
 ['Aimon','Trade used to let me explain things he already knew. He never made me feel stupid for getting them wrong.','CHR-AIMON'],
 ['Chaplain Walter','Then those are the men we bury. Two friends who made room for someone younger. Who tried to bring him through safely.','CHR-AERIC'],
 ['Aimon','I’m sorry I didn’t understand. I thought there would be time to catch up.','CHR-AIMON'],
 ['Willowmere','Aimon helps Walter lower the last shovels of earth. For a while they listen to the water. Nobody asks him to stop being angry.'],
 ['Chaplain Walter','There is something I have hesitated to tell you. An old account of a mirror. People said they heard the dead answer through it.','CHR-AERIC'],
 ['Aimon','You mean I could speak to them?','CHR-AIMON'],
 ['Chaplain Walter','I don’t know. I haven’t seen it. Some accounts call it a gate, others a door beneath Ramelle. I will not promise you your friends on the strength of a story.','CHR-AERIC'],
 ['Aimon','But someone might know.','CHR-AIMON'],
 ['Chaplain Walter','The marshal in Cayfen keeps records of the old roads. We can ask. First, there are two others who have been waiting for you.','CHR-AERIC'],
 ['Willowmere','Two Abyssals come from beside the wagon. Pate’s partner noses his old friendship cord. Trade’s settles beside the notebook. Neither moves away when Aimon kneels.'],
 ['Aimon','You can come with me. Both of you. If you want to.','CHR-AIMON']
];
export const GALLERY_WORKS=[
 {id:'water',title:'Where the River Waits',artist:'Nacre, a Water-type Abyssal',text:'Nacre drew water across the pigment with its fins. Its trainer only held the paper. The empty place on the bank is where they used to rest together.'},
 {id:'fire',title:'Windows Still Lit',artist:'Ember, a Fire-type Abyssal, with apprentice Salma',text:'Ember warmed each layer of coloured wax. Salma scratched the windows into it after sunset. They made it for neighbours who have not returned.'},
 {id:'steel',title:'Hands at Work',artist:'A Steel-type engraver with artisan Yusuf',text:'The Abyssal pressed each line into copper; Yusuf turned the plate beneath its claws. Neither signature is larger than the other.'}
];
export const COMMISSIONS=[
 {title:'A place to rest',palette:'river',shape:'open',tool:'wash'},
 {title:'Light in a crowded street',palette:'sunset',shape:'gather',tool:'stamp'},
 {title:'Something that can endure',palette:'earth',shape:'rise',tool:'etch'}
];
