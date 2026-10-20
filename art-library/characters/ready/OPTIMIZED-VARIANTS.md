# Lossless character variants

`CHR-PATE.webp` and `CHR-TRADE.webp` are smaller, lossless versions of the corresponding PNG portraits in this directory. Each is 1086 × 1448 pixels. Decoding and comparing all RGBA bytes confirmed that every pixel, including transparency, is identical to its PNG source.

| Character | PNG bytes | WebP bytes | Reduction |
| --- | ---: | ---: | ---: |
| Pate | 964,059 | 671,058 | 30.4% |
| Trade | 1,117,751 | 751,196 | 32.8% |

The PNG sources remain available. Both variants are development references outside `dist/` and add no bytes to the APK. When needed in the live game, copy only the selected, appropriately sized asset into `dist/`.
