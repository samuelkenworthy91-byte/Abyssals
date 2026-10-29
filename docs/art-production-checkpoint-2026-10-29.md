# Animation and world-art production checkpoint

Work remains on draft PR #7 and `feature/v0.90.51-bespoke-moves-batch-01`. v0.90.50 remains the published fallback. No version bump, merge or release publication has been performed.

## Inventory and art decisions

The installed runtime contains 610 registered moves plus four engine-dispatched reactions: **614 usable IDs**. The 354-row original catalogue contains 29 retired save aliases; 325 original catalogue IDs remain registered. Aliases are recorded explicitly instead of being counted as separate usable attacks.

There are currently **99 dedicated sheets**, with 515 still missing. The original 63 effects and 22 detail atlases remain hash-protected, including Mercy. Fresh visual approvals cover 33 revised/new sheets. Three additional Fire sheets remain under revision for source-cell boundary defects; green technical tests do not approve those defects. The remaining protected original sheets await fresh review for the complete release.

The full per-ID inventory, current art hashes, acquisition candidates, mechanics metadata, visual decisions and evidence links are in [move-coverage.json](move-coverage.json). Source-file name matches are labelled as provenance candidates, rather than proof by themselves.

Six Sporefall environments have authored raster replacements and recorded source/phone/desktop/day/night visual approvals. All 25 late-game maps pass connectivity, gate-arrival, interaction-access and habitat-floor checks. Nineteen unchanged environments still await fresh visual sign-off. See [the environment audit](finale-environment-audit.md) and [machine-readable QA](finale-environment-qa.json).

## Verification completed locally

- All 43 JavaScript suites pass in a fresh complete run. [Results](../art-library/action-vfx/reviews-2026-10-29/js-suite-results.json).
- All 31 browser suite files have passed, including actual battles for each of batches 01–03, both opposing double slots, selected-owned-ally healing, the three priority effects in all eight leader layouts, reduced motion, asset decoding and command recovery. Two unrelated screenshot timeouts passed isolated reruns. Browser approval is not a claim of physical Android-device certification.
- The live counter test now observes move 790 actually being inserted into the battle effect surface after the incoming pixel animation.
- Finale tests cover the partner battle, both spare/execute outcomes, Hell Mirror flags and reload. Field quality, sightings, Fortified Ration, town interactions and the other available regression suites pass.
- Python game validation and Android manifest tests pass. Both raster audits pass, and every active finale background decodes.
- Release coverage gates correctly refuse the incomplete move and environment review inventories.

## CI and remaining production

The latest earlier GitHub run failed in the standalone item-review animation comparison: two canvas reads occurred in different animation frames. The test now samples both canvases in one browser call. Batch gameplay checks are split into discovered CI matrix jobs, rather than growing one long browser process.

Continue the artwork in small reviewed batches, repair every rejected source edge, retain source prompts and comparisons, and update the hash-bound review records only after inspection in actual battles. Finish all missing moves and the remaining environment reviews before versioning, merging and building the signed Android/PWA release through GitHub Actions with the original signing identity. This checkpoint records progress within the unfinished full commission.
