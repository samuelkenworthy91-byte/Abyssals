# Collection deadline — real-world finale

The runtime catalogue contains 478 species entries. The audit covers 462 entries with actual wild tables, fishing tables/jetties, NPC trades, unique encounters and forward evolution paths. The remaining 16 entries belong to the three starter families and four fossil families; the player's selected families remain obtainable by their existing opening/fossil choice. Alternative branches may be mutually exclusive through story decisions, as intended.

The ledger in `collection-before-eighth-leader.json` lists every species, its acquisition or evolution chain, and any choice exception. This checks access opportunities, not a guarantee that an Ironman expedition can recover a unique creature after killing it. Existing death and uniqueness receipts remain authoritative.

Votress has a night habitat in Glasswater Sluice; Regulet appears by day in Orchard Canopy. Earlier split-result wild slots now contain the common base, including descendants of Rivet's armour branches. The same rule applies at the final ordinary encounter layer and to fishing selection, after all habitat expansion. It does not change existing owned partners, trainers, trials, or legitimate evolution choices.

Gehennuar's unique Lv96 encounter is on Sporefall's Lantern Shelves. Suncub's unique Lv90 encounter is on the Flowering Terraces and can evolve into Cehong. Both require resolving Cayfen and reading their nearby field record. Guanrong, Feirong and Cruxwyrm retain their separate quest/battle requirements. All are available before the formal eighth-leader victory. Caelynx, Tellurion, Tianzhar, Liubeirow, Waranwei, Verdantyr and the thirteen roaming court guardians retain their existing earlier encounters.

Run `node tests/collection-access.test.mjs --report` to check the complete ledger. The test checks all constructed live wild tables, their total weights, split-result exclusions, fishing/jetties and evolution closure. Existing quest tests exercise the milestone and unique-outcome rules separately. Revisit earlier areas through the saved caravan network; no new access depends on staying in one room or keeping a leader alive.
