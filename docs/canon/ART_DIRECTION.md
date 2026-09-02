# Art Direction

Authority: supplied handoff v1.0 ACTIVE_CANON sections 3, 17. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

**True Light:** white/European medieval-crusader-inspired humans; cool blue, white/ivory, silver/weathered steel, navy; sparse gold.

**Dawn Bloom:** grounded Middle Eastern/West Asian-inspired fantasy clothing and appearance; deep violet/plum/aubergine, cream/sand, brass/gold, restrained teal.

Human/NPC source portraits are full-body, standalone, head-to-toe, clean 2D anime/JRPG concept art on pure `#FF00FF` magenta with no text or scenery. One requested portrait must equal one image generation; never combine requested portraits into a collage/contact sheet.

- 187 species front sprites: completed project source set.
- Human/NPC portrait production manifest: 100 unique named targets + 39 reusable class templates.
- Portraits serve dialogue and pre-battle/send-out presentation.
- Environment/location art is a separate production pass.
- Human portrait cleanup must remove exact magenta, crop/align consistently and place figures on an agreed uniform production canvas before runtime use.

## Implementation boundary
Source asset authority does not imply runtime readiness: 89 monster sheets and 91 portrait images were supplied. Runtime cleanup removes ONLY exact #FF00FF. No fuzzy pink/purple deletion. See docs/art/PORTRAIT_PIPELINE.md for the selected technical canvas and the current processing blockers.
