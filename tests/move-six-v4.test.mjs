import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {V4_GLYPHS} from '../src/move-six-v4-cels.mjs';
import {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,CONTACT_FRAME,S,SCALE,F,LAYERS,createMoveSheetsV4} from '../src/build-move-six-v4.mjs';

test('V4 has 32 independent hand-authored pixel masks, no vector effects as core artwork',()=>{
 assert.ok(Object.keys(V4_GLYPHS).length>=32);
 for(const [key,bitmap] of Object.entries(V4_GLYPHS)){
  assert.ok(bitmap.includes('|')&&bitmap.length>25,key+' should contain rows');
  assert.match(bitmap,/^[1-8.|]+$/,key+' must be 8-color indexed pixels only');
 }
 const source=readFileSync('src/build-move-six-v4.mjs','utf8');
 assert.ok(!/\b(?:arc|poly|ellipse|bezier|gradient|canvas|glow|blur|filter|fillCircle|strokeLine)\s*\(/i.test(source),'No procedural vector shapes for source art');
 assert.ok(source.includes("import {V4_GLYPHS}"));
});

test('V4 six spritesheets deterministic valid indexed PNGs, each with 18 cels × 3 layers',()=>{
 const sheets=createMoveSheetsV4();
 assert.equal(sheets.length,6);
 assert.equal(new Set(MOVE_IDS).size,6);
 assert.equal(MOVE_NAMES.length,6);
 assert.equal(MOVE_TYPES.length,6);
 assert.equal(F,18);assert.equal(LAYERS,3);
 assert.equal(CONTACT_FRAME,9);
 const distinct=new Set();
 for(const s of sheets){
  const generated=Buffer.from(s.bytes),published=readFileSync('effects/moves/six-v4/'+s.id+'.png');
  assert.deepEqual(generated,published,s.id+' reproducible original pixel atlas');
  assert.deepEqual([...published.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(published.readUInt32BE(16),S*SCALE*F);
  assert.equal(published.readUInt32BE(20),S*SCALE*LAYERS);
  assert.equal(published[24],8);assert.equal(published[25],3,s.id+' indexed color PNG');
  assert.ok(published.length<95000&&published.length>10000,s.id+' lightweight indexed PNG');
  assert.equal(s.counts.length,F);
  assert.ok(s.counts.every(l=>l.length===LAYERS),s.id+' 3 compositing layers');
  assert.ok(s.counts[0].every(n=>n===0)&&s.counts[17].every(n=>n===0),'transparent initial and final keyframes');
  assert.ok(s.counts[9].reduce((a,b)=>a+b,0)>55,s.id+' visible hit frame');
  assert.ok(s.counts[13].reduce((a,b)=>a+b,0)>0,s.id+' lingering material-specific debris');
  assert.ok(!distinct.has(published.toString('base64')),s.id+' duplicate pixel atlas');
  distinct.add(published.toString('base64'));
  let cursor=8,palette=0,transparency=0,parts=[];
  while(cursor<published.length){
   const n=published.readUInt32BE(cursor),t=published.toString('ascii',cursor+4,cursor+8),chunk=published.subarray(cursor+8,cursor+8+n);
   assert.ok(cursor+n+12<=published.length,s.id+' valid PNG chunk');
   if(t==='PLTE')palette=n;
   if(t==='tRNS'){transparency=n;assert.equal(chunk[0],0);}
   if(t==='IDAT')parts.push(chunk);
   cursor+=n+12;
  }
  assert.equal(palette,27);
  assert.equal(transparency,9);
  const decoded=inflateSync(Buffer.concat(parts));
  assert.equal(decoded.length,(S*SCALE*F+1)*S*SCALE*LAYERS);
  // Confirm literal pixel-doubling instead of filtered scalable vectors.
  const width=S*SCALE*F;
  for(let y=0;y<S*SCALE*LAYERS;y+=17){
   const row=decoded.subarray(y*(width+1)+1,(y+1)*(width+1));
   for(let x=0;x<width;x+=2)assert.equal(row[x],row[x+1],s.id+' exact 2x pixel pairs');
  }
 }
});

test('V4 stays a visual-only laboratory; V5.4 approved assets are unchanged',()=>{
 const m=JSON.parse(readFileSync('effects/moves/six-v4/manifest.json','utf8'));
 assert.equal(m.approved,false);assert.equal(m.gameIntegrationEnabled,false);
 assert.equal(m.preserveApprovedSlashV54,true);assert.equal(m.contactFrame,CONTACT_FRAME);
 assert.equal(m.frameCount,F);assert.equal(m.layerCount,LAYERS);
 assert.deepEqual(m.frameMs,FRAME_MS);
 const html=readFileSync('moves-v4.html','utf8'),renderer=readFileSync('src/move-six-v4.js','utf8');
 for(const control of ['version-v4','version-v3','version-v2','version-v1','impact','fragments','pause','sparks','glow','dark','light','battle','slow','normal'])
  assert.ok(html.includes('id="'+control+'"'),control+' must exist');
 assert.match(html,/playMoveSixV4/);assert.match(html,/Phaser.WEBGL/);
 assert.match(renderer,/animationupdate/);assert.match(renderer,/NEAREST/);
 assert.ok(!/\bfillCircle\b|\bstrokePath\b|\.getContext\(/.test(renderer));
 assert.ok(readFileSync('effects/slash/arc/material-v5-4/manifest.json','utf8').includes('"approved": true'));
});
