# ABYSSALS — FULL ARTWORK COMPLETION & RELEASE HANDOFF
## Target v0.90.51 (or next free version) · 28 October 2026

**Repository:** `samuelkenworthy91-byte/Abyssals`
**Last VERIFIED signed release:** `v0.90.50` from main commit `98f789b4c6993a91409b14bacfb03521370b66d7` (Android `version_code: 145`).
**Active development:** `feature/v0.90.51-bespoke-moves-batch-01`, PR #7 (DRAFT). Check current branch/run status before starting; do not assume prior CI has passed.
**Platforms:** signed Android APK and offline PWA ZIP.
**Primary command:** Own the implementation, exhaustive artwork audit, visual revision, regression testing, merge and VERIFIED signed release. Do not stop at a plan, sample batch, or test-only result. Do not claim publication until the new GitHub Release actually contains its APK, PWA, checksum files and signing verification.

## A. Verified facts and problems

1. The `v0.90.50` patch **is published**: corrected double-battle UI, revised Sporefall routes, Field Journal side-habitat rumours, Fortified Ration, Cayfen/Ramelle errands and post-Hierophant Hell Mirror sequence. Maintain it as the stable fallback. The release pipeline's Android test, browser, sign/verify, publish and PWA jobs succeeded.
2. The main `DATA.moves` list has **354** moves. Of the **63 original dedicated pixel-action sheets**, only **6** are keyed to those 354 canonical move IDs. There were therefore **348** main-catalogue moves lacking dedicated sheets, NOT 291. Draft PR #7 adds **12** new canonical sheets, taking the candidate to **75 total/18 main-catalogue covered**, leaving **336 main-catalogue moves** still lacking sheets. Enumerate **all other runtime-registered move sources** (expansion, hidden, special, boss, paladin, tactical, etc.) as well; the 336 number is NOT a complete all-runtime total.
3. The twelve batch-01 PNGs are a **first pass, not art sign-off**. I directly examined their real 4×4 sprite sheets against the richer existing `790-stillwater-threefold-answer.png`. `59-jaffa-breaker.png` is mostly a simple jar and blue arrow; `98-oathkeepers-edge.png` is a very schematic sword; `352-benevolent-bloom.png` has largely repeated flat floral shapes. They lack texture, scale change, actual contact, aftermath, silhouette polish and frame-to-frame motion. Redraw/refine them rather than treating correct 768×768 dimensions as quality.
4. Cayfen and Ramelle have richly painted, densely detailed 960×640 pixel-world art (`dist/assets/finale/env-cayfen.webp` and `env-ramelle.webp`). In contrast the Sporefall replacement assets `env-spore-{rim,depths,bridge,grotto,canopy}.svg` are procedurally/geometrically composed and not yet in the same art direction. Visually compare with the towns in a real rendered map, not only source file validity.
5. PR #7's earlier Action checks failed because `tests/action-vfx-browser.cjs` hard-coded 63 sheets. A subsequent branch commit changed the assertion to 75 and added new animation screenshots. **Check the actual latest CI conclusion and logs**: a fix committed is not equivalent to a passing workflow.

## B. NON-NEGOTIABLE VISUAL DIRECTION

Match the existing hand-crafted pixel-art world: detailed surfaces, purposeful colour clustering, depth, architecture, vegetation, readable silhouettes, atmosphere and restrained but meaningful lighting. **Do not merely enlarge pixel squares, recolour a standard animation, overlay a dark filter, or repeat the same geometric background in different palettes.** The user wants MORE authored source detail at the current appropriate on-screen size, not physically bigger effects. Preserve approved original Mercy artwork and timings and other existing approved art.

### Sporefall, routes and last two towns

Audit every traversable screen in `SUN_ROAD` and `SPORE_ROAD`: Willowmere sunBank/burialGrove/sunFalls/sunTerraces; Sporefall sporeRim/sporeDepths/sporeBridge/sporeCrown; optional sporeGrotto and sporeCanopy; gates into Cayfen and Ramelle; relevant fort, sanctuary and final mirror transition. No empty, default or visibly lower-quality backgrounds. Compare against both towns and the best original route environments at 390×844 Android size and desktop.

