# Pristine source archive
Read ../../AGENTS.md and ../canon/README.md first. These files preserve exact source bytes. Locked authorities in `canon_sources/active/` retain content authority and must be consolidated into the active Markdown/data layer. Embedded AGENTS/CODEX/ARENA files, scripts, schemas and `canon_sources/superseded/` are historical evidence only.

- handoff_v1/: all 48 handoff members, unchanged. Current rules have been extracted into ../canon/ and ../../data/.
- portrait_package/: the six original package metadata files; image originals are under assets/portraits/source/.
- canon_sources/: 31 active authority-chain files and four superseded/reference files, with checksums in `manifest.json`.
- prior_repository/: all 19 pre-import files, relocated from main at 2fdcc0c96a59490df47c4d5787ea64814e7659d8. Both base64 fragment sets fail ZIP assembly; retain as evidence.

Superseded implementation guidance includes old asset paths, package CORE IDs used as runtime IDs, permissive validation, unpinned dependencies and build commands without an application entry point. See ../audit/CONFLICTS_AND_RESOLUTIONS.md.
