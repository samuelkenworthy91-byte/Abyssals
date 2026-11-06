# Abyssals — eight new adventure, battle and evolution tracks

Prepared from eight audio attachments received on 6 November 2026, including `Metamorphosis Triumph.m4a`. See `TRACK_MANIFEST.json` for each original title, new filename, AAC packet hash, SHA-256, sample rate, duration, and size.

## How the files were optimised

The originals are 48 kHz stereo AAC-in-M4A files with large embedded MJPEG cover images. Each new M4A was remuxed with ffmpeg using `-map 0:a:0 -c:a copy -map_metadata -1 -map_chapters -1`. Album images, metadata and packaging overhead were discarded; there was **no audio re-encoding**. The AAC audio packet SHA-256 hashes match the original sources for every track.

Original total: 22,833,068 bytes. New total: 14,555,966 bytes. Saving: 8,277,102 bytes (36.25%). Zip compression of existing AAC audio does not meaningfully reduce size beyond this.

## New track roles

| Track ID | Runtime file | Intended use |
| --- | --- | --- |
| `adventure05` | `adventure05-where-the-sky-meets-the-sea.m4a` | Regular route/exploration shuffle pool |
| `adventure06` | `adventure06-beneath-a-restless-heaven.m4a` | Regular route/exploration shuffle pool |
| `adventure07` | `adventure07-the-unseen-presence.m4a` | Regular route/exploration shuffle pool |
| `adventure08` | `adventure08-the-emerald-apocalypse.m4a` | Regular route/exploration shuffle pool |
| `battle02` | `battle02-ironblood-rebellion.m4a` | Regular battle shuffle pool |
| `battle03` | `battle03-teeth-of-the-abyss.m4a` | Regular battle shuffle pool |
| `battle04` | `battle04-furious-rhythms.m4a` | Regular battle shuffle pool |
| `evolution` | `event-abyssal-evolution.m4a` | Every real evolution, including associated rank-up screens until final UI exit |

## Verified existing main-branch architecture at packaging time

The existing `dist/soundtrack.js` contains 17 stable cue IDs, `dist/music.js` builds `MUSIC_TRACKS` from it, and `tests/soundtrack.test.mjs` validates event routing. These are ALREADY implemented; augment them rather than replacing earlier music integration.

The existing general exploration music includes `overworld` (`adventure1.mp3`) and `route` (`route-catching-up.m4a`). `journey` (`route-journey-across-the-realm.mp3`) belongs to the starting town Kyvton (the internal Civeton/`town` map). `dark` (`route-ancient-shadows.mp3`) belongs to Botrune. Those two named town tracks must **not** be accidentally included in general random exploration music.

The existing generic battle music is `battle` (`BattleTheme1.mp3`). `leader` (`battle-city-leader.m4a`) remains fixed for leader encounters and rematches, not randomised. Existing special cues (`darius`, `descent`, `execution`, `burial`) remain event-driven, not randomised.

### Mandatory playlist behaviour

1. Build a shuffled, nonrepeating playlist of eligible **ordinary exploration** cues across all ordinary walkable routes and side routes. Do not assign a particular regular track permanently to a region. Select the next entry only after the current song naturally finishes; do not change songs on a map transition or render tick. Continue the selected track from the same timestamp across all connected rooms of the side shoot, including screen transitions.
2. The initial ordinary route playlist should contain `overworld`, `route`, `adventure05`, `adventure06`, `adventure07`, and `adventure08`. Preserve Kyvton/Civeton and Botrune's dedicated cues and each other dedicated town.
3. Build an independent nonrepeating shuffle bag for **ordinary combat** containing `battle`, `battle02`, `battle03`, `battle04`. Pick at ordinary battle start, regardless of area or encounter type, and let the song finish normally if combat continues long enough. If it ends during an unusually long fight, select another shuffled battle cue at its natural ending (no abrupt cut). Avoid the same song twice consecutively. Leaving combat resumes the interrupted route song at its previous position. City leader, Darius, execution gauntlet and other authored story/boss music retain priority over this ordinary battle pool.
4. Narrative music should remain stable and adhere to its existing scene boundaries. In particular `execution` starts at Botrune's sentencing cutscene and carries through the guard gauntlet, including regular battles, until Fatima's leader fight actually starts. `descent` remains throughout Darius's mountain sequence, and `burial` during the remembering-tree event. Never shuffle those.
5. Preserve existing pause/mute, audio focus, background tab, offline/PWA, Android and save/reload semantics. Retain the current selected cue, position, and shuffle-bag state across sensible pause/reload boundaries; do not make changes to game saves destructive.
6. `dist/music.js` currently creates `audio.loop=true` for every cue. Make ordinary playlist tracks end naturally so an `ended` callback advances the playlist. Continue looping fixed town/event tracks where their authored design requires looping. Do not restart a selected song every time the UI rerenders.

