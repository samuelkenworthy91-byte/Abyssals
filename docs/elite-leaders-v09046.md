# Elite town leaders — v0.90.46

| ID | Canonical identity | Town | Specialty | Fixed levels |
| --- | --- | --- | --- | --- |
| LDR-01 | Ser Yusuf ibn Salim | Dorelem | Ground | 18,18,19,19,20,20 |
| LDR-02 | Abbess Aisha bint Ibrahim | Philomere | Fairy | 36,37,37,38,39,40 |
| LDR-03 | Provost Ahmad ibn Yusuf | Cybressa | Dark | 40,40,41,41,42,42 |
| LDR-04 | Warden Ismail ibn Umar | Cossenne | Grass | 55,56,57,58,59,60 |
| LDR-05 | Castellan Khalid ibn Hasan | Marasen | Water | 66,67,68,69,70,70 |
| LDR-06 | Canon Fatima bint Musa | Botrune | Fighting | 74,74,75,75,76,77 |
| LDR-07 | Marshal Ibrahim ibn Ahmad | Cayfen | Steel | 88,88,89,90,91,92 |
| LDR-08 | Hierophant Hasan ibn Ibrahim | Ramelle | Psychic | 100,100,101,102,103,105 |

Specialties reflect Yusuf's grounded military discipline, Aisha's restorative work, Ahmad's calculating administration, Ismail's orchards, Khalid's living-water city, Fatima's armoured physical authority, Ibrahim's protective artisan city, and Hasan's learned spiritual authority. No names, genders, family relationships, dialogue, gates or judgement scenes are rewritten.

`elite-leaders.js` supplies one saved roster under `state.leaderTeams[id]`. A new game obtains a cryptographic random `leaderTeamSeed`; older saves derive and persist a stable seed from their existing identity. Town visits lock teams using the travel ledger; challenge preparation also locks a missing team. Both are saved with the existing snapshot. Six original levels and one slot-six ace remain fixed. Saved team objects are authoritative on reload and loss. Rematches train those same saved families forward to legal level evolutions, recurate their legal moves, and leave the locked original roster untouched. Generation never mutates story data or party/reserve/death records. Nursery gifts consult the saved ace. Existing gift receipts remain authoritative.

Generation compares 64 six-family candidates for secondary-type diversity, mixed offence and defensive coverage. Physical/special slots, bulky and speed slots and a high-BST ace guide selection. Fully evolved level-legal forms are required. Special item/stat/story branches and parents already eligible for those branches are excluded rather than inventing fulfilled evolution requirements. Mythic and legendary species are excluded. Learnsets and compatible existing exchange lessons supply four moves, including specialty STAB, coverage and useful support where available. No external or invented moves are granted. Each member has a real inherited original Prodigy bonus; leaders 7–8 have selected multi-stat members. Birth-form level growth and normal promotions apply all evolution multipliers, with no direct battle-stat inflation.

The existing Arena decision engine now also accepts `eliteLeader`, leaving ordinary trainers unchanged. It scores expected damage, STAB, matchups, accuracy, PP, physical/special stats, stages, weather, screens, healing, status and safe setup. Switching uses existing leave/entry hooks, trapping checks and the whole action; a two-round cooldown and maximum eight voluntary switches per challenge prevent loops. The ace is reserved when an adequate replacement remains. Existing item allowances remain finite. Only supported engine effects are selected; relay moves requiring a separate ally target are excluded from generated sets.

Journal sightings follow the visible front, practice `index`, or exact active double slots. Portrait-only introductions reveal no roster. Rendering a newly visible species persists its sighting before commands; ordinary persistence also records the current visible opponents. Sightings survive escape, loss and later ownership changes. Uncaught rumours use `hasVisitedTown` from the existing travel ledger and reveal only general towns; the named journal and caught growth/habitat detail are retained.

Eight individual built-in image generations redesigned the canonical portraits; six received separate transparent-background extraction passes. Prompts and final SHA-256 values are recorded in `art-library/characters/elite-v09046/provenance.json`. Optimised live WebP assets replace the established leader IDs, supplying battle/dialogue/overworld callers consistently. Khalid's separate battle alias uses the same full-body design. New elemental framing enlarges portraits and entrances with reduced-motion support.

Release uses package `uk.co.abyssals.game`, versionCode 141 and the existing original certificate verification in GitHub Actions. No signing material is changed or copied out of Actions secrets.
