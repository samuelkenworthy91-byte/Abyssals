SPARRCOO  →  CORONOX
St. Elmo’s fire • Highland cattle • two-stage Fire/Electric family
Approved art package  |  Editable proposal for ChatGPT Work
Approved battle portraits

STAGE ONE  /  SPARRCOO

STAGE TWO  /  CORONOX
Approval boundaries
LOCKED: exactly these two transparent battle portraits; no redesigns, recolouring, posture changes or replacement with the earlier versions.
Stage 1 is seated like a puppy: shaggy orange fringe hides its eyes, wide cream horns carry a thin blue electrical arc, with small, gentle orange flames.
Stage 2 stands upright and anthropomorphic: dramatically raised ginger hair, powerful forearms, huge horn-spanning blue electrical corona and flame ripples woven through the coat.
OPEN TO REVIEW: provisional species names, stats, ability slots, moveset, evolution level, encounter tables, shiny palette and Journal copy.
Important: “St. Elmo’s fire” here means a blue corona discharge at horn tips. It is represented alongside a distinct orange Fire-type coat—not as one merged blue flame.

01  /  Species identity & progression
A gentle, almost hidden-eyed Highland calf whose horns sometimes crackle in a storm becomes a fiery bipedal thunder-bull. The transformation should feel extraordinary without abandoning thick fur, cloven hooves, broad cattle horns, or the warm ginger palette. The young form is charming; the adult is imposing, not villainous.
Field
Sparrcoo  /  stage 1
Coronox  /  stage 2
Type
Fire / Electric
Fire / Electric
Evolution
Base form
Evolves from Sparrcoo at Lv. 36 (proposed)
Category
Spark-Fleece Abyssal
Storm-Corona Abyssal
Role
Cute, sturdier-than-it-looks mixed attacker
Mid-speed bruiser; physical priority with strong special Fire/Electric pressure
Growth
Medium (confirm actual repo curve)
Same family growth curve
Height (concept)
0.8 m
2.3 m
Weight (concept)
58 kg
255 kg
Proposed base-stat spread
Stat
Sparrcoo
Coronox
HP
60
95
Attack
55
115
Defence
55
85
Sp. Attack
55
95
Sp. Defence
55
65
Speed
35
60
TOTAL
315
515
Balance logic: the final 515 BST lies between existing non-mythic finals Avaroll (Electric, 500), Xenolithid (Electric, 510) and Revault (Electric, 530), far below Cehong (Fire/Electric, 600). Unlike fast Electric sweepers, Coronox has modest base Speed but strong mixed offence and above-average HP; its lower Sp. Defence creates a realistic counterplay route.
Evolution / battlefield behaviour
Standard level evolution at 36, no leader-decision or location trigger; both forms keep Fire/Electric typing.
The huge standing hair and horn corona indicate stored charge, not permanent Speed boosts: only battle rules should affect actual Speed.
Keep evolution effect focused on the horn arc suddenly spanning both tips, hair lifting into a lightning halo, and the first strong orange flame curling from the mantle.

02  /  Ability choices: use existing systems
The following are existing named abilities found in dist/ability-data.js; the handoff proposes reusing them rather than creating new code. Work should validate slot schema and their behaviour on the current branch before assigning them.
Slot
Ability
Current effect / fit
Primary
Stormsense
When weather changes while active, Speed +1 stage, once per switch-in. Strong St. Elmo storm flavour; rewards weather interaction without making this 60-Speed bull inherently fast.
Secondary
Capacitor
Electric-type moves cause no damage and instead raise Sp. Attack +1 stage. Its horns behave like a living discharge collector.
Hidden
Conqueror’s Spark
On its first knockout each battle: Speed +1 stage; its next Fire/Electric move does +20% damage. Strong dramatic finishing transformation; needs balance scrutiny.
First-stage recommendation: primary Stormsense, secondary Static Hide (20% paralysis chance on contact), with the final family able to inherit the assigned ability slot consistently. Work must check whether introducing a new secondary on evolution is compatible with the current ability slot system.
Intended battle identity
A horn-led physical bruiser that can also release sizeable electric arcs and burning gusts. Heavy feet and controlled charges should contrast with its explosive hair and sparks.
Weather is thematic, not required: if no weather changes, Coronox still has viable 115 Attack / 95 Sp. Attack mixed coverage.
It must not summon a new weather automatically unless a later approval requests that behaviour. Rain specifically weakens its Fire attacks, so a rain-based build should be tested carefully.
Avoid stacking free Speed or damage boosts from aesthetic effects. The spark visuals do not imply hidden passive buffs.
Availability and economy
Proposed rarity: uncommon stage-one in an appropriate highland or thunder-storm area; fully evolved stage two should primarily be evolved by the player, not an early common wild encounter. Exact routes and weights require Work to inspect the live encounter registry.

