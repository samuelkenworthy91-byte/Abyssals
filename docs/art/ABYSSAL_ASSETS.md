# Abyssal source art and identity mapping

All 89 supplied WebP sheets are preserved unchanged, 1448×1086 RGB. Phase B reconciles **187/187** labelled species to the numeric Dex. The 98 canonical evolution links form exactly 89 families; every source filename matches its family root. There are no unresolved canonical species identities.

`data/manifests/abyssal_art.json` has one record per canonical species, source file/checksum, figure position, identity evidence and deterministic planned runtime filename. `data/species/species.json` carries the 187 established identities, exact base stats and ability names. A zero-padded string such as `001` serializes canonical numeric Dex #1; it is not a replacement numbering system.

The Flaggrim sheet includes two extra unlabelled illustrations at far right. Preserve these as unassigned supplemental artwork; the three explicitly named figures match Flaggrim, Oriflamme and Tattereign. Do not invent two new species or infer evolution edges from illustration arrows. Regalisk’s source type strip includes Flying in addition to Poison/Dragon; the locked Dex controls its actual two types.

Phase C must extract each named figure non-destructively, remove labels/arrows and intended background, retain all body details/effects, use a shared transparent canvas and documented scale/padding, and verify every output visually and programmatically. Original source files must remain byte-identical. No back/player sprites are required.

Reproduce the identity extraction before runtime processing with `python3 tools/data/extract_species_identity.py`. This is a preparation importer; after downstream enrichment use the consolidated import workflow to avoid replacing enriched records with an earlier-stage snapshot.
