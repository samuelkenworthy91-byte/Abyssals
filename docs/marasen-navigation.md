# Marasen navigation — v0.90.11

The main road runs Cossenne → Stonecut Steps → Fern Gallery → High Canopy → Pearlwater Falls → Unburnt Meadow → Braided Brook → Lanternwood → Rainvault Cliffs → Hundred Terraces → Refugee Kitchens → Spillway Tunnels → Lower Warning → Crown Reservoir → Broken Bridle → Water Gardens → Marasen. Darius's route is required; Silent Mill and Peach Orchard remain optional north trails. Tellurion's capture encounter is optional after Darius is defeated.

## Progress guidance

`marasenQuestStep` identifies the first unfinished action without revealing puzzle answers. Field objectives, route noticeboards, blocked passages and Journal use the same progress. A saved expedition deeper than its completed prerequisites is directed west through the correct local gate, with the destination room, person or tablet named. Tablet titles are directions; unread clue bodies remain hidden. Current objective text opens Journal when tapped, so phone users can read the full directions.

The required sequence is Maryam's expedition acceptance; kitchens tablet; spillway tablet and controls; Farid's challenge; Lower Warning tablet; Alice's challenge and evacuation signal; Crown Reservoir tablet and Darius's challenge. Later tablets unlock the optional Tellurion encounter. All existing quest fields, puzzle targets, irreversible choices and encounter rules remain intact.

Marasen's civic sequence names the missing household, levy account or forwarding letter and its location. It then directs players through the northeast Highwater arch and citadel doorway to the canal guard, household allocation controls, reservoir guard and Khalid.

## Geometry and artwork

The old caravan arrival `[30,20]` lies inside the rebuilt city's canal. The caravan now stands at `[32,18]` with a road arrival at `[32,19]`. Walter's return point is `[20,26]`, beside his current position. Caravan and normal warp arrivals use `nearestWalkable`; existing blocked saves already use this recovery on resume. Emergency returns resolve through the updated canonical priest location, including older rest records.

Remove the duplicate Lanternwood entrance to Darius, locked optional return shortcuts and unneeded Rapids-to-Bridges exit. Keep expedition rooms and their ordinary return routes resumable. Each remaining road/district gate records an entrance geometry at its interaction tile: existing stone arch art, cave mouth for the spillway/root vault, or the existing building doorway. Exchange stairs remain physical staircases. Remove floating city plaques and doorway mats under structural entrances. Nearby objective NPCs use one name label. Reuse optimized runtime art; no reference archive assets enter the APK.

## Verification and release

- `tests/marasen-guidance.test.mjs`: sequential missing prerequisites, local objective targets, old deeper saves, all road/district gates and interaction reachability, caravan and priest landings.
- `tests/marasen-navigation.test.mjs`: city district and six Exchange floors, bridges, furniture and entrance reachability.
- `tests/marasen-browser.cjs`: real resume recovery and walking, A-button caravan purchase and walking after arrival, Emergency Evac, blocked passage dialogue, tap-to-Journal, entrance screenshots.
- Existing site-tablet, farm and Botrune unit/browser regressions remain enabled.
- Android versionName supports multi-digit patch numbers by rebuilding the pinned wrapper's binary XML string pool, lengths and later offsets. `tests/android-manifest.test.py` checks pool alignment, preceding/following strings, package and versionCode for multiple lengths.

Release `0.90.11`, Android code `106`, same package and original signing certificate. GitHub Actions runs tests, reconstructs the compatible wrapper, builds, signs, verifies and publishes the APK. No physical-phone installation test is claimed.
