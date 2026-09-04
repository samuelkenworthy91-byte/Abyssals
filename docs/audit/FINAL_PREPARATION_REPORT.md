# Final repository preparation report

**Phase H — STOP for owner review. Do not start M1, implement gameplay or merge PR #1.**

Preparation estimate: **95%**. This is a judgment of handoff completion, not a percentage of game implementation. All supplied-source preservation, deterministic extraction and usable supplied-art processing are complete; final readiness still depends on the exact questions and genuinely absent content listed below.

## Readiness layers

| Layer | Audited status |
|---|---|
| SOURCE PRESERVED | COMPLETE: 234 archive members + 35 recovered references + 19 prior repository files, checksum verified. |
| CANON EXTRACTED | All supplied references extracted; 24 of 33 datasets complete for their stated representation; nine exact partial datasets remain. |
| RUNTIME READY | 187/187 monster fronts and 78/78 supplied canonical portraits + one variant; 22 absent portrait targets and future presentation assets prevent complete game asset readiness. |
| IMPLEMENTATION READY | Reviewable preparation baseline. Strict full-content gate blocked; no game build exists and owner has not released M1. |

## Assets and preserved source

| Measure | Coverage |
|---|---|
| Original archive members | 234, including 89 monster sheets and 91 portraits |
| Recovered detailed references | 35/35 (31 active, four superseded), losslessly extracted |
| Prior repository source files | 19 preserved |
| Canonical species identities / runtime fronts | 187/187 / 187/187 |
| Evolution families | 89 |
| Supplied canonical portraits processed | 78/78 |
| Variants processed | 1 (Severin King Below) |
| Alternates retained as source only | 5 |
| Superseded portraits retained as source only | 7 |
| Genuinely absent portrait targets | 22, listed by ID/name in UNRESOLVED_ITEMS.md |
| Unresolved active portrait identities | None |
| Unlabelled supplemental monster illustrations | 2 source-only; no canonical coverage gap |

Original checksums remain intact. All 79 processed portraits were visually reviewed during Phase D, with full figures/props, transparent backgrounds and consistent body anchors; Phase G does not change any source or runtime art. Canvas conventions and reproducible scripts are documented under docs/art/.

## All registered datasets

COMPLETE means complete for the source-backed representation. In particular, world/story/checklist specifications remain authoring contracts, not an executable RPG. There are **24 COMPLETE, nine PARTIAL and zero wholly missing registered datasets**. Six specific field contracts are genuinely missing; they do not erase recovered records. Eight of the original 16 partial datasets were completed.

