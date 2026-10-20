const EPITAPHS=['They answered your call, and walked beside you.','The road remembers the courage of small footsteps.','A name kept close can outlast the stone.','Here rests a partner, never merely a weapon.','You remember the warmth before the silence.','Their journey ended; your remembrance does not.'];
export const HUMAN_MEMORIAL=[{name:'The lost of Civeton',epitaph:'Soldiers, healers and families whose names the war has worn away.'},{name:'Those who never came home',epitaph:'Their places at our tables remain.'}];
function epitaph(unit){let n=2166136261;for(const c of String(unit.uid||unit.species?.id||''))n=Math.imul(n^c.charCodeAt(0),16777619);return EPITAPHS[(n>>>0)%EPITAPHS.length];}
export function memorialState(state){
 state.dead??=[];state.party??=[];state.reserve??=[];state.starterChosen=!!(state.starterChosen||state.starter||state.blessing||state.test||state.departed||state.party.concat(state.reserve,state.dead).some(u=>u.originalStarter));
 const m=state.memorialLedger??={version:1,status:state.dead.length?'PENDING_ESTABLISHMENT':'ABSENT',tutorial:state.dead.length?'AVAILABLE':'NOT_AVAILABLE',totalPermanentDeaths:state.dead.length,totalResurrections:0,totalSacrifices:0,reflectionCount:0,echoes:[]};
 for(const u of state.dead){u.deathLevel??=u.level;u.deathLocation??='An unrecorded stretch of the road';u.deathEpitaph??=epitaph(u);}
 m.currentMemorialCount=state.dead.length;return m;
}
export function recordMemorialDeath(state,unit){const m=memorialState(state);unit.deathLevel=unit.level;unit.deathEpitaph=epitaph(unit);m.totalPermanentDeaths++;if(m.status==='ABSENT')m.status='PENDING_ESTABLISHMENT';if(m.tutorial==='NOT_AVAILABLE')m.tutorial='AVAILABLE';m.currentMemorialCount=state.dead.length+1;}
export function visitMemorialTown(state,room){const m=memorialState(state);if(room==='town'&&m.status==='PENDING_ESTABLISHMENT')m.status='ESTABLISHED';return m;}
export function partnerResurrections(state,unit){
 const recorded=Number.isSafeInteger(unit?.resurrectionCount)&&unit.resurrectionCount>=0?unit.resurrectionCount:0;
 return Math.max(recorded,(state.memorialLedger?.echoes||[]).filter(e=>e.uid===unit?.uid).length);
}
export function resurrectionQuote(state,uid,selected){
 const m=memorialState(state),target=state.dead.find(u=>u.uid===uid),ids=new Set(selected),living=[...state.party,...state.reserve].filter(u=>u.hp>0&&!u.dead),donors=selected.map(id=>living.find(u=>u.uid===id)).filter(Boolean);
 const revivals=target?partnerResurrections(state,target):0,cost=10+2*revivals;
 const reason=state.wiped?'This expedition has ended.':m.status!=='ESTABLISHED'?'Return to Civeton after your first permanent loss.':!target?'This memorial entry is no longer available.':selected.length!==cost||ids.size!==cost||donors.length!==cost?'Choose exactly '+cost+' living partners.':new Set(donors.map(u=>u.species.id)).size!==cost?'Each sacrifice must have a different Dex species ID.':null;
 return {ok:!reason,reason,target,donors,cost,revivals};
}
export function resurrectPartner(state,uid,selected){
 const q=resurrectionQuote(state,uid,selected);if(!q.ok)return null;
 const ids=new Set(selected),m=memorialState(state);
 for(const u of [...q.donors,q.target])if(u.heldItem){state.heldItems??={};state.heldItems[u.heldItem]=(state.heldItems[u.heldItem]||0)+1;u.heldItem=null;}
 state.party=state.party.filter(u=>!ids.has(u.uid));state.reserve=state.reserve.filter(u=>!ids.has(u.uid));state.dead=state.dead.filter(u=>u.uid!==uid);
 const u=q.target;u.resurrectionCount=q.revivals+1;m.echoes.push({uid:u.uid,name:u.nickname||u.species.name,speciesId:u.species.id,deathLevel:u.deathLevel,deathLocation:u.deathLocation,epitaph:u.deathEpitaph});
 u.hp=u.maxHp;u.dead=false;u.lives=1;u.status=null;u.statusTurns=0;u.toxicCounter=0;u.confusion=0;u.stages={};u.moveState={};u.flinched=false;u.immuneFlinch=0;u.pendingReturn=false;u.moves.forEach(move=>move.left=move.pp);
 delete u.abilityState;delete u.field;delete u.combatFloor;delete u.actedThisRound;delete u.farewellKey;delete u.farewellText;delete u.deathLevel;delete u.deathLocation;delete u.deathEpitaph;
 (state.party.length<6?state.party:state.reserve).push(u);
 if(!state.party.some(p=>p.uid===state.leadUid&&p.hp>0))state.leadUid=state.party.find(p=>p.hp>0)?.uid||null;
 state.starter=state.party.concat(state.reserve,state.dead).find(p=>p.originalStarter)||null;
 m.totalResurrections++;m.totalSacrifices+=q.cost;m.currentMemorialCount=state.dead.length;return u;
}

export function companionHumanMemorial(state){return ["CHR-PATE","CHR-TRADE"].filter(id=>state.humanLives?.[id]?.historicalDeath).map(id=>({name:id==="CHR-PATE"?"Peter ‘Pate’ FitzRobert":"Thomas ‘Trade’ de Clare",epitaph:"Executed in Botrune. "+(state.humanLives[id].lifeState==="DEAD"?"His place beside you remains empty.":"Restored; his death remains part of the record.")}));}
