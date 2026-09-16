// Battle UI — first-person DWM style, HP bars + exact numbers, move selection, PP, battle text, damage feedback
// Per task §13, §14: no back sprite, enemy front sprite visible, player attacks VFX foreground->enemy, enemy attacks via sprite lunge + screen impact

import { BattleState, AbyssalInstance } from '../core/types';
import { getMove } from '../data/moves';
import { MapRenderer } from '../game/mapRenderer';

export class BattleUI {
  private container: HTMLElement;
  private mapRenderer: MapRenderer;
  private battleState: BattleState | null = null;
  private onMoveSelected: ((moveId: string) => void) | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationState: {
    enemyShake: boolean;
    enemyLunge: boolean;
    playerAttackVFX: { active: boolean; progress: number; moveId?: string };
    damageNumbers: { x: number; y: number; value: number; progress: number; isPlayer: boolean }[];
    screenShake: boolean;
  } = {
    enemyShake: false,
    enemyLunge: false,
    playerAttackVFX: { active: false, progress: 0 },
    damageNumbers: [],
    screenShake: false
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.canvas.style.cssText = `
      width: 100%;
      height: 100%;
      max-width: 800px;
      max-height: 600px;
      image-rendering: pixelated;
      background: #0f1115;
    `;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    this.ctx = ctx;

    // Create a dummy canvas for MapRenderer (we only use its enemy sprite renderer)
    const dummyCanvas = document.createElement('canvas');
    this.mapRenderer = new MapRenderer(dummyCanvas);
  }

