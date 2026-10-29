# Sporefall environment visual audit — 29 October 2026

The six redesigned backgrounds have been inspected at source resolution with a 48×32 tile grid and in actual gameplay at 390×844 and 1280×900, day and night. Their artwork hashes, geometry hashes, approval rationales and evidence are recorded in [the machine-readable QA report](finale-environment-qa.json). All 25 late-game map connectivity checks pass; the other 19 maps retain their original artwork and still require a fresh visual sign-off for this release.

| Environment | Reviewed result | Before/after phone comparison |
| --- | --- | --- |
| Sporefall Rim | Warm town masonry opens onto colossal roots and a deep chasm; causeway, stele collision and old stair align. | [Comparison](../art-library/finale/reviews-2026-10-29/sporeRim-390-comparison.png) |
| Sporefall Depths | Layered underdark crossings, subdued fungi and narrow shrine stair; medic, field record and encounter remain accessible. | [Comparison](../art-library/finale/reviews-2026-10-29/sporeDepths-390-comparison.png) |
| Sporefall Bridge | Ruined crossing with separate abandoned army camps in the distance; northward stair connects to Crown of Roots. | [Comparison](../art-library/finale/reviews-2026-10-29/sporeBridge-390-comparison.png) |
| Sporefall Crown / Darius | Dragon mosaic dais, shrine and army remnants give the final confrontation its own identity. | [Comparison](../art-library/finale/reviews-2026-10-29/sporeCrown-390-comparison.png) |
| Moonpool Grotto | Recessed mineral pool and crescent terrace; return arrival corrected to the authored causeway. | [Comparison](../art-library/finale/reviews-2026-10-29/sporeGrotto-390-comparison.png) |
| Crown of Roots | Root-bound platform, hanging gardens and old shrines; collision routes around the central shrine. | [Comparison](../art-library/finale/reviews-2026-10-29/sporeCanopy-390-comparison.png) |

The automatic audit checks gate reachability, destination arrivals, adjacent interaction access and habitat floor membership. The raster audit decodes every active background. The capture suite waits for the game's actual background image to decode before capturing it; a blank raster cannot pass. These technical checks are separate from the recorded visual decisions.

Cayfen, Ramelle and the other established environments have not been repainted. Existing story flags, encounters, town services, capture parameters and save structures remain unchanged. This document records completed environment review work within an unfinished overall overhaul; it is not a release sign-off or Android-device certification.
