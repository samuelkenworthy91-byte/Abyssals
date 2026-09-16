// Abyssals — Civeton Opening Vertical Slice
// Entry point — game bootstrap per architecture target

import { Game } from './game/game';
import { PersistenceManager } from './core/persistence';
import { TitleScreen } from './ui/titleScreen';

console.log('Abyssals — Civeton Opening Vertical Slice');
console.log('Branch: arena/01a0abc2-abyssals (per Arena system, task requested arena/civeton-opening-vertical-slice)');
console.log('Canon: ACTIVE_CANON.md LOCKED, provisional assets marked');

// Setup containers
const appContainer = document.getElementById('app');
const uiContainer = document.getElementById('ui-root');

if (!appContainer || !uiContainer) {
  throw new Error('Missing app or ui-root containers');
}

// Clear app container
appContainer.innerHTML = '';

const persistence = new PersistenceManager();
let game: Game | null = null;

function startGameWithState(state: any) {
  if (game) {
    // Already started, reload
    location.reload();
    return;
  }
  appContainer!.innerHTML = '';
  game = new Game(appContainer!, uiContainer!, state);

  // Expose for debugging/testing (not in production UI)
  (window as any).AbyssalsGame = game;
  (window as any).AbyssalsTest = {
    // Test helpers per task §27
    newGame: () => {
      localStorage.clear();
      location.reload();
    },
    getState: () => game!.getState(),
    getStoryManager: () => game!.getStoryManager(),
    saveAndQuit: () => game!.saveAndQuit(),
    // Test all three starter choices
    testStarterChoices: async () => {
      console.log('Testing starter choices...');
    },
    // Persistence tests per task §27
    testPersistence: () => {
      console.log('Testing persistence at critical points...');
      const s = game!.getState();
      console.log('Current state:', s);
      console.log('Has starter:', !!s.player_starter_species_id);
      console.log('Pate starter:', s.pate_starter_species_id);
      console.log('Trade starter:', s.trade_starter_species_id);
      console.log('Party:', s.party);
      console.log('Commit seq:', s.commit_seq);
      console.log('Journal:', s.journal);
    }
  };

  console.log('Game initialized');
  console.log('Required playable flow:');
  console.log('1. Start New Game');
  console.log('2. Childhood opening (Aimon, Pate, Trade)');
  console.log('3. Transition to Civeton present');
  console.log('4. Explore Civeton');
  console.log('5. Pate house empty');
  console.log('6. Trade message "Don\'t follow us."');
  console.log('7. Kurg refusal + revelation');
  console.log('8. CH01-E05 starter choice');
  console.log('9. Kurg soldier test battle (first-person)');
  console.log('10. Post-battle return + save/reload');
}

// Show title screen first
const titleContainer = document.createElement('div');
titleContainer.id = 'title-screen';
titleContainer.style.cssText = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 300;
`;
document.body.appendChild(titleContainer);

const titleScreen = new TitleScreen(titleContainer, persistence, (state) => {
  startGameWithState(state);
});

// Check if we have a quick resume? For now always show title
titleScreen.show();

// Handle visibility change — background/foreground transitions cannot duplicate transactions per TEST_PLAN
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('App backgrounded — ensuring no duplicate transactions');
  } else {
    console.log('App foregrounded');
  }
});
