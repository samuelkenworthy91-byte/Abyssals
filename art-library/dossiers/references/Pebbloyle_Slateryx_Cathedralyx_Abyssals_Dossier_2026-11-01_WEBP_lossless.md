Pebbloyle  →  Slateryx  →  Cathedralyx
PURE ROCK  |  THREE-STAGE FAMILY  |  WORK IMPLEMENTATION DOSSIER
ARTWORK LOCKED   •   GAMEPLAY PROPOSED   •   NO GAME CODE CHANGED



STAGE 1  •  Pebbloyle
STAGE 2  •  Slateryx
STAGE 3  •  Cathedralyx
Core identity: Extremely slow physical wall / stone-winged sentinel. All three stages remain pure Rock. The nine final battle illustrations were approved by the user; this dossier embeds the matching original isolated sprites without redesign.
Production status: reference-ready concept; no species IDs assigned, no code integrated, no new shiny sprites or followers yet. The proposed additions below must be checked against the live main branch by Work on implementation day.
1  Species identity & approved visual canon
Pebbloyle — Stage 1 / Rock: A cheerful small gargoyle carved by natural weathering into living sandstone. It hatches from cracks on ruined walls and has little gargoyle wings and playful eyes.
Slateryx — Stage 2 / Rock: A watchful slate predator with heavy roof-tile wings. It roosts on ruined arches to hear movement through masonry and launches short descending strikes.
Cathedralyx — Stage 3 / Rock: A colossal cathedral gargoyle whose outstretched wings resemble pointed Gothic windows. It defends forgotten sanctuaries, walking rather than flying to keep its weight grounded.
2  Evolution
From
To
PROPOSED trigger
Pebbloyle
Slateryx
Level-up at level 23 or higher; ordinary progression
Slateryx
Cathedralyx
Level-up at level 45 or higher; no cathedral location required

Evolution is standard level-up when all required checks pass. Repeated levels above the threshold should still allow evolution if previously declined; do not force an environmental/leader-decision condition. Implement additive paths and calculate promotion deltas from the approved final stat lines. Preserve Prodigy original bonus stacking and previous evolution-history records.
3  Base stats, role and balance
Base stat
Pebbloyle
Slateryx
Cathedralyx
HP
51
70
95
Attack
55
80
118
Defence
70
105
134
Special Attack
35
45
52
Special Defence
55
70
88
Speed
44
45
28
TOTAL
310
415
515

Comparative audit: Bastimole (Ground/Rock; 470 BST), Paleursa (Rock/Ice; 515 BST) and Avaroll (Rock/Electric; 500 BST) anchor Rock-family defence/attack ranges. Cathedralyx has higher physical Defence but very low Speed and exploitable special bulk. Its stone wings do NOT confer Flying type or immunity to Ground.
Balance rules: these are base stat proposals, not growth percentages. Do not confuse the stat table with the game’s independent HP/other-stat growth system. Have Work derive growth rates using current functions, sample realistic levels and verify the final form against live team rosters, critical-hit rules and encounter progression.
4  Abilities and detailed specification
Slot
Ability
Status
Engine-facing description
Primary
Stoneplate
EXISTING
Damage received from critical hits reduced by 25%.
Secondary
Firm Stance
EXISTING
Opponents cannot force this monster to switch out.
Hidden
Flying Buttress
NEW / PROPOSED
Single opening brace against an incoming direct attack; exact rules below.

