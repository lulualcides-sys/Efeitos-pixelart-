import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {IMPACT_SPECS,IMPACT_DELAYS_CS,createImpactArtifacts} from '../src/hns-impact-studies.mjs';
test('original 16-frame PNG & animated GIF assets are reproducible and transparent',()=>{
 assert.equal(IMPACT_SPECS.length,4);
 assert.equal(IMPACT_DELAYS_CS.length,16);
 const signatures=new Set();
 for(const spec of IMPACT_SPECS){
  const {frames,png,gif}=createImpactArtifacts(spec);
  const path='effects/hns-impact-studies/'+spec.id;
  assert.deepEqual(Buffer.from(png),readFileSync(path+'.png'),spec.id+' png mismatch');
  assert.deepEqual(Buffer.from(gif),readFileSync(path+'.gif'),spec.id+' gif mismatch');
  assert.equal(Buffer.from(png).toString('ascii',1,4),'PNG');
  assert.equal(Buffer.from(png).readUInt32BE(16),96*16);
  assert.equal(Buffer.from(png).readUInt32BE(20),96);
  assert.equal(Buffer.from(gif).toString('ascii',0,6),'GIF89a');
  assert.equal(Buffer.from(gif).readUInt16LE(6),96);
  assert.equal(Buffer.from(gif).readUInt16LE(8),96);
  const opaque=frames.map(f=>f.reduce((s,v)=>s+(v>0),0));
  assert.equal(opaque[15],0);
  assert.ok(opaque[5]>opaque[0]&&opaque[6]>opaque[0],spec.id+' hit must peak after travel');
  assert.ok(opaque[13]<opaque[6],spec.id+' must dissipate');
  assert.ok(opaque[6]>100,spec.id+' too sparse');
  const data=Buffer.from(png);let i=8,raw=null;while(i<data.length){
   const n=data.readUInt32BE(i),name=data.toString('ascii',i+4,i+8);
   if(name==='IDAT')raw=inflateSync(data.subarray(i+8,i+8+n));
   i+=12+n;
  }
  assert.equal(raw.length,96*(96*16+1));
  assert.equal([...data].filter((x,i)=>i>0&&x===0).length>0,true);
  assert.ok(!signatures.has(Buffer.from(gif).toString('base64')));
  signatures.add(Buffer.from(gif).toString('base64'));
 }
});
test('gallery remains isolated; prior approved slash effects not overwritten',()=>{
 const html=readFileSync('hns-impact-lab.html','utf8');
 for(const id of IMPACT_SPECS.map(s=>s.id))assert.ok(html.includes(id),id);
 assert.match(html,/Phaser/);
 assert.match(html,/speed/);
 assert.match(html,/pause/);
 assert.match(html,/collision/);
});
