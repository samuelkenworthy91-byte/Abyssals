# Puzzle and side-path checkpoint

Baseline main: `4602d7fabe9b9cdc9a3371fd5190bcf6b4e118d8`. Latest release at intake: v0.90.59, Android version code 154.

## Baseline audit

The live data declares 15 expeditions and 45 clue stages. At baseline each stage creates one evidence interaction at (15, 12). A terrain flood using the live map collision and locked campaign gate rules found a cardinal approach from the standard entry in every room. A second pass found walkable gate arrivals and paths to each ordinary exit. These model results cover static collision only.

Clue rendering used biome-specific scenery sprites, including a hearth, a net winch and a seal. Their silhouettes did not consistently indicate a reading interaction. The clue coordinate was repeated independently in the renderer, and the generic canvas hit area could intercept clicks beyond the visible prop. Keep the stage and clue IDs and use one named, recognisable lectern with its own hit area.

The strongest source-based estimates in the handoff were Shared Spring (difficulty 9, enjoyment 9), the opposite-moving wardens (8, 9), the Six Marks oath (7, 9), Silent Mill (8, 9), the boulder routes (7, 8), Peach Orchard bells (7, 8) and the Common Cause spillway (8, 8). These are design estimates. The expedition data uses order, evidence, independent weights and linked lamps with default instructions that often disclose the solution.

## Verification status

On the deployed v0.90.59 PWA, a synthetic accepted Snowbreak Hollow save at (15, 13), facing north, showed the player sprite covering the clue prop. The objective label remained visible and pressing E read the evidence and advanced the objective to the warden. This reproduces an obscured prop. The reported hard deadlock remains unconfirmed. The patch draws the reading lectern after actors to keep the prop visible from that approach. Browser fixtures distinguish input and persistence checks from terrain coverage. The signed Android and offline PWA release are gated on the complete overhaul and full QA.
