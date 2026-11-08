# Resume after the interim artwork APK

Branch: main; PR7 merged. The user explicitly requested an interim build containing all currently made move artwork and six redesigned areas, then to finish the remainder later.

## Published checkpoint

- v0.90.52 / code147 published on29 October2026. Release commit9a6007df6bef4fbd3af78660c53da222fe9736a4; workflow40925067909. Source and package identity preserved.
- 133/614 dedicated action sheets installed (21.7%);39 current fresh visual approvals;94 installed sheets awaiting fresh visual review;481 missing dedicated sheets.
- All seven action batches are installed. No source-only move sheets remain from the three most recent generators (155/176/319).
- Saved Fire repairs are integrated. Scorchwhip frame8 uses the separately authored complete contact pose; see frameReplacements in batch03.json.
- All six new Sporefall environments are included and retain approval;25 late-game maps pass connectivity.
- v0.90.51 trainer sight-line/patrol and critical-hit fixes were merged from main and preserved. All relative runtime JS modules now use the release cache identity to keep shared WeakMap state consistent.
- Local verification:46 JavaScript suites and three Python/static checks pass, all133 raster sheets pass, new/repaired actions pass actual battles, all8 leader layouts pass, and finale save/resume/both outcomes pass.

## Immediate next action

APK and offline PWA are published and verified. All source checks, six browser groups and seven animation batches passed. Original certificate SHA2566dafd2bf38549cb39acd54811ee21cf71eb9af37a115154a5c551fc85edc92ac verified. APK SHA256ca035a3510db478bd93d0dfdd87bc6623a48c74140a00fa3c620eddd388a441c and PWA SHA2563bfb8db8177b58c811a61a6f0ef09d894c3429269ef4e584afe2d5d2e27849cd match published asset digests. Leave artwork production paused for user review. Next work must follow their review, not regenerate or repeat completed work.

## Release scope

Read docs/releases/v0.90.52-artwork-checkpoint.md and release-config.json. This is an explicitly requested interim build; scripts/verify-art-release-scope.py validates its exact asset scope without falsely marking all614 approved. Default/full artwork releases retain100% approval gates.

## Efficient recovery and repeat pattern

- GitHub is authoritative. Update this file in each completed checkpoint to refresh the verified development snapshot.
- Prefer the newest Development workspace snapshot artifact, labelled by exact commit, over hundreds of individual file downloads.
- scripts/development-snapshot.py restore ARTIFACT.zip EMPTY_DESTINATION --expected-commit COMMIT_SHA verifies all file hashes before extraction.
- New generated sources are committed individually with their production metadata before integration, so interruptions do not lose completed generations. Source-only commits do not trigger the full gameplay CI; runtime/batch changes do.
- Reusable Playwright1.62.1 headless runtime: workflow run40880432139, artifact12898784508. Download via GitHub artifact connector; verify the archive checksum before unpacking.
- Do not regenerate Git-tracked artwork simply because scratch disappears. Preserve source prompts, final sheets, review decisions and evidence in Git.
- After publication, leave artwork production paused for the user's review before continuing the remaining commission.

- Future finished-art transfers: browser batches of about25 files are the user-preferred default when available; verify paths/hashes and commit checkpoints. Blob/API transfer is the fallback. Speed has not yet been benchmarked.

- Release browser QA uses Playwright1.62.1, matching the verified runtime. Older diagnostic cache imports were aligned and storm screenshots disable CSS animations with a60s capture timeout; actual gameplay assertions remain.

## 3 November 2026 — source-only dossier integration

54 dossier species (520–573) are implemented on feature/dossier-roster-integration. See docs/dossier-integration.md and art-library/dossiers for final stats, source provenance, renamed families, trade receipts and tests. Version 0.90.53/code148 is reserved; no APK build or publication was requested. Keep the incomplete move-art overhaul paused. New Nectarbane art is installed and technically verified but not falsely marked freshly approved.

Source-only CI follow-up: pin the audit job to Python 3.12 (Pillow 11.1.0 has no Python 3.14 wheel), and keep Nectarbane inside the declarative ACTION_ART registry so existing artwork tools can parse all entries. Refresh the machine-readable move-coverage report for the new roster and Nectarbane entry. No gameplay or artwork content changed.

## Approved bat portraits and initial soundtrack

