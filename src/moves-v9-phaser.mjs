/**
 * V9 — five 16-frame raster spritesheet attacks, preserving V8 Air Slash.
 * The pixel-art atlases live in assets/v9/*.png. No battle mechanics or V8
 * sprite assets change. PNGs are generated in the separate reviewed art pack.
 * This module only draws pre-painted image frames; no Phaser.Graphics VFX.
 */
export const V9_IDS=Object.freeze(['flame-burst','frost-breath','razor-shell','shadow-punch','meteor-mash']);
export const V9_FRAME_WIDTH=80,V9_FRAME_HEIGHT=80,V9_FRAME_COUNT=16;
export const V9_FRAME_MS=Object.freeze([74,56,43,36,32,28,27,28,103,44,48,53,61,77,90,105]);
export const V9_IMPACT_FRAME=9;
export const V9_DETAILS=Object.freeze({
 'flame-burst':{label:'Flame Burst',scale:1.32,impact:9},
 'frost-breath':{label:'Frost Breath',scale:1.42,impact:10},
 'razor-shell':{label:'Razor Shell',scale:1.23,impact:9},
 'shadow-punch':{label:'Shadow Punch',scale:1.25,impact:9},
 'meteor-mash':{label:'Meteor Mash',scale:1.27,impact:9}
});
export function preloadV9(scene,root='./assets/v9/'){
 for(const id of V9_IDS)scene.load.spritesheet('v9-'+id,root+id+'.png',
  {frameWidth:V9_FRAME_WIDTH,frameHeight:V9_FRAME_HEIGHT,margin:0,spacing:0});
}
export function playV9(scene,id,x,y,{scale=1,depth=100,speed=1,onComplete=null,autoDestroy=true}={}){
 if(!V9_IDS.includes(id))throw new RangeError('Unsupported V9 move '+id+'; preserve Air Slash V8');
 const key='v9-'+id;
 if(!scene.textures.exists(key))throw new Error('Missing V9 PNG spritesheet: '+key);
 const sprite=scene.add.sprite(x,y,key,0).setOrigin(.5).setDepth(depth).setScale(scale*V9_DETAILS[id].scale);
 const animation='v9-animation-'+id;
 if(!scene.anims.exists(animation))scene.anims.create({
  key:animation,frames:scene.anims.generateFrameNumbers(key,{start:0,end:15}),frameRate:19,repeat:0});
 sprite.play(animation);
 sprite.anims.timeScale=Math.max(.1,Math.min(2.5,speed));
 sprite.once('animationcomplete',()=>{
  try{onComplete?.(sprite)}finally{if(autoDestroy&&sprite.active)sprite.destroy();}
 });
 return sprite;
}
