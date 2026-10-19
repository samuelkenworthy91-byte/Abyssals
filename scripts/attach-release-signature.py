"""Attach a public APK signature block only to its exact approved payload."""
import hashlib,json,base64,struct
from pathlib import Path
root=Path(__file__).resolve().parents[1];receipt=json.loads((root/'release/v0.89.2/signature.json').read_text());raw=bytearray((root/'build/unsigned-0.89.2.apk').read_bytes());assert hashlib.sha256(raw).hexdigest()==receipt['unsigned_sha256'],'Source differs from signed release payload'
eocd=raw.rfind(b'PK\x05\x06');assert eocd>=0;cd=struct.unpack_from('<I',raw,eocd+16)[0];block=base64.b64decode(receipt['signature_block']);struct.pack_into('<I',raw,eocd+16,cd+len(block));out=raw[:cd]+block+raw[cd:];assert len(out)==receipt['size'] and hashlib.sha256(out).hexdigest()==receipt['signed_sha256']
p=root/'build'/receipt['filename'];p.write_bytes(out);p.with_suffix('.apk.sha256').write_text(receipt['signed_sha256']+'  '+p.name+'\n');print('Rebuilt signed release matches SHA-256:',receipt['signed_sha256'])
