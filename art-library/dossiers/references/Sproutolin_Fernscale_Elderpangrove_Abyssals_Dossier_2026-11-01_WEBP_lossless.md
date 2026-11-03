Sproutolin  →  Fernscale  →  Elderpangrove
PURE GRASS  |  THREE-STAGE FAMILY  |  WORK IMPLEMENTATION DOSSIER
ARTWORK LOCKED   •   GAMEPLAY PROPOSED   •   NO GAME CODE CHANGED



STAGE 1  •  Sproutolin
STAGE 2  •  Fernscale
STAGE 3  •  Elderpangrove
Core identity: Heavy-rooted physical bruiser / sustain defender. All three stages remain pure Grass. The nine final battle illustrations were approved by the user; this dossier embeds the matching original isolated sprites without redesign.
Production status: reference-ready concept; no species IDs assigned, no code integrated, no new shiny sprites or followers yet. The proposed additions below must be checked against the live main branch by Work on implementation day.
1  Species identity & approved visual canon
Sproutolin — Stage 1 / Grass: A curious juvenile pangolin with overlapping living leaves instead of scales and a young shoot growing from its curled tail.
Fernscale — Stage 2 / Grass: Its legs and foreclaws become serious digging implements. Thorny branches and fern fronds take root between the scales, while its mobile posture becomes crouched and territorial.
Elderpangrove — Stage 3 / Grass: A vast primeval pangolin whose canopy-like back shelters seedlings. Its body bears small flowering branches and mosses; the ancient scales hold firm even in landslides.
2  Evolution
From
To
PROPOSED trigger
Sproutolin
Fernscale
Level-up at level 21 or higher; ordinary progression
Fernscale
Elderpangrove
Level-up at level 42 or higher; not dependent on a particular forest

Evolution is standard level-up when all required checks pass. Repeated levels above the threshold should still allow evolution if previously declined; do not force an environmental/leader-decision condition. Implement additive paths and calculate promotion deltas from the approved final stat lines. Preserve Prodigy original bonus stacking and previous evolution-history records.
3  Base stats, role and balance
Base stat
Sproutolin
Fernscale
Elderpangrove
HP
60
85
105
Attack
54
78
112
Defence
63
88
112
Special Attack
45
55
55
Special Defence
52
65
90
Speed
41
49
36
TOTAL
315
420
510

Comparative audit: Gourbog (Grass/Poison; 515 BST) and Harpbriar (Grass/Ghost; 515 BST) support a 510-BST late defensive attacker. Elderpangrove trades speed and special damage for physical bulk. Unlike regeneration specialists, it cannot freely recover after every hit.
Balance rules: these are base stat proposals, not growth percentages. Do not confuse the stat table with the game’s independent HP/other-stat growth system. Have Work derive growth rates using current functions, sample realistic levels and verify the final form against live team rosters, critical-hit rules and encounter progression.
4  Abilities and detailed specification
Slot
Ability
Status
Engine-facing description
Primary
Forager
EXISTING
Whenever it consumes a Berry, it restores 1/16 maximum HP.
Secondary
Medicinal Sap
EXISTING
Its healing moves restore 15% more HP under current game rules.
Hidden
Heartwood Vigil
NEW / PROPOSED
One mid-battle emergency strengthening and minor healing trigger.

Heartwood Vigil — NEW / PROPOSED
Activation: The first time in a battle that enemy direct move damage crosses its HP from above 50% of maximum to 50% or below.
Exact behaviour: After the full damage action finishes, if the holder survives with positive HP, restore floor(maximum HP / 12), minimum 1, capped at maximum HP, and raise Defence by one stage (respecting +6). If a multi-hit action crosses the threshold, wait until all successful hits and any mandatory aftermath are resolved; trigger at most once. The flag is set even if Defence is already +6. Do not trigger from weather, poison, burn, item recoil, own recoil, ally attacks or scripted HP costs. Do not revive a fainted or permanently dead unit. Once per battle globally, not per switch-in.
Duration, stack limits and stacking: No stacks; once-per-battle flag survives switching and in-battle save/reload. Recovery is immediate at resolution end, not at turn end.
Abuse prevention and exceptions: Protect/substitute with no actual HP loss cannot trigger. A full-health super-effective knockout must remain a knockout. Existing status handling, healing modifiers and crits are unchanged.
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
Sproutolin
1
Leaf Cut
GRASS
Physical
40
100
35
Sproutolin
1
Open Guard
NORMAL
Status
—
Always
15
Sproutolin
8
Leaf Grip
GRASS
Physical
55
100
25
Sproutolin
14
Leaf Fang
GRASS
Physical
70
100
20
Sproutolin
20
Root Ward
GRASS
Status
—
Always
20
Fernscale
21
Leaf Rush
GRASS
Physical
60
100
25
Fernscale
27
Dune Claw
GROUND
Physical
50
100
25
Fernscale
33
Leaf Strike
GRASS
Physical
75
100
20
Fernscale
39
Spring Growth
GRASS
Status
—
Always
20
Elderpangrove
42
Root Lash
GRASS
Physical
85
100
15
Elderpangrove
48
Root Cut
GRASS
Physical
80
100
15
Elderpangrove
55
Thorn Guard
GRASS
Status
—
Always
15
Elderpangrove
61
Root Rush
GRASS
Physical
100
95
10
Elderpangrove
68
Verdant Mend
GRASS
Status
—
Always
15
Elderpangrove
75
Root Fang
GRASS
Physical
120
90
5

