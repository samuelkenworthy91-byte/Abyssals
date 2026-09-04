# Build and run — Steam Deck/Linux

## Current status
This branch contains preparation, data and validation tooling. **There is no playable game, app entry point or production game build yet.** npm run validate and npm test work after tooling setup. M1 will add dev/build/preview commands and the offline PWA only after explicit owner release from Phase H. Do not run archived seed scripts as current instructions.

## 1. Clone and select the preparation branch
In Steam Deck Desktop Mode, open Konsole. Use a writable home-directory project folder. Git and Python 3.12+ are needed for tooling. Node is optional for this preparation pass; the npm commands below are wrappers around Python. Node 22 is the inherited recommended application baseline for later M1 work. If using a development container/Distrobox, run these commands inside that environment; do not modify SteamOS system partitions.
```bash
mkdir -p ~/Projects
cd ~/Projects
git clone https://github.com/samuelkenworthy91-byte/Abyssals.git
cd Abyssals
git switch handoff/structured-import
```
After the PR is merged, use main instead. Ordinary Git retrieves all current assets; Git LFS is not configured or required.

## 2. Install the isolated Python tool environment
```bash
bash scripts/setup.sh
source .venv/bin/activate
```
The script installs only the pinned preparation dependencies in `.venv`, checks dependency consistency and can be rerun. It does not install system packages, change game data or start the application. To select another Python executable, use `ABYSSALS_PYTHON=python3.12 bash scripts/setup.sh`.

Re-run `source .venv/bin/activate` in each new terminal. If Python venv or Git is missing, install it in your Linux development environment before continuing. package.json currently wraps Python commands and has no third-party JavaScript dependencies.

## 3. Validate the import
```bash
npm run validate
npm run validate:sources
npm run validate:reconcile
npm test
```
Integrity and complete source reconciliation should pass. The 24 tooling tests check validation, deterministic extraction and art processing; they are not gameplay tests.

Without Node/npm, use these equivalent commands with `.venv` active:

```bash
python tools/validation/validate.py
python tools/data/verify_derivations.py
python tools/validation/reconcile_sources.py
python -m unittest discover -s tests/unit -v
```

## 4. Check full-content readiness
```bash
npm run validate:content
```

Without npm: `python tools/validation/validate.py --content`.
This exits nonzero for the exact field questions and 22 missing portraits listed in docs/audit/UNRESOLVED_ITEMS.md. The 187 species, 98 paths, 354 moves, 1,893 learnsets, 144 encounter tables and 266 active runtime images are extracted/present. Do not suppress the gate or add guessed entries. Phase H owner review must release the implementation hold.

## 5. Await owner review
Only after explicit owner release, give the agent docs/implementation/FIRST_CODEX_TASK.md. M1 must add and verify real commands for install, dev, build, preview and browser tests. Until then, npm run dev/npm run build are intentionally not advertised as available.

## After M1 and later playable milestones
Use the agent's updated actual commands; test the locally built app before deployment. Install PWA from the browser, close it, disable networking, relaunch and check all required assets load. On Deck, verify both touch and assigned keyboard/controller input in Desktop Mode. Record commit SHA (`git rev-parse HEAD`), browser/device and test results. Do not treat browser Back/reload or recovery backups as game rollback features.
