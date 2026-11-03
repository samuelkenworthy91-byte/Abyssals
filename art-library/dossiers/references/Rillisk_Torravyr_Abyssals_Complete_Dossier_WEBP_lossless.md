APPROVED VISUAL CONCEPT  •  PROPOSED MECHANICS
RILLISK  →  TORRAVYR
Two-stage river guardian family  |  WATER → WATER / DRAGON  |  Original battle art included
Core inspiration: a friendly freshwater lizard growing into a formidable, long-bodied river guardian. This line takes broad inspiration from the aquatic/reptilian forms associated with Māori taniwha traditions, without claiming to represent a particular named taniwha or reproducing culturally specific sacred motifs.
Rillisk • Water

Torravyr • Water / Dragon

What Work receives
Rillisk_battle.png — 1200 × 1200, transparent full-body original-art extraction, preserved in a square battle canvas.
Torravyr_battle.png — 1200 × 1200, transparent full-body original-art extraction, preserved in a square battle canvas.
Rillisk_Torravyr_Work_Dossier.docx — this written production handoff, gameplay specification and implementation checklist.
Approved: silhouette, teal/deep-sea-green and ivory palette, lizard-to-dragon evolution, broad nature-guardian identity. Proposed for review: species names, exact level, base stats, abilities, encounter rates and learnset.

01  |  Species identity and visual locks
Attribute
Rillisk • first stage
Torravyr • final stage
Typing
Water
Water / Dragon
Evolution
Evolves at level 38 (proposed)
No further evolution
Category
Riverside Lizard
Deepwater Guardian
Battle role
Quick, curious juvenile / nimble physical attacker
Heavy, slow physical guardian / weather setter
Provisional height
0.48 m
3.6 m
Provisional weight
11 kg
410 kg
Capture intent
Moderate encounter rarity
Rare wild / primarily evolved
Dex ID
Assign unused stable ID at implementation
Assign sequential unused stable ID
Locked art direction
Preserve both exact creature silhouettes from the supplied two-character image. Do not use the landscape composite as a new battle background.
Rillisk: large, expressive glossy eyes; four stocky little feet; small fins along the back and cheeks; pale chin and underside; curled wave-like tail; approachable, eager expression.
Torravyr: broad river-dragon head, heavy shoulder and front limbs, large claws, massive coiled tail, layered ivory throat frills and elegant aquatic fins. Its weight should feel considerable.
Shared body pattern: deep sea-green and rich teal scales, ivory-gold edging, cream belly, subtle curling wave markings. Keep the same family’s fin language and scale motifs.
Use detailed, clean, painterly/anime-inspired Abyssals battle artwork; layered shading and precise outlines. Do not redraw as blocky 16-bit battle art.
No clothing, weapons, Māori tattoo patterns, ceremonial adornments or copied symbols: the cultural inspiration is the ecological guardian archetype, not decorative appropriation.
Battle poses and motion
Rillisk should lean forward curiously, mouth slightly open and tail coiled like a small surf crest. Torravyr should be grounded in a forelimb-heavy guard pose with its front claws planted, chest lifted, tail spiralling upwards and head scanning for threats. The large body must remain fully in frame; no clipping of feet, tail, snout or fins.
Source images include painterly droplets and splashes. Keep these restrained in the final idle battle portrait; make heavier motion, water ribbons and rain a separate VFX layer for action animation.

02  |  Stats and repository comparisons
Base stat
Rillisk
Torravyr
HP
55
105
Attack
55
115
Defence
45
100
Sp. Attack
50
70
Sp. Defence
50
85
Speed
65
45
TOTAL
320
520
Battle identity: Rillisk is relatively fast and vulnerable. Upon evolution, Attack, HP and Defence climb sharply, while base Speed drops to 45. Torravyr becomes a deliberate frontline defender/physical striker, not a speed sweeper. Special Attack remains functional for occasional Water coverage, but is not its main offence.
Comparables sampled from current repo
Existing Abyssal
Type
BST
Relevant comparison
Cisternel
Ground / Water
515
120 HP, 95 Defence, 45 Speed: durable slow Water final
Liontide
Water / Fighting
525
120 Attack, 100 Defence: physical bruiser benchmark
Fetterpot
Water / Steel
515
125 HP, 105 Defence, 35 Speed: heavy tank benchmark
Deltacroc
Water / Grass
505
95 Attack / 95 Defence: balanced physical aquatic final
Torravyr (proposal)
Water / Dragon
520
115 Attack / 100 Defence / 45 Speed: weather guardian
Balance rationale: 520 fits among strong non-legendary final forms already in the catalogue. Its two-stage structure is not an automatic reason to use legendary-level stats. Work should test rain-weather support before increasing offensive power.
Breeding and advancement
Use the existing genderless Abyssals breeding rules. Family propagation and egg outcomes must follow the current code, not new Pokémon-style genders or breeding mechanics.
Use the existing inherited Prodigy-stat logic and evolution base-stat differences, preserving accumulated inherited benefits.
No story-decision evolution required. L38 is a standard level trigger; verify XP pacing and Dex reachability before assigning stable IDs.

