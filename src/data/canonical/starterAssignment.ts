// StarterAssignment — explicit canonical table, no invented cyclic rule
// Populated only from authoritative project data

import { StarterAssignmentRule } from './types';
import { isProd } from '../../core/env';

export class StarterAssignmentRepository {
  private assignments: Map<string, StarterAssignmentRule> = new Map(); // keyed by player_species_id
  private loaded: boolean = false;
  private loadError: string | null = null;

  constructor() {
    try {
      this.load();
    } catch (e: any) {
      this.loadError = e.message;
      console.warn('[StarterAssignment] Failed to load:', e.message);
    }
  }

  private load() {
    // Canonical assignment rule should be from Story Bible / Starter spec
    // Per task: "Populate it only from authoritative project data."
    // Currently not available in handoff — fail clearly, don't guess

    this.loaded = false;
    this.loadError = 'Canonical starter assignment table not yet imported — expected from Story Bible / Starter spec. Must define explicit mapping player->Pate->Trade. See ORIGINAL_SOURCE_INVENTORY.md';

    // If we had data, we would do:
    // const data = await import('../../data/canon/starter_assignment.json')
    // data.forEach(rule => this.assignments.set(rule.player_species_id, rule))
    // this.loaded = true
  }

  _injectTestData(rules: StarterAssignmentRule[]) {
    if (isProd()) {
      throw new Error('[StarterAssignment] _injectTestData in production forbidden');
    }
    rules.forEach(r => this.assignments.set(r.player_species_id, r));
    this.loaded = true;
    this.loadError = null;
  }

  getAssignment(playerSpeciesId: string): StarterAssignmentRule {
    const rule = this.assignments.get(playerSpeciesId);
    if (!rule) {
      throw new Error(`[StarterAssignment] No assignment for player species ${playerSpeciesId}. ${this.loadError} Production must not use fabricated cyclic rule Pate=N+1 Trade=N+2.`);
    }
    return rule;
  }

  getAll(): StarterAssignmentRule[] {
    return Array.from(this.assignments.values());
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
      errors.push(`StarterAssignment not loaded: ${this.loadError}`);
      return { ok: false, errors };
    }

    // Check completeness — each player starter should have Pate and Trade
    for (const [playerId, rule] of this.assignments) {
      if (!rule.pate_species_id || !rule.trade_species_id) {
        errors.push(`Incomplete assignment for ${playerId}`);
      }
      if (rule.pate_species_id === rule.trade_species_id || rule.pate_species_id === playerId || rule.trade_species_id === playerId) {
        errors.push(`Assignment for ${playerId} has duplicate species — must be 3 distinct`);
      }
    }

    // Check for forbidden cyclic rule marker
    // The old code had comment "Pate = N+1 Trade = N+2" — we removed that, but validator ensures no PROV-*
    for (const rule of this.assignments.values()) {
      if (rule.player_species_id.startsWith('PROV-') || rule.pate_species_id.startsWith('PROV-') || rule.trade_species_id.startsWith('PROV-')) {
        errors.push(`Forbidden provisional ID in starter assignment: ${JSON.stringify(rule)}`);
      }
    }

    return { ok: errors.length === 0, errors };
  }
}

export const starterAssignmentRepository = new StarterAssignmentRepository();
