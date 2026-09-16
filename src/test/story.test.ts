import { describe, it, expect, beforeEach } from 'vitest';
import { StoryManager } from '../game/storyManager';
import { createInitialState } from '../core/persistence';

describe('Story events', () => {
  let manager: StoryManager;

  beforeEach(() => {
    const state = createInitialState(0, 'Aimon');
    manager = new StoryManager(state);
  });

  it('one-shot events cannot repeat', () => {
    // CH01-E01 is one-shot
    expect(manager.canTrigger('CH01-E01' as any)).toBe(true);
    
    manager.completeEvent('CH01-E01' as any);
    expect(manager.isEventComplete('CH01-E01' as any)).toBe(true);
    
    // Should not be able to trigger again if one-shot
    expect(manager.canTrigger('CH01-E01' as any)).toBe(false);

    // CH01-E05 also one-shot
    manager.completeEvent('CH01-E05' as any);
    expect(manager.canTrigger('CH01-E05' as any)).toBe(false);
  });

  it('events commit in expected order', () => {
    // Simulate expected order: CH01-E01 -> E02 -> E03 -> E04 -> E05 -> E06 -> E07
    const expectedOrder = ['CH01-E01', 'CH01-E02', 'CH01-E03', 'CH01-E04', 'CH01-E05', 'CH01-E06', 'CH01-E07'];
    
    for (const eventId of expectedOrder) {
      manager.completeEvent(eventId as any);
      expect(manager.isEventComplete(eventId as any)).toBe(true);
    }

    const state = manager.getState();
    expect(state.completed_events).toEqual(expectedOrder);
  });

  it('flags set on event completion', () => {
    // Check that completing an event sets expected flags (if any)
    // For CH01-E01, it should set chapter state to STARTED
    manager.completeEvent('CH01-E01' as any);
    const state = manager.getState();
    expect(state.chapter_states[1]).toBe('STARTED');

    // CH01-E07 should complete chapter 1 and make chapter 2 available
    manager.completeEvent('CH01-E07' as any);
    const state2 = manager.getState();
    expect(state2.chapter_states[1]).toBe('COMPLETE');
    expect(state2.chapter_states[2]).toBe('AVAILABLE');
  });

  it('town state updates on CH01-E02', () => {
    manager.completeEvent('CH01-E02' as any);
    const state = manager.getState();
    expect(state.town_states['Civeton']).toBe('CONTESTED');
  });

  it('hasFlag and setFlag work correctly', () => {
    expect(manager.hasFlag('pate_house_checked')).toBe(false);
    manager.setFlag('pate_house_checked', true);
    expect(manager.hasFlag('pate_house_checked')).toBe(true);
    manager.setFlag('pate_house_checked', false);
    expect(manager.hasFlag('pate_house_checked')).toBe(false);
  });
});
