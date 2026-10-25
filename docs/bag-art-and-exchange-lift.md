# Pending bag artwork and Grand Exchange lift patch

Based on v0.90.39. Staged on `patch/bag-icons-store-lift`; no APK build or public PWA deployment has been requested. Next release metadata is reserved as v0.90.40 / Android 135 and may be updated as further tasks join this patch.

- All seven bag pockets have item artwork. Existing specialist food/medicine and regalia images remain; new artwork covers ordinary food, medicine, field supplies, keepsakes, every held item, every evolution item, nursery supplies and move codexes. Nursery stock is also visible in Training.
- Codexes share an illustrated book, tinted by move type with a type-colour underline and explicit type label. Eligibility continues to use the canonical compatibility checks when teaching. Core and type-sigil families also have type colours; other held equipment has individual artwork.
- General and Exchange stores and combat item menus retain their pictures; ordinary supplies gain matching icons.
- Patient Rations no longer appear in bag, battle menus, shops, the general-store unlock chain or future choice rewards. Loading/importing converts the old stock one-for-one into Slow Stews and zeros the retired count, so reloading cannot duplicate it. Old battle commands for Patient Rations are rejected. The historical `patient-ration.js` rule is retained solely for legacy regression references.
- Each Exchange upper floor replaces the directory at (24,28) with a walk-in lift. Ground floor keeps its existing exit and adds a lift at (31,28). Choosing a floor shows its shops and arrives outside that floor's lift, avoiding an immediate repeat popup. Staircases still work.
- All runtime assets are in the offline inventory. Source atlases and preparation provenance are in `art-library/items/`.

Validation: item/shop coverage, map collision/arrival tests, choice-reward and capture regressions, module syntax and offline/import validation. `tests/bag-lift-browser.cjs` covers portrait icons in every pocket, conversion across reload and real walk-in menus/travel on every floor. `.github/workflows/patch-checks.yml` runs those checks on pending patch branches and deliberately has no build, signing, release or deployment steps.
