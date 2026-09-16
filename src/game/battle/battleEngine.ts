// Battle Engine — reusable, data-driven, supports lethal 0 HP, starter lives, deterministic, etc.
// Per ACTIVE_CANON §6, §9, §13, §14 and task requirements

import { AbyssalInstance, BattleState, MoveId } from '../../core/types';
import { getMove } from '../../data/moves';
import { SeededRNG } from '../../core/rng';

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
  playerFainted?: boolean;
  enemyFainted?: boolean;
  starterLifeLost?: { instanceId: string; owner: string; livesBefore: number; livesAfter: number };
  starterReturned?: { instanceId: string; hp: number };
  isOver: boolean;
  result?: 'WIN' | 'LOSS' | 'TUTORIAL_WIN';
}

export class BattleEngine {
  private state: BattleState;
  private rng: SeededRNG;

  constructor(state: BattleState) {
    this.state = state;
    this.rng = new SeededRNG(state.rng_seed);
  }

  getState(): BattleState {
    return this.state;
  }

  // Gen III-style damage foundation (simplified but deterministic)
  private calculateDamage(
    attacker: AbyssalInstance,
    defender: AbyssalInstance,
    moveId: MoveId
  ): { damage: number; isCritical: boolean; effectiveness: number } {
    const move = getMove(moveId);
    if (!move || move.category === 'STATUS' || !move.power) {
      return { damage: 0, isCritical: false, effectiveness: 1 };
    }

    // Simplified Gen III formula
    // Damage = (((2*Level/5 +2)*Power*Atk/Def)/50 +2) * modifiers
    const level = attacker.level;
    const power = move.power;
    const attackStat = move.category === 'PHYSICAL' ? attacker.stats.atk : attacker.stats.spa;
    const defenseStat = move.category === 'PHYSICAL' ? defender.stats.def : defender.stats.spd;

    const base = Math.floor((Math.floor((2 * level / 5 + 2) * power * attackStat / defenseStat) / 50) + 2);

    // Random factor 0.85-1.0 deterministic
    const randomFactor = 0.85 + this.rng.next() * 0.15;

    // STAB? Simplified — if move type matches attacker type, 1.5x
    // For provisional, we have types EARTH, FIRE, WATER, WILD, SHADOW
    const attackerSpeciesTypes = attacker.species_id; // we don't have species types here easily, so skip for now
    // Let's get move type effectiveness — simplified: no type chart for provisional, all 1x
    const effectiveness = 1;

    const isCritical = this.rng.next() < 0.0625; // 6.25% crit
    const critMultiplier = isCritical ? 1.5 : 1;

    const damage = Math.floor(base * randomFactor * effectiveness * critMultiplier);

    return {
      damage: Math.max(1, damage),
      isCritical,
      effectiveness
    };
  }

