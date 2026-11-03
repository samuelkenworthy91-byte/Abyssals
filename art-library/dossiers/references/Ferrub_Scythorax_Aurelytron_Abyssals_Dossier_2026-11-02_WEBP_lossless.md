Ferrub → Scythorax → Aurelytron — Work Dossier
Abyssals | Typing: Bug / Steel | Species: 3
Status: ARTWORK LOCKED • GAMEPLAY PROPOSED • IMPLEMENTATION NOT STARTED
1. Species identity
The following names, combat roles and flavour details are proposed for Work implementation. The battle artwork is approved and locked.
Ferrub: A compact steel-plated larva with heated seams glowing between its plates.

Scythorax: The middle stage becomes a predatory warrior-beetle with long cutting forelimbs and a rising stag-beetle crown.

Aurelytron: Its final form is a regal armoured beetle knight—fast, lethal and visually inspired by the coolest classic Bug/Steel monsters without copying them.

2. Evolution
Proposed level 24 into Scythorax and level 42 into Aurelytron.
3. Base stats and balancing
Ferrub
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
50
58
72
25
48
37
290
Bulky little larva with low power.
Scythorax
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
70
95
90
35
65
80
435
Aggressive mid-stage physical attacker.
Aurelytron
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
82
128
102
42
76
95
525
Fast physical sweeper with good armour and pressure.
4. Abilities
Molten Carapace (NEW / PROPOSED): When hit by a contact move, the attacker takes 1/12 max HP damage. If Ferrub/Scythorax/Aurelytron used a Steel-type move on its previous turn, the return damage becomes 1/8 instead. Does not stack with Rocky Helmet-like effects unless Work chooses to allow it.
Verified existing ability alternatives: Bulwark — contact damage reduced by 20%; Siege Breaker — removes opponent Reflect/Light Screen after dealing direct damage; Countercharge — +1 Attack after first contact hit per switch-in. All verified existing.
5. Movesets
Move names and core power/accuracy/PP values below were checked against GitHub dist/data.js (commit SHA 744172299e1f02b2b9d5f87a6307062c1e667bc5 on 2 November 2026). The listed levels and species eligibility are proposed; Work must verify the entire merged live move registry, including content modules, and test category-null moves before implementing.
Ferrub
Level
Verified move
Type
Effect and numeric reference
1
Plain Strike
Normal
Physical, no secondary effect; Pow 40 / Acc 100 / PP 35
1
Open Guard
Normal
Status, Defence +1; Pow — / Acc Always / PP 15
6
Chitin Cut
Bug
Physical, 20% chance foe Sp. Attack −1; Pow 40 / Acc 100 / PP 35
12
Iron Claw
Steel
Physical, 10% chance flinch; Pow 50 / Acc 100 / PP 25
18
Plain Swipe
Normal
Physical, high critical-hit ratio; Pow 65 / Acc 100 / PP 20
Scythorax
Level
Verified move
Type
Effect and numeric reference
1
Chitin Cut
Bug
Physical, 20% chance foe Sp. Attack −1; Pow 40 / Acc 100 / PP 35
1
Iron Claw
Steel
Physical, 10% chance flinch; Pow 50 / Acc 100 / PP 25
24
Chitin Needle
Bug
Physical, 20% chance Speed +1; Pow 60 / Acc 100 / PP 25
28
Gale Cut
Flying
Physical, 20% chance flinch; Pow 40 / Acc 100 / PP 35
33
Iron Strike
Steel
Physical, 10% chance flinch; Pow 75 / Acc 100 / PP 20
38
Chitin Claw
Bug
Physical, no secondary effect; Pow 75 / Acc 100 / PP 20
Aurelytron
Level
Verified move
Type
Effect and numeric reference
1
Iron Strike
Steel
Physical, 10% chance flinch; Pow 75 / Acc 100 / PP 20
1
Chitin Claw
Bug
Physical, no secondary effect; Pow 75 / Acc 100 / PP 20
42
Shed Shell
Bug
Status, Speed +1 and cures stat drops; Pow — / Acc Always / PP 15
47
Chitin Crash
Bug
Physical, 20% chance foe Sp. Attack −1; Pow 85 / Acc 100 / PP 15
52
Steel Cut
Steel
Physical, high critical-hit ratio; Pow 80 / Acc 100 / PP 15
58
Chitin Bite
Bug
Physical, 20% chance Speed +1; Pow 100 / Acc 95 / PP 10
64
Forge Focus
Steel
Status, Attack +1; Pow — / Acc Always / PP 15
6. Habitat and acquisition
Proposed route family: Ferrub in scrapyard grass, hot canyon routes or rusted fort outskirts (levels 10–16); Scythorax rare in the wild around 28–32; Aurelytron usually only by evolution or a late-game rare encounter.
7. Field Journal
Unseen rumour: Shards of shed metal shell are found where swarms of little beetles gather near old machinery.
Caught entry: As it matures, the Ferrub line forges heavier armour from minerals and discarded metal. Aurelytron duels rivals with almost knightly precision.
8. Breeding
Standard genderless breeding. Egg species Ferrub. No exceptions to prodigy inheritance rules.
9. Shiny palette
Shiny palette proposal: warm bronze trim shifts to electric cobalt, dark body to charcoal blue, and glowing seams to neon cyan.
10. Remaining artwork production
Needed later: follower sheets, wing-open attack frames, shiny sprites, spark-trail slash effects, and a contact-flare flash for Molten Carapace.
11. Technical integration checklist
Allocate three species IDs and evolution links.
Register learnsets and art assets.
Implement Molten Carapace if approved.
Place Ferrub in early-mid encounters and confirm evolved rarity.
Test contact damage interactions and speed-based sweeper balance.
12. Approval status
LOCKED: the attached battle artwork only.
PROPOSED: names, stat spreads, learnsets, ability design, encounter placement, journal text, shiny palette and implementation details.
Archive status: ZIP prepared for direct upload to the existing Abyssal Dossiers Google Drive folder. Work implementation is separate and has not started.
Implementation source audit (Stage 2)
Source: samuelkenworthy91-byte/Abyssals, core dist/data.js and dist/ability-data.js at the default-branch revisions checked on 2 November 2026. Learnset level assignments remain proposed. Core move names and numeric summaries above were verified, but the merged runtime also imports other content modules; Work must re-check the live registry before committing IDs, abilities, encounter slots, move eligibility or animations.
Stat benchmark: Aurelytron at 525 BST sits above many ordinary final stages. It should be rare or late-evolving, with stronger balancing tests around physical damage and speed.
Edge cases to test: save migration and no ID reassignment; breeder egg-species output and prodigy inheritance; evo at exact level threshold and late learnset move preservation; overlapping status/ability triggers; double-battle targeting; changing weather and terrain; shiny recolour alpha preservation; battle-to-follower sprite identity. No existing IDs or assets should be overwritten.