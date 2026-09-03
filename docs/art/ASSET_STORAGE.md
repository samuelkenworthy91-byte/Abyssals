# Asset storage decision
This import uses ordinary Git, with binary attributes and immutable source originals. Supplied member bytes total 166,736,077 (159.0 MiB); largest individual file is 2,297,518 bytes (2.2 MiB). No new ZIPs, processing previews, environments or caches are committed.

Git LFS was assessed but is not required for this bounded snapshot. Ordinary Git makes every source directly available to coding-agent clones without a separate LFS download dependency. GitHub blocks individual files above 100 MiB; all imported members are much smaller. [GitHub file-size guidance](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

Reassess before adding large PSDs, audio/video or many revised high-resolution versions. LFS keeps pointers in Git and image bytes separately, so any adoption must configure .gitattributes, upload actual LFS objects, verify a fresh clone with `git lfs install` and `git lfs pull`, and set CI checkout LFS support. Do not commit pointer files without accessible objects. [GitHub LFS documentation](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage).

No LFS setup is needed for this branch. Phase C adds the reviewed 187 runtime PNG fronts (approximately 67 MiB). This remains a bounded snapshot with individual files well below the existing largest source portrait. PWA packaging should include necessary runtime assets, never source sheets or archived design documents.

Phase D adds 79 normalized portrait PNGs (approximately 120 MiB). The complete source/runtime snapshot remains below 400 MiB, with no individual file near GitHub’s limit. Ordinary Git remains appropriate for this preparation snapshot; reassess before repeated high-resolution art revisions. Runtime PNGs are masters for the future asset build, which may add lossless/visually validated delivery formats without replacing these originals.
