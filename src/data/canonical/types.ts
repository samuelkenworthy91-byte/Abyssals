// Canonical data types — stable identifiers, no invented content

export interface CanonicalSpecies {
  id: string; // stable canonical ID, e.g., "ABY-001" or similar
  name: string;
  types: string[]; // primary, secondary — from TypeRepository
  base_stats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  bst: number;
  description?: string;
  evolution?: {
    evolves_to?: string;
    level?: number;
    item?: string;
    condition?: string;
  };
  sprite_key: string; // for asset resolution species_id -> front_sprite_path
  is_starter?: boolean; // true for the three canonical starters
}

export interface CanonicalMove {
  id: string;
  name: string;
  type: string; // from TypeRepository
  category: 'PHYSICAL' | 'SPECIAL' | 'STATUS';
  power?: number;
  accuracy: number | 'ALWAYS';
  pp: number;
  priority: number;
  target: string;
  effect?: string;
  vfx_category?: string;
  description?: string;
}

export interface CanonicalType {
  id: string; // e.g., "FIRE", "WATER", etc. — 18 types per canon
  name: string;
  // Type interactions — from canonical data, not hard-coded placeholder
  effectiveness?: Record<string, number>; // vs other types
}

export interface CanonicalLearnset {
  species_id: string;
  moves: {
    move_id: string;
    level?: number;
    method: 'LEVEL_UP' | 'EVOLUTION' | 'TUTOR' | 'ITEM';
  }[];
}

export interface CanonicalTrainer {
  id: string; // e.g., "KURG_TEST_RECRUIT"
  name: string;
  class: string;
  team: {
    species_id: string;
    level: number;
    moves?: string[];
    item?: string;
  }[];
  is_leader?: boolean;
  leader_code?: string;
}

export interface StarterAssignmentRule {
  player_species_id: string;
  pate_species_id: string;
  trade_species_id: string;
}

export interface AssetManifestEntry {
  species_id: string;
  species_name: string;
  front_sprite_path: string; // e.g., "assets/production/abyssals/ABY-001.png"
  icon_path?: string;
  portrait_id?: string;
  portrait_path?: string;
}

export interface CanonicalAssetManifest {
  species: AssetManifestEntry[];
  portraits: {
    id: string;
    name: string;
    path: string;
  }[];
  environments?: {
    id: string;
    path: string;
  }[];
}
