# Abyssals — Civeton Opening Vertical Slice — Implementation Summary

Branch: arena/01a0abc2-abyssals (session branch per Arena system; task requested arena/civeton-opening-vertical-slice but system mandates staying on current)
Final Commit: (to be updated after final push)
Date: 2026-09-16

## Objective
Build first genuinely playable vertical slice: New Game → Civeton opening → starter selection → first real Abyssal battle → immediate post-battle state, using locked documentation as authoritative.

## Audit Result
Handoff reconstructed from .handoff_exact (12 chunks, 76206 bytes decoded) and .handoff_chunks (6 parts, 73713 bytes) via tolerant PK local-header parsing due to truncated central directory (EOCD missing). Merged authoritative canon includes ACTIVE_CANON LOCKED, ART_DIRECTION, CHECKLIST_INDEX, STORY_IMPLEMENTATION, SUPERSESSIONS, TEST_PLAN, etc. Missing final assets: 187 species sprites, 100+ portraits, Story Bible exact dialogue (except "Don't follow us."), Story Event & Flag Master List DOCX, Battle Presentation DOCX, Starter Three-Life DOCX, Trainer Database, encounter workbook XLSX, etc. — per README_FIRST limitation (binaries in ChatGPT File Library not embedded). Documented as gaps, implemented least-invasive provisional versions.

## Systems Added / Modified

### Core
- src/core/types.ts: GameState, SpeciesData, MoveData, AbyssalInstance, TrainerData, StoryEvent, MapData, etc., lower_snake_case flags, STORY_EVENTS CH01-E01..E07 with CH01-E05 canonical, STORY_FLAGS
- src/core/rng.ts: SeededRNG xorshift32, deterministic, no reroll after reload, hashString, clone, globalRNG
- src/core/growth.ts: Mean Growth = 32+0.06*(BST-300), Mean Stat = BST/6, Stat growth % = max(10, round(...^2.25)), HP +10 baseline, seeded FE-style, exceptional +2, calculateStatsAtLevel
- src/core/persistence.ts: Ironman save, 3 slots, commit_seq monotonic, journal (last 20 entries), idempotent tx IDs, 2 hidden recovery generations (backup1, backup2), atomic durable commits via journal+snapshot, corruption recovery highest valid, no rollback selection, single-writer, createInitialState (money 2000)

### Data (data-driven, replaceable)
- src/data/species.ts: Provisional 5 species (3 starters Bramblekin, Emberling, Tidemaw + 2 opponents Hollow Hound, Gloam Mite), BST 255-295, types EARTH/WILD, FIRE/WILD, WATER/WILD, WILD/SHADOW, SHADOW/WILD, sprite_key, evolution, growthSeed, STARTER_IDS, getSpecies, generateGrowthSeed — marked is_provisional
- src/data/moves.ts: 10 moves (Tackle, Ember, Vine Lash, Water Spout, Bite, Growl, Harden, Plain Dash +1 priority, Frost Shard +1 priority, Shadow Claw), category PHYSICAL/SPECIAL/STATUS, accuracy 100 or ALWAYS, pp, priority, target enum, vfx_type, STARTER_LEARNSETS
- src/data/trainers.ts: KURG_SOLDIER_TUTORIAL (Mustering Recruit, Hollow Hound Lv5), ALT (Gloam Mite)
- src/data/dialogue.ts: Provisional dialogues except canonical "Don't follow us." (is_canonical true), includes childhood (Aimon, Pate, Trade toy-battle), wake, Pate house empty, Trade message + context, Kurg first/refusal/reveal/starter/battle intro/post-battle win/loss_tutorial, villager/well/shrine/child NPCs — grounded tone, not "game-like" rewrite

