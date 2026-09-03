> Phase C update: 187/187 canonical runtime fronts pass integrity and asset checks; all 15 tooling tests and source derivations pass. Portrait processing and complete dataset consolidation remain outstanding. See PHASE_C_RUNTIME_ART.md. The older report below is retained as a clearly superseded initial-import baseline.

> Phase A update: import integrity, recovered source checksums, source derivations and all 12 existing tooling tests pass. Strict runtime/content readiness remains incomplete pending B–F. The detailed report below is the historical initial-import baseline.

# Validation report — 2026-09-02

This records the actual local preparation checks. It is not a gameplay/build certificate.

| Check | Result | Evidence |
|---|---|---|
| npm run validate | PASS | 0 integrity errors; 16 explicit incomplete-source datasets |
| npm test | PASS | 12 tests: duplicate keys/IDs, bad refs, missing data, schema bounds, exact-colour preservation and safe geometry |
| npm run validate:sources | PASS | All 72 area values, original 16 core identities, 83 trainer/Warden names, state model and learnset rules match sources |
| Portrait package SHA256SUMS | PASS | All 96 listed original entries match |
| All imported member checksums | PASS | 234 source members plus 19 prior repository files preserved |
| Existing Git blob verification | PASS | All 19 pre-import files match main's original Git blob hashes |
| Art decoding/framing inspection | PASS for source preservation | All 180 images decoded; full source-set visual contact review performed |
| Portrait exact-background gate | BLOCKED | 0 of 91 clearable borders; 0 runtime outputs from --write |
| npm run validate:content | BLOCKED (exit 1) | 335 explicit completeness errors; report mode distinguishes this from integrity |
| Application build/device playtest | NOT RUN / NOT AVAILABLE | No application implemented; M1 defines this gate |

## Interpretation
Integrity passes mean the current import is internally consistent and honest about unavailable content. They do not establish complete species coverage or production-ready sprites/portraits. Species register, 98 evolution paths, 1,893 learnsets, full moves/types, 144 weighted encounter tables, trainer teams/classes, items/shops, story/map/dialogue and numeric field rules remain missing. Twenty-two current named portraits are absent; Nharos has no canonical game ID. See UNRESOLVED_ITEMS.md.

## Reproduce
With requirements-tools.txt installed in an activated virtual environment:
```bash
npm run validate
npm test
npm run validate:sources
python3 tools/art/process_portraits.py --report .reports/portrait_audit.json
npm run validate:content
```
JSON reports can be produced with --json-report on tools/validation/validate.py. CI runs integrity/tests/source reconciliation and posts full-content readiness explicitly. Manual workflow_dispatch additionally runs a strict full-content job that fails until its requirements are actually supplied. Source images and archives are never substituted with placeholders to pass.
