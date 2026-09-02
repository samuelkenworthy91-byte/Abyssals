# Species Evolution

Authority: supplied handoff v1.0 ACTIVE_CANON sections 4. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

- 187 species are in the regional/project dex; the canonical front-facing species sprites are complete.
- 98 evolution paths.
- 100 XP per level.
- Participant XP scales using the participant's own level relative to the defeated enemy; do not award one shared level-gap result to all participants.
- Growth uses independent Fire Emblem-style stat rolls, seeded per individual.
- Mean Growth = `32 + 0.06 × (BST - 300)`.
- Mean Stat = `BST / 6`.
- Stat growth % = `max(10, round(Mean Growth × (BaseStat / MeanStat)^2.25))`.
- Growth over 100% allows deterministic exceptional +2 outcomes according to the locked roll logic.
- HP receives +10 baseline per level in addition to its roll behaviour.
- Evolution applies fixed promotion jumps and reweights future growth; it does not retroactively reroll the individual.
- Wild growth is seeded/deterministic.

## Implementation boundary
Only four story-choice evolutionary families are branch-locked during the main campaign; opposite branches become available postgame through Prime Archive/approved resolver (Checklist index #11). Family membership, exact 187 IDs, stats, ability rolls and all 98 evolution paths require absent workbooks. Artwork labels do not establish Dex IDs. The supplied ZIP has 89 labelled sheets, not 187 isolated runtime files.
