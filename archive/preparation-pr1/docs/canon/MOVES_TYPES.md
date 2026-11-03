# Moves Types

Authority: supplied handoff v1.0 ACTIVE_CANON sections 5. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

- Every move is explicitly Physical, Special or Status.
- Accuracy values are authored, normally using 100/95/90 bands. Self/side/field status moves use `ALWAYS` rather than a fake hit roll.
- Only **Plain Dash** and **Frost Shard** have +1 priority; all other currently validated moves have priority 0.
- Targeting uses an explicit target enum.
- Signature moves are exclusive to their evolutionary family.
- Aeric provides free relearning whenever normal reserve access is available.
- Evolution preserves the current four moves and separately offers any explicit evolution move; it may not silently overwrite a move.
- Passed/declined evolution moves enter the relearner pool.
- Story-choice branch history prevents opposite-branch move leakage/relearning before the postgame branch unlock.

## Implementation boundary
The complete move/type charts, target enum and 1,893 learnset records are absent. The two priority exceptions are known by name only; do not invent their IDs, power or PP.
