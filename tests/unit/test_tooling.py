import importlib.util
import json
from pathlib import Path
import unittest
from PIL import Image
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[2]
def module(name,rel):
    spec=importlib.util.spec_from_file_location(name,ROOT/rel)
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);return mod
v=module('validation','tools/validation/validate.py')
art=module('portrait_processing','tools/art/process_portraits.py')

class IntegrityTests(unittest.TestCase):
    def test_reject_duplicate_json_keys(self):
        with self.assertRaises(ValueError):json.loads('{"id":1,"id":2}',object_pairs_hook=v.reject_duplicate_keys)

    def test_reject_duplicate_entity_ids(self):
        errors=[];v.unique([{'id':'A'},{'id':'A'}],'id','fixture',errors);self.assertTrue(errors)

    def test_nested_references_resolve_or_fail(self):
        errors=[]
        v.validate_references({'team':[{'species_id':'S1','move_ids':['M1'],'held_item_id':'I1'}],'area_id':'A1'}, {'species':{'S1'},'moves':{'M1'},'items':{'I1'},'areas':{'A1'}},errors)
        self.assertFalse(errors)
        v.validate_references({'team':[{'species_id':'missing','move_ids':['bad']}],'scene_id':'bad_scene'}, {},errors)
        self.assertEqual(len(errors),3)

    def test_path_escape_rejected(self):
        with self.assertRaises(ValueError):v.resolve_path(ROOT,'../outside.png')

    def test_partial_source_does_not_pass_content_count(self):
        errors=[];v.content_counts({'species':set()},errors);self.assertTrue(any('187' in e for e in errors))

    def test_malformed_species_rejected_by_schema(self):
        schema=json.loads((ROOT/'data/schemas/species.schema.json').read_text())
        invalid={'id':'fixture','dex_number':188,'name':'fixture','base_stats':{},'types':[],'capture_rate':0}
        self.assertGreaterEqual(len(list(Draft202012Validator(schema).iter_errors(invalid))),3)

    def test_complete_trainer_cannot_have_null_team(self):
        schema=json.loads((ROOT/'data/schemas/trainer.schema.json').read_text())
        row={'id':'fixture','character_id':'fixture','name':'fixture','trainer_class_id':None,'ai_tier':None,'team':None,'status':'complete'}
        self.assertTrue(list(Draft202012Validator(schema).iter_errors(row)))

    def test_missing_dataset_cannot_contain_fake_records(self):
        schema=json.loads((ROOT/'data/schemas/dataset.schema.json').read_text())
        row={'schema_version':1,'status':'missing_source','sources':[],'records':[{'id':'invented'}],'unresolved':['missing']}
        self.assertTrue(list(Draft202012Validator(schema).iter_errors(row)))

class PortraitTests(unittest.TestCase):
    def test_only_exact_magenta_loses_alpha(self):
        im=Image.new('RGBA',(4,1));pixels=[(255,0,255,255),(255,0,254,255),(128,0,128,255),(20,30,40,100)];im.putdata(pixels)
        out,n=art.remove_exact_magenta(im)
        self.assertEqual(n,1);self.assertEqual(list(out.get_flattened_data()),[(255,0,255,0),*pixels[1:]])

    def test_nonexact_border_fails_closed(self):
        im=Image.new('RGB',(20,30),(255,0,254))
        self.assertFalse(art.inspect(im)['background_gate_passed'])
        with self.assertRaises(ValueError):art.normalize(im,{'reviewed_full_body_and_props':True,'reviewed_no_baked_text':True})

    def test_body_scale_preserves_proportions_and_baseline(self):
        im=Image.new('RGB',(100,200),(255,0,255))
        for y in range(20,181):
            for x in range(40,61):im.putpixel((x,y),(40,60,90))
        anchors={'crown_y':20,'soles_y':180,'body_center_x':50,'reviewed_full_body_and_props':True,'reviewed_no_baked_text':True}
        out,t=art.normalize(im,anchors)
        self.assertEqual(out.size,art.CANVAS);self.assertEqual(t['scale'],9.6)
        self.assertEqual(t['offset'][1]+round((180-20)*9.6),art.BASELINE)
        self.assertIsNotNone(out.getchannel('A').getbbox())

    def test_props_never_silently_cropped_or_shrink_body(self):
        im=Image.new('RGB',(300,200),(255,0,255))
        for x in range(1,299):im.putpixel((x,80),(10,20,30))
        for y in range(20,181):im.putpixel((150,y),(10,20,30))
        anchors={'crown_y':20,'soles_y':180,'body_center_x':150,'reviewed_full_body_and_props':True,'reviewed_no_baked_text':True}
        with self.assertRaisesRegex(ValueError,'Props do not fit'):art.normalize(im,anchors)

if __name__=='__main__':unittest.main()
