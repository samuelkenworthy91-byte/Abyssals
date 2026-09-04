# Party Reserve

- Active party size: 6.
- Reserve: unlimited.
- Reserve access only through recurring Chaplain Aeric Solm in towns.
- Reserve healing is instant when accessed through the approved reserve interaction.
- Ordinary 0 HP is lethal/permanent death unless a starter life rule intercepts it.
- Reserves do not auto-deploy into an expeditionary wipe.

## Authority and structured data

Authority: Checklist 08; Checklist 12; Checklist 17. Pristine files are under `docs/source_archive/canon_sources/active/`; searchable lossless equivalents are under `data/reference/`. Apply [SUPERSESSIONS.md](SUPERSESSIONS.md) before using historical source wording.

Repository paths: `data/progression/core_rules.json`; `data/progression/locked_contracts.json`.

## Implementation contract and remaining boundary

Reserve access and free relearning occur through CHR-AERIC in towns. Do not add reserve access anywhere in the wild. Capture destination and party ownership changes must commit atomically; reserves do not auto-deploy on a wipe.
