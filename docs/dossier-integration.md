# Balanced dossier integration — source update

User-authorised implementation, 3 November 2026. No APK or offline ZIP was built or published. The 26 Drive dossiers contribute 54 new species (IDs 520–573); all previous species IDs, saves, permanent-death records, evolution bonuses, package and signing identity remain unchanged.

## Balance decisions

Every species has explicit six-stat growth rates (10–120%), separate from its base stats. Starting-stat scaling, level growth, normal genderless breeding and Prodigy inheritance use the existing engine. No extra rarity bonus is added. Final spreads were chosen conservatively rather than automatically redistributing removed points.

| Family | Mature form | BST | HP / Atk / Def / SpA / SpD / Speed |
| --- | --- | ---: | --- |
| Sprigrel → Budrel → Thornexus | Thornexus | 450 | 120 / 50 / 50 / 55 / 50 / 125 |
| Acoroot → Canopowl | Canopowl | 500 | 84 / 65 / 88 / 102 / 91 / 70 |
| Cinderoot → Blazebramble | Blazebramble | 515 | 102 / 123 / 100 / 62 / 82 / 46 |
| Cobalisp → Lankinder → Sapphyrax | Sapphyrax | 520 | 62 / 112 / 115 / 108 / 98 / 25 |
| Crownlet → Imperydrake | Imperydrake | 525 | 88 / 112 / 83 / 62 / 81 / 99 |
| Eldrakor | Eldrakor | 530 | 98 / 58 / 97 / 110 / 117 / 50 |
| Ferrub → Scythorax → Aurelytron | Aurelytron | 515 | 82 / 123 / 102 / 42 / 76 / 90 |
| Follicant → Myrmaleon | Myrmaleon | 515 | 105 / 120 / 115 / 45 / 85 / 45 |
| Gloamsip → Adzraith | Adzraith | 505 | 70 / 105 / 55 / 105 / 65 / 105 |
| Gratzel | Gratzel | 470 | 80 / 105 / 75 / 55 / 70 / 85 |
| Luton → Lutromage → Lutrasage | Lutrasage | 510 | 85 / 50 / 65 / 115 / 110 / 85 |
| Meltelier | Meltelier | 500 | 80 / 65 / 80 / 100 / 95 / 80 |
| Mindlarv → Omenluna | Omenluna | 500 | 82 / 54 / 72 / 108 / 105 / 79 |
| Orchidit → Cinderchid → Roguorchid | Roguorchid | 500 | 75 / 120 / 65 / 70 / 65 / 105 |
| Pebbloyle → Slateryx → Cathedralyx | Cathedralyx | 515 | 95 / 118 / 134 / 52 / 88 / 28 |
| Pomantler | Pomantler | 510 | 92 / 68 / 86 / 84 / 98 / 82 |
| Brookisk → Torravyr | Torravyr | 520 | 105 / 115 / 100 / 70 / 85 / 45 |
| Rimecub → Frostfang → Borewraith | Borewraith | 535 | 88 / 111 / 78 / 98 / 74 / 86 |
| Sparkgecko → Frillvolt → Thunderbasilisk | Thunderbasilisk | 510 | 78 / 116 / 70 / 76 / 70 / 100 |
| Sparrcoo → Coronox | Coronox | 515 | 95 / 115 / 85 / 95 / 65 / 60 |
| Sproutolin → Fernscale → Elderpangrove | Elderpangrove | 510 | 105 / 112 / 112 / 55 / 90 / 36 |
| Terraforge | Terraforge | 510 | 100 / 112 / 128 / 45 / 84 / 41 |
| Thimbril → Carrionyx | Carrionyx | 500 | 110 / 115 / 60 / 90 / 85 / 40 |
| Voltinix | Voltinix | 500 | 130 / 125 / 65 / 65 / 60 / 55 |
| Voltisl → Thunderaze | Thunderaze | 477 | 62 / 40 / 50 / 122 / 68 / 135 |
| Voltoceros | Voltoceros | 510 | 102 / 108 / 105 / 58 / 85 / 52 |

## Mechanics

- Symbiotic Bloom still doubles move recovery, including active allies, but caps actual recovery at 75% of each recipient’s maximum HP per selected action, after held modifiers. Items, Berries and passive/ability healing are excluded. Poison/burn damage gains 10% once; provenance survives switching as specified by the dossier.
- Ordinary critical chance remains capped at 50%, including Assassin’s Cadence, the Speed differential and Cinderweave’s incoming critical stage. Existing guaranteed-critical moves keep their original explicit rule.
- Voltinix has Stormbed instead of Storm Stride: five rounds of Electric Terrain on entry, blocked by World Anchor, with no passive Speed ramp. Static Field now also sets five rounds of terrain while retaining its three-round 25% paralysis checks. Grounded Electric attacks gain 20% damage, and grounded targets cannot newly fall asleep; terrain does not cure existing sleep.
- Overclock Dynamo charges only after successful selected contact damage. Its next Electric action gains 25% damage; that boosted action cannot charge itself. Unused charge expires after three round ends or switching.
- Cinderweave rolls once per committed voluntary switch, never in UI or AI queries. A failed roll uses the switch action. Wayfarer/Bindproof, forced replacement, faint replacement and scripted transitions bypass the web. Critical vulnerability is preserved.
- Bramble Furnace, Thundercoil, Pitfall Crown, Flying Buttress and threshold abilities use action/hit guards and existing battle-local reset rules. No ability heals a dead creature.
- Palimpsest and Floodplain are now correctly registered as well as implemented; the dossier called them existing, but current ability metadata did not contain them.

