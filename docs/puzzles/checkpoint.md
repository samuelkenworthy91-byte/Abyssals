# Puzzle and side-path checkpoint

Baseline main: `4602d7fabe9b9cdc9a3371fd5190bcf6b4e118d8`. Latest release at intake: v0.90.59, Android version code 154.

## Baseline audit

The live data declares 15 expeditions and 45 clue stages. At baseline each stage creates one evidence interaction at (15, 12). A terrain flood using the live map collision and locked campaign gate rules found a cardinal approach from the standard entry in every room. A second pass found walkable gate arrivals and paths to each ordinary exit. These model results cover static collision only.

Clue rendering used biome-specific scenery sprites, including a hearth, a net winch and a seal. Their silhouettes did not consistently indicate a reading interaction. The clue coordinate was repeated independently in the renderer, and the generic canvas hit area could intercept clicks beyond the visible prop. Keep the stage and clue IDs and use one named, recognisable lectern with its own hit area.

The strongest source-based estimates in the handoff were Shared Spring (difficulty 9, enjoyment 9), the opposite-moving wardens (8, 9), the Six Marks oath (7, 9), Silent Mill (8, 9), the boulder routes (7, 8), Peach Orchard bells (7, 8) and the Common Cause spillway (8, 8). These are design estimates. The expedition data uses order, evidence, independent weights and linked lamps with default instructions that often disclose the solution.

## Verification status

On the deployed v0.90.59 PWA, a synthetic accepted Snowbreak Hollow save at (15, 13), facing north, showed the player sprite covering the clue prop. The objective label remained visible and pressing E read the evidence and advanced the objective to the warden. This reproduces an obscured prop. The reported hard deadlock remains unconfirmed. The patch draws the reading lectern after actors to keep the prop visible from that approach. Browser fixtures distinguish input and persistence checks from terrain coverage. The signed Android and offline PWA release are gated on the complete overhaul and full QA.

## First mechanism batch

Snowbreak Hollow's hearth now models heat and smoke. The Buried Water Road uses coupled counterweights and a level carriage. The Water That Remembers uses four connected pipe sections. Ashes Owed uses a turn-based heat and pressure window. Stormwatch uses a three-mirror light relay. The Cossenne objective now reads the garden drum target from the same data as the lock.

These boards keep separate save state and preserve finished legacy expeditions. The mechanism tests search each board for a solution, resume a partially solved save, and check reset, hints and cleared saves. The mobile suite also operates each upgraded board through its buttons.

## Remaining expedition mechanisms

The remaining ten expeditions now use finite irrigation, a layered filter, paired pressure chambers, a memorial constellation, conflicting testimony, a capacity-limited ferry, three shore echoes, ledger reconciliation, evacuation routes and a current-driven two-net grid. The model test searches all 15 start boards and verifies that each finishes through its normal campaign rules.

The first mobile run passed the 45 clue interactions. A subsequent check sampling one exact canvas pixel timed out in Burrow Hollow even though the clue target was present. The browser test now checks that each actual canvas draws the lectern face and keeps the foreground pixel check on the reproduced Snowbreak approach.

## Windscar Mist Crossing

An optional pocket on the Summit Cairns map has a five-by-seven grid and two deterministic, mirrored safe paths. Falls return the player to the near landing without consuming health, lives, inventory or escort steps. Discovery and hints persist. Loading a save on the grid starts the player at the near landing, and canvas taps within the puzzle are limited to adjacent tiles.

The model verifies both routes, isolation from normal pathfinding and save continuity. The mobile test covers distant taps, a fall, mid-grid reload and completion. False Witness is part of Relic Crags. Shadow Bridge, Mirror Chamber, Flooded Vault and Vanishing Runes are deferred optional modules.

## Expedition inventory

Difficulty and enjoyment are design estimates out of 10. The browser checks exercise interaction and progression. Human playtest scores are pending.

| Expedition | Rebuilt mechanism | Baseline difficulty / enjoyment | Target difficulty / enjoyment |
| --- | --- | --- | --- |
| The Winter Nursery | Airflow & shelter heat | 4 / 5 | 4 / 5 |
| The Buried Water Road | Interlocked counterweight lift | 1 / 2 | 5 / 6 |
| The Water That Remembers | Water sediment trace | 1 / 2 | 5 / 7 |
| Ashes Owed | Forge heat balance | 1 / 2 | 6 / 7 |
| The Broken Stormwatch | Beacon line of sight | 1 / 3 | 5 / 7 |
| Roots for the Hungry | Limited-water irrigation network | 1 / 2 | 5 / 7 |
| The Black Reed Trail | Filter chain construction | 1 / 2 | 6 / 7 |
| The Reef Toll | Pressure equalisation lock | 1 / 2 | 6 / 7 |
| Names Beneath the Tide | Memorial light constellation | 3 / 4 | 5 / 7 |
| The Witness in Stone | Contradictory testimony | 1 / 3 | 6 / 8 |
| The Three Missing Barges | Three cargo boats & crossing | 1 / 2 | 6 / 7 |
| A Bell for the Uncounted | Echo sequence memory | 3 / 4 | 4 / 7 |
| The Measure of Thirst | Ledger reconciliation deduction | 1 / 3 | 6 / 8 |
| After the Banners Fall | Evacuation scheduling | 1 / 2 | 5 / 7 |
| The Net Beneath the Contest | Current-directed net removal | 1 / 2 | 6 / 8 |

## Pixel art pass

The original crossing screenshot showed a flat grid against the summit scenery. The revised ravine uses Windscar's existing rock and snow sprites around pixel-drawn cliff faces, shaded stepping stones and layered mist. A brief frost puff marks a missed step. After a fall, flakes can gather on the next nearby safe stone, drawing on the way snow hints at hidden paths in [Dark Souls' Crystal Cave](https://darksouls.wikidot.com/crystal-cave). Reduced motion holds the visual cues in place, and the inscription still provides a deliberate hint.

The fifteen mechanism panels use their themed pixel-art props. The spawning channel uses textured tiles with symbols and text labels for the nets, nest, rocks and outlet. The browser check verifies that each illustration loads and records representative panel and crossing screenshots.

## Veilroot Bastion exterior

The water outside the Sunken Fort now uses a continuous coastal texture, a depth tint, broken foam along the shore and causeway, and slow tide highlights. The renderer uses the existing walkable mask. The browser check captures the shoreline from the approach and the model verifies that the paving and entrance remain clear.