03  |  Ability and rain weather specification
New primary ability — Rainwake
Proposed effect (primary for this family): When the Abyssal enters battle, it summons RAIN weather for five turns. This uses the game’s existing weather state and turn countdown, replacing any previous weather normally. The rain is not permanent, and it does not confer its own additional damage multiplier or healing.
Use the existing changeWeather('RAIN', activeBattlers, 5) logic in dist/abilities.js and trigger it through the species ability-on-entry hook. Do not implement “Water Terrain” or a parallel rain counter.
Activates when first sent out or switched in. Re-entering later may summon rain again. Staying on the field does not refresh it every round.
The entire active battle must share the same weather for normal damage and other ability checks; support singles, doubles and AI-controlled carriers.
The game should display a clear message such as “Torravyr · Rainwake: clouds gather and rain begins!” An accompanying sky-darkening/water-mist effect belongs in the VFX layer.
Existing suppression and other weather setters should work as they already do. Verify that one weather-change message/animation appears per actual entry, with no duplicate countdown or extra turn consumption.
Alternative existing abilities
Slot
Ability
Repo behaviour / role
Primary
Rainwake (NEW)
Entry summons RAIN for 5 turns
Secondary
Floodplain
If rain begins while active or is active on entry, Defence +1 once per switch-in
Hidden
Bulwark
Damage from contact moves reduced by 20%
Each individual Abyssal has one active ability slot; Rainwake does not automatically grant Floodplain. The juvenile may retain the same primary Rainwake ability with smaller, subtler rain visuals, or Work may use Floodplain for the juvenile’s default slot if encounter balance requires it. This is a design implementation choice, not a request to give two active abilities.
Weather QA acceptance tests
Initial Rillisk / Torravyr entry sets field.weather = RAIN and weatherTurns = 5 for the entire battle.
Turn countdown is exactly the existing engine convention; rain ends and battle UI updates without a stuck state.
Switching out and back in retriggers Rainwake; a weather-replacing ability or move can override it normally.
Rainrunner, Floodplain and other rain-sensitive checks respond to Rainwake in the same way as to an existing rain-setting move.
Weather Calm suppression, fainted entry cases, simultaneous double battles, field transitions and saved battles behave according to engine rules.

04  |  Existing move learnset & animation guidance
Do not invent a signature move for this family. Assign real move identifiers from the current game data and test compatibility; the table below proposes in-game names already found in the repository.
Level
Move
Intent / visual direction
1
Tide Crash
Small, skimming splash / playful lunging attack
1
Calm Current
A quiet ring of water stabilises the creature
7
Tide Pulse
Focused water bubble that bursts on impact
12
Tide Claw
Short wet foreclaw cut; preserve physical body movement
18
Mist Screen
Spreading ground-level river mist
23
Tide Spiral
A narrow, rotating stream; light recovery cue
29
Tidal Poise
Stances low to brace against a current
33
Foam Crash
Physical wave-assisted strike
36
Drake Breath
Early dragon foreshadowing; blue-white breath haze
38
Drake Crash
Move unlocked at evolution; forceful shoulder / tail strike
44
Foam Rush
A grounded charge behind a crashing spray
49
Wyrm Fang
Heavy jaw strike with a dragon-scale impact
54
Scale Guard
Defensive plates and brief protective water sheen
60
Wyrm Crash
Heavy physical dragon impact; roar and displacement
65
Deep Breath
Rest and recovery, quiet cyclical river pulse
70
Foam Claw
Ultimate water-claw impact with visible post-strike slowdown
Animation production brief
Torravyr’s four main actions should be visually distinct: tide rush (physical weight and wake), wyrm strike (tail/neck recoil), guard (defensive stillness and rising water), and Rainwake (atmospheric entry effect).
Match the high-detail, readable pixel-action VFX already used in Abyssals. Avoid merely enlarging low-resolution sprites and avoid wall-to-wall neon cyan; keep each effect understandable at phone scale.
Rainwake entry: subtle lowered sky light → a few broad raindrops → spray around claws → steady rain at battlefield level → return to normal idle. Separate the weather ambience from one-time entrance FX.
Use the existing action-VFX implementation, adapting its expected frame count, sheet shape and speed. Do not force a new 16-frame format if the current renderer expects a different structure.

