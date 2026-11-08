import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createV52Microglints} from '../src/build-slash-v52-micro.mjs';
import {V52_FRAME_ALPHA,V52_MICRO_ALPHA,V5_LAYER_NAMES} from '../src/slash-vfx-layers.js';
const root='effects/slash/arc/microglints-v5-2/';
function stats(buf){
 assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(buf.readUInt32BE(16),1728);
 assert.equal(buf.readUInt32BE(20),144);
 assert.equal(buf[24],8);assert.equal(buf[25],3);
 let p=8,idat=[],palette,alpha;
 while(p<buf.length){
  const len=buf.readUInt32BE(p),name=buf.toString('ascii',p+4,p+8);
  if(name==='IDAT')idat.push(buf.subarray(p+8,p+8+len));
  if(name==='PLTE')palette=buf.subarray(p+8,p+8+len);
  if(name==='tRNS')alpha=buf.subarray(p+8,p+8+len);
  p+=len+12;
 }
 assert.equal(palette.length,15); // transparent + 4 deliberate tones
 assert.equal(alpha[0],0);
 const raw=inflateSync(Buffer.concat(idat));
 assert.equal(raw.length,144*1729);
 const counts=[];
 for(let frame=0;frame<12;frame++){
  let count=0;
  for(let y=0;y<144;y++){
   assert.equal(raw[y*1729],0);
   for(let x=0;x<144;x++)count+=(raw[y*1729+1+144*frame+x]>0);
  }
  counts.push(count);
 }
 return counts;
}
test('six deterministic V5.2 tiny material glints only at the attack peak',()=>{
 const list=createV52Microglints();assert.equal(list.length,6);
 const seen=new Set();
 for(const item of list){
  const file=readFileSync(root+item.id+'.png');
  assert.deepEqual(file,Buffer.from(item.bytes),item.id+' generator mismatch');
  assert.ok(file.length<3000,item.id+' has unnecessary pixel data');
  const counts=stats(file);
  assert.deepEqual(counts,item.counts);
  assert.deepEqual(counts.slice(0,3),[0,0,0]);
  assert.deepEqual(counts.slice(8),[0,0,0,0]);
  assert.ok(counts[4]>0&&counts[4]<50,'V5.2 micro-reflections should remain sparse');
  assert.ok(counts[7]>0&&counts[7]<15,'V5.2 must disappear before the final fade');
  const key=file.toString('base64');assert.ok(!seen.has(key),item.id+' duplicates other material');
  seen.add(key);
 }
});
test('dynamic alpha curves preserve thin blade and end in quiet fade',()=>{
 assert.ok(V52_MICRO_ALPHA<=.70);
 for(const [name,frames] of Object.entries(V52_FRAME_ALPHA)){
  assert.equal(frames.length,12,name);
  assert.ok(frames.every(x=>x>=0&&x<=1),name);
 }
 assert.equal(V52_FRAME_ALPHA.glow[0],0);
 assert.ok(V52_FRAME_ALPHA.glow[4]>V52_FRAME_ALPHA.glow[3]);
 assert.equal(V52_FRAME_ALPHA.glow[7],0);
 assert.ok(V52_FRAME_ALPHA.breakup[7]>V52_FRAME_ALPHA.breakup[10]);
 assert.ok(V52_FRAME_ALPHA.trail[11]<.1);
 assert.deepEqual(V5_LAYER_NAMES,['residualTrail','core','outerAccent','breakup','innerGlow']);
 const renderer=readFileSync('src/slash-vfx-layers.js','utf8');
 assert.match(renderer,/playLayeredV52/);
 assert.match(renderer,/preloadMicroV52/);
 assert.match(renderer,/BlendModes\.ADD/);
 assert.match(renderer,/NEAREST/);
 assert.doesNotMatch(renderer,/\.hp\s*=|\.damage\s*=|localStorage|fetch\(/);
 const html=readFileSync('index.html','utf8');
 for(const selector of ['polish','layered','thin','arc','before','glow','impact','breakup']){
  assert.ok(html.includes('id="'+selector+'"'),selector+' missing comparison control');
 }
});
