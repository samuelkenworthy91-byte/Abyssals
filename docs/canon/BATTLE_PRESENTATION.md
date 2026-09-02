# Battle Presentation

Authority: supplied handoff v1.0 ACTIVE_CANON sections 6, 7. Original: ../source_archive/handoff_v1/docs/canon/. Current user import constraints supersede processing instructions.

- Gen III-style damage/capture foundations are retained where specified by the design workbooks/checklists.
- First-person Dragon Warrior Monsters-style player viewpoint.
- Player active Abyssal is not rendered; enemy/wild front sprite is visible.
- Existing 187 front-facing sprites are sufficient; no canonical 187 back-sprite set is required.
- Both sides show HP bars plus small exact current/max HP numbers.
- Player attacks use move/type VFX travelling from the foreground into the enemy.
- Enemy attacks do not require reverse-direction move VFX: use enemy front-sprite motion, foreground/screen impact, a small damage number and HP change.
- Simultaneous KOs are batched. Against mortal leaders, a mutual-death result still counts as player victory because allied army support controls the aftermath. Ordinary separate party wipes remain losses.

- Capture is food-based, not ball-themed.
- Capture formula preserves the locked Gen III-style probability/shake foundation; food supplies the catch modifier.
- Presentation: thrown food, eating animation and a deterministic 0–100% closeness bar derived from the actual capture chance/RNG result. Success reaches 100%; failure stops below 100%.
- Capture outcomes cannot reroll after reload.

## Implementation boundary
Evolution uses a flash/swap presentation only if confirmed by the original Checklist 16 on import; that detail is not explicit in this supplied active master. Existing front-facing art remains the production source. No player-side or back-sprite commission is required.
