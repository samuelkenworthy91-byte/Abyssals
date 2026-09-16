# Abyssals — Repository Handoff Audit

Date: 2026-09-16 (UTC)
Branch: arena/01a0abc2-abyssals (session branch, per Arena system constraints — task requested arena/civeton-opening-vertical-slice but system mandates staying on current branch)
Handoff source: .handoff_exact (12 chunks) + .handoff_chunks (6 parts) reconstructed via manual PK zip local-header parsing due to truncated central directory.

## Reconstructed Handoff Summary
- Successfully decoded 76206 bytes from .handoff_exact (30 local files) and 73713 bytes from .handoff_chunks (42 local files).
- Both archives truncated (missing EOCD). Used tolerant extraction via zlib decompression of local headers.
- Merged result in `/handoff` contains the authoritative text canon that was embeddable.

### Files recovered (merged)
- README_FIRST.md, AGENTS.md, ARENA_AI.md, CONTEXT.md, CLAUDE.md, CODEX.md
- docs/canon/ACTIVE_CANON.md (LOCKED, 187 species, 98 evo paths, starter lives, ironman, battle presentation, etc.)
- docs/canon/ART_DIRECTION.md (portrait rules, True Light palette, no back sprites)
- docs/canon/CHECKLIST_INDEX.md (17 checklists index)
- docs/canon/STORY_IMPLEMENTATION.md (CHxx-Eyy IDs, town_state enum)
- docs/canon/SUPERSESSIONS.md (5 restorations, 18 proxy types, etc.)
- docs/agents/START_HERE_ARENA.md, START_HERE_CODEX.md
- docs/dev/TEST_PLAN.md (deterministic tests, persistence crash tests)
- docs/source_material/ORIGINAL_SOURCE_INVENTORY.md (lists locked DOCX/XLSX that could NOT be embedded)
- data/canon/*.json: characters.json (8 leaders + core cast), core_rules.json, encounter_area_summary.json (72 areas), factions.json (True Light / Dawn Bloom palettes), learnset_rules.json, locations.json (Civeton, Dorelem, etc.), portrait_manifest_meta.json, state_model.json (chapter_state, town_state, leader_fate, starter_assignment, starter_lives, save), warden_fields.json (8 fields)
- schemas/*.json (encounter, move, species, trainer)
- package.json (vite + typescript + vitest + playwright), tsconfig.json
- tools/process_portraits.py, validate_portraits.py, validate_project.py, deck_dev_bootstrap.sh
- assets folders empty (.gitkeep) — 187 species sprites and 100+ portraits NOT present in this runtime (per README_FIRST limitation)

## Existing and Reusable
- **Canon text**: ACTIVE_CANON, ART_DIRECTION, SUPERSESSIONS, STORY_IMPLEMENTATION, CHECKLIST_INDEX, TEST_PLAN, CONTEXT, AGENTS — all LOCKED and usable.
- **Machine-readable canon**: characters, core_rules, factions, locations, state_model, warden_fields, encounter_area_summary, learnset_rules, portrait_manifest_meta.
- **Schemas**: species, move, trainer, encounter — can drive data-driven loaders.
- **Tools**: portrait processing, validation scripts (need adaptation).
- **Project scaffold**: package.json + tsconfig suggests Vite TypeScript PWA target; matches ACTIVE_CANON mobile-first offline PWA.
- **No existing game code**: src/core, src/game, src/ui only contain README.md placeholders.

## Required Implementation for Civeton Vertical Slice
- Game bootstrap + PWA shell (index.html, main.ts)
- Persistent state foundation: 3 slots, commit_seq monotonic, journal, idempotent transaction IDs, atomic commits, recovery generations (simplified but architecture-compatible), lower_snake_case keys per spec.
- Map loading + 16x16 logic grid, 4-dir movement only, 64-112 px/s, screen-edge transitions.
- Player movement controller, collision, interaction distance, NPC interaction, doors/transitions, scripted triggers.
- Civeton map design: small believable medieval settlement, irregular paths, timber/plaster/worn stone, fenced plots, wells, religious iconography restrained, landmarks.
- NPC/dialogue/story-event system using canonical IDs (CH01-E05 starter choice etc.), dialogue presentation with portrait spec.
- Opening story: childhood sequence (Aimon, Pate, Trade toy battle), transition to present, exploration, Pate house empty, Trade message "Don't follow us.", Kurg refusal, revelation that Pate/Trade asked Kurg to stop Aimon.
- Starter selection: 3 provisional starters (since real species data absent), with sprite, stats, type, moves, growth, evolution, canonical identifiers, data-driven loader.
- Pate/Trade assignment: need to define least-invasive rule (documented as provisional due to missing canonical assignment doc).
- Starter three-life system: starter_lives_remaining=3 for original three instances only, 10% return logic, life pips UI.
- Kurg soldier test: first real battle, canonical trainer/soldier provisional, first-person DWM presentation, no back sprite, enemy front sprite, HP bars + exact numbers, move VFX foreground->enemy, enemy attack via sprite lunge + screen impact + damage number.
- Battle UI: HP bars, exact HP, actions, move selection, PP, battle text, damage feedback.
- First-battle safety: tutorial prevents permanent death failure but establishes lethal rule.
- Combat architecture: reusable battle engine accommodating lethal 0 HP, starter lives, Set-style, deterministic, simultaneous KO, surrender/parley, XP, growth, moves, status, death, results, RNG anti-reroll.
- Save/persistence: protagonist name, story position, completed opening events, starter choice, Pate/Trade assignment, starter life count, party state, map/location, first-battle result; survive quit/reload; no rollback before starter selection.
- Audio hooks: Civeton ambience, dialogue, interaction, starter selection, battle transition, battle music, attacks, damage, victory (provisional/restrained).
- Camera and feel: deliberate readable movement, no twitch, no excessive smoothing, cinematic transition for starter/battle.

## Missing Final Assets (genuinely not present)
- Full Story Bible LOCKED v1.0 with exact dialogue and CH01-E01..CH01-E05 sequencing — only summary in STORY_IMPLEMENTATION and task prompt; will implement beats from task prompt using canonical wording where given ("Don't follow us.") and provisional dialogue marked as such.
- Story Event & Flag Master List DOCX (Checklist 10) — only state_model.json summary present; will use lower_snake_case and CH01-E05 ID per prompt.
- Battle Presentation LOCKED DOCX (Checklist 16) — only summary in ACTIVE_CANON; will follow first-person spec from ACTIVE_CANON + task.
- Starter Three-Life DOCX (Checklist 14) — summary in ACTIVE_CANON and state_model; will implement per ACTIVE_CANON §9.
- Ironman Save DOCX (Checklist 15) — summary in ACTIVE_CANON §15 and state_model; will implement simplified transactional version compatible with future full spec.
- Species data: 187 species front sprites, stats/BSTs/abilities workbook v2, learnsets v3, evolution paths — absent; will create 3 provisional starters + 1 provisional soldier opponent species with data-driven loader compatible with future real data.
- Trainer Database (Checklist 04) — absent; will create provisional Kurg soldier trainer.
- Human/NPC portraits: 100 unique + 39 templates — absent; will create provisional silhouettes/portraits following magenta processing convention but marked provisional.
- Environment art: Civeton tiles, True Light shrine, Childhood Hill, Mustering Camp, March — absent; will create provisional production-quality tileset following ART_DIRECTION and task visual direction (grounded medieval, blue/white/silver/navy for True Light, not painting entire village blue).
- Audio: no canonical audio; will use restrained temporary hooks.
- Encounter tables: 144 tables workbook XLSX absent; will preserve compatibility but not implement random encounters for Civeton (per task, only scripted Kurg test).
- Items/economy DOCX, memorial/resurrection DOCX, hell terrain DOCX, etc. — not needed for slice but architecture preserved.

## Canon Risks / Contradictions
- **Starter assignment rule**: Task says "Use the exact assignment rules defined by the canonical documents." Those documents are in ORIGINAL_SOURCE_INVENTORY as missing. No assignment mapping found in recovered JSONs. Risk: inventing mapping that contradicts hidden canon. Mitigation: define explicit deterministic mapping (e.g., cyclic: player picks index 0→ Pate gets 1, Trade gets 2; etc.) and document as PROVISIONAL_CANON_GAP, easily replaceable via data file.
- **Starter species identities**: Real starters not present. Task says "Do not use temporary generic creatures if the real starter species assets/data are present." Since absent, provisional required. Risk: provisional names/stats clash with real canon later. Mitigation: use clearly provisional IDs (PROV-STARTER-01..03) but with distinct grounded fantasy designs (Bramblekin, Emberling, Tidemaw? Avoid cute). Document as provisional, modular loader so real data can replace without code change.
- **Story dialogue exact wording**: Task says "Use the exact canonical wording from the Story Bible where dialogue has already been written." Story Bible absent. Only canonical line present is "Don't follow us." Will use that exactly; other dialogue will be provisional but in same grounded tone, marked as provisional, not claimed as canonical.
- **Kurg soldier opponent**: Canonical trainer/soldier and opponent Abyssal defined by story/trainer data — absent. Will use provisional soldier "Mustering Recruit" with provisional species "Hollow Hound" level 5, documented as provisional.
- **Childhood toy-battle sequence**: Function to establish relationship, not lengthy prologue. No spec found. Will implement short scripted toy-battle (no real Abyssals) with Aimon/Pate/Trade.
- **Civeton map layout**: World/location documentation only lists settlement names, not detailed map. Task says use existing Civeton/world/location documentation as source of truth, but only locations.json with settlement list present. Will build small believable settlement per task visual guidance, modular map data separate from rendering assets.
- **Battle presentation VFX**: ACTIVE_CANON says player attacks use move/type VFX travelling from foreground toward enemy; enemy attacks use sprite movement/lunge + foreground/screen impact. Exact VFX spec in missing Checklist 16 DOCX. Will implement restrained version per task §13.
- **Ironman save**: ACTIVE_CANON §15 requires current snapshot + 2 hidden recovery generations + journal + commit_seq + idempotent Tx IDs + atomic durable commits. Will implement localStorage version with those concepts simplified but compatible.
- **Growth formula**: ACTIVE_CANON §4 gives formula but no BSTs for starters. Will apply formula for provisional starters.
- **Portrait spec**: ART_DIRECTION says magenta #FF00FF source, crop to opaque bounds, scale by figure height, centre on agreed canvas. Production canvas dimensions deliberately NOT invented in handoff. Will use provisional canvas 512x512 and document.

## Implementation Approach
- Use Vite + TypeScript (from package.json) to build PWA.
- Create data-driven loaders: species.json, moves.json, starters.json, trainers.json, story_events.json, maps/civeton.json
- Implement core: RNG (seeded deterministic), state model (lower_snake_case), persistence (localStorage + journal + commit_seq), battle engine (deterministic, transactional)
- Implement game: map renderer (Canvas 2D), player controller (4-dir, 16px grid, 64-112 px/s), collision, NPCs, dialogue UI with portrait, story event manager
- Implement opening: childhood hill scene → Civeton village → exploration triggers → Pate house empty → Trade message → Kurg interaction → starter selection CH01-E05 → battle → post-battle
- Visual: provisional tileset using muted earth tones, timber, plaster, worn stone; True Light blue/white/silver/navy for shrine/banners; character sprites simple but grounded; battle sprites simple but front-facing; no back sprites.
- Audio hooks: WebAudio placeholder, separate hooks per task §20
- Testing: manual playthrough of required flow, plus save/reload at critical points, plus 3 starter choices.

## Branch Note
Per Arena system, must stay on arena/01a0abc2-abyssals. Will push to that branch. Task's suggested branch arena/civeton-opening-vertical-slice is noted but not created to comply with system.

## Next Steps
- Scaffold Vite project
- Create audit file (this)
- Implement core systems
- Build Civeton
- Implement story + battle
- Polish + test
