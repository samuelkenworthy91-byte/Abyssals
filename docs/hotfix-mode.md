# Abyssals: fast-track hotfix releases

The existing **Build signed Android update** GitHub Actions workflow supports two modes. **Full remains the default**, including ordinary main-branch updates.

## Selecting a hotfix

For a small source-only correction, bump the game version and Android version code in release-config.json as usual, and set both properties:

    "validation_mode": "hotfix",
    "hotfix_focus": "battle"

The supported focus areas are **battle**, **audio**, **offline**, and **ui**. Select the area that matches the regression and add or update at least one regression test belonging to that area (see scripts/hotfix-release.mjs).

Pushing changed game files or a new release-config.json to main uses the selected mode. The GitHub Actions **Run workflow** menu also offers a manual Full/Hotfix choice and a hotfix focus; a manual selection overrides release-config.json.

For normal feature updates, remove validation_mode (defaults to full), or set it to full.

## Fast-path safety

- Compare the candidate against the latest published release. Require an increased game version and Android version code.
- Permit at most 15 root-level runtime JS/CSS/HTML changes and 50 changed files total.
- Require a modified test from the selected profile.
- Reject media, artwork, nested binary assets, Android wrapper files and signing/build script modifications.
- Check runtime syntax, package manifest compatibility, offline dependencies, declared artwork scope, and the selected unit tests.
- Run only the focused real-browser checks, skipping the unrelated animation-batch matrix.
- Use the **same existing APK builder, original signing key, certificate verification, GitHub Release publishing and PWA deployment** as full releases.
- Never publish if any required hotfix check fails.

A hotfix is quicker to test, but **its signed Android APK is still full size**. Neither media packaging nor the save format changes.

Workflow-only, documentation-only, script-only and test-only commits do not automatically rebuild/publish an unchanged APK. A manual workflow run from a non-main branch can validate but cannot publish. The complete test suite remains available by selecting Full.
