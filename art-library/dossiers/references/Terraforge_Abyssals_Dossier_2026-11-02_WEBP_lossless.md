Terraforge — Work Dossier
Abyssals | Typing: Ground / Steel | Species: 1
Status: ARTWORK LOCKED • GAMEPLAY PROPOSED • IMPLEMENTATION NOT STARTED
1. Species identity
The following names, combat roles and flavour details are proposed for Work implementation. The battle artwork is approved and locked.
Terraforge: A one-stage excavation behemoth combining burrowing reptile anatomy with wheel-and-drill industrial armour. It looks far more engineered and monumental than the project's earlier Ground/Steel concepts.

2. Evolution
Single-stage species. No evolution proposed.
3. Base stats and balancing
Terraforge
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
100
112
128
45
84
41
510
Physical tank and hazard-breaker. Immense armour, poor speed, low special output.
4. Abilities
Bedrock Engine (NEW / PROPOSED): On switch-in, Terraforge becomes immune to forced movement / phazing for 3 turns and the first Ground-type attack it uses gains 20% extra power. The power bonus is consumed on use.
Verified existing ability alternatives: Firm Stance — opponents cannot force it out; Stoneplate — critical-hit damage taken is reduced by 25%; Waystone Master — entry-hazard resistance and clearing. All verified existing.
5. Movesets
Move names and core power/accuracy/PP values below were checked against GitHub dist/data.js (commit SHA 744172299e1f02b2b9d5f87a6307062c1e667bc5 on 2 November 2026). The listed levels and species eligibility are proposed; Work must verify the entire merged live move registry, including content modules, and test category-null moves before implementing.
Terraforge
Level
Verified move
Type
Effect and numeric reference
1
Dune Break
Ground
Physical, 20% chance foe Defence −1; Pow 45 / Acc 100 / PP 35
1
Iron Claw
Steel
Physical, 10% chance flinch; Pow 50 / Acc 100 / PP 25
10
Stone Rush
Rock
Physical, 20% chance foe Defence −1; Pow 50 / Acc 100 / PP 25
18
Dune Crash
Ground
Physical, 20% chance Defence +1; Pow 55 / Acc 100 / PP 25
26
Iron Strike
Steel
Physical, 10% chance flinch; Pow 75 / Acc 100 / PP 20
34
Burrow Calm
Ground
Status, evasion +1; Pow — / Acc Always / PP 15
41
Stone Footing
Ground
Status, resist flinch/forced switching 5 turns; Pow — / Acc Always / PP 15
48
Earth Crash
Ground
Physical, 20% chance foe Defence −1; Pow 95 / Acc 95 / PP 10
55
Steel Lance
Steel
Physical, 10% chance flinch; Pow 100 / Acc 95 / PP 10
63
Earth Surge
Ground
Physical*, 1/8 HP recoil; confirm category in live data; Pow 120 / Acc 90 / PP 5
6. Habitat and acquisition
Proposed location: mine routes, machine ruins, or a quarry below a late-midgame industrial zone. Encounter as a rare overworld threat or uncommon cave spawn around levels 38–44.
7. Field Journal
Unseen rumour: Deep tunnels sometimes collapse overnight, leaving behind smooth drill spirals in the walls.
Caught entry: Terraforge reshapes old stone with relentless patience. Moss often grows across its armour when it lies dormant beneath the earth.
8. Breeding
Single-stage genderless line. Egg species remains Terraforge. No special breeding exceptions proposed.
9. Shiny palette
Shiny palette proposal: steel becomes dark gunmetal with verdigris brass details, and exposed stone warms toward red granite.
10. Remaining artwork production
Needed later: overworld follower drill idle, subterranean emergence animation, shiny sprite, and a brief gear-spin effect for Bedrock Engine.
11. Technical integration checklist
Allocate one species ID.
Register Ground/Steel single-stage species data.
Hook encounter and follower assets.
Implement / test Bedrock Engine or choose fallback ability.
Check Heavy Slam and Ground STAB interactions.
12. Approval status
LOCKED: the attached battle artwork only.
PROPOSED: names, stat spreads, learnsets, ability design, encounter placement, journal text, shiny palette and implementation details.
Archive status: ZIP prepared for direct upload to the existing Abyssal Dossiers Google Drive folder. Work implementation is separate and has not started.
Implementation source audit (Stage 2)
Source: samuelkenworthy91-byte/Abyssals, core dist/data.js and dist/ability-data.js at the default-branch revisions checked on 2 November 2026. Learnset level assignments remain proposed. Core move names and numeric summaries above were verified, but the merged runtime also imports other content modules; Work must re-check the live registry before committing IDs, abilities, encounter slots, move eligibility or animations.
Stat benchmark: Terraforge at 510 BST is in the existing evolved-threat range (e.g. Searwaste 515), with a sharper physical defence / speed trade-off.
Edge cases to test: save migration and no ID reassignment; breeder egg-species output and prodigy inheritance; evo at exact level threshold and late learnset move preservation; overlapping status/ability triggers; double-battle targeting; changing weather and terrain; shiny recolour alpha preservation; battle-to-follower sprite identity. No existing IDs or assets should be overwritten.