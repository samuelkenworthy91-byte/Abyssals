# Encounters

- Linear critical spine with local branching and optional areas.
- First travel is manual. Paid carriage fast travel unlocks between discovered settlements; couriers are thematically equivalent but individually presented.
- Free backtracking; no HM-style traversal requirements.
- Personal watercraft/Wayfarer Skiff after Philomere unlocks water/backtracking routes.
- Day/night changes every **10 real-time minutes**. Hell uses PALE/DARK mechanically equivalent phases.
- Encounter tables are authored, location-levelled and never dynamically scaled to the player's party.
- Current encounter workbook: 72 areas × 2 phases = 144 tables, six slots each, 100% total weight per table.
- Encounter frequency bands: LOW ≈6%, NORMAL ≈10%, HIGH ≈14% per eligible step (engine tuning may change frequency, not table composition).
- Safe settlements, rest/shop/dialogue thresholds, active puzzle interactions and cleared boss arenas suppress random encounters.
- Starters, Watchers, box legends and mythics are excluded from ordinary random encounters. Fossils use authored main-game restoration and postgame Primeval wild populations.
- WRONG_SHIFT remains a rare authored anomaly category.

## Authority and structured data

Authority: Checklist 02 completed workbook; world/encounter references v1.1; Checklist 17. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/encounters/areas.json`; `data/encounters/tables.json`; `data/encounters/acquisition.json`; `data/encounters/species_availability.json`.

## Implementation contract and remaining boundary

All 72 areas, 144 tables and 864 weighted slots are extracted: 856 direct species slots and eight conditional resolver slots. Every table has six slots totalling 100%; per-slot levels and source provenance are preserved. Thirty-one special acquisition/resolver contracts and availability for 187 species are indexed. Check only eligible completed steps; no checks on wall bumps, turning, menus, dialogue or warp entry. WRONG_SHIFT is named in the old handoff but its authored trigger/rate/resolver is not provided.
