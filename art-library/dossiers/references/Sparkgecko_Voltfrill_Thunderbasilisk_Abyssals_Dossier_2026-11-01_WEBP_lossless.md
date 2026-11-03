Sparkgecko  →  Voltfrill  →  Thunderbasilisk
PURE ELECTRIC  |  THREE-STAGE FAMILY  |  WORK IMPLEMENTATION DOSSIER
ARTWORK LOCKED   •   GAMEPLAY PROPOSED   •   NO GAME CODE CHANGED



STAGE 1  •  Sparkgecko
STAGE 2  •  Voltfrill
STAGE 3  •  Thunderbasilisk
Core identity: Fast physical electrical striker / momentum hunter. All three stages remain pure Electric. The nine final battle illustrations were approved by the user; this dossier embeds the matching original isolated sprites without redesign.
Production status: reference-ready concept; no species IDs assigned, no code integrated, no new shiny sprites or followers yet. The proposed additions below must be checked against the live main branch by Work on implementation day.
1  Species identity & approved visual canon
Sparkgecko — Stage 1 / Electric: A bright-eyed gecko with natural conductor nodules along its back. It climbs storm-struck masonry to collect stray charge.
Voltfrill — Stage 2 / Electric: The juvenile’s head-fins have widened into a copper-gold resonating frill. Its claws and tail become more aggressive, but it is still unusually agile.
Thunderbasilisk — Stage 3 / Electric: A monumental thunder basilisk with coiled induction horns and a scythe-like tail. It intimidates foes by grounding lightning through its front claws before a sudden attack.
2  Evolution
From
To
PROPOSED trigger
Sparkgecko
Voltfrill
Level-up at level 19 or higher; normal progression; no special item
Voltfrill
Thunderbasilisk
Level-up at level 38 or higher; no thunderstorm or map restriction

Evolution is standard level-up when all required checks pass. Repeated levels above the threshold should still allow evolution if previously declined; do not force an environmental/leader-decision condition. Implement additive paths and calculate promotion deltas from the approved final stat lines. Preserve Prodigy original bonus stacking and previous evolution-history records.
3  Base stats, role and balance
Base stat
Sparkgecko
Voltfrill
Thunderbasilisk
HP
48
62
78
Attack
59
82
116
Defence
41
56
70
Special Attack
50
65
76
Special Defence
42
55
70
Speed
65
90
100
TOTAL
305
410
510

Comparative audit: Galvaneel (Water/Electric; 500 BST, fast special) and Revault (Fighting/Electric; 530 BST, physical) are the relevant implemented reference roles. Thunderbasilisk is a pure-type physical attacker with more Speed than bulk, weaker special damage and no immunity to Ground attacks.
Balance rules: these are base stat proposals, not growth percentages. Do not confuse the stat table with the game’s independent HP/other-stat growth system. Have Work derive growth rates using current functions, sample realistic levels and verify the final form against live team rosters, critical-hit rules and encounter progression.
4  Abilities and detailed specification
Slot
Ability
Status
Engine-facing description
Primary
Static Hide
EXISTING
A foe making contact has a 20% chance to be paralyzed.
Secondary
Stormsense
EXISTING
When weather changes while active, Speed rises by 1 stage; once per switch-in.
Hidden
Thundercoil
NEW / PROPOSED
See exact rules below; earned electrical charge empowers an occasional physical Electric strike.

Thundercoil — NEW / PROPOSED
Activation: After the holder successfully deals positive direct HP damage with an Electric-type move it selected.
Exact behaviour: Gain one Coil after the action completes (not once per hit or target), maximum two. When the holder declares a legal damaging PHYSICAL Electric move while holding two Coils, consume both after PP is spent and multiply that action’s final direct HP damage by 1.20. A boosted move cannot generate a Coil from its own damage. A miss, shield or immunity still consumes the two Coils once the move is executed; an invalid/cancelled target or failed PP check does not. Non-Electric attacks and residual damage neither build nor spend Coils. Switching or battle ending clears Coils. Multiple opposing targets receive the same action boost; never double-trigger off spread/multihit.
Duration, stack limits and stacking: 0–2 Coils; no effects on accuracy, priority, critical chance, status, recoil or turn order. Ordinary battle damage multipliers remain in their existing order.
Abuse prevention and exceptions: No Coil from statuses, reflected damage, allied attacks or ability-triggered free hits; never persists across battles/saves. Existing Static Hide paralysis and weather trigger behave separately.
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
Sparkgecko
1
Spark Rush
ELECTRIC
Physical
45
100
35
Sparkgecko
1
Plain Rush
NORMAL
Physical
60
100
25
Sparkgecko
8
Live Wire
ELECTRIC
Status
—
Always
20
Sparkgecko
14
Spark Claw
ELECTRIC
Physical
65
100
20
Sparkgecko
18
Charge Up
ELECTRIC
Status
—
Always
15
Voltfrill
19
Spark Dash
ELECTRIC
Physical
70
100
20
Voltfrill
25
Spark Ring
ELECTRIC
Special
80
100
15
Voltfrill
31
Static Field
ELECTRIC
Status
—
Always
15
Voltfrill
36
Flash Step
ELECTRIC
Status
—
Always
20
Thunderbasilisk
38
Volt Rush
ELECTRIC
Physical
95
95
10
Thunderbasilisk
44
Spark Crash
ELECTRIC
Physical
85
100
15
Thunderbasilisk
51
Spark Burst
ELECTRIC
Special
60
100
25
Thunderbasilisk
58
Volt Fang
ELECTRIC
Physical
110
90
5
Thunderbasilisk
65
Volt Burst
ELECTRIC
Special
120
90
5

