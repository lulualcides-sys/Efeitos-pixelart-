import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MOVES,PACK,V8_FRAMES,V8_MS,V8_HIT,V8_TRAVEL,V8_DECAY,STAGING} from '../src/moves-v8-director.js';

test('V8 preserves six original move identities and adds materially distinct timelines',()=>{
 assert.deepEqual(MOVES.map(x=>x.id),['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash']);
 assert.equal(new Set(MOVES.map(x=>x.type)).size,6);
 assert.equal(V8_FRAMES,26);
 assert.equal(V8_MS.length,26);
 assert.ok(V8_MS.every(x=>x>=25&&x<=150));
 assert.equal(V8_HIT,14);assert.equal(V8_TRAVEL,9);assert.equal(V8_DECAY,20);
 assert.equal(Object.keys(STAGING.contacts).length,6);
 const c=readFileSync('src/moves-v8-director.js','utf8');
 for(const id of MOVES.map(x=>x.id))assert.ok(c.includes("id==='"+id+"'"),id);
 for(const label of ['flameFragment','frostEcho','blade0','blade1','blade2','bladeHit','water2','smoke2','metalHit2'])
  assert.ok(c.includes(label),label+' explicit independent art layer');
 assert.match(c,/for\(let j=0;j<7;j\+\+\)/);
 assert.match(c,/for\(let j=0;j<3;j\+\+\)/);
 assert.match(c,/scene\.events\.on\('update',step\)/);
 assert.match(c,/acc\/V8_MS\[frame\]/);
 assert.match(c,/setFrame\(f\)/);
 assert.match(c,/destroy\(\)/);
 assert.ok(!c.includes("scene.add.graphics")&&!c.includes("document.createElement('canvas')"),'No CSS/vector VFX generator');
});
test('V8 reuses only pinned MIT PixelFX original sheets and approved isolate stays unchanged',()=>{
 assert.equal(PACK.length,9);
 const m=JSON.parse(readFileSync('assets/v7/manifest.json','utf8'));
 assert.equal(m.sourceLicense,'MIT');assert.equal(m.approved,false);
 assert.equal(m.gameIntegrationEnabled,false);assert.equal(m.entries.length,9);
 assert.equal(m.sourceCommit,'a84159688af3ca37a4be05a0d422b94451b2e24e');
 const former=JSON.parse(readFileSync('effects/slash/arc/material-v5-4/manifest.json','utf8'));
 assert.equal(former.version,'v5.4');
 assert.equal(former.derivedFrom,'v5.3-r1');
 assert.equal(former.gameIntegrationEnabled,false);
 const s=readFileSync('src/moves-v8-director.js','utf8');
 assert.ok(s.includes("from './moves-v7-clean.js'"),'reuse verified atlases, not rejected move art');
 for(const old of ['./move-six-v5.js','./move-six-v6.js','./moves-v4.js'])
  assert.ok(!s.includes(old));
});
test('V8 gallery renders Phaser WebGL, readable active combat view and V7 A/B comparison',()=>{
 const h=readFileSync('moves-v8.html','utf8');
 assert.match(h,/type:Phaser.WEBGL/);
 assert.match(h,/playV8/);
 assert.match(h,/playV7/);
 assert.match(h,/version==='v8'/);
 assert.match(h,/window.__v8lab/);
 assert.match(h,/preloadV8/);
 assert.match(h,/width:620,height:370/);
 for(const id of ['version-v8','version-v7','move','prev','next','prepare','travel','hit','decay','pause','half','normal','dark','battle','light'])
  assert.ok(h.includes('id="'+id+'"'),id+' working gallery control');
 assert.ok(!h.includes('gameIntegrationEnabled=true'));
});
