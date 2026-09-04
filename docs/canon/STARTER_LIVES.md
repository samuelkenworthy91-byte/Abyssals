# Starter Lives

Only the three original starter **individuals** (Aimon's chosen starter and the starters assigned to Pate and Trade) receive this system.
- Start with `starter_lives_remaining = 3`.
- A non-final lethal action decrements once per lethal action/KO event, never once per hit in a multi-hit action.
- Starter remains down for the rest of that round.
- In end-of-round cleanup, after normal end-of-turn layers but before battle-end/wipe classification, it returns at `max(1, ceil(max_hp × 0.10))` HP.
- Persistent battle status is cleared; PP, progression, training, evolution state and held item otherwise remain.
- If its action later in that round had not occurred, the action is lost.
- A pending non-final starter return prevents wipe classification.
- Lives progress 3→2→1; the next lethal loss takes 1→0 and causes normal permanent death.
- Life pips are visible in battle.

## Authority and structured data

Authority: Checklist 14; Checklists 13 and 15. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/progression/core_rules.json`; `data/progression/locked_contracts.json`; `data/save_schema/contracts.json`.

## Implementation contract and remaining boundary

Only original assigned individuals receive lives. Never grant lives by species alone or to later captures. Persist life decrement and pending return together. Resurrection of an original starter returns one life, never the original bonus-life pool.