Thimbril 568 and Carrionyx 569 now use the approved four-limbed standalone portraits, preserved as PNG masters in art-library/dossiers/bat-portraits and lossless WebPs at the existing runtime paths. The concept-sheet extracts remain recorded as superseded provenance. adventure1.mp3 and BattleTheme1.mp3 from music-mp3s on main are copied byte-for-byte into dist/assets/music. Exploration loops the adventure track; every battle surface uses the battle track; exit resumes exploration. Existing Sound on/off controls both music and interface tones. Hidden pages pause playback, input unlocks browser audio, and both files are included offline. Offline revision2 refreshes the sprites; version0.90.53/code148 remains reserved. No APK built.

Local verification: music transition/autoplay unit checks, dossier integration, runtime cache identity and offline import validation pass. Chromium verified actual MP3 decoding/looping, three battle modes, adventure resume, settings mute, hidden-page pause/resume and both approved portraits in the battle UI. Phone evidence is saved in art-library/dossiers/verification.


## 3 November 2026 — user-authorised main consolidation and manual sheet handoff

PR10 roster/music/approved bat portraits are merged. PR9 leader-fate evolutions are integrated with the newer 0.90.53 modules, preserving party-only level gates, one-time receipts and saves. PR8 uploaded production sources and 38 existing registered sheets are retained; together with PR10 Nectarbane the installed scope is 172/615 actions (168 selectable moves plus four engine reactions). Prepared source-only images do not count as installed. Save schema, package uk.co.abyssals.game, signing identity and version0.90.53/code148 remain unchanged.

The superseded PR1 preparation tree is preserved intact under archive/preparation-pr1; its old root instructions/tooling do not replace the active playable game. Original PR8 resume notes are retained under archive/artwork-pr8-development-resume.md.

The recovered local checkpoint7c373d6 has225 selected source sheets and206 direct aliases, totalling431/615 bindings. Byte comparison across uploaded main/PR8/preparation trees finds219 selected sheets already stored in the repo. Only six selected sheets need manual upload:194 Aura Pulse,198 Calm Thought,200 Mind Arc,203 Mind Lance,206 Mind Screen and replacement810 Nectarbane. User will upload these PNGs to art-library/action-vfx/manual-recovery on main. Do not upload them on their behalf. Their expected SHA256 values, existing-source locations, intended225-source registry and206-alias map are preserved in art-library/action-vfx/manual-recovery/recovery-mapping.json. They remain reference-only until verified upload and deliberate installation.

Next: verify all six uploaded PNG hashes, reuse the existing219 sheets without duplicate transfers, install the recovered bindings on main in small verified commits, run fresh single/double/reaction and reduced-motion checks, then audit the184 actions still uncovered by the recovered checkpoint. Three of the eight proposed new shared source families still lack selected prepared sheets. Never equate bindings with fresh artistic approval.

Validation of the consolidated runtime: all49 JavaScript regression suites pass; action raster/atlas audit, five interim-scope checks, frame-packing regression, runtime cache identity, Android manifest compatibility and2237 offline assets/local imports pass. Existing219 selected-source paths resolve by exact Git blob hash in the consolidated tree. Fresh full browser/release checks run separately on GitHub; no new recovery artwork is marked live-approved.


## 4 November 2026 — verified animation recovery, stage 0

Starting main 0504381bcef725d5d44e1ad82bcc4a8bda6ef737 had 172 wired IDs / 172 sources. Live inventory is 611 registered moves plus four engine reactions = 615. All 228 baseline and 93 earlier additional sources were reconciled by keyed manifests and repository content. Installed 321 sources and direct shared assignments for 294 other IDs, giving 615 registered bindings. All runtime files resolve offline; original Mercy Edge renderer and save/combat IDs remain. Nectarbane uses its uploaded approved revision. The keyed integration manifest lists every source, expected hash and assignment; 50 Next100 batch-one uploads are absent, and 58 later sheets remain unproduced. Rejected Arena pilots are excluded.

Stage-0 validation: all sheets decode in Chromium; actual full-motion single and both double-target checks passed for 194,198,219,257,701,810, plus chosen-ally healing and reduced motion. Technical raster checks, scope gate, offline imports, cache identity and Android manifest checks pass. New sources are production/static approved, not blanket gameplay-visually approved. Broader regression suite running. No APK built or published in this task. Next install stages 1 and 2 from the manifest; do not install missing-upload or outstanding-art assignments as unique.


### Stage 1 — uploaded Next100 batch 2

Added 50 dedicated source sheets, yielding 371 unique sources, 244 direct shared bindings and 615 total registered action bindings. Every installed byte matches its production manifest. Exact missing batch-one filenames remain in art-library/action-vfx/integration-2026-11-04/missing-uploads.md. Representative full single/double-both-target/reduced-motion checks passed for 399,414,428 and chosen-ally healing. Offline validation passes with 2436 assets. Stage-0 remote commit is 551f28d7bb1d7a2eff4aa4d50aaad0a66f12d921. No APK build claimed.


