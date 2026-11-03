# Batch08 production checkpoint

Twenty-one separately authored move sheets: IDs63–75,77–84. Each has its own action sequence and saved built-in ImageGen prompt. Sources remain unchanged; revisions70,71,75 use versioned source-v2 and prepared-v2 files to remove neighboring-cell fragments. Production records identify selected files and SHA256 hashes.

All21 selected prepared PNGs have768×768 dimensions, sixteen nonempty192×192 frames, true indexed transparency and at least12 distinct frames. Source/packed visual inspection was performed; gameplay approval is pending. See prepared-validation.json and prepared-manifest.json.

This is a source-production checkpoint, not an installed-coverage claim. Published v0.90.52 remains133/614 installed sheets (21.7%). The21 prepared additions bring authored/prepared stock to154/614 (25.1%); they must be installed, registered and verified in actual battles before installed coverage can increase.

Next: install selected prepared files using scripts/install-prepared-action-batches.py08 on a development branch; run full batch single/double-target/reduced-motion/leader recovery QA, visually inspect captures and record honest approvals; rebuild coverage. Prepare a new release version only when a further APK is requested. Preserve all prior approved sheets and the v0.90.52 release scope.

Browser-upload repeat pattern: place files in the existing synchronized scratch path, navigate directly to the correct GitHub branch/directory upload page, select about25 related files via the file chooser, wait for the final file to appear, commit, verify each uploaded Git blob hash against local bytes, and update docs/development-resume.md. Keep generated sources, selected prepared PNGs, prompts, revision reasons and validation together.