| Dataset | Records | Status | Authoritative source |
|---|---:|---|---|
| `data/characters/characters.json` | 100 | COMPLETE | ABYSSALS_Human_NPC_Portrait_Prompt_Manifest_v1.0.docx; Pokemon_Story_Bible_Character_Roster_v1.0.docx; Pokemon_Story_Bible_Full_Plot_LOCKED_v1.0.docx; data/canon/characters.json; docs/source_archive/portrait_package/documentation/TARGET_STATUS_100.csv |
| `data/trainers/trainers.json` | 95 | PARTIAL | ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_06_Items_Shops_Economy_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_12_Learnset_Validation_LOCKED_v1.0.docx |
| `data/factions/factions.json` | 3 | COMPLETE | data/canon/factions.json |
| `data/locations/locations.json` | 93 | PARTIAL | ABYSSALS_CHECKLIST_02_DAY_NIGHT_ENCOUNTER_TABLES_LOCKED_v1.0.xlsx; WORLD_TOWNS_ROUTES_REFERENCE_v1.1.md |
| `data/encounters/areas.json` | 72 | COMPLETE | data/canon/encounter_area_summary.json |
| `data/encounters/tables.json` | 144 | COMPLETE | ABYSSALS_CHECKLIST_02_DAY_NIGHT_ENCOUNTER_TABLES_LOCKED_v1.0.xlsx; ABYSSALS_EVOLUTION_IMPLEMENTATION_ADDENDUM_LOCKED_v1.0.docx |
| `data/terrain/fields.json` | 8 | COMPLETE | ABYSSALS_CHECKLIST_05_Hell_Terrain_Finalisation_LOCKED_v1.0.docx |
| `data/species/species.json` | 187 | PARTIAL | Regional_Dex_Growth_and_Evolution_VALIDATED_v4.xlsx; Regional_Dex_Progression_Learnsets_v3.xlsx; Regional_Dex_Stats_and_Abilities_COMPLETE_v2.xlsx |
| `data/evolutions/evolutions.json` | 98 | COMPLETE | ABYSSALS_CHECKLIST_06_Items_Shops_Economy_LOCKED_v1.0.docx; ABYSSALS_EVOLUTION_IMPLEMENTATION_ADDENDUM_LOCKED_v1.0.docx; Regional_Dex_Growth_and_Evolution_VALIDATED_v4.xlsx; Regional_Dex_Progression_Learnsets_v3.xlsx |
| `data/moves/moves.json` | 354 | PARTIAL | ABYSSALS_CHECKLIST_12_Learnset_Validation_LOCKED_v1.0.docx; Pokemon_Fan_Game_354_Move_Catalogue.xlsx; Pokemon_Fan_Game_AI_VFX_Prompt_Log_354_Moves.xlsx |
| `data/moves/learnsets.json` | 1,893 | COMPLETE | ABYSSALS_CHECKLIST_12_Learnset_Validation_LOCKED_v1.0.docx; Pokemon_Fan_Game_354_Move_Catalogue.xlsx; Regional_Dex_Progression_Learnsets_v3.xlsx |
| `data/types/types.json` | 18 | PARTIAL | ABYSSALS_CHECKLIST_09_Leader_Trainer_Fate_System_LOCKED_v1.2_CORRECTION.docx; Pokemon_Fan_Game_354_Move_Catalogue.xlsx |
| `data/trainer_classes/classes.json` | 39 | COMPLETE | ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx |
| `data/items/items.json` | 102 | COMPLETE | ABYSSALS_CHECKLIST_06_Items_Shops_Economy_LOCKED_v1.0.docx |
| `data/shops/shops.json` | 12 | COMPLETE | ABYSSALS_CHECKLIST_06_Items_Shops_Economy_LOCKED_v1.0.docx |
| `data/story/scenes.json` | 150 | PARTIAL | ABYSSALS_CHECKLIST_10_Story_Event_Flag_Master_List_LOCKED_v1.0.docx; ABYSSALS_EVOLUTION_IMPLEMENTATION_ADDENDUM_LOCKED_v1.0.docx; Pokemon_Story_Bible_Full_Plot_LOCKED_v1.0.docx |
| `data/dialogue/dialogue.json` | 7 | PARTIAL | Pokemon_Story_Bible_Full_Plot_LOCKED_v1.0.docx |
| `data/battles/battles.json` | 93 | PARTIAL | ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx; Pokemon_Story_Bible_Full_Plot_LOCKED_v1.0.docx |
| `data/evolutions/families.json` | 89 | COMPLETE | Regional_Dex_Progression_Learnsets_v3.xlsx |
| `data/species/abilities.json` | 87 | PARTIAL | Regional_Dex_Stats_and_Abilities_COMPLETE_v2.xlsx |
| `data/encounters/acquisition.json` | 31 | COMPLETE | ABYSSALS_CHECKLIST_02_DAY_NIGHT_ENCOUNTER_TABLES_LOCKED_v1.0.xlsx |
| `data/trainers/ai_tiers.json` | 7 | COMPLETE | ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx |
| `data/trainers/profiles.json` | 7 | COMPLETE | ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx |
| `data/progression/chapter_bands.json` | 21 | COMPLETE | ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx |
| `data/battles/modes.json` | 6 | COMPLETE | ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx |
| `data/trainers/companion_checkpoints.json` | 17 | COMPLETE | ABYSSALS_CHECKLIST_04_Trainer_Database_Team_Planning_LOCKED_v1.0.docx |
| `data/shops/threshold_stock.json` | 1 | COMPLETE | ABYSSALS_CHECKLIST_06_Items_Shops_Economy_LOCKED_v1.0.docx |
| `data/progression/trial_contracts.json` | 5 | COMPLETE | ABYSSALS_CHECKLIST_06_Items_Shops_Economy_LOCKED_v1.0.docx |
| `data/story/chapters.json` | 24 | COMPLETE | ABYSSALS_CHECKLIST_10_Story_Event_Flag_Master_List_LOCKED_v1.0.docx |
| `data/story/state_contracts.json` | 109 | COMPLETE | ABYSSALS_CHECKLIST_10_Story_Event_Flag_Master_List_LOCKED_v1.0.docx |
| `data/progression/locked_contracts.json` | 685 | COMPLETE | ABYSSALS_CHECKLIST_01_Exact_Stat_Growth_Algorithm_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_07_Memorial_Resurrection_System_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_08_Party_Reserve_Management_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_09_Leader_Trainer_Fate_System_LOCKED_v1.1.docx; ABYSSALS_CHECKLIST_09_Leader_Trainer_Fate_System_LOCKED_v1.2_CORRECTION.docx; ABYSSALS_CHECKLIST_13_Battle_Edge_Cases_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_14_Starter_Three_Life_System_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_15_Ironman_Save_Persistence_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_16_Battle_Presentation_LOCKED_v1.0.docx; ABYSSALS_CHECKLIST_17_Overworld_Interaction_Rules_LOCKED_v1.0.docx |
| `data/encounters/species_availability.json` | 187 | COMPLETE | ABYSSALS_CHECKLIST_02_DAY_NIGHT_ENCOUNTER_TABLES_LOCKED_v1.0.xlsx |
| `data/locations/world_routes.json` | 25 | COMPLETE | WORLD_TOWNS_ROUTES_REFERENCE_v1.1.md |

