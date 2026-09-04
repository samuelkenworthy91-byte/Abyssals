#!/usr/bin/env bash
# Install preparation tooling only; never start M1 or modify game content.
set -euo pipefail

abyssals_repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
abyssals_python="${ABYSSALS_PYTHON:-python3}"

if ! command -v "$abyssals_python" >/dev/null 2>&1; then
  printf 'Python 3.12+ is required. Install it in your development environment, then retry.\n' >&2
  exit 1
fi

"$abyssals_python" -c 'import sys; sys.exit("Python 3.12+ is required.") if sys.version_info < (3, 12) else None'

if [[ ! -x "$abyssals_repo_dir/.venv/bin/python" ]]; then
  "$abyssals_python" -m venv "$abyssals_repo_dir/.venv"
fi

"$abyssals_repo_dir/.venv/bin/python" -c 'import sys; sys.exit("Existing .venv uses an older Python. Recreate the tooling environment with Python 3.12+.") if sys.version_info < (3, 12) else None'
"$abyssals_repo_dir/.venv/bin/python" -m pip --disable-pip-version-check install -r "$abyssals_repo_dir/requirements-tools.txt"
"$abyssals_repo_dir/.venv/bin/python" -m pip check

cat <<'INSTRUCTIONS'
Preparation tooling installed. From the repository root:

  source .venv/bin/activate
  python tools/validation/validate.py
  python tools/data/verify_derivations.py
  python tools/validation/reconcile_sources.py
  python -m unittest discover -s tests/unit -v
  python tools/validation/validate.py --content

The strict content command currently reports the documented unresolved items
and exits nonzero. Setup success does not clear that gate.
M1 and merging remain on hold for owner review.
INSTRUCTIONS
