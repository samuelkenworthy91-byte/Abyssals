// Provisional species data — marked as provisional due to missing canonical dex
// Real dex has 187 species, we provide 3 starters + 1 opponent for vertical slice
// Loader is data-driven and replaceable: future real data can replace this file without code changes

import { SpeciesData } from '../core/types';

export const PROVISIONAL_SPECIES: Record<string, SpeciesData> = {
  // STARTER 01 — Bramblekin — Earth/Plant grounded, small but resilient
  // Provisional ID, will be replaced by canonical starter when available
  'PROV-STARTER-01': {
    id: 'PROV-STARTER-01',
    name: 'Bramblekin',
    types: ['EARTH', 'WILD'],
    base_stats: {
      hp: 45,
      atk: 55,
      def: 50,
      spa: 40,
      spd: 45,
      spe: 50
    },
    bst: 285,
    description: 'A small creature of woven bramble and moss, found near old hedgerows. Its thorns harden with age. Quiet and steadfast.',
    is_provisional: true,
    sprite_key: 'bramblekin',
    evolution: {
      evolves_to: 'PROV-STARTER-01-EVO1',
      level: 16
    }
  },
  // STARTER 02 — Emberling — Fire, hearth-associated, warm but not cute
  'PROV-STARTER-02': {
    id: 'PROV-STARTER-02',
    name: 'Emberling',
    types: ['FIRE', 'WILD'],
    base_stats: {
      hp: 42,
      atk: 52,
      def: 43,
      spa: 58,
      spd: 45,
      spe: 55
    },
    bst: 295,
    description: 'Born from banked hearth embers, it carries a low, steady heat. Its light falters when afraid.',
    is_provisional: true,
    sprite_key: 'emberling',
    evolution: {
      evolves_to: 'PROV-STARTER-02-EVO1',
      level: 16
    }
  },
  // STARTER 03 — Tidemaw — Water, river/mere creature, grounded
  'PROV-STARTER-03': {
    id: 'PROV-STARTER-03',
    name: 'Tidemaw',
    types: ['WATER', 'WILD'],
    base_stats: {
      hp: 50,
      atk: 45,
      def: 55,
      spa: 50,
      spd: 55,
      spe: 40
    },
    bst: 295,
    description: 'A mere-dweller with a broad, patient gaze. It holds water in the folds of its hide, releasing it slowly.',
    is_provisional: true,
    sprite_key: 'tidemaw',
    evolution: {
      evolves_to: 'PROV-STARTER-03-EVO1',
      level: 16
    }
  },
  // OPPONENT — Hollow Hound — used for Kurg soldier test
  'PROV-OPPONENT-01': {
    id: 'PROV-OPPONENT-01',
    name: 'Hollow Hound',
    types: ['WILD', 'SHADOW'],
    base_stats: {
      hp: 40,
      atk: 50,
      def: 40,
      spa: 35,
      spd: 35,
      spe: 55
    },
    bst: 255,
    description: 'A lean, feral abyssal used by mustering forces for drills. Its howl is thin and hollow.',
    is_provisional: true,
    sprite_key: 'hollow_hound'
  },
  // Additional opponent for variety
  'PROV-OPPONENT-02': {
    id: 'PROV-OPPONENT-02',
    name: 'Gloam Mite',
    types: ['SHADOW', 'WILD'],
    base_stats: {
      hp: 35,
      atk: 45,
      def: 50,
      spa: 40,
      spd: 50,
      spe: 45
    },
    bst: 265,
    description: 'A low, skittering thing that clings to shadow. Not truly dangerous alone.',
    is_provisional: true,
    sprite_key: 'gloam_mite'
  }
};

// Canonical starter IDs mapping — provisional, documented as gap
// When real starter IDs are available, replace this mapping
export const STARTER_IDS = [
  'PROV-STARTER-01',
  'PROV-STARTER-02',
  'PROV-STARTER-03'
] as const;

export function getSpecies(id: string): SpeciesData | undefined {
  return PROVISIONAL_SPECIES[id];
}

export function getAllSpecies(): SpeciesData[] {
  return Object.values(PROVISIONAL_SPECIES);
}

// Growth seed generation per individual
export function generateGrowthSeed(speciesId: string, instanceId: string): number {
  let hash = 0;
  const str = speciesId + instanceId;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 0x7FFFFFFF;
}
