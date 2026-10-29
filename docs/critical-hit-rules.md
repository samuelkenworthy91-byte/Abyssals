# Critical-hit rules (pending patch)

Critical-hit chance uses the **effective battle Speed** of attacker and target (the same speed-stage, held-item, paralysis, weather-ability and Tailwind multipliers used for turn order). The positive Speed differential adds 6.25 percentage points for each extra multiple of the target's effective Speed. Slower attackers receive no differential bonus. The existing critical-hit stage bonuses apply, and ordinary critical chance remains capped at 50%. Guaranteed-critical moves and critical-immunity effects retain their existing special rules.

Normal high-critical move: base critical chance 12.5%, plus Speed differential, capped at 50%. At base speeds 65 versus 35 this is approximately 17.86%; at +6 Speed on the attacker (versus +0 Speed target), it reaches the 50% cap.

A critical strike still deals 2x critical damage. It **only bypasses positive Defence or Special Defence stages on the target**, as appropriate to the move category. Negative target defensive stages remain beneficial for damage. The attacking unit's **positive and negative** Attack or Special Attack stages are both honoured, including attack debuffs. Held stat modifiers, status conditions such as burn and Frostbite, weather, screens, type effectiveness and other existing damage modifiers remain in force.

This patch modifies battle logic and tests only; it does not change the release configuration or create an APK.