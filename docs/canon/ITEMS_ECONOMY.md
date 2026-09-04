# Items Economy

- Starting money: 2,000.
- Wild battles award no money and there is no routine monster-material crafting grind.
- Ordinary purchasable items sell for 50% of shop price, rounded down; sell-only treasure uses listed value.
- No resurrection consumable.
- Capture foods, healing/status/PP consumables, held items and authored evolution items form the core economy.
- Resonator replaces purchasable Repel: when enabled, suppress a generated wild encounter if generated wild level is at least five levels below the first living party Abyssal; do not reroll repeatedly seeking a stronger result.
- Cybressa's **The Proven Grounds** pays Trial Marks for repeatable deterministic procedural contracts.
- Trial Marks buy temporary **+20 percentage-point stat-growth** effects lasting 1–5 future level-ups.
- Up to **five active training effects per Abyssal**, freely stacked on one stat or split.

## Authority and structured data

Authority: Checklist 06; Progression v3. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/items/items.json`; `data/shops/shops.json`; `data/shops/threshold_stock.json`; `data/progression/trial_contracts.json`; `data/progression/core_rules.json`.

## Implementation contract and remaining boundary

102 items, 12 shops, one Hell-threshold stock contract and five Trial Contract ranks are extracted with prices, currencies, conditional food modifiers, stock unlocks and rewards. Ordinary stacks cap at 999; held/evolution stacks at 99. Training uses five instance slots, +20 percentage points per effect, 1–5 future levels, stacking permitted; tick duration after growth, retain across evolution, do not use at cap. Source-approved tuning and procedural implementation choices must remain distinct from fixed canon.
