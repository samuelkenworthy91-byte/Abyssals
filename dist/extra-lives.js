export const LIFE_EMBER={name:'Life Ember',key:'lifeEmbers',text:'Give a living Abyssal one extra life. After a lethal defeat, it returns at the end of the round with 10% HP while another life remains. Cannot restore a dead partner.'};
// Separate, one-time rare chests also remain available in saves that collected old caches.
export const LIFE_EMBER_PICKUPS=[
 {id:'relic-life-ember-cache',room:'relicCrags',label:'Sealed shellstone chest',x:18,y:13},
 {id:'fort-life-ember-cache',room:'waranCave4',label:'Unbroken reliquary chest',x:18,y:11}
];
export function livesRemaining(u){return Number.isSafeInteger(u?.lives)?Math.max(0,u.lives):u?.dead?0:u?.originalStarter?3:1;}
export function lifeCapacity(u){return Math.max(u?.originalStarter?3:1,u?.lifeCapacity||0,livesRemaining(u));}
export function grantExtraLife(state,uid){
 if(state.wiped||!(state.lifeEmbers>0))return false;
 const unit=[...(state.party||[]),...(state.reserve||[])].find(u=>u.uid===uid&&u.hp>0&&!u.dead);
 if(!unit)return false;
 unit.lives=livesRemaining(unit)+1;unit.lifeCapacity=lifeCapacity(unit);unit.lifeEmbersReceived=(unit.lifeEmbersReceived||0)+1;state.lifeEmbers--;return true;
}
export function claimLifeEmber(state,id){if(!LIFE_EMBER_PICKUPS.some(p=>p.id===id))return false;state.supplyClaims??=[];if(state.supplyClaims.includes(id))return false;state.supplyClaims.push(id);state.lifeEmbers=(state.lifeEmbers||0)+1;return true;}
