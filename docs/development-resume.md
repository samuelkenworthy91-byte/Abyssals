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
