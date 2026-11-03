# Implementation roadmap

These milestones are engineering order, not redesigned gameplay. Complete one reviewable slice at a time. M0 import integrity is prepared, but full content remains blocked by the sources listed in ../audit/UNRESOLVED_ITEMS.md. Preparation is at Phase H owner review. M1 is the first implementation task only after explicit owner release; do not begin it now.

**Persistence dependency:** establish deterministic commands/events and a storage interface in M2. M4–M8 use disposable fixtures only; none may ship irreversible campaign state until M9 passes. A production content gate is separate from a shell build. All 35 recovered references are extracted; remaining field questions are not permission to invent values.

For each milestone, the paths below are repository-relative: canon names under docs/canon/, data paths under data/. Choose only the modules actually required, not empty scaffolding. Tests must cover behaviour and failure conditions, not mirror implementation.

## M0 — Repository and data validation

- **Objectives:** Preserve sources, authority, IDs, schemas and asset provenance. Maintain the audited source-backed extraction and resolve only documented content questions with approved evidence.
- **Canon:** README.md, SPECIES_EVOLUTION.md
- **Data:** manifests/*, schemas/*
- **Code/modules:** tools/data/, tools/validation/
- **Acceptance:** Integrity gate passes; every unavailable dataset and asset is explicitly blocked; strict content gate remains red until complete.
- **Automated tests:** Schema/ref/count/checksum negative cases; source-to-derived reconciliation.
- **Manual playtest:** Read audit, inspect one source-to-entity mapping and one explicit unresolved field.

## M1 — Application shell and offline PWA

- **Objectives:** Build a minimal TypeScript/Vite mobile-first shell with a diagnostics page and offline lifecycle; no combat or campaign simulation.
- **Canon:** CORE_VISION.md, UI_EXPECTATIONS.md, ART_DIRECTION.md
- **Data:** manifests/import_status.json, manifests/datasets.json
- **Code/modules:** src/app/, src/ui/
- **Acceptance:** Pinned dependencies and lockfile; dev/build/preview commands work; installed shell relaunches offline; availability state is honest.
- **Automated tests:** Typecheck, unit smoke tests and browser offline/relaunch checks.
- **Manual playtest:** Open phone and Deck widths, install, close, disable network, reopen and check touch/keyboard navigation.

## M2 — Data loaders and game state

- **Objectives:** Typed validated loaders, immutable entity IDs, individual IDs, serializable domain boundaries and persistence interface.
- **Canon:** SPECIES_EVOLUTION.md, SAVE_IRONMAN.md
- **Data:** characters/*, species/*, story/state_model.json, save_schema/contracts.json
- **Code/modules:** src/data/, src/entities/, src/state/, src/save/ interface
- **Acceptance:** Missing content fails explicitly; no invented defaults. Domain state independent of UI; fixtures never enter production catalogues.
- **Automated tests:** Load good/bad/null references; round-trip fixture state; stable deterministic commands/event identifiers.
- **Manual playtest:** View loaded identity/count diagnostics; all 187 species identities load and partial fields fail explicitly without invented defaults.

## M3 — Overworld grid movement

- **Objectives:** Four-direction movement on 16px logic grid, collision and authored screen-edge transitions in disposable test maps.
- **Canon:** OVERWORLD_PRESENTATION.md, TRAVERSAL_WORLD_MAP.md
- **Data:** locations/*; authored maps when supplied
- **Code/modules:** src/world/, src/game/
- **Acceptance:** No diagonal travel; speed within 64–112 px/s; transitions land safely once; production geometry waits for maps.
- **Automated tests:** Collision, opposing inputs, blocked exits, transition destination validity and varying frame times.
- **Manual playtest:** Walk/run all four directions, hold edge input, cross/re-enter a screen, test touch/keyboard/Deck.

## M4 — Basic battle engine

- **Objectives:** Pure battle command resolution with explicit turn events, visible enemy only and small deterministic test fixtures.
- **Canon:** BATTLE_SYSTEM.md, MOVES_TYPES.md, BATTLE_PRESENTATION.md
- **Data:** moves/*, types/*, battles/*; exact damage source required
- **Code/modules:** src/battle/, src/entities/, src/ui/
- **Acceptance:** Validated formulas only; batched simultaneous KOs; exact HP state; leader mutual-KO exception scoped correctly.
- **Automated tests:** Deterministic order/damage fixtures once formula supplied; invalid actions; ordinary versus leader mutual KOs.
- **Manual playtest:** One disposable battle: attack, switch, inspect HP/PP and both KO outcomes. No campaign release yet.

## M5 — Species, growth and evolution

- **Objectives:** Load all 187 IDs, implement locked growth/XP/promotions using original numeric sources, then validate all paths.
- **Canon:** SPECIES_EVOLUTION.md, STATS_GROWTH.md, XP_LEVELLING.md, MOVES_TYPES.md
- **Data:** species/*, evolutions/*, moves/learnsets.json, progression/*
- **Code/modules:** src/systems/progression/, src/entities/
- **Acceptance:** 187 canonical species; 98 legal paths; no retroactive stat reroll; branch move leakage blocked; 100-XP levels/cap 200.
- **Automated tests:** Rounding and >100% boundary cases from source; participant-specific XP; evolution save/reload; declined move relearning.
- **Manual playtest:** Compare seeded instances before/after level and evolution; verify preserved moves and full-party choice UI.

## M6 — Capture, encounters and phases

- **Objectives:** Food capture consumes committed RNG result; area/phase slot selection uses authored tables; Resonator suppresses without reroll.
- **Canon:** CAPTURE.md, ENCOUNTERS.md, DAY_NIGHT.md
- **Data:** encounters/*, species/*, items/*
- **Code/modules:** src/systems/capture/, src/world/encounters/
- **Acceptance:** 144 complete six-slot tables; weights 100; phase locked at encounter start; authored levels preserved.
- **Automated tests:** Exact source probabilities; reload same capture result; suppression consumes one generated result; phase boundary fixtures.
- **Manual playtest:** Throw food and inspect progress/HP; switch phase at boundary; safe areas suppress encounters; low-level Resonator check.

## M7 — Trainer battles and AI

- **Objectives:** Import classes, tiers, teams and permissions before implementing bounded tier-specific decisions.
- **Canon:** TRAINERS_AI.md, BATTLE_SYSTEM.md
- **Data:** trainers/*, trainer_classes/*, battles/*, items/*
- **Code/modules:** src/battle/ai/, src/game/
- **Acceptance:** All species/move/item/class references resolve; no class inferred from portrait name; trainer defeat is not human death.
- **Automated tests:** Tier permission fixtures, switch/item limits, held items and deterministic action choice.
- **Manual playtest:** Fight representative tiers and check legal party/move sets, rewards, portraits and ordinary-trainer aftermath.

## M8 — Permadeath and starter lives

- **Objectives:** Implement lethal KO transactions, exact dead-instance ledger and original-individual starter lifecycle on test storage.
- **Canon:** PERMADEATH.md, STARTER_LIVES.md, MEMORIAL_RESURRECTION.md
- **Data:** save_schema/contracts.json, story/state_model.json
- **Code/modules:** src/systems/death/, src/battle/, src/state/
- **Acceptance:** Nonfinal loss decrements once; return after end-turn before wipe at max(1,ceil(10%)); final death permanent; held items return once.
- **Automated tests:** Multi-hit, simultaneous/end-turn lethality, pending-return wipe protection, original versus captured starter species.
- **Manual playtest:** Inspect 3→2→1→0; pending return and lost action; reserve never auto-deploys. Campaign enablement waits for M9.

## M9 — Ironman persistence

- **Objectives:** Complete durable adapter/journal/single-writer protocol, recovery and forward migration; gate every irreversible feature through it.
- **Canon:** SAVE_IRONMAN.md, STARTER_LIVES.md, LEADER_FATE.md
- **Data:** save_schema/contracts.json; released schema only after implementation
- **Code/modules:** src/save/, src/state/
- **Acceptance:** Three independent slots, one current state, two recovery generations; monotonic sequence; idempotent results; durable acknowledgement; highest valid recovery.
- **Automated tests:** Crash matrix around every irreversible write; corrupt snapshot/journal; duplicate transactions; two tabs; failed quota; interrupted migration.
- **Manual playtest:** Force-close/reopen offline, corrupt disposable fixtures, contend tabs and retry storage failures. No player rollback selector.

## M10 — Items, shops, reserve and memorial

- **Objectives:** Authored economy, ownership transfer, Aeric-only services, ten-distinct-species resurrection and five training-effect slots.
- **Canon:** ITEMS_ECONOMY.md, PARTY_RESERVE.md, MEMORIAL_RESURRECTION.md
- **Data:** items/*, shops/*, progression/*, characters/*
- **Code/modules:** src/systems/economy/, src/systems/reserve/, src/ui/
- **Acceptance:** Ownership atomic; no item duplication; reserve unlimited; memorial exact-instance restore; Trial Marks and normal money separate.
- **Automated tests:** Sale rounding, no wild money, duplicate-species rejection, favourite warnings, sacrifice deletion, training duration/stack count.
- **Manual playtest:** Visit Aeric, heal/relearn, fill party, resurrect to reserve; try invalid ten-species selection and sixth training effect.

## M11 — Story, dialogue and leader fate

- **Objectives:** Implement authored scene IDs and state machines; irreversible confirmations; separate human fate/life history and five restorations.
- **Canon:** STORY_WORLD.md, LEADER_FATE.md, HUMAN_RESTORATION.md
- **Data:** story/*, dialogue/*, characters/*, locations/*
- **Code/modules:** src/systems/story/, src/game/, src/ui/
- **Acceptance:** Historical EXECUTED stays executed after revival; only Samiel early surrender; no visible morality score; services remain reachable.
- **Automated tests:** Scene idempotency, fate transactions, skip/confirm paths, zero-to-eight executed-leader Hell set, restoration cap.
- **Manual playtest:** Spare/execute branches in separate fixtures; restore Pate/Trade optionally; inspect historical/current states.

## M12 — Complete mortal campaign

- **Objectives:** Integrate the authored critical spine and optional areas through Jeros with real data and approved runtime art.
- **Canon:** STORY_WORLD.md, LOCATIONS.md, ENCOUNTERS.md
- **Data:** all mortal scene/map/trainer/encounter catalogues
- **Code/modules:** src/game/, src/world/, src/systems/story/
- **Acceptance:** Fresh-slot mortal critical path completable without debug; no missing required content; essential services survive all fate choices.
- **Automated tests:** Scene/map reachability, gate dependencies, full route smoke runs, encounter exclusions and regression save fixtures.
- **Manual playtest:** Normal fresh playthrough: pacing toward ~100 final mortal leader, optional routes, carriage/skiff backtracking and all leaders.

## M13 — Hell and postgame

- **Objectives:** Nine Circles, eight symmetric fields, executed-leader rematches, human restoration and approved branch-unlock content.
- **Canon:** HELL_POSTGAME.md, HUMAN_RESTORATION.md, SPECIES_EVOLUTION.md
- **Data:** terrain/*, story/*, trainers/*, encounters/*, evolutions/*
- **Code/modules:** src/game/, src/battle/fields/, src/systems/story/
- **Acceptance:** Native field before turn one; replacement/resumption exact; no leader becomes Warden; cap 200; history remains immutable.
- **Automated tests:** Field multipliers/replacement, all executed-leader subsets, five-use combinations, opposite-branch move access.
- **Manual playtest:** Complete descent/postgame, read field HUD, verify branch unlock, optional restorations and level-200 ceiling.

## M14 — Presentation, VFX and audio

- **Objectives:** Integrate reviewed runtime sprites/portraits, foreground player VFX, enemy impacts, readable UI and authored audio.
- **Canon:** BATTLE_PRESENTATION.md, OVERWORLD_PRESENTATION.md, ART_DIRECTION.md, UI_EXPECTATIONS.md
- **Data:** manifests/abyssal_art.json, manifests/portraits.json; approved production assets
- **Code/modules:** src/ui/, src/app/; assets runtime categories
- **Acceptance:** No back sprites; no cropped props/body distortion; correct IDs, transparent portraits; responsive layout; animations never generate gameplay RNG.
- **Automated tests:** Asset checksums/coverage, reduced-motion timing independence, HP/capture display derives from state, offline cache coverage.
- **Manual playtest:** Compare characters at shared scale on light/dark backgrounds; readability, life pips, fields, sound controls and phone orientation.

## M15 — Balance and full campaign QA

- **Objectives:** Run authored balance simulations, end-to-end fresh campaigns and abuse/device passes; propose evidence-backed changes separately.
- **Canon:** All relevant canon; never alter locks silently
- **Data:** complete data catalogues and playtest records
- **Code/modules:** tests/integration/, tests/playtest/; balancing tools
- **Acceptance:** Integrity, strict content, build and required test suites green; no unresolved critical save/soft-lock bugs; full campaign completable offline.
- **Automated tests:** Seeded campaign coverage, death/capture balance distributions, every gate/phase/fate regression and full crash suite.
- **Manual playtest:** Execute PLAYTEST_PLAN.md and BALANCE_TESTING.md across Android, Steam Deck and desktop; retain reports by commit.
