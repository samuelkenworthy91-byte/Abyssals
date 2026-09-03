# Abyssals

Original story-led monster-capture RPG for a mobile-first offline PWA and desktop browsers. Explore an authored mortal crusade route, capture Abyssals with food, develop a six-member party, make irreversible choices, then descend through nine Circles of Hell.

**Status: repository preparation re-audit; no playable game yet. M1 is paused.** The three supplied packages are preserved. The 89 monster files are source sheets representing the complete 187-species front-art set; they must be reconciled and split into individual runtime assets. Canonical Dex, progression, encounter, trainer, economy, terrain, story and checklist sources have been recovered for deterministic extraction. Portrait processing remains a production task, not a reason to discard the supplied art.

## Start here
1. Every coding agent: read [AGENTS.md](AGENTS.md).
2. Read [canon authority](docs/canon/README.md) and [unresolved sources](docs/audit/UNRESOLVED_ITEMS.md).
3. Use [Codex instructions](CODEX.md) or [Arena AI instructions](ARENA_AI.md).
4. Follow the active preparation phase. Do not start M1 until Phase H owner review releases the hold.

## Validate
After [Linux/Steam Deck tooling setup](docs/playtesting/BUILD_AND_RUN.md):
```bash
source .venv/bin/activate
npm run validate
npm test
npm run validate:content
```
Integrity/tests should pass. The strict content command remains a readiness gate while source conversion and runtime art are unfinished. It must not be weakened to imply completion.

## Repository map
| Directory | Purpose |
|---|---|
| docs/canon/ | Concise authoritative rules and supersessions |
| data/ | Structured records, rules, schemas, partial datasets and provenance/asset manifests |
| docs/source_archive/ | Pristine source evidence, with active and superseded canon clearly separated |
| assets/abyssals/source/ | 89 pristine source sheets representing all 187 species |
| assets/portraits/source/ | All 91 pristine images including alternates/legacy |
| assets/*/runtime/ | Gate-controlled production output being prepared in Phases C and D |
| tools/ | Actual art/data validation scripts |
| tests/ | Preparation tooling tests; future gameplay tests added by milestone |
| src/README.md | Future code boundaries; no empty application architecture |
| docs/implementation/ | M0–M15 roadmap and first coding task |
| docs/playtesting/ | Build, playtest, balance, bug report and Ironman guidance |

Read the [import audit](docs/audit/IMPORT_AUDIT.md), [resolutions](docs/audit/CONFLICTS_AND_RESOLUTIONS.md), [validation report](docs/audit/VALIDATION_REPORT.md) and [art storage decision](docs/art/ASSET_STORAGE.md). Ordinary Git stores this snapshot; no LFS setup is required. Finished artwork is preserved; canonical back sprites are unnecessary.