### Stage 2 — all 136 checked recent uploads integrated

Final verified registry: 615 action bindings (611 registered runtime move IDs plus four engine reactions), 507 distinct source sheets and 108 direct shared bindings. Starting registry was 172 sources/bindings: 335 additional sources are newly wired and 443 additional IDs covered. Existing source revisions 70,71,75,810 were updated to their manifest-selected approved bytes. The intended 557-source production total is not installed: exactly 50 Next100 batch-one filenames are absent by hash; the 58 remaining production sheets also stay shared. All missing and outstanding IDs reconcile exactly to the 108 shared IDs. No Arena pilots installed.

Evidence: art-library/action-vfx/integration-2026-11-04/{manifest,technical-checks,verification,playback}.json, exact missing-uploads.md and outstanding-art.md, and committed test logs. Every selected source is hash-bound and every runtime/offline reference resolves. All recent 136 sheets have 16 distinct occupied frames and at least 18px transparent cell gutters. Historic original edge frames and Leafbound Exit's one empty recovery cell are retained.

50 JavaScript regression suites passed. Fresh Chromium checks decode all 615 references / 507 sources; selected real singles, both double targets, chosen-ally healing, reduced motion, Nectarbane, weather/terrain, physical/special/status, rabbit retaliation and eight leaders pass. Sixteen full-motion phone/desktop side/target cases also verify visible alpha-content bounds. These are sampled playback checks, not fresh individual gameplay visual approval of every sheet.

Presentation fixes: finite timestamps for each non-rabbit multi-hit strike; per-sheet alpha-content bounds keep lower-HUD effects inside the viewport while preserving true recipient anchors. Original Mercy Edge renderer stays intact; newly supplied Mercy Ray now uses its own sheet with mercy feedback. Save schema, stable IDs, combat rules, package/signing identity and reserved source version0.90.53/code148 are unchanged. No signed APK build or physical-device verification is claimed. Offline PWA packaging is checked separately against all507 source hashes.

Next: upload the exact50 files in missing-uploads.md; re-audit remote hashes and extend the manifest/installer deliberately. Do not apply the all-unique final production map to any of the outstanding58 sheets.


## 4 November 2026 — signed animation playtest release preparation

Rechecked the exact50 missing prepared SHA-256 values against every tracked PNG on remote main979da37; none are newly available. Coverage remains507 dedicated source sheets,108 direct shared bindings and615 total action bindings. The existing50-filename list remains authoritative.

The automatic workflow41832615806 failed before validation because the default Python3.14 runner could not install Pillow11.1.0. Pin release validation to Python3.12. Prepare reserved version0.90.53/code148 as Animation Playtest; last published version is0.90.52/code147. Keep the existing package and original signing secrets/certificate. Signing/publication must be verified from the workflow and released assets before an APK download is claimed.


Release CI preparation also refreshes the stale generated environment QA report from the already-committed review ledger (no maps/art changed); includes docs in browser checkout for the hash-bound scope; and installs Pillow under Python3.12 in browser jobs that render review sheets. All signing, validation, browser and action-batch release gates remain enabled.


## 4 November 2026 — recovered Next100 batch-one integration, stage 3

Recovered all 50 approved PNGs from Abyssals_Next100_Batch_01_50_Sheets.zip and verified their expected SHA-256 values. Browser uploads were committed in two groups of 25 (541cb21, b33f367). Re-fetched main and checked the actual uploaded bytes before installation. No missing approved uploads remain. The keyed installer now supports stage3: 557 dedicated sources,58 direct shared bindings,615 total action bindings; the58 outstanding production IDs remain shared. Source prompts/intents and recovery manifests are preserved. No new art was generated; Arena pilots remain excluded.

The existing signed build on e660ff7 passed source validation but its evolution-shop browser check expected29 items; current dossier stock has30 including Thunder Shard. Update the expected catalogue count and assert Thunder Shard is present, retaining the purchase, save/reload and evolution assertions. Add representative stage3 real-playback cases (247,387,533,525,731) on both phone/desktop viewports. Original signing key, package, stable IDs, save code and reserved0.90.53/code148 remain. Source tests and fresh release verification are pending until recorded; do not claim a published APK before successful release assets and certificate checks.

