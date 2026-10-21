# Finale environment artwork — v0.90.18

All new scenery is bespoke raster pixel artwork produced using the built-in image tool. No SVG, CSS illustration or procedural placeholder is used for these backgrounds. Runtime files are optimized 768×512 WebPs covering the existing 48×32 tile map (16 px/tile); original generated PNGs remain in the generation output and are not copied wholesale into the APK. Full prompt set is recorded under `art-library/finale-v09018/environment-prompts.json`.

## Geometry checked against the rendered artwork

Coordinates below are **inclusive tile rectangles** `[xmin,ymin,xmax,ymax]`, conservative clear walkable strips, not requested prompt positions. The image model composed several paths at slightly different rows; navigation must follow the actual art. A narrower walkable strip is preferable to permitting sprites to walk on a rail, water or facade. Extra scene actors should stand on the listed floor; they must not block the sole passage.

| Runtime asset | Main crossing / entry | Conservative clear walkable rectangles and interaction notes |
|---|---|---|
| `env-road.webp` | west/east y21–22 | `[1,21,46,22]`; central north approach `[24,1,24,21]`; optional grass clearings `[9,16,15,19]`, `[27,18,39,20]`. Upper river crosses y7–12; only the center bridge at x23–25 is passable there. |
| `env-burial.webp` | west/east y21–22 | `[1,21,46,22]`, `[23,16,25,22]`, grave-front strip `[18,18,31,18]`. Grave markers are near `(20,15)` and `(29,15)`; approach/interact from y18. Oak body/canopy occupies upper center; rivers and outer cliffs are blocked. |
| `env-falls.webp` | west/east y13–14 | `[1,13,46,14]`. Pale bridge rails at about y12/y15 must remain blocked. River below and above the bridge is not floor. Northern shrine steps are decorative, do not add an exit unless its whole access path is authored. |
| `env-terraces.webp` | west/east y14–16 | `[1,14,46,16]`; optional central north approach `[23,1,25,14]` along stairs/gateway. Lower terraces contain disconnected paths divided by walls; block unless separately connected through their visible stairways. |
| `env-guan.webp` | west/east y14–15 | `[1,14,46,15]`, central forecourt `[17,10,31,17]`, shrine stairs `[23,6,25,10]`, south short bridge `[23,18,25,23]`. Shrine/altar is around `(24,5)`; guardian encounter can be staged on the forecourt `(24,10)` or stairs `(24,8)`, approached from below. The water below y24 is blocked. |
| `env-fei.webp` | west/east y14–15 | `[1,14,46,15]`. The timber deck itself is across x15–34. Northern pavilion is near `(40,5)`; its winding northeast approach can be decorative if not used. River and canyon are blocked. |
| `env-spore.webp` | west/east y14–15 | `[1,14,46,15]`; central platform `[21,12,27,16]`. All fungal canopy/abyss is blocked. Side path visible at left/right margins is decorative unless connected intentionally. |
| `env-darius.webp` | west/east y12–14 | `[1,12,46,14]`; central battle platform `[18,9,29,17]`. Use the stable octagon, not the broken bridge fragments far below. Upper/lower outside the octagon is ravine. |
| `env-cayfen.webp` | west/east y16–18 | `[1,16,46,18]`; north door paths `[9,11,10,16]`, `[37,11,38,16]`. Main central boulevard `[23,19,25,29]`. Southern facades were repaired with a targeted built-in edit. Continuous bottom promenade `[1,29,46,29]`; lower doorstep approaches `(10,28)` and `(38,28)`, reached from y29. Suggested lower gate/action cells `(10,27)` and `(38,27)`. Keep lower building bodies y21–27 blocked except doorstep action cells. |
| `env-ramelle.webp` | west/east y15–16 | `[1,15,46,16]`, central boulevard `[23,1,25,29]`, north door approaches `[12,10,13,15]`, `[36,10,37,15]`, lower door approaches `[12,27,13,29]`, `[35,27,36,29]`, bottom connecting lane `[2,29,45,29]`. Suggested gate/action cells north `(12,9)`/`(36,9)`, south `(13,26)`/`(36,26)`; stand one tile below. Keep water gardens and four building bodies blocked. |
| `env-gallery.webp` | south `(24,30)` | Central floor `[9,10,39,23]`, broad front strip `[8,24,40,25]`, south exit aisle `[23,26,25,30]`, artwork approach `[11,9,36,10]`. Six paintings are on the northern wall; interaction points can be at x13/17/21/26/30/34, y8, reached from y9; benches/wall behind them are not floor. |
| `env-fortress.webp` | south `(24,30)` | `[10,10,38,22]`, center aisle `[23,8,25,30]`, north dais `[19,3,29,6]`, linking stairs `[22,7,26,9]`. Leader can stand `(24,5)`; lectern occupies central tile near `(24,4)`. Water channels along walls are blocked. |
| `env-mirror.webp` | south `(24,30)` | Main floor `[10,15,38,24]`, central entrance aisle `[23,25,25,30]`, broad approach steps `[20,12,28,14]`. Mirror interaction at `(24,11)` approached from `(24,12)`. Mirror face, walls and side channels are blocked; do not let player walk into the glass or northern niches. |

The service-interior sheet supplies four dedicated rooms, rather than making the gallery double as a clinic. Each is independently cropped at the exact sheet quadrant and stored at 768×512.

| Runtime asset | Conservative clear walkable rectangles | Interaction guidance |
|---|---|---|
| `env-shop.webp` | `[12,12,37,21]`, `[22,22,26,30]` | North counter is y7–10; place service interaction at `(24,10)`, approached from `(24,11)`, not behind shelves. Central approach `[23,11,25,21]` links it. Side stalls, tables and north counter stay blocked. |
| `env-inn.webp` | `[15,11,33,24]`, `[23,25,25,30]` | Two northern beds and side sofas/tables stay blocked. Innkeeper at `(24,11)` can be reached from clear central carpet below. |
| `env-sanctuary.webp` | `[15,12,32,25]`, `[23,26,25,30]` | North altar stair `[22,9,26,12]`; Walter/service point `(24,11)` reachable from below. Side beds, couches, water basin and walls remain blocked. |
| `env-cayfen-hall.webp` | `[10,13,38,25]`, `[23,26,25,30]`, `[22,9,26,13]` | North leader dais `[21,6,27,8]` reached by central stairs. Leader around `(24,8)`; do not place him behind the lectern or inside wall niches. |

## Final artifact inventory

Seventeen optimized WebPs in `dist/assets/finale/`: road, burial, falls, terraces, guan, fei, cayfen, gallery, spore, darius, ramelle, fortress, mirror, shop, inn, sanctuary, cayfen-hall. Their total byte count and SHA-256 hashes are in the environment prompt manifest. All maps were inspected at full generated resolution before pixel-preserving normalization. Cayfen alone required a targeted lower-street geometry repair; the final selected map includes that repair.


## Source and identity review

Before generation: read `AGENTS.md`, the character catalogue, recovered-index README, and `archive/library-2026-10-20/README.md`. No new character identity was invented for environmental decoration, and environments deliberately contain no baked-in people or creatures so runtime actors retain canonical identity and can move independently.

Runtime integration: map collision is derived from the final raster composition. The checked navigation includes every gate, destination, door and interaction approach in the 23 new rooms. Five bespoke transparent pixel props mark the oath seals, bridge windlasses and field records. Existing catalogue creatures appear as living actors for both memorial partners and all five finale rarities.
