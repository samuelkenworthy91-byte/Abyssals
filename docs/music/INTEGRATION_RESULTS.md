# Eight-track soundtrack integration — verification record

Starting main: `4c0e1978de26de448079738f1ce484750152b1fb` (17 registered cues).

Audio browser commits: `16029ba` (four adventure files), `997edfc0340d35d52036ea801bbdc29311f6ad96` (three battle files and evolution).
Runtime/release source: `5ac37ab3f66f84b0ee2e1e9872cd61ceddd874e0`.
Version: **0.90.57 / Android versionCode 152**. Registered cues: **25**.

## Verified uploaded masters

Every file below was re-fetched from committed main, compared byte-for-byte by SHA-256 with the supplied ZIP manifest and decoded in full with FFmpeg. Every pre-existing runtime music file (17) is byte-identical to the starting commit. There are exactly 25 unique runtime audio files, without new duplicate source masters. No audio was trimmed, normalised or re-encoded during integration.

| Runtime file under `dist/assets/music/` | Bytes | SHA-256 |
| --- | ---: | --- |
| adventure05-where-the-sky-meets-the-sea.m4a | 2214792 | `52fa21eca892dcd95e9f30bb6f973636d1bf3627f6af174abb15302f1464f704` |
| adventure06-beneath-a-restless-heaven.m4a | 2198157 | `401768902c5adcac7f838cc79b91cecc922899980629a1c88c22d32eaf4b6d0c` |
| adventure07-the-unseen-presence.m4a | 1612162 | `f21bcb488e3a38071b404d6f2b5db3c81fc52d8ad0399b92e63ed605eedf0c58` |
| adventure08-the-emerald-apocalypse.m4a | 2039032 | `19e0f1f32a65dd4e4d1a48b14893d6ce253e7dafc3090d2307cc80347514b186` |
| battle02-ironblood-rebellion.m4a | 2136362 | `a4f1a92adc7055bb0434787742183a5657a201c8dda586bec1008a6fb85b4c9f` |
| battle03-teeth-of-the-abyss.m4a | 2035056 | `972aeeaeb9283770d34e3a2da9615c3c7b4f61b348fb3938b00c2c09a392b8c2` |
| battle04-furious-rhythms.m4a | 1601376 | `5a599b8e2faa45c633f57b40076b942606fc1a1f4f055a69e6585c902d0debfb` |
| event-abyssal-evolution.m4a | 719029 | `864d5a52be05ab38400c519386f7233ea225ad93e004e769563b8a623387c422` |

The evolution master retains its full 62.805-second recording. Detailed AAC stream hashes, durations and provenance are in [EIGHT_TRACK_ADDITIONS.json](EIGHT_TRACK_ADDITIONS.json).

## Playlist and evolution behaviour

- Ordinary route shuffle: `overworld`, `route`, `adventure05`, `adventure06`, `adventure07`, `adventure08`.
- Ordinary battle shuffle: `battle`, `battle02`, `battle03`, `battle04`.
- Each pool uses an independent nonrepeating shuffled round, with no immediate repeat at round boundaries. Only a natural media ending advances a pool. Ordinary map/side-route transitions preserve the same song/player/position.
- Town music remains fixed, including `journey` for Kyvton/Civeton and `dark` for Botrune. Marasen's existing `overworld` assignment is fixed and excluded from route randomisation while inside town.
- Ordinary battles pause exploration. Ending combat resumes that same exploration media position without consuming the route bag. A fresh ordinary encounter draws the next battle entry; long fights advance at natural endings.
- Evolution is an audio overlay with priority over every scene. The cancel-or-begin prompt is silent; confirming commits the actual evolution and begins its theme with the transformation. Reveal, stat/ability results, entry-move choices and their detail/confirmation screens share the same durable flow token. Native looping keeps that one recording active while any linked page remains open. The final exit stops/reset it and recalculates current story priority before resuming the appropriate paused player.
- Each consecutive evolution restarts from zero. Existing leader-fate receipts remain authoritative; old queued result/entry-move cards acquire compatible flow tags. Mid-flow reload restores cue, media time and bags. Completed/acknowledged sequences never replay from a summary.
- Sound off, hidden app, pagehide/pageshow and failed autoplay/decoding preserve gameplay. Soundtrack snapshots remain bounded and additive to existing saves. Neither music nor shuffle consumes combat RNG.

## Validation

Local checks completed:

- All 54 JavaScript regression suites passed.
- Focused music tests also cover all dedicated story/town/leader interruptions, page suspension, null legacy metadata and decoder failure.
- All 8 new committed hashes and whole-stream decodes passed.
- The full soundtrack verification script passed 23 manifest-listed source hashes, exact runtime copies and full-stream decodes; the two original source files additionally pass their preserved-byte checks.
- All 17 original runtime music files remain byte-identical; only 8 audio paths were added.
- Runtime cache identities, 2,704 offline assets, Android manifest/version handling and original package identity passed.
- Existing artwork scope remains 615 dedicated / 615 playable actions, with no artwork changes or new approval claims.

The focused real-browser evolution, branch evolution and ordinary music/portrait checks passed locally using the project's verified Playwright1.62.1 headless runtime. The broader story/offline check and final release gate cover:

- Actual six-track route endings, exact battle interruption/resume and side-route continuity.
- Real item/level/queued leader-fate evolution, cancellation, transformation/reveal, stat/ability and entry-move pages, loop beyond natural duration, consecutive evolution restart, muted/background state and reload during/after results.
- Existing Darius, mountain descent, nine Botrune execution beats, three guards, actual Fatima takeover, all town/interior themes, burial/gifts and saved aftermath.
- Actual playback/decoding of all 25 runtime cues; offline reload, all 25 music fetches and byte-range playback.

## Publication status

Release workflow: https://github.com/samuelkenworthy91-byte/Abyssals/actions/runs/42272150125

**Not published at this checkpoint.** Run42272150125 passed source validation but correctly blocked signing on two browser fixture failures. The fixtures are corrected and focused browser checks pass locally; a fresh complete release run is required. Final browser, signing and Pages results will be recorded after it completes.

The original package `uk.co.abyssals.game`, Actions-held signing key and expected certificate `6dafd2bf38549cb39acd54811ee21cf71eb9af37a115154a5c551fc85edc92ac` remain unchanged. Signing and alignment gates are retained. No physical-device installation test is claimed.
