# Egg Pouch upgrades and Willowglass through-road — v0.90.37

Philomere’s apothecary and later general stores sell five sequential permanent upgrades: 10k → 4 eggs, 20k → 5, 40k → 6, 80k → 8, 160k → 10. Total investment is 310k. Older saves retain their initial three slots. The optional nursery.pouchTier is validated as an integer 0–5. Purchases reject stale confirmations and retain the normal save-failure rollback.

## Route and controls

The main route is now Philomere → Willowglass Viaduct → Rivercause Road, in both directions. Philomere’s original eastern gate and story-lock action are retained; its target is the bridge. Rivercause’s western gate returns to the eastern bridge landing. The former southern garden entrance and its decorative arch have been removed. Optional ferries retain their existing routes.

The normal 432×288 tile grid projects onto a fixed 768×512 aerial scene. Landings (36,144) and (396,144) remain exactly 360 real movement steps apart. Both full-height edge strips are walkable exit zones, with broad tap targets that work anywhere vertically along either side, including the camera’s letterboxing. A tap walks Aimon to the landing and transitions to the adjoining screen. Tapping the current landing exits immediately without awarding steps. The central marsh remains blocked; the painted deck is the walking route.

Exact gate-tile taps take priority over nearby follower conversations, preventing the follower behind Aimon from swallowing the return-gate click. Direction plaques and large edge chevrons name Philomere and Rivercause Road. Aimon’s scene scale rises from 0.4 to 0.75 and the follower from 0.22 to 0.36. Bridge steps take one third of their previous time: a fresh crossing is approximately 12 seconds running or 24 walking. Other maps retain their normal speed. Companion placement now respects each room’s grid dimensions.

## Progress and compatibility

Movement, egg progress, companion/escort steps and persistence all use the existing completed-step path. Ten carried eggs advance together; normal eggs still need 512 steps and Warmer eggs 384. No steps are awarded for entry, taps, loading, idling or transition itself. Existing eggs, upgrades, player positions and quest outcomes remain intact.

The original abbess fate gate is checked at both Philomere’s eastern exit and the bridge’s onward exit, so a legacy save from the former optional bridge cannot bypass the story. Bridge objectives direct locked legacy players back to Philomere. Save transfer retains room-specific coordinate validation.

## Validation

Source checks cover all pouch tiers, ten eggs, save validation, both 360-step routes, both full-height edges, endpoint taps, through-route targets, story-lock action, expected travel times and follower placement. Phone Chromium checks buy every upgrade, create ten eggs, enter through Philomere’s original eastern gate, tap high and low edge locations, pause/export/reload mid-crossing, reach Rivercause, return through the bridge into town, hatch an egg and verify the original story gate remains locked without the abbess’s fate.

## Art production

Final runtime asset: `dist/assets/scenery/willowglass-marsh-v09036.webp` (1536×1024, optimized WebP quality 94). Generated with the built-in image-generation tool, then encoded for game packaging. The unchanged generated PNG is the source; no recolouring or generative post-edit was applied.

Prompt: “Final playable 2D environment background for Abyssals, landscape 3:2. Exceptionally high-end picturesque pixel art: a beautiful old weathered wooden pedestrian bridge over a vast ethereal swampy marshland. Very high aerial three-quarter view, whole long bridge and both landings visible. Straight horizontal unobstructed deck centered in the image, landings near 8.33% and 91.67% width. Wooden uprights, ornate timber trusses and crossbracing, aged mossy planks, woven ivy around uprights and over the sides, restrained warm lanterns and carved details. Sprawling wetlands, evergreen trees on mossy hummocks and islands receding into blue-green mist, still teal pools, silver water channels, reeds, lily pads, fine grasses, pale glimmers and low fog ribbons. Premium narrative indie RPG environment, lush detailed 16/32-bit pixel illustration, crisp deliberate pixel clusters, natural material detail and painterly colour composition. Quiet moss green, evergreen, muted teal, warm wood and pale gold. No characters, monsters, lettering, UI, logo, watermark, grid or border. Avoid flat geometric placeholders, vector art and photorealistic 3D.”
