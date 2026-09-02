# ABYSSALS — ACTIVE CANON MASTER

## 1. Game identity and structure
Abyssals is an original monster-capture RPG. The mortal route moves through a linear critical spine with local branches, from England-like crusader territory toward the Holy Land, then descends through nine Circles of Hell. Themes concern individual moral decisions, the way organised religions divide similar people, and the indifference of gods. The game never exposes a single good/evil or morality score.

Target progression: approximately level 100 by the final mortal leader and level 200 by the end of Hell/postgame. Hard level cap: **200**.

## 2. Core cast
- Aimon — renamable protagonist.
- Pateric “Pate” Vann.
- Traden “Trade” Cor.
- General Kurg Halbrecht.
- Severin Vale — Guide form, later Underworld King/King Below presentation.
- Illyr — cosmic god-being associated with the True Light / Dawn Bloom religious split.
- Chaplain Aeric Solm — recurring reserve access NPC in every town.
- Dame Rhoswen Vey and other named supporting characters from the Story Bible/trainer manifest.

Eight mortal leaders:
1. Ser Aldren March (L01)
2. Abbess Yselle Marot (L02)
3. Provost Corvin Sair (L03)
4. Warden Samiel Elow (L04)
5. Castellan Braska Morn (L05)
6. Canon Mirelle Avin (L06)
7. Marshal Oren Talv (L07)
8. Hierophant Lucain Serault (L08)

## 3. Factions and portrait language
**True Light:** white/European medieval-crusader-inspired humans; cool blue, white/ivory, silver/weathered steel, navy; sparse gold.

**Dawn Bloom:** grounded Middle Eastern/West Asian-inspired fantasy clothing and appearance; deep violet/plum/aubergine, cream/sand, brass/gold, restrained teal.

Human/NPC source portraits are full-body, standalone, head-to-toe, clean 2D anime/JRPG concept art on pure `#FF00FF` magenta with no text or scenery. One requested portrait must equal one image generation; never combine requested portraits into a collage/contact sheet.

## 4. Species, levels, XP and growth
- 187 species are in the regional/project dex; the canonical front-facing species sprites are complete.
- 98 evolution paths.
- 100 XP per level.
- Participant XP scales using the participant's own level relative to the defeated enemy; do not award one shared level-gap result to all participants.
- Growth uses independent Fire Emblem-style stat rolls, seeded per individual.
- Mean Growth = `32 + 0.06 × (BST - 300)`.
- Mean Stat = `BST / 6`.
- Stat growth % = `max(10, round(Mean Growth × (BaseStat / MeanStat)^2.25))`.
- Growth over 100% allows deterministic exceptional +2 outcomes according to the locked roll logic.
- HP receives +10 baseline per level in addition to its roll behaviour.
- Evolution applies fixed promotion jumps and reweights future growth; it does not retroactively reroll the individual.
- Wild growth is seeded/deterministic.

## 5. Learnsets and moves
- Every move is explicitly Physical, Special or Status.
- Accuracy values are authored, normally using 100/95/90 bands. Self/side/field status moves use `ALWAYS` rather than a fake hit roll.
- Only **Plain Dash** and **Frost Shard** have +1 priority; all other currently validated moves have priority 0.
- Targeting uses an explicit target enum.
- Signature moves are exclusive to their evolutionary family.
- Aeric provides free relearning whenever normal reserve access is available.
- Evolution preserves the current four moves and separately offers any explicit evolution move; it may not silently overwrite a move.
- Passed/declined evolution moves enter the relearner pool.
- Story-choice branch history prevents opposite-branch move leakage/relearning before the postgame branch unlock.

## 6. Battle core and presentation
- Gen III-style damage/capture foundations are retained where specified by the design workbooks/checklists.
- First-person Dragon Warrior Monsters-style player viewpoint.
- Player active Abyssal is not rendered; enemy/wild front sprite is visible.
- Existing 187 front-facing sprites are sufficient; no canonical 187 back-sprite set is required.
- Both sides show HP bars plus small exact current/max HP numbers.
- Player attacks use move/type VFX travelling from the foreground into the enemy.
- Enemy attacks do not require reverse-direction move VFX: use enemy front-sprite motion, foreground/screen impact, a small damage number and HP change.
- Simultaneous KOs are batched. Against mortal leaders, a mutual-death result still counts as player victory because allied army support controls the aftermath. Ordinary separate party wipes remain losses.

