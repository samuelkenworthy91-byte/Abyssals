FIELD JOURNAL  •  FAMILY DESIGN / HANDOFF
Cinderoot  →  Blazebramble
GRASS / FIRE   •   TWO STAGES   •   APPROVED BATTLE ART
A woodland fire-forager becomes a massive wildfire boar: living leaf armour, heavy tusks, ember-plated crest and a tail flame that announces its charge. The family is a slow physical bruiser designed around alternating Grass and Fire attacks.

CINDEROOT

BLAZEBRAMBLE
Status: LOCKED battle artwork and Grass/Fire typing; all gameplay, names and acquisition values in this document are PROPOSED pending user approval. No repository integration or APK build has occurred.
ARCHIVE CONTENTS
DESIGN BASIS
Cinderoot_battle.png • Blazebramble_battle.png • this editable .docx
GitHub main inspected 01 November 2026; source details and implementer checklists included.


1  Species identity & artistic direction
Cinderoot — the Kindling Piglet
Typing: Grass / Fire. A muscular but compact piglet with a reddish-brown coat, expressive amber eyes, pale whiskered cheeks, small ivory tusks, amber-burning leaf crown, green veined shoulder leaves and a tapered ember tail. Curious and confrontational, it uproots charred scrub and carries seeds beneath leaf plates. The approved image is the visual source of truth.
Blazebramble — the Wildfire Boar
Typing: Grass / Fire. The boar develops enormous ivory curling tusks, broad shoulders and split dark hooves. A layered emerald leaf mantle covers its back; heated amber-crimson plates rise from the crest; burning vein-like fissures appear in its dark hide. Its tail carries a dramatic flame. It acts as an ecological firebreak, tearing through dead undergrowth to allow fresh shoots through the ash. It is not a Fire/Rock creature despite the fissures.
2  Evolution
Source
Method
Result / validation
Cinderoot
LEVEL at 36 or higher, ordinary level-up
Blazebramble. No item, location, time, weather or leader-choice gate is required. Proposed.

Engineering condition: implement the ordinary level threshold in the existing evolution registry. Preserve evolution cancel/deferral, progression bonus carryover, growth rates, stat promotion and any prior-save behaviour. Evolution must neither depend on the spare/execute story branch nor overwrite unrelated family rules.
3  Base stats and balancing
Stat
Cinderoot
Blazebramble
Design intent
HP
62
102
Survive a hit and remain on the field
Attack
72
123
Primary physical damage stat
Defence
58
100
Physical bruiser, not an invulnerable wall
Special Attack
46
62
Weaker special alternative
Special Defence
60
82
More vulnerable to special pressure
Speed
46
46
Deliberately slow in both stages
TOTAL
344
515
All six stats summed; proposed targets

Live-role comparisons: Searwaste (Ground/Fire, 515), Gourbog (Grass/Poison, 515), Harpbriar (Grass/Ghost, 515) and Ragegill (Water/Fire, 500) establish the surrounding power band in the source catalogue. Blazebramble is physically stronger than many mixed attackers but much slower, has only 62 Special Attack, and remains vulnerable to Rock, Flying and Poison attacks. Ensure the engine’s actual type chart is used for weaknesses, not assumptions from another game.

4  Abilities — current options and bespoke proposal
Slot
Ability
Status
Exact effect
Primary
Thornhide
EXISTING
Contact attacker loses 1/16 of its own maximum HP.
Secondary
Sunstride
EXISTING
Holder Speed ×1.5 in harsh sunlight under the live weather rules.
Hidden
Bramble Furnace
NEW / PROPOSED
A damaging Grass move primes the next physical Fire move for +20% damage. Full rules below.

