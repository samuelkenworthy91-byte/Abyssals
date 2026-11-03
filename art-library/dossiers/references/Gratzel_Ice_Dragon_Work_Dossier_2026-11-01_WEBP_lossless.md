NEW SPECIES  •  SINGLE-STAGE  •  ICE / DRAGON
GRATZEL
The Rime-Grin Abyssal    /    Working species name — editable by user and Work
An elusive alpine predator inspired by the Tatzelwurm of Central European folklore, with the broad, mischievous grin and luminous feline eyes of a Cheshire-cat-like apparition. Its elongated body, heavy catlike forelimbs and icy ridges make it instantly recognisable: dangerous, uncanny, but not a legendary dragon.

CORE
PROPOSED DEFINITION
Typing
ICE / DRAGON (both types at all times)
Family
Single form: no pre-evolution or evolution
Visual approval
LOCKED to Gratzel_battle.png
Design status
Art approved; name, stats, ability and encounters are proposals
Battle identity
Weather-dependent hit-and-run ambush hunter

Visual reference is the individual full-body transparent image included in this ZIP, not a flattened infographic or cropped scene.

01 / Gameplay and balance
Purpose: a usable Ice/Dragon without pseudo-legendary-level numbers. Its powers come from positioning and a snowfield rather than raw stats.
STAT
BASE
RATIONALE
HP
80
Durable enough to survive a single ambush exchange
Attack
105
Claws, bite, pounce and short burst damage
Defence
75
Not a heavy-armoured dragon
Sp. Attack
55
Avoids being a versatile mixed sweeper
Sp. Defence
70
Vulnerable to determined special pressure
Speed
85
Moderately quick; wins through obscurity and timing
TOTAL
470
Deliberately below high-end Ice/Dragon finals

Repo comparison: Cocytalon (Ice/Dragon) is 550 BST; Grudgemont (Dark/Ice) is 510 BST; Rimehart (Ice/Fighting) is 505 BST. Gratzel at 470 is meaningfully weaker in raw power while still fitting a mature one-stage creature. Benchmarks refer to the species baseline inspected in the Abyssals GitHub repository, not a locked balancing decision.
Primary ability proposal — Snowshroud (NEW, reusable)
While HAIL or SNOW weather is active, treat Gratzel as having +1 effective evasion stage for incoming move accuracy checks. This is a temporary weather-derived bonus, not a real stat-stage mutation. It expires immediately when the weather ends or is overwritten. No bonus is given outside HAIL/SNOW.
Use the existing weather field and accuracy/evasion calculations. Do not overwrite the species’ stored stages, and do not award one stage each turn.
The passive modifier applies only once per calculation; entering, switching, and refreshing the same snow/hail do not stack it.
Respect the game’s existing accuracy/evasion cap and immunity or move-always-hits rules. Keep any separately earned Snow Veil move stages separate.
Weather Calm suppresses weather-based benefits if it is active; confirm parity with Snowfoot behaviour in combat code.
Ability is explicitly reusable for other snow-camouflaged species. Visual cue: fine frost softens the outline, not full invisibility.
Other ability slots, subject to Work review
Secondary — Ambush (existing): first damaging move after entry deals 10% more damage. Hidden — Snowfoot (existing): 50% Speed bonus during hail or snow. Assign only if species-slot design permits; do not accidentally grant multiple abilities at once.

02 / Moveset and play pattern
No signature move is required. Reuse actual game move identities rather than introducing a bespoke attack merely because the artwork is unusual.
LEVEL
EXISTING MOVE
INTENDED FUNCTION
1
Frost Shard
Small ranged Ice poke; slows a target on proc
1
Drake Claw
Short, rough physical attack
8
Frost Rush
High-crit Ice attack for ambush flavour
15
Frost Fang
Reliable stronger Ice bite
22
Cold Focus
Accuracy setup after concealment
29
Drake Rush
Dragon movement attack and Sp. Def pressure
36
Frost Crash
Physical Ice burst and potential Speed debuff
43
Wyrm Claw
Powerful, risky physical Dragon option
50
Frost Spire
High-crit Ice finisher
58
Wyrm Fang
Late Dragon coverage with special-defence debuff

Balance check: Frost Rush and Frost Spire already have elevated critical-hit potential in the baseline data. Do not compound them with a hidden global critical-rate modifier. Avoid making Snow Veil a default level-up move until evasion stacking has been tested.
Recommended encounter-level moveset
Frost Rush / Frost Fang / Drake Rush / Cold Focus. A high-level specimen can substitute Frost Crash and Wyrm Fang.
Battle play pattern
The Ice/Ghost ally with Whiteout Sovereign can provide five turns of HAIL: Gratzel exploits the obscured field to become harder to land a hit against.
Without hail or snow, Gratzel is relatively ordinary and vulnerable to stronger fully evolved species.
Its natural moves suggest ambush, one decisive hit, repositioning and disruption rather than endless offence.
Do not assume all Ice moves use snow animations: bites, claw strikes and cold breath should remain visually distinct.
Move animation direction for Work
Retain Abyssals’ established detailed pixel-effect treatment: a low silhouette emerges from windblown snow; pale cyan eye gleam and crescent grin briefly precede a fast slash. Frostbite glints follow the claws, and a restrained whirl of snow masks its retreat. Effects should be readable and moderately paced; no huge screen-filling snow overlay, no neon outlines.

