MELTELIER
THE BOTANICAL ARTIST  |  GRASS  |  SINGLE STAGE
Production dossier for ChatGPT Work · 1 approved battle-art PNG + 1 DOCX

IMAGE LOCK: Preserve this exact character design and its subdued palette.
Art approval covers the seated pose, contemplative expression, elongated anteater snout, curled moustache, burgundy beret, cream flower, leaf mantle, melting gold-olive sap and brush-shaped tail. Names, combat settings and habitat percentages below are proposals for Work to implement or validate.

01  Core identity and visual lock
Field
Specification
Provisional species name
Meltelier (from “melt” + “atelier”; name not locked)
Type
GRASS, pure mono-type
Evolution
Single stage; no evolution or alternate form
Role
Patient special attacker / restorative support; mid-game uncommon to rare
Category
Botanical Artist Abyssal
Suggested dimensions
1.4 m tall seated; 48 kg (fictional, adjustable)
Art source
Meltelier_Battle_Sprite.png — use unchanged as visual master
Design inspirations
Anteater anatomy; painter and atelier imagery; surreal melting forms; living plants; the eccentric theatricality of Salvador Dalí (influence rather than portrait)

Non-negotiable artwork details
Broadly upright but seated and weighty: confident anthropomorphic character, distinctly an anteater, not a human in costume.
Tail is a SINGLE natural anatomical tail flowing into the artist’s brush: dark-brown rooted tail → gold ferrule/ring → cream bristles projecting upwards and slightly left. No handheld brush, no second brush, no canvas.
Thoughtful, almost serene expression: eyes contentedly closed, curled moustache/tendril, right forepaw touching chin; rounded claws and heavy feet both visible.
Botanical shoulder foliage and cream bloom, leaves layered into cloak, restrained gold-olive melting paint/sap dripping from tail and garment hems.
Muted ochre-gold, forest/olive green, creamy ivory, dark brown, burgundy; NO orchid pink, neon accents, saturated rainbow paint, background props or literal floating clock.
Keep the strong clean silhouette and polished illustrated Abyssals artwork quality of the approved PNG. Do NOT downsample the source into pixel blocks or apply a pixelation filter.
Art file and alpha policy
The approved PNG already carries transparency. Work should inspect alpha edges at the actual in-game rendering size, crop internal transparent margins without clipping any drip or tail arc, retain a high-resolution lossless master, and export a matching optimised WebP using the current repo pipeline. The PNG is supplied as the visual master—not a generated concept-sheet crop.
02  Stat proposal: a thoughtful painter, not a runner
HP
Attack
Defence
Sp. Atk
Sp. Def
Speed
Total
80
65
80
110
105
80
520

The seated, deliberate pose suggests durable and contemplative rather than fast. 110 Special Attack plus 105 Special Defence support a calm, sustained caster; 65 Attack discourages physical builds, while 80 Defence and Speed keep it honest. Total 520 sits beside existing mature Grass species (Olehart 505, Harpbriar 515, Gourbog 515 and Regnacra 510) rather than the 570-point mock-up seen in an illustrative concept page.
This is a single-stage creature, so it has a full adult stat budget immediately; balance its wild encounter levels, capture rate and move unlocks accordingly.
03  Ability suite — existing game abilities
Slot
Ability
Actual repo behaviour
Primary
Medicinal Sap
Healing from its own healing moves is increased by 15%.
Secondary
Camouflage
The first damaging hit after entry is reduced by 15% if it is not super effective.
Hidden
Earthroot
Restores 1/16 max HP at turn end while Grassy or Ground terrain is active.

