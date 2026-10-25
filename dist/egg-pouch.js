export const POUCH_UPGRADES=[
 {capacity:4,price:10000,name:'Padded Egg Pouch'},
 {capacity:5,price:20000,name:'Divided Egg Pouch'},
 {capacity:6,price:40000,name:'Travelling Egg Pouch'},
 {capacity:8,price:80000,name:'Keeper’s Egg Satchel'},
 {capacity:10,price:160000,name:'Master Keeper’s Satchel'}
];
export const eggCapacity=state=>POUCH_UPGRADES[(state.nursery?.pouchTier||0)-1]?.capacity||3;
export const nextPouchUpgrade=state=>POUCH_UPGRADES[state.nursery?.pouchTier||0]||null;
export const sellsPouchUpgrades=room=>['philomereShop','cybressaShop','cossenneShop','botruneShop','marasen','marasenMarket','cayfen','ramelle'].includes(room);
export function buyPouchUpgrade(state,expectedTier=state.nursery?.pouchTier||0){
 const tier=state.nursery?.pouchTier||0,item=nextPouchUpgrade(state);
 if(!Number.isInteger(tier)||tier<0||tier>=POUCH_UPGRADES.length||tier!==expectedTier||!item||!Number.isFinite(state.money)||state.money<item.price)return false;
 state.nursery??={version:1,serial:0,eggs:[],hatched:[]};state.money-=item.price;state.nursery.pouchTier=tier+1;return true;
}
export function validatePouch(state){const tier=state.nursery?.pouchTier;if(tier!==undefined&&(!Number.isInteger(tier)||tier<0||tier>POUCH_UPGRADES.length))throw Error('The Egg Pouch upgrade record is invalid.');return true;}
