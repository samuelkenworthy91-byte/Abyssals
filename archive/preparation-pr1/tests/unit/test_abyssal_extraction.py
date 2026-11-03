"""Regression checks for destructive extraction mistakes, independent of production art."""
import importlib.util
from pathlib import Path
import unittest
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('abyssal_art', ROOT / 'tools/art/process_abyssals.py')
art = importlib.util.module_from_spec(spec)
spec.loader.exec_module(art)

class ExtractionTests(unittest.TestCase):
    def test_white_background_does_not_erase_enclosed_white_art(self):
        rgb = np.full((40, 40, 3), 255, dtype=np.uint8)
        rgb[8:32, 8:32] = [30, 40, 90]
        rgb[16:24, 16:24] = 255  # intentional white armour highlight
        cc = art.sheet_components(rgb, {'annotation_exclusions': [], 'removed_arrow_components': []},
                                  {'background_min_channel': 243, 'background_max_chroma': 16})
        self.assertEqual(cc[0, 0], 0)
        self.assertGreater(cc[20, 20], 0)

    def test_edge_unmixing_preserves_interior_colours(self):
        rgb = np.full((40, 40, 3), 255, dtype=np.uint8)
        rgb[8:32, 8:32] = [180, 20, 160]
        rgb[16:24, 16:24] = [255, 255, 255]
        mask = np.zeros((40, 40), dtype=bool)
        mask[8:32, 8:32] = True
        out = np.array(art.rgba_cutout(rgb, mask))
        np.testing.assert_array_equal(out[12:28, 12:28, :3], rgb[12:28, 12:28])
        self.assertTrue(np.all(out[12:28, 12:28, 3] == 255))
        self.assertEqual(out[0, 0, 3], 0)

    def test_shadow_cleanup_stays_inside_reviewed_floor(self):
        rgb = np.full((40, 40, 3), 255, dtype=np.uint8)
        rgb[4:12, 12:28] = 220  # pale artwork above floor must stay opaque
        rgb[28:34, 4:36] = 220  # neutral shadow on white paper
        mask = np.ones((40, 40), dtype=bool)
        before = art.rgba_cutout(rgb, mask)
        after = np.array(art.unmix_reviewed_shadows(before, rgb, [[0, 24, 40, 40]]))
        self.assertEqual(after[30, 20, 3], 35)
        self.assertEqual(after[8, 20, 3], 255)
        np.testing.assert_array_equal(after[8, 20, :3], rgb[8, 20])

if __name__ == '__main__':
    unittest.main()
