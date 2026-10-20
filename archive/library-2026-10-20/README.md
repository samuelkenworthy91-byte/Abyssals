# Abyssals reference archive

All **534 original sources** are preserved here: **1,454,019,850 bytes** of historical artwork, trainer sheets, source packs, HTML material and design documents. Original bytes are retained, including opaque and transparent historical variants.

## Find and reuse assets

- [Original sources and restoration utility](originals/)
- [Curated character library](../../art-library/characters/)
- [Searchable historical character codes](../../art-library/characters/reference/recovered-indexes/)
- [Prepared Pate and Trade portraits](../../art-library/characters/ready/)

The prepared portraits are transparent and Poké Ball-free. Their lossless WebP variants preserve every RGBA pixel while reducing their combined size from 2,081,810 to 1,422,254 bytes. PNG versions remain available.

Large packs are split into 4 MiB pieces. `originals/MIGRATION-INDEX.json` records original filenames and SHA-256 hashes. To verify every source, run:

```sh
python archive/library-2026-10-20/originals/restore-originals.py --verify-only
```

To reconstruct original filenames, use `--destination recovered-originals` instead. Existing destination files are never overwritten.

## APK size

**This archive adds zero bytes to the APK.** It and `art-library/` are outside `dist/`, the Android build's only game-asset input. The `dist/` tree is unchanged by this import. Future updates should copy only the selected, optimized assets actually required by the live game; never copy entire archives or historical builds into `dist/`.

## Verification and cleanup

Import commit: `925efeebf49781c8e9a30923eee416479ea88748`.

All 626 imported reference files matched their expected Git object hashes. All 89 pre-existing character-library files were preserved. [VERIFICATION.json](VERIFICATION.json) records the result, and the migration index contains per-source hashes.

Cleanup is complete: all 534 archived originals were moved to recoverable Trash after verification. The refreshed source listing contains none of these archived originals. [CLEANUP-RECEIPT.json](CLEANUP-RECEIPT.json) records the completed cleanup. No permanent deletion was performed.

