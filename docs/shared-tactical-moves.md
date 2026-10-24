# Shared tactical techniques — v0.90.28

## Scope
32 new moves (IDs 538–569) are in the **global catalogue**, rather than exclusive Rivet signatures. The original signature moves and the six original Rivet identities are preserved. All 18 Rivet branches gain **three targeted level-up options** at levels 22, 34 and 46; all compatible non-Rivet species may purchase and learn these moves via the existing Grand Exchange Codex tutor system (single-use scrolls). Any old save may acquire the additions without a reset.

This update **does not apply the separate proposed 250%/330% growth-rate rebalance**: the growth overhaul should be considered independently, to avoid unexpectedly changing saved creature stats.

## Catalogue audit and rationale
The original 354-move source catalogue includes 79 status moves and 62 with at least one stat-stage effect. It already has a few dual boosts (Guarded Breath, Tempered Body, Spring Growth), HP-cost gambits (War Flame, Silent Ambition), and drawbacks (Flash Step, Updraft, Royal Roar). They are retained. New moves introduce more distinct +1/+1, +2/+2, +3, +3/+3 and +3/+3/+3 combinations, along with substantial Defence/Speed sacrifices or HP costs.

- **Nine true multi-hit attacks:** Shrapnel Barrage (Steel), Needle Frenzy (Bug), Phantom Knives (Ghost), Claw Rattle (Normal), Arc Volley (Electric special), Mica Volley (Rock special), Riptide Combo (Water), Soundstorm (Normal special), Icebound Shards (Ice special). Strike 2–3, 2–4 or 2–5 times; separate damage, critical and contact reactions for each hit; PP consumed once.
- **Party healing:** Chorus of Renewal (12.5% max HP), Root Communion (10%), Mender's Pulse (10%). Heals the living party, including benched members, but never revives fainted/permadead Abyssals.
- **Party buffing:** Warding Chorus and Shield Relay (Defence + Special Defence), Coordinated Focus (Special Attack + Accuracy), Battle Rally (Attack + Speed). Party-stage effects support the user and currently active, living allies; benched members do not acquire persistent battle stat stages.
- **Sustainable single-user setups:** Reforged Bulwark, Warforged Tempo, Furnace Lockdown, Second Tide, Floral Regrowth. Type-compatible self-healing and defence trade-offs.
- **Risky power setups:** Overcharge Protocol (+2 Attack/Speed; −2 Special Defence), Executioner's Bargain (+3 Attack; +1 Speed; −2 both defences), Entropic Ritual (+2 Special Attack; +1 Special Defence; −20% max HP), Anchored Artillery (+2 Special Attack; +1 Accuracy; −2 Speed), Astral Sacrifice (+3 Attack/Special Attack/Speed; −2 both defences; −50% max HP; 1 PP), Last Bastion (+3 Defence/Special Defence; −3 Attack/Speed), Duality Crest (+1 Attack/Special Attack/Speed; −1/6 max HP), Mind Toll (+3 Special Attack; −2 Special Defence; −25% max HP), Momentum Feast (+2 Attack; +1 Speed; −2 Defence).
- **Additional pressure:** Ember Attrition (Fire special with burn), Rime Halo (Ice special with frostbite).

Moves with HP costs require sufficient HP *before* consuming PP or applying boosts. Existing damage, ability interactions, stage limit (−6 to +6), permanent-death rules and move-save representations are retained.

## Role-specific Rivet additions
Each row shows only new level-up options. Original moves and signature moves remain.

| Branch | Lv22 | Lv34 | Lv46 |
| --- | --- | --- | --- |
| Ghost / Steel | Phantom Knives | Battle Rally | Executioner's Bargain |
| Fire / Steel | Furnace Lockdown | Chorus of Renewal | Ember Attrition |
| Electric / Steel | Arc Volley | Warforged Tempo | Overcharge Protocol |
| Ice / Steel | Icebound Shards | Reforged Bulwark | Rime Halo |
| Dark / Steel | Claw Rattle | Executioner's Bargain | Battle Rally |
| Bug / Steel | Needle Frenzy | Battle Rally | Warforged Tempo |
| Pure Steel | Reforged Bulwark | Shield Relay | Last Bastion |
| Normal / Steel | Soundstorm | Coordinated Focus | Mender's Pulse |
| Water / Steel | Riptide Combo | Second Tide | Warding Chorus |
| Grass / Steel | Root Communion | Floral Regrowth | Warding Chorus |
| Fighting / Steel | Shrapnel Barrage | Warforged Tempo | Momentum Feast |
| Poison / Steel | Entropic Ritual | Mender's Pulse | Warding Chorus |
| Ground / Steel | Shrapnel Barrage | Warforged Tempo | Last Bastion |
| Flying / Steel | Soundstorm | Coordinated Focus | Arc Volley |
| Psychic / Steel | Warforged Tempo | Battle Rally | Warding Chorus |
| Rock / Steel | Mica Volley | Anchored Artillery | Reforged Bulwark |
| Dragon / Steel | Duality Crest | Soundstorm | Astral Sacrifice |
| Fairy / Steel | Chorus of Renewal | Warding Chorus | Coordinated Focus |

Balance targets: multi-hit average total power stays comparable to established attacks; strong buffs consume a turn, PP and/or health and expose meaningful stage weaknesses. They should not make a single setup unanswerable or let healing reverse permanent death.

## Verification
`tests/tactical-moves.test.mjs` covers registry uniqueness and availability, type-compatible Codex teaching to non-Rivet creatures, all eighteen curated learnsets, animated move scenes, actual strike counts, PP conservation, party healing, allied buffs and HP-cost limitations. Android and PWA share this same runtime source and both use the existing save representation.
