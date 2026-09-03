# Conflicts and resolutions

Decisions preserve later locks and current explicit instructions. No missing game values have been guessed. Paths below are relative to docs/source_archive/ unless stated.

| ID | Subject | Conflicting/old material | Resolution | Evidence |
|---|---|---|---|---|
| C01 | Five elective human restorations | Older fixed/reserved companion allocation | Five total; Pate/Trade each optional and consume one only if chosen. | handoff_v1/docs/canon/SUPERSESSIONS.md: Human restoration |
| C02 | 18 execution type proxies | Earlier 12-proxy pool | Use eighteen, primary type. | handoff_v1/docs/canon/SUPERSESSIONS.md: Checklist 09 v1.1 |
| C03 | Aeric-only reserve access | Generic anywhere reserve/menu interpretations | CHR-AERIC in every town; unlimited reserve. | handoff_v1/docs/canon/SUPERSESSIONS.md: Reserve access |
| C04 | Authored phase encounters | Earlier source index/cleanup say table authoring pending | Completed locked workbook supersedes the pending statement: 72 areas, 144 tables, 864 authored slots recovered. | canon_sources/active/ABYSSALS_CHECKLIST_02_DAY_NIGHT_ENCOUNTER_TABLES_LOCKED_v1.0.xlsx, README and Encounter Tables |
| C05 | Runtime character IDs | CORE-xxx mistaken for game ID | Map known names to CHR-/LDR- IDs; CORE-007 maps to CHR-NHAROS (Phase D). | portrait_package/README.txt and handoff_v1/data/canon/characters.json |
| C06 | C03 trainer identities | Seven legacy identity portraits | Current: Mera, Ione, Tomas, Jarek, Selene, Reth, Elia. Legacy Samira, Idris, Laleh, Nasir, Zahra, Farid, Soraya stay historical only. | portrait_package/documentation/CONTENTS.csv |
| C07 | Portrait cleanup | Earlier import interpreted exact-only as a rejection gate for all 91 portraits | Superseded: exact colour plus constrained, reviewed background/edge cleanup is authorized. Preserve interior pink/purple. | Owner correction, 3 September 2026, section 3 |
| C08 | Portrait canvas engineering choice | Handoff defers canvas selection | User authorizes choosing/documenting canvas. Phase D final convention: 2048×2048, body height 1536 px and soles y=1920 with reviewed body anchors and shared body scale; do not stretch or fit by prop height. | Current user request Phase 5 |
| C09 | Species art coverage | Earlier import treated 89 files as incomplete species supply | Superseded: the supplied 89 sheets represent all 187 canonical species; mapping and individual extraction are required preparation work. | Owner correction, 3 September 2026, section 2; handoff ACTIVE_CANON sections 4/17 |
| C10 | Portrait target count vs images | 91 files could imply 91 current targets | 78/100 targets plus one form variant, five alternates and seven superseded images. Brann alternate duplicates canonical bytes. | portrait_package/README.txt and checksums |
| C11 | Active build/tool commands | Vite scripts without entry point; latest dependencies; permissive checks | Preparation has real validation/tests only. M1 adds application entry/build commands and pinned lockfile. | handoff_v1/package.json and src inventory |
| C12 | Prior repository fragments | Encoded archive chunks at root | Preserve all 19 files in docs/source_archive/prior_repository; both chunk sets fail ZIP assembly. Do not use as design authority. | Existing main 2fdcc0c96a59490df47c4d5787ea64814e7659d8 |

| C13 | Active Checklist 09 | Handoff index cites v1.1 alone | Apply recovered v1.2 correction to unchanged v1.1 body: five elective restorations, eighteen proxies. | canon_sources/active/ABYSSALS_CHECKLIST_09_Leader_Trainer_Fate_System_LOCKED_v1.2_CORRECTION.docx sections 1–6 |
| C14 | Archived authority | Blanket historical-only classification | Pristine active locked clauses retain content authority; archived agent prompts/tools and explicitly superseded clauses do not govern work. | Canon Source Index; owner correction section 5 |
| C15 | M1 timing | Earlier first-session prompt starts app shell | Superseded: finish preparation A–G, stop for review at H; no M1, gameplay or merge. | Owner correction sections 6–7 |
| C16 | HP growth | Handoff summary says guaranteed +10 baseline; Checklist 01 says +10 per successful increment | Resolved: Checklist 01 expressly owns growth; body 24 gives +10 per HP success, body 26 permits zero-success levels, and body 27 prohibits guarantees. The compiled baseline summary is superseded. | canon_sources/active/ABYSSALS_CHECKLIST_01_Exact_Stat_Growth_Algorithm_LOCKED_v1.0.docx sections 2–3 versus handoff ACTIVE_CANON section 4 |

| C17 | Extra Flaggrim illustrations | Five pictured figures versus three canonical species in this family | Map the three named figures; preserve two unlabelled extras as unassigned supplemental art. Do not add species/evolution edges. | Flaggrim.webp labels; numeric Dex #73–75; Evolution Paths |
| C18 | Regalisk type strip | Source sheet prints Poison/Flying/Dragon | Dex #32 defines Poison/Dragon. Preserve artwork; remove the printed strip in runtime extraction. | Bantisk.webp versus Stats/Abilities v2 Full Dex row 34 |

## Remaining reconciliation
See PHASE_A_REAUDIT.md and UNRESOLVED_ITEMS.md. The creature register and detailed rule sources are recovered. Nharos identity and CHR-NHAROS mapping are resolved in Phase D. Artwork labels do not override locked identity/type data.

| C19 | Evolution current HP | Checklist 11/addendum cap-only wording | Checklist 13 body 79–81 explicitly supersedes this with HP-percentage preservation and integer half-up rounding. | Checklist 13 body 81 |
| C20 | Rebellious Jab priority | Move catalogue #310 grants conditional pre-normal action | Checklist 12 body 42 expressly limits priority +1 to Plain Dash and Frost Shard and assigns all others 0. #310 conditional priority is superseded, retained in source text only. | Checklist 12 priority whitelist |
| C21 | VFX viewpoint | Legacy move VFX log requests side-view presentation | Retain action intent for metadata; Checklist 16 first-person presentation overrides all side-view framing. | Checklist 16 |
| C22 | Leader held slots | Checklist 04 body 59 vs body 108 | UNRESOLVED: Yselle specifies 1 slot but names 2; Oren specifies 4 but names 3. Neither equal-version clause supplies a defensible final allocation. Preserve both. | Checklist 04 bodies 59,108 |
