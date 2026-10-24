# Nursery and stewardship — 0.90.33

Approved 25 October 2026. Batch stewardship buys complete consecutive lessons
at the existing 1, 2, 4, 8... donor costs. It checks donor growth against each
successive lesson and allocates weaker eligible donors first. Surplus selected
partners stay with the player. Existing per-stat lessons and rescue caps count.
Ordinary rehoming supports multiple partners, returns held items, and retains a
living party member. Both screens support select-visible, clear, normal partner
filters, and the existing permanent-rehoming confirmation. Selection changes do
not rebuild the list; cancellation restores selected IDs and filter/scroll state.

Marasen Grand Exchange, Growth Apothecary (5F), sells:

| Item | Doubloons | Use |
|---|---:|---|
| Family Seal | 20,000 | Consumed; selects either parent's base-species outcome |
| Heirloom Charm | 500,000 | Reusable; +6.82406871995589 inheritance percentage points |
| Prodigy Feed | 35,000 | Consumed; sets baseline per-stat chance to 45% |
| Inheritance Thread | 15,000 | Consumed; sets one available stat to 65% |
| Brooding Warmer | 200,000 | Reusable; new eggs require 384 instead of 512 steps |

Prices are ten times the approved draft. Base inheritance remains
`(1/750) ** (1/6)` per available stat. The Charm stacks additively with either
Feed or Thread: 51.82406871995589% for every stat with Feed; 71.82406871995589%
for the selected stat with Thread and 40% for other stats. Feed and Thread are
alternatives. Seal and Warmer can accompany any combination. Same-family Seals
are disabled. Thread selection must be available in every possible species
outcome (or the sealed outcome), using the selected donor plan for cross-family
pairings. Items cannot invent traits or increase an original inherited bonus.

| Setup | Chance of all six, if available |
|---|---:|
| No items | 1 in 750 |
| Charm | 1 in 244.14 |
| Feed | 1 in 120.43 |
| Charm + Feed | 1 in 51.61 |
| Thread | 1 in 382.80 |
| Charm + Thread | 1 in 135.96 |

Only successful egg creation consumes supplies and the existing 1,000-doubloon
fee. Ownership and counts persist in `state.nurseryItems`. Egg effects and total
steps are committed with the egg, so reloads and later purchases do not change
it. Old eggs retain their original rolls and 512-step requirements. Species
selection continues to determine the family parent and its existing ability-slot
inheritance. No shiny changes. Existing saves, permanent death and quests remain.

`tests/nursery-care.test.mjs` covers prices, ownership, stacking, real eggs,
save/reload/hatching, Seal outcomes, invalid Thread selections, legacy eggs,
batch costs, per-lesson eligibility, caps, surplus, protected donors and held
items. Six fixed-seed populations of one million eggs invoke the production
roll helper. `tests/nursery-care-browser.cjs` covers phone shop purchases,
pairing previews, item use, save/reload/hatching, species Seals, batch confirmation,
cancellation/filter preservation and ordinary bulk rehoming.
