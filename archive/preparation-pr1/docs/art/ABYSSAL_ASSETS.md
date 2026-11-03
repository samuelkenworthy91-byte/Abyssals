# Abyssal artwork: 187 canonical fronts

All **89 original WebP sheets** remain byte-identical under `assets/abyssals/source/`. The 187 named figures map to the canonical numeric Dex and 98 evolution links. `data/manifests/abyssal_art.json` maps every species to its source checksum, figure position, extraction configuration, runtime filename/checksum and canvas transform.

Runtime files live under `assets/abyssals/runtime/abyssal_<three-digit-Dex>_<name>.png`. Each is RGBA, **1024 × 1024**, centred horizontally, with its complete artwork ending at y=976 (48 pixels of bottom padding). Artwork fits within 944 × 944, preserving aspect ratio. Native source pixels are retained without enlargement; only figures exceeding that envelope are reduced with Lanczos. Source sheets share one resolution, so this keeps their drawn size relationships instead of making small first forms fill the canvas like large evolved forms. This is a technical presentation convention, not newly invented species heights. Future battle layout must use the canvas transform and retain relative scale.

The reproducible configuration is `tools/art/species_extraction.json`. It records source hashes, selected connected components, reviewed annotation exclusions, enclosed-background seeds and limited ground-shadow regions. OCR assisted locating labels during audit; reproduction does not require OCR and does not reinterpret identities.

Processing removes boundary-connected near-white paper, reviewed name/type strips and evolution arrows. Enclosed white regions are inspected individually: background gaps become transparent; eyes, reflective armour, pale fur, ice, fire cores and intentional effects remain. White antialiasing is unmixed only along a two-pixel exterior band. Within reviewed floor rectangles, boundary-connected neutral shadows are converted from white-matted shading to translucent shadows; dark outlines prevent the flood entering the figure. No drawing, generated replacements, mirrored art or back sprites are used. Rocks, scenic bases, detached effects and props that belong to the supplied figure are preserved.

The Flaggrim sheet contains two additional unlabelled illustrations. They remain preserved in the source and recorded as supplemental, unassigned artwork; they are not two new species. The three named figures supply Flaggrim, Oriflamme and Tattereign. Regalisk’s printed strip adds Flying; the locked Dex controls its actual Poison/Dragon types. Runtime extraction removes that strip without changing the source.

## Reproduce and inspect

With the preparation virtual environment activated:

```bash
python3 tools/art/process_abyssals.py
python3 tools/art/process_abyssals.py --write
python3 tools/art/contact_sheets.py --kind abyssals
npm run validate
```

The first command produces drafts in `.reports/abyssal_drafts/`. The second requires all 187 configuration records to have completed visual review and updates the runtime manifest. Contact sheets fit each figure into a review cell; they are for checking extraction, **not comparing displayed scale**. Review full runtime canvases at the same zoom to compare scale. Generated previews stay untracked.

Never rerun the earlier Phase B identity importer over enriched data without reviewing its output. It is a source-extraction snapshot, not the downstream asset pipeline.