Flying Buttress — NEW / PROPOSED
Activation: The first opponent damaging move in a battle that would deal positive direct HP damage to the holder.
Exact behaviour: Before that hit’s HP subtraction, multiply its final direct damage by 0.80, round down with current minimum-damage conventions. After receiving the first hit and resolving damage, if holder survives, raise Defence one stage. Consume ability once per battle regardless of whether the hit defeats it. In a multi-hit move, apply reduction to the FIRST actual damaging hit only; remaining hits proceed normally, and the Defence boost occurs after that first strike (do not retroactively reduce it). The once-battle flag persists across switching and in-battle save/reload. A failed, fully immune or protected move does not consume it.
Duration, stack limits and stacking: No stacks, no turn extension, no weather change; damage reduction is not a raised Defence stage and therefore interacts with critical hits as a damage multiplier, before legal HP-floor/clamp rules.
Abuse prevention and exceptions: Do not activate on damage over time, recoil, reflected contact, self-costs or ally friendly fire. Do not grant Flying immunity because of wings; preserve Rock vulnerabilities.
All three ability slots are proposed for the family, including pre-evolutions; keep a stable slot on promotion. Work should confirm registered ability IDs and user-facing glossary descriptions before implementing. Do not silently substitute this bespoke effect with a similarly named existing effect.
5  Level-up learnsets (existing moves verified)
Species
Lv
Move
Type
Class
Pwr
Acc
PP
Pebbloyle
1
Stone Crash
ROCK
Physical
40
100
35
Pebbloyle
1
Open Guard
NORMAL
Status
—
Always
15
Pebbloyle
9
Stone Rush
ROCK
Physical
50
100
25
Pebbloyle
16
Stone Skin
ROCK
Status
—
Always
15
Pebbloyle
22
Stone Claw
ROCK
Physical
60
100
25
Slateryx
23
Stone Lance
ROCK
Physical
70
100
20
Slateryx
30
Crag Guard
ROCK
Status
—
Always
20
Slateryx
37
Crag Crash
ROCK
Physical
75
100
20
Slateryx
43
Crag Claw
ROCK
Physical
90
100
15
Cathedralyx
45
Crag Break
ROCK
Physical
100
95
10
Cathedralyx
52
Cairn Ward
ROCK
Status
—
Always
20
Cathedralyx
58
Ancient Nodule
ROCK
Physical
80
100
15
Cathedralyx
64
Gale Claw
FLYING
Physical
70
100
20
Cathedralyx
71
Crag Lance
ROCK
Physical
110
90
5
Cathedralyx
78
Fossil Crash
ROCK
Physical
120
90
5

All move names, base types, category, power, accuracy and PP in the table were checked against the 354-move canonical source in dist/data.js. Later runtime modules also add moves; Work must resolve any overrides before merging. Each listed stage inherits previously learned moves through existing evolution/relearner mechanics; do not drop earlier knowledge or insert duplicate learnset rows.
Pebbloyle purpose: Stone Crash: 20% flinch chance; Open Guard: Basic Defence setup; Stone Rush: 20% chance to lower enemy Defence; Stone Skin: Defence +1 and halves crit damage for five turns; Stone Claw: Basic physical Rock attack
Slateryx purpose: Stone Lance: 20% chance to lower foe Defence; Crag Guard: Raise Defence two stages; Crag Crash: 20% chance to raise own Defence; Crag Claw: 20% chance to lower foe Defence
Cathedralyx purpose: Crag Break: Heavy reliable late-game strike; Cairn Ward: Reduce damage from next hit by 50%; Ancient Nodule: 30% chance to lower foe Speed; Gale Claw: Limited coverage justified by carved wings; 20% flinch; Crag Lance: Finisher; user Speed −1; Fossil Crash: Powerful finisher; 1/8 maximum HP recoil
Other options are codex-compatible only after checking current compatibility rules, not blanket unlocks. No new signature move is requested, so do not create unnecessary VFX or additional attack animations.
6  Habitat, acquisition and encounter pacing
Stage
Candidate habitat (not yet committed)
Levels
Proposed frequency
Pebbloyle
Pebbloyle — Marasen mountain pass / ruined road retaining walls
20–25
8% day / 10% night
Slateryx
Slateryx — Fort / mountain-route ruined towers; verify exact room and floor policy
34–40
3% day / 6% night
Cathedralyx
Cathedralyx — Evolution-only or one curated non-repeatable shrine guardian, if approved
—
0% ordinary

