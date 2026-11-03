THE LOTUS SQUIRREL LINE
Sprigrel  →  Budrel  →  Thornexus
Work production dossier • 31 October 2026 • Three standalone alpha-transparent battle illustrations supplied in this ZIP
Status: visual direction accepted in chat; names, numeric balancing, signature move and proposed habitats are working suggestions for Work to implement and validate. Do not treat provisional names or IDs as already committed.
1  |  Identity and evolution
Stage
Provisional name
Types
Evolution
I · Base
Sprigrel
GRASS
Hatches / appears wild
II · Middle
Budrel
GRASS
Sprigrel → Budrel at level 24
III · Final
Thornexus
GRASS / POISON
Budrel → Thornexus at level 42

Central visual story
An affectionate, tiny botanical squirrel slowly develops a conspicuous foreign lotus bud at the far end of its tail. What begins as an adorable flower becomes a toxic symbiotic organism. By its final stage the bud has burst open and unfurled powerful, independently moving vines that act as additional limbs. The creature remains unmistakably squirrel-like and visually androgynous, but now looks intimidating, calculating and venomous.
2  |  The three battle image files
File in this ZIP
Artwork target
Non-negotiable
Sprigrel_stage1_battle.png
Cute quadrupedal squirrel
Large expressive eyes, leaf-like tail, pale floral accents; no poison overtone
Budrel_stage2_battle.png
Half-upright transitional squirrel
Distinct, oversized HOT PINK / MAGENTA closed lotus bud at tail end
Thornexus_stage3_battle.png
Androgynous toxic vine fighter
Two lower vine appendages supporting body; others raised to strike

The supplied images are transparent, individual sprite references—not a composite concept sheet. Work should retain their shape, colour logic and proportions. It may clean stray edge pixels and refine stage-III support-vine anatomy without changing the approved creature design.

3  |  Detailed battle-art direction
Stage I — Sprigrel | juvenile botanical squirrel
Small joyful quadruped, bright green leaf fur, warm cream muzzle/chest, spring-green eyes, soft pink buds and tiny white blossoms.
The leafy tail is abundant, fluffy and playful rather than thorny. Keep the character animal-like; avoid putting it in clothes or making it humanoid.
Silhouette must read at small scale, similar to the game’s clean illustrated front battle art (not a low-resolution pixel portrait).
Stage II — Budrel | transitional carrier
Half-anthropomorphic body with squirrel muzzle, expressive eyes, upright stance and thick tail still recognisable.
The tightly closed lotus bud is positioned on the outermost tail end / back-tail junction and is markedly different in colour from the greenery: saturated fuchsia/magenta and deep plum, with pale pink petals.
It remains cute and approachable. The flowering growth should nevertheless look a little invasive and chemically unnatural; the creature itself is not yet Poison-typed.
Stage III — Thornexus | the walking symbiosis
Fully anthropomorphic, ambiguous/androgynous anatomy: angular eyes, upright torso, compact squirrel head, neutral body shape, fierce half-smile. No gender-coded waist/chest styling.
The enormous lotus has BURST OPEN on the back/tail root. Its petals expose a dense, dark purple toxic core; its vines emerge from that core, rather than appearing as random detached tentacles.
At least SIX major vines: exactly two clearly brace the body against the ground, and the remaining four attack/coil in distinctly directed gestures. The vines are physically load-bearing, not simply decoration.
Show raised body height from the two planted lower tendrils; forepaws remain free. Avoid spider legs, mechanical tentacles and excess glossy neon.
Expression: sinister, alert, predatory and intelligent. Keep emerald/lime foliage, ivory fur, hot pink lotus and selectively luminous purple poison sap.
4  |  Shiny and follower art briefs for Work
Normal form palettes carry across all three stages: leaf green, ivory, lotus pink, plum toxic core, violet sap. Shiny proposal: blue-green / turquoise foliage, soft silver fur, amber-gold flower petals, and dark inky-blue sap. Apply a coherent family palette using the existing shiny recolour pipeline; no additional shiny PNG required in this handoff.
Build a directional follower atlas for each species to the repo’s actual convention: down, left, up, right rows with two walk frames per direction. Sprigrel hops; Budrel lopes upright with the tail bud swaying; Thornexus uses its two support vines to rise and walk, while upper vines flex independently. Avoid copying the battle pose into all directions. Check the existing follower renderer before making new art.

5  |  Stats: fast, high-HP and fragile
Design priority is deliberate: very high HP and Speed but much lower Attack, Defence, Special Attack and Special Defence. It survives through timing, recovery and attrition—not raw damage or sturdy defensive stats.
Base stat
Sprigrel
Budrel
Thornexus
HP
55
85
135
Attack
30
35
55
Defence
35
45
55
Sp. Attack
35
40
60
Sp. Defence
35
45
55
Speed
80
105
140
BST
270
355
500