**Art arc:** Cayfen's beauty and ordered tiled sunlight gradually give way to a colossal, living *underdark*: tangled root buttresses, layer upon layer of roots between cliff walls, fungal growth, wet ancient stone, deep sinkholes, glow from spores and underground water, old shrines, frayed banners and abandoned equipment, shafts of muted light, massive depth and ominous negative space. It must be both beautiful and increasingly sinister, not simply muddy, pitch-black or generic fantasy cave.

Give each screen its **own composition and landmark**:
- Sporefall Rim — giant root-bound entrance/crossing, remaining daylight above the chasm.
- Sporefall Depths — dense lantern shelves, stacked fungal ledges and dangerous vertical drop.
- Sporefall Bridge — broken traversable battle-scarred crossing and visible consequences of two companies' conflict.
- Sporefall Crown — a dramatic, unique Darius/Cruxwyrm climax backdrop.
- Moonpool Grotto — distinctive luminous water, reflections and dark mineral roots, a coherent optional habitat.
- Crown of Roots (canopy) — cathedral-sized intertwined roots and fungal high canopy with thin light through the darkness.
Keep coherent light direction, perspective, path width, scale and continuity from one map to the next. Create **final authored raster assets** (or rasterise carefully drawn art) matching the existing 960×640 map and pixel aesthetic, and remove synthetic/repeated-looking placeholder scaffolding as appropriate.

**Gameplay alignment:** the rendered traversable surface must match `48×32` tile geometry, `finaleWalk`, `finaleSolids`, `gates`, `spots`, `grass` and `sidePaths` in `dist/finale-world.js`/world drawing. Do not paint beautiful doors, bridges or exits that the player cannot access. Keep grass encounters, side routes, NPCs, readable text, scene transitions and Field Journal habitat metadata synchronized. Re-run `scripts/build-journal-habitats.mjs` and commit its exact generated output if routes or encounter maps change.

## C. COMPLETE EVERY MOVE ANIMATION, NOT JUST TWELVE

1. Generate a deterministic, authoritative inventory of all **actual playable move IDs** and source modules (including the 354 `DATA.moves`), current art origin, frames, animation type, status/physical/special category, whether self-target or foe/ally/field-target, hit count/interrupt edge cases, and screenshot-based art quality. Produce a maintained machine-readable coverage table. Avoid double-counting IDs and distinguish name variants from distinct gameplay moves.
2. Catalogue all IDs already with unique, approved art; preserve those protected assets and their hashes. For EVERY missing or unsatisfactory move, create a genuinely authored scene and transparent PNG sprite sheet at least **16 frames/4×4, 192×192 logical source pixels each, 768×768 total** unless a better technically supported format has explicit tests and evidence. No duplicating/recolouring one common effect as fake unique coverage. Register every ID uniquely and keep the offline asset manifest correct.
3. Each move's imagery must explain **what it actually does**, not just its type. Build specific anticipations, trajectories, impact points, material response, particle/fragment shape, contact follow-through and recovery. Water slash ≠ flood; sword thrust ≠ claw rake; a support barrier ≠ an attack; a self-buff ≠ draining an enemy. Fire punches need hands/contact, ice lances need ice material/splinter physics, music/sonic moves need pressure waves, plant moves need credible roots/leaves, status effects need legible causes and state feedback. Preserve each existing move's game-mechanical identity, name, type and PP.
4. Improve the first 12 sheets **to the standard of the best original graphics before bulk production**. Explicitly redo Jaffa Breaker, Oathkeeper's Edge and Benevolent Bloom. Use the better `Stillwater Threefold Answer` original as a **detail benchmark, not an artwork source to recolour**.
5. Keep original current on-screen effect size. Extend animation pacing only where it improves readability, synchronize actual damage and HP/status updates with the impact frame, and guarantee battle continues after the animation. Make 1/2/3-hit moves show only successful hits, allow empty/missed moves and interruption, show correct caster→recipient direction and select the correct one of two foes or an allied target in doubles. Respect Reduced Motion (clear still outcome), Full Motion, repeat play and preload/fallback errors. No freezes in town-leader portraits.
6. Execute in reviewable, **small production batches** (e.g., 12–24 distinctive moves per internal review). Every batch needs: its own source artwork, sequence/intent metadata, screenshot/contact-sheet evidence, action-identity comparison against existing similar moves, tests, and a visual inspection checkpoint. However, **do not declare the overall commission done until the full real playable-move inventory is 100% satisfactorily covered.**

