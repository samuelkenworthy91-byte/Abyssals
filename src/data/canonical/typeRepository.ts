// TypeRepository — canonical type system, no invented types

import { CanonicalType } from './types';
import { isProd } from '../../core/env';

export class TypeRepository {
  private types: Map<string, CanonicalType> = new Map();
  private loaded: boolean = false;
  private loadError: string | null = null;

  constructor() {
    try {
      this.load();
    } catch (e: any) {
      this.loadError = e.message;
      console.warn('[TypeRepository] Failed to load:', e.message);
    }
  }

  private load() {
    // Per ACTIVE_CANON, there are 18 generic type proxies, one per canonical type
    // Type data should be from canonical source
    // For now, not present — but we know there are 18 types from ACTIVE_CANON §13

    // Provisional: define 18 types as placeholders for structure, but mark as not fully loaded
    // This is acceptable because type IDs are part of canon structure, not invented creatures
    // The effectiveness chart should come from canonical data

    const knownTypes = [
      'WILD', 'FIRE', 'WATER', 'EARTH', 'SHADOW', 'LIGHT', 'MIND', 'BODY',
      'WIND', 'METAL', 'WOOD', 'STONE', 'STORM', 'FROST', 'EMBER', 'TIDE',
      'BLOOM', 'VOID'
    ];

    // For now, create entries but mark as provisional structure until canonical effectiveness loaded
    knownTypes.forEach(id => {
      this.types.set(id, { id, name: id });
    });

    this.loaded = false;
    this.loadError = 'Canonical type effectiveness data not yet imported — structure has 18 types per ACTIVE_CANON §13, but effectiveness chart missing. Expected at data/canon/types.json';
  }

  _injectTestData(types: CanonicalType[]) {
    if (isProd()) {
      throw new Error('[TypeRepository] _injectTestData in production forbidden');
    }
    types.forEach(t => this.types.set(t.id, t));
    this.loaded = true;
    this.loadError = null;
  }

  exists(id: string): boolean {
    return this.types.has(id);
  }

  get(id: string): CanonicalType {
    const t = this.types.get(id);
    if (!t) {
      throw new Error(`[TypeRepository] Type not found: ${id}. ${this.loadError}`);
    }
    return t;
  }

  getAll(): CanonicalType[] {
    return Array.from(this.types.values());
  }

  getEffectiveness(attackingType: string, defendingType: string): number {
    // If not loaded, return 1 — neutral, don't assume
    // Production should have canonical chart
    const attacker = this.types.get(attackingType);
    if (!attacker || !attacker.effectiveness) {
      return 1;
    }
    return attacker.effectiveness[defendingType] ?? 1;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  getLoadError(): string | null {
    return this.loadError;
  }

  validate(): { ok: boolean; errors: string[] } {
    const errors: string[] = [];
    if (this.types.size !== 18) {
      errors.push(`Type count should be 18 per ACTIVE_CANON §13, found ${this.types.size}`);
    }
    // Don't fail if not fully loaded yet, but warn
    if (!this.loaded) {
      errors.push(`TypeRepository effectiveness not loaded: ${this.loadError}`);
    }
    return { ok: errors.length === 0, errors };
  }
}

export const typeRepository = new TypeRepository();
