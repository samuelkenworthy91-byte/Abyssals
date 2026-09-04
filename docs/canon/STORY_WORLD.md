# Story World

Abyssals is an original monster-capture RPG. The mortal route moves through a linear critical spine with local branches, from England-like crusader territory toward the Holy Land, then descends through nine Circles of Hell. Themes concern individual moral decisions, the way organised religions divide similar people, and the indifference of gods. The game never exposes a single good/evil or morality score.

Target progression: approximately level 100 by the final mortal leader and level 200 by the end of Hell/postgame. Hard level cap: **200**.

## Authority and structured data

Authority: Locked Story Bible; Checklist 10; Checklist 09 v1.2 overlays. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/story/scenes.json`; `data/story/chapters.json`; `data/story/state_contracts.json`; `data/locations/world_routes.json`.

## Implementation contract and remaining boundary

150 stable event records (146 CH scenes plus four WLD choices), 24 chapters and 109 state contracts are extracted. Source prose remains an authoring specification; final conditional spoken scripts, executable event actions and map trigger bindings are not supplied. Apply state translations and elective-restoration overlays before implementing older Story Bible staging.