03  /  Level-up learnset proposal
These are real move names and IDs present in the inspected dist/data.js. Levels and compatibility are proposals, not claims of implemented entries. Confirm actual physical/special category, PP and timing from the latest move table; respect move recall and evolution-learn legality.
Level
Existing move
ID
Combat purpose
1
Ash Pounce
23
Low-power physical Fire; tiny playful flames
1
Spark Rush
70
Low-power physical Electric; miniature horn arc
7
Ash Arc
18
First ranged Fire option
12
Spark Burst
63
First ranged Electric option
18
Static Field
71
Discharging horn-to-horn air field
23
Live Wire
62
Speed +1 to offset low base speed
28
Spark Fang
67
Close-range horns and charge, recoil
33
Ash Burst
20
Upgraded ranged fire wave
36
Cinder Pounce
30
Evolution strike: powerful physical Fire
42
Spark Ring
69
High-energy ranged Electric
47
Kindled Heart
33
Attack +1 setup
52
Volt Rush
75
Physical Electric finisher
57
Cinder Arc
27
Special Fire finisher
62
Volt Burst
72
Major special Electric blast with Speed trade-off
Optional tutor / codex directions
Consider Spark Crash, Smoulder Veil, Heat Haze and Charge Up as compatible upgrades if the game’s tutor/codex rules allow them. Keep coverage outside Fire/Electric limited; a mixed STAB specialist should have obvious type-based counterplay. No new signature move is required.
Move art / sound identity
Electric move VFX: fine blue-white corona threads originate at the horn tips, then join into a forked arch. Do not make each spell a generic ball of electricity.
Fire move VFX: warm orange/amber tongues appear as individual coat locks flare and settle; high-detail readable pixel motion, not a solid flame silhouette.
Physical action: first-stage tiny headbutt/hop; adult lunges from a planted upright stance, then uses hooves and horns with weight and momentum.
Audio proposals: quiet crackling/chime for calf; low bovine bellow underscored by a sharp electrical snap for adult. Use original audio or compatible existing game cues; no third-party samples.

04  /  Field Journal, habitats & shiny design
Habitat proposals — subject to map audit
Area candidate
Proposed use
Notes for Work
Storm Bluffs
Rare stage-one spawn, suggested Lv. 23–25
Existing cold-cliff side area; verify that storm effects / biomes support a Highland grazing animal before placement.
Thunder Plains / Botchern approach
Uncommon stage-one, Lv. 30–38
Stronger narrative tie to St. Elmo’s fire; verify actual area identifiers and access.
Highland pastures or sheltered hillside route
Alternative if existing
Do not invent a new area in code simply to accommodate this species.
Late storm-ravaged section
Very rare adult, optional
Keep normal evolution the primary ownership route, and availability before the eighth leader.
Field Journal entries — proposal
Sparrcoo: “Its eyes are almost always hidden by a heavy curtain of hair. During a storm, a fine blue thread joins its horns; it seems delighted each time the light appears.”
Coronox: “The current that once tickled its horn tips now bridges them like a second sky. Each furious shake sends its long coat rising into fire-coloured waves, yet it will quietly shelter younger herds from the weather.”
Rumour after sighting: “A ginger shape stands beneath the thunderclouds. The grass bends away from it, though no wind blows.”
Breeding and growth
Use genderless Abyssals breeding: 50/50 egg species between parents per the game’s standard family rules; no male-only/female-only gate.
Normal egg production and inherited prodigy-stat mechanics; never let a high evolved base total overwrite the current inheritance formula.
No split evolution, leader-decision trigger, or special item unless later approved.
Shiny proposal
Normal: ginger/copper coat, cream highlights, white-blue electrical corona, orange Fire flames. Shiny: charcoal-grey and pale silver shag with warm cream highlights, electric violet arc and pale coral-pink flame tips. Keep the eye-obscuring fringe and silhouette exactly; Work should generate shiny variants through the existing palette pipeline without editing these approved originals.