05  |  Habitat, Field Journal and shiny appearance
Wild availability (proposed; do not assume these are live)
Area / existing map key
Stage
Level
Suggested appearance
Reed Sanctuary / reedSanctuary
Rillisk
21–25
7% day / 9% night
River Causeway / rivercause
Rillisk
28–31
5% day / 6% night
Philomere Backwaters / philomereBackwaters
Torravyr
42–46
2% day / 3% night
Lore rationale: shallow reeds shelter the juveniles, while rare adults occupy deep, dangerous river-bends. Integrate using existing encounter-slot rules, respecting current biome weight totals, quest/story locks and the full Dex availability audit. Work must confirm the exact route labels and levels against the live game.
Field Journal — ready-to-adapt text
RILLISK — “Small Rillisk spend hours chasing the eddies of slow rivers. Their tails curl after the current, and an unexpected shower often follows them home.”
TORRAVYR — “The oldest river guardians settle beneath steep bends where the current turns back on itself. When one rises from the depths, rain follows; the nearby water grows strangely still until its judgment is made.”
Unseen rumour: “Some say an enormous scaled guardian watches the deepest bends. Those who see the river swell without wind learn to return another day.”
Shiny direction and art production
Normal palette: blue-green and sea-teal scales, ivory-gold fin edges, warm cream belly, bright aqua and white spray. Retain clear face and anatomy at battle size.
Shiny concept: indigo-black scales, pale silver-white or cold turquoise fins, and lilac-silver water. Preserve original light-dark structure and the bright soft eyes on Rillisk.
Create a family shiny-palette entry using the current OKLab/recolour infrastructure; review highlights and translucent water separately to avoid hue-shift banding.
Create followers that match the repo’s existing down/left/up/right two-frame directional atlas conventions: Rillisk scampers; Torravyr moves slowly with tail drag and heavy forelimbs.

06  |  Integration and acceptance checklist
Repo handoff targets
Workstream
Implementation requirement
Species registry
Add two unique IDs and shared family ID, types, stats, capture, growth, stage, stats, abilities and art links
Evolution
Create level-38 Rillisk → Torravyr mapping and test save-safe evolution in battle/overworld
Learnsets
Add known move names using their current stable identifiers; no placeholder Pokémon moves
Abilities
Register Rainwake and its entry trigger; use existing Floodplain / Bulwark as alternatives
Artwork
Convert transparent PNGs to current game WebP dimensions; retain antialiasing, alpha edges, scale and identity
Followers
Produce directional two-frame atlases and test motion on phone PWA and signed APK
Audio
Only add species cries if the current audio pipeline supports them; do not pretend a new music theme is required
World
Add rare wild encounters to grounded habitat tables; verify progression / catchability
Shiny / eggs
Assign palette and existing family egg graphics; test breeding and inherited Prodigy stats
Journal
Write unseen rumours, sighting triggers, caught entry, silhouette and typing in Field Journal
Testing
Check rain timing, switching, double battles, shiny rendering, dex completion and saved-game compatibility
Implementation rules / do not change
Do not alter the approved creature designs, replace aquatic fins with winged dragons, or insert offensive cultural motifs. Do not give either species a new signature move without approval.
Do not overwrite existing species IDs, artwork, encounters or save flags; preserve signed APK update compatibility and offline PWA operation.
If time is short, prioritise fully correct in-game art + move and weather logic over extra optional assets; mark incomplete work accurately.
Reference points
GitHub project: https://github.com/samuelkenworthy91-byte/Abyssals
Repo modules reviewed: dist/data.js, dist/ability-data.js, dist/abilities.js, dist/roster-expansion.js, dist/encounter-pools.js and existing move catalogues.
Cultural reference: Te Ara — “What are taniwha?” https://teara.govt.nz/en/taniwha/page-1 ; Te Aka Māori Dictionary, “taniwha”: https://maoridictionary.co.nz/word/7391 . Māori taniwha narratives differ among iwi and hapū; this is only a general imaginative inspiration for an original Abyssals creature.