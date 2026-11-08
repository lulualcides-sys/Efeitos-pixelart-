// V6 experimental visual composition — original V5 move identity + sampled CC0 art.
// Source materials: upstream Effekseer CC0 samples, imported/pinned by the Arsenal
// import workflow. No Effekseer runtime, no plugin in Pokemon Torre 2.
// This is a Phaser/WebGL *image-based* compositor; no Canvas/SVG/CSS effects.
import {playMoveSixV5} from './move-six-v5.js';
import {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,CONTACT_FRAME} from './build-move-six-v5.mjs';
export {MOVE_IDS,MOVE_NAMES,MOVE_TYPES,FRAME_MS,CONTACT_FRAME};
export const V6_MATERIAL_NAMES=Object.freeze([
 'Flame01','Burst01','Crystal001','Icicle001','SwordLine01',
 'Foam001','Fog001','Spark001','Shock_wave004','SnowCrystals_S','Particle02'
]);
export const V6_PROVENANCE={
 origin:'effekseer/Effekseer',
 license:'CC0',
 revision:'b5700082b49bc5f919610880dafddc90211a9a4e',
 local:'assets/vendor/effekseer-v6',
 source:'Release/Sample/01_NextSoft01/Texture'
};
const key=n=>'effekseer-cc0-v6-'+n;
const clamp=(v,lo=0,hi=1)=>Math.max(lo,Math.min(hi,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const rand=(n,k=0)=>{const z=Math.sin((n+34.12)*47.21+k*28.14)*43811.537;return z-Math.floor(z)};
export function preloadMaterialV6(scene,root='./assets/vendor/effekseer-v6'){
 if(typeof scene?.load?.image!=='function')throw new TypeError('Phaser loader required');
 for(const n of V6_MATERIAL_NAMES)scene.load.image(key(n),root.replace(/\/$/,'')+'/'+n+'.png');
}
const TABLE=Object.freeze({
 'flame-burst':{name:'fire',base:1,entries:[
  ['Flame01','travel',4,30,0xffc26a,.47,.18],
  ['Particle02','trail',4,8,0xffb864,.49,.30],
  ['Burst01','impact',2,70,0xffe0a4,.76,.14],
  ['Flame01','after',3,26,0xff722a,.38,.08]]},
 'frost-breath':{name:'ice',base:1,entries:[
  ['Fog001','travel',3,36,0x91e7fa,.27,.18],
  ['SnowCrystals_S','trail',5,12,0xdafaff,.73,.15],
  ['Icicle001','impact',5,34,0xa6e7ff,.68,.16],
  ['Crystal001','impact',3,24,0xffffff,.77,.23],
  ['Particle02','after',3,9,0xffffff,.43,.17]]},
 'air-slash':{name:'air',base:1,entries:[
  ['SwordLine01','travel',6,51,0xb3ecff,.59,.17],
  ['Particle02','trail',4,7,0xb6f0ff,.32,.26],
  ['SwordLine01','impact',3,53,0xffffff,.76,.12]]},
 'razor-shell':{name:'water',base:1,entries:[
  ['Foam001','travel',4,26,0x4ddaff,.53,.19],
  ['SwordLine01','travel',2,47,0xa6faff,.62,.22],
  ['Foam001','impact',5,48,0x8cf0ff,.79,.18],
  ['Particle02','after',5,11,0xb8faff,.52,.20]]},
 'shadow-punch':{name:'ghost',base:1,entries:[
  ['Fog001','travel',3,46,0x8752bb,.34,.14],
  ['Particle02','trail',4,11,0x9b74e1,.47,.15],
  ['Shock_wave004','impact',2,74,0xd1a1ff,.65,.17],
  ['Fog001','after',4,22,0x68438f,.41,.16]]},
 'meteor-mash':{name:'steel',base:1,entries:[
  ['Spark001','trail',6,14,0xffe5ab,.69,.16],
  ['SwordLine01','travel',2,38,0xe4efff,.52,.10],
  ['Burst01','impact',3,68,0xfff3d1,.83,.08],
  ['Shock_wave004','impact',1,78,0xd0e5ff,.50,.10],
  ['Particle02','after',4,10,0xffdc88,.45,.14]]}
});
const materialCount=id=>TABLE[id]?.entries.reduce((sum,e)=>sum+e[2],0)??0;
export const V6_SPRITE_COUNT_BY_MOVE=Object.freeze(Object.fromEntries(MOVE_IDS.map(id=>[id,3+materialCount(id)])));
export function playMoveSixV6(scene,id,x,y,{scale=1.35,depth=8,loop=true,speed=1,
 detail=true,flash=true,material=true}={}){
 const plan=TABLE[id];if(!plan)throw new RangeError('Unknown Pokémon move '+id);
 if(!V6_MATERIAL_NAMES.every(n=>scene?.textures?.exists(key(n))))return null;
 const base=playMoveSixV5(scene,id,x,y,{scale,depth,loop,speed,detail,flash});
 if(!base)return null;
 const Phaser=globalThis.Phaser;
 const nodes=[];
 for(const [texture,phase,n,size,tint,opacity,variation] of plan.entries){
  for(let i=0;i<n;i++){
   const tex=scene.textures.get(key(texture)),image=tex.getSourceImage();
   const sourceWidth=image?.width||64,sourceHeight=image?.height||64;
   const sp=scene.add.image(x,y,key(texture))
    .setDepth(depth+(phase==='impact'?.45:phase==='after'?.32:-.12)+i*.003)
    .setTint(tint).setAlpha(0).setVisible(false);
   if(phase==='impact'||phase==='trail')sp.setBlendMode(Phaser?.BlendModes?.ADD??1);
   // Professionally authored 2D source texture is downscaled, NEVER doubled or enlarged.
   const dimension=Math.max(sourceWidth,sourceHeight,1),baseScale=size/dimension;
   sp.setScale(baseScale).setRotation(0);
   nodes.push({sprite:sp,texture,phase,index:i,count:n,size,baseScale,opacity,variation});
  }
 }
 let active=true,materialOn=Boolean(material),detailOn=Boolean(detail),flashOn=Boolean(flash);
 const body=base.layers;
 const tickFrame=frame=>{
  if(!active)return;
  const f=Math.max(0,Math.min(17,frame|0)),t=smooth((f-2)/8);
  const isTravel=f>=1&&f<=9,isHit=f>=10&&f<=12,isAfter=f>=11&&f<=16;
  const center={x:x+(-47+102*t)*scale,y:y+9*scale+Math.sin(f*.8)*2};
  const contact={x:x+74,y:y+10};
  // each material family gets bespoke flow and density, no shared colour-only recolour.
  for(const q of nodes){
   const {sprite:s,phase,index:i,count:n,baseScale,opacity,variation,size}=q;
   const norm=n>1?i/(n-1):.5;
   const theta=i*2.399+(id.length%7)*.29;
   const wave=Math.sin(f*.87+i*1.7);
   let px=center.x,py=center.y,alpha=0,sc=baseScale,angle=0;
   const grow=Math.max(0,f-10),velocity=17+13*rand(i,5);
   if(phase==='travel'&&isTravel){
    alpha=opacity*(.53+.47*smooth((f-1)/7));
    px+=-26*norm+wave*variation*23;py+=(norm-.5)*(plan.name==='ice'?46:19)+wave*variation*17;
    angle=plan.name==='air'?-Math.PI*.20:plan.name==='water'?-Math.PI*.24:wave*.12;
    sc*=.71+norm*.55;
    if(plan.name==='ghost'){px-=24+norm*26;py+=Math.sin(f*.35+i)*12}
    if(plan.name==='steel'){px-=19+norm*12;py+=15+norm*20}
    if(plan.name==='ice')px-=12+norm*18;
    if(plan.name==='fire'){px-=20+norm*19;py-=7+norm*12;angle=-.27+wave*.18}
   }else if(phase==='trail'&&isTravel){
    alpha=opacity*(.4+.6*(1-norm));
    const back=24+norm*68;px-=back;py+=(norm-.5)*26+wave*5;
    sc*=.28+(1-norm)*.65;angle=wave*.3;
    if(plan.name==='steel')py+=back*.38;
   }else if(phase==='impact'&&isHit){
    alpha=opacity*(f===10?1:f===11?.59:.24);
    const r=(f-10)*(10+size*.12)+i*4;
    px=contact.x+Math.cos(theta)*r;py=contact.y+Math.sin(theta)*r*.76;
    sc*=(.77+norm*.37)*(1+(f-10)*.18);
    angle=theta+(f-10)*.19;
    if(plan.name==='ice'){py-=8+(i%2)*6;angle=(i%2?-.2:.26)+theta*.21}
    if(plan.name==='water'){px+=Math.cos(theta)*8;py+=Math.abs(Math.sin(theta))*11}
    if(plan.name==='air'){angle=-.46+i*.13;px+=i*9-11}
    if(plan.name==='ghost')alpha*=.77;
    if(plan.name==='steel')alpha*=.72;
   }else if(phase==='after'&&isAfter){
    const age=f-11;
    alpha=opacity*Math.max(0,1-age/6);
    const r=8+age*velocity+(i%3)*5;
    px=contact.x+Math.cos(theta)*r;
    py=contact.y+Math.sin(theta)*r*.75-(plan.name==='fire'?age*4:0);
    if(plan.name==='water')py+=age*7;
    if(plan.name==='ghost')py-=age*5;
    sc*=Math.max(.22,1-age*.13)*(norm*.3+.65);
    angle=theta*.24+age*.13;
   }
   if(f===0||f===17||!materialOn)alpha=0;
   if(!flashOn&&phase==='impact')alpha=0;
   if(!detailOn&&(phase==='trail'||phase==='after'))alpha=0;
   // Do not blank out the move silhouette if optional material is disabled.
   s.setVisible(alpha>.005);
   if(alpha>.005){s.setPosition(Math.round(px),Math.round(py))
    .setScale(sc).setRotation(angle).setAlpha(Math.min(.89,alpha))}
  }
 };
 const sceneTick=()=>tickFrame(base.frameIndex);
 scene.events.on('update',sceneTick);
 tickFrame(0);
 return {
  id,version:'v6',layers:[...base.layers,...nodes.map(x=>x.sprite)],
  get active(){return active&&base.active},
  get frameIndex(){return base.frameIndex},
  get materialEnabled(){return materialOn},
  get sparksEnabled(){return detailOn},
  get glowEnabled(){return flashOn},
  get anims(){return base.anims},
  contactFrame:CONTACT_FRAME,frameMs:FRAME_MS,
  setFrame(n){base.setFrame(n);tickFrame(n);return this},
  setMaterials(enabled){materialOn=Boolean(enabled);tickFrame(base.frameIndex);return this},
  setDetails(enabled){detailOn=Boolean(enabled);base.setDetails(enabled);tickFrame(base.frameIndex);return this},
  setFlash(enabled){flashOn=Boolean(enabled);base.setFlash(enabled);tickFrame(base.frameIndex);return this},
  destroy(){if(!active)return;active=false;scene.events.off('update',sceneTick);
   nodes.forEach(n=>n.sprite.destroy());base.destroy()}
 };
}
