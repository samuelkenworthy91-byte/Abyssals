import {inheritanceSummaryHTML} from './breeding-inheritance.js?v=0.90.52';
import {DATA} from './data.js?v=0.90.52';
import {EVOLUTIONS} from './evolution-data.js?v=0.90.52';
import {learningState} from './learning-access.js?v=0.90.52';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function learnTreeHTML(unit){const actual=new Set([unit.species.id,...(unit.evolutionHistory||[]).flatMap(h=>[h.from,h.to])]),future=new Set(),walk=(id,seen=new Set())=>{if(seen.has(id))return;seen.add(id);for(const e of EVOLUTIONS.filter(e=>e.from_species_id===id)){future.add(e.to_species_id);walk(e.to_species_id,seen);}};walk(unit.species.id);
 const section=(id,preview)=>{const species=DATA.species.find(s=>s.id===id),equipped=new Set(unit.moves.map(m=>m.id)),rows=DATA.learnsets.filter(l=>l.species_id===id).map(l=>{const m=DATA.moves.find(m=>m.id===l.move_id),access=learningState(unit,l,{preview}),available=access.available;return `<li class="${available?'learn-ready':'learn-future'}"><span>${l.method==='CODEX'?'Codex':l.level===0?'Signature':'Lv. '+l.level}</span><div><b>${esc(m.name)}</b><small>${m.type_id} · ${m.category} ${m.power?'· Power '+m.power:''}${m.priority?' · Priority +'+m.priority:''}</small><p>${esc(m.effect_text||'No additional effect.')}</p><small>${equipped.has(m.id)?'Equipped':access.label}${l.expansion?' · Expanded tree':''}</small></div></li>`;}).join('');return `<details ${id===unit.species.id?'open':''}><summary>${esc(species.name)}${preview?' · future form preview':id===unit.species.id?' · current form':' · previous form'}</summary><p><b>${esc(species.moveset_identity?.style||species.role)}</b> · ${esc(species.moveset_identity?.plan||'')}</p><ol class="learn-tree">${rows}</ol></details>`;};
 return `${inheritanceSummaryHTML(unit)}<p>Choose up to four moves. Level-ups offer new moves; Walter in Civeton can freely restore eligible moves from this partner’s actual forms. Future branches are previews.</p>${[...actual].map(id=>section(id,false)).join('')}${[...future].filter(id=>!actual.has(id)).map(id=>section(id,true)).join('')}`;
}


