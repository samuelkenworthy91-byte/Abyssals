# Abyssals v0.89.1

Current preserved release: **0.89.1**, Android versionCode **100**.

The complete signed APK is preserved as ordered binary parts in `release/v0.89.1/`; `manifest.json` records every part and the final SHA-256. Run `python3 scripts/restore-release.py` to reconstruct it and extract its exact browser game source and artwork to `dist/`. GitHub Actions performs the same reconstruction, checks JavaScript syntax, verifies Android signatures and alignment, commits the extracted source, and publishes the APK under Releases.

The release contains encounter-access and trading improvements, and the aquatic Marasen design. The APK's package remains `uk.co.abyssals.game`. The signing certificate SHA-256 is `6dafd2bf38549cb39acd54811ee21cf71eb9af37a115154a5c551fc85edc92ac`. Signing private keys and passwords are excluded.

`dist/` is the current game. Older prototype branches are historical and are not the native wrapper used by this release. This preservation workflow reconstructs the existing signed APK; it does not recompile or re-sign the native Android wrapper. Device installation and gameplay remain separate checks.
