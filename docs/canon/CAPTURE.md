# Capture

- Capture is food-based, not ball-themed.
- Capture formula preserves the locked Gen III-style probability/shake foundation; food supplies the catch modifier.
- Presentation: thrown food, eating animation and a deterministic 0–100% closeness bar derived from the actual capture chance/RNG result. Success reaches 100%; failure stops below 100%.
- Capture outcomes cannot reroll after reload.

## Authority and structured data

Authority: Checklist 06 food table; Checklists 13, 15 and 16. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/items/items.json`; `data/progression/core_rules.json`; `data/save_schema/contracts.json`.

## Implementation contract and remaining boundary

All eight foods and their conditional catch modifiers are extracted in items.json. Capture consumes the selected food and commits result, instance and party/reserve destination atomically. The per-species catch-rate table and exact versioned capture/shake numeric binding remain unresolved. Failure-bar presentation must consume the same committed outcome, never a second gameplay roll.