## Upload/checks

Work should use Cloud Browser GitHub upload in small batches and verify all seven destination paths/checksums. The intended live files go in `dist/assets/music/`. It is fine to retain a source-only copy in `music-m4a/` outside `dist` if that matches the existing repository's provenance convention. The full soundtrack must remain offline playable on PWA and signed Android APK. Preserve signing identity, save format, and original source music. Verify with real decoded audio and tests; do not claim APK publication unless GitHub Actions published it successfully.

## Licensing

The files are user-supplied Suno exports. Rights for public/commercial distribution depend on the user's Suno plan and generation history and are not verified here. Keep provenance and confirm entitlement before any commercial release.



## Eighth cue INCLUDED — Metamorphosis Triumph (EVOLUTION)

Audio is now INCLUDED in this archive at `music/event-abyssal-evolution.m4a` with track ID `evolution` and runtime destination `dist/assets/music/event-abyssal-evolution.m4a`. This is the user's supplied `Metamorphosis Triumph.m4a`, preserving its full original **62.805-second** AAC audio stream. All embedded artwork and extra metadata were removed with FFmpeg audio stream-copy, with unchanged elementary stream hash (see manifest).

**The music must be governed by the entire EVOLUTION USER INTERFACE, not by the duration of the source audio.** On starting a confirmed Abyssal evolution, pause any town, route, combat, gauntlet, burial or other underlying music with its playback timestamp and shuffle state preserved; start the evolution theme at time zero. Maintain it without resets during the physical transformation animation, reveal of the evolved form, updated stat/rank-up screen, innate ability changes and new-move screens caused by that evolution. While any linked evolution/rank-up panel remains open, the evolution track owns the audio; if it reaches 62.805 seconds, loop THIS SAME TRACK rather than resuming the underlying track or drawing from a playlist. On final dismiss/exit of ALL evolution-linked pages, stop/reset evolution audio immediately (optional brief fade if responsive) and restore the paused prior cue at the saved position. Do not resume at the instant of transformation or on the song's `ended` event.

Trigger for every legitimate completed evolution (ordinary EXP, item, quest, story/leader-fate, etc.), without starting for mere level-ups, previews or aborted changes. For consecutive evolved party members, play anew per evolution flow, serially, without overlap. Beware durable leader-fate evolution notices: queued presentation may be delayed after the fate dialogue or resumed from save. Do not replay acknowledged notices. If the game restores an evolution scene mid-flow, continue the proper active cue; if that UI is no longer active, restore previous music. Handle Sound off, tab-hidden/mobile backgrounding and autoplay rejection safely. Never let missing music freeze the game. Add tests for evolution animation, stat rank-up, ability/move panels, interim reload, quick skip, long-open panels, multiple evolutions, ordinary/leader/story priority, and exact resume position.

**Note on duration:** The generated track is longer than the earlier 20–25 second target. It was intentionally NOT trimmed because its role is now to cover the complete evolution and rank-up UI, which may last longer. The cue ends when that UI ends, not when the file runs out.
