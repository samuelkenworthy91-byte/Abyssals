# CHECKLIST 02 + 03 — LOCKED REFERENCE DECISIONS

Status: LOCKED v1.1 unless explicitly reopened. This revision supersedes v1.0 only where the Checklist 11 story-choice evolution exception changes species-availability and postgame-access wording.

This document consolidates all approved system-level decisions from the combined Checklist 02 (Route & Destination Encounter Tables) and Checklist 03 (World Progression & Functional Map Structure) passes.

## 1. World progression
- The main campaign uses a linear critical spine with local branching, optional routes, secrets and side areas.
- The first visit to every settlement/region must be travelled manually.
- Previously opened routes permit normal physical backtracking unless a specific story event temporarily blocks them.
- Chapters do not automatically require a traditional dungeon. Towns, routes, strongholds, terrain complexes and open regions may fulfil the exploration role.
- Traditional dungeons are spread fairly evenly through the campaign.
- The Nine Circles are a continuous ordered descent and each functions as a full gameplay region.
- The true point of no return is immediately before the final confrontation, after all Circles.

## 2. Fast travel
- Fast travel is represented as paid carriage travel in the mortal world.
- A settlement's carriage stop only unlocks after the player physically reaches the town and introduces himself to that town's courier.
- Carriage travel costs a small, non-zero fare. Exact prices belong to economy tuning.
- Players may always walk instead.
- Carriage stops are primarily at settlements/major safe hubs, not every cave or dungeon entrance.
- Carriage travel does not operate in Hell.
- Recurring courier gag: every courier looks effectively identical to the others but is technically a different person with a similar/rhyming name (Barry, Larry, Gary, Harry, etc.), and each insists they have never met Aimon before.

## 3. Traversal
- There is no HM-style traversal and no requirement to carry a particular Abyssal for world access.
- World gates use physical/story mechanisms such as locked gates, repaired bridges, rubble clearance, lifts, drains, permissions, mechanisms and supernatural barriers.
- Initially inaccessible areas should be visibly blocked rather than hidden behind arbitrary invisible walls.
- One-way transitions are rare and must always lead onward safely or eventually unlock a return shortcut.
- A permanent personal watercraft is unlocked after Philomere.
- Working concept: compact Wayfarer Skiff or setting-appropriate equivalent.
- It deploys only from readable water-access points and permits travel across designated rivers, lakes, coastal shallows and flooded routes.
- Earlier regions may visibly contain inaccessible water routes so the unlock immediately creates meaningful backtracking.

## 4. Settlements and services
- Ordinary inhabited settlements are safe from random encounters unless explicitly changed by story-state invasion/corruption.
- Every major settlement provides:
  - full healing
  - ordinary supplies
  - reserve/storage access
  - carriage courier
  - local NPC information
  - at least one region-specific service/shop/reward source
- The shared reserve roster can be represented by different local NPCs/facilities.
- Civeton contains the principal memorial location.
- Town restoration changes gameplay as well as visuals: NPCs, dialogue, shops, quests, shortcuts, carriage access, nearby encounter tables, rare access and leader-choice consequences may change.
- Restoration must never permanently remove an Abyssal from obtainable circulation.

## 5. Route scale and optional content
- Major chapters generally comprise an approach/travel component, a settlement/region component and a climax component, without requiring exactly three maps.
- Named routes are substantial regions rather than tiny connector maps.
- A critical path through a major route should usually take roughly 5–10 minutes without battles, while optional exploration can extend it.
- Most major outdoor regions contain roughly 2–4 encounter habitats.
- Optional areas are distributed unevenly; later regions generally become richer in side exploration.
- Some Abyssals may only be obtainable in optional areas.
- Some ordinary Abyssals may be genuinely rare and restricted to one or two locations.
- Avoid stacking extreme rarity with a tiny single habitat in a way that makes completion unreasonable.
- Cleared regions may later gain permanent cross-links/shortcuts opened from the far side.

## 6. Encounter model
- Wild encounters are random rather than visible roaming enemies.
- Encounter-enabled habitats are visually readable where practical.
- Caves/tunnels/ruins use step-based random encounters in normal traversal spaces.
- Encounters are suppressed at safe thresholds, major dialogue/rest/shop areas, active puzzle interactions and cleared boss arenas.
- Every encounter table totals exactly 100%.
- Each habitat can have its own table.
- Each encounter-enabled habitat has separate DAY and NIGHT tables.
- The world alternates every 10 real-time minutes: 10 minutes day, then 10 minutes night, repeating.
- The active table is determined when the encounter begins.
- In Hell, the same mechanical cycle continues but is represented as metaphysical Pale/Dark phases rather than literal daylight.
- Day/night exclusivity is selective and concept-driven rather than forced onto every species.
- Wild levels are authored and never dynamically scale with the player's party.
- Encounter ecology follows habitat and species concept rather than universal rarity labels.

