# Playtest plan

No gameplay playtests can run on this preparation branch. Begin shell checks at M1; use disposable deterministic fixtures until durable Ironman M9 passes. Track pass/fail/blocked, commit, seed, device and evidence for every check. Never count blocked checks as passed.

| Pass | Start | Scope | Exit evidence |
|---|---|---|---|
| Repository | M0 | Schemas, all IDs/references, immutable sources, manifest paths/counts | npm validation and test reports |
| Shell/device | M1 | Touch/keyboard layout, installation, offline relaunch | Phone/Deck/desktop screenshots and lifecycle results |
| Core mechanics | M4–M10 fixtures | Battle, seeded growth, capture, permadeath, lives, reserve, memorial, shops | Known seed/command result and state assertions |
| Ironman abuse | M9 onward | Every irreversible boundary, crash/reload, single writer, corruption | IRONMAN_TESTING.md matrix |
| Mortal progression | M12 | Fresh-slot critical path and optional branches | Route log, levels, resources, deaths, blockers |
| Hell/postgame | M13 | Nine Circles, native fields, rematches, branch unlocks, restoration | Story/field/state coverage |
| Presentation | M14 | Front art, exact HP, capture bar, props, scale, VFX, audio | Approved side-by-side source/runtime checks |
| Release campaign | M15 | Complete fresh campaigns, balance and offline devices | No open critical saves/soft-locks; content gate green |

## Core check sequence
1. Load a fresh disposable fixture; record seed and individual/species IDs.
2. Attack/switch/use items and confirm exact HP/PP/state match displays.
3. Capture; repeat reload at boundaries and confirm the committed result is identical.
4. Ordinary 0 HP dies; starter 3→2→1 returns end-of-round; 1→0 dies; multi-hit does not spend multiple lives.
5. Ordinary mutual final KO is a loss; mortal-leader mutual KO follows player-victory aftermath.
6. First death sets memorial pending; next Civeton revisit establishes it exactly once.
7. Resurrect with ten distinct living reserve species; reject duplicates; return held items once; sacrifices never become memorial entries.
8. Access reserve/relearner only via Aeric; verify party six and unlimited reserve.
9. Verify area/phase composition, authored level ranges, safe-area suppression and Resonator no-reroll.
10. Resolve leaders in separate runs/fixtures; only Samiel formal early surrender; essential services remain accessible.
11. Spend five elective human restorations with Pate/Trade included and excluded; historical execution persists after revival.

## Device coverage
Android phone portrait/landscape, Steam Deck browser/PWA and desktop Chromium/Firefox. Check long sessions, background/foreground, resize, storage pressure and offline relaunch. Record actual supported browser versions per build rather than asserting compatibility without testing.
