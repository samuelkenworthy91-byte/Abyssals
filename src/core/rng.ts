// Deterministic RNG — seeded, no reroll after reload per ACTIVE_CANON
// Uses xorshift32 for simplicity, compatible with future seed persistence

export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    // Ensure non-zero
    this.state = seed !== 0 ? seed >>> 0 : 1;
  }

  // Returns 0..1 float
  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    // Convert to float 0..1
    return (this.state >>> 0) / 0xFFFFFFFF;
  }

  nextInt(min: number, max: number): number {
    // inclusive min, exclusive max
    return Math.floor(this.next() * (max - min)) + min;
  }

  // For growth rolls etc.
  nextBool(p: number = 0.5): boolean {
    return this.next() < p;
  }

  getState(): number {
    return this.state;
  }

  setState(state: number) {
    this.state = state >>> 0;
  }

  // Clone for deterministic battle etc.
  clone(): SeededRNG {
    const rng = new SeededRNG(this.state);
    return rng;
  }

  // Deterministic id generation
  static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit int
    }
    return Math.abs(hash) + 1;
  }
}

// Global RNG for non-critical visuals, but for canonical persistence we use instance seeds
export const globalRNG = new SeededRNG(Date.now() % 0xFFFFFFFF);
