# Remaining preparation and content questions

Current audited state at Phase H. This list replaces old blanket missing-source claims. All source-backed counts are extracted; these are exact remaining decisions or future authored payloads. A dataset marked COMPLETE is complete for its stated representation, not proof of executable gameplay.

## Genuinely missing field contracts

- **species.capture_rate** — Approved 187-species numeric catch-rate table. No such values occur in the supplied complete references.
- **types.effectiveness** — Approved 18x18 interaction table, including Fairy, or exact versioned rule import.
- **xp.participant_level_gap_formula** — Exact level-gap XP amount/formula, rounding and any participation adjustment. Sources specify 100 XP per level and per-participant comparison only.
- **battle.core_numeric_contract** — Exact versioned damage, critical-hit, status-duration, accuracy/evasion and capture/shake integer contracts, plus level-1 instance initialization. Gen III-style alone does not resolve all custom-18-type and growth-model bindings.
- **encounters.WRONG_SHIFT** — Original handoff ACTIVE_CANON section 12 names this rare anomaly category; recovered world and encounter references do not define its trigger, rate or resolver. An authored anomaly contract is required.
- **world.phase_clock_lifecycle** — Cleanup Addendum and Checklist 17 specify ten real-time minutes per phase, but do not specify whether suspended/offline time advances the cycle or how pause/background transitions persist. Confirm this lifecycle policy before implementing the clock; do not infer wall-clock catch-up.

## PARTIAL — data/trainers/trainers.json (95 records)

- All 95 fixed rosters and current-form legal move pools are recovered. Final four-move loadouts require unresolved move metadata plus a documented deterministic implementation of Checklist 04 qualitative profiles; numeric profile scores are not authored in the sources. Leader-lite tier switch/knowledge inheritance is not explicitly assigned in the seven-tier table.
- NAM-KURG: Named roster specifies held count but not all held-role/slot assignments (Checklist 04 body 104).
- NAM-RHOSWEN: Named roster specifies held count but not all held-role/slot assignments (Checklist 04 body 104).
- NAM-SEVERIN: Named roster specifies held count but not all held-role/slot assignments (Checklist 04 body 104).
- LDR-02: Checklist 04 body 59 specifies 1 held slots; body 108 names 2. Resolve exact slot allocations without deleting authored highlights.
- LDR-07: Checklist 04 body 59 specifies 4 held slots; body 108 names 3. Resolve exact slot allocations without deleting authored highlights.
- WRD-01: Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.
- WRD-02: Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.
- WRD-03: Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.
- WRD-04: Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.
- WRD-05: Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.
- WRD-06: Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.
- WRD-07: Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.
- WRD-08: Three held roles are authored, but their team-slot allocation is not specified by Checklist 04 body 112.
- Checklist 09 v1.1 bodies 54–61 explicitly defer separate Hell rematch team versions (levels, moves, held items) and postgame tournament venue/rewards/rotation to a later addendum. The conditional zero-to-eight executed-leader gauntlet is locked; its exact upgraded rosters are not supplied.

## PARTIAL — data/locations/locations.json (93 records)

- Authored settlements/routes and 72 ecological area records are recovered. Tile maps, per-screen dimensions, collision grids, doorway coordinates and trigger placements have not been authored in the supplied sources.
- LOC-JEROS occurs in the original handoff but is absent from the recovered locked world graph and Story Bible. An approved reconciliation or explicit retirement is required; do not silently alias it to Ramelle.

## PARTIAL — data/species/species.json (187 records)

- capture_rate: no per-species numeric catch-rate table appears in the 35 detailed references or original handoff. Supply an approved 187-row catch-rate table; do not derive rates from BST or rarity.

## PARTIAL — data/moves/moves.json (354 records)

