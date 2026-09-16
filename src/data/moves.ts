// Moves data — canonical repository wrapper
// No invented moves — missing data is dependency to resolve

import { moveRepository } from './canonical/moveRepository';
import { CanonicalMove } from './canonical/types';
import { isProd } from '../core/env';

export function getMove(id: string): CanonicalMove {
  return moveRepository.get(id);
}

export function exists(id: string): boolean {
  return moveRepository.exists(id);
}

export function getAllMoves(): CanonicalMove[] {
  return moveRepository.getAll();
}

export function isLoaded(): boolean {
  return moveRepository.isLoaded();
}

export function getLoadError(): string | null {
  return moveRepository.getLoadError();
}

export function _injectTestMovesForDev(moves: CanonicalMove[]) {
  if (isProd()) {
    throw new Error('_injectTestMovesForDev in production forbidden');
  }
  moveRepository._injectTestData(moves);
}

// Legacy exports removed — production must not use invented moves
export const PROVISIONAL_MOVES: Record<string, any> = {};
export const STARTER_LEARNSETS: Record<string, string[]> = {};
