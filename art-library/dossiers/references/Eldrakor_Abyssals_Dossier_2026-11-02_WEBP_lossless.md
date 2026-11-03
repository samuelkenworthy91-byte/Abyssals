Eldrakor — Work Dossier
Abyssals | Typing: Dragon | Species: 1
Status: ARTWORK LOCKED • GAMEPLAY PROPOSED • IMPLEMENTATION NOT STARTED
1. Species identity
The following names, combat roles and flavour details are proposed for Work implementation. The battle artwork is approved and locked.
Eldrakor: An ancient sage-dragon whose antlered crown, long beard, and temple tassels suggest a guardian of old mountain shrines. It is contemplative rather than savage, using age, patience and spiritual force to outlast enemies.

2. Evolution
Single-stage species. No evolution proposed.
3. Base stats and balancing
Eldrakor
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
98
88
102
110
117
50
565
Bulky special tank and utility pivot. Slow, but extremely resilient with strong special pressure.
4. Abilities
Ancient Counsel (NEW / PROPOSED): At the end of the first full turn Eldrakor spends on the field, it gains +1 Special Defence and restores 1/16 max HP. This only triggers once per switch-in. If weather is active, the heal becomes 1/12 instead. Removes itself on switching out and does not stack across turns.
Verified existing ability alternatives: Calm Guard — opponents cannot lower Eldrakor’s Special Defence; alternatively Foresight — reduces the first super-effective hit taken after entry by 20%. Both are verified in the current ability registry.
5. Movesets
Move names and core power/accuracy/PP values below were checked against GitHub dist/data.js (commit SHA 744172299e1f02b2b9d5f87a6307062c1e667bc5 on 2 November 2026). The listed levels and species eligibility are proposed; Work must verify the entire merged live move registry, including content modules, and test category-null moves before implementing.
Eldrakor
Level
Verified move
Type
Effect and numeric reference
1
Drake Breath
Dragon
Special, 20% chance Attack +1; Pow 50 / Acc 100 / PP 25
1
Mind Screen
Psychic
Status, Special Defence +1; Pow — / Acc Always / PP 20
8
Drake Spiral
Dragon
Special, 20% chance foe Sp. Def −1; Pow 70 / Acc 100 / PP 20
15
Scale Guard
Dragon
Status, Defence +1; Pow — / Acc Always / PP 15
23
Gale Burst
Flying
Special, 20% chance foe Defence −1; Pow 60 / Acc 100 / PP 25
31
Wyrm Breath
Dragon
Special, 20% chance foe Defence −1; Pow 85 / Acc 100 / PP 15
39
Calm Thought
Psychic
Status, Sp. Attack +1; Pow — / Acc Always / PP 15
47
Second Wind
Normal
Status, restore 25% HP; Pow — / Acc Always / PP 20
56
Aura Wave
Psychic
Special, 20% chance foe Sp. Def −1; Pow 85 / Acc 100 / PP 15
66
Wyrm Roar
Dragon
Special, Speed −1 after use; Pow 120 / Acc 90 / PP 5
6. Habitat and acquisition
Proposed acquisition: a late-game mountain shrine or cloud-peak sanctuary encounter, level 48–52, extremely rare or quest-locked. Could also function as a one-off overworld guardian encounter.
7. Field Journal
Unseen rumour: Some hermits claim a silver-bearded dragon watches ruined shrines and judges the hearts of travellers.
Caught entry: Eldrakor is said to remember every mountain storm it has ever witnessed. It rarely attacks first, but its patience is deeper than stone.
8. Breeding
Single-stage genderless breeding line. Standard Abyssals rules: eligible through the existing no-gender nursery system. Egg output should be its own species.
9. Shiny palette
Shiny palette proposal: indigo scales deepen toward midnight blue, cream fur shifts to pale gold, and all gold ornaments become aged copper-green.
10. Remaining artwork production
Needed later: overworld follower sheets, idle animation with beard/tassel sway, shiny battle sprite, hit flash sheets, and a subtle spiritual aura effect for Ancient Counsel.
11. Technical integration checklist
Allocate one unused live species ID.
Register single-stage species data and encounter source.
Add learnset and battle art manifests.
Create shiny palette and follower assets.
Test Ancient Counsel triggers only once per switch-in.
Confirm journal and breeding entries display correctly.
12. Approval status
LOCKED: the attached battle artwork only.
PROPOSED: names, stat spreads, learnsets, ability design, encounter placement, journal text, shiny palette and implementation details.
Archive status: ZIP prepared for direct upload to the existing Abyssal Dossiers Google Drive folder. Work implementation is separate and has not started.
Implementation source audit (Stage 2)
Source: samuelkenworthy91-byte/Abyssals, core dist/data.js and dist/ability-data.js at the default-branch revisions checked on 2 November 2026. Learnset level assignments remain proposed. Core move names and numeric summaries above were verified, but the merged runtime also imports other content modules; Work must re-check the live registry before committing IDs, abilities, encounter slots, move eligibility or animations.
Stat benchmark: At 565 BST this is intentionally above ordinary final-stage ranges and should be gated like a rare ancient guardian. Compare to the live legendary roster before confirming this value.
Edge cases to test: save migration and no ID reassignment; breeder egg-species output and prodigy inheritance; evo at exact level threshold and late learnset move preservation; overlapping status/ability triggers; double-battle targeting; changing weather and terrain; shiny recolour alpha preservation; battle-to-follower sprite identity. No existing IDs or assets should be overwritten.