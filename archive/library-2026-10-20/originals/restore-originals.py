#!/usr/bin/env python3
"""Verify and restore reference-only source files, joining split packs."""
import argparse,hashlib,json
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--verify-only',action='store_true')
p.add_argument('--destination',type=Path,default=Path('recovered-originals'))
a=p.parse_args();base=Path(__file__).resolve().parent
m=json.loads((base/'MIGRATION-INDEX.json').read_text())
for s in m['sources']:
    h=hashlib.sha256();size=0;output=None
    if not a.verify_only:
        assert Path(s['name']).name==s['name'] and s['name'] not in ('.','..')
        a.destination.mkdir(parents=True,exist_ok=True)
        output=(a.destination/s['name']).open('xb')
    try:
        for f in s['files']:
            b=(base/f['name']).read_bytes()
            assert len(b)==f['size_bytes'] and hashlib.sha256(b).hexdigest()==f['sha256'],f['name']
            h.update(b);size+=len(b)
            if output:output.write(b)
        assert size==s['size_bytes'] and h.hexdigest()==s['sha256'],s['name']
    finally:
        if output:output.close()
print(f"Verified {len(m['sources'])} original files ({m['original_bytes']:,} bytes).")
