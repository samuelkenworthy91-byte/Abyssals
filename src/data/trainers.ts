// Provisional trainers — data-driven
// Kurg soldier test is canonical first battle

import { TrainerData } from '../core/types';

export const PROVISIONAL_TRAINERS: Record<string, TrainerData> = {
  'KURG_SOLDIER_TUTORIAL': {
    id: 'KURG_SOLDIER_TUTORIAL',
    name: 'Mustering Recruit',
    class: 'True Light Recruit',
    team: ['PROV-OPPONENT-01'],
    level: 5,
    is_provisional: true
  },
  'KURG_SOLDIER_ALT': {
    id: 'KURG_SOLDIER_ALT',
    name: 'Mustering Recruit',
    class: 'True Light Recruit',
    team: ['PROV-OPPONENT-02'],
    level: 5,
    is_provisional: true
  }
};

export function getTrainer(id: string): TrainerData | undefined {
  return PROVISIONAL_TRAINERS[id];
}
