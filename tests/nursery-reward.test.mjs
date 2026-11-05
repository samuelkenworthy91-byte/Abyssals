import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js?v=0.90.55';
import {EVOLUTIONS} from '../dist/evolution-data.js?v=0.90.55';
import {nurseryCandidatePool,nurseryOffers,grantQuestReward} from '../dist/quest-rewards.js';
const pool=nurseryCandidatePool();
assert(pool.length>3);assert.equal(new Set(pool).size,pool.length);
for(const s of DATA.species){
 const expected=EVOLUTIONS.some(e=>e.from_species_id===s.id)&&!EVOLUTIONS.some(e=>e.to_species_id===s.id)&&!s.legendaryRoamer&&!/legendary|mythic/i.test((s.power_class||'')+' '+(s.role||''));
 assert.equal(pool.includes(s.id),expected,s.name);
}
assert(!pool.includes('186'),'Evolving mythic Suncub must be excluded');
assert(pool.includes('001'),'Three-stage starters are eligible');
assert(pool.includes('568'),'Two-stage dossier families are eligible');
const make=()=>({sideCampaigns:{marchMeadow:{claimed:true}},party:[],reserve:[]});
assert.deepEqual(nurseryOffers({}),[]);
// Sweep every possible first draw; all eligible species must be reachable.
for(let i=0;i<pool.length;i++){
 const s=make();let calls=0;
 const offers=nurseryOffers(s,()=>calls++===0?(i+.5)/pool.length:0);
 assert.equal(offers[0],pool[i]);assert.equal(new Set(offers).size,3);
 assert(offers.every(id=>pool.includes(id)));
 const reloaded=JSON.parse(JSON.stringify(s));
 assert.deepEqual(nurseryOffers(reloaded,()=>{throw Error('Unexpected reroll');}),offers);
}
const state=make();state.sideCampaigns.marchMeadow.giftOffers=['361','060','222'];
const offers=nurseryOffers(state,()=>0);
assert.equal(state.sideCampaigns.marchMeadow.giftOfferVersion,2);
assert.notDeepEqual(offers,['361','060','222']);
const gift=id=>({uid:'nursery-gift',species:DATA.species.find(s=>s.id===id),level:5,hp:20});
assert(!grantQuestReward(state,'marchMeadow',{gift:gift(pool.find(id=>!offers.includes(id)))}));
assert(grantQuestReward(state,'marchMeadow',{gift:gift(offers[0])}));
assert.equal(state.party.length,1);assert.equal(state.party[0].giftOrigin,'Winter Nursery');
assert(!grantQuestReward(state,'marchMeadow',{gift:gift(offers[1])}));
assert.deepEqual(nurseryOffers(state,()=>{throw Error('Claimed reward rerolled');}),offers);
const old=make();old.sideCampaigns.marchMeadow={claimed:true,rewardVersion:1,giftOffers:['361','060','222'],giftUid:'existing'};
const before=JSON.stringify(old);nurseryOffers(old);assert.equal(JSON.stringify(old),before);
const full=make();full.party=Array.from({length:6},(_,i)=>({uid:'p'+i}));
assert(grantQuestReward(full,'marchMeadow',{gift:gift(nurseryOffers(full)[0])}));assert.equal(full.reserve.length,1);assert.equal(full.party.length,6);
console.log(`PASS: ${pool.length} eligible nursery species; every candidate reachable, three distinct offers, reload persistence, legacy migration, one-time reward and reserve placement.`);
