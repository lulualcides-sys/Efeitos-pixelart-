/* V5.1 layered visual-only renderer.
 * Five indexed layers per element are packed in five 144px-high rows of
 * one spritesheet: 12 frames across each row. The original V5 remains
 * untouched, and original gameplay is never patched.
 */
import {SLASH_IDS} from './slash-vfx.js';
export const V5_LAYER_NAMES=Object.freeze([
 'residualTrail','core','outerAccent','breakup','innerGlow'
]);
export const V5_LAYER_FRAME_SIZE=144;
export const V5_LAYER_FRAME_COUNT=12;
export const V5_LAYER_FPS=16;
export const V5_GLOW_ALPHA=0.16;
export const V5_TRAIL_ALPHA=0.78;
export const V52_MICRO_ALPHA=0.65;
export const V52_FRAME_ALPHA=Object.freeze({
 trail:Object.freeze([.62,.68,.73,.77,.78,.78,.76,.69,.54,.35,.19,.06]),
 glow:Object.freeze([0,0,.06,.13,.19,.12,0,0,0,0,0,0]),
 accent:Object.freeze([.82,.86,.92,.98,1,.98,.93,.85,.73,.57,.37,.18]),
 breakup:Object.freeze([1,1,1,1,1,1,1,.95,.81,.61,.36,.15]),
 micro:Object.freeze([0,0,0,.30,.65,.48,.23,.10,0,0,0,0])
});
const microPrefix='efeitos-v52-glint-';
const prefix='efeitos-v5-layers-';
const validId=id=>SLASH_IDS.includes(id);

export function preloadLayeredV5(scene,base='./effects/slash/arc/layers-v5'){
 if(typeof scene?.load?.spritesheet!=='function')
  throw new TypeError('Scene.preload required');
 for(const id of SLASH_IDS){
  scene.load.spritesheet(prefix+id,base.replace(/\/$/,'')+'/'+id+'.png',{
   frameWidth:V5_LAYER_FRAME_SIZE,frameHeight:V5_LAYER_FRAME_SIZE,
   margin:0,spacing:0
  });
 }
}
export function preloadMicroV52(scene,base='./effects/slash/arc/microglints-v5-2'){
 if(typeof scene?.load?.spritesheet!=='function')throw new TypeError('Scene.preload required');
 for(const id of SLASH_IDS){
  scene.load.spritesheet(microPrefix+id,base.replace(/\/$/,'')+'/'+id+'.png',{
   frameWidth:V5_LAYER_FRAME_SIZE,frameHeight:V5_LAYER_FRAME_SIZE,margin:0,spacing:0
  });
 }
}
/** A/B opt-in: original V5.1 pixels with per-phase alpha envelopes plus tiny,
 * time-limited material glints; V5.1 and V5 textures remain unchanged.
 */
