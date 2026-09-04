# Locations

## Authority and structured data

Authority: World towns/routes reference v1.1; Story Bible; encounter areas; original handoff IDs. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/locations/locations.json`; `data/locations/world_routes.json`; `data/encounters/areas.json`.

## Implementation contract and remaining boundary

93 location records, 72 ecological areas and 25 authored world-reference sections preserve the route graph and settlement/route specifications. Technical LOC-* aliases are explicitly marked; retain original canonical area/scene IDs. Tile maps, collision grids, screen dimensions, doorway coordinates and trigger placement need authoring within that graph. LOC-JEROS survives only from the older handoff and lacks a locked-world counterpart; do not invent a Ramelle alias. See the exact unresolved record.
