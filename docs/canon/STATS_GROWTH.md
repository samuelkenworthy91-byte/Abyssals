# Stats Growth

- 187 species are in the regional/project dex; the canonical front-facing species sprites are complete.
- 98 evolution paths.
- 100 XP per level.
- Participant XP scales using the participant's own level relative to the defeated enemy; do not award one shared level-gap result to all participants.
- Growth uses independent Fire Emblem-style stat rolls, seeded per individual.
- Mean Growth = `32 + 0.06 × (BST - 300)`.
- Mean Stat = `BST / 6`.
- Stat growth % = `max(10, round(Mean Growth × (BaseStat / MeanStat)^2.25))`.
- Growth over 100% allows deterministic exceptional +2 outcomes according to the locked roll logic.
- Checklist 01 is the sole growth authority: HP gains +10 per successful increment; a failed roll adds zero. There is no guaranteed baseline or minimum growth per level. See conflict C16.
- Evolution applies fixed promotion jumps and reweights future growth; it does not retroactively reroll the individual.
- Wild growth is seeded/deterministic.

## Authority and structured data

Authority: Checklist 01 bodies 18–30; Checklist 13 body 81. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/progression/core_rules.json`; `data/species/species.json`; `data/evolutions/evolutions.json`.

## Implementation contract and remaining boundary

Use nearest-half-up percentage rounding. At ≤100%, one deterministic roll grants at most one increment; above 100%, grant the first and roll the excess chance for a second. HP increments are +10 (double +20); other increments +1 (double +2). Zero successes is legal: no baseline or pity growth. Immutable instance growth seeds persist through evolution/death/restoration. Exact level-1 initial stat construction still requires confirmation; do not call recovered promotion/rounding rules missing.
