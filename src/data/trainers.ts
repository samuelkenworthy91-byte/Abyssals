// Trainers — canonical repository wrapper

import { trainerRepository } from './canonical/trainerRepository';
import { CanonicalTrainer } from './canonical/types';
import { isProd } from '../core/env';

export function getTrainer(id: string): CanonicalTrainer {
  return trainerRepository.get(id);
}

export function exists(id: string): boolean {
  return trainerRepository.exists(id);
}

export function getAllTrainers(): CanonicalTrainer[] {
  return trainerRepository.getAll();
}

export function isLoaded(): boolean {
  return trainerRepository.isLoaded();
}

export function getLoadError(): string | null {
  return trainerRepository.getLoadError();
}

export function _injectTestTrainersForDev(trainers: CanonicalTrainer[]) {
  if (isProd()) {
    throw new Error('_injectTestTrainersForDev in production forbidden');
  }
  trainerRepository._injectTestData(trainers);
}

// Legacy removed
export const PROVISIONAL_TRAINERS: Record<string, any> = {};
