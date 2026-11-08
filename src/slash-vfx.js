/* Original pixel-art slash library. Visual-only Phaser/WebGL integration.
 * V1 is an archived baseline; V2 preserves the accepted arc. V5 is a thin sweep with custom breakup art.
 * Never patch native gameplay/HP, Poké Arena kits or approved VFX.
 */
export const SLASH_IDS=Object.freeze([
  'ember-rake','solar-crescent','frost-shatter','ivory-gale','verdant-sickle','astral-reaver'
]);
export const SLASH_FRAME_WIDTH=96;
export const SLASH_FRAME_HEIGHT=96;
export const SLASH_FRAME_COUNT=12;
export const SLASH_FPS=24;
export const SLASH_VERSION=Object.freeze({archive:'v1',refinedArc:'v2',thinSweep:'v5'});
export const SLASH_FRAME_SIZE_BY_VERSION=Object.freeze({v1:96,v2:96,v5:144});
export const SLASH_FPS_BY_VERSION=Object.freeze({v1:24,v2:24,v5:16});
const knownVersion=new Set(Object.values(SLASH_VERSION));
const basePaths=Object.freeze({
 v1:'./effects/slash/archive/v1',
 v2:'./effects/slash/arc/refined-v2',
 v5:'./effects/slash/arc/sweep-v5'
});
const textureKey=(id,version)=>'efeitos-slash-'+version+'-'+id;
function check(id,version){
 if(!SLASH_IDS.includes(id))throw new RangeError('Invalid slash effect: '+String(id));
 if(!knownVersion.has(version))throw new RangeError('Invalid slash version: '+String(version));
}
/** Run ONLY from Scene.preload(); V5 frames are 144px, V1/V2 stay 96px. */
export function preloadSlashes(scene,versions=['v5'],paths=basePaths){
 if(typeof scene?.load?.spritesheet!=='function')throw new TypeError('Phaser Scene.preload is required');
 for(const version of versions){
  if(!knownVersion.has(version))throw new RangeError('Invalid version');
  const base=paths[version]??basePaths[version];
  for(const id of SLASH_IDS){
   scene.load.spritesheet(textureKey(id,version),
    base.replace(/\/$/,'')+'/'+id+'.png',
    {frameWidth:SLASH_FRAME_SIZE_BY_VERSION[version],frameHeight:SLASH_FRAME_SIZE_BY_VERSION[version],margin:0,spacing:0});
  }
 }
}
/** The gallery can loop; one-shot animation cleans up automatically. Gameplay integration is NOT enabled. */
export function playSlash(scene,id,x,y,{version='v5',scale=1,loop=false,depth=200,flipX=false,angle=0}={}){
 check(id,version);
 const key=textureKey(id,version);
 if(!scene?.textures?.exists(key)||!scene?.anims||!scene?.add?.sprite)return null;
 const anim=key+(loop?'-repeat':'-once');
 if(!scene.anims.exists(anim)){
  scene.anims.create({key:anim,
   frames:scene.anims.generateFrameNumbers(key,{start:0,end:SLASH_FRAME_COUNT-1}),
   frameRate:SLASH_FPS_BY_VERSION[version],repeat:loop?-1:0});
 }
 const sprite=scene.add.sprite(Math.round(x),Math.round(y),key,0);
 sprite.setDepth(depth).setScale(scale).setFlipX(Boolean(flipX)).setAngle(angle);
 if(typeof scene.textures.get(key)?.setFilter==='function'&&
    globalThis.Phaser?.Textures?.FilterMode?.NEAREST!==undefined){
  scene.textures.get(key).setFilter(globalThis.Phaser.Textures.FilterMode.NEAREST);
 }
 if(!loop)sprite.once('animationcomplete',()=>sprite.destroy());
 sprite.play(anim);
 return sprite;
}
export function destroySlashes(sprites){
 for(const sprite of sprites)if(sprite?.active)sprite.destroy();
}
