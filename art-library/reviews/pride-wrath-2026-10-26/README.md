# v0.90.41 artwork production

Generated with the built-in image tool, then cropped and normalized for live use. Reference images were inspected before editing. Existing historical character catalogue and recovered indexes were checked; these are the existing original species 506–509, with no new character IDs.

Prompt set:

- Pride: redesign Vainglulus as a magnificent formal black ink courtier with sweeping violet-lined tailcoat, high collar, white cravat, white gloves, brass details and watching shadow ribbons. Preserve the original tiny one-eyed Flaskling visibly inside an intact chest flask. Premium painted monster sprite, full body, transparent background.
- Wrath: redesign Wrathulus as a six-armed black/crimson ink swordsman with oversized ember-edged blades, spare swords, ragged crimson ribbons and tentacle-like ink hair. Original design informed by anime multi-sword fighters and ink creatures. Original Flaskling visibly pilots from its chest flask. Full body, transparent background.
- Sloth: preserve the mossy stone golem, hourglass, brass cuffs and tired pose; show the sleeping one-eyed Flaskling and tiny hands inside its chest flask rather than a gem.
- Gluttony: preserve the glass-bellied purple beast and green digestive void; show the original little Flaskling inside its own suspended flask within the belly.
- Followers: regular eight-column/four-row atlas, one species per row in the above order; down/down/up/up/left/left/right/right walk frames. Chibi top-down pixel rendering, separated transparent cells. Runtime sheets reorder directions to down/left/up/right. Corrected left-facing second frames for Pride, Wrath and Gluttony during normalization.
- Item cleanup: clean a four-by-four reference atlas of sixteen established item sprites, remove unrelated neighbouring fragments while retaining attached details, matching painted fantasy style and transparent isolated cells.
- New equipment: three-by-two atlas of a red duelling glove, silver/violet scholar pendant, blue-winged anklet, sapphire-riveted plate, amber shelter brooch and ruby siphon pendant. Transparent cutouts, no external glow or labels. Followed by an explicit background-extraction pass; alpha retained.
- Type eggs: six-by-three atlas covering Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel and Fairy in game order. Matching upright shell shape, type colours and embossed motifs, transparent cells. Crops use inset row bounds to exclude neighbouring egg tips.

`production.json` maps selected generated files to stable IDs and lists the cleaned icons. Full-resolution selected source art remains here; optimized 704px portraits, 64px follower frames, 128px item icons and 96×120px egg textures live in `dist/assets/`.
