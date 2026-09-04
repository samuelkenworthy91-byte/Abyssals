# Source-driven data import

Run `python3 tools/data/verify_derivations.py` to compare all 72 area summary values, 16 original core identities, 83 trainer/Warden identities, learnset rules and state enums against the preserved inputs. This verifies the current extraction without guessing the missing databases.

For each newly supplied workbook/document:
1. Preserve the original under docs/source_archive/ and add source_files.json provenance/checksum.
2. Inspect exact columns, canonical IDs, lock/version and supersession evidence; record conflicts first.
3. Write a dedicated reproducible parser for that actual format. Do not invent a generic workbook layout before seeing it.
4. Convert exact values to the matching data catalogue, retaining source file/sheet/row evidence and stable IDs. Resolve technical LOC/FIELD/table aliases against original IDs explicitly.
5. Update schema/index counts and remove missing_source only when the relevant data exists; partial records must stay blocked.
6. Run source reconciliation, integrity, meaningful negative tests and strict content validation. Resolve dependent references together.

Schema columns for future evolution/encounter records are repository interfaces, not claims about absent source column names. Conditional encounter resolvers require source-defined resolver IDs, schema support and reference checks before import; do not cram them into invented species IDs.
