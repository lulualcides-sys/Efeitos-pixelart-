// Original six VFX V2: Phaser 3 WebGL nearest-neighbour, one master clock.
// V2 has five independent transparent pixel layers; no damage or collision code.
// Native Pokemon Torre 2 move kits, approved art and saves are never altered.
import {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,S,F,LAYERS,CONTACT_FRAME,LAYER_NAMES} from './build-move-six-v2.mjs';
export {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,CONTACT_FRAME,LAYER_NAMES};
export const MOVE_SPRITE_COUNT=LAYERS;
const prefix='pokemon-moves-six-v2-';
const alpha=Object.freeze({
 atmosphere:Object.freeze([0,.22,.23,.26,.27,.26,.25,.23,.2,.18,.16,.11,.07,.04,0,0]),
 silhouette:Object.freeze([0,1,1,1,1,1,1,1,1,1,.9,.64,.3,.1,0,0]),
 highlight:Object.freeze([0,.65,.68,.7,.76,.79,.8,.84,.87,1,.75,.45,.25,0,0,0]),
 fragments:Object.freeze([0,.7,.72,.78,.84,.91,1,1,1,1,1,.87,.74,.5,.24,0]),
 contact:Object.freeze([0,0,0,0,0,0,0,0,0,1,.52,.25,0,0,0,0])
});
export function preloadMoveSixV2(scene,base='./effects/moves/six-v2'){
 if(typeof scene?.load?.spritesheet!=='function')throw new TypeError('Expected Phaser scene loader');
 for(const id of MOVE_IDS)scene.load.spritesheet(prefix+id,base.replace(/\/$/,'')+'/'+id+'.png',{
  frameWidth:S,frameHeight:S,margin:0,spacing:0
 });
}
export function playMoveSixV2(scene,id,x,y,{scale=1.9,depth=8,loop=true,speed=1,sparks=true,glow=true}={}){
 if(!MOVE_IDS.includes(id))throw new RangeError('Unknown move '+id);
 const key=prefix+id;
 if(!scene?.textures?.exists(key)||!scene.anims?.create||!scene.add?.sprite)return null;
 const phaser=globalThis.Phaser,texture=scene.textures.get(key);
 if(typeof texture?.setFilter==='function'&&phaser?.Textures?.FilterMode?.NEAREST!==undefined)
  texture.setFilter(phaser.Textures.FilterMode.NEAREST);
 const sprites=[];
 for(let layer=0;layer<LAYERS;layer++){
  const sp=scene.add.sprite(Math.round(x),Math.round(y),key,layer*F);
  sp.setScale(scale).setDepth(depth+layer*.05);
  sprites.push(sp);
 }
 // A single master animation drives all five sprites; there is no temporal drift.
 const animKey=key+'-'+(loop?'loop':'once');
 if(!scene.anims.exists(animKey))scene.anims.create({
  key:animKey,frames:scene.anims.generateFrameNumbers(key,{start:F,end:2*F-1})
   .map((frame,i)=>({...frame,duration:FRAME_MS[i]})),
  duration:1,skipMissedFrames:false,repeat:loop?-1:0
 });
 let alive=true,index=0,showSparks=Boolean(sparks),showGlow=Boolean(glow),speedValue=speed;
 const core=sprites[1];
 const update=(frame)=>{
  if(!Number.isInteger(frame)||frame<0||frame>=F)return;
  index=frame;
  for(let l=0;l<LAYERS;l++){
   if(l!==1)sprites[l].setFrame(l*F+frame);
   let a=alpha[LAYER_NAMES[l]][frame];
   if(l===3&&!showSparks)a=0;
   if((l===2||l===4)&&!showGlow)a=0;
   sprites[l].setAlpha(a);
  }
 };
 core.on('animationupdate',(_anim,f)=>update(Math.max(0,Math.min(F-1,f.index-1))));
 core.play(animKey);
 if(Number.isFinite(speed)&&speed>0)core.anims.timeScale=speed;
 update(0);
 const anims={
  get timeScale(){return core.anims.timeScale},
  set timeScale(v){if(Number.isFinite(v)&&v>0){speedValue=v;core.anims.timeScale=v}},
  pause(){core.anims.pause()},resume(){core.anims.resume()}
 };
 const out={
  id,version:'six-v2',layers:sprites,layerNames:LAYER_NAMES,
  frameMs:FRAME_MS,contactFrame:CONTACT_FRAME,
  get active(){return alive},get frameIndex(){return index},
  get sparksEnabled(){return showSparks},get glowEnabled(){return showGlow},
  get speed(){return speedValue},anims,
  setFrame(n){
   if(!Number.isInteger(n)||n<0||n>=F)throw new RangeError('Frame must be 0..15');
   core.setFrame(F+n);update(n);return this;
  },
  setSparksEnabled(on){showSparks=Boolean(on);update(index);return this},
  setGlowEnabled(on){showGlow=Boolean(on);update(index);return this},
  destroy(){if(!alive)return;alive=false;for(const s of sprites){if(s.active)s.destroy()}}
 };
 if(!loop)core.once('animationcomplete',()=>out.destroy());
 return out;
}
