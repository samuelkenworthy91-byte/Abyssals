# Original release signing recovery

All APK updates must be built, signed and published by `.github/workflows/android-release.yml`. The repository is public: never commit the private backup ZIP, keystore, signing.env, passwords or their base64 encodings.

The `Abyssals-Release-Signing-Backup.zip` supplied on 20 October 2026 contains `abyssals-release.p12`, `signing.env` and a README. Its password and alias were successfully checked against the keystore. The exported signing certificate SHA-256 matches the workflow's required identity:

`6dafd2bf38549cb39acd54811ee21cf71eb9af37a115154a5c551fc85edc92ac`

Application ID: `uk.co.abyssals.game`.

## Persistent repository secrets

In Settings > Secrets and variables > Actions, save:

- `ABYSSALS_KEYSTORE_BASE64`: base64 encoding of the binary `abyssals-release.p12` file, without line breaks.
- `ABYSSALS_STORE_PASSWORD`: the corresponding value from the private `signing.env`.
- `ABYSSALS_KEY_ALIAS`: the corresponding value from the private `signing.env`.

These are the exact names already consumed by the workflow. Once configured they persist for future builds. Secret values must never appear in source, issues, release assets, screenshots or workflow logs. Base64 is an encoding, not encryption. Retain the original private backup separately because Actions secret values cannot be downloaded later.

## Finish the pending release

The pending release configuration is v0.89.4, Android versionCode 103, filename `Abyssals-v0.89.4-Farm-Tablets.apk`. After saving the secrets, re-run the failed release job or manually run the Android release workflow on main. Verify tests, certificate and alignment checks succeed, then deliver the verified APK from the GitHub Release.

For later game changes, increase version and versionCode, commit the source to GitHub and use the same workflow and signing identity. Never generate a replacement key for an update.
