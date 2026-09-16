// Abyssals — Core Types (LOCKED canon compatible)
// Implements state_model.json, core_rules.json, and task requirements

export type ChapterState = 'LOCKED' | 'AVAILABLE' | 'STARTED' | 'COMPLETE';
export type TownState = 'UNREACHED' | 'CONTESTED' | 'CONQUERED' | 'RESTORING' | 'RESTORED';
export type LeaderFate = 'UNRESOLVED' | 'SPARED' | 'EXECUTED';
export type HumanLifeState = 'ALIVE' | 'DEAD' | 'REVIVED';
export type StoryEventId = string; // e.g., CH01-E05
export type SpeciesId = string;
export type MoveId = string;
export type TrainerId = string;
export type MapId = string;

export interface SpeciesData {
  id: SpeciesId;
  name: string;
  // Provisional: real dex has 187, we have 3+1
  types: string[]; // primary, secondary
  base_stats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  bst: number;
  growth_seed?: number;
  description: string;
  is_provisional?: boolean;
  evolution?: {
    evolves_to?: SpeciesId;
    level?: number;
  };
  // sprite key
  sprite_key: string;
}

export interface MoveData {
  id: MoveId;
  name: string;
  type: string;
  category: 'PHYSICAL' | 'SPECIAL' | 'STATUS';
  power?: number;
  accuracy: number | 'ALWAYS';
  pp: number;
  priority: number; // 0 default, 1 for Plain Dash, Frost Shard
  target: string; // explicit enum per learnset_rules
  description: string;
  vfx_type?: string; // for battle presentation
}

