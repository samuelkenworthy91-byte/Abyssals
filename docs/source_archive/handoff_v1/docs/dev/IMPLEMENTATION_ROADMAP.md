# Recommended coding roadmap

This is an implementation order, not new canon.

## Phase 0 — repository and data gates
- Set up TypeScript/Vite PWA shell, unit tests and e2e runner.
- Load `data/canon` first and make schema/validator failures block CI.
- Import the original species/progression/trainer/encounter source files when available, converting them into runtime JSON without altering their IDs or values.

## Phase 1 — pure deterministic domain core
Implement types and pure functions first: species instances, stats/growth, XP, moves, damage foundations, RNG seed/command ledger and event IDs. No UI dependency.

## Phase 2 — battle vertical slice
One wild battle with switching, PP, HP, damage, status hooks, KO batching and exact HP display. Then add trainer battle and the leader mutual-KO rule.

## Phase 3 — capture + death + starter lives
Add food capture with deterministic reload protection; ordinary permanent death; starter life decrement/pending end-of-round return; wipe classification. Build crash/reload tests before expanding content.

## Phase 4 — party/reserve/memorial
Party six, unlimited reserve, Aeric access/heal/relearn, exact dead-instance ledger, memorial UI and ten-distinct-species resurrection transaction.

## Phase 5 — world/encounters
16×16 tile logic, four-direction movement, screen-edge map transitions, 10-minute phase clock, authored encounter area/table loader, Resonator suppression, skiff gates and carriage travel.

## Phase 6 — story-state engine
Chapter/town enums, stable scene/event IDs, leader fate transaction, human life/restoration state, executed-leader Hell set, NPC aftermath hooks.

## Phase 7 — economy/content data
Items/shops/capture foods/evolution items/held items, Trial Marks and five-slot growth-training effects. Import trainer teams, learnsets and encounter tables with validators.

## Phase 8 — presentation/art
Battle UI, enemy sprite/VFX presentation, dialogue/pre-battle portraits, evolution presentation and deterministic portrait asset pipeline.

## Phase 9 — Ironman persistence hardening
Three-slot snapshot + two hidden recovery generations + journal, idempotent transactions, single-writer lock, migrations, corruption recovery, soft-lock relocation and end-state handling.

## Phase 10 — complete content and release
Wire full Story Bible scenes, all maps/trainers/encounters, Hell/postgame, balance simulations, accessibility, PWA install/offline caching and release checks.