All move names, base types, category, power, accuracy and PP in the table were checked against the 354-move canonical source in dist/data.js. Later runtime modules also add moves; Work must resolve any overrides before merging. Each listed stage inherits previously learned moves through existing evolution/relearner mechanics; do not drop earlier knowledge or insert duplicate learnset rows.
Sproutolin purpose: Leaf Cut: Restore 25% of actual HP damage dealt; Open Guard: Basic Defence setup; Leaf Grip: 20% chance to lower target Defence one stage; Leaf Fang: 20% chance to lower foe Speed one stage; Root Ward: Raise Defence one stage
Fernscale purpose: Leaf Rush: Simple reliable physical Grass attack; Dune Claw: Ground coverage; 10% flinch chance; Leaf Strike: 10% chance to inflict Sleep; Spring Growth: Raise Attack and Special Attack one stage
Elderpangrove purpose: Root Lash: Steady mid-late physical Grass attack; Root Cut: 20% chance to lower Defence; Thorn Guard: Contact retaliation for five turns, existing rules; Root Rush: 10% Sleep chance; accuracy risk; Verdant Mend: Restore 50% maximum HP; Root Fang: Powerful finisher; 1/8 maximum HP recoil
Other options are codex-compatible only after checking current compatibility rules, not blanket unlocks. No new signature move is requested, so do not create unnecessary VFX or additional attack animations.
6  Habitat, acquisition and encounter pacing
Stage
Candidate habitat (not yet committed)
Levels
Proposed frequency
Sproutolin
Sproutolin — Cossenne orchard fringe / pilgrim grove approach; exact room TBD
18–23
9% day / 6% night
Fernscale
Fernscale — Sheltered orchard canopy / overgrown side grove
30–36
4% day / 3% night
Elderpangrove
Elderpangrove — Evolution-only; do not place in common wild pools
—
0%

Sproutolin: Saplings and damp banks with leaf litter.
Fernscale: Defends younger growth and roots under deadwood.
Elderpangrove: Final forest guardian must be raised rather than casually captured.
Location strings above are story/geography proposals, NOT guaranteed runtime room IDs. Work must inspect actual dist/roster-encounters.js + final composed tables, identify a current map id and verify access before eighth leader. Modify only compatible tables; scale existing weights to preserve their totals, gates, day/night flags, Fort floor distinctions and protected unique encounters. Do not inject universally or put evolved forms below evolution level.
7  Field Journal entries and local rumours
Sproutolin
Local hint / optional silhouette rumour (not identification): There are tiny neat furrows beneath the young trees, each lined with leaves too large for the animal that dragged them.
Seen / captured ecological entry: Sproutolin shelters under its overlapping leaf scales during rain, shaking water onto the shoot growing from its tail.
Fernscale
Local hint / optional silhouette rumour (not identification): Farmers complain of entire bramble roots being unearthed overnight, yet nothing appears eaten.
Seen / captured ecological entry: Fernscale deliberately disturbs hard soil, breaking old root mats so that new shoots can emerge in spring.
Elderpangrove
Local hint / optional silhouette rumour (not identification): Some old groves are said to walk when the soil is very dry; new seedlings follow in their wake.
Seen / captured ecological entry: Elderpangrove carries a small, living grove upon its back. Saplings germinate in its moss while the animal sleeps for days beneath ancient trees.
Implement within actual unknown → seen → living / owned journal states. Before sighting, do not reveal the full sprite or precise details solely through a rumour. Register sightings on wild/trainer/partner encounters, preserve caught history even if moved, evolved, rehomed or permanently killed, and generate habitat information from actual tables rather than this proposal text.
8  Breeding and Prodigy inheritance
Genderless pairing: follow existing nursery parent compatibility. For this three-stage line, eggs should hatch the designated first stage, not the evolved stage; verify the current base-form resolution helper. Allow same-family pairing where current rules allow. Do not add a gender flag or alter the 50/50 family-outcome selection for cross-family parentage.
Progeny stat bonuses: same-family Prodigy traits use independently rolled success per available stat at approximately 33.17593128% each (six inherited stats together: 1/750). Retain overlapping-parent strongest-original-bonus logic, inheritance of the original advantage rather than evolution copies, and one bonus copy per completed evolution. Keep the family’s growth baselines distinct from its base stats.
Egg preservation: ordinary historical eggs remain 512-step records; newly warmed eggs can use the established 384-step Brooding Warmer effect. Preserve Family Seal / Thread / Feed / Charm stacking and pricing, cross-family outcomes, existing eggs, UID lineage, and saved offspring. No shiny chance or gender changes are proposed.
9  Shiny palette plan (ART NOT YET PRODUCED)
Stage
Suggested shiny identity
Sproutolin
Autumn copper leaf armour, mauve twigs and soft cream-gold body.
Fernscale
Amber and crimson fern crowns with dark mahogany chitin; plum thorns.
Elderpangrove
Dusky burgundy leaves, pale silver moss, bronze scales, and delicate white winter blossoms.

Shiny implementation: use the existing deterministic family-profile palette system, preserving alpha and normal originals. Check battle, reserve, conversation, follower, evolution and post-load summary rendering; confirm atlas cache keys include profile identity. Shiny sprites listed here are production instructions, not supplied files.
10  Remaining artwork and sound production
Art handoff: Preserve recognisable pangolin scale layering, hand-like digging claws, curled tail and the progressively thickening foliage. For followers, use exaggerated foreclaw lifts and tail-balancing during turns; light leaves falling but no obscuring bloom. A Heartwood Vigil activation should show bark plates knitting together, one pulse of pale sap and brief shield settling, not generic green explosions.
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
Double healing with Medicinal Sap, regeneration loops, berry item duplication, contact retaliation, threshold crosses during multi-hit and extinction/permadeath floor.
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