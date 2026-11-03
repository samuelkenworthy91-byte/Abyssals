LUTON  →  LUTROMAGE  →  LUTRASAGE
Three-stage Psychic family  •  Complete visual and implementation dossier
Prepared for ChatGPT Work · version 3 · 1 November 2026 · not yet wired into the game

LUTON
Psychic · base

LUTROMAGE
Psychic · middle

LUTRASAGE
Psychic · final
Production contract
The three individual transparent PNGs in this ZIP are the approved front battle-art references. They are complete, full-body designs, not cuts from a labelled concept sheet. Use them as the sole visual source for deriving the game-size battle assets, directional followers, shiny renders and other animation poses.
Preserve the same open, rounded, kind eyes across all stages. Lutrasage is wise and powerful, not cruel or angry.
Preserve Lutrasage’s long, pale, flowing sage beard / chin-fur, and the river-otter silhouette in every evolution.
Keep the rustic twisted-wood staff as the family’s shared heirloom, evolving through subtle ornamentation, not replacing it with a generic wand.
No signature move. Palimpsest is an existing ability; reuse it rather than implementing a duplicate.
At a glance
Form
Typing
Evolution
Base-stat total
Luton
Psychic
Base stage
305
Lutromage
Psychic
Level 18
405
Lutrasage
Psychic
Level 36
520
Dex IDs are not assigned in this pack. Work must allocate unoccupied IDs after checking the live species registry, including any unmerged branches.

1  |  Locked visual design
Family-wide art language
Use the established Abyssals battle-art treatment: painterly fantasy creature illustration with precise, legible contours, dense but controlled detail, readable hands/paws and facial features, smooth shaded forms, crisp transparency and clear silhouettes at battle scale. Do not replace the art with a low-resolution procedural sprite or a completely new character design.
Anatomy first: muzzle, whiskers, small round ears, short otter legs, broad paws, long tail and warm fur remain visible despite the clothing.
Personality evolves from discovery → study → calm mastery. Skill and confidence increase, not hostility.
Shared visual motifs: off-white muzzle/chest fur, rustic staff, warm eye glints, cloth stitching, river-travel utility, gentle violet psychic light.
Luton  |  Unplanned wonder
Small rounded otter, cream belly, delighted expression and broad brown eyes. An oversized, patched neutral-toned floppy hat and a short moss-green travelling shawl accentuate its innocence. It holds the found staff awkwardly in both paws as if unsure how it works. The psychic aura should be visibly smaller than in later stages.
Lutromage  |  Earnest apprentice
An upright but still strongly otter-like novice, with a lively and dynamic casting pose. Green layered hat, practical travelling cloak, belt, simple bag and a more carefully gripped staff. One paw is extended with a spiralling, semi-transparent psychic current; body leans into the spell. Face is calm, open and curious, with stage-one-style rounded eyes—not a stern glare.
Lutrasage  |  Quiet master
Larger, powerful but grounded figure. Flowing purple-and-cream robe, warm gold embroidery, full otter paws and tail, and a long pale beard that is recognisably fur, not a glued-on human beard. The gnarled staff branches around a levitating amethyst, with restrained orbital trails. Wide open casting gesture and imposing cloak motion, yet gentle eyes and a thoughtful, reassuring face. Do not add a sneer, frown, angular hostile eyes or exaggerated human proportions.
Three distinct battle poses
Stage
Pose and silhouette key
1
Excited crouch; two paws holding staff; floating crystal and a short orbiting effect.
2
Low and active casting stance; one paw extended and staff braced; flowing green cloak.
3
Upright and composed; one paw opened in a broad spell gesture; large purple cloak and sage beard in motion.
The PNG alpha channel is present. Work should inspect for stray edge glows/fringing, keep intentional magic particles, and validate the rendered sprites on both light and dark battle backgrounds.

