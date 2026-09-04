# Structured data
Read manifests/datasets.json for dataset status, source paths and record counts. Envelopes use schema_version, status, sources, records and unresolved. `complete_for_supplied_source` means the provided summary was fully converted; it does not mean the full game database exists. Missing datasets are valid empty structures; null means unknown, never zero or an empty live team.

Canonical IDs: CHR-* / LDR-* from handoff; TRN-* / WRD-* from supplied portrait queue; area codes retained exactly; faction keys retained exactly. LOC-*, FIELD-* and area-phase table keys are documented import-assigned namespaced keys. CORE-* labels remain aliases only; Nharos is unresolved. Never derive numeric species IDs from image order.

Runtime code must reject missing_source/partial records that its operation needs. Fixtures belong under tests/fixtures/ and must never be copied into these catalogues. Run npm run validate for integrity and npm run validate:content for strict content readiness. The latter currently fails deliberately with source gaps, not a fabricated success.