Growth direction (suggested, not tested against the cap-200/prodigy economy): prioritise permanent HP and Speed growth; keep both offences and both defences materially lower. During evolution apply stage-baseline gains without discarding earned growth, inherited Prodigy modifiers, shiny state or move history.
6  |  Signature ability: Symbiotic Bloom
One family-defining ability; Work should map it as the guaranteed/default ability through all three stages unless a later design decision changes that. It combines healing symbiosis with the damage dealt by lingering conditions.
Rule A — double move-based healing
While this Abyssal is on the field, HP restored by HEALING-BASED MOVES used by it or its allied side is doubled. This includes direct healing moves (for example Verdant Mend and Kindness Gathers) and recovery riders on draining attacks (for example Leaf Spiral and Root Burst). A normal 25% recovery becomes 50%; a normal 50% recovery becomes 100%, capped at missing HP. Items, held Berries, passive end-turn regeneration and other abilities do not get doubled. The opponent’s healing is not boosted.
Rule B — damaging-status boost
Damaging status ticks suffered by opposing Abyssals deal 10% more actual damage if the status was applied by this family OR was applied while this Abyssal was active; while the bearer remains active, its allied side also gains the 10% bonus to damaging statuses already affecting foes. This covers poison, badly poisoned and burn ticks, and other status-based residual damage if implemented. Does not change direct attack power, status chance, duration, weather/hazards or damage taken by the allied side.
Stacking and timing — essential test cases
Increase status damage by ×1.10 once, never ×1.21 if two conditions qualify, and never multiply again because two Symbiotic Bloom users are simultaneously active.
For a status inflicted by the bearer, keep its +10% tag when the bearer switches out; if a non-bearer applied the status while the bearer was active, also keep its tag. Untagged statuses lose the on-field aura bonus when no bearer is present.
Apply the 10% after calculating the underlying status tick; obey current immunities and existing status-damage rounding conventions. A non-damaging status (sleep, paralysis) is not a damaging tick.
In doubles, ally healing is boosted and enemy residual status damage is boosted once per target, not per allied creature. If this conflicts with established doubles engine assumptions, Work should keep the above player-approved intent and flag the implementation decision.

7  |  Proposed moveset and battle loop
Core identity: move early, infect enemies, deploy positional vines, heal with Grass moves, and repeatedly wear targets down. Low direct damage keeps it from becoming a fast sweeper despite Speed 140. Retain the game’s existing move IDs when reusing moves.
Lvl / gate
Move (existing game ID)
Role and production note
1
Leaf Cut · 79
Early Grass contact; drains 25% of damage (50% with ability).
1
Quick Wit · 10
Accuracy / sensory discipline.
7
Leaf Burst · 78
Basic Grass special attack.
12
Steady Stance · 12
Speed-building utility.
17
Leaf Spiral · 84
Life-draining Grass special attack.
23
Thorn Guard · 95
Reactive anti-contact protection.
24 (Budrel)
Leaf Grip · 81
Binding the opponent; beginning of vine control.
30
Verdant Mend · 96
Major self heal; double via Symbiotic Bloom.
36
Leaf Lash · 82
Uses tail/budding tendrils.
40
Venom Coat · 143
Latent poison in the closed lotus before Poison typing.
42 (Thornexus)
Nectarbane · NEW
Signature Poison status move; learn immediately on evolution.
46
Noxious Cloud · 135
Poisons all foes; benefits from the status aura.
50
Root Burst · 86
Strongish Grass drain; Sp. Attack remains modest.
56
Kindness Gathers · 97
Doubles-specific team recovery; verify aura interaction.
64
Venom Mist · 146
Poison special move; 30% poison chance.
72
Toxic Veil · 136
Utility and disengagement.

Make each stage inherit appropriate prior-stage moves and populate the relearner. The above schedule is a curated proposal; Work should check move legality, category, learnset consistency and levels in the current live registry.
8  |  Signature move: Nectarbane (new)
Type
Category
Power
Accuracy
PP
POISON
STATUS
—
90%
10

A targeted lotus-spore vine snaps shut around ONE opposing Abyssal, applying ordinary poison if it is eligible. Only when this move successfully inflicts a NEW poison status, the user also restores 1/8 of its maximum HP through pollen/sap siphoning. With Symbiotic Bloom, move-based restoration doubles to 1/4 max HP. No heal if immune, blocked, already statused, dodged or otherwise unsuccessful. Does not inflict badly poisoned status.
This creates an explicit one-time setup opportunity per eligible opponent rather than unlimited 25% healing against an already-poisoned target. Work must allocate a free, collision-safe move ID and author its graphics rather than borrowing a generic poison animation.

