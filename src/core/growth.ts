// Growth system per ACTIVE_CANON §4
// 100 XP per level, participant level-gap scaling, FE-style seeded independent rolls

import { SpeciesData } from './types';
import { SeededRNG } from './rng';

export function calculateMeanGrowth(bst: number): number {
  return 32 + 0.06 * (bst - 300);
}

export function calculateMeanStat(bst: number): number {
  return bst / 6;
}

export function calculateStatGrowthPercent(baseStat: number, bst: number): number {
  const meanGrowth = calculateMeanGrowth(bst);
  const meanStat = calculateMeanStat(bst);
  const ratio = baseStat / meanStat;
  const growth = meanGrowth * Math.pow(ratio, 2.25);
  return Math.max(10, Math.round(growth));
}

export interface GrowthRollResult {
  stat: keyof SpeciesData['base_stats'];
  grew: boolean;
  exceptional: boolean; // +2 if growth >100% and roll succeeds for second point
  roll: number; // 0..100
  growthPercent: number;
}

// Seeded FE-style: each stat rolls independently per level
export function rollLevelUp(
  species: SpeciesData,
  currentStats: SpeciesData['base_stats'],
  seed: number,
  level: number
): { newStats: SpeciesData['base_stats']; rolls: GrowthRollResult[] } {
  const rng = new SeededRNG(seed + level * 1000); // deterministic per individual per level
  const rolls: GrowthRollResult[] = [];
  const newStats = { ...currentStats };

  const stats: (keyof SpeciesData['base_stats'])[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

  for (const stat of stats) {
    const base = species.base_stats[stat];
    const growthPercent = calculateStatGrowthPercent(base, species.bst);
    const roll = rng.next() * 100;

    let grew = false;
    let exceptional = false;

    if (stat === 'hp') {
      // HP receives +10 baseline per level in addition to roll behaviour
      // For HP, we apply baseline + roll
      // Baseline handled separately
    }

    if (growthPercent >= 100) {
      // Guaranteed +1, plus chance for +2
      grew = true;
      const extraChance = growthPercent - 100;
      if (roll < extraChance) {
        exceptional = true;
      }
    } else {
      grew = roll < growthPercent;
    }

    rolls.push({
      stat,
      grew,
      exceptional,
      roll,
      growthPercent
    });

    if (grew) {
      if (stat === 'hp') {
        // HP baseline +10 handled below, plus roll
        newStats[stat] += exceptional ? 2 : 1;
      } else {
        newStats[stat] += exceptional ? 2 : 1;
      }
    }
  }

  // HP baseline +10 per level
  newStats.hp += 10;

  return { newStats, rolls };
}

export function calculateStatsAtLevel(
  species: SpeciesData,
  level: number,
  growthSeed: number
): SpeciesData['base_stats'] {
  // Start at base stats at level 1
  let stats = { ...species.base_stats };
  // For level 1, no growth yet
  for (let lvl = 2; lvl <= level; lvl++) {
    const result = rollLevelUp(species, stats, growthSeed, lvl - 1);
    stats = result.newStats;
  }
  return stats;
}

export function calculateMaxHP(stats: SpeciesData['base_stats']): number {
  // HP stat already includes baseline, but max_hp = hp stat for simplicity
  // In real implementation, might have different formula
  return stats.hp;
}
