PRODUCTION DOSSIER  /  SINGLE-STAGE FAMILY  /  APPROVAL HANDOFF
VOLTINIX
THE LIGHTNING STAG   |   BUG / ELECTRIC   |   SINGLE-STAGE ABYSSAL

Battle-art master: “Voltinix_battle_sprite.png”. Transparent RGBA reference, centred on a square canvas.
The visual lock
This is the heavier reinterpretation of the selected teal-and-gold stag-beetle concept. Preserve the giant forked conductive horns, luminous cyan recesses, gold-edged charcoal carapace, cream thoracic ruff, and intelligent blue eyes. The silhouette is intentionally squat, dense, weight-bearing and battle-ready—not a slender fast runner.
The ability makes Voltinix fast only after it has spent rounds charging under Electric Terrain. Its physical design must communicate its uncharged condition: lumbering power, massive limbs and an anchored centre of gravity.
Status: visual direction selected; proposed gameplay below is a Work implementation brief, not an existing installed species.
GAME DATA  /  BALANCE
01  Species definition
Field
Approved direction / proposal
Name
Voltinix — the Lightning Stag Abyssal
Stage
Single-stage; no evolution
Types
BUG / ELECTRIC
Sex / breeding
Use standard non-legendary breeding rules; no gendered art
Classification
Heavy physical bruiser / terrain-driven speed ramp
Size
Approx. 2.1 m tall; 182 kg design reference (confirm balance later)
Species ID
Unassigned: Work must allocate a fresh, save-stable ID after checking latest registry
Provenance
This dossier + associated RGBA battle sprite; do not replace with earlier lighter or generic insect render

02  Base stats
HP
Attack
Defence
Sp. Attack
Sp. Defence
Speed
BST
130
125
65
65
60
55
500

Design intent: extremely solid HP and high physical Attack, but mediocre defences, poor special pressure, and only 55 base Speed. Do not raise starting Speed to match its athletic battle pose. The terrain setup is the source of its acceleration.
03  Exclusive ability — Storm Stride
Approved effect: At the end of each completed round while Electric Terrain is active, this active Abyssal gains +1 Speed stage. Gains stack to the normal +6 stage cap. Each gain uses the normal Speed stat-stage system; the effect does not change base Speed or permanently change growth.
Trigger once per round, not once per move, per hit, or per combatant action; do not double-trigger in double battles.
Only trigger if Voltinix is active and conscious at the end-of-round checkpoint and the field still has Electric Terrain.
No boost when terrain is absent or has expired; do not retroactively grant boosts if terrain is created mid-round after the relevant checkpoint.
Existing stat stages reset under the normal switch-out / battle-reset rules. Terrain ending stops further gains; it does not strip already-earned Speed stages.
The gain must respect the +6 stage ceiling. Display a log message and a short horn-charging visual only when Speed actually rises.
Because the live repository uses GRASSY terrain but does not yet expose a confirmed Electric Terrain setter, Work must implement or verify an ELECTRIC terrain value and usable setter before enabling the ability.
04  Suggested secondary slots
Primary ability: Storm Stride (defining ability). For secondary and hidden slots, prefer existing balanced abilities, if the runtime requires alternatives, rather than introducing unapproved new mechanics. Preserve Storm Stride as the default discoverable identity.
COMBAT  /  LEARNSET
05  Signature move — Thunder Gore
Property
Definition
Type and category
ELECTRIC / PHYSICAL
Power / accuracy / PP
90 / 100 / 10
Target
One opposing Abyssal
Rider
30% chance on a successful hit to raise Voltinix Speed by 1 stage
Terrain interaction
The move rider may combine with the end-round Storm Stride boost; both respect +6 ceiling
Availability
Species-exclusive, learned around level 48; also accessible through the game’s relearn system

Action identity: Voltinix plants its weight, tilts its giant antler mandibles, draws multiple independent arcs into the horn channels, then drives into the opponent with a low, crushing horn-first tackle. The lightning conducts along the horns; the damage is the physical impact. Avoid a generic yellow energy orb or an autonomous lightning bolt.
06  Terrain access — required addition
Propose a dedicated Electric status technique named Conductive Ground. Suggested behaviour: Electric Terrain for five rounds, including the ordinary field change rules and interactions; 15 PP; no damage. This is a proposal for Work to balance and implement, not a verified pre-existing move. It should use the game’s standard field.terrain / terrainTurns mechanisms and obey existing terrain-blocking abilities such as World Anchor.
If Work discovers an existing approved Electric Terrain technique, use that canonical move instead and do not register a duplicate. The specific name is not essential; the ability must be usable by a player without depending on weather scripts or scripted encounter-only effects.
07  Proposed level-up learnset
Level
Move
Status
1
Chitin Cut
Existing BUG physical #215
1
Spark Rush
Existing ELECTRIC physical #70
8
Spark Claw
Existing ELECTRIC physical #64
15
Live Wire
Existing ELECTRIC status #62
21
Chitin Claw
Existing BUG physical #213
27
Static Field
Existing ELECTRIC status #71 — paralysis, not terrain
33
Chitin Crash
Existing BUG physical #214
39
Spark Dash
Existing ELECTRIC physical #66
43
Conductive Ground
New terrain-setter proposal
48
Thunder Gore
New signature
55
Spark Crash
Existing ELECTRIC physical #65
63
Chitin Bite
Existing BUG physical #211
71
Volt Rush
Existing ELECTRIC physical #75

