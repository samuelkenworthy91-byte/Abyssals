// Asset Manifest — species ID -> front_sprite_path, portrait ID -> path, etc.
// Distinguishes production assets, temporary environmental assets, missing canonical asset

import { CanonicalAssetManifest, AssetManifestEntry } from './types';
import { isProd } from '../../core/env';

export class AssetManifest {
  private manifest: CanonicalAssetManifest = { species: [], portraits: [] };
  private loaded: boolean = false;
  private loadError: string | null = null;

  constructor() {
    try {
      this.load();
    } catch (e: any) {
      this.loadError = e.message;
      console.warn('[AssetManifest] Failed to load:', e.message);
    }
  }

  private load() {
    // Canonical asset manifest should list 187 species front sprites and 100+ portraits
    // Per ORIGINAL_SOURCE_INVENTORY: finished species sprites -> assets/production/abyssals/
    // Raw human portrait originals -> assets/generated/characters/
    // Cleaned -> assets/production/characters/

    // Currently no real sprites in repo (handoff had .gitkeep)
    // So we fail clearly, don't silently generate fake creatures

    this.loaded = false;
    this.loadError = 'Canonical asset manifest not yet imported — 187 front sprites expected at assets/production/abyssals/, portraits at assets/production/characters/. See ORIGINAL_SOURCE_INVENTORY.md';

    // If we had data, we would load from assets manifest JSON
  }

  _injectTestData(manifest: CanonicalAssetManifest) {
    if (isProd()) {
      throw new Error('[AssetManifest] _injectTestData in production forbidden');
    }
    this.manifest = manifest;
    this.loaded = true;
    this.loadError = null;
  }

  getSpeciesSprite(speciesId: string): string {
    const entry = this.manifest.species.find(s => s.species_id === speciesId);
    if (!entry) {
      throw new Error(`[AssetManifest] No sprite for species ${speciesId}. ${this.loadError} Missing canonical asset is development error requiring correction, not silent fake generation.`);
    }
    return entry.front_sprite_path;
  }

  getPortrait(portraitId: string): string {
    const entry = this.manifest.portraits.find(p => p.id === portraitId);
    if (!entry) {
      throw new Error(`[AssetManifest] No portrait for ${portraitId}. ${this.loadError}`);
    }
    return entry.path;
  }

  // For development — neutral missing-asset debugging tile acceptable only in dev builds
  getMissingAssetTile(): string {
    if (isProd()) {
      throw new Error('[AssetManifest] Missing asset tile requested in production — must fail clearly');
    }
    return 'MISSING_ASSET_DEBUG_TILE';
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  getLoadError(): string | null {
    return this.loadError;
  }

  validate(): { ok: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.loaded) {
      errors.push(`AssetManifest not loaded: ${this.loadError}`);
      return { ok: false, errors };
    }

    // Check for PROV-* etc.
    for (const entry of this.manifest.species) {
      if (entry.species_id.startsWith('PROV-')) {
        errors.push(`Forbidden provisional species in asset manifest: ${entry.species_id}`);
      }
    }

    return { ok: errors.length === 0, errors };
  }

  // Distinguish production vs temporary environmental vs missing
  getAssetType(path: string): 'PRODUCTION' | 'TEMP_ENV' | 'MISSING' {
    if (path.includes('assets/production/abyssals/') || path.includes('assets/production/characters/')) {
      return 'PRODUCTION';
    }
    if (path.includes('assets/generated/') || path.includes('tileset') || path.includes('environment')) {
      return 'TEMP_ENV';
    }
    return 'MISSING';
  }
}

export const assetManifest = new AssetManifest();
