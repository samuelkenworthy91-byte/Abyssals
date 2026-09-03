# Portrait production pipeline

Phase A correction: supplied portraits are production art. Preserve all 91 originals; do not require replacement exact-magenta sources. Current package accounting is 78 named targets, one Severin King Below form variant, five alternates and seven superseded portraits. Reconcile identities and classes against the recovered full portrait manifest in Phase D.

## Cleanup contract

Remove exact #FF00FF background pixels where present. For compression and antialiasing, use source-specific, constrained background masks connected to the image boundary, with reviewed treatment of enclosed background gaps. Near-magenta colour alone is never sufficient to remove interior costume pixels. Preserve full head-to-toe artwork and props. Exclude baked labels with reviewed regions that do not touch the figure. Inspect outputs against originals on light and dark backgrounds and a transparency checkerboard.

The current processor implements only the earlier exact-key gate and is awaiting replacement in Phase D. A rejection by that old gate means processing is unfinished, not that the source portrait is unusable.

## Common canvas and body scale

Current engineering convention: transparent RGBA PNG, 1536×2048, body crown-to-soles height 1536 px, soles baseline y=1920, outer padding at least 64 px. Record source-pixel crown, soles and body-centre anchors. Compute one uniform scale from the body, excluding raised props and costume extensions; preserve aspect ratio and all intentional props. If the convention cannot contain the complete collection at a consistent body scale, revise the shared canvas with measured evidence.

## Runtime release gate

Each output must have a canonical or explicitly unresolved identity, classification (canonical / variant / alternate / superseded), reproducible cleanup parameters/masks and body anchors, source/runtime checksums, and full-body visual QA. Missing targets remain missing. No source image is overwritten. No generated substitutes are allowed.
