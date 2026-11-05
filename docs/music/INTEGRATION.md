# Soundtrack integration — corrected 5 November 2026

Baseline main: `06bda7c3cae18ff2f556a85463cccd354a40a074`.
No Android version, package, signing configuration or release is changed. Commits use
`[skip ci]` to avoid the existing automatic Android publishing workflow. The manual
`Validate soundtrack without Android release` workflow performs independent checks.

## Inventory and provenance

15 supplied audio files were uploaded individually using GitHub's browser UI in
four source commits (5 + 5 + 3 MP3s, then 2 M4As). None matched an existing audio
SHA-256 at baseline. The original `music-mp3s/adventure1.mp3`,
`music-mp3s/BattleTheme1.mp3` and both runtime copies are preserved unchanged.
`TRACK_MANIFEST.json` records every original name, normalized name, byte count,
codec, duration and SHA-256. Runtime copies are byte-identical; no transcoding.

| Supplied file | Runtime role |
| --- | --- |
| town-dorelem.mp3 | Dorelem and its interiors |
| town-philomere.mp3 | Philomere, hospice and interiors |
| town-cybressa.mp3 | Cybressa and interiors |
| town-cossenne.mp3 | Cossenne and interiors |
| town-botrune.mp3 | Retained without a current scene assignment; Ancient Shadows supersedes its Botrune assignment |
| town-cayfen.mp3 | Cayfen and interiors |
| town-ramelle.mp3 | Ramelle and interiors |
| route-journey-across-the-realm.mp3 | Kyvton / Civeton starting town (`town`) and its interiors |
| route-ancient-shadows.mp3 | Botrune square, lower streets, interiors and shelter outside mandatory events; never an ordinary route |
| character-darius-idealists-burden.mp3 | Early Darius dialogue groups and REV/MR/COURT Darius encounters |
| event-darius-descent.mp3 | All three Thunder Crown mountain maps, conversations, encounters and Darius/Tianzhar battles until Tianzhar's fate is recorded |
| event-pate-trade-execution.mp3 | Abbey-square execution through Fatima battle onset |
| event-pate-trade-burial.mp3 | Remembering Tree funeral through companion gift aftermath |
| city-leader-UNVERIFIED.m4a | Owner-confirmed City Leader; runtime `battle-city-leader.m4a` for all eight leaders and rematches |
| catching-up-UNCLASSIFIED.m4a | Owner-confirmed ordinary route theme; runtime `route-catching-up.m4a` |

On 5 November 2026 the owner explicitly corrected four roles: Catching Up is
an ordinary route theme; City Leader is the town-leader boss theme; Journey
Across the Realm belongs to the starting town (Kyvton, internally `town` /
Civeton); Ancient Shadows belongs to Botrune, where Pate and Trade are executed.
The M4As are now runtime copies with clear names and unchanged bytes. The original
source filenames and hashes remain preserved for provenance. Stable song IDs
`journey` and `dark` retain their saved playback positions across this reassignment.
The former `town-botrune.mp3` is retained without an invented replacement role.

City Leader begins only when an actual leader battle starts, including all eight
leaders' supervised rematches, and resets for each new encounter. Ordinary
battles retain `BattleTheme1.mp3`. The execution cue still outranks guard fights;
Fatima's actual battle ends it and fades into City Leader. A leader rematch
outside a mandatory ceremony takes priority over regional mountain music.
Marasen, evolution and dedicated epic boss cues remain missing. Marasen and
unknown places retain `adventure1.mp3`; early March/scrub/hospice roads keep that
original exploration theme. Other previously assigned travelling/dangerous routes
now use Catching Up, including Willowmere, Thunderplain and Sporefall. Ancient
Shadows is never assigned to those routes. Darius's final Sporefall encounter depicts a
separate last-company crisis with Cruxwyrm; it retains existing battle music,
without automatically reusing the mountain theme.

