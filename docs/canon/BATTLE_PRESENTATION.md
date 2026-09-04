# Battle Presentation

- Gen III-style damage/capture foundations are retained where specified by the design workbooks/checklists.
- First-person Dragon Warrior Monsters-style player viewpoint.
- Player active Abyssal is not rendered; enemy/wild front sprite is visible.
- Existing 187 front-facing sprites are sufficient; no canonical 187 back-sprite set is required.
- Both sides show HP bars plus small exact current/max HP numbers.
- Player attacks use move/type VFX travelling from the foreground into the enemy.
- Enemy attacks do not require reverse-direction move VFX: use enemy front-sprite motion, foreground/screen impact, a small damage number and HP change.
- Simultaneous KOs are batched. After pending starter-life resolution, mutual final KO with living reserve is player victory and requires rebuilding through Aeric; total wipe/leader aftermath follows Checklists 09 and 13.

- Capture is food-based, not ball-themed.
- Capture formula preserves the locked Gen III-style probability/shake foundation; food supplies the catch modifier.
- Presentation: thrown food, eating animation and a deterministic 0–100% closeness bar derived from the actual capture chance/RNG result. Success reaches 100%; failure stops below 100%.
- Capture outcomes cannot reroll after reload.

## Authority and structured data

Authority: Checklist 16, especially bodies 13, 47 and 93–98. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/progression/locked_contracts.json`; `data/manifests/abyssal_art.json`.

## Implementation contract and remaining boundary

Use the completed front sprites. Evolution is current sprite → brief flash → evolved sprite, followed by a separate six-stat signed promotion panel. Player-side/back sprites are unnecessary. Presentation consumes committed outcomes; it cannot alter RNG or transaction order. The approximately 40 authored farewell lines still require writing.
