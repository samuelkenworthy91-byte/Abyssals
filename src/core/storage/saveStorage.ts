// SaveStorage abstraction — away from direct localStorage assumptions
// Implementations for browser and Android/Capacitor
// Preserves Ironman architecture: 3 slots, authoritative current, commit seq, recovery generations, journal

export interface SaveStorage {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

// Browser implementation — localStorage
export class BrowserSaveStorage implements SaveStorage {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

// Capacitor Preferences implementation — for Android
// Uses dynamic import to avoid hard dependency in browser build
export class CapacitorSaveStorage implements SaveStorage {
  private preferences: any = null;
  private initialized: boolean = false;

  async init() {
    if (this.initialized) return;
    try {
      // @ts-ignore — Capacitor Preferences may not be installed in dev
      const { Preferences } = await import('@capacitor/preferences');
      this.preferences = Preferences;
      this.initialized = true;
      console.log('[CapacitorSaveStorage] Initialized Preferences');
    } catch (e) {
      console.warn('[CapacitorSaveStorage] Failed to init Preferences, falling back to localStorage', e);
      this.preferences = null;
    }
  }

  async getItem(key: string): Promise<string | null> {
    await this.init();
    if (this.preferences) {
      try {
        const { value } = await this.preferences.get({ key });
        return value;
      } catch {
        return null;
      }
    } else {
      // Fallback to localStorage for dev
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.init();
    if (this.preferences) {
      await this.preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    await this.init();
    if (this.preferences) {
      await this.preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  }
}

// Factory — detects environment
export function createSaveStorage(): SaveStorage {
  // Check if running in Capacitor
  const isCapacitor = (window as any).Capacitor?.isNativePlatform?.() || false;

  if (isCapacitor) {
    console.log('[SaveStorage] Using CapacitorSaveStorage (Android)');
    return new CapacitorSaveStorage();
  } else {
    console.log('[SaveStorage] Using BrowserSaveStorage');
    return new BrowserSaveStorage();
  }
}

// For testing — allow injection
export let currentSaveStorage: SaveStorage = new BrowserSaveStorage();

export function setSaveStorage(storage: SaveStorage) {
  currentSaveStorage = storage;
}
