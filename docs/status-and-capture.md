# Status and capture — v0.90.24

Sleep and confusion independently roll a uniform integer from 1 to 6 when successfully inflicted. Sleep consumes one counter for each otherwise eligible attempted move and wakes on the following attempted move. Confusion consumes one counter per eligible attempted move; each has a 33% chance to replace the move with 10% maximum HP self-damage. Earlier action blocks do not consume confusion. Saved counters are retained without rerolling.

Frostbite is a major status: halve the Special Attack used in special damage calculations, including critical hits, and take floor(maximum HP / 8), minimum 1 HP, at round end. Physical Attack is unaffected. Ice types cannot be frostbitten. Major statuses remain mutually exclusive; confusion can coexist. Existing generic major-status cures remove Frostbite. Hoarfrost Hex is an Ice status codex at the Grand Exchange: 85 accuracy, 15 PP, compatible with Ice, Water and Ghost types.

The shared capture formula multiplies capture strength by 3 for sleep/freeze, 2 for paralysis, 1.25 for burn/frostbite/poison/bad poison, and 1 otherwise. This occurs before flooring capture strength and before the four capture checks; bonuses apply to ordinary and legendary tiers alike. The threshold caps success at 100%. These are strength multipliers rather than guaranteed exact ratios of displayed percentages, because of integer rounding and the probability formula. Confusion and flinch add no capture bonus. Current HP and food strength continue to apply independently.

Combat, damage previews and arena AI share the Attack/Special Attack status factor. Conditions and move details display the effects and capture strength. Battle RNG supplies duration rolls so saved battles preserve deterministic outcomes.