All move names, base types, category, power, accuracy and PP in the table were checked against the 354-move canonical source in dist/data.js. Later runtime modules also add moves; Work must resolve any overrides before merging. Each listed stage inherits previously learned moves through existing evolution/relearner mechanics; do not drop earlier knowledge or insert duplicate learnset rows.
Sparkgecko purpose: Spark Rush: Entry-level contact attack; chance to raise Speed; Plain Rush: Small neutral physical pressure; may raise Speed; Live Wire: Speed +1; Spark Claw: Dependable close-range electrical claw; Charge Up: Raise Special Attack one stage
Voltfrill purpose: Spark Dash: 20% paralysis pressure; Spark Ring: Special alternative; 20% chance to raise Speed; Static Field: 3 turns; 25% paralysis chance each turn; Flash Step: Speed +2; Defence −1
Thunderbasilisk purpose: Volt Rush: Reliable late physical STAB with modest miss risk; Spark Crash: 30% paralysis; 1/10 recoil; Spark Burst: Special coverage; may lower foe Special Defence; Volt Fang: Heavy finisher; user takes 1/8 maximum HP recoil; Volt Burst: Special finisher; user Speed −1
Other options are codex-compatible only after checking current compatibility rules, not blanket unlocks. No new signature move is requested, so do not create unnecessary VFX or additional attack animations.
6  Habitat, acquisition and encounter pacing
Stage
Candidate habitat (not yet committed)
Levels
Proposed frequency
Sparkgecko
Sparkgecko — Botrune / Thunder Plains lower approach; inspect actual road tables
26–32
6% day / 8% night
Voltfrill
Voltfrill — Storm-scarred glass crater or upper lightning ridge; exact table TBD
37–41
3% day / 5% night
Thunderbasilisk
Thunderbasilisk — Evolution-only; no ordinary wild encounter
—
0%

Sparkgecko: Storm debris and metal outcrops; middle-game route.
Voltfrill: One evolved encounter only after its evolution level.
Thunderbasilisk: Prevents an elite attacker becoming trivial to acquire.
Location strings above are story/geography proposals, NOT guaranteed runtime room IDs. Work must inspect actual dist/roster-encounters.js + final composed tables, identify a current map id and verify access before eighth leader. Modify only compatible tables; scale existing weights to preserve their totals, gates, day/night flags, Fort floor distinctions and protected unique encounters. Do not inject universally or put evolved forms below evolution level.
7  Field Journal entries and local rumours
Sparkgecko
Local hint / optional silhouette rumour (not identification): Travellers find tiny golden scratches on broken lightning rods; the culprit is seldom seen.
Seen / captured ecological entry: Sparkgecko gathers loose static in conductive nodules along its spine and discharges the excess through its curled tail.
Voltfrill
Local hint / optional silhouette rumour (not identification): After lightning strikes, an enormous frilled shadow patrols the rocks, then vanishes before the thunder fades.
Seen / captured ecological entry: Voltfrill fans open its copperlike collar to hear the electrical hum of distant weather before others sense a change.
Thunderbasilisk
Local hint / optional silhouette rumour (not identification): The plateau’s oldest lightning scars are said to have been left by a horned beast that walked out of a storm.
Seen / captured ecological entry: Thunderbasilisk’s twin conductor horns resonate during a storm. Its claw strikes are fast enough to leave glowing fractures in stone.
Implement within actual unknown → seen → living / owned journal states. Before sighting, do not reveal the full sprite or precise details solely through a rumour. Register sightings on wild/trainer/partner encounters, preserve caught history even if moved, evolved, rehomed or permanently killed, and generate habitat information from actual tables rather than this proposal text.
8  Breeding and Prodigy inheritance
Genderless pairing: follow existing nursery parent compatibility. For this three-stage line, eggs should hatch the designated first stage, not the evolved stage; verify the current base-form resolution helper. Allow same-family pairing where current rules allow. Do not add a gender flag or alter the 50/50 family-outcome selection for cross-family parentage.
Progeny stat bonuses: same-family Prodigy traits use independently rolled success per available stat at approximately 33.17593128% each (six inherited stats together: 1/750). Retain overlapping-parent strongest-original-bonus logic, inheritance of the original advantage rather than evolution copies, and one bonus copy per completed evolution. Keep the family’s growth baselines distinct from its base stats.
Egg preservation: ordinary historical eggs remain 512-step records; newly warmed eggs can use the established 384-step Brooding Warmer effect. Preserve Family Seal / Thread / Feed / Charm stacking and pricing, cross-family outcomes, existing eggs, UID lineage, and saved offspring. No shiny chance or gender changes are proposed.
9  Shiny palette plan (ART NOT YET PRODUCED)
Stage
Suggested shiny identity
Sparkgecko
Deep teal slate chitin; copper-orange conductor nodules; pale lemon eyes.
Voltfrill
Turquoise frill edged with bronze; indigo body; amber discharge.
Thunderbasilisk
Blackened emerald armour, aged-copper horns, cold ice-blue lightning while preserving ivory throat contrast.

Shiny implementation: use the existing deterministic family-profile palette system, preserving alpha and normal originals. Check battle, reserve, conversation, follower, evolution and post-load summary rendering; confirm atlas cache keys include profile identity. Shiny sprites listed here are production instructions, not supplied files.
10  Remaining artwork and sound production
Art handoff: Keep the hooked lightning-tail, frill geometry, chitin plates and coiled conductor horns. Produce directional 2-column × 4-row followers (down/left/up/right; idle/walk), readable tail orientation, and storm arcs only as restrained short loops. Electric hits should discharge from claws/horns with a brief charge-up, a single bright contact and fading filaments; never blanket the sprite in neon.
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
Ground immunity/resistance checks, recoil, defensive fragility, Static Field/paralysis saturation and physical-versus-special moves.
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