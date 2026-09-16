// Story Manager — respects locked Story Event & Flag spec, canonical IDs, lower_snake_case

import { GameState, STORY_EVENTS, STORY_FLAGS, StoryEventId } from '../core/types';

export class StoryManager {
  private state: GameState;

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  updateState(newState: GameState) {
    this.state = newState;
  }

  getState(): GameState {
    return this.state;
  }

  // Check if event can trigger
  canTrigger(eventId: StoryEventId): boolean {
    const event = STORY_EVENTS.find(e => e.id === eventId);
    if (!event) return false;

    // Already completed and one-shot? Prevent replay
    if (this.state.completed_events.includes(eventId)) {
      // For most events, don't replay; but some triggers are reusable for dialogue
      // For canonical story progression, once completed, don't retrigger as story event
      // However dialogue can still happen
      const isOneShot = eventId === 'CH01-E01' || eventId === 'CH01-E03' || eventId === 'CH01-E05' || eventId === 'CH01-E06' || eventId === 'CH01-E07';
      if (isOneShot) return false;
    }

    // Check required flags
    if (event.flags_required) {
      for (const flag of event.flags_required) {
        if (!this.state.story_flags[flag]) {
          return false;
        }
      }
    }

    return true;
  }

  // Complete event — commits flags and marks completed
  completeEvent(eventId: StoryEventId): { flagsSet: string[] } {
    const event = STORY_EVENTS.find(e => e.id === eventId);
    if (!event) {
      throw new Error(`Unknown story event ${eventId}`);
    }

    const flagsSet: string[] = [];

    if (event.flags_set) {
      for (const flag of event.flags_set) {
        if (!this.state.story_flags[flag]) {
          this.state.story_flags[flag] = true;
          flagsSet.push(flag);
        }
      }
    }

    if (!this.state.completed_events.includes(eventId)) {
      this.state.completed_events.push(eventId);
    }

    this.state.current_event_id = eventId;

    // Update chapter states per STORY_IMPLEMENTATION
    // Chapter 1: STARTED when first event, COMPLETE after E07
    if (eventId === 'CH01-E01') {
      this.state.chapter_states[1] = 'STARTED';
    }
    if (eventId === 'CH01-E07') {
      this.state.chapter_states[1] = 'COMPLETE';
      this.state.chapter_states[2] = 'AVAILABLE';
    }

    // Town state
    if (eventId === 'CH01-E02') {
      this.state.town_states['Civeton'] = 'CONTESTED'; // crusade begun
    }

    return { flagsSet };
  }

  // Get next available events
  getAvailableEvents(): typeof STORY_EVENTS {
    return STORY_EVENTS.filter(e => this.canTrigger(e.id));
  }

  hasFlag(flag: string): boolean {
    return !!this.state.story_flags[flag];
  }

  setFlag(flag: string, value: boolean = true) {
    this.state.story_flags[flag] = value;
  }

  isEventComplete(eventId: StoryEventId): boolean {
    return this.state.completed_events.includes(eventId);
  }

  // For starter choice CH01-E05
  isStarterChoiceAvailable(): boolean {
    return this.canTrigger('CH01-E05');
  }

  // For battle
  isFirstBattleAvailable(): boolean {
    return this.hasFlag(STORY_FLAGS.first_battle_available) && !this.hasFlag(STORY_FLAGS.first_battle_complete);
  }
}