Bramble Furnace — implementation specification
Trigger. After an actively selected damaging Grass-type move deals positive direct HP damage to at least one opposing living target, grant one Fuel token to the holder. One token maximum, even for multi-hit or multi-target moves. A substitute taking damage does not count as HP damage. Reflected or residual damage, free ability attacks and damage from allies do not count.
Consumption. When the holder executes its next actively selected PHYSICAL damaging Fire-type move while Fuel is present, consume Fuel after PP and target validation, then multiply that attack’s direct damage by 1.20 under the engine’s damage-multiplier rules. Do not multiply burn odds, secondary effects, self-damage/recoil, entry hazards or post-hit statuses. One selection consumes only one Fuel, regardless of the number of targets or strikes.
Expiry. Fuel lasts through at most two subsequently completed actions taken by the holder. The first legal qualifying Fire action consumes it. If the holder finishes a second nonqualifying action without using it, remove it; switching out, fainting or battle end also removes it. The action that created Fuel does not count towards expiry. A skipped/paralysed/sleep-prevented action counts only if the engine marks it as a completed turn action; Work must apply a consistent rule and test it.
Failed attacks. A selected qualifying Fire move that executes but misses, hits protection or an immune opponent still spends Fuel. An invalid target selection or insufficient PP does not spend Fuel. Only the holder’s own moves can trigger or consume its Fuel. No Fuel is persisted as a permanent species stat.
Interaction constraints. Weather, STAB, critical hits, accuracy and the normal ±6 stat-stage cap are not modified by the ability. Its boost can coexist with weather and other legal damage effects without repeating the trigger. Standard switching/ability-loss rules clear Fuel. The hidden ability should not coexist with Thornhide/Sunstride on the same unit unless game-wide ability mechanics explicitly permit it.
Why this role is distinct
The family is not a generic Fire damage amplifier. Its best damage comes from deliberately landing a Grass attack and then committing to a predictable physical Fire strike while its modest Speed leaves it exposed. Physical bulk lets it attempt the sequence, but it has no automatic healing, immunity or guaranteed burn. The existing alternatives favour contact retaliation or a faster weather-dependent build instead.

5  Level-up learnset — verified existing moves
These move names, types, power, accuracy, PP and effects are from the source-backed dist/data.js catalogue. They are suggested LEARNSET ENTRIES, not claims that the new family is currently able to learn them. A dash is a status move with no base power. The later form retains legally learned earlier moves under the game’s existing relearning rules.
Stage
Level
Move
Type
Class
Pow/Acc/PP
Purpose / effect
Cinderoot
Lv 1
Plain Rush
Normal
Physical
60 / 100 / 25
20% chance to raise user Speed 1
Cinderoot
Lv 1
Leaf Cut
Grass
Physical
40 / 100 / 35
Restore 25% of actual HP damage dealt
Cinderoot
Lv 7
Ash Pounce
Fire
Physical
40 / 100 / 35
10% chance to burn
Cinderoot
Lv 12
Leaf Grip
Grass
Physical
55 / 100 / 25
20% chance to lower foe Defence 1
Cinderoot
Lv 18
Ash Fang
Fire
Physical
65 / 100 / 20
No secondary effect
Cinderoot
Lv 24
Root Ward
Grass
Status
— / Always / 20
Raise user Defence 1
Cinderoot
Lv 30
Ash Rush
Fire
Physical
60 / 100 / 25
30% burn; user 1/10 recoil
Blazebramble
Lv 36
Root Lash
Grass
Physical
85 / 100 / 15
No secondary effect
Blazebramble
Lv 40
Cinder Pounce
Fire
Physical
85 / 100 / 15
30% burn; user 1/10 recoil
Blazebramble
Lv 46
Thorn Guard
Grass
Status
— / Always / 15
Contact retaliation 1/8 HP, 5 turns (live rules)
Blazebramble
Lv 52
Root Cut
Grass
Physical
80 / 100 / 15
20% chance to lower foe Defence 1
Blazebramble
Lv 58
War Flame
Fire
Status
— / Always / 20
Attack +1, Speed +1; costs 1/8 max HP
Blazebramble
Lv 64
Cinder Rush
Fire
Physical
110 / 90 / 5
User Speed drops 1 after use
Blazebramble
Lv 70
Root Fang
Grass
Physical
120 / 90 / 5
User takes 1/8 max HP recoil

Design restrictions: preserve existing move IDs and core mechanics; do not invent new move IDs, signature attacks or animations. Confirm ability-compatible status and PP behaviour before adding the rows. A smaller number of legal Codex options may be offered separately without crowding the learnset. If attack animations for any of these already exist, reuse the approved animation instead of generating redundant replacements.

6  Habitat, rarity and acquisition
Species
Location / progression
Levels
Proposed encounter rate
Cinderoot
North Scrub Road (room northRoad), dry thickets beyond Dorelem. Use the canonical route map and actual day/night tables.
20–26
Day 5%; night 7%
Blazebramble
Obtain by evolution only, level 36+. No ordinary wild slot.
36+
0% ordinary wild