  // Determine action order by priority then speed
  private getActionOrder(
    playerAction: BattleAction,
    enemyAction: BattleAction
  ): ('PLAYER' | 'ENEMY')[] {
    const playerMove = playerAction.moveId ? getMove(playerAction.moveId) : null;
    const enemyMove = enemyAction.moveId ? getMove(enemyAction.moveId) : null;

    const playerPriority = playerMove?.priority ?? 0;
    const enemyPriority = enemyMove?.priority ?? 0;

    if (playerPriority !== enemyPriority) {
      return playerPriority > enemyPriority ? ['PLAYER', 'ENEMY'] : ['ENEMY', 'PLAYER'];
    }

    // Speed tie-breaker
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
    let playerFainted = false;
    let enemyFainted = false;

    // Track damage to apply simultaneously for KO batching per ACTIVE_CANON §6
    let pendingPlayerDamage = 0;
    let pendingEnemyDamage = 0;

    // First, calculate damages
    for (const actor of order) {
      if (actor === 'PLAYER') {
        if (playerAction.type === 'MOVE' && playerAction.moveId) {
          const move = getMove(playerAction.moveId);
          playerMoveName = move?.name;
          if (move?.category !== 'STATUS') {
            const result = this.calculateDamage(playerActive, enemyActive, playerAction.moveId);
            pendingEnemyDamage += result.damage;
            log.push(`${playerActive.nickname || playerActive.species_id} used ${move?.name}!${result.isCritical ? ' Critical hit!' : ''}`);
            if (result.effectiveness !== 1) {
              log.push(result.effectiveness > 1 ? 'It\'s super effective!' : 'It\'s not very effective...');
            }
          } else {
            log.push(`${playerActive.nickname || playerActive.species_id} used ${move?.name}!`);
            // Status handling simplified for slice — e.g., Growl lowers atk, Harden raises def
            if (playerAction.moveId === 'GROWL') {
              enemyActive.stats.atk = Math.max(1, enemyActive.stats.atk - 5);
              log.push(`${enemyActive.species_id}'s Attack fell!`);
            } else if (playerAction.moveId === 'HARDEN') {
              playerActive.stats.def += 5;
              log.push(`${playerActive.species_id}'s Defence rose!`);
            }
          }
        }
      } else {
        if (enemyAction.type === 'MOVE' && enemyAction.moveId) {
          const move = getMove(enemyAction.moveId);
          enemyMoveName = move?.name;
          if (move?.category !== 'STATUS') {
            const result = this.calculateDamage(enemyActive, playerActive, enemyAction.moveId);
            pendingPlayerDamage += result.damage;
            log.push(`Enemy ${enemyActive.species_id} used ${move?.name}!${result.isCritical ? ' Critical hit!' : ''}`);
          } else {
            log.push(`Enemy ${enemyActive.species_id} used ${move?.name}!`);
            if (enemyAction.moveId === 'GROWL') {
              playerActive.stats.atk = Math.max(1, playerActive.stats.atk - 5);
              log.push(`${playerActive.nickname || playerActive.species_id}'s Attack fell!`);
            } else if (enemyAction.moveId === 'HARDEN') {
              enemyActive.stats.def += 5;
              log.push(`Enemy ${enemyActive.species_id}'s Defence rose!`);
            }
          }
        }
      }
    }

    // Apply damages batched (simultaneous KOs per ACTIVE_CANON)
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

    // Check fainted
    if (enemyActive.current_hp <= 0) {
      enemyFainted = true;
      log.push(`Enemy ${enemyActive.species_id} fainted!`);
    }

    if (playerActive.current_hp <= 0) {
      playerFainted = true;
      log.push(`${playerActive.nickname || playerActive.species_id} fainted!`);
    }

    // Starter three-life system — per ACTIVE_CANON §9
    // Only original three starter individuals have this
    // Non-final lethal decrements once per lethal action/KO event, never per hit in multi-hit
    // Returns at max(1, ceil(max_hp *0.10)) after end-of-turn layers but before battle-end classification
    // Pending return prevents wipe classification

    let starterLifeLost: BattleTurnResult['starterLifeLost'] | undefined;
    let starterReturned: BattleTurnResult['starterReturned'] | undefined;

    if (playerFainted && playerActive.is_original_starter && playerActive.starter_lives_remaining !== undefined) {
      const livesBefore = playerActive.starter_lives_remaining;
      if (livesBefore > 1) {
        // Non-final lethal
        playerActive.starter_lives_remaining = livesBefore - 1;
        starterLifeLost = {
          instanceId: playerActive.instance_id,
          owner: playerActive.original_owner || 'AIMON',
          livesBefore,
          livesAfter: livesBefore - 1
        };
        log.push(`${playerActive.nickname || playerActive.species_id} has ${playerActive.starter_lives_remaining} lives remaining! It will return...`);

        // Schedule return — after end-of-turn but before wipe classification
        // For slice, return immediately at end of turn at 10% HP
        const returnHp = Math.max(1, Math.ceil(playerActive.max_hp * 0.10));
        playerActive.current_hp = returnHp;
        playerFainted = false; // Prevent wipe classification
        starterReturned = {
          instanceId: playerActive.instance_id,
          hp: returnHp
        };
        log.push(`${playerActive.nickname || playerActive.species_id} returned with ${returnHp} HP! (${playerActive.starter_lives_remaining} lives left)`);

        // Clear status per spec, preserve PP, etc.
        playerActive.status = null;
      } else if (livesBefore === 1) {
        // Final life — permanent death
        playerActive.starter_lives_remaining = 0;
        playerActive.is_dead = true;
        starterLifeLost = {
          instanceId: playerActive.instance_id,
          owner: playerActive.original_owner || 'AIMON',
          livesBefore,
          livesAfter: 0
        };
        log.push(`${playerActive.nickname || playerActive.species_id} has died permanently... (starter final death)`);
      }
    }

    // For non-starter ordinary lethal — permanent death unless tutorial
    if (playerFainted && !playerActive.is_original_starter) {
      if (this.state.is_tutorial) {
        // Tutorial exception per task §15: prevents controlled test from becoming permanent-death failure
        // But narrative should establish real rule
        log.push(`[TUTORIAL] ${playerActive.nickname || playerActive.species_id} would have died, but Kurg intervenes...`);
        // In tutorial, we don't set is_dead, we return at 1 HP for teaching
        playerActive.current_hp = 1;
        playerFainted = false;
      } else {
        playerActive.is_dead = true;
        log.push(`${playerActive.nickname || playerActive.species_id} died permanently.`);
      }
    }

    if (enemyFainted) {
      enemyActive.is_dead = true;
    }

    // Battle end classification — per ACTIVE_CANON §6 simultaneous KOs batched
    // Against mortal leaders, mutual-death counts as player victory (not relevant for tutorial)
    // Ordinary separate party wipes remain losses

    let isOver = false;
    let result: 'WIN' | 'LOSS' | 'TUTORIAL_WIN' | undefined;

    const playerTeamAlive = this.state.player_team.some(m => m.current_hp > 0 && !m.is_dead);
    const enemyTeamAlive = this.state.enemy_team.some(m => m.current_hp > 0 && !m.is_dead);

    // Check if pending starter return prevents wipe
    const hasPendingReturn = !!starterReturned;

    if (!playerTeamAlive && !hasPendingReturn) {
      // Player wiped
      if (!enemyTeamAlive) {
        // Simultaneous KO
        if (this.state.enemy_trainer?.id.startsWith('LDR-')) {
          // Leader mutual KO = player victory
          isOver = true;
          result = 'WIN';
          log.push('Both sides fainted simultaneously — but against a leader, allied support secures victory!');
        } else {
          // Ordinary — treat as loss? Or need batch handling — for slice, player loss if both faint same turn and no starter return
          isOver = true;
          result = 'LOSS';
          log.push('Both sides fainted!');
        }
      } else {
        isOver = true;
        result = 'LOSS';
        log.push('Player team wiped!');
      }
    } else if (!enemyTeamAlive) {
      isOver = true;
      result = this.state.is_tutorial ? 'TUTORIAL_WIN' : 'WIN';
      log.push('Enemy team defeated!');
    }

    // For tutorial, if player won or had starter return, count as tutorial win
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
      playerFainted,
      enemyFainted,
      starterLifeLost,
      starterReturned,
      isOver,
      result
    };
  }

  // Enemy AI — simple for tutorial
  getEnemyAction(): BattleAction {
    const enemyActive = this.state.enemy_team[this.state.current_enemy_index];
    if (!enemyActive) {
      return { type: 'MOVE', moveId: 'TACKLE' };
    }

    // Pick random move from available
    const moves = enemyActive.moves;
    if (moves.length === 0) {
      return { type: 'MOVE', moveId: 'TACKLE' };
    }

    const idx = this.rng.nextInt(0, moves.length);
    return { type: 'MOVE', moveId: moves[idx] };
  }

  // XP handling — per ACTIVE_CANON §4 participant level-gap individual
  calculateXP(winner: AbyssalInstance, loser: AbyssalInstance): number {
    // Simplified: 100 XP per level, scaled by level gap
    // Participant XP scales using participant's own level relative to defeated enemy
    const baseXP = 50; // provisional
    const levelGap = loser.level - winner.level;
    const multiplier = 1 + (levelGap * 0.1); // +10% per level gap
    return Math.max(1, Math.floor(baseXP * multiplier));
  }
}
