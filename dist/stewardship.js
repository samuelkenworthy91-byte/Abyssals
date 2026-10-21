import {breedable} from './breeding.js?v=0.90.20';
import {STAT_KEYS,unitGrowthRates} from './progression.js?v=0.90.18';
export const permanentRates=u=>unitGrowthRates({...u,trainingEffects:[]});
export const rehomeable=u=>breedable(u)&&!u.originalStarter&&!u.unique&&!u.questUnique&&!u.species.unique&&!u.species.oneOfAKind;
export function stewardshipCost(u,stat){return 2**(u.stewardship?.[stat]||0);}
export function stewardshipQuote(state,uid,stat,ids){
 const all=[...state.party,...state.reserve],target=all.find(u=>u.uid===uid),donors=ids.map(id=>all.find(u=>u.uid===id));
 if(!target||target.hp<=0||target.dead||!STAT_KEYS.includes(stat))return {ok:false,reason:'Choose a living recipient and a stat.'};
 const cost=stewardshipCost(target,stat),before=permanentRates(target)[stat],after=before+1;
 const eligible=u=>rehomeable(u)&&u.uid!==uid&&u.species.types.some(t=>target.species.types.includes(t))&&permanentRates(u)[stat]>=after;
 if(target.giftOrigin==='Roadside rescue'&&Object.values(permanentRates(target)).reduce((a,b)=>a+b,0)+1>300.00001)return {ok:false,reason:'This rescue partner has reached its 300% total permanent growth limit.'};
 if(ids.length!==cost||new Set(ids).size!==ids.length||donors.some(u=>!eligible(u)))return {ok:false,reason:'Select exactly '+cost+' eligible partners.',cost,before,after,eligible};
 if(!state.party.some(u=>u.hp>0&&!u.dead&&!ids.includes(u.uid)))return {ok:false,reason:'Keep at least one living partner in your active expedition.'};
 return {ok:true,target,donors,cost,before,after,eligible};
}
export function rehomePartners(state,ids){
 const all=[...state.party,...state.reserve],donors=ids.map(id=>all.find(u=>u.uid===id));
 if(!ids.length||new Set(ids).size!==ids.length||donors.some(u=>!rehomeable(u))||!state.party.some(u=>u.hp>0&&!u.dead&&!ids.includes(u.uid)))return false;
 for(const u of donors)if(u.heldItem){state.heldItems??={};state.heldItems[u.heldItem]=(state.heldItems[u.heldItem]||0)+1;}
 state.party=state.party.filter(u=>!ids.includes(u.uid));state.reserve=state.reserve.filter(u=>!ids.includes(u.uid));
 if(ids.includes(state.leadUid))state.leadUid=state.party.find(u=>u.hp>0&&!u.dead).uid;
 return true;
}
export function applyStewardship(state,uid,stat,ids){const q=stewardshipQuote(state,uid,stat,ids);if(!q.ok||!rehomePartners(state,ids))return false;q.target.stewardship??={};q.target.stewardship[stat]=(q.target.stewardship[stat]||0)+1;return true;}
