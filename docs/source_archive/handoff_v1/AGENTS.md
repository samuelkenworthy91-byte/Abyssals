# Abyssals — non-negotiable development instructions

## Authority
- `docs/canon/ACTIVE_CANON.md` and explicitly LOCKED rules are authoritative.
- `docs/canon/SUPERSESSIONS.md` wins over older wording.
- Coding agents implement canon; they do **not** silently simplify, rebalance or replace it.
- If code and canon conflict, report the conflict before altering canon-facing behaviour.

## Product target
- Mobile-first, offline-capable PWA; desktop browser compatible.
- Four-direction overworld movement only; no diagonal movement.
- Data-driven content for species, moves, trainers, encounters, items, evolutions and story flags.
- First-person Dragon Warrior Monsters-style battle presentation: visible enemy/wild Abyssal; player active is not rendered.

## High-risk systems
For Ironman persistence, permanent death, starter lives, capture RNG, story fate, resurrection and battle-end resolution:
1. make the smallest coherent implementation,
2. write deterministic transaction/crash/reload tests,
3. run an independent second-agent review before acceptance.

## Persistence rules
- No reload rerolls for deterministic/irreversible results.
- Irreversible state writes are transactional and crash-safe.
- Three independent campaign slots; one authoritative current state plus two hidden recovery generations and a journal per slot.
- Never create a player-selectable rollback point.

## Asset rules
- Raw generation: `assets/generated/`.
- Reviewed, cleaned, correctly named and uniformly processed assets only: `assets/production/`.
- Species front sprites are already complete in the project source set: do not commission canonical back sprites.
- Character portraits use solid `#FF00FF` source backgrounds before deterministic transparency cleanup.
- Do not invent final portrait canvas dimensions; use the processing utility once the production canvas is approved.

## Completion rule
Do not claim completion until relevant unit/integration/e2e tests and the production build have run, or state exactly what could not be run.
