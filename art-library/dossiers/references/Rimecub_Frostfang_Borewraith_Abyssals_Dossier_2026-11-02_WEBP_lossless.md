Rimecub → Frostfang → Borewraith — Work Dossier
Abyssals | Typing: Ghost / Ice | Species: 3
Status: ARTWORK LOCKED • GAMEPLAY PROPOSED • IMPLEMENTATION NOT STARTED
1. Species identity
The following names, combat roles and flavour details are proposed for Work implementation. The battle artwork is approved and locked.
Rimecub: A playful spectral wolf pup with frosty ribbons and small crystal growths beginning to form.

Frostfang: Its middle stage becomes a teenage frost-wolf—faster, more aggressive, and wreathed in streaming cold mist.

Borewraith: The final form is a vast spectral wolf wraith, part blizzard and part apex predator, with a regal icy mane and crystalline spines.

2. Evolution
Proposed level 26 into Frostfang and level 44 into Borewraith.
3. Base stats and balancing
Rimecub
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
52
58
45
54
52
59
320
Fast early mixed attacker.
Frostfang
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
72
92
65
82
74
90
475
Speedy mid-stage attacker with mixed pressure.
Borewraith
HP
Attack
Defense
Sp. Attack
Sp. Defense
Speed
Total
88
111
78
98
74
86
535
Powerful late-game mixed attacker. High offence comes at the expense of physical resilience; balanced below a pseudo-legendary total.
4. Abilities
Whiteout Pelt (NEW / PROPOSED): Entering battle creates a 3-turn frost veil around the user: direct contact attackers have a 30% chance to be chilled (speed -1). If snow or hail-style weather exists, Borewraith heals 1/16 at turn end while the veil lasts.
Verified existing ability alternatives: Coldproof — cannot be frozen; Snowfoot — 50% faster during hail or snow; Foresight — first super-effective hit taken after entry reduced by 20%. All verified existing.
5. Movesets
Move names and core power/accuracy/PP values below were checked against GitHub dist/data.js (commit SHA 744172299e1f02b2b9d5f87a6307062c1e667bc5 on 2 November 2026). The listed levels and species eligibility are proposed; Work must verify the entire merged live move registry, including content modules, and test category-null moves before implementing.
Rimecub
Level
Verified move
Type
Effect and numeric reference
1
Frost Shard
Ice
20% chance foe Speed −1; category review needed; Pow 45 / Acc 100 / PP 35
1
Wraith Rush
Ghost
20% chance foe Sp. Def −1; category review needed; Pow 45 / Acc 100 / PP 35
7
Frost Burst
Ice
Special, 20% chance foe Sp. Def −1; Pow 60 / Acc 100 / PP 25
14
Frost Fang
Ice
Physical, no secondary effect; Pow 70 / Acc 100 / PP 20
20
Wraith Pulse
Ghost
Special, 20% chance target unable to switch next turn; Pow 50 / Acc 100 / PP 25
Frostfang
Level
Verified move
Type
Effect and numeric reference
1
Frost Shard
Ice
20% chance foe Speed −1; category review needed; Pow 45 / Acc 100 / PP 35
1
Wraith Pulse
Ghost
Special, 20% chance target unable to switch next turn; Pow 50 / Acc 100 / PP 25
26
Frost Fang
Ice
Physical, no secondary effect; Pow 70 / Acc 100 / PP 20
31
Shade Claw
Ghost
Physical, 20% chance Sp. Attack +1; Pow 80 / Acc 100 / PP 15
36
Dusk Focus
Ghost
Status, Sp. Attack +1; Pow — / Acc Always / PP 20
41
Rime Claw
Ice
Physical, 20% chance foe Sp. Def −1; Pow 95 / Acc 95 / PP 10
Borewraith
Level
Verified move
Type
Effect and numeric reference
1
Frost Fang
Ice
Physical, no secondary effect; Pow 70 / Acc 100 / PP 20
1
Shade Claw
Ghost
Physical, 20% chance Sp. Attack +1; Pow 80 / Acc 100 / PP 15
44
Shade Fang
Ghost
Physical, 20% chance foe Sp. Def −1; Pow 95 / Acc 95 / PP 10
50
Frost Spire
Ice
High critical-hit ratio; category review needed; Pow 90 / Acc 100 / PP 15
56
Rime Shard
Ice
Speed −1 after use; category review needed; Pow 110 / Acc 90 / PP 5
61
Shade Pulse
Ghost
Special, 20% chance confuse; Pow 90 / Acc 100 / PP 15
68
Celestial Rime
Ice
Special, 20% chance foe Sp. Attack −1; Pow 95 / Acc 95 / PP 10
6. Habitat and acquisition
Proposed habitat: snowfields, haunted alpine passes, or late-game frozen fort floors. Rimecub levels 14–19, Frostfang rare at 32–36, Borewraith typically evolution-only or a singular late-game boss encounter.
7. Field Journal
Unseen rumour: Campfires in the high snows sometimes draw the outlines of pale wolf pups running just beyond the light.
Caught entry: The Rimecub line is born where snowfall and wandering spirits meet. Borewraith leads whole blizzards behind it like a living winter.
8. Breeding
Standard no-gender breeding rules. Egg species Rimecub. No unique nursery exceptions proposed.
9. Shiny palette
Shiny palette proposal: pale fur becomes midnight navy with turquoise highlights; crystal growths become rose quartz; the spirit mist shifts toward aurora green.
10. Remaining artwork production
Needed later: follower sheets, tail-ribbon idle loops, shiny sprites, icy breath frames, and a brief snow-halo effect for Whiteout Pelt.
11. Technical integration checklist
Allocate three species IDs and two evolution links.
Register encounter data for snowy late-game routes.
Implement Whiteout Pelt if approved.
Test weather synergy and chill proc balance.
Check large-sprite collision / readability for Borewraith.
12. Approval status
LOCKED: the attached battle artwork only.
PROPOSED: names, stat spreads, learnsets, ability design, encounter placement, journal text, shiny palette and implementation details.
Archive status: ZIP prepared for direct upload to the existing Abyssal Dossiers Google Drive folder. Work implementation is separate and has not started.
Implementation source audit (Stage 2)
Source: samuelkenworthy91-byte/Abyssals, core dist/data.js and dist/ability-data.js at the default-branch revisions checked on 2 November 2026. Learnset level assignments remain proposed. Core move names and numeric summaries above were verified, but the merged runtime also imports other content modules; Work must re-check the live registry before committing IDs, abilities, encounter slots, move eligibility or animations.
Stat benchmark: Borewraith has been adjusted to 535 BST from the earlier draft’s 585, closer to existing powerful final stages, without losing its mixed-offence identity.
Edge cases to test: save migration and no ID reassignment; breeder egg-species output and prodigy inheritance; evo at exact level threshold and late learnset move preservation; overlapping status/ability triggers; double-battle targeting; changing weather and terrain; shiny recolour alpha preservation; battle-to-follower sprite identity. No existing IDs or assets should be overwritten.