# Permanent growth — 0.90.34

Approved 25 October 2026. Every original permanent growth-point bonus shares
the same multiplier: `1 + completed evolutions`. Sources are Prodigy inheritance,
stewardship lessons, Marasen growth tonics, nursery and memorial gifts, and the
rescue gift's original birth-form advantage. Temporary draughts remain flat.

For each stat:

`permanent = current species natural growth + sum(original permanent bonuses) × multiplier`

With natural rates 40 → 90 → 120, a +50 Prodigy bonus, two stewardship points
and one +5 focused tonic give **97 → 204 → 291**, rather than 97 → 197 → 277.
Stewardship alone (+2) gives 42 → 94 → 126; a focused tonic (+5) gives
45 → 100 → 135; a balanced tonic (+1 per stat) gives 41 → 92 → 123.
A nursery or memorial gift (+15 per stat) gives 55 → 120 → 165.

Purchasing after evolution uses the existing completed-evolution multiplier
immediately. Buying before or after evolution has the same future rates.
Original records, lesson counts and dose counts never multiply or mutate.
Only actual completed evolutions count, not a wild creature's current form or
reloading/cancelling a promotion. There is no retrospective reroll of earned stats.

New rescue gifts record their original 10% birth-form advantage in
`rescueGrowthBonus`. Older records derive it from their first saved evolution's
`from` species, or the current species when unevolved. This bonus also stacks
from its original value. The 300% six-stat limit applies only when generating
initial rescue gift offers. After the gift enters player care, evolution,
stewardship and tonics have no permanent growth-percentage ceiling. No player-owned
rates are scaled down. Temporary boosts remain flat additions. Existing tonic
dose limits and level rules are unchanged.

The partner growth summary includes a per-stat formula and original source
breakdown. Tonic confirmations show +5 × multiplier (focused) or +1 × multiplier
per stat (balanced), exact permanent before/after rates and the unchanged cost.
Batch stewardship uses the real amplified gain for each successive donor
threshold, quote and confirmation, while keeping original doubling lesson costs.

Breeding still transfers original Prodigy bonuses rather than evolution copies.
Nonheritable stewardship and department-store growth tonics are excluded from
donor offers. Ordinary gift advantages use their original, unstacked values.
Eggs already created keep their committed records.

Validation: `tests/permanent-growth.test.mjs` covers all sources at ×1/×2/×3,
real promotions and level-up gains, reloads, purchase order, immutable receipts,
advanced stewardship quotes, initial rescue eligibility, uncapped growth/legacy fallback and donor
inflation. Phone QA in `tests/prodigy-evolution-browser.cjs` checks the visible
maths, evolved tonic cancellation/purchase/reload, unchanged earned stats and
a real amplified stewardship transaction. Existing nursery, trainer, gift and
training regressions also run through the signed APK workflow.