These are targeted location/weight proposals, not a claim that current encounter tables already contain the family. Work must inspect every route-composition layer and preserve pre-existing slots, quest guardians, special encounters, rarity percentages and early-game level ceilings. Avoid injecting globally. Cinderoot being available before the eighth leader preserves the Field Journal’s acquisition target. If North Scrub Road distribution has changed, select a reachable dry woodland or firebreak map of comparable progression rather than an inaccessible late area.
7  Field Journal — staged observations
Keep the verified journal progression: unknown silhouette → seen in a legitimate battle/simulation/trainer sighting → owned/caught and living status where appropriate. Do not reveal caught-level ecology or permanent ownership merely from a rumour. Follower and trainer sightings should call the existing record functions.
Cinderoot
Unseen silhouette cue (PROPOSED). A low boar-like outline, short tusks, sloping back and a thin flicker at the tail tip. Actual display conditional on the live journal’s unknown state.
Sighting rumour. “Someone has been turning over the scorched scrub. At night the tracks glow for a moment, then go dark.”
Owned entry. Cinderoot burrows beneath old charcoal beds, pulling dormant seeds into the warm ash. When frightened, it lights the leaves along its spine before it attempts to charge.
Blazebramble
Unseen silhouette cue (PROPOSED). An enormous bowed head with curved tusks, shoulder leaves and a fire-tipped tail; reveal only under normal discovery conditions.
Sighting rumour. “The firebreak keeper swears a tusked beast tore an entire stand of dead briar out by its roots. Green shoots followed the next week.”
Owned entry. Blazebramble carves lanes through dying forests and kindles the debris in its own wake. The blaze rarely reaches healthy saplings; its broad leaf mantle absorbs and stores the heat.
Ecology and trainer hints
Cinderoot is curious and forages in small family groups; Blazebramble is territorial and guards a patch of recovering woodland. Optional trainer chatter can imply that it deliberately opens firebreaks. Keep both Stage entries factual and grounded rather than claiming supernatural divine status. Names and all text remain proposed.

8  Breeding and Prodigy compatibility
Use the existing genderless two-parent breeding system; do not introduce genders, egg groups or special breeding restrictions. Same-family pairing automatically pools the parents’ eligible Prodigy stats. Ordinary cross-family rules, selected parent species result, nursery items, and 50% egg-species selection where applicable continue unchanged. Eggs hatch into the chosen birth form, not directly into evolved Blazebramble unless the existing engine specifically supports that species outcome. Parents’ original Prodigy advantages may inherit; evolution copies and unrelated training bonuses must not be inherited twice.
Current verified mechanic
Integration requirement
Progeny stat inheritance
Independent per eligible stat, baseline chance (1/750)^(1/6) ≈ 33.176%; preserve existing stronger-bonus overlap rules.
Items and paid care
Family Seal, Heirloom Charm, Prodigy Feed, Inheritance Thread and Brooding Warmer use existing purchase/consumption and step effects.
Evolution compounding
Carry the original inherited growth bonus through one completed evolution using the established prodigy evolution multiplier.
Save compatibility
Legacy parents/eggs persist without re-rolling. Old saved party, reserve, death and memorial records remain valid.

9  Shiny palette — proposed art brief
Stage
Alternative colour direction
Cinderoot
Deep smoke-grey hide, muted copper tusks, plum-green leaf mantle with blue-green veins, pale peach eyes and soft turquoise ember tips.
Blazebramble
Charcoal plum-brown torso, dark amethyst leafy mane, silver-ivory tusks, aged-bronze leaf edges and restrained pale teal/tangerine flame gradients.

Use a single family-level deterministic recolour profile compatible with the OKLab shiny pipeline; preserve alpha bytes, ink lines, pale highlights and visible armour depth. Both sprites must feel related. Work creates shiny exports later, not inside this approved-art ZIP.
10  Remaining artwork production
Approved battle art source: the two separate PNGs in this ZIP. Do not redraw, rescale destructively or change anatomy; create game-format derived WebP only if the live asset pipeline requires it. Keep full silhouette, tusks, hooves and entire flaming tail visible.
Directional follower animation: audit current 2-column × 4-row or equivalent top-down layout and implement idle/walk frames for down, left, up and right, with left/right facing authored rather than mirrored where the mane demands it. Small stage hops with tail sparks; evolved stage heavy hooffalls, moving leaf mantle and ember trails.
Shiny variants: use the proposed coordinated profile on combat and directional follower frames; test ordinary and shiny assets on light/dark backgrounds. No palette collisions with atlas neighbours.
Bramble Furnace effect (new only if hidden ability approved): brief green leaf-vein pulse from shoulders on Grass damage, one orange ember accumulating beneath crown, then a tight orange-tusk flash at the Fire hit. No full-screen generic explosion, and no reused attack animation.
Sound cues: dry leaf-rustle with juvenile snort, bass-heavy boar snarl/hoof impact for evolution, quiet crackling flame on ability trigger. Ensure low-volume and reduced-motion alternatives, no audio clipping or endless loops.

