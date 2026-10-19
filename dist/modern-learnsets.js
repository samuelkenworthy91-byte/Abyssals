import {FAMILY_BRIEFS} from './family-learnset-briefs.js?v=0.87.0';

export const MODERN_LEARNSET_VERSION=1;
const protectedIds=new Set(['001','002','003','079','080','139','140']);
const byPower=(pool,power)=>pool.slice().sort((a,b)=>Math.abs(a.power-power)-Math.abs(b.power-power)||a.id-b.id)[0];
const powerLevel=m=>m.power>105?48:m.power>90?38:m.power>75?26:m.power>60?16:1;

export function applyModernLearnsets(data){
 if(data.modernLearnsetVersion===MODERN_LEARNSET_VERSION)return;
 const previous=data.learnsets,byId=new Map(data.moves.map(m=>[m.id,m]));
 const rows=previous.filter(l=>protectedIds.has(l.species_id));
 const add=(s,m,level,core=false)=>{
  if(!m||m.signature_owner_family&&m.signature_owner_family!==s.family_id||rows.some(l=>l.species_id===s.id&&l.move_id===m.id))return;
  rows.push({species_id:s.id,move_id:m.id,name:m.name,level,method:level===0?'EVOLUTION':'LEVEL_UP',expansion:true,identity:true,identity_core:core,modern:true,provenance:{authoring:'Family learnset review, 2026-10-11',reference:FAMILY_BRIEFS[s.family_id]?.reference}});
 };
 for(const s of data.species){
  const brief=FAMILY_BRIEFS[s.family_id];if(!brief)throw Error('Family brief missing: '+s.family_id);
  s.moveset_identity={...s.moveset_identity,reference:brief.reference,modernVersion:MODERN_LEARNSET_VERSION};
  if(protectedIds.has(s.id))continue;
  const category=s.moveset_identity.category,evolved=!['Base','Single'].includes(s.stage);
  const own=data.moves.filter(m=>s.types.includes(m.type_id)&&m.category===category&&m.power>0&&!m.signature_owner_family);
  const curve=brief.reference_levels;
  const at=(n,fallback)=>curve[n]??fallback;
  const attacks=own.filter(m=>m.power<=60);
  add(s,byPower(attacks,40)||byPower(data.moves.filter(m=>m.type_id==='NORMAL'&&m.category===category&&m.power>0&&m.power<=50&&!m.signature_owner_family),40),1,true);
  // Family-specific status choices occur at different points in each learning curve.
  for(const [i,id]of brief.support.entries())add(s,byId.get(id),i===0?at(0,4):i===1?at(3,18):at(7,36),i===0);
  add(s,byPower(own.filter(m=>m.power<=65),55),Math.max(5,at(1,8)),true);
  for(const type of s.types.slice(1))add(s,byPower(own.filter(m=>m.type_id===type&&m.power<=65),45),Math.max(7,at(2,12)),true);
  add(s,byPower(own.filter(m=>m.power>=60&&m.power<=80),70),Math.max(16,at(4,20)),true);
  add(s,byPower(own.filter(m=>m.power>=80&&m.power<=100),90),Math.max(28,at(7,34)),true);
  add(s,byPower(own.filter(m=>m.power>=100),110),Math.max(44,at(10,48)),true);
  // Coverage follows an authored biological/fantasy theme, rather than patching every weakness.
  const familyTypes=data.species.filter(v=>v.family_id===s.family_id).flatMap(v=>v.types);
  const coverage=[...new Set([...brief.coverage,...familyTypes])].filter(type=>!s.types.includes(type)&&type!=='NORMAL');
  let coverageIndex=0;for(const type of coverage){
   const pool=data.moves.filter(m=>m.type_id===type&&m.category===category&&m.power>0&&!m.signature_owner_family);
   const early=byPower(pool.filter(m=>m.power<=65),coverageIndex?60:45);
   if(early){add(s,early,coverageIndex?Math.max(22,at(6,28)):Math.min(16,Math.max(8,at(2,12))),true);coverageIndex++;}
   if(evolved)add(s,byPower(pool.filter(m=>m.power>=70&&m.power<=95),80),Math.max(34,at(9,42)));
  }
  // Body-language options: retain a small selection of source-authored neutral attacks.
  const old=previous.filter(l=>l.species_id===s.id);
  const neutral=old.map(l=>byId.get(l.move_id)).filter(m=>m.type_id==='NORMAL'&&m.category===category&&m.power>0&&m.power<=70&&!m.signature_owner_family);
  add(s,byPower(neutral,40),1);
  add(s,byPower(neutral,65),Math.max(18,at(5,24)));
  for(const l of old){const m=byId.get(l.move_id);if(m.signature_owner_family===s.family_id)add(s,m,l.level===0&&evolved?0:Math.max(l.level,26));}
  // Keep all existing physical Fairy collision options for physical Fairy families.
  if(s.types.includes('FAIRY')&&category==='PHYSICAL'){add(s,byId.get(346),4,true);add(s,byId.get(337),20,true);}
  s.moveset_identity.style=s.growth_archetype||s.role;
  s.moveset_identity.plan=`${s.animal_inspiration?s.animal_inspiration+' theme. ':''}${brief.support.map(id=>byId.get(id).name).join(', ')} provide this family's tactical choices; ${coverage.join(' and ')} attacks provide thematic coverage. Main damage uses ${category==='PHYSICAL'?'Attack':'Special Attack'}.`;
 }
 // Catalogue moves stay obtainable through their most compatible source-authored family.
 // This is bounded to one owner per otherwise-unrepresented move, not every species of its type.
 for(const m of data.moves.filter(m=>!rows.some(l=>l.move_id===m.id))){
  const candidates=data.species.filter(s=>!protectedIds.has(s.id)&&previous.some(l=>l.species_id===s.id&&l.move_id===m.id));
  candidates.sort((a,b)=>Number(!a.types.includes(m.type_id))-Number(!b.types.includes(m.type_id))||Number(a.moveset_identity.category!==m.category)-Number(b.moveset_identity.category!==m.category)||Number(a.stage==='Base')-Number(b.stage==='Base'));
  if(candidates[0])add(candidates[0],m,Math.max(powerLevel(m),m.category==='STATUS'?24:16));
 }
 data.learnsets=rows.sort((a,b)=>a.species_id.localeCompare(b.species_id)||a.level-b.level||a.move_id-b.move_id);
 data.modernLearnsetVersion=MODERN_LEARNSET_VERSION;
}
