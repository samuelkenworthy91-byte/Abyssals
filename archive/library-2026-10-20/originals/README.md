# Reference source archive

Historical artwork, character sheets, source packs and design documents retained for future Abyssals development. These files are references, not the current game build or current canon.

## APK size

This directory and `art-library/` are outside `dist/`. The Android build packages only `dist/`, so this archive adds zero bytes to the APK. Add only selected, optimized assets when a character or feature is actually used. Never bundle this entire archive or historical builds into the game.

## Original files and verification

`MIGRATION-INDEX.json` maps each original filename to its preserved bytes and SHA-256 hashes. Files above 4 MiB are split into `.piece4m001`, `.piece4m002`, etc. Run `python restore-originals.py --verify-only` to verify the entire archive, or `python restore-originals.py --destination recovered-originals` to reconstruct original filenames. Existing destination files are never overwritten.

Sources listed under `pending_sources` were unavailable for transfer and remain with the user; they are not included in the archive or eligible for cleanup. A source can be removed only after every listed part is committed and its Git object hash verified against the index.

## Characters

The curated character catalogue is in `art-library/characters/reference/`. Pate and Trade have prepared transparent, Poké Ball-free portraits in `art-library/characters/ready/`. Historical names and IDs remain in the reference catalogue for traceability.
