// Dialogue data — provisional except where canonical wording exists
// Task says: Use exact canonical wording where dialogue has already been written, e.g. "Don't follow us."
// Other dialogue is provisional but grounded, not rewritten to be "game-like" for fun

import { DialogueData } from '../core/types';

export const DIALOGUES: Record<string, DialogueData> = {
  // Childhood
  'childhood_start': {
    id: 'childhood_start',
    speaker: 'Narrator',
    speaker_id: 'NARRATOR',
    text: [
      'Civeton — ten years ago.',
      'The hill above the village. Summer.',
      'Three children. A game of pretend battles, with sticks for swords and stones for abyssals.'
    ]
  },
  'childhood_pate': {
    id: 'childhood_pate',
    speaker: 'Pate',
    speaker_id: 'CHR-PATE',
    portrait_key: 'pate_child',
    text: [
      'I\'m Ser Aldren! And this is my abyssal — Bramble King!',
      'He\'s defeated a hundred Dawn Bloom heretics!'
    ]
  },
  'childhood_trade': {
    id: 'childhood_trade',
    speaker: 'Trade',
    speaker_id: 'CHR-TRADE',
    portrait_key: 'trade_child',
    text: [
      'That\'s not how it works. Abyssals don\'t care about heretics.',
      '...but fine. I\'m Warden Samiel. My abyssal is bigger than yours.'
    ]
  },
  'childhood_aimon': {
    id: 'childhood_aimon',
    speaker: 'Aimon',
    speaker_id: 'CHR-AIMON',
    portrait_key: 'aimon_child',
    text: [
      'Can I be General Kurg? No— wait, I want the hound.',
      'Charge!'
    ]
  },
  'childhood_end': {
    id: 'childhood_end',
    speaker: 'Narrator',
    speaker_id: 'NARRATOR',
    text: [
      'They played until the light went low.',
      'They did not know it then, but this was the last summer they would all be children together.'
    ]
  },

  // Present day
  'wake_civeton': {
    id: 'wake_civeton',
    speaker: 'Narrator',
    speaker_id: 'NARRATOR',
    text: [
      'Civeton. Present day.',
      'The crusade has begun.',
      'You wake to the sound of the mustering bell. It has been ringing for three days.'
    ]
  },

  'pate_house_empty': {
    id: 'pate_house_empty',
    speaker: 'Narrator',
    speaker_id: 'NARRATOR',
    text: [
      'Pate\'s house is empty.',
      'The hearth is cold. His mother\'s loom is covered.',
      'A True Light recruit\'s tabard hangs over a chair, half-mended.',
      'He has gone.'
    ]
  },

  'trade_house': {
    id: 'trade_house',
    speaker: 'Narrator',
    speaker_id: 'NARRATOR',
    text: [
      'Trade\'s house. The door is ajar.',
      'Inside, a single sheet of paper is weighted down with a smooth river stone.',
      'You recognize Trade\'s handwriting.'
    ]
  },

  'trade_message': {
    id: 'trade_message',
    speaker: 'Trade',
    speaker_id: 'CHR-TRADE',
    portrait_key: 'trade',
    text: [
      'Don\'t follow us.'
    ],
    is_canonical: true // This exact wording is canonical per task
  },

  'trade_message_context': {
    id: 'trade_message_context',
    speaker: 'Narrator',
    speaker_id: 'NARRATOR',
    text: [
      'That is all it says.',
      'Don\'t follow us.',
      'Your immediate objective becomes clear: find them. Follow them.'
    ]
  },

  'kurg_first': {
    id: 'kurg_first',
    speaker: 'Kurg',
    speaker_id: 'CHR-KURG',
    portrait_key: 'kurg',
    text: [
      'Aimon.',
      'I wondered when you\'d come.',
      'Pate and Trade left with the second muster. Three days ago.'
    ]
  },

  'kurg_refusal': {
    id: 'kurg_refusal',
    speaker: 'Kurg',
    speaker_id: 'CHR-KURG',
    portrait_key: 'kurg',
    text: [
      'No.',
      'You are not joining. You are not following.',
      'You are staying here. That is an order.'
    ]
  },

  'kurg_reveal': {
    id: 'kurg_reveal',
    speaker: 'Kurg',
    speaker_id: 'CHR-KURG',
    portrait_key: 'kurg',
    text: [
      'They asked me to stop you.',
      'Both of them. Separately. Pate first, then Trade.',
      'They made me promise.',
      '...They think they are protecting you.'
    ]
  },

  'kurg_starter': {
    id: 'kurg_starter',
    speaker: 'Kurg',
    speaker_id: 'CHR-KURG',
    portrait_key: 'kurg',
    text: [
      'If you are determined to go — and I see that you are — then you will not go unprepared.',
      'The True Light has always kept three.',
      'Three abyssals, raised for this purpose. For those who would walk the March.',
      'Choose one. Only one. The others will go to Pate and Trade, wherever they are.',
      'Understand this: these three are different. They have three lives. Not one. Three.',
      'When they fall, they will return — once, twice. On the third death, they die like any other.',
      'Do not waste them.'
    ]
  },

  'kurg_battle_intro': {
    id: 'kurg_battle_intro',
    speaker: 'Kurg',
    speaker_id: 'CHR-KURG',
    portrait_key: 'kurg',
    text: [
      'Now. Show me you can keep one alive.',
      'Recruit! Test him.'
    ]
  },

  'kurg_post_battle_win': {
    id: 'kurg_post_battle_win',
    speaker: 'Kurg',
    speaker_id: 'CHR-KURG',
    portrait_key: 'kurg',
    text: [
      'Good.',
      'You kept its heart beating. That is the first lesson.',
      'Real abyssals reaching 0 HP die, Aimon. Remember that. This was a controlled test — the first and only time I will stop a death.',
      'Outside Civeton, there are no controlled tests.',
      'Go. Take the March road. Find your brothers.',
      'And Aimon — if you see them, tell them I kept my promise as long as I could.'
    ]
  },

  'kurg_post_battle_loss_tutorial': {
    id: 'kurg_post_battle_loss_tutorial',
    speaker: 'Kurg',
    speaker_id: 'CHR-KURG',
    portrait_key: 'kurg',
    text: [
      'It fell. But it breathes — barely. Ten percent.',
      'That is the three-life gift. It will return, once.',
      'You see? Even in failure, it endures. For now.',
      'Learn from this. Outside Civeton, not every fall is forgiven.',
      'Go again. The March road awaits.'
    ]
  },

  // NPCs
  'villager_well': {
    id: 'villager_well',
    speaker: 'Villager',
    speaker_id: 'NPC-VILLAGER-01',
    text: [
      'The well is low this year. Crusade takes the strong arms.',
      'Your friends? Aye, they went with Halbrecht\'s men. North, toward the Mustering Camp.'
    ]
  },

  'shrine_keeper': {
    id: 'shrine_keeper',
    speaker: 'Shrine Keeper',
    speaker_id: 'NPC-SHRINE',
    text: [
      'The shrine is for prayer, not for lingering.',
      'Light guide them. Even the ones who run.'
    ]
  },

  'child_npc': {
    id: 'child_npc',
    speaker: 'Child',
    speaker_id: 'NPC-CHILD',
    text: [
      'Are you going to be a crusader too?',
      'Mama says the abyssals eat naughty children. Is that true?'
    ]
  }
};

export function getDialogue(id: string): DialogueData | undefined {
  return DIALOGUES[id];
}