Pebbloyle: Small gargoyles shelter among collapsed parapets.
Slateryx: Territorial roost on old stone architecture.
Cathedralyx: A giant stone sentinel should not dilute common cave encounter pools.
Location strings above are story/geography proposals, NOT guaranteed runtime room IDs. Work must inspect actual dist/roster-encounters.js + final composed tables, identify a current map id and verify access before eighth leader. Modify only compatible tables; scale existing weights to preserve their totals, gates, day/night flags, Fort floor distinctions and protected unique encounters. Do not inject universally or put evolved forms below evolution level.
7  Field Journal entries and local rumours
Pebbloyle
Local hint / optional silhouette rumour (not identification): Old wall stones sometimes shift overnight; village children insist that one has blinking amber eyes.
Seen / captured ecological entry: Pebbloyle mimics the posture of nearby gargoyles to hide in plain sight, though its delighted chirps often betray it.
Slateryx
Local hint / optional silhouette rumour (not identification): Scouts have found slate claw marks on high arches, where no ordinary animal can climb.
Seen / captured ecological entry: Slateryx senses distant footsteps through mortar joints. It seldom leaves its chosen arch unless the building itself is threatened.
Cathedralyx
Local hint / optional silhouette rumour (not identification): The bell-less ruin is said to have its own keeper: two vast stone wings unfold when anyone harms the sanctuary.
Seen / captured ecological entry: Cathedralyx can remain motionless for decades. Its wings are carved like broken windows and bear the marks of sanctuaries it no longer remembers.
Implement within actual unknown → seen → living / owned journal states. Before sighting, do not reveal the full sprite or precise details solely through a rumour. Register sightings on wild/trainer/partner encounters, preserve caught history even if moved, evolved, rehomed or permanently killed, and generate habitat information from actual tables rather than this proposal text.
8  Breeding and Prodigy inheritance
Genderless pairing: follow existing nursery parent compatibility. For this three-stage line, eggs should hatch the designated first stage, not the evolved stage; verify the current base-form resolution helper. Allow same-family pairing where current rules allow. Do not add a gender flag or alter the 50/50 family-outcome selection for cross-family parentage.
Progeny stat bonuses: same-family Prodigy traits use independently rolled success per available stat at approximately 33.17593128% each (six inherited stats together: 1/750). Retain overlapping-parent strongest-original-bonus logic, inheritance of the original advantage rather than evolution copies, and one bonus copy per completed evolution. Keep the family’s growth baselines distinct from its base stats.
Egg preservation: ordinary historical eggs remain 512-step records; newly warmed eggs can use the established 384-step Brooding Warmer effect. Preserve Family Seal / Thread / Feed / Charm stacking and pricing, cross-family outcomes, existing eggs, UID lineage, and saved offspring. No shiny chance or gender changes are proposed.
9  Shiny palette plan (ART NOT YET PRODUCED)
Stage
Suggested shiny identity
Pebbloyle
Charcoal-blue stone, muted moonstone highlights, pale turquoise eyes.
Slateryx
Basalt black roof tiles, cool silver cracks, soft cyan slate wings.
Cathedralyx
Midnight obsidian stone, pale ivory tracery, turquoise window-crystal inlays and subtle cool-blue dust.

