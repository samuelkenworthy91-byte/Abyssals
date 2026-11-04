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
