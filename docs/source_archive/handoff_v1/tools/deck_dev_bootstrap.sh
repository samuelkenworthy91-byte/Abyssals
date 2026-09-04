#!/usr/bin/env bash
set -Eeuo pipefail
PROJECT_DIR="${1:-$HOME/Projects/Abyssals}"
mkdir -p "$PROJECT_DIR"
printf 'Abyssals coding handoff bootstrap\nProject: %s\n' "$PROJECT_DIR"
command -v git >/dev/null || { echo 'git is required'; exit 1; }
command -v node >/dev/null || { echo 'Node 22+ is required'; exit 1; }
command -v python3 >/dev/null || { echo 'Python 3 is required'; exit 1; }
if [[ ! -d "$PROJECT_DIR/.git" ]]; then git -C "$PROJECT_DIR" init -b main; fi
python3 -m venv "$PROJECT_DIR/.venv-tools" 2>/dev/null || true
"$PROJECT_DIR/.venv-tools/bin/python" -m pip install -q --upgrade pip pillow numpy jsonschema 2>/dev/null || true
echo 'Environment baseline ready. Copy the handoff contents into the project root and run tools/validate_project.py.'
