import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {createV5} from '../src/build-slash-v5.mjs';
import {SLASH_FRAME_SIZE_BY_VERSION,SLASH_FPS_BY_VERSION} from '../src/slash-vfx.js';
import {SLASH_IDS,SLASH_FRAME_COUNT,SLASH_FRAME_WIDTH,SLASH_FPS} from '../src/slash-vfx.js';
const base='effects/slash/';
const config=JSON.parse(readFileSync(base+'manifest.json','utf8'));
function sheet(p){
 const b=readFileSync(p);
 assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a',p);
 assert.equal(b.readUInt32BE(16),1152,p);assert.equal(b.readUInt32BE(20),96,p);
 assert.equal(b[24],8,p);assert.equal(b[25],3,p);
 let pos=8,plte,trans,parts=[];
 while(pos<b.length){
  const n=b.readUInt32BE(pos),type=b.toString('ascii',pos+4,pos+8);
  if(type==='PLTE')plte=b.subarray(pos+8,pos+8+n);
  if(type==='tRNS')trans=b.subarray(pos+8,pos+8+n);
  if(type==='IDAT')parts.push(b.subarray(pos+8,pos+8+n));
  pos+=12+n;
 }
 assert.ok(plte?.length>=18&&plte.length<=24&&plte.length%3===0,p+' indexed palette');
 assert.equal(trans?.[0],0,p+' transparent index');
 const raw=inflateSync(Buffer.concat(parts));
 assert.equal(raw.length,96*1153,p+' size');
 const stats=[];
 for(let f=0;f<12;f++){
  let count=0,minX=96,minY=96,maxX=-1,maxY=-1;
  for(let y=0;y<96;y++)for(let x=0;x<96;x++)if(raw[y*1153+1+f*96+x]){
   count++;minX=Math.min(minX,x);minY=Math.min(minY,y);
   maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
  }
  stats.push({count,w:maxX-minX+1,h:maxY-minY+1});
 }
 return {b,stats};
}
test('six original slashes kept in immutable V1 archive',()=>{
 assert.equal(config.approved,false);
 assert.equal(config.status,'pending_visual_review');
 assert.equal(SLASH_FRAME_WIDTH,96);assert.equal(SLASH_FRAME_COUNT,12);assert.equal(SLASH_FPS,24);
 assert.equal(SLASH_IDS.length,6);
 for(const id of SLASH_IDS){
  const old=sheet(base+'archive/v1/'+id+'.png');
  assert.ok(old.stats.every(f=>f.count>20),id+' archive corrupted');
 }
});
test('V2 consists of six distinct original hooked arc refinements',()=>{
 assert.deepEqual(config.variants.map(v=>v.id),SLASH_IDS);
 const seen=new Set();
 for(const id of SLASH_IDS){
  const old=sheet(base+'archive/v1/'+id+'.png');
  const now=sheet(base+'arc/refined-v2/'+id+'.png');
  assert.ok(now.stats.every(f=>f.count>=10),id+' missing frames');
  assert.ok(new Set(now.stats.map(f=>f.count)).size>=6,id+' frozen frames');
  assert.ok(now.stats[8].w>=60,id+' arc too narrow');
  assert.ok(now.stats[7].h>=40,id+' missing curved vertical hook');
  assert.ok(now.stats[7].w/now.stats[7].h<2.0,id+' unintended straight lateral streak');
  assert.notDeepEqual(now.b,old.b,id+' is duplicate of V1');
  const fingerprint=now.b.toString('base64');
  assert.ok(!seen.has(fingerprint),id+' duplicate variant');
  seen.add(fingerprint);
 }
});

const FIXED_GIT_SHAS={
v1:{
'ember-rake':'56a136efbc6f8ed3a36e237b89860a35bfbe4248',
'solar-crescent':'2758c36c15069b1a0a94d688425ef26ae126f8ad',
'frost-shatter':'4d7adf4e9a15e30e44fe77fc7a4ce7517a66f0e3',
'ivory-gale':'7f754829d30d263c32046232be3fd1ba6fe677cb',
'verdant-sickle':'52d41608d61c4dc55114a74eec2a2f5b4de89b3f',
'astral-reaver':'a575a57182dbc7e1357cf49d44edb63620105a1e'},
v2:{
'ember-rake':'89b8d10943db16310ff7c5790f0327aace828bc1',
'solar-crescent':'9cb8be68361aa6cf296933c5e2b3255423882e2f',
'frost-shatter':'817dc03e639eb2dcc2bdb4184572eac9a05cffa7',
'ivory-gale':'912a1051ca782a28ca6787e44481827138cba092',
'verdant-sickle':'130e4a7f7eca6760781bedfb02c11ad3d15888eb',
'astral-reaver':'a9cec45de02ea8331a6a91b4638fc09e877a6118'}
};
test('V1/V2 preserved byte-for-byte',()=>{
 for(const [version,folder] of [['v1','archive/v1'],['v2','arc/refined-v2']]){
  for(const id of SLASH_IDS){
   const b=readFileSync(base+folder+'/'+id+'.png');
   const sha=createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
   assert.equal(sha,FIXED_GIT_SHAS[version][id],version+'/'+id+' changed');
  }
 }
});
test('V5 deterministic generators and two temporal phases',()=>{
 assert.equal(SLASH_FRAME_SIZE_BY_VERSION.v5,144);
 assert.equal(SLASH_FPS_BY_VERSION.v5,16);
 assert.equal(config.versions.v5.frameRate,16);
 assert.equal(config.versions.v5.approved,false);
 const generated=createV5();
 assert.equal(generated.length,6);
 const seen=new Set();
 for(const x of generated){
  assert.ok(SLASH_IDS.includes(x.id));
  const file=readFileSync(base+'arc/sweep-v5/'+x.id+'.png');
  assert.deepEqual(file,Buffer.from(x.bytes),x.id+' asset does not match generator');
  assert.equal(file.readUInt32BE(16),144*12);
  assert.equal(file.readUInt32BE(20),144);
  assert.equal(file[24],8);assert.equal(file[25],3);
  assert.ok(x.counts[4]>700&&x.counts[4]<1800,x.id+' main stroke too thick or missing');
  assert.ok(x.counts[7]>=40&&x.counts[7]<x.counts[4]*0.55,x.id+' not breaking into fragments');
  assert.ok(x.counts[11]<35,x.id+' unfinished fade');
  assert.ok(new Set(x.counts).size>=8,x.id+' stalled animation');
  const fingerprint=file.toString('base64');assert.ok(!seen.has(fingerprint));
  seen.add(fingerprint);
 }
});

test('integration is optional and does not modify the real battle',()=>{
 const src=readFileSync('src/slash-vfx.js','utf8');
 const page=readFileSync('index.html','utf8');
 assert.match(src,/preloadSlashes/);assert.match(src,/playSlash/);assert.match(src,/NEAREST/);
 assert.doesNotMatch(src,/recibir\(|\.hp\s*=|\.dano\s*=|localStorage/);
 assert.match(page,/Phaser\.WEBGL/);assert.match(page,/preloadSlashes/);
 assert.match(page,/id="impact"/);assert.match(page,/id="breakup"/);
});
