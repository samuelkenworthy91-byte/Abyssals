# ARENA AI — working contract

## Preparation hold — owner instruction, 3 September 2026

Continue `handoff/structured-import` and update PR #1. Complete preparation phases A–G, then stop at H for owner review. **Do not start M1, implement gameplay, or merge PR #1.** The earlier M1 prompt is superseded for the current task.

AGENTS.md is the primary instruction file for this and every other agent.

1. Read AGENTS.md and the relevant canon topic for the requested system.
2. Inspect existing code, data, schemas and tests before editing.
3. Never change locked game design to make coding easier.
4. Work in small reviewable milestones; complete the current preparation phase.
5. Add/update meaningful tests for system changes.
6. Run validation, applicable tests and build before finishing; report exact failures.
7. Report unresolved source/design questions without inventing canon.
8. Preserve save determinism, single-writer protection and Ironman transaction rules.
9. Preserve finished art; no generated placeholders or canonical back sprites.
10. For later high-risk state changes, obtain independent review of the diff and crash tests before acceptance.

## First-session prompt
```text
Read AGENTS.md, docs/audit/PHASE_A_REAUDIT.md and docs/canon/README.md.
Inspect the current preparation status before editing. Finish the next
preparation phase from A–G on handoff/structured-import, preserving originals
and every locked decision. Read the full relevant source authority chain;
extract established records instead of leaving missing_source placeholders.
Validate data, provenance, references and assets. Commit the phase and report
numeric coverage, unresolved items, commit SHA and preparation percentage.
Do not start M1, implement gameplay, merge PR #1, generate replacement art or
invent canon. Stop at Phase H for the owner's review.
```

## Session handoff
End with: milestone/scope, canon read, files changed, tests/build and exact outcomes, unresolved items with IDs, and next small task. A clean shell build is not proof of complete game content. Current next work is repository preparation, not M1.
