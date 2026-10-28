import {MARASEN_TRAINERS} from './marasen-data.js?v=0.90.48';
import {COSSENNE_TRAINERS} from './cossenne-data.js?v=0.90.48';
import {CYBRESSA_TRAINERS} from './cybressa-data.js?v=0.90.48';
export const PAYOUT_COEFFICIENTS={Basic:[10,50],Advanced:[16,50],'Leader-lite':[24,75],Leader:[50,50],Rival:[50,50],Warden:[0,0],Final:[0,0],Severin:[0,0]};
export function trainerPayout(trainer){const [level,size]=PAYOUT_COEFFICIENTS[trainer.ai_tier]||[0,0];return Math.floor((level*Math.max(0,...trainer.team.map(t=>t.level))+size*trainer.team.length)/10+.5)*10;}
export function claimTrainerPayout(state,trainer){state.trainerPayouts??=[];if(state.trainerPayouts.includes(trainer.id)||state.defeatedTrainers?.includes(trainer.id))return 0;const amount=trainerPayout(trainer);state.money+=amount;state.trainerPayouts.push(trainer.id);return amount;}
// Newly authored flavour around the locked trainer identities and locations.
export const TRAINER_VOICES={
 'TRN-C01-001':{after:'A drill yard can stop a blow. The road cannot. Spend your winnings on supplies before you mistake confidence for readiness.'},
 'TRN-C01-002':{before:'I polished my buckle three times this morning. Easier than admitting I am frightened. A supervised spar might steady my hands.',after:'I thought courage meant never shaking. You shook, too, and still made your choices. I will remember that.',repeat:'Still checking that buckle. Less often now. Keep some doubloons for the journey back.'},
 'TRN-C01-003':{before:'The bells say everyone marches together. Up here I see a different story: carts at the rear, empty boots at the front. Show me you watch your partners.',after:'Check your partners before the next patch of grass. A victory is little comfort if you walk straight into the next fight unprepared.',repeat:'Watch the verges. The road is safe from wild encounters; the grass is not.'},
 'TRN-C02-001':{before:'Two lads passed here arguing. The quieter one kept checking behind them. Borders do that to people: make every glance look guilty.',after:'Your friends were heading towards the keep. If the front gate stays shut, look for the service passage. Villagers still need a way home.',repeat:'A uniform tells you whose orders I follow. It does not tell you every thought I have.'},
 'TRN-C02-002':{before:'They told us the people beyond these walls hate our prayers. Last night one of them left water for our wounded. Orders are simpler than people.',after:'You have earned your passage. Spend the doubloons on someone who still needs you; it cannot put breath back into a lost partner.',repeat:'I still follow my orders. I am less certain that obeying them makes me right.'},
 'LDR-01':{before:'One formal challenge is better than another assault on these walls. If I lose, I yield military control.',after:'My surrender includes the challenge purse. It does not make the families inside these walls your spoils.'},
 'LDR-02':{before:'I will accept a challenge only if civilian rations remain protected. Your victory cannot empty the hospice stores.',after:'The purse was set aside for this challenge. The medicine was not. Whatever you decide about me, leave my patients their chance.'}
};

for(const t of CYBRESSA_TRAINERS)TRAINER_VOICES[t.id]={before:t.before,after:t.after,repeat:'Your passage is earned. The watch will not challenge you again.'};

for(const t of COSSENNE_TRAINERS)TRAINER_VOICES[t.id]={before:t.before,after:t.after,repeat:t.after};

for(const t of MARASEN_TRAINERS)TRAINER_VOICES[t.id]={before:t.before,after:t.after,repeat:"Your passage is recorded."};
