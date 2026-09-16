# Abyssals — Civeton Opening Vertical Slice

Branch: `arena/01a0abc2-abyssals` (session branch per Arena system; task requested `arena/civeton-opening-vertical-slice`)

This is the first genuinely playable vertical slice of **Abyssals**, built from the locked handoff in `handoff/`.

## What is Abyssals?

Abyssals is an original monster-capture RPG. Mortal route moves through a linear critical spine from England-like crusader territory toward the Holy Land, then descends through nine Circles of Hell. Themes concern individual moral decisions, organized religions, indifference of gods. No single good/evil score.

**Key identity:** These creatures can genuinely die. Ordinary 0 HP is lethal/permanent death unless starter three-life rule intercepts. The opening should feel familiar, intimate, relatively safe — childhood relationships, home, small settlement — while crusade and first real battle reveal what kind of world Aimon is entering. Warm familiarity under increasingly uneasy religious/military atmosphere.

## Handoff Reconstruction

Repository contains packaged handoff in Base64 archive chunks (`.handoff_chunks` and `.handoff_exact`). Reconstructed via tolerant PK local-header parsing due to truncated central directory:

- `.handoff_exact`: 12 chunks, 76206 bytes decoded, 30 local files
- `.handoff_chunks`: 6 parts, 73713 bytes decoded, 42 local files
- Merged into `handoff/` with authoritative canon: ACTIVE_CANON.md LOCKED, ART_DIRECTION, CHECKLIST_INDEX, STORY_IMPLEMENTATION, SUPERSESSIONS, TEST_PLAN, etc.
- Missing final assets (per README_FIRST): 187 species sprites, 100+ portraits, Story Bible, etc. — binaries in ChatGPT File Library not embedded. Documented in AUDIT.md and ORIGINAL_SOURCE_INVENTORY.md.

## Quick Start

```bash
npm install
npm run dev
# http://localhost:5173/
# Preview: https://5173-<sandbox>.e2b.app (host 0.0.0.0, allowedHosts true)
```

Build:
```bash
npm run build
npm run preview
```

## Playable Flow (per task §22)

1. Start New Game (title screen, 3 slots)
2. Childhood opening: Aimon, Pate, Trade toy-battle
3. Transition to present day, wake in Civeton (crusade begun)
4. Explore Civeton (WASD/Arrows, E/Space/Enter, mobile swipe)
5. Pate's house empty (NW 3,3)
6. Trade's message "Don't follow us." (house 12,4) — canonical wording
7. Kurg initially refuses, reveals Pate/Trade asked him to stop Aimon (post 26,8)
8. CH01-E05 starter choice: 3 starters (provisional Bramblekin, Emberling, Tidemaw) — data-driven, sprite, stats, type, moves, growth, evolution
9. Assignment: Pate and Trade get remaining two per cyclic provisional rule (documented as gap, replaceable)
10. All 3 original instances initialized with starter_lives_remaining=3
11. Kurg soldier test: first real battle, first-person DWM-style (no back sprite, enemy front sprite visible), player attack VFX foreground->enemy, enemy attack via lunge+screen impact+damage number+HP decrease
12. Tutorial safety: controlled test prevents permanent-death failure, but establishes rule real 0 HP die
13. Post-battle return to Civeton, save/reload works without replaying events

## Controls

- WASD / Arrow Keys: Move (4-dir only, 90px/s within 64-112 band)
- E / Space / Enter: Interact
- Click: Advance dialogue, select moves, choose starter
- Mobile: Swipe to move, tap to interact
- Ctrl+S: Manual save (also auto-saves at story boundaries)

## Architecture

- Game bootstrap, new campaign, persistent state, map loading, player movement, collision, interaction, NPCs, dialogue, portraits, story events, objectives, transitions, party, starter selection, trainer battles, first-person battle rendering, battle commands, resolution, post-battle continuation, save/load — all reusable foundations
- Data-driven: species, moves, trainers, dialogue, maps in src/data and src/game/maps
- Persistence: 3 slots, commit_seq monotonic, journal, 2 hidden recovery generations, atomic commits, no rollback, localStorage
- Battle: reusable engine, lethal 0 HP, starter lives, Set-style, deterministic, simultaneous KO batched, surrender/parley architecture, XP, growth, moves, status, death, results, RNG anti-reroll

## Visual Direction

- Civeton: small believable medieval settlement, irregular paths, timber/plaster/worn stone, fenced plots, vegetation, wells, troughs, storage, work signs, restrained religious iconography, landmarks readable without minimap
- True Light: blue/white/silver/navy, medieval/crusader-inspired, used for faction presence (shrine, Kurg, important NPCs) not painting entire village blue
- Darker grounded fantasy, not glossy mobile or chibi Pokemon
- Provisional production-quality environment set, modular replaceable (gameplay/map data separate from rendering/assets)
- Portraits: provisional 128px, grounded proportions, consistent scale, magenta #FF00FF source cleaned, transparent

## Provisional Assets

Real species sprites and portraits absent from handoff per README_FIRST limitation. Created provisional marked as is_provisional, loader replaceable. Never redraw existing Abyssal or canonical character for convenience. See src/assets/README.md and AUDIT.md.

- Bramblekin (EARTH/WILD), Emberling (FIRE/WILD), Tidemaw (WATER/WILD) — grounded designs
- Hollow Hound, Gloam Mite opponents
- Tileset procedurally generated in mapRenderer.ts
- Audio hooks: console.log placeholders for civeton_ambience, dialogue, interaction, starter_selection, battle_transition, battle_music, attack, damage, victory — separate hooks, replaceable

## Testing (per task §27)

- New game: fresh state correct
- Story: events once in canonical order, no replay
- Civeton: no walk through collision, no escape boundaries
- Starter: each of 3 choices works, Aimon/Pate/Trade assignments correct, stable after reload
- Battle: player attack, enemy attack, HP display, damage, victory/tutorial, starter state, post-battle return
- Persistence: quit/reload before/after starter, before/after battle, no duplicated events or contradictory assignments

Debug helpers in browser console:
```js
AbyssalsGame.getState()
AbyssalsTest.testPersistence()
```

## Known Issues & Canon Gaps

See AUDIT.md and IMPLEMENTATION_SUMMARY.md for full list. Main gaps: real starter identities and assignment rule, Story Bible exact dialogue, trainer DB, encounter tables, etc. — all documented as PROVISIONAL_CANON_GAP with least-invasive implementations.

## Next Steps

- Import real 187 sprites and portraits
- Replace provisional starters with canonical
- Full Story Bible import
- Dorelem onward, encounters, Ironman full, memorial, audio, PWA service worker

## Success Criterion

> Does this feel like the opening twenty-ish minutes of the actual Abyssals game, using the real canon and systems, rather than a prototype inspired by Abyssals?

Built toward warm familiarity under uneasy religious/military atmosphere, polished Civeton, clear state progression, battle feel, correct canon usage.

## Branch & Commits

- Branch: arena/01a0abc2-abyssals
- Commits: regular milestones per task §26 (handoff reconstructed, core systems, Civeton map, NPC/dialogue/story, opening sequence, starter selection, battle foundation, Kurg battle, save/reload, polish)
- Final commit SHA: (see git log)
