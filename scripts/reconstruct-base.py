from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1];folder=root/'release/v0.89.1';m=json.loads((folder/'manifest.json').read_text());(root/'build').mkdir(exist_ok=True)
p=root/'build'/m['filename']
with p.open('wb') as out:
 for part in m['parts']:
  b=(folder/part['name']).read_bytes();assert hashlib.sha256(b).hexdigest()==part['sha256'];out.write(b)
assert hashlib.sha256(p.read_bytes()).hexdigest()==m['sha256'];print('Native base recovered and verified')
