import {abilityName} from './abilities.js?v=0.90.24';

export function installExpeditionAbilities(data){
 for(const [family,name] of [['FAMILY-121','Quarry Scent'],['FAMILY-107','Fortune Finder']])for(const s of data.species.filter(s=>s.family_id===family)){
  const primary=s.id==='108'?'Grand Fortune':name;
  s.ability_names.primary=primary;s.abilities.primary='ABILITY_'+primary.toUpperCase().replaceAll(' ','_');
 }
}
export function encounterWeights(slots,leader){
 const active=leader?.hp>0&&!leader.dead&&abilityName(leader)==='Quarry Scent';
 return slots.map(s=>Math.max(0,Number(s.weight)||0)*(active?({common:.75,uncommon:1.5,rare:3,rumoured:3,rumored:3}[String(s.rarity||'Common').toLowerCase()]??1):1));
}
export function fortuneMultiplier(b,units=[]){
 const ids=new Set(b.participants||[]);
 return Math.max(1,...[...units,b.player].filter(Boolean).filter(u=>ids.has(u.uid)).map(u=>abilityName(u)==='Grand Fortune'?4:abilityName(u)==='Fortune Finder'?2:1));
}
export function fortuneParticipant(b,units=[]){return fortuneMultiplier(b,units)>1;}
export function battleDoubloonQuote(b,units=[],base=0){
 const multiplier=fortuneMultiplier(b,units);
 const eligible=b.kind!=='lesson'&&!b.questGuard&&!b.mythicId&&multiplier>1;
 const bonus=eligible&&base>0?base*(multiplier-1):eligible&&!b.trainer&&b.kind==='wild'&&b.outcome==='defeated'?5*Math.max(1,b.enemies[0]?.rewardLevel??b.enemies[0]?.level??1)*(multiplier/2):0;
 return {base,bonus,total:base+bonus,ability:bonus?(multiplier===4?'Grand Fortune':'Fortune Finder'):null};
}
