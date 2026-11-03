# Hell Postgame

Warden fields are persistent, symmetric and active before Turn 1. Temporary field replacement may occur, after which the native field resumes according to the locked field system. UI must make the current field readable. The locked field identities include:
- Namefog
- Gilded Dust
- Blood Sun
- Iron Decree
- Twin Radiance
- Mourning Rain
- Cocytus Hail
- Quiet Night

The terrain specification also locks its special Rock Sp. Def and Ice Defence boost interactions. Do not silently replace these with standard Pokémon weather defaults.

## Authority and structured data

Authority: Checklist 05; Checklist 09 v1.1 bodies 54–61; Story Bible; world reference v1.1. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/terrain/fields.json`; `data/trainers/trainers.json`; `data/story/scenes.json`; `data/locations/world_routes.json`.

## Implementation contract and remaining boundary

All eight native field mappings/effects are extracted, including locked Rock Sp. Def and Ice Defence interactions. Nine Circles contain eight Wardens; executed mortal leaders form a separate conditional zero-to-eight gauntlet. Primeval Reach supplies opposite story-branch final-form captures; historical branch state never flips. Reordered Underworld is an authored postgame region. Exact upgraded leader rematch teams and tournament venue/rewards/rotation are explicitly deferred in Checklist 09; Illyr/Nharos phase numbers and Mirra timing also remain unresolved.
