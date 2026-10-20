# Mendugong — approval proposal

Status: concept only. Not installed in the game, encounter tables, move catalogue or rewards. The current live catalogue remains 362 species. Approval would add one single-stage species, taking the total to 363.

## Creature identity

**Mendugong**, the Pearlkeeper Abyssal. Water/Fairy. A gentle manatee/dugong caretaker with a vast soft cream body, seafoam lily mantle, moss flecks and an internal healing pearl visible through a sea-glass chest buoy. It waddles through flooded ruins, tending wounded creatures. Its visible face and dark expressive eyes remain readable at mobile sprite size.

Role: enormous HP and high Special Defence, poor physical Defence and Attack, modest special damage, slow recovery support. Physical attackers are the quickest answer; special attackers struggle to break through. No evolution, item requirement, legendary or pseudo classification.

Catalogue entry: “It gathers the wounded beneath its floating lily mantle. In abandoned forts, the glow of its pearl still marks the old infirmaries.”

## Stats and growth

Explicit level-one runtime stats; the species would use the existing expansion starting-stat mechanism. Base stats are reference values, not level-one battle values.

| Stat | Reference base | Level-one starting stat | Growth per level |
|---|---:|---:|---:|
| HP | 250 | 60 | 140% |
| Attack | 10 | 2 | 10% |
| Defence | 15 | 3 | 10% |
| Special Attack | 75 | 12 | 45% |
| Special Defence | 135 | 24 | 100% |
| Speed | 35 | 5 | 15% |
| Total | 520 | — | 320% |

Use the game's existing independent seeded, bounded growth rolls. HP successes grant +10 HP; other successes grant +1. At 140% HP growth, one +10 is guaranteed, with a 40% chance of another +10; a fractional success can trigger one bounded extra increment. Exact 100% Special Defence grants +1 every level. Actual wild individuals vary. This design does not increase physical Defence growth to compensate for the low starting value.

## Abilities

- Primary — **Medicinal Sap** (existing): its healing moves restore 15% more HP.
- Secondary — **Reservoir** (existing): incoming Water moves deal no damage and instead heal 25% maximum HP.
- Hidden — **Thick Pelt** (existing): incoming Fire and Ice damage is reduced by 25%.

Its default wild ability would be Medicinal Sap. Alternative ability slots follow the game's existing acquisition rules. No extra EXP-boosting ability: the reward multiplier belongs to the species and cannot be transferred.

## Proposed level-up moves

| Level | Move | Purpose |
|---:|---|---|
| 1 | Tide Lance | 45-power special Water attack; 10% confusion chance |
| 3 | Charm Veil | +1 Special Defence |
| 6 | Deep Breath | Restore 25% maximum HP |
| 10 | Glimmer Pulse | 50-power special Fairy attack; 20% chance to raise own Special Defence |
| 12 | Mist Screen | Lower foe's accuracy one stage |
| 16 | Tide Pulse | 55-power special Water attack; 20% chance to lower foe's Defence |
| 20 | Pearl Reprieve — new signature | Restore 25% maximum HP and cure one major status condition |
| 24 | Moon Blessing | +1 Special Attack and Special Defence |
| 30 | Tide Spiral | 75-power special Water attack; drain 25% damage dealt |
| 38 | Wishful Heart | Restore 25% maximum HP |
| 46 | Calm Current | +1 Special Defence |

Pearl Reprieve: Fairy, Status, SELF, always hits, priority 0, 5 PP. Healing is boosted by Medicinal Sap. It cannot revive, affect dead partners or grant EXP. Animation: chest pearl brightens, a seafoam ring gathers around the user, white lily petals rise and collapse into a warm healing glow; no damaging collision. Other moves reuse their existing individual animations.

Sample wild kit for floors 2/3: highest available special Water attack, highest available special Fairy attack, Deep Breath or Pearl Reprieve, and a defensive boost. Avoid four support moves. The proposal's wild AI would use healing sparingly: only below 40% HP, never twice consecutively, and at most once per battle for wild specimens. Player-controlled copies retain their normal PP-limited move choices. This keeps encounters rewarding without making grinding a long healing loop.

## Encounters and defeat EXP

- Sunken Fort / Veilroot Bastion floor 2, Drowned Barracks: **3% of eligible encounters**, levels **22–28**.
- Floor 3, Tidal Armoury: **3%**, levels **34–40**.
- Both day and night; no other initial habitat. Rebalance the remaining table weights to keep each total at 100%.
- Capture-rate proposal: **70**. Standard food-based recruitment; no special capture item.
- **6× the normal defeat EXP award**, applied after the recipient's normal level adjustment. Defeat only: capture, escaping, healing and deploying your own Mendugong do not generate the bonus.
- Under the current level-under-50 multiplier, an equal-level win would give **300 EXP** to a participant, rather than 50. A sufficiently lower-level participant would receive up to **900 EXP**, rather than 150. Each level costs 100 EXP; the existing level-200 limit remains.
- With Binoculars active, each living party member receives its own full adjusted amount. No division, no bonus just for owning Mendugong, and no awards to reserve or dead partners.

The rarity and 6× yield are proposed tuning values, not measured balance results. Before implementation, run fight-length and progression checks at both floor ranges with physical and special teams and with Binoculars active.

## Art prepared

A full concept sheet and separate transparent full-body battle sprite preview have been generated for review. The sprite preserves the creature's face, pearl and lily mantle with margins around its body. No runtime creature asset has been installed. A directional walking sheet and runtime packing would follow approval, using a slow body sway, alternating flippers and a gentle pearl pulse.
