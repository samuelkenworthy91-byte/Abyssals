import {DATA} from './data.js?v=0.90.41';
import {legalForm,legalMoves} from './route-roster.js?v=0.87.0';
export const STORM_SIDE_ROOMS=['stormRelay','stormDariusCamp','stormDariusRidge','stormDariusCrown'];
export const DARIUS_STORM_ID='TRN-BT-DARIUS';
const trainer=(id,name,portrait,ids,levels,before,after)=>({id,name,portraitId:portrait,faction:'Common Cause',role:'Thunderplain expedition',runtimeAuthored:true,expeditionTeam:true,ai_tier:'Advanced',before,after,team:ids.map((s,i)=>({slot:i+1,species_id:legalForm(s,levels[i]),level:levels[i],current_form_legal_move_ids:legalMoves(legalForm(s,levels[i]),levels[i])}))});
export const STORM_TRAINERS=[
 trainer('TRN-BT-HOLDOUT','Last-banner holdout','REV-FARID',['020','108','179','371'],[74,75,75,76],'The others left. I stayed because somebody had to. If you are going up there, make me stand aside.','He has only a few dressings left. He saves every one for the dragon. Make each turn count.'),
 trainer(DARIUS_STORM_ID,'Darius · Last Thunder','REV-DARIUS-STORM',['020','108','082','179','371','173'],[77,77,78,79,79,82],'They left when I asked them to bear the cost of their own convictions. I have rebuilt without them. Tianzhar will endure. Your expedition will not.','Stop. The tether is breaking. No—stay with me. I cannot lose another one.'),
 trainer('TRN-BT-ASCENT','Ridge sentry','TRN-C02-002',['108','082','371'],[74,75,75],'The storm took our signal line. I cannot let another unprepared expedition climb. Show me you can survive the ridge.','Keep climbing. Two patrols tried to reason with him; neither made it through.'),
 trainer('TRN-BT-CAVE','Cave guardian','TRN-C02-001',['020','179','371'],[75,76,76],'The paintings warn against binding the sovereign. If you mean to break that tether, prove you can hold the path.','Past the cave, climb the old tower steps. He has stopped listening to us.')
];
const moves=(id,chosen)=>{const slot=STORM_TRAINERS[1].team.find(s=>s.species_id===id);if(!slot)return;slot.battle_move_ids=chosen;for(const m of chosen)if(!slot.current_form_legal_move_ids.includes(m))throw Error('Illegal Darius move '+id+':'+m);};
moves('108',[240,224,223,66]);moves('173',[74,277,60,55]);
Object.assign(STORM_TRAINERS[1],{bagUses:3,stormAttrition:true,sourceHeldRoles:[{slot:1,role:'GUARD'},{slot:2,role:'SUSTAIN'},{slot:3,role:'GUARD'},{slot:4,role:'SUSTAIN'},{slot:5,role:'GUARD'},{slot:6,role:'SUSTAIN',hidden_ability:true}]});
export function installStormTrainers(expansion,voices){for(const t of STORM_TRAINERS){if(!expansion.trainers.some(x=>x.id===t.id))expansion.trainers.push(t);voices[t.id]={before:t.before,after:t.after,repeat:'The last storm camp has fallen silent.'};}}
export const STORM_NOTES={
 deserter:['A torn banner','I followed Darius because he said nobody should be sacrificed to an army. Then he opened a reservoir above families who had never held a sword. When we asked him to stop, he called us cowards. Most of us left. A handful went north along the black glass ridge. I heard something answering the thunder.'],
 ridge:['The last supply ledger','Six new partners. Ground and Rock to grind an expedition down; Electric to punish hesitation. Three poultices remain. Every one has been crossed out and reassigned to Tianzhar. There are no reserves for the people who still follow him.'],
 tether:['Copper written into stone','The surviving conductors converge on an old storm shrine. Tianzhar, the Dragon/Electric storm sovereign, is caught in a forced grounding tether. A warning is cut below the clamps: breaking the keeper’s hold releases the creature. The sovereign once sheltered travellers beneath its coils. It was revered long before either army claimed this plateau.']
};
