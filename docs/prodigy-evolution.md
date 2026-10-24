# Prodigy evolution — 0.90.31

Approved 24 October 2026: stack one copy of the original inherited growth
advantage at birth and one additional copy per completed evolution. A 40%
birth species with an inherited 90% rate has a +50 point original bonus.
Natural rates 40 → 90 → 120 therefore become 90 → 190 → 270. Level-ups,
cancelling an evolution, opening a summary and reloading never add copies.

The immutable v1/v2 inheritance record supplies `rate - baseline`. Actual saved
evolution history determines the multiplier. Existing earned stats, EXP, lives,
deaths and eggs stay intact; existing Prodigies receive the new future rates
without rerolling past growth. Per-stat donor/lineage overlap takes the strongest
original bonus once. Temporary training, stewardship and other existing bonuses
continue through their existing additive paths. Rescue caps remain in force.

Prodigy breeding passes the original advantage, with its existing 33% chance
and 0–10 donor roll; it never passes the evolution multiplier. Family carryover
also retains its unstacked recorded rate and independent 33% rolls. Ordinary
donors retain their existing permanent-growth inheritance behavior.

Eight fixed trainer policies introduce one Prodigy at the Cossenne grove,
Marasen inner challenge, Botrune's third guard and Cayfen terrace challenge;
two at the Lantern Shelves, fleeing captain and seventh leader; three at the
eighth leader. Bonus points are 20–35 in a move-appropriate attacking stat.
These opponents are grown from their birth species and actually promoted at
legal levels, so the increased growth produces real battle stats. Rematches
retain the leader's policy. Ordinary early trainers remain unchanged.

`arc: 'hell'`, `region: 'hell'`, and the reserved Warden/Final/Severin AI tiers
select the stronger policy (two Prodigies, or three for Final/Severin, at +50
original points). `prodigyPolicy` permits an authored override. Hell is not yet
playable in the current source: this update does not invent its maps or story.
Legendary/mythic/unique roster members are excluded from automatic selection.

Every affected route challenge names its Prodigies in the final pre-battle
terms, before either accepting or declining. Team selection uses no random
rolls, and repeated preparation does not change or multiply the bonus. Saved
battles retain their exact existing enemies instead of rebuilding opponents.

Validation: `tests/prodigy-evolution.test.mjs` checks three-stage stacking,
overflow rolls, old inheritance records, independent stats, original-bonus
breeding, every playable trainer policy, Hell defaults and deterministic stats.
`tests/prodigy-evolution-browser.cjs` checks the actual phone warning, decline,
retry, accepted opponent, battle reload and growth-summary explanation.
