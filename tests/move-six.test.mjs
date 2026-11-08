import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createMoveSheets,MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,CONTACT_FRAME,S,F} from '../src/build-move-six.mjs';
test('Six move PNGs are distinct, reproducible, indexed and fully decodable',()=>{
 const sheets=createMoveSheets();
 assert.equal(sheets.length,6);assert.equal(new Set(MOVE_IDS).size,6);
 assert.equal(MOVE_NAMES.length,6);assert.equal(MOVE_TYPES.length,6);
 const seen=new Set();
 for(const x of sheets){
  const buf=Buffer.from(x.bytes);
  assert.deepEqual(buf,readFileSync('effects/moves/six-v1/'+x.id+'.png'),x.id+' is reproducible');
  assert.deepEqual([...buf.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(buf.readUInt32BE(16),S*F);assert.equal(buf.readUInt32BE(20),S*2);
  assert.equal(buf[24],8);assert.equal(buf[25],3,x.id+' indexed color PNG');
  assert.ok(buf.length>1000&&buf.length<21000,x.id+' PNG budget');
  assert.equal(x.counts.length,16);
  assert.ok(x.counts.every(l=>l.length===2),x.id+' two layers');
  assert.deepEqual(x.counts[0],[0,0]);assert.deepEqual(x.counts[15],[0,0]);
  assert.ok(x.counts[9][0]>100,x.id+' body impact');
  assert.ok(x.counts[9][1]>10,x.id+' spark impact');
  assert.ok(x.counts[12][1]>0,x.id+' breakup particles');
  assert.equal(x.counts[14][0],0,x.id+' body cleared on ending');
  assert.ok(!seen.has(buf.toString('base64')),x.id+' unique geometry');
  seen.add(buf.toString('base64'));
  const chunks=[];let at=8,seenPalette=false,seenAlpha=false;
  while(at<buf.length){
   const len=buf.readUInt32BE(at),type=buf.toString('ascii',at+4,at+8),data=buf.subarray(at+8,at+8+len);
   if(type==='PLTE')seenPalette=true;
   if(type==='tRNS'){seenAlpha=true;assert.equal(data[0],0)}
   if(type==='IDAT')chunks.push(data);
   at+=len+12;
  }
  assert.ok(seenPalette&&seenAlpha,'palette and transparency');
  const raw=inflateSync(Buffer.concat(chunks));
  assert.equal(raw.length,(S*F+1)*(S*2));
 }
});
test('New six-move scene is isolated from approved V5.4 and has correct runtime metadata',()=>{
 const manifest=JSON.parse(readFileSync('effects/moves/six-v1/manifest.json','utf8'));
 assert.equal(manifest.approved,false);
 assert.equal(manifest.gameIntegrationEnabled,false);
 assert.equal(manifest.moves.length,6);
 assert.equal(manifest.contactFrame,CONTACT_FRAME);
 assert.equal(manifest.frames,F);
 assert.equal(manifest.frameWidth,S);
 assert.equal(manifest.frameMs.length,F);
 assert.deepEqual(FRAME_MS,manifest.frameMs);
 assert.ok(FRAME_MS.reduce((a,b)=>a+b,0)>700);
 const html=readFileSync('moves.html','utf8'),renderer=readFileSync('src/move-six-vfx.js','utf8');
 for(const action of ['impact','fragments','pause','sparks','dark','light','battle','slow','normal'])
  assert.ok(html.includes('id="'+action+'"'),action);
 assert.match(renderer,/preloadMoveSix/);
 assert.match(renderer,/playMoveSix/);
 assert.ok(html.includes('window.__movesLab'));
 assert.ok(html.includes('Phaser.WEBGL'));
 assert.ok(!html.includes('pokemon-torre-2\\/src\\/'));
 assert.ok(readFileSync('effects/slash/arc/material-v5-4/manifest.json','utf8').includes('"approved": true'));
});
