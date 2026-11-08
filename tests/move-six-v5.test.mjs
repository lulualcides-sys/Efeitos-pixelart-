import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createMoveSheetsV5,MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,S,F,LAYERS,CONTACT_FRAME} from '../src/build-move-six-v5.mjs';

test('Native V5 generates six different 180px spritesheets, no chunky 2x raster',()=>{
 const sheets=createMoveSheetsV5();
 assert.equal(S,180);assert.equal(F,18);assert.equal(LAYERS,3);assert.equal(CONTACT_FRAME,10);
 assert.equal(MOVE_NAMES.length,6);assert.equal(MOVE_TYPES.length,6);
 assert.deepEqual(MOVE_IDS,['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash']);
 const hashes=new Set();
 for(const s of sheets){
  const png=readFileSync('effects/moves/six-v5/'+s.id+'.png');
  assert.deepEqual(png,Buffer.from(s.bytes),s.id+' must reproduce pixel-for-pixel');
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(png.readUInt32BE(16),S*F);
  assert.equal(png.readUInt32BE(20),S*LAYERS);
  assert.equal(png[24],8);assert.equal(png[25],3,s.id+' should be indexed 8 bit color');
  assert.ok(png.length<200000&&png.length>10000,s.id+' within optimized size budget');
  assert.equal(s.counts.length,F);assert.ok(s.counts.every(x=>x.length===3));
  assert.ok(s.counts[0].every(x=>x===0)&&s.counts[17].every(x=>x===0));
  assert.ok(s.counts[CONTACT_FRAME].reduce((a,b)=>a+b,0)>100,s.id+' clear hit frame');
  assert.ok(s.counts[13][2]>0,s.id+' distinct residual particle breakup');
  assert.ok(!hashes.has(png.toString('base64')),s.id+' must not be a recolor of another hit');
  hashes.add(png.toString('base64'));
  let at=8,palette=0,alpha=0,compressed=[];
  while(at<png.length){
   const n=png.readUInt32BE(at),tag=png.toString('ascii',at+4,at+8);
   assert.ok(at+n+12<=png.length,s.id+' PNG bounds');
   if(tag==='PLTE')palette=n;
   if(tag==='tRNS'){alpha=n;assert.equal(png[at+8],0)}
   if(tag==='IDAT')compressed.push(png.subarray(at+8,at+8+n));
   at+=n+12;
  }
  assert.equal(palette,51,s.id+' distinct 16-colour full-native palette');
  assert.equal(alpha,17);
  const pixels=inflateSync(Buffer.concat(compressed));
  assert.equal(pixels.length,(S*F+1)*S*LAYERS);
 }
});

test('V5 truly uses native full resolution, not magnified low-res cels',()=>{
 const generator=readFileSync('src/build-move-six-v5.mjs','utf8');
 const module=readFileSync('src/move-six-v5.js','utf8');
 const lab=readFileSync('moves-v5.html','utf8');
 assert.ok(!generator.includes('SCALE=2')&&!generator.includes('x*SCALE')&&!generator.includes('S*SCALE'));
 assert.ok(!module.includes('S*SCALE')&&!module.includes('setScale(3'));
 assert.match(module,/frameWidth:S,frameHeight:S/);
 assert.match(module,/NEAREST/);
 assert.match(lab,/scale:1\.38/);
 assert.match(lab,/Phaser\.WEBGL/);
 for(const v of ['version-v5','version-v4','version-v3','version-v2','version-v1','impact','fragments','pause','sparks','glow','dark','light','battle','slow','normal'])
  assert.ok(lab.includes('id="'+v+'"'),v+' control');
 const manifest=JSON.parse(readFileSync('effects/moves/six-v5/manifest.json','utf8'));
 assert.equal(manifest.approved,false);
 assert.equal(manifest.gameIntegrationEnabled,false);
 assert.equal(manifest.preserveApprovedSlashV54,true);
 assert.equal(manifest.frameWidth,180);assert.equal(manifest.frameHeight,180);
 assert.equal(manifest.contactFrame,CONTACT_FRAME);assert.equal(manifest.frameCount,F);
 assert.deepEqual(manifest.frameMs,FRAME_MS);
 assert.ok(readFileSync('effects/slash/arc/material-v5-4/manifest.json','utf8').includes('"approved": true'));
 assert.ok(readFileSync('effects/moves/six-v4/manifest.json','utf8').includes('"approved": false'));
});
