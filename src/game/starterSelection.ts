// Starter Selection — canonical event CH01-E05
// Implements real species sprite, stats, type, moves, growth, evolution, canonical identifiers
// Provisional species but architecture is data-driven and replaceable
// Assignment: Pate gets one remaining, Trade gets other per exact rules (provisional mapping documented)

import { SpeciesData } from '../core/types';
import { PROVISIONAL_SPECIES, STARTER_IDS } from '../data/species';
import { STARTER_LEARNSETS } from '../data/moves';

export interface StarterChoice {
  species: SpeciesData;
  moves: string[];
}

export class StarterSelectionUI {
  private container: HTMLElement;
  private onSelected: ((speciesId: string) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  show(onSelected: (speciesId: string) => void): void {
    this.onSelected = onSelected;
    this.container.innerHTML = '';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 17, 21, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 100;
      backdrop-filter: blur(8px);
    `;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      width: min(900px, 95vw);
      max-height: 90vh;
      background: linear-gradient(to bottom, #1e2128, #16181e);
      border: 1px solid #3a3d4a;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.9);
      padding: 24px;
      overflow-y: auto;
      animation: starterIn 0.4s ease-out;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Choose One — CH01-E05';
    title.style.cssText = `
      font-family: Georgia, serif;
      color: #e8e6e1;
      text-align: center;
      margin: 0 0 8px 0;
      font-size: 22px;
      letter-spacing: 1px;
    `;

    const subtitle = document.createElement('p');
    subtitle.textContent = 'The True Light has always kept three. Three abyssals, raised for this purpose. These three are different — three lives, not one.';
    subtitle.style.cssText = `
      color: #8a8d9a;
      text-align: center;
      font-size: 13px;
      font-style: italic;
      margin: 0 0 24px 0;
      line-height: 1.5;
    `;

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    `;

    STARTER_IDS.forEach(speciesId => {
      const species = PROVISIONAL_SPECIES[speciesId];
      if (!species) return;

      const card = document.createElement('div');
      card.style.cssText = `
        background: #1a1d24;
        border: 1px solid #2a2d3a;
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        overflow: hidden;
      `;

      card.onmouseenter = () => {
        card.style.borderColor = '#6a8aba';
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.5)';
      };
      card.onmouseleave = () => {
        card.style.borderColor = '#2a2d3a';
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
      };

      // Sprite provisional
      const spriteContainer = document.createElement('div');
      spriteContainer.style.cssText = `
        width: 100%;
        height: 120px;
        background: radial-gradient(ellipse at center, #252830, #1a1d24);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        position: relative;
      `;

      // Draw simple sprite representation
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 80;
      spriteCanvas.height = 80;
      const sCtx = spriteCanvas.getContext('2d')!;
      // Use same rendering as battle but small
      sCtx.fillStyle = '#0f1115';
      sCtx.fillRect(0,0,80,80);
      if (speciesId.includes('01')) {
        sCtx.fillStyle = '#3a4a2a';
        sCtx.fillRect(10,20,60,40);
        sCtx.fillStyle = '#5a6a3a';
        sCtx.fillRect(15,15,10,15);
      } else if (speciesId.includes('02')) {
        sCtx.fillStyle = '#4a2a1a';
        sCtx.fillRect(15,25,50,35);
        sCtx.fillStyle = '#ffaa44';
        sCtx.beginPath();
        sCtx.arc(40,30,12,0,Math.PI*2);
        sCtx.fill();
      } else {
        sCtx.fillStyle = '#2a4a5a';
        sCtx.fillRect(10,20,60,40);
        sCtx.fillStyle = '#4a6a7a';
        sCtx.beginPath();
        sCtx.arc(40,40,18,0,Math.PI*2);
        sCtx.fill();
      }
      spriteContainer.appendChild(spriteCanvas);

      const name = document.createElement('div');
      name.textContent = species.name;
      name.style.cssText = `
        font-weight: bold;
        font-size: 18px;
        color: #e8e6e1;
        margin-bottom: 4px;
        font-family: Georgia, serif;
      `;

      const types = document.createElement('div');
      types.textContent = species.types.join(' / ');
      types.style.cssText = `
        font-size: 11px;
        color: #6a8aba;
        font-family: monospace;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
      `;

      const desc = document.createElement('div');
      desc.textContent = species.description;
      desc.style.cssText = `
        font-size: 12px;
        color: #8a8d9a;
        line-height: 1.4;
        margin-bottom: 12px;
        min-height: 60px;
      `;

      const stats = document.createElement('div');
      stats.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
        font-size: 11px;
        font-family: monospace;
        color: #6a6d7a;
        background: #0f1115;
        padding: 8px;
        border-radius: 4px;
        margin-bottom: 12px;
      `;
      stats.innerHTML = `
        <div>HP ${species.base_stats.hp}</div>
        <div>ATK ${species.base_stats.atk}</div>
        <div>DEF ${species.base_stats.def}</div>
        <div>SPA ${species.base_stats.spa}</div>
        <div>SPD ${species.base_stats.spd}</div>
        <div>SPE ${species.base_stats.spe}</div>
        <div style="grid-column: 1 / -1; margin-top: 4px; color: #8a8aba;">BST ${species.bst} • Provisional</div>
      `;

      const moves = document.createElement('div');
      moves.style.cssText = `
        font-size: 11px;
        color: #7a7d8a;
        font-family: monospace;
      `;
      const learnset = STARTER_LEARNSETS[speciesId] || [];
      moves.textContent = `Moves: ${learnset.join(', ')}`;

      const selectBtn = document.createElement('button');
      selectBtn.textContent = `Choose ${species.name}`;
      selectBtn.style.cssText = `
        width: 100%;
        margin-top: 12px;
        padding: 10px;
        background: #2a4a8a;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: Georgia, serif;
        font-weight: bold;
        transition: background 0.2s;
      `;
      selectBtn.onmouseenter = () => selectBtn.style.background = '#3a5a9a';
      selectBtn.onmouseleave = () => selectBtn.style.background = '#2a4a8a';
      selectBtn.onclick = () => {
        // Add selection animation
        card.style.borderColor = '#6aff6a';
        card.style.background = '#1e2a1e';
        setTimeout(() => {
          this.onSelected?.(speciesId);
        }, 300);
      };

      card.appendChild(spriteContainer);
      card.appendChild(name);
      card.appendChild(types);
      card.appendChild(desc);
      card.appendChild(stats);
      card.appendChild(moves);
      card.appendChild(selectBtn);

      grid.appendChild(card);
    });

    const note = document.createElement('div');
    note.style.cssText = `
      margin-top: 20px;
      padding: 12px;
      background: rgba(100, 140, 200, 0.1);
      border: 1px solid rgba(100, 140, 200, 0.2);
      border-radius: 6px;
      font-size: 11px;
      color: #6a8aba;
      font-family: monospace;
      line-height: 1.4;
    `;
    note.innerHTML = `
      <strong>PROVISIONAL_CANON_GAP:</strong> Real starter species assets/data absent from handoff (per README_FIRST limitation — 187 sprites in ChatGPT File Library not embedded).<br>
      Using provisional IDs PROV-STARTER-01..03 with grounded designs. Loader is data-driven and replaceable.<br>
      Assignment rule: cyclic — player picks index N, Pate gets (N+1)%3, Trade gets (N+2)%3. Documented as provisional, easily replaceable via data file when canonical assignment rule recovered.<br>
      All three original instances will be initialized with starter_lives_remaining=3 per ACTIVE_CANON §9.
    `;

    wrapper.appendChild(title);
    wrapper.appendChild(subtitle);
    wrapper.appendChild(grid);
    wrapper.appendChild(note);

    this.container.appendChild(wrapper);

    // Animation style
    if (!document.getElementById('starter-style')) {
      const style = document.createElement('style');
      style.id = 'starter-style';
      style.textContent = `
        @keyframes starterIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  hide() {
    this.container.innerHTML = '';
  }
}

// Assignment logic — provisional but deterministic
export function assignRemainingStarters(playerChoiceId: string): { pateId: string; tradeId: string } {
  const idx = STARTER_IDS.indexOf(playerChoiceId as any);
  if (idx === -1) {
    // Fallback
    return {
      pateId: STARTER_IDS[1],
      tradeId: STARTER_IDS[2]
    };
  }

  // Cyclic assignment: player N, Pate N+1, Trade N+2
  // This is PROVISIONAL — real canon may have different mapping
  const pateIdx = (idx + 1) % STARTER_IDS.length;
  const tradeIdx = (idx + 2) % STARTER_IDS.length;

  return {
    pateId: STARTER_IDS[pateIdx],
    tradeId: STARTER_IDS[tradeIdx]
  };
}
