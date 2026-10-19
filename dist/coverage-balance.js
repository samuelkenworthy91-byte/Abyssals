// Coverage authoring, 2026-10-09. Preserve identities, signatures and growth.
const THEMES={NORMAL:['FIGHTING','DARK','GROUND'],FIRE:['GROUND','ROCK','GRASS'],WATER:['ICE','GROUND','ELECTRIC'],ELECTRIC:['ICE','GRASS','DARK'],GRASS:['GROUND','POISON','ROCK'],ICE:['WATER','GROUND','FIGHTING'],FIGHTING:['ROCK','DARK','STEEL'],POISON:['GROUND','DARK','GRASS'],GROUND:['ROCK','ICE','FIGHTING'],FLYING:['FIGHTING','STEEL','DARK'],PSYCHIC:['GHOST','FAIRY','DARK'],BUG:['DARK','GROUND','POISON'],ROCK:['GROUND','FIGHTING','GRASS'],GHOST:['DARK','PSYCHIC','FAIRY'],DRAGON:['FIRE','GROUND','STEEL'],DARK:['FIGHTING','POISON','FAIRY'],STEEL:['GROUND','FIGHTING','ROCK'],FAIRY:['PSYCHIC','GROUND','FIGHTING']};
export function applyCoverageBalance(data){
 if(data.coverageBalanceVersion===1)return;data.coverageBalanceVersion=1;
 // The existing rush motifs already show a collision and retain their authored art.
 for(const id of [337,346]){const m=data.moves.find(m=>m.id===id);m.authored_category??=m.category;m.category='PHYSICAL';m.contact=true;m.runtime_binding='Physical Fairy collision attack; category authoring 2026-10-09.';}
 const byId=new Map(data.moves.map(m=>[m.id,m]));
 const add=(s,m,level,reason)=>{if(data.learnsets.some(l=>l.species_id===s.id&&l.move_id===m.id))return;data.learnsets.push({species_id:s.id,move_id:m.id,name:m.name,level,method:'LEVEL_UP',expansion:true,coverage_balance:true,provenance:{authoring:'Coverage balance, 2026-10-09',reason}});};
 for(const s of data.species){
  const category=s.growth_percent.attack>=s.growth_percent.sp_attack?'PHYSICAL':'SPECIAL';
  if(s.types.includes('FAIRY')&&category==='PHYSICAL'){
   add(s,byId.get(346),4,'Early physical Fairy STAB');add(s,byId.get(337),20,'Stronger physical Fairy STAB');
  }
  const usable=data.learnsets.filter(l=>l.species_id===s.id&&l.level<=16).some(l=>{const m=byId.get(l.move_id);return m.power>0&&m.category===category&&!s.types.includes(m.type_id)&&m.type_id!=='NORMAL';});
  if(usable)continue;
  // Family-based themes keep relatives coherent without giving every species every type.
  const themes=[...new Set(s.types.flatMap(t=>THEMES[t]))].filter(t=>!s.types.includes(t));
  const candidates=themes.flatMap((type,rank)=>data.moves.filter(m=>m.type_id===type&&m.category===category&&m.power>=40&&m.power<=70&&m.priority===0&&!m.signature_owner_family&&!data.learnsets.some(l=>l.species_id===s.id&&l.move_id===m.id)).map(m=>({m,rank})));
  const seed=Number(s.family_id?.match(/\d+/)?.[0]||s.id),preferred=themes[seed%Math.min(2,themes.length)];
  candidates.sort((a,b)=>(a.m.type_id===preferred?0:1)-(b.m.type_id===preferred?0:1)||a.rank-b.rank||Math.abs(a.m.power-55)-Math.abs(b.m.power-55)||a.m.id-b.m.id);
  if(!candidates.length)throw Error('No themed coverage candidate for '+s.id);
  add(s,candidates[0].m,12,`${s.types.join('/')} thematic ${category.toLowerCase()} coverage`);
 }
 data.learnsets.sort((a,b)=>a.species_id.localeCompare(b.species_id)||a.level-b.level||a.move_id-b.move_id);
}
