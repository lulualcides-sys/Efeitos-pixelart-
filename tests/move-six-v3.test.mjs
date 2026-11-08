import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createMoveSheetsV3,MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,S,SCALE,F,LAYERS,CONTACT_FRAME} from '../src/build-move-six-v3.mjs';
test('All six V3 native-pixel sprites regenerate byte for byte and have valid PNG palette rows',()=>{
 const x=createMoveSheetsV3();
 assert.equal(x.length,6);assert.equal(new Set(MOVE_IDS).size,6);
 assert.equal(MOVE_NAMES.length,6);assert.equal(MOVE_TYPES.length,6);
 const fingerprints=new Set();
 for(const item of x){
  const file=readFileSync('effects/moves/six-v3/'+item.id+'.png');
  assert.deepEqual(file,Buffer.from(item.bytes),item.id+' deterministic PNG');
  assert.deepEqual([...file.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(file.readUInt32BE(16),S*SCALE*F);
  assert.equal(file.readUInt32BE(20),S*SCALE*LAYERS);
  assert.equal(file[24],8);assert.equal(file[25],3);
  assert.ok(file.length>5000&&file.length<100000,item.id+' compressed size');
  assert.ok(!fingerprints.has(file.toString('hex')),item.id+' unique effect');
  fingerprints.add(file.toString('hex'));
  assert.equal(item.counts.length,F);
  assert.ok(item.counts.every(layers=>layers.length===LAYERS),item.id+' layer rows');
  assert.ok(item.counts[0].every(v=>v===0)&&item.counts[F-1].every(v=>v===0),item.id+' empty beginning and end');
  assert.ok(item.counts[CONTACT_FRAME][2]>10,item.id+' one-frame impact flash');
  assert.ok(item.counts[CONTACT_FRAME][0]>35,item.id+' readable impact body');
  assert.ok(item.counts[13][1]>0,item.id+' decaying details');
  let pos=8,plte=0,alpha=0,parts=[];
  while(pos<file.length){
   const size=file.readUInt32BE(pos),type=file.toString('ascii',pos+4,pos+8);
   assert.ok(size>=0&&pos+size+12<=file.length,item.id+' chunk within PNG');
   const data=file.subarray(pos+8,pos+8+size);
   if(type==='PLTE')plte=data.length;
   if(type==='tRNS'){alpha=data.length;assert.equal(data[0],0)}
   if(type==='IDAT')parts.push(data);
   pos+=size+12;
  }
  assert.equal(plte,27,item.id+' 8 shaded colors and transparent index');
  assert.equal(alpha,9,item.id+' tRNS');
  const decoded=inflateSync(Buffer.concat(parts));
  assert.equal(decoded.length,(S*SCALE*F+1)*(S*SCALE*LAYERS));
  // Pixel size exactly 2x: each adjacent horizontal pair must be identical.
  const rowWidth=S*SCALE*F;
  for(let y=0;y<decoded.length/(rowWidth+1);y+=Math.max(1,Math.floor(S*SCALE/4))){
   const row=decoded.subarray(y*(rowWidth+1)+1,(y+1)*(rowWidth+1));
   for(let i=0;i<row.length;i+=2)assert.equal(row[i],row[i+1],item.id+' integer zoom');
  }
 }
});
test('V3 preview remains isolated from rejected versions and approved Slash',()=>{
 const m=JSON.parse(readFileSync('effects/moves/six-v3/manifest.json','utf8'));
 assert.equal(m.approved,false);assert.equal(m.gameIntegrationEnabled,false);
 assert.equal(m.preserveApprovedSlashV54,true);
 assert.equal(m.canvasLogicalSize,72);
 assert.equal(m.nearestNeighbourExportScale,2);
 assert.equal(m.layers.length,LAYERS);
 assert.equal(m.frames,F);assert.equal(m.contactFrame,CONTACT_FRAME);
 assert.deepEqual(m.frameMs,FRAME_MS);
 assert.ok(FRAME_MS[CONTACT_FRAME]>FRAME_MS[9]);
 const page=readFileSync('moves-v3.html','utf8');
 const adapter=readFileSync('src/move-six-v3.js','utf8');
 for(const a of ['version-v3','version-v2','version-v1','glow','impact','fragments','pause','sparks','dark','light','battle','slow','normal'])assert.ok(page.includes('id="'+a+'"'),a);
 assert.match(page,/preloadMoveSixV3/);
 assert.match(page,/Phaser.WEBGL/);
 assert.match(adapter,/animationupdate/);
 assert.match(adapter,/NEAREST/);
 assert.ok(readFileSync('effects/slash/arc/material-v5-4/manifest.json','utf8').includes('"approved": true'));
 assert.ok(readFileSync('effects/moves/six-v2/manifest.json','utf8').includes('"approved": false'));
});
