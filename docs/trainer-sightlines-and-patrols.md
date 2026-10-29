# Trainer sight lines and patrols — pending patch

## Problem addressed
Only authored patrol spots were registered as trainer actors; stationary trainers remained ordinary interaction markers and could not notice the player.

## Revised field behaviour
- Every visible `TRN-` spot with a corresponding battle roster entry is represented by an independent field trainer actor, whether stationary or moving. Civilian NPCs, leaders with their own interactions, and non-battle markers are excluded.
- A trainer spots the player within six tiles along a clear cardinal sight line. Terrain, props, other actors and closed fort gates block vision; diagonal positions do not count.
- An explicit facing restricts vision to that direction. Stationary trainers without authored facing scan unobstructed cardinal corridors and turn towards the player. Their idle facing also cycles visually. Patrolling trainers look in their actual movement direction.
- Existing authored patrol paths are preserved. Roughly one third of ordinary route trainers without a custom route gain deterministic short rectangular or back-and-forth loops when nearby traversable tiles permit; the rest remain stationary.
- Generated loops stay on walkable tiles, do not cross blocked terrain or map gates, and retry occupied waypoints. Trainers will not step onto the player or another character.
- Previously defeated trainers, trainers standing down in the current area, tutorial-gated encounters and nonlethal sparring trainers do not auto-challenge. Fort progression, Botrune sequence and finale flags are honoured. Story-driven Darius and other scripted NPC confrontations remain manual.
- Uses the existing trainer dialogue and battle-start flow, without changing battle teams, trainer rewards, saves or APK release data.

## Validation
`node tests/trainer-sightlines.test.mjs` covers static vision, explicit facing, occlusion, range, gating, defeat states, authored patrols and safe generated patrols. The dedicated patch checks workflow runs on this branch without packaging an APK.