Stage3 local verification passed:50 JavaScript suites; all557 source hashes and browser decodes;615 bindings/58 shared; raster, offline, scope and Android manifest checks;26 real phone/desktop actor-target battle cases including Glacier Fossil, Rain Mantle (with its required active rain), Mindsteel Cleave, Masterwork Riposte and Look Upon Me. Music and shop browser suites pass. The hide/show playback race is repaired with a stale-request guard and a focused regression. No signing secrets, native package, combat rules or save schema changed. Fresh signed release CI and physical-device install remain unverified at this checkpoint.


## 4 November 2026 — final58 dedicated animation integration (stage4)

Starting remote main3283d5c had615 action bindings using557 dedicated sheets and58 direct shared bindings. Uploaded the final58 approved transparent PNGs through the browser in two independent commits: a7de397 (30) and6a7bd2f (28). Re-fetched remote main and verified all58 SHA-256 values against the delivered ZIP before installing any. Final58 source prompts, move IDs, hashes and production/static review are now tracked beside the source uploads.

Stage4 maps every remaining move to its own keyed source:615 bindings /615 dedicated sources /0 shared (611 selectable move IDs plus4 engine reactions). No missing upload or unproduced planned sheet remains. Existing source bytes, combat IDs, damage rules and save schema are preserved. Mercy Edge now actually renders its new dedicated sheet with the mercy label; its non-lethal rules and historical fallback renderer remain. The installer accepts intentionally translucent spectral sheets while requiring genuine transparency and visible content.

Reserve v0.90.54/code149 for this update, advancing from published v0.90.53/code148; all runtime cache identities and offline version advance together. Original native package, signing key and saves remain. Source validation and actual battle playback results are recorded below after completion. Do not claim an APK from this checkpoint until its GitHub workflow and released asset are verified.

Stage4 local verification completed: all51 JavaScript regression suites; all615 unique source hashes and browser decodes; exact58 source upload hashes; raster/offline/cache/scope/Android checks and25-map environment checks. All58 new moves passed actual full-motion phone battle playback, with9 desktop crosschecks (67 cases total), correct actor/recipient anchors and no clipped visible content. The neutral dummy uses Grass typing so Ghost attacks can land; ordinary Normal/Ghost immunity remains unchanged. Source approval is not blanket fresh individual artistic approval for all615 historical sheets. No physical-device verification claimed. GitHub release validation remains separate.

Before final commit, merged remote mainf1a2945 (the concurrent soundtrack immediate execution/burial cue fix and stronger soundtrack browser checks). No soundtrack work was overwritten. Focused music/soundtrack, animation assignment, cache and offline checks passed after that merge, followed by a fresh successful67-case final58 real-battle rerun and all615 sheet decodes on the merged tree. The51-suite run passed before the merge; fresh comprehensive GitHub CI runs on the final source commit.

## 5 November 2026 — saved quick-hit battle setting

Starting main de71bce includes the random nursery reward and corrected soundtrack assignments, published as v0.90.55. Prepare v0.90.56/code151 with a separate Battle animations On/Off setting alongside Sound. Off retains a simple hit followed by instant HP reduction, without authored sheet loads or long battle presentation waits. Preserve all combat resolution, RNG, PP, damage, rewards, story choices, save schema, package and signing identity. Motion/accessibility remains independent. Browser PWA status identifies older active offline files and explains closing every game tab/window to activate a waiting update. Exact user browser failure remains unconfirmed; live published Avalon Cleave has its correct sheet and CSS animation clock.

New tests cover setting persistence, explicit Full override on reduced-motion devices, and deterministic real wild/practice/double outcomes in both modes. Local source/cache/offline/art-scope/Android checks pass; browser checks and full GitHub release gates must pass before claiming the APK/PWA as published. Artwork stays 615 dedicated bindings/sources with no new art or blanket approval claims.

## 6 November 2026 — eight-track soundtrack integration

Starting main 4c0e1978de26de448079738f1ce484750152b1fb retained17 cues. Uploaded four exact adventure masters through the GitHub browser in16029ba and three battle masters plus full62.805s evolution audio in997edfc. Re-fetched committed bytes: all8 SHA-256 values match the supplied EIGHT_TRACK_ADDITIONS.json; all8 whole streams decode. No recompression, shortening, duplicated source masters or old music replacement.

Reserve v0.90.57/code152. Runtime has25 cues, six ordinary route shuffle entries and four ordinary battle entries. Independent bags advance on natural endings; map/side-route changes preserve the current player. Evolutions own audio through committed transformation, reveal, stats/innate ability and tagged entry-move pages. Confirmation occurs before committing/transformation so cancellation never starts evolution audio. Every confirmed sequence restarts its own theme; restored active cards resume saved audio. Final exit recalculates current story priority and restores paused music and bag state. Visibility/pagehide checkpoint the bounded, backward-compatible soundtrack field. No combat RNG, package, key or native wrapper changes.