- move 3 (Plain Call): category: authored action does not unambiguously establish physical versus special damage
- move 4 (Plain Clap): category: authored action does not unambiguously establish physical versus special damage
- move 9 (Plain Swipe): effect.high_critical_ratio: exact stage/critical formula absent
- move 13 (Swift Clap): category: authored action does not unambiguously establish physical versus special damage
- move 14 (Swift Dash): effect.high_critical_ratio: exact stage/critical formula absent
- move 22 (Ash Lash): category: authored action does not unambiguously establish physical versus special damage
- move 24 (Ash Rush): effect.recoil: damage-dealt versus maximum-HP basis is unspecified
- move 29 (Cinder Lash): category: authored action does not unambiguously establish physical versus special damage
- move 30 (Cinder Pounce): effect.recoil: damage-dealt versus maximum-HP basis is unspecified
- move 45 (Foam Lance): category: authored action does not unambiguously establish physical versus special damage
- move 48 (Foam Sweep): category: authored action does not unambiguously establish physical versus special damage
- move 54 (Tide Lance): category: authored action does not unambiguously establish physical versus special damage
- move 58 (Tide Sweep): category: authored action does not unambiguously establish physical versus special damage
- move 65 (Spark Crash): effect.recoil: damage-dealt versus maximum-HP basis is unspecified
- move 67 (Spark Fang): effect.recoil: damage-dealt versus maximum-HP basis is unspecified
- move 68 (Spark Jolt): category: authored action does not unambiguously establish physical versus special damage
- move 74 (Volt Jolt): category: authored action does not unambiguously establish physical versus special damage
- move 77 (Storm of Youth): effect.recoil: damage-dealt versus maximum-HP basis is unspecified
- move 89 (Root Grip): category: authored action does not unambiguously establish physical versus special damage
- move 95 (Thorn Guard): effect.contact_retaliation: source does not identify whose maximum HP supplies the 1/8 basis
- move 105 (Frost Rush): effect.high_critical_ratio: exact stage/critical formula absent
- move 106 (Frost Shard): category: authored action does not unambiguously establish physical versus special damage
- move 107 (Frost Spire): effect.high_critical_ratio: exact stage/critical formula absent, category: authored action does not unambiguously establish physical versus special damage
- move 108 (Frost Sweep): category: authored action does not unambiguously establish physical versus special damage
- move 113 (Rime Shard): category: authored action does not unambiguously establish physical versus special damage
- move 121 (Brave Palm): effect.high_critical_ratio: exact stage/critical formula absent
- move 124 (Firm Footing): effect.prevent_forced_switch: duration/expiry is not specified
- move 126 (Iron Blow): effect.high_critical_ratio: exact stage/critical formula absent
- move 139 (Toxin Lash): category: authored action does not unambiguously establish physical versus special damage
- move 140 (Toxin Spray): category: authored action does not unambiguously establish physical versus special damage
- move 148 (Venom Spray): category: authored action does not unambiguously establish physical versus special damage
- move 149 (Venom Sting): category: authored action does not unambiguously establish physical versus special damage
- move 151 (Venom Cairn): category: authored action does not unambiguously establish physical versus special damage
- move 156 (Dune Drop): category: authored action does not unambiguously establish physical versus special damage
- move 160 (Dune Surge): category: authored action does not unambiguously establish physical versus special damage
- move 168 (Earth Surge): category: authored action does not unambiguously establish physical versus special damage
- move 177 (Gale Crash): effect.high_critical_ratio: exact stage/critical formula absent
- move 179 (Gale Dive): effect.high_critical_ratio: exact stage/critical formula absent
- move 233 (Crag Spire): effect.high_critical_ratio: exact stage/critical formula absent, category: authored action does not unambiguously establish physical versus special damage
- move 237 (Stone Break): effect.high_critical_ratio: exact stage/critical formula absent
- move 241 (Stone Fang): effect.high_critical_ratio: exact stage/critical formula absent
- move 248 (Sickle Talon): effect.high_critical_ratio: exact stage/critical formula absent
- move 255 (Shade Lash): category: authored action does not unambiguously establish physical versus special damage
- move 257 (Shade Rush): category: authored action does not unambiguously establish physical versus special damage
- move 264 (Wraith Lash): category: authored action does not unambiguously establish physical versus special damage
- move 266 (Wraith Rush): category: authored action does not unambiguously establish physical versus special damage
- move 274 (Drake Fang): effect.recoil: damage-dealt versus maximum-HP basis is unspecified
- move 281 (Wyrm Burst): effect.recoil: damage-dealt versus maximum-HP basis is unspecified
- move 282 (Wyrm Claw): effect.recoil: damage-dealt versus maximum-HP basis is unspecified
- move 297 (Night Slash): effect.high_critical_ratio: exact stage/critical formula absent
- move 298 (Night Strike): effect.high_critical_ratio: exact stage/critical formula absent
- move 314 (Iron Crash): effect.high_critical_ratio: exact stage/critical formula absent
- move 325 (Steel Cut): effect.high_critical_ratio: exact stage/critical formula absent

