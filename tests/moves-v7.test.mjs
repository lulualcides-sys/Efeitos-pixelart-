import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {MOVES,PACK,FRAME_COUNT,HIT_FRAME,TRAVEL_FRAME,DECAY_FRAME,FRAME_MS} from '../src/moves-v7-clean.js';

const manifest=JSON.parse(readFileSync('assets/v7/manifest.json','utf8'));
test('V7 clean-room: six distinct Pokémon move gestures, not V1–V6 imports',()=>{
 assert.deepEqual(MOVES.map(x=>x.id),['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash']);
 assert.equal(new Set(MOVES.map(x=>x.type)).size,6);
 const s=readFileSync('src/moves-v7-clean.js','utf8');
 assert.equal(FRAME_COUNT,26);assert.equal(FRAME_MS.length,26);
 assert.equal(HIT_FRAME,14);assert.equal(TRAVEL_FRAME,9);assert.equal(DECAY_FRAME,20);
 assert.match(s,/playV7/);assert.match(s,/preloadV7/);
 for(const path of ['v5','v6','build-move-six-v3','build-move-six-v4','build-move-six-v5'])
  assert.ok(!s.includes('./move-six-'+path)&&!s.includes('./build-move-six-'+path),'No rejected implementations '+path);
 for(const id of MOVES.map(x=>x.id))assert.match(s,new RegExp("id==='"+id+"'"));
 for(const tag of ['projectile','frost','wind','shell','ghost','steel'])
  assert.ok(s.includes(tag),'Material art distinction: '+tag);
 assert.ok(!/scene\.add\.graphics\s*\(|canvas\.getContext\s*\(|\.fillCircle\(/.test(s),'V7 effects not CSS/vector primitives');
});
test('All nine pinned MIT Pixelfx transparent atlases have real frames and checked PNG SHA256',()=>{
 assert.equal(manifest.version,'seven-v7-cleanroom');
 assert.equal(manifest.status,'visual-review-only');
 assert.equal(manifest.approved,false);assert.equal(manifest.gameIntegrationEnabled,false);
 assert.equal(manifest.preservesApprovedSlashV54,true);
 assert.equal(manifest.derivedFromRejectedVersions,false);
 assert.equal(manifest.sourceCommit,'a84159688af3ca37a4be05a0d422b94451b2e24e');
 assert.equal(manifest.sourceLicense,'MIT');
 assert.equal(PACK.length,9);assert.equal(manifest.entries.length,9);
 for(const entry of manifest.entries){
  assert.equal(entry.source.split('/').at(-1),PACK.find(x=>x[0]===entry.id)?.[1]);
  const b=readFileSync('assets/v7/'+entry.png);
  const json=JSON.parse(readFileSync('assets/v7/'+entry.json,'utf8'));
  assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a',entry.id);
  assert.equal(createHash('sha256').update(b).digest('hex'),entry.sha256);
  assert.ok(b.length>500&&b.length<15000000);
  assert.ok(Array.isArray(json.frames)&&json.frames.length>=6);
  assert.equal(json.frames.length,entry.frames);
  assert.equal(json.meta?.pixelfx?.frames,entry.frames);
  assert.deepEqual(json.meta.pixelfx.frameSize,entry.frameSize);
  assert.ok(json.frames.every(x=>x.frame?.w>0&&x.frame?.h>0&&x.duration>0),entry.id+' frame metadata');
  assert.equal(json.frames[0].filename,PACK.find(x=>x[0]===entry.id)?.[1]+' 0');
 }
});
test('Three original editable sprite-art sources, PNG shape and 16 unique pose slots',()=>{
 const src=readFileSync('tools/build-relics-v7.py','utf8');
 for(const name of ['def shell()','def fist(which)','ghost','steel','Image.Resampling.NEAREST','FRAMES=16'])
  assert.ok(src.includes(name),'editable hand artwork source '+name);
 for(const type of ['shell','ghost','steel']){
  const png=readFileSync('assets/v7/relics/'+type+'.png');
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16),112*16);
  assert.equal(png.readUInt32BE(20),112);
  assert.ok(png.length>2500,type+' actual 16 frame sprite');
 }
 const prior=JSON.parse(readFileSync('effects/slash/arc/material-v5-4/manifest.json','utf8'));
 assert.equal(prior.version,'v5.4');
 assert.equal(prior.gameIntegrationEnabled,false);
 assert.equal(prior.status,'pending_visual_review');
 assert.equal(prior.derivedFrom,'v5.3-r1');
});
test('V7 dedicated mobile and desktop gallery uses Phaser WebGL and genuine atlas frames',()=>{
 const html=readFileSync('moves-v7.html','utf8');
 assert.match(html,/type:Phaser.WEBGL/);
 assert.match(html,/preloadV7/);assert.match(html,/playV7/);
 for(const id of ['move','prev','next','prepare','travel','hit','decay','pause','normal','half','dark','light','battle'])
  assert.ok(html.includes('id="'+id+'"'),id+' control');
 assert.match(html,/sourceRevision/);
 assert.match(html,/image-rendering:pixelated/);
});
