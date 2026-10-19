// Collectibles are a live layer so a saved claim removes art and interaction immediately.
const RELIC_ALIASES={'keep-treasury-reward':['keep-treasury','keep-treasury-reward']};
const RELIC_IDS=new Set(['armory-reliquary','keep-treasury-reward','medicine-chain-reward','scrub-shrine-cache']);
export function pickupAsset(id){if(['march-provisions','scrub-shrine-cache'].includes(id)||/^explore-find-orchard-[123]$/.test(id))return 'sack';if(['tunnel-provisions','medicine-cache'].includes(id)||RELIC_IDS.has(id)||id.endsWith('-cache'))return 'chest';return null;}
export function pickupCollected(state,id){if(!pickupAsset(id))return false;if(id==='medicine-cache')return !!(state.medicineFound||state.hospiceQuest?.guardDefeated||state.hospiceQuest?.recipient);if(id.endsWith('-fort-cache'))return !!state.leaderForts?.[id.replace('-fort-cache','')]?.cache;if(/^explore-find-orchard-/.test(id))return !!state.exploration?.finds?.includes(id);return !!(state.supplyClaims?.includes(id)||state.exploration?.claims?.includes(id)||(RELIC_ALIASES[id]||[id]).some(key=>state.collectedRelics?.includes(key)));}
export function pickupFieldSpots(spots,state){return spots.filter(s=>!pickupCollected(state,s.id));}
export function drawWorldPickups(c,spots,state,drawAsset){for(const s of spots){const asset=pickupAsset(s.id);if(asset&&!pickupCollected(state,s.id))drawAsset(c,asset,s.x,s.y,1,1);}}
