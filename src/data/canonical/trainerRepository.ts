// TrainerRepository — canonical trainer data, no invented teams

import { CanonicalTrainer } from './types';
import { isProd } from '../../core/env';

export class TrainerRepository {
  private trainers: Map<string, CanonicalTrainer> = new Map();
  private loaded: boolean = false;
  private loadError: string | null = null;

  constructor() {
    try {
      this.load();
    } catch (e: any) {
      this.loadError = e.message;
      console.warn('[TrainerRepository] Failed to load:', e.message);
    }
  }

  private load() {
    // Trainer Database is Checklist 04 locked source per ORIGINAL_SOURCE_INVENTORY
    // Not present in handoff — fail clearly, don't invent
    this.loaded = false;
    this.loadError = 'Canonical trainer dataset not yet imported — Trainer Database Checklist 04 locked source expected at data/canon/trainers.json or data/runtime/trainers/. See ORIGINAL_SOURCE_INVENTORY.md';
  }

  _injectTestData(trainers: CanonicalTrainer[]) {
    if (isProd()) {
      throw new Error('[TrainerRepository] _injectTestData in production forbidden');
    }
    trainers.forEach(t => this.trainers.set(t.id, t));
    this.loaded = true;
    this.loadError = null;
  }

  exists(id: string): boolean {
    return this.trainers.has(id);
  }

  get(id: string): CanonicalTrainer {
    const t = this.trainers.get(id);
    if (!t) {
      throw new Error(`[TrainerRepository] Trainer not found: ${id}. ${this.loadError} If exact Trainer DB entry not available, keep binding unresolved as KURG_TEST_RECRUIT, don't silently substitute invented team.`);
    }
    return t;
  }

  getAll(): CanonicalTrainer[] {
    return Array.from(this.trainers.values());
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
      errors.push(`TrainerRepository not loaded: ${this.loadError}`);
      return { ok: false, errors };
    }

    for (const trainer of this.trainers.values()) {
      for (const member of trainer.team) {
        if (member.species_id.startsWith('PROV-')) {
          errors.push(`Forbidden provisional species in trainer ${trainer.id}: ${member.species_id}`);
        }
      }
    }

    return { ok: errors.length === 0, errors };
  }
}

export const trainerRepository = new TrainerRepository();
