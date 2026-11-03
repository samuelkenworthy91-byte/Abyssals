COBALISP  /  LANKINDER  /  SAPPHYRAX
Blueflame Weaver line  |  Three-stage Bug / Fire family  |  Approved battle-art handoff
The three portraits below are the approved artwork from this chat. Their shapes, gestures, colour palettes and flame-web effects are visual canon for this review pack. Names, evolution levels, mechanics, habitats and stats are proposals to be refined with Work.
01  /  Cobalisp

Cute blue-flame dwarf tarantula
02  /  Lankinder

Lanky adolescent webspinner
03  /  Sapphyrax

Massive blue inferno monarch
Design and combat at a glance
Type
Evolution
Role
Visual identity
Bug / Fire
Base -> Lv 20 -> Lv 39 (proposed)
Very slow mixed attacker; heavy defences, low HP
Electric-blue Bunsen flames, dark ultramarine fur, pale lilac-cream tufts, incandescent webbing

Files to Work
Cobalisp_battle.png — separately approved transparent full-body battle art; preserve without redesign.
Lankinder_battle.png — separately approved transparent full-body battle art; preserve without redesign.
Sapphyrax_battle.png — separately approved transparent full-body battle art; preserve without redesign.
Cobalisp_Lankinder_Sapphyrax_Work_Dossier.docx — complete, editable production brief and approval notes.
Approval boundary: Artwork is approved. Gameplay data in this Word document is a suggested implementation, not a repository change. The dossier does not include follower atlases, shiny battle art, code changes, or a built APK.

01 / Creature identity and evolution
A family inspired by the Brazilian blue dwarf tarantula. Its luminous cobalt fur becomes the visual language of very hot, blue Bunsen-burner flames. It does not gradually turn orange: the flame develops from tiny blue sparks into brilliant blue-white fire woven through adhesive threads of silk.
Cobalisp  |  the Sparkling Spider
Compact and rounded with oversized anime eyes, soft lilac cheek tufts, little fangs and bright blue flame marks. Its threads glow like tiny gas jets; it looks friendly until prey is stuck.
Four pairs of expressive legs, bashful crouch, clear abdomen/flame-mark motif shared with the rest of the family. Do not masculinise or make its face sinister.
Battle sprite: lively forward pounce; the flame-webs are delicate and small relative to the body.
Lankinder  |  the Awkward Weaver
A distinctly gawky adolescent: oversized legs, narrow joints, comparatively too-large abdomen, messy pale-blue fur and an energetic, embarrassed battle lunge.
Eyes are sharper and more focused but still expressive and whimsical. Flame markings become jagged and trace bright paths along the abdomen.
Silk strands hang unevenly from too-long legs, with flaring blue sparks that look barely controlled. It is visibly between two body plans.
Sapphyrax  |  the Sapphire Furnace
Immense broad-bodied elder, thick fur and huge legs, massive abdomen with molten azure fractures, imposing but not generic demonic features.
Blue/white fire, violet-black plating and icy-blue web sheets encircle the body; keep a powerful, frontal planted stance with two intimidating foreground legs.
A deliberately huge silhouette that is almost stationary, as though a fortress has woven its entire battlefield into its web. Preserve the original approved anatomy and silhouette.
Evolution and progression proposal
Stage
Typing
Evolution
Progression note
Cobalisp
Bug / Fire
Base
An ember-marked small tarantula; rare or uncommon habitat
Lankinder
Bug / Fire
Lv 20
Ugly-duckling phase, slightly quicker than final
Sapphyrax
Bug / Fire
Lv 39
Large slow siege predator with blue-flame silk

Normal level-up evolution only. No story branching, leader choice, gender requirement, or location-specific evolution. Evolution levels may be moved after Work examines the distribution of the game’s other Bug families.

02 / Base stats and balance
User brief: bulky mixed attacker, exceedingly slow, modest HP and unusually susceptible to critical hits. The proposed final spread is 520 points, above ordinary Bug finals but compensated by Speed 25, HP 62, Flying/Rock/Water weaknesses and its intended critical vulnerability. These are design targets, not playtested values.
Stat
Cobalisp
Lankinder
Sapphyrax
HP
36
50
62
Attack
51
78
112
Defence
64
90
115
Sp. Attack
50
74
108
Sp. Defence
65
79
98
Speed
34
34
25
TOTAL
300
405
520

Comparison to existing repository species
Species
Type / role
BST
Context
Wickmidge
Bug / Fire, initial form
300
Supports a 300-point first stage
Ampullusk
Bug / Steel bulky final
465
100 HP / 100 Def / 120 Sp.Def / 30 Speed
Bulwarkab
Bug / Steel bulky final
505
100 HP / 125 Def / 100 Sp.Def / 35 Speed
Vesperyre
Bug / Ghost fast special final
490
Speed 105, far faster but less physically imposing
Sapphyrax
Bug / Fire design target
520
62 HP / 115 Def / 98 Sp.Def / 25 Speed

