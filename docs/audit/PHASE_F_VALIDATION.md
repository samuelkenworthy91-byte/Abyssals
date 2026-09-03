# Phase F — full preparation validation

Repository integrity and source reconciliation pass. Full-content readiness remains **BLOCKED**; the strict gate was strengthened and was not weakened to hide missing content.

| Check | Result |
|---|---|
| Species identities | 187/187 |
| Runtime front sprites | 187/187 |
| Evolution paths | 98/98 |
| Moves | 354/354 |
| Learnset entries | 1,893/1,893; all species/name/type/signature joins pass |
| Encounter tables / slots | 144/144; 864/864 |
| Trainer rosters / team slots | 95 / 370; exact source teams and evolution minima pass |
| Runtime portraits | 78 canonical + 1 variant; 22 targets remain missing |
| Detailed reference extraction | 35/35 source hashes and lossless contents match |
| Source preservation | 234 original archive members + 35 recovered references + 19 prior repository files pass checksum/size checks |
| Schemas, duplicate IDs, references, asset existence and checksums | PASS |
| Tooling tests | 24/24 PASS |
| Strict content readiness | BLOCKED: 93 reported failures, all CONTENT findings; zero integrity failures |

The 93 findings include nine dataset-level summaries and their exact underlying questions, four numeric source requirements, and the missing-portrait gate. They are not 93 missing files. The complete machine-readable output is `strict_readiness_result.json`; field-level source requirements are in `data/manifests/readiness_blockers.json`.

Phase F added full source joins to CI, integer move-reference checks, explicit resolver schema requirements, 354-move/144-table strict counts and tests. The final source comparison also recovered Checklist 17's 6/10/14-percent initial encounter tuning, eligible-step/Resonator rules and explicit movement contracts into core_rules.json. These percentages remain source-authorized tuning, not immutable canon.

The accepted A–C monster art and Phase D portrait assets/manifests are unchanged. No application/gameplay was implemented.

GitHub evidence at this checkpoint: Phase D run 33768994963 PASS; Phase E run 33771948984 PASS. Phase F and final-head CI are checked after publication and recorded in the final preparation report. CI's integrity job reports strict readiness separately; its green badge does not mean the strict gate passes.

Commands, with the tooling virtual environment active:

```bash
npm run validate
npm run validate:sources
npm run validate:reconcile
npm test
npm run validate:content
```

The final command intentionally exits nonzero until the documented full-content blockers are resolved. M1 and merging remain on hold for owner review.
