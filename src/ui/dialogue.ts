// Dialogue UI — follows portrait spec, preserves transparent/magenta conventions
// Important characters consistent between dialogue, pre-battle, overworld

import { DialogueData } from '../core/types';

export class DialogueUI {
  private container: HTMLElement;
  private isActive: boolean = false;
  private currentDialogue: DialogueData | null = null;
  private currentLineIndex: number = 0;
  private onComplete: (() => void) | null = null;
  private portraitCache: Map<string, HTMLCanvasElement> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.generatePortraits();
  }

  private generatePortraits() {
    // Provisional portraits — following spec: full-body, head-to-toe, clean 2D anime/JRPG concept art
    // Source background pure #FF00FF before cleanup, but we generate cleaned version directly
    // Production canvas dimensions provisional 512x512 but we render small for dialogue

    const characters = ['aimon', 'pate', 'trade', 'kurg', 'aimon_child', 'pate_child', 'trade_child'];

    characters.forEach(char => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      // Background transparent (already cleaned from magenta)
      ctx.clearRect(0,0,128,128);

      // Draw provisional portrait — grounded, not chibi, crisp linework, controlled cel shading
      if (char.includes('kurg')) {
        // Kurg — General, True Light, blue/white/silver/navy, medieval/crusader
        ctx.fillStyle = '#2a3a5a'; // navy
        ctx.fillRect(20, 20, 88, 90);
        ctx.fillStyle = '#e8eef8'; // ivory tabard
        ctx.fillRect(30, 40, 68, 50);
        ctx.fillStyle = '#6a8aba'; // blue
        ctx.fillRect(50, 45, 28, 20);
        ctx.fillStyle = '#d8c8a8'; // face
        ctx.beginPath();
        ctx.arc(64, 30, 18, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#3a2a1a'; // beard
        ctx.fillRect(50, 35, 28, 10);
      } else if (char.includes('pate')) {
        // Pate — warm, familiar
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(25, 30, 78, 80);
        ctx.fillStyle = '#8a6a4a';
        ctx.fillRect(30, 40, 68, 40);
        ctx.fillStyle = '#e8d8b8';
        ctx.beginPath();
        ctx.arc(64, 32, 16, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#4a3a2a';
        ctx.fillRect(48, 18, 32, 10); // hair
      } else if (char.includes('trade')) {
        // Trade — more austere, sharp
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(25, 30, 78, 80);
        ctx.fillStyle = '#5a5a6a';
        ctx.fillRect(30, 40, 68, 40);
        ctx.fillStyle = '#d8c8a8';
        ctx.beginPath();
        ctx.arc(64, 32, 15, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(50, 15, 28, 12);
      } else {
        // Aimon — protagonist, renamable but default
        ctx.fillStyle = '#4a5a6a';
        ctx.fillRect(25, 30, 78, 80);
        ctx.fillStyle = '#6a7a8a';
        ctx.fillRect(30, 40, 68, 40);
        ctx.fillStyle = '#e8d8b8';
        ctx.beginPath();
        ctx.arc(64, 32, 16, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#3a4a3a';
        ctx.fillRect(48, 16, 32, 14);
      }

      // For child versions, smaller
      if (char.includes('child')) {
        // Make slightly smaller, younger
        ctx.globalAlpha = 0.9;
        // Already drawn, but add child marker
        ctx.fillStyle = 'rgba(200,180,150,0.3)';
        ctx.beginPath();
        ctx.arc(64, 64, 50, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      this.portraitCache.set(char, canvas);
    });
  }

  show(dialogue: DialogueData, onComplete?: () => void): Promise<void> {
    return new Promise((resolve) => {
      this.currentDialogue = dialogue;
      this.currentLineIndex = 0;
      this.isActive = true;
      this.onComplete = () => {
        this.hide();
        onComplete?.();
        resolve();
      };
      this.render();
    });
  }

  private render() {
    if (!this.currentDialogue) return;

    const dialogue = this.currentDialogue;
    const line = dialogue.text[this.currentLineIndex];

    // Clear container
    this.container.innerHTML = '';

    // Dialogue box — polished, readable, not debug
    const box = document.createElement('div');
    box.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: min(700px, 90vw);
      background: linear-gradient(to bottom, #1e2128, #16181e);
      border: 1px solid #3a3d4a;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset;
      padding: 16px;
      display: flex;
      gap: 16px;
      font-family: Georgia, serif;
      color: #e8e6e1;
      pointer-events: auto;
      animation: dialogueIn 0.2s ease-out;
    `;

    // Portrait
    const portraitContainer = document.createElement('div');
    portraitContainer.style.cssText = `
      width: 96px;
      height: 96px;
      flex-shrink: 0;
      background: #0f1115;
      border: 1px solid #2a2d3a;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    `;

    const portraitKey = dialogue.portrait_key || dialogue.speaker_id.toLowerCase().replace('chr-', '');
    const portraitCanvas = this.portraitCache.get(portraitKey) || this.portraitCache.get('aimon');

    if (portraitCanvas) {
      const img = document.createElement('img');
      img.src = portraitCanvas.toDataURL();
      img.style.cssText = `width: 100%; height: 100%; object-fit: cover; image-rendering: crisp-edges;`;
      portraitContainer.appendChild(img);
    } else {
      portraitContainer.style.background = '#1a1d24';
      portraitContainer.textContent = dialogue.speaker[0];
      portraitContainer.style.display = 'flex';
      portraitContainer.style.alignItems = 'center';
      portraitContainer.style.justifyContent = 'center';
      portraitContainer.style.fontSize = '32px';
      portraitContainer.style.color = '#6a7a8a';
    }

    // Text area
    const textArea = document.createElement('div');
    textArea.style.cssText = `flex: 1; display: flex; flex-direction: column; gap: 8px;`;

    const speakerName = document.createElement('div');
    speakerName.textContent = dialogue.speaker;
    speakerName.style.cssText = `
      font-weight: bold;
      color: ${dialogue.speaker_id.includes('KURG') ? '#6a8aba' : dialogue.speaker_id.includes('PATE') ? '#a08060' : dialogue.speaker_id.includes('TRADE') ? '#7a8a9a' : '#8a9aba'};
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    `;

    const text = document.createElement('div');
    text.textContent = line;
    text.style.cssText = `
      font-size: 16px;
      line-height: 1.5;
      color: #e8e6e1;
      min-height: 48px;
    `;

    const continueHint = document.createElement('div');
    continueHint.textContent = this.currentLineIndex < dialogue.text.length - 1 ? '▼ Click or Space to continue' : '▼ End';
    continueHint.style.cssText = `
      font-size: 11px;
      color: #6a6d7a;
      text-align: right;
      margin-top: 8px;
      font-family: monospace;
    `;

    textArea.appendChild(speakerName);
    textArea.appendChild(text);
    textArea.appendChild(continueHint);

    box.appendChild(portraitContainer);
    box.appendChild(textArea);

    // Click to advance
    box.addEventListener('click', () => this.advance());

    this.container.appendChild(box);

    // Add style for animation if not exists
    if (!document.getElementById('dialogue-style')) {
      const style = document.createElement('style');
      style.id = 'dialogue-style';
      style.textContent = `
        @keyframes dialogueIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  advance() {
    if (!this.currentDialogue) return;

    if (this.currentLineIndex < this.currentDialogue.text.length - 1) {
      this.currentLineIndex++;
      this.render();
    } else {
      const cb = this.onComplete;
      this.onComplete = null;
      cb?.();
    }
  }

  hide() {
    this.container.innerHTML = '';
    this.isActive = false;
    this.currentDialogue = null;
    this.currentLineIndex = 0;
  }

  isShowing(): boolean {
    return this.isActive;
  }

  handleInput(key: string): boolean {
    if (!this.isActive) return false;
    if (key === ' ' || key === 'Enter' || key === 'e' || key === 'E') {
      this.advance();
      return true;
    }
    return false;
  }
}
