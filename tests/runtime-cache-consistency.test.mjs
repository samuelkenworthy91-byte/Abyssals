import assert from 'node:assert/strict';
import fs from 'node:fs';
const version=JSON.parse(fs.readFileSync('release-config.json','utf8')).version;
const refs=new Map();
for(const file of fs.readdirSync('dist').filter(f=>f.endsWith('.js'))){
 const source=fs.readFileSync('dist/'+file,'utf8');
 for(const m of source.matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.{1,2}\/[^'"]+\.js)(\?[^'"]*)?['"]/g)){
  const params=new URLSearchParams(m[2]?.slice(1));assert.equal(params.get('v'),version,file+' imports stale '+m[1]);
  const versions=refs.get(m[1])||new Set();versions.add(m[2]||'');refs.set(m[1],versions);
 }
}
assert([...refs.values()].every(s=>s.size===1),'one cache identity per shared module');
const html=fs.readFileSync('dist/index.html','utf8');assert(html.includes('app.js?v='+version)&&html.includes('pwa.js?v='+version));
console.log('PASS: shared runtime modules and entry points use one release cache identity; party state cannot split across versioned imports.');

