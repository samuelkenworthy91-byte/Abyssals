# Glass Scars and Stormcatch — v0.90.14 / Android 109

The 21 October feedback replaces the temporary mountain stair stripes and drawn cart with transparent, detailed raster props. Glass Scars has five vitrified lightning impact craters: fused black/teal glass, jagged rims and branching fulgurite veins. Deep elliptical basins use collision from `storm-props.js`; the pale main road, north relay trail and all gates stay clear. Existing saves inside a new basin recover through the normal nearest-walkable search. Stone stair rails frame the same three-tile route core and gate arrival positions. The existing horse and route monks are reused.

The cart driver says Pate and Trade raced on for supplies before the storm closed in, and mentions a ruckus to the north. Neither the driver nor the initial cart objective names Darius or orders a fight. The mountain remains required by the existing story progression; its identity is discovered through the patrols and deserters. Preserved Story Bible CH07 records, companion deaths, Darius/Tianzhar state, unique outcomes and Botrune events remain unchanged.

Storm flashes retain the 2–25 second schedule, full-screen illumination and reduced-motion opt-out. Their discharge now has an irregular 26-segment leader, six thinner forks and three secondary branches attached at real junctions, using a separate deterministic artwork PRNG. No gameplay randomness or hidden damage is introduced.

## Repeatable relay

The relay gives an explicit LOOK → WAIT → TAP NOW sequence, a moving charge approaching a marked target zone, a large green timing cue and matching receiver pointer. A no-stakes example demonstrates the correct tap without changing progress or rewards. Reduced motion uses manual example steps and untimed receiver choices. Closing the modal clears every timer; an unfinished logical charge survives reload without a stale deadline.

The original first cache remains 2,400 doubloons, three Hearty Rations and one Training Tonic. Each additional five-charge shift cycles through: 900 doubloons + two Poultices; two Hearty Rations + two Fresh Meat; 1,000 doubloons + a Training Tonic; two Poultices + one Smoke Bomb. The upcoming reward is visible. A completed claimed shift cannot pay twice; Play again explicitly starts a new shift. Old `claimed:true` saves migrate to one completed shift and cannot repeat the initial cache. Party health, permanent deaths and unique encounter history are untouched.

## Artwork and verification

Built-in ImageGen produced `mountain-steps`, `broken-cart` and `glass-crater`. Large source PNGs are preserved under `art-library/storm-polish-v09014/source/` and uploaded through GitHub's browser. Only three optimized WebP files (380,564 bytes total) enter `dist/assets/pixel/`. `scripts/prepare-storm-polish-art.py` reproduces cropping, resizing and compression; the source manifest pins SHA-256 values. No character art is replaced.

Prompt set: a straight north-south orthographic flight of worn wet basalt steps, clear central treads with rugged low side rails; a weathered oak/iron medieval supply cart with split detached spoked wheel, rope-bound red bundles, jack and left-facing drawbar, excluding the existing horse; an oval sand impact crater vitrified into glossy obsidian/smoky teal glass with fulgurite veins, avoiding lava, water and magical symbols. All three specify painted 3D fantasy RPG style, genuine transparency, complete silhouettes and no text or background plane.

`tests/storm-polish.test.mjs` checks old-cache migration, nine repeat rounds, reward rotation, idempotency, preserved human/unique outcomes, timing boundaries, attached deterministic lightning forks and crater clearance. `tests/storm-polish-browser.cjs` checks real A-button entry/driver dialogue, crater save recovery/reload, visual captures, the example, actual early/correct timed taps, repeat rewards and old claimed saves. Existing navigation, Botrune, Marasen and browser smoke tests remain required by the signed release workflow. Screenshots are reviewed; no physical-phone testing or complete combat balance playthrough is claimed.
