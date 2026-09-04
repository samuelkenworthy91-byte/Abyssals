# ABYSSALS — CODING HANDOFF v1.0

This repository seed is the current implementation handoff for **Abyssals**, the original monster-capture RPG designed in the Abyssals project conversations.

## Read order for any coding agent
1. `AGENTS.md`
2. `CONTEXT.md`
3. `docs/canon/ACTIVE_CANON.md`
4. `docs/canon/CHECKLIST_INDEX.md`
5. The relevant files under `data/canon/` and `schemas/`
6. `docs/dev/IMPLEMENTATION_ROADMAP.md`

The rule is simple: **implement locked canon; do not silently redesign it.** Where an older source conflicts with a newer explicit lock, the newer lock in `docs/canon/SUPERSESSIONS.md` wins.

## What this package contains
- A machine-readable/current-canon layer for Arena AI, Codex and other coding agents.
- A consolidated canon master and 17-checklist implementation index.
- JSON data for the core rules, cast, locations, state model, art direction and encounter-area summary.
- JSON Schemas/templates for later bulk imports of species, learnsets, trainers and encounters.
- Deterministic validation and portrait-cleanup utilities.
- A coding roadmap, test plan, agent handoff prompts and GitHub CI seed.
- A source-material inventory recording the original artifacts created in prior conversations.

## Important source-file limitation
The original ChatGPT File Library binaries (including the 187 finished species images, full DOCX checklist files and the full encounter workbook) are not exposed to this execution environment as downloadable filesystem bytes. They therefore cannot be physically embedded in this ZIP. This handoff converts the retrievable/current design into repo-native text/data and includes exact drop locations plus a source inventory so those originals can be added without changing structure.

`docs/source_material/ORIGINAL_SOURCE_INVENTORY.md` lists the known originals and their required destinations.
