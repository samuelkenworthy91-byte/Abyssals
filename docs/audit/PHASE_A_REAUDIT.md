# Phase A — source re-audit and corrected assumptions

Date: 3 September 2026. Starting branch head: `b99779560128b69de2dd3111a6a2134278ffaaaf`. Work stays on `handoff/structured-import`, PR #1. **No M1, gameplay implementation or merge.**

## Corrected conclusions

| Earlier conclusion | Re-audit finding | Required preparation work |
|---|---|---|
| 89 monster files imply incomplete canonical species artwork | Incorrect. The owner confirms the 89 sheets contain all 187 species. Source file count is not species count. | B: reconcile each distinct labelled figure against Dex IDs. C: extract and verify 187 individual fronts. |
| Species, evolution and learnset sources must be supplied again | Obsolete. Stats/Abilities v2, Progression/Learnsets v3 and Growth/Evolution v4 are recovered. | Extract existing rows; retain canonical numeric Dex IDs and explicit evolution edges. |
| All 144 encounter tables are absent | Obsolete. The completed workbook has 72 area rows and 864 slot rows grouped into 144 tables. | Convert rows and resolvers, validate all weights and references. |
| Trainer classes/teams, economy and terrain are missing | Obsolete. Full Checklists 04–06 are recovered, including tables of teams, classes, items, prices, shops and field payloads. | Extract deterministic records and separate genuinely unspecified bindings. |
| Story/flag and detailed mechanical source documents are absent | Obsolete. Locked story bible, roster, Checklists 01 and 07–17, and world references are recovered. | Consolidate prose and tables with clause-level citations. |
| Non-exact magenta makes all portraits unusable | Incorrect. Constrained background/edge cleanup is explicitly authorized. | D: reproducible masks, body anchors, visual and pixel QA. Preserve originals and interior colours. |
| Nharos has no established role | Incorrect. Locked story bible, roster and portrait manifest identify the underworld sovereign. | Reconcile the runtime ID convention and source aliases; do not confuse him with Severin. |
| Everything under source_archive is non-authoritative | Incorrect as a blanket statement. Unchanged locked clauses remain authority. | Separate active authority chains from superseded material and archived executable instructions. |
| M1 is the next authorized task | Superseded by owner instruction. | Complete preparation A–G and stop at H for review. |

## What the files actually contain

The uploaded handoff ZIP has 48 members, including nine canon JSON files, four schema templates, Markdown summaries/checklist index, scripts and one build-guide DOCX. Its `docs/source_material/ORIGINAL_SOURCE_INVENTORY.md` explicitly locates the detailed original documents in project history rather than inside that ZIP. The error was treating this packaging limitation as the end of source recovery.

Following those references recovered **35 additional source files**: 31 active authority-chain/supporting files and four superseded/reference files. Their exact bytes and SHA-256 values are preserved under `docs/source_archive/canon_sources/` and indexed in `data/manifests/source_files.json`. The three original packages' **234 members** and the **19 prior-repository files** remain preserved unchanged.

| Dataset or source | Verified source content | Authority / location |
|---|---:|---|
| Species IDs, names, types, six stats and abilities | 187 species; 87 glossary abilities | `Regional_Dex_Stats_and_Abilities_COMPLETE_v2.xlsx`, Full Dex / Ability Glossary |
| Growth / evolution integration | 187 species; 98 path rows | `Regional_Dex_Growth_and_Evolution_VALIDATED_v4.xlsx`, Full Dex + Growth / Evolution Validation |
| Evolution / learnsets | 98 paths; 1,893 learnset rows; four story-choice families | `Regional_Dex_Progression_Learnsets_v3.xlsx`, Evolution Paths / Learnsets / Story Evolutions; Checklist 11 |
| Move catalogue | 354 move rows | `Pokemon_Fan_Game_354_Move_Catalogue.xlsx`, Moves; apply Checklist 12 validation decisions |
| Encounters | 72 areas; 144 tables; 864 slots | `ABYSSALS_CHECKLIST_02_DAY_NIGHT_ENCOUNTER_TABLES_LOCKED_v1.0.xlsx`, Route Summary / Encounter Tables |
| Trainer planning | 39 class rows; seven AI tier rows; 75 regional trainer rows; eight leader and eight Warden team rows | Checklist 04, class/AI/region/leader/Warden tables; additional story rosters are separately authored |
| Hell fields | Eight explicit native fields with stable IDs | Checklist 05, field catalogue and stable-ID payload table |
| Items / shops / training | 16 source tables including ten settlement stock rows | Checklist 06; extraction counts will be reported in Phase E |
| Story progression | 24 chapter registry rows; detailed locked story scenes | Checklist 10 and locked story bible |
| Portrait production identities | 100 named targets and 39 class templates | Full Human NPC Portrait Prompt Manifest; reconcile with supplied package selections |

Source counts above establish recoverable evidence, not finished runtime datasets. No formula cache is accepted as a substitute for the locked formula. No missing field will be silently fabricated.

## Amendment chain and discrepancies

- Checklist 09 **v1.2 correction + unchanged v1.1 body** is active. Five human restorations are elective; Pate/Trade are optional; eighteen primary-type execution proxies remain locked.
- Cleanup addendum makes Aeric the sole reserve/relearner provider in every town. Older local-caretaker wording is superseded.
- The completed encounter workbook supersedes the cleanup/source-index statements that encounter authoring was pending.
- Checklist 01 describes **+10 HP per successful increment**, including +20 for a double increment and zero on failure. The handoff summary says **+10 baseline per level**. Record and reconcile this exact conflict in Phase E before gameplay implementation.
- A DOCX or workbook version supersedes only the scope it owns; newer summaries do not silently erase detailed locked clauses.

## Coverage at this checkpoint

| Readiness dimension | Phase A status |
|---|---|
| SOURCE PRESERVED | All 234 original package members and 19 prior-repository files remain; 35 recovered canon sources added with checksums. |
| CANON EXTRACTED | Partial. Existing summaries retained; source tables inspected/count-verified, comprehensive structured consolidation pending E. |
| RUNTIME READY | No. Species mapping/extraction B/C and portrait processing D are unfinished. This is processing work, not absent supplied art. |
| IMPLEMENTATION READY | No. Owner hold remains until preparation validation and Phase H review. |

Species source expectation: **187**. Individual species-to-art mapping verified in this phase: **0/187** (B has not begun). Runtime species assets: **0/187**. Portrait source images: **91**; package metadata accounts for **78/100** named targets, **one variant**, **five alternates**, **seven superseded images**, and **22 missing named targets**. Runtime portraits: **0**. Recheck canonical identity details in D.

Estimated overall repository-preparation progress: **30%**, a work estimate reflecting preserved structure/provenance and recovered sources, not a claim of data/art readiness.
