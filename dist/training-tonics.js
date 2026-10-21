export function levelTonicQuote(state,unit,count=1){
 const maximum=unit&&unit.hp>0&&!unit.dead?Math.max(0,Math.min(Math.floor(state.trainingTonics||0),200-unit.level)):0;
 const ok=Number.isSafeInteger(count)&&count>0&&count<=maximum&&!(state.rewardQueue?.length);
 return {ok,maximum,count,from:unit?.level,to:unit?unit.level+count:null};
}
// Charge once and persist the sequence. Each step offers that level's moves and
// evolution before growing again, including after a reload. Existing EXP is kept.
export function queueLevelTonics(state,uid,count){
 const unit=[...(state.party||[]),...(state.reserve||[])].find(u=>u.uid===uid);
 if(!levelTonicQuote(state,unit,count).ok)return false;
 state.trainingTonics-=count;
 state.rewardQueue=[{kind:'tonic-grow',uid,remaining:count}];
 state.rewardHandoff={kind:'tonic',uid};
 return true;
}