03 / Habitat, character and Field Journal
Ecology proposal
Native to snowy cliff edges, cold cave mouths and narrow ice fissures. It curls its segmented body beneath snowbanks, leaving only the bright eyes or a grin visible before lunging. Its paws are stronger than its small wings or fins would suggest; it travels by crawling, climbing and springing across ledges rather than flying.
LOCATION / ACCESS
LEVEL
RARITY / NOTES
Kiverton snow approaches (exact route key: verify)
30–34
Rare; mainly during snowfall
High alpine ice caverns (key: verify)
38–43
Very rare; late access or hidden encounter
Weather-dependent override
—
Higher *relative* appearance in snow, never guaranteed

These are design placement proposals, not verified existing named encounter keys. Work must identify live map IDs and balance them against available Ice/Dragon species before modifying tables.
Suggested Journal entries
Rumour, after a sighting: “A smile hangs in the snow where no creature ought to be. Some climbers swear it vanishes when they blink.”
Caught entry: “Gratzel buries its body beneath drifts, leaving its eyes and fanged grin visible. It stalks patiently through mountain fog and rarely pursues prey far beyond its hidden snowfield.”
Breeding and collection
No gender differentiation; follow the existing Abyssals two-parent breeding rules and standard family inheritance.
Use the existing egg image selection logic; no unique egg artwork required unless Work finds a technical reason.
No split evolution, story location trigger, leader choice or quest-specific capture exception.
Maintain dex availability before the eighth leader unless the project’s latest collection audit establishes a different constraint.
Tone and cultural reference
Concept draws loosely from Alpine Tatzelwurm folklore: feline face, reptilian elongated body and clandestine mountain presence. Preserve the game’s original silhouette and friendly-but-unsettling Cheshire-style grin. Avoid reusing an exact published character design or making the creature simply a conventional four-legged Western dragon.

04 / Visual production guide
Approved normal battle artwork
Use Gratzel_battle.png unchanged as the design reference; both front paws, complete looping tail, face, icy whiskers, dorsal crystals and whole silhouette must remain visible.
Palette: dusky lavender-grey and cold blue fur, white underbody, crystalline cyan ridges, luminous pale-turquoise eyes. Dark, expressive Cheshire-like smile.
No extra horns or wings; retain the alpine worm/salamander hybrid anatomy and big feline paws.
Export to the runtime combat-art location following the current species asset manifest and compression convention. Preserve transparency and transparent snow particles.
Follower directions and animation
Work should produce the existing four-direction, two-frames-per-direction follower format. Movement should read as a sinuous stalk with heavy paw plants and a slow undulating tail; do not animate it as a hovering airborne dragon. Optional idle: head cocks, whiskers twitch, grin appears, then the body settles back into a drift.
Shiny palette proposal
Shift the normal lavender-blue body to midnight indigo/charcoal, keep the belly silver-white and turn the icicle highlights pale mint with faint green-blue accents. Keep the brilliant eyes and readable mouth; avoid simply hue-inverting the complete image. Integrate with the current family-colour recolour logic before producing a duplicate static sprite.
VFX, music and sound
No unique music file is required. Use existing battle ambience. An optional short species cry can combine a feline trill, muffled rasp and glassy ice chime; Work should follow whichever audio hooks the active build actually supports, rather than inserting an unused file. For Snowshroud, use small drifting translucent flakes and slight edge diffusion, not a second full character portrait.
Art QA tests
Preview battle art at native size and downscaled in the actual battle window; ensure grin and paws are still legible.
Check pure transparent pixels in the four corners and eliminate opaque matte/fringing.
Compare palette and shading with recently accepted Abyssals battle sprites, not a generic Pokémon style.

05 / Work integration checklist
This is a handoff proposal, not a claim that code or runtime assets have already been implemented. Work should confirm active branch and reserve IDs before integration.
☐ Inspect canonical species registry; allocate a new collision-free species ID and family ID rather than using a provisional ID from this document.
☐ Create the Ice/Dragon base-species entry (470 BST), no evolution; growth, capture, dex number, egg group, abilities and learned moves per current schema.
☐ Wire approved battle PNG into the actual art-source and runtime WebP path (do not invent paths). Create the correct follower atlas and shiny family palette.
☐ Implement reusable Snowshroud ability in the ability catalogue and accuracy resolution, using HAIL/SNOW and Weather Calm suppression.
☐ Use canonical registered moves: Frost Shard, Drake Claw, Frost Rush, Frost Fang, Cold Focus, Drake Rush, Frost Crash, Wyrm Claw, Frost Spire, Wyrm Fang.
☐ Find legitimate icy route identifiers; add a rare encounter without removing curated pools or violating collection-before-eighth-leader checks.
☐ Add Field Journal rumours, naming, size metadata, capture rate, breeding compatibility and type chart expectations.
☐ Create and test directional follower motion and per-move VFX, respecting the existing detailed pixel visual language.
☐ Test weather ability under HAIL, SNOW, rain, sun, weather expiry, forced switching, status, duplicate trigger and double battle accuracy resolution.
☐ Test with an Ice/Ghost ally using Whiteout Sovereign. Hail is currently set for five turns in abilities.js; do not confuse it with overworld storm particles.
☐ Confirm no permanently stored evasion stages from the passive effect; inspect interaction with Snow Veil and max-evasion rules.
☐ Run regression / save migration checks; do not invalidate existing save IDs, signing or offline build assets.
Reviewer decision points
LOCKED: the battle design, overall one-stage concept, Ice/Dragon typing, and weather-ambush direction. FOR DISCUSSION: working name Gratzel, exact stats, Snowshroud numerical strength, alternative ability slots, encounter locations and shiny colour choice.
Repository observations: baseline species data in dist/data.js; move identities in its move catalogue; weather and combat behaviour in dist/abilities.js; animation and follow behaviour vary by build. Verify filenames and active branch when implementing.