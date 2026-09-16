// Starter Selection — canonical event CH01-E05
// Framework remains, but loads actual canonical starter species from authoritative data
// UI must support real species name, real sprite, actual typing, actual starting moves, no dev labels

import { speciesRepository } from '../data/canonical/speciesRepository';
import { moveRepository } from '../data/canonical/moveRepository';
import { starterAssignmentRepository } from '../data/canonical/starterAssignment';
import { assetManifest } from '../data/canonical/assetManifest';
import { CanonicalSpecies } from '../data/canonical/types';
import { isProd } from '../core/env';

export interface StarterChoice {
  species: CanonicalSpecies;
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
    title.textContent = 'Choose One';
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

    // Try to get starters from canonical repository
    let starters: CanonicalSpecies[] = [];
    let loadError: string | null = null;

    try {
      starters = speciesRepository.getStarters();
    } catch (e: any) {
      loadError = e.message;
    }

    // If no canonical starters yet, show development-blocked message rather than invented creatures
    if (starters.length === 0) {
      const blocked = document.createElement('div');
      blocked.style.cssText = `
        background: #1a1d24;
        border: 1px solid #5a3a3a;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        color: #e8e6e1;
      `;
      blocked.innerHTML = `
        <div style="font-size: 18px; margin-bottom: 12px; color: #ff8a6a;">Starter Data Unavailable</div>
        <div style="font-size: 13px; color: #8a8d9a; line-height: 1.5; margin-bottom: 16px;">
          The canonical starter species dataset has not yet been imported.<br>
          This is a dependency to resolve, not permission to invent replacement.<br><br>
          <strong style="color: #6a8aba;">Expected:</strong> 3 canonical starter species from 187-species roster<br>
          <strong style="color: #6a8aba;">Location:</strong> data/canon/species.json or data/runtime/species/<br>
          <strong style="color: #6a8aba;">Error:</strong> ${loadError || 'No starters found'}<br><br>
          For development testing, use test fixtures under src/test/fixtures/ with names TEST_SPECIES_A/B/C<br>
          Production must not use invented species like Bramblekin/Emberling/Tidemaw.
        </div>
        <div style="font-size: 11px; color: #5a5a6a; font-family: monospace;">
          See docs/ANDROID_BUILD.md and ORIGINAL_SOURCE_INVENTORY.md<br>
          Validation will fail loudly if PROV-* IDs exist in production.
        </div>
      `;

      // In dev, allow test fixtures injection via console for testing
      if (!isProd()) {
        const devBtn = document.createElement('button');
        devBtn.textContent = 'Load Development Test Fixtures (DEV ONLY)';
        devBtn.style.cssText = `
          margin-top: 16px;
          padding: 10px 16px;
          background: #3a3a2a;
          color: #e8e6e1;
          border: 1px solid #5a5a3a;
          border-radius: 6px;
          cursor: pointer;
          font-family: monospace;
          font-size: 11px;
        `;
        devBtn.onclick = () => {
          // Inject test fixtures for dev testing
          import('../test/fixtures/battleFixtures').then(mod => {
            const { TEST_SPECIES_A, TEST_SPECIES_B, TEST_SPECIES_C, TEST_MOVE_A, TEST_MOVE_B, TEST_MOVE_STATUS, TEST_STARTER_ASSIGNMENT, TEST_TRAINER_RECRUIT } = mod;
            speciesRepository._injectTestData([TEST_SPECIES_A, TEST_SPECIES_B, TEST_SPECIES_C]);
            moveRepository._injectTestData([TEST_MOVE_A, TEST_MOVE_B, TEST_MOVE_STATUS]);
            starterAssignmentRepository._injectTestData(TEST_STARTER_ASSIGNMENT);
            // Also need trainer
            import('../data/canonical/trainerRepository').then(trMod => {
              trMod.trainerRepository._injectTestData([TEST_TRAINER_RECRUIT]);
              // Re-show
              this.show(onSelected);
            });
          });
        };
        blocked.appendChild(devBtn);
      }

      wrapper.appendChild(title);
      wrapper.appendChild(subtitle);
      wrapper.appendChild(blocked);
      this.container.appendChild(wrapper);
      return;
    }

    // Render real starters
    starters.forEach(species => {
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
        overflow: hidden;
      `;

      // Try to get real front sprite from asset manifest
      let spritePath: string | null = null;
      try {
        spritePath = assetManifest.getSpeciesSprite(species.id);
      } catch {
        // If missing, use neutral debug tile in dev only
        if (!isProd()) {
          spritePath = null;
        }
      }

      if (spritePath && spritePath !== 'MISSING_ASSET_DEBUG_TILE') {
        const img = document.createElement('img');
        img.src = spritePath;
        img.style.cssText = `max-width: 100%; max-height: 100%; image-rendering: crisp-edges;`;
        img.onerror = () => {
          img.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.textContent = species.name;
          fallback.style.cssText = `color: #6a8aba; font-family: Georgia, serif;`;
          spriteContainer.appendChild(fallback);
        };
        spriteContainer.appendChild(img);
      } else {
        // Fallback: show name, not invented creature drawing
        const fallback = document.createElement('div');
        fallback.style.cssText = `
          color: #6a8aba;
          font-family: Georgia, serif;
          font-size: 14px;
          text-align: center;
        `;
        if (!isProd() && !assetManifest.isLoaded()) {
          fallback.innerHTML = `${species.name}<br><span style="font-size: 10px; color: #5a5a6a;">Sprite: ${species.sprite_key}<br>Dev debug tile</span>`;
        } else {
          fallback.textContent = species.name;
        }
        spriteContainer.appendChild(fallback);
      }

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
      desc.textContent = species.description || 'A canonical Abyssal.';
      desc.style.cssText = `
        font-size: 12px;
        color: #8a8d9a;
        line-height: 1.4;
        margin-bottom: 12px;
        min-height: 40px;
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
      `;

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
        card.style.borderColor = '#6aff6a';
        card.style.background = '#1e2a1e';
        setTimeout(() => {
          this.onSelected?.(species.id);
        }, 300);
      };

      card.appendChild(spriteContainer);
      card.appendChild(name);
      card.appendChild(types);
      card.appendChild(desc);
      card.appendChild(stats);
      card.appendChild(selectBtn);

      grid.appendChild(card);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(subtitle);
    wrapper.appendChild(grid);

    this.container.appendChild(wrapper);

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

// Assignment logic — now uses explicit canonical table, no fabricated cyclic rule
export function getStarterAssignment(playerSpeciesId: string) {
  return starterAssignmentRepository.getAssignment(playerSpeciesId);
}
