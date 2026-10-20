# Character artwork for future story scenes

- `ready/CHR-PATE.png`: Peter “Pate” FitzRobert, transparent cutout, book retained, no Poké Ball.
- `ready/CHR-TRADE.png`: Thomas “Trade” de Clare, transparent cutout, empty hands, no Poké Ball.
- `reference/`: recovered ID-labelled characters, original trainer codes and the 49 corrected portrait references extracted from the earlier review. `CHARACTER-CATALOG.json` maps each file to its source and records its transparency and checksum. Historical filename names are aliases, not new canon. No trainer ID is guessed when its source lacks one.
- `../../archive/library-2026-10-20/originals/`: complete preserved source sheets, artwork and project packs, with the migration index and exact restoration utility. Use the root-relative path `/archive/library-2026-10-20/originals/` when browsing.

These assets are staged for future use. Adding the catalogue does not alter live game encounters or deploy an APK. At integration time use current canonical names/IDs, inspect the character, provide a matching walking sprite and dialogue bust, and follow the project's tests and GitHub release protocol. Keep illustrations free of Poké Balls.

Pate and Trade cutouts were prepared with the Image Generation skill using each recovered portrait as the edit target: remove the magenta background and name label, preserve face, costume, pose and hands, retain the held book where present, output actual transparent alpha, and add no props or Poké Balls.
