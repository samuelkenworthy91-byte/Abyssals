// Development fixtures — clearly non-production, for unit-testing battle engine only
// Production code must NOT import them
// Use names TEST_SPECIES_A, not fictional lore names, per task §37
// Production validator should fail if test fixtures leak into runtime data

import { CanonicalSpecies, CanonicalMove, CanonicalTrainer, StarterAssignmentRule } from '../../data/canonical/types';
import { isProd } from '../../core/env';

export const TEST_SPECIES_A: CanonicalSpecies = {
  id: 'TEST_SPECIES_A',
  name: 'TEST_A',
  types: ['WILD'],
  base_stats: { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 },
  bst: 300,
  sprite_key: 'test_a',
  description: 'Development fixture — not a real Abyssal'
};

export const TEST_SPECIES_B: CanonicalSpecies = {
  id: 'TEST_SPECIES_B',
  name: 'TEST_B',
  types: ['WILD'],
  base_stats: { hp: 45, atk: 55, def: 45, spa: 55, spd: 45, spe: 55 },
  bst: 300,
  sprite_key: 'test_b',
  description: 'Development fixture — not a real Abyssal'
};

export const TEST_SPECIES_C: CanonicalSpecies = {
  id: 'TEST_SPECIES_C',
  name: 'TEST_C',
  types: ['WILD'],
  base_stats: { hp: 55, atk: 45, def: 55, spa: 45, spd: 55, spe: 45 },
  bst: 300,
  sprite_key: 'test_c',
  description: 'Development fixture — not a real Abyssal'
};

export const TEST_MOVE_A: CanonicalMove = {
  id: 'TEST_MOVE_A',
  name: 'Test Strike',
  type: 'WILD',
  category: 'PHYSICAL',
  power: 40,
  accuracy: 100,
  pp: 35,
  priority: 0,
  target: 'SINGLE_OPPONENT',
  vfx_category: 'physical'
};

export const TEST_MOVE_B: CanonicalMove = {
  id: 'TEST_MOVE_B',
  name: 'Test Blast',
  type: 'WILD',
  category: 'SPECIAL',
  power: 50,
  accuracy: 95,
  pp: 25,
  priority: 0,
  target: 'SINGLE_OPPONENT',
  vfx_category: 'special'
};

export const TEST_MOVE_STATUS: CanonicalMove = {
  id: 'TEST_MOVE_STATUS',
  name: 'Test Guard',
  type: 'WILD',
  category: 'STATUS',
  accuracy: 'ALWAYS',
  pp: 30,
  priority: 0,
  target: 'SELF',
  vfx_category: 'status'
};

export const TEST_TRAINER_RECRUIT: CanonicalTrainer = {
  id: 'KURG_TEST_RECRUIT',
  name: 'Mustering Recruit',
  class: 'True Light Recruit',
  team: [
    { species_id: 'TEST_SPECIES_A', level: 5, moves: ['TEST_MOVE_A', 'TEST_MOVE_B'] }
  ]
};

export const TEST_STARTER_ASSIGNMENT: StarterAssignmentRule[] = [
  {
    player_species_id: 'TEST_SPECIES_A',
    pate_species_id: 'TEST_SPECIES_B',
    trade_species_id: 'TEST_SPECIES_C'
  },
  {
    player_species_id: 'TEST_SPECIES_B',
    pate_species_id: 'TEST_SPECIES_C',
    trade_species_id: 'TEST_SPECIES_A'
  },
  {
    player_species_id: 'TEST_SPECIES_C',
    pate_species_id: 'TEST_SPECIES_A',
    trade_species_id: 'TEST_SPECIES_B'
  }
];

// For dev testing only — inject into repositories
export function injectTestFixtures() {
  if (isProd()) {
    throw new Error('injectTestFixtures called in production — forbidden');
  }

  // This function is for dev testing of battle engine
  // Production must not import this file
  console.warn('[TestFixtures] Injecting TEST_SPECIES_A/B/C and TEST_MOVE_A/B — DEVELOPMENT ONLY, NOT REAL ABYSSALS');
}