export interface AbyssalInstance {
  instance_id: string; // unique
  species_id: SpeciesId;
  nickname?: string;
  level: number;
  xp: number; // 100 per level
  // seeded growth
  growth_seed: number;
  ivs?: { // provisional, but per FE-style
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  // calculated stats
  max_hp: number;
  current_hp: number;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  moves: MoveId[]; // up to 4
  pp: Record<MoveId, number>;
  status?: string | null;
  // starter three-life system — only for original three instances
  is_original_starter?: boolean;
  starter_lives_remaining?: number; // 3 initial, only for original starters
  original_owner?: 'AIMON' | 'PATE' | 'TRADE';
  // persistence
  is_dead?: boolean; // ordinary lethal
  death_info?: {
    place: string;
    chapter: number;
    order: number;
  };
}

export interface TrainerData {
  id: TrainerId;
  name: string;
  class: string;
  team: SpeciesId[]; // species ids, but for slice we use instances
  level: number;
  is_provisional?: boolean;
}

export interface StoryEvent {
  id: StoryEventId;
  chapter: number;
  title: string;
  description: string;
  // lower_snake_case flags
  flags_required?: string[];
  flags_set?: string[];
  is_mandatory: boolean;
  // For CH01-E05 starter choice
  is_starter_choice?: boolean;
}

export interface GameState {
  // meta
  version: number;
  commit_seq: number; // monotonic
  slot_id: number; // 0,1,2
  // protagonist
  protagonist_name: string; // renamable, default Aimon
  protagonist_id: 'CHR-AIMON';
  // story
  current_chapter: number;
  chapter_states: ChapterState[]; // 0..23
  town_states: Record<string, TownState>; // e.g., Civeton
  story_flags: Record<string, boolean>; // lower_snake_case
  completed_events: StoryEventId[];
  current_event_id?: StoryEventId;
  current_map_id: MapId;
  player_position: { x: number; y: number; map_id: MapId };
  // starters
  player_starter_species_id?: SpeciesId;
  pate_starter_species_id?: SpeciesId;
  trade_starter_species_id?: SpeciesId;
  // starter instances (the three original individuals)
  starter_instances?: {
    aimon?: AbyssalInstance;
    pate?: AbyssalInstance;
    trade?: AbyssalInstance;
  };
  // party
  party: AbyssalInstance[]; // max 6
  reserve: AbyssalInstance[]; // unlimited
  // battle
  first_battle_result?: 'WIN' | 'LOSS' | 'TUTORIAL_WIN';
  // misc
  money: number; // starting 2000 per ACTIVE_CANON
  // journal for crash safety (simplified)
  journal: {
    last_transaction_id: string;
    last_commit_seq: number;
    entries: { tx_id: string; seq: number; timestamp: number; description: string }[];
  };
  // recovery generations (hidden)
  recovery_generations?: GameState[]; // simplified
  // timestamp
  last_saved: number;
}

export interface MapData {
  id: MapId;
  name: string;
  width: number; // in tiles (16x16 logic grid)
  height: number;
  tiles: number[][]; // 0 = walkable, 1 = blocked, etc.
  // rendering layers provisional
  decoration?: any[];
  npcs: NpcData[];
  triggers: TriggerData[];
  warps: WarpData[];
}

export interface NpcData {
  id: string;
  name: string;
  x: number;
  y: number;
  portrait_id?: string;
  dialogue_id: string;
  is_important?: boolean;
  facing?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

export interface TriggerData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  event_id: StoryEventId;
  one_shot?: boolean;
}

export interface WarpData {
  id: string;
  x: number;
  y: number;
  target_map: MapId;
  target_x: number;
  target_y: number;
}

export interface DialogueData {
  id: string;
  speaker: string;
  speaker_id: string;
  portrait_key?: string;
  text: string[];
  // canonical wording preserved where available
  is_canonical?: boolean;
}

export interface BattleState {
  battle_id: string;
  is_tutorial: boolean;
  player_team: AbyssalInstance[];
  enemy_team: AbyssalInstance[];
  enemy_trainer?: TrainerData;
  current_player_index: number;
  current_enemy_index: number;
  turn: number;
  log: string[];
  is_over: boolean;
  result?: 'WIN' | 'LOSS' | 'TUTORIAL_WIN';
  // RNG seed for deterministic
  rng_seed: number;
  // starter life pending returns
  pending_starter_returns?: { instance_id: string; return_hp: number }[];
}

// Lower snake_case flag names per spec
export const STORY_FLAGS = {
  childhood_complete: 'childhood_complete',
  civeton_arrived: 'civeton_arrived',
  pate_house_checked: 'pate_house_checked',
  trade_message_found: 'trade_message_found',
  kurg_first_talk: 'kurg_first_talk',
  kurg_refused: 'kurg_refused',
  kurg_revealed_request: 'kurg_revealed_request',
  starter_choice_available: 'starter_choice_available',
  starter_chosen: 'starter_chosen',
  first_battle_available: 'first_battle_available',
  first_battle_complete: 'first_battle_complete',
  post_battle_return: 'post_battle_return',
} as const;

export const STORY_EVENTS: StoryEvent[] = [
  {
    id: 'CH01-E01',
    chapter: 1,
    title: 'Childhood Opening',
    description: 'Establish Aimon, Pate, Trade relationship via toy-battle',
    flags_set: ['childhood_complete'],
    is_mandatory: true
  },
  {
    id: 'CH01-E02',
    chapter: 1,
    title: 'Waking in Civeton',
    description: 'Years later, Aimon wakes in Civeton, crusade begun',
    flags_required: ['childhood_complete'],
    flags_set: ['civeton_arrived'],
    is_mandatory: true
  },
  {
    id: 'CH01-E03',
    chapter: 1,
    title: 'Pate Gone',
    description: 'Pate house empty',
    flags_required: ['civeton_arrived'],
    flags_set: ['pate_house_checked'],
    is_mandatory: true
  },
  {
    id: 'CH01-E04',
    chapter: 1,
    title: 'Trade Message and Kurg',
    description: 'Trade message Dont follow us, Kurg refusal and revelation',
    flags_required: ['pate_house_checked'],
    flags_set: ['trade_message_found', 'kurg_first_talk', 'kurg_refused', 'kurg_revealed_request', 'starter_choice_available'],
    is_mandatory: true
  },
  {
    id: 'CH01-E05',
    chapter: 1,
    title: 'Starter Choice',
    description: 'Canonical starter choice event',
    flags_required: ['starter_choice_available'],
    flags_set: ['starter_chosen', 'first_battle_available'],
    is_mandatory: true,
    is_starter_choice: true
  },
  {
    id: 'CH01-E06',
    chapter: 1,
    title: 'Kurg Soldier Test',
    description: 'First real Abyssal battle, tutorial',
    flags_required: ['starter_chosen'],
    flags_set: ['first_battle_complete'],
    is_mandatory: true
  },
  {
    id: 'CH01-E07',
    chapter: 1,
    title: 'Post-Battle Civeton',
    description: 'Return to exploration/story state after first battle',
    flags_required: ['first_battle_complete'],
    flags_set: ['post_battle_return'],
    is_mandatory: true
  }
];
