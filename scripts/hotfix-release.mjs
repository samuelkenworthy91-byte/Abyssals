// A conservative test plan for small, source-only Abyssals releases.
// Full releases remain the default; this file is never packaged in the APK.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

export const PROFILES=Object.freeze({
  battle:{
    unit:['tests/elite-leaders.test.mjs','tests/status-capture.test.mjs','tests/tactical-moves.test.mjs','tests/critical-hit-stages.test.mjs'],
    browser:['tests/elite-leaders-browser.cjs','tests/browser-smoke.cjs']
  },
  audio:{
    unit:['tests/music.test.mjs','tests/music-playlists.test.mjs','tests/soundtrack.test.mjs'],
    browser:['tests/soundtrack-browser.cjs','tests/evolution-music-browser.cjs']
  },
  offline:{
    unit:['tests/offline-redirects.test.mjs','tests/runtime-cache-consistency.test.mjs','tests/playtest-polish.test.mjs'],
    browser:['tests/elite-offline-browser.cjs','tests/browser-smoke.cjs']
  },
  ui:{
    unit:['tests/playtest-polish.test.mjs','tests/battle-animation-setting.test.mjs','tests/collection-access.test.mjs'],
    browser:['tests/browser-smoke.cjs','tests/battle-animation-setting-browser.cjs']
  }
});
export const ALWAYS_UNIT=['tests/runtime-cache-consistency.test.mjs','tests/offline-redirects.test.mjs','tests/hotfix-mode.test.mjs'];
export function unitTests(focus){
  assert(PROFILES[focus],'Unknown hotfix focus: '+focus);
  return [...new Set([...ALWAYS_UNIT,...PROFILES[focus].unit])];
}
export function validateChangedFiles(files,focus){
  assert(PROFILES[focus],'Unknown hotfix focus: '+focus);
  assert(Array.isArray(files)&&files.length>0&&files.length<=50,'Hotfix must modify 1–50 files since the last published release');
  const names=files.map(file=>typeof file==='string'?file:file.filename);
  assert(names.every(name=>typeof name==='string'),'Unexpected GitHub comparison response');
  const code=names.filter(name=>/^dist\/(?:[^/]+\.(?:js|css)|index\.html)$/.test(name));
  assert(code.length>0&&code.length<=15,'Hotfix must change 1–15 root-level runtime JS/CSS/HTML files');
  const allowed=name=>/^dist\/(?:[^/]+\.(?:js|css)|index\.html)$/.test(name)
    || /^tests\/[^/]+$/.test(name)
    || name==='release-config.json'
    || /^docs\/releases\/[^/]+$/.test(name)
    || name==='docs/hotfix-mode.md'
    // Infrastructure-only changes from the first workflow installation are not APK assets.
    || name==='scripts/hotfix-release.mjs'
    || name==='.github/workflows/android-release.yml';
  const forbidden=names.filter(name=>!allowed(name));
  assert.deepEqual(forbidden,[],'Hotfix must not change media, artwork, native wrapper, signing/build scripts or other unrelated paths');
  assert(names.includes('release-config.json'),'Hotfix must carry a new release configuration and version');
  const regressions=names.filter(name=>[...PROFILES[focus].unit,...PROFILES[focus].browser].includes(name));
  assert(regressions.length>0,'Add or update a focused regression test for the hotfix');
  return {code,regressions};
}
export function validateVersion(current,previous){
  const parse=v=>{assert(/^0\.\d{2}\.\d+$/.test(v),'Invalid release version '+v);return v.split('.').map(Number);};
  const a=parse(current.version),b=parse(previous.version);
  assert(a[0]>b[0]||a[0]===b[0]&&(a[1]>b[1]||a[1]===b[1]&&a[2]>b[2]),'Hotfix version must advance beyond the published release');
  assert(Number.isSafeInteger(current.version_code)&&current.version_code>previous.version_code,'Hotfix Android version_code must increase');
}
function api(resource){
  const repo=process.env.GITHUB_REPOSITORY;
  assert(/^[\w.-]+\/[\w.-]+$/.test(repo||''),'GITHUB_REPOSITORY is required');
  return JSON.parse(execFileSync('gh',['api','repos/'+repo+'/'+resource],{encoding:'utf8',maxBuffer:8*1024*1024}));
}
if(process.argv[2]==='verify'){
  const config=JSON.parse(readFileSync('release-config.json','utf8'));
  const focus=process.argv[3];
  assert(PROFILES[focus],'Choose a supported hotfix focus');
  const latest=api('releases/latest');
  assert(/^v0\.\d{2}\.\d+$/.test(latest.tag_name||''),'The last published release must be a versioned GitHub Release');
  const lastConfig=api('contents/release-config.json?ref='+encodeURIComponent(latest.tag_name));
  const previous=JSON.parse(Buffer.from(lastConfig.content.replace(/\s/g,''),'base64').toString('utf8'));
  validateVersion(config,previous);
  const commit=process.env.GITHUB_SHA;
  assert(/^[a-f0-9]{40}$/.test(commit||''),'GITHUB_SHA must point to a real commit');
  const diff=api('compare/'+encodeURIComponent(latest.tag_name)+'...'+commit);
  assert(diff.status==='ahead','Release commit must descend from the latest published release tag');
  const result=validateChangedFiles(diff.files,focus);
  console.log('PASS: focused '+focus+' hotfix, '+result.code.length+' code files, '+result.regressions.length+' changed regression tests; no media/native/signing changes; version '+previous.version+' -> '+config.version);
}
