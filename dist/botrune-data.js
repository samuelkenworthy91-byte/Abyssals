import {DATA} from './data.js?v=0.87.0';
import {legalForm,legalMoves} from './route-roster.js?v=0.87.0';
// User-authored continuation, 20 October 2026. BT IDs deliberately do not
// impersonate the unavailable locked CH07 scene list (see docs/botrune-story.md).
export const BOTRUNE_LEADER='LDR-06';
export const BOTRUNE_NAME='Canon Fatima bint Musa';
export const STORM_ROAD=[
 ['stormVerge','Scribes’ Road · Last Green Bank',['191','274','015','286','159']],
 ['stormPylons','Thunderplain · Broken Conductors',['191','108','286','015','104']],
 ['stormGlass','Thunderplain · Glass Scars',['108','191','334','286','179']],
 ['stormHollow','Thunderplain · Burrow Hollow',['191','015','334','286','159']],
 ['stormWatch','Thunderplain · Abandoned Watch',['286','191','015','209','159']],
 ['stormCauseway','Thunderplain · The Black Causeway',['191','108','334','286','104']],
 ['stormApproach','Botrune · Road of Unanswered Bells',['286','191','015','334','159']]
];
export function botruneRoute(room){
 const n=STORM_ROAD.findIndex(r=>r[0]===room),r=STORM_ROAD[n];
 if(!r)return room.startsWith('botrune')?{room,area:{id:room,name:'Botrune',rate:'LOW'},tables:[]}:null;
 const day=r[2],night=[day[3],day[4],day[2],day[0],day[1]];
 return {room,explorationTable:true,encounterPacing:true,area:{id:room,name:r[1],rate:'NORMAL'},tables:[day,night].map((ids,p)=>({id:room+'-'+(p?'NIGHT':'DAY'),phase:p?'NIGHT':'DAY',area_id:room,slots:ids.map((id,i)=>({species_id:legalForm(id,64+n),min_level:64+n,max_level:68+n,weight:[32,26,22,15,5][i],rarity:i<3?'Common':i===3?'Uncommon':'Rare',authoredSlot:true}))}))};
}
const make=(id,name,portraitId,ids,levels,before,after)=>({id,name,portraitId,faction:'Dawn Bloom',role:id===BOTRUNE_LEADER?'leader':'Botrune guard',runtimeAuthored:true,expeditionTeam:true,ai_tier:'Advanced',before,after,team:ids.map((s,i)=>({slot:i+1,species_id:legalForm(s,levels[i]),level:levels[i],current_form_legal_move_ids:legalMoves(legalForm(s,levels[i]),levels[i])}))});
export const BOTRUNE_TRAINERS=[
 make('TRN-BT-ROAD-1','Conductor watch Yusuf','TRN-SC-stormBluffs-0',['191','015','286'],[65,66,67],'A company is crossing under arms. The conductor watch challenges you here, away from the shelter.','Keep to the pale road. The hollows are full of burrowing Ground types.'),
 make('TRN-BT-ROAD-2','Black Causeway watch Maryam','TRN-SC-stormBluffs-1',['108','334','159','191'],[68,68,69,70],'Botrune has closed its bells to travellers. Show your strength before you cross.','The bells are not broken. Someone ordered them to stop.'),
 make('TRN-BT-GUARD-1','Outer cordon captain','TRN-SC-stormBluffs-0',['214','048','310','191'],[71,71,72,72],'The sentence has been carried out. Step away from the square.','The outer cordon breaks. The stair watch is still above you.'),
 make('TRN-BT-GUARD-2','Stair watch captain','TRN-SC-stormBluffs-1',['048','371','310','096','214'],[72,72,73,73,73],'Nobody reaches the Canon from this stair.','The stair is open. The last captain waits on the platform.'),
 make('TRN-BT-GUARD-3','Platform guard captain','TRN-SC-stormBluffs-2',['214','310','048','371','375','034'],[73,73,74,74,74,74],'Your friends heard the sentence. You will hear an order: turn back.','The guard line falls back. Fatima stands alone at the lectern.'),
 make(BOTRUNE_LEADER,BOTRUNE_NAME,BOTRUNE_LEADER,['214','048','310','034','371','375'],[74,74,75,75,76,77],'They would have become a banner. I removed it before another army could raise it. You have mistaken grief for authority.','My guards are beaten. You can kill me. It will not make that platform empty again.')
];
export const BOTRUNE_GUARDS=BOTRUNE_TRAINERS.filter(t=>t.id.startsWith('TRN-BT-GUARD'));
export function installBotruneTrainers(expansion,voices={}){for(const t of BOTRUNE_TRAINERS){if(!expansion.trainers.some(x=>x.id===t.id))expansion.trainers.push(t);voices[t.id]={before:t.before,after:t.after,repeat:'This challenge is finished.'};}}
export const TRIAL_BEATS=[
 {lines:[['Canon Fatima bint Musa','People of Botrune. These First Light soldiers poisoned the wells, burned our grain and murdered those who would not kneel. Their commanders call it deliverance. We call it by its proper name.','LDR-06'],['Botrune','Nobody cheers. A woman folds her hands over an empty bread basket. Beside her, a clerk looks down at the stones.']]},
 {lines:[['First prisoner','We arrived yesterday. We never went near your wells.'],['Canon Fatima bint Musa','The record is complete.','LDR-06']],death:'prisoner-1'},
 {lines:[['Second prisoner','Ask the miller. We carried his daughter out of the storm.'],['Botrune','The miller in the front row opens his mouth. A guard turns towards him. He lowers his head.']],death:'prisoner-2'},
 {lines:[['Third prisoner','There was no hearing. You did not even ask our names.'],['Canon Fatima bint Musa','Names do not alter a sentence.','LDR-06']],death:'prisoner-3'},
 {lines:[['Botrune','The guard pulls the last two prisoners into the light. A familiar face turns towards the crowd. Then another.'],['Aimon','Pate? Trade?','CHR-AIMON']]},
 {lines:[['Pate','Aimon. No—don’t come up here. Run! Get away from this place!','CHR-PATE'],['Trade','Listen to him. You don’t have to prove anything to us. Go. Live.','CHR-TRADE'],['Aimon','Let them go. They haven’t done what you said. Let them go!','CHR-AIMON']]},
 {comic:'pate',lines:[['Pate','Please—he is only a boy. Let Aimon go. Look at me. Please, look at me!','CHR-PATE'],['A guard','Canon, wait! These two carried our wounded. I saw them!'],['Canon Fatima bint Musa','Continue.','LDR-06']],death:'CHR-PATE'},
 {comic:'trade',lines:[['Trade','Pate? Pate, answer me. Please. Aimon, don’t look. Go!','CHR-TRADE'],['A soldier below the stage','Stop! For the love of—stop! They have done nothing!'],['Trade','Aimon. Please.','CHR-TRADE']],death:'CHR-TRADE'},
 {lines:[['Botrune','There is no applause. Fatima lowers the blade. Five people lie on the platform. The clerk closes a ledger whose last two lines were never filled in.'],['Aimon','I thought if I could just catch up…','CHR-AIMON'],['Aimon','They were here. I was here.','CHR-AIMON'],['Canon Fatima bint Musa','Clear the square.','LDR-06']]}
];
export const WITNESSES={
 'bt-miller':['The miller','My well is clean. It has been clean all week. The soldier she killed helped my daughter walk when the thunder frightened her. I should have said it. I stood here and let her say those things.'],
 'bt-clerk':['The sentencing clerk','There are no depositions. No witnesses. The sentence was copied before the prisoners arrived. I was told to leave the names blank. The archive beneath the abbey still holds the original records; the soldiers have not been allowed inside.'],
 'bt-baker':['The baker','Our grain store burned three months ago. Those boys were not even in this country then. Look at me. I am telling you she lied.'],
 'bt-scholar':['Abbey scholar','Do not burn the archive for what its keeper has done. The books belong to nobody’s army. I can keep the doors open when her guards are gone.']
};
export const STORM_RECORD='The old Scribes’ Road crosses a bare plateau. Copper conductors once carried strikes away from the shelters; requisition crews stripped several for the war. Fused glass scars the basalt. Electric Abyssals gather around the surviving rods, Dark types hunt beneath the cloud cover, and Ground types burrow below the charged surface. The pale maintained road has no wild encounters. Lightning is distant scenery: it never deals hidden damage to your partners. The last roadside shelter is west of Botrune. Prepare before entering the city.';


// Fatima's six slots each use an existing legal all-physical attacking set.
// No stat inflation or invented attacks; the identity comes from team selection.
for(const slot of BOTRUNE_TRAINERS.find(t=>t.id===BOTRUNE_LEADER).team){
 const legal=legalMoves(slot.species_id,slot.level).map(id=>DATA.moves.find(m=>m.id===id)).filter(m=>m?.category==='PHYSICAL'&&m.power>0).sort((a,b)=>b.power-a.power);
 const selected=[];for(const m of legal)if(!selected.some(x=>x.type===m.type))selected.push(m);
 for(const m of legal)if(!selected.includes(m)&&selected.length<4)selected.push(m);
 slot.battle_move_ids=selected.slice(0,4).map(m=>m.id);
}
