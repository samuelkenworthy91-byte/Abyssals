"""Attach a public APK signature block only to its exact approved payload."""
import hashlib,json,base64,struct,argparse
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--version',default='0.89.2');version=parser.parse_args().version
root=Path(__file__).resolve().parents[1];receipt=json.loads((root/f'release/v{version}/signature.json').read_text());raw=bytearray((root/f'build/unsigned-{version}.apk').read_bytes());assert hashlib.sha256(raw).hexdigest()==receipt['unsigned_sha256'],'Source differs from signed release payload'
eocd=raw.rfind(b'PK\x05\x06');assert eocd>=0;cd=struct.unpack_from('<I',raw,eocd+16)[0];block=base64.b64decode(receipt['signature_block']);struct.pack_into('<I',raw,eocd+16,cd+len(block));out=raw[:cd]+block+raw[cd:];assert len(out)==receipt['size'] and hashlib.sha256(out).hexdigest()==receipt['signed_sha256']
p=root/'build'/receipt['filename'];p.write_bytes(out);p.with_suffix('.apk.sha256').write_text(receipt['signed_sha256']+'  '+p.name+'\n');print('Rebuilt signed release matches SHA-256:',receipt['signed_sha256'])