## 7. Capture
- Capture is food-based, not ball-themed.
- Capture formula preserves the locked Gen III-style probability/shake foundation; food supplies the catch modifier.
- Presentation: thrown food, eating animation and a deterministic 0–100% closeness bar derived from the actual capture chance/RNG result. Success reaches 100%; failure stops below 100%.
- Capture outcomes cannot reroll after reload.

## 8. Party, reserve and death
- Active party size: 6.
- Reserve: unlimited.
- Reserve access only through recurring Chaplain Aeric Solm in towns.
- Reserve healing is instant when accessed through the approved reserve interaction.
- Ordinary 0 HP is lethal/permanent death unless a starter life rule intercepts it.
- Reserves do not auto-deploy into an expeditionary wipe.

## 9. Starter three-life system
Only the three original starter **individuals** (Aimon's chosen starter and the starters assigned to Pate and Trade) receive this system.
- Start with `starter_lives_remaining = 3`.
- A non-final lethal action decrements once per lethal action/KO event, never once per hit in a multi-hit action.
- Starter remains down for the rest of that round.
- In end-of-round cleanup, after normal end-of-turn layers but before battle-end/wipe classification, it returns at `max(1, ceil(max_hp × 0.10))` HP.
- Persistent battle status is cleared; PP, progression, training, evolution state and held item otherwise remain.
- If its action later in that round had not occurred, the action is lost.
- A pending non-final starter return prevents wipe classification.
- Lives progress 3→2→1; the next lethal loss takes 1→0 and causes normal permanent death.
- Life pips are visible in battle.

## 10. Memorial and resurrection
- Civeton memorial is absent at game start.
- First permanent Abyssal death creates pending establishment; memorial appears on the next Civeton revisit and stays thereafter.
- Visible Abyssal memorial contains only currently dead/unresolved Abyssals; restored individuals are removed from the visible list.
- Dead-instance data preserves identity, species, nickname, level/XP, growth seed, exact stats, ability, current four moves, evolution history, active training effects, death place/chapter/order and sprite/form key.
- Epitaphs are deterministic authored-template results; no runtime generative text.
- Resurrection restores the exact original individual at full HP/full PP/no status.
- Cost: exactly **10 living Abyssals of 10 different Dex/species IDs** permanently sacrificed.
- Duplicate species cannot both count toward one resurrection. Money/items/Trial Marks cannot substitute.
- Starred/favourite and starter sacrifices are legal but require stronger warnings.
- Sacrificed Abyssals are permanently deleted and never enter the memorial.
- Held items return to inventory on death and are not duplicated on resurrection.
- Resurrected target returns to party if there is room, otherwise reserve.
- Human memorial is separate and historical; humans are never resurrected through the Abyssal memorial.

## 11. Items, economy and training
- Starting money: 2,000.
- Wild battles award no money and there is no routine monster-material crafting grind.
- Ordinary purchasable items sell for 50% of shop price, rounded down; sell-only treasure uses listed value.
- No resurrection consumable.
- Capture foods, healing/status/PP consumables, held items and authored evolution items form the core economy.
- Resonator replaces purchasable Repel: when enabled, suppress a generated wild encounter if generated wild level is at least five levels below the first living party Abyssal; do not reroll repeatedly seeking a stronger result.
- Cybressa's **The Proven Grounds** pays Trial Marks for repeatable deterministic procedural contracts.
- Trial Marks buy temporary **+20 percentage-point stat-growth** effects lasting 1–5 future level-ups.
- Up to **five active training effects per Abyssal**, freely stacked on one stat or split.

## 12. World, travel and encounters
- Linear critical spine with local branching and optional areas.
- First travel is manual. Paid carriage fast travel unlocks between discovered settlements; couriers are thematically equivalent but individually presented.
- Free backtracking; no HM-style traversal requirements.
- Personal watercraft/Wayfarer Skiff after Philomere unlocks water/backtracking routes.
- Day/night changes every **10 real-time minutes**. Hell uses PALE/DARK mechanically equivalent phases.
- Encounter tables are authored, location-levelled and never dynamically scaled to the player's party.
- Current encounter workbook: 72 areas × 2 phases = 144 tables, six slots each, 100% total weight per table.
- Encounter frequency bands: LOW ≈6%, NORMAL ≈10%, HIGH ≈14% per eligible step (engine tuning may change frequency, not table composition).
- Safe settlements, rest/shop/dialogue thresholds, active puzzle interactions and cleared boss arenas suppress random encounters.
- Starters, Watchers, box legends and mythics are excluded from ordinary random encounters. Fossils use authored main-game restoration and postgame Primeval wild populations.
- WRONG_SHIFT remains a rare authored anomaly category.

## 13. Mortal leader fate
Only the eight mortal leaders receive explicit **SPARE / EXECUTE**.
- Seven resolve fate after the leader battle result.
- **Warden Samiel Elow** alone may formally surrender before final partner defeat once defeat is decisive.
- Battle defeat is not human death.
- SPARE removes the leader from power without Aimon personally killing them; authored custody/exile/medical/supervised outcomes vary by character.
- EXECUTE is a separate deliberate post-battle order. The actual active Abyssal is represented by one of **18 generic type proxies**, chosen from primary/Type 1.
- Fate state is `UNRESOLVED / SPARED / EXECUTED`, committed irreversibly before ordinary play resumes.
- Executed leaders return as improved Hell trainer encounters; they do not become Wardens.
- Equivalent essential services remain available regardless of fate.
- Current human restoration rule: **five elective uses total**; Pate/Trade consume a use only if chosen for restoration. Restoring an executed leader changes current life state but never rewrites historical `EXECUTED` fate.

## 14. Hell terrain / Warden fields
Warden fields are persistent, symmetric and active before Turn 1. Temporary field replacement may occur, after which the native field resumes according to the locked field system. UI must make the current field readable. The locked field identities include:
- Namefog
- Gilded Dust
- Blood Sun
- Iron Decree
- Twin Radiance
- Mourning Rain
- Cocytus Hail
- Quiet Night

The terrain specification also locks its special Rock Sp. Def and Ice Defence boost interactions. Do not silently replace these with standard Pokémon weather defaults.

## 15. Ironman save and persistence
- 3 independent campaign slots.
- One authoritative current state per slot.
- Current snapshot + two hidden recovery-only rolling backup generations + transaction journal.
- Monotonic `commit_seq` and idempotent transaction IDs.
- Atomic durable commits for death, starter-life loss/pending return, capture, sacrifice/resurrection, evolution, move choices, item ownership, leader fate/story choices and chapter completion.
- Deterministic command/RNG/encounter persistence prevents reload rerolls.
- Starter life decrement and pending 10% return survive crashes exactly once.
- Corruption recovery selects the highest valid state automatically; the player does not choose a rollback backup.
- Schema migrations are forward-only and atomic with hidden pre-migration protection.
- Save Now / Save & Quit create no rollback point.
- Technical soft-lock recovery may relocate the player only and may never reverse canonical losses.
- Legitimately unwinnable/protagonist-dead campaigns remain ended.
- Single-writer browser/session protection and durable-write acknowledgement are required.

## 16. Overworld implementation locks
- Four cardinal movement directions only; no diagonal movement.
- Tile/logic grid is 16×16.
- Walk/run speed target band is 64–112 px/s.
- Moving off a map edge transitions to the adjacent authored map/screen in classic Pokémon/Dragon Warrior Monsters style rather than maintaining a giant seamless world.
- Checklist 17 owns exact overworld object movement, escort paths, NPC exits and map-object removal after story/fate scenes.

## 17. Art asset status
- 187 species front sprites: completed project source set.
- Human/NPC portrait production manifest: 100 unique named targets + 39 reusable class templates.
- Portraits serve dialogue and pre-battle/send-out presentation.
- Environment/location art is a separate production pass.
- Human portrait cleanup must remove exact magenta, crop/align consistently and place figures on an agreed uniform production canvas before runtime use.
