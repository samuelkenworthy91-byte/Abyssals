"""Report genuine 60% production, upload, integration and battle-test coverage."""
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'art-library/action-vfx'

def read(path):
    return json.loads(path.read_text())

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def audit():
    scope = read(ART / 'target-60-percent.json')
    runtime = json.loads((ROOT / 'dist/action-vfx-data.js').read_text().split('export const ACTION_ART=', 1)[1].strip().rstrip(';'))
    inventory = read(ROOT / 'docs/move-coverage.json')
    real_ids = {m['id'] for m in inventory['moves']}
    installed = {int(i) for i in runtime}
    assert installed <= real_ids, 'Installed artwork has an unknown move ID'
    assert len(scope['pendingMoveIds']) == len(set(scope['pendingMoveIds'])) == 198
    assert set(scope['pendingMoveIds']) <= real_ids
    prepared = set()
    for manifest in sorted(ART.glob('batch-*/prepared-manifest.json')):
        if int(manifest.parent.name.removeprefix('batch-')) < 8:
            continue  # Published baseline uses its original, already-audited provenance.
        for m in read(manifest)['moves']:
            i = m['id']
            assert i not in prepared, f'Duplicate prepared move {i}'
            assert i in real_ids, f'Unknown prepared move {i}'
            for key in ['source', 'prepared']:
                p = ROOT / m[key]
                assert p.is_file() and sha(p) == m[key+'Sha256'], f'Corrupt {key}: {i}'
            im = Image.open(ROOT / m['prepared']).convert('RGBA')
            assert im.size == (768,768) and im.getextrema()[3] == (0,255), f'Invalid sheet: {i}'
            frames = [im.crop((n%4*192,n//4*192,(n%4+1)*192,(n//4+1)*192)) for n in range(16)]
            assert all(f.getbbox() for f in frames), f'Empty frame: {i}'
            assert len({hashlib.sha256(f.tobytes()).hexdigest() for f in frames}) >= 12, f'Repeated frames: {i}'
            prepared.add(i)
    checks_path = ART / 'integration-checks.json'
    checks = read(checks_path) if checks_path.exists() else {'batches': {}}
    tested = set()
    for batch, check in checks.get('batches', {}).items():
        if check.get('status') != 'passed':
            continue
        for i, digest in check['assetSha256'].items():
            i = int(i)
            choreography = hashlib.sha256(json.dumps(runtime.get(str(i),{}),sort_keys=True,separators=(',',':')).encode()).hexdigest()
            expected_choreography = check.get('choreographySha256',{}).get(str(i))
            if i in installed and sha(ROOT / 'dist' / runtime[str(i)]['src']) == digest and expected_choreography == choreography:
                tested.add(i)
    # Published baseline was verified in v0.90.52; keep it distinct from new tests.
    baseline = {int(i) for i,a in runtime.items() if a.get('batch') not in {f'{n:02d}' for n in range(8,19)}}
    assert len(baseline) == scope['baselineReleasedMoves'] == 133
    tested |= baseline
    upload_path = ART / 'upload-verification.json'
    uploads = read(upload_path) if upload_path.exists() else {'files': {}}
    uploaded = set(baseline)
    for i, a in runtime.items():
        p = ROOT / 'dist' / a['src']
        saved = uploads.get('files', {}).get('dist/'+a['src'])
        if saved and saved['sha256'] == sha(p) and saved.get('remoteBlobSha'):
            uploaded.add(int(i))
    environments = read(ROOT / 'docs/finale-environment-qa.json')['totals']
    complete = installed & tested & uploaded
    result = {
        'totalMoves': scope['totalMoves'], 'target': scope['targetIntegratedTestedMoves'],
        'authoredOrIntegratedUnique': len(prepared | installed),
        'integratedLocally': len(installed), 'uploadedRuntimeVerified': len(uploaded),
        'battleTestedWithCurrentAssetHash': len(tested),
        'createdUploadedIntegratedTested': len(complete),
        'completeMovePercent': round(100*len(complete)/scope['totalMoves'],2),
        'environmentReviewed': environments['approved'], 'environmentTotal': environments['maps'],
        'environmentTechnicalIssues': environments['technicalIssues'],
        'releasedMoveCoverage': scope['baselineReleasedMoves'],
        'milestoneReached': len(complete) >= scope['targetIntegratedTestedMoves'] and environments['approved'] >= scope['targetReviewedEnvironments'] and environments['technicalIssues'] == 0,
        'policy': 'Prompts, unuploaded files and structural checks alone never satisfy finished coverage; artistic review remains a separate ledger.'
    }
    print(json.dumps(result,indent=2))
    return result

if __name__ == '__main__':
    audit()
