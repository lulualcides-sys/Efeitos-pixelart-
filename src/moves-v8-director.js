/**
 * Six Pokémon moves V8 — combat direction/art refinement of the independent V7 library.
 * Sources: 9 verified PixelFX MIT sprite atlases, 3 original hand-inked 16-cel hero assets.
 *
 * Fixes: giant dead space, 1-frame cuts, lack of material, no acceleration/hit anticipation,
 * toy-like punch poses, wind slashes disappearing, effects floating off the point of contact.
 * Does not import rejected moves V1–V6; does not modify the real Pokémon battle.
 *
 * The visual effect is image-backed sprites only. No CSS geometry, SVG or Phaser.Graphics
 * used to generate an attack. Frame interpolation is spatial, not source-pixel smoothing.
 */
import {MOVES,PACK,preloadV7} from './moves-v7-clean.js';
export {MOVES,PACK};
export const V8_MATERIALS=[['sky-cut','sword-slash'],['spectral-hit','crit-hit'],['meteor-hit','crit-hit']];
export const V8_FRAMES=26,V8_HIT=14,V8_TRAVEL=9,V8_DECAY=20;
export const V8_MS=[83,65,50,44,38,33,29,26,25,25,26,26,28,31,118,33,38,46,52,57,66,74,83,92,105,119];
export const STAGING=Object.freeze({
 attackOrigin:{x:-150,y:8},
 contact:{x:146,y:-5},
 contacts:{
  'flame-burst':{x:146,y:-7},'frost-breath':{x:146,y:-7},
  'air-slash':{x:147,y:-5},'razor-shell':{x:142,y:-8},
  'shadow-punch':{x:145,y:-8},'meteor-mash':{x:145,y:-8}
 }
});
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const easeOut=t=>{t=clamp(t);return 1-Math.pow(1-t,3)};
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const L=(a,b,t)=>a+(b-a)*t;
const k=id=>V8_MATERIALS.some(x=>x[0]===id)?'v8-asset-'+id:'v7-asset-'+id;
const name=Object.fromEntries([...PACK,...V8_MATERIALS]);
export function preloadV8(scene){
 preloadV7(scene);
 for(const type of ['shell','ghost','steel'])
  scene.load.spritesheet('v8-hero-'+type,'./assets/v8/hero/'+type+'.png',{frameWidth:160,frameHeight:144});
 scene.load.json('v8-hero-manifest','./assets/v8/hero/manifest.json');
 for(const [type] of V8_MATERIALS)
  scene.load.aseprite('v8-asset-'+type,'./assets/v8/atlases/'+type+'.png',
   './assets/v8/atlases/'+type+'.json');
 scene.load.json('v8-material-manifest','./assets/v8/atlases/manifest.json');
}
export function playV8(scene,id,x,y,{scale=1,depth=8,auto=true,speed=1,loop=true}={}){
 if(!MOVES.some(m=>m.id===id))throw new RangeError('Unknown V8 move '+id);
 const data=scene.cache.json.get('v7-manifest');
 if(!data||data.entries?.length!==9)throw new Error('V8 requires valid V7 PixelFX source atlases');
 const newer=scene.cache.json.get('v8-material-manifest');
 if(!newer||newer.entries?.length!==3)throw new Error('V8 requires three actual tuned PixelFX PNG atlases');
 const frames=Object.fromEntries([...data.entries,...newer.entries].map(e=>[e.id,e.frames]));
 const actors=[],handles={};
 function newLayer(label,asset,priority=0){
  const sprite=scene.add.image(x,y,k(asset)).setDepth(depth+priority).setVisible(false).setAlpha(0);
  const layer={label,asset,sprite};actors.push(layer);handles[label]=layer;return layer;
 }
 const H={};
 for(const [label,asset,prio] of [
  ['proj','fireball',.11],['fireBack','fireball',.09],
  ['blast','fire-hit',.18],['frost','frost-wind',.05],['frostEcho','frost-wind',.04],
  ['ice','ice-break',.28],['blade0','sky-cut',.19],['blade1','sky-cut',.18],
  ['blade2','sky-cut',.17],['bladeHit','sky-cut',.32],
  ['water','water-hit',.22],['water2','water-hit',.13],
  ['smoke','shadow-wisp',-.04],['smoke2','shadow-wisp',-.03],
  ['ghostImpact','spectral-hit',.41],
  ['punch','punch-hit',.35],['metalHit','meteor-hit',.38],
  ['metalHit2','meteor-hit',.19]
 ])H[label]=newLayer(label,asset,prio);
 let hero=null;
 const heroName=id==='razor-shell'?'shell':id==='shadow-punch'?'ghost':id==='meteor-mash'?'steel':null;
 if(heroName)hero=scene.add.sprite(x,y,'v8-hero-'+heroName,0).setDepth(depth+.27).setVisible(false);
 const fragments=[];
 if(id==='flame-burst'){
  for(let j=0;j<7;j++)fragments.push(newLayer('flameFragment'+j,'fireball',.2+j*.001));
 }
 let playing=Boolean(auto),live=true,frame=0,acc=0,micro=0,rate=clamp(speed,.2,2.5);
 const from={x:x+STAGING.attackOrigin.x*scale,y:y+STAGING.attackOrigin.y*scale};
 const to={x:x+STAGING.contacts[id].x*scale,y:y+STAGING.contacts[id].y*scale};
 const moveProgress=f=>easeOut((f-3.0)/10.8);
 const pos=f=>{
  const t=moveProgress(f);
  return {x:L(from.x,to.x,t),y:L(from.y,to.y,t)};
 };
 const hide=()=>{
  for(const a of actors)a.sprite.setVisible(false).setAlpha(0);
  if(hero)hero.setVisible(false);
 };
 function paint(label,idx,X,Y,magnify=1,alpha=1,{
  origin=[.5,.5],rotation=0,tint=null,flipX=false,flipY=false
 }={}){
  const item=handles[label];if(!item||alpha<=.01)return;
  const max=frames[item.asset];
  const cell=Math.round(clamp(idx,0,max-1));
  const sprite=item.sprite;
  sprite.setTexture(k(item.asset),name[item.asset]+' '+cell)
   .setPosition(Math.round(X),Math.round(Y))
   .setOrigin(...origin).setRotation(rotation)
   .setScale(scale*magnify).setAlpha(clamp(alpha,0,.99))
   .setVisible(true).setFlipX(flipX).setFlipY(flipY);
  if(tint!==null)sprite.setTint(tint);else sprite.clearTint();
 }
 function paintHero(f,X,Y,{angle=0,size=1.6,alpha=1}={}){
  if(!hero||alpha<=.01)return;
  hero.setFrame(Math.min(17,Math.max(0,Math.round(f))))
   .setPosition(Math.round(X),Math.round(Y)).setScale(scale*size)
   .setRotation(angle).setAlpha(alpha).setVisible(true);
 }
 const snap=(f,startFrame=14,duration=6)=>clamp((f-startFrame)/duration);
 function draw(f){
  if(!live)return;
  const t=clamp(f,0,V8_FRAMES-1),whole=Math.floor(t),hitAge=Math.max(0,t-14);
  frame=whole;micro=t-whole;hide();
  const p=pos(t),flight=t>=3&&t<14,hit=t>=14&&t<21;
  const vanish=1-smooth((t-15)/6);
  const prep=smooth((t-1)/3);
  const squash=t>=14&&t<16?1:.98;
  const X=to.x,Y=to.y;
  if(id==='flame-burst'){
   if(t<4&&t>=1){
    paint('fireBack',5,from.x-9*scale,from.y, .8,.35+.42*prep,{origin:[.78,.5]});
   }
   if(flight){
    paint('proj',Math.floor((t*2.35)%frames.fireball),p.x,p.y,
     1.85,1,{origin:[.8,.5]});
    paint('fireBack',Math.floor((t*1.45+5)%frames.fireball),
     p.x-22*scale,p.y+7*scale,1.02,.44,{origin:[.85,.5]});
   }
   if(hit){
    // Seven staggered tongue-shaped flame sprites spread from the same definite
    // fireball contact point. Their underlying flames are real PixelFX cels, not circles.
    for(let j=0;j<7;j++){
     const a=-Math.PI*.95+j*Math.PI/6.2;
     const r=(12+Math.pow(hitAge,1.15)*14)*scale;
     const xx=X+Math.cos(a)*r,yy=Y+Math.sin(a)*r*.86;
     const shade=[0xffecca,0xffc24f,0xff7a25,0xffdf78,0xff981f,0xffe1a0,0xff6e21][j];
     paint('flameFragment'+j,(j*3+Math.floor(hitAge*2))%frames.fireball,
      xx,yy,(1.21-hitAge*.055)*squash,
      vanish*(.94-j*.018),{origin:[.82,.5],rotation:a*.75,tint:shade});
    }
    paint('blast',Math.round(9+hitAge*1.3),X,Y+12*scale,.56,.20*vanish);
   }
  }else if(id==='frost-breath'){
   if(t>=1&&t<17){
    // Two transparent drifting channels: continuous breath from mouth to target,
    // sharper front than the wide, pale silhouette in V7.
    const width=t>=14?1-smooth((t-14)/3):smooth((t-1)/4);
    paint('frost',(Math.floor(t*1.85)+3)%frames['frost-wind'],
      from.x-12*scale,from.y-5*scale,1.80,Math.min(1,width*.96),
      {origin:[0,.5],tint:0xb3edff});
    paint('frostEcho',(Math.floor(t*1.45)+10)%frames['frost-wind'],
      from.x-10*scale,from.y+9*scale,1.53,width*.46,
      {origin:[0,.5],tint:0xc5f4ff});
   }
   if(hit){
    const idx=Math.round(14+Math.min(14,hitAge*2.2));
    paint('ice',idx,X,Y+8*scale,1.55,vanish,
     {origin:[.30,.79]});
   }
  }else if(id==='air-slash'){
   // Three distinct cuts with independent arrival and visible overlap,
   // not a single slash sprite reused after other cuts have already disappeared.
   for(let j=0;j<3;j++){
    const local=t-(3+j*2.65);
    if(local<0||local>11)continue;
    const q=easeOut(local/9.2),h=(j-1)*17*scale;
    const xx=L(from.x-10*scale,X,q), yy=L(from.y+h,Y+(j-1)*18*scale,q);
    const cut=4+Math.min(2,Math.floor((local/11)*2));
    const opacity=local<8.3?1:1-smooth((local-8.3)/2.7);
    paint('blade'+j,cut,xx,yy,1.45-j*.065,opacity,
      {rotation:-.24+(j-1)*.11,tint:j===1?0xe7ffff:0xb8e7fb});
   }
   if(hit){
    paint('bladeHit',2+Math.min(3,Math.floor(hitAge/1.3)),X,Y-4*scale,
     1.76,.9*vanish,{rotation:-.2});
   }
  }else if(id==='razor-shell'){
   const tMove=t<14?moveProgress(t):1+Math.sin(Math.min(1,(t-14)/7)*Math.PI)*.06;
   if(t>=2&&t<=20){
    const xx=L(from.x,X,tMove),yy=L(from.y-11*scale,Y,tMove)-16*scale*Math.sin(Math.PI*Math.min(1,tMove));
    paintHero(t,xx,yy,{angle:-(Math.sin((t-4)*.18)*.14),size:1.36,alpha:t>18?vanish:1});
   }
   if(t>=7&&t<=17){
    const q=moveProgress(t);
    paint('blade0',2+Math.floor(Math.max(0,t-7)/5),
     L(from.x,X,q)+31*scale,L(from.y,Y,q)-9*scale,
     1.51,t>=14?.68*vanish:.82,
     {rotation:-.35,tint:0x9deeff});
   }
   if(hit){
    paint('water',Math.round(3+hitAge*1.4),X+73*scale,Y-10*scale,1.71,vanish);
    paint('water2',Math.round(9+hitAge*1.35),X+36*scale,Y+26*scale,1.13,vanish*.55);
   }
  }else if(id==='shadow-punch'){
   if(t>=2&&t<=20){
    const q=t<14?moveProgress(t):1;
    const xx=L(from.x,X,q),yy=L(from.y,Y,q)-9*scale;
    paintHero(t,xx,yy,{angle:-.08+.08*smooth((t-6)/7),
     size:1.34,alpha:t>18?vanish:1});
    if(flight||t<16){
     paint('smoke',(Math.round(t*1.65)+8)%frames['shadow-wisp'],xx-23*scale,yy,
      1.48,Math.min(.9,.45+.41*prep),{tint:0xb5a6f9});
     paint('smoke2',(Math.round(t*1.3)+13)%frames['shadow-wisp'],
      xx-56*scale,yy+18*scale,.98,.49,{tint:0x8d6bd6});
    }
   }
   if(hit){
    // Spark is anchored to the outstretched knuckles, not the fist's palm.
    paint('ghostImpact',Math.min(11,Math.floor(hitAge*1.6)),
       X+87*scale,Y-15*scale,1.11,vanish*.74,{tint:0xcbb8ff});
     paint('punch',Math.round(Math.min(9,hitAge*1.3)),
      X+83*scale,Y-9*scale,1.07,vanish*.71,{tint:0xd5a5fd});
   }
  }else if(id==='meteor-mash'){
   if(t>=2&&t<=20){
    const q=t<14?moveProgress(t):1;
    const xx=L(from.x,X,q),yy=L(from.y-28*scale,Y-13*scale,q)
      -14*scale*Math.sin(Math.PI*Math.min(1,q));
    paintHero(t,xx,yy,{angle:-.14*(1-q),size:1.34,alpha:t>18?vanish:1});
   }
   if(flight){
    paint('metalHit2',1,p.x-44*scale,p.y+3*scale,.46,.24,{tint:0xe6faff});
    paint('blade0',2+Math.floor(Math.max(0,t-3)/7),p.x-42*scale,p.y+16*scale,
     .73,.41,{rotation:-.32,tint:0xe9fcff});
   }
   if(hit){
    paint('metalHit',Math.min(12,Math.round(hitAge*1.6)),
     X+83*scale,Y-20*scale,1.24,vanish*.95,{tint:0xe6f5ff});
    paint('punch',Math.min(9,Math.round(hitAge*1.4)),
     X+75*scale,Y-9*scale,.76,vanish*.49,{tint:0xd3eaff});
   }
  }
 }
 function step(_time,dt){
  if(!live||!playing)return;
  acc+=Math.max(0,Math.min(dt,85))*rate;
  let guard=0;
  while(acc>=V8_MS[frame]&&guard++<4){
   acc-=V8_MS[frame];
   frame++;
   if(frame===V8_FRAMES){if(loop)frame=0;else{frame=V8_FRAMES-1;playing=false;break}}
  }
  draw(frame+acc/V8_MS[frame]);
 }
 draw(0);
 scene.events.on('update',step);
 return {
  id,layers:[...actors.map(a=>a.sprite),...(hero?[hero]:[])],
  get frameIndex(){return frame},get active(){return live},get paused(){return !playing},
  get sourceAtlasCount(){return PACK.length},
  setFrame(f){frame=Math.min(25,Math.max(0,Math.floor(f)));acc=0;draw(frame);return this},
  pause(){playing=false;return this},resume(){playing=true;return this},
  setSpeed(v){rate=clamp(v,.2,2.5);return this},
  destroy(){if(!live)return;live=false;scene.events.off('update',step);
   for(const a of actors)a.sprite.destroy();if(hero)hero.destroy()}
 };
}
