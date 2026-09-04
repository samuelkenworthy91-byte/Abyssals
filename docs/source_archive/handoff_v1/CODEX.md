# Codex — project handoff

Codex should follow `AGENTS.md` as the root instruction file. Before each feature, open the relevant canon/data files, inspect current tests, implement the smallest vertical slice, and run tests/build.

For high-risk state changes, produce deterministic test fixtures and leave the diff ready for independent review. Never infer away an explicit canon edge case because a conventional RPG implementation would be easier.