11  Technical integration — Work checklist
Re-open main and compute all live species IDs after dynamically installed families. Allocate two unused append-only stable numeric IDs and one family identifier; never renumber, recycle or overwrite existing species. Add dex/journal entries without invalidating prior 479+ journal state.
Register Cinderoot and Blazebramble with GRASS/FIRE in both stages; implement exact proposed base stat keys (hp, attack, defence, sp_attack, sp_defence, speed) and recheck 344/515 totals.
Add evolution LEVEL ≥36 through the actual evolution-data pipeline; test cancel, deferred level-up, low-level premature trigger, saving/reloading and inherited evolution bonuses.
Primary/secondary ability slots should refer to verified Thornhide and Sunstride IDs after checking the current ability registry. Hidden Bramble Furnace is NEW / PROPOSED: author its glossary, battle hook, side-effect timing, UI tooltip and tests only after implementation approval.
Attach only verified existing move IDs to two level-up learnsets; preserve original data, PP, category, accuracy, targeting, effect visuals and player-relearn compatibility.
Add Cinderoot to vetted North Scrub Road room-phase weighted encounter tables, preserving the existing total and day/night split. Leave Blazebramble evolution-only unless a subsequent explicit decision changes that.
Install transparent combat art in the expected per-ID path, update manifests and offline PWA asset lists, generate illustrated directional follower frames in the correct layout and validate dark/light displays.
Register one coherent shiny profile for the family; ensure combat portraits, followers, summary, breeding and journal all resolve the identical colour direction without alpha loss.
Integrate journal rumours, seen/owned/living changes, location index, breeding outcomes, egg previews, ability-slot inheritance and growth system; ensure all three battle formats (single, double, partner) remain stable.
Preserve save migration, old deaths and equipment, capture-to-reserve decision, Android signing, package identity and offline PWA operation. Never build or publish an APK merely because this dossier exists.
Required QA edge cases
Area
Specific checks
Combat
Grass hit primes one Fuel; 0 actual HP damage does not; next physical Fire action consumes it; partial/multi-hit/spread actions count once; 20% factor calculated once.
Lifetime
Fuel clears at switch/faint/battle end; two subsequent actions expire it; interrupted actions follow consistent engine semantics; ability swaps cannot duplicate it.
Type and weather
Both stages remain GRASS/FIRE; no implied Ground/Rock type; sunlight boost and Sunny/Weather suppression interact without double counting.
Evolution and saves
Save/load before and after evolution, parent bonus inheritance, levels 35/36+, full party/reserve, shiny flag, dead holder.
Art and field
Both normal/shiny fronts, directional followers, silhouettes at actual phone size, journal unknown/seen/owned, encounter rates and dark backgrounds.


12  Approval ledger and implementation boundary
Component
Status
Instruction
Cinderoot battle PNG
LOCKED
Exact approved full-body art; SHA-256 below.
Blazebramble battle PNG
LOCKED
Exact approved full-body art; SHA-256 below.
Two-stage family
LOCKED
Two evolutionary stages and Grass/Fire for the family.
Species names
PROPOSED
Cinderoot and Blazebramble; rename only if user wishes.
Evolution level 36
PROPOSED
Check against late-game pacing.
344 / 515 base-stat totals
PROPOSED
Balanced against inspected live comparators; re-audit before commit.
Thornhide / Sunstride
PROPOSED
Existing abilities; main/secondary slots require user approval.
Bramble Furnace
NEW / PROPOSED
Full mechanics in Section 4; not an existing ability.
Moves, habitats, journal, shiny
PROPOSED
Do not assume gameplay proposals have been approved.
Implementation
NOT STARTED
Work must receive separate explicit authorization to modify repository/build.

Approved-art integrity record
Cinderoot_battle.png — SHA-256: 759c64e874980e57af09bcf552f49063d5bcf0f540e4937d04b1151fb5a1dfb1
Blazebramble_battle.png — SHA-256: 49505651fca2fba20e803775e6986e1984526643b7eaf43aeae4a0a61c5c3ef2
Live repository references inspected
Species, source moves & stat comparator catalogue — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/data.js
Existing ability descriptions — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/ability-data.js
Evolution condition schema — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/evolution-data.js
Staged journal discovery — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/field-journal.js
Encounter extension and routing — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/roster-encounters.js
Newer move additions — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/dist/tide-orchard-data.js
Prodigy breeding inheritance — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/docs/prodigy-breeding.md
Shiny renderer and family palette rules — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/docs/shiny-audit-notes.md
Nursery item effects — https://github.com/samuelkenworthy91-byte/Abyssals/blob/main/docs/nursery-stewardship.md
Source snapshot: GitHub default branch main, consulted 01 November 2026. This is a design handoff, not evidence that the new species are registered in the runtime. Verify source again at implementation because game data can change.