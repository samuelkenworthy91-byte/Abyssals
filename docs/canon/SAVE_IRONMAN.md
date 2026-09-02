# Save Ironman

Authority: supplied handoff v1.0 ACTIVE_CANON sections 15. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

- 3 independent campaign slots.
- One authoritative current state per slot.
- Current snapshot + two hidden recovery-only rolling backup generations + transaction journal.
- Monotonic `commit_seq` and idempotent transaction IDs.
- Atomic durable commits for death, starter-life loss/pending return, capture, sacrifice/resurrection, evolution, move choices, item ownership, leader fate/story choices and chapter completion.
- Deterministic command/RNG/encounter persistence prevents reload rerolls.
- Starter life decrement and pending 10% return survive crashes exactly once.
- Corruption recovery selects the highest valid state automatically; the player does not choose a rollback backup.
- Schema migrations are forward-only and atomic with hidden pre-migration protection.
- Save Now / Save & Quit create no rollback point.
- Technical soft-lock recovery may relocate the player only and may never reverse canonical losses.
- Legitimately unwinnable/protagonist-dead campaigns remain ended.
- Single-writer browser/session protection and durable-write acknowledgement are required.

## Implementation boundary
Read data/save_schema/contracts.json for required transaction boundaries. This import defines invariants, not a released save schema. No forward migration/version number may be claimed until a runtime format exists.
