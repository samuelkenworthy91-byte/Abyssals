# Portrait pipeline and current gate
All 91 originals are preserved in assets/portraits/source/. Package evidence establishes 78 current targets, one Severin King Below form variant, five alternates and seven superseded C03 portraits. Of the 78 current targets, 77 map to known game IDs; Nharos has only a packaging label. Brann's alternate is a byte-for-byte duplicate. Legacy files are never allowed to overwrite current TRN IDs.

## Measured problem
Every supplied image has opaque border pixels other than RGB (255,0,255). Most have almost no exact-magenta pixels. Even the newly supplied Beric's dominant border is (255,0,254). The JPG Wardens also vary substantially. Simply deleting exact magenta leaves the background; a tolerance would exceed this task's explicit rule. Some sources include baked-in name labels. No clean runtime portraits are claimed or emitted.

## Selected engineering convention
Transparent RGBA PNG canvas: **1536×2048**; common body crown-to-soles height **1536 px**; soles baseline **y=1920**; minimum outer padding **64 px**. This is a reversible asset convention, not a new game-design lock. Record reviewed crown_y, soles_y and body_center_x in source-pixel coordinates. Use body height excluding raised weapons/hats to compute one uniform scale; keep every opaque prop on the canvas. Do not stretch width/height separately or shrink a character just to fit a tall weapon. If any reviewed figure cannot fit, expand the common canvas for the batch or explicitly review the convention.

Exact keying changes alpha only for RGB=(255,0,255); every other source pixel keeps its original channels. Crop only transparent margins. Resize with Pillow LANCZOS and place at the computed baseline/centre. A completely clean source with no label and confirmed full body/props is required before output. A background-border test is a conservative rejection gate, not proof that the whole image is clean; explicit visual review flags remain required.

## Reproduce
```bash
python3 tools/art/process_portraits.py --report .reports/portrait_audit.json
python3 tools/art/process_portraits.py --write --report .reports/portrait_processing.json
npm run validate
```
The current --write run reports blocked records and writes zero image outputs. Planned runtime filenames in the manifest become actual runtime_filename values only after successful output. No original is edited. Processing status and checksums remain reviewable; no placeholders or empty PNGs are used.

## What is needed next
Obtain pristine exact-background originals, or obtain explicit authorization for individually reviewed precise mattes; do not broadly erase similar pink/purple costume colours. Remove baked labels only through a reviewed matte that preserves all body/props. Add body anchors, verify side-by-side scale, run processor and inspect each output against its source on dark/light checkerboards. Keep this work separate from the M1 app shell.
