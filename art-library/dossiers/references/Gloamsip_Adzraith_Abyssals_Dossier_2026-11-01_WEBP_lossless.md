GLOAMSIP  →  ADZRAITH
BUG / GHOST  •  TWO-STAGE FAMILY  •  APPROVAL DOSSIER
The artworks below are the exact two user-approved battle sprites; no subsequent redesign or generated concept sheet is authorised. All names and gameplay values in this document are editable proposals for the user and Work to review.
Gloamsip • Stage 1

small spectral firefly; deceptively soft glow
Adzraith • Stage 2

looming vampiric insect-spirit; talons and wings
Approval boundaries
Locked: full silhouettes, violet-black chitin, mint-pale translucent wings, pale green lantern-like organs, luminous eyes, smoky spirit trails, and the distinct gentle-to-vampiric transformation.
Open to review: species names, final stat numbers, ability selection, exact learnset, evolution level, encounter rarity, breeding and shiny palette.
The second stage should not become an ordinary humanoid vampire: retain insect anatomy, six-limb impression, huge gauzy wings, long talons and a masked insectoid face.

01  /  Species identity & battle balance
Field
Stage 1 • Gloamsip
Stage 2 • Adzraith
Typing
Bug / Ghost
Bug / Ghost
Evolution
Base stage
Gloamsip → Adzraith, proposed Lv. 34
Habitat role
small nocturnal firefly-spirit
rare ambush predator in overgrown ruins
Combat niche
fast special chip / evasive scout
fast, fragile mixed offensive life-stealer
Growth proposal
medium / use existing curve
medium / follows same family curve
Proposed base stats
Stat
Gloamsip
Adzraith
Reason
HP
45
70
Needs siphon to sustain
Attack
45
105
Threatening talons
Defence
35
55
Physically fragile
Sp. Attack
75
105
Lantern magic
Sp. Defence
40
65
Low special bulk
Speed
75
105
Swift swooping hunter
Total
315
505
Non-legendary final
Benchmark: Vesperyre, an existing Bug/Ghost final, has 490 BST (75/50/60/100/100/105); Adzraith has more Attack but much less special bulk. Also compare Locruin (Bug/Dark, 480) and Carriena (Dark/Ghost, 505). Check whether mixed 105/105 offences plus recovery are excessive.
Ability recommendation — Lantern Thirst [NEW / PROPOSED]
Restores HP equal to 20% of direct HP damage dealt by its Bug or Ghost attacks, capped at 1/8 maximum HP per round across all targets and hits. No heal on a miss, immunity, shielded or passive damage, recoil, or status moves. Healing cannot exceed missing HP; the cap is shared in doubles.
The glowing abdomen drains vitality; the evolved lantern glows brighter. The cap prevents spread-move exploits.
Existing-ability alternatives (if Work recommends no new ability)
Fallback: Marked Quarry — +10% damage against the first marked foe until it leaves.
Secondary: Ambush — first damaging move after entry deals +10%.
Hidden: Ghost Hull — first lethal hit at full HP leaves 1 HP once per battle.
Work must verify the ability-slot system before integration; do not overwrite existing abilities.

02  /  Moveset & gameplay loop
No new signature move is necessary. The existing Bug and Ghost move families already support the concept: the larva-like spirit uses luminous magic; the evolved form adds violent talons and life-stealing pressure through its ability.
Proposed level-up moves — use exact repository move names
Level
Move
Purpose
1
Wraith Pulse
Early Ghost special chip / ominous glow
7
Chitin Burst
Early Bug special attack
12
Wraith Spiral
Nocturnal confusion pressure
17
Shed Shell
Speed up and clear stat reductions
22
Wraith Cry
Prevent easy disengagement; sound-based ghost pressure
27
Chitin Needle
Physical strike with possible Speed boost
31
Dusk Focus
Special Attack setup
34
Shade Claw
Evolution battle move / visible long talon strike
39
Chitin Spiral
High-value special Bug coverage
44
Shade Fang
Strong physical Ghost bite/claw equivalent
49
Shade Pulse
Reliable special Ghost pressure
59
Chitin Bite
Physical Bug finisher with Speed proc
Use the game’s move recall system and legal learnset union. Confirm move IDs, accuracy, PP and target types in live data before implementing this provisional progression.
Battle feel / example sequence
Gloamsip: flits and sends small lantern pulses; vulnerable when cornered.
Adzraith: Dusk Focus or Shed Shell setup, then Shade Claw, Shade Pulse or Chitin Spiral. Lantern Thirst offers limited recovery.
After actual healing, show a separate short inward transfer to the chest lantern; never on a normal Ghost hit with no recovery.
Ability test matrix for Work
Test Bug/Ghost damage, wrong types, immunity, zero damage, multi-hit, recoil, doubles, the per-round cap, switching, full HP, fainting, and save/reload. Prevent recursion.

