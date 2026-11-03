# Ironman crash and recovery test contract

This is a future implementation gate; no production save adapter exists in this import. Tests must use isolated disposable slots, deterministic commands/RNG and controlled fault injection. A UI animation finishing is not durable acknowledgement.

## Boundary matrix
For every action below, interrupt before journal append, after append/before snapshot, after durable commit/before acknowledgement and during next-load recovery. Expected state must be either the last valid committed state or exactly one completed transaction according to the eventual locked protocol; never a half-state, duplicate or reroll.

| Transaction | Required invariant |
|---|---|
| Capture | Same roll/result after reload; food/ownership applied once |
| Ordinary death | Instance remains dead; held item returned once; memorial pending once |
| Starter loss/return | One decrement per lethal event; pending return persists; 10% return once before wipe |
| Sacrifice/resurrection | Ten living distinct species removed atomically; original target restored once; no sacrifice memorial entries |
| Evolution | Promotion, species/history and move offers persist without retroactive growth reroll |
| Move choice | Exactly one confirmed choice; declined evolution move remains relearnable |
| Item transfer/shop | Ownership and money are atomic; no duplicate item or free purchase |
| Leader fate | Confirmed fate persists; human current life remains separate from historical fate |
| Human restoration | Elective use consumed once; global five-use cap; revived execution history retained |
| Chapter/story completion | Monotonic authored progression; no replayed reward/service deadlock |

## Recovery and concurrency
- Three slots stay independent. Every slot has current snapshot, two hidden recovery generations and journal.
- Corrupt current snapshot, each backup and journal tail in isolated fixtures; recover the highest valid state automatically, never present backup selection.
- Repeat the same transaction ID and replay command journal; effects apply once with monotonic commit_seq.
- Open two browser tabs/PWA windows; single-writer locking prevents conflicting commits. Verify lifecycle/reacquisition after owner closes.
- Inject storage/quota/write failure; pause/retry safely and never acknowledge durability early.
- Interrupt each forward migration stage; preserve valid pre-migration protection, never downgrade or undo canonical losses.
- Save Now / Save & Quit must not create a player rollback point.
- Reload encounters, capture, growth and story outcomes repeatedly; no rerolls.
- Technical soft-lock recovery may relocate only. Legitimately ended/protagonist-dead runs remain ended.

## Evidence and release gate
Record input save hash, seed, command/transaction ID, injected boundary, output hash, commit_seq and semantic assertions. Exact binary hashes alone are insufficient if timestamps/noncanonical metadata differ. No campaign feature involving irreversible state ships until its row and recovery/concurrency tests pass and the implementation receives independent review.