## 7. Encounter rates and rarity
- Encounter frequency uses Low / Normal / High presets.
- Rough tuning target: approximately 6% / 10% / 14% per eligible movement step, but final numbers are implementation tuning rather than immutable canon.
- Design rarity bands:
  - Common: 20%+
  - Uncommon: 8–19%
  - Rare: 2–7%
  - Extremely Rare: under 2%
- Extremely Rare slots should be used sparingly rather than mandated on every table.
- Rare encounters should generally be only about +1 to +3 levels above regional norms.
- Dramatically stronger foes should be authored special encounters rather than random spikes.

## 8. Repel-equivalent
- The repel mechanic is a permanent toggleable key device rather than a consumable.
- Working concept: a Resonator that emits a frequency which discourages weaker Abyssals.
- When active, wild encounters are suppressed if the generated wild Abyssal is at least 5 levels below the first living Abyssal in the party.
- Mechanical rule: suppress if wild level <= lead living party Abyssal level - 5.
- Stronger or closer-level Abyssals may still attack.
- Exact final device name/presentation may be polished later.

## 9. Species availability
- Evolution families normally remain ecologically connected unless lore/design explicitly justifies a habitat shift.
- Early and midgame regions primarily contain first-stage forms.
- Evolved forms increasingly appear naturally in later dangerous areas.
- All 187 Abyssals remain theoretically obtainable on one save by the end of the postgame collection path.
- Main-game exception: the four Checklist 11 story-choice families are branch-locked. For each family, the player's story decision makes only the chosen evolved branch obtainable/evolvable before the finale. The opposite final form is deliberately unavailable throughout the main game.
- Therefore, with the current 187-species roster, a single save can obtain 183/187 species before the finale: every species except the four unchosen story-branch final forms.
- Availability continues into early Hell rather than ending at Ramelle.
- Target availability curve for main-game-eligible species:
  - Ramelle / Old Catacombs: roughly 90–93%
  - Circle I: roughly 96–98%
  - end of Circle II: 100% of the save's main-game-eligible species theoretically obtainable
- Circles III–IX can improve odds, provide evolved forms, stronger populations and alternate habitats, but cannot be the first-access gate for any main-game-eligible species.
- Hidden areas may provide exclusive species, improved odds, fossil material, mythic clues or other dex rewards.
- The four unchosen story-branch final forms are the only authorised exception to the old "all 187 before the finale" rule.

## 10. Fossils and mythics
- Fossil Abyssals are initially acquired through fossil discovery/restoration, not normal random encounters.
- All fossil species remain obtainable before the end of the main campaign.
- Postgame includes a Jurassic-Park-like ancient ecosystem where living fossil Abyssals can be encountered in the wild.
- Mythics are bespoke authored encounters rather than normal random encounters.
- Mythics may depend on story state, night/day phase, optional exploration or special conditions, but must still be obtainable before the finale if their requirements are met.
- The Checklist 11 branch-lock exception does not change fossil or mythic main-game availability.

## 11. Hell traversal
- Each Circle generally contains:
  - safe threshold
  - main traversal region
  - optional branches
  - Warden domain
  - exit/descent
- Defeating a Warden unlocks permanent local shortcuts.
- A central underworld transit mechanism later allows travel among cleared Circles.
- Safe thresholds between Circles provide healing, reserve access, party management/save functions and potentially a restricted essentials vendor.
- The player remains able to return to mortal-world optional content before the final point of no return.

## 12. Postgame
- Postgame normally adds new hunting environments and stronger alternate habitats rather than first access to species.
- Explicit Checklist 11 exception: Primeval Reach provides first access to the four evolved story-branch forms that were excluded by that save's main-game choices.
- These opposite branch forms are obtained directly as postgame encounters/captures. Their appearance does not reopen, reverse or replace the story decision that controlled evolution during the main game.
- Primeval Reach remains the postgame ancient ecosystem for living fossil Abyssals as well as the completion route for the four unchosen story-branch finals.
- No species other than those four unchosen story-branch finals may be made postgame-exclusive without an explicit future revision.
- The Old Catacombs later reopen into a reordered underworld leading to Severin Vale / King Below content.

## 13. Governance
These rules are canonical reference decisions. Exact art, dimensions, decorative props, final route names, exact prices, exact encounter percentages and exact per-species tables may still be tuned without reopening the core systems above.

### v1.1 supersession note — Checklist 11 story-branch exception
This revision supersedes only the former statements that all 187 species must be obtainable before the finale and that postgame can never provide first access to a species. The narrow exception is limited to the four mutually exclusive story-choice evolution families: Censmoke, Cairant, Flaggrim and Jerbune. All other species retain the previous main-game availability contract.