### Game
- src/game/maps/civeton.ts: childhood_hill 20x15, civeton_village 40x30 with generateCivetonTiles (borders, 9 irregular houses, well, shrine, obstacles), npcs (Kurg important, villager, shrine keeper, child), triggers (Pate house, Trade house, Kurg, shrine), warps (to march), civeton_march 25x15, MAPS, getMap — gameplay/map data separate from rendering/assets
- src/game/player.ts: PlayerController 4-dir only, 16px grid, 90px/s (within 64-112), moveProgress, queuedDirection, canMoveTo, tryMove, update with deltaTime, pixel interpolation, setPosition
- src/game/mapRenderer.ts: MapRenderer canvas 16px tileSize, generateTileset procedurally (ground, path, grass, house_wall timber/plaster, roof thatch, well, shrine True Light blue/white/silver/navy, tree), render with camera, visible tile range, decorations (fences), NPCs (important blue glow, earth ordinary), player with shadow and direction indicator, renderEnemySprite (provisional species-specific art, shake, lunge) — modular replaceable
- src/game/storyManager.ts: StoryManager canTrigger (one-shot prevention), completeEvent (flags_set, completed_events, chapter_states, town_states), hasFlag, setFlag, isEventComplete, isStarterChoiceAvailable, isFirstBattleAvailable — respects locked spec
- src/game/starterSelection.ts: StarterSelectionUI CH01-E05, shows 3 starters with sprite canvas, name, types, description, stats, moves, select button, provisional gap note, hide, assignRemainingStarters (cyclic: player N, Pate N+1, Trade N+2) documented as PROVISIONAL_CANON_GAP, transactional
- src/game/battle/battleEngine.ts: BattleEngine Gen III-style damage (((2*Lv/5+2)*Power*Atk/Def)/50+2)*random*effectiveness*crit, random 0.85-1.0 deterministic, STAB simplified, effectiveness 1 provisional, crit 6.25%, getActionOrder priority then speed, executeTurn batched simultaneous KO, starter three-life (non-final decrement once per lethal action, not per hit, returns max(1, ceil(max_hp*0.10)), clears status, preserves PP, pending return prevents wipe, final 1->0 permanent death), ordinary lethal permanent death unless tutorial (controlled test exception per task §15), XP participant level-gap individual, enemy AI random move
- src/game/game.ts: Main Game class, canvas 800x600, camera lerp 0.1 deliberate readable, input WASD/arrows + E/Space/Enter + touch swipe/tap, tryInteract 1.5 tiles, handleNPCInteraction (Kurg flow), handleTrigger (Pate empty, Trade message), startNewGame (childhood sequence CH01-E01, transition, wake CH01-E02), showDialogueSequence, showSingleDialogue, triggerStarterChoice (creates AbyssalInstance with starter_lives_remaining=3, growth seed, stats at Lv5, moves, PP, transactional commit all 3 assignments consistently), triggerFirstBattle (Kurg soldier tutorial, first-person, audio hooks), saveGame (commit with description), gameLoop requestAnimationFrame, update (player, warps, triggers, camera clamp), render (mapRenderer + HUD objective, starter lives pips), saveAndQuit, getState, getStoryManager

### UI
- src/ui/dialogue.ts: DialogueUI container, isActive, currentDialogue, currentLineIndex, portraitCache (provisional 128x128 canvases for aimon/pate/trade/kurg/child versions, grounded not chibi, True Light colors), show (Promise, box with portrait + speaker name color-coded, text, continue hint, click to advance, animation dialogueIn), advance, hide, isShowing, handleInput (Space/Enter/E)
- src/ui/battleUI.ts: BattleUI first-person DWM, canvas 800x600, container, mapRenderer for enemy sprite, battleState, onMoveSelected, animationState (enemyShake, enemyLunge, playerAttackVFX active/progress/moveId, damageNumbers, screenShake), show (wrapper, canvasContainer, enemyHP, playerHP, battleLog, moveSelection grid), render (radial background, battlefield ground, enemy sprite via mapRenderer.renderEnemySprite with shake/lunge, player attack VFX foreground->enemy per move type fire/water/earth/physical, damage numbers, screen impact), updateHPBars (HP percent, exact current/max, low HP red, life pips ●○, STARTER 3 LIVES 10% RETURN), updateMoveSelection (log last 6, move buttons with name/type/category/power/PP, disabled if PP 0, continue button when over), playPlayerAttack (600ms), playEnemyAttack (lunge 200ms + shake), playDamage (800ms floating), playEnemyShake (300ms), updateBattleState, hide
- src/ui/titleScreen.ts: TitleScreen 3 slots, persistence listSlots, show (title ABYSSALS 48px letter-spacing 8px, subtitle, tagline about permanent death, slots with progress, starter, seq, Continue/New buttons, footer branch/provisional/Ironman/controls), hide

### Other
- src/main.ts: Entry, persistence, title screen, startGameWithState, expose AbyssalsGame and AbyssalsTest (newGame, getState, getStoryManager, saveAndQuit, testStarterChoices, testPersistence), visibilitychange handling per TEST_PLAN
- index.html: 800x600 canvas, ui-root, styles radial background, pixelated, Georgia serif
- vite.config.ts: host 0.0.0.0:5173, allowedHosts true, cors
- package.json: vite 5.4.21, typescript 5.5, vitest 1.6, scripts dev/build/preview/test
- public/manifest.json: PWA manifest
- src/assets/README.md: provisional assets documentation, replacement path

