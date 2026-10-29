# Resume artwork work — durable checkpoint
Date: 2026-10-29. Branch: feature/v0.90.51-bespoke-moves-batch-01. PR: 7.
Latest published release remains v0.90.50. The user asked to pause art and build an interim APK, then requested a short further art session and an efficient durable handoff. Do not assume a new APK was built.

## Installed game
Coverage: 99 dedicated sheets / 614 actions; 33 fresh visual approvals.
The original 63 protected sheets, Mercy timings, package identity and signing key must be preserved.
The six redesigned Sporefall environments are reviewed; other full-overhaul acceptance remains unfinished.

## New durable work
Seven source PNGs and seven optimized prepared indexed PNGs are committed under art-library/action-vfx/batch-06/.
IDs: 117 Measured Force, 124 Firm Footing, 126 Iron Blow, 153 Dune Break, 173 Feather Veil, 175 Jetstream Detonation, 187 Tailwind Cry.
Each prepared sheet passed:768x768,16 unique nonempty frames,192px logical cells, actual transparency and padded top/bottom frame boundaries.
These seven are NOT installed, not included in 99-sheet coverage, and not visually/live-battle approved. No gameplay mechanics were changed.
Use prepared-manifest.json and source-manifest.json; do not regenerate these source images merely because scratch vanished.

## Exact next steps
1. Retrieve this checkpoint and the branch head. Use the Development workspace snapshot workflow artifact for a complete local asset snapshot. It now includes .github/workflows explicitly in sparse checkout, packages sources plus SHA-256 records and commit identity, and retains snapshots for30days.
2. Inspect all seven source and prepared sheets at frame resolution and game scale; retain revision decisions honestly.
3. Register accepted sheets uniquely in dist/action-vfx-data.js, add offline manifest URLs, and create art-library/action-vfx/batch-06.json only when actually installed.
4. Extend tests/art-revision-browser.cjs to handle status moves117/124/173/187; it currently assumes most IDs damage a foe. Check124's singular stat effect carefully against actual engine behavior.
5. Run live singles, doubles both opposing slots, reduced motion, and existing regression suites; then run scripts/build-art-coverage.mjs and commit its generated reports.
6. For interim APK scope, retain truthful incomplete artwork records. The existing release workflow --release gate requires100% approval; the user explicitly requested an interim build and scope must be recorded before adjusting that gate. Never mark all614 approved to bypass it.
7. Version correctly above0.90.50/code145 and use original GitHub Actions signing pipeline only. Verify published APK/PWA/checksums/certificate before giving download links.
8. Commit every small reviewed batch and update this checkpoint BEFORE ending. Source prompts, prepared art, tests and review evidence must live on GitHub, not solely in scratch or tool-session memory.

## Previous pending candidates
24 uninstalled source sheets plus three Fire correction candidates already exist in art-library/action-vfx/pending-production/recovery-2026-10-29/.
Most sources exceed1MB. GitHub fetch_file encoding=base64 silently yields empty content for these large files. Check decoded byte counts; do not treat an empty returned body as successful recovery.
Download a repository snapshot instead of re-creating art or making hundreds of per-file reads.

## Repeat pattern for every future batch
- Commit source artwork, generation prompts/intent, optimized prepared sheets, runtime registration when ready, and test/review evidence together. Do not retain progress solely in tool-session variables.
- Update this file with exact installed coverage, pending IDs, tests passed/failed and next commands in the same commit. Changing this file automatically refreshes the development snapshot.
- Snapshot artifacts are named development-workspace-COMMIT_SHA and retained30days. Git-tracked originals remain durable after artifact expiry; rerun the workflow on a later checkpoint to rebuild a snapshot.
- Download the artifact ZIP using GitHub's download_workflow_artifact connector, then run: python3 scripts/development-snapshot.py restore ARTIFACT.zip EMPTY_DESTINATION --expected-commit COMMIT_SHA
- The restore command checks the archive hash, every file's size/hash, exact commit, duplicate entries and unsafe paths BEFORE extraction. It refuses a nonempty destination.