All three names and definitions were verified against dist/ability-data.js. No brand-new ability is required. Work should verify whether Medicinal Sap also amplifies HP drained by Leaf Spiral and Root Burst; if the engine distinguishes drain from healing moves, preserve existing behaviour rather than changing global mechanics solely for this species.
04  Proposed learnset — existing Abyssals moves
The gameplay principle is to create something beautiful and dangerous without relying on a new attack to function. Levels and move ordering are initial balance proposals; names below use the actual game labels, not borrowed Pokémon terminology.
Level
Move
Type / role / rationale
1
Leaf Burst
GRASS special · first small botanical paint bloom
1
Leaf Cut
GRASS physical · basic brush-tail swipe; early coverage
8
Mind Pulse
PSYCHIC special · surreal visual distortion, optional compatible coverage
14
Leaf Spiral
GRASS special · painterly spiral; recovers 25% of dealt damage
20
Root Ward
GRASS status · grows a shaped sap barrier; +1 Defence
27
Mind Ring
PSYCHIC special · swirling surreal circles; optional coverage
33
Verdant Mend
GRASS status · main restorative tool; heals 50% max HP before ability
40
Root Burst
GRASS special · major signature-like existing attack; 25% drain
47
Long Game
PSYCHIC status · slow contemplation; evasion and Sp. Defence +1
54
Root Spiral
GRASS special · costly flourish; lowers own Speed
60
Kindness Gathers
GRASS status · group-support culmination

Work must confirm level legality and compatible codex/tutor flags before implementation. The line is allowed to have Psychic coverage while remaining pure Grass. Root Burst and Verdant Mend should carry the main battle identity.
Optional new move — concept only; not required for implementation
Living Pigment | GRASS / SPECIAL | Power 80 | Accuracy 100 | PP 15 | 20% chance to lower target accuracy one stage. A highly visual flourish delivered by the tail-brush; 80 power is deliberately below Root Burst (90 power) given the utility effect. Include only if the user approves a genuinely new move; otherwise Work should apply its bespoke art direction to Leaf Spiral or Root Burst without changing move mechanics.
05  Move animation art direction
Important: build original effect graphics with Abyssals’ current higher-detail pixel-art VFX standard; do not reduce the battle portrait to 16-bit art. Animations must read at game speed, with deliberately paced staging rather than screen-filling neon.
Hero sequence: Root Burst / Living Pigment visual family
Phase
Frames / direction
1–3 · Wind-up
The creature remains sitting; tail curls like a poised brush, white bristles point up. One thin olive-gold line takes shape in the air.
4–6 · The stroke
A thick, flowing brushstroke swerves toward the target. Keep the smear organic and coherent, not a generic green projectile.
7–9 · Blossoming impact
Gold-olive paint melts into twisting vines and a single cream flower, then bursts into leaf-shaped fragments at the target.
10–12 · Damage / drain
On Root Burst, a measured stream of golden sap returns to the creature. Only show the HP return when actual drain applies.
13–16 · Settle
The botanical pigment drips, shrinks, and dissolves into the ground, returning the sprite to its static seated posture.

Distinctive visual motifs
Leaf Spiral — painted spirals peel from a brush stroke; golden droplets rotate before collapsing into pale leaves.
Verdant Mend — cream lilies unfurl from the foliage; pools lift and return as small amber motes; healing is legible and gentle.
Root Ward — broad translucent olive brushmarks harden into a root lattice and then retract.
Never make the melt gimmick imply Fire or Poison typing; flowing gold is botanical resin, chlorophyll pigment and sap.
Avoid literal clocks, extra easels, paint tins, canvases, human hands, stock explosion sprites or random water splashes.
06  Habitat, availability and journal
The design belongs in established cultivated/overgrown habitats rather than a random early route. These internal area keys are present in the repo; exact slot weights and route ownership must be checked against the current spawn data before committing.
Location key
Proposed appearance
Placement explanation
orchardCanopy
Lv 26–29; day 3%, night 2%
Artistic wanderer living among blossoms and fruit canopy. Main access route.
orchardVerge
Lv 43–46; day 2%, night 1%
Rare later-game reappearance among intact gardens; not the burned orchard.

