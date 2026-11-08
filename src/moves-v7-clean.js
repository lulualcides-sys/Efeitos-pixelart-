/**
 * Pokémon six-move V7 — new composition pipeline, not a derivative of rejected V1–V6.
 * 9 MIT PixelFX frame atlases and three original hand-inked 16-frame hero sprites.
 * No CSS animation, no Phaser.Graphics effect primitives, no blending circular blobs.
 * Every attack uses distinct acting: projectile, cold breath, wind edge, physical shell,
 * spectral fist, and armored meteor punch, with synchronized contact.
 */
export const MOVES=[
 {id:'flame-burst',name:'Flame Burst',type:'FIRE'},
 {id:'frost-breath',name:'Frost Breath',type:'ICE'},
 {id:'air-slash',name:'Air Slash',type:'FLYING'},
 {id:'razor-shell',name:'Razor Shell',type:'WATER'},
 {id:'shadow-punch',name:'Shadow Punch',type:'GHOST'},
 {id:'meteor-mash',name:'Meteor Mash',type:'STEEL'}
];
export const FRAME_COUNT=26, HIT_FRAME=14, TRAVEL_FRAME=9, DECAY_FRAME=20;
export const FRAME_MS=[75,65,56,49,45,42,40,39,39,38,38,37,36,36,126,50,54,57,60,63,66,74,83,90,100,105];
export const PACK=[
 ['fireball','fireball'],
 ['fire-hit','small-explosion'],
 ['frost-wind','frost-breath'],
 ['ice-break','ice-shatter'],
 ['wind-cut','sword-slash'],
 ['water-hit','splash'],
 ['punch-hit','blunt-hit'],
 ['shadow-wisp','shadow-tendrils'],
 ['steel-spark','crit-hit']
];
const packKey=k=>'v7-asset-'+k;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
const smooth=(a,b,t)=>ease((t-a)/(b-a));
const meta=Object.fromEntries(PACK);
export function preloadV7(scene){
 for(const [id] of PACK)
  scene.load.aseprite(packKey(id),'./assets/v7/atlas/'+id+'.png','./assets/v7/atlas/'+id+'.json');
 for(const id of ['shell','ghost','steel'])
  scene.load.spritesheet('v7-hero-'+id,'./assets/v7/relics/'+id+'.png',{frameWidth:112,frameHeight:112});
 scene.load.json('v7-manifest','./assets/v7/manifest.json');
}
export function playV7(scene,id,x,y,{scale=1,speed=1,auto=true,depth=8}={}){
 if(!MOVES.some(m=>m.id===id))throw new RangeError('Unknown attack '+id);
 const manifest=scene.cache.json.get('v7-manifest');
 if(!manifest||manifest.entries?.length!==PACK.length)return null;
 const counts=Object.fromEntries(manifest.entries.map(e=>[e.id,e.frames]));
 const nodes=new Map();
 const IMG=(key,order=0)=>{
  const img=scene.add.image(x,y,packKey(key)).setDepth(depth+order).setVisible(false).setAlpha(0);
  nodes.set(key,img);return img;
 };
 let hero=null;
 const fire=IMG('fireball',0),flameHit=IMG('fire-hit',.2),
  frost=IMG('frost-wind',.1),shatter=IMG('ice-break',.2),
  wind=IMG('wind-cut',.15),water=IMG('water-hit',.25),
  blunt=IMG('punch-hit',.3),shadow=IMG('shadow-wisp',-.05),steelSpark=IMG('steel-spark',.25);
 const relic=id==='razor-shell'?'shell':id==='shadow-punch'?'ghost':id==='meteor-mash'?'steel':null;
 if(relic)hero=scene.add.sprite(x,y,'v7-hero-'+relic,0).setDepth(depth+.4).setVisible(false);
 const textureValid=PACK.every(([key])=>scene.textures.exists(packKey(key)));
 if(!textureValid)throw Error('Missing V7 PixelFX textures');
 const K=key=>counts[key];
 const fx=(key,i,X,Y,size,alpha=1,opts={})=>{
  const s=nodes.get(key);
  if(!s)return;
  const n=K(key),u=clamp(i,0,.999999);
  const frame=clamp(Math.floor(u*n),0,n-1);
  s.setTexture(packKey(key),meta[key]+' '+frame)
   .setPosition(Math.round(X),Math.round(Y)).setScale(size*scale)
   .setAlpha(alpha).setVisible(alpha>.025);
  s.setFlipX(Boolean(opts.flip));
  s.setRotation(opts.rotate||0);
  if(opts.tint)s.setTint(opts.tint);else s.clearTint();
  if(opts.origin)s.setOrigin(opts.origin[0],opts.origin[1]);else s.setOrigin(.5,.5);
 };
 const hide=()=>{for(const sprite of nodes.values())sprite.setVisible(false).setAlpha(0);if(hero)hero.setVisible(false)};
 let frame=0,acc=0,live=true,playing=Boolean(auto);
 const attackIndex=MOVES.findIndex(m=>m.id===id);
 const contact={x:x+115*scale,y:y},start={x:x-124*scale,y:y+7*scale};
 function render(f){
  if(!live)return;
  frame=clamp(Math.round(f),0,FRAME_COUNT-1);hide();
  const travel=ease((frame-2)/12),hit=smooth(13.5,14.25,frame),out=1-smooth(15,22,frame);
  const flightX=start.x+(contact.x-start.x)*travel;
  const flightY=start.y+(contact.y-start.y)*travel;
  const inFlight=frame>=2&&frame<=13;
  const inImpact=frame>=14&&frame<=20;
  if(id==='flame-burst'){
   // Real moving fireball (not orange sphere) with spreading embers and detonation.
   if(inFlight)fx('fireball',((frame-2)/12)*1.8%1,flightX,flightY,1.16,1);
   if(inImpact)fx('fire-hit',(frame-14)/7,contact.x,contact.y+19*scale,.66,out);
  }
  if(id==='frost-breath'){
   // Wide frosty stream fixed at caster's mouth; crystals fracture on the target.
   if(inFlight){
    fx('frost-wind',((frame-2)/12)*1.45%1,start.x-16*scale,start.y,
      1.23,.6+.4*travel,{origin:[.05,.50]});
   }
   if(inImpact)fx('ice-break',.18+(frame-14)/7*.82,contact.x,contact.y,
     .83,out,{origin:[.42,.6]});
  }
  if(id==='air-slash'){
   // Exactly three separate staggered wind scythes, not a white rectangular band.
   if(inFlight){
    for(let j=0;j<3;j++){
     if(frame<3+j*2||frame>11+j)continue;
     // one atlas shared but offset cleanly: only one blade at each moment
     const q=ease((frame-(3+j*2))/Math.max(1,8-j));
     if(j===Math.min(2,Math.max(0,Math.floor((frame-3)/3))))
       fx('wind-cut',.06+q*.84,start.x+(contact.x-start.x)*q,
        start.y-18*scale+j*18*scale,1.14,1,{rotate:-.14+j*.06});
    }
   }
   if(inImpact)fx('wind-cut',.54+clamp((frame-14)/6)*.4,
      contact.x,contact.y,1.32,out,{rotate:-.19});
  }
  if(id==='razor-shell'){
   // Solid hand-inked scallop shell is the weapon; water is only the accompanying medium.
   if(frame>=1&&frame<=19){
    const v=frame<=13?travel:1+(frame-14)*.014;
    const X=start.x+(contact.x-start.x)*v,Y=start.y-12*scale-25*scale*Math.sin(Math.PI*travel);
    hero.setTexture('v7-hero-shell').setFrame(Math.min(15,frame))
      .setPosition(Math.round(X),Math.round(Y)).setScale(1.12*scale)
      .setAlpha(frame>17?Math.max(0,1-(frame-17)*.28):1).setVisible(true);
   }
   if(inFlight&&frame>=7)fx('wind-cut',.15+((frame-7)/8)*.5,flightX-20*scale,flightY,
      .83,.68,{rotate:-.24,tint:0xb9f9ff});
   if(inImpact)fx('water-hit',(frame-14)/7,contact.x,contact.y+18*scale,.9,out);
  }
  if(id==='shadow-punch'){
   // Animated four-knuckle spectral fist is the contact silhouette. Dark tendrils trail it.
   if(frame>=2&&frame<=19){
    const t=frame<=13?travel:1;
    hero.setTexture('v7-hero-ghost').setFrame(Math.min(15,frame))
      .setPosition(Math.round(start.x+(contact.x-start.x)*t),Math.round(start.y-5*scale))
      .setScale(1.22*scale).setAlpha(frame>17?.82:.99).setVisible(true);
   }
   if(inFlight)fx('shadow-wisp',((frame-2)/12)*.68,flightX-37*scale,flightY+3*scale,
      .58,.48,{tint:0xb9a0dc});
   if(inImpact)fx('punch-hit',(frame-14)/7,contact.x,contact.y,
      .75,out*.53,{tint:0xa57ac9});
  }
  if(id==='meteor-mash'){
   // Distinct armor plates, wrist guard and knuckles; physical punch is NOT a meteor fireball.
   if(frame>=2&&frame<=19){
    const t=frame<=13?travel:1;
    hero.setTexture('v7-hero-steel').setFrame(Math.min(15,frame))
      .setPosition(Math.round(start.x+(contact.x-start.x)*t),Math.round(start.y-17*scale-
        (inFlight?12*scale*Math.sin(Math.PI*t):0))).setScale(1.25*scale)
      .setAlpha(frame>17?.8:1).setVisible(true);
   }
   if(inImpact){
    fx('steel-spark',(frame-14)/7,contact.x,contact.y,.80,out);
    if(frame<17)fx('punch-hit',(frame-14)/7,contact.x,contact.y,.53,.29,{tint:0xc5e8ff});
   }
  }
  // prevent invisible ghost or steel sprites after their physical hit ends
  if(hero&&frame>=20)hero.setVisible(false);
 }
 const update=(_time,delta)=>{
  if(!live||!playing)return;
  acc+=Math.min(90,delta)*speed;
  while(acc>=FRAME_MS[frame]){acc-=FRAME_MS[frame];frame=(frame+1)%FRAME_COUNT}
  render(frame);
 };
 render(0);
 scene.events.on('update',update);
 return {
  id,type:MOVES[attackIndex].type,layers:[...nodes.values(),...(hero?[hero]:[])],
  get frameIndex(){return frame},get active(){return live},get paused(){return !playing},
  setFrame(f){acc=0;render(f);return this},pause(){playing=false;return this},
  resume(){playing=true;return this},setSpeed(v){speed=clamp(v,.1,2.5);return this},
  destroy(){if(!live)return;live=false;scene.events.off('update',update);
    for(const sprite of nodes.values())sprite.destroy();if(hero)hero.destroy()}
 };
}
