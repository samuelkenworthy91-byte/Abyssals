# Abyssals

A story-led monster-capture RPG for a mobile-first offline PWA and desktop browsers, including Steam Deck/Linux. Explore the mortal crusade route, capture with food, develop a six-member party, make irreversible choices, then descend through nine Circles of Hell.

**Repository preparation: Phase H — owner review. No playable application exists. Do not start M1, implement gameplay or merge PR #1 yet.**

Repository tooling setup is complete. From a fresh clone, run `bash scripts/setup.sh`, then `source .venv/bin/activate`. Python-only validation is available without Node/npm; see the Linux/Deck setup guide below. Setup completion does not resolve the remaining game-content blockers.

The accepted A–C baseline is preserved. All 187 species now have individual canonical runtime front sprites. All 78 supplied canonical portraits plus one variant are processed and visually reviewed; 22 targets remain genuinely absent. All 35 recovered detailed references are preserved and extracted. Of 33 registered datasets, 24 are complete for supplied source and nine have exact unresolved fields.

Read [AGENTS.md](AGENTS.md), [canon authority](docs/canon/README.md), the [final preparation report](docs/audit/FINAL_PREPARATION_REPORT.md), and [remaining questions](docs/audit/UNRESOLVED_ITEMS.md). The [roadmap](docs/implementation/IMPLEMENTATION_ROADMAP.md) defines incremental M0–M15 work. The [first coding task](docs/implementation/FIRST_CODEX_TASK.md) remains conditional on explicit owner release.

With the Python tooling environment active (see [Linux/Deck setup](docs/playtesting/BUILD_AND_RUN.md)):

```bash
npm run validate
npm run validate:sources
npm run validate:reconcile
npm test
npm run validate:content
```

Integrity, source reconciliation and 24 tooling tests pass. The final command remains blocked by documented content questions and missing assets; a green integrity CI badge does not mean full-content readiness. Do not weaken the strict gate.

| Path | Purpose |
|---|---|
| docs/canon/ | Concise implementation rules and precedence |
| docs/source_archive/ | Pristine evidence; superseded material is non-authoritative |
| data/ | Stable entities, source-backed contracts, explicit partial fields |
| data/reference/ | Lossless searchable extraction of all 35 detailed references |
| data/manifests/ and data/schemas/ | Inventory, provenance, asset coverage, readiness and validation |
| assets/abyssals/source/ → runtime/ | 89 pristine sheets → 187 individual fronts |
| assets/portraits/source/ → runtime/ | 91 pristine images → 78 canonical + 1 variant |
| tools/ and tests/ | Reproducible imports, art processing and preparation checks |
| docs/implementation/ and docs/playtesting/ | Milestones, setup, QA and Ironman plans |
| src/README.md | Future module boundaries; no gameplay scaffold |

Ordinary Git retrieves all current assets; LFS is not required for this snapshot. See [asset storage](docs/art/ASSET_STORAGE.md). No generated archives or processing previews belong in the repository.
