# Item and branch-evolution review · 26 October 2026

This is an approval artifact, outside `dist/` and excluded from the APK and PWA. It shows 280 existing inventory / shop entries (including 191 move codexes), ten original creature-art proposals, eight new evolution-item pictures, proposed stats/growth/abilities/moves, and a Waranwei walking comparison. `build_review.py` embeds every picture into one offline HTML file; its output belongs in `build/review/` or an explicit output path.

The existing bag / lift changes remain staged on `patch/bag-icons-store-lift`. Only the Waranwei rendering correction in this task modifies gameplay: `MIRRORED_FOLLOWER_FRAMES['185']` changes from `[7]` to `[6]`. The untouched source sheet has one reversed first right-facing frame; the old correction flipped the already correct second frame. All four directions are regression checked. No APK build is requested.

## Review decisions

- The spoken brief says five items but explicitly describes four sin outcomes and four fox outcomes. The review uses eight items, one per named branch, and tells the user this assumption.
- The final corrected flask requirement is level 40+, in Hell, with the matching item. The species receives half EXP while unevolved; one 2× Warbond multiplier returns that award to normal. Its only natural moves are Feeble Pulse and Cower; these are proposed moves and restrictions, not installed mechanics.
- Flaskling branches to Vainglulus (Pride), Wrathulus (Wrath), Slothulus (Sloth), or Gulomunc (Gluttony). Evolved proposed base-stat totals are 560 each.
- Scruffox branches to Arthox (Arthur; outright attack), Alfredox (Alfred; outright defence), Ronnifox (Ronnie; bruiser) or Reggifox (Reggie; tactical support). Evolved proposed base-stat totals are 520 each. Level 30 item use is an explicitly labelled proposal because the brief does not give a fox evolution level.
- New species, items, moves and abilities have no live IDs or gameplay/shop bindings. They wait for artwork and mechanic approval. No source stats, existing quests, permanent deaths or saves are altered by the review.

## Art production

Built-in image generation produced one separate transparent battle-art proposal per creature, plus one eight-cell evolution-item atlas. The final selected cutouts are under `art/`; `art-generation.json` records generated source filenames and preparation. Each battle-art prompt requests one original full-body 2D creature with dark crisp outlines, refined cel shading and subtle near-pixel texture, transparent background, generous padding and no interface or text.

The prompt subjects are: a vulnerable shadow homunculus inside an alchemical flask; a regal mirrored shadow-crown Pride form; an obsidian/ember clawed Wrath form; a heavy slate pillar-armed Sloth form with still hourglass; a plum-glass belly Gluttony form with digestive vapour; an uncommitted fox cub sparrer; an athletic bronze-lamellar Arthurian fox with radiant leaf sword; a broad armoured Alfred fox with fortified-gate shield; a stocky pinstriped knuckle-guard fox enforcer; and a composed, slender watch-and-cane fox organiser with directing tokens. The item atlas requests the Vainglory Mirror, Wrath Brand, Leaden Hourglass, Bottomless Cup, Avalon Blade, Burh Shield, Enforcer Knuckles and Fixer’s Watch, each isolated with padding in a regular 4×2 grid.

Historical reference points are linked in the review: British Library on Arthurian legend; the Royal Household on Alfred’s fortified burhs; London Museum on the Kray twins. The characters are original monster designs rather than portraits of real people or copies of an anime cast.
