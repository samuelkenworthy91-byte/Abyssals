// Runtime references stay outside serializable saves; resumeAbilities rebinds them.
const parties=new WeakMap();
export const STAGE_KEYS=['attack','defence','sp_attack','sp_defence','speed','accuracy','evasion'];
export function bindMenagerieParty(units){for(const u of units)parties.set(u,units);}
export function menagerieParty(u){return (parties.get(u)||[u]).slice(0,6);}
export function relaySpread(u){return Object.fromEntries(STAGE_KEYS.map(k=>[k,Math.max(-6,Math.min(6,Number(u.stages?.[k])||0))]));}
export function otherPartyDamaged(actor,target){return (actor.field?.menagerieDamage||[]).some(d=>d.victim===(target.uid||target.species.id)&&d.side===actor.side&&d.actor!==(actor.uid||actor.species.id));}
export function recordMenagerieDamage(actor,target){actor.field??={};actor.field.menagerieDamage??=[];const row={actor:actor.uid||actor.species.id,victim:target.uid||target.species.id,side:actor.side};if(!actor.field.menagerieDamage.some(d=>d.actor===row.actor&&d.victim===row.victim))actor.field.menagerieDamage.push(row);}
