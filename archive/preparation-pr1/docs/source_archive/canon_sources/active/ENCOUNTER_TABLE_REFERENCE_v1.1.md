# ENCOUNTER TABLE REFERENCE

Status: LOCKED framework v1.1. This file defines how route, habitat and day/night tables must be authored. Species-by-species tables remain to be populated. v1.1 adds the narrow Checklist 11 story-choice postgame exception.

## 1. Core table model
Every encounter-enabled habitat receives two authored tables:

LOCATION / HABITAT
- DAY table
- NIGHT table

In Hell the same mechanical DAY/NIGHT flag is presented as Pale/Dark metaphysical phase changes.

Every table:
- totals exactly 100%
- has authored species weights
- has authored min/max levels
- may include Common, Uncommon, Rare and Extremely Rare entries
- does not dynamically scale with party level

## 2. Global day/night cadence
- Day lasts 10 real-time minutes.
- Night lasts 10 real-time minutes.
- The cycle repeats continuously.
- Encounter-table state is checked when the encounter begins.
- Day/night exclusivity is selective and concept-driven.
- Many species may remain in both states with different percentages.

## 3. Habitat design
Most major outdoor regions contain roughly 2–4 habitats.

Examples:
- road / verge
- scrub
- woodland
- orchard
- riverbank
- marsh / reeds
- ruins
- quarry
- cave
- flooded chamber
- battlefield rubble

Species distribution should reflect ecology and concept.

Evolution families usually remain in ecologically related habitats unless lore explicitly justifies a shift.

## 4. Encounter-rate presets
Use three broad presets:
- LOW — open roads / calmer country
- NORMAL — typical dangerous terrain
- HIGH — caves, dense hostile terrain, Hell

Initial tuning target:
- Low: ~6% per eligible step
- Normal: ~10%
- High: ~14%

Exact percentages may be tuned during implementation.

## 5. Rarity bands
Design labels:
- Common: 20%+
- Uncommon: 8–19%
- Rare: 2–7%
- Extremely Rare: under 2%

Guidelines:
- sub-2% should be genuinely exceptional
- not every table requires an Extremely Rare slot
- some species may only occur in one or two places
- some species may be exclusive to optional areas
- avoid unreasonable rarity stacking for ordinary dex entries

## 6. Level rules
- Wild levels are fixed/authored per table.
- No dynamic level scaling.
- Rare random specimens should usually be only +1 to +3 levels above regional norms.
- Dramatically stronger encounters must be authored special encounters rather than random spikes.

## 7. Repel / Resonator rule
Permanent toggleable key device.

Working fiction:
- emits a frequency that discourages weaker Abyssals

Mechanical suppression:
- identify the first living Abyssal in the party
- suppress a generated wild encounter if wild level <= lead level - 5
- stronger/closer-level encounters still occur

No consumable charges or purchase loop.

## 8. Encounter-enabled vs safe spaces
Random encounters normally operate in:
- routes
- caves
- tunnels
- ruins
- hostile fields
- Hell traversal spaces

Random encounters are suppressed in:
- ordinary inhabited settlement cores
- safe thresholds
- shops/rest areas
- major dialogue rooms
- active puzzle interactions
- cleared boss arenas
- first-visit Emmara Mill revelation sequence

Story-state invasion/corruption can temporarily make a settlement encounter-enabled.

## 9. Special-interaction encounters
Allowed separate interaction encounters include:
- fishing-like spots
- nests/burrows
- disturbed rubble
- shrines/ruins
- unusual trees/plants
- fossil excavation points
- story phenomena
- shoreline/dock interactions
- flooded chambers

These may have their own day/night versions.

No interaction requires a specific party Abyssal or HM-style move.

## 10. Water habitats
After Philomere, the permanent personal watercraft enables designated water routes.

Aquatic species may also be encountered through:
- riverbanks
- docks
- shorelines
- reeds/marshes
- flooded chambers
- special interaction spots

The watercraft is a human-made traversal tool, not an Abyssal ability.

## 11. Story-state table changes
A location receives a replacement table only when the environment has physically or metaphysically changed.

Examples:
- invasion
- corruption
- ceasefire/truce
- restoration
- Hell bleed
- altered underworld phase

Simply completing a chapter is not enough reason to replace a table.

Restoration can never make a previously obtainable species permanently unavailable.

## 12. Species availability curve
Target cumulative availability for species that are eligible during the current save's main game:
- Ramelle / Old Catacombs: ~90–93%
- Circle I: ~96–98%
- end of Circle II: 100% of main-game-eligible species theoretically obtainable

Checklist 11 exception:
- the four story-choice source families are Censmoke, Cairant, Flaggrim and Jerbune
- each save unlocks only one evolved branch from each family during the main game
- the four unchosen final forms are deliberately excluded from the main-game availability curve
- with the current fixed 187-species roster, this means 183/187 can be obtained before the finale on a single save

