import assert from 'node:assert/strict';
import {PROFILES,ALWAYS_UNIT,unitTests,validateChangedFiles,validateVersion} from '../scripts/hotfix-release.mjs';
assert.deepEqual(Object.keys(PROFILES).sort(),['audio','battle','offline','ui']);
for(const focus of Object.keys(PROFILES)){
  assert(unitTests(focus).includes('tests/runtime-cache-consistency.test.mjs'));
  assert(unitTests(focus).includes('tests/offline-redirects.test.mjs'));
  assert(unitTests(focus).includes('tests/hotfix-mode.test.mjs'));
  assert(PROFILES[focus].browser.length>0);
  assert(PROFILES[focus].unit.every(test=>unitTests(focus).includes(test)));
}
assert(ALWAYS_UNIT.length>=3);
const basic=['dist/app.js','tests/elite-leaders-browser.cjs','release-config.json'];
assert.equal(validateChangedFiles(basic,'battle').regressions.length,1);
assert.equal(validateChangedFiles(['dist/music.js','tests/music-playlists.test.mjs','release-config.json'],'audio').code.length,1);
assert.throws(()=>validateChangedFiles([...basic,'dist/assets/music/track.mp3'],'battle'));
assert.throws(()=>validateChangedFiles([...basic,'dist/assets/025.webp'],'battle'));
assert.throws(()=>validateChangedFiles([...basic,'release/v0.89.1/manifest.json'],'battle'));
assert.throws(()=>validateChangedFiles([...basic,'scripts/sign-update.py'],'battle'));
assert.throws(()=>validateChangedFiles([...basic,'.github/workflows/patch-checks.yml'],'battle'));
assert.throws(()=>validateChangedFiles(['dist/app.js','release-config.json'],'battle'),'A regression test must change');
assert.throws(()=>validateChangedFiles(['tests/elite-leaders-browser.cjs','release-config.json'],'battle'),'Runtime must change');
assert.throws(()=>validateChangedFiles(basic,'audio'),'Wrong profile regression');
assert.throws(()=>validateChangedFiles(Array.from({length:51},()=>basic[0]),'battle'));
validateVersion({version:'0.90.60',version_code:155},{version:'0.90.59',version_code:154});
assert.throws(()=>validateVersion({version:'0.90.59',version_code:155},{version:'0.90.59',version_code:154}));
assert.throws(()=>validateVersion({version:'0.90.60',version_code:154},{version:'0.90.59',version_code:154}));
assert.throws(()=>unitTests('anything'));
console.log('PASS: hotfix profiles preserve save/offline checks and reject binary/native/script changes, missing regressions and non-incrementing versions.');
