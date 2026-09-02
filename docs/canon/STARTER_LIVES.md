# Starter Lives

Authority: supplied handoff v1.0 ACTIVE_CANON sections 9. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

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

## Implementation boundary
Only original assigned individuals receive lives. Never grant lives by species alone or to captured/descendant members of those species. Persist life decrement and pending return in one transaction.