Circles III–IX:
- no first-access species required among main-game-eligible species
- may offer evolved forms
- better rare odds
- stronger specimens
- alternate habitats
- unusual day/night mixes

## 13. Evolution-stage availability
- Early/midgame: mostly first stages
- Later mortal regions: more second stages
- Late mortal / Hell: final stages may appear naturally
- Finding evolved wild forms normally never replaces the option to raise earlier stages
- Exception: Primeval Reach directly supplies the four evolved forms excluded by the player's main-game story choices; catching those forms does not unlock the opposite evolution branch for Censmoke, Cairant, Flaggrim or Jerbune

## 14. Fossils
Main-campaign acquisition:
- fossil discovery
- restoration
- authored exploration/quest sources

Not normal random encounters initially.

Postgame:
- Primeval Reach contains living wild fossil populations
- for fossils, this is alternate access, not first access

## 15. Mythics
- never normal random encounters
- bespoke authored encounters
- may depend on optional exploration, story state, phase, quest or other explicit condition
- must still be obtainable before the finale if requirements are met

## 16. Story-choice postgame completion exception
Primeval Reach must include encounter access to the four final forms excluded by the current save's main-game choices:
- Censmoke: unchosen one of Thurafume / Malifume
- Cairant: unchosen one of Serapine / Pandemne
- Flaggrim: unchosen one of Oriflamme / Tattereign
- Jerbune: unchosen one of Concordune / Sundune

Implementation constraints:
- these are direct postgame encounters/captures, not a second evolution-choice event
- the original story decision remains historical and unchanged
- the source species remains tied to the branch selected by that save's story decision
- the exact Primeval Reach habitat, encounter percentage, level range and day/night placement remain encounter-authoring work
- no other species becomes postgame-first-access without explicit revision

## 17. Location framework requiring encounter tables

### Civeton
- Civeton March
- Mere of First Light

### Dorelem
- Dorelem Scrub
- Dorelem Service Tunnels
- Marchwood Hollow
- Reedcut Cave

### Philomere
- North Scrub Road / Hospice Road
- Flooded Medicine Path
- Sanctuary Reeds
- Philomere Backwaters

### Cybressa
- Rivercause Road
- Smugglers' Weir / drainage basin

### Cossenne
- Orchard Way
- Old Pilgrim Grove
- Sunken Shrine

### Marasen
- Stonecut Pass / Quarry Road
- Quarry Tunnels
- Prison Galleries
- Fossil Cut

### Botrune
- Scribes' Road
- Buried Pre-Schism Archive
- Scribe's Cistern
- Tide Caves

### Cayfen
- War Road / Burned Approaches
- No-Man's Field
- Ceasefire Field
- Ash Culvert

### Ramelle
- Pilgrim's Reach
- Sacred Boundary Farms
- Emmara approach field on later revisits
- Washed Crossing
- Pilgrim Caves
- Bellglass Ruins
- Old Catacombs

### Circle I
- Roads of the Newly Dead
- Registry of Names
- Lost Queue

### Circle II
- Unfinished Rooms
- Hoard Galleries
- Medal Vault

### Circle III
- Endless Battlefield
- Anchor Trenches
- Medic's Truce

### Circle IV
- Court of Petitions
- Command Arcade
- Empty Chair

### Circle V
- True Light Heaven
- Dawn Bloom Heaven
- Old Hymn Chamber
- Shared Hymn Gate if encounters are desired there

### Circle VI
- Memory Orchards
- Mirror Pond
- Memorial Grove

### Circle VII
- Promise Hall
- Closed-Door Maze
- Brothers' Threshold

### Circle VIII
- Blank Shore
- Silent Crossing
- Drowned Monuments
- Missing Stanza Islet

### Circle IX
- failing record halls
- last-name chambers
- Misfiled Records

### Postgame
- Primeval Reach: Fern Basin
- Primeval Reach: Fossil Cliffs
- Primeval Reach: Primeval Jungle
- Primeval Reach: Caldera / nesting grounds
- Reordered Underworld / King's Causeway
- remixed former-Circle fragments

## 18. Authoring template
Use this template for each habitat:

### [LOCATION] — [HABITAT]
Encounter rate: LOW / NORMAL / HIGH
Recommended regional level: [X–Y]

#### DAY
| Species | Weight | Level range | Rarity | Conditions |
|---|---:|---:|---|---|
| TBD | TBD% | TBD | TBD | — |

TOTAL: 100%

#### NIGHT
| Species | Weight | Level range | Rarity | Conditions |
|---|---:|---:|---|---|
| TBD | TBD% | TBD | TBD | — |

TOTAL: 100%

Notes:
- habitat identity
- evolution-stage intent
- story-state alternatives
- optional-area exclusives
- rare hunting logic
- special-interaction encounters

### v1.1 supersession note — Checklist 11 story-branch exception
The former 100%-of-all-187-by-Circle-II wording is superseded only for the four unchosen story-choice final forms. Every other species retains the previous main-game availability contract.
