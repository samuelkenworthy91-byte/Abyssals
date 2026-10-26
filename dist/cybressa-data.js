import {mountainRoute,PASS_CACHES} from './mountain-pass.js?v=0.90.20';
import {DATA} from './data.js?v=0.90.40';
import {legalForm,legalMoves} from './route-roster.js?v=0.87.0';
export const CYBRESSA_ROUTES={
 rivercause:{name:'Rivercause Road · Western Causeway',min:38,max:40,biome:'wetland',DAY:['052','106','061','078','054'],NIGHT:['052','106','024','022','112']},
 rivercause2:{name:'Rivercause Road · Market Approach',min:40,max:42,biome:'coast',DAY:['078','054','056','080','109'],NIGHT:['022','024','100','054','086']},
 philomereBackwaters:{name:'Philomere Backwaters',min:38,max:42,biome:'wetland',DAY:['106','052','078','061','116'],NIGHT:['106','022','112','024','064']},
 smugglersWeir:{name:'Smugglers’ Weir',min:40,max:44,biome:'coast',DAY:['022','054','078','052','111'],NIGHT:['022','024','029','054','086']},
 saltFlats:{name:'Cybressa Salt Flats',min:42,max:46,biome:'desert',DAY:['037','078','039','082','089'],NIGHT:['037','039','029','094','118']}
};
export const CYBRESSA_QUESTS={
 cargo:{title:'Cargo in the reeds',npc:'Boatwright Alice de Vesci',room:'philomereBackwaters',finds:['backwater-cargo-1-cache','backwater-cargo-2-cache','backwater-cargo-3-cache'],reward:{money:600,heartyFood:3}},
 weir:{title:'The missing ferry bell',npc:'Ferryman Umar ibn Hasan',room:'smugglersWeir',finds:['weir-bell-cache'],trainer:'TRN-CY-WEIR',reward:{money:800,emergencyEvacs:1}},
 salt:{title:'The salt-caravan ledger',npc:'Merchant Fatima bint Ali',room:'saltFlats',finds:['salt-ledger-1-cache','salt-ledger-2-cache','salt-ledger-3-cache'],reward:{money:700,trainingTonics:2}}
};
export const CYBRESSA_CACHE_REWARDS={
 ...PASS_CACHES,
 'rivercause-supply-cache':{poultices:2,heartyFood:2},
 'market-approach-cache':{smoke:1,armedEscorts:1},
 'backwaters-supply-cache':{poultices:2},
 'weir-supply-cache':{heartyFood:3,smoke:1},
 'salt-hidden-cache':{lifeEmbers:1},
 'warehouse-supply-cache':{poultices:2,smoke:1}
};
const authoredTeam=(ids,levels)=>ids.map((id,i)=>{const level=Array.isArray(levels)?levels[i]:levels,species_id=legalForm(id,level);return {slot:i+1,species_id,level,current_form_legal_move_ids:legalMoves(species_id,level)};});
export const CYBRESSA_TRAINERS=[
 {id:'TRN-CY-RIVER',name:'Causeway scout Robert de Clare',portraitId:'TRN-CY-RIVER',ai_tier:'Advanced',team:authoredTeam(['052','106','056'],[38,39,40]),before:'First Light holds this dry crossing, but the grain still comes from Dawn Bloom farms upriver. Burn their boats and we starve beside our own checkpoint. Let us settle your passage without adding another wreck.',after:'You have earned the crossing. Alice the boatwright is trying to recover the village cargo our patrols scattered. She could use someone who finishes a job.'},
 {id:'TRN-CY-MARKET',name:'Caravan guard Ali ibn Umar',portraitId:'TRN-CY-MARKET',ai_tier:'Advanced',team:authoredTeam(['078','054','109'],[40,41,42]),before:'Our captains count every wagon entering Cybressa. They never count the empty ones leaving. The villages need goods back as much as the city needs grain. Stand clear of the carts for our challenge.',after:'Go through. Maryam at the warehouses has been asking why the civilian queue never moves. Tell her I let you pass.'},
 {id:'TRN-CY-WH-1',name:'Warehouse watchman Hasan ibn Ahmad',portraitId:'TRN-CY-WH-1',ai_tier:'Advanced',team:authoredTeam(['029','039','086'],[40,40,41]),before:'These stores are under the provost’s seal. If you insist on searching them, face the watch first.',after:'I will not bar the aisle again. Read the records before you judge the people who signed them.'},
 {id:'TRN-CY-WH-2',name:'Warehouse captain Zaynab bint Umar',portraitId:'TRN-CY-WH-2',ai_tier:'Advanced',team:authoredTeam(['054','091','108'],[41,41,42]),before:'The city eats from these warehouses. Prove you can bear responsibility for what happens here.',after:'The central records are yours to inspect. The grain cannot serve two queues at once.'},
 {id:'TRN-CY-WEIR',name:'Weir lookout Khalid ibn Hasan',portraitId:'TRN-CY-WEIR',ai_tier:'Advanced',team:authoredTeam(['022','029','111'],[41,42,43]),before:'First Light demands travel seals on the west bank. Our toll boats demand them on the east. The people arriving here have neither. I brought the bell to warn their boats off the rocks. If you want it back, show me you can reach them safely.',after:'The bell is at the upper landing. Take it to Umar. Ask him what a family without travel papers is supposed to do when night falls.'},
 {id:'TRN-CY-SALT',name:'Caravan outrider Geoffrey FitzHugh',portraitId:'TRN-CY-SALT',ai_tier:'Advanced',team:authoredTeam(['037','082','118'],[43,44,45]),before:'The water-house levy is meant to pay for escorts. My riders buy their own water. If those missing accounts say otherwise, someone has been using our names. Prepare your partners.',after:'You can search beyond my post. Take the pages to Fatima. If my name appears, I want to see the charge myself.'},
 {id:'LDR-03',name:'Provost Ahmad ibn Yusuf',portraitId:'LDR-03',ai_tier:'Leader',team:authoredTeam(['108','054','091','082','086','089'],[40,40,41,41,42,42]),before:'You have read the ledgers and chosen who receives the grain. Now settle military control by a formal challenge. The market’s civilian stores remain protected.',after:'My partners have been defeated. You hold the city. The stores and the people who need them will still be here tomorrow.'}
];
export function installCybressaTrainers(expansion,voices){for(const source of CYBRESSA_TRAINERS){if(!expansion.trainers.some(t=>t.id===source.id)){const {before,after,...t}=source;expansion.trainers.push({...t,role:t.id==='LDR-03'?'city leader':'Cybressa chapter',runtimeAuthored:true});}if(voices)voices[source.id]={before:source.before,after:source.after,repeat:source.after};}}
export function cybressaRoute(room){const pass=mountainRoute(room);if(pass)return pass;const r=CYBRESSA_ROUTES[room];if(!r)return null;const weights=[35,30,24,8,3];return {room,explorationTable:true,encounterPacing:true,area:{id:room,name:r.name,rate:'NORMAL'},tables:['DAY','NIGHT'].map(phase=>({id:room+'-'+phase,area_id:room,phase,slots:r[phase].map((id,i)=>{let min=r.min;while(min<=r.max&&legalForm(id,min)!==id)min++;if(min>r.max)throw Error('Cybressa encounter below evolution level: '+id);if(!DATA.species.some(s=>s.id===id))throw Error('Missing Cybressa species '+id);return {species_id:id,min_level:min,max_level:r.max,weight:weights[i],authoredSlot:true,rarity:i<3?'Common':i===3?'Uncommon':'Rare'};})}))};}