export function playLayeredV52(scene,id,x,y,options={}){
 return playLayeredV5(scene,id,x,y,{...options,finish:'precision'});
}
export function playLayeredV5(scene,id,x,y,{loop=false,scale=1,depth=12,
 flipX=false,angle=0,glow=true,glowAlpha=V5_GLOW_ALPHA,finish='classic'}={}){
 if(finish!=='classic'&&finish!=='precision')throw new RangeError('Unknown layer finish');
 if(!validId(id))throw new RangeError('Invalid slash ID: '+String(id));
 const key=prefix+id;
 if(!scene?.textures?.exists(key)||!scene?.anims||!scene?.add?.sprite)return null;
 if(finish==='precision'&&!scene.textures.exists(microPrefix+id))return null;
 const phaser=globalThis.Phaser;
 if(typeof scene.textures.get(key)?.setFilter==='function'&&
    phaser?.Textures?.FilterMode?.NEAREST!==undefined)
  scene.textures.get(key).setFilter(phaser.Textures.FilterMode.NEAREST);
 const parts=[];
 for(let layer=0;layer<V5_LAYER_NAMES.length;layer++){
  const layerName=V5_LAYER_NAMES[layer],animKey=key+'-'+layerName+(loop?'-loop':'-once');
  if(!scene.anims.exists(animKey))scene.anims.create({
   key:animKey,
   frames:scene.anims.generateFrameNumbers(key,{
    start:layer*V5_LAYER_FRAME_COUNT,end:(layer+1)*V5_LAYER_FRAME_COUNT-1}),
   frameRate:V5_LAYER_FPS,repeat:loop?-1:0
  });
  const sprite=scene.add.sprite(Math.round(x),Math.round(y),key,layer*V5_LAYER_FRAME_COUNT);
  sprite.setDepth(depth+layer*.1).setScale(scale).setFlipX(Boolean(flipX)).setAngle(angle);
  if(layerName==='residualTrail')sprite.setAlpha(V5_TRAIL_ALPHA);
  if(layerName==='innerGlow'){
   // One additive batch at the top, after all NORMAL layers. No bloom
   // extrusion or smoothing and no 2D canvas filters.
   sprite.setAlpha(glow?glowAlpha:0);
   if(phaser?.BlendModes?.ADD!==undefined)sprite.setBlendMode(phaser.BlendModes.ADD);
  }
  sprite.play(animKey);
  parts.push(sprite);
 }
 let micro=null;
 if(finish==='precision'){
  const microKey=microPrefix+id;
  if(typeof scene.textures.get(microKey)?.setFilter==='function'&&
     phaser?.Textures?.FilterMode?.NEAREST!==undefined)
   scene.textures.get(microKey).setFilter(phaser.Textures.FilterMode.NEAREST);
  const microAnim=microKey+(loop?'-loop':'-once');
  if(!scene.anims.exists(microAnim))scene.anims.create({
   key:microAnim,frames:scene.anims.generateFrameNumbers(microKey,{start:0,end:11}),
   frameRate:V5_LAYER_FPS,repeat:loop?-1:0
  });
  micro=scene.add.sprite(Math.round(x),Math.round(y),microKey,0);
  micro.setDepth(depth+.5).setScale(scale).setFlipX(Boolean(flipX)).setAngle(angle);
  if(phaser?.BlendModes?.ADD!==undefined)micro.setBlendMode(phaser.BlendModes.ADD);
  micro.setAlpha(0);micro.play(microAnim);parts.push(micro);
 }
 let active=true,timeScale=1;
 let currentFrame=0;
 let glowEnabled=Boolean(glow);
 const core=parts[V5_LAYER_NAMES.indexOf('core')];
 function applyFrame(frame){
  if(finish!=='precision')return;
  currentFrame=frame;
  const curve=V52_FRAME_ALPHA;
  parts[0].setAlpha(curve.trail[frame]);
  parts[2].setAlpha(curve.accent[frame]);
  parts[3].setAlpha(curve.breakup[frame]);
  parts[4].setAlpha(glowEnabled?curve.glow[frame]:0);
  if(micro)micro.setAlpha(glowEnabled?curve.micro[frame]:0);
 }
 if(finish==='precision'){
  // The core owns timing; all other sprites follow its twelve native frames.
  core.on('animationupdate',(_animation,frame)=>applyFrame(Math.max(0,Math.min(11,frame.index-1))));
  applyFrame(0);
 }
 const anims={
  get timeScale(){return timeScale},
  set timeScale(value){
   if(!Number.isFinite(value)||value<=0)return;
   timeScale=value;for(const sprite of parts)sprite.anims.timeScale=value;
  },
  get currentFrame(){return core.anims.currentFrame},
  pause(){for(const sprite of parts)sprite.anims.pause()},
  resume(){for(const sprite of parts)sprite.anims.resume()}
 };
 const controller={
  id,version:finish==='precision'?'v5.2-microfinish':'v5-layered',
  get active(){return active},
  layers:parts,
  layerNames:finish==='precision'?[...V5_LAYER_NAMES,'microGlints']:V5_LAYER_NAMES,
  get finish(){return finish},
  get frameIndex(){return currentFrame},
  get microAlpha(){return micro?.alpha??null},
  get frameAlpha(){return finish==='precision'?{
   trail:parts[0].alpha,accent:parts[2].alpha,breakup:parts[3].alpha,
   glow:parts[4].alpha,micro:micro?.alpha??0}:null},
  anims,
  get glowAlpha(){return parts[4].alpha},
  setGlowEnabled(enabled){
   glowEnabled=Boolean(enabled);
   if(finish==='precision')applyFrame(currentFrame);
   else parts[4].setAlpha(glowEnabled?glowAlpha:0);
   return this
  },
  setFrame(frame){
   if(!Number.isInteger(frame)||frame<0||frame>=V5_LAYER_FRAME_COUNT)
    throw new RangeError('Frame must be 0...11');
   for(let layer=0;layer<V5_LAYER_NAMES.length;layer++)
    parts[layer].setFrame(layer*V5_LAYER_FRAME_COUNT+frame);
   if(micro)micro.setFrame(frame);
   applyFrame(frame);
   return this;
  },
  destroy(){if(!active)return;active=false;for(const sprite of parts)if(sprite.active)sprite.destroy()}
 };
 if(!loop)core.once('animationcomplete',()=>controller.destroy());
 return controller;
}
