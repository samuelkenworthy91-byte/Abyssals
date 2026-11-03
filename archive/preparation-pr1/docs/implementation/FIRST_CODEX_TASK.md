# First implementation task — M1, only after explicit owner release

**Current action: stop at Phase H for review. This document does not authorize M1.**

Once the owner releases the hold, give Codex or Arena AI this task:

```text
Read AGENTS.md, the final preparation report, CORE_VISION.md,
UI_EXPECTATIONS.md, ART_DIRECTION.md and SAVE_IRONMAN.md.
Inspect existing files before editing. Implement only M1: a minimal TypeScript /
Vite mobile-first offline PWA shell with a title/navigation screen and a
separate developer-only read-only manifest diagnostics view. Use the existing
canonical counts and art manifests; do not duplicate or mutate game datasets.
Add pinned dependencies and a lockfile, actual install/dev/build/preview and
typecheck commands, and a documented offline lifecycle. Keep source archives
and pristine art out of the runtime cache. Make required shell assets available
after the first online installation and verify close/relaunch offline.
Test phone and Steam Deck/desktop widths and touch/keyboard navigation.
Run repository integrity, source reconciliation, tooling tests, typecheck,
build and browser offline/relaunch checks. Report the existing strict-content
blockers honestly. Do not implement battle, movement, capture, story simulation,
campaign saves or M2. Stop after the small shell milestone is reviewable.
```

Acceptance: shell builds from a fresh clone; no placeholder replacement of finished art; no gameplay state; diagnostics remain developer-facing; offline relaunch works; copy-and-paste commands and actual results are documented. Content blockers do not authorize guessed data or a claim of full game readiness.
