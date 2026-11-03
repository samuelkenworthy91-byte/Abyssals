import importlib.util
import json
from pathlib import Path
import unittest
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[2]
def module(name,path):
    spec=importlib.util.spec_from_file_location(name,ROOT/path)
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);return mod
v=module('consolidation_validation','tools/validation/validate.py')
r=module('source_reconciliation','tools/validation/reconcile_sources.py')

class ConsolidationTests(unittest.TestCase):
    def schema(self,name):return Draft202012Validator(json.loads((ROOT/f'data/schemas/{name}.schema.json').read_text()))
    def test_complete_source_reconciliation(self):
        errors,counts=r.reconcile(ROOT)
        self.assertEqual(errors,[])
        self.assertEqual(counts['encounter_slots'],864)
        self.assertEqual(counts['learnset_entries'],1893)

    def test_numeric_move_references_are_checked(self):
        errors=[]
        v.validate_references({'move_ids':[1,354,355]}, {'moves':set(range(1,355))},errors)
        self.assertEqual(len(errors),1)
        self.assertIn('355',errors[0])

    def test_move_id_must_use_canonical_integer(self):
        row=json.loads((ROOT/'data/moves/moves.json').read_text())['records'][0]
        self.assertFalse(list(self.schema('move').iter_errors(row)))
        row['id']='1'
        self.assertTrue(list(self.schema('move').iter_errors(row)))

    def test_entry_learn_level_zero_is_legal_negative_is_not(self):
        row={'id':'test','species_id':'001','move_id':310,'method':'SIGNATURE','level':0}
        self.assertFalse(list(self.schema('learnset').iter_errors(row)))
        row['level']=-1
        self.assertTrue(list(self.schema('learnset').iter_errors(row)))

    def test_encounter_null_species_requires_resolver(self):
        row=json.loads((ROOT/'data/encounters/tables.json').read_text())['records'][0]
        row['slots'][0]['species_id']=None
        self.assertTrue(list(self.schema('encounter').iter_errors(row)))

    def test_strict_counts_include_moves_and_encounters(self):
        counts={k:set(range(n)) for k,n in [('species',187),('evolutions',98),('learnsets',1893),('types',18)]}
        errors=[];v.content_counts(counts,errors)
        self.assertTrue(any('moves requires 354' in e for e in errors))
        self.assertTrue(any('tables requires 144' in e for e in errors))

    def test_source_originals_not_used_as_runtime_art(self):
        for kind in ['abyssal_art','portraits']:
            for row in json.loads((ROOT/f'data/manifests/{kind}.json').read_text())['records']:
                if row['runtime_filename']:
                    self.assertIn('/runtime/',row['runtime_filename'])
                    self.assertNotEqual(row['source_filename'],row['runtime_filename'])

if __name__=='__main__':unittest.main()