## PARTIAL — data/types/types.json (18 records)

- All 18 canonical type identities are recovered. The source package names a Gen III-style battle foundation but does not supply an explicit 18x18 effectiveness matrix (including Fairy) or a versioned import contract. Supply/approve that exact matrix; do not assume a conventional generation.

## PARTIAL — data/story/scenes.json (150 records)

- All authored CHxx scene IDs and four WLD story-evolution events are extracted. Per-screen trigger bindings, full conditional dialogue and executable event actions remain to be authored against these scene specifications; legacy source-state text must use Checklist 10 translations.

## PARTIAL — data/dialogue/dialogue.json (7 records)

- Seven explicitly attributed verbatim lines extracted. The story is predominantly scene direction rather than a complete spoken script; remaining dialogue, branch-specific line wording, Checklist 07 epitaph templates and the approximately 40 farewell messages requested by Checklist 16 require authored text.

## PARTIAL — data/battles/battles.json (93 records)

- Fixed trainer encounters are indexed. Illyr/Nharos manifestation numeric phase payloads and Mirra illusion trigger timings are not specified by the source story/terrain contracts. Tutorial dummy stats and complete map-trigger bindings also remain unauthored.

## PARTIAL — data/species/abilities.json (87 records)

- ABILITY_ADAPTABLE_HIDE: The source does not specify whether remembered types accumulate or only the latest type persists.
- ABILITY_COVETOUS_MIRROR: Which stat/stage is copied when the opponent raises multiple stats simultaneously is unspecified.
- ABILITY_PALIMPSEST: The source does not specify whether remembered moves accumulate or only the latest move persists.
- ABILITY_STORED_CHARGE: Contact hits do not specify receiving versus dealing contact damage.
- ABILITY_WAYSTONE_MASTER: Which hazard layer is removed if multiple distinct hazards are present is unspecified.
- Move contact/sound tags and generic weather/hazard/screen/berry contracts are not fully enumerated by the supplied catalogue. Preserve these authored ability dependencies; do not invent Berry items or copy conventional battle defaults.

## Missing canonical portraits — 22

| ID | Canonical name |
|---|---|
| LDR-01 | Ser Aldren March |
| LDR-04 | Warden Samiel Elow |
| CHR-RHOSWEN | Dame Rhoswen Vey |
| TRN-C04-001 | Caravan Guard Tovin |
| TRN-C04-003 | Smuggler Caro |
| TRN-C04-007 | Captain Niva |
| TRN-C04-008 | Relic Broker Ors |
| TRN-C05-001 | Orchard Keeper Rene |
| TRN-C05-002 | Pilgrim Ada |
| TRN-C05-003 | Shrine Guard Lucen |
| TRN-C05-004 | Hunter Mirek |
| TRN-C05-005 | Grove Warden Sera |
| TRN-C06-010 | War Captain Drask |
| TRN-C07-004 | Looting Mercenary Kerr |
| TRN-C07-005 | Archivist Sorel |
| TRN-C07-008 | Relic Keeper Cael |
| TRN-C07-009 | Tide Scribe Hessa |
| TRN-C07-010 | Antiquarian Nox |
| TRN-C08-002 | Deserter Jula |
| TRN-C08-005 | Veteran Tars |
| TRN-C09-002 | Sacred Knight Moira |
| TRN-C09-009 | Champion Daven |

Unresolved active portrait identities: none. Five identified alternates and seven superseded files remain source-only. Two unlabelled supplemental monster illustrations remain preserved without invented species identities; all 187 canonical species already have runtime fronts.

## Future implementation and production, not missing source files

- Choose and version deterministic PRNG/hash/serialization implementations within the locked save/growth contracts.
- Implement qualitative trainer-profile scoring transparently; do not present chosen implementation weights as source-authored canon.
- Author map geometry and scene trigger placement within the locked world graph.
- Implement the game incrementally only after the owner releases the M1 hold.
- Produce approved overworld/environment/UI/VFX/audio assets and the 18 execution proxy visuals at their roadmap milestones; no replacement back-sprite set is required.
- Full spoken script, epitaphs, farewell pool and exact rematch payloads require authoring against the recovered narrative contracts.
- Runtime save schema/version and PRNG details are engineering work within locked determinism constraints; no gameplay has been implemented.
