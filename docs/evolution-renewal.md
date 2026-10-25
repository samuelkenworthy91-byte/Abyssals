# Evolution Renewal — v0.90.38

Implements the approved 25 October evolution and combat review, including the final counter-response revision.

- Censmoke evolves at Lv. 30+ to Malifume (highest earned Special Attack), Thurafume (Defence or Special Defence), or new Vigorfume, ID 504 (Attack or Speed). HP, battle stages and held multipliers are excluded. Only tied winning branches are offered. Existing final forms, stats, story history and care gates remain intact.
- Triskit requires Tide Pearl, Mourning Briar or Sunscar Glass at Lv. 30+. Department-store prices remain 4,500. No automatic level branch is offered. The three finals have separate special-attacker/support roles and 515 baseline totals.
- Revises the complete 212-move damaging-stage-effect audit and adds IDs 714–717: Flowing Palm, Caldera Edict, Briar Bequest and Mourning Dew. Other effect payloads, IDs, contact, sound, signature ownership and accuracy are preserved. Pure setup/status-condition moves are not part of the numerical pass.
- Countercharge: first damaging contact hit after each entry gives +2 Attack; every damaging super-effective move also gives +1 Attack once per whole move. Countercurrent uses Special Attack. First-contact super-effective moves grant +3. Normal -6/+6 battle stages remain separate from uncapped permanent growth.
- Dread Presence lowers active foes' Attack on entry. Battle Readiness raises the higher unmodified earned attacking stat; exact ties choose Attack. One selected ability slot applies, never all three at once.
- Briar Bequest heals/cleanses a living selected replacement, discarding stages and decoy handoffs. Standard Relay remains the stage-pass choice. Medicinal Sap and held healing pass through the normal healing pipeline once.
- Obsolete sale items are removed, including Pebbettle's items. The once-only migration refunds old quantities at listed prices and preserves restored Triskit items and all eighteen working cores. Equipped/inherited moves and old legal relearn access are preserved. No stat or Prodigy reroll occurs.

## Artwork

Seven 512-square battle cutouts and seven matching 256×512 follower sheets (two frames × four directions) were uploaded through the signed-in GitHub browser to the isolated release branch. Base Triskit is unchanged. Malifume uses the approved obsidian/violet/silver dark-dragon revision.

Built-in image generation used the approved review concepts as identity references. Follower prompt: premium clean pixel-art top-down quadrupeds, exactly two columns/four rows in down/left/up/right order, idle and walking frame, full anatomy within each cell, transparent background, no labels or scene. Raster preparation only crops/pads/scales the approved images, preserving their alpha; shiny colouring uses the existing family recolouring pipeline.

## Validation and publishing

`tests/evolution-renewal.test.mjs` exercises the actual engine, evolution selection, item economy, old learnset access, proc rules, restorative relay and starting STAB. `tests/evolution-renewal-browser.cjs` tests actual phone UI choices, cancellation/consumption, three-way ties, new graphics and reload. Existing roster/scene count assertions include the four added moves and one species.

The standard GitHub Actions workflow runs the complete existing suite and shiny raster audit, packages only committed `dist/`, signs with the original release certificate and publishes the APK plus an offline PWA ZIP. The Pages job publishes that same tested source only after the release job succeeds. Saves, permanent deaths, quest progress and original package/signing remain protected.
