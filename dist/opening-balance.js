import {eliteLeaderTeam,eliteIdentity} from './elite-leaders.js?v=0.90.46';
import {expeditionTrainerTeam} from './trainer-team-variety.js?v=0.87.0';
import {fullLeaderTeam} from './route-roster.js?v=0.87.0';
// Opening play-test settings; authored species growth and later regions stay intact.
export function experienceMultiplier(level){return level<50?2:level<100?1.25:1;}
export function openingEncounterLevel(level,area){const bounds=area.id==='CIV-01'?[5,10]:['DOR-01','DOR-02'].includes(area.id)?[11,16]:null;if(!bounds)return level;return bounds[0]+Math.min(bounds[1]-bounds[0],Math.floor((level-area.min_level)/(area.max_level-area.min_level+1)*(bounds[1]-bounds[0]+1)));}
export function openingTrainer(trainer,state=null){if(state&&eliteIdentity(trainer))return eliteLeaderTeam(state,trainer);if(trainer.expeditionTeam)return trainer;trainer=fullLeaderTeam(trainer);const levels={'TRN-C01-003':[10,11],'TRN-C02-001':[13,14],'TRN-C02-002':[15,16]}[trainer.id];const adjusted=levels?{...trainer,team:trainer.team.map((slot,i)=>({...slot,level:levels[i]??slot.level}))}:trainer;return state?expeditionTrainerTeam(state,adjusted):adjusted;}
export function starterCare(unit){if(!unit.originalStarter||unit.starterCareVersion===1)return unit;const family=unit.species.family_id,bonus=family==='FAMILY-001'?10:family==='FAMILY-004'?20:0,oldMax=unit.maxHp,oldHP=unit.hp;unit.stats.hp+=bonus;unit.maxHp=unit.stats.hp;if(family==='FAMILY-001')unit.stats.defence+=3;if(family==='FAMILY-004')unit.stats.sp_attack+=4;unit.hp=oldHP<=0?0:Math.max(1,Math.min(unit.maxHp,Math.round(oldHP*unit.maxHp/oldMax)));unit.starterCareVersion=1;return unit;}
export function leaderVariant(unit){return unit;}
export function restoreMove(saved,canonical){if(!canonical)return null;return {...canonical,left:Math.max(0,Math.min(canonical.pp,Math.floor(saved.left??canonical.pp)))};}
