Mindlarv → Oraculuna — Work Dossier
Abyssals | Typing: Bug / Psychic | Species: 2
Status: ARTWORK LOCKED • GAMEPLAY PROPOSED • IMPLEMENTATION NOT STARTED
1. Species identity
The following names, combat roles and flavour details are proposed for Work implementation. The battle artwork is approved and locked.
Mindlarv: A dreamy larval Abyssal with oversized eyes and petal-like winglets patterned like staring sigils.

Oraculuna: Its evolution becomes a luminous prophet-moth whose wings resemble watchful eyes and ritual markings.

2. Evolution
Proposed level 32 evolution. Alternative option: evolve while knowing a Psychic-type move if Work wants stronger theming.
3. Base stats and balancing
Mindlarv
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
55
35
50
65
72
48
325
Frailer juvenile with early special utility.
Oraculuna
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
82
54
72
118
110
79
515
Special control attacker with high utility and good special bulk.
4. Abilities
Third Eye (NEW / PROPOSED): The first time this Abyssal uses a status move after entering battle, its accuracy cannot be lowered for that move and the move gains +1 priority. Once used, the bonus is spent until it switches out.
Verified existing ability alternatives: Foresight — reduce the first super-effective hit taken after entry by 20%; Keen Sense — opponents cannot lower accuracy. Both are verified existing abilities.
5. Movesets
Move names and core power/accuracy/PP values below were checked against GitHub dist/data.js (commit SHA 744172299e1f02b2b9d5f87a6307062c1e667bc5 on 2 November 2026). The listed levels and species eligibility are proposed; Work must verify the entire merged live move registry, including content modules, and test category-null moves before implementing.
Mindlarv
Level
Verified move
Type
Effect and numeric reference
1
Mind Pulse
Psychic
Special, 20% chance foe Sp. Def −1; Pow 40 / Acc 100 / PP 35
1
Chitin Cut
Bug
Physical, 20% chance foe Sp. Attack −1; Pow 40 / Acc 100 / PP 35
7
Chitin Burst
Bug
Special, 20% chance foe Defence −1; Pow 65 / Acc 100 / PP 20
13
Mind Burst
Psychic
Special, 20% chance foe Sp. Def −1; Pow 65 / Acc 100 / PP 20
19
Mind Screen
Psychic
Status, Special Defence +1; Pow — / Acc Always / PP 20
Oraculuna
Level
Verified move
Type
Effect and numeric reference
1
Chitin Burst
Bug
Special, 20% chance foe Defence −1; Pow 65 / Acc 100 / PP 20
1
Mind Screen
Psychic
Status, Special Defence +1; Pow — / Acc Always / PP 20
24
Future Read
Psychic
Status, next move cannot miss; Pow — / Acc Always / PP 15
30
Chitin Spiral
Bug
Special, 10% chance poison; Pow 90 / Acc 100 / PP 15
36
Mind Spiral
Psychic
Special, 20% chance Sp. Attack +1; Pow 75 / Acc 100 / PP 20
42
Long Game
Psychic
Status, evasion & Sp. Def +1; Pow — / Acc Always / PP 15
49
Aura Crush
Psychic
Special, 10% chance confuse; Pow 90 / Acc 100 / PP 15
58
Aura Ring
Psychic
Special, 20% chance Sp. Attack +1; Pow 95 / Acc 95 / PP 10
6. Habitat and acquisition
Proposed habitat: moonlit groves, observatory routes, or night-only flower meadows. Mindlarv could appear at levels 12–18; evolved form either absent in the wild or very rare around levels 36–40 at night.
7. Field Journal
Unseen rumour: Travellers say tiny winged larvae gather around lanterns and stare as though listening to thoughts.
Caught entry: Oraculuna drifts silently above blooming fields. Villagers treat the patterns on its wings as omens, though the creature itself is calm and curious.
8. Breeding
Standard genderless breeding rules. Egg species should be Mindlarv. Prodigy inheritance unchanged.
9. Shiny palette
Shiny palette proposal: lavender shifts to teal and pearl, eye-spots glow cyan instead of magenta, and the body fur becomes soft silver.
10. Remaining artwork production
Needed later: follower sheets with wing flutter loops, shiny sprites, particle effects for status dust, and a subtle eye-glyph effect when Third Eye activates.
11. Technical integration checklist
Allocate two live species IDs and an evolution link.
Hook stage art, learnsets and breeding data.
Implement / map Third Eye if approved.
Place Mindlarv in night encounter tables.
Test status-move priority interaction thoroughly.
12. Approval status
LOCKED: the attached battle artwork only.
PROPOSED: names, stat spreads, learnsets, ability design, encounter placement, journal text, shiny palette and implementation details.
Archive status: ZIP prepared for direct upload to the existing Abyssal Dossiers Google Drive folder. Work implementation is separate and has not started.
Implementation source audit (Stage 2)
Source: samuelkenworthy91-byte/Abyssals, core dist/data.js and dist/ability-data.js at the default-branch revisions checked on 2 November 2026. Learnset level assignments remain proposed. Core move names and numeric summaries above were verified, but the merged runtime also imports other content modules; Work must re-check the live registry before committing IDs, abilities, encounter slots, move eligibility or animations.
Stat benchmark: Oraculuna at 515 BST is comparable to Gourbog (515) and other established evolved specialists, but invests more heavily in Sp. Attack and Sp. Defence.
Edge cases to test: save migration and no ID reassignment; breeder egg-species output and prodigy inheritance; evo at exact level threshold and late learnset move preservation; overlapping status/ability triggers; double-battle targeting; changing weather and terrain; shiny recolour alpha preservation; battle-to-follower sprite identity. No existing IDs or assets should be overwritten.