Shiny implementation: use the existing deterministic family-profile palette system, preserving alpha and normal originals. Check battle, reserve, conversation, follower, evolution and post-load summary rendering; confirm atlas cache keys include profile identity. Shiny sprites listed here are production instructions, not supplied files.
10  Remaining artwork and sound production
Art handoff: Preserve gargoyle ears, Gothic stone-wing openings, cathedral tracery, talons and arch-shaped perches. Walking followers use a grounded four-legged or prowling motion; wings fold to fit passage tiles, opening only for short idle accents. Rock hits should show distinct masonry chips, gravity and dust; the Flying Buttress effect is a narrow translucent stone arch snapping into place at the exact first impact.
Use the packaged three transparent 1024×1024 battle PNGs as the exact LOCKED reference originals. Preserve their PNG bytes in archival master copies; any optimized WebP/runtime derivative must be visually identical and keep clean alpha.
Followers: inspect the actual current illustrated-follower pipeline first. Produce full directional down/left/up/right with idle and stepping frames; the usual sheet is two columns × four rows, but species-specific overrides must be honoured.
Add normal battle framing and optional reduced-motion presentation, UI thumbnails, evolution reveal, and field/reserve crops without distortion or clipped horns/wings/tails.
Shiny variants: create consistent per-family alternatives and all applicable follower views, preserving characteristic textures and crisp cel shading.
VFX: only new bespoke ability cues and species-specific sound identities; existing level-up moves should reuse their approved existing VFX rather than be redrawn as unique moves.
Audio: short arrival call, low-volume movement / weight cues, attack accent and unique ability activation; avoid long loops or disruptive volume jumps.
11  Technical Work integration & test checklist
☐ Inspect current main branch, all installed species expansion modules and reserved ranges; allocate three unique IDs, one family relationship and correct journal order without renumbering existing species.
☐ Add three type definitions, six base stats per stage and suitable level growth fields. Check power class, capture rate, learnset references and canonical display names.
☐ Register two additive normal level evolution paths, stage advancement, accumulated growth, eligibility after cancel, battle evolution, and promotion to the correct artwork.
☐ Register existing ability IDs and the optional bespoke hidden ability; implement its trigger ordering, state, switch/reset, battle save and target rules exactly.
☐ Verify every move name/id/metadata against the current runtime merged catalogue. Merge level-up moves without duplicates and keep Codex restrictions.
☐ Add battle art and derivative manifests to correct runtime directories; produce directional followers and shiny palettes without overwriting any pre-existing artwork.
☐ Insert approved encounter weights into actual room tables only after checking level, day/night, milestone restrictions, map transitions and complete pre-leader-eight availability.
☐ Update Field Journal hints, sighting records, owned/seen persistence, generated habitats and counts; ensure older saved records load without remapping.
☐ Add family hatch/evolution relationships to breeding and preserved Prodigy inheritance; no new gender rules, rerolled old eggs or flattened growth history.
☐ Run node/unit tests, phone-sized browser visual checks, single/double battles, trainer sightings, encounter table sum checks and old-save round-trip. Preserve original Android signing and offline PWA asset compatibility.
Specific mechanical edge cases
Flying type must never be added; 4× vulnerabilities are not created by accidental type duplication. Verify Rock-versus-Ground effectiveness, multi-hit protection, crit interaction, forced switching and slow move order.
Ability proc blocked by immune targets, protect/substitute, and in-battle reload; avoid multi-hit/multitarget duplicate triggers.
Crits should use current effective Speed and defence stage handling. This ability does not alter crit rules unless explicitly stated.
Level cap / EXP carryover, rare spawn levels, denied evolution and after-faint party switching.
Capture, send-to-reserves prompt, reserve filtering, nursery egg hatch, shiny recolour and permanently dead journal record.
Automatic move VFX should complete without soft-lock in town-leader battles or doubles; hit effects must point to chosen target.
12  Approval status, assumptions and provenance
LOCKED
PROPOSED / REQUIRES USER APPROVAL
Three approved isolated battle sprite identities; all three mono-type lines
Species names are approved as labels from the concept sheets but can be renamed only with explicit approval; proposed evolution levels, stats, roles, abilities, moves, habitats and shiny palettes remain editable.
Full-body silhouettes, approved colours, faces and evolutionary progression
Bespoke hidden ability logic and all unimplemented overlays/followers are design instructions, not completed assets.

Unverified items for implementation: available unique IDs across every latest expansion, exact room/encounter codes, ability combination test results, compatibility of all Codex options, and current APK/PWA asset manifests. The dossier deliberately does not mark any new creature as already present in the game.
Source files consulted
Live roster and source move catalogue: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/data.js
Ability definitions: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/ability-data.js
Evolution records: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/evolution-data.js
Encounter composition: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/roster-encounters.js
Field Journal logic: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/field-journal.js
Tide / Orchard move additions: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/docs/tide-orchard.md
Prodigy breeding: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/docs/prodigy-breeding.md
Nursery stewardship: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/docs/nursery-stewardship.md
Shiny palette audit: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/docs/shiny-audit-notes.md
Collection access audit: https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/docs/collection-before-eighth-leader.md