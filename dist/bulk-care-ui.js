import {rehomeable,permanentRates,stewardshipQuote} from './stewardship.js?v=0.90.33';
import {STAT_LABELS} from './progression.js?v=0.90.31';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function bulkCareMenu(a,uid=null,stat=null,selection=[]){
 const {state,openModal,$,document,partnerIdentity,menuBack,confirm,back}=a,all=[...state.party,...state.reserve],target=all.find(u=>u.uid===uid);
 const base=uid?stewardshipQuote(state,uid,stat,[]):null;
 if(uid&&!base.eligible){a.toast(base.reason);back();return;}
 const units=all.filter(uid?base.eligible:rehomeable),selected=new Set(selection.filter(id=>units.some(u=>u.uid===id))),attr=uid?'steward-donor':'rehome-unit';
 openModal(uid?'Choose partners for batch stewardship':'Ordinary rehoming',`<p>${uid?`${safe(target.nickname||target.species.name)} · ${STAT_LABELS[stat]}. Complete as many lessons as your selection can fund. Costs double after every lesson. Surplus partners stay with you.`:'Select any number of partners. Rehoming is permanent and grants no reward. Held items return to your bag.'}</p><button id="care-select-all">Select all visible eligible</button><button id="care-clear">Clear selection</button><p id="care-preview" role="status"></p><div class="summary-list">${units.map(u=>`<button data-${attr}="${u.uid}" aria-pressed="${selected.has(u.uid)}">${partnerIdentity(u)}${uid?`<small>${STAT_LABELS[stat]} growth ${permanentRates(u)[stat]}%</small>`:''}</button>`).join('')||'<p>No eligible partners.</p>'}</div><button id="care-review">Review permanent rehoming</button>`);
 const nodes=[...document.querySelectorAll('[data-'+attr+']')];
 const update=()=>{
  for(const button of nodes){const yes=selected.has(button.getAttribute('data-'+attr));button.setAttribute('aria-pressed',String(yes));button.style.outline=yes?'3px solid #d5ad46':'';}
  const ids=[...selected],q=uid?stewardshipQuote(state,uid,stat,ids):null,keepLiving=state.party.some(u=>u.hp>0&&!u.dead&&!selected.has(u.uid));
  $('#care-preview').textContent=uid?`Selected ${ids.length}. Use ${q.cost||0}; keep ${q.kept?.length??ids.length}. ${STAT_LABELS[stat]} ${q.before}% → ${q.after}% · +${q.lessons||0} percentage points. ${q.ok?'Next lesson: '+q.nextCost+' partners.':q.reason}`:`Selected ${ids.length} partners. ${keepLiving?'Held items will return to your bag.':'Keep at least one living party member.'}`;
  $('#care-review').disabled=uid?!q.ok:!ids.length||!keepLiving;
 };
 for(const button of nodes)button.onclick=()=>{const id=button.getAttribute('data-'+attr);if(selected.has(id))selected.delete(id);else selected.add(id);update();};
 $('#care-select-all').onclick=()=>{for(const button of nodes)if(button.getClientRects().length)selected.add(button.getAttribute('data-'+attr));if(!uid&&!state.party.some(u=>u.hp>0&&!u.dead&&!selected.has(u.uid))){const keep=state.party.find(u=>u.hp>0&&!u.dead&&u.uid===state.leadUid)||state.party.find(u=>u.hp>0&&!u.dead);if(keep)selected.delete(keep.uid);}update();};
 $('#care-clear').onclick=()=>{selected.clear();update();};
 $('#care-review').onclick=()=>{if(!$('#care-review').disabled)confirm([...selected],uid,stat);};menuBack(back,uid?'Choose another stat':'Back to stewardship');update();
}