9  |  Move animation art direction for Work
Nectarbane — unique 4 × 4 / 16-frame move sheet
Create the current game’s detailed, transparent pixel-art VFX as a sixteen-frame 4×4 sheet at 192×192 per frame / 768×768 total, or follow the latest repo requirements if changed. No full creature is drawn inside these frames. Use a unique silhouette and choreography; do not simply recolour Noxious Cloud or another Poison atlas.
Frames
Visual action
1–3
Two sharply defined lotus-tipped vines enter the target frame from diagonal opposite corners. Their stems are visible and recognisable.
4–6
The vines coil, petals flare open, golden pollen points twist inward; target is held at a definite contact point.
7–9
A single thin magenta venom spine strikes. Show one bright, localised poisonous puncture rather than a screen-filling purple fog.
10–12
A small bloom pulses from the wound. If and only if NEW poison succeeds, light-green nectar threads flow back along the vines.
13–16
Vines uncoil and recoil. Residual small pollen flecks fade; on failure the healing return should be completely suppressed.

Animate the self-healing rider with a distinct source-to-user movement, not a generic glow over the entire screen. Keep frames temporally distinct; the botanical physical action matters more than elemental colour. Respect reduced-motion handling, target direction, single/double battle layouts, and all current move rendering tests.
Other moves / existing graphics
Existing names and effects should use current individual artwork where available; do not create gratuitous replacement effects. For any new family-only animation, match repo style and verify against the actual browser battle screen. In particular Leaf Spiral should read as a draining turning leaf/ribbon, Verdant Mend as calm restoration, Noxious Cloud as a spread effect, and Nectarbane as vines physically seizing the target.
10  |  Overworld ecology, encounter suggestions
Area / room ID
Proposed stage
Level / phase
Rarity direction
Civeton March Meadow · marchMeadow
Sprigrel
Lv 8–10 · day
Rare, sheltered flowering hedges
Subtropical Orchard Canopy · orchardCanopy
Budrel
Lv 26–28 · day/night
Uncommon, fruit trees / root clusters
Orchard Way: Green Return · orchardRenewal
Thornexus
Lv 50–52 · night
Rare, poisonous growth near reclaimed orchard
Fern Gallery · greenFern
Thornexus
Lv 55–61 · night
Very rare, deep root-tangle den

These are ideas using existing room IDs, NOT edits to live encounter tables. Maintain encounter-table weight totals, time windows and evolution-level legality, and avoid accidental encounter inflation. Earlier forms remain accessible well before the eighth leader.

11  |  Field Journal and natural history
Sprigrel — journal text
“It wraps petals around fallen seeds to keep them warm. Gardeners consider its quiet chatter a sign that spring will be gentle.”
Budrel — journal text
“The unopened flower on its tail drinks minerals faster than the squirrel can eat. It remains friendly, even as the bud begins to pulse at night.”
Thornexus — journal text
“Its lower vines lift it above the forest floor while the upper tendrils hunt. The open lotus trades nourishment for venom, and neither partner could now survive alone.”
Rumour progression: unseen silhouette for unknown species; glimpses on routes/trainer encounters; full note and owned/caught state after discovery. Existing Field Journal is the authoritative UI; do not add a separate encyclopaedia module.
12  |  Breeding and general rules
Genderless by game rules; normal two-parent compatible breeding by shared type. Both initial stages are GRASS; final stage adds POISON. The egg hatches into the family’s first stage.
Use existing Grass egg art; no dedicated egg PNG required unless the user later requests a bespoke egg.
Preserve normal shiny odds / shiny breeding bonus, Prodigy stat inheritance and the compounding evolution gains already in the repo. Do not hand-write simplified replacement breeding logic.
Suggested field follower behaviour: Sprigrel playful, Budrel curious but burdened, Thornexus watchful/sinister. Partner interactions use the existing mood/dialogue system.
No custom audio is necessary for the requested dossier. If Work later adds cries, use tiny seed-clicks in stage I, hollow flower rattle in stage II, and rustling vines/low poisoned hiss in stage III; do not replace the global music system.
13  |  Implementation paths and handoff checklist
Treat GitHub as the source of truth. Check live species IDs before allocation: the earlier bat family has provisional #520/#521, and this dossier intentionally reserves NO numeric ID.
Copy converted battle-art WebPs to dist/assets/<assigned-id>.webp. Keep full-res source PNGs in an art-library source folder, not bundled in APK beyond needed runtime art.
Author proper 4-row directional follower atlases at dist/assets/followers/<assigned-id>.webp; use the existing follower renderer and stage motion profiles.
Add an append-only, imported family data module (like existing menagerie/miasma patterns). Register species, stats, growth, stage names, types, ability mappings, learnsets and evolution paths in canonical registries.
Register Symbiotic Bloom in ability-data/ability runtime: healing doubling, allied doubles scope, status provenance and damage-tick bonus, non-stacking, immunities and timing. Write regression tests.
Register Nectarbane as a new Poison STATUS move with dedicated 16-frame effect art/choreography, and explicit success-only healing branch. Test in single and double battles.
Add curated habitats to actual room encounter pipelines, regenerate Field Journal habitat data, register shiny family hue mapping, ensure offline PWA asset manifest, thumbnails and Dex/art source mapping.
Test evolution level gating and no ability/status double-stacking; verify shiny front and walking variants, breeding, save migration, reserve, permanent death and journal tracking. Preserve package/signing; only produce a signed APK if separately requested.