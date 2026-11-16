import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {NEW_TYPE_IMPACTS,framesForType,buildTypeImpact} from '../src/type-impact-pack.mjs';
import {IMPACT_SPECS} from '../src/hns-impact-studies.mjs';
const old=['fire','ice','electric','water'];
const types=['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
test('complete original 18-type impact set, without replacing the four original studies',()=>{
 assert.equal(IMPACT_SPECS.length,4);
 assert.equal(NEW_TYPE_IMPACTS.length,14);
 assert.deepEqual(new Set(NEW_TYPE_IMPACTS.map(s=>s.type)).size,14);
 assert.deepEqual(new Set([...old,...NEW_TYPE_IMPACTS.map(s=>s.type)]),new Set(types));
 assert.ok(NEW_TYPE_IMPACTS.every(s=>s.palette.length===6));
});
test('fourteen deterministic GIF + indexed PNG effects are valid, 16 frames each, with distinct motion',()=>{
 const signatures=new Set();
 for(const spec of NEW_TYPE_IMPACTS){
  const {png,gif,frames}=buildTypeImpact(spec);
  const oldGif=readFileSync('effects/type-impact-pack/'+spec.id+'.gif');
  const oldPng=readFileSync('effects/type-impact-pack/'+spec.id+'.png');
  assert.deepEqual(Buffer.from(gif),oldGif,spec.id+' GIF must be regenerated exactly');
  assert.deepEqual(Buffer.from(png),oldPng,spec.id+' PNG must be regenerated exactly');
  assert.equal(Buffer.from(gif).toString('ascii',0,6),'GIF89a');
  assert.equal(Buffer.from(gif).readUInt16LE(6),96);
  assert.equal(Buffer.from(gif).readUInt16LE(8),96);
  assert.equal(Buffer.from(png).readUInt32BE(16),1536);
  assert.equal(Buffer.from(png).readUInt32BE(20),96);
  assert.equal(frames.length,16);
  const counts=frames.map(f=>f.reduce((a,b)=>a+(b>0),0));
  assert.equal(counts[15],0,spec.id+' should clear last frame');
  assert.ok(counts[5]>=80,spec.id+' must show visible impact');
  assert.ok(counts[13]<counts[6],spec.id+' must dissipate');
  assert.ok(new Set(frames.map(f=>Buffer.from(f).toString('base64'))).size>=12,spec.id+' must animate visibly');
  assert.ok(gif.length>3000&&gif.length<100_000,spec.id+' GIF size');
  assert.ok(png.length>1000&&png.length<50_000,spec.id+' PNG size');
  let p=8,idat=false;
  while(p<png.length){const n=Buffer.from(png).readUInt32BE(p);const tag=Buffer.from(png).toString('ascii',p+4,p+8);
   if(tag==='IDAT'){idat=true;const raw=inflateSync(Buffer.from(png).subarray(p+8,p+8+n));assert.equal(raw.length,96*(1536+1));}
   p+=n+12;}
  assert.ok(idat);
  const sig=Buffer.from(gif).toString('base64');
  assert.ok(!signatures.has(sig),spec.id+' animation must differ from other types');
  signatures.add(sig);
 }
});
test('all 18 GIFs have an inline gallery, including original four',()=>{
 const list=readFileSync('effects/type-impact-pack/README.md','utf8');
 const html=readFileSync('type-impact-lab.html','utf8');
 const oldIds=['ember-hit','tide-hit','volt-hit','frost-hit'];
 for(const id of [...oldIds,...NEW_TYPE_IMPACTS.map(s=>s.id)]){
  assert.ok(list.includes(id+'.gif'),id+' missing from README gallery');
  assert.ok(html.includes(id+'.gif'),id+' missing from HTML gallery');
 }
});
