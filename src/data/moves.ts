// Provisional moves — data-driven, replaceable
// Follows learnset_rules.json: category PHYSICAL/SPECIAL/STATUS, accuracy bands 100/95/90 or ALWAYS, priority

import { MoveData } from '../core/types';

export const PROVISIONAL_MOVES: Record<string, MoveData> = {
  // Basic moves for starters
  'TACKLE': {
    id: 'TACKLE',
    name: 'Tackle',
    type: 'WILD',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 35,
    priority: 0,
    target: 'SINGLE_OPPONENT',
    description: 'A full-body charge.',
    vfx_type: 'physical_dash'
  },
  'EMBER': {
    id: 'EMBER',
    name: 'Ember',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 25,
    priority: 0,
    target: 'SINGLE_OPPONENT',
    description: 'A small burst of hearth-heat.',
    vfx_type: 'fire'
  },
  'VINE_LASH': {
    id: 'VINE_LASH',
    name: 'Vine Lash',
    type: 'EARTH',
    category: 'PHYSICAL',
    power: 45,
    accuracy: 100,
    pp: 25,
    priority: 0,
    target: 'SINGLE_OPPONENT',
    description: 'Strikes with thorny vines.',
    vfx_type: 'earth'
  },
  'WATER_SPOUT': {
    id: 'WATER_SPOUT',
    name: 'Water Spout',
    type: 'WATER',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 25,
    priority: 0,
    target: 'SINGLE_OPPONENT',
    description: 'A sudden jet of mere-water.',
    vfx_type: 'water'
  },
  'BITE': {
    id: 'BITE',
    name: 'Bite',
    type: 'WILD',
    category: 'PHYSICAL',
    power: 60,
    accuracy: 100,
    pp: 25,
    priority: 0,
    target: 'SINGLE_OPPONENT',
    description: 'Bites with sharp teeth.',
    vfx_type: 'physical_bite'
  },
  'GROWL': {
    id: 'GROWL',
    name: 'Growl',
    type: 'WILD',
    category: 'STATUS',
    accuracy: 'ALWAYS',
    pp: 40,
    priority: 0,
    target: 'SINGLE_OPPONENT',
    description: 'Lowers opponent Attack.',
    vfx_type: 'status_debuff'
  },
  'HARDEN': {
    id: 'HARDEN',
    name: 'Harden',
    type: 'EARTH',
    category: 'STATUS',
    accuracy: 'ALWAYS',
    pp: 30,
    priority: 0,
    target: 'SELF',
    description: 'Raises Defence.',
    vfx_type: 'status_buff'
  },
  'PLAIN_DASH': {
    id: 'PLAIN_DASH',
    name: 'Plain Dash',
    type: 'WILD',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 1, // +1 priority per canon
    target: 'SINGLE_OPPONENT',
    description: 'A swift, unadorned charge.',
    vfx_type: 'physical_dash_fast'
  },
  'FROST_SHARD': {
    id: 'FROST_SHARD',
    name: 'Frost Shard',
    type: 'WATER', // or ICE but using WATER for provisional
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 1,
    target: 'SINGLE_OPPONENT',
    description: 'A shard of cold, thrown quickly.',
    vfx_type: 'ice'
  },
  'SHADOW_CLAW': {
    id: 'SHADOW_CLAW',
    name: 'Shadow Claw',
    type: 'SHADOW',
    category: 'PHYSICAL',
    power: 70,
    accuracy: 100,
    pp: 15,
    priority: 0,
    target: 'SINGLE_OPPONENT',
    description: 'Claws from shadow.',
    vfx_type: 'shadow'
  }
};

export function getMove(id: string): MoveData | undefined {
  return PROVISIONAL_MOVES[id];
}

// Starter learnsets — provisional, level 5 start
export const STARTER_LEARNSETS: Record<string, string[]> = {
  'PROV-STARTER-01': ['TACKLE', 'VINE_LASH', 'GROWL', 'HARDEN'],
  'PROV-STARTER-02': ['TACKLE', 'EMBER', 'GROWL', 'PLAIN_DASH'],
  'PROV-STARTER-03': ['TACKLE', 'WATER_SPOUT', 'HARDEN', 'FROST_SHARD'],
  'PROV-OPPONENT-01': ['TACKLE', 'BITE', 'GROWL'],
  'PROV-OPPONENT-02': ['TACKLE', 'HARDEN', 'SHADOW_CLAW']
};
