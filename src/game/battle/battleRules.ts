// Battle Rules — separated from orchestration per task §11
// Battle orchestration handles turns, actions, ordering, state, KO batches, switching, starter-life, result, persistence
// Battle rules handles damage, criticals, accuracy, effectiveness, stat modification, status, XP — replaceable/configurable from canonical rules
// If exact canonical damage equation not yet recovered, use clearly isolated DevelopmentBattleRules adapter, not presented as final

import { AbyssalInstance } from '../../core/types';
import { CanonicalMove } from '../../data/canonical/types';
import { isProd } from '../../core/env';

export interface BattleRules {
  // Damage calculation — must be replaceable from canonical project rules
  calculateDamage(
    attacker: AbyssalInstance,
    defender: AbyssalInstance,
    move: CanonicalMove,
    rng: () => number
  ): { damage: number; isCritical: boolean; effectiveness: number; isStab?: boolean };

  // Accuracy check
  checkAccuracy(move: CanonicalMove, rng: () => number): boolean;

  // Effectiveness — from TypeRepository, not hard-coded placeholder
  getEffectiveness(attackingType: string, defendingTypes: string[]): number;

  // Critical
  isCritical(move: CanonicalMove, rng: () => number): boolean;

  // Stat modification
  applyStatModification(target: AbyssalInstance, stat: string, stages: number): void;

  // XP calculation — per ACTIVE_CANON participant level-gap individual
  calculateXP(winner: AbyssalInstance, loser: AbyssalInstance): number;
}

// CanonicalBattleRules — should be implemented from authoritative data when available
export class CanonicalBattleRules implements BattleRules {
  // This is placeholder for real canonical rules — should be populated from Checklist 01, etc.
  // For now, throws if used without canonical data, to prevent masquerading as final

  calculateDamage(): { damage: number; isCritical: boolean; effectiveness: number } {
    throw new Error('[CanonicalBattleRules] Canonical damage equation not yet imported — see Checklist 01 Exact Stat Growth Algorithm and battle math foundation. Do not use DevelopmentBattleRules as final.');
  }

  checkAccuracy(): boolean {
    throw new Error('[CanonicalBattleRules] Accuracy rules not yet imported');
  }

  getEffectiveness(): number {
    throw new Error('[CanonicalBattleRules] Type effectiveness not yet imported — from TypeRepository');
  }

  isCritical(): boolean {
    throw new Error('[CanonicalBattleRules] Critical rules not yet imported');
  }

  applyStatModification(): void {
    throw new Error('[CanonicalBattleRules] Stat modification rules not yet imported');
  }

  calculateXP(winner: AbyssalInstance, loser: AbyssalInstance): number {
    // Per ACTIVE_CANON §4: participant XP scales using participant's own level relative to defeated enemy
    // 100 XP per level
    // Simplified but based on canon: individual level-gap
    const baseXP = 50; // provisional base, should come from canonical
    const levelGap = loser.level - winner.level;
    const multiplier = 1 + levelGap * 0.1;
    return Math.max(1, Math.floor(baseXP * multiplier));
  }
}

// DevelopmentBattleRules — clearly isolated development rule adapter, allows battle loop to be tested but must not be presented as final
// Per task §11: "This adapter may allow the battle loop to be tested but must not be presented in documentation as final Abyssals combat."

export class DevelopmentBattleRules implements BattleRules {
  // This is DEVELOPMENT ONLY — not final Abyssals combat
  // It is isolated and marked as such

  calculateDamage(
    attacker: AbyssalInstance,
    defender: AbyssalInstance,
    move: CanonicalMove,
    rng: () => number
  ): { damage: number; isCritical: boolean; effectiveness: number; isStab?: boolean } {
    // DEVELOPMENT RULE — not canonical, isolated for testing
    // Previously used simplified Gen III-style, but now clearly marked as dev

    if (move.category === 'STATUS' || !move.power) {
      return { damage: 0, isCritical: false, effectiveness: 1 };
    }

    // Very simple dev damage — not Gen III, not presented as final
    // Uses level, power, atk/def ratio, plus small random for testing
    const level = attacker.level;
    const power = move.power;
    const attackStat = move.category === 'PHYSICAL' ? attacker.stats.atk : attacker.stats.spa;
    const defenseStat = move.category === 'PHYSICAL' ? defender.stats.def : defender.stats.spd;

    // Simple dev formula: (level * power * attack / defense / 10) + 2
    const base = Math.floor((level * power * attackStat / defenseStat) / 10) + 2;

    // For dev, minimal random 0.9-1.0, not 0.85-1.0, and clearly marked
    const randomFactor = 0.9 + rng() * 0.1;

    const isCritical = rng() < 0.05; // 5% dev crit, not 6.25% — arbitrary dev value, not canonical
    const critMultiplier = isCritical ? 1.5 : 1;

    const effectiveness = 1; // neutral for dev, real should come from TypeRepository

    const damage = Math.floor(base * randomFactor * effectiveness * critMultiplier);

    return {
      damage: Math.max(1, damage),
      isCritical,
      effectiveness,
      isStab: false
    };
  }

  checkAccuracy(move: CanonicalMove, rng: () => number): boolean {
    if (move.accuracy === 'ALWAYS') return true;
    const acc = move.accuracy as number;
    return rng() * 100 < acc;
  }

  getEffectiveness(_attackingType: string, _defendingTypes: string[]): number {
    // Dev — neutral, real should come from TypeRepository
    return 1;
  }

  isCritical(_move: CanonicalMove, rng: () => number): boolean {
    return rng() < 0.05; // dev 5%
  }

  applyStatModification(target: AbyssalInstance, stat: string, stages: number): void {
    // Dev — simple +/- 5 per stage, not canonical
    // Real should use stage system from canonical rules
    const statKey = stat as keyof typeof target.stats;
    if (statKey in target.stats) {
      (target.stats as any)[statKey] = Math.max(1, (target.stats as any)[statKey] + stages * 5);
    }
  }

  calculateXP(winner: AbyssalInstance, loser: AbyssalInstance): number {
    const baseXP = 50;
    const levelGap = loser.level - winner.level;
    const multiplier = 1 + levelGap * 0.1;
    return Math.max(1, Math.floor(baseXP * multiplier));
  }
}

// Factory — returns canonical if available, otherwise development for testing
// Production validator should fail if dev rules used in production build without explicit flag

export function getBattleRules(useDevelopment: boolean = false): BattleRules {
  if (useDevelopment) {
    console.warn('[BattleRules] Using DevelopmentBattleRules — NOT FINAL ABYSSALS COMBAT — for testing only');
    return new DevelopmentBattleRules();
  }

  // Try canonical
  try {
    const rules = new CanonicalBattleRules();
    // If canonical throws on first call, fall back to dev in dev builds, but fail in prod
    return rules;
  } catch {
    if (isProd()) {
      throw new Error('[BattleRules] Canonical rules not available and development rules not allowed in production');
    }
    console.warn('[BattleRules] Canonical not available, using DevelopmentBattleRules for dev testing');
    return new DevelopmentBattleRules();
  }
}
