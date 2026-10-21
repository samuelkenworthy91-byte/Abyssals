# Thunder Crown and Botrune — v0.90.13

This overlay implements the user's 21 October mountain revision on current v0.90.12, without restoring historical source. Preserved CH07 anchors and the Botrune revised canon in `botrune-story.md` remain authoritative. Pate and Trade die at Botrune; no old Emmara reveal is restored.

## Journey and encounters

The Abandoned Watch cart has a split wheel. Its driver says Pate and Trade went ahead to Botrune for wheelwright supplies. The cart blocks the east causeway until Darius is defeated. The visible north rock steps lead to Broken Banner Camp, Last Banner Ridge's shelter caves, and Storm Crown's lightning tower. The deserter and Journal give the exact route; sentry, cave guardian and last-banner holdout victories persist. Several former followers reject Darius's coercion. Injured First Light and Dawnbloom patrols describe their failed joint approach, their dead, and Tianzhar's long-revered power. Cave paintings contrast sheltering travellers with the disaster of binding the sovereign. No generic dead NPC is added to the human restoration roster.

Darius's new exhausted, dishevelled illustration preserves his identity and original equipment. Tianzhar rises larger behind him. His six legal partners are Destridon, Avaroll, Accordacal, Xenolithid, Ragevolt and Tianzhar, levels 77–82. Existing Ground/Rock/Electric coverage, defensive held equipment, capped setup, sustain and three finite poultices reserved for Tianzhar provide attrition without inflated stats or invented attacks. Tianzhar uses its existing Dragon/Electric identity and Celestial Tempest hidden ability. The trainer's Tianzhar withdraws at 1 HP, preserving its life for the next encounter.

After victory rewards and Darius's dialogue, the broken tether initiates a separate wild Tianzhar battle. Capture uses normal food mechanics; the story does not advertise that option. The post-trainer specimen is restored to full HP/PP with cleared temporary combat state. The handoff, in-progress battle and logical unique outcome survive reloads. Capture or death permanently resolves it, including checks against previously owned or lost Tianzhar. Escape permits a later approach. No duplicate or resurrection is granted. Existing saves beyond the cart can retreat; a save inside the new cart footprint recovers west of it.

The second added side trail goes north from Glass Scars to Stormcatch Relay. Route five charges into the colour indicated by each pennant while the ring is open. Failed signals discharge safely; no HP is lost. Reduced motion removes the timer. Closing or reloading restarts the logical pending signal. Supplies (2,400 doubloons, three Hearty Rations and one Training Tonic) are awarded once.

## Weather, town and sentence

Rain is retained. A deterministic irregular schedule produces a dramatic full-viewport flash and branching bolt every 2–25 seconds, including the cycle seam. It never advances gameplay RNG or causes damage. Reduced motion disables rain and flashes.

Botrune's existing guard geometry and nine durable trial beats remain intact. Pate and Trade use their actual overworld identities from arrival. Two non-graphic, character-referenced comic panels appear behind dialogue for their deaths, with desperate prisoner and soldier lines. Existing partial-scene saves retain the same death indexes and independent `humanLives` provenance. The new south street connects the square to functional lower garrison streets with provisioner, free Walter treatment/reserves, a paid inn and civilian records. Each facade has an exterior entrance and shared collision footprint. Services and protected abbey records survive either judgement.

## Artwork provenance and packaging

Built-in ImageGen produced seven reviewed illustrations. Large PNG sources and prompt specifications are stored under `art-library/thunderplain-v09013/`; only seven optimized WebP assets (about 1.07 MB combined) enter `dist/`. `scripts/prepare-thunderplain-art.py` reproduces optimization. The existing terrain, horse, furniture, trainer portraits and Tianzhar character artwork are reused. New architecture is painted 3D-style raster art rendered by the existing 2D engine; no new 3D renderer is introduced.

Prompts: transparent Gothic copper conductor tower, basalt/iron/copper/porcelain with warm restrained glow; transparent dark Gothic militaristic abbey, garrison house and records office in orthographic top-down/front perspective; Pate/Trade fatal execution conveyed through non-graphic three-panel comics using `CHR-PATE`, `CHR-TRADE` and `LDR-06` identities; Darius identity-preserving storm variant using `REV-DARIUS`, dark circles, feverish exhausted eyes, wet hair and torn red scarf, no borrowed anime character. No lettering, logos or new creature designs. Optimized sources keep their alpha.

## Verification

`tests/thunderplain.test.mjs` covers every new route, gate return, NPC approach, town door/building collision, legal team moves, finite medicine, unique outcomes across saves, relay rewards and full-screen flash bounds. `tests/thunderplain-browser.cjs` exercises the blocked cart, mountain trail, relay controls, Darius-to-wild battle handoff and reload, enabled capture supplies, unique resolution and inn interaction in Chromium. Existing Botrune, Marasen and browser smoke suites remain required. Browser fixtures simulate battle victory/outcome at authored boundaries; they do not claim a full balance playthrough or physical-phone testing. GitHub Actions tests, signs with the original certificate, verifies alignment and publishes the APK.

## v0.90.14 feedback

`storm-polish.md` supersedes the cart's explicit Darius directions and one-time relay description: the driver now suggests investigating a disturbance, and the relay has a demonstration and repeatable varied supply shifts. The temporary mountain/cart graphics and straight lightning shape are replaced; Glass Scars gains physical vitrified craters. Core story and unique encounters are unchanged.
