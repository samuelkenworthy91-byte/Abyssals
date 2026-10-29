"""Audit the 50% move-animation milestone without counting plans as artwork.

Prepared artwork requires actual source and packed PNG files matching the saved
SHA-256 digests. Installation and artistic approval are separate phases.
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "art-library/action-vfx"
TOTAL = 614
GOAL = 307

def load(path):
    return json.loads((ROOT / path).read_text())

def verified_prepared(move):
    path = ROOT / move.get("prepared", "")
    source = ROOT / move.get("source", "")
    if not path.is_file() or not source.is_file():
        return False
    if not move.get("preparedSha256") or not move.get("sourceSha256"):
        return False
    return (hashlib.sha256(path.read_bytes()).hexdigest() == move["preparedSha256"]
            and hashlib.sha256(source.read_bytes()).hexdigest() == move["sourceSha256"]
            and move.get("structuralValidation", {}).get("frames") == 16
            and move["structuralValidation"].get("uniqueFrames", 0) >= 12)

def run():
    target = load("art-library/action-vfx/target-50-percent.json")
    assert target["target"] == GOAL and target["total"] == TOTAL
    installed = json.loads((ROOT / "dist/action-vfx-data.js").read_text().split("export const ACTION_ART=", 1)[1].strip().rstrip(";"))
    installed_ids = {int(i) for i in installed}
    assert len(installed_ids) == len(installed), "Duplicate installed move IDs"
    batch08 = load("art-library/action-vfx/batch-08/prepared-manifest.json")["moves"]
    batch09 = load("art-library/action-vfx/batch-09/prepared-manifest.json")["moves"]
    old_pending = {m["id"] for m in batch08 + batch09}
    assert len(old_pending) == len(batch08) + len(batch09), "Duplicate prepared IDs"
    assert len(batch08) == 21 and len(batch09) == 17, "Recovery stock changed"
    assert not old_pending.intersection(installed_ids) or all(
        int(i) in installed_ids for i in old_pending.intersection(installed_ids)
    )
    target_ids = {m["id"] for m in target["moves"]}
    assert len(target_ids) == len(target["moves"]) == 153, "Target inventory changed"
    assert {m["id"] for m in batch09}.issubset(target_ids)
    planned = {}
    for n in range(10, 16):
        p = ART / f"batch-{n}/production-plan.json"
        entries = json.loads(p.read_text())["moves"]
        for m in entries:
            i = m["id"]
            assert i not in planned, f"Duplicate production plan: {i}"
            assert m["name"] and m["sequence"] and m["prompt"], f"Missing art direction: {i}"
            assert len(m["sequence"]) >= 120, f"Insufficiently distinct storyboard: {i}"
            assert m["batch"] == f"{n:02d}", f"Incorrect batch assignment: {i}"
            assert str(i) in m["prompt"] and m["name"] in m["prompt"], f"Wrong prompt: {i}"
            planned[i] = m
    assert set(planned).isdisjoint({m["id"] for m in batch09}), "Regeneration risk"
    assert set(planned) | {m["id"] for m in batch09} == target_ids, "50% production gaps"
    assert len(planned) == 136, "Unexpected number of remaining moves"
    verified = set()
    for n in range(8, 16):
        path = ART / f"batch-{n}/prepared-manifest.json"
        if not path.is_file():
            continue
        manifest = json.loads(path.read_text())
        for m in manifest["moves"]:
            if verified_prepared(m):
                verified.add(m["id"])
            else:
                raise ValueError(f"Saved artwork missing, corrupt or unverified: {m['id']}")
    actual_authored = installed_ids | verified
    assert len(actual_authored) <= TOTAL and len(actual_authored) <= GOAL
    missing_to_goal = GOAL - len(actual_authored)
    report = {
        "total": TOTAL, "halfwayTarget": GOAL,
        "installed": len(installed_ids), "preparedVerified": len(verified - installed_ids),
        "authoredOrInstalledUnique": len(actual_authored),
        "authoredPercentage": round(len(actual_authored) * 100 / TOTAL, 2),
        "plannedNotProduced": len(set(planned) - actual_authored),
        "neededFor50Percent": missing_to_goal,
        "milestoneReached": missing_to_goal == 0,
        "approval": "NOT inferred from prepared files or plans"
    }
    print(json.dumps(report, indent=2))
    return report

if __name__ == "__main__":
    run()
