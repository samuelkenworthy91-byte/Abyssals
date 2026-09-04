# Memorial Resurrection

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

## Authority and structured data

Authority: Checklist 07; Checklist 08; Checklist 15. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/progression/core_rules.json`; `data/progression/locked_contracts.json`; `data/save_schema/contracts.json`.

## Implementation contract and remaining boundary

The complete selection/confirmation and ledger contracts are recovered in Checklist 07 and indexed as LOCK-07 records. Validate living reserve ownership and ten distinct species IDs, then commit all sacrifices and exact-instance restoration together. Authored epitaph wording remains absent. A resurrected original starter has one life; bonus lives never regenerate.