2  |  Stats, evolution and ability
Species
HP
Atk
Def
SpA
SpD
Spe
BST
Luton
45
30
40
70
55
65
305
Lutromage
65
35
55
100
80
70
405
Lutrasage
85
50
65
125
110
85
520
Combat identity: special attacker / tactical support with stronger special resilience than physical resilience. Lutrasage has reliable special damage and can adapt to opponents who repeatedly use the same move, but a physical sweeper can pressure its 65 Defence. Base Speed 85 gives it meaningful, not overwhelming, initiative.
Balance against existing Abyssals
Existing final
Typing
BST
SpA / SpD
Speed
Sunscint
Fire / Psychic
510
125 / 90
100
Palimopus
Water / Psychic
510
105 / 105
75
Accordacal
Ground / Psychic
520
95 / 95
95
Sepulshade
Psychic / Ghost
505
105 / 125
60
Lutrasage
Psychic
520
125 / 110
85
Reference values inspected from the Abyssals repository’s species baseline (dist/data.js). This is a design comparison, not a claim that every production patch uses identical live balance.
Evolution
Luton evolves at level 18 into Lutromage; Lutromage evolves at level 36 into Lutrasage. No item, leader choice or story location is required.
Preserve existing level carry-over, inherited stats and move-learning flows when implementing. Use the actual repository evolution schema, not assumptions from this document.
Ability: Palimpsest  |  EXISTING
Exact repo ability text: “After being hit by a damaging move, further hits from that same named move deal 25% less damage until this monster switches out.”
Assign Palimpsest across the full family, subject to the live data schema. Its learned, adaptive protection reinforces the sage theme.
Work should verify the reduction is reset on switching, keyed to the actual named move, and does not accidentally affect unrelated attacks.
Do not add a replacement ability named Keen Insight, Clairvoyant or another invented passive from earlier concept sheets.

3  |  Learnset and battle function
No signature move should be created. Build the final learnset using the game’s existing Psychic moves, following the family’s progression from simple pulses to controlled high-power psychic casting. The list below is a proposal for Work to map into the live learnset and rebalance around real encounter levels.
Level / event
Move (repo name)
Intent
1
Mind Pulse
First weak psychic projection
5
Mind Lance
Reliable early single-target damage
9
Mind Screen
Defensive spell learning
13
Mind Burst
Modest damage with Special Defence pressure
18 / evolution
Calm Thought
Beginning of disciplined control
23
Mind Arc
Early confusion pressure
28
Future Read
Preparation and never-miss setup
33
Aura Pulse
Mid-range special damage / accuracy disruption
36 / evolution
Aura Lance
Reliable mid-high damage
41
Long Game
Protective evasion and Sp. Def setup
47
Aura Wave
Late damage and special defence disruption
53
Aura Ring
Major attack with chance of self-buff
59
Aura Burst
High-powered late coverage
Move selection principles
Use existing code-legal moves and their canonical values; do not duplicate move IDs or invent a new bespoke otter-only skill.
Keep physical damage sparse; utility, special pressure and patience are the family identity.
Avoid overloading the first form with advanced options. If a move is too strong for its milestone, adjust level after testing.
Cross-check obtainable codex / tutor moves against game legality before adding coverage beyond Psychic.
Standard VFX direction  |  No signature-move sheet needed
For Mind Pulse / Mind Lance: small violet ripples and narrow focused telekinetic lines. For Aura Wave / Aura Ring: clean layered rings, controlled refraction and a brief target impact; show an expansion in discipline and intensity, not generic neon explosions. For Mind Screen and Long Game: a short, readable, translucent ward or perception shimmer. Reuse and audit the existing move animations first. Only request corrected effects if they fail the established visual standard.