Battle play pattern
Win by keeping an opponent engaged, taking ordinary hits behind solid defences, then using physical Chitin attacks or special Ash/Cinder attacks as needed.
Low HP makes chip damage, residual damage and healing management meaningful. Strong defences should never turn it into an unkillable tank.
Incoming criticals matter: the family is intended to be easier to critically hit, and in Abyssals criticals already bypass positive defensive stages. Work must test the interaction with the game’s speed-differential critical chance and 2× critical multiplier.
Stage 3 Speed is lower than Stage 2 to convey sheer mass. Avoid hidden Speed boosts in a default learnset that contradict the design; if learned, they remain tactical exceptions.

03 / Ability specification: Cinderweave
NEW ABILITY / PROPOSAL — reusable by future trap-spider and silk-themed Abyssals. The name is tentative. This family’s ability is not the existing Haunt Mark or Bindproof mechanic: those may inform implementation, but the random check is distinctive.
Primary rule
While an active Cinderweave user is on the field, each attempted voluntary switch by an opposing active Abyssal has an 80% chance to fail. On a failed attempt, luminous blue adhesive silk lashes the target to the ground; on the remaining 20% the switch proceeds. Each attempt gets a fresh independent roll. The ability does not permanently mark enemies and does not prevent the holder from switching out.
Critical vulnerability trade-off
Recommended balancing drawback: attacks directed at a Cinderweave holder gain +1 critical-hit stage. Use the game’s existing capped critical-stage / speed-differential system; do not add raw critical percentages on top without auditing current crit code. This keeps the final form materially easier to critically hit despite its defensive stats. If code architecture cannot combine both effects cleanly, Work should propose a narrowly scoped trait on this species rather than quietly omitting the drawback.
Decision details for Work
The roll is made when a voluntary switch is requested. Only one 80% roll per attempt; never re-roll repeatedly within one turn.
Do not trap allies. Apply to opposing monsters only while at least one healthy holder of this ability is active. In double battles resolve each opposing switch independently; do not multiply probability per spider.
Use the normal action-resolution handling for failed switch attempts; proposal: failure consumes that side’s switch action and announces “The blue silk held [name] fast!”. Confirm the timing with the existing UI before implementation.
Existing escape exceptions: Wayfarer and Bindproof must remain unaffected; evaluate other scripted escape moves, boss transitions, forced switches and battle-end escapes separately rather than trapping quest logic.
Clear influence immediately when the ability holder faints, switches out, or loses its ability. Success must never leave a permanent trapped flag behind.
Do not abuse switching AI: treat a blocked switch as a failed action in AI deliberation, not an infinite retry loop. Avoid soft locks in scripted fights.
Alternative if the effect is too strong
A tunable balance alternative is 70% switch failure with the same critical drawback. Retain 80% as the requested baseline until testing indicates otherwise. An alternate existing-ability fallback, Ambush, exists but does NOT fulfil the requested trapping identity.

04 / Moveset and growth proposal
No signature move is required. Keep the real move names in the repository, linking flaming silk visuals to existing Bug/Fire mechanics. These are proposed learn levels only; Work should validate every move ID, category, PP, accuracy and learnset architecture before committing.
Level
Move (existing)
Gameplay / animation focus
1
Chitin Cut
Short probing foreleg, ordinary Bug contact
1
Ash Pounce
Small leap plus tiny blue flame underfoot
7
Ash Arc
A slender blue flame curls from one fang
12
Silk Guard
Curls legs beneath silk mesh; defensive posture
17
Chitin Needle
Quick stinging launch, straight thread trail
20
Ash Wheel
On evolution, ragged, rolling blue fire ring
25
Heat Haze
Heat shimmer through adhesive web; accuracy pressure
30
Chitin Burst
Bug special burst from glowing joints
35
Kindled Heart
Muster courage, glowing abdominal core
39
Cinder Pounce
Evolution hit: massive descending blue-flame forelegs
44
Chitin Crash
Massive physical strike, visibly weighted and slow
49
Ash Brand
Special blaze shot from the dorsal abdomen
54
Cinder Arc
Wide, high-heat blue-white fire wave
60
Chitin Spiral
Swirl of needles and circular, scorching web

Recommended learnset stance
Both Attack and Sp. Attack must have comparable payoff; do not overpopulate either side exclusively. Use Chitin Crash / Cinder Pounce for physical, Chitin Spiral / Cinder Arc for special.
Include low-level utility and an accessible defensive tool (Silk Guard); reserve high-power finishers for later levels or codices.
Use the repo’s existing move VFX for basic moves where appropriate, but distinct blue flame/web overlays must not turn into generic orange fire. Do not rebuild all VFX or introduce a signature move without approval.

