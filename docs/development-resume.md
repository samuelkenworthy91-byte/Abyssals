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

## Continued production after APK — batch08

User authorized continuation and explicitly requested browser uploads. Branch artwork/batch-08-quarter-coverage starts from main25477a4eb823fb3b27a68afffe2d659a193d39e5. Twenty-one additional sheets were generated separately using built-in image_gen, then packed; see art-library/action-vfx/batch-08/prepared-manifest.json, production-plan.json and prepared-validation.json. IDs63–75,77–84. Selected source/prepared hashes and exact per-move prompts are in each production JSON. Originals are retained;70/71/75 select revision02 files after neighboring-cell fragments were caught in packed contact-frame inspection. Revised packed sources were inspected and are clean.

Production stock is154/614 (25.1%), including21 new prepared sheets. Installed/released coverage remains133/614 (21.7%). DO NOT count source-only prepared assets as installed or approved. The new batch still needs registration and live single/double/reduced-motion/leader recovery review, followed by quality-ledger entries and regenerated coverage. Latest released APK remains v0.90.52; no replacement APK was requested in this continuation.

Browser transfer succeeded in related checkpoints of25,12,24 and15 files. Use the existing browser upload route for this branch/directory and synchronized scratch paths; no binary/blob image upload was used. All73 batch-file Git blob hashes verified against local bytes at commit0aa6e87a8956988909dcf52b693853b015148ae5; no mismatches. Keep all sources and selected revisions; do not regenerate them after interruption. Resume integration from saved prepared PNGs with `python scripts/install-prepared-action-batches.py 08` when continuing the upgrade. Pause new bulk generation at this roughly25% authored-stock point for user review.

## Current authorization — continue to50%

User explicitly requested continuing production until50%, superseding the earlier25% pause. Target307/614 authored sheets; baseline154 authored/prepared (133 installed plus21 batch08 prepared), so153 more distinct sources are required. Continue browser batch uploads, hash verification and durable snapshots. Keep installed and prepared counts separate; do not claim50% installed from source-only candidates. Snapshot workflow now includes artwork/** branches, fixing missed automatic recovery snapshots for this branch.

## Batch09 production checkpoint

17 new sources (IDs85,87–90,92–96,99–105) are packed, structurally validated and source/packed-frame inspected. All are candidates pending registration and actual battle/artistic approval. Authored/prepared stock171/614 (27.9%); installed remains133/614 (21.7%). Browser image uploads only. Batch10 and11 generation may be in progress; check their production records and use sources already saved before generating anything again. Goal remains307 authored sheets; continue without the superseded25% pause.

## Continuation checkpoint — independently audited 50% target

The user's newest instruction is to proceed to 50% authored sheet coverage, then carry out the same registration, real-battle testing, art QA, and signed release workflow. **50% HAS NOT YET BEEN REACHED.** Verified production stock remains171/614 (27.9%); installed stock133/614 (21.7%); source-only prepared sheets38 (21 batch08 +17 batch09). This record is not a claim that 136 new raster illustrations were generated or that the APK was rebuilt.

All136 distinct remaining moves (that would take171 to307 unique authored sheets) now have detailed, move-specific storyboard and image-generation prompts, committed in batch10 through batch15 production-plan.json. These files are specifications only and do not count as authored sheets. Coverage inventory and unique-ID checks matched all153 target IDs, comprising17 prepared in batch09 plus136 pending; zero duplicate or missing IDs. The image-production test through the separate Higgsfield service was rejected by its subscription gate (requires basic plan); zero of the six submitted jobs were accepted, hence zero generated art. Do not substitute a mock milestone graphic, generic effects or procedural placeholder art as production-ready custom pixel illustrations.

New safeguard: scripts/audit-halfway-artwork.py checks actual source/prepared files, SHA256 digests, structural validation and ID uniqueness; its output keeps installed, verified prepared, planned and approved separate. Development snapshot workflow now audits genuine counts and triggers on per-batch production plans/assets, protecting this interrupted-work checkpoint.

Next priority is genuinely drawing the136 remaining unique 16-frame sheets (starting ID106, Frost Shard), using a generation route that actually provides accessible source artwork. Preserve 4x4 cell layout, true transparency, 192px logical cells, crisp dense pixels, distinct movement and safe gutters. Preserve originals, especially Mercy graphics. Transfer in browser groups around25 when available; verify binary content/hashes and commit each checkpoint. Once307 are actually authored and packed, register batches08-15, regenerate coverage, thoroughly inspect and battle-test (single, double, leader, animation recovery and low-motion), repair failures, verify signing/save compatibility, then prepare a new Android/PWA release. Do not merge this work to main or claim a new APK before the art exists and quality/release checks pass.

## Current authorization — continue to around 60% (30 October 2026)

The user supersedes the 50% stop and requests roughly 60% of the whole update, created, uploaded and integrated, using the same art style and setup. Track the move pool and environment QA independently: target369/614 integrated/tested animations and at least15/25 reviewed environments. Never average prompt-writing or source-only files into finished coverage. See art-library/action-vfx/target-60-percent.json for the198 additional unique IDs beyond the recovered171 stock.

Recovery integration: batches08 and09 are registered locally with38 selected prepared sheets, preserving original artwork. Both batches pass actual phone single battles, both double-battle targets and reduced motion; batch08 additionally passed all eight leader layouts. Source raster integrity audit passes. Runtime PNGs uploaded through the browser in25+13 file checkpoints. Registration, offline manifest and exact coverage reports accompany this checkpoint. No new APK or artistic approval is claimed from these technical passes.

Built-in image generation is working with accessible real PNG outputs. Batch10 production is underway, using the saved per-move action briefs; save full prompts, selected sources, prepared sheets and review results before counting them. Frost Sweep candidate01 followed the reference lunge too closely and is rejected; its replacement must show a broad sweep. Source halos are reviewed after the existing alpha/palette preparation, since faint raw halos can disappear in the actual packed sheet.

The browser runtime from artifact12898784508 was downloaded and its archive SHA256 verified. It matches local Playwright Chromium1234. Ordinary browser downloads were unavailable; reuse this verified runtime. Continue producing and checkpointing until the user's60% goal, then pause and report created/uploaded/integrated/tested/approved/released counts separately.
