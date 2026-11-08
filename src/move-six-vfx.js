// Visual-only Phaser 3/WebGL adapter for six original Pokemon move animations.
// No collision/damage/status logic: those belong to the game, after approval.
import {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,S,F,CONTACT_FRAME} from './build-move-six.mjs';
export {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,CONTACT_FRAME};
const prefix='pokemon-original-six-';
export const MOVE_SPRITE_COUNT=2;
export function preloadMoveSix(scene,base='./effects/moves/six-v1'){
 if(typeof scene?.load?.spritesheet!=='function')throw new TypeError('Expected Phaser scene loader');
 for(const id of MOVE_IDS){
  scene.load.spritesheet(prefix+id,base.replace(/\/$/,'')+'/'+id+'.png',{
   frameWidth:S,frameHeight:S,margin:0,spacing:0
  });
 }
}
export function playMoveSix(scene,id,x,y,{scale=1.24,loop=true,depth=8,speed=1,sparks=true}={}){
 if(!MOVE_IDS.includes(id))throw new RangeError('Unknown move: '+id);
 const key=prefix+id;
 if(!scene?.textures?.exists(key)||!scene.anims||!scene.add?.sprite)return null;
 const phaser=globalThis.Phaser;
 const texture=scene.textures.get(key);
 if(typeof texture?.setFilter==='function'&&phaser?.Textures?.FilterMode?.NEAREST!==undefined)
  texture.setFilter(phaser.Textures.FilterMode.NEAREST);
 const parts=[];
 for(let layer=0;layer<2;layer++){
  const animKey=key+'-'+layer+'-'+(loop?'repeat':'once');
  if(!scene.anims.exists(animKey)){
   scene.anims.create({key:animKey,
    frames:scene.anims.generateFrameNumbers(key,{start:layer*F,end:(layer+1)*F-1})
     .map((f,i)=>({...f,duration:FRAME_MS[i]})),
    duration:1,skipMissedFrames:false,repeat:loop?-1:0});
  }
  const sp=scene.add.sprite(Math.round(x),Math.round(y),key,layer*F);
  sp.setScale(scale).setDepth(depth+layer*.2).setAlpha(layer===1?(sparks?.92:0):1);
  sp.play(animKey);
  sp.anims.timeScale=speed;
  parts.push(sp);
 }
 let enabled=sparks,active=true,playingFrame=0;
 const main=parts[0];
 main.on('animationupdate',(_anim,frame)=>{playingFrame=Math.max(0,Math.min(F-1,frame.index-1))});
 const controller={
  id,layers:parts,contactFrame:CONTACT_FRAME,frameMs:FRAME_MS,
  get active(){return active},
  get frameIndex(){return playingFrame},
  get sparksEnabled(){return enabled},
  get currentFrame(){return main.anims.currentFrame},
  anims:{
   get timeScale(){return main.anims.timeScale},
   set timeScale(n){if(Number.isFinite(n)&&n>0)for(const p of parts)p.anims.timeScale=n},
   pause(){for(const p of parts)p.anims.pause()},
   resume(){for(const p of parts)p.anims.resume()}
  },
  setFrame(n){
   if(!Number.isInteger(n)||n<0||n>=F)throw new RangeError('Invalid frame');
   for(let l=0;l<2;l++)parts[l].setFrame(l*F+n);
   playingFrame=n;return this;
  },
  setSparksEnabled(on){enabled=Boolean(on);parts[1].setAlpha(enabled?.92:0);return this},
  destroy(){if(!active)return;active=false;for(const p of parts)if(p.active)p.destroy()}
 };
 if(!loop)main.once('animationcomplete',()=>controller.destroy());
 return controller;
}
