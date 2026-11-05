# Random Winter Nursery reward — v0.90.55

The marchMeadow quest offers three distinct random first-stage species. Eligibility uses the installed evolution graph: at least one outgoing evolution edge and no incoming edge. Legendary roamers and species labelled mythic or legendary in role/power classification are excluded. Both two-stage and three-stage families qualify, including the installed dossier roster. The current pool contains 200 species.

The three IDs are saved in the existing quest record before the choice menu opens, with giftOfferVersion 2. Reopening, reconsidering and reloading retain those offers. Unclaimed legacy fixed offers roll once after updating; completed rewards, existing companions and their receipts remain untouched. The player still receives only one level-5 companion with normal growth, sent to reserves if the party is full.

Validation: tests/nursery-reward.test.mjs checks live roster eligibility, every candidate reachable, duplicate prevention, save/reload, legacy offers, completed receipts, invalid choices, one-time grants and full-party reserve placement. Runtime cache consistency is checked separately. Package identity and signing configuration are unchanged.
