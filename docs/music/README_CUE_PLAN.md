> **Owner correction, 5 November 2026:** Catching Up is a route theme; City Leader is the town-leader battle theme; Journey Across the Realm belongs to Kyvton / Civeton, the starting town; Ancient Shadows belongs to Botrune. The original plan below is retained as historical provenance. Current assignments and boundaries are in `INTEGRATION.md` and `TRACK_MANIFEST.json`.

# Abyssals audio handoff

Prepared from three user-provided ZIPs on 4 Nov 2026. **No audio was edited, transcoded, truncated or normalised**; only filenames were simplified. All 15 tracks have individual checksums in `TRACK_MANIFEST.json`.

Repository `samuelkenworthy91-byte/Abyssals`, current branch `main`. Existing `music-mp3s/adventure1.mp3`, `music-mp3s/BattleTheme1.mp3` and their runtime copies must be retained.

## Track mapping

| Renamed source | Original name | Proposed role | Duration | Status |
|---|---|---|---:|---|
| `music-mp3s/route-journey-across-the-realm.mp3` | Journey Across the Realm (Take 2).mp3 | Route Adventure 3 | 171.4s | verified_from_title |
| `music-mp3s/route-ancient-shadows.mp3` | Ancient Shadows.mp3 | Route Adventure 4 | 105.8s | verified_from_title |
| `music-mp3s/town-dorelem.mp3` | Bastion of the Weathered.mp3 | Dorelem | 166.3s | verified_from_title |
| `music-mp3s/town-philomere.mp3` | Sanctuary of Reeds & Light (Take 1).mp3 | Philomere | 150.8s | verified_from_title |
| `music-mp3s/town-cybressa.mp3` | Locks, Merchants & Shadows (Take 2).mp3 | Cybressa | 163.9s | verified_from_title |
| `music-mp3s/town-cossenne.mp3` | Ancestral Orchards (Take 2).mp3 | Cossenne | 179.0s | verified_from_title |
| `music-mp3s/town-botrune.mp3` | Citadel Under Thunderclouds (Take 2).mp3 | Botrune | 159.6s | verified_from_title |
| `music-mp3s/town-cayfen.mp3` | Studios Above the Sea (Take 2).mp3 | Cayfen | 179.2s | verified_from_title |
| `music-mp3s/town-ramelle.mp3` | Gate of the Eternal Sky (Take 2).mp3 | Ramelle | 181.5s | verified_from_title |
| `music-mp3s/character-darius-idealists-burden.mp3` | Darius - The Idealist's Burden (Take 1).mp3 | Darius early/normal scenes | 160.6s | verified_from_title |
| `music-mp3s/event-darius-descent.mp3` | Darius's Descent (Take 2).mp3 | Thunder Crown mountain/Darius encounter | 176.3s | verified_from_title |
| `music-mp3s/event-pate-trade-execution.mp3` | Parting at Twilight (Urgent Cover).mp3 | Pate and Trade execution through pre-leader gauntlet | 178.0s | verified_from_title_cover_provenance |
| `music-mp3s/event-pate-trade-burial.mp3` | Boundary of Life & Memory (Take 2).mp3 | Pate and Trade burial tree near Cayfen | 177.5s | verified_from_title |
| `music-m4a/city-leader-UNVERIFIED.m4a` | City leader.m4a | Candidate city leader battle | 202.0s | needs_listening_confirmation |
| `music-m4a/catching-up-UNCLASSIFIED.m4a` | catching up.m4a | Unknown: listen before assignment | 215.0s | needs_listening_confirmation |

## Important cue timing and priority

1. Execution: start `event-pate-trade-execution.mp3` at the first abbey-square public sentence/cutscene beat, before Fatima begins announcing charges. Keep the same playback session and current time through Pate/Trade deaths, subsequent dialogue and every guard/captain battle. Do not reset/restart on each scene beat, map change, dialogue, menu, or temporary combat. Interrupt only when the actual Botrune **leader battle** begins, then use the leader battle track. When leaving this story region temporarily, pause/remember and restore on re-entry if gauntlet unresolved, rather than leaking the cue into unrelated towns. It may be looped if the gauntlet exceeds duration. No retrigger after finished. Honour Sound off / hidden app. Story receipts persist across reloads.
2. Darius unhinged: start at entry to Thunder Crown mountain ascent (not all Thunderplain screens). Keep it across linked mountain rooms and ordinary mountain encounters, ideally also Darius/Tianzhar confrontation until narrative handoff; then stop when the mountain crisis resolves / on descent. Do not prematurely switch to Botrune town music.
3. Darius normal: in his earlier non-unhinged encounters and dialogue while his ideals are in focus; no general town replacement.
4. Burial: trigger on the Willowmere remembering-tree funeral cutscene (not simply visiting the road); play from beginning through graveside dialogue, Walter, gifts, mourning. End after the event, allowing short tail/fade into route music. Do not replay on later visits.
5. Town cues: one stable track for each named town; do not change tracks between indoor/outdoor rooms unless a higher-priority event applies. Existing list has Civeton and Marasen **not identified** in the supplied files; use existing adventure1 fallback until separately supplied, not the wrong town theme.
6. Routes: `route-journey-across-the-realm.mp3` for general open paths, `route-ancient-shadows.mp3` for threatening areas; retain original `adventure1.mp3` as early/general fallback. Choose deterministic room/area assignments; do not shuffle every screen or step.
7. `City leader.m4a` is a plausible generic leader-battle track but unverified by name alone. `catching up.m4a` is unclassified. Work must audition them and verify the purpose before wiring (or preserve source-only until confirmed). Do not label either as a missing Civeton, Marasen, evolution, or boss track without evidence.
8. All battle transitions should avoid overlapping players. BGM should pause when tab hidden/muted, resume after unlock, preserve game flow even on decoding failure. Keep existing save schema, original Android identity/signing and offline asset cache correct.

## Upload instructions

Upload the MP3s as individual files to `music-mp3s/` on the latest remote main branch via GitHub browser; the two M4As can be staged under `music-m4a/` for review. Use GitHub browser `Add file → Upload files` with ~5 files per commit, verify hashes / filenames, then copy confirmed playback assets into `dist/assets/music/` (same bytes). Avoid uploading a ZIP and assuming GitHub extracts it. Coordinate with concurrent main commits and verify new commit SHA after each batch.

## Licensing / quality

Original title `Parting at Twilight (Urgent Cover)` explicitly says *Cover*; retain this provenance. Do not falsely claim fully original rights or that Suno free-plan outputs are commercially cleared. Ask the owner to confirm licensing before any commercial distribution. Do not recompress already-lossy tracks unless required for offline APK size; make optional conversions separately and compare quality.

## Suggested validation

Extend `dist/music.js` `MUSIC_TRACKS` and `createMusicController` without breaking the existing `tests/music.test.mjs` and `tests/music-portraits-browser.cjs`. Write deterministic audio-routing and browser tests for all 9 towns, routes, Darius mountain, battle precedence, execution persistence across the nine sentence beats, three guard fights, save/reload, leader battle takeover, burial onset/exit, mute, background tabs, offline PWA and legacy saves.
