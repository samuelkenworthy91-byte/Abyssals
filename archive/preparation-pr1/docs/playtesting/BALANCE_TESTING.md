# Balance testing

Balance tests begin only once the authoritative stats, encounters, moves, teams and economy have been imported. Do not invent those values to populate simulations. Lock all simulations to a recorded commit, input dataset checksums and deterministic seed set. Balance proposals require design approval; tests never silently change locked rules.

## Record comparable observations
| Measure | Record | Canon expectation or question |
|---|---|---|
| Progression | Location, battle count, participant levels and earned XP | 100 XP per level; individual level-gap awards; ~100 final mortal leader, cap 200 |
| Difficulty | Enemy/team IDs, turns, resources, switches, deaths/lives spent | Find spikes and unwinnable authored paths without undoing permadeath |
| Capture | Species, HP/status, food, exact probability, seed/result | Compare outcome distribution with imported formula; no reload rerolls |
| Economy | Money, food/healing stock, purchases/sales, Trial Marks | Start 2,000; no wild money; normal sale floor(50% price) |
| Growth | Base stats/BST, seed, training effects, levels/evolution | Validate formula/roll distribution and unchanged past growth |
| Encounters | Area/phase, generated slot/level, suppression | Authored levels; six-slot weights; no player-level scaling |
| Resurrection | Available distinct reserve species, sacrifices, opportunity cost | Exactly ten distinct living species; no item/currency substitute |

## Passes
Run controlled fixtures first, then fresh blind/normal-speed playthroughs. Separate content completion, balance and presentation bugs. Repeat the same seed sets after a code change to distinguish a regression from random variance; use a wider independent sample when assessing probabilities. State sample sizes and uncertainty rather than calling a few unlucky captures a balance failure.

Record pacing, resource shortages and optional-route incentives. Propose changes with observed data, affected canon and intended impact; never alter growth, XP, death, starter lives, restore limits or encounter composition merely to ease a playtest.
