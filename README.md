# Abyssals v0.89.2

The current game source and artwork are in **dist/**. Download the signed update from **Releases → v0.89.2**.

Marasen has been rebuilt with four readable districts, four functional city buildings, visible bridges, unique entrances and six indoor Exchange floors. Furniture artwork and collisions share their geometry; central aisles remain open. Crown Reservoir no longer has flat cliff or waterfall overlays across the road. Existing progression, save data, encounter access, trades and shop stock are retained.

Android package: `uk.co.abyssals.game`; versionCode **101**. Install over the existing app without uninstalling.

## Build and verification

GitHub Actions runs `tests/marasen-navigation.test.mjs`, validates JavaScript syntax, reconstructs the preserved v0.89.1 native base, and packages the current `dist/` using `scripts/build-update.py`. Fixed ZIP metadata makes that payload deterministic. `scripts/attach-release-signature.py` attaches only the public APK signing block, and only when the exact payload hash matches the privately signed release. Android's apksigner and zipalign verify the result before publishing.

Private signing keys/passwords are excluded. Changing game source requires a newly signed receipt. This rebuild retains the compatible compiled native wrapper; it does not claim a fresh Java compilation or a physical phone installation test.

The original signed v0.89.1 is preserved in `release/v0.89.1/`, with a hash manifest. `scripts/restore-release.py` is a historical extraction tool and should not be run over the current source, because it restores the older game files.