Availability policy: include at least one normal, non-quest capture opportunity before the eighth town leader. Rates are suggestions, not current game facts; do not overwrite protected existing encounter slots. If scarcity is too punishing, raise one route to an uncommon encounter rather than adding global random spawns.
Field Journal: rumour and discovery
Unseen rumour: “Some travellers insist the shrubs near the old orchard have begun painting the paths themselves. Golden trails form overnight, though nobody has ever found the artist.”
Sighted: “This quiet Abyssal lives among abandoned gardens. The tip of its remarkable tail resembles a brush, and the shapes it paints can put down roots before the colours have dried.”
Captured: “Meltelier gathers sap, petals and clay into living pigment. It will sit for hours contemplating a single curl of paint. By morning, what appears to be an unfinished picture may have blossomed into a garden.”
Animation, movement and sound identity
Follower: slow waddling on short clawed legs; tail remains upright and does not clip behind character or through walls. Create down/left/up/right rows with 2 frames per direction if the current follower atlas uses that convention.
Idle: occasional slow hand-to-chin movement and one slow drip at tail tip; no unnecessary full-body bounce.
Wild cry (if supported by installed audio layer): low, gentle nasal chirrup followed by a wet, woody brush swish. Do not invent a music file if the game only uses shared battle/background music.
Shiny: replace olive greens with muted cool teal/slate blue, burgundy with plum, and gold sap with pale silver-green. Preserve cream bristles, opaque gold ferrule, fur outlines and contrast. Implement in family palette system.
07  Breeding, capture and collection
Normal non-legendary capture and breeding eligibility; species has no evolutionary relatives and no gender mechanic, consistent with established Abyssals breeding.
Proposed capture rate: 65 (subject to tuning against other one-stage 520-BST species). Do not treat this as an existing game value.
Work must use the existing breeding and Prodigy stat-inheritance rules, egg artwork and acquisition ledger; do not create a bespoke egg visual or a new egg group unless the repo requires one.
Save stability: select a genuinely unused species ID after inspecting current branches, register it in Dex / journal / encounters, and avoid renumbering existing entries.
08  Integration instructions for ChatGPT Work
Priority: do not “improve” or redesign the approved battle PNG. Produce remaining game assets to match it, and do not wire unapproved or mechanically ambiguous additions silently.
1. Verify latest release branch and active species roster. Reserve a new stable ID; do not infer one from this document.
2. Copy master portrait to the art pipeline; produce the expected transparent WebP path (commonly dist/assets/[id].webp) at proper dimensions. Test transparency around fine bristles, sap droplets and leaf tips.
3. Create follower atlas under the existing follower conventions (commonly dist/assets/followers/[id].webp), with directional frames and behaviour appropriate for a short-legged seated creature.
4. Add species stats, typing GRASS, capture metadata and the three existing abilities using current schema. Add a primary ability only if slots have changed, rather than duplicating definitions.
5. Wire level learnset using actual move IDs from live move registry; do not silently invent a new move or substitute Pokémon nomenclature.
6. Add limited, grounded wild slots in orchardCanopy / orchardVerge if legal under story gating; adjust encounter weights proportionally and preserve existing rare/quest residents.
7. Add Field Journal rumours, seen/caught art, sorting and Dex registration, shiny family palette and breeding/reserves compatibility.
8. Commission custom leaf, sap and brushstroke visuals only where appropriate; author original detailed pixel VFX for any new move if separately approved. Verify single and double battles.
9. Test save migration, acquisition, capture, breeding, Prodigy inheritance, shiny rendering, faint/party/follower and every move. Confirm no texture atlas or transparency regression.
10. Produce a small evidence pack: front battle screenshot at real scale, follower walk cycle, shiny preview, encounter check and test results before making a signed APK.
09  Review ledger
Aspect
Status
Exact creature illustration / palette / pose
APPROVED — locked by user
Type and one-stage structure
APPROVED — pure GRASS, single stage
Name Meltelier
PROPOSED — user may rename
520-point stats; abilities; habitat weights
PROPOSED — repo-balanced, not user-locked
Standard Grass and compatible Psychic learnset
PROPOSED — repo move names verified
New Living Pigment move
OPTIONAL ONLY — do not add without approval
Full production implementation
NOT EXECUTED in this dossier

Repository reference at dossier drafting: samuelkenworthy91-byte/Abyssals, files examined include dist/data.js, dist/ability-data.js, dist/biome-biodiversity.js, docs/tide-orchard.md, dist/shiny-palettes.js, dist/companion.js and dist/roster-encounters.js. Those sources may change before Work integrates this design.