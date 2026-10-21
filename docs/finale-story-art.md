# Finale story and character artwork — v0.90.18

Production: built-in image-generation tool; bespoke raster pixel art, no SVG or vector stand-ins. Only optimized selected WebPs enter `dist/assets/finale/`. Full-resolution generation outputs remain outside the runtime. Source identity references are existing repository artwork.

## Catalogue review

Reviewed `AGENTS.md`, `docs/botrune-story.md`, `art-library/characters/reference/CHARACTER-CATALOG.json`, recovered `CONFIRMED_ID_INDEX.csv`, `CONTENTS.csv`, `MISSING_TARGETS.txt`, recovered-index README, and `archive/library-2026-10-20/README.md`. The curated catalogue and searchable historical indexes contain no confirmed LDR-07 / LDR-08 or Oren / Lucain illustration. Their stable current identities are Marshal Ibrahim ibn Ahmad and Hierophant Hasan ibn Ibrahim, so new illustrations are appropriate rather than borrowing a mismatched trainer's portrait.

## Selected art and prompts

- `leader-07.webp`: new full-body transparent pixel battle figure for Ibrahim. Prompt specifies a Middle Eastern marshal about 45, olive complexion, short dark beard threaded grey, dark hair and narrow ochre turban, sandstone-gold cape, teal lamellar armour, ivory linen, boots and sheathed curved sword. A drawing roll at his belt links the veteran commander to Cayfen's architecture and artists. Calm but authoritative, open hand, complete head-to-sole figure, deliberate stepped pixel contours and clustered 32-bit shading, no text or floor.
- `leader-08.webp`: new full-body transparent pixel battle figure for Hasan. Prompt specifies a dignified Middle Eastern man about 60, strong nose, silver beard, white linen headwrap and slender gold circlet, layered alabaster/opal/gold robes and light armour, full boots, ivory folio and slender ceremonial staff with opal lattice. Quietly compassionate and capable, a distinct silhouette from Ibrahim, deliberate pixel clusters, no text or floor. The existing Fairy/Dragon Serapine remains a separate canonical creature asset.
- `story-burial.webp`: landscape pixel cutscene. Supporting identity references are `dist/assets/CHR-AIMON.webp` and `CHR-AERIC.webp`. Prompt preserves Aimon's brown hair, teal cloak and cream clothes and Walter's brown hair/stubble and navy/cream robes, under an enormous flowering tree beside a sunlit stream. Two fresh closed graves with plain wooden markers, friendship cord and closed notebook. Aimon kneels; Walter stays beside him. Only these two living people appear: no living or ghostly Pate/Trade, no resurrection lights, no text, no gore. Sombre warmth, clustered pixels and dithered sunlight.
- `story-darius-cruxwyrm.webp`: landscape pixel confrontation. Supporting references are `REV-DARIUS-STORM.webp` and species `174.webp`. Prompt preserves Darius's brown hair, beard, torn red scarf, dirty ivory tunic and wooden staff, now cold and exhausted. Cruxwyrm retains its navy/silver quadrupedal armour, blade tail and cathedral-blue stained-glass wings. The setting is Sporefall Chasm: giant bracket fungi, pale hanging roots, luminous spores, smashed crossing and distant dark pools. Abandoned white/gold and navy banners indicate both factions' retreat. No eastern-dragon substitution, captions, interface or gore.
- `gallery-water.webp`, `gallery-fire.webp`, `gallery-steel.webp`: produced as three exactly equal, separately cropped columns of a bespoke pixel-art source sheet. Water: turquoise river spirals and flowering trees, an expressive flowing composition. Fire: amber/orange sunlit city terraces and foliage in an ember-dappled mosaic. Steel: precise silver/indigo/opal star lattice and peaceful white dragon silhouette among facets. Each is a distinct Abyssal-made painting with square brush clusters and deliberate dithering, no lettering or generated signatures. Runtime frames and artist attribution are supplied separately.

Images were requested in a purposeful high-end 32-bit JRPG pixel-art style, with crisp stepped shapes and material detail rather than soft vector or anime painting. Transparent figures require genuine clean alpha.

## Optimized runtime inventory

