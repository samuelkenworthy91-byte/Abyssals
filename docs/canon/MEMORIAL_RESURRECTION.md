# Memorial Resurrection

Authority: supplied handoff v1.0 ACTIVE_CANON sections 10. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

- Civeton memorial is absent at game start.
- First permanent Abyssal death creates pending establishment; memorial appears on the next Civeton revisit and stays thereafter.
- Visible Abyssal memorial contains only currently dead/unresolved Abyssals; restored individuals are removed from the visible list.
- Dead-instance data preserves identity, species, nickname, level/XP, growth seed, exact stats, ability, current four moves, evolution history, active training effects, death place/chapter/order and sprite/form key.
- Epitaphs are deterministic authored-template results; no runtime generative text.
- Resurrection restores the exact original individual at full HP/full PP/no status.
- Cost: exactly **10 living Abyssals of 10 different Dex/species IDs** permanently sacrificed.
- Duplicate species cannot both count toward one resurrection. Money/items/Trial Marks cannot substitute.
- Starred/favourite and starter sacrifices are legal but require stronger warnings.
- Sacrificed Abyssals are permanently deleted and never enter the memorial.
- Held items return to inventory on death and are not duplicated on resurrection.
- Resurrected target returns to party if there is room, otherwise reserve.
- Human memorial is separate and historical; humans are never resurrected through the Abyssal memorial.

## Implementation boundary
Selection must be validated against living reserve ownership and ten distinct species IDs. Never infer missing epitaph templates. Exact sacrifice selection interaction requires the original locked checklist.
