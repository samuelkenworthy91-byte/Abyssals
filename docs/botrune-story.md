# Thunderplain and Botrune — current implementation canon

User revision: 20 October 2026. This records the requested next chapter after Marasen. It is a deliberate revision of the earlier outline, not a claim to have imported the full locked Story Bible.

## Sources checked

- Current Marasen forwarding letter and east exit (`dist/marasen-ui.js`, `dist/marasen-world.js`).
- Current `dist/canonical-character-names.js`: LDR-06 = Canon Fatima bint Musa (formerly Canon Mirelle Avin); CHR-PATE = Peter “Pate” FitzRobert; CHR-TRADE = Thomas “Trade” de Clare.
- Archived `ABYSSALS_CODING_HANDOFF_v1.0.zip`: `docs/canon/STORY_IMPLEMENTATION.md`, `ACTIVE_CANON.md`, locations and character tables.
- Archived Canon Source Index and its later five-use elective human restoration ruling. Historical execution remains separate from current life state.
- `art-library/characters/reference/CHARACTER-CATALOG.json`, recovered `CONFIRMED_ID_INDEX.csv`, and prepared transparent, Poké Ball-free Pate/Trade assets.
- Earlier Story Bible discussion: Marasen → Scribes’ Road → Botrune abbey/archive → War Road → Cayfen; earlier companion deaths at Emmara Mill; CH07-E02 “Mirelle’s Hypothesis” and WLD-BOTRUNE-OATH-001 are existing anchors.

The complete Story Bible was not found in the recovered original files; the runtime data contains only Chapter 1 source excerpts. Therefore this implementation uses new `BT-*` event identifiers and does not rename or overwrite known locked CH07/WLD anchors. The buried archive and oath evolution story remain later content, not falsely marked complete here.

## Approved story revision

The user's latest direction moves Pate and Trade's deaths to Botrune. A future Emmara implementation MUST NOT kill them again or claim they died at the mill. Its older death/revelation outline is superseded. The user also replaces the next leader's technical-control team with physical power. Keep Fatima's stable identity and scholar-cleric appearance, while portraying this revised ruthlessness.

Trade's letter warns about an exposed storm plateau and stripped conductors. Pate's warning asks Aimon not to hurry the crossing. Seven screens turn progressively bleak, populated by Electric species, nocturnal Dark types and Ground burrowers. Distant lightning and rain have no hidden damage mechanic; reduced motion disables both animations.

On first entering Botrune, Fatima reads fabricated charges to a silent crowd on the abbey stage. Three prisoners are killed first. The last two are revealed as Pate and Trade, who recognise Aimon and urge him to run. Fatima executes them, with non-graphic overworld blade/fall animation. Dialogue advances through player confirmation; each completed beat is durably saved before its animation. Reloads continue from the next beat.

`BT-PUBLIC-SENTENCE-20261020` is recorded once. `humanLives['CHR-PATE']` and `humanLives['CHR-TRADE']` hold separate historical deaths and current life states. The scene does not consume human restoration uses, award companion starters, heal deaths or revive anyone. The existing memorial lists their names when dead. Future restoration must preserve history and obey the total five elective uses.

Witnesses identify the lies after the scene. Aimon may retreat, heal and prepare. Three captains (4, 5 and 6 partners) physically block the only stage stair in sequence. Victories persist. Fatima fights on the stage with six partners at levels 74–77: Ruffellow, Ramporque, Clinchitin, Falchawk, Ragevolt, Dreadcleaver. Every battle slot uses four existing legal physical attacks; stats are unmodified.

After victory, SPARE/EXECUTE remains a separate permanent judgement. Both remove her from rule and protect civilian services and abbey records. Spare permits supervised rematches; execute gives the established one-time 50,000-doubloon/nursery reward. Aimon returns to his friends for grief and keepsake dialogue. The War Road is the new chapter boundary.

## Assets and size

`dist/assets/CHR-PATE.webp` and `CHR-TRADE.webp` are compressed runtime copies of the reviewed ready assets, 512×683. `LDR-06.webp` is a new 512×768 portrait matching the existing character illustration style. All three were uploaded using GitHub's browser file upload, staging commit `93dd2ce1ed975dc1f7f74f4381e9eb2a257d08e5`.

The new leader's built-in generation prompt specified a Middle Eastern woman scholar-cleric, cream/aubergine robes, gold trim, manuscript belt, dark arranged hair, archival gloves, restrained ruthless expression, closed ledger, full body, transparent background, and no Poké Balls. Existing `LDR-05.webp` supplied style reference. One background-extraction revision was applied, then resized/compressed to WebP. No generated illustration was used to replace the game's terrain system.

Runtime portrait sizes: Pate 55,678 bytes; Trade 57,936; Fatima 80,676. Combined 194,290 bytes versus 199,756 bytes for the previous two portraits. Net artwork reduction: 5,466 bytes. Existing quarry ground/cliffs, fort stone, banners, NPC portraits and guard artwork are reused. New rods, stage/stair geometry and weather are native canvas drawings.

`archive/` and `art-library/` remain outside the APK; only selected `dist/` runtime assets are packaged.
