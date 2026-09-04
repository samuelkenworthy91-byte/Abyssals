# Abyssals — primary instructions for every coding agent

## Phase H — stop for owner review

Phases D–G continue the accepted A–C baseline on `handoff/structured-import`, PR #1. Preparation is now presented for review. **Do not start M1, implement gameplay or merge PR #1 until the owner explicitly releases the hold.** Read docs/audit/FINAL_PREPARATION_REPORT.md for the audited status and exact remaining questions.

Abyssals is an original story-led monster-capture RPG: authored mortal crusade-route exploration, food capture, party development and irreversible choices, followed by nine Circles of Hell and postgame. Target: mobile-first offline PWA, desktop browser compatible, including Steam Deck/Linux. No playable game exists in this preparation branch.

## Required read order
1. This file, README.md, docs/canon/README.md and docs/canon/SUPERSESSIONS.md.
2. The relevant topic under docs/canon/ and docs/audit/UNRESOLVED_ITEMS.md.
3. data/manifests/datasets.json, relevant data/schema files, then existing code/tests.
4. docs/implementation/IMPLEMENTATION_ROADMAP.md. At Phase H, await the owner’s next scoped instruction.

## Source of truth
Current explicit user instructions and the newest explicitly LOCKED rules win, then higher version, then explicit supersession. Record resolutions in docs/audit/CONFLICTS_AND_RESOLUTIONS.md. Cite evidence; never infer missing gameplay values. `docs/source_archive/canon_sources/active/` contains pristine active authority evidence consolidated into `docs/canon/` and `data/`; other archived prompts, scripts, schemas and superseded files are evidence only. Source sheets may contain several canonical species. Use validated structured data and runtime manifests for runtime content. A temporary null or old `missing_source` marker must be rechecked against the complete source inventory before it is treated as a blocker.

## Locked design — do not redesign
- 187 canonical species, 98 evolution paths; four story-choice families locked until postgame. Never invent Dex IDs.
- First-person DWM battle: enemy/wild front art only; do not add player/back sprites. Preserve finished artwork.
- 100 XP per level; cap 200; per-participant level-gap XP; seeded independent BST-weighted growth; HP gains +10 only per successful increment; evolution promotion with no retroactive reroll.
- Food capture, no reload rerolls; ordinary 0 HP is permanent death.
- Only three original starter individuals have three lives; non-final return at end of round, ceil(10% max HP), before wipe classification.
- Party six; unlimited reserve accessed only through Chaplain Aeric Solm in towns.
- Memorial restores exact individuals for ten distinct living reserve species; sacrificed individuals do not enter memorial.
- Only eight mortal leaders get SPARE/EXECUTE; Samiel alone may surrender early; 18 type execution proxies; five elective human restorations with Pate/Trade optional.
- Four cardinal directions, 16px grid, 64–112 px/s, screen-edge transitions; authored encounters, 10-minute phases.
- Three Ironman slots; one current state, two hidden recovery generations and journal; no player rollback selection; durable idempotent transactions and single writer.

## Work and uncertainty
Inspect before editing. Do not implement the whole RPG in one generation. Separate mechanical rules from presentation. For unresolved source/design items, complete independent work and document the precise blocker; do not silently rebalance or import conventional Pokémon defaults. Technical conventions must be identified as implementation choices, not locked design. High-risk transaction changes require deterministic crash/reload tests and independent review before acceptance; this preparation pass implements no game transactions.

## Paths and architecture
docs/canon/ = concise implementation authority; data/ = structured entities/rules and explicit unresolved fields; data/manifests/ = provenance, aliases, assets and readiness; docs/source_archive/canon_sources/active/ = pristine locked authorities; docs/source_archive/canon_sources/superseded/ = obsolete evidence; assets/*/source/ = unchanged originals; assets/*/runtime/ = only validated runtime output. src/README.md defines future modules without empty scaffolding. tools/art/, tools/validation/ and tests/ contain import tooling and tests.

## Commands and completion
Run `bash scripts/setup.sh` to install pinned preparation tooling, then activate `.venv`. Follow docs/playtesting/BUILD_AND_RUN.md for Python-only and npm command equivalents. With `.venv` active: `npm run validate`; `npm run validate:sources`; `npm run validate:reconcile`; `npm test`; `npm run validate:content`. All 187 monster fronts and 79 supplied active portraits are ready. All 35 detailed references are extracted; 24/33 datasets are complete for supplied source. Strict readiness remains blocked by exact questions and 22 absent portraits. Do not weaken it or fill gaps with invented values. **Phase H has been reached; only the owner can release the M1 hold.** Report exact results, unrun checks, unresolved items and the next authorized task.
