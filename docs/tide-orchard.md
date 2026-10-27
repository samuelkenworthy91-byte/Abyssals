# Tide and Orchard — v0.90.47

Approved families use new stable species IDs 515–519; existing saves and IDs remain unchanged. The live dex contains 518 species. Existing borrowed move labels in the review are mapped below; only real game names are shown to players. New moves are available through family progression and compatible single-use Grand Exchange codices.

| Review label | In-game name | Stable ID |
|---|---|---|
| Water Pulse | Rill Pulse | 742 |
| Focus Breath | Focus Breath | 743 |
| Mist | Veil of Quiet | 744 |
| Undertow Mark | Undertow Mark | 745 |
| Brine Veil | Brine Veil | 746 |
| Brine | Salt in the Wound | 747 |
| Dark Pulse | Nightwater Pulse | 748 |
| Reversal Current | Reversal Current | 749 |
| Calm Mind | Stillwater Meditation | 750 |
| Blackwater Requiem | Blackwater Requiem | 751 |
| Haze | Blank Horizon | 752 |
| Hydro Pump | Deluge Lance | 753 |
| Mirror Coat | Moonlit Reprisal | 754 |
| Gust | Kitten’s Draft | 755 |
| Feather Guard | Downfall Feathers | 756 |
| Berry Supper | Berry Supper | 757 |
| Tailwind | Orchard Updraft | 758 |
| Air Cutter | Shearwind | 759 |
| Leech Seed / Draining Roots | Draining Roots | 760 |
| Orchard Nap | Orchard Nap | 761 |
| Grassy Terrain | Orchard Carpet | 762 |
| Spore Drowse | Spore Drowse | 763 |
| Toxic | Souring Sap | 764 |
| Giga Drain | Heartwood Siphon | 765 |
| Pantry Refill | Pantry Refill | 766 |
| Cotton Guard | Cloudwool Mantle | 767 |
| Breeze Relay | Breeze Relay | 768 |
| Air Slash | Canopy Cleave | 769 |
| Taunt | Goading Glance | 770 |
| Rest | Deep Burrow | 771 |
| Sleep Talk | Dream Murmur | 772 |
| Surf | Widewater Rush | 773 |
| Snarl | Dusk Snarl | 774 |
| Chilling Water | Cooling Rill | 775 |
| Whirlpool | Binding Eddy | 776 |
| Safeguard | Sanctuary Air | 777 |
| Stun Spore | Pollen Snare | 778 |
| Poison Powder | Bitter Pollen | 779 |
| Worry Seed | Wakeful Seed | 780 |
| Defog | Clearcut Breeze | 781 |
| Encore | Refrain Lock | 782 |
| U-turn | Leafbound Exit | 783 |
| Ice Beam | Hoarfrost Lance | 784 |
| Protect | Holdfast | 700 |
| Substitute | Effigy Exchange | 701 |
| Rain Dance | Raincall | 371 |
| Sunny Day | Solar Vigil | 372 |
| Light Screen | Mirror Rampart | 376 |
| Reflect | Iron Curtain | 377 |
| Aromatherapy | Mourning Dew | 717 |

## Habitat plan

| Species | Habitat | Level | Day / Night share | Reason |
|---|---|---|---|---|
| Rillkit | glassSluice | 18–20 | 8% / 5% | Rillkit practises with clear sluicewater in sheltered channels. |
| Undertide | reedSanctuary | 28–30 | 5% / 8% | Undertide patrols the quiet reed banks after dusk. |
| Mournami | sunkenShrine2 | 52–55 | 3% / 6% | Mournami keeps vigil in the flooded cloister; rare shrine guardian habitat. |
| Mewisp | orchardCanopy | 26–28 | 8% / 5% | Mewisp feeds in the sheltered subtropical fruit canopy. |
| Purrchard | orchardVerge | 44–46 | 6% / 3% | Purrchard favours intact fruit groves, away from the firebreak. |
| Purrchard | pilgrimGrove2 | 50–53 | 5% / 5% | A secluded spring terrace provides berries and a safe place to sleep. |

Each table preserves every existing slot and scales its weight proportionally. No global random injection, burning orchard habitat or rare quest replacement. Field Journal locations are generated from the live tables.

## Runtime details

Stillwater counts each direct special hit that actually damages HP. Every third hit queues three standard 50-power special Water strikes; STAB, effectiveness, weather, shields, absorption and the receiving side’s safety floor apply. It costs no action or PP; replies never trigger another Stillwater or Brine Veil. Switching resets the hit counter. A dead user cannot reply.

Berry Pantry makes one roll per living active holder at turn end: 25%, or 75% in any Grassy Terrain. The last terrain turn counts before expiry; Flying does not block this ability bonus. Recovery is unlimited within the battle; the slot must be empty and the berry must have actually been consumed. The berry can activate normally after recovering but cannot cause a second recovery roll that turn. Orchard Carpet lasts five turns, with grounded healing/Grass boosts; Purrchard’s Flying typing remains relevant to those grounded bonuses.

Draining Roots heals the opposing active slot only by actual HP lost. Grass, effigies and protection are respected; switching the rooted target clears roots. Breeze Relay passes remaining effigy HP only, capped at 25% recipient maximum HP; stages and other move states do not pass.

## Graphics and verification

43 newly authored moves have separate hand-drawn vector compositions and distinct timing scores. Four additional passive/residual effects use dedicated drawings. Existing branded moves retain their existing artwork. No new move falls through to the legacy type atlas. The normal art is transparent; shinies reuse the established perceptual recolourer with explicit family palettes. Followers use the same approved full-body drawings, following the existing illustrated-follower renderer.

Automated tests cover passive hit counting, HP floors, no recursion, berry probabilities, final terrain turn, roots, relay, disruption, evolution, habitats and unique graphics coverage. The browser suite exercises all 43 drawings at phone size, real root/terrain buttons, Field Journal sightings, the triggered counter animation and saving. The complete repository regression suite, offline inventory, shiny raster audit and original-key signing run in GitHub Actions.