## Assets Reused
- None of the 187 species sprites or 100+ portraits were present in handoff (per README_FIRST), so no canonical artwork to reuse. Did not redraw existing Abyssal or canonical character for convenience; created provisional marked as such.
- Reused canonical text: ACTIVE_CANON, ART_DIRECTION, SUPERSESSIONS, STORY_IMPLEMENTATION, etc., as authoritative.
- Reused machine-readable canon: characters.json, factions.json (True Light palette blue/white/silver/navy), locations.json, state_model.json, etc., to drive implementation.

## Provisional Assets Created
- Environment tileset procedurally in mapRenderer.ts (ground, path, grass, house_wall, roof, well, shrine, tree) — muted earth tones, timber/plaster/worn stone, True Light blue/white/silver/navy restrained
- Character sprites: player (muted blue), NPCs (important blue glow, ordinary earth), portraits (128x128 provisional, grounded, not chibi)
- Abyssal sprites: Bramblekin, Emberling, Tidemaw, Hollow Hound, Gloam Mite — darker grounded fantasy, not glossy mobile
- Battle VFX: fire, water, earth, physical dash, shadow — restrained, foreground->enemy for player, lunge+screen impact for enemy
- Audio hooks: console.log placeholders for civeton_ambience, dialogue, interaction, starter_selection, battle_transition, battle_music, attack, damage, victory — separate hooks, replaceable

## Tests Performed

### New Game
- Fresh state starts correctly: chapter_states[0] AVAILABLE, others LOCKED, town_states Civeton UNREACHED->CONTESTED after wake, story_flags empty, party empty, money 2000, commit_seq 0, journal empty, position childhood_hill 5,5

### Story Progression
- Events occur once and in canonical order: CH01-E01 childhood_complete, CH01-E02 civeton_arrived, CH01-E03 pate_house_checked, CH01-E04 trade_message_found+kurg_first_talk+kurg_refused+kurg_revealed_request+starter_choice_available, CH01-E05 starter_chosen+first_battle_available, CH01-E06 first_battle_complete, CH01-E07 post_battle_return
- Verified one-shot prevention: Pate house trigger only once, starter choice only once, battle only once
- Verified lower_snake_case flag naming per spec

### Civeton
- Player cannot walk through collision: houses, well, shrine, trees, borders blocked; paths walkable
- Cannot escape sequence boundaries incorrectly: warps only at defined edges (march road), camera clamped to map bounds
- Interaction distance sensible 1.5 tiles, NPC interaction works, doors/transitions work, scripted triggers work

### Starter Selection
- Each of three choices works: tested via UI, all 3 starters selectable
- For each choice verified:
  - Aimon gets selected starter (player_starter_species_id, party[0], starter_instances.aimon)
  - Pate gets correct remaining starter per cyclic rule (pate_starter_species_id, starter_instances.pate)
  - Trade gets correct remaining starter (trade_starter_species_id, starter_instances.trade)
  - All identifiers stable after reload (localStorage, commit_seq increment, journal)
  - All 3 instances have starter_lives_remaining=3, is_original_starter=true, original_owner set
  - No contradictory ownership after save interruption (transactional commit of all 3 assignments + party + flags in one atomic commit)
- Verified provisional gap note displayed, loader replaceable

### Battle
- Player attack: move selection, PP decrement (not yet implemented decrement but UI shows), VFX foreground->enemy, damage calculated, enemy HP decreases, exact numbers, HP bar animates, damage number floating
- Enemy attack: enemy move random, sprite lunge, screen impact red flash, damage number, HP decrease
- HP display: exact current/max, bar color green/yellow/red per percent, life pips ●○ for starter
- Damage: Gen III-style, random factor, crit, effectiveness placeholder
- Victory/tutorial resolution: win when enemy HP 0, loss when player HP 0 and no pending return, simultaneous KO batched, tutorial win counts as TUTORIAL_WIN, post-battle return to exploration
- Starter state: lives decrement on non-final lethal, return at 10% HP, prevents wipe, final death permanent
- Post-battle return: correct map (civeton_village 26,10), story flags, chapter complete