03  /  World placement, lore and variants
Habitat — proposed, biome-first
Setting
Spawn candidate
Reason / guardrail
Orchard Canopy (night)
Gloamsip • uncommon; suggested 5–8%
Warm humid vegetation shelters luminous insects; add as a local slot, not a global override.
Relic Crags (night)
Gloamsip • rare; suggested 2–4%
Hollow stonework and dark cracks suit a tiny spirit capable of slipping through gaps.
Deeper old fort / ruined galleries
Adzraith • very rare; suggested 1–2%
Larger vampiric hunter belongs to old shadowy interiors, not town roads.
Work must confirm route unlocks, level bands, day/night tables, location IDs, capture availability before the eighth leader, and the current 479-species design target against the live registry. Proposed appearance levels: Gloamsip about 25–33; Adzraith about 38–48 in a later-area habitat. Preserve existing encounter weights by re-normalising within the chosen local biome only.
Field Journal — suggested entries / rumours
Gloamsip — “A pale light hovers at the edge of abandoned gardens. When approached, it retreats through the tiniest crack, leaving behind a cold, green shimmer.”
Adzraith — “Witnesses describe a vast insect-spirit unfurling from the same light. Its hollow lantern glows brighter after each strike, but even a wounded one vanishes before dawn.”
Rumour after encounter: “Where the moth-light lingers, something larger listens behind the walls.” Use the project’s usual unseen/sighted/caught Journal progression rather than revealing the full species in advance.
Breeding / ownership
No gendered biology or gender-locked evolution. Follow the existing Abyssals genderless breeding rules and choose the actual compatible egg/family group in the repo, subject to Work review.
Evolution should use the normal single level trigger (tentatively level 34); no story-location or spare/execute leader branch for this family.
Avoid creating extra baby, regional or alternate forms. One family, two species, one evolution.
Shiny palette direction — proposal only
Normal: deep plum/violet shell, chalky lavender wings with pale mint veins, amber-green internal lantern. Shiny: charcoal-indigo shell, misty ice-blue wings and muted warm coral lantern; preserve contrast at battle scale and reuse the game’s perceptual-recolour pipeline where possible. Do not wash out the eyes or wing veins.
Inspiration and cultural note
The creature draws specifically on the shape-shifting insect / vampiric-spirit motif associated with the adze in Ewe traditions of Ghana and Togo. This fantasy pair does not claim to depict the tradition itself or a single canonical form. Avoid invented sacred symbols, generic “tribal” accessories or real-world costume motifs. Reference: PBS Monstrum, “Adze: the Shapeshifting Firefly from West Africa” (pbs.org/video/adze-the-shapeshifting-firefly-from-west-africa-baxtto/).

