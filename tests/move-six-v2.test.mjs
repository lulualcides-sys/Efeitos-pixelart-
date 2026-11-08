import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createMoveSheetsV2,MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,CONTACT_FRAME,S,F,LAYERS,LAYER_NAMES} from '../src/build-move-six-v2.mjs';

test('V2 PNGs: five layers, all six distinct silhouettes, reproducible indexed sheets',()=>{
 const sheets=createMoveSheetsV2();
 assert.equal(sheets.length,6);
 assert.equal(new Set(MOVE_IDS).size,6);
 assert.equal(MOVE_NAMES.length,6);
 assert.equal(MOVE_TYPES.length,6);
 assert.deepEqual(LAYER_NAMES,['atmosphere','silhouette','highlight','fragments','contact']);
 const hashes=new Set();
 for(const s of sheets){
  const file=Buffer.from(readFileSync('effects/moves/six-v2/'+s.id+'.png'));
  assert.deepEqual(file,Buffer.from(s.bytes),s.id+' deterministic bytes');
  assert.ok(file.length>8000&&file.length<60000,s.id+' compressed PNG budget');
  assert.deepEqual([...file.subarray(0,8)],[137,80,78,71,13,10,26,10],s.id+' PNG signature');
  assert.equal(file.readUInt32BE(16),S*F,s.id+' width');
  assert.equal(file.readUInt32BE(20),S*LAYERS,s.id+' height');
  assert.equal(file[24],8);
  assert.equal(file[25],3,s.id+' indexed palette');
  assert.equal(s.counts.length,F);
  assert.ok(s.counts.every(x=>x.length===LAYERS),s.id+' five layers');
  assert.ok(s.counts[0].every(x=>x===0)&&s.counts[15].every(x=>x===0),s.id+' full transparency at endpoints');
  const sum=n=>s.counts[n].reduce((a,b)=>a+b,0);
  assert.ok(sum(8)>120&&sum(9)>120,s.id+' full attack/contact');
  assert.ok(s.counts[9][4]>0,s.id+' own flash layer on impact');
  assert.ok(sum(12)<sum(9),s.id+' impact must decay');
  assert.ok(s.counts[14][1]===0,s.id+' silhouette clears by last frames');
  assert.ok(!hashes.has(file.toString('base64')),s.id+' no duplicate RGB pixels or sheets');
  hashes.add(file.toString('base64'));
  let pos=8,plte=false,trns=false,ids=[];
  while(pos<file.length){
   const len=file.readUInt32BE(pos),name=file.toString('ascii',pos+4,pos+8),data=file.subarray(pos+8,pos+8+len);
   assert.ok(pos+len+12<=file.length,s.id+' valid chunk bounds');
   if(name==='PLTE')plte=data.length===27;
   if(name==='tRNS')trns=data.length===9&&data[0]===0;
   if(name==='IDAT')ids.push(data);
   pos+=len+12;
  }
  assert.ok(plte&&trns,s.id+' valid transparency and 8 authored colours');
  const raw=inflateSync(Buffer.concat(ids));
  assert.equal(raw.length,(S*F+1)*S*LAYERS,s.id+' full uncompressed pixels');
 }
});

test('V2 preview is visually separate from approved V5.4 and rejected V1',()=>{
 const m=JSON.parse(readFileSync('effects/moves/six-v2/manifest.json','utf8'));
 assert.equal(m.approved,false);assert.equal(m.previewOnly,true);
 assert.equal(m.gameIntegrationEnabled,false);
 assert.equal(m.protectApprovedV54,true);
 assert.equal(m.contactFrame,CONTACT_FRAME);
 assert.equal(m.frameWidth,S);assert.equal(m.frameHeight,S);
 assert.equal(m.frames,F);assert.equal(m.layers.length,LAYERS);
 assert.deepEqual(m.frameMs,FRAME_MS);
 assert.ok(FRAME_MS[CONTACT_FRAME]>FRAME_MS[8]);
 const lab=readFileSync('moves.html','utf8'),renderer=readFileSync('src/move-six-v2.js','utf8');
 for(const id of ['version-v2','version-v1','glow','impact','fragments','pause','sparks','dark','light','battle','slow','normal'])
  assert.ok(lab.includes('id="'+id+'"'),id+' comparison control');
 assert.match(lab,/playMoveSixV2/);
 assert.match(renderer,/animationupdate/); // single master clock, five layers
 assert.match(renderer,/playMoveSixV2/);
 assert.match(renderer,/setFrame/);
 assert.ok(readFileSync('effects/slash/arc/material-v5-4/manifest.json','utf8').includes('"approved": true'));
 assert.ok(readFileSync('effects/moves/six-v1/manifest.json','utf8').includes('"approved": false'));
});