## D. COMPLETE QUALITY VERIFICATION

**Visual proof:** Generate side-by-side before/after maps and screenshot/contact sheets of all key animation frames at normal rendered phone size and source pixel resolution. Review all six Sporefall scenes day/night, adjoining routes, towns and finale context. Record a pass/revise decision per environment and per move. Image checksum, PNG dimensions, frame-count and unique filenames are necessary but **not sufficient** art acceptance criteria.

**Automated correctness:** Include robust audit tests in `scripts/audit-action-art.py`, expand `tests/move-art-batch01.test.mjs` or a maintained full-coverage test, and correct stale assertions in `tests/action-vfx-browser.cjs`. Integrate with `.github/workflows/patch-checks.yml`. Check frame integrity, alpha edges, cropped geometry, visual differences, file payload, 0/1/2/3-hit timing, hit synchronization, no game RNG use by cosmetics, performance and actual `ACTION_ART` resolution for every playable ID.

**Live browser and game QA:** Run `tests/finale-browser.cjs`, `tests/elite-leaders-browser.cjs`, `tests/action-vfx-browser.cjs`, `tests/tide-orchard-browser.cjs` and relevant full suite. In actual Playwright Chromium/android-sized viewport: walk every main/side route, enter/exits, battle repeatedly in single/partner double and all eight town leaders; use damaging, buff, heal, area, multihit, miss, status moves; verify no stale UI, targeting ambiguity or freezes. Verify both spare/execute Hasan routes, automatic Hell Mirror encounter, repeat/reload state, Pate/Trade story flags and save migration. Test Android portrait (including 390×844), smaller widths and desktop, with full/reduced animations, offline/PWA loading and cache upgrades.

**Product guarantees:** NO damage to original Mercy artwork, signing key/Android package identity, versionCode ordering, existing save compatibility (old save load and new save reload), permanent deaths, Field Journal records, 479+ species gameplay, progression, boss balance or original approved town environments.

## E. DELIVERY AND RELEASE GATE

- Keep v0.90.50 as fallback throughout; perform work in a separate branch/PR. PR #7 is only a starting point and stays DRAFT until fully reviewed.
- Maintain `docs/move-coverage-audit.md` listing every playable ID with art quality and verified status; `docs/finale-environment-audit.md` with every area and comparison screenshots; documented exceptions must be justified (e.g., non-playable/unused IDs), not silently omitted.
- Publish a reviewable contact sheet/screenshot artifact for each art batch and each revised route. Fix every test or art gap found, and re-run all suites. No arbitrary “looks good” or green test alone.
- Once and only once **all** moves and route art meet quality gates, bump release (target v0.90.51 or next available), increment Android versionCode past 145, generate complete offline PWA package, use **original Android signing identity**, run release workflow, and **verify** GitHub Release contains downloadable signed APK, PWA ZIP, SHA-256s and `signature-verification` artifact.
- Return an honest release summary: final IDs covered / total real playable IDs, modified environments, screenshots examined, tests passed, issue count fixed, Git SHA, Actions run, direct APK/PWA links. Never use a branch commit or a green partial workflow as proof that APK was published.

**Owner intent:** Carry the development all the way through to a genuinely professional, coherent pixel-art RPG. The current 12 extra sheets are prototypes; the newly-added Sporefall route art is not automatically accepted. Do NOT finish after a handoff, a twelve-move batch, a procedurally tinted set, or a build without verified quality.
