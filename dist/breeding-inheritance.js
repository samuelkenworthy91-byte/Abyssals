import {DATA} from './data.js?v=0.87.0';
import {STAT_KEYS,STAT_LABELS,growthPercent,unitGrowthRates,inheritedGrowthRate} from './progression.js?v=0.87.0';
import {typeEffectiveness} from './type-rules.js?v=0.87.0';
import {rootForm} from './route-roster.js?v=0.87.0';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nativeMoves=species=>new Set(DATA.learnsets.filter(l=>l.species_id===species.id).map(l=>l.move_id));
const ordinary=m=>m&&['PHYSICAL','SPECIAL','STATUS'].includes(m.category)&&Number.isFinite(m.pp)&&m.pp>0&&!m.signature&&!m.signature_owner_family;
export const PRODIGY_INHERITANCE_CHANCE=.33;
// Temporary draughts cannot become permanent through breeding. Rescue and
// previously inherited permanent rates remain legitimate donor strengths.
export function inheritanceOptions(species,donor){
 const rates=unitGrowthRates({...donor,trainingEffects:[],stewardship:undefined}),naturalRates=unitGrowthRates({...donor,trainingEffects:[],stewardship:undefined,breedingInheritance:undefined}),growth=STAT_KEYS.map(stat=>({stat,baseline:growthPercent(species,stat),donorRate:rates[stat],prodigy:rates[stat]>naturalRates[stat]})).filter(g=>g.donorRate>g.baseline).sort((a,b)=>(b.donorRate-b.baseline)-(a.donorRate-a.baseline));
 const natural=nativeMoves(species),naturalAttacks=DATA.moves.filter(m=>natural.has(m.id)&&m.power>0),weaknesses=[...new Set(DATA.species.flatMap(s=>s.types))].filter(t=>typeEffectiveness(t,species.types)>1);
 const moves=[...new Set((donor.moves||[]).map(m=>m.id))].map(id=>DATA.moves.find(m=>m.id===id)).filter(m=>ordinary(m)&&!natural.has(m.id)).map(move=>{const coverage=move.power>0&&!species.types.includes(move.type_id),answers=move.power>0?weaknesses.filter(t=>typeEffectiveness(move.type_id,[t])>1&&!naturalAttacks.some(m=>typeEffectiveness(m.type_id,[t])>1)):[];return {move,coverage,answers};}).sort((a,b)=>b.answers.length-a.answers.length||Number(b.coverage)-Number(a.coverage)||(b.move.power||0)-(a.move.power||0)||a.move.id-b.move.id);
 return {growth,moves};
}
export function rollInheritance(species,donor,donorIndex,plan={},random=Math.random,parent=null){
 const options=inheritanceOptions(species,donor),stat=plan.stat===undefined?options.growth[0]?.stat:plan.stat,moveId=plan.moveId===undefined?options.moves[0]?.move.id:plan.moveId;
 const g=stat?options.growth.find(g=>g.stat===stat):null,m=moveId?options.moves.find(m=>m.move.id===moveId):null;
 if(stat&&!g||moveId&&!m)return null;
 // Roll once at egg creation. A missed Prodigy transfer leaves normal species
 // growth; it never silently substitutes another stat or rerolls at hatching.
 const inherited=g&&(!g.prodigy||random()<PRODIGY_INHERITANCE_CHANCE);
 const growth=inherited?{...g,rate:Math.round((g.donorRate+Math.floor(Math.max(0,Math.min(.999999999,random()))*11))*10)/10}:null;
 // Only the parent supplying the offspring family can pass its existing
 // Prodigy rates automatically. Roll each stat once, independent of the donor.
 // Preserve the recorded rate exactly: carryover never adds another bonus.
 const lineageGrowth=[];
 if(parent&&rootForm(parent.species.id)===species.id){
  for(const stat of STAT_KEYS){
   const rate=inheritedGrowthRate(parent,stat),baseline=growthPercent(species,stat);
   if(rate>baseline&&random()<PRODIGY_INHERITANCE_CHANCE)lineageGrowth.push({stat,baseline,rate});
  }
 }
 return {version:2,speciesId:species.id,donorIndex,growth,lineageGrowth,moveId:m?.move.id??null};
}
export function validateInheritance(record,species,selectedParent){
 if(record===undefined)return true; // Eggs committed before inheritance keep their original result.
 const g=record?.growth,m=DATA.moves.find(m=>m.id===record?.moveId);
 if(!record||![1,2].includes(record.version)||record.speciesId!==species.id||![0,1].includes(record.donorIndex)||(selectedParent!==undefined&&record.donorIndex!==1-selectedParent)||g!==null&&(!g||!STAT_KEYS.includes(g.stat)||![g.baseline,g.donorRate,g.rate].every(Number.isFinite)||g.baseline<10||g.donorRate<=g.baseline||g.rate<g.donorRate||g.rate>g.donorRate+10||Math.abs((g.rate-g.donorRate)-Math.round(g.rate-g.donorRate))>1e-6)||record.moveId!==null&&(!Number.isInteger(record.moveId)||!ordinary(m)||nativeMoves(species).has(record.moveId)))throw Error('An inherited growth or move record is invalid.');
 const lineage=record.lineageGrowth;
 if(record.version===1&&lineage!==undefined||record.version===2&&(!Array.isArray(lineage)||lineage.length>STAT_KEYS.length))throw Error('An inherited family growth record is invalid.');
 const seen=new Set();
 for(const row of lineage||[]){
  if(!row||!STAT_KEYS.includes(row.stat)||seen.has(row.stat)||![row.baseline,row.rate].every(Number.isFinite)||row.baseline!==growthPercent(species,row.stat)||row.rate<=row.baseline||Math.abs(row.rate*10-Math.round(row.rate*10))>1e-6)throw Error('An inherited family growth record is invalid.');
  seen.add(row.stat);
 }
 return true;
}
export function inheritanceSummaryHTML(unit){
 const i=unit.breedingInheritance;if(!i)return '';
 const m=DATA.moves.find(m=>m.id===i.moveId),rows=STAT_KEYS.map(stat=>({stat,rate:inheritedGrowthRate(unit,stat)})).filter(g=>g.rate>0);
 return `${rows.length?`<p class="prodigy-badge"><b>★ Prodigy · ${rows.map(g=>STAT_LABELS[g.stat]).join(' / ')}</b><br>${rows.map(g=>`${STAT_LABELS[g.stat]}: inherited growth ${g.rate}%`).join('<br>')}</p>`:''}${m?`<p><b>Inherited move: ${esc(m.name)}</b> · ${esc(m.type_id)} · ${esc(m.category)}<br>Outside its birth species’ normal move pool. Available through free relearning.</p>`:''}`;
}

