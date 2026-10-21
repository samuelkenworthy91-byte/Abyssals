# Finale double-battle integration research

Read-only runtime audit of v0.90.17, 21 October 2026. Root owns implementation.

## Reuse the genuine existing 2v2

`dist/relic-double.js` already gives every active actor one independent action, sorts by move priority/effective Speed/tie RNG, retargets after a KO, resolves spread moves against both foes, consumes one PP for a spread action, and runs end-of-round effects. `app.js` has the UI, health animations, partner switching, starter-life returns and ordinary-player permanent death. Do not reimplement these in an unrelated system.

Minimum saved shape: keep `kind:'wild', relicDouble:true, alliedRivet:<Hasan ally>, finaleDouble:true, activeEnemyIndices:[0,1], reserveCursor:2, enemies:<six Darius units including Cruxwyrm>, targetIndex, defeats, participants, randomState`. Keeping the existing `alliedRivet` storage key avoids save hydration/repair changes merely to rename the ally; render its actual name. Keep total enemy array at six because `save-transfer.js:25` validates a maximum of six.

**Critical:** `doubleLivingTargets()` currently returns every living member of `b.enemies`, and `doubleRound()` lets all of them act. A six-unit trainer array must be filtered by `activeEnemyIndices`, or this becomes 2v6. For old relic saves with no active-index field, retain the current default. Replace fallen active slots with reserves only after the current round and KO ledger complete. Replacement units must not get a bonus action in the round in which they arrive. Save indices/cursor together with all HP/PP and RNG.

## Exact app hooks

- Imports: existing `doubleRound,doubleLivingTargets` import is at `app.js:54`.
- `startRelicDouble`, line ~893: parameterize with a trainer/story configuration, or add `startFinaleDouble` beside it. Create Hasan's Serapine through the normal unit initializer; set its withdrawal floor to 1, never put the ally in the player's party/reserve, and never grant it as a reward. Create Darius's six units with legal moves/normal progression. Initialise abilities/field and pre-load all actors' battle art. Take `wildCheckpoint()` before mutations, persist before showing actionable UI, rollback on save failure.
- `renderBattle`, ~353: existing `relicDouble` branch already dispatches to `renderRelicDouble`. No second rendering router is needed if that flag stays true.
- `renderRelicDouble`, ~894–896: parameterize title, location, ally name and retreat text; render only the two active enemies. Keep enemy cards as target buttons with stable full-array indices and `aria-pressed`. Keep move buttons, specialist medicine, poultice, Switch and Wait. **Omit all capture food and capture buttons for the finale trainer battle.** The original relic battle intentionally allows capture; carrying this over would let one bread end Darius's whole battle.
- `wildTurn`, ~503: already delegates all actions to `relicDoubleTurn` when the flag is true. Specialist medicine buttons and party-menu switches use this route automatically.
- `relicDoubleTurn`, ~897–908 (there is no function named `relicDoubleAction`): preserve its validation, checkpoint/rollback, saved-before-animation convention and life/death handling. Add an early guard rejecting every `action.food` for `finaleDouble`, not merely a disabled UI button. Parameterize Rivet dialogue. After `doubleRound`, log newly defeated active units once, then refill slots from reserves. Victory means no active or reserve enemies remain; an empty active pair alone is not enough. A dead player requires a free switch and the replacement does not grant a free Hasan/enemy round; current `skipRound=free` does that correctly. If retreat is allowed, use smoke/explicit surrender semantics for this trainer rather than the relic wild 80% escape roll.
- `finishWild`, ~546: first line already forwards relic doubles to `finishRelicDouble`, so completed double saves resume through the right finish route.
- `finishRelicDouble`, ~909–910: branch immediately on `finaleDouble` to a dedicated finish function or equivalent. Never call `claimRescuedRivet`, never use `b.capturedUid`, and never use `kind:'relic-rescue'` for the finale. Atomically mark the final Darius resolution and store the released Cruxwyrm specimen. Then call `commitRewards` with a dedicated handoff (or trainer handoff with explicit final-Darius completion) and show the Hasan invitation only once after reward cards. Retry failed reward saves without granting twice.

## Cruxwyrm survival and its later encounter

Cruxwyrm must withdraw alive in the trainer confrontation to become the later unique wild encounter. The engine's `applyMove` uses the explicit `options.floor` for damage; merely setting `unit.combatFloor=1` is insufficient when relic-double hardcodes enemy floor 0. Pass the target's protected floor for the bound Cruxwyrm, and treat reaching that floor as withdrawal for target/KO/slot replacement. Exclude a withdrawn unit from plans and cleanup. Its `combatFloor=1` also protects end-ability residuals; check non-ability extra residuals as well. Ordinary player partners retain floor 0 and permanent death. Hasan's ally withdraws at 1; do not heal an actual dead player unit in order to protect the plot.

