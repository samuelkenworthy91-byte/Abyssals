# Conflicts and resolutions

Decisions preserve later locks and current explicit instructions. No missing game values have been guessed. Paths below are relative to docs/source_archive/ unless stated.

| ID | Subject | Conflicting/old material | Resolution | Evidence |
|---|---|---|---|---|
| C01 | Five elective human restorations | Older fixed/reserved companion allocation | Five total; Pate/Trade each optional and consume one only if chosen. | handoff_v1/docs/canon/SUPERSESSIONS.md: Human restoration |
| C02 | 18 execution type proxies | Earlier 12-proxy pool | Use eighteen, primary type. | handoff_v1/docs/canon/SUPERSESSIONS.md: Checklist 09 v1.1 |
| C03 | Aeric-only reserve access | Generic anywhere reserve/menu interpretations | CHR-AERIC in every town; unlimited reserve. | handoff_v1/docs/canon/SUPERSESSIONS.md: Reserve access |
| C04 | Authored phase encounters | Earlier incomplete table descriptions | 72 areas/144 tables is locked; all weighted slots remain absent in supplied ZIP. | handoff_v1/docs/canon/SUPERSESSIONS.md: Encounter tables |
| C05 | Runtime character IDs | CORE-xxx mistaken for game ID | Map known names to CHR-/LDR- IDs; CORE-007 unresolved. | portrait_package/README.txt and handoff_v1/data/canon/characters.json |
| C06 | C03 trainer identities | Seven legacy identity portraits | Current: Mera, Ione, Tomas, Jarek, Selene, Reth, Elia. Legacy Samira, Idris, Laleh, Nasir, Zahra, Farid, Soraya stay historical only. | portrait_package/documentation/CONTENTS.csv |
| C07 | Exact-only portrait keying | Archived tolerance=3 and near-exact instructions | Current user requires RGB=(255,0,255) only. No fuzzy removal; all actual files fail clean-background gate. | Current user request versus handoff_v1/tools/process_portraits.py |
| C08 | Portrait canvas engineering choice | Handoff defers canvas selection | User authorizes choosing/documenting canvas. Set 1536×2048 with reviewed body anchors and shared body scale; do not stretch or fit by prop height. | Current user request Phase 5 |
| C09 | Art completion vs supplied bytes | Handoff says all 187 front sprites complete | Preserve project completion claim historically; record 89 labelled source sheets, zero verified ID-matched runtime sprites in this import. | Archive byte inventory and full-sheet visual audit |
| C10 | Portrait target count vs images | 91 files could imply 91 current targets | 78/100 targets plus one form variant, five alternates and seven superseded images. Brann alternate duplicates canonical bytes. | portrait_package/README.txt and checksums |
| C11 | Active build/tool commands | Vite scripts without entry point; latest dependencies; permissive checks | Preparation has real validation/tests only. M1 adds application entry/build commands and pinned lockfile. | handoff_v1/package.json and src inventory |
| C12 | Prior repository fragments | Encoded archive chunks at root | Preserve all 19 files in docs/source_archive/prior_repository; both chunk sets fail ZIP assembly. Do not use as design authority. | Existing main 2fdcc0c96a59490df47c4d5787ea64814e7659d8 |

## Still unresolved
Nharos game ID/role; exact creature register and numeric rules; possible artwork labels/palette departures; original source availability. See UNRESOLVED_ITEMS.md. Visual artwork never overrides a locked faction rule or trainer identity.
