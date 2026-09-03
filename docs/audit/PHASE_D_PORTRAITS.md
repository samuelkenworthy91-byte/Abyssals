# Phase D — portrait production checkpoint

Baseline: accepted Phase A–C commit `08b82148532b7bb58dc022b0aad86ce1a675d1b9`. No species mapping, original monster art or runtime monster fronts were changed.

| Measure | Result |
|---|---:|
| Supplied source portraits preserved, checksum verified | 91/91 |
| Canonical supplied portraits processed | 78/78 |
| Form variants processed | 1 |
| Alternates retained as source references | 5 |
| Superseded portraits retained as source only | 7 |
| Runtime portrait PNGs | 79 |
| Canonical target identities represented | 78/100 |
| Genuinely missing targets | 22 |
| Unresolved active/alternate identities | 0 — none |
| Character identities in registry | 100 |
| Sourced trainer-class identities | 39 |

The seven superseded records intentionally have no active canonical identity: their old C03 labels/name combinations are retained as historical evidence and never loaded at runtime. The byte-identical Brann alternate remains preserved as an alternate, not a second character. Missing target IDs/names remain listed in `UNRESOLVED_ITEMS.md` and `data/manifests/portraits.json`.

## Source authority and identity

The recovered `ABYSSALS_Human_NPC_Portrait_Prompt_Manifest_v1.0.docx` supplies the 100-target queue (OOXML body table 1021), core/variant roles and portrait production instructions. Checklist 04 supplies 75 named trainer IDs, names and classes (tables at body indices 72–96) and the 39-class catalogue (body table 21). Per-record citations retain exact table/body/row positions.

Nharos's name and underworld-sovereign role are explicit in portrait-manifest body 70–75 and the recovered story/roster. `CHR-NHAROS` is the existing repository namespace applied to an established character, not invented canon; `CORE-007` remains its source queue alias. Severin's King Below image remains a form variant of CHR-SEVERIN.

## Processing and review

Reproducible processor: `tools/art/process_portraits.py`; reviewed configuration: `tools/art/portrait_processing.json`. Technical canvas: 2048×2048 RGBA, body span 1536, soles y=1920, body centre x=1024, padding >=64. All original proportions, figures and props retained. See `docs/art/PORTRAIT_PIPELINE.md` for commands and algorithm.

All 91 sources inspected. All 79 processed active outputs reviewed at consistent scale on light and dark backgrounds, with source/body-anchor comparisons and focused full-resolution checks. 860 enclosed candidate regions individually reviewed: 848 background removals, 12 retained colour regions. Captions removed without cropping connected feet; six constrained floor regions handle contaminated shadows. Final QA corrected one footer remnant and three boot-edge artefacts. A final exact key after resampling removes reserved magenta pixels reintroduced by rounding; it does not broaden the colour threshold.

Runtime PNG bytes: **125,301,639**. Source/runtime and configuration SHA-256 values are recorded in the manifest. Two focused source-to-runtime reruns (Aimon and Varo, including a corrected floor region) reproduce byte-identical final PNGs. Ordinary Git remains appropriate for this bounded snapshot; original sources and runtime assets remain separate.

## Validation and readiness

- Repository integrity/schema/reference/source/asset validation: **PASS, zero errors**.
- Source derivation checks: **PASS**.
- Automated tooling tests: **17/17 PASS**, including boundary cleanup preserving enclosed costume colours and caption-region protection of connected feet.
- Strict full-content readiness remains blocked by the 22 absent named portraits and unfinished Phase E data consolidation. No test was weakened.
- GitHub CI is checked after publishing this phase commit; final run links belong in the Phase F/G report.

**SOURCE PRESERVED:** complete. **CANON EXTRACTED:** portrait identities complete; wider game data pending Phase E. **RUNTIME READY:** all supplied canonical portraits and the variant, plus accepted 187 monster fronts. **IMPLEMENTATION READY:** not yet; M1 remains on hold.

Estimated repository-preparation progress: **70%**. Next: Phase E data consolidation, followed by F validation and G documentation/PR update, then stop for owner review. Do not implement gameplay or merge PR #1.
