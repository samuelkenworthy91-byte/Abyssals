import {BASE_PRODIGY_CHANCE,inheritanceChance,chanceLabel} from './breeding-items.js?v=0.90.35';
import {DATA} from './data.js?v=0.90.40';
import {STAT_KEYS,STAT_LABELS,growthPercent,unitGrowthRates,permanentGrowthSources,inheritedGrowthRate,inheritedGrowthBonus,prodigyMultiplier,prodigyGrowthBonus} from './progression.js?v=0.90.40';
import {typeEffectiveness} from './type-rules.js?v=0.87.0';
import {rootForm} from './route-roster.js?v=0.87.0';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nativeMoves=species=>new Set(DATA.learnsets.filter(l=>l.species_id===species.id).map(l=>l.move_id));
const ordinary=m=>m&&['PHYSICAL','SPECIAL','STATUS'].includes(m.category)&&Number.isFinite(m.pp)&&m.pp>0&&!m.signature&&!m.signature_owner_family;
// Six genes with one carrier each retain the original 1/750 combined chance.
export const PRODIGY_INHERITANCE_CHANCE=BASE_PRODIGY_CHANCE;
export function familyProdigyChance(row,effects={}){return 1-Math.pow(1-inheritanceChance(row.stat,effects),row.parentBonuses?.length||1);}
export function rollFamilyProdigies(rows,random=Math.random,effects={}){
 const inherited=[];
 for(const row of rows){
  let bonus=0;
  // Always make every carrier's roll, including when an earlier roll succeeds.
  for(const candidate of row.parentBonuses||[row.rate-row.baseline])if(random()<inheritanceChance(row.stat,effects))bonus=Math.max(bonus,candidate);
  if(bonus>0)inherited.push({stat:row.stat,baseline:row.baseline,rate:Math.round((row.baseline+bonus)*10)/10});
 }
 return inherited;
}
export function familyProdigyOptions(species,donor,parent){
 if(!parent||rootForm(parent.species.id)!==species.id||rootForm(donor.species.id)!==species.id)return [];
 return STAT_KEYS.map(stat=>{const baseline=growthPercent(species,stat),parentBonuses=[inheritedGrowthBonus(parent,stat),inheritedGrowthBonus(donor,stat)].filter(bonus=>bonus>0),bonus=Math.max(0,...parentBonuses);return {stat,baseline,rate:Math.round((baseline+bonus)*10)/10,parentBonuses};}).filter(g=>g.rate>g.baseline);
}
// Temporary draughts cannot become permanent through breeding. Rescue and
// previously inherited permanent rates remain legitimate donor strengths.
export function inheritanceOptions(species,donor){
 const rates=unitGrowthRates({...donor,trainingEffects:[],rescueGrowthBonus:donor.growthMultiplier===1.1?Object.fromEntries(STAT_KEYS.map(stat=>[stat,permanentGrowthSources(donor,stat).rescue])):undefined,stewardship:undefined,marasenGrowth:undefined,breedingInheritance:undefined,evolutionHistory:[]});
 // An existing Prodigy donates its original advantage, never its evolution
 // multiplier. Ordinary donors still offer their permanent species/gift rates.
 const growth=STAT_KEYS.map(stat=>{const baseline=growthPercent(species,stat),bonus=inheritedGrowthBonus(donor,stat);return {stat,baseline,donorRate:bonus>0?Math.round((baseline+bonus)*10)/10:rates[stat],prodigy:bonus>0};}).filter(g=>g.donorRate>g.baseline).sort((a,b)=>(b.donorRate-b.baseline)-(a.donorRate-a.baseline));
 const natural=nativeMoves(species),naturalAttacks=DATA.moves.filter(m=>natural.has(m.id)&&m.power>0),weaknesses=[...new Set(DATA.species.flatMap(s=>s.types))].filter(t=>typeEffectiveness(t,species.types)>1);
 const moves=[...new Set((donor.moves||[]).map(m=>m.id))].map(id=>DATA.moves.find(m=>m.id===id)).filter(m=>ordinary(m)&&!natural.has(m.id)).map(move=>{const coverage=move.power>0&&!species.types.includes(move.type_id),answers=move.power>0?weaknesses.filter(t=>typeEffectiveness(move.type_id,[t])>1&&!naturalAttacks.some(m=>typeEffectiveness(m.type_id,[t])>1)):[];return {move,coverage,answers};}).sort((a,b)=>b.answers.length-a.answers.length||Number(b.coverage)-Number(a.coverage)||(b.move.power||0)-(a.move.power||0)||a.move.id-b.move.id);
 return {growth,moves};
}
export function availableProdigyStats(species,donor,parent,plan={}){
 const pool=familyProdigyOptions(species,donor,parent);if(pool.length||parent&&rootForm(donor.species.id)===species.id&&rootForm(parent.species.id)===species.id)return pool.map(g=>g.stat);
 const options=inheritanceOptions(species,donor),selected=plan.stat===undefined?options.growth[0]?.stat:plan.stat;
 return STAT_KEYS.filter(stat=>inheritedGrowthBonus(parent||{},stat)>0||selected===stat&&inheritedGrowthBonus(donor,stat)>0);
}
export function rollInheritance(species,donor,donorIndex,plan={},random=Math.random,parent=null,effects={}){
 const options=inheritanceOptions(species,donor),stat=plan.stat===undefined?options.growth[0]?.stat:plan.stat,moveId=plan.moveId===undefined?options.moves[0]?.move.id:plan.moveId;
 const g=stat?options.growth.find(g=>g.stat===stat):null,m=moveId?options.moves.find(m=>m.move.id===moveId):null;
 if(stat&&!g||moveId&&!m)return null;
 // Roll once at egg creation. A missed Prodigy transfer leaves normal species
 // growth; it never silently substitutes another stat or rerolls at hatching.
 const family=familyProdigyOptions(species,donor,parent),pooled=new Set(family.map(row=>row.stat));
 const inherited=g&&!pooled.has(g.stat)&&(!g.prodigy||random()<inheritanceChance(g.stat,effects));
 const growth=inherited?{...g,rate:g.prodigy?g.donorRate:Math.round((g.donorRate+Math.floor(Math.max(0,Math.min(.999999999,random()))*11))*10)/10}:null;
 // Same-family parents each roll their original bonus independently per stat.
 // Keep the strongest successful transfer once; never inherit evolution copies.
 const lineageGrowth=[];
 if(parent&&rootForm(parent.species.id)===species.id&&rootForm(donor.species.id)===species.id){
  lineageGrowth.push(...rollFamilyProdigies(family,random,effects));
 }else if(parent&&rootForm(parent.species.id)===species.id){
  // Cross-family pairings retain the family parent's existing carryover path.
  for(const stat of STAT_KEYS){
   const baseline=growthPercent(species,stat),bonus=inheritedGrowthBonus(parent,stat);
   if(bonus>0&&random()<inheritanceChance(stat,effects))lineageGrowth.push({stat,baseline,rate:Math.round((baseline+bonus)*10)/10});
  }
 }
 return {version:2,speciesId:species.id,donorIndex,growth,lineageGrowth,moveId:m?.move.id??null};
}
export function validateInheritance(record,species,selectedParent){
 if(record===undefined)return true; // Eggs committed before inheritance keep their original result.
 const g=record?.growth,m=DATA.moves.find(m=>m.id===record?.moveId);
 if(!record||![1,2].includes(record.version)||record.speciesId!==species.id||![0,1].includes(record.donorIndex)||(selectedParent!==undefined&&record.donorIndex!==1-selectedParent)||g!==null&&(!g||!STAT_KEYS.includes(g.stat)||![g.baseline,g.donorRate,g.rate].every(Number.isFinite)||g.baseline<10||g.donorRate<=g.baseline||g.rate<g.donorRate||g.rate>g.donorRate+10||Math.abs((g.rate-g.donorRate)-Math.round(g.rate-g.donorRate))>1e-6)||record.moveId!==null&&(!Number.isInteger(record.moveId)||!ordinary(m)||nativeMoves(species).has(record.moveId)&&!record.teamcraftAliasMigration))throw Error('An inherited growth or move record is invalid.');
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
 return `${rows.length?`<p class="prodigy-badge"><b>★ Prodigy · ${rows.map(g=>STAT_LABELS[g.stat]).join(' / ')}</b><br>${rows.map(g=>`${STAT_LABELS[g.stat]}: original bonus +${inheritedGrowthBonus(unit,g.stat)} × ${prodigyMultiplier(unit)} = +${prodigyGrowthBonus(unit,g.stat)} growth points`).join('<br>')}<br>Each completed evolution adds another copy of the original bonus.</p>`:''}${m?`<p><b>Inherited move: ${esc(m.name)}</b> · ${esc(m.type_id)} · ${esc(m.category)}<br>Outside its birth species’ normal move pool. Available through free relearning.</p>`:''}`;
}