export function breedingPlanHTML(species,donor,index,parent=null){const options=inheritanceOptions(species,donor),lineage=parent&&rootForm(parent.species.id)===species.id?STAT_KEYS.map(stat=>({stat,rate:inheritedGrowthRate(parent,stat)})).filter(g=>g.rate>growthPercent(species,g.stat)):[];return `<fieldset class="breeding-plan"><legend>50% ${esc(species.name)} · donor ${esc(donor.species.name)}</legend><p>${lineage.length?`Family Prodigy growth: ${lineage.map(g=>`${STAT_LABELS[g.stat]} ${g.rate}%`).join('; ')}. Each has a separate 33% chance to carry over, alongside your donor choice.`:'No existing family Prodigy growth to carry over.'}</p><label for="breed-stat-${index}">One chosen donor growth</label><select id="breed-stat-${index}">${options.growth.map(g=>`<option value="${g.stat}">${STAT_LABELS[g.stat]}: ${g.donorRate}–${Math.round((g.donorRate+10)*10)/10}% (normal ${g.baseline}%)${g.prodigy?' · 33% inheritance chance; otherwise normal growth':''}</option>`).join('')}<option value="">${options.growth.length?'No inherited growth':'No donor growth beats this species’ normal rates'}</option></select><label for="breed-move-${index}">One move outside its normal pool</label><select id="breed-move-${index}">${options.moves.map(({move:m,coverage,answers})=>`<option value="${m.id}">${esc(m.name)} · ${esc(m.type_id)} · ${esc(m.category)}${answers.length?' · covers weakness: '+answers.join(', '):coverage?' · new type coverage':''}</option>`).join('')}<option value="">${options.moves.length?'No inherited move':'No eligible donor move outside this species’ pool'}</option></select></fieldset>`;}
