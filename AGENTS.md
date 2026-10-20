# Abyssals project protocol

- GitHub is the source of truth. Commit all final game source, graphics, tests and build changes to this repository.
- Every update is tested, packaged, signed and published through `.github/workflows/android-release.yml` on GitHub Actions. Deliver the APK from its verified GitHub Release. Do not substitute a locally built APK.
- Bump `release-config.json` version and Android version_code for each new game update, and update the displayed/offline game version.
- Signing uses the original release keystore stored only in GitHub Actions secrets: `ABYSSALS_KEYSTORE_BASE64`, `ABYSSALS_STORE_PASSWORD`, `ABYSSALS_KEY_ALIAS`. Never commit keystores or passwords, expose secret values, or generate a different key for an update.
- Preserve package `uk.co.abyssals.game` and certificate SHA-256 `6dafd2bf38549cb39acd54811ee21cf71eb9af37a115154a5c551fc85edc92ac`. Preserve existing saves, permanent death, encounter uniqueness and quest progress.
- Validate navigation and interactions for changed maps, then check the workflow and published download. Report a signing blocker clearly; an unsigned APK is not an installable release.
- The preserved native wrapper in `release/v0.89.1` is the compatible base. `scripts/restore-release.py` is historical and must not overwrite current `dist/`.

- Development references belong under `archive/` and `art-library/`, outside `dist/`. APK packaging must remain restricted to `dist/`. Never copy entire reference archives, historical PWAs/APKs, source packs or artwork catalogues into `dist/`; add only the selected, optimized assets required by the live game.
