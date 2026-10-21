# Thunderplain and Botrune — current implementation canon

User revision: 20 October 2026. This records the requested next chapter after Marasen. It is a deliberate revision of the earlier outline, not a claim to have imported the full locked Story Bible.

## Sources checked

- Current Marasen forwarding letter and east exit (`dist/marasen-ui.js`, `dist/marasen-world.js`).
- Current `dist/canonical-character-names.js`: LDR-06 = Canon Fatima bint Musa (formerly Canon Mirelle Avin); CHR-PATE = Peter “Pate” FitzRobert; CHR-TRADE = Thomas “Trade” de Clare.
- Archived `ABYSSALS_CODING_HANDOFF_v1.0.zip`: `docs/canon/STORY_IMPLEMENTATION.md`, `ACTIVE_CANON.md`, locations and character tables.
- Archived Canon Source Index and its later five-use elective human restoration ruling. Historical execution remains separate from current life state.
- `art-library/characters/reference/CHARACTER-CATALOG.json`, recovered `CONFIRMED_ID_INDEX.csv`, and prepared transparent, Poké Ball-free Pate/Trade assets.
- Full locked Story Bible on `handoff/structured-import` at commit `c33326e1c3f08d4f1c9c74c606683a492784bd28`, `data/story/scenes.json` and `data/story/state_contracts.json` (now preserved alongside this note under `docs/story-bible/`): Marasen → Scribes’ Road → Botrune abbey/archive → War Road → Cayfen; earlier companion deaths at Emmara Mill; CH07-E02 “Mirelle’s Hypothesis” and WLD-BOTRUNE-OATH-001 are existing anchors.

The full Story Bible was located on the older structured-import branch after the initial recovered handoff review. The new chapter is an explicit user-authorized overlay. Original source records are preserved verbatim in meaning under `docs/story-bible/`; the user's 20 October revision takes priority for the execution, leader characterisation and physical team. New `BT-*` event identifiers avoid falsely marking the original CH07 archive scenes complete. The buried archive, shared religious source, Trade's marginal questions, Two Prayers and oath evolution remain reserved story content; future scripts should deliver them through protected manuscripts and civilian archivists if Fatima is dead or in custody.

## Approved story revision

The user's latest direction moves Pate and Trade's deaths to Botrune. A future Emmara implementation MUST NOT kill them again or claim they died at the mill. Its older death/revelation outline is superseded. The user also replaces the next leader's technical-control team with physical power. Keep Fatima's stable identity and scholar-cleric appearance, while portraying this revised ruthlessness.

Trade's letter warns about an exposed storm plateau and stripped conductors. Pate's warning asks Aimon not to hurry the crossing. Seven screens turn progressively bleak, populated by Electric species, nocturnal Dark types and Ground burrowers. Distant lightning and rain have no hidden damage mechanic; reduced motion disables both animations.

On first entering Botrune, Fatima reads fabricated charges to a silent crowd on the abbey stage. Three prisoners are killed first. The last two are revealed as Pate and Trade, who recognise Aimon and urge him to run. Fatima executes them, with non-graphic overworld blade/fall animation. Dialogue advances through player confirmation; each completed beat is durably saved before its animation. Reloads continue from the next beat.

`BT-PUBLIC-SENTENCE-20261020` is recorded once. `humanLives['CHR-PATE']` and `humanLives['CHR-TRADE']` hold separate historical deaths and current life states. The scene does not consume human restoration uses, award companion starters, heal deaths or revive anyone. Canonical `human_life_state`, `pate_progress_state`, `trade_progress_state`, `human_memorial_entries`, `human_restored_ids` and the constant five-use restoration budget are maintained. `humanLives` additionally preserves execution provenance. The existing memorial lists their names when dead. Future restoration must preserve history and obey the total five elective uses.

Witnesses identify the lies after the scene. Aimon may retreat, heal and prepare. Three captains (4, 5 and 6 partners) physically block the only stage stair in sequence. Victories persist. Fatima fights on the stage with six partners at levels 74–77: Ruffellow, Ramporque, Clinchitin, Falchawk, Ragevolt, Dreadcleaver. Every battle slot uses four existing legal physical attacks; stats are unmodified.

After victory, SPARE/EXECUTE remains a separate permanent judgement. Both remove her from rule and protect civilian services and abbey records. Spare permits supervised rematches; execute gives the established one-time 50,000-doubloon/nursery reward. Aimon returns to his friends for grief and keepsake dialogue. The War Road is the new chapter boundary.

## Assets and size

