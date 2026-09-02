# Stats Growth

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
Exact initial stat construction, promotion jumps, rounding tie convention and complete exceptional-roll behaviour need the original locked stat specification. Do not choose language-default rounding or extrapolate >200% rolls without evidence.