## Moves

The live canonical alias registry resolves retired dossier names and IDs. Existing family-exclusive moves are not granted to unrelated newcomers. Thunder Gore, Blossom Shiv, Generator Crush, Imperial Rush, Sacred Grove, Living Pigment, Nature Pulse and Harvest Handoff are not registered as redundant new moves; shared existing attacks/support/passing techniques fill those roles. Physical Gratzel/Terraforge receive physical finishers.

Nectarbane (810) is retained because its successful-new-poison-only healing is distinct: 90 accuracy, 10 PP, ordinary poison, and 1/8 max-HP healing only when a new poison is inflicted (1/4 with Symbiotic Bloom). It has an individually authored 16-frame vine/lotus/sap sheet, reproducible vector source, animation score and browser verification. Its fresh artistic approval is still recorded as requires-review; historical artwork approvals are not invented.

## Acquisition and save compatibility

All proposed encounter locations use existing mortal-world rooms. The final encounter overlay preserves 100-point totals, existing relative weights and fixed Rimebun slots; it runs after the other collection/biome layers. Wild levels follow those rooms rather than obsolete dossier level bands. Eldrakor uses late Lanternwood (55–61), avoiding an overpowered early shrine capture.

| Family root | Source | Wild levels |
| --- | --- | --- |
| Sprigrel | marchMeadow · DAY | 8–10 |
| Thimbril | burrowHollow · NIGHT | 14–16 |
| Luton | glassSluice · BOTH | 18–20 |
| Ferrub | emberQuarry · BOTH | 20–22 |
| Cinderoot | northRoad · BOTH | 20–22 |
| Cobalisp | emberQuarry · BOTH | 20–22 |
| Sparrcoo | stormBluffs · BOTH | 23–25 |
| Voltisl | stormBluffs · BOTH | 23–25 |
| Orchidit | orchardCanopy · BOTH | 26–28 |
| Acoroot | orchardCanopy · BOTH | 26–28 |
| Gloamsip | orchardCanopy · NIGHT | 26–28 |
| Follicant | orchardCanopy · BOTH | 26–28 |
| Sproutolin | reedSanctuary · BOTH | 28–30 |
| Crownlet | relicCrags · BOTH | 31–33 |
| Pebbloyle | relicCrags · BOTH | 31–33 |
| Sparkgecko | stormBluffs · BOTH | 23–25 |
| Terraforge | passLowerTunnel · BOTH | 38–41 |
| Voltoceros | passUpperTunnel · BOTH | 39–41 |
| Gratzel | passRidge · BOTH | 40–42 |
| Rimecub | passSummit · NIGHT | 40–42 |
| Meltelier | orchardVerge · BOTH | 44–46 |
| Pomantler | pilgrimGrove2 · BOTH | 50–53 |
| Eldrakor | greenLantern · BOTH | 55–61 |
| Voltinix | stormPylons · BOTH | 65–69 |

- Reed Sanctuary: Acremink → Brookisk replaces Billock. Brookisk and Torravyr have no wild, fishing or gift entries. Billock is restored to normal Reed Sanctuary encounters.
- Moonlit Depths: Styxlet → Mindlarv replaces Notionip. Mindlarv and Omenluna are trade-only before normal evolution/breeding; Notionip returns to Orchard Canopy.
- Replacement offers have new receipt keys while keeping their NPC/cache IDs and old receipts. Existing saves that completed the previous trade can obtain the new offer once.
- Voltisl evolves with Thunder Shard at level 30+. The Stormglass Bluffs traveller gives one guaranteed shard; the Marasen evolution shop supplies renewable shards. Item icon and item eligibility are wired.

## Names, art and references

Oraculuna → Omenluna, Voltfrill → Frillvolt, Rillisk → Brookisk. Existing species names and saves are untouched.

Approved source art is byte-preserved for the 52 standalone portraits, including Roguorchid restored from Drive. Thimbril/Carrionyx now use the user-approved native-resolution standalone portraits, with two hind legs and integrated wing-arms, replacing the lower-resolution concept-sheet extracts. Exact PNG masters and lossless runtime WebPs are preserved. All 54 portraits decode and frame in the actual browser. Followers use the existing animated-portrait companion path; this update does not claim new four-direction follower atlases.

All 26 original dossier texts, archive hashes, final configuration, art provenance and exact Drive source references are retained under art-library/dossiers. Fourteen redundant repo ZIP copies were removed only after text equality verification; originals remain in Drive. Staged source artwork remains intact.

## Verification

- 47 JavaScript regression suites pass (including the new dossier suite).
- 572 catalogue entries; 556 eligible species have acquisition/evolution paths in the existing collection audit; no missing eligible species or wild split branches.
- Live phone browser: all 54 portraits, Nectarbane animation, real poison/heal/terrain buttons, 75% healing ceiling, old-save replacement trade and save serialization.
- Existing 25-map environment connectivity passes with zero technical issues; historical art checks, offline inventory/imports, release cache consistency and interim-scope integrity pass.
- All existing reference-art approvals remain historical. New bespoke directional art and the unfinished game-wide move-art overhaul are not claimed complete.
