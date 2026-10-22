# Rivet: complete armoury — v0.90.26

All approved gallery sprites are included as optimized transparent WebPs. Species 480–503 and moves 525–537 append to the existing catalogue. Original branches and base IDs are unchanged.

Rivet + core at level 12 → middle form; the middle form evolves at the listed level after the normal earned-level requirement. One evolution per level remains enforced. All eighteen cores appear in the bell-restoration reward and Thomas’s 10,000-doubloon repeatable stock; existing completed quests unlock the same expanded shop without reset. The Witness in Stone core choice uses the same complete registry.

| Type | Core | Middle → Final | Final level | Signature |
|---|---|---|---|---|
| STEEL | Tempered Core | Rivetsquire → Ferrarch | 34 | Masterwork Riposte |
| STEEL / NORMAL | Carillon Core | Bellusk → Carillodon | 36 | Carillon Cannon |
| STEEL / WATER | Riptide Core | Reefrook → Riptidebrute | 36 | Riptide Haymaker |
| STEEL / GRASS | Verdant Core | Briarcalf → Canopylance | 36 | Canopy Joust |
| STEEL / FIGHTING | Warboss Core | Scrapbrute → Ironogre | 40 | Bossbreaker Chop |
| STEEL / POISON | Entropic Core | Rustwight → Gravehulk | 38 | Entropic Reap |
| STEEL / GROUND | Faultline Core | Terrabite → Tyrantread | 40 | Faultline Crusher |
| STEEL / FLYING | Vector Core | Glidecadet → Nightvector | 34 | Silent Vector |
| STEEL / PSYCHIC | Runic Core | Runecaval → Aesirion | 38 | Mindsteel Cleave |
| STEEL / ROCK | Mica Core | Shardarter → Lithodarter | 34 | Mica Skewer |
| STEEL / DRAGON | Astral Core | Nebulisk → Astralcyon | 42 | Astral Rend |
| STEEL / FAIRY | Revel Core | Jinglejack → Harlequink | 34 | Encore Bonk |

Carillodon is a special sound attacker: Plain Call, Resonant Chime (Steel, 75 power, 100 accuracy, 15 PP), Carillon Cannon (Normal, 90 power, 100 accuracy, 10 PP), Iron Curtain and Second Wind. Both new sound moves are explicitly tagged for Soundproof and sound abilities. Aesirion’s Mindsteel Cleave is Psychic/physical and uses Attack. Every final signature is available on evolution and through relearning.

New final base-stat totals are 490–520, with clear offensive and defensive tradeoffs and authored growth budgets comparable to existing Rivet branches. Warbond remains shared and non-stacking. No new acquisition gates, map mutations or save resets.

Art source: approved standalone review gallery revision 5, source commit 4d5973dfb236b0af3da9f1f7fa8ce819fe4953f3. Normal final revision 4, Grass pair revision 4, Fighting final revision 5, Ground/Poison/Flying revision 3; other new art retains its approved versions.

Local validation: every source test passed; all 502 species / 1,005 shiny art surfaces audited with alpha unchanged; full offline inventory and Android manifest checks passed. Direct comparison confirms all 478 pre-existing species retain exact stats, growth, abilities and learnsets, and all 524 pre-existing moves are unchanged. GitHub Actions also runs a new real-browser regression for eighteen core choices, shopping/reload, item evolution/cancellation, all new sprite frames and the complete reference page.
