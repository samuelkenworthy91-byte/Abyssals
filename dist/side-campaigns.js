import {claimChoiceReward,choiceRewardText} from './choice-rewards.js?v=0.90.40';
import {menagerieEncounterRoute} from './menagerie-encounters.js?v=0.87.0';
import {isReducedMotion} from './motion.js?v=0.87.0';
import {MECHANISM_ART,drawQuestMechanism,drawExpeditionGate,drawEvidence} from './quest-scenery.js?v=0.87.0';
import {SIDE_CAMPAIGNS} from './side-campaign-data.js?v=0.90.40';
import {SIDE_CONTENT} from './exploration-data.js?v=0.90.40';
import {SIDE_POOLS} from './encounter-pools.js?v=0.90.25';
import {CYBRESSA_ROUTES,CYBRESSA_QUESTS} from './cybressa-data.js?v=0.90.40';
import {DATA} from './data.js?v=0.90.40';
import {legalForm,legalMoves} from './route-roster.js?v=0.87.0';
import {pacedEncounterRoute} from './encounter-pacing.js?v=0.87.0';
import {expandEncounterRoute} from './roster-encounters.js?v=0.90.40';
import {registerCampaignBiome} from './biome-world.js?v=0.90.40';
export {SIDE_CAMPAIGNS};
const campaignFactions=new Map();
export const campaignRoom=(c,stage)=>stage===0?c.key:c.key+'Trail'+(stage+1);
export function campaignArea(room){for(const c of SIDE_CAMPAIGNS)for(let stage=0;stage<3;stage++)if(campaignRoom(c,stage)===room)return {c,stage};return null;}
export const campaignGuard=(c,stage)=>'TRN-SC-'+c.key+'-'+stage;
export const campaignBounds=c=>SIDE_POOLS[c.key]||CYBRESSA_ROUTES[c.key]||{min:10,max:14};
export const campaignGiverSpot=c=>{const old=SIDE_CONTENT.find(s=>s.room===c.key);return old?old.id+'-npc':'sc-'+c.key+'-giver';};
export const campaignGiver=c=>SIDE_CONTENT.find(s=>s.room===c.key)?.name||Object.values(CYBRESSA_QUESTS).find(q=>q.room===c.key)?.npc||(c.key==='rescueGlade'?'Young True Light soldier':'Competition warden');
export function campaignState(state,c){state.sideCampaigns??={};return state.sideCampaigns[c.key]??={version:1,accepted:false,clues:[],puzzle:[],lights:[false,false,false],weights:[0,0,0],solved:false,choice:null,claimed:false};}
export function campaignGuardDone(state,c,stage){return campaignState(state,c).claimed||(state.defeatedTrainers||[]).includes(campaignGuard(c,stage));}
export function campaignGateOpen(state,c,stage){const q=campaignState(state,c);return q.claimed||(q.accepted&&q.clues.includes(stage)&&campaignGuardDone(state,c,stage)&&(stage!==1||q.solved));}
export function campaignBlocked(state,room,x,y){const a=campaignArea(room);return !!a&&(x===35&&y===18||a.stage<2&&x===44&&y>=16&&y<=18&&!campaignGateOpen(state,a.c,a.stage));}
export function campaignClue(state,c,stage){const q=campaignState(state,c);if(!q.accepted||q.clues.includes(stage))return false;q.clues.push(stage);return true;}
export function campaignPuzzle(state,c,index){const q=campaignState(state,c);if(!q.accepted||q.solved||!Number.isInteger(index)||index<0||index>2)return false;
 if(c.puzzleKind==='lanterns'){q.lights[index]=!q.lights[index];if(index<2)q.lights[index+1]=!q.lights[index+1];q.solved=q.lights.every((v,i)=>v===c.solution[i]);}
 else if(c.puzzleKind==='weights'){q.weights[index]=(q.weights[index]+1)%4;q.solved=q.weights.every((v,i)=>v===c.solution[i]);}
 else{q.puzzle.push(index);if(q.puzzle.at(-1)!==c.solution[q.puzzle.length-1])q.puzzle=[];if(q.puzzle.length===3)q.solved=true;}
 return true;
}
export function campaignReset(state,c){const q=campaignState(state,c);if(q.solved)return false;q.puzzle=[];q.lights=[false,false,false];q.weights=[0,0,0];return true;}
export function campaignAffinity(state,c){return (state.party||[]).some(u=>u.hp>0&&!u.dead&&u.species.types.includes(c.affinity));}
export function campaignAssist(state,c){const q=campaignState(state,c);if(!q.accepted||q.solved||!q.clues.includes(1)||!campaignAffinity(state,c))return false;q.solved=true;q.assisted=true;return true;}
export function campaignChoose(state,c,choice){const q=campaignState(state,c);if(!['a','b'].includes(choice)||q.choice||!q.clues.includes(2)||!campaignGuardDone(state,c,2))return false;q.choice=choice;return true;}
export function claimCampaign(state,c){const q=campaignState(state,c);if(!q.choice||q.claimed)return false;for(const [k,v]of Object.entries(c.reward)){if(Number.isFinite(v))state[k]=(state[k]||0)+v;}q.claimed=true;state.storyChoices??={};state.storyChoices['side_'+c.key]=q.choice;claimChoiceReward(state,c.key,q.choice);return true;}
export function campaignObjective(state,room){const a=campaignArea(room);if(!a)return null;const {c,stage}=a,q=campaignState(state,c);if(q.claimed)return q.rewardVersion?null:{spot:campaignGiverSpot(c),text:'Collect your expedition prize · '+c.title};if(!q.accepted||q.choice)return {spot:campaignGiverSpot(c),text:!q.accepted?'Speak to '+campaignGiver(c)+' at '+c.stages[0]:'Report your decision to '+campaignGiver(c)+' at '+c.stages[0]};if(!q.clues.includes(stage))return {spot:'sc-'+c.key+'-clue-'+stage,text:'Examine the '+['trail evidence','repair inscription','site register'][stage]+' · '+c.stages[stage]};if(stage===1&&!q.solved)return {spot:'sc-'+c.key+'-mechanism-0',text:c.objective[1]+' · use the three named controls'};if(!campaignGuardDone(state,c,stage))return {spot:campaignGuard(c,stage),text:'Win the path warden’s challenge · '+c.stages[stage]};return {spot:'sc-'+c.key+(stage<2?'-forward-'+stage:'-resolution'),text:stage<2?'Take the eastern gate to '+c.stages[stage+1]:'Choose this area’s future at the decision register'};}
export const campaignParagraphs=text=>String(text||'').split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
export function campaignPages(text,maxWords=55){
 const pages=[];
 for(const paragraph of campaignParagraphs(text)){
  let words=[];
  for(const sentence of paragraph.split(/(?<=[.!?])\s+/)){
   const next=sentence.split(/\s+/);
   if(words.length&&words.length+next.length>maxWords){pages.push(words.join(' '));words=[];}
   words.push(...next);
   while(words.length>maxWords){pages.push(words.splice(0,maxWords).join(' '));}
  }
  if(words.length)pages.push(words.join(' '));
 }
 return pages;
}
export function campaignRecordHTML(c,stage,escape){
 return '<article class="site-record"><p class="record-source">'+escape(c.recordSources[stage])+'</p><h3>'+escape(c.recordTitles[stage])+'</h3>'+campaignParagraphs(c.signs[stage]).map(p=>'<p>'+escape(p)+'</p>').join('')+'</article>';
}
export function campaignReminder(state,c){
 const q=campaignState(state,c),giver=campaignGiver(c);
 if(q.claimed)return c.conclusion[q.choice]||'This expedition is complete.';
 if(!q.accepted)return c.intro;
 if(q.choice)return 'Return to '+giver+' at '+c.stages[0]+' and report your decision.';
 for(let stage=0;stage<3;stage++){
  if(!q.clues.includes(stage))return 'At '+c.stages[stage]+', examine the '+['trail evidence','repair inscription','site register'][stage]+' beside the path. '+c.objective[stage]+'.';
  if(stage===1&&!q.solved)return 'At '+c.stages[1]+', use the three named controls. '+c.puzzleClue;
  if(!campaignGuardDone(state,c,stage))return 'Speak to the path warden at '+c.stages[stage]+' and win the challenge to continue.';
 }
 return 'At '+c.stages[2]+', use the decision register beyond the last warden. Choose who will care for this place, then report to '+giver+'.';
}
export function campaignControlHelp(c){
 const named=c.controlLabels.map((label,i)=>(i+1)+' '+label);
 if(c.puzzleKind==='lanterns')return 'The chains are linked: control 1 reverses lamps 1 and 2; control 2 reverses lamps 2 and 3; control 3 reverses only lamp 3. Leave '+named.map((n,i)=>n+' '+(c.solution[i]?'lit':'dark')).join(', ')+'. Reset puts every lamp out.';
 if(c.puzzleKind==='weights')return 'Each drum cycles 0 → 1 → 2 → 3 → 0. Set '+named.map((n,i)=>n+' to '+c.solution[i]).join(', ')+'.';
 return 'Use '+c.solution.map(i=>named[i]).join(' → ')+'. A wrong control clears the sequence; start again from the first.';
}
export function campaignJournal(state){return SIDE_CAMPAIGNS.map(c=>{const q=state.sideCampaigns?.[c.key];return {title:c.title,accepted:!!q?.accepted,clues:q?.clues?.length||0,solved:!!q?.solved,choice:q?.choice,claimed:!!q?.claimed,guidance:campaignReminder(state,c)};});}
export function campaignRoute(room){const a=campaignArea(room);if(!a||a.stage===0)return null;const {c,stage}=a,bounds=campaignBounds(c);
 const base=CYBRESSA_ROUTES[c.key]?{room:c.key,area:{rate:'HIGH'},tables:['DAY','NIGHT'].map(phase=>({phase,slots:CYBRESSA_ROUTES[c.key][phase].map((id,i)=>({species_id:id,weight:[40,30,20,7,3][i],min_level:bounds.min,max_level:bounds.max,rarity:i===4?'Rare':'Common'}))}))}:pacedEncounterRoute({room:c.key,area:{rate:'HIGH'},tables:[]})||{room:c.key,area:{rate:'HIGH'},tables:['DAY','NIGHT'].map(phase=>({phase,slots:c.guardianIds.map((id,i)=>({species_id:id,weight:[50,35,15][i],min_level:bounds.min,max_level:bounds.max,rarity:i===2?'Rare':'Common'}))}))};
 const expanded=expandEncounterRoute(base);return menagerieEncounterRoute({room,area:{rate:'HIGH'},relicExpanded:true,tables:expanded.tables.map(t=>({...t,id:room+'-'+t.phase,slots:t.slots.flatMap(s=>{const groups=[];for(let l=s.min_level+stage*2;l<=s.max_level+stage*2;l++){const id=legalForm(s.species_id,l),last=groups.at(-1);if(last?.species_id===id)last.max_level=l;else groups.push({...s,species_id:id,min_level:l,max_level:l,authoredSlot:true});}return groups.map(g=>({...g,weight:s.weight*(g.max_level-g.min_level+1)/(s.max_level-s.min_level+1)}));})}))});
}
export function installCampaignWorld(maps){
 const roads=[[[1,17],[8,17],[8,8],[23,8],[23,25],[38,25],[38,17],[46,17]],[[1,17],[12,17],[12,25],[25,25],[25,8],[38,8],[38,17],[46,17]],[[1,17],[9,17],[9,25],[20,25],[20,8],[34,8],[34,17],[46,17]],[[1,17],[12,17],[12,8],[25,8],[25,23],[39,23],[39,17],[46,17]],[[1,17],[9,17],[9,9],[19,9],[19,24],[31,24],[31,17],[46,17]]];
 for(const [index,c]of SIDE_CAMPAIGNS.entries()){
  const base=maps[c.key];if(!base)throw Error('Missing campaign map '+c.key);campaignFactions.set(c.key,!!base.bloom);
  for(let stage=0;stage<3;stage++){
   const room=campaignRoom(c,stage),m=stage===0?base:maps[room]={...base,name:c.stages[stage],base:c.key,area:room,road:roads[(index+stage)%roads.length].map(p=>[...p]),grass:[[4,4,18,12],[26,20,42,27]],props:[],docks:null,hub:false,fortExterior:false,spots:[{id:'area-sign',label:c.stages[stage]+' noticeboard',x:4,y:19,routeSign:true}],sidePaths:[],gates:[]};
   if(stage===0){if(!m.spots.some(s=>s.id.includes('sign')||s.wallSign))m.spots.push({id:'area-sign',label:c.stages[0]+' history board',x:4,y:19,routeSign:true});if(m.docks)m.docks.push([27,16,46,18],[34,17,36,19]);m.sidePaths??=[];m.sidePaths.push({points:[[8,17],[20,17]]},{points:[[35,17],[46,17]]},{points:[[20,17],[46,17]]});m.name=base.name+' · '+c.stages[0];m.sidePaths??=[];const exits=m.gates.filter(g=>g.x===46);m.gates=m.gates.filter(g=>g.x!==46);for(const g of exits)if(!m.gates.some(other=>other.to===g.to)){m.gates.push({...g,x:40,y:28});m.sidePaths.push({points:[[35,17],[40,17],[40,28]]});}for(const parent of Object.values(maps))for(const gate of parent.gates||[])if(gate.to===c.key&&gate.arrival?.[0]>=43)gate.arrival=[3,17,'right'];if(!SIDE_CONTENT.some(s=>s.room===c.key))m.spots.push({id:'sc-'+c.key+'-giver',label:campaignGiver(c),x:7,y:9,sprite:'bystander'});m.sidePaths.push({points:[[8,17],[8,9],[7,9]]});}
   else m.gates.push({id:'sc-'+c.key+'-back-'+stage,label:'Return to '+c.stages[stage-1],x:1,y:17,to:campaignRoom(c,stage-1),arrival:[43,17,'left'],door:true});
   registerCampaignBiome(room,c.key);m.campaign={key:c.key,stage};m.sidePaths??=[];
   m.sidePaths.push({points:[[8,17],[20,17]]},{points:[[35,17],[46,17]]},{points:[[20,17],[20,12],[15,12]]},{points:[[35,17],[35,18]]});
   m.spots.push({id:'sc-'+c.key+'-clue-'+stage,label:['Trail evidence','Repair inscription','Site register'][stage],x:15,y:12},{id:campaignGuard(c,stage),label:campaignGuardianName(c,stage)+' · challenge',x:35,y:18,sprite:2,portraitId:campaignGuard(c,stage)});
   if(stage===1)for(let n=0;n<3;n++){const [x,y]=[[12,8],[25,25],[38,8]][n];m.sidePaths.push({points:[[x,17],[x,y]]});m.spots.push({id:'sc-'+c.key+'-mechanism-'+n,label:c.controlLabels[n]+' · '+(n+1),x,y});}
   if(stage<2)m.gates.push({id:'sc-'+c.key+'-forward-'+stage,label:'Continue · '+c.stages[stage+1],x:46,y:17,to:campaignRoom(c,stage+1),arrival:[3,17,'right'],action:'side-campaign-gate',door:true});
   else {m.gates.push({id:'sc-'+c.key+'-home',label:'Return along the expedition trail',x:46,y:17,to:campaignRoom(c,1),arrival:[43,17,'left'],door:true});m.spots.push({id:'sc-'+c.key+'-resolution',label:'Settle the claim · '+c.title,x:40,y:17});}
  }
  for(let stage=0;stage<3;stage++)for(const spot of maps[campaignRoom(c,stage)].spots)if(spot.id.startsWith('sc-'+c.key+'-')&&!spot.id.endsWith('-giver'))spot.questProp=true;
  // Spread the existing collection quests through their expanded expeditions.
  const legacy=c.key==='orchardCanopy'?'orchard':c.key==='relicCrags'?'relic':null;
  if(legacy)for(let n=2;n<=3;n++){const id='explore-find-'+legacy+'-'+n,pos=base.spots.findIndex(s=>s.id===id);if(pos>=0){const spot=base.spots.splice(pos,1)[0];Object.assign(spot,{x:22,y:17});maps[campaignRoom(c,n-1)].spots.push(spot);}}
  const finds=Object.values(CYBRESSA_QUESTS).find(q=>q.room===c.key)?.finds||[];
  for(let n=1;n<finds.length;n++){const pos=base.spots.findIndex(s=>s.id===finds[n]);if(pos>=0){const spot=base.spots.splice(pos,1)[0];Object.assign(spot,{x:22,y:17});maps[campaignRoom(c,Math.min(2,n))].spots.push(spot);}}
 }
}
export function campaignGuardianName(c,stage){
 const n=SIDE_CAMPAIGNS.indexOf(c)*3+stage;
 if(campaignFactions.get(c.key)){const first=['Hasan','Yusuf','Maryam','Aisha','Ali','Hafsa','Salim','Fatima'][n%8],father=['Ibrahim','Ahmad','Yusuf','Hasan','Salim','Ali'][Math.floor(n/8)%6];return 'Path warden '+first+' '+(['Maryam','Aisha','Hafsa','Fatima'].includes(first)?'bint':'ibn')+' '+father;}
 return 'Path warden '+['Hugh','Robert','Agnes','Matilda','Walter','Alice','Margaret','Richard'][n%8]+' '+['de Warenne','de Bohun','de Vesci','de Clare','FitzWalter','de Beaumont'][Math.floor(n/8)%6];
}
export function installCampaignTrainers(expansion,voices){for(const c of SIDE_CAMPAIGNS)for(let stage=0;stage<3;stage++){const id=campaignGuard(c,stage);if(expansion.trainers.some(t=>t.id===id))continue;const level=campaignBounds(c).max+stage*2;const team=Array.from({length:stage+1},(_,i)=>{const l=level-(i===stage?0:1),species_id=legalForm(c.guardianIds[(stage+i)%3],l);return {slot:i+1,species_id,level:l,current_form_legal_move_ids:legalMoves(species_id,l)};});expansion.trainers.push({id,name:campaignGuardianName(c,stage),portraitId:id,ai_tier:'Advanced',role:'side expedition',team});voices[id]={...c.trainerVoices[stage]};}}
export function drawCampaignScene(ctx,state,room){const a=campaignArea(room);if(!a)return;const {c,stage}=a,q=campaignState(state,c),time=globalThis.performance?.now?.()||0,reduced=isReducedMotion();if(stage<2)drawExpeditionGate(ctx,room,campaignGateOpen(state,c,stage),time,reduced);drawEvidence(ctx,c.key,stage,15,12,q.clues.includes(stage));if(stage===2)drawQuestMechanism(ctx,'ledger',40,17,{solved:!!q.choice,time,reduced});if(stage===1)for(const [index,[x,y]]of [[12,8],[25,25],[38,8]].entries())drawQuestMechanism(ctx,MECHANISM_ART[c.key],x,y,{index,value:q.weights[index],lit:q.lights[index],solved:q.solved,time,reduced});}
