# Abyssals test plan

## Deterministic unit tests
- Growth formula at low/average/high BST and >100% growth cases.
- 100-XP level boundaries and individual participant level-gap XP.
- Evolution promotion + future-growth reweighting without reroll.
- Move priority: Plain Dash/Frost Shard +1; others 0.
- Encounter table weights total exactly 100; levels remain authored.
- Resonator suppresses only the generated result and never rerolls to fish for a stronger result.

## Battle integration tests
- Ordinary lethal 0 HP -> permanent death.
- Multi-hit starter lethal -> one life decrement for the lethal action, not per hit.
- Pending starter 10% return prevents premature wipe classification.
- Starter return occurs after end-of-turn layers but before battle-end/wipe classification.
- Simultaneous KOs batched; leader mutual KO = player victory; ordinary party wipe = loss.
- Capture result/percentage cannot change after reload.

## Persistence/crash tests
Crash or force-close at every boundary before/after: capture commit, death commit, starter-life decrement, pending starter return, sacrifice selection commit, resurrection, evolution, move choice, item transfer, leader fate, chapter complete. Reload must produce exactly one canonical result.

## Story/state tests
- Fate cannot remain half-resolved after final confirmation.
- Samiel is the only early formal surrender leader.
- Executed leader remains historically EXECUTED after REVIVED.
- Five elective human-restoration uses; Pate/Trade consume only when chosen.
- Essential services remain available after either leader fate.

## Memorial tests
- First death sets pending; memorial appears on next Civeton revisit.
- Only current dead appear; resurrected entry disappears while history remains.
- Exactly 10 living, distinct species IDs required.
- Favourite/starter warning path still allows legal selection.
- Sacrifices never enter memorial.

## Device/e2e playtest
- Android phone portrait/landscape checks.
- Steam Deck browser/PWA controls and text readability.
- Desktop Chromium/Firefox baseline.
- Install PWA, go offline, launch, play, save, close, reopen offline.
- Background/foreground app transitions cannot duplicate transactions.