Additional counts: 864 encounter slots (856 direct + eight resolvers); 370 trainer team slots; 325 resolved move categories / 29 unresolved; 301 moves without outstanding metadata questions / 53 with exact questions; 87 ability contracts with five specific semantic questions plus shared battle-tag dependencies. Core rules and save contracts supplement the 33 record datasets. Every record retains source coordinates or dataset-level provenance.

## Validation and remaining blockers

Integrity, schema/reference/duplicate checks, source preservation, all asset checksums/existence and complete source reconciliation pass. All **24 tooling tests pass**. Full content readiness remains **BLOCKED (97 CONTENT findings, zero integrity errors)**; see final_validation_result.json and the complete field-by-field [UNRESOLVED_ITEMS.md](UNRESOLVED_ITEMS.md). The strict gate has not been weakened.

The remaining questions cover six missing field contracts (catch rates, type matrix, XP awards, exact battle/initial-stat numeric binding, WRONG_SHIFT and clock lifecycle); 53 move metadata records; five ability semantics and shared tags; 13 trainer loadout questions plus Leader-lite inheritance/final selection and deferred rematches; Jeros reconciliation and map geometry; final dialogue/epitaph/farewell wording; executable story/map bindings and bespoke boss/tutorial payloads; and the 22 absent portraits. All exact IDs and fields are in the linked unresolved register.

Checklists take precedence over old compiled prose. Resolutions include HP success-only growth (C16), evolution HP percentage (C19), move #310 priority removal (C20), first-person VFX authority (C21), optional human restoration and Nharos identity. There are 24 recorded conflicts: 22 resolved and two unresolved. C22 is the Yselle/Oren held-item contradiction; C24 is LOC-JEROS reconciliation. C23 records the source-backed general mutual-final-KO rule. See CONFLICTS_AND_RESOLUTIONS.md.

GitHub integrity CI: Phase D run 33768994963 PASS; Phase E run 33771948984 PASS; Phase F run 33772583909 PASS. Final Phase G head CI is checked after publication and recorded in PR #1. Green integrity CI does not imply a passing strict content gate. No playable application exists; gameplay, browser shell, build and campaign playtests are not run.

## Commits and review recommendation

- Accepted A–C baseline: 08b8214, unchanged.
- D: 14ed236 — 78 canonical portraits and one variant processed.
- E: 5efb4e5 — canonical game data consolidated.
- F: 1eb7f69 — full source reconciliation and strict validation.
- G: final documentation/readiness commit containing this report; exact SHA is recorded on PR #1.

PR #1 is reviewable as a preserved, validated preparation baseline, but it is **not an unconditionally complete production-content handoff** while the strict gate is blocked. Merge only after owner review explicitly accepts the remaining blockers or supplies their resolution. No merge or M1 was performed.

After explicit owner release, the recommended first coding task is **M1 only: minimal TypeScript/Vite offline PWA title/navigation shell, separate developer-only read-only manifest diagnostics, pinned dependencies, build/typecheck and offline relaunch checks; no gameplay or campaign saves; stop before M2**. The concrete prompt is ../implementation/FIRST_CODEX_TASK.md.
