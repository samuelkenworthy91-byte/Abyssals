import assert from 'node:assert/strict';
import {expeditionMechanisms,mechanismPath} from '../dist/side-campaign-mechanisms.js';
import {
 SIDE_CAMPAIGNS,campaignState,campaignPuzzle,campaignReset,campaignAssist,campaignHint,campaignMechanismPanel,campaignGateOpen,campaignGuard
} from '../dist/side-campaigns.js';
import {leaderFortObjective} from '../dist/leader-fort-rules.js';
import {LEADER_FORTS} from '../dist/leader-fort-data.js';

for(const [key,definition] of Object.entries(expeditionMechanisms)){
 const c=SIDE_CAMPAIGNS.find(campaign=>campaign.key===key);
 const state={party:[{hp:10,species:{types:[c.affinity]}}],defeatedTrainers:[campaignGuard(c,1)]};
 const quest=campaignState(state,c);
 quest.accepted=true;
 assert(!campaignPuzzle(state,c,0),'reading is required');
 quest.clues.push(1);
 assert(!campaignHint(state,c),'hints are earned by trying the mechanism');
 assert(campaignAssist(state,c)&&!quest.solved,'partner hint preserves the challenge');
 assert(!campaignMechanismPanel(state,c).hint.includes('Try this next'));
 const start=structuredClone(definition.initial);
 const solution=mechanismPath(definition,start);
 assert(solution?.length>=3,key+' is solvable and takes several decisions');
 for(let n=0;n<3;n++)assert(campaignPuzzle(state,c,0));
 assert(campaignHint(state,c));
 assert(campaignHint(state,c));
 assert(campaignMechanismPanel(state,c).hint.startsWith('Try this next'));
 assert(campaignReset(state,c));
 assert.deepEqual(quest.mechanism.board,start);
 assert(!campaignGateOpen(state,c,1));
 for(const action of solution.slice(0,-1))assert(campaignPuzzle(state,c,action));
 const resumed=JSON.parse(JSON.stringify(state));
 assert.deepEqual(campaignMechanismPanel(resumed,c),campaignMechanismPanel(state,c));
 assert(campaignPuzzle(resumed,c,solution.at(-1)));
 assert(campaignGateOpen(resumed,c,1));
 assert(!campaignReset(resumed,c));
 const legacy={sideCampaigns:{[key]:{accepted:true,clues:[0,1,2],solved:true,choice:'b',claimed:true}}};
 assert(campaignGateOpen(legacy,c,1));
 assert(!campaignPuzzle(legacy,c,0));
 assert(!campaignReset(legacy,c));
 assert(!legacy.sideCampaigns[key].mechanism);
 assert.equal(legacy.sideCampaigns[key].choice,'b');
}
const fort=LEADER_FORTS.find(f=>f.key==='cossenne');
assert(leaderFortObjective({defeatedTrainers:[fort.guardIds[0]]},fort.room).text.includes(fort.target.join(' · ')));
console.log('PASS:',Object.keys(expeditionMechanisms).length,'upgraded puzzles with shortest solutions, hints, save/resume, reset and legacy completion; Cossenne objective matches the fort.');
