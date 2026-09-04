# Overworld Presentation

- Four cardinal movement directions only; no diagonal movement.
- Tile/logic grid is 16×16.
- Walk/run speed target band is 64–112 px/s.
- Moving off a map edge transitions to the adjacent authored map/screen in classic Pokémon/Dragon Warrior Monsters style rather than maintaining a giant seamless world.
- Checklist 17 owns exact overworld object movement, escort paths, NPC exits and map-object removal after story/fate scenes.

## Authority and structured data

Authority: Checklist 17. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/locations/world_routes.json`; `data/progression/core_rules.json`; `data/progression/locked_contracts.json`.

## Implementation contract and remaining boundary

Movement/object/escort/exit/removal contracts are recovered. Use fixed authored screens, one-tile steps/footprints, walk 4 and run 7 tiles per second, one forward interaction tile, straight cardinal trainer sight blocked by solids, and clear buffered input after modals. Actual per-screen geometry and paths still need authoring. Source art is not collision authority.
