import { describe, it, expect, beforeEach } from 'vitest';
import { PersistenceManager, createInitialState } from '../core/persistence';
import { SaveStorage } from '../core/storage/saveStorage';

class MemorySaveStorage implements SaveStorage {
  private store = new Map<string, string>();
  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }
  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  // Sync access for legacy code
  getItemSync(key: string): string | null {
    return this.store.get(key) ?? null;
  }
}

describe('Persistence', () => {
  let storage: MemorySaveStorage;
  let persistence: PersistenceManager;

  beforeEach(() => {
    storage = new MemorySaveStorage();
    // Mock localStorage for sync methods
    const mockLocalStorage = {
      store: new Map<string, string>(),
      getItem(k: string) { return this.store.get(k) ?? null; },
      setItem(k: string, v: string) { this.store.set(k, v); },
      removeItem(k: string) { this.store.delete(k); },
      clear() { this.store.clear(); }
    };
    (globalThis as any).localStorage = mockLocalStorage;
    // Mock document for lifecycle hooks
    (globalThis as any).document = {
      addEventListener: () => {},
      hidden: false
    };
    (globalThis as any).window = {
      addEventListener: () => {},
      Capacitor: undefined
    };
    persistence = new PersistenceManager(storage as any);
  });

  it('three slots isolated', async () => {
    const state0 = createInitialState(0, 'Aimon');
    const state1 = createInitialState(1, 'Pate');
    const state2 = createInitialState(2, 'Trade');

    state0.money = 100;
    state1.money = 200;
    state2.money = 300;

    await persistence.commit(state0, 'slot0');
    await persistence.commit(state1, 'slot1');
    await persistence.commit(state2, 'slot2');

    const loaded0 = await persistence.load(0);
    const loaded1 = await persistence.load(1);
    const loaded2 = await persistence.load(2);

    expect(loaded0?.money).toBe(100);
    expect(loaded1?.money).toBe(200);
    expect(loaded2?.money).toBe(300);
    expect(loaded0?.slot_id).toBe(0);
    expect(loaded1?.slot_id).toBe(1);
    expect(loaded2?.slot_id).toBe(2);
  });

  it('commit_seq increases monotonically', async () => {
    const state = createInitialState(0, 'Aimon');
    const committed1 = await persistence.commit(state, 'first');
    expect(committed1.commit_seq).toBe(1);

    const committed2 = await persistence.commit(committed1, 'second');
    expect(committed2.commit_seq).toBe(2);
    expect(committed2.commit_seq).toBeGreaterThan(committed1.commit_seq);

    const committed3 = await persistence.commit(committed2, 'third');
    expect(committed3.commit_seq).toBe(3);
  });

  it('recovery generations update correctly', async () => {
    const state = createInitialState(0, 'Aimon');
    
    // First commit
    const c1 = await persistence.commit(state, 'first');
    // Second commit — should rotate backup
    const c2 = await persistence.commit(c1, 'second');
    // Third commit — should have backup1 and backup2
    const c3 = await persistence.commit(c2, 'third');

    // Check that current is c3
    const current = await storage.getItem('abyssals_save_0');
    expect(current).toBeTruthy();
    const parsedCurrent = JSON.parse(current!);
    expect(parsedCurrent.commit_seq).toBe(3);

    // Check backup1 is c2
    const backup1 = await storage.getItem('abyssals_save_0_backup1');
    expect(backup1).toBeTruthy();
    const parsedBackup1 = JSON.parse(backup1!);
    expect(parsedBackup1.commit_seq).toBe(2);

    // Check backup2 is c1
    const backup2 = await storage.getItem('abyssals_save_0_backup2');
    expect(backup2).toBeTruthy();
    const parsedBackup2 = JSON.parse(backup2!);
    expect(parsedBackup2.commit_seq).toBe(1);
  });

  it('save/reload retains story state', async () => {
    const state = createInitialState(0, 'Aimon');
    state.completed_events = ['CH01-E01', 'CH01-E02'] as any;
    state.story_flags = { pate_house_checked: true, trade_message_found: true };
    state.current_map_id = 'civeton_village';
    state.player_position = { x: 20, y: 15, map_id: 'civeton_village' };
    state.town_states = { Civeton: 'CONTESTED' } as any;

    const committed = await persistence.commit(state, 'story_progress');
    const loaded = await persistence.load(0);

    expect(loaded).toBeTruthy();
    expect(loaded?.completed_events).toEqual(['CH01-E01', 'CH01-E02']);
    expect(loaded?.story_flags.pate_house_checked).toBe(true);
    expect(loaded?.story_flags.trade_message_found).toBe(true);
    expect(loaded?.current_map_id).toBe('civeton_village');
    expect(loaded?.player_position.x).toBe(20);
    expect(loaded?.town_states['Civeton']).toBe('CONTESTED');
  });

  it('journal retains entries', async () => {
    const state = createInitialState(0, 'Aimon');
    const c1 = await persistence.commit(state, 'first_event');
    const c2 = await persistence.commit(c1, 'second_event');

    expect(c2.journal.entries.length).toBe(2);
    expect(c2.journal.entries[0].description).toBe('first_event');
    expect(c2.journal.entries[1].description).toBe('second_event');
    expect(c2.journal.last_commit_seq).toBe(2);
  });
});
