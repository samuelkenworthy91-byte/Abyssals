# Save Ironman

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

## Authority and structured data

Authority: Checklist 15, with semantic rules in 07 and 09–14. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/save_schema/contracts.json`; `data/story/state_model.json`; `data/story/state_contracts.json`.

## Implementation contract and remaining boundary

The detailed storage model, barriers, deterministic RNG contracts, recovery/migration and failure requirements are extracted. This is a design contract, not a released save format or implemented backend. Choose/version a concrete PRNG, hash and serialization implementation during the approved milestone. M4–M8 disposable fixtures cannot become production irreversible campaigns before M9 passes crash/reload tests.
