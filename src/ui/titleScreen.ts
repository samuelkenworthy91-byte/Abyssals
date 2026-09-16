// Title screen — New Game, Continue, slots

import { PersistenceManager, createInitialState } from '../core/persistence';
import { GameState } from '../core/types';

export class TitleScreen {
  private container: HTMLElement;
  private persistence: PersistenceManager;
  private onStart: (state: GameState) => void;

  constructor(container: HTMLElement, persistence: PersistenceManager, onStart: (state: GameState) => void) {
    this.container = container;
    this.persistence = persistence;
    this.onStart = onStart;
  }

  show() {
    this.container.innerHTML = '';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at center, #1a1d24 0%, #0f1115 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 200;
    `;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      width: min(600px, 90vw);
      text-align: center;
      padding: 40px 20px;
    `;

    const title = document.createElement('h1');
    title.textContent = 'ABYSSALS';
    title.style.cssText = `
      font-family: Georgia, serif;
      font-size: 48px;
      letter-spacing: 8px;
      color: #e8e6e1;
      margin: 0 0 8px 0;
      text-shadow: 0 2px 20px rgba(100, 140, 200, 0.3);
    `;

    const subtitle = document.createElement('div');
    subtitle.textContent = 'Civeton — Opening Vertical Slice';
    subtitle.style.cssText = `
      font-family: monospace;
      font-size: 12px;
      color: #6a8aba;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 40px;
    `;

    const tagline = document.createElement('div');
    tagline.textContent = 'These creatures can genuinely die. The world begins recognisably human and grounded before descending into much darker territory.';
    tagline.style.cssText = `
      font-family: Georgia, serif;
      font-size: 13px;
      color: #8a8d9a;
      font-style: italic;
      line-height: 1.6;
      margin-bottom: 40px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    `;

    // Slots
    const slotsContainer = document.createElement('div');
    slotsContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    `;

    const slots = this.persistence.listSlots();

    slots.forEach(slot => {
      const slotDiv = document.createElement('div');
      slotDiv.style.cssText = `
        background: #1a1d24;
        border: 1px solid #2a2d3a;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s;
        cursor: pointer;
      `;

      if (slot.hasSave && slot.state) {
        const s = slot.state;
        const progress = s.completed_events.length;
        const starter = s.player_starter_species_id || 'No starter';
        slotDiv.innerHTML = `
          <div style="text-align: left;">
            <div style="font-weight: bold; color: #e8e6e1; font-family: Georgia, serif;">Slot ${slot.slotId + 1} — ${s.protagonist_name}</div>
            <div style="font-size: 11px; color: #6a8d9a; font-family: monospace; margin-top: 4px;">
              ${s.current_map_id} • ${progress} events • ${starter} • Seq ${s.commit_seq}
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="continue-btn" style="padding: 8px 16px; background: #2a4a8a; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: Georgia, serif;">Continue</button>
            <button class="new-btn" style="padding: 8px 16px; background: #1e2128; color: #8a8d9a; border: 1px solid #3a3d4a; border-radius: 4px; cursor: pointer; font-family: Georgia, serif;">New</button>
          </div>
        `;

        const continueBtn = slotDiv.querySelector('.continue-btn') as HTMLButtonElement;
        const newBtn = slotDiv.querySelector('.new-btn') as HTMLButtonElement;

        continueBtn.onclick = (e) => {
          e.stopPropagation();
          this.onStart(slot.state!);
          this.hide();
        };

        newBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm(`Start new game in Slot ${slot.slotId + 1}? This will overwrite existing save.`)) {
            this.persistence.deleteSlot(slot.slotId);
            const newState = createInitialState(slot.slotId, 'Aimon');
            this.onStart(newState);
            this.hide();
          }
        };

        slotDiv.onmouseenter = () => {
          slotDiv.style.borderColor = '#6a8aba';
          slotDiv.style.background = '#1e2128';
        };
        slotDiv.onmouseleave = () => {
          slotDiv.style.borderColor = '#2a2d3a';
          slotDiv.style.background = '#1a1d24';
        };
      } else {
        slotDiv.innerHTML = `
          <div style="text-align: left;">
            <div style="font-weight: bold; color: #6a6d7a; font-family: Georgia, serif;">Slot ${slot.slotId + 1} — Empty</div>
            <div style="font-size: 11px; color: #4a4d5a; font-family: monospace; margin-top: 4px;">No save data</div>
          </div>
          <button class="new-btn" style="padding: 8px 16px; background: #2a4a8a; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: Georgia, serif;">New Game</button>
        `;

        const newBtn = slotDiv.querySelector('.new-btn') as HTMLButtonElement;
        newBtn.onclick = () => {
          const newState = createInitialState(slot.slotId, 'Aimon');
          this.onStart(newState);
          this.hide();
        };

        slotDiv.onmouseenter = () => {
          slotDiv.style.borderColor = '#6a8aba';
        };
        slotDiv.onmouseleave = () => {
          slotDiv.style.borderColor = '#2a2d3a';
        };
      }

      slotsContainer.appendChild(slotDiv);
    });

    const footer = document.createElement('div');
    footer.style.cssText = `
      font-size: 10px;
      color: #4a4d5a;
      font-family: monospace;
      margin-top: 30px;
      line-height: 1.5;
    `;
    footer.innerHTML = `
      Branch: arena/01a0abc2-abyssals<br>
      Provisional assets marked • Ironman save • No rollback • First-person battle<br>
      WASD Move • E Interact • Ctrl+S Save • Mobile swipe supported
    `;

    wrapper.appendChild(title);
    wrapper.appendChild(subtitle);
    wrapper.appendChild(tagline);
    wrapper.appendChild(slotsContainer);
    wrapper.appendChild(footer);

    this.container.appendChild(wrapper);
  }

  hide() {
    this.container.innerHTML = '';
    this.container.style.display = 'none';
  }

  showAgain() {
    this.container.style.display = 'flex';
    this.show();
  }
}
