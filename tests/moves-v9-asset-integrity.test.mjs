import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {V9_IDS,V9_FRAME_WIDTH,V9_FRAME_HEIGHT,V9_FRAME_COUNT} from '../src/moves-v9-phaser.mjs';

test('V9 images are committed as five genuine transparent PNGs, pinned by SHA256',()=>{
 const pack=JSON.parse(readFileSync('assets/v9/manifest.json','utf8'));
 assert.equal(pack.approved,false);
 assert.equal(pack.gameIntegrationEnabled,false);
 assert.equal(pack.airSlashPreserved,'v8');
 assert.deepEqual(pack.moves.map(x=>x.id),V9_IDS);
 assert.equal(V9_FRAME_WIDTH,80);
 assert.equal(V9_FRAME_HEIGHT,80);
 assert.equal(V9_FRAME_COUNT,16);
 assert.equal(pack.frameLayout.rows,4);
 assert.equal(pack.frameLayout.columns,4);
 for(const move of pack.moves){
  const png=readFileSync('assets/v9/'+move.id+'.png');
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',move.id);
  assert.equal(png.readUInt32BE(16),320,move.id);
  assert.equal(png.readUInt32BE(20),320,move.id);
  assert.equal(png[25],3,move.id+' must use palette-indexed pixels');
  assert.equal(png.length,move.bytes);
  assert.equal(createHash('sha256').update(png).digest('hex'),move.sha256);
  let at=8,hasTrans=false,hasPLTE=false,chunkCount=0;
  while(at<png.length){
   const len=png.readUInt32BE(at),type=png.toString('ascii',at+4,at+8);
   assert.ok(at+len+12<=png.length,move.id+' valid chunk bounds');
   if(type==='tRNS')hasTrans=true;
   if(type==='PLTE')hasPLTE=true;
   chunkCount++;
   at+=len+12;
  }
  assert.ok(hasTrans&&hasPLTE&&chunkCount>=4,move.id+' genuine indexed transparent PNG');
 }
});
test('V9 gallery is online-ready and explicitly reuses approved Air Slash V8',()=>{
 const page=readFileSync('moves-v9.html','utf8');
 assert.match(page,/type:Phaser.WEBGL/);
 assert.match(page,/preloadV9\(this\)/);
 assert.match(page,/preloadV8\(this\)/);
 assert.match(page,/playV9\(scene,id/);
 assert.match(page,/playV8\(scene,'air-slash'/);
 assert.match(page,/window.__v9lab/);
 for(const ctl of ['move','previous','next','prep','travel','impact','decay','pause','slow','normal','dark','battle','light'])
  assert.ok(page.includes('id="'+ctl+'"'),ctl+' interactive control');
 assert.ok(!V9_IDS.includes('air-slash'));
 assert.ok(readFileSync('src/moves-v8-director.js','utf8').includes("'air-slash'"));
});