4  |  Habitat, journal, breeding and shiny
Encounter placement  |  Proposals to validate
Stage
Habitat proposal
Suggested wild levels
Rarity
Luton
Woodland streams and riverbank paths near early accessible towns
7–13
Uncommon
Lutromage
Wooded ruins, old shrine approaches and secluded study groves
22–29
Rare
Lutrasage
Primary route: evolve; optional late-game ancient ruin encounter
40–48 if added
Very rare
Work must match these ecological briefs to existing accessible area IDs, journey pacing, night/day tables and intended 479-species availability. These are narrative habitat recommendations, not confirmation that the named places or level bands already exist in the encounter registry.
Field Journal entries
LUTON — “It treasures odd objects washed into riverbeds. One little Luton discovered a twisted branch that answered its curiosity with a pulse of light, and has carried it ever since.”
LUTROMAGE — “It gathers wherever old paths cross abandoned study grounds. Though often uncertain of its spells, it watches every reaction carefully and rarely repeats the same mistake.”
LUTRASAGE — “A patient sage is said to hear the thoughts of a forest as clearly as a river. Its trusted staff is still the same piece of driftwood it found when young, now polished by years of travel.”
Rumour / unseen entry: “Near quiet streams, people have seen little otters carrying wood that glows without flame. Older travellers insist the stick is a relic, but the creatures seem to value it most as a companion.”
Breeding and catchability
Follow Abyssals’ genderless, two-parent breeding rules and Prodigy inheritance; do not import conventional male/female species or egg-group assumptions.
Provisional capture-rate direction: Luton approachable, Lutromage moderately difficult, Lutrasage rare and difficult; tune to neighbouring families using the actual repository schema.
Keep egg presentation consistent with existing type-based egg graphics and shiny inheritance; no bespoke egg art is required unless the current system demands it.
Shiny palette
Desired family-wide shift: cool silver-blue or blue-grey fur, ivory muzzle, blue-lavender and slate accents replacing warm golds where readable; teal-green variations for Lutromage’s cloak; moonlit blue-violet accents for Lutrasage’s purple robes. Crystal and spell effects may shift from violet to ice-blue, but must remain visually identifiable as Psychic. Preserve expressive warm eyes, face contrast and beard readability.
The repository recolours shinies through a palette system. Work should derive the final target hues from current palette keys, verify the transformed output visually, and avoid recolouring white eye reflections and beard into flat blue blocks.

5  |  Repository integration brief for Work
Repo: samuelkenworthy91-byte/Abyssals. Treat paths below as current patterns to recheck against the active branch before applying changes. This ZIP is a creative handoff; it is not a code patch, installable APK, or final reviewed integration.
Source item
Work task / likely destination
Luton_battle.png
Convert / optimise battle portrait into dist/assets/[allocated-id].webp
Lutromage_battle.png
Same battle-art export; retain the green cloak and gentle face
Lutrasage_battle.png
Same battle-art export; preserve long pale beard, full paws, tail and staff
Directional followers
Create each stage’s down/left/up/right sheet in dist/assets/followers/[id].webp, matching current atlas geometry
Species / stats / evolution
Add to live data / roster / evolution modules using unique IDs and current schema
Ability
Reuse Palimpsest as already defined in dist/ability-data.js
Learnset
Map named existing moves to valid move IDs and evolution learn events
Shiny
Configure family palette; visually validate on battle portraits and follower atlas
Encounters and journal
Insert into correct encounter pools and player Field Journal rumours
Audio / move effects
Use existing battle sound / psychic effects; do not create new music just for this family
Implementation and visual QA checklist
Confirm live species IDs, branch state, asset dimensions and file import paths before touching the repository.
Export each full-body illustration with clean alpha, no dark checkerboard, no caption, no scenery or missing limbs; preview at actual in-game battle size.
Follower atlas direction ordering, sprite count and animation pacing must match the existing repo system; test no clipping at each orientation.
Ensure the soft rounded eyes and Lutrasage beard survive resizing, shinies and follower art; compare against the three supplied PNGs.
Verify evolution at 18 and 36, balanced level-up learnsets, correct Psychic typing, existing Palimpsest behaviour, and save compatibility.
Check early encounters are available at the intended point; avoid any invalid map IDs or breaking the existing collection distribution.
Run visual regression in wild battles, trainer battles, journal entry, reserves, breeding, party management and overworld follower mode.
Commit through the project’s normal review flow and build an update-safe signed APK only when explicitly requested.
Explicit exclusions
No new signature move. No custom species music. No speculative new quest, story-evolution trigger or legendary status. No creation of procedural placeholder graphics. No replacement of the approved otter faces with stern or humanoid wizard features.
END OF HANDOFF  •  Three PNGs + One DOCX