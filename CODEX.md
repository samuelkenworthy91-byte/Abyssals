# Codex working handoff

AGENTS.md is the primary instruction document for every agent. Preparation is at **Phase H owner review** on `handoff/structured-import`, PR #1. Do not start M1, implement gameplay or merge until explicitly instructed by the owner.

## First-session prompt

```text
Read AGENTS.md and docs/audit/FINAL_PREPARATION_REPORT.md.
Confirm the owner has authorized a specific next task; otherwise stop at the review hold.
Read the relevant docs/canon/ topic and SUPERSESSIONS.md, then the dataset,
schema, provenance, exact unresolved fields and existing code/tests.
Work on one small reviewable milestone. Preserve locked design, canonical IDs,
finished artwork, deterministic growth and Ironman transaction rules.
Do not invent content or treat historical source wording as current authority.
Add/update meaningful tests for system changes. Run integrity, source
reconciliation, tests and the strict content gate; report exact failures.
Do not weaken checks, substitute generated art or silently supply defaults.
Stop at the agreed acceptance criteria and report the next bounded task.
```

All 187 monster fronts and 79 active portraits are available. The 22 missing portrait targets and nine partial datasets remain explicit. The 685 checklist table records are a searchable source-contract index, not ready-to-execute runtime logic. A green integrity badge does not clear the full-content gate.

After explicit M1 release, use [FIRST_CODEX_TASK.md](docs/implementation/FIRST_CODEX_TASK.md). Final reports must include scope, canon read, changed files, tests/build actually run, unresolved questions and next task. Never claim gameplay playtesting when no playable game exists.
