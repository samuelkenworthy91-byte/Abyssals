# Pre-programming checklist index — active implementation summary

| # | Topic / locked role | Implementation handoff |
|---|---|---|
| 01 | Exact Stat Growth Algorithm | Seeded FE-style independent growth; BST-weighted formula; HP baseline; evolution-history-safe growth. |
| 02 | World/Encounter Table authority | Authored route/area encounter model; now backed by completed 144-table day/night/PALE/DARK workbook. |
| 03 | World Travel / Route Structure | Linear spine + local branches, manual first travel, carriage fast travel, watercraft, backtracking, day/night loop. |
| 04 | Trainer Database & Team Planning | Trainer classes/IDs, named teams, progression, AI tiers, held-item roles, mortal leaders and Hell rematch versions. |
| 05 | Hell Terrain Finalisation | Native Warden fields, symmetry, before-Turn-1 activation, readable HUD, replacement/resumption, special defensive boosts. |
| 06 | Items, Shops & Economy | Consumables, capture food, evolution items, held items, shops, Trial Marks and five-slot growth training. |
| 07 | Memorial & Resurrection System | Civeton memorial; exact-instance ledger; ten distinct living species cost; sacrifice warnings; Mirra/history integration. |
| 08 | Party & Reserve | Party 6, unlimited reserve, Aeric-only access, instant reserve healing, reserve non-deployment on wipes. |
| 09 | Leader & Trainer Fate System | Eight-leader SPARE/EXECUTE; Samiel surrender exception; 18 execution proxies; Hell returns; current version v1.1. |
| 10 | Story Event & Flag Master List | Authoritative compact state machines, immutable IDs/history, five elective human restorations, chapter/town/leader state. |
| 11 | Evolution Validation | 187 species / 98 paths; only four story-choice families main-game branch locked; opposite branch postgame via Prime Archive/approved resolver. |
| 12 | Learnset Validation | Move category, accuracy/ALWAYS, target enum, priority, family signatures, Aeric relearning, evolution-move handling and branch-history restrictions. |
| 13 | Battle Edge Cases | 42 locked edge-case behaviours; simultaneous KOs; leader mutual-KO victory; delegates starter-life exactness to 14 and crash persistence to 15. |
| 14 | Starter Three-Life System | Only original three starter instances; three lives; end-of-round 10% return; final life becomes permanent death. |
| 15 | Ironman Save & Persistence Specification | 3 slots; authoritative snapshot + 2 recovery generations + journal; atomic anti-reroll persistence and migration/recovery rules. |
| 16 | Battle Presentation Specification | First-person visible enemy only; HP numerics; asymmetric VFX; deterministic capture progress; evolution flash/presentation. |
| 17 | Overworld Movement / Presentation | 16×16 logic grid; four directions; 64–112 px/s; screen-edge map transitions; story object paths/removal. |

The row summaries are implementation indexes, not permission to ignore the detailed active canon in `ACTIVE_CANON.md` and machine-readable files.
