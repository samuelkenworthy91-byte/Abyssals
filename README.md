# Abyssals

Original story-led monster-capture RPG for a mobile-first offline PWA and desktop browsers. Explore an authored mortal crusade route, capture Abyssals with food, develop a six-member party, make irreversible choices, then descend through nine Circles of Hell.

**Status: structured repository preparation; no playable game yet.** All three supplied packages are unpacked and preserved. The supplied data/art is incomplete for full implementation: 89 labelled monster sheets, 91 portrait images representing 78/100 targets, no canonical 187-species register, and no complete trainer/encounter/story workbooks. The import does not fabricate those missing records or declare unclean art runtime-ready.

## Start here
1. Every coding agent: read [AGENTS.md](AGENTS.md).
2. Read [canon authority](docs/canon/README.md) and [unresolved sources](docs/audit/UNRESOLVED_ITEMS.md).
3. Use [Codex instructions](CODEX.md) or [Arena AI instructions](ARENA_AI.md).
4. Build **M1 — minimal offline application shell**, as specified in [FIRST_CODEX_TASK.md](docs/implementation/FIRST_CODEX_TASK.md).

## Validate
After [Linux/Steam Deck tooling setup](docs/playtesting/BUILD_AND_RUN.md):
```bash
source .venv/bin/activate
npm run validate
npm test
npm run validate:content
```
Integrity/tests should pass. The strict content command currently fails with explicit missing-source/asset reasons. It must not be weakened to imply a complete game. No application dev/build command exists until M1.

## Repository map
| Directory | Purpose |
|---|---|
| docs/canon/ | Concise authoritative rules and supersessions |
| data/ | Structured records, rules, schemas, partial datasets and provenance/asset manifests |
| docs/source_archive/ | Every original handoff/metadata file plus pre-import repository evidence; historical only |
| assets/abyssals/source/ | 89 pristine labelled sheets; IDs/runtime extraction awaiting original Dex |
| assets/portraits/source/ | All 91 pristine images including alternates/legacy |
| assets/*/runtime/ | Gate-controlled production output; currently no ready files |
| tools/ | Actual art/data validation scripts |
| tests/ | Preparation tooling tests; future gameplay tests added by milestone |
| src/README.md | Future code boundaries; no empty application architecture |
| docs/implementation/ | M0–M15 roadmap and first coding task |
| docs/playtesting/ | Build, playtest, balance, bug report and Ironman guidance |

Read the [import audit](docs/audit/IMPORT_AUDIT.md), [resolutions](docs/audit/CONFLICTS_AND_RESOLUTIONS.md), [validation report](docs/audit/VALIDATION_REPORT.md) and [art storage decision](docs/art/ASSET_STORAGE.md). Ordinary Git stores this snapshot; no LFS setup is required. Finished artwork is preserved; canonical back sprites are unnecessary.
