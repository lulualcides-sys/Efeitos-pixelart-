import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {createV5} from '../src/build-slash-v5.mjs';
import {buildV5Layers,V5_LAYERS} from '../src/build-slash-layers.mjs';
import {V5_LAYER_NAMES,V5_GLOW_ALPHA,V5_TRAIL_ALPHA} from '../src/slash-vfx-layers.js';
const folder='effects/slash/arc/layers-v5/';

function decodePNG(bytes){
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(bytes[24],8);
 assert.equal(bytes[25],3);
 let idat=[],palette=null,transparent=null;
 for(let p=8;p<bytes.length;){
  const n=bytes.readUInt32BE(p),label=bytes.toString('ascii',p+4,p+8);
  const body=bytes.subarray(p+8,p+8+n);
  if(label==='IDAT')idat.push(body);
  if(label==='PLTE')palette=body;
  if(label==='tRNS')transparent=body;
  p+=n+12;
 }
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 const raw=inflateSync(Buffer.concat(idat));
 assert.equal(raw.length,height*(width+1));
 assert.ok(palette?.length>=21);
 assert.equal(transparent?.[0],0);
 for(let y=0;y<height;y++)assert.equal(raw[y*(width+1)],0);
 return {width,height,raw,palette,transparent};
}
test('five layers form identical opaque original pixels and a contained glow overlay',()=>{
 const generated=buildV5Layers(),original=Object.fromEntries(createV5().map(x=>[x.id,x]));
 assert.equal(generated.length,6);
 assert.deepEqual(V5_LAYERS,V5_LAYER_NAMES);
 assert.ok(V5_GLOW_ALPHA<=.20 && V5_TRAIL_ALPHA>=.70);
 let totalGlow=0;
 for(const item of generated){
  const bytes=readFileSync(folder+item.id+'.png');
  assert.deepEqual(bytes,Buffer.from(item.bytes),item.id+' does not match reproducible generator');
  const layer=decodePNG(bytes),base=decodePNG(Buffer.from(original[item.id].bytes));
  assert.deepEqual([layer.width,layer.height],[1728,720]);
  assert.deepEqual([base.width,base.height],[1728,144]);
  assert.deepEqual(layer.palette,base.palette);
  const lStride=layer.width+1,sStride=base.width+1;
  for(let f=0;f<12;f++)for(let y=0;y<144;y++)for(let x=0;x<144;x++){
   const pixel=base.raw[y*sStride+1+144*f+x];
   let opaqueCount=0,last=0;
   for(let layerId=0;layerId<4;layerId++){
    const value=layer.raw[(layerId*144+y)*lStride+1+144*f+x];
    if(value){opaqueCount++;last=value}
   }
   const glow=layer.raw[(4*144+y)*lStride+1+144*f+x];
   if(pixel){
    assert.equal(opaqueCount,1,item.id+'/frame'+f+'/pixel'+x+','+y+' must own exactly one opaque layer');
    assert.equal(last,pixel,'opaque colors must reproduce the original sprite');
   }else{
    assert.equal(opaqueCount,0,'no opaque layer may add new pixels');
   }
   if(glow){
    totalGlow++;
    assert.equal(pixel,glow,'glow must only duplicate a real highlight pixel');
    assert.ok(f>=2&&f<=5);
    assert.equal(layer.raw[(1*144+y)*lStride+1+144*f+x],glow,
     'glow must be contained inside the core, never grow a thick rim');
   }
  }
  assert.ok(item.counts.core[4]>700);
  assert.ok(item.counts.outerAccent[4]>50);
  assert.ok(item.counts.breakup[7]>50);
  assert.equal(item.counts.core[7],0,'the blade must end before breakup');
  assert.ok(item.counts.innerGlow[4]>10);
  assert.equal(item.counts.innerGlow[7],0);
  assert.ok(item.counts.residualTrail.reduce((n,x)=>n+x,0)>80);
  assert.ok(item.bytes.length<50000,'layer pack should be tiny, not a 1.2 MB uncompressed image');
 }
 assert.ok(totalGlow>1000);
});
test('Phaser adapter keeps layering cosmetic, uses only one ADD pass and supports cleanup',()=>{
 const js=readFileSync('src/slash-vfx-layers.js','utf8');
 const html=readFileSync('index.html','utf8');
 assert.match(js,/playLayeredV5/);
 assert.match(js,/preloadLayeredV5/);
 assert.match(js,/BlendModes\.ADD/);
 assert.match(js,/NEAREST/);
 assert.match(js,/setFrame\(frame\)/);
 assert.doesNotMatch(js,/\.hp\s*=|\.damage\s*=|localStorage|fetch\(/);
 assert.match(html,/id="layered"/);
 assert.match(html,/id="thin"/);
 assert.match(html,/id="glow"/);
 assert.match(html,/id="impact"/);
 assert.match(html,/id="breakup"/);
});
