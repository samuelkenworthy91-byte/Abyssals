# Import audit — 2026-09-02

## Scope and evidence
Audit completed before reorganizing: ZIP listing/CRC-safe reads, SHA-256 for every member, safe path checks, all text/JSON/scripts/schema inspection, Word guide text extraction, image decode/dimensions/colour inspection, full-set visual contact review, exact duplicate detection and portrait queue matching. Original files remain untouched. ZIP member timestamps are provenance only, not evidence of a later design lock.

| Package | Files | Images | Finding |
|---|---:|---:|---|
| Coding handoff v1.0 | 48 | 0 | Canon summaries, nine canon JSONs, four draft schemas, tooling, Word guide; originals explicitly omitted |
| Portrait package | 97 | 91 | 78/100 current targets, one form variant, five alternates, seven legacy |
| Monster art | 89 | 89 | Labelled evolution sheets/single illustrations; all 1448×1086 RGB WebP |
| Total attachments | 234 | 180 | All retained with checksums |
| Existing repository | 19 | 0 | Minimal README and 18 base64 fragments; all retained separately |

## Existing repository
Main was inspected at `2fdcc0c96a59490df47c4d5787ea64814e7659d8`. No game code or existing active AGENTS file was present. All 19 fetched blobs were verified against their Git SHA. Both prior encoded chunk sets fail ZIP assembly. They move to docs/source_archive/prior_repository/; no main history is rewritten.

## Complete inventories
data/manifests/source_files.json lists all 234 archive members (archive, original path, size, timestamp, SHA-256, imported path, duplicate IDs and normalization notes), plus all 19 prior repository files. data/manifests/abyssal_art.json lists all 89 sheets; portraits.json lists all 91 portrait images and exact missing targets. No source asset was silently deduplicated or discarded.

## Duplicates and identity conflicts
Two exact duplicate groups: three empty handoff .gitkeep files; Brann canonical and ALT-01 portrait. Brann has two source records but one active target. Seven superseded C03 names are retained only as legacy. Five alternate images and one Severin form variant are not additional unique characters. CORE queue labels are translated to CHR/LDR IDs where the handoff establishes identity; Nharos remains unresolved. All 75 trainer and eight Warden queue IDs/names are preserved, without inferred classes or teams.

## Art readiness
Cannot confirm exactly 187 canonical species: the species ID/name register is missing, and supplied sheets are not isolated runtime sprites. No back sprites generated. All 91 portrait backgrounds fail exact-only keying; zero runtime portraits are emitted. There are 22 missing named portrait targets and no 39-class template artwork. Full-body source sheets include labels and possible faction/role departures; no unrequested repainting was performed.

## Structured data coverage
Existing machine-readable material: 16 core character records; faction palette rules; core mechanics constants; state enums; move/relearn rules; ten major location names; 72 encounter-area summaries; eight field names; portrait production totals. Converted from prose: transaction boundary contract, topic-based canon, explicit implementation gates. Portrait CSV adds 75 named trainers/eight Wardens and packaging aliases, producing 99 established character IDs plus unresolved Nharos.

Missing detailed datasets: 187 species stats/abilities; 98 evolution paths; 1,893 learnsets; complete moves/types; 144 weighted encounter slot tables; trainer teams/AI/classes; items/shops; Story Bible scenes/dialogue/maps; field numeric effects. Partial JSON uses null/empty records with missing_source status. No fake entries stand in for missing content.

## Superseded and normalization decisions
Twelve documented resolutions are in CONFLICTS_AND_RESOLUTIONS.md. Source filenames remain pristine, including punctuation. Runtime filenames use canonical ID + sanitized readable name only when identity is known. Canon docs and active scripts use the new layout; archived agents, old asset paths, fuzzy-key defaults and fake-ready build commands are explicitly NON-AUTHORITATIVE.

## Validation interpretation
`npm run validate` checks import integrity, schemas, paths, IDs, references and source checksums. `npm run validate:content` additionally requires complete canonical content and runtime assets, and must fail on this partial source set. This separation permits safe M1 infrastructure work while preventing a false claim of full implementation readiness. See VALIDATION_REPORT.md for actual executed results.
