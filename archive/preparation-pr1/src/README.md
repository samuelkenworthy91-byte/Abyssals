# Future implementation boundaries
There is no gameplay implementation in this import. Create modules only as a milestone needs them:

| Path | Responsibility | First milestone |
|---|---|---|
| app/ | PWA entry, lifecycle, routing | M1 |
| data/ | Validated loaders; reject unavailable content | M2 |
| state/, entities/ | Domain state and stable individual/entity IDs | M2 |
| world/ | Grid, screen exits, encounters | M3/M6 |
| battle/ | Pure commands, RNG/events, batched resolution | M4 |
| systems/ | Growth, capture, reserve, economy, story | M5 onward |
| save/ | Durable transactions, journals, single-writer adapter | M2 interface; M9 full gate |
| game/ | Orchestration; no rules hidden in UI | M2 onward |
| ui/ | Touch/browser presentation consuming committed state | M1 onward |

Irreversible mechanics cannot ship as playable campaign features before M9. Early fixtures use disposable test state isolated from campaign saves.
