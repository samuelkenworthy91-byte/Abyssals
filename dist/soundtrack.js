// Stable song IDs preserve saved playback positions when their scene assignments change.
// Source identities and checksums: docs/music/TRACK_MANIFEST.json.
export const SOUNDTRACK={
 overworld:'adventure1.mp3',battle:'BattleTheme1.mp3',
 route:'route-catching-up.m4a',leader:'battle-city-leader.m4a',
 journey:'route-journey-across-the-realm.mp3',dark:'route-ancient-shadows.mp3',
 dorelem:'town-dorelem.mp3',philomere:'town-philomere.mp3',cybressa:'town-cybressa.mp3',
 cossenne:'town-cossenne.mp3',botrune:'town-botrune.mp3',cayfen:'town-cayfen.mp3',ramelle:'town-ramelle.mp3',
 darius:'character-darius-idealists-burden.mp3',descent:'event-darius-descent.mp3',
 execution:'event-pate-trade-execution.mp3',burial:'event-pate-trade-burial.mp3',
 adventure05:'adventure05-where-the-sky-meets-the-sea.m4a',
 adventure06:'adventure06-beneath-a-restless-heaven.m4a',
 adventure07:'adventure07-the-unseen-presence.m4a',
 adventure08:'adventure08-the-emerald-apocalypse.m4a',
 battle02:'battle02-ironblood-rebellion.m4a',
 battle03:'battle03-teeth-of-the-abyss.m4a',
 battle04:'battle04-furious-rhythms.m4a',
 evolution:'event-abyssal-evolution.m4a'
};
// Kyvton (the starting town) is the canonical `town` / Civeton map internally.
export const TOWN_CUES={town:'journey',marasen:'overworld',dorelem:'dorelem',philomere:'philomere',hospice:'philomere',cybressa:'cybressa',cossenne:'cossenne',botrune:'dark',botruneLower:'dark',botruneShelter:'dark',cayfen:'cayfen',ramelle:'ramelle'};
export const MOUNTAIN_ROOMS=['stormDariusCamp','stormDariusRidge','stormDariusCrown'];
export const EARLY_DARIUS=['TRN-REV-DARIUS','TRN-MR-DARIUS','TRN-COURT-CAUSE-DARIUS'];
export const EARLY_ROUTES=['march','scrub','northRoad','hospiceRoad','medicinePath'];
export const DARK_ROOMS=['tunnels','burrowHollow','moonlitDepths','relicCrags','glassSluice','emberQuarry','coralGrotto'];
export function soundtrackState(s){return s.soundtrack??={version:1,positions:{}};}
export function explorationCue(room,{doors={},maps={}}={}){
 const parent=doors[room]?.room||(['pate','trade','shop'].includes(room)?'town':room);
 if(TOWN_CUES[parent])return TOWN_CUES[parent];
 if(DARK_ROOMS.some(id=>parent.startsWith(id))||/^(waranCave|storm|spore|court|bannerwood|crownfall|emptyThrone)/.test(parent))return 'route';
 if(EARLY_ROUTES.includes(parent)||/^(march|scrub|northRoad|hospiceRoad|medicinePath)\d+$/.test(parent))return 'overworld';
 return maps[parent]?.area?'route':'overworld';
}
// No mutations: legacy saves recover the active cue from existing story receipts.
export function selectSoundtrack({state:s={},room='town',battle=null,dialogue=null,doors={},maps={}}={}){
 const q=s.soundtrack||{},bt=s.botrune||{},fn=s.finale||{},trainer=battle?.trainer;
 const leader=trainer?.id==='LDR-06';
 const executionStarted=q.executionStarted||bt.cursor>0||bt.phase==='gauntlet';
 const executionEnded=q.executionEnded||!!s.fates?.['LDR-06']||(s.defeatedTrainers||[]).includes('LDR-06');
 const parent=doors[room]?.room||room;
 if(executionStarted&&!executionEnded&&!leader&&['botrune','botruneLower','botruneShelter'].includes(parent))return 'execution';
 if(parent==='burialGrove'&&(q.burialActive||fn.burialCursor>0&&!fn.buried))return 'burial';
 // All eight city leaders and their supervised rematches use the confirmed boss cue.
 // The mandatory execution/ceremony contexts above retain their scripted priority.
 if(/^LDR-0[1-8]$/.test(trainer?.rematchOf||trainer?.id||''))return 'leader';
 // The crisis ends with Tianzhar's recorded fate, or pauses on leaving the ascent.
 if(MOUNTAIN_ROOMS.includes(parent)&&!s.thunderplain?.darius?.outcome)return 'descent';
 if(EARLY_DARIUS.includes(trainer?.id)||dialogue?.lines?.some(l=>l.portrait==='REV-DARIUS'||EARLY_DARIUS.includes(l.portrait)))return 'darius';
 if(battle)return 'battle';
 return explorationCue(room,{doors,maps});
}

export const ROUTE_PLAYLIST=['overworld','route','adventure05','adventure06','adventure07','adventure08'];
export const BATTLE_PLAYLIST=['battle','battle02','battle03','battle04'];
export function musicPlaylist({cue,battle,room,doors={}}){
 if(cue==='battle'&&battle)return 'battle';
 const parent=doors[room]?.room||(['pate','trade','shop'].includes(room)?'town':room);
 return !battle&&!TOWN_CUES[parent]&&['overworld','route'].includes(cue)?'route':null;
}
// The committed reward receipt owns the cue through stats, ability and move pages.
export function evolutionMusicToken(card){
 if(!card)return null;
 return card.evolutionFlow||(['evolved','evolution-stats'].includes(card.kind)?[card.uid,card.from,card.to,card.pathId||card.leaderId||''].join(':'):null);
}

export function linkEvolutionMusicCards(queue=[]){
 const card=queue[0],token=evolutionMusicToken(card);if(!token)return;
 card.evolutionFlow=token;
 for(const next of queue.slice(1)){if(next.kind!=='learn'||!next.entry||next.uid!==card.uid)break;next.evolutionFlow=token;}
}
