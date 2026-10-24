# v0.90.29 — Expedition choices

Partner lists combine party/reserve location, two order-independent type requirements, search, and evolution depth. Base form precedes evolution; first evolution is after one step; second after two. Single-stage species have their own option.

Every successful ordinary, fishing, unique or rescue-double capture is saved in reserves pending a mandatory destination choice before reward cards. Keeping preserves battle HP; reserves restore HP/PP and clear conditions. Full parties can only send to reserves. Reload retains the choice without duplicate creatures or rewards.

Five fort wild tables and salvage teams use 30 separate evolution families. Only Rimebun crosses floors. Direct floor tables prevent general biome additions from reintroducing overlaps. Levels rise 12–16, 22–28, 34–40, 46–52, 56–60; average non-Rimebun species BST rises each floor. Rimebun stays exactly 3%, 3%, 3%, 5%, 5%. Unique quest guardians retain existing progress rules.

Opening a general store permanently records its native supplies; all general stores sell that union, including Trail Bread. Specialist counters, relic cores and Grand Exchange stock are separate. Existing discounts and winter recipe rules remain. Older saves migrate previously visited settlements once; new unlocks track store access.

Validation: expedition-choices.test.mjs covers filters, branch depth, capture choices/reload, stock isolation, both phases of all final fort tables and ascending power. expedition-choices-browser.cjs exercises real captures, reload and phone menus in Chromium. The full collection audit still finds every eligible species obtainable before leader eight. GitHub Actions runs both new checks and retains screenshots before building and signing the APK.
