import {DATA} from './data.js?v=0.90.48';
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
// Keep all nine checkpoint indices stable for existing saves.
export const TRIAL_BEATS=[
 {
  "lines": [
   [
    "Botrune",
    "The narrow street opens onto the abbey square. Soldiers hold a crowd below a raised platform. Five prisoners kneel beside a block. Fatima stands at a lectern, a heavy sword beside her."
   ],
   [
    "Canon Fatima bint Musa",
    "By authority of the garrison, the following sentences will be carried out now.",
    "LDR-06"
   ],
   [
    "A woman in the crowd",
    "Where was the hearing? Let their families speak!"
   ],
   [
    "Cordon captain",
    "Behind the line. All of you."
   ]
  ]
 },
 {
  "lines": [
   [
    "Canon Fatima bint Musa",
    "First prisoner. Poisoning the south well and conspiring to murder the households who draw from it. Guilty. Sentence: death.",
    "LDR-06"
   ],
   [
    "First prisoner",
    "We arrived yesterday! I never went near that well. Ask anyone on the gate!"
   ],
   [
    "The miller",
    "The well is clean! I drank from it this morning!"
   ],
   [
    "Cordon captain",
    "Another word and you will be removed. Hold the line."
   ],
   [
    "Botrune",
    "Fatima leaves the lectern. The prisoner is forced forward. The sword falls; his protest stops. His body is dragged clear of the block."
   ]
  ],
  "death": "prisoner-1"
 },
 {
  "lines": [
   [
    "Canon Fatima bint Musa",
    "Second prisoner. Burning the grain store and withholding food from the people of Botrune. Guilty. Sentence: death.",
    "LDR-06"
   ],
   [
    "The baker",
    "That fire was months ago! She wasn’t even here!"
   ],
   [
    "Second prisoner",
    "Please. Ask the miller. I carried his daughter out of the storm. He knows me."
   ],
   [
    "Cordon captain",
    "Face the platform. Keep the crowd back."
   ],
   [
    "Botrune",
    "A guard forces her to her knees. Fatima strikes again. The miller shouts until his voice breaks; the soldiers do not move."
   ]
  ],
  "death": "prisoner-2"
 },
 {
  "lines": [
   [
    "Canon Fatima bint Musa",
    "Third prisoner. Murder of a civilian messenger and armed conspiracy against this city. Guilty. Sentence: death.",
    "LDR-06"
   ],
   [
    "Third prisoner",
    "You took me off a wagon. I asked for a hearing. You wouldn’t even take my name."
   ],
   [
    "A voice in the crowd",
    "Then name the messenger! Who was killed?"
   ],
   [
    "Canon Fatima bint Musa",
    "The sentence stands.",
    "LDR-06"
   ],
   [
    "Cordon captain",
    "Eyes front. Nobody crosses."
   ],
   [
    "Botrune",
    "The third prisoner struggles as the guards pin his arms. Fatima brings the sword down. His heels scrape once against the boards, then stop."
   ]
  ],
  "death": "prisoner-3"
 },
 {
  "lines": [
   [
    "Botrune",
    "The last two prisoners are pulled forward. One has a green cloak darkened by the rain. The other turns at the sound of your voice."
   ],
   [
    "Aimon",
    "Pate? Trade?",
    "CHR-AIMON"
   ],
   [
    "Canon Fatima bint Musa",
    "Peter FitzRobert. Known as Pate. Aiding an enemy company, theft of garrison supplies and organising armed infiltration. Guilty. Sentence: death.",
    "LDR-06"
   ],
   [
    "Pate",
    "We came for a wagon ride! We were buying supplies for a cart. Ask the driver!",
    "CHR-PATE"
   ],
   [
    "Aimon",
    "That’s a lie! They haven’t done any of that!",
    "CHR-AIMON"
   ]
  ]
 },
 {
  "lines": [
   [
    "Pate",
    "Aimon. No—don’t come up here. Run! Get away from this place!",
    "CHR-PATE"
   ],
   [
    "Trade",
    "Listen to him. You don’t have to prove anything to us. Go. Live.",
    "CHR-TRADE"
   ],
   [
    "Aimon",
    "Let them go. They haven’t done what you said. Let them go!",
    "CHR-AIMON"
   ],
   [
    "A garrison soldier",
    "Captain. That’s the man who carried Huw off the road. Those two helped our wounded."
   ],
   [
    "Another soldier",
    "I saw them at the wagon stand. They were asking about a ride. Canon, there’s been a mistake."
   ],
   [
    "Canon Fatima bint Musa",
    "Return to your posts.",
    "LDR-06"
   ]
  ]
 },
 {
  "comic": "pate",
  "lines": [
   [
    "Pate",
    "Please—he is only a boy. Aimon, stay back. Look at me. Stay back!",
    "CHR-PATE"
   ],
   [
    "A guard",
    "Canon, wait! These two carried our wounded. I saw them!"
   ],
   [
    "Canon Fatima bint Musa",
    "You have your orders.",
    "LDR-06"
   ],
   [
    "Botrune",
    "A guard grips Pate’s shoulders. Fatima drives the heavy blade down. Blood strikes the boards. His knees give way and he falls, still facing the crowd."
   ],
   [
    "Trade",
    "Pate! No—let me go! Let me get to him!",
    "CHR-TRADE"
   ],
   [
    "Botrune",
    "Pate does not move. A soldier releases his arm and stares at the blood on his glove."
   ]
  ],
  "death": "CHR-PATE"
 },
 {
  "comic": "trade",
  "lines": [
   [
    "Canon Fatima bint Musa",
    "Thomas de Clare. Known as Trade. Carrying enemy dispatches and recruiting aid for the same conspiracy. Guilty. Sentence: death.",
    "LDR-06"
   ],
   [
    "Trade",
    "It’s a field notebook. Look in it! There are names of people we helped—please, just look!",
    "CHR-TRADE"
   ],
   [
    "A soldier below the stage",
    "Stop! For the love of—stop! They have done nothing!"
   ],
   [
    "Trade",
    "Aimon. Don’t come any closer. Please.",
    "CHR-TRADE"
   ],
   [
    "Botrune",
    "Trade tries to turn towards Pate. Fatima strikes before he can reach him. He hits the boards hard; his open hand falls beside the notebook."
   ],
   [
    "Aimon",
    "Trade!",
    "CHR-AIMON"
   ],
   [
    "Botrune",
    "Neither of them answers. Rain runs red between the planks."
   ]
  ],
  "death": "CHR-TRADE"
 },
 {
  "lines": [
   [
    "Botrune",
    "There is no applause. Five people lie dead on the platform. A soldier steps away from the block and is sick behind the stair. The clerk’s pen hangs above two names he never wrote."
   ],
   [
    "Aimon",
    "You heard them. You heard all of them.",
    "CHR-AIMON"
   ],
   [
    "Aimon",
    "You knew they hadn’t done it.",
    "CHR-AIMON"
   ],
   [
    "Canon Fatima bint Musa",
    "Clear the square.",
    "LDR-06"
   ],
   [
    "Aimon",
    "Don’t you walk away from me!",
    "CHR-AIMON"
   ],
   [
    "Chaplain Walter",
    "Aimon. I’m here. Stay with me.",
    "CHR-AERIC"
   ]
  ]
 }
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
