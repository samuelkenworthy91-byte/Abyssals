# Abyssals

Current game source and artwork: **dist/**. Releases contain installable signed APKs produced by GitHub Actions. `release-config.json` is the next release version and description; only a successful signing/publishing workflow makes that version an installable release.

The 0.90.1 update opens the seven-screen Thunderplain from Marasen to Botrune. A public execution scene, persistent guard gauntlet and physical-power leader battle continue Pate and Trade’s story. See [the current story revision and asset provenance](docs/botrune-story.md). Existing farm conversations and puzzle tablets remain available.

The 0.90.12 update replaces Marasen’s freestanding district portals with open-air streets and gives each Exchange floor stocked individual display cabinets and marble stairs. See [layout, artwork provenance and verification](docs/marasen-store.md).

The 0.90.13 update adds the mandatory Thunder Crown mountain confrontation, a separate Tianzhar wild battle, the Stormcatch lightning relay, dramatic weather and Gothic Botrune town services with illustrated Pate/Trade sentence panels. See [story, assets and checks](docs/thunderplain-crown.md).

## Standard update protocol

1. Commit source, artwork, tests and build changes here. Bump the version and Android version_code in `release-config.json`, plus the game/offline version.
2. **Build signed Android update** runs automatically on game/build changes to main. It tests the code, checks offline assets, reconstructs the preserved native wrapper, packages current source, signs with the original release key, verifies Android signing and alignment, and publishes the APK and checksum to Releases.
3. Download the verified APK from Releases and install over the existing app. Keep package `uk.co.abyssals.game` and the original signing certificate to retain update/save compatibility.

## One-time GitHub signing setup

In **Settings → Secrets and variables → Actions**, configure:

| Secret | Value from the existing release-signing backup |
| --- | --- |
| `ABYSSALS_KEYSTORE_BASE64` | Base64 encoding of `abyssals-release.p12` |
| `ABYSSALS_STORE_PASSWORD` | Existing store password from `signing.env` |
| `ABYSSALS_KEY_ALIAS` | Existing alias from `signing.env` |

Keep secret values private. Do not paste them into issues, commits, workflow inputs or chat. When these secrets are absent, the workflow retains its unsigned build for recovery and stops before publishing. Adding the existing key and rerunning the failed workflow completes the release. A new keystore cannot update the installed game.

The expected certificate SHA-256 is `6dafd2bf38549cb39acd54811ee21cf71eb9af37a115154a5c551fc85edc92ac`; signing verifies this before publishing. The compatible compiled native wrapper is preserved in `release/v0.89.1/`. No fresh native Java compilation or physical phone installation test is claimed.

The older receipt-based workflows reproduce historical signed releases. New updates use the standard workflow above. Do not run historical `scripts/restore-release.py` over current source.

The 0.90.14 update polishes the storm route with glass impact craters, detailed mountain steps and a broken cart, natural lightning forks and repeatable Stormcatch shifts with a timing demonstration. See [implementation and verification](docs/storm-polish.md).
