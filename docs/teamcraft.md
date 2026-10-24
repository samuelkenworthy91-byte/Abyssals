# v0.90.30 — Teamcraft

Implemented from the approved move-pool review pinned to e7c7dbd, with the follow-up Fighting/Dark/Psychic release names and individual retained-move choreography.

- 551 runtime moves: 569 original, 32 redirects, 10 utility/weather/disruption moves, one fixed-category mercy split and three starter-type releases. Eight direct recovery moves remain at 3–5 PP. Renames freeze existing contact/sound behaviour before names change.
- Full Release (Fighting, Physical), Latent Power (Dark, Physical), Mind Unbound (Psychic, Special): 60 power, five PP, one 10% bundled five-stat boost. No HP, Accuracy or Evasion boost. Codices are shared by compatible type; starter families learn their primary-type version at level 28.
- Holdfast, Effigy Exchange and Standard Relay are codex-only, available repeatedly through Walter's technique shop and early-route caches. Protection decays with consecutive attempts. A decoy costs 25% max HP, absorbs each direct strike independently, and is bypassed by sound. Voluntary handoff carries five positive/negative combat stages; relay fatigue prevents immediate chaining. Standard Relay passes no decoy.
- Weather and support reworks use the common battle resolver. Ordinary Chorus heals active allies; Chorus of Tides retains limited bench healing. Partner-targeted support opens a recipient selector before spending the action.
- Ten ability-definition reworks preserve the 143-definition glossary. Fortune Thread raises tagged optional secondary rates; Sage Mind trades tagged special-move benefits for 30% power and keeps costs; Native Force replaces 1.5× STAB with 1.8×. False Front is once per battle, not per switch. Weather abilities support partners rather than patching every personal weakness.
- Endurance Tonics at the Growth Apothecary permanently add maximum PP to an individual move. Cost is 1,000 × total invested doses squared; bulk quote is confirmed transactionally. No current-PP refill. UID/move-ID bonuses survive forgetting, evolution, storage, trade and reload. Alias merges preserve the larger bonus and do not sum duplicate investments.
- Every retained move has a deterministic score layered over the existing pixel-art atlases. Dedicated signature/armoury art is retained. Choreography varies travel, silhouette, timing, particle paths and impact without consuming combat RNG. New decoy/protection state remains visible in HUDs.

## Compatibility

Stable IDs for renamed moves. Retired ordinary/healing IDs are redirected in learnsets, shop inventories, rewards and restored save slots. Duplicate slots are released without deleting the creature or its progress; Walter's existing free relearn service can fill them. Save package, permanent death, original lives, encounter uniqueness, world quests and signing identity are retained. APK packaging includes only dist.

## Verification

Targeted engine tests cover protection decay, decoy absorption/transfer, five-stat relay and fatigue, False Front persistence, proc rules, STAB, all-stat bundles and investment-preserving aliases. Existing tests are updated only where the approved consolidation or active-only healing changes their contract. Offline module coverage and full JavaScript syntax are checked before GitHub Actions builds/signs. Phone visual/battle checks run in the release workflow.
