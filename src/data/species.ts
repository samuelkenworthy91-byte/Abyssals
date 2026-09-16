// Species data — canonical repository wrapper
// Production runtime must assume all Abyssals originate from canonical dataset
// No invented species — missing data is dependency to resolve, not permission to invent
// Real 187-species dataset should be imported via SpeciesRepository

import { speciesRepository } from './canonical/speciesRepository';
import { CanonicalSpecies } from './canonical/types';
import { isProd } from '../core/env';

// Re-export for compatibility, but now uses canonical repository
// If canonical data not loaded, throws clear error — development-blocked, not fake creature

export function getSpecies(id: string) {
  return speciesRepository.get(id);
}

export function getAllSpecies(): CanonicalSpecies[] {
  return speciesRepository.getAll();
}

export function getStarters(): CanonicalSpecies[] {
  return speciesRepository.getStarters();
}

export function exists(id: string): boolean {
  return speciesRepository.exists(id);
}

export function isLoaded(): boolean {
  return speciesRepository.isLoaded();
}

export function getLoadError(): string | null {
  return speciesRepository.getLoadError();
}

// For dev testing only — injection point for TEST_SPECIES_A etc., clearly excluded from production
export function _injectTestSpeciesForDev(species: CanonicalSpecies[]) {
  if (isProd()) {
    throw new Error('_injectTestSpeciesForDev in production forbidden');
  }
  speciesRepository._injectTestData(species);
}

// Legacy exports that were previously provisional — now removed
// These will cause validation to fail if still referenced
export const PROVISIONAL_SPECIES: Record<string, any> = {};
export const STARTER_IDS: string[] = [];

// Growth seed generation per individual — retained, not invented content
export function generateGrowthSeed(speciesId: string, instanceId: string): number {
  let hash = 0;
  const str = speciesId + instanceId;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 0x7FFFFFFF;
}
