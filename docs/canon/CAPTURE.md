# Capture

Authority: supplied handoff v1.0 ACTIVE_CANON sections 7. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

- Capture is food-based, not ball-themed.
- Capture formula preserves the locked Gen III-style probability/shake foundation; food supplies the catch modifier.
- Presentation: thrown food, eating animation and a deterministic 0–100% closeness bar derived from the actual capture chance/RNG result. Success reaches 100%; failure stops below 100%.
- Capture outcomes cannot reroll after reload.

## Implementation boundary
Exact food modifiers, per-species catch rates and mapping from committed result to failure-bar endpoint are absent. Presentation consumes the committed random result; it never produces a second gameplay roll.
