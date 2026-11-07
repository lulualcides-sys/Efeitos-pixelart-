import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
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
test('V2 consists of six distinct true lateral cuts',()=>{
 assert.deepEqual(config.variants.map(v=>v.id),SLASH_IDS);
 const seen=new Set();
 for(const id of SLASH_IDS){
  const old=sheet(base+'archive/v1/'+id+'.png');
  const now=sheet(base+'lateral/v2/'+id+'.png');
  assert.ok(now.stats.every(f=>f.count>=10),id+' missing frames');
  assert.ok(new Set(now.stats.map(f=>f.count)).size>=6,id+' frozen frames');
  assert.ok(now.stats[8].w>=75,id+' not long enough');
  assert.ok(now.stats[8].w/now.stats[8].h>=2,id+' shape is not horizontal');
  assert.notDeepEqual(now.b,old.b,id+' is duplicate of V1');
  const fingerprint=now.b.toString('base64');
  assert.ok(!seen.has(fingerprint),id+' duplicate variant');
  seen.add(fingerprint);
 }
});
test('integration is optional and does not modify the real battle',()=>{
 const src=readFileSync('src/slash-vfx.js','utf8');
 const page=readFileSync('index.html','utf8');
 assert.match(src,/preloadSlashes/);assert.match(src,/playSlash/);assert.match(src,/NEAREST/);
 assert.doesNotMatch(src,/recibir\(|\.hp\s*=|\.dano\s*=|localStorage/);
 assert.match(page,/Phaser\.WEBGL/);assert.match(page,/preloadSlashes/);
});
