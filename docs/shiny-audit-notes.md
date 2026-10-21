# Shiny rendering audit — 21 October 2026

## Cause

The original `oppositeColours` shader preserves every alpha byte, but switches near-black pixels to near-white and near-white pixels to near-black. Its sharp cutoffs (`max-min <= 12`, `max <= 32`, `min >= 223`) make tiny source-colour differences become large output differences. For example, RGB (234,230,223) becomes (21,25,32), whereas nearby (235,228,222) becomes (222,229,235). This creates speckles, broken-looking outlines and apparent transparency holes without changing actual transparency.

A read-only raster scan of all 478 combat source panels, respecting atlas rectangles and clip rows, found 3,064,736 affected neutral pixels among 43,693,404 pixels with alpha at least 128 (7.01%). The share is particularly high for Whiflet (50.49%), Flurrip (47.38%), Chalkit (46.76%), Grailhare (42.00%), Sailswift (40.34%) and Caelynx (32.12%). These are inspection priorities, not evidence of source alpha damage.

## Rendering coverage

- The 478 catalogue species resolve to 838 distinct existing combat/follower source files. All 956 species/surface references exist.
- `combat-art.js` produces the framed shiny front used by battles, dialogue, most menus, rewards, evolution, move effects, the memorial, revival and finale actors.
- `companion.js` recolours directional follower sheets or a selected relic/bird atlas panel. Pass the same species/profile identity here and in combat art.
- Solmola's `381-wrath` is an extra combat form outside the 478 species count. Include it in tests and preserve its base family's colour direction.
- Relic/bird atlases use rectangles and optional per-row clip masks. Those masks exclude overlapping neighbouring silhouettes and must remain intact.
- Revised follower sheets override atlas use for IDs 361–363, 376–377, 380–381, 384 and 387–388. Ordinary sheets use two columns/four direction rows; Miasma sheets use three columns.

## Additional identity issue

`app.js` originally renders a shiny `combatArtSrc(u)`, then `normalizeSummaryArt()` reads only `data-summary-art` (a species ID) and replaces it asynchronously with normal `combatArtSrc(id)`. Preserve the unit's shiny and alternate-form identity in the normalizer. Affected call sites include the expedition list, partner summary, reserve and stewardship identity rows.

## Validation recommendations

1. Assert exact alpha-byte equality for every combat panel, every full follower sheet and the alternate Solmola form. Do not blindly fill enclosed transparency: anatomical gaps, detached effects and clipping masks are intentional.
2. Preserve black ink, pale highlights and low-chroma shading. Use smooth neutral/chroma transitions rather than another hard threshold. Test colour continuity across the old chroma-12, dark-32 and light-223 boundaries.
3. Keep a deterministic profile per family/explicit exception and use it on both front and follower assets. Cache by image plus profile, not image alone, when multiple profiles can share an atlas.
4. Check normal art is untouched; existing shiny flags, rarity rolls and save identity must not reroll or change.
5. Inspect representative montage pages on dark, pale and checker backgrounds. Prioritize the neutral-heavy species above, starters, armour branches, bird atlas clipping, semi-transparent effects, black/pale bodies and Solmola's two forms.
6. Browser-check a shiny partner across battle, conversation, summary and follower rendering; include asynchronous summary normalization and switching partners while artwork loads.

`build/shiny-source-manifest.json` is the generated scratch manifest for the full raster audit. It includes all species and the extra combat form with exact source file, atlas and follower-frame metadata; it is not a runtime asset.

## Implemented correction

All 478 species have explicit entries pointing to 215 shared family palette directions in `shiny-palettes.js`. Recolouring retains perceptual lightness in OKLab, smoothly protects neutral outlines/whites, and compresses chroma within the display gamut. Primarily neutral families receive a restrained midtone tint. Evolution relatives and Solmola's alternate form share the same palette direction. Existing shiny ownership and rarity rolls are unchanged. Normal source files remain untouched.

Combat portraits and followers pass species identity to the shared shader. Cached atlas variants are keyed by palette as well as source image, so unrelated creatures sharing an atlas cannot take one another's palette. Asynchronous summary normalization now retains unit/shiny/alternate-form identity.

Full validation: 957 surfaces and 60,428,159 visible pixels; zero alpha-byte changes, no empty silhouettes, all family palettes present, and maximum sampled OKLab lightness error below 0.008 (8-bit output quantization). The 24 comparison sheets cover all normal/shiny combat pairs, including the alternate form. Unit tests also exercise the old threshold discontinuities, structural black/white preservation, atlas cache identity, saved shiny flags and odds. Browser tests cover actual combat/follower canvases and asynchronous summary portraits.
