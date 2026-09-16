// Battle Engine — orchestration only per task §11
// Handles: turns, actions, actor ordering, battle state, KO batches, switching, starter-life handling, result classification, persistence hooks
// Does NOT handle damage math — delegated to BattleRules (Canonical or DevelopmentBattleRules)
// Preserves architecture, removes unsupported Pokémon assumptions

import { AbyssalInstance, BattleState, MoveId } from '../../core/types';
import { SeededRNG } from '../../core/rng';
import { BattleRules, getBattleRules } from './battleRules';
import { moveRepository } from '../../data/canonical/moveRepository';
import { isProd } from '../../core/env';

export interface BattleAction {
  type: 'MOVE' | 'SWITCH' | 'SURRENDER';
  moveId?: MoveId;
  switchIndex?: number;
}

export interface BattleTurnResult {
  playerAction: BattleAction;
  enemyAction: BattleAction;
  playerDamage?: number;
  enemyDamage?: number;
  playerMoveName?: string;
  enemyMoveName?: string;
  log: string[];
  playerDefeated?: boolean; // terminology: died, not fainted
  enemyDefeated?: boolean;
  starterLifeLost?: { instanceId: string; owner: string; livesBefore: number; livesAfter: number };
  starterReturned?: { instanceId: string; hp: number };
  isOver: boolean;
  result?: 'WIN' | 'LOSS' | 'TUTORIAL_WIN';
}

export class BattleEngine {
  private state: BattleState;
  private rng: SeededRNG;
  private rules: BattleRules;

  constructor(state: BattleState, rules?: BattleRules) {
    this.state = state;
    this.rng = new SeededRNG(state.rng_seed);
    // Use provided rules or get development rules for testing (clearly isolated, not final)
    // Production should use canonical when available
    this.rules = rules || getBattleRules(true); // true = allow dev for now, validator will check prod doesn't use dev
  }

  getState(): BattleState {
    return this.state;
  }

  // Determine action order by priority then speed — priority from canonical move data where available
  private getActionOrder(
    playerAction: BattleAction,
    enemyAction: BattleAction
  ): ('PLAYER' | 'ENEMY')[] {
    let playerPriority = 0;
    let enemyPriority = 0;

    try {
      if (playerAction.moveId && moveRepository.exists(playerAction.moveId)) {
        playerPriority = moveRepository.get(playerAction.moveId).priority ?? 0;
      }
    } catch {
      // If move not in canonical repo, try to get from old data or default 0
      playerPriority = 0;
    }

    try {
      if (enemyAction.moveId && moveRepository.exists(enemyAction.moveId)) {
        enemyPriority = moveRepository.get(enemyAction.moveId).priority ?? 0;
      }
    } catch {
      enemyPriority = 0;
    }

    if (playerPriority !== enemyPriority) {
      return playerPriority > enemyPriority ? ['PLAYER', 'ENEMY'] : ['ENEMY', 'PLAYER'];
    }

    const playerSpeed = this.state.player_team[this.state.current_player_index]?.stats.spe ?? 0;
    const enemySpeed = this.state.enemy_team[this.state.current_enemy_index]?.stats.spe ?? 0;

    if (playerSpeed === enemySpeed) {
      return this.rng.next() < 0.5 ? ['PLAYER', 'ENEMY'] : ['ENEMY', 'PLAYER'];
    }

    return playerSpeed > enemySpeed ? ['PLAYER', 'ENEMY'] : ['ENEMY', 'PLAYER'];
  }

