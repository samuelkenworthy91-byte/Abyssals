# Encounters

Authority: supplied handoff v1.0 ACTIVE_CANON sections 12. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

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

## Implementation boundary
data/encounters/areas.json preserves all 72 area summaries. data/encounters/tables.json contains 144 phase descriptors with null slots, not invented weighted tables. Level ranges are summary limits, not replacements for slot-specific levels or conditional resolvers. WRONG_SHIFT parameters/conditions are absent in the supplied handoff.