`dist/assets/CHR-PATE.webp` and `CHR-TRADE.webp` are compressed runtime copies of the reviewed ready assets, 512×683. `LDR-06.webp` is a new 512×768 portrait matching the existing character illustration style. All three were uploaded using GitHub's browser file upload, staging commit `93dd2ce1ed975dc1f7f74f4381e9eb2a257d08e5`.

The new leader's built-in generation prompt specified a Middle Eastern woman scholar-cleric, cream/aubergine robes, gold trim, manuscript belt, dark arranged hair, archival gloves, restrained ruthless expression, closed ledger, full body, transparent background, and no Poké Balls. Existing `LDR-05.webp` supplied style reference. One background-extraction revision was applied, then resized/compressed to WebP. No generated illustration was used to replace the game's terrain system.

Runtime portrait sizes: Pate 55,678 bytes; Trade 57,936; Fatima 80,676. Combined 194,290 bytes versus 199,756 bytes for the previous two portraits. Net artwork reduction: 5,466 bytes. Existing quarry ground/cliffs, fort stone, banners, NPC portraits and guard artwork are reused. New rods, stage/stair geometry and weather are native canvas drawings.

`archive/` and `art-library/` remain outside the APK; only selected `dist/` runtime assets are packaged.

## Original source anchors affected by this overlay

- CH07-E01–E05: the original neutral archive entrance, hypothesis, Trade marginalia, technical-control challenge and judgement. The user replaces the entry/challenge with the stage execution and physical gauntlet. Preserve the archive's evidence and common-origin religious material for a later civilian archive visit; never claim the old scene flags were completed by the new confrontation.
- CH08-E03: Oren's old account of transferring the pair to Emmara must be rewritten in any future Cayfen chapter. Their deaths in Botrune are now known.
- CH09-E03/E06–E08: the delayed Emmara death reveal and original last notebook entry must not recur. The friendship cord, field notebook, rejection of martyrdom language and grief's supernatural pivot remain usable without a second death/reveal.
- STATE-042/052/079/083/104: independent human life/progress, persistent memorial history, restoration after its authored unlock, and five elective total uses remain in force. The historical-death location changes from Emmara to Botrune under this user overlay.

Release checkout now selects runtime, scripts, tests, wrapper and docs; reference image archives are neither downloaded for the release job nor packaged into the APK.

## 21 October 2026 — Thunder Crown overlay

See `thunderplain-crown.md` for the mandatory mountain detour, Darius/Tianzhar encounter, full-screen storm flashes, functioning Gothic lower streets and execution comic panels. The original nine trial indexes and historical deaths above remain unchanged; the two companion beats now carry illustrated panels and expanded dialogue. This supersedes the earlier generic sentence animation description for those two deaths.

## 21 October 2026 — v0.90.17 verdict and aftermath revision

The eastern Thunderplain road now enters the Gothic lower main street. The public execution begins only on crossing into the next screen, the abbey square. All five prisoners receive distinct fabricated charges and death verdicts; civilians object during the first three deaths while the soldiers enforce orders. Guard recognition and hesitation begin only with Pate and Trade, who came to arrange a wagon ride and helped garrison wounded. The same nine saved beat indices, death event and independent life histories remain intact.

The two replacement execution comics use the built-in image tool with the existing panels as edit targets and canonical CHR-PATE, CHR-TRADE and the v0.90.16 LDR-06 full figure as identity references. Prompt: retain three horizontal rainy Gothic panels, adult companions, green Pate/navy Trade costumes and broad heavy-built Fatima; show a decisive fatal sword strike and immediate motionless aftermath with restrained blood, no dismemberment/exposed anatomy, no lettering. Selected 720×900 WebPs: `dist/assets/pixel/bt-pate-panel-v09017.webp` and `bt-trade-panel-v09017.webp`; earlier panels remain in git history.

Aimon understands that his older friends wanted to keep him safe, rather than merely send him home. He voices anger at Fatima and the soldiers. Walter does not demand forgiveness; he steadies Aimon, helps collect the cord/notebook and stays with him. The new `walterCalmed` completion flag is independent of historical deaths and works for existing keepsake saves without replaying the trial. The next-chapter boundary points back to this scene until completed.

All six executed leaders’ unique first-form nursery gifts now carry permanent +15 percentage points to each of six growth rates and a fixed 25% shiny roll. The bonus survives evolution and save hydration, stacks once, and does not retroactively recalculate existing stats. Receipt-based migration upgrades existing living or memorial gifts once, preserves existing shiny status and death, never recreates released gifts, and never duplicates money. Spare remains the repeatable rematch choice.
