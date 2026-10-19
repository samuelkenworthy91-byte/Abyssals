// Play-test authoring approved 2026-10-07; additions preserve supplied source metadata.
export const MOVE_EXPANSION_VERSION=1;
const rushes=[['FIRE','Ember Snap','SPECIAL'],['WATER','Jet Skim','SPECIAL'],['ELECTRIC','Flash Circuit','SPECIAL'],['GRASS','Briar Flick','PHYSICAL'],['FIGHTING','First Knuckle','PHYSICAL'],['POISON','Needle Ambush','PHYSICAL'],['GROUND','Burrow Blitz','PHYSICAL'],['FLYING','Slipstream Cut','PHYSICAL'],['PSYCHIC','Thought Spark','SPECIAL'],['BUG','Skitter Strike','PHYSICAL'],['ROCK','Pebble Skip','PHYSICAL'],['GHOST','Spectral Touch','SPECIAL'],['DRAGON','Drake Spark','SPECIAL'],['DARK','Shadow Intercept','PHYSICAL'],['STEEL','Quicksteel','PHYSICAL'],['FAIRY','Wish Flash','SPECIAL']];
export const NEW_MOVES=rushes.map(([type_id,name,category],i)=>({id:355+i,name,type_id,category,power:40,accuracy:100,pp:20,priority:1,target:'SINGLE_FOE',effects:[],effect_text:'Priority +1: acts before normal-priority moves. Speed breaks ties within the same priority.',authored_visual_action:category==='PHYSICAL'?'A fast converging slash with afterimages.':'A charged elemental spark races from caster to target.',provenance:{authoring:'Slice move expansion, 2026-10-07'}}));
for(const [name,type_id,effect,effect_text] of [
 ['Raincall','WATER',{effect_id:'weather',weather:'RAIN',turns:5},'Rain for 5 turns: Water damage ×1.5; Fire damage ×0.5. Activates rain abilities.'],
 ['Solar Vigil','FIRE',{effect_id:'weather',weather:'SUN',turns:5},'Sun for 5 turns: Fire damage ×1.5; Water damage ×0.5. Activates sun abilities.'],
 ['Sandwake','GROUND',{effect_id:'weather',weather:'SAND',turns:5},'Sand for 5 turns: non-Rock/Ground/Steel partners lose 1/16 max HP each turn unless protected.'],
 ['Hail Choir','ICE',{effect_id:'weather',weather:'HAIL',turns:5},'Hail for 5 turns: non-Ice partners lose 1/16 max HP each turn. Activates snow abilities.'],
 ['Meadow Weave','GRASS',{effect_id:'terrain',terrain:'GRASSY',turns:5},'Grassy terrain for 5 turns: Grass damage ×1.2; supports Earthroot and World Anchor healing. World Anchor blocks terrain changes.'],
 ['Mirror Rampart','PSYCHIC',{effect_id:'screen',category:'SPECIAL',turns:5},'Halves incoming special damage to this side for 5 turns; Screenmender adds 2 turns.'],
 ['Iron Curtain','STEEL',{effect_id:'screen',category:'PHYSICAL',turns:5},'Halves incoming physical damage to this side for 5 turns; Screenmender adds 2 turns.']
])NEW_MOVES.push({id:355+NEW_MOVES.length,name,type_id,category:'STATUS',power:null,accuracy:'ALWAYS',pp:10,priority:0,target:'SELF',effects:[effect],effect_text,authored_visual_action:'A layered elemental field settles across the battlefield.',provenance:{authoring:'Slice move expansion, 2026-10-07'}});
export function applyMoveExpansion(data){
 if(data.moves.some(m=>m.id===355))return;
 for(const m of data.moves){if(!m.category){m.authored_category=null;m.category=/fang|claw|crash|drop|sweep|lash|sting/i.test(m.name)?'PHYSICAL':'SPECIAL';m.runtime_binding='Provisional category inferred from attack motif; supplied category was unresolved.';}
 if(m.effects.some(e=>(e.effect_id==='recoil'||e.effect_id==='contact_retaliation')&&!e.basis))m.runtime_binding=(m.runtime_binding?m.runtime_binding+' ':'')+'Slice binding: unspecified recoil uses actual damage dealt; Thorn Guard uses attacker maximum HP.';
 }
 data.moves.push(...NEW_MOVES);
 const add=(s,m,level)=>{if(!m||data.learnsets.some(l=>l.species_id===s.id&&l.move_id===m.id))return;data.learnsets.push({species_id:s.id,move_id:m.id,name:m.name,level,method:'LEVEL_UP',provenance:{authoring:'Slice learn-tree expansion, 2026-10-07'},expansion:true});};
 const byId=id=>data.moves.find(m=>m.id===id);
 for(const s of data.species){const typed=data.moves.filter(m=>s.types.includes(m.type_id)&&!m.signature_owner_family),physical=s.growth_percent.attack>=s.growth_percent.sp_attack;
 const quick=typed.find(m=>m.priority>0&&(m.category==='PHYSICAL')===physical)||typed.find(m=>m.priority>0);add(s,quick,3);
 const support=typed.filter(m=>m.category==='STATUS'&&!m.effects.some(e=>e.effect_id==='hp_cost'));
 // Stable species index distributes tactical choices without changing saved RNG.
 const useful=support.filter(m=>m.effects.some(e=>['inflict_status','heal','next_move_cannot_miss','next_hit_damage_multiplier','stat_stage'].includes(e.effect_id)));
 add(s,useful[s.dex_number%Math.max(1,useful.length)],6);
 const attacks=typed.filter(m=>m.power>=40&&m.power<=70&&(m.category==='PHYSICAL')===physical&&m.priority===0);
 const crit=attacks.find(m=>m.effects.some(e=>e.effect_id==='high_critical_ratio'));
 add(s,/Focus Edge|Proof by Cut/.test(Object.values(s.ability_names).join(' '))?crit||attacks[0]:attacks[s.dex_number%Math.max(1,attacks.length)],10);
 const field=typed.filter(m=>m.id>=371);for(const m of field)add(s,m,18);
 const abilities=Object.values(s.ability_names);
 if(abilities.includes('Rainrunner')||abilities.includes('Floodplain')||abilities.includes('Stormsense'))add(s,byId(371),18);
 if(abilities.includes('Sunstride'))add(s,byId(372),18);
 if(abilities.includes('Snowfoot'))add(s,byId(374),18);
 if(abilities.includes('Screenmender')){add(s,byId(376),18);add(s,byId(377),18);}
 }
 // Admit every unused source move, preserving signature-family exclusivity.
 const counts={};for(const m of data.moves.filter(m=>m.id<=354&&!data.learnsets.some(l=>l.move_id===m.id))){
 let candidates=data.species.filter(s=>m.signature_owner_family?s.family_id===m.signature_owner_family:s.types.includes(m.type_id));
 if(m.signature_owner_family)candidates=candidates.slice(-1);else candidates.sort((a,b)=>{const score=s=>((m.category==='SPECIAL'?s.growth_percent.sp_attack:s.growth_percent.attack)>=40?0:1)+(counts[s.id]||0);return score(a)-score(b)||a.dex_number-b.dex_number;});
 for(const s of candidates.slice(0,m.signature_owner_family?1:3)){const level=m.power>=110?40:m.power>=85?28:m.power>=65?16:m.power?8:12;add(s,m,level);counts[s.id]=(counts[s.id]||0)+1;}
 }
 data.learnsets.sort((a,b)=>a.species_id.localeCompare(b.species_id)||a.level-b.level||a.move_id-b.move_id);
}