`Parting at Twilight (Urgent Cover).mp3` remains explicitly recorded as the
execution source title. No claim of original composition or commercial clearance
is made. User-supplied provenance does not establish a license for commercial
redistribution; the original cover attribution is retained in the manifest.

## Exact boundaries

- **Execution:** `playBotruneBeat()` durably records `soundtrack.executionStarted`
  before showing the first charges. Mandatory execution/funeral onset bypasses the exploration fade so its playback request precedes the dialogue. All nine beats share one looping player.
  Trial completion does not end the cue. Guard battles, dialogue and menus keep
  it. Botrune lower streets, square, interiors and shelter share this context.
  Leaving these places suspends playback; returning resumes its position.
  `showBattleSurface()` records `executionEnded` when the actual trainer ID is
  `LDR-06`, before selecting battle music. The old cue fades over 600ms, then the
  City Leader track starts, with no overlap. Challenge dialogue alone does not end it.
  Defeat, escape, retries and later visits cannot retrigger the execution.
  Legacy saves infer active context from saved trial cursor/gauntlet and infer
  completion from Fatima's defeat/fate. Existing story/death history is unchanged.
- **Burial:** first `playFinaleBurial()` call records `burialActive`. All fourteen
  saved funeral lines, Walter's dialogue, gifts and the companion modal keep the
  same loop. Closing that modal saves the end receipt and gently fades to the
  Willowmere route cue. Reload during the scene restores the saved line; reload
  during the gift aftermath restores its card without granting partners again.
  Later tree visits do not replay the ceremony. Departure pauses local context.
- **Mountain:** entry to `stormDariusCamp`, `stormDariusRidge` or
  `stormDariusCrown` selects Descent while Tianzhar has no recorded outcome.
  Selection is continuous through linked maps, ordinary combat, Darius and
  Tianzhar. Leaving suspends it. Capturing/defeating Tianzhar ends the crisis cue.
- **Early Darius:** a dialogue group with his canonical early portrait, or an
  early Darius trainer battle, selects Idealist's Burden until the group/battle
  ends. The mountain's mandatory cue takes precedence.

## Controller and offline behavior

`dist/soundtrack.js` owns the registry and pure selection rules. Town interiors
resolve through canonical door parents. Priority is silent title/mute/hidden,
mandatory execution/burial, town-leader battles, mountain crisis, early Darius, ordinary battles, towns, routes.
The explicit Fatima exception ends the execution context. There is no music
selection in `draw()`; refresh/navigation, dialogue, battle, input, visibility and
sound events update a signature-guarded controller.

One player may sound at a time. Source positions survive ordinary interruptions,
sound/visibility toggles and pagehide; persisted positions restore after loading.
Battle music resets between battles. Real user input retries blocked autoplay;
rejected promises never halt movement/combat or retry on each frame. Pending
play requests are isolated so late promises cannot restart an obsolete cue.
Offline inventory revision increments independently of Android's version. The
service worker serves cached audio byte ranges for browser/WebView seeking.

## Verification

`scripts/verify-soundtrack.py`: 15 hashes, 15 runtime byte comparisons, all 15
whole-stream ffmpeg decodes. `tests/soundtrack.test.mjs`: all eight leader battles/rematches, corrected starting-town and Botrune roles, no Ancient Shadows on routes, fresh boss playback, town/interior mappings,
route selection, all execution beats/guards/Fatima, legacy saves, mountain scope,
Darius, funeral/gifts, position restore and nonoverlapping fading.
`tests/soundtrack-browser.cjs` exercises the actual game dialogue and music
boundaries, saved reloads, sound/visibility, all 17 registered runtime streams (including both
original tracks and the newly confirmed M4As), plus source checks when available, full offline install/reload and
cached audio ranges. It stages guard victories to isolate soundtrack routing;
existing Botrune/Thunderplain/finale browser suites cover story/combat behavior.
Physical Android-device playback is not established by Chromium or ffmpeg tests.
See the manual workflow's commit-labelled verification artifact for actual results.
