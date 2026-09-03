# Portrait production pipeline

All 91 supplied originals remain untouched. Classification is unchanged: 78 canonical named targets, one Severin King Below form variant, five alternates retained as references, and seven superseded legacy images retained as source only. Only the 79 selected canonical/variant images enter runtime. The 22 absent targets remain in `data/manifests/portraits.json`; no substitutes are generated.

## Reproduce

With the repository Python environment active:

```bash
python3 tools/art/process_portraits.py --write --report .reports/portrait_processing.json
python3 tools/art/contact_sheets.py --kind portraits --background light
python3 tools/art/contact_sheets.py --kind portraits --background dark
npm run validate
npm test
```

`--drafts` writes review copies without publishing manifest readiness. `--only 0 6` restricts a focused review to stable source-manifest indices. Do not mark output approved until reviewing the full processed set. Review previews remain outside Git.

## Cleanup

`tools/art/portrait_processing.json` stores source hashes, individual body anchors, approved background seeds, label regions and review decisions. Remove exact #FF00FF. Model the actual background using each row's outer four columns, accommodating supplied gradients. Flood only boundary-connected pixels within the recorded tolerance; enclosed gaps require individually reviewed seeds. Tiny compression slivers may be cleared only within four pixels of an approved boundary and within eight RGB units of the background.

The 860 enclosed candidate regions were visually inspected: 848 approved background seeds; 12 retained colour regions. A narrow 6-pixel edge band (8 for complex spectral/halo images) is unmatted using nearby background and interior samples, with a residual gate. Interior costume colours are not globally keyed. Reviewed retained regions preserve source colour. Six individually reviewed floor regions remove magenta shadow contamination without touching the character's upper costume.

Baked captions are removed through reviewed regions while protecting the connected character silhouette, so a decorative label sharing the feet's Y range cannot crop the feet. No inpainting, redrawing, back sprites or generated placeholders are involved. PNGs are written atomically and decoded before publication.

## Canvas and body scale — engineering convention

Transparent RGBA PNG, **2048×2048**; **1536-pixel head-crown-to-soles span**, **soles baseline y=1920**, **body centre x=1024**, minimum outer padding 64. The previous 1536-wide proposal was widened to accommodate Illyr's lateral ribbons at the same body scale. This is a presentation convention, not a claim that all characters have the same canonical physical height.

Each portrait has reviewed source-pixel head crown, soles and body-centre anchors, excluding tall crowns, halos and raised weapons. Apply one uniform scale `1536 / (soles_y - crown_y)` to the complete art, preserving aspect ratio and props. Align the measured body centre and soles; never stretch or individually shrink a character to fit. Robed/spectral figures use the visible foot tip or lowest body hem when feet are intentionally concealed by the production art. Crop only empty transparent space for compositing, then place the whole figure on the shared canvas. Validation checks scale, centre, baseline and padding.

## Identity and release

Canonical runtime filenames use canonical ID plus readable canonical name; the Severin form adds `King_Below`. CORE labels remain source queue aliases. Nharos is the established underworld sovereign; `CHR-NHAROS` follows the existing technical CHR namespace, with explicit source provenance. Superseded legacy names do not become new characters.

The manifest records actual input formats (including JPEG bytes with .png filenames), source/runtime checksums, transformation, processing-configuration checksum and visual approval. `npm run validate` rejects stale configurations, missing files, invalid identities, wrong canvas/scale, clipped padding or unreviewed runtime assets. This does not waive the strict gate's 22 missing portrait targets.
