# First implementation task — M1 offline application shell

The repository preparation is usable now. Full content acquisition remains an explicit M0 dependency, but M1 can proceed without guessing game data. Use the same task in Codex or Arena AI.

## Deliverable
Minimal TypeScript/Vite mobile-first PWA shell: title screen, install/offline lifecycle and development diagnostics based on data/manifests/import_status.json and datasets.json. No playable campaign, gameplay placeholders or save format yet. Keep source art and archived documents out of the service-worker cache.

## Required steps
1. Read AGENTS.md, the canon index, CORE_VISION.md, UI_EXPECTATIONS.md and UNRESOLVED_ITEMS.md.
2. Inspect package.json, current validation tools/tests and src/README.md.
3. Add only app entry/UI/service worker/manifest and required configuration; choose maintained versions, pin and lock them.
4. Retain integrity and strict-content commands. Never make a partial dataset look complete to satisfy CI.
5. Add meaningful shell startup, unavailable-content and offline restart tests.
6. Run validation/tests/typecheck/build; manually check phone, desktop and Steam Deck browser sizes and controls.
7. Update BUILD_AND_RUN.md with actual working commands and report exact blockers and next task.

## Acceptance
A fresh clone installs and builds. The installed shell reopens offline and presents honest source availability. Touch and keyboard navigation work without clipped content. No irreversible game transaction or invented entity is introduced. Strict content validation still fails for known source/asset gaps until separately resolved.

## Copy/paste task
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