export function breedingPlanHTML(species,donor,index,parent=null,effects={},speciesChance=50,plan={}){
 const options=inheritanceOptions(species,donor),family=familyProdigyOptions(species,donor,parent),pooled=new Set(family.map(g=>g.stat)),growth=options.growth.filter(g=>!pooled.has(g.stat));
 const sameFamily=parent&&rootForm(parent.species.id)===species.id&&rootForm(donor.species.id)===species.id;
 const lineage=parent&&!sameFamily?STAT_KEYS.map(stat=>({stat,rate:growthPercent(species,stat)+inheritedGrowthBonus(parent,stat)})).filter(g=>g.rate>growthPercent(species,g.stat)):[];
 const available=sameFamily?family:availableProdigyStats(species,donor,parent,plan).map(stat=>({stat}));
 const distinct=[...new Set(available.map(g=>g.stat))],chanceFor=stat=>sameFamily?familyProdigyChance(family.find(row=>row.stat===stat),effects):inheritanceChance(stat,effects),allChance=distinct.reduce((n,stat)=>n*chanceFor(stat),1);
 const odds=distinct.length?`<p>Available Prodigy odds: ${distinct.map(stat=>STAT_LABELS[stat]+' '+(chanceFor(stat)*100).toFixed(3)+'%').join('; ')}. ${sameFamily?`All ${distinct.length} together: about 1 in ${(1/allChance).toFixed(distinct.length===6?0:1)} eggs.`:'Cross-family inheritance still uses the chosen donor stat and the family parent’s carryover.'}</p>`:'';
 return `<fieldset class="breeding-plan"><legend>${speciesChance}% ${esc(species.name)} · donor ${esc(donor.species.name)}</legend><p>${sameFamily?(family.length?`Available Prodigy inheritance from both parents (maximum original rates): ${family.map(g=>`${STAT_LABELS[g.stat]} ${g.rate}%`).join('; ')}. Each parent independently rolls 33.176% per Prodigy they carry before item boosts. A shared stat has a 55.345% chance without items. Keep the stronger successful original bonus once; a weaker parent can still pass theirs if the stronger misses. All six with one carrier each and no items: 1 in 750 eggs.`:'Neither parent has an existing Prodigy bonus to pass down.'):(lineage.length?`Family Prodigy growth: ${lineage.map(g=>`${STAT_LABELS[g.stat]} ${g.rate}%`).join('; ')}. Each has a separate 33.176% chance before item boosts, alongside your donor choice.`:'No existing family Prodigy growth to carry over.')}</p>${odds}<label for="breed-stat-${index}">One additional donor growth</label><select id="breed-stat-${index}">${growth.map(g=>`<option value="${g.stat}">${STAT_LABELS[g.stat]}: ${g.donorRate}${g.prodigy?'':'–'+Math.round((g.donorRate+10)*10)/10}% (normal ${g.baseline}%)${g.prodigy?' · '+chanceLabel(g.stat,effects)+' inheritance chance; otherwise normal growth':''}</option>`).join('')}<option value="">${growth.length?'No additional donor growth':'No additional donor growth available'}</option></select><label for="breed-move-${index}">One move outside its normal pool</label><select id="breed-move-${index}">${options.moves.map(({move:m,coverage,answers})=>`<option value="${m.id}">${esc(m.name)} · ${esc(m.type_id)} · ${esc(m.category)}${answers.length?' · covers weakness: '+answers.join(', '):coverage?' · new type coverage':''}</option>`).join('')}<option value="">${options.moves.length?'No inherited move':'No eligible donor move outside this species’ pool'}</option></select></fieldset>`;
}
