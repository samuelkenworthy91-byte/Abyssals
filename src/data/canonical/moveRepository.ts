// MoveRepository — canonical move data, no invented moves

import { CanonicalMove } from './types';
import { isProd } from '../../core/env';

export class MoveRepository {
  private moves: Map<string, CanonicalMove> = new Map();
  private loaded: boolean = false;
  private loadError: string | null = null;

  constructor() {
    try {
      this.load();
    } catch (e: any) {
      this.loadError = e.message;
      console.warn('[MoveRepository] Failed to load:', e.message);
    }
  }

  private load() {
    // Canonical move data should be at data/canon/moves.json or similar
    // For now, not present — fail clearly, don't invent
    this.loaded = false;
    this.loadError = 'Canonical move dataset not yet imported — expected at data/canon/moves.json. See ORIGINAL_SOURCE_INVENTORY.md.';
  }

  _injectTestData(moves: CanonicalMove[]) {
    if (isProd()) {
      throw new Error('[MoveRepository] _injectTestData in production forbidden');
    }
    moves.forEach(m => this.moves.set(m.id, m));
    this.loaded = true;
    this.loadError = null;
  }

  exists(id: string): boolean {
    return this.moves.has(id);
  }

  get(id: string): CanonicalMove {
    const m = this.moves.get(id);
    if (!m) {
      throw new Error(`[MoveRepository] Move not found: ${id}. ${this.loadError}`);
    }
    return m;
  }

  getAll(): CanonicalMove[] {
    return Array.from(this.moves.values());
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
      errors.push(`MoveRepository not loaded: ${this.loadError}`);
      return { ok: false, errors };
    }

    // Check for forbidden invented moves that were in previous prototype
    const forbidden = ['TACKLE', 'EMBER', 'GROWL', 'HARDEN', 'BITE', 'VINE_LASH', 'WATER_SPOUT', 'FROST_SHARD', 'SHADOW_CLAW', 'PLAIN_DASH'];
    for (const id of this.moves.keys()) {
      if (forbidden.includes(id)) {
        // Only forbid if not confirmed canonical — for now we treat as forbidden unless canonical dataset confirms
        // In real validation, we would check against canonical move list
        // For this pass, we allow them only if injected as test data in dev, but production validator will check
        if (isProd()) {
          errors.push(`Potentially invented move in production: ${id} — must be confirmed from canonical dataset`);
        }
      }
      if (id.startsWith('PROV-')) {
        errors.push(`Forbidden provisional move ID: ${id}`);
      }
    }

    return { ok: errors.length === 0, errors };
  }
}

export const moveRepository = new MoveRepository();