  show(battleState: BattleState, onMoveSelected: (moveId: string) => void): void {
    this.battleState = battleState;
    this.onMoveSelected = onMoveSelected;
    this.container.innerHTML = '';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0f1115;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
    `;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      width: 100%;
      height: 100%;
      max-width: 800px;
      max-height: 600px;
      display: flex;
      flex-direction: column;
      background: linear-gradient(to bottom, #1a1d24, #0f1115);
      border: 1px solid #2a2d3a;
      box-shadow: 0 0 40px rgba(0,0,0,0.9);
      position: relative;
      overflow: hidden;
    `;

    // Battle canvas area
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
      flex: 1;
      position: relative;
      background: radial-gradient(ellipse at center, #1e2128 0%, #0f1115 100%);
      overflow: hidden;
    `;
    canvasContainer.appendChild(this.canvas);

    // Enemy HP bar — top
    const enemyHPContainer = document.createElement('div');
    enemyHPContainer.id = 'enemy-hp';
    enemyHPContainer.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      background: rgba(0,0,0,0.7);
      border: 1px solid #3a3d4a;
      border-radius: 6px;
      padding: 10px;
      backdrop-filter: blur(4px);
    `;

    // Player HP bar — bottom, but player active not rendered per first-person spec
    const playerHPContainer = document.createElement('div');
    playerHPContainer.id = 'player-hp';
    playerHPContainer.style.cssText = `
      position: absolute;
      bottom: 140px;
      left: 20px;
      right: 20px;
      background: rgba(0,0,0,0.7);
      border: 1px solid #3a3d4a;
      border-radius: 6px;
      padding: 10px;
      backdrop-filter: blur(4px);
    `;

    // Battle text log
    const battleLog = document.createElement('div');
    battleLog.id = 'battle-log';
    battleLog.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 130px;
      background: linear-gradient(to bottom, #1e2128, #16181e);
      border-top: 1px solid #3a3d4a;
      padding: 12px;
      font-family: Georgia, serif;
      font-size: 14px;
      color: #e8e6e1;
      overflow-y: auto;
      line-height: 1.4;
    `;

    // Move selection — bottom
    const moveSelection = document.createElement('div');
    moveSelection.id = 'move-selection';
    moveSelection.style.cssText = `
      position: absolute;
      bottom: 130px;
      left: 0;
      right: 0;
      background: rgba(22, 24, 30, 0.95);
      border-top: 1px solid #3a3d4a;
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    `;

    canvasContainer.appendChild(enemyHPContainer);
    canvasContainer.appendChild(playerHPContainer);
    canvasContainer.appendChild(battleLog);
    canvasContainer.appendChild(moveSelection);

    wrapper.appendChild(canvasContainer);
    this.container.appendChild(wrapper);

    this.render();
    this.updateMoveSelection();
  }

  private render() {
    if (!this.battleState) return;

    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Background — darker grounded fantasy, not glossy
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
    gradient.addColorStop(0, '#1e2128');
    gradient.addColorStop(1, '#0f1115');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Battlefield ground — simple
    ctx.fillStyle = '#2a2d3a';
    ctx.fillRect(0, canvas.height*0.6, canvas.width, canvas.height*0.4);
    ctx.fillStyle = '#3a3d4a';
    ctx.fillRect(0, canvas.height*0.6, canvas.width, 4);

    // Enemy sprite — front-facing, visible battlefield contains enemy's existing front-facing sprite
    // Per task: player's Abyssal is effectively in front/behind camera and therefore not rendered as back sprite
    const enemy = this.battleState.enemy_team[this.battleState.current_enemy_index];
    if (enemy) {
      const size = 180;
      const x = (canvas.width - size)/2;
      const y = canvas.height*0.25;

      this.mapRenderer.renderEnemySprite(
        ctx,
        enemy.species_id,
        x,
        y,
        size,
        this.animationState.enemyShake,
        this.animationState.enemyLunge
      );

      // Enemy shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(x + size/2, y + size - 5, size/3, 10, 0, 0, Math.PI*2);
      ctx.fill();
    }

    // Player attack VFX — travelling from foreground toward visible enemy
    if (this.animationState.playerAttackVFX.active) {
      const progress = this.animationState.playerAttackVFX.progress;
      const moveId = this.animationState.playerAttackVFX.moveId;
      const move = moveId ? getMove(moveId) : null;

      // VFX from bottom center to enemy center
      const startX = canvas.width/2;
      const startY = canvas.height - 50;
      const endX = canvas.width/2;
      const endY = canvas.height*0.35;

      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;

      // Draw VFX based on type
      ctx.save();
      ctx.globalAlpha = 1 - progress*0.5;

      if (move?.vfx_type === 'fire') {
        ctx.fillStyle = '#ff6a2a';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 12 + progress*8, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#ffaa44';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, Math.PI*2);
        ctx.fill();
      } else if (move?.vfx_type === 'water') {
        ctx.fillStyle = '#4a8aba';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 10, 0, Math.PI*2);
        ctx.fill();
      } else if (move?.vfx_type === 'earth') {
        ctx.fillStyle = '#5a6a3a';
        ctx.fillRect(currentX-8, currentY-8, 16, 16);
      } else {
        // physical dash
        ctx.fillStyle = '#e8e6e1';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI*2);
        ctx.fill();
        // Trail
        ctx.strokeStyle = 'rgba(232, 230, 225, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Damage numbers
    for (const dmg of this.animationState.damageNumbers) {
      const alpha = 1 - dmg.progress;
      const yOffset = dmg.progress * -40;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = dmg.isPlayer ? '#ff6a6a' : '#6aff6a';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`-${dmg.value}`, dmg.x, dmg.y + yOffset);
      ctx.restore();
    }

    // Screen impact for enemy attacks — foreground impact, screen impact
    if (this.animationState.screenShake) {
      ctx.fillStyle = 'rgba(255, 80, 80, 0.15)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    this.updateHPBars();
  }

  private updateHPBars() {
    if (!this.battleState) return;

    const enemy = this.battleState.enemy_team[this.battleState.current_enemy_index];
    const player = this.battleState.player_team[this.battleState.current_player_index];

    const enemyContainer = document.getElementById('enemy-hp');
    const playerContainer = document.getElementById('player-hp');

    if (enemyContainer && enemy) {
      const hpPercent = (enemy.current_hp / enemy.max_hp) * 100;
      const isLow = hpPercent < 25;
      enemyContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-weight: bold; color: #e8e6e1;">${enemy.species_id} Lv${enemy.level}</span>
          <span style="font-family: monospace; font-size: 12px; color: ${isLow ? '#ff6a6a' : '#a0a0a0'};">${enemy.current_hp}/${enemy.max_hp}</span>
        </div>
        <div style="width: 100%; height: 8px; background: #0f1115; border-radius: 4px; overflow: hidden; border: 1px solid #2a2d3a;">
          <div style="width: ${hpPercent}%; height: 100%; background: ${isLow ? '#ff4a4a' : hpPercent < 50 ? '#ffaa4a' : '#4a8a4a'}; transition: width 0.5s ease;"></div>
        </div>
      `;
    }

    if (playerContainer && player) {
      const hpPercent = (player.current_hp / player.max_hp) * 100;
      const isLow = hpPercent < 25;
      const lives = player.starter_lives_remaining !== undefined ? ` <span style="color: #6a8aba;">[${'●'.repeat(player.starter_lives_remaining)}${'○'.repeat(3-player.starter_lives_remaining)}]</span>` : '';
      playerContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-weight: bold; color: #e8e6e1;">${player.nickname || player.species_id} Lv${player.level}${lives}</span>
          <span style="font-family: monospace; font-size: 12px; color: ${isLow ? '#ff6a6a' : '#a0a0a0'};">${player.current_hp}/${player.max_hp}</span>
        </div>
        <div style="width: 100%; height: 8px; background: #0f1115; border-radius: 4px; overflow: hidden; border: 1px solid #2a2d3a;">
          <div style="width: ${hpPercent}%; height: 100%; background: ${isLow ? '#ff4a4a' : hpPercent < 50 ? '#ffaa4a' : '#4a8a4a'}; transition: width 0.5s ease;"></div>
        </div>
        ${player.is_original_starter ? `<div style="font-size: 10px; color: #6a8aba; margin-top: 4px; font-family: monospace;">STARTER • ${player.starter_lives_remaining} LIVES • 10% RETURN</div>` : ''}
      `;
    }
  }

  private updateMoveSelection() {
    if (!this.battleState) return;

    const container = document.getElementById('move-selection');
    const logContainer = document.getElementById('battle-log');
    if (!container) return;

    const player = this.battleState.player_team[this.battleState.current_player_index];
    if (!player) return;

    container.innerHTML = '';

    // Show last log entries
    if (logContainer) {
      logContainer.innerHTML = this.battleState.log.slice(-6).map(l => `<div>${l}</div>`).join('');
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    if (this.battleState.is_over) {
      const resultDiv = document.createElement('div');
      resultDiv.style.cssText = `grid-column: 1 / -1; text-align: center; padding: 20px; font-weight: bold; color: #e8e6e1;`;
      resultDiv.textContent = this.battleState.result === 'WIN' || this.battleState.result === 'TUTORIAL_WIN' ? 'Victory!' : 'Defeat...';
      container.appendChild(resultDiv);

      const continueBtn = document.createElement('button');
      continueBtn.textContent = 'Continue';
      continueBtn.style.cssText = `
        grid-column: 1 / -1;
        padding: 12px;
        background: #2a4a8a;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: Georgia, serif;
      `;
      continueBtn.onclick = () => {
        // Will be handled by game loop to return to overworld
        if (this.onMoveSelected) {
          // Use special signal
          (this.onMoveSelected as any)('__CONTINUE__');
        }
      };
      container.appendChild(continueBtn);
      return;
    }

    // Move buttons
    player.moves.forEach(moveId => {
      const move = getMove(moveId);
      if (!move) return;

      const pp = player.pp[moveId] ?? move.pp;
      const btn = document.createElement('button');
      btn.style.cssText = `
        padding: 10px;
        background: #1e2128;
        border: 1px solid #3a3d4a;
        border-radius: 6px;
        color: #e8e6e1;
        cursor: pointer;
        text-align: left;
        font-family: Georgia, serif;
        transition: all 0.15s;
      `;
      btn.innerHTML = `
        <div style="font-weight: bold; display: flex; justify-content: space-between;">
          <span>${move.name}</span>
          <span style="font-size: 11px; color: #8a8a8a; font-family: monospace;">${move.type}</span>
        </div>
        <div style="font-size: 11px; color: #6a6d7a; margin-top: 2px; display: flex; justify-content: space-between;">
          <span>${move.category} ${move.power ? `PWR ${move.power}` : ''}</span>
          <span>PP ${pp}/${move.pp}</span>
        </div>
      `;

      btn.onmouseenter = () => {
        btn.style.background = '#2a2d3a';
        btn.style.borderColor = '#5a6a8a';
      };
      btn.onmouseleave = () => {
        btn.style.background = '#1e2128';
        btn.style.borderColor = '#3a3d4a';
      };

      btn.onclick = () => {
        if (pp <= 0) return;
        this.onMoveSelected?.(moveId);
      };

      if (pp <= 0) {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
      }

      container.appendChild(btn);
    });
  }

  // Animation helpers
  async playPlayerAttack(moveId: string): Promise<void> {
    this.animationState.playerAttackVFX = { active: true, progress: 0, moveId };
    return new Promise(resolve => {
      const duration = 600;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        this.animationState.playerAttackVFX.progress = progress;
        this.render();
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animationState.playerAttackVFX.active = false;
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  async playEnemyAttack(): Promise<void> {
    this.animationState.enemyLunge = true;
    this.animationState.screenShake = true;
    this.render();
    await new Promise(r => setTimeout(r, 200));
    this.animationState.enemyLunge = false;
    this.render();
    await new Promise(r => setTimeout(r, 100));
    this.animationState.screenShake = false;
    this.render();
  }

  async playDamage(isPlayer: boolean, value: number, x?: number, y?: number): Promise<void> {
    const canvas = this.canvas;
    const dmgX = x ?? canvas.width/2 + (isPlayer ? -100 : 100);
    const dmgY = y ?? canvas.height*0.4;

    const dmg = { x: dmgX, y: dmgY, value, progress: 0, isPlayer };
    this.animationState.damageNumbers.push(dmg);

    return new Promise(resolve => {
      const duration = 800;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        dmg.progress = progress;
        this.render();
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animationState.damageNumbers = this.animationState.damageNumbers.filter(d => d !== dmg);
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  async playEnemyShake(): Promise<void> {
    this.animationState.enemyShake = true;
    this.render();
    await new Promise(r => setTimeout(r, 300));
    this.animationState.enemyShake = false;
    this.render();
  }

  updateBattleState(newState: BattleState) {
    this.battleState = newState;
    this.updateMoveSelection();
    this.updateHPBars();
    this.render();
  }

  hide() {
    this.container.innerHTML = '';
    this.battleState = null;
  }
}
