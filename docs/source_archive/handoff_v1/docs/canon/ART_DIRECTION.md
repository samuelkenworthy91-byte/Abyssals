# Art direction and production rules

## Abyssals
The game already has 187 front-facing Abyssal species sprites. Battle camera design deliberately avoids needing a full canonical back-sprite set.

## Human/NPC portraits
- Detailed 2D anime/JRPG fantasy concept art; crisp linework, controlled cel shading, grounded proportions; not chibi and not photorealistic.
- Full body, head-to-toe, all props inside frame, front or slight 3/4 neutral standing pose.
- Source background: pure `#FF00FF`, no scene/floor/frame/shadow/text/logo/UI.
- One named target per image generation.
- True Light and Dawn Bloom faction language is locked in `ACTIVE_CANON.md`.

## Runtime asset processing
1. Keep raw generation unchanged under `assets/generated/characters/`.
2. Remove exact/near-exact source magenta deterministically.
3. Crop to opaque bounds with consistent padding.
4. Scale by figure height, not raw source-canvas size, so characters read at a consistent in-game scale.
5. Centre on the agreed production canvas without stretching.
6. Save lossless PNG to `assets/production/characters/`.
7. Validate alpha, dimensions, filename/ID and visual framing.

The production canvas dimensions are deliberately **not** invented in this handoff; approve them after a representative portrait batch is measured.
