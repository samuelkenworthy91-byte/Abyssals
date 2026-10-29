import {defeatExpMultiplier} from './rimebun.js?v=0.90.52';
const opponentRecord=(u,b)=>({enemyUid:u.uid,level:u.rewardLevel??u.level,expMultiplier:defeatExpMultiplier(u),participants:[...(b.participants||[b.player.uid])]});
// Capturing settles the same training encounter as a knockout. A retreat does not.
export function completedBattleOpponents(b,outcome){
 if(!['captured','defeated'].includes(outcome))return [];
 if(!b.trainer&&!b.relicDouble)return b.enemies[0]?[opponentRecord(b.enemies[0],b)]:[];
 const records=[...(b.defeats||[])];
 const caught=outcome==='captured'?b.enemies.find(u=>u.uid===b.capturedUid):null;
 if(caught&&!records.some(r=>r.enemyUid===caught.uid))records.push(opponentRecord(caught,b));
 return records;
}
export function battleExperienceRecipients(b,party,reserve=[]){
 const opponents=new Set(b.enemies.map(u=>u.uid));
 const roster=b.relicDouble?[...party,...reserve.filter(u=>u.uid===b.alliedRivet?.uid)]:party;
 // A newly recruited opponent neither learns from its own capture nor grants
 // a retroactive Warbond bonus to the expedition, even with Binoculars active.
 return roster.filter(u=>!opponents.has(u.uid));
}
