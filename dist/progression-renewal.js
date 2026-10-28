// Late learning choices, authored around branch roles. Existing rows and stable
// move IDs remain valid; this never equips moves or edits saved creatures.
export const BRANCH_CURRICULA={
 '506':['Unspoken Threat','Mind Screen','No Witness','Coordinated Focus','Mirror Rampart','Mind Unbound'],
 '507':['Cinder Pounce','Iron Break','War Cry','Cinder Hex','Iron Charge','Full Release'],
 '508':['Clay Reap','Earth Ward','Sand Guard','Buried Knuckle','Dune Toll','Last Bastion'],
 '509':['Venomtooth Hook','Toxic Veil','No Witness','Noxious Cloud','Sapping Spiral',"Executioner's Bargain"],
 '511':['Iron Break','War Cry','Steel Cut','Battle Rally','Shield Relay','Full Release'],
 '512':['Iron Break','Iron Curtain','Reforged Bulwark','Shield Relay','Last Bastion','Warforged Tempo'],
 '513':['Parting Blow','Iron Break',"Executioner's Bargain",'Brave Palm','War Cry','Full Release'],
 '514':['Mind Arc','Mind Screen','Coordinated Focus','Mirror Rampart','No Witness','Mind Unbound']
};
const support={
 NORMAL:['Battle Rally','Second Wind','Quick Wit','Brace Yourself'],
 FIRE:['Stoke the Heart','War Flame','Heat Haze','Kindled Heart'],
 WATER:['Tidal Poise','Mist Screen','Deepwater Brace','Raincall'],
 ELECTRIC:['Circuit Breaker','Overcharge Protocol','Static Field','Static Warning'],
 GRASS:['Verdant Mend','Thorn Guard','Meadow Weave','Spring Growth'],
 ICE:['Frozen Poise','Rime Guard','Hail Choir','Snow Veil'],
 FIGHTING:['Measured Force','War Cry','Guarded Breath','Firm Footing'],
 POISON:['Toxic Veil','Venom Coat','Noxious Cloud','Entropic Ritual'],
 GROUND:['Earth Ward','Burrow Calm','Sand Guard','Dust Screen'],
 FLYING:['Tailwind Cry','Sky Focus','Feather Veil','Updraft'],
 PSYCHIC:['Calm Thought','Future Read','Mind Screen','Coordinated Focus'],
 BUG:['Shed Shell','Hive Call','Silk Guard','Frayed Nerve'],
 ROCK:['Stone Skin','Bedrock Reply','Cairn Ward','Shard Screen'],
 GHOST:['Grave Silence','Hollow Knell','Spirit Veil','Graveside Murmur'],
 DRAGON:['Scale Guard','Royal Roar','Wyrmwhisper','Duality Crest'],
 DARK:['Night Veil','Rogue Step','Second Shadow','Grudge Mark'],
 STEEL:['Iron Curtain','Tempered Body','Iron Ward','Plate Guard'],
 FAIRY:['Moon Blessing','Charm Veil','Chorus of Renewal','Warding Chorus']
};
const shared=['Quick Wit','Second Wind','Battle Rally','Brace Yourself','Sure Stride'];
export function installProgressionRenewal(data){
 if(data.progressionRenewalVersion)return;data.progressionRenewalVersion=1;
 const byName=new Map(data.moves.map(m=>[m.name,m])),byId=new Map(data.moves.map(m=>[m.id,m]));
 // Restore explicit acquisition for four registry-only ordinary techniques.
 for(const [id,types]of [[89,['GRASS']],[265,['GHOST']],[704,['WATER']],[705,['ROCK']]]){
  const m=byId.get(id);if(m){m.tutorTypes=[...new Set([...(m.tutorTypes||[]),...types])];m.accessRestored=true;}
 }
 const exact=new Set();data.learnsets=data.learnsets.filter(l=>{
  if(l.species_id!=='511')return true;
  const key=[l.species_id,l.move_id,l.level,l.method].join(':');
  if(exact.has(key))return false;exact.add(key);return true;
 });
 const add=(s,level,name)=>{
  const m=byName.get(name);
  if(!m)throw Error('Unresolved progression technique: '+name);
  if(data.learnsets.some(l=>l.species_id===s.id&&l.move_id===m.id))return false;
  const row={species_id:s.id,move_id:m.id,name:m.name,level,method:'LEVEL_UP',progressionRenewal:true};
  data.learnsets.push(row);data.authoredLearnsets?.push({...row});return true;
 };
 for(const s of data.species){
  if(s.id==='505')continue; // Flaskling's deliberately tiny pool is protected.
  const curriculum=BRANCH_CURRICULA[s.id];
  if(curriculum){const levels=Number(s.id)<510?[44,50,56,62,70,78]:[34,40,46,54,64,76];curriculum.forEach((name,i)=>add(s,levels[i],name));continue;}
  if(s.id==='510'){for(const [level,name]of [[16,'Measured Force'],[22,'Brave Kick'],[28,'Parting Feint']])add(s,level,name);continue;}
  if(data.evolutions?.some(e=>e.from_species_id===s.id))continue;
  // This installer receives the real evolution graph from data.js.
  if(data.progressionEvolutionParents?.has(s.id))continue;
  const known=()=>new Set(data.learnsets.filter(l=>l.species_id===s.id).map(l=>l.move_id));
  const category=s.base_stats.attack>s.base_stats.sp_attack?'PHYSICAL':'SPECIAL';
  const ordinary=m=>!m.signature_owner_family&&!m.signature_owner_name&&!m.signature_owner&&!m.questTutor&&!m.salvation&&!m.releaseMove&&!m.tideOrchardMove;
  const attackPool=type=>data.moves.filter(m=>ordinary(m)&&m.type_id===type&&m.category===category&&m.power>=65&&m.power<=100).sort((a,b)=>((b.effects?.length||0)-(a.effects?.length||0))||a.power-b.power||a.id-b.id).map(m=>m.name);
  const candidates=[...s.types.flatMap(attackPool),...s.types.flatMap(t=>support[t]||[]),...shared];
  const rows=data.learnsets.filter(l=>l.species_id===s.id&&l.method==='LEVEL_UP'),last=Math.max(0,...rows.map(l=>l.level));
  const paladin=Number(s.id)>=412&&Number(s.id)<=425,slots=paladin?[42,50,58,68,78]:[Math.max(60,last+6),76,88];
  let cursor=0;
  // One new attack at most: late milestones must provide tactical choices too.
  const choices=[
   candidates.find(n=>!known().has(byName.get(n)?.id)),
   ...s.types.flatMap(t=>support[t]||[]).filter(n=>!known().has(byName.get(n)?.id)),
   ...shared.filter(n=>!known().has(byName.get(n)?.id))
  ].filter(Boolean);
  const used=new Set();
  for(const name of choices){if(cursor>=slots.length)break;if(used.has(name))continue;used.add(name);if(add(s,slots[cursor],name))cursor++;}
 }
}