| Asset | Dimensions | Bytes | SHA-256 |
|---|---:|---:|---|
| `leader-07.webp` | 512×768 | 407,908 | `9f0618534737709ceb93786e8224d5318aa186ef1189aac46120acbeeef5d795` |
| `leader-08.webp` | 512×768 | 488,314 | `5a5b43ef40654949ded7106bdaafc8a8b0ad2d8625f417fbaf652c545bb178bb` |
| `story-burial.webp` | 1536×1024 | 671,432 | `3607f99ba7d37a8be4832c3c238656a658ecbde980e81ab29ff6dce35a1015bd` |
| `story-darius-cruxwyrm.webp` | 1536×1024 | 736,574 | `eb42b97bb5321896f58245d8b602e421d10f9928f921b3f15b47caf509c06327` |
| `gallery-water.webp` | 512×1024 | 295,912 | `fd15a30953ea2c83892580c3d723b289b00f25aa5ffe4907b3fcf1c6543fbfa8` |
| `gallery-fire.webp` | 512×1024 | 270,620 | `301fa0bd61b2e0a48a434497ed41b2f63f8ba7ce24779e7bd9f6eb3db42d786b` |
| `gallery-steel.webp` | 512×1024 | 288,896 | `d34bab8641de342cc25a855a7ba9e1f61bd825d7ef4642493d3fdf5447d9d3ec` |

Visual QA: checked all five generated source images, including exact three-column gallery boundaries; both leaders have complete head-to-sole silhouettes and transparent corners. Burial contains only Aimon and Walter living beside two closed graves. Cruxwyrm retains the canonical stained-glass Western dragon identity. Compression and gallery extraction preserve the selected composition; no SVG was created.

## Final Darius full-body runtime portrait

`darius-final.webp`: built-in image-generation identity-preserving revision using the approved pixel confrontation panel and canonical `REV-DARIUS-STORM.webp` as references. Prompt: isolate only the man Darius, full head-to-boot figure and wooden staff, exhausted hollow-eyed furious face, tangled brown hair/stubble, ragged red scarf, filthy torn ivory tunic, patched dark trousers, leather crossbelts/pouches and worn boots; staff in one hand and the other fist closed. Preserve the approved pixel-art likeness and old canonical equipment, with deliberate square clusters and stepped edges. No legendary, scenery, glow, floor, lettering or Poké Ball; genuine clean transparent alpha. Generated1024×1536, normalized by exact half-size nearest-neighbour to512×768 and encoded lossless WebP. Inspected whole figure and verified zero-alpha corners.

Runtime size: 466,754 bytes. SHA-256: `7f8793536197bde7c092c92a5832a594ba22aefc921ab6e6aca6ea847586f8b9`. Root runtime integration may copy this selected image to `assets/REV-DARIUS-FINAL.webp` for the existing character resolver.

## Quest mechanism pixel props

Built-in image generation produced one transparent five-prop pixel-art source sheet. Prompt: five isolated top-down three-quarter JRPG props in a horizontal row, deliberate32-bit pixel clusters, complete objects, no scenery or labels: three short mossy grey shrine stelae with gold shield (shelter), joined hands (faith), and arched bridge (crossing) pictograms; a wood/bronze bridge windlass with rope spool, crank and coiled rope; a low gold-bordered old stone inscription plaque with abstract non-letter runes. The selected2161×728 source has five disconnected alpha silhouettes. Each is extracted, fitted with nearest-neighbour scaling and transparent margin to96×96, then losslessly encoded. No SVG. Checked symbol order and transparent corners.

- `prop-rune-shelter.webp`:96×96 RGBA, 11,560bytes; SHA-256 `6713c8b186c55cc38efd2715d7449efbcb4d5751faf2c6220d7a316439516d1d`.
- `prop-rune-faith.webp`:96×96 RGBA, 11,720bytes; SHA-256 `792a78c79fd8bbd6654ed1c5370f348e3f99b8c915fac5a13bea56f3c15436f2`.
- `prop-rune-crossing.webp`:96×96 RGBA, 11,602bytes; SHA-256 `517882d5944cb21d6a4c7a68ce5aea80950e7c1200b00ede8edc110b06fc79eb`.
- `prop-windlass.webp`:96×96 RGBA, 10,430bytes; SHA-256 `cbd850fb891e9821540e8478ceb22980d6389873abd7bae27136cf6f028c9dd1`.
- `prop-inscription.webp`:96×96 RGBA, 11,436bytes; SHA-256 `d134da6d91a5846de99f04bf91725643e3ce0f8d6701194f7d404738d0c3d273`.
