import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createV53MaterialMotifs} from '../src/build-slash-v53-material.mjs';
import {V53_FRAME_MS,V53_MATERIAL_ALPHA} from '../src/slash-vfx-layers.js';
const base='effects/slash/arc/material-v5-3/';
function info(data){
 assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(data.readUInt32BE(16),1728);
 assert.equal(data.readUInt32BE(20),144);
 assert.equal(data[24],8);assert.equal(data[25],3);
 const parts=[];let palette,alpha;
 for(let p=8;p<data.length;){const n=data.readUInt32BE(p),type=data.toString('ascii',p+4,p+8);
  const body=data.subarray(p+8,p+8+n);
  if(type==='IDAT')parts.push(body);if(type==='PLTE')palette=body;if(type==='tRNS')alpha=body;
  p+=n+12;
 }
 assert.equal(palette.length,15);assert.equal(alpha[0],0);
 const raw=inflateSync(Buffer.concat(parts));
 assert.equal(raw.length,144*1729);
 const counts=[];
 for(let f=0;f<12;f++){let n=0;for(let y=0;y<144;y++){
   assert.equal(raw[y*1729],0);for(let x=0;x<144;x++)n+=(raw[y*1729+1+144*f+x]>0);
  }counts.push(n)}
 return counts;
}
test('V5.3 six distinct sparse geometry motifs are reproducible and transient',()=>{
 const generated=createV53MaterialMotifs();
 assert.equal(generated.length,6);
 const signatures=new Set();
 for(const sheet of generated){
  const b=readFileSync(base+sheet.id+'.png');
  assert.deepEqual(b,Buffer.from(sheet.bytes),sheet.id+' changed without updating deterministic generator');
  const counts=info(b);
  assert.deepEqual(counts,sheet.counts);
  assert.deepEqual(counts.slice(0,3),[0,0,0]);
  assert.deepEqual(counts.slice(8),[0,0,0,0]);
  assert.ok(counts[4]>40 && counts[4]<220,sheet.id+' motif is invisible or too bulky');
  assert.ok(counts[7]>0&&counts[7]<80,sheet.id+' late breakup is too dense');
  assert.ok(b.length<4000,sheet.id+' overly expensive asset');
  const signature=b.toString('base64');assert.ok(!signatures.has(signature));
  signatures.add(signature);
 }
});
test('cinematic timing remains about 0.75s, visibly speeds through sweep and holds impact',()=>{
 assert.equal(V53_FRAME_MS.length,12);
 const total=V53_FRAME_MS.reduce((n,x)=>n+x,0);
 assert.ok(total>=700&&total<=800,total+'ms');
 assert.ok(V53_FRAME_MS.every(n=>Number.isInteger(n)&&n>=30&&n<=120));
 assert.ok(V53_FRAME_MS[3]<V53_FRAME_MS[4]);
 assert.ok(V53_FRAME_MS[11]>V53_FRAME_MS[3]);
 assert.equal(V53_MATERIAL_ALPHA.length,12);
 assert.deepEqual(V53_MATERIAL_ALPHA.slice(0,3),[0,0,0]);
 assert.deepEqual(V53_MATERIAL_ALPHA.slice(8),[0,0,0,0]);
 assert.ok(V53_MATERIAL_ALPHA[4]>.4&&V53_MATERIAL_ALPHA[4]<.7);
 const r=readFileSync('src/slash-vfx-layers.js','utf8');
 assert.match(r,/playLayeredV53/);
 assert.match(r,/preloadMaterialV53/);
 assert.match(r,/duration:1,skipMissedFrames:false/);
 // Timing is now selected per version; V5.3 and V5.4 use independent tables.
 assert.match(r,/const frameTiming=elemental\?V54_FRAME_MS:V53_FRAME_MS/);
 assert.match(r,/duration:frameTiming\[i\]/);
 const h=readFileSync('index.html','utf8');
 for(const id of ['cinematic','polish','layered','thin','arc','before','bg-dark','bg-light','bg-battle','impact','breakup']){
  assert.ok(h.includes('id="'+id+'"'),id);
 }
});
