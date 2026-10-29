import {prepareSpecialistMove,stabMultiplier} from './teamcraft-battle.js?v=0.90.52';
import {statusAttackFactor} from './status-rules.js?v=0.90.52';
import {DATA} from './data.js?v=0.90.52';
import {legalForm,legalMoves} from './route-roster.js?v=0.90.52';
import {typeEffectiveness} from './type-rules.js?v=0.90.52';
import {stageMultiplier,damageScale} from './engine.js?v=0.90.52';
import {moveUsable,moveDamageMultiplier} from './move-rules.js?v=0.90.52';
import {canSwitch,leaveAbility,enterAbility,abilityName,abilityImmunity,heldStat,abilityMultiplier} from './abilities.js?v=0.90.52';
export const isArenaBossRound=round=>Number.isSafeInteger(round)&&round>0&&round%5===0;
export const arenaRoundMarks=round=>isArenaBossRound(round)?round*10:round+2;
// Species, four preferred legal techniques, ability slot and held-item role.
const member=(id,moves,ability='primary',role='OFFENSE')=>({id,moves,ability,role});
export const ARENA_BOSS_TEAMS=[
 {key:'rain',name:'The Rain Circuit',plan:'Raincall powers Water attacks and Rainrunner sweepers; Selkiora pivots to recover, while Galebrass covers Ground attacks.',members:[member('052',[371,74,57,107]),member('145',[74,57,107,520],'secondary','SPEED'),member('140',[87,43,155,41],'secondary','SUSTAIN'),member('398',[333,57,107,41],'primary','SUSTAIN'),member('384',[463,465,45,464]),member('131',[184,317,44,187],'hidden','GUARD')]},
 {key:'sun',name:'The Sunfire Accord',plan:'Solar Vigil activates Sunstride and boosts Fire pressure; Grass and Fighting partners punish Water, Rock and Ground answers.',members:[member('050',[372,190,25,26],'secondary'),member('200',[385,92,96,372],'hidden','SUSTAIN'),member('248',[401,175,27,26],'primary','SPEED'),member('363',[454,166,318,321],'hidden','GUARD'),member('058',[338,25,518,522],'primary','STATUS'),member('411',[485,85,127,117])]},
 {key:'sand',name:'The Sandstone Bastion',plan:'Sandwake supports a Ground, Rock and Steel defensive core. Flying cover and mixed attackers punish attempts to exploit a single weakness.',members:[member('037',[373,43,229,11],'primary','SUSTAIN'),member('169',[165,229,276,279],'secondary','GUARD'),member('391',[476,325,163,329],'primary','GUARD'),member('131',[184,317,44,187],'hidden','SPEED'),member('179',[226,74,205,60],'hidden'),member('336',[349,160,351,348],'secondary','SUSTAIN')]},
 {key:'siege',name:'The Violet Ward',plan:'Screens shelter poison pressure and recovery pivots. Regnacra sustains the line, Shroudvane covers Ground and Fighting attacks, and Dreadcleaver breaks weakened targets.',members:[member('063',[376,190,312,198],'hidden','GUARD'),member('388',[475,45,41,521],'primary','STATUS'),member('398',[333,57,107,41],'primary','SUSTAIN'),member('136',[375,92,312,96],'hidden','SUSTAIN'),member('340',[174,257,249,518]),member('375',[460,325,289,306])]},
 {key:'relay',name:'The Crown Relay',plan:'Crownveil builds a Prismatic Procession and passes its boosts with Relay Plumage. Resistant pivots protect fast physical and special finishers.',members:[member('400',[480,333,186,518],'primary','SPEED'),member('443',[505,184,41,12],'primary','GUARD'),member('395',[478,139,337,521],'primary','STATUS'),member('393',[477,108,303,109]),member('380',[467,45,198,520]),member('479',[517,182,41,10],'primary','SUSTAIN')]}
];
export function arenaBossSpec(round){return isArenaBossRound(round)?ARENA_BOSS_TEAMS[(round/5-1)%ARENA_BOSS_TEAMS.length]:null;}
export function buildArenaBoss(round,level){
 const spec=arenaBossSpec(round);if(!spec)return null;
 const team=spec.members.map((p,i)=>{
  const partnerLevel=Math.min(200,level+Math.min(i,2)),id=legalForm(p.id,partnerLevel),species=DATA.species.find(s=>s.id===id);
  const legal=new Set(legalMoves(id,partnerLevel));
  for(const m of DATA.moves)if(m.exchangeLesson&&m.tutorTypes.some(t=>species.types.includes(t)))legal.add(m.id);
  const moves=p.moves.filter(id=>legal.has(id));
  for(const m of DATA.moves.filter(m=>legal.has(m.id)&&m.power>0).sort((a,b)=>b.power-a.power))if(moves.length<4&&!moves.includes(m.id))moves.push(m.id);
  return {slot:i+1,species_id:id,level:partnerLevel,current_form_legal_move_ids:[...legal],battle_move_ids:moves.slice(0,4),abilitySlot:p.ability};
 });
 return {key:spec.key,name:spec.name,plan:spec.plan,team,sourceHeldRoles:spec.members.map((p,i)=>({slot:i+1,role:p.role})),bagUses:2,arenaHealingFraction:.5,arenaBoss:true,ai_tier:'Expert'};
}
const usable=u=>(u.moves||[]).filter(m=>moveUsable(u,m));
export function expectedDamage(actor,target,move){
 if(!move?.power||actor.hp<=0||abilityImmunity(target,move))return 0;move=prepareSpecialistMove(actor,move);
 let effectiveness=typeEffectiveness(move.type_id,target.species.types);
 if(move.type_id==='GROUND'&&['Hovercore','Levitate'].includes(abilityName(target)))effectiveness=0;
 const special=move.category==='SPECIAL',a=special?'sp_attack':'attack',d=special?'sp_defence':'defence';
 const attack=(actor.stats[a]||1)*stageMultiplier(actor.stages?.[a])*heldStat(actor,a),defence=(target.stats[d]||1)*stageMultiplier(target.stages?.[d])*heldStat(target,d);
 return ((2*actor.level/5+2)*move.power*attack/Math.max(1,defence)/50+2)*effectiveness*stabMultiplier(actor,move)*damageScale(actor.level)*moveDamageMultiplier(actor,target,move)*abilityMultiplier(actor,target,move,{effectiveness})*statusAttackFactor(actor,special)*(move.accuracy==='ALWAYS'?1:(move.accuracy??100)/100)*.925;
}
const pressure=(a,b)=>Math.max(0,...usable(a).map(m=>expectedDamage(a,b,m)))/Math.max(1,b.hp);
export function chooseArenaBossMove(b,actor,target,pool=usable(actor)){
 if(!(b.trainer?.arenaBoss||b.trainer?.eliteLeader)||!pool.length)return null;
 const threat=pressure(target,actor),health=actor.hp/actor.maxHp;
 const score=m=>{
  if(m.power){const damage=expectedDamage(actor,target,m);return damage/Math.max(1,target.maxHp)*2+(damage>=target.hp?2:0)+(m.priority>0&&damage>=target.hp?1:0);}
  let value=-1;
  if(target.moveState?.protection&&!['SELF','ACTIVE_SIDE'].includes(m.target))return -2;
  for(const e of m.effects||[]){
   if(['heal','heal_by_format'].includes(e.effect_id)&&health<.65)value=Math.max(value,(1-health)*1.5+(threat<.9?.25:0));
   if(e.effect_id==='cure_major_status'&&actor.status)value=Math.max(value,.65);
   if(e.effect_id==='weather'&&actor.field?.weather!==e.weather&&threat<1)value=Math.max(value,.95);
   if(e.effect_id==='terrain'&&actor.field?.terrain!==e.terrain)value=Math.max(value,.8);
   if(e.effect_id==='screen'&&(actor.field?.screens?.[actor.side]?.[e.category]||0)<2){const preferred=usable(target).filter(m=>m.power).sort((a,c)=>expectedDamage(target,actor,c)-expectedDamage(target,actor,a))[0];value=Math.max(value,(preferred?.category===e.category ? .95 : .3));}
   if(e.effect_id==='inflict_status'&&!target.status&&e.target!=='SELF'){
    const immune=(e.status==='POISON'||e.status==='BAD_POISON')&&target.species.types.some(t=>['POISON','STEEL'].includes(t))||e.status==='PARALYSIS'&&target.species.types.includes('ELECTRIC')||['FREEZE','FROSTBITE'].includes(e.status)&&target.species.types.includes('ICE')||e.status==='BURN'&&target.species.types.includes('FIRE');
    if(!immune&&!target.statusImmunity?.[e.status]&&!(abilityName(target)==='Toxinproof'&&['POISON','BAD_POISON'].includes(e.status))&&!(abilityName(target)==='Coldproof'&&e.status==='FREEZE'))value=Math.max(value,['SLEEP','FREEZE'].includes(e.status)?.75:e.status==='BAD_POISON'?.7:.55);
   }
   if(e.effect_id==='stat_stage'&&e.target==='SELF'&&e.stages>0&&health>.6&&threat<.55){const keys=e.stats||[e.stat];if(keys.some(k=>(actor.stages?.[k]||0)<2))value=Math.max(value,.55+Math.min(.25,(keys.length-1)*.1));}
  }
  if(m.effects?.some(e=>e.effect_id==='protect')&&(target.status||actor.heldItem==='HELD_PILGRIM_CUP')&&(actor.moveState?.protectChain||0)===0)value=Math.max(value,.6);
  return value*(m.accuracy==='ALWAYS'?1:(m.accuracy??100)/100);
 };
 return [...pool].sort((a,c)=>score(c)-score(a))[0];
}
export function chooseArenaBossAction(b){
 if(!(b.trainer?.arenaBoss||b.trainer?.eliteLeader))return null;
 const actor=b.enemies[0],target=b.player;if(!actor||actor.hp<=0||!target||target.hp<=0)return null;
 const threat=pressure(target,actor),attack=pressure(actor,target),hp=actor.hp/actor.maxHp;
 // Switching spends the whole enemy action. A two-turn cooldown prevents loops.
 if(canSwitch(actor)&&(b.lastBossSwitchRound??-10)<=b.round-2&&(!b.trainer.eliteLeader||(b.leaderSwitchCount||0)<8)){
  const relay=abilityName(actor)==='Relay Plumage'&&Object.values(actor.stages||{}).filter(v=>v>0).reduce((n,v)=>n+v,0)>=2;
  const candidates=b.enemies.map((u,index)=>({u,index})).filter(({u,index})=>index>0&&u.hp>0&&!u.dead).map(({u,index})=>({u,index,threat:pressure(target,u),attack:pressure(relay?{...u,stages:{...u.stages,...actor.stages}}:u,target)}));
  candidates.sort((a,c)=>(c.attack-c.threat)-(a.attack-a.threat));
  const best=candidates[0];
  if(best&&(relay&&best.threat<.75||threat>=.8&&best.threat<threat*.6||attack===0&&best.attack>0&&best.threat<.9)&&(relay||best.attack-best.threat>attack-threat+.35))return {kind:'switch',index:best.index};
 }
 const healAmount=Math.floor(actor.maxHp*(b.trainer.arenaHealingFraction||.5));
 if((b.trainerMedicineUsed||0)<(b.trainer.bagUses||0)&&hp<.4&&healAmount/actor.maxHp>=.08&&attack<1&&threat<1+healAmount/Math.max(1,actor.hp))return {kind:'heal'};
 return {kind:'move',move:chooseArenaBossMove(b,actor,target)};
}
export function switchArenaBoss(b,index){
 const old=b.enemies[0],next=b.enemies[index];
 if(!(b.trainer?.arenaBoss||b.trainer?.eliteLeader)||!Number.isInteger(index)||index<1||!next||next.hp<=0||next.dead||!canSwitch(old))return null;
 const field=b.player.field||old.field||{};next.stages={};
 const messages=leaveAbility(old,{switching:true,nextUnit:next});
 b.enemies[index]=old;b.enemies[0]=next;b.lastBossSwitchRound=b.round;b.leaderSwitchCount=(b.leaderSwitchCount||0)+1;next.actedThisRound=true;
 messages.unshift(b.trainer.name+' withdraws '+old.species.name+' and sends out '+next.species.name+'.');
 messages.push(...enterAbility(next,b.player,{party:b.enemies,field}));
 return messages;
}
export function orderArenaBossReplacement(b){if(!(b.trainer?.arenaBoss||b.trainer?.eliteLeader)||b.enemies.length<2)return;const ranked=b.enemies.map((u,index)=>({index,score:pressure(u,b.player)-pressure(b.player,u)})).sort((a,c)=>c.score-a.score||a.index-c.index);if(b.trainer.eliteLeader&&b.enemies.length>2)for(const row of ranked)if(b.enemies[row.index].leaderAce)row.score-=.5;ranked.sort((a,c)=>c.score-a.score||a.index-c.index);const index=ranked[0].index;if(index>0)[b.enemies[0],b.enemies[index]]=[b.enemies[index],b.enemies[0]];}

