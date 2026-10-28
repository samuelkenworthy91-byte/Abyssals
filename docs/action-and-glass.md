# v0.90.48 — Action and Glass

Battle effects follow what a technique does. Type remains a battle mechanic; it does not require waves, flames or elemental emblems in every animation.

## Artwork and motion

- 63 separately generated, transparent, sixteen-frame pixel-art animations: the 43 Tide & Orchard techniques, four passive/residual effects and sixteen older techniques.
- Stillwater uses three sword cuts followed by glass fracture and tumbling shards. There is no water spray. Unused cut frames are omitted when fewer strikes land. HP presentation follows actual individual strikes; damage calculation remains authoritative.
- Older techniques rebuilt: Rattling Cry, Resounding Clap, Little Conqueror, Live Wire, Night Feint, Iron Lance, Clockwork Current, Padded Uppercut, Fern Circuit, Spore Signal, Anvil Shoulder, Dream Ripple, Obsidian Shelter, Dusk Guillotine, Malagigi's Mirror and Heatglass Edge.
- All eighteen ordinary atlases and four signature atlases use 64-pixel cells and crisp sampling. Shared choreography uses action vocabulary: piercing, uppercuts, crushing, bites, feints, sound and support. Literal material in a move name can inform its art; category/type alone does not force elemental imagery.
- Existing signature renderers retain their named choreography. Bespoke sheets take precedence.

action-originality-audit.json records repeated resolved artwork across all 610 pre-update moves and the exact added learning rows. Repeated source art is a review signal; it does not mean two entire animations were identical.

## Learning and access

820 learning records are added across 256 species. All eight Flaskling/Scruffox branches receive five or six later choices after their evolution gates. Scruffox gains intermediate choices. Final Paladin pools and other terminal forms receive later tactical milestones, extending to level 88. Learning is not padded to every level of the level-200 cap.

Existing learning rows remain valid apart from one exact duplicate Arthox signature. Flaskling remains deliberately minimal. Stable move IDs, stats, evolution conditions, maps, quests, permanent deaths and saved equipped moves are preserved.

CODEX entries no longer imply free acquisition at their recorded level. The tree and relearning confirmation share eligibility rules. Previously learned moves are remembered during migration and teaching; forgetting an owned Codex move does not remove access. Intended Codex-only moves now have explicit shop stock. Root Grip, Wraith Pulse, Pressure Front and Heatglass Edge have defined compatible teaching routes.

All assigned ability names resolve. The existing suite exercises mechanics and interactions; this update does not claim new exhaustive behavioral certification of all 158 abilities.

## Validation and release

The new behavior test covers actual counter strikes, unused cut omission, acquisition, teaching eligibility, saved-move retention and post-evolution progression. Browser checks decode every new sheet, check phone layout/reduced motion and record screenshots. Existing live Tide & Orchard battle checks remain.

A full-checkout patch workflow runs before promotion. The Android workflow then tests, verifies offline assets, packages only dist/, signs with the original key and publishes the APK/PWA. No local APK or new signing key is used.

Artwork uses built-in Imagegen. The provenance JSON records briefs and source/runtime hashes. To rebuild approved sources, use scripts/prepare-action-art.py --sources INPUT.json. Normal builds consume the committed optimized PNGs.

Mercy Edge and its ray variant explicitly retain their original First Light graphics, as requested. They are excluded from the new artwork batch.
