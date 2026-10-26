import {breedable} from './breeding.js?v=0.90.36';
import {STAT_KEYS,unitGrowthRates,permanentGrowthMultiplier} from './progression.js?v=0.90.41';
export const permanentRates=u=>unitGrowthRates({...u,trainingEffects:[]});
export const rehomeable=u=>breedable(u)&&!u.originalStarter&&!u.unique&&!u.questUnique&&!u.species.unique&&!u.species.oneOfAKind;
export function stewardshipCost(u,stat){return 2**(u.stewardship?.[stat]||0);}
export function stewardshipQuote(state,uid,stat,ids){
 const all=[...state.party,...state.reserve],target=all.find(u=>u.uid===uid);
 if(!target||target.hp<=0||target.dead||!STAT_KEYS.includes(stat))return {ok:false,reason:'Choose a living recipient and a stat.'};
 const firstCost=stewardshipCost(target,stat),before=permanentRates(target)[stat],step=permanentGrowthMultiplier(target);
 const eligible=u=>rehomeable(u)&&u.uid!==uid&&u.species.types.some(t=>target.species.types.includes(t))&&permanentRates(u)[stat]>=Math.round((before+step)*10)/10;
 const donors=ids.map(id=>all.find(u=>u.uid===id));
 if(new Set(ids).size!==ids.length||donors.some(u=>!eligible(u)))return {ok:false,reason:'Choose distinct eligible partners.',eligible,before,after:before,cost:firstCost,lessons:0};
 // Use weaker eligible donors first, keeping stronger donors for later thresholds.
 let available=[...donors].sort((a,b)=>permanentRates(a)[stat]-permanentRates(b)[stat]||a.uid.localeCompare(b.uid)),lessons=0,nextCost=firstCost;
 const used=[];
 while(Number.isSafeInteger(nextCost)&&nextCost>0&&nextCost<=available.length){
  const candidates=available.filter(u=>permanentRates(u)[stat]>=Math.round((before+(lessons+1)*step)*10)/10);if(candidates.length<nextCost)break;
  const chosen=candidates.slice(0,nextCost),chosenIds=new Set(chosen.map(u=>u.uid));used.push(...chosen);available=available.filter(u=>!chosenIds.has(u.uid));lessons++;nextCost*=2;
 }
 const usedIds=used.map(u=>u.uid),kept=donors.filter(u=>!usedIds.includes(u.uid));
 const quote={target,donors:used,usedIds,kept,cost:used.length,firstCost,nextCost,before,after:Math.round((before+lessons*step)*10)/10,lessons,gain:lessons*step,multiplier:step,eligible};
 if(!lessons)return {...quote,ok:false,reason:'Select enough eligible partners for the next lesson ('+firstCost+').'};
 if(!state.party.some(u=>u.hp>0&&!u.dead&&!usedIds.includes(u.uid)))return {...quote,ok:false,reason:'Keep at least one living partner in your active expedition.'};
 return {...quote,ok:true};
}
export function rehomePartners(state,ids){
 const all=[...state.party,...state.reserve],donors=ids.map(id=>all.find(u=>u.uid===id));
 if(!ids.length||new Set(ids).size!==ids.length||donors.some(u=>!rehomeable(u))||!state.party.some(u=>u.hp>0&&!u.dead&&!ids.includes(u.uid)))return false;
 for(const u of donors)if(u.heldItem){state.heldItems??={};state.heldItems[u.heldItem]=(state.heldItems[u.heldItem]||0)+1;}
 state.party=state.party.filter(u=>!ids.includes(u.uid));state.reserve=state.reserve.filter(u=>!ids.includes(u.uid));
 if(ids.includes(state.leadUid))state.leadUid=state.party.find(u=>u.hp>0&&!u.dead).uid;
 return true;
}
export function applyStewardship(state,uid,stat,ids){const q=stewardshipQuote(state,uid,stat,ids);if(!q.ok||!rehomePartners(state,q.usedIds))return false;q.target.stewardship??={};q.target.stewardship[stat]=(q.target.stewardship[stat]||0)+q.lessons;return true;}

