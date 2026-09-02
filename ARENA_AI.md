# ARENA AI — working contract
AGENTS.md is the primary instruction file for this and every other agent.

1. Read AGENTS.md and the relevant canon topic for the requested system.
2. Inspect existing code, data, schemas and tests before editing.
3. Never change locked game design to make coding easier.
4. Work in small reviewable milestones; start with M1 below.
5. Add/update meaningful tests for system changes.
6. Run validation, applicable tests and build before finishing; report exact failures.
7. Report unresolved source/design questions without inventing canon.
8. Preserve save determinism, single-writer protection and Ironman transaction rules.
9. Preserve finished art; no generated placeholders or canonical back sprites.
10. For later high-risk state changes, obtain independent review of the diff and crash tests before acceptance.

## First-session prompt
```text
Read AGENTS.md, README.md, docs/canon/README.md, docs/canon/CORE_VISION.md,
docs/canon/UI_EXPECTATIONS.md, docs/audit/UNRESOLVED_ITEMS.md and
docs/implementation/FIRST_CODEX_TASK.md. Inspect existing files before editing.

Implement M1 only: a minimal TypeScript/Vite mobile-first offline PWA shell,
with a title/start screen and a development diagnostics view showing real
data/asset availability. Pin dependencies, commit a lockfile, and add working
dev, build, preview, typecheck and browser-test commands. Keep npm run validate
and npm run validate:content honest: the strict content gate must still report
the documented missing source data and runtime art.

Do not implement battle, species stats, encounter slots, story scenes or saves
from guesses. Do not replace finished art or put magenta portraits/evolution
sheets into production. Do not add fake playable content. Cache only the shell
and its required assets; never archive/source artwork. Do not present campaign
start as available until there is a real campaign implementation.

Acceptance: build succeeds; phone/Steam Deck layouts and input work; install,
close, disconnect and relaunch the shell offline; diagnostics reflect manifests;
tests cover shell lifecycle and unavailable data. Run import integrity tests and
report the exact expected content blockers, files changed, commands/results,
remaining risks and the next small task. Preserve all locked canon.
```

## Session handoff
End with: milestone/scope, canon read, files changed, tests/build and exact outcomes, unresolved items with IDs, and next small task. A clean shell build is not proof of complete game content. M2 loaders follow M1; source acquisition can proceed independently.
