# Art Direction

**True Light:** white/European medieval-crusader-inspired humans; cool blue, white/ivory, silver/weathered steel, navy; sparse gold.

**Dawn Bloom:** grounded Middle Eastern/West Asian-inspired fantasy clothing and appearance; deep violet/plum/aubergine, cream/sand, brass/gold, restrained teal.

Human/NPC source portraits are full-body, standalone, head-to-toe, clean 2D anime/JRPG concept art on pure `#FF00FF` magenta with no text or scenery. One requested portrait must equal one image generation; never combine requested portraits into a collage/contact sheet.

- 187 species front sprites: completed project source set.
- Human/NPC portrait production manifest: 100 unique named targets + 39 reusable class templates.
- Portraits serve dialogue and pre-battle/send-out presentation.
- Environment/location art is a separate production pass.
- Human portrait cleanup follows the reproducible, visually reviewed body-scale convention in ../art/PORTRAIT_PIPELINE.md.

## Authority and structured data

Authority: Checklist 16; human portrait manifest; owner production-art instructions. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `assets/abyssals/runtime/`; `assets/portraits/runtime/`; `data/manifests/abyssal_art.json`; `data/manifests/portraits.json`.

## Implementation contract and remaining boundary

All 187 monster fronts and 78 canonical portraits plus one variant are runtime ready. Portraits use a 2048×2048 transparent canvas, crown-to-soles body height 1536 px, soles Y=1920 and body centre X=1024. Full props are retained with uniform aspect-preserving scaling. Exact magenta and reviewed edge-connected near-magenta contamination are removed; interior pink/purple colours remain. Five alternates and seven superseded portraits remain source-only. See ../art/PORTRAIT_PIPELINE.md and ../art/ASSET_STORAGE.md. Twenty-two canonical portrait targets are genuinely absent; environment, overworld, UI, VFX and audio production remains future work.
