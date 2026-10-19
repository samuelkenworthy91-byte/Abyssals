// Presentation snapshots never replace committed battle HP or consume battle RNG.
export const healthKey=u=>u.uid||`${u.side||'unit'}:${u.species.id}`;
export function captureHealth(...units){return units.filter(Boolean).map(u=>({key:healthKey(u),side:u.side,hp:u.hp,maxHp:u.maxHp}));}
export function healthChanges(before,...units){return captureHealth(...units).map(after=>({...after,before:before.find(b=>b.key===after.key)?.hp??after.hp,after:after.hp}));}
export const drainEase=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
export function presentedHP(change,t){return Math.round(change.before+(change.after-change.before)*drainEase(t));}
