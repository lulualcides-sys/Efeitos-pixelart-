// Pokémon Arena 2D–informed, original pixel-art move preview.
// One Phaser animation clock synchronizes body, details and hit flash.
// Visual only: not a replacement for a battle-system hitbox/damage implementation.
import {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,S,F,LAYERS,CONTACT_FRAME,LAYER_NAMES} from './build-move-six-v5.mjs';
export {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,CONTACT_FRAME,LAYER_NAMES};
export const MOVE_SPRITE_COUNT=LAYERS;
const prefix='pokepixel-v5-';
// Bitmapped cels supply shape transitions directly; no animated opacity tricks.
const layerAlpha=Array.from({length:LAYERS},()=>Array.from({length:F},(_,i)=>i===0||i===F-1?0:1));
export function preloadMoveSixV5(scene,base='./effects/moves/six-v5'){
 if(typeof scene?.load?.spritesheet!=='function')throw new TypeError('Phaser 3 scene loader required');
 for(const id of MOVE_IDS)scene.load.spritesheet(prefix+id,base.replace(/\/$/,'')+'/'+id+'.png',{
  frameWidth:S,frameHeight:S,margin:0,spacing:0
 });
}
export function playMoveSixV5(scene,id,x,y,{scale=1.38,depth=9,loop=true,speed=1,detail=true,flash=true}={}){
 if(!MOVE_IDS.includes(id))throw new RangeError('Unknown move '+id);
 const key=prefix+id;
 if(!scene?.textures?.exists(key)||!scene.anims?.create||!scene.add?.sprite)return null;
 const texture=scene.textures.get(key);
 const phaser=globalThis.Phaser;
 if(typeof texture?.setFilter==='function'&&phaser?.Textures?.FilterMode?.NEAREST!==undefined)
  texture.setFilter(phaser.Textures.FilterMode.NEAREST);
 const parts=Array.from({length:LAYERS},(_,i)=>scene.add.sprite(Math.round(x),Math.round(y),key,i*F)
  .setScale(scale).setDepth(depth+i*.07));
 const animKey=key+(loop?'-loop':'-once');
 if(!scene.anims.exists(animKey)){
  scene.anims.create({key:animKey,
   frames:scene.anims.generateFrameNumbers(key,{start:0,end:F-1})
    .map((frame,i)=>({...frame,duration:FRAME_MS[i]})),
   duration:1,skipMissedFrames:false,repeat:loop?-1:0
  });
 }
 let alive=true,current=0,detailsOn=detail,flashOn=flash;
 const main=parts[0];
 const apply=n=>{
  current=n;
  for(let i=0;i<LAYERS;i++){
   if(i>0)parts[i].setFrame(i*F+n);
   let alpha=layerAlpha[i][n];
   if(i===1&&!detailsOn)alpha=0;
   if(i===2&&!flashOn)alpha=0;
   parts[i].setAlpha(alpha);
  }
 };
 main.on('animationupdate',(_anim,frame)=>apply(Math.max(0,Math.min(F-1,frame.index-1))));
 main.play(animKey);
 if(Number.isFinite(speed)&&speed>0)main.anims.timeScale=speed;
 apply(0);
 const control={
  id,version:'v5',layers:parts,contactFrame:CONTACT_FRAME,frameMs:FRAME_MS,
  get active(){return alive},get frameIndex(){return current},get detailEnabled(){return detailsOn},get flashEnabled(){return flashOn},
  anims:{
   get timeScale(){return main.anims.timeScale},
   set timeScale(v){if(Number.isFinite(v)&&v>0)main.anims.timeScale=v},
   pause(){main.anims.pause()},resume(){main.anims.resume()}
  },
  setFrame(n){if(!Number.isInteger(n)||n<0||n>=F)throw new RangeError('Frame 0..17');
   main.setFrame(n);apply(n);return this},
  setDetails(on){detailsOn=Boolean(on);apply(current);return this},
  setFlash(on){flashOn=Boolean(on);apply(current);return this},
  destroy(){if(!alive)return;alive=false;for(const p of parts){if(p.active)p.destroy()}}
 };
 if(!loop)main.once('animationcomplete',()=>control.destroy());
 return control;
}
