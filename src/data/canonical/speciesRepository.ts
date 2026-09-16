// SpeciesRepository — loads canonical species data from authoritative source
// Production runtime must assume all Abyssals originate from canonical dataset
// No invented species — missing data is dependency to resolve, not permission to invent

import { CanonicalSpecies, AssetManifestEntry } from './types';
import { isProd } from '../../core/env';

export class SpeciesRepository {
  private species: Map<string, CanonicalSpecies> = new Map();
  private loaded: boolean = false;
  private loadError: string | null = null;

  constructor() {
    // Attempt to load canonical data — if missing, fail clearly in development
    try {
      this.load();
    } catch (e: any) {
      this.loadError = e.message;
      console.warn('[SpeciesRepository] Failed to load canonical species:', e.message);
    }
  }

  private load() {
    // Try to import canonical species data from various possible locations
    // The actual 187-species dataset should be placed at one of these paths per ORIGINAL_SOURCE_INVENTORY
    // For now, we check for existence and throw clear error if missing

    // In production, this should load from validated canonical source:
    // - data/canon/species.json
    // - data/runtime/species.json
    // - assets/production/abyssals/ manifest
    // For this slice, we have no canonical species data in repo (per handoff limitation)
    // So we intentionally do NOT invent — we mark as not loaded and let validation fail clearly

    // Attempt to load from handoff data if available (but handoff only has summary, not full dex)
    // The real dex is 187 species — we have 0 in this runtime

    // For development, we allow empty but mark as not loaded
    // Production validator will catch this

    this.loaded = false;
    this.loadError = 'Canonical species dataset not yet imported — see docs/ANDROID_BUILD.md and ORIGINAL_SOURCE_INVENTORY.md. Expected at data/canon/species.json or data/runtime/species/ with 187 entries.';

    // If we had canonical data, we would do:
    // const data = await import('../../data/canon/species.json')
    // data.forEach(s => this.species.set(s.id, s))
    // this.loaded = true
  }

  // For testing — allow injection of test data that is clearly not production
  // Production code must NOT use this — only test fixtures
  _injectTestData(species: CanonicalSpecies[]) {
    if (isProd()) {
      throw new Error('[SpeciesRepository] _injectTestData called in production — forbidden');
    }
    species.forEach(s => this.species.set(s.id, s));
    this.loaded = true;
    this.loadError = null;
  }

  exists(id: string): boolean {
    return this.species.has(id);
  }

  get(id: string): CanonicalSpecies {
    const s = this.species.get(id);
    if (!s) {
      throw new Error(`[SpeciesRepository] Species not found: ${id}. ${this.loadError || 'No data loaded.'} Production must not use invented species.`);
    }
    return s;
  }

  getAll(): CanonicalSpecies[] {
    return Array.from(this.species.values());
  }

  getStarters(): CanonicalSpecies[] {
    const starters = this.getAll().filter(s => s.is_starter);
    if (starters.length === 0 && !this.loaded) {
      throw new Error(`[SpeciesRepository] No starters found — canonical starter data not yet imported. ${this.loadError}`);
    }
    return starters;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  getLoadError(): string | null {
    return this.loadError;
  }

  // Validation helper
  validate(): { ok: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.loaded) {
      errors.push(`SpeciesRepository not loaded: ${this.loadError}`);
      return { ok: false, errors };
    }

    // Check for forbidden invented IDs
    for (const id of this.species.keys()) {
      if (id.startsWith('PROV-')) {
        errors.push(`Forbidden provisional species ID in production: ${id}`);
      }
      if (['Bramblekin', 'Emberling', 'Tidemaw', 'Hollow Hound', 'Gloam Mite'].includes(id)) {
        errors.push(`Forbidden fake species name in production: ${id}`);
      }
    }

    // Check all have front sprite
    // This would check asset manifest in real implementation

    return { ok: errors.length === 0, errors };
  }
}

// Singleton for production
export const speciesRepository = new SpeciesRepository();
