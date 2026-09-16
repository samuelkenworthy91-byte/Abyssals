# Assets — Provisional

Per task §6:
- Reuse existing canonical artwork wherever available — none present in handoff (187 species sprites and 100+ portraits in ChatGPT File Library per README_FIRST, not embedded)
- Never redraw existing Abyssal or canonical character for convenience
- Missing environment art: created coherent provisional production-quality environment set following documented visual direction
- Keep modular and replaceable: gameplay/map data separate from rendering/environment assets

## Current provisional assets

### Environment
- Tileset generated procedurally in mapRenderer.ts:
  - ground: worn earth/stone #3a352d with noise
  - path: irregular worn stone #5a564f
  - grass: #2d3a2d with small blades
  - house_wall: plaster #d8c8b0 + timber #4a3728, worn
  - roof: old thatch/slate #3d352a
  - well: stone #5a5a5a with dark interior
  - shrine: True Light ivory #e8eef8 + royal blue #2a4a8a + silver #c0c8d8, restrained
  - tree: dark #1a2a1a with canopy #2a4a2a

Visual direction: lived in, grounded, slightly austere, old, religious without fantastical, recognisably part of True Light crusade. True Light visual language blue/white/silver/navy used for faction presence (shrine, Kurg, important NPCs) rather than painting entire village blue.

### Characters
- Player: muted blue #4a6a8a, head #e8d8b8, shadow, direction indicator
- NPCs: important #6a8aba (True Light blue), ordinary #8a7a6a (earth), head #d8c8a8
- Portraits: provisional 128x128 canvases, grounded proportions, not chibi, clean cel shading, following ART_DIRECTION spec (full-body, head-to-toe concept, magenta #FF00FF source cleaned). Production canvas provisional 128px for dialogue, not final 512.

### Abyssals
- Bramblekin: bramble/moss #3a4a2a + thorns #5a6a3a
- Emberling: hearth embers #4a2a1a + flame #ffaa44
- Tidemaw: mere water #2a4a5a + #4a6a7a
- Hollow Hound: lean feral #3a3a3a + eye #5a3a3a
- Gloam Mite: shadow #2a2a3a + legs #4a4a5a

Battle presentation: first-person DWM-style, enemy front-facing only, player active not rendered as back sprite (per ACTIVE_CANON §6 and task §13). Player attacks VFX foreground->enemy, enemy attacks via sprite lunge + screen impact + damage number + HP decrease.

All provisional assets are modular and replaceable via mapRenderer.ts and battleUI.ts without rebuilding Civeton scripting.

## Replacement path
When canonical 187 front sprites and portrait manifest are imported:
- Place species sprites in assets/production/abyssals/
- Place raw portraits in assets/generated/characters/ (magenta #FF00FF background)
- Run tools/process_portraits.py to clean and place in assets/production/characters/
- Update species.ts loader to use real IDs and stats
- Map renderer and battle UI will automatically use new sprites if loader provides sprite_key mapping