Store one full specimen with stable uid, species, stats, shiny and moves before launching the later wild fight. For the released fight, clear trainer binding/withdrawal floor, restore its readiness once according to the same existing Tianzhar pattern, and permit ordinary lethal/capture mechanics. Respect ownership and memorial checks and persistent captured/dead encounter state.

New wild encounter hooks:

1. `startWild`, ~492: carry `encounter.finaleId` into `battle.finaleId`; select a previously saved specimen when present, otherwise freeze the first individual once. Use this for Guanrong, Feirong and Cruxwyrm independently.
2. `finishWild`, ~546: before the existing `stormId`/`marasenId` handoff ternary add `b.finaleId ? {kind:'finale-mythic',id:b.finaleId,outcome,uid:captured?...}`.
3. `commitRewards`, ~557: settle `finale-mythic` exactly once before EXP/cards; a failed settlement must rollback state just like the existing storm/mythic branches.
4. `showRewards`, ~575: add the finale handoff branch when the queue empties; maintain `rewardHandoff` until presentation is durable.
5. If player wipe and enemy lethal KO happen together, normal `commitRewards` is skipped. Still record the unique creature's death before saving that outcome; otherwise returning later would resurrect it. Give no victory rewards on wipe. Escaping should not grant captured/dead state or reroll the individual's shiny/identity.

## Save, abilities and controls

- `persist` ~175 serializes the entire wild battle via object spread, replacing player with `playerUid` and RNG with `randomState`. Extra active-index/finale fields survive without new serializers.
- `wildCheckpoint`/`rollbackWild` ~500–501 and `resumeSnapshot` ~479–486 hydrate all enemy units plus `alliedRivet`. Keep the player's actual party/dead object, not a cloned battle copy, so perma-death and HP remain authoritative. Rebind abilities with the ally included where required; never initialise a new random team or change slot indices on resume.
- `save-stat-repair.js` already repairs `alliedRivet`; `save-transfer.js` already validates it for relic doubles. Add validation for active indices/cursor/finale ID (integers, in range, no duplicate active slots) rather than silently trusting imported values.
- Native D-pad/A/B are generic DOM button navigation in `consoleFocus`/`#console-a` (~469–477). Target cards and commands work automatically if they remain real enabled buttons. Give Switch accessible party controls after player KO. B currently only backs out of menus/inspectors; do not make it silently flee a story battle.
- `hideBattleSurface`, ~490: currently leaves ability state on player/enemies only; add the ally to cleanup for either double mode.

## Town and world installation hooks

- `expansion-world.js` bottom: call a new `installFinaleWorld(NEW_MAPS,NEW_DOORS)` after Botrune installation. `world.js` subsequently derives `AREA_GATES` and copies `NEW_DOORS` into `DOORS`, so installing after `world.js` imports would be too late.
- `expansion-world.js` `newWalkable` ~48: insert custom finale collision before `m.hub` returns unrestricted true. `drawNewMap` ~51: custom raster-background hook must return before old tile drawing. `newBlocked` already keeps marker/prop footprints and door openings.
- `newSpots` ~50 has a generic `NEW_DOORS[room]` fallback before `NEW_MAPS[room]`; add a finale interior branch before it or represent custom rooms as maps with gate doors so gallery/NPC spots are not replaced by generic household.
- `app.js` installer calls ~140–144: register final trainers/voices before constructing the `images` array. Register new LDR-07/08 portrait mappings before trainer image URLs are formed. `challengeTrainer`/`startRouteTrainer` support unknown new leader IDs; existing `canChallengeFortLeader` returns true for non-old-fort IDs. Add new story prerequisites explicitly.
- `interact` ~654 and `baseAreaRoute` ~653: insert finale interaction/encounter handlers before generic fallbacks. Add finale objective/marker filters/blocking alongside Botrune hooks, and route `leaderFate` ~814 to the new leader7/8 fate dialogue before the legacy Philomere fallback.
- `enterRoom`/`exitRoom`/`checkDoor` ~400–402: standard building doors are parent coordinates; interiors spawn at `(24,24)` and exit `(24,27)`. Mark towns `hub:true` and ensure visible door pixels/footprints match these parent door coordinates.
- Town services: `local-aeric` opens Walter menu; `local-supplies` opens shop. `field-items.js:2` `PRIEST_RETURNS` must add both towns and clinic interiors, or reserve nursery/rest services silently refuse. Add unique inn service if needed using ordinary living-only rest.
- Caravan: add both hubs to `fast-travel.js` `TRAVEL_HUBS`, recognise their room prefixes in `townForRoom`, and keep visit-only ledger rules. `world.js` adds hub spots automatically after maps install. Ensure travel arrivals are walkable and clear of NPC/door blockers.
- New leaders require execution bounty entries in `leader-outcomes.js`, legal ace babies and normal +15/25%-shiny legacy behavior; otherwise the shared fate HTML calls `.toLocaleString()` on an undefined bounty. Register them before `syncLeaderRewards` and rematch generation.
