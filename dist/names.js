export function cleanName(value,fallback=''){return String(value??'').normalize('NFKC').replace(/[<>\x00-\x1f\x7f]/g,'').replace(/\s+/g,' ').trim().slice(0,20)||fallback;}
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function unitName(unit){return (unit.shiny===true?'✦ ':'')+(unit.nickname||unit.species.name);}