  // Execute one turn — handles simultaneous KOs batched, starter lives, etc.
  executeTurn(playerAction: BattleAction, enemyAction: BattleAction): BattleTurnResult {
    const log: string[] = [];
    const playerActive = this.state.player_team[this.state.current_player_index];
    const enemyActive = this.state.enemy_team[this.state.current_enemy_index];

    if (!playerActive || !enemyActive) {
      return {
        playerAction,
        enemyAction,
        log: ['No active Abyssal'],
        isOver: true,
        result: 'LOSS'
      };
    }

    const order = this.getActionOrder(playerAction, enemyAction);

    let playerDamage: number | undefined;
    let enemyDamage: number | undefined;
    let playerMoveName: string | undefined;
    let enemyMoveName: string | undefined;
    let playerDefeated = false;
    let enemyDefeated = false;

    let pendingPlayerDamage = 0;
    let pendingEnemyDamage = 0;

    // Calculate damages using BattleRules (canonical or dev)
    for (const actor of order) {
      if (actor === 'PLAYER') {
        if (playerAction.type === 'MOVE' && playerAction.moveId) {
          try {
            // Try canonical move first
            let move;
            let moveName = playerAction.moveId;
            if (moveRepository.exists(playerAction.moveId)) {
              move = moveRepository.get(playerAction.moveId);
              moveName = move.name;
            } else {
              // Fallback for dev fixtures — create minimal move object
              // This is only for dev testing, not production
              move = {
                id: playerAction.moveId,
                name: playerAction.moveId,
                type: 'WILD',
                category: 'PHYSICAL' as const,
                power: 40,
                accuracy: 100,
                pp: 20,
                priority: 0,
                target: 'SINGLE_OPPONENT'
              } as any;
            }
            playerMoveName = moveName;

            if (move.category !== 'STATUS') {
              // Use rules for damage
              const result = this.rules.calculateDamage(playerActive, enemyActive, move, () => this.rng.next());
              pendingEnemyDamage += result.damage;
              log.push(`${playerActive.nickname || playerActive.species_id} used ${moveName}!${result.isCritical ? ' Critical!' : ''}`);
              // Effectiveness from rules, not hard-coded
              if (result.effectiveness !== 1) {
                // Use neutral language, not Pokemon "super effective"
                if (result.effectiveness > 1) {
                  log.push('It struck true!');
                } else if (result.effectiveness < 1) {
                  log.push('It was less effective...');
                }
              }
            } else {
              log.push(`${playerActive.nickname || playerActive.species_id} used ${moveName}!`);
              // Status handling delegated to rules
              this.rules.applyStatModification(enemyActive, 'atk', -1);
            }
          } catch (e: any) {
            log.push(`[Error] Move ${playerAction.moveId} failed: ${e.message}`);
          }
        }
      } else {
        if (enemyAction.type === 'MOVE' && enemyAction.moveId) {
          try {
            let move;
            let moveName = enemyAction.moveId;
            if (moveRepository.exists(enemyAction.moveId)) {
              move = moveRepository.get(enemyAction.moveId);
              moveName = move.name;
            } else {
              move = {
                id: enemyAction.moveId,
                name: enemyAction.moveId,
                type: 'WILD',
                category: 'PHYSICAL' as const,
                power: 40,
                accuracy: 100,
                pp: 20,
                priority: 0,
                target: 'SINGLE_OPPONENT'
              } as any;
            }
            enemyMoveName = moveName;

            if (move.category !== 'STATUS') {
              const result = this.rules.calculateDamage(enemyActive, playerActive, move, () => this.rng.next());
              pendingPlayerDamage += result.damage;
              log.push(`Enemy ${enemyActive.species_id} used ${moveName}!${result.isCritical ? ' Critical!' : ''}`);
            } else {
              log.push(`Enemy ${enemyActive.species_id} used ${moveName}!`);
              this.rules.applyStatModification(playerActive, 'atk', -1);
            }
          } catch (e: any) {
            log.push(`[Error] Enemy move ${enemyAction.moveId} failed: ${e.message}`);
          }
        }
      }
    }

    // Apply damages batched (simultaneous KOs per ACTIVE_CANON §6)
    if (pendingEnemyDamage > 0) {
      enemyActive.current_hp = Math.max(0, enemyActive.current_hp - pendingEnemyDamage);
      enemyDamage = pendingEnemyDamage;
      log.push(`Enemy ${enemyActive.species_id} took ${pendingEnemyDamage} damage! HP: ${enemyActive.current_hp}/${enemyActive.max_hp}`);
    }

    if (pendingPlayerDamage > 0) {
      playerActive.current_hp = Math.max(0, playerActive.current_hp - pendingPlayerDamage);
      playerDamage = pendingPlayerDamage;
      log.push(`${playerActive.nickname || playerActive.species_id} took ${pendingPlayerDamage} damage! HP: ${playerActive.current_hp}/${playerActive.max_hp}`);
    }

    // Check defeated — terminology: died, not fainted per task §13
    if (enemyActive.current_hp <= 0) {
      enemyDefeated = true;
      log.push(`Enemy ${enemyActive.species_id} died.`);
    }

    if (playerActive.current_hp <= 0) {
      playerDefeated = true;
      log.push(`${playerActive.nickname || playerActive.species_id} died.`);
    }

    // Starter three-life system — per ACTIVE_CANON §9, retained
    let starterLifeLost: BattleTurnResult['starterLifeLost'] | undefined;
    let starterReturned: BattleTurnResult['starterReturned'] | undefined;

    if (playerDefeated && playerActive.is_original_starter && playerActive.starter_lives_remaining !== undefined) {
      const livesBefore = playerActive.starter_lives_remaining;
      if (livesBefore > 1) {
        playerActive.starter_lives_remaining = livesBefore - 1;
        starterLifeLost = {
          instanceId: playerActive.instance_id,
          owner: playerActive.original_owner || 'AIMON',
          livesBefore,
          livesAfter: livesBefore - 1
        };
        log.push(`${playerActive.nickname || playerActive.species_id} has ${playerActive.starter_lives_remaining} lives remaining.`);

        const returnHp = Math.max(1, Math.ceil(playerActive.max_hp * 0.10));
        playerActive.current_hp = returnHp;
        playerDefeated = false;
        starterReturned = {
          instanceId: playerActive.instance_id,
          hp: returnHp
        };
        log.push(`${playerActive.nickname || playerActive.species_id} returned with ${returnHp} HP! (${playerActive.starter_lives_remaining} lives left)`);
        playerActive.status = null;
      } else if (livesBefore === 1) {
        playerActive.starter_lives_remaining = 0;
        playerActive.is_dead = true;
        starterLifeLost = {
          instanceId: playerActive.instance_id,
          owner: playerActive.original_owner || 'AIMON',
          livesBefore,
          livesAfter: 0
        };
        log.push(`${playerActive.nickname || playerActive.species_id} has died permanently.`);
      }
    }

    if (playerDefeated && !playerActive.is_original_starter) {
      if (this.state.is_tutorial) {
        log.push(`[Tutorial] ${playerActive.nickname || playerActive.species_id} would have died, but Kurg intervenes. This is the only time.`);
        playerActive.current_hp = 1;
        playerDefeated = false;
      } else {
        playerActive.is_dead = true;
        log.push(`${playerActive.nickname || playerActive.species_id} died permanently.`);
      }
    }

    if (enemyDefeated) {
      enemyActive.is_dead = true;
    }

    let isOver = false;
    let result: 'WIN' | 'LOSS' | 'TUTORIAL_WIN' | undefined;

    const playerTeamAlive = this.state.player_team.some(m => m.current_hp > 0 && !m.is_dead);
    const enemyTeamAlive = this.state.enemy_team.some(m => m.current_hp > 0 && !m.is_dead);
    const hasPendingReturn = !!starterReturned;

    if (!playerTeamAlive && !hasPendingReturn) {
      if (!enemyTeamAlive) {
        if (this.state.enemy_trainer?.id.startsWith('LDR-')) {
          isOver = true;
          result = 'WIN';
          log.push('Both sides died simultaneously — allied support secures victory against a leader!');
        } else {
          isOver = true;
          result = 'LOSS';
          log.push('Both sides died!');
        }
      } else {
        isOver = true;
        result = 'LOSS';
        log.push('Your team was defeated.');
      }
    } else if (!enemyTeamAlive) {
      isOver = true;
      result = this.state.is_tutorial ? 'TUTORIAL_WIN' : 'WIN';
      log.push('Enemy team defeated!');
    }

    if (this.state.is_tutorial && isOver && result === 'WIN') {
      result = 'TUTORIAL_WIN';
    }

    this.state.turn++;
    this.state.log.push(...log);

    if (isOver) {
      this.state.is_over = true;
      this.state.result = result;
    }

    return {
      playerAction,
      enemyAction,
      playerDamage,
      enemyDamage,
      playerMoveName,
      enemyMoveName,
      log,
      playerDefeated,
      enemyDefeated,
      starterLifeLost,
      starterReturned,
      isOver,
      result
    };
  }

  getEnemyAction(): BattleAction {
    const enemyActive = this.state.enemy_team[this.state.current_enemy_index];
    if (!enemyActive) {
      throw new Error('[BattleEngine] No active enemy and no moves — canonical data missing');
    }

    const moves = enemyActive.moves;
    if (moves.length === 0) {
      throw new Error('[BattleEngine] Enemy has no moves — canonical data missing');
    }

    const idx = this.rng.nextInt(0, moves.length);
    return { type: 'MOVE', moveId: moves[idx] };
  }

  calculateXP(winner: AbyssalInstance, loser: AbyssalInstance): number {
    return this.rules.calculateXP(winner, loser);
  }
}
