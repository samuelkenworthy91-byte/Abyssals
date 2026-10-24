# Prodigy breeding — 0.90.32

Same-family parents automatically offer the union of all their recorded Prodigy
stats, independent of the selected species outcome and donor dropdown. Roll once
per distinct stat at egg creation, with probability `(1/750) ** (1/6)` =
33.17593128004411%. All six succeed with probability exactly 1/750. Two distinct
stats both succeed with probability 11.0064%, about 1 in 9.09 eggs.

For an overlapping stat use the stronger original inherited bonus. Apply it to
the offspring's natural birth-species rate. Do not add the parents' bonuses,
evolution copies, temporary training, or another donor 0–10 roll. A failed stat
retains normal species growth. Each inherited stat continues to gain one copy
of its original bonus per completed evolution.

The donor dropdown offers additional eligible growth outside the automatic pool.
Ordinary donor growth and inherited moves keep their previous behavior. Cross-family
pairings retain family-parent carryover and one selected donor stat; existing
Prodigy bonuses are transferred without the extra 0–10 generation roll.

Version 2 records already support all six stats. Existing eggs and offspring are
not rerolled or rewritten. Saves, earned stats, permanent deaths and quests stay intact.

Validation covers real Wickowl parents, both species-selection outcomes, egg
creation/save/reload/hatching, 1+5/3+3/5+1 splits, overlap, missing rolls,
multi-generation stability, legacy inheritance records and evolution stacking.
A fixed-seed simulation of the production roll helper yields 2,670 complete
offspring in 2,000,000 eggs (1 in 749.1). Phone browser QA checks the pairing
preview and confirms automatic stats cannot be excluded by donor selection.