04  /  Work production requirements
Approved sprite asset handling
Use Gloamsip_battle.png and Adzraith_battle.png as the authoritative approved fronts. Both are existing full-body RGBA PNGs, not crops of an infographic. Preserve composition and silhouette; do not re-illustrate without fresh user approval.
Verify clean alpha against black, white and the game’s own battle background. Small translucent green glow fringes are allowed; opaque edge artefacts are not.
Generate any missing repo-ready .webp exports at the actual battle-image sizes used by the project; the current architecture includes dist/assets/[species-id].webp and art-source/roster-200/[id].png conventions. Resolve assigned IDs from current data first.
Stage 2 art reaches close to the canvas edges. Add transparent inset/padding when needed for battle framing, not a crop that cuts off claws, smoke, wings or abdomen glow.
Directional followers / overworld motion
Gloamsip: four directions with gentle hovering, uneven lantern pulse and delicate wing beats. No heavy stepping or humanoid gait.
Adzraith: four-direction hovering/gliding or skitter-hover. Long arms draw inward through doorways; ragged translucent wings sway without clipping adjacent tiles.
Use the existing follower atlas dimensions, frame counts and transparent encoding; do not assume a new format. Include follower shiny variants if the current system requires separate variants.
Visual effects / audio handoff
No signature move required. Existing move animation IDs should retain their unique art and cues. On a successful Lantern Thirst activation, add a restrained two-stage cue: a faint mint-green trail moves from target to user, then the abdomen lantern pulses once.
VFX style: high-detail, readable pixel animation; controlled ghostly mint light against subdued purple, never a neon flood. Avoid generic green fire or borrowed effects from other Ghost moves.
Audio proposal: soft glassy chime / wing rustle for Gloamsip; breathy wing beat and resonant hollow note for Adzraith; lifesteal effect a subtle inward chime, no voiced screams. Prefer repo audio style; no copyrighted sampled sounds.
Shiny, Journal and integration
Add palette hooks and confirm the game’s shiny flag and saves persist normally. Journal silhouette and rumours must update from wild/trainer sightings and ownership as the existing system intends.
Choose unused, stable species IDs after checking the current repository; update family linkage, evolution, learnset, stats, art manifest, habitats, breeding rules, ability display text and battle hook. Run roster/asset checks and save-upgrade smoke tests.
No direct GitHub changes are authorised by this dossier alone. Use it as a reviewable brief first; user and Work can approve or adjust gameplay proposals prior to integration.

05  /  Production acceptance & review sheet
Item
Acceptance standard
Battle images
Both exact approved full-body transparent sprite files retained, separate, correctly oriented and legible at battle size.
Typing / IDs
Bug/Ghost on both; unique IDs; no collision or overwriting another family.
Evolution
Level 34 proposed, normal rules, correct ability-slot handling, save compatible.
Balance
315 → 505 provisional; test against Vesperyre and other fast Ghosts.
Ability
Lantern Thirst heal calculation, 1/8 per-round cap, doubles and multi-hit tests; alternatives documented.
Moves
Only real in-repo names and legal IDs, game’s actual PP/accuracy; no new signature move.
Locations
Story-sensitive, biome-valid placement and no wild population wipeout.
Art extensions
Four-direction follower sheets, shiny palettes, ability VFX and matching audio cues.
QA
Tests + short playable encounter verification, both day/night slots and evolution.
User approval
Confirm names, stats, ability, final habitats and shiny before coding as permanent canon.
Files supplied in this ZIP
Gloamsip_battle.png — stage 1 approved RGBA source (visual locked).
Adzraith_battle.png — stage 2 approved RGBA source (visual locked).
Gloamsip_Adzraith_Work_Dossier.docx — this editable, provisional design document.
Review priorities — for user and Work
Is the mixed 105 Attack / 105 Sp. Attack with 105 Speed too strong when combined with Lantern Thirst? Compare actual damage to Vesperyre rather than BST alone.
Should the family keep the new lifesteal ability, or use existing Marked Quarry/Ambush/Ghost Hull to reduce implementation scope?
Which later ruin or fort sub-area best communicates an elusive vampiric spirit without making the evolved form trivial to obtain?
Do the shiny, audio and overworld movements preserve the approved delicate translucent wing design?
Implementation status
Artwork approved. Gameplay and coding unapproved proposals. This ZIP is an asset-and-document handoff only: it does not indicate a successful GitHub merge, deployed animation or installable APK.