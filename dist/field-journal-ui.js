import {fieldJournalAllSpecies,fieldJournalCounts,fieldJournalStatus,fieldJournalLiving,fieldJournalLosses,fieldJournalGrowth,fieldJournalEvolutions,fieldJournalMoves,fieldJournalHabitats,fieldJournalRumours,fieldJournalAvailability,ensureFieldJournal,STAT_KEYS,STAT_LABELS} from './field-journal.js?v=0.90.47';
import {TYPE_COLORS,TYPES} from './type-rules.js?v=0.87.0';
const LIMIT=30;
const statuses={all:'Every entry',unknown:'Undiscovered',seen:'Seen · never caught',owned:'Caught · no living specimen',living:'Caught · alive'};
const fallback='No verified wild habitat in the current encounter records. This form may require an evolution, trade, reward or special event.';
export function createFieldJournalUI({state,openModal,menuBack,gameMenu,escapeHTML,combatArtSrc,normalizeSummaryArt,roomName,document}){
 let filters={search:'',status:'all',type:'all',page:0};
 const esc=v=>escapeHTML(String(v??''));
 const all=fieldJournalAllSpecies();
 const badge=status=>'<span class="field-journal-badge field-journal-'+status+'">'+
  ({unknown:'Undiscovered',seen:'Seen · not caught',owned:'Caught · not alive',living:'Caught · alive'}[status]||status)+'</span>';
 const art=(species,hidden=false)=>'<img data-summary-art="'+esc(species.id)+'" data-summary-uid="" data-summary-shiny="false" src="'+esc(combatArtSrc({species,shiny:false}))+'" alt="'+(hidden?'Unidentified Abyssal silhouette':esc(species.name))+'">';
 const journalTitle=()=>{const name=String(state.playerName||'Aimon').trim()||'Aimon';return name+(name.toLowerCase().endsWith('s')?'’':'’s')+' Field Journal';};
 function renderList(request=filters,keepFocus=false){
  ensureFieldJournal(state);
  filters={...filters,...request};
  const text=filters.search.trim().toLowerCase();
  const list=all.filter(s=>(!text||s.name.toLowerCase().includes(text)||s.id.includes(text))&&
    (filters.type==='all'||s.types?.includes(filters.type))&&
    (filters.status==='all'||fieldJournalStatus(state,s.id)===filters.status));
  const pages=Math.max(1,Math.ceil(list.length/LIMIT));
  filters.page=Math.max(0,Math.min(pages-1,filters.page||0));
  const count=fieldJournalCounts(state);
  const entries=list.slice(filters.page*LIMIT,(filters.page+1)*LIMIT);
  const html='<div class="field-journal-intro"><span class="eyebrow">PERSONAL BESTIARY</span><p>Sightings are recorded in battle. Catch an Abyssal to reveal its natural growth, evolution and move pool. A catch stays recorded even if that partner later dies, evolves or leaves.</p></div>'+
   '<div class="field-journal-counts"><b>'+count.seen+' / '+count.total+' seen</b><b>'+count.owned+' registered</b><b>'+count.living+' species alive</b></div>'+
   '<div class="field-journal-filters"><label>Search by name or number<input id="field-journal-search" type="search" autocomplete="off" value="'+esc(filters.search)+'" placeholder="Find an Abyssal"></label>'+
   '<label>Record<select id="field-journal-status">'+Object.entries(statuses).map(([k,v])=>'<option value="'+k+'"'+(filters.status===k?' selected':'')+'>'+v+'</option>').join('')+'</select></label>'+
   '<label>Type<select id="field-journal-type"><option value="all">All types</option>'+TYPES.map(t=>'<option value="'+esc(t)+'"'+(filters.type===t?' selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label></div>'+
   '<p class="field-journal-results">'+list.length+' entries · page '+(filters.page+1)+' of '+pages+'</p>'+
   '<div class="field-journal-list">'+(entries.map(s=>{
    const status=fieldJournalStatus(state,s.id);
    const hasSeen=status!=='unknown',caught=status==='owned'||status==='living';
    return '<button class="field-journal-row" data-field-id="'+esc(s.id)+'">'+
     '<span class="field-journal-art '+(caught?'':'field-journal-silhouette')+'">'+art(s,!caught)+'</span>'+
     '<span class="field-journal-row-text"><strong>No. '+esc(s.id)+' · '+(hasSeen?esc(s.name):'Unknown Abyssal')+'</strong>'+
     '<small>'+(caught?s.types.map(t=>esc(t)).join(' / '):(hasSeen?'Location rumour available · silhouette':'Undiscovered · silhouette'))+'</small></span>'+badge(status)+'</button>';
   }).join('')||'<p>No records match these filters.</p>')+'</div>'+
   '<div class="field-journal-pages"><button id="field-journal-prev" '+(filters.page===0?'disabled':'')+'>Previous</button><span>'+(filters.page+1)+' / '+pages+'</span><button id="field-journal-next" '+(filters.page>=pages-1?'disabled':'')+'>Next</button></div>';
  const root=document.querySelector('.modal');
  const previousScroll=root?.scrollTop||0;
  openModal(journalTitle(),html);
  document.querySelector('.modal')?.classList.add('field-journal-modal');
  normalizeSummaryArt();
  document.querySelectorAll('[data-field-id]').forEach(button=>button.addEventListener('click',()=>renderEntry(button.dataset.fieldId)));
  const search=document.querySelector('#field-journal-search');
  search.addEventListener('input',()=>{
   const value=search.value,caret=search.selectionStart;
   renderList({...filters,search:value,page:0},true);
   const next=document.querySelector('#field-journal-search');
   next?.focus({preventScroll:true});
   if(caret!==null)next?.setSelectionRange(caret,caret);
  });
  for(const [selector,key] of [['#field-journal-status','status'],['#field-journal-type','type']])
   document.querySelector(selector).addEventListener('change',e=>renderList({...filters,[key]:e.target.value,page:0}));
  document.querySelector('#field-journal-prev').onclick=()=>renderList({...filters,page:filters.page-1});
  document.querySelector('#field-journal-next').onclick=()=>renderList({...filters,page:filters.page+1});
  menuBack(gameMenu,'Back to Start menu');
  if(!keepFocus&&previousScroll)document.querySelector('.modal').scrollTop=previousScroll;
 }
 function renderEntry(id){
  const species=all.find(s=>s.id===id);
  if(!species)return renderList();
  const status=fieldJournalStatus(state,id),seen=status!=='unknown',caught=['owned','living'].includes(status);
  const living=fieldJournalLiving(state,id);
  const losses=fieldJournalLosses(state,id);
  const habitat=fieldJournalHabitats(id);
  const noted=state.fieldJournal?.seen?.[id]?.room;
  const availability=fieldJournalAvailability(id);
   const placeText=caught?'<p><b>'+esc(availability.message)+'</b></p>'+(habitat.length&&availability.kind==='wild'?'<ul>'+habitat.slice(0,12).map(r=>'<li>'+esc(r.area)+(r.phase&&r.phase!=='BOTH'?' · '+esc(r.phase.toLowerCase()):'')+(r.levels?' · Lv. '+esc(r.levels):'')+'</li>').join('')+'</ul>'+(habitat.length>12?'<p>+'+(habitat.length-12)+' further recorded locations</p>':''):''):'<p class="field-journal-rumour">'+esc(seen?fieldJournalRumours(id,state):'Encounter this Abyssal to begin recording location rumours.')+'</p>';
  const growth=fieldJournalGrowth(species,living[0]||null);
  const growthHtml=caught?'<section class="field-journal-section"><h3>Growth rates</h3><p>Natural species growth'+(living.length?' compared with your first living specimen. Prodigy and permanent bonuses are included in that specimen’s figures.':' (individual bonuses unavailable without a living specimen).')+'</p><div class="field-journal-growth">'+
   STAT_KEYS.map(k=>'<div><span>'+esc(STAT_LABELS[k])+'</span><b>'+esc(growth.original[k])+'%</b>'+(growth.individual?'<strong>'+esc(growth.individual[k])+'%</strong>':'')+'</div>').join('')+
   '</div><small>Figures are growth per level, not battle stat totals. The right column, when present, is your living partner.</small></section>':'<section class="field-journal-section locked"><h3>Growth rates</h3><p>Catch this species to learn its natural growth percentages.</p></section>';
  const evolutions=fieldJournalEvolutions(id);
  const evolutionHtml=caught?'<section class="field-journal-section"><h3>Evolution lineage</h3>'+
   (evolutions.map(e=>'<p>'+esc(e.from.name)+' → '+esc(e.to.name)+' · '+esc(e.condition?.method||'Special method')+(e.condition?.minimum_level?' · Lv. '+esc(e.condition.minimum_level):'')+'</p>').join('')||'<p>No recorded evolution for this form.</p>')+'</section>':'';
  const moves=fieldJournalMoves(id);
  const movesHtml=caught?'<details class="field-journal-section field-journal-moves"><summary>Move pool · '+moves.length+' learnable entries</summary>'+
   (moves.map(r=>'<article><div><b>Lv. '+esc(r.level)+' · '+esc(r.move.name)+'</b><small>'+esc(r.move.type_id)+' / '+esc(r.move.category)+' · '+(r.move.power?'Power '+esc(r.move.power):'Status')+' · '+esc(r.move.accuracy==='ALWAYS'?'Always hits':(r.move.accuracy??100)+'% accuracy')+' · '+esc(r.move.pp)+' PP</small></div><p>'+esc(r.move.effect_text||'No additional effect.')+'</p></article>').join('')||'<p>No level-up moves currently recorded.</p>')+
   '<p>Special codex and inherited move compatibility may provide additional techniques.</p></details>':'';
  const abilities=species.ability_names&&typeof species.ability_names==='object'?Object.entries(species.ability_names).filter(([,v])=>v).map(([k,v])=>'<span>'+esc(k)+': '+esc(v)+'</span>').join(' · '):'';
  const html='<div class="field-journal-detail"><div class="field-journal-hero">'+
   '<div class="field-journal-large-art '+(caught?'':'field-journal-silhouette')+'">'+art(species,!caught)+'</div>'+
   '<div><span class="eyebrow">FIELD JOURNAL · NO. '+esc(species.id)+'</span><h3>'+(seen?esc(species.name):'Unknown Abyssal')+'</h3>'+badge(status)+
   '<p>'+(seen?species.types.map(t=>'<span class="field-journal-type" style="--journal-type:'+esc(TYPE_COLORS[t]||'#728598')+'">'+esc(t)+'</span>').join(' '):'Typing revealed on sight')+'</p></div></div>'+
   '<section class="field-journal-section"><h3>Where to encounter</h3>'+placeText+(caught&&noted?'<p><b>First sighting:</b> '+esc(roomName(noted))+'</p>':'')+'</section>'+
   (caught?'<section class="field-journal-section"><h3>Ownership record</h3><p>'+living.length+' living in party or reserves · '+losses+' recorded at the memorial.</p>'+(abilities?'<p><b>Possible abilities:</b> '+abilities+'</p>':'')+'</section>':'')+
   growthHtml+evolutionHtml+movesHtml+
   '<div class="field-journal-footer"><button id="field-journal-back" class="primary">Back to entries</button></div></div>';
  openModal(journalTitle(),html);
  document.querySelector('.modal')?.classList.add('field-journal-modal');
  normalizeSummaryArt();
  document.querySelector('#field-journal-back').onclick=()=>renderList();
  menuBack(gameMenu,'Back to Start menu');
 }
 return {open:()=>renderList({search:'',status:'all',type:'all',page:0}),list:renderList,entry:renderEntry};
}
