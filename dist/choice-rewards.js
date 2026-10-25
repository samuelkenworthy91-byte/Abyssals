// Branch bonuses supplement existing quest prizes; recorded choices are never reopened.
const pack=(label,reward)=>({label,reward});
export const CHOICE_REWARDS={
 revolt_cart:{food:pack('Relief kitchens’ capture provisions',{freshMeat:4}),protection:pack('Carters’ equipment and purse',{money:2000,binoculars:2})},
 grain:{families:pack('Civilian kitchens: capture provisions',{freshMeat:12}),army:pack('Quartermaster: marching protection',{armedEscorts:20,smoke:6,emergencyEvacs:2})},
 medicine:{nurses:pack('Hospice staff: treatment supplies',{poultices:10,slowStews:6}),soldier:pack('Recovered soldiers: field protection',{armedEscorts:8,smoke:6})},
 marchMeadow:{a:pack('Nursery stores',{heartyFood:4}),b:pack('Refugee travel kit',{emergencyEvacs:2})},
 burrowHollow:{a:pack('Public-well caravan provisions',{heartyFood:5}),b:pack('Burrow wardens’ safe-passage kit',{armedEscorts:4})},
 glassSluice:{a:pack('Households’ collection',{money:1800}),b:pack('Engineers’ equipment',{binoculars:3,emergencyEvacs:1})},
 emberQuarry:{a:pack('Workers’ salvage share',{money:2200}),b:pack('Common forge training supplies',{trainingTonics:4})},
 stormBluffs:{a:pack('Neutral caravan provisions',{heartyFood:6}),b:pack('Rescue-watch transport',{emergencyEvacs:3})},
 orchardCanopy:{a:pack('Hospice recovery stores',{poultices:8}),b:pack('Public orchard preserves',{winterPreserves:8})},
 reedSanctuary:{a:pack('Recovered dumping fines',{money:2800}),b:pack('Water-watch field kit',{binoculars:4,riverBait:8})},
 coralGrotto:{a:pack('Crossing wardens’ provisions',{freshMeat:4}),b:pack('Rescue-mooring transport',{emergencyEvacs:4,smoke:3})},
 moonlitDepths:{a:pack('Families’ travelling provisions',{freshMeat:5}),b:pack('Memorial keepers’ healing stores',{poultices:12,slowStews:4})},
 relicCrags:{a:pack('Civilian refuge provisions',{freshMeat:5}),b:pack('Public-record patrol kit',{armedEscorts:8,binoculars:2})},
 philomereBackwaters:{a:pack('Communities’ delivered provisions',{freshMeat:6}),b:pack('Ferry service transport',{emergencyEvacs:5,armedEscorts:4})},
 smugglersWeir:{a:pack('Daytime ferry protection',{armedEscorts:10}),b:pack('Quiet landing supplies',{smoke:12,emergencyEvacs:2})},
 saltFlats:{a:pack('Returned-levy finder’s share',{money:6500}),b:pack('Cistern keeper’s provisions',{freshMeat:6,slowStews:3})},
 rescueGlade:{a:pack('Healers’ supplies',{poultices:8}),b:pack('Neutral shelter evacuation kit',{emergencyEvacs:3})},
 anglersReach:{a:pack('Winter-pool bait stores',{riverBait:24}),b:pack('Net-recovery patrol equipment',{binoculars:3,armedEscorts:3})},
 orchard_grove:{a:pack('Replacement-tree harvest',{freshMeat:8}),b:pack('Burn-ward medical stores',{poultices:12,slowStews:6})},
 orchard_shrine:{a:pack('Household-copy collection',{money:8000}),b:pack('Custodians’ travel protection',{armedEscorts:12,emergencyEvacs:3})},
 court:{break:pack('Recovered broken fittings',{money:8000,smoke:6}),dismantle:pack('Intact sanctuary stores',{freshMeat:6,lifeEmbers:1})}
};
export const REWARD_NAMES={money:'doubloons',freshMeat:'Fresh Meat',heartyFood:'Hearty Ration',slowStews:'Slow Stew',poultices:'Poultice',armedEscorts:'Armed Escort',smoke:'Smoke Bomb',emergencyEvacs:'Emergency Evac',binoculars:'Binoculars',trainingTonics:'Training Tonic',winterPreserves:'Winter Preserve',riverBait:'River Bait',lifeEmbers:'Life Ember'};
export function rewardText(reward){return Object.entries(reward||{}).map(([key,n])=>key==='money'?n.toLocaleString('en-GB')+' doubloons':(REWARD_NAMES[key]||key)+' × '+n).join(' · ');}
export function choiceRewardText(key,choice){return rewardText(CHOICE_REWARDS[key]?.[choice]?.reward);}
export function outcomeState(state){state.choiceRewards??={version:1,claimed:{},receipts:[]};state.choiceRewards.claimed??={};state.choiceRewards.receipts??=[];return state.choiceRewards;}
export function claimChoiceReward(state,key,choice){const p=CHOICE_REWARDS[key]?.[choice],q=outcomeState(state);if(!p||q.claimed[key])return false;for(const [k,n]of Object.entries(p.reward))state[k]=(state[k]||0)+n;q.claimed[key]=choice;q.receipts.push({key,choice,label:p.label,reward:{...p.reward}});return true;}
export function migrateChoiceRewards(state){
 if(state.revolt?.aid)claimChoiceReward(state,'revolt_cart',state.revolt.aid);
 if(state.cybressa?.grain)claimChoiceReward(state,'grain',state.cybressa.grain);
 const medicine=state.hospiceQuest?.recipient;if(medicine)claimChoiceReward(state,'medicine',medicine);
 for(const [key,q]of Object.entries(state.sideCampaigns||{}))if(q.claimed&&q.choice)claimChoiceReward(state,key,q.choice);
 for(const key of ['grove','shrine']){const q=state.cossenne?.expeditions?.[key];if(q?.claimed&&q.choice)claimChoiceReward(state,'orchard_'+key,q.choice);}
 if(state.paladinCourt?.released)claimChoiceReward(state,'court',state.paladinCourt.choice);
 return state;
}
