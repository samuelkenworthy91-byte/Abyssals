import {ARMOURY_BRANCHES,ARMOURY_MOVES} from './relic-armoury.js?v=0.90.26';
import {TACTICAL_MOVES,TACTICAL_BRANCH_LEARNSETS} from './tactical-moves.js?v=0.90.28';
import {RELIC_ART} from './relic-art.js?v=0.90.48';
// Six original branches plus twelve approved armoury branches. Existing IDs and rules remain stable.
export const RIVET_ID='365';
const keys=['hp','attack','defence','sp_attack','sp_defence','speed'];
const spread=a=>Object.fromEntries(keys.map((k,i)=>[k,a[i]]));
export const RELIC_BRANCHES=[
 {key:'vigil',mid:'Vigilisk',final:'Vesperedge',ids:['366','367'],types:['GHOST','STEEL'],item:'Vigil Core',level:34,role:'Fast spectral sword attacker',midGrowth:[35,75,30,10,40,70],growth:[45,100,40,10,45,90],midStats:[65,85,55,30,65,90],stats:[80,115,70,40,80,115],moves:[[0,261],[1,315],[4,12],[8,263],[12,369],[16,264],[20,249],[24,325],[28,253],[34,456],[42,259],[50,254],[60,326]]},
 {key:'furnace',mid:'Kilnguard',final:'Cinderbastion',ids:['368','369'],types:['FIRE','STEEL'],item:'Furnace Core',level:38,role:'Heavy furnace physical tank',midGrowth:[70,75,65,10,30,10],growth:[90,95,85,10,40,10],midStats:[90,90,100,30,55,20],stats:[115,115,130,40,75,25],moves:[[0,23],[1,314],[4,12],[8,22],[12,321],[16,21],[20,126],[24,318],[28,26],[38,457],[44,324],[52,377],[60,29]]},
 {key:'storm',mid:'Voltknuckle',final:'Ragevolt',ids:['370','371'],types:['STEEL','ELECTRIC'],item:'Storm Core',level:32,role:'Armoured storm physical brawler',midGrowth:[50,75,45,10,30,50],growth:[65,100,55,10,35,65],midStats:[75,95,75,30,50,75],stats:[95,125,95,40,65,100],moves:[[0,70],[1,313],[4,117],[8,67],[12,369],[16,64],[20,60],[24,319],[28,127],[32,458],[40,65],[48,329],[58,75]]},
 {key:'rime',mid:'Frostsquire',final:'Rimewarden',ids:['372','373'],types:['ICE','STEEL'],item:'Rime Core',level:36,role:'Lance-and-shield defensive sentinel',midGrowth:[55,50,70,10,60,15],growth:[70,65,90,10,75,20],midStats:[85,65,105,30,90,30],stats:[105,90,130,40,115,40],moves:[[0,102],[1,316],[4,124],[8,105],[12,111],[16,104],[20,320],[24,108],[28,319],[36,459],[44,377],[52,110],[60,326]]},
 {key:'dusk',mid:'Gloamguard',final:'Dreadcleaver',ids:['374','375'],types:['DARK','STEEL'],item:'Dusk Core',level:40,role:'Heavy executioner physical breaker',midGrowth:[50,90,55,10,35,20],growth:[65,120,70,10,45,20],midStats:[75,115,85,25,60,35],stats:[95,150,110,35,80,45],moves:[[0,293],[1,315],[4,289],[8,294],[12,313],[16,292],[20,305],[24,318],[28,306],[40,460],[46,325],[54,124],[62,326]]},
 {key:'chitin',mid:'Carapex',final:'Elytrarch',ids:['385','386'],types:['BUG','STEEL'],item:'Chitin Core',level:36,role:'Fast praying-mantis armour striker',midGrowth:[45,80,35,10,30,65],growth:[50,110,40,10,30,90],midStats:[65,85,55,30,50,80],stats:[85,120,70,40,65,115],moves:[[1,216],[8,221],[12,316],[18,217],[24,218],[30,311],[36,469],[42,220],[48,319]]}
];
for(const [i,b] of RELIC_BRANCHES.entries())b.signatureId=b.key==='chitin'?469:456+i;
RELIC_BRANCHES.push(...ARMOURY_BRANCHES);
export const WARBOND_ABILITY={id:'ABILITY_WARBOND',name:'Warbond',class:'Expedition',text:'When this Abyssal participates in a battle, every eligible participant gains double EXP, including binocular participants. Multiple bearers do not stack.'};
const provenance={authoring:'User-approved Rivet branching relic family, 2026-10-13'};
function species(id,name,types,stage,stats,growth,role,branch=null){return {id,dex_number:+id,name,types,stage,base_stats:spread(stats),bst:stats.reduce((a,b)=>a+b,0),growth_percent:spread(growth),authored_growth_percent:spread(growth),growth_archetype:role,growth_balance_version:1,role,power_class:stage==='Base'?'Base / Early':'Standard',family_id:'FAMILY-365',ability_names:{primary:'Warbond',secondary:'Warbond',hidden:'Warbond'},abilities:{primary:'ABILITY_WARBOND',secondary:'ABILITY_WARBOND',hidden:'ABILITY_WARBOND'},capture_rate:stage==='Base'?140:stage==='Middle'?90:60,companion_motion:'walk',approvedRelic:true,relicBranch:branch,height_m:stage==='Base'?.4:stage==='Middle'?1.2:2.1,mass_kg:stage==='Base'?9:stage==='Middle'?70:170,catalogue_entry:stage==='Base'?'A little soul animates scraps of lost armour. It remembers everything its companions learn; eighteen relic cores can shape the guardian it becomes.':`Its ${branch} core has shaped a ${role.toLowerCase()}. Lessons learned beside it pass through the bond to every companion.`,provenance,unresolved_fields:[],moveset_identity:{version:1,style:role,plan:'Use branch-specific physical attacks, defensive tools and Warbond to develop the expedition.',kind:'physical',category:'PHYSICAL'}};}
export const RELIC_SPECIES=[species(RIVET_ID,'Rivet',['STEEL'],'Base',[50,45,55,25,45,40],[40,40,40,20,40,30],'Balanced relic-armour trainee')];
for(const b of RELIC_BRANCHES){
 const forms=[species(b.ids[0],b.mid,b.types,'Middle',b.midStats,b.midGrowth,b.role,b.key),species(b.ids[1],b.final,b.types,'Final',b.stats,b.growth,b.role,b.key)];
 if(b.approvedArmoury)for(const form of forms){form.approvedArmoury=true;form.catalogue_entry=b.entries[form.stage==='Middle'?0:1];form.moveset_identity={version:1,style:b.role,plan:b.category==='SPECIAL'?'Use ranged special attacks and defensive support; Warbond shares expedition experience.':'Use physical branch attacks, Steel coverage and defensive support; Warbond shares expedition experience.',kind:b.category.toLowerCase(),category:b.category};}
 RELIC_SPECIES.push(...forms);
}
export const RELIC_ITEMS=RELIC_BRANCHES.map(b=>({id:'ITEM_RELIC_'+b.key.toUpperCase(),name:b.item,category:'evolution',buy_price:10000,currency:'STANDARD',stack_limit:99,effect_text:`Rivet → ${b.mid} (${b.types.join(' / ')}) at Lv. 12 or above.`,effect:{operation:'evolve',from_species_id:RIVET_ID,to_species_id:b.ids[0],minimum_level:12,consumed:true},guaranteed_source:'Briarbell Wood bell-restoration quest — choose one of eighteen',renewable_source:'Thomas de Ferrers — 10,000 doubloons after claiming the free bell-restoration core',provenance}));
const sig=(id,name,type,power,accuracy,pp,effects,action)=>({id,name,type_id:type,category:'PHYSICAL',power,accuracy,pp,priority:0,target:'SINGLE_FOE',effects,effect_text:effects.length?(id===457?'20% chance to burn.':'10% chance to paralyse.'):'No additional effect.',approvedRelic:true,signature_owner_family:'FAMILY-365',signature_owner_name:name,authored_visual_action:action,provenance});
export const RELIC_MOVES=[
 sig(456,'Vigil Sever','GHOST',85,100,10,[],'Two teal cathedral-shaped blades cross, then a delayed spectral slash flashes.'),
 sig(457,'Furnace Knuckle','FIRE',90,95,10,[{effect_id:'inflict_status',status:'BURN',chance_percent:20}],'A furnace ignites; a piston fist strikes with an orange shock ring and embers.'),
 sig(458,'Thunderclap Maul','ELECTRIC',85,100,10,[{effect_id:'inflict_status',status:'PARALYSIS',chance_percent:10}],'Armour separates around the forearms; both fists meet in a cyan lightning impact.'),
 sig(459,'Glacier Impale','ICE',85,100,10,[],'An ice shield braces; a blue lance thrust sends six crystals behind the target.'),
 sig(469,'Prayer Reap','BUG',85,100,10,[],'Two emerald mantis scythes close around a magenta crescent, then a silver cutting arc flashes.'),
 sig(460,'Dusk Guillotine','DARK',100,90,5,[],'A crimson mantle spreads; a hooked blade carves a huge downward crescent.')
];
RELIC_MOVES.push(...ARMOURY_MOVES);
export const RELIC_EVOLUTIONS=RELIC_BRANCHES.flatMap((b,i)=>{
 const delta=(from,to)=>Object.fromEntries(keys.map(k=>[k,to.base_stats[k]-from.base_stats[k]]));
 const base=RELIC_SPECIES[0],mid=RELIC_SPECIES[1+i*2],final=RELIC_SPECIES[2+i*2];
 return [{id:'EVOLUTION-RELIC-'+b.key,from_species_id:RIVET_ID,to_species_id:b.ids[0],condition:{method:'ITEM',minimum_level:12,item_id:RELIC_ITEMS[i].id,consumed:true},promotion_delta:delta(base,mid),approvedExpansion:true,approvedRelic:true,provenance},{id:'EVOLUTION-RELIC-'+b.key+'-FINAL',from_species_id:b.ids[0],to_species_id:b.ids[1],condition:{method:'LEVEL',minimum_level:b.level},promotion_delta:delta(mid,final),approvedExpansion:true,approvedRelic:true,provenance}];
});
export const RELIC_GROWTH_PROFILES=RELIC_SPECIES.map(s=>({id:s.id,name:s.name,archetype:s.role,priorities:keys.toSorted((a,b)=>s.growth_percent[b]-s.growth_percent[a]).slice(0,3),reason:'User-approved branch identity assigns growth to its distinct combat role and leaves clear weaknesses; Warbond is its shared expedition benefit.',authored:{...s.growth_percent},rates:{...s.growth_percent},total:Object.values(s.growth_percent).reduce((a,b)=>a+b,0),bonusPoints:0,bonusFraction:0,qualification:'Authored relic branch; no additional rarity bonus'}));
export function installRelicFamily(data){if(data.species.some(s=>s.id===RIVET_ID))return;data.species.push(...RELIC_SPECIES);data.moves.push(...RELIC_MOVES,...TACTICAL_MOVES);
 const add=(id,rows)=>{for(const [level,move_id]of rows){const m=data.moves.find(m=>m.id===move_id);if(!m)throw Error('Missing relic move '+move_id);const row={species_id:id,move_id,name:m.name,level,method:'LEVEL_UP',expansion:true,identity:true,identity_core:true,approvedRelic:true,provenance};data.learnsets.push(row);data.authoredLearnsets?.push(structuredClone(row));}};
 add(RIVET_ID,[[1,315],[1,12],[5,8],[8,313],[12,320],[16,126],[20,369],[26,318],[34,124],[44,319]]);
 for(const [i,b]of RELIC_BRANCHES.entries()){const rows=[...b.moves,...(TACTICAL_BRANCH_LEARNSETS[b.key]||[]),[14,b.coverageMove??[129,128,130,133,126,133][i]]].sort((a,b)=>a[0]-b[0]);add(b.ids[0],rows);add(b.ids[1],[[0,b.signatureId],...(b.approvedArmoury?rows.map(([level,id])=>[level===0?1:level,id]).filter(([,id])=>id!==b.signatureId):rows.filter(([level,id])=>level!==0&&id!==b.signatureId))]);}
 for(const s of RELIC_SPECIES)data.assets.push({id:s.id,source:'dist/assets/'+(RELIC_ART[s.id].folder||'relic-family')+'/'+RELIC_ART[s.id].file,runtime:'assets/'+(RELIC_ART[s.id].folder||'relic-family')+'/'+RELIC_ART[s.id].file,atlas_rect:RELIC_ART[s.id].rect});
}
// Rewards use a battle-long participant union; dead bearers can still have taught allies.
const bearer=u=>u?.species?.ability_names?.[u.abilitySlot||'primary']==='Warbond';
export function markWarbond(b,units=[],shareAll=false){const ids=new Set(b.participants||[]);b.warbond=!!b.warbond||units.some(u=>bearer(u)&&(ids.has(u.uid)||shareAll&&u.hp>0&&!u.dead));return b.warbond;}
export function participantExpMultiplier(defeats,party,{shareAll=false,warbond=null}={}){if(warbond!==null)return warbond?2:1;const ids=new Set(defeats.flatMap(d=>d.participants||[]));return party.some(u=>bearer(u)&&(ids.has(u.uid)||shareAll&&u.hp>0&&!u.dead))?2:1;}

export function relicEncounterRoute(route){if(route.relicExpanded||!['emberQuarry','relicCrags','waranCave1'].includes(route.room))return route;return {...route,relicExpanded:true,tables:route.tables.map(t=>{const slots=t.slots.map(s=>({...s})),largest=route.room==='waranCave1'?slots[2]:slots.reduce((a,b)=>a.weight>b.weight?a:b);largest.weight-=5;const bounds=slots[0];slots.push({species_id:RIVET_ID,min_level:bounds.min_level,max_level:bounds.max_level,weight:5,rarity:'Rare',authoredSlot:true,approvedRelic:true});return {...t,slots};})};}

