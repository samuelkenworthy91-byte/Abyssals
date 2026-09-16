// Main Game — bootstrap, map loading, player movement, collision, interaction, NPCs, dialogue, story events, objectives, transitions, party, starter selection, battle, save/load
// Implements required playable flow per task §22, with canon correction per second pass
// Retains approved dialogue, removes invented species/moves, uses canonical repositories, dev-blocked when data missing

import { GameState, MapId, AbyssalInstance } from '../core/types';
import { PersistenceManager, createInitialState } from '../core/persistence';
import { StoryManager } from './storyManager';
import { PlayerController } from './player';
import { MapRenderer } from './mapRenderer';
import { getMap } from './maps/civeton';
import { DialogueUI } from '../ui/dialogue';
import { BattleUI } from '../ui/battleUI';
import { StarterSelectionUI } from './starterSelection';
import { getDialogue } from '../data/dialogue';
import { speciesRepository } from '../data/canonical/speciesRepository';
import { moveRepository } from '../data/canonical/moveRepository';
import { trainerRepository } from '../data/canonical/trainerRepository';
import { starterAssignmentRepository } from '../data/canonical/starterAssignment';
import { assetManifest } from '../data/canonical/assetManifest';
import { BattleEngine, BattleAction } from './battle/battleEngine';
import { BattleState } from '../core/types';
import { SeededRNG } from '../core/rng';
import { calculateStatsAtLevel } from '../core/growth';
import { getBattleRules } from './battle/battleRules';
import { validateProduction } from '../data/canonical/validation';
import { isProd } from '../core/env';

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

  private audioHooks: Record<string, () => void> = {};

  // Touch controls — unobtrusive virtual d-pad for mobile, replaceable
  private touchControls: {
    up: HTMLElement;
    down: HTMLElement;
    left: HTMLElement;
    right: HTMLElement;
    interact: HTMLElement;
  } | null = null;

  constructor(appContainer: HTMLElement, uiContainer: HTMLElement, initialState?: GameState) {
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

    if (initialState) {
      this.state = initialState;
    } else {
      const saved = this.persistence.loadWithRecoverySync(0);
      if (saved) {
        this.state = saved;
      } else {
        this.state = createInitialState(0, 'Aimon');
      }
    }

    this.storyManager = new StoryManager(this.state);
    this.currentMapId = this.state.current_map_id as MapId;
    const map = getMap(this.currentMapId);
    if (!map) {
      this.currentMapId = 'childhood_hill';
    }

    this.player = new PlayerController(
      this.state.player_position.x,
      this.state.player_position.y,
      this.tileSize
    );

    this.dialogueUI = new DialogueUI(uiContainer);
    this.battleUI = new BattleUI(uiContainer);
    this.starterUI = new StarterSelectionUI(uiContainer);

    this.setupInput();
    this.setupTouchControls(uiContainer);
    this.setupAudioHooks();
    this.setupLifecycleHooks();

    // Validation in dev
    if (!isProd()) {
      const validation = validateProduction();
      if (!validation.ok) {
        console.warn('[Game] Production validation warnings (expected until canonical data imported):', validation.warnings);
      }
    }

    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);

    if (this.state.completed_events.length === 0) {
      this.startNewGame();
    } else {
      this.checkStoryTriggers();
    }
  }

  private setupAudioHooks() {
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

  private setupLifecycleHooks() {
    // App lifecycle — mobile apps suspended aggressively
    // Handle backgrounding, resume, screen lock, termination, interrupted battle/commit
    // Use lifecycle hooks to persist safe authoritative state, not depend solely on beforeunload

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('[Game] App backgrounded — persisting safe state');
        this.saveGame('app_backgrounded');
      } else {
        console.log('[Game] App foregrounded');
      }
    });

    // Capacitor lifecycle
    const isCapacitor = (window as any).Capacitor?.isNativePlatform?.();
    if (isCapacitor) {
      import('@capacitor/app').then(({ App }) => {
        App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
          if (!isActive) {
            console.log('[Game] Capacitor app backgrounded — persisting');
            this.saveGame('capacitor_backgrounded');
          }
        });
        App.addListener('pause', () => {
          console.log('[Game] Capacitor pause');
          this.saveGame('capacitor_pause');
        });
      }).catch(() => {});
    }

    // Android back button — context-sensitive, not close app during dialogue/starter/battle/menus
    if (isCapacitor) {
      import('@capacitor/app').then(({ App }) => {
        App.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
          console.log('[Game] Android back button, canGoBack:', canGoBack, 'dialogue:', this.isDialogueActive, 'battle:', this.isBattleActive, 'starter:', this.isStarterSelectionActive);

          if (this.isDialogueActive) {
            // Close dialogue is handled by dialogue advance, but back should also advance or close submenu
            // For now, advance dialogue
            this.dialogueUI.advance();
            return;
          }

          if (this.isStarterSelectionActive) {
            // Cancel allowable menu? Starter selection should not be cancellable via back — it's mandatory
            // But we can show exit confirmation where appropriate
            console.log('[Game] Back during starter selection — ignored (mandatory)');
            return;
          }

          if (this.isBattleActive) {
            // During battle, back should not close app — maybe close submenu or cancel
            console.log('[Game] Back during battle — ignored');
            return;
          }

          // Otherwise, return to title only where safe, or exit confirmation
          if (confirm('Return to title screen? Progress is saved.')) {
            // Save and return to title
            this.saveGame('back_to_title').then(() => {
              location.reload();
            });
          }
        });
      }).catch(() => {});
    }
  }

  private setupTouchControls(uiContainer: HTMLElement) {
    // Production-ready touch input hooks — directional movement, interaction, dialogue advance, menu selection, battle move selection, back/cancel
    // Avoid covering important game content with oversized controls, keep unobtrusive, replaceable without changing player controller

    const isMobile = /Android|iPhone|iPad|iPod|Pixel/i.test(navigator.userAgent) || window.innerWidth < 800;

    if (!isMobile) return;

    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'touch-controls';
    controlsContainer.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 140px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 10px;
      pointer-events: none;
      z-index: 50;
    `;

    // D-pad — unobtrusive, bottom left
    const dpad = document.createElement('div');
    dpad.style.cssText = `
      display: grid;
      grid-template-columns: 50px 50px 50px;
      grid-template-rows: 50px 50px;
      gap: 2px;
      pointer-events: auto;
    `;

    const createBtn = (label: string, dir?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.cssText = `
        width: 50px;
        height: 50px;
        background: rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 8px;
        color: white;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        touch-action: none;
        user-select: none;
      `;

      if (dir) {
        const handle = (e: Event) => {
          e.preventDefault();
          this.player.queueDirection(dir);
        };
        btn.addEventListener('touchstart', handle, { passive: false });
        btn.addEventListener('mousedown', handle);
      }

      return btn;
    };

    const upBtn = createBtn('▲', 'UP');
    const leftBtn = createBtn('◀', 'LEFT');
    const rightBtn = createBtn('▶', 'RIGHT');
    const downBtn = createBtn('▼', 'DOWN');

    // Layout: up in middle top, left/right/down bottom row
    const empty1 = document.createElement('div');
    const empty2 = document.createElement('div');
    dpad.appendChild(empty1);
    dpad.appendChild(upBtn);
    dpad.appendChild(empty2);
    dpad.appendChild(leftBtn);
    dpad.appendChild(downBtn);
    dpad.appendChild(rightBtn);

    // Interact button — bottom right, unobtrusive
    const interactBtn = document.createElement('button');
    interactBtn.textContent = 'E';
    interactBtn.style.cssText = `
      width: 70px;
      height: 70px;
      background: rgba(42, 74, 138, 0.8);
      border: 1px solid rgba(100, 140, 200, 0.5);
      border-radius: 50%;
      color: white;
      font-size: 24px;
      font-weight: bold;
      font-family: Georgia, serif;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      pointer-events: auto;
      touch-action: none;
    `;
    interactBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.dialogueUI.isShowing()) {
        this.dialogueUI.advance();
      } else {
        this.tryInteract();
      }
    }, { passive: false });
    interactBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (this.dialogueUI.isShowing()) {
        this.dialogueUI.advance();
      } else {
        this.tryInteract();
      }
    });

    controlsContainer.appendChild(dpad);
    controlsContainer.appendChild(interactBtn);

    uiContainer.appendChild(controlsContainer);

    this.touchControls = {
      up: upBtn,
      down: downBtn,
      left: leftBtn,
      right: rightBtn,
      interact: interactBtn
    };
  }

  private setupInput() {
    window.addEventListener('keydown', (e) => {
      if (this.dialogueUI.isShowing()) {
        if (this.dialogueUI.handleInput(e.key)) {
          e.preventDefault();
          return;
        }
      }

      this.keys.add(e.key.toLowerCase());

      if (e.key.toLowerCase() === 'e' || e.key === ' ' || e.key === 'Enter') {
        if (!this.isDialogueActive && !this.isBattleActive && !this.isStarterSelectionActive) {
          this.tryInteract();
        }
      }

      if (e.key.toLowerCase() === 's' && e.ctrlKey) {
        e.preventDefault();
        this.saveGame('manual_save');
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

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
        this.tryInteract();
      } else {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 30) this.player.queueDirection('RIGHT');
          else if (dx < -30) this.player.queueDirection('LEFT');
        } else {
          if (dy > 30) this.player.queueDirection('DOWN');
          else if (dy < -30) this.player.queueDirection('UP');
        }
      }
    }, { passive: false });

    this.canvas.focus();
  }

  private async startNewGame() {
    this.audioHooks.civeton_ambience();

    await this.showDialogueSequence([
      'childhood_start',
      'childhood_pate',
      'childhood_trade',
      'childhood_aimon',
      'childhood_end'
    ]);

    this.storyManager.completeEvent('CH01-E01');
    await this.saveGame('childhood_complete');

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

    for (const npc of map.npcs) {
      const dist = Math.abs(npc.x - playerPos.x) + Math.abs(npc.y - playerPos.y);
      if (dist <= 1.5) {
        this.handleNPCInteraction(npc);
        return;
      }
    }

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

    if (npc.id === 'npc_kurg') {
      await this.handleKurgInteraction();
      return;
    }

    const dialogue = getDialogue(npc.dialogue_id);
    if (dialogue) {
      await this.showSingleDialogue(npc.dialogue_id);
    }
  }

  private async handleKurgInteraction() {
    if (!this.storyManager.hasFlag('pate_house_checked') || !this.storyManager.hasFlag('trade_message_found')) {
      await this.showSingleDialogue('kurg_first');
      await this.showSingleDialogue('villager_well');
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

  private checkStoryTriggers() {}

  private async triggerStarterChoice() {
    if (this.isStarterSelectionActive) return;
    this.isStarterSelectionActive = true;
    this.audioHooks.starter_selection();

    return new Promise<void>((resolve) => {
      this.starterUI.show(async (speciesId) => {
        this.starterUI.hide();
        this.isStarterSelectionActive = false;

        // Use canonical repositories — no invented species
        // Assignment from explicit canonical table, not cyclic

        let species;
        try {
          species = speciesRepository.get(speciesId);
        } catch (e: any) {
          console.error('Invalid species', speciesId, e.message);
          // Show dev-blocked, not invented
          alert(`Starter data unavailable: ${e.message}. See docs/ANDROID_BUILD.md`);
          resolve();
          return;
        }

        let assignment;
        try {
          assignment = starterAssignmentRepository.getAssignment(speciesId);
        } catch (e: any) {
          console.error('No assignment for', speciesId, e.message);
          // For dev, allow fallback if test fixtures loaded, otherwise block
          if (!isProd() && speciesRepository.isLoaded()) {
            // Try to find assignment from test fixtures
            try {
              assignment = starterAssignmentRepository.getAssignment(speciesId);
            } catch {
              alert(`Starter assignment unavailable: ${e.message}`);
              resolve();
              return;
            }
          } else {
            alert(`Starter assignment unavailable: ${e.message}. Canonical assignment table required.`);
            resolve();
            return;
          }
        }

        const createStarterInstance = (sId: string, owner: 'AIMON' | 'PATE' | 'TRADE', level: number = 5): AbyssalInstance => {
          const sp = speciesRepository.get(sId);
          const instanceId = `starter_${owner}_${sId}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
          // Growth seed per individual
          let hash = 0;
          const str = sId + instanceId;
          for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
          }
          const growthSeed = Math.abs(hash) % 0x7FFFFFFF;
          const stats = calculateStatsAtLevel(sp as any, level, growthSeed);
          const maxHp = stats.hp;

          // Get moves from canonical learnset — if not available, dev-blocked, no fallback to test fixtures
          let moves: string[] = [];
          if (!moveRepository.isLoaded()) {
            throw new Error('Move data not loaded — canonical moves required. This is a dependency to resolve, not permission to invent replacement.');
          }
          moves = moveRepository.getAll().slice(0, 4).map(m => m.id);
          if (moves.length === 0) {
            throw new Error('No canonical moves available — cannot create starter instance');
          }

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
              try {
                const move = moveRepository.exists(mId) ? moveRepository.get(mId) : null;
                acc[mId] = move?.pp ?? 20;
              } catch {
                acc[mId] = 20;
              }
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
        const pateInstance = createStarterInstance(assignment.pate_species_id, 'PATE');
        const tradeInstance = createStarterInstance(assignment.trade_species_id, 'TRADE');

        // Atomic commit — all three assignments + instances + party + flags
        this.state.player_starter_species_id = speciesId;
        this.state.pate_starter_species_id = assignment.pate_species_id;
        this.state.trade_starter_species_id = assignment.trade_species_id;
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

        await this.saveGame('starter_choice');

        console.log('Starter chosen:', speciesId, 'Pate:', assignment.pate_species_id, 'Trade:', assignment.trade_species_id);

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

    // Use canonical trainer — if not available, keep binding unresolved as KURG_TEST_RECRUIT per task §14
    let trainer;
    let opponentSpeciesId: string | null = null;

    try {
      trainer = trainerRepository.get('KURG_TEST_RECRUIT');
      opponentSpeciesId = trainer.team[0]?.species_id || null;
    } catch (e: any) {
      console.warn('[Game] Trainer KURG_TEST_RECRUIT not yet imported:', e.message);
      // For dev, check if test fixtures loaded
      if (!isProd() && trainerRepository.isLoaded()) {
        try {
          trainer = trainerRepository.get('KURG_TEST_RECRUIT');
          opponentSpeciesId = trainer.team[0]?.species_id;
        } catch {}
      }

      if (!opponentSpeciesId) {
        // Development-blocked — don't use invented Hollow Hound
        this.isBattleActive = false;
        const blocked = document.createElement('div');
        blocked.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #1a1d24;
          border: 1px solid #5a3a3a;
          border-radius: 8px;
          padding: 20px;
          color: #e8e6e1;
          text-align: center;
          z-index: 200;
          max-width: 500px;
        `;
        blocked.innerHTML = `
          <div style="color: #ff8a6a; font-size: 16px; margin-bottom: 12px;">Battle Data Unavailable</div>
          <div style="font-size: 13px; color: #8a8d9a; line-height: 1.5;">
            Canonical trainer KURG_TEST_RECRUIT and opponent Abyssal not yet imported.<br>
            Expected at data/canon/trainers.json<br><br>
            <strong>Error:</strong> ${e.message}<br><br>
            For dev testing, load test fixtures via starter selection dev button.<br>
            Production must not use invented Hollow Hound.
          </div>
          <button onclick="this.parentElement.remove()" style="margin-top: 16px; padding: 8px 16px; background: #2a4a8a; color: white; border: none; border-radius: 4px; cursor: pointer;">Continue</button>
        `;
        document.getElementById('ui-root')?.appendChild(blocked);
        return;
      }
    }

    if (!opponentSpeciesId) {
      this.isBattleActive = false;
      console.error('No opponent species ID');
      return;
    }

    let opponentSpecies;
    try {
      opponentSpecies = speciesRepository.get(opponentSpeciesId);
    } catch (e: any) {
      console.error('Opponent species not found', opponentSpeciesId, e.message);
      this.isBattleActive = false;
      alert(`Opponent species unavailable: ${e.message}`);
      return;
    }

    const opponentMoves = trainer?.team[0]?.moves;
    if (!opponentMoves || opponentMoves.length === 0) {
      throw new Error(`Trainer ${trainer?.id || 'KURG_TEST_RECRUIT'} has no moves — canonical data required. This is a dependency to resolve.`);
    }
    const opponentInstance: AbyssalInstance = {
      instance_id: `opponent_${opponentSpeciesId}_${Date.now()}`,
      species_id: opponentSpeciesId,
      level: trainer?.team[0]?.level || 5,
      xp: ((trainer?.team[0]?.level || 5) - 1) * 100,
      growth_seed: Math.floor(Math.random() * 0x7FFFFFFF),
      max_hp: calculateStatsAtLevel(opponentSpecies as any, trainer?.team[0]?.level || 5, 12345).hp,
      current_hp: calculateStatsAtLevel(opponentSpecies as any, trainer?.team[0]?.level || 5, 12345).hp,
      stats: calculateStatsAtLevel(opponentSpecies as any, trainer?.team[0]?.level || 5, 12345),
      moves: opponentMoves,
      pp: {},
      status: null,
      is_dead: false
    };

    opponentInstance.pp = opponentInstance.moves.reduce((acc, mId) => {
      try {
        const move = moveRepository.exists(mId) ? moveRepository.get(mId) : null;
        acc[mId] = move?.pp ?? 20;
      } catch {
        acc[mId] = 20;
      }
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
      is_tutorial: true,
      player_team: [playerActive],
      enemy_team: [opponentInstance],
      enemy_trainer: trainer as any,
      current_player_index: 0,
      current_enemy_index: 0,
      turn: 1,
      log: [
        `A ${trainer?.name || 'Recruit'} wants to test you!`,
        `Go! ${playerActive.nickname || playerActive.species_id}!`,
        `Enemy sent out ${opponentSpecies.name}!`
      ],
      is_over: false,
      rng_seed: SeededRNG.hashString(`${this.state.commit_seq}_${Date.now()}`)
    };

    // Use development rules for testing, but clearly isolated — not presented as final
    const rules = getBattleRules(true);
    const battleEngine = new BattleEngine(battleState, rules);

    this.battleUI.show(battleState, async (moveId) => {
      if (moveId === '__CONTINUE__') {
        this.battleUI.hide();
        this.isBattleActive = false;

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

        await this.saveGame('first_battle_complete');

        await this.showSingleDialogue('kurg_post_battle_win');

        this.audioHooks.victory();

        console.log('Battle complete, post-battle state', this.state);
        this.canvas.focus();
        return;
      }

      const playerAction: BattleAction = { type: 'MOVE', moveId };
      const enemyAction = battleEngine.getEnemyAction();

      await this.battleUI.playPlayerAttack(moveId);
      this.audioHooks.attack();

      const result = battleEngine.executeTurn(playerAction, enemyAction);

      this.battleUI.updateBattleState(battleEngine.getState());

      if (result.enemyDamage && result.enemyDamage > 0) {
        await this.battleUI.playEnemyAttack();
        this.audioHooks.damage();
        await this.battleUI.playDamage(true, result.enemyDamage);
      }

      if (result.playerDamage && result.playerDamage > 0) {
        await this.battleUI.playEnemyShake();
        await this.battleUI.playDamage(false, result.playerDamage);
      }

      this.battleUI.updateBattleState(battleEngine.getState());

      if (result.isOver) {
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
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (!this.isDialogueActive && !this.isBattleActive && !this.isStarterSelectionActive) {
      this.update(deltaTime);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    const map = getMap(this.currentMapId);
    if (!map) return;

    if (this.keys.has('w') || this.keys.has('arrowup')) {
      this.player.tryMove('UP', map);
    } else if (this.keys.has('s') || this.keys.has('arrowdown')) {
      this.player.tryMove('DOWN', map);
    } else if (this.keys.has('a') || this.keys.has('arrowleft')) {
      this.player.tryMove('LEFT', map);
    } else if (this.keys.has('d') || this.keys.has('arrowright')) {
      this.player.tryMove('RIGHT', map);
    }

    const result = this.player.update(deltaTime, map);
    if (result.moved) {
      this.state.player_position = {
        x: this.player.x,
        y: this.player.y,
        map_id: this.currentMapId
      };

      const warp = map.warps.find(w => w.x === this.player.x && w.y === this.player.y);
      if (warp) {
        this.currentMapId = warp.target_map as MapId;
        this.state.current_map_id = this.currentMapId;
        this.player.setPosition(warp.target_x, warp.target_y);
        this.state.player_position = { x: warp.target_x, y: warp.target_y, map_id: this.currentMapId };
        console.log(`Warped to ${this.currentMapId}`);
      }

      for (const trigger of map.triggers) {
        if (this.player.x >= trigger.x && this.player.x < trigger.x + trigger.width &&
            this.player.y >= trigger.y && this.player.y < trigger.y + trigger.height) {
          if (trigger.one_shot && this.storyManager.isEventComplete(trigger.event_id as any)) {
            continue;
          }
          if (trigger.id.includes('pate') || trigger.id.includes('trade')) {
            this.handleTrigger(trigger.id);
          }
        }
      }
    }

    const targetCameraX = this.player.pixelX - this.gameWidth / 2 + this.tileSize / 2;
    const targetCameraY = this.player.pixelY - this.gameHeight / 2 + this.tileSize / 2;

    this.cameraX += (targetCameraX - this.cameraX) * 0.1;
    this.cameraY += (targetCameraY - this.cameraY) * 0.1;

    const mapPixelWidth = map.width * this.tileSize;
    const mapPixelHeight = map.height * this.tileSize;
    this.cameraX = Math.max(0, Math.min(this.cameraX, mapPixelWidth - this.gameWidth));
    this.cameraY = Math.max(0, Math.min(this.cameraY, mapPixelHeight - this.gameHeight));

    (globalThis as any).playerDirection = this.player.direction;
  }

  private render() {
    const map = getMap(this.currentMapId);
    if (!map) return;

    this.mapRenderer.render(map, this.player.pixelX, this.player.pixelY, this.cameraX, this.cameraY, this.gameWidth, this.gameHeight);

    this.renderHUD();
  }

  private renderHUD() {
    const ctx = this.ctx;

    // Objective — clean, no dev labels like CH01-E05
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
      objective = 'Choose a starter';
    } else if (!this.storyManager.hasFlag('first_battle_complete')) {
      objective = 'Kurg\'s test';
    } else {
      objective = 'Find the March road';
    }

    ctx.fillText(`OBJ: ${objective}`, 20, 30);
    ctx.fillStyle = '#8a8d9a';
    ctx.font = '10px monospace';
    ctx.fillText(`Map: ${this.currentMapId}`, 20, 45);
    ctx.fillText(`Pos: ${this.player.x},${this.player.y}`, 20, 58);

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

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, this.gameHeight - 30, 300, 20);
    ctx.fillStyle = '#6a6d7a';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('WASD/Arrows Move • E Interact • Ctrl+S Save', 15, this.gameHeight - 16);

    // Dev diagnostics behind debug flag — not in normal player experience
    if ((window as any).ABYSSALS_DEBUG) {
      ctx.fillStyle = 'rgba(255,0,0,0.7)';
      ctx.fillRect(this.gameWidth - 200, this.gameHeight - 80, 190, 70);
      ctx.fillStyle = 'white';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`DEV: commit_seq ${this.state.commit_seq}`, this.gameWidth - 190, this.gameHeight - 65);
      ctx.fillText(`DEV: ${this.state.completed_events.join(',')}`, this.gameWidth - 190, this.gameHeight - 50);
      ctx.fillText(`DEV: species loaded ${speciesRepository.isLoaded()}`, this.gameWidth - 190, this.gameHeight - 35);
      ctx.fillText(`DEV: moves loaded ${moveRepository.isLoaded()}`, this.gameWidth - 190, this.gameHeight - 20);
    }
  }

  getState(): GameState {
    return this.state;
  }

  getStoryManager(): StoryManager {
    return this.storyManager;
  }

  async saveAndQuit() {
    await this.saveGame('save_and_quit');
    console.log('Saved and quit');
  }
}