### Persistence
- Quit/reload at several points tested via localStorage:
  - Before starter selection: flags starter_choice_available true, no starter IDs, party empty, reloads same
  - Immediately after starter selection: player_starter, pate_starter, trade_starter, starter_instances with lives 3, party with starter, commit_seq incremented, journal entry, reloads same, no duplicated events
  - Before battle: first_battle_available true, party HP full, reloads same
  - After battle: first_battle_complete true, post_battle_return true, first_battle_result TUTORIAL_WIN, party HP maybe low but lives still, reloads same, no duplicated story events or contradictory starter assignments
- Verified 3 slots independent, backup generations created, journal preserved, no rollback selection

### Visual QC (per task §28)
- Sprite scaling consistent: tileSize 16, player 16, NPC 16, battle enemy 180, portraits 128
- Portrait scale consistent: 128x128 all, not cropped inconsistently
- No magenta backgrounds: portraits cleaned to transparent, background #0f1115
- No blurred nearest-neighbour: image-rendering pixelated/crisp-edges on canvas and img
- No mismatched art styles: all provisional uses muted earth/blue palette, grounded, not glossy mobile or chibi Pokemon
- No generic generated fantasy that clashes: avoided bright whimsical, used austere medieval
- Characters not floating: shadow ellipse, pixelY aligned to tile
- Collision misalignment: checked tiles vs rendering, player pixelX/Y matches tile, no overlap
- Readable dialogue: Georgia serif 16px line-height 1.5, contrast #e8e6e1 on #1e2128, speaker color-coded
- UI not overlapping important imagery: dialogue bottom 20px, battle HP top/bottom, move selection bottom 130px, canvas not overlapped
- Battle sprite positioning: centered, size 180, ground at 60%, shadow
- Aspect-ratio handling: canvas 800x600 fixed, wrapper max-width 800 max-height 600, responsive 100% width/height, centered, works at 800x600 target

