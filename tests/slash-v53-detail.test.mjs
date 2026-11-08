import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createV53MaterialMotifs} from '../src/build-slash-v53-material.mjs';
test('V5.3-R1 six fine materials are distinct, reproducible and transient',()=>{
 const sheets=createV53MaterialMotifs();
 assert.equal(sheets.length,6);
 for(const s of sheets){
  assert.deepEqual(readFileSync('effects/slash/arc/material-v5-3/'+s.id+'.png'),Buffer.from(s.bytes));
  assert.deepEqual(s.counts.slice(0,3),[0,0,0]);
  assert.deepEqual(s.counts.slice(8),[0,0,0,0]);
  assert.ok(s.counts[4]>40&&s.counts[4]<220,s.id+' impact pixels');
  assert.ok(s.counts[6]>0&&s.counts[6]<s.counts[4],s.id+' dissipating material');
  assert.ok(s.counts[7]>0&&s.counts[7]<80,s.id+' final thin fragments');
  assert.ok(s.bytes.length<4000,s.id+' texture budget');
 }
 assert.equal(new Set(sheets.map(s=>s.id)).size,6);
 const manifest=JSON.parse(readFileSync('effects/slash/arc/material-v5-3/manifest.json','utf8'));
 assert.equal(manifest.gameIntegrationEnabled,false);
 assert.equal(manifest.approved,false);
});
