import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createV54MaterialMotifs} from '../src/build-slash-v54-material.mjs';
import {V54_FRAME_MS,V54_MATERIAL_ALPHA} from '../src/slash-vfx-layers.js';
test('V5.4: six distinct deterministic PNGs sustain motion and dissolve',()=>{
 const effects=createV54MaterialMotifs();assert.equal(effects.length,6);
 const signatures=new Set();
 for(const s of effects){
  const bytes=readFileSync('effects/slash/arc/material-v5-4/'+s.id+'.png');
  assert.deepEqual(bytes,Buffer.from(s.bytes));
  assert.ok(bytes.length<6000,s.id+' size');
  assert.equal(bytes.readUInt32BE(16),1728);assert.equal(bytes.readUInt32BE(20),144);
  assert.deepEqual(s.counts.slice(0,2),[0,0]);
  assert.deepEqual(s.counts.slice(10),[0,0]);
  assert.ok(s.counts[4]>=40&&s.counts[4]<=300,s.id+' impact detail');
  assert.ok(s.counts[7]<s.counts[5]&&s.counts[9]<s.counts[7],s.id+' dissipates');
  assert.ok(s.counts[8]>0&&s.counts[9]>0,s.id+' material after contact');
  assert.ok(!signatures.has(bytes.toString('base64')),s.id+' unique sheet');
  signatures.add(bytes.toString('base64'));
  const p=bytes.indexOf(Buffer.from('IDAT'))+4,n=bytes.readUInt32BE(p-8);
  assert.ok(n>0);
  const raw=inflateSync(bytes.subarray(p,p+n));
  assert.equal(raw.length,144*1729);
 }
});
test('V5.4 temporal alpha is controlled and V5.3 remains selectable',()=>{
 assert.equal(V54_FRAME_MS.length,12);
 assert.ok(V54_FRAME_MS.every(n=>Number.isInteger(n)&&n>=30&&n<=120));
 const total=V54_FRAME_MS.reduce((a,b)=>a+b,0);assert.ok(total>650&&total<850);
 assert.equal(V54_MATERIAL_ALPHA.length,12);
 assert.ok(Math.max(...V54_MATERIAL_ALPHA)<=0.58);
 assert.equal(V54_MATERIAL_ALPHA[9],0.035);
 const html=readFileSync('index.html','utf8');
 for(const id of ['elemental','cinematic','polish','bg-dark','bg-light','bg-battle'])
  assert.ok(html.includes('id="'+id+'"'),id);
 const r=readFileSync('src/slash-vfx-layers.js','utf8');
 assert.match(r,/playLayeredV54/);
 assert.match(r,/preloadMaterialV54/);
});
