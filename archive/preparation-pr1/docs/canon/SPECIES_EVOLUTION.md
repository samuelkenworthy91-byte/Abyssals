# Species Evolution

- 187 species are in the regional/project dex; the canonical front-facing species sprites are complete.
- 98 evolution paths.
- 100 XP per level.
- Participant XP scales using the participant's own level relative to the defeated enemy; do not award one shared level-gap result to all participants.
- Growth uses independent Fire Emblem-style stat rolls, seeded per individual.
- Mean Growth = `32 + 0.06 × (BST - 300)`.
- Mean Stat = `BST / 6`.
- Stat growth % = `max(10, round(Mean Growth × (BaseStat / MeanStat)^2.25))`.
- Growth over 100% allows deterministic exceptional +2 outcomes according to the locked roll logic.
- HP gains +10 per successful increment only; failed rolls add zero. No baseline or pity growth.
- Evolution applies fixed promotion jumps and reweights future growth; it does not retroactively reroll the individual.
- Wild growth is seeded/deterministic.

## Authority and structured data

Authority: Regional Dex/Growth/Evolution v4; Checklist 01; Checklist 11; Addendum; Checklist 13. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/species/species.json`; `data/evolutions/evolutions.json`; `data/evolutions/families.json`; `data/encounters/species_availability.json`.

## Implementation contract and remaining boundary

187 stable numeric Dex identities, 89 families and 98 paths are extracted: 75 level, 15 item and eight story-choice edges across four branch families. 183 species are available within a main-game save; the four opposite finals are postgame direct captures. Preserve historical branch decisions and current moves. Evolution applies signed target-minus-source base-stat deltas and no extra growth roll, then reweights future growth. Current HP preserves its percentage with half-up rounding and a living minimum of one. Per-species catch rates remain absent. All 187 individual runtime front sprites exist.