05 / Habitats, lore, breeding and shiny
Proposed encounter placement
Habitat / time
Suggested presence
Why it fits
Ember Quarry (DAY/NIGHT)
Cobalisp; uncommon, Lv 20–22
Warm mineral seams explain blue flames and web anchors
Storm Bluffs / colder rocky side routes (NIGHT)
Cobalisp; rare, Lv 23–25
Blue light could be mistaken for cold sparks among rocks
Later deep quarry, furnace cave or basalt gallery
Lankinder; rare; proposed Lv 32–36
Unstable middle form weaving between hot vents
Late-game volcanic gallery / boss-adjacent cavern
Sapphyrax; very rare; proposed Lv 46–52
Old, enormous predator builds a furnace-like silk lair

The first two locations are real keys in dist/encounter-pools.js. Later habitat names are descriptive candidates, not invented confirmed route IDs. Work must choose an existing unlocked late-area ID, preserve biome/ecology and ensure capture is possible by the eighth leader as required by the project.
Field Journal and rumours
Cobalisp: “An impossible blue spark bobs inside a tangle of warm silk. The creature at the centre watches every passer-by with delighted, unblinking curiosity.”
Lankinder: “Its long legs snag its own webs. When startled, the silk burns blue without being consumed, and the spider emerges looking rather offended.”
Sapphyrax: “Ancient silkways glow for days beneath its resting place. Travellers swear that its great body scarcely moves, yet prey never escapes the web once it is laid.”
Unseen rumour: “Some caves shine with a blue light that does not warm your hands.” Do not reveal caught information before the Journal’s sighting/capture milestones.
Shiny colour direction (Work to generate)
Normal: cobalt and indigo-blue fur, lilac-white bands, white-hot cyan flame, pale electric-blue webs. Shiny: deep black-violet fur with silver accents; the flames change to muted turquoise or pearl-green, and webs to cool pale mint. Preserve luminance contrast and existing palette/alpha handling; do not simply turn the family orange.
Breeding and sizes
Genderless family; use Abyssals’ existing 50/50 offspring-species inheritance and existing breeding/prodigy infrastructure. Tentative body lengths: 0.35 m, 0.95 m, 2.6 m. Final mass and weight should be selected after battle scale testing. No baby-exclusive egg mechanic.

06 / Production handoff and acceptance
Locked battle art
Cobalisp_battle.png — exact approved 1254 x 1254 RGBA source, fully framed sprite.
Lankinder_battle.png — exact approved 1254 x 1254 RGBA source, fully framed sprite.
Sapphyrax_battle.png — exact approved 1254 x 1254 RGBA source, fully framed sprite.
These are not concept sheets. Keep the original colourful, whimsical anime creature rendering, and use the approved individual battle portraits as the visual source of truth. Avoid increasing realism, lowering detail or altering silhouettes.
Assets Work must produce later
Game-ready downsized / converted battle art in the actual roster asset dimensions, with consistent visual scale and transparent edge cleanup (do not crop legs or web filaments).
Four-direction overworld follower sprite atlases at repo-specific cell size and frame count; Cobalisp bouncy and cute, Lankinder fidgety and unstable, Sapphyrax slow deliberate steps with abdomen sway.
Shiny palette transforms that leave highlights, outline and semitransparency structurally correct. Include shiny follower assets if required by the existing engine.
Cinderweave visual cue: fine taut blue silk near the attempted switching opponent, with a compact glittering snap on failure; no full-screen splash and no reused generic fire effect.
Audio (if appropriate): soft gas flame hiss, silk pluck, spider chitter with original synthetic cues; no licensed material. Keep cues short so repeated switch attempts are not irritating.
Updated species database, ability definitions and battle switching checks, family/evolution/learnset links, breeding data, route encounter tables, Journal rumour progression, shiny registry, artwork manifest and save upgrade tests.
Required tests before any implementation PR
Ability switch attempts in 10,000+ deterministic seeded simulations should approach 80% failures; success remains possible on each new attempt.
Double battles, forced switching, scripted leader transitions, Bindproof and Wayfarer exceptions, holder switching/fainting, and status/ability suppression must not hang the game.
Critical susceptibility is visibly greater than a comparable no-drawback spider; check maximum critical caps and prevent accidental double-counting.
Evolution, both move categories, stat totals, shiny palette, the Field Journal, day/night encounter availability and saves remain functional.
Benchmark against Bulwarkab (505 BST), Ampullusk (465 BST), Wickmidge (Bug/Fire base 300) and additional live roster changes. Adjust 520 only after review.
Sign-off boundaries
APPROVED: three battle sprites, blue Bunsen-flame palette, progression from cute dwarf to gangly teen to terrifying giant, Bug/Fire identity, 80%-chance web-trapping intent, bulky mixed attack / low HP / low Speed / incoming critical vulnerability.
PROPOSED: family names, exact stat numbers, level thresholds, Cinderweave wording and drawback implementation, move levels, locations, shiny and audio. Work should present any changed proposals for sign-off rather than silently treating the dossier as canon.
Repository status: NO CODE COMMITTED. This ZIP is a source-art and written-instructions handoff, not a game build.