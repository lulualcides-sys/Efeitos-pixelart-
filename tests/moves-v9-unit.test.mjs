import test from 'node:test';
import assert from 'node:assert/strict';
import {V9_IDS,V9_FRAME_COUNT,V9_FRAME_WIDTH,V9_FRAME_HEIGHT,
 V9_FRAME_MS,preloadV9,playV9} from '../src/moves-v9-phaser.mjs';
test('V9 covers five new move effects and deliberately leaves Air Slash V8 untouched',()=>{
 assert.deepEqual(V9_IDS,['flame-burst','frost-breath','razor-shell','shadow-punch','meteor-mash']);
 assert.equal(V9_FRAME_COUNT,16);
 assert.equal(V9_FRAME_WIDTH,80);assert.equal(V9_FRAME_HEIGHT,80);
 assert.equal(V9_FRAME_MS.length,16);
 assert.ok(V9_FRAME_MS.every(n=>n>=20&&n<=130));
 assert.ok(!V9_IDS.includes('air-slash'));
});
test('V9 loads separate 16-frame PNG sheets with Phaser spritesheet API',()=>{
 const loaded=[];const scene={load:{spritesheet:(...v)=>loaded.push(v)}};
 preloadV9(scene);
 assert.equal(loaded.length,5);
 for(const [key,path,opts] of loaded){
  assert.ok(key.startsWith('v9-'));
  assert.ok(path.endsWith('.png'));
  assert.equal(opts.frameWidth,80);assert.equal(opts.frameHeight,80);
  assert.equal(opts.margin,0);assert.equal(opts.spacing,0);
 }
});
test('V9 animates actual PNG sprites; does not change base-game mechanics',()=>{
 let destroyed=0,completed=0,animations=0;
 const scene={
  textures:{exists:k=>V9_IDS.includes(k.slice(3))},
  anims:{exists:()=>false,generateFrameNumbers:(k,r)=>{assert.equal(r.end,15);return [];},
   create:()=>{animations++}},
  add:{sprite:(x,y,key,frame)=>({
   active:true,anims:{timeScale:1},
   setOrigin(){return this},setDepth(){return this},setScale(){return this},
   play(){return this},
   once(event,fn){assert.equal(event,'animationcomplete');this.complete=fn;return this},
   destroy(){this.active=false;destroyed++},
   key
  })}
 };
 for(const id of V9_IDS){
  const obj=playV9(scene,id,200,100,{speed:1.2,onComplete:()=>completed++});
  assert.equal(obj.key,'v9-'+id);
  assert.equal(obj.anims.timeScale,1.2);
  obj.complete();
 }
 assert.equal(animations,5);assert.equal(destroyed,5);assert.equal(completed,5);
 assert.throws(()=>playV9(scene,'air-slash',0,0),RangeError);
});
