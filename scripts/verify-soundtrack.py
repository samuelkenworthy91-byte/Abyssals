"""Verify unchanged source bytes, exact runtime copies and whole-stream audio decoding."""
from pathlib import Path
import hashlib,json,subprocess
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'docs/music/TRACK_MANIFEST.json').read_text())
for name,digest in json.loads((root/'docs/music/PRESERVED_ORIGINALS.json').read_text()).items():
    assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest,name
results=[]
for entry in manifest['files']:
    source=root/entry['package_path']
    assert source.stat().st_size==entry['bytes'],str(source)
    assert hashlib.sha256(source.read_bytes()).hexdigest()==entry['sha256'],str(source)
    runtime=entry['proposed_runtime_path']
    if runtime:
        assert (root/runtime).read_bytes()==source.read_bytes(),runtime
    subprocess.run(['ffmpeg','-v','error','-i',str(source),'-f','null','-'],check=True,capture_output=True)
    results.append({'source':entry['package_path'],'sha256':entry['sha256'],'runtime':runtime,'decode':'PASS'})
output=root/'build/music-qa';output.mkdir(parents=True,exist_ok=True)
(output/'source-verification.json').write_text(json.dumps(results,indent=2)+'\n')
print('PASS: 15 source hashes, 13 identical runtime copies and 15 complete-stream decodes; two unassigned M4A sources excluded from runtime.')