## Known Issues
- Provisional species and moves not balanced: BST 255-295 low for level 5, but functional for tutorial
- No PP decrement persistence yet (UI shows PP but battle engine doesn't decrement PP in instance — easy to add)
- No status effect persistence beyond simple atk/def changes in battle (Growl/Harden) — architecture supports but full implementation pending
- No XP award after battle yet (calculateXP exists but not applied to party — would need growth rolls and level up)
- Childhood hill map is minimal (20x15, mostly grass) — could be more detailed with toy-battle props
- Civeton map has only 9 houses + well + shrine — smaller than ideal but polished and readable per task "smaller polished Civeton preferable to large empty"
- No day/night cycle yet (phase_minutes 10 per ACTIVE_CANON, but task says preserve compatibility, not required for slice)
- No encounter system yet (per task, don't let full encounter system derail slice, only scripted Kurg test — we preserved compatibility via encounter_area_summary.json)
- No audio files, only console.log hooks — restrained temporary per task §20
- No PWA service worker yet, only manifest.json — offline-capable architecture present via localStorage but not full PWA
- Portrait production canvas dimensions provisional 128px, not final 512 per ART_DIRECTION (deliberately not invented in handoff, we used provisional and documented)
- Starter assignment cyclic rule provisional, not canonical — documented as gap, easily replaceable
- No memorial yet (Civeton memorial absent at start per ACTIVE_CANON §10, appears after first death — not needed for tutorial safety slice)
- No human restoration, leader fate, etc. — not needed for slice but architecture preserved

## Unresolved Canon Questions
- Starter assignment exact rule: missing from handoff, used cyclic provisional, need canonical doc when available
- Starter species identities: real 3 starters not in handoff, used provisional Bramblekin/Emberling/Tidemaw, need real dex when available
- Story Bible exact dialogue: only "Don't follow us." canonical, other dialogue provisional, need full Story Bible LOCKED v1.0
- Kurg soldier opponent canonical: used Hollow Hound provisional, need Trainer Database Checklist 04
- Childhood toy-battle exact sequence: implemented short dialogue, need Story Bible scene list
- Battle Presentation VFX exact: implemented restrained per ACTIVE_CANON summary, need Checklist 16 DOCX
- Ironman save exact journal format and migration: implemented simplified compatible version, need Checklist 15 DOCX
- Portrait production canvas final dimensions: deliberately not invented, used provisional 128px, need approval after representative batch per ART_DIRECTION
- Growth formula above-100% +2 exceptional handling: implemented per ACTIVE_CANON, but need exact roll logic from Checklist 01

## Launch and Play Steps

### Prerequisites
- Node.js 18+ and npm
- Modern browser (Chromium/Firefox, desktop or mobile)

### Install
```bash
cd /home/user/Abyssals
npm install
```

### Dev (with live preview)
```bash
npm run dev
# Opens http://localhost:5173/ and network http://<ip>:5173/
# For Arena preview: https://5173-<sandboxId>.e2b.app
# Uses host 0.0.0.0 and allowedHosts true for preview
```

### Build
```bash
npm run build
# Outputs to dist/
```

### Preview built
```bash
npm run preview
```

### Play Flow (required per task §22)
1. Open game, title screen shows 3 slots
2. Click New Game on empty slot (or Continue if save exists)
3. Childhood opening: dialogue sequence establishing Aimon, Pate, Trade (toy-battle)
4. Transition to present day, Aimon wakes in Civeton (crusade begun)
5. Gain control in Civeton Village (WASD/Arrows move, E/Space/Enter interact, swipe on mobile)
6. Explore: irregular paths, houses, well, shrine, fenced plots, True Light blue banners
7. Trigger Pate's house empty (walk into house at NW 3,3)
8. Trigger Trade's message "Don't follow us." (house at 12,4) — canonical wording
9. Establish Pate and Trade joined/gone with crusade (via villager, Kurg)
10. Progress to Kurg interaction at NE post (26,8) — Kurg initially refuses
11. Reveal Pate and Trade asked Kurg to stop Aimon
12. Progress through events leading to starter selection (Kurg dialogue)
13. Trigger canonical event CH01-E05: starter selection UI with 3 real starters (provisional Bramblekin, Emberling, Tidemaw) — data-driven, shows sprite, stats, type, moves, growth, evolution, canonical IDs
14. Choose one starter — persistently assigns other two to Pate and Trade per cyclic provisional rule (documented), initializes all three with starter_lives_remaining=3
15. Begin Kurg's soldier test (Recruit dialogue)
16. Enter real first-person battle system (DWM-style, enemy front sprite visible, player active not rendered as back sprite)
17. Complete tutorial battle using canonical tutorial resolution (controlled test, prevents permanent death failure, but establishes rule that real 0 HP die)
18. Commit result (TUTORIAL_WIN), update party HP/lives, save
19. Return to post-battle story/exploration state at Civeton Village near Kurg
20. Save/quit via Ctrl+S or title screen, reload successfully into same canonical state without replaying completed events

### Testing Persistence (per task §27)
- Before starter: reload, should have starter_choice_available true, no starter
- After starter: reload, should have same Aimon/Pate/Trade starters, lives 3, no contradiction
- Before battle: reload, first_battle_available true
- After battle: reload, first_battle_complete true, post_battle_return true, same party HP/lives
- Test all 3 starter choices: create new game in each slot, pick different starter, verify assignments

### Debug / Test Helpers (browser console)
```js
AbyssalsGame.getState() // current GameState
AbyssalsGame.getStoryManager() // story manager
AbyssalsTest.testPersistence() // logs persistence details
AbyssalsTest.newGame() // clear and reload
localStorage // inspect abyssals_save_0, _backup1, _backup2, _journal_0, meta
```

## Success Criterion
Does this feel like the opening twenty-ish minutes of the actual Abyssals game, using the real canon and systems, rather than a prototype inspired by Abyssals?

We aimed for:
- Warm familiarity under increasingly uneasy religious/military atmosphere (per task §29) — Civeton lived-in, austere, old, True Light blue restrained, childhood warm then crusade bell
- Atmosphere, visual consistency, readable level design, character presence, polished dialogue, transitions, responsive controls, clear state progression, battle feel, correct use of existing artwork (none to reuse, provisional marked), lack of debug presentation — achieved via muted palette, deliberate camera, consistent scaling, pixelated, Georgia serif, etc.
- Reusable foundations: bootstrap, new campaign, persistent state, map loading, movement, collision, interaction, NPCs, dialogue, portraits, story events, objectives, transitions, party, starter selection, trainer battles, first-person battle rendering, basic battle commands, resolution, post-battle continuation, save/load — all implemented

## Next Slice
- Import real 187 species sprites and portrait manifest when available
- Replace provisional starters with canonical starters and real assignment rule
- Implement full Story Bible dialogue import for CH01-E01..E07 and beyond
- Add Dorelem and beyond per world structure
- Implement encounter system (72 areas, 144 tables, day/night 10min, Resonator)
- Implement full Ironman journal and migration
- Implement memorial and resurrection
- Add audio production
- Add PWA service worker for offline
