# Bird wing corrections — v0.90.27

Audited all 54 members of the eighteen avian families, plus older bird and Flying artwork. Sixteen illustrations were edited individually with the built-in image generator, preserving the existing designs while removing duplicated folded wings or clarifying the joins of the spread wings. The old atlases remain available as source references; live artwork now selects standalone transparent WebP files.

| ID | Abyssal | Final runtime file |
| --- | --- | --- |
| 428 | Briarion | `dist/assets/bird-corrections/428.webp` |
| 431 | Tempestral | `dist/assets/bird-corrections/431.webp` |
| 433 | Pennantail | `dist/assets/bird-corrections/433.webp` |
| 434 | Valiantrel | `dist/assets/bird-corrections/434.webp` |
| 443 | Irontalon | `dist/assets/bird-corrections/443.webp` |
| 446 | Umbraive | `dist/assets/bird-corrections/446.webp` |
| 448 | Hushowl | `dist/assets/bird-corrections/448.webp` |
| 449 | Vespermourn | `dist/assets/bird-corrections/449.webp` |
| 455 | Dunelancer | `dist/assets/bird-corrections/455.webp` |
| 458 | Cairnaven | `dist/assets/bird-corrections/458.webp` |
| 464 | Venibis | `dist/assets/bird-corrections/464.webp` |
| 470 | Boreapuff | `dist/assets/bird-corrections/470.webp` |
| 472 | Wyrmkite | `dist/assets/bird-corrections/472.webp` |
| 473 | Dracorizon | `dist/assets/bird-corrections/473.webp` |
| 475 | Larkeen | `dist/assets/bird-corrections/475.webp` |
| 476 | Aurorark | `dist/assets/bird-corrections/476.webp` |

## Image editing brief

Each target was its existing isolated transparent atlas panel, inspected before editing. Prompt set: correct duplicated wing anatomy only; remove the extra folded wing from the visible flank beneath the spread wing and reconstruct the underlying torso feathers. Exactly two wings, one attached to each shoulder. Preserve face, anime eyes, crest, palette, markings, true tail, feet, overall pose and original outlined creature illustration style. Keep the whole creature uncropped on a genuinely transparent background. No labels, scenery, shadows or redesign. Tempestral instead needed its third lower-right spread wing removed. Irontalon needed its separate folded chest blade removed. Hushowl, Cairnaven, Venibis and Boreapuff received a second targeted edit to eliminate the remaining oval or teardrop-shaped flank patch completely.

Final files are alpha-preserving WebP images bounded to 768 pixels plus transparent padding. They are selected through `CORRECTED_BIRD_ART` after the original atlas map. Combat framing, summaries, field-guide portraits and overworld companions therefore share the correction. Shinies recolour those same files using the established family palette; there is no separate stale shiny sprite.

Species IDs, statistics, growth, abilities, moves, encounters, evolution conditions and save data are unchanged. This update retains the complete v0.90.26 Rivet armoury. Android uses the existing package, increasing version code to 122 and signing through the original GitHub Actions workflow.
