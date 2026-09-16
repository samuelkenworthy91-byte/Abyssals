// Main Game — bootstrap, map loading, player movement, collision, interaction, NPCs, dialogue, story events, objectives, transitions, party, starter selection, battle, save/load
// Implements required playable flow per task §22

import { GameState, MapId, AbyssalInstance } from '../core/types';
import { PersistenceManager, createInitialState } from '../core/persistence';
import { StoryManager } from './storyManager';
import { PlayerController } from './player';
import { MapRenderer } from './mapRenderer';
import { MAPS, getMap } from './maps/civeton';
import { DialogueUI } from '../ui/dialogue';
import { BattleUI } from '../ui/battleUI';
import { StarterSelectionUI, assignRemainingStarters } from './starterSelection';
import { getDialogue } from '../data/dialogue';
import { PROVISIONAL_SPECIES, getSpecies, generateGrowthSeed, STARTER_IDS } from '../data/species';
import { STARTER_LEARNSETS, getMove } from '../data/moves';
import { getTrainer } from '../data/trainers';
import { BattleEngine, BattleAction } from './battle/battleEngine';
import { BattleState } from '../core/types';
import { SeededRNG } from '../core/rng';
import { calculateStatsAtLevel } from '../core/growth';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mapRenderer: MapRenderer;
  private player: PlayerController;
  private persistence: PersistenceManager;
  private storyManager: StoryManager;
  private dialogueUI: DialogueUI;
  private battleUI: BattleUI;
  private starterUI: StarterSelectionUI;

  private state: GameState;
  private currentMapId: MapId;
  private cameraX: number = 0;
  private cameraY: number = 0;
  private keys: Set<string> = new Set();
  private isDialogueActive: boolean = false;
  private isBattleActive: boolean = false;
  private isStarterSelectionActive: boolean = false;

  private gameWidth: number = 800;
  private gameHeight: number = 600;
  private tileSize: number = 16;

  private lastTime: number = 0;
  private animationFrameId: number = 0;

  // Audio hooks — provisional/restrained per task §20
  private audioHooks: Record<string, () => void> = {};

  constructor(appContainer: HTMLElement, uiContainer: HTMLElement, initialState?: GameState) {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.gameWidth;
    this.canvas.height = this.gameHeight;
    this.canvas.tabIndex = 0;
    this.canvas.style.cssText = `
      width: 100%;
      height: 100%;
      max-width: 800px;
      max-height: 600px;
      outline: none;
      image-rendering: pixelated;
    `;
    appContainer.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    this.ctx = ctx;

    this.mapRenderer = new MapRenderer(this.canvas);
    this.persistence = new PersistenceManager();

    // Use provided state or load
    if (initialState) {
      this.state = initialState;
      console.log('Using provided state', initialState);
    } else {
      const saved = this.persistence.loadWithRecovery(0);
      if (saved) {
        this.state = saved;
        console.log('Loaded save', saved);
      } else {
        this.state = createInitialState(0, 'Aimon');
        console.log('Created new state');
      }
    }

    this.storyManager = new StoryManager(this.state);
    this.currentMapId = this.state.current_map_id as MapId;
    const map = getMap(this.currentMapId);
    if (!map) {
      this.currentMapId = 'childhood_hill';
    }

    // Player at saved position or default
    this.player = new PlayerController(
      this.state.player_position.x,
      this.state.player_position.y,
      this.tileSize
    );

    this.dialogueUI = new DialogueUI(uiContainer);
    this.battleUI = new BattleUI(uiContainer);
    this.starterUI = new StarterSelectionUI(uiContainer);

    this.setupInput();
    this.setupAudioHooks();

    // Start game loop
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);

    // Start opening if new game
    if (this.state.completed_events.length === 0) {
      this.startNewGame();
    } else {
      // Resume from save
      this.checkStoryTriggers();
    }
  }

  private setupAudioHooks() {
    // Provisional audio hooks — separate hooks per task §20, replaceable
    this.audioHooks = {
      civeton_ambience: () => console.log('[Audio] Civeton ambience'),
      dialogue: () => console.log('[Audio] Dialogue blip'),
      interaction: () => console.log('[Audio] Interaction'),
      starter_selection: () => console.log('[Audio] Starter selection'),
      battle_transition: () => console.log('[Audio] Battle transition'),
      battle_music: () => console.log('[Audio] Battle music'),
      attack: () => console.log('[Audio] Attack'),
      damage: () => console.log('[Audio] Damage'),
      victory: () => console.log('[Audio] Victory')
    };
  }

  private setupInput() {
    window.addEventListener('keydown', (e) => {
      // If dialogue active, handle dialogue input first
      if (this.dialogueUI.isShowing()) {
        if (this.dialogueUI.handleInput(e.key)) {
          e.preventDefault();
          return;
        }
      }

      this.keys.add(e.key.toLowerCase());

      // Interaction
      if (e.key.toLowerCase() === 'e' || e.key === ' ' || e.key === 'Enter') {
        if (!this.isDialogueActive && !this.isBattleActive && !this.isStarterSelectionActive) {
          this.tryInteract();
        }
      }

      // Save/quit test
      if (e.key.toLowerCase() === 's' && e.ctrlKey) {
        e.preventDefault();
        this.saveGame('manual_save');
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        // Tap — interact
        this.tryInteract();
      } else {
        // Swipe — move
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 30) this.player.queueDirection('RIGHT');
          else if (dx < -30) this.player.queueDirection('LEFT');
        } else {
          if (dy > 30) this.player.queueDirection('DOWN');
          else if (dy < -30) this.player.queueDirection('UP');
        }
      }
    }, { passive: false });

    // Focus canvas
    this.canvas.focus();
  }

  private async startNewGame() {
    // Childhood opening per task §4
    this.audioHooks.civeton_ambience();

    // CH01-E01 childhood
    await this.showDialogueSequence([
      'childhood_start',
      'childhood_pate',
      'childhood_trade',
      'childhood_aimon',
      'childhood_end'
    ]);

    this.storyManager.completeEvent('CH01-E01');
    await this.saveGame('childhood_complete');

    // Transition to present
    this.currentMapId = 'civeton_village';
    this.state.current_map_id = this.currentMapId;
    this.player.setPosition(20, 15);
    this.state.player_position = { x: 20, y: 15, map_id: this.currentMapId };

    await this.showDialogueSequence(['wake_civeton']);

    this.storyManager.completeEvent('CH01-E02');
    this.state.town_states['Civeton'] = 'CONTESTED';
    await this.saveGame('civeton_arrived');

    this.checkStoryTriggers();
  }

  private async showDialogueSequence(dialogueIds: string[]) {
    this.isDialogueActive = true;
    for (const id of dialogueIds) {
      const dialogue = getDialogue(id);
      if (dialogue) {
        this.audioHooks.dialogue();
        await this.dialogueUI.show(dialogue);
      }
    }
    this.isDialogueActive = false;
    this.canvas.focus();
  }

  private async showSingleDialogue(id: string) {
    const dialogue = getDialogue(id);
    if (!dialogue) return;
    this.isDialogueActive = true;
    this.audioHooks.dialogue();
    await this.dialogueUI.show(dialogue);
    this.isDialogueActive = false;
    this.canvas.focus();
  }

  private tryInteract() {
    if (this.isDialogueActive || this.isBattleActive || this.isStarterSelectionActive) return;

    const map = getMap(this.currentMapId);
    if (!map) return;

    const playerPos = this.player.getPosition();

    // Check NPCs within interaction distance (1 tile + sensible distance)
    for (const npc of map.npcs) {
      const dist = Math.abs(npc.x - playerPos.x) + Math.abs(npc.y - playerPos.y);
      if (dist <= 1.5) {
        // Facing check — allow if player facing NPC or close
        this.handleNPCInteraction(npc);
        return;
      }
    }

    // Check triggers at player position
    for (const trigger of map.triggers) {
      if (playerPos.x >= trigger.x && playerPos.x < trigger.x + trigger.width &&
          playerPos.y >= trigger.y && playerPos.y < trigger.y + trigger.height) {
        this.handleTrigger(trigger.id);
        return;
      }
    }
  }

  private async handleNPCInteraction(npc: any) {
    this.audioHooks.interaction();

    // Special handling for Kurg
    if (npc.id === 'npc_kurg') {
      await this.handleKurgInteraction();
      return;
    }

    // Generic NPC dialogue
    const dialogue = getDialogue(npc.dialogue_id);
    if (dialogue) {
      await this.showSingleDialogue(npc.dialogue_id);
    }
  }

  private async handleKurgInteraction() {
    // Kurg interaction flow per task §4, §22
    if (!this.storyManager.hasFlag('pate_house_checked') || !this.storyManager.hasFlag('trade_message_found')) {
      await this.showSingleDialogue('kurg_first');
      await this.showSingleDialogue('villager_well'); // hint
      return;
    }

    if (!this.storyManager.hasFlag('kurg_first_talk')) {
      await this.showDialogueSequence(['kurg_first', 'kurg_refusal']);
      this.storyManager.setFlag('kurg_first_talk', true);
      this.storyManager.setFlag('kurg_refused', true);
      await this.saveGame('kurg_first_talk');
    }

    if (!this.storyManager.hasFlag('kurg_revealed_request')) {
      await this.showSingleDialogue('kurg_reveal');
      this.storyManager.setFlag('kurg_revealed_request', true);
      this.storyManager.setFlag('starter_choice_available', true);
      await this.saveGame('kurg_revealed');
    }

    if (this.storyManager.hasFlag('starter_choice_available') && !this.storyManager.hasFlag('starter_chosen')) {
      await this.showSingleDialogue('kurg_starter');
      await this.triggerStarterChoice();
      return;
    }

    if (this.storyManager.hasFlag('starter_chosen') && !this.storyManager.hasFlag('first_battle_complete')) {
      await this.showSingleDialogue('kurg_battle_intro');
      await this.triggerFirstBattle();
      return;
    }

    if (this.storyManager.hasFlag('first_battle_complete')) {
      await this.showSingleDialogue('kurg_post_battle_win');
    }
  }

  private async handleTrigger(triggerId: string) {
    // Map triggers to story events
    if (triggerId === 'trigger_pate_house') {
      if (!this.storyManager.hasFlag('pate_house_checked')) {
        await this.showSingleDialogue('pate_house_empty');
        this.storyManager.completeEvent('CH01-E03');
        await this.saveGame('pate_house_checked');
      }
    } else if (triggerId === 'trigger_trade_house') {
      if (!this.storyManager.hasFlag('trade_message_found')) {
        await this.showDialogueSequence(['trade_house', 'trade_message', 'trade_message_context']);
        this.storyManager.setFlag('trade_message_found', true);
        // Also set pate checked if not already
        if (!this.storyManager.hasFlag('pate_house_checked')) {
          this.storyManager.setFlag('pate_house_checked', true);
          this.storyManager.completeEvent('CH01-E03');
        }
        this.storyManager.completeEvent('CH01-E04');
        await this.saveGame('trade_message_found');
      }
    } else if (triggerId === 'trigger_kurg') {
      await this.handleKurgInteraction();
    }
  }

  private checkStoryTriggers() {
    // Check if starter choice should be available etc.
    // This is called after load and after events
  }

  private async triggerStarterChoice() {
    if (this.isStarterSelectionActive) return;
    this.isStarterSelectionActive = true;
    this.audioHooks.starter_selection();

    return new Promise<void>((resolve) => {
      this.starterUI.show(async (speciesId) => {
        this.starterUI.hide();
        this.isStarterSelectionActive = false;

        // Assign starters per provisional rule, persistently, atomically
        // Task: All three starter-instance assignments must be committed consistently as part of choice
        // Do not create situation where save interruption can result in contradictory ownership
        // Must feed actual game state, not merely choose sprite

        const species = getSpecies(speciesId);
        if (!species) {
          console.error('Invalid species', speciesId);
          resolve();
          return;
        }

        const assignment = assignRemainingStarters(speciesId);

        // Create Abyssal instances with correct initialization
        // Each of three original starter instances begins with starter_lives_remaining=3
        // Do not give this property to ordinary members

        const createStarterInstance = (sId: string, owner: 'AIMON' | 'PATE' | 'TRADE', level: number = 5): AbyssalInstance => {
          const sp = getSpecies(sId)!;
          const instanceId = `starter_${owner}_${sId}_${Date.now()}`;
          const growthSeed = generateGrowthSeed(sId, instanceId);
          const stats = calculateStatsAtLevel(sp, level, growthSeed);
          const maxHp = stats.hp;
          const moves = STARTER_LEARNSETS[sId] || ['TACKLE'];

          return {
            instance_id: instanceId,
            species_id: sId,
            nickname: sp.name,
            level,
            xp: (level - 1) * 100,
            growth_seed: growthSeed,
            max_hp: maxHp,
            current_hp: maxHp,
            stats,
            moves: moves.slice(0, 4),
            pp: moves.reduce((acc, mId) => {
              const move = getMove(mId);
              acc[mId] = move?.pp ?? 20;
              return acc;
            }, {} as Record<string, number>),
            status: null,
            is_original_starter: true,
            starter_lives_remaining: 3,
            original_owner: owner,
            is_dead: false
          };
        };

        const aimonInstance = createStarterInstance(speciesId, 'AIMON');
        const pateInstance = createStarterInstance(assignment.pateId, 'PATE');
        const tradeInstance = createStarterInstance(assignment.tradeId, 'TRADE');

        // Commit to state atomically
        this.state.player_starter_species_id = speciesId;
        this.state.pate_starter_species_id = assignment.pateId;
        this.state.trade_starter_species_id = assignment.tradeId;
        this.state.starter_instances = {
          aimon: aimonInstance,
          pate: pateInstance,
          trade: tradeInstance
        };
        this.state.party = [aimonInstance];
        this.state.reserve = [];

        this.storyManager.completeEvent('CH01-E05');
        this.state.story_flags['starter_chosen'] = true;
        this.state.story_flags['first_battle_available'] = true;

        // Transactional save — all assignments committed consistently
        await this.saveGame('starter_choice_CH01-E05');

        console.log('Starter chosen:', speciesId, 'Pate:', assignment.pateId, 'Trade:', assignment.tradeId);

        // Trigger battle after short delay
        setTimeout(async () => {
          await this.showSingleDialogue('kurg_battle_intro');
          await this.triggerFirstBattle();
          resolve();
        }, 500);
      });
    });
  }

  private async triggerFirstBattle() {
    if (this.isBattleActive) return;
    this.isBattleActive = true;
    this.audioHooks.battle_transition();

    // Use canonical trainer/soldier and opponent Abyssal defined by story/trainer data
    // Provisional since real data absent
    const trainer = getTrainer('KURG_SOLDIER_TUTORIAL')!;
    const opponentSpeciesId = trainer.team[0];
    const opponentSpecies = getSpecies(opponentSpeciesId)!;

    const opponentInstance: AbyssalInstance = {
      instance_id: `opponent_${opponentSpeciesId}_${Date.now()}`,
      species_id: opponentSpeciesId,
      level: trainer.level,
      xp: (trainer.level - 1) * 100,
      growth_seed: generateGrowthSeed(opponentSpeciesId, `opp_${Date.now()}`),
      max_hp: calculateStatsAtLevel(opponentSpecies, trainer.level, 12345).hp,
      current_hp: calculateStatsAtLevel(opponentSpecies, trainer.level, 12345).hp,
      stats: calculateStatsAtLevel(opponentSpecies, trainer.level, 12345),
      moves: STARTER_LEARNSETS[opponentSpeciesId] || ['TACKLE'],
      pp: {},
      status: null,
      is_dead: false
    };
    // Fill PP
    opponentInstance.pp = opponentInstance.moves.reduce((acc, mId) => {
      const move = getMove(mId);
      acc[mId] = move?.pp ?? 20;
      return acc;
    }, {} as Record<string, number>);

    const playerActive = this.state.party[0];
    if (!playerActive) {
      console.error('No player party');
      this.isBattleActive = false;
      return;
    }

    const battleState: BattleState = {
      battle_id: `battle_${Date.now()}`,
      is_tutorial: true, // Controlled tutorial encounter per task §15
      player_team: [playerActive],
      enemy_team: [opponentInstance],
      enemy_trainer: trainer,
      current_player_index: 0,
      current_enemy_index: 0,
      turn: 1,
      log: [`A ${trainer.name} wants to test you!`, `Go! ${playerActive.nickname || playerActive.species_id}!`, `Enemy sent out ${opponentSpecies.name}!`],
      is_over: false,
      rng_seed: SeededRNG.hashString(`${this.state.commit_seq}_${Date.now()}`)
    };

    const battleEngine = new BattleEngine(battleState);

    this.battleUI.show(battleState, async (moveId) => {
      if (moveId === '__CONTINUE__') {
        // Battle over, return to exploration
        this.battleUI.hide();
        this.isBattleActive = false;

        // Update party from battle result (HP, lives, etc.)
        const finalPlayer = battleEngine.getState().player_team[0];
        this.state.party[0] = finalPlayer;
        if (this.state.starter_instances?.aimon) {
          this.state.starter_instances.aimon = finalPlayer;
        }

        this.storyManager.completeEvent('CH01-E06');
        this.storyManager.completeEvent('CH01-E07');
        this.state.first_battle_result = battleEngine.getState().result;
        this.state.story_flags['first_battle_complete'] = true;
        this.state.story_flags['post_battle_return'] = true;
        this.state.current_map_id = 'civeton_village';
        this.state.player_position = { x: 26, y: 10, map_id: 'civeton_village' };
        this.player.setPosition(26, 10);

        await this.saveGame('first_battle_complete_CH01-E06_E07');

        await this.showSingleDialogue('kurg_post_battle_win');

        this.audioHooks.victory();

        console.log('Battle complete, post-battle state', this.state);
        this.canvas.focus();
        return;
      }

      // Player selected move
      const playerAction: BattleAction = { type: 'MOVE', moveId };
      const enemyAction = battleEngine.getEnemyAction();

      // Play VFX — player attack travels from foreground to enemy
      await this.battleUI.playPlayerAttack(moveId);
      this.audioHooks.attack();

      // Enemy attack — sprite lunge + screen impact
      const result = battleEngine.executeTurn(playerAction, enemyAction);

      // Update UI with intermediate state
      this.battleUI.updateBattleState(battleEngine.getState());

      // Play enemy attack if it did damage
      if (result.enemyDamage && result.enemyDamage > 0) {
        await this.battleUI.playEnemyAttack();
        this.audioHooks.damage();
        await this.battleUI.playDamage(true, result.enemyDamage);
      }

      if (result.playerDamage && result.playerDamage > 0) {
        await this.battleUI.playEnemyShake();
        await this.battleUI.playDamage(false, result.playerDamage);
      }

      // Update again after animations
      this.battleUI.updateBattleState(battleEngine.getState());

      // Check if over
      if (result.isOver) {
        // Battle log already updated
        this.battleUI.updateBattleState(battleEngine.getState());
      }
    });
  }

  private async saveGame(description: string) {
    try {
      this.storyManager.updateState(this.state);
      const newState = await this.persistence.commit(this.state, description);
      this.state = newState;
      this.storyManager.updateState(newState);
      console.log(`Saved: ${description} seq ${newState.commit_seq}`);
    } catch (e) {
      console.error('Save failed', e);
    }
  }

  private gameLoop = (now: number) => {
    const deltaTime = (now - this.lastTime) / 1000; // seconds
    this.lastTime = now;

    // Only update game logic if not in dialogue/battle/starter selection
    if (!this.isDialogueActive && !this.isBattleActive && !this.isStarterSelectionActive) {
      this.update(deltaTime);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    const map = getMap(this.currentMapId);
    if (!map) return;

    // Handle input — 4 directions only, no diagonal per ACTIVE_CANON
    let moved = false;

    // Prioritize most recent key? Simple: check in order
    if (this.keys.has('w') || this.keys.has('arrowup')) {
      moved = this.player.tryMove('UP', map) || moved;
    } else if (this.keys.has('s') || this.keys.has('arrowdown')) {
      moved = this.player.tryMove('DOWN', map) || moved;
    } else if (this.keys.has('a') || this.keys.has('arrowleft')) {
      moved = this.player.tryMove('LEFT', map) || moved;
    } else if (this.keys.has('d') || this.keys.has('arrowright')) {
      moved = this.player.tryMove('RIGHT', map) || moved;
    }

    // Update player movement
    const result = this.player.update(deltaTime, map);
    if (result.moved) {
      this.state.player_position = {
        x: this.player.x,
        y: this.player.y,
        map_id: this.currentMapId
      };

      // Check warps
      const warp = map.warps.find(w => w.x === this.player.x && w.y === this.player.y);
      if (warp) {
        this.currentMapId = warp.target_map as MapId;
        this.state.current_map_id = this.currentMapId;
        this.player.setPosition(warp.target_x, warp.target_y);
        this.state.player_position = { x: warp.target_x, y: warp.target_y, map_id: this.currentMapId };
        console.log(`Warped to ${this.currentMapId}`);
      }

      // Check triggers
      for (const trigger of map.triggers) {
        if (this.player.x >= trigger.x && this.player.x < trigger.x + trigger.width &&
            this.player.y >= trigger.y && this.player.y < trigger.y + trigger.height) {
          if (trigger.one_shot && this.storyManager.isEventComplete(trigger.event_id as any)) {
            continue;
          }
          // Don't auto-trigger if it's Kurg or houses that need interaction — but for slice, auto-trigger houses
          if (trigger.id.includes('pate') || trigger.id.includes('trade')) {
            this.handleTrigger(trigger.id);
          }
        }
      }
    }

    // Update camera — deliberate and readable, not twitchy, no excessive smoothing
    const targetCameraX = this.player.pixelX - this.gameWidth / 2 + this.tileSize / 2;
    const targetCameraY = this.player.pixelY - this.gameHeight / 2 + this.tileSize / 2;

    // Simple lerp for camera, but restrained
    this.cameraX += (targetCameraX - this.cameraX) * 0.1;
    this.cameraY += (targetCameraY - this.cameraY) * 0.1;

    // Clamp camera to map bounds
    const mapPixelWidth = map.width * this.tileSize;
    const mapPixelHeight = map.height * this.tileSize;
    this.cameraX = Math.max(0, Math.min(this.cameraX, mapPixelWidth - this.gameWidth));
    this.cameraY = Math.max(0, Math.min(this.cameraY, mapPixelHeight - this.gameHeight));

    // Store direction for renderer
    (globalThis as any).playerDirection = this.player.direction;
  }

  private render() {
    const map = getMap(this.currentMapId);
    if (!map) return;

    this.mapRenderer.render(map, this.player.pixelX, this.player.pixelY, this.cameraX, this.cameraY, this.gameWidth, this.gameHeight);

    // Render objective / HUD — clear state progression, not debug clutter
    this.renderHUD();
  }

  private renderHUD() {
    // Simple HUD — current objective, story flags, starter lives if applicable
    const ctx = this.ctx;

    // Top-left objective
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(10, 10, 250, 60);
    ctx.strokeStyle = '#3a3d4a';
    ctx.strokeRect(10, 10, 250, 60);

    ctx.fillStyle = '#e8e6e1';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';

    let objective = 'Explore Civeton';
    if (!this.storyManager.hasFlag('pate_house_checked')) {
      objective = 'Check Pate\'s house';
    } else if (!this.storyManager.hasFlag('trade_message_found')) {
      objective = 'Check Trade\'s house';
    } else if (!this.storyManager.hasFlag('kurg_revealed_request')) {
      objective = 'Talk to Kurg';
    } else if (!this.storyManager.hasFlag('starter_chosen')) {
      objective = 'Choose a starter (Kurg)';
    } else if (!this.storyManager.hasFlag('first_battle_complete')) {
      objective = 'Kurg\'s test battle';
    } else {
      objective = 'Post-battle: Find the March road';
    }

    ctx.fillText(`OBJ: ${objective}`, 20, 30);
    ctx.fillStyle = '#8a8d9a';
    ctx.font = '10px monospace';
    ctx.fillText(`Map: ${this.currentMapId}`, 20, 45);
    ctx.fillText(`Pos: ${this.player.x},${this.player.y}`, 20, 58);

    // Starter lives if in party
    if (this.state.party.length > 0) {
      const starter = this.state.party[0];
      if (starter.is_original_starter) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(this.gameWidth - 160, 10, 150, 40);
        ctx.strokeStyle = '#3a3d4a';
        ctx.strokeRect(this.gameWidth - 160, 10, 150, 40);

        ctx.fillStyle = '#6a8aba';
        ctx.font = '11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${starter.nickname || starter.species_id}`, this.gameWidth - 20, 25);
        ctx.fillStyle = '#e8e6e1';
        ctx.fillText(`HP ${starter.current_hp}/${starter.max_hp}`, this.gameWidth - 20, 38);
        ctx.fillStyle = '#6a8aba';
        ctx.fillText(`Lives: ${'●'.repeat(starter.starter_lives_remaining || 0)}${'○'.repeat(3-(starter.starter_lives_remaining||0))}`, this.gameWidth - 20, 48);
      }
    }

    // Controls hint
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, this.gameHeight - 30, 300, 20);
    ctx.fillStyle = '#6a6d7a';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('WASD/Arrows Move • E/Space Interact • Ctrl+S Save', 15, this.gameHeight - 16);
  }

  // Public methods for testing
  getState(): GameState {
    return this.state;
  }

  getStoryManager(): StoryManager {
    return this.storyManager;
  }

  // For save/quit/reload testing
  async saveAndQuit() {
    await this.saveGame('save_and_quit');
    console.log('Saved and quit');
  }
}
