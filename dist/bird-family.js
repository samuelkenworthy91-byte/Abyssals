// Eighteen approved three-stage avian families. Each stage has its own identity.
export const BIRD_FAMILIES=[
  {
    "index": 0,
    "slug": "bramble-robin",
    "names": [
      "Sprigpip",
      "Thornwing",
      "Briarion"
    ],
    "secondary": "GRASS",
    "ability": "Thornwake",
    "category": "PHYSICAL",
    "baseId": "426"
  },
  {
    "index": 1,
    "slug": "storm-swift",
    "names": [
      "Ziplet",
      "Voltrill",
      "Tempestral"
    ],
    "secondary": "ELECTRIC",
    "ability": "Stormdraft",
    "category": "SPECIAL",
    "baseId": "429"
  },
  {
    "index": 2,
    "slug": "banner-swallow",
    "names": [
      "Pennip",
      "Pennantail",
      "Valiantrel"
    ],
    "secondary": "FIGHTING",
    "ability": "Rally Wing",
    "category": "PHYSICAL",
    "baseId": "432"
  },
  {
    "index": 3,
    "slug": "hearth-kestrel",
    "names": [
      "Cindlet",
      "Kindrel",
      "Pyrestrel"
    ],
    "secondary": "FIRE",
    "ability": "Coal Updraft",
    "category": "SPECIAL",
    "baseId": "435"
  },
  {
    "index": 4,
    "slug": "river-kingfisher",
    "names": [
      "Brookip",
      "Torrentail",
      "Kingcascade"
    ],
    "secondary": "WATER",
    "ability": "Plunge Drive",
    "category": "SPECIAL",
    "baseId": "438"
  },
  {
    "index": 5,
    "slug": "iron-shrike",
    "names": [
      "Rivetweet",
      "Ferrike",
      "Irontalon"
    ],
    "secondary": "STEEL",
    "ability": "Tempered Pinions",
    "category": "PHYSICAL",
    "baseId": "441"
  },
  {
    "index": 6,
    "slug": "dusk-magpie",
    "names": [
      "Pilchip",
      "Gloamjay",
      "Umbraive"
    ],
    "secondary": "DARK",
    "ability": "Pridebreaker",
    "category": "PHYSICAL",
    "baseId": "444"
  },
  {
    "index": 7,
    "slug": "lantern-owl",
    "names": [
      "Wickowl",
      "Hushowl",
      "Vespermourn"
    ],
    "secondary": "GHOST",
    "ability": "Hush Current",
    "category": "SPECIAL",
    "baseId": "447"
  },
  {
    "index": 8,
    "slug": "sanctuary-dove",
    "names": [
      "Coolet",
      "Auradove",
      "Seraphlume"
    ],
    "secondary": "FAIRY",
    "ability": "Mercy Plume",
    "category": "SPECIAL",
    "baseId": "450"
  },
  {
    "index": 9,
    "slug": "dune-lapwing",
    "names": [
      "Dustpip",
      "Crestilt",
      "Dunelancer"
    ],
    "secondary": "GROUND",
    "ability": "Sandvault",
    "category": "PHYSICAL",
    "baseId": "453"
  },
  {
    "index": 10,
    "slug": "slate-raven",
    "names": [
      "Chiprook",
      "Cragcrow",
      "Cairnaven"
    ],
    "secondary": "ROCK",
    "ability": "Crag Sight",
    "category": "PHYSICAL",
    "baseId": "456"
  },
  {
    "index": 11,
    "slug": "silk-wren",
    "names": [
      "Threadlet",
      "Weavren",
      "Tapestrix"
    ],
    "secondary": "BUG",
    "ability": "Silken Current",
    "category": "SPECIAL",
    "baseId": "459"
  },
  {
    "index": 12,
    "slug": "marsh-ibis",
    "names": [
      "Reedip",
      "Miasbis",
      "Venibis"
    ],
    "secondary": "POISON",
    "ability": "Venom Vane",
    "category": "SPECIAL",
    "baseId": "462"
  },
  {
    "index": 13,
    "slug": "dream-crane",
    "names": [
      "Reverip",
      "Trancewing",
      "Oraculane"
    ],
    "secondary": "PSYCHIC",
    "ability": "Mindwing",
    "category": "SPECIAL",
    "baseId": "465"
  },
  {
    "index": 14,
    "slug": "frost-puffin",
    "names": [
      "Chillbill",
      "Rimebeak",
      "Boreapuff"
    ],
    "secondary": "ICE",
    "ability": "Rime Draft",
    "category": "PHYSICAL",
    "baseId": "468"
  },
  {
    "index": 15,
    "slug": "sky-dragon-kite",
    "names": [
      "Scalip",
      "Wyrmkite",
      "Dracorizon"
    ],
    "secondary": "DRAGON",
    "ability": "High Horizon",
    "category": "PHYSICAL",
    "baseId": "471"
  },
  {
    "index": 16,
    "slug": "dawn-skylark",
    "names": [
      "Piplet",
      "Larkeen",
      "Aurorark"
    ],
    "secondary": "NORMAL",
    "ability": "Second Wind",
    "category": "PHYSICAL",
    "baseId": "474"
  },
  {
    "index": 17,
    "slug": "gale-tern",
    "names": [
      "Whiflet",
      "Sailswift",
      "Zephyreon"
    ],
    "secondary": null,
    "ability": "Gale Relay",
    "category": "SPECIAL",
    "baseId": "477"
  }
];
const keys=['hp','attack','defence','sp_attack','sp_defence','speed'];
const stats=values=>Object.fromEntries(keys.map((k,i)=>[k,values[i]]));
const physical=[[25,40,20,10,25,50],[40,65,35,15,35,75],[55,95,45,20,45,110]];
const special=[[25,10,20,40,25,50],[40,15,35,65,35,75],[55,20,45,95,45,110]];
const finalProfiles={'lantern-owl':[55,20,45,105,65,80],'iron-shrike':[60,85,80,15,55,75],'slate-raven':[60,85,80,15,55,75],'frost-puffin':[65,95,65,15,55,75],'sanctuary-dove':[70,15,45,80,85,75]};
export const BIRD_SPECIES=BIRD_FAMILIES.flatMap(f=>f.names.map((name,stage)=>{
 const id=String(+f.baseId+stage),family_id='FAMILY-'+f.baseId,role=f.category==='PHYSICAL'?'Fast avian physical attacker':'Fast avian special attacker';
 const rates=stats(stage===2&&finalProfiles[f.slug]|| (f.category==='PHYSICAL'?physical:special)[stage]);
 const base=stats((f.category==='PHYSICAL'?[[40,45,30,25,35,60],[60,65,45,35,50,85],[80,100,65,50,75,110]]:[[40,25,30,45,35,60],[60,35,45,65,50,85],[80,50,65,100,75,110]])[stage]);
 const ability=stage===2?f.ability:stage===0?'Keen Sense':'Surefoot';
 return {id,dex_number:+id,name,stage:['Base','Middle','Final'][stage],types:f.secondary?['FLYING',f.secondary]:['FLYING'],base_stats:base,starting_stats:Object.fromEntries(keys.map(k=>[k,Math.max(1,Math.round(base[k]*(k==='hp'?.5:.2)))])),bst:Object.values(base).reduce((a,b)=>a+b,0),family_id,role,growth_archetype:role,growth_percent:rates,authored_growth_percent:{...rates},growth_balance_version:1,power_class:stage===2?'Standard Final':stage===1?'Middle / Evolving':'Base / Early',capture_rate:[190,100,45][stage],ability_names:{primary:ability,secondary:ability,hidden:ability},abilities:Object.fromEntries(['primary','secondary','hidden'].map(k=>[k,'ABILITY_'+ability.toUpperCase().replaceAll(' ','_')])),height_m:[.3,.8,1.5][stage],mass_kg:[2,12,30][stage],sex_ratio:'50:50',companion_motion:'hover',approvedExpansion362:true,approvedBird:true,animal_inspiration:f.slug.replaceAll('-',' '),catalogue_entry:name+' is the '+['small, curious starting form','agile developing form','fully fledged guardian'][stage]+' of the '+f.slug.replaceAll('-',' ')+' family. Its single pair of wings carries the markings shared by its relatives.',unresolved_fields:[],provenance:{authoring:'User-approved avian families, 18 October 2026'},moveset_identity:{version:1,modernVersion:1,style:role,category:f.category,kind:f.category==='PHYSICAL'?'physical':'special',plan:'Flying and '+(f.secondary||'neutral')+' attacks, controlled setup, limited recovery and a distinct final-form ability.'}};
}));
export const BIRD_EVOLUTIONS=BIRD_FAMILIES.flatMap(f=>[0,1].map(stage=>({id:'EVOLUTION-BIRD-'+(+f.baseId+stage+1),from_species_id:String(+f.baseId+stage),to_species_id:String(+f.baseId+stage+1),condition:{method:'LEVEL',minimum_level:stage===0?14:28},promotion_delta:Object.fromEntries(keys.map(k=>[k,BIRD_SPECIES.find(s=>s.id===String(+f.baseId+stage+1)).base_stats[k]-BIRD_SPECIES.find(s=>s.id===String(+f.baseId+stage)).base_stats[k]])),approvedExpansion:true,approvedBird:true})));
export const BIRD_GROWTH_PROFILES=BIRD_SPECIES.map(s=>({id:s.id,name:s.name,archetype:s.role,priorities:s.moveset_identity.category==='PHYSICAL'?['attack','speed']:['sp_attack','speed'],reason:'A vulnerable early bird develops sharply at levels 14 and 28; final growth supports a lasting specialised role while preserving defensive weaknesses.',authored:{...s.growth_percent},rates:{...s.growth_percent},total:Object.values(s.growth_percent).reduce((a,b)=>a+b,0),bonusPoints:0,bonusFraction:0,qualification:'Approved early-bird progression'}));
const signatureNames=['Bramble Swoop','Thunder Draft','Pennant Break','Ember Updraft','Cascade Lance','Pinion Pierce','Gloaming Plunder','Lantern Requiem','Sanctuary Breeze','Dune Vault','Cairnfall Dive','Silken Spiral','Venom Flight','Oneiric Wings','Rimewake Dive','Horizon Rend','Dawn Crescendo','Zephyr Relay'];
export const BIRD_MOVES=BIRD_FAMILIES.map((f,i)=>({id:500+i,name:signatureNames[i],type_id:f.secondary||'FLYING',category:f.category,power:80,accuracy:100,pp:10,target:'FOE',priority:0,effects:[{effect_id:'stat_stage',target:'SELF',stat:'speed',stages:1,chance_percent:20}],effect_text:'Deals damage. Has a 20% chance to raise the user’s Speed one stage.',signature_owner_family:'FAMILY-'+f.baseId,signature_owner_name:f.names[2],authored_visual_action:'A '+f.slug.replaceAll('-',' ')+' silhouette sweeps through a spiral of '+(f.secondary||'wind').toLowerCase()+' feathers before the final wing strike.',sceneAction:f.category==='PHYSICAL'?'rake':'pulse',approvedExpansion362:true,approvedBird:true}));
export const BIRD_BRIEFS=Object.fromEntries(BIRD_FAMILIES.map(f=>['FAMILY-'+f.baseId,{reference:'Approved '+f.slug+' avian progression',reference_levels:[4,8,12,16,20,24,28,32,38,44,50,56],support:f.category==='PHYSICAL'?[12,41,173]:[10,41,173],coverage:[f.secondary==='GHOST'?'DARK':f.secondary==='FIGHTING'?'ROCK':f.secondary==='PSYCHIC'?'FAIRY':f.category==='PHYSICAL'?'FIGHTING':'PSYCHIC'],category:f.category}]));
export function installBirds(data){
 if(data.species.some(s=>s.approvedBird))return;
 data.species.push(...BIRD_SPECIES);data.moves.push(...BIRD_MOVES);
 const add=(species,move,level)=>{if(!move||data.learnsets.some(l=>l.species_id===species.id&&l.move_id===move.id))return;const row={species_id:species.id,move_id:move.id,name:move.name,level,method:level===0?'EVOLUTION':'LEVEL_UP',expansion:true,identity:true,identity_core:true,approvedBird:true};data.learnsets.push(row);data.authoredLearnsets?.push({...row});};
 const pick=(type,category,power)=>data.moves.filter(m=>m.type_id===type&&m.category===category&&m.power&&!m.signature_owner_family).sort((a,b)=>Math.abs(a.power-power)-Math.abs(b.power-power)||a.id-b.id)[0];
 for(const f of BIRD_FAMILIES)for(const s of BIRD_SPECIES.filter(s=>s.family_id==='FAMILY-'+f.baseId)){
  const cat=f.category,brief=BIRD_BRIEFS[s.family_id];
  for(const [level,type,power]of [[1,'FLYING',40],[1,'NORMAL',40],[8,'FLYING',55],[12,f.secondary||'FLYING',45],[16,'FLYING',70],[24,'NORMAL',65],[44,'NORMAL',90],[22,f.secondary||'FLYING',65],[32,'FLYING',90],[38,f.secondary||'FLYING',85],[48,'FLYING',110],[56,f.secondary||'FLYING',100]])add(s,pick(type,cat,power),level);
  for(const [i,id]of brief.support.entries())add(s,data.moves.find(m=>m.id===id),[4,20,26][i]);
  for(const [i,type]of brief.coverage.entries())add(s,pick(type,cat,50),12+i*8);
  if(s.stage==='Final')add(s,BIRD_MOVES[f.index],0);
  data.assets.push({id:s.id,source:'Approved corrected avian illustration atlas',runtime:'assets/bird-family/'+f.slug+'.png'});
 }
}