Learnset is authored for identity and pacing. Work should check actual move IDs/category metadata and adjust availability without introducing Pokémon-named moves not present in Abyssals.
ART PRODUCTION  /  EFFECTS
08  Battle illustration and visual preservation
Use the accompanying PNG as the definitive heavier design reference, not the earlier lighter concept sheet. Preserve broad torso, heavy thighs, low stance, thick plated shoulders and long lightning-rod mandibles.
Match the live game’s clean outlined, anime-influenced, richly shaded creature illustrations (not pixel-art portraits or overpainted 3D renders). Keep full character visible in frame.
Base carapace: midnight navy with warm gold plates. Secondary: saturated cyan-teal seams and wing edges; pale cream fur at throat and chest; gold lightning. Do not replace teal with generic blue electricity.
The PNG uses an alpha-masked edit of the approved render. Work should inspect and clean residual grey checkerboard fringe around the brightest lightning arcs before treating it as final runtime art.
Place runtime portrait at dist/assets/[NEW_ID].webp; preserve high-quality editable source in art-library and record provenance and file checksum.
09  Overworld follower requirements
Create a proper four-direction follower atlas matching dist/assets/followers/[id].webp. The standard code generally uses two frames per direction: down, left, up, right. Check exact live atlas conventions before final export. Grounded travel only; no floating or flight pose. Keep head horns within sprite bounds. Walking should be weighty, two deliberately compressed steps; when stationary, subtle electrical pulsing rather than incessant sprinting.
10  Bespoke move-VFX briefs
Thunder Gore — 16 distinct frames
01–04: grounded preparation; horn channels wake in sections, from brow to tips; torso compresses, claws brace on stone.
05–08: a forceful forward drive; antler edges shear through the frame leaving discontinuous gold streaks, with visible body momentum.
09–11: impact as two asymmetric horn points bite into the target zone; brief ivory-white flash and jagged metallic shock ripples.
12–14: recoil; electric filaments snap back towards horns; residual sparks scatter from exact collision points.
15–16: purposeful settling. If the 30% Speed rider procs, depict charge spiralling up the legs—one separate, brief rising pulse.
Conductive Ground — terrain activation
Do not draw generic thunder falling from the sky. Show antler tips touching down, branching gold/cyan circuit paths spreading across the battlefield ground in irregular, visibly connected segments, then a stable low field lattice. Terrain’s persistent ambient effects should remain restrained, readable on mobile and disable/reduce appropriately with reduced-motion settings.
11  Shiny palette direction
Shiny concept: deep indigo/purple shell; coral-pink horn tips and ionised pink lightning; silver chest ruff; cyan-blue eyes. Use the game’s OKLab shiny profile. Test against dark and light battle backdrops.
Optional audio
No confirmed per-species cry or battle-music file pipeline exists in the tracked project. Optional future direction: low horn resonance, followed by a rising electrical crackle. Do not require audio for implementation.
WORLD PLACEMENT  /  IMPLEMENTATION
12  Habitat and Field Journal
Place
Proposal
Thunderplain (Botrune arc)
Primary habitat: storm conductor paths / rocky plateau, levels ~58–64, uncommon; Work to verify exact accessible map IDs
Stormglass Bluffs
Secondary early sighting, levels ~23–25: keep extremely rare or reserve for rumours rather than allowing a level-23 fully powered 500-BST capture
Encounter timing
Both day and night where the storm biome warrants; rarest under calm conditions. Do not invent an automated storm-weather mechanic.
Wild roster
Single-stage capturable; no mandatory boss restriction. Keep fully reachable by or before eighth city leader.

Journal copy
Unseen rumour: “Travellers say that something with antlers like broken lightning rods waits at the highest conductors. The ground hums before it moves.”
Seen: “Voltinix draws electrical charge through its great forked mandibles. It is slow to begin moving, but each surge seems to make its huge frame more precise.”
Owned: “Its golden plates are thick enough to survive the impact of its own horn-first charges. Under charged ground its steps quicken until even smaller Abyssals struggle to keep pace.”
13  Work integration map
Work item
Relevant repository area
Species / stats / growth
dist/data.js and extension species installers; append new ID, no renumbering
Ability definition and triggers
dist/ability-data.js; dist/abilities.js; battle end-of-turn processing
Terrain setter & field rules
dist/move-rules.js; dist/abilities.js; move effect data / field state
Move metadata / learnset
New species module / move registry; family-learnset-briefs.js; modern learnset integration
Battle art
dist/assets/[NEW_ID].webp; dist/combat-art.js
Follower atlas / motion
dist/assets/followers/[NEW_ID].webp; dist/companion.js
Move VFX / choreography
dist/assets/vfx/action/; dist/move-scenes.js; action-vfx data and animation coverage
Shiny profile
dist/shiny-palettes.js; dist/shinies.js
Wild encounters & journal
dist/botrune-data.js; encounter pipeline; journal-habitats generator
Offline, testing, release
dist/offline-assets.js, tests/, release-config.json, GitHub Actions workflow

14  Acceptance and QA
Check for ID collisions against the current registered species and moves (do not assume provisional numbers).
No permanent growth or save values are altered; new owned creatures and their stats survive export/import and APK updates.
Electric Terrain is realistically obtainable; ability fires once at end of each eligible round, including doubles; respects +6 and switching.
Verify Speed recalculates actual turn order and critical speed differential using current stat stages.
Verify battle art, follower atlas, journal, shiny and unique sixteen-frame animation on Android and reduced-motion settings; do not commit or release until approved. Preserve signing and saves.