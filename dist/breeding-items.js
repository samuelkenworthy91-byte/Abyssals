import {STAT_KEYS} from './progression.js?v=0.90.41';
export const BASE_PRODIGY_CHANCE=Math.pow(1/750,1/6);
export const NURSERY_ITEMS=[
 {id:'familySeal',name:'Family Seal',price:20000,reusable:false,description:'Single use. Choose either parent’s base species for the egg. Cannot be used when both parents have the same base species.'},
 {id:'heirloomCharm',name:'Heirloom Charm',price:500000,reusable:true,description:'Reusable. Raises each parent’s Prodigy roll to 40%. Adds the same 6.824 percentage-point bonus alongside Feed or Thread.'},
 {id:'prodigyFeed',name:'Prodigy Feed',price:35000,reusable:false,description:'Single use. 45% per parent carrying an eligible Prodigy stat, or 51.824% with the Charm. Use Feed or Thread per egg.'},
 {id:'inheritanceThread',name:'Inheritance Thread',price:15000,reusable:false,description:'Single use. Each parent carrying the chosen Prodigy stat gets a 65% roll, or 71.824% with the Charm. Other stats keep their normal or Charm odds.'},
 {id:'broodingWarmer',name:'Brooding Warmer',price:200000,reusable:true,description:'Reusable. New eggs need 384 steps instead of 512. Existing eggs keep their original requirements.'}
];
export const nurseryItemCount=(state,id)=>state.nurseryItems?.[id]||0;
export function buyNurseryItem(state,id){
 const item=NURSERY_ITEMS.find(i=>i.id===id);if(!item||!Number.isFinite(state.money)||state.money<item.price||item.reusable&&nurseryItemCount(state,id)>0)return false;
 state.nurseryItems??={};state.nurseryItems[id]=nurseryItemCount(state,id)+1;state.money-=item.price;return true;
}
export function validateNurseryItems(state){
 const bag=state.nurseryItems;if(bag===undefined)return true;
 if(!bag||typeof bag!=='object'||Array.isArray(bag)||Object.entries(bag).some(([id,n])=>!NURSERY_ITEMS.some(i=>i.id===id)||!Number.isSafeInteger(n)||n<0||NURSERY_ITEMS.find(i=>i.id===id).reusable&&n>1))throw Error('Nursery supplies are invalid.');return true;
}
export function validBreedingEffects(e){return !!e&&e.version===1&&typeof e.charm==='boolean'&&typeof e.warmer==='boolean'&&['none','feed','thread'].includes(e.enhancer)&&(e.enhancer==='thread'?STAT_KEYS.includes(e.threadStat):e.threadStat===null)&&(e.sealParent===null||[0,1].includes(e.sealParent));}
export function prepareBreedingEffects(state,options={},forms=[]){
 if(!options||typeof options!=='object')return {ok:false,reason:'Choose valid nursery options.'};
 const e={version:1,charm:options.charm??nurseryItemCount(state,'heirloomCharm')>0,warmer:options.warmer??nurseryItemCount(state,'broodingWarmer')>0,enhancer:options.enhancer??'none',threadStat:options.enhancer==='thread'?options.threadStat:null,sealParent:options.sealParent??null};
 if(!validBreedingEffects(e))return {ok:false,reason:'Choose valid nursery options.'};
 const used=[];if(e.charm&&!nurseryItemCount(state,'heirloomCharm')||e.warmer&&!nurseryItemCount(state,'broodingWarmer'))return {ok:false,reason:'A reusable nursery item is not owned.'};
 if(e.enhancer!=='none')used.push(e.enhancer==='feed'?'prodigyFeed':'inheritanceThread');
 if(e.sealParent!==null){if(forms.length!==2||forms[0]===forms[1])return {ok:false,reason:'These parents already produce the same base species.'};used.push('familySeal');}
 if(used.some(id=>nurseryItemCount(state,id)<1))return {ok:false,reason:'A selected nursery supply is out of stock.'};
 return {ok:true,effects:e,used,total:e.warmer?384:512};
}
export function inheritanceChance(stat,effects={}){
 let chance=effects.enhancer==='feed'?.45:effects.enhancer==='thread'&&effects.threadStat===stat?.65:BASE_PRODIGY_CHANCE;
 if(effects.charm)chance+=.4-BASE_PRODIGY_CHANCE;
 return Math.min(1,chance);
}
export const chanceLabel=(stat,effects={})=>(inheritanceChance(stat,effects)*100).toFixed(3)+'%';
