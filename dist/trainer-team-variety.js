import {rng} from './engine.js?v=0.90.40';
import {DATA} from './data.js?v=0.90.40';
import {legalForm,legalMoves} from './route-roster.js?v=0.87.0';
import {EXTRA_TRAINERS,routeStage} from './route-progression.js?v=0.90.40';
import {ROAD_POOLS} from './encounter-pools.js?v=0.90.25';
const EARLY_ROOMS={'TRN-C01-003':'march2','TRN-C02-001':'scrub','TRN-C02-002':'scrub2'};
export const variableEarlyTrainer=t=>!!t&&!t.expeditionTeam&&(!!EARLY_ROOMS[t.id]||EXTRA_TRAINERS.some(r=>r.id===t.id));
function hash(text){let n=2166136261;for(const c of text)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0||1;}
export function expeditionTrainerTeam(state,t){
 if(t.expeditionTeam||!variableEarlyTrainer(t))return t;
 const existing=state.trainerTeams?.[t.id];if(existing)return {...t,team:structuredClone(existing),expeditionTeam:true};
 if(!Number.isSafeInteger(state.trainerTeamSeed))throw Error('Trainer team seed must be saved before generating a roster.');
 const random=rng(hash(state.trainerTeamSeed+':'+t.id)),count=1+Math.floor(random()*4),room=EARLY_ROOMS[t.id]||EXTRA_TRAINERS.find(r=>r.id===t.id).room;
 const biome=ROAD_POOLS[routeStage(room)?.base||room],baseLevel=Math.max(...t.team.map(s=>s.level));
 const ids=[...t.team.map(s=>s.species_id),...(biome?.DAY||[]),...(biome?.NIGHT||[])];
 const level=count===1?baseLevel+2:Math.max(1,baseLevel-(count===4?1:0));
 const candidates=[...new Set(ids.map(id=>legalForm(id,level)))].filter(id=>DATA.species.some(s=>s.id===id)&&legalMoves(id,level).some(mid=>DATA.moves.find(m=>m.id===mid)?.power>0));
 // Keep the existing trainer's flavour, with local residents filling larger parties.
 const team=[];for(let i=0;i<count;i++){const index=Math.floor(random()*candidates.length),id=candidates.splice(index,1)[0];if(!id)throw Error('Not enough local trainer species: '+t.id);team.push({slot:i+1,species_id:id,level:count===1?level:Math.max(1,level-(i===count-1?0:1)),current_form_legal_move_ids:legalMoves(id,count===1?level:Math.max(1,level-(i===count-1?0:1)))});}
 // Re-resolve species at each actual slot level to avoid premature evolved forms.
 for(const slot of team){slot.species_id=legalForm(slot.species_id,slot.level);slot.current_form_legal_move_ids=legalMoves(slot.species_id,slot.level);}
 state.trainerTeams??={};state.trainerTeams[t.id]=structuredClone(team);return {...t,team,expeditionTeam:true};
}

