import copy,importlib.util,json,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('gate',ROOT/'scripts/verify-art-release-scope.py');gate=importlib.util.module_from_spec(spec);spec.loader.exec_module(gate)
class ScopeTests(unittest.TestCase):
 def setUp(self):
  self.cfg=gate.read('release-config.json')
  if self.cfg.get('artwork_release_mode')!='interim':self.skipTest('Full release uses complete-artwork gates')
  self.scope=gate.read(self.cfg['artwork_scope_path']);self.coverage=gate.read('docs/move-coverage.json');self.env=gate.read('docs/finale-environment-qa.json')
 def check(self):return gate.validate(self.scope,self.cfg,self.coverage,self.env)
 def test_valid_checkpoint(self):self.assertEqual(self.check()['dedicated'],self.scope['expectedDedicatedSheets'])
 def test_changed_image_hash_rejected(self):
  self.scope['moves'][0]['sha256']='0'*64
  with self.assertRaises(AssertionError):self.check()
 def test_missing_move_rejected(self):
  self.scope['moves'].pop()
  with self.assertRaises(AssertionError):self.check()
 def test_wrong_version_rejected(self):
  self.scope['releaseVersion']='0.0.0'
  with self.assertRaises(AssertionError):self.check()
 def test_unapproved_map_rejected(self):
  self.env=copy.deepcopy(self.env);next(m for m in self.env['maps'] if m['id']=='sporeRim')['status']='requires-review'
  with self.assertRaises(AssertionError):self.check()
if __name__=='__main__':unittest.main()

