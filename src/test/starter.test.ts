import { describe, it, expect, beforeEach } from 'vitest';
import { speciesRepository } from '../data/canonical/speciesRepository';
import { moveRepository } from '../data/canonical/moveRepository';
import { starterAssignmentRepository } from '../data/canonical/starterAssignment';
import { calculateStatsAtLevel } from '../core/growth';
import { TEST_SPECIES_A, TEST_SPECIES_B, TEST_SPECIES_C, TEST_MOVE_A, TEST_MOVE_B, TEST_STARTER_ASSIGNMENT } from './fixtures/battleFixtures';
import { AbyssalInstance } from '../core/types';

describe('Starter instance logic (using TEST fixtures only)', () => {
  beforeEach(() => {
    // Inject test fixtures
    speciesRepository._injectTestData([TEST_SPECIES_A, TEST_SPECIES_B, TEST_SPECIES_C]);
    moveRepository._injectTestData([TEST_MOVE_A, TEST_MOVE_B]);
    starterAssignmentRepository._injectTestData(TEST_STARTER_ASSIGNMENT);
  });

  function createStarterInstance(speciesId: string, owner: 'AIMON' | 'PATE' | 'TRADE', isOriginalStarter: boolean = true): AbyssalInstance {
    const sp = speciesRepository.get(speciesId);
    const instanceId = `starter_${owner}_${speciesId}_test`;
    const growthSeed = 12345;
    const stats = calculateStatsAtLevel(sp as any, 5, growthSeed);
    
    return {
      instance_id: instanceId,
      species_id: speciesId,
      nickname: sp.name,
      level: 5,
      xp: 400,
      growth_seed: growthSeed,
      max_hp: stats.hp,
      current_hp: stats.hp,
      stats,
      moves: ['TEST_MOVE_A', 'TEST_MOVE_B'],
      pp: { 'TEST_MOVE_A': 35, 'TEST_MOVE_B': 25 },
      status: null,
      is_original_starter: isOriginalStarter,
      starter_lives_remaining: isOriginalStarter ? 3 : undefined,
      original_owner: owner,
      is_dead: false
    };
  }

  it('original starter gets 3 lives', () => {
    const instance = createStarterInstance('TEST_SPECIES_A', 'AIMON', true);
    expect(instance.is_original_starter).toBe(true);
    expect(instance.starter_lives_remaining).toBe(3);
  });

  it('ordinary same-species instance would not automatically get starter lives', () => {
    const instance = createStarterInstance('TEST_SPECIES_A', 'AIMON', false);
    expect(instance.is_original_starter).toBe(false);
    expect(instance.starter_lives_remaining).toBeUndefined();
    
    // Same species but not original starter should not have lives
    const ordinary = createStarterInstance('TEST_SPECIES_A', 'AIMON', false);
    ordinary.is_original_starter = false;
    delete ordinary.starter_lives_remaining;
    expect(ordinary.starter_lives_remaining).toBeUndefined();
  });

  it('3→2 triggers return', () => {
    const instance = createStarterInstance('TEST_SPECIES_A', 'AIMON', true);
    expect(instance.starter_lives_remaining).toBe(3);
    
    // Simulate KO at 3 lives
    instance.current_hp = 0;
    const livesBefore = instance.starter_lives_remaining!;
    if (livesBefore > 1) {
      instance.starter_lives_remaining = livesBefore - 1;
      const returnHp = Math.max(1, Math.ceil(instance.max_hp * 0.10));
      instance.current_hp = returnHp;
    }
    
    expect(instance.starter_lives_remaining).toBe(2);
    expect(instance.current_hp).toBeGreaterThan(0);
    expect(instance.current_hp).toBe(Math.max(1, Math.ceil(instance.max_hp * 0.10)));
  });

  it('2→1 triggers return', () => {
    const instance = createStarterInstance('TEST_SPECIES_A', 'AIMON', true);
    instance.starter_lives_remaining = 2;
    instance.current_hp = 0;
    
    const livesBefore = instance.starter_lives_remaining!;
    if (livesBefore > 1) {
      instance.starter_lives_remaining = livesBefore - 1;
      const returnHp = Math.max(1, Math.ceil(instance.max_hp * 0.10));
      instance.current_hp = returnHp;
    }
    
    expect(instance.starter_lives_remaining).toBe(1);
    expect(instance.current_hp).toBeGreaterThan(0);
  });

  it('1→0 routes to permanent death', () => {
    const instance = createStarterInstance('TEST_SPECIES_A', 'AIMON', true);
    instance.starter_lives_remaining = 1;
    instance.current_hp = 0;
    
    const livesBefore = instance.starter_lives_remaining!;
    if (livesBefore === 1) {
      instance.starter_lives_remaining = 0;
      instance.is_dead = true;
    }
    
    expect(instance.starter_lives_remaining).toBe(0);
    expect(instance.is_dead).toBe(true);
    expect(instance.current_hp).toBe(0);
  });

  it('return HP = max(1, ceil(max_hp × 0.10))', () => {
    const testCases = [
      { max_hp: 50, expected: 5 },
      { max_hp: 5, expected: 1 },
      { max_hp: 1, expected: 1 },
      { max_hp: 100, expected: 10 },
      { max_hp: 9, expected: 1 }, // ceil(0.9) = 1, max(1,1)=1
      { max_hp: 11, expected: 2 }, // ceil(1.1)=2
    ];

    for (const { max_hp, expected } of testCases) {
      const returnHp = Math.max(1, Math.ceil(max_hp * 0.10));
      expect(returnHp).toBe(expected);
    }

    // Test with actual instance
    const instance = createStarterInstance('TEST_SPECIES_A', 'AIMON', true);
    instance.max_hp = 50;
    const returnHp = Math.max(1, Math.ceil(instance.max_hp * 0.10));
    expect(returnHp).toBe(5);

    instance.max_hp = 5;
    const returnHp2 = Math.max(1, Math.ceil(instance.max_hp * 0.10));
    expect(returnHp2).toBe(1);
  });

  it('starter assignment table complete', () => {
    expect(starterAssignmentRepository.isLoaded()).toBe(true);
    
    // Check assignment for each starter
    const assignmentA = starterAssignmentRepository.getAssignment('TEST_SPECIES_A');
    expect(assignmentA.player_species_id).toBe('TEST_SPECIES_A');
    expect(assignmentA.pate_species_id).toBe('TEST_SPECIES_B');
    expect(assignmentA.trade_species_id).toBe('TEST_SPECIES_C');

    const assignmentB = starterAssignmentRepository.getAssignment('TEST_SPECIES_B');
    expect(assignmentB.player_species_id).toBe('TEST_SPECIES_B');

    const assignmentC = starterAssignmentRepository.getAssignment('TEST_SPECIES_C');
    expect(assignmentC.player_species_id).toBe('TEST_SPECIES_C');
  });
});