05  /  Production handoff for Work
Assets in this ZIP
Sparrcoo_battle.png — approved full-body transparent stage-one battle sprite; seated pose with concealed eyes.
Coronox_battle.png — approved full-body transparent stage-two battle sprite; upright powerhouse pose.
Sparrcoo_Coronox_Work_Dossier.docx — this editable production and gameplay brief.
Art & motion requirements
Use the included RGBA artwork as the visual lock. Keep all horn tips, sparks, feet and coat flames visible; add transparent padding at export rather than cropping.
Follower atlases: provide all four directions to the actual game dimensions and frame structure; stage one waddles and occasionally sits, stage two walks upright with planted hooves and heavy swing of the coat.
Ambient effects: stage-one has tiny horn-tip electric pinpoints and a soft tail ember; stage-two horn-bridge pulses at idle with standing orange hair and minor curling flames.
Create required back/side/rear battle views only if the current engine or sprite pipeline actually uses them; do not invent runtime conventions.
Shiny variants: same silhouette, consistent hue map and emission effects; avoid making the blue electric arc orange on the standard form.
Asset conventions: inspect repo for stable species ID allocation and art-source/runtime manifests, export .webp to project requirements, and preserve alpha with correct edge mattes.
Animations: high-detail deliberate pixel effects with clear frame timing and restrained screen shake; no overly bright solid-neon flooding of battle UI.
Implementation checklist
Allocate two unused stable species IDs; do not displace existing dex IDs or invalidate saved teams, reserves, eggs, journal sightings or shiny flags.
Create family records, typing, base stats, level-36 evolution, ability slots, growth, learnset, compatible tutoring, encounter entries, shiny and breeding mappings.
Add follower atlases, portraits, runtime art exports, silhouette/rumour data, cries/audio and move VFX hooks through the current pipeline.
Validate both forms in singles and doubles; avoid the horn-arc clipping health bars, targets or the partner portrait.
Run tests for weather-change Stormsense once-per-entry, Capacitor immunity/buff, KO-triggered Conqueror’s Spark, evolution, reload, catch, reserve and breeding.
Check capture availability before the eighth leader and encounter weighting for target areas; do not wipe existing local spawns.
Do not merge or commit to the live game without a separate Work implementation request.

06  /  Review & acceptance record
Current status: visual designs APPROVED. Gameplay and implementation details PROPOSED FOR REVIEW.
Decision area
Working proposal
Status
Species names
Sparrcoo / Coronox
Provisional
Typing
Fire/Electric → Fire/Electric
Agreed concept
Evolution
Level 36
Provisional
Stats
315 / 515 base totals
Provisional
Main ability
Stormsense
Provisional: existing
Secondary / hidden
Capacitor / Conqueror’s Spark
Provisional: existing
Moves
Existing Fire and Electric attacks + setup
Provisional
Locations
Storm Bluffs / Thunder Plains
Pending route audit
Shiny
Charcoal + violet electricity
Provisional
Approved sprite art
Exact two PNGs attached
LOCKED
Quality gates before implementation
Visual comparison: both exported sprites must visually match approved source PNGs, especially the calf’s seated pose and the adult’s upright silhouette.
Power budget: simulate mixed moves and Stormsense in representative encounters; compare with Revault (530), Avaroll (500), Xenolithid (510) and Cehong (600).
Stat progression: preserve the progression logic and existing max level, evolution compounding and prodigy inheritance.
Weather: switching, suppression, first weather change, repeated weather changes and forced weather must not create unintended stack exploits.
Audio + VFX: move silhouettes readable at real phone screen size; ensure high frame clarity rather than merely resizing a low-detail effect.
Asset QA: no opaque rectangles or hard halos on transparent exports, no missing facing frames, and no unrelated sprite modifications.
Visual reference provenance
The PNGs in this package are the final versions approved in the design chat on 1 November 2026. They supersede earlier standing calf and four-legged adult images. Do not substitute the earlier variants. The inspiration is a shaggy Highland/Angus-type cow, and blue St. Elmo’s corona near its horn tips; the design is original to Abyssals.
Repository audit references: samuelkenworthy91-byte/Abyssals, dist/data.js (move IDs and comparable stats), dist/ability-data.js (ability names/effects), and dist/encounter-pools.js (existing region examples). Values should be reconfirmed from the live branch at implementation time.