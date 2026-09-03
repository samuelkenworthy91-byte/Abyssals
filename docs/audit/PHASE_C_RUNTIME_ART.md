# Phase C — canonical runtime fronts

| Measure | Audited result |
|---|---:|
| Canonical species expected | 187 |
| Canonical identities mapped | 187 / 187 |
| Individual runtime front sprites | 187 / 187 |
| Original source sheets preserved | 89 / 89 |
| Unresolved canonical species artwork | 0 |
| Additional unlabelled illustrations preserved | 2, on Flaggrim.webp |
| Runtime canvas | 1024 × 1024 RGBA PNG |
| Runtime PNG bytes | 69,817,550 |
| Back/player sprites generated | 0 |

Every source sheet was inspected and every canonical cutout visually reviewed. The configuration records 415 larger enclosed white regions: 268 are background and 147 preserve artwork. Eleven additional small gaps were reviewed and removed on Galleonid, Thornelorn and Styxlet. Reviewed source labels/arrows are excluded; 27 floor regions use constrained shadow transparency. Pale-art exceptions and Pearlfrond’s pearls have explicit protection. Source pixels are not redrawn. Full body, tails, weapons/props, detached effects and intentional scenic bases remain.

`tools/art/species_extraction.json` and `tools/art/process_abyssals.py` reproduce the extraction. The manifest retains source SHA-256, runtime SHA-256, canonical ID/name, source figure position, bounding box, scale, offset and configuration checksum. See [ABYSSAL_ASSETS.md](../art/ABYSSAL_ASSETS.md) for the scale/padding convention and commands.

Integrity validation passes with zero errors. Source derivations pass. All 15 tooling tests pass, including interior-white preservation, edge-colour preservation and constrained shadow cleanup. Runtime checks require the correct canvas, nonempty transparency, safe padding, canonical identity, file checksums and extraction configuration. The canonical artwork unresolved list is empty.

The two far-right unlabelled Flaggrim illustrations remain supplementary source material. They are not counted as additional canonical species, assigned invented identities or used to replace a named figure. Regalisk’s type-strip discrepancy remains resolved in favour of the locked Dex; extraction removes the printed strip.

## Preparation status

- **SOURCE PRESERVED:** complete for all supplied archives and recovered reference sources.
- **CANON EXTRACTED:** species identity/base stats extracted; broader dataset consolidation remains Phase E.
- **RUNTIME READY:** Abyssal fronts complete; portrait processing remains Phase D.
- **IMPLEMENTATION READY:** not yet. Phases D–G and owner review remain required.

No M1 work, gameplay implementation or merge is authorized at this checkpoint. The existing preparation branch and PR #1 remain the review target.
