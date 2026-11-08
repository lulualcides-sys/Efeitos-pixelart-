import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {MOVE_IDS} from '../src/build-move-six-v5.mjs';
import {V6_MATERIAL_NAMES,V6_SPRITE_COUNT_BY_MOVE,V6_PROVENANCE} from '../src/move-six-v6.js';

test('Arsenal Effekseer textures: real CC0 PNGs pinned and verified by SHA-256',()=>{
 const pack=JSON.parse(readFileSync('assets/vendor/effekseer-v6/manifest.json','utf8'));
 assert.equal(pack.upstreamCommit,V6_PROVENANCE.revision);
 assert.equal(pack.sourceLicense,'CC0');
 assert.equal(pack.approved,false);
 assert.equal(pack.gameIntegrationEnabled,false);
 assert.equal(pack.files.length,11);
 assert.deepEqual(pack.files.map(x=>x.name).sort(),
  V6_MATERIAL_NAMES.map(x=>x+'.png').sort());
 for(const f of pack.files){
  const b=readFileSync('assets/vendor/effekseer-v6/'+f.name);
  assert.deepEqual([...b.subarray(0,8)],[137,80,78,71,13,10,26,10],f.name+' real PNG not LFS pointer');
  assert.ok(b.length>200&&b.length<6*1024*1024,f.name+' bound');
  assert.equal(b.length,f.size);
  assert.equal(createHash('sha256').update(b).digest('hex'),f.sha256,f.name+' stable bytes');
  assert.equal(b.readUInt32BE(16),f.width);
  assert.equal(b.readUInt32BE(20),f.height);
  assert.ok(f.source.includes('/'+V6_PROVENANCE.revision+'/'),f.name+' pinned provenance');
 }
 assert.match(readFileSync('assets/vendor/effekseer-v6/SOURCES.md','utf8'),/CC0/);
});
test('V6 actually selects different textures/behaviors for move identity, not simple recoloring',()=>{
 const s=readFileSync('src/move-six-v6.js','utf8');
 for(const name of ['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash'])
  assert.ok(s.includes("'"+name+"'"),name+' own animation entry');
 for(const texture of V6_MATERIAL_NAMES)assert.ok(s.includes("'"+texture+"'"),texture);
 assert.match(s,/plan.name==='ice'/);
 assert.match(s,/plan.name==='water'/);
 assert.match(s,/plan.name==='ghost'/);
 assert.match(s,/plan.name==='steel'/);
 assert.match(s,/plan.name==='air'/);
 assert.match(s,/plan.name==='fire'/);
 assert.ok(!/scene\.add\.graphics\s*\(|document\.createElement\s*\(\s*['"]canvas/.test(s),
  'no CSS/vector runtime VFX');
 assert.equal(Object.keys(V6_SPRITE_COUNT_BY_MOVE).length,6);
 for(const id of MOVE_IDS)assert.ok(V6_SPRITE_COUNT_BY_MOVE[id]>=10,id+' has authored material texture layers');
 assert.equal(MOVE_IDS.reduce((n,id)=>n+V6_SPRITE_COUNT_BY_MOVE[id],0),108);
});
test('V6 gallery is isolated, testable and preserves the approved Slash V5.4',()=>{
 const html=readFileSync('moves-v6.html','utf8');
 for(const id of ['v6','v5','material','impact','decay','pause','slow','normal','battle','light','dark'])
  assert.ok(html.includes('id="'+id+'"'),id+' functional browser control');
 assert.match(html,/type:Phaser.WEBGL/);
 assert.match(html,/preloadMaterialV6/);
 assert.match(html,/playMoveSixV6/);
 assert.match(html,/visibleMaterialCount/);
 assert.match(html,/setMaterials\(material\)/);
 assert.ok(readFileSync('effects/slash/arc/material-v5-4/manifest.json','utf8').includes('"approved": true'));
 const m=JSON.parse(readFileSync('effects/moves/six-v5/manifest.json','utf8'));
 assert.equal(m.approved,false);assert.equal(m.gameIntegrationEnabled,false);
});
