# Battle System

- Gen III-style damage/capture foundations are retained where specified by the design workbooks/checklists.
- First-person Dragon Warrior Monsters-style player viewpoint.
- Player active Abyssal is not rendered; enemy/wild front sprite is visible.
- Existing 187 front-facing sprites are sufficient; no canonical 187 back-sprite set is required.
- Both sides show HP bars plus small exact current/max HP numbers.
- Player attacks use move/type VFX travelling from the foreground into the enemy.
- Enemy attacks do not require reverse-direction move VFX: use enemy front-sprite motion, foreground/screen impact, a small damage number and HP change.
- Simultaneous KOs are batched. After pending starter-life resolution, mutual final KO with living reserve is player victory and requires rebuilding through Aeric; total wipe/leader aftermath follows Checklists 09 and 13.

## Authority and structured data

Authority: Checklists 13–16, with Checklist 09 fate overlays. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/battles/battles.json`; `data/battles/modes.json`; `data/progression/core_rules.json`; `data/save_schema/contracts.json`.

## Implementation contract and remaining boundary

Ninety-three fixed battle records and six battle modes are indexed. Replacement style is SET. Residual order is field, persistent status, held sustain, other authored effects, cleanup. Resolve non-final starter returns before wipe classification. Exact versioned core numeric bindings, Illyr/Nharos phases, Mirra illusion timings and tutorial dummy stats remain listed in ../audit/UNRESOLVED_ITEMS.md. Gen III-style is a foundation, not permission to import unapproved defaults.
