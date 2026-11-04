// Canonical cue registry. Source identities and checksums: docs/music/TRACK_MANIFEST.json.
export const SOUNDTRACK={
 overworld:'adventure1.mp3',battle:'BattleTheme1.mp3',
 journey:'route-journey-across-the-realm.mp3',dark:'route-ancient-shadows.mp3',
 dorelem:'town-dorelem.mp3',philomere:'town-philomere.mp3',cybressa:'town-cybressa.mp3',
 cossenne:'town-cossenne.mp3',botrune:'town-botrune.mp3',cayfen:'town-cayfen.mp3',ramelle:'town-ramelle.mp3',
 darius:'character-darius-idealists-burden.mp3',descent:'event-darius-descent.mp3',
 execution:'event-pate-trade-execution.mp3',burial:'event-pate-trade-burial.mp3'
};
export const TOWN_CUES={town:'overworld',marasen:'overworld',dorelem:'dorelem',philomere:'philomere',hospice:'philomere',cybressa:'cybressa',cossenne:'cossenne',botrune:'botrune',botruneLower:'botrune',botruneShelter:'botrune',cayfen:'cayfen',ramelle:'ramelle'};
export const MOUNTAIN_ROOMS=['stormDariusCamp','stormDariusRidge','stormDariusCrown'];
export const EARLY_DARIUS=['TRN-REV-DARIUS','TRN-MR-DARIUS','TRN-COURT-CAUSE-DARIUS'];
export const EARLY_ROUTES=['march','scrub','northRoad','hospiceRoad','medicinePath'];
export const DARK_ROOMS=['tunnels','burrowHollow','moonlitDepths','relicCrags','glassSluice','emberQuarry','coralGrotto'];
export function soundtrackState(s){return s.soundtrack??={version:1,positions:{}};}
export function explorationCue(room,{doors={},maps={}}={}){
 const parent=doors[room]?.room||(['pate','trade','shop'].includes(room)?'town':room);
 if(TOWN_CUES[parent])return TOWN_CUES[parent];
 if(DARK_ROOMS.some(id=>parent.startsWith(id))||/^(waranCave|storm|spore|court|bannerwood|crownfall|emptyThrone)/.test(parent))return 'dark';
 if(EARLY_ROUTES.includes(parent)||/^(march|scrub|northRoad|hospiceRoad|medicinePath)\d+$/.test(parent))return 'overworld';
 return maps[parent]?.area?'journey':'overworld';
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
 // The crisis ends with Tianzhar's recorded fate, or pauses on leaving the ascent.
 if(MOUNTAIN_ROOMS.includes(parent)&&!s.thunderplain?.darius?.outcome)return 'descent';
 if(EARLY_DARIUS.includes(trainer?.id)||dialogue?.lines?.some(l=>l.portrait==='REV-DARIUS'||EARLY_DARIUS.includes(l.portrait)))return 'darius';
 // Both unverified M4As stay source-only. Ordinary leaders deliberately retain battle.
 if(battle)return 'battle';
 return explorationCue(room,{doors,maps});
}
