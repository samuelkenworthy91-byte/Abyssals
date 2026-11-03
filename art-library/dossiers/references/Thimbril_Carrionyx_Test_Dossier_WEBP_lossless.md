THIMBRIL & CARRIONYX — WORK DOSSIER
Test package format for future Abyssal dossiersUse alongside the included concept sheet image: thimbril_carrionyx_concept_sheet.png
1. Package contents
Image reference: thimbril_carrionyx_concept_sheet.png
This document: thimbril_carrionyx_work_dossier.docx
The image is the visual approval reference. This document is the implementation and production brief for Work.
2. Family overview
This is a two-stage Abyssal line built around a strong visual contrast. The base form is one of the world's smallest bats: tiny, cute and stealthy. The evolution becomes a huge, flightless, undead-looking predator with ragged dragging wings, a gaunt body, and a snake-like striking head. The final form should look starved, unhealthy and eerie rather than muscular or heroic.
3. Core identity
Species
Thimbril
Carrionyx
Dex / provisional ID
#520
#521
Stage
Base
Final
Types
Flying / Dark
Dark / Poison
Role
Fast early nuisance / chip attacker
Slow bulky predator / poison-synergy finisher
Evolution
Evolves at level 32
Final stage
Theme
Whisper bat / tiny night scout
Fallen maw / grounded plague bat
4. Visual brief
Thimbril visual notes
Extremely cute silhouette. Very small body, oversized ears, large violet eyes, tiny fangs, soft chest fluff.
Colour direction: charcoal-purple fur with pink inner ears and wing membranes.
Pose should read as alert and endearing. It should feel tiny enough that the evolution is shocking.
Battle art should match the current Abyssals illustrated style in the repo: clean linework, smooth painterly shading, transparent background, readable silhouette.
Follower sheet should emphasise fluttery, slightly nervous movement. It should feel light and quick.
Carrionyx visual notes
Keep the approved skeletal look. Make it skinny, gaunt and almost zombie-like. It must not look healthy or too well-fed.
Key anatomy: long striking neck, snake-like bat head, exposed rib feeling, thin forearms, huge claws, ruined wing membranes dragging across the ground.
The wings should feel like decayed cloaks or torn flesh-canvases. It should clearly no longer be capable of flight.
Colour direction: bruised purple, dark charcoal, diseased pinks, poison-green saliva or venom drips.
Follower sheet should feel heavy and dragging, with wing tips trailing and a predatory craning neck.
5. Battle sprite / artwork production notes
Create one transparent illustrated battle portrait per species, following the repo convention used in dist/assets/[id].webp.
Prioritise clean alpha edges and a fully readable silhouette at battle scale.
These are not retro pixel sprites. They should match the repo's polished Abyssals battle artwork style.
If generating variations, preserve the approved silhouettes rather than redesigning from scratch.
6. Directional follower sheet notes
Create one follower sheet per species in the style of dist/assets/followers/[id].webp.
Use down / left / up / right rows.
Use the repo's standard small directional atlas logic so Work can wire it consistently.
Thimbril motion should be light, hovering or flittering if suitable. Carrionyx motion should be dragging, hunched, and menacing.
7. Gameplay identity
Base stats
Stat
Thimbril
Carrionyx
HP
45
110
Attack
45
115
Defence
35
60
Sp. Attack
60
90
Sp. Defence
45
85
Speed
75
40
BST
305
500
Battle role summary: Thimbril is a quick early Flying/Dark nuisance that pokes, startles and chips. Carrionyx is a slower Dark/Poison finisher designed to capitalise on poison status and drain momentum from weakened enemies.
8. Abilities
Suggested standard ability for Thimbril: Keen Ears or similar sensory-themed utility ability.
Suggested secondary for Thimbril: Infiltrator / stealth-adjacent utility if Work prefers an existing ability mapping.
Carrionyx hidden ability: Carrion Thirst.
Carrion Thirst: Restores 1/16 of maximum HP at the end of a round whenever an opposing Abyssal suffers poison damage. Limit: once per round.
9. Signature move
Name: Carrion Jaws
Type: Dark | Category: Physical | Power: 80 | Accuracy: 100 | PP: 10
Effect: A vicious venom-soaked bite. If the target is already poisoned before the move lands, the user restores 50% of the damage actually dealt.
Important mechanical note: the healing is conditional. It should only trigger against a target that was already poisoned, and the healing amount should be based on final damage dealt.
10. Move animation brief for Work
Carrion Jaws should have a bespoke move animation in the current Abyssals move-VFX language: higher-detail pixel art, readable frames, and a strong sense of physical action rather than generic elemental symbols.
Animation theme: serpent-bat lunge, toxic bite, ripping impact, then a venomous afterglow.
Frame idea: coiling anticipation → neck shoot-forward → jaws open wide → bright bite impact → purple-black slash / bite crescent → toxic splash or droplets → conditional siphon pulse if heal effect triggers.
Palette: dark magenta, poisoned violet, acidic green highlights. Avoid neon overload.
The effect should feel brutal and biological, not magical beam spam.
If Work separates hit animation from heal animation, the heal rider can be a short inward siphon of poison-purple particles returning to Carrionyx.
11. Learnset direction
This does not need to be treated as a final locked learnset, but Work should preserve the identity: sneaky bat on stage one, poison-enabled predator on stage two.
Suggested Thimbril learnset flavour
Light peck / bite equivalents
Early Dark chip moves
Astonish / screech / evasive utility
Air Slash or other Flying pressure later in the curve
One nuisance support move to reflect stealthy scouting
Suggested Carrionyx learnset flavour
Dark bite / fang / strike attacks
Poison Fang and poison-inflicting attacks
Crunch-style stronger Dark coverage
Venom Lash / poisonous physical coverage
A howl / roar / breath option if Work wants mixed pressure
Signature move Carrion Jaws learned on evolution or later as the family capstone
12. Habitat and journal guidance
Proposed wild placement for Thimbril: Burrow Hollow at night. Optional secondary appearance: Stormglass Bluffs at night.
Proposed wild placement for Carrionyx: Rare encounter in the deeper Veilroot Bastion areas; optional rare Moonlit Depths night encounter.
Field Journal tone for Thimbril: tiny whispering bat with uncanny hearing.
Field Journal tone for Carrionyx: fallen giant whose ruined wings drag poison over stone as it hunts.
13. Shiny direction
Thimbril shiny: pale cool blue-grey with warm orange or amber eyes; still cute and readable.
Carrionyx shiny: corpse-blue or moonlit teal body with sickly pale membranes and altered venom accents.
Use the repo's existing shiny recolour logic where possible, but preserve contrast in membranes, outline readability and face detail.
14. Production checklist for Work
Read this document first, then open thimbril_carrionyx_concept_sheet.png for the visual reference.
Produce final transparent battle art for both stages.
Produce final follower sheets for both stages.
Produce Carrion Jaws move animation in the current repo style.
Produce or configure shiny variants.
Wire species data, moves, abilities, habitats and learnsets after visual approval.
15. Non-negotiables to preserve
Thimbril must stay noticeably cuter and smaller than the original rough drafts.
Carrionyx must stay skinny, skeletal and unhealthy-looking, not broad or robust.
Carrion Jaws must heal 50% of damage dealt, but only if the target was already poisoned.
Artwork must feel like Abyssals repo artwork, not generic monster art or low-detail placeholder art.
16. Included concept image
The following image is included in the ZIP as the primary visual reference for Work.