Local checks: exact8 hashes/complete decodes, music controller/story priority/shuffle/evolution unit regressions, cache identity,2704 offline assets, Android manifest and unchanged615-action artwork scope pass. Full JavaScript and real-browser/release checks remain pending until recorded below. A local Chromium startup was blocked by the execution environment's socket restriction. GitHub Actions must verify real playback, all25 offline music/range responses, all evolution pages and source/game regressions before publication is claimed.

Release run42272150125 passed comprehensive source validation and four browser groups; it correctly blocked signing after two test-harness failures. The branch-item browser fixture still assumed automatic evolution, and the new seek-to-ending fixture lacked Range responses/readiness waits. Correct the fixtures without changing runtime code. Recover the project's checksum-verified Playwright1.62.1 headless artifact for local playback: actual evolution lifecycle/loop/reload/resume, branch evolution and ordinary music/portraits tests now pass. Broader real soundtrack story/offline check is completing; a fresh full signed-release run must pass before publication.

Focused local browser verification is now complete: actual evolution lifecycle, confirmation/cancellation, stat/ability/entry-move pages,62.805s native loop, consecutive leader-fate/level/item evolution, mid/final reload, mute/background and exact paused route/bag restoration pass. Ordinary music/portrait and corrected branch-item tests pass. The full soundtrack browser passes authored Darius/mountain, all9 execution beats,3 guards, Fatima, burial/gifts/reload,27 actual decodes/playbacks (25 runtime +2 source auditions) and all25 offline media/range checks. New-track browser durations match every supplied manifest value. Visual phone stat/ability screen checked. Full54 JavaScript suites and first Actions source gate passed. Runtime code remains byte-identical to5ac37ab.

Corrected regression/release commit2fe345f4e24dfd70ab4cb5648eca9ba0905da5f1 runs full signed-release workflow42276046512 (#92). Signing/publication/Pages remain pending until this run succeeds; all eight audio masters and runtime implementation are committed and verified. See docs/music/INTEGRATION_RESULTS.md for exact eight filenames/full hashes and acceptance details.


## 6 November 2026 — soundtrack release complete

Full signed-release run42276046512 (#92) succeeded on2fe345f4e24dfd70ab4cb5648eca9ba0905da5f1:54 JavaScript suites,37 browser suites,9 actual-battle animation batches, APK packaging, original-certificate signing and matching Pages deployment. Published v0.90.57/code152 at https://github.com/samuelkenworthy91-byte/Abyssals/releases/tag/v0.90.57 ; live https://samuelkenworthy91-byte.github.io/Abyssals/ displaysv0.90.57 in its title menu. All8 supplied master hashes are verified,25 cues registered, and all17 old runtime music files remain byte-identical. Actual evolution flow and25-cue offline/range playback passed locally and in CI. No publication blocker remains.

APK SHA-25690af2ad7e5810abe81515b76bd6df5290dcd7d523a14c24532ddd78c40e89ea0; PWA ZIP SHA-256cafadfc41492dad0b726b8166f4b4bf28574bd8e2a529ce022a6a0237f61f4ea. Published signature receipt verifies original certificate6dafd2bf38549cb39acd54811ee21cf71eb9af37a115154a5c551fc85edc92ac with APKv2/v3 signatures. Package/signing identity/saves are preserved; no physical-phone install is claimed. Full names, hashes, playlist membership, behaviour and publication evidence are in docs/music/INTEGRATION_RESULTS.md. Final checkpoint is documentation only; release runtime remains unchanged.

## Merrigami integration checkpoint

- Based on main commit `90f3452`. Merrigami is species 574 and Phantom Falchion is move 811. Integrated for the puzzle update on patch/puzzle-side-path-recovery using its existing release identity.
- Merrigami is rare in the Tenrec Hollow cave system. The entrance has levels 15–16, with the existing side-trail rules scaling the deeper rooms to 17–20.
- The original dossier ZIP, pixel-art portrait and animation sources, exact prompts, and source/runtime SHA-256 values are recorded under `art-library/dossiers/`. Runtime uses a lossless portrait, a dedicated 16-frame Phantom Falchion sheet and a brief Ancestral Aid glint from its first frame. Both assets are listed offline.
- Focused checks pass for learned and exclusive moves, saved stage and ability state, doubles targeting, charge consumption, seeded growth, transparent artwork, existing action bindings, and the release scope. The live browser test is included but local Chromium could not launch.
- Merrigami is staged for the ongoing puzzle update. Publication follows that update’s release process.
