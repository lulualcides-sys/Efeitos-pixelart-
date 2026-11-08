// Six Pokémon attack VFX V4 — hand-authored bitmap cels, no vector primitives.
// All visible shapes originate in separately drawn 8-tone pixel matrices.
import {V4_GLYPHS} from './move-six-v4-cels.mjs';
export const MOVE_IDS=['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash'];
export const MOVE_NAMES=['Flame Burst','Frost Breath','Air Slash','Razor Shell','Shadow Punch','Meteor Mash'];
export const MOVE_TYPES=['FIRE','ICE','FLYING','WATER','GHOST','STEEL'];
export const S=80,SCALE=2,F=18,LAYERS=3,CONTACT_FRAME=9;
export const FRAME_MS=[64,59,51,43,37,35,34,35,40,91,67,56,63,74,81,86,91,96];
export const LAYER_NAMES=['silhouette','accents','debris'];
const PALETTES=[
 ['#421c24','#8d2826','#c84021','#e95d1e','#ff902c','#ffbb49','#ffdf83','#fff5d3'],
 ['#1b3b5f','#27658d','#378eb0','#61bdda','#8bdcec','#bceff9','#e6fcff','#ffffff'],
 ['#24455e','#3d7893','#6baac3','#94cede','#bbe6f1','#e0f5fb','#ffffff','#83cedc'],
 ['#103954','#205f84','#2484a9','#3bb5d2','#6bd4e8','#a3e9f6','#d3f9fd','#ffffff'],
 ['#22172d','#3d2957','#64427f','#8856a7','#b17bcb','#d5adea','#f0d9fa','#fff4ff'],
 ['#253448','#435a71','#66839b','#8da8bc','#b4cedd','#dcebf2','#f7fbff','#ffe79d']
];
const glyphs=Object.fromEntries(Object.entries(V4_GLYPHS).map(([k,v])=>[k,v.split('|')]));
export function createMoveSheetsV4(){
 function draw(k,fr,layer){
  const img=new Uint8Array(S*S);
  const pixel=(x,y,c)=>{const xx=Math.round(x),yy=Math.round(y);if(c>0&&xx>=0&&yy>=0&&xx<S&&yy<S)img[yy*S+xx]=c};
  function stamp(id,cx,cy,scale=1,flipX=false,flipY=false){
   const rows=glyphs[id];if(!rows)throw new Error('Missing hand pixel cel: '+id);
   const height=rows.length,width=rows.reduce((n,r)=>Math.max(n,r.length),0);
   const ox=Math.round(cx-width*scale*.5),oy=Math.round(cy-height*scale*.5);
   for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const row=rows[flipY?height-1-y:y]||'';
    const ch=row[flipX?width-1-x:x],c=ch>='1'&&ch<='8'?ch.charCodeAt(0)-48:0;
    if(c===0)continue;
    for(let a=0;a<scale;a++)for(let b=0;b<scale;b++)pixel(ox+x*scale+a,oy+y*scale+b,c);
   }
  }
  const poses=(names,index)=>names[Math.max(0,Math.min(names.length-1,index))];
  if(fr===0||fr===17)return img;
  if(k===0){ // Flame Burst: forked flame + multi-cel radial explosion -> smouldering bits
   if(fr<9){
    const step=Math.max(0,fr-1);
    if(layer===0){
     const cx=fr<3?24:Math.min(46,29+step*2.4);
     stamp(poses(['flame1','flame2','flame3','flame2','flame1','flame3','flame2','flame1'],step),cx,40,fr<3?1:2,false,fr%2===0);
    }
    if(layer===1&&fr>=4){stamp(fr%2?'flame2':'flame3',Math.min(48,32+step*2.3),39,1,true)}
    if(layer===2&&fr>=5){stamp('embers',Math.min(45,28+step*2.1),44,1)}
   }else if(fr<13){
    const n=fr-9;
    if(layer===0)stamp(poses(['fireHit1','fireHit2','fireHit3','fireHit3'],n),51,40,n===0?2:1);
    if(layer===1&&n<=1)stamp(n?'fireHit3':'fireHit2',51,40,1);
    if(layer===2)stamp('embers',50+n*2,43-n*2,1);
   }else{
    if(layer===0&&fr<=14)stamp('smoke',49+fr-13,34-(fr-13)*2,1);
    if(layer===2)stamp('embers',50+(fr-13)*2,41-(fr-13)*3,1);
   }
  }else if(k===1){ // Frost Breath: successive hand-painted frost currents, then crystal impact
   if(fr<9){
    if(layer===0){
     stamp(['iceWind1','iceWind2','iceWind1'][fr%3],25+fr*1.65,42,1);
     if(fr>=5)stamp('iceWind2',28+fr*2,39,1);
    }
    if(layer===1&&fr>=2)stamp(fr%2?'iceWind2':'iceWind1',19+fr*2.1,39,1);
    if(layer===2&&fr>=5)stamp('snow',43,40+(fr%2?2:-2),1);
   }else if(fr<13){
    const n=fr-9;
    if(layer===0)stamp(n===0?'iceHit1':'iceHit2',53,40,n===0?2:1);
    if(layer===1)stamp(n<2?'iceHit2':'snow',52,40,1);
    if(layer===2)stamp('snow',49+n*2,43-n,1);
   }else{
    if(layer===0&&fr<=14)stamp('iceHit2',53,40,1);
    if(layer===2)stamp('snow',53+(fr-13)*2,39-(fr-13),1);
   }
  }else if(k===2){ // Air Slash: independent angled keyframe silhouettes, no procedural curve
   if(fr<10){
    const x=15+fr*4;
    if(layer===0){stamp(['air1','air2','air1'][fr%3],x,42+(fr%2?2:-2),1);
     if(fr>=4)stamp(fr%2?'air1':'air2',x-17,48,1);
    }
    if(layer===1&&fr>=3)stamp(fr%2?'air2':'air1',x+3,37,1);
    if(layer===2&&fr>=6)stamp('snow',x-5,45,1);
   }else if(fr<=12){
    if(layer===0)stamp(fr===10?'airHit':'air2',52,40,1);
    if(layer===1&&fr===10)stamp('airHit',52,40,1);
    if(layer===2)stamp('snow',55,41,1);
   }else if(layer===2)stamp('snow',55+(fr-13)*3,36,1);
  }else if(k===3){ // Razor Shell: actual scallop weapon with ribs, handle and water trail
   if(fr<10){
    const x=fr<3?28:Math.min(48,28+(fr-2)*3.1),y=fr<3?52:52-(fr-2)*2;
    if(layer===0){
     stamp(fr<4?'shell1':fr<7?'shell2':'shell1',x,y,fr<2?1:2,false,fr>=7);
     stamp('shellGrooves',x+1,y,1,false,fr>=7);
     stamp('shellHandle',x-13,y+11,1);
    }
    if(layer===1&&fr>=4)stamp('shellEdge',x+4,y-2,1);
    if(layer===2&&fr>=6)stamp('splash',x-9,y+13,1);
   }else if(fr<=12){
    if(layer===0)stamp(fr===10?'shellEdge':'shell2',51,39,fr===10?2:1);
    if(layer===1)stamp(fr%2?'waterBurst':'splash',52,41,1);
    if(layer===2)stamp('splash',49,45,1);
   }else if(layer===2)stamp('splash',49+(fr-13)*2,45+(fr-13)*2,1);
  }else if(k===4){ // Shadow Punch: fingered spectral gauntlet + thumb; separate spectral shreds
   if(fr<10){
    const cx=fr<=2?25:Math.min(47,25+(fr-2)*3.4),cy=41;
    if(layer===0){
     stamp(fr%2?'ghost1':'ghost2',cx,cy,fr<=2?1:2);
     if(fr>=3){stamp('ghostKnuckles',cx+22,cy,1);stamp('ghostThumb',cx+1,cy+17,1)}
    }
    if(layer===1&&fr>=3)stamp('ghostImpact',cx-20,cy-3,1);
    if(layer===2&&fr>=6)stamp('smoke',cx-23,cy+7,1);
   }else if(fr<=12){
    if(layer===0&&fr<=10)stamp('ghostImpact',51,40,2);
    if(layer===1)stamp('ghostImpact',51,40,1);
    if(layer===2)stamp('smoke',48,45,1);
   }else if(layer===2)stamp('smoke',49,35-(fr-13)*2,1);
  }else{ // Meteor Mash: armored fist, visible knuckles and starlit strike
   if(fr<10){
    const cx=fr<=2?23:Math.min(48,23+(fr-2)*3.7),cy=55-fr*1.5;
    if(layer===0){
     stamp(fr%2?'metal1':'metal2',cx,cy,fr<=2?1:2);
     if(fr>=3)stamp('metalKnuckles',cx+22,cy,1);
    }
    if(layer===1&&fr>=3)stamp('metalImpact',cx-19,cy+14,1);
    if(layer===2&&fr>=6)stamp('embers',cx-19,cy+12,1);
   }else if(fr<=12){
    if(layer===0)stamp(fr===10?'metalImpact':'metal1',52,38,fr===10?2:1);
    if(layer===1)stamp('metalImpact',52,38,1);
    if(layer===2)stamp('embers',51,39,1);
   }else if(layer===2)stamp('metalImpact',50+(fr-13)*2,40+(fr-13),1);
  }
  return img;
 }
 const be=n=>new Uint8Array([n>>>24&255,n>>>16&255,n>>>8&255,n&255]);
 const chars=s=>Uint8Array.from(s,c=>c.charCodeAt(0));
 const concat=(...parts)=>{const result=new Uint8Array(parts.reduce((n,a)=>n+a.length,0));let off=0;for(const p of parts){result.set(p,off);off+=p.length}return result};
 const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});
 const crc=data=>{let c=-1;for(const b of data)c=crcTable[(c^b)&255]^(c>>>8);return(c^-1)>>>0};
 const chunk=(name,body)=>concat(be(body.length),chars(name),body,be(crc(concat(chars(name),body))));
 function storedDeflate(bytes) {
  // Small RFC1951 fixed-Huffman stream with distance=1 runs for transparent
  // pixels. This cuts each five-layer sheet from ~1.25 MB to a few kilobytes.
  const output=[],lengths=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const extras=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  let bits=0,used=0,a=1,b=0;
  const write=(n,count)=>{
   bits|=(n<<used);used+=count;
   while(used>=8){output.push(bits&255);bits>>>=8;used-=8}
  };
  const reverse=(n,count)=>{let r=0;for(let i=0;i<count;i++){r=(r<<1)|(n&1);n>>>=1}return r};
  const symbol=n=>{
   let code,width;
   if(n<=143){code=n+0x30;width=8}
   else if(n<=255){code=n-144+0x190;width=9}
   else if(n<=279){code=n-256;width=7}
   else {code=n-280+0xc0;width=8}
   write(reverse(code,width),width);
  };
  const match=length=>{
   let j=length===258?28:0;
   if(length!==258)for(let i=0;i<28;i++){
    const upper=lengths[i]+(1<<extras[i])-1;
    if(length>=lengths[i]&&length<=upper){j=i;break}
   }
   symbol(257+j);if(extras[j])write(length-lengths[j],extras[j]);
   write(0,5); // distance = 1, fixed Huffman distance code 0
  };
  write(0b011,3); // BFINAL=1, BTYPE=01 fixed Huffman
  for(let p=0;p<bytes.length;){
   const value=bytes[p];a=(a+value)%65521;b=(b+a)%65521;
   if(value!==0){symbol(value);p++;continue}
   let count=1;
   while(p+count<bytes.length&&bytes[p+count]===0)count++;
   // Update Adler for the remaining zero bytes in constant time.
   b=(b+((count-1)*a))%65521;
   if(count<4){for(let i=0;i<count;i++)symbol(0)}
   else {
    symbol(0);let rest=count-1;
    while(rest>=3){const n=Math.min(rest,258);match(n);rest-=n}
    while(rest-- >0)symbol(0);
   }
   p+=count;
  }
  symbol(256);
  if(used)output.push(bits&255);
  return concat(new Uint8Array([0x78,0x01]),new Uint8Array(output),be(((b<<16)|a)>>>0));
 }
 function stored(raw){return storedDeflate(raw)}




 function png(id,k){
  const cels=Array.from({length:F},(_,f)=>Array.from({length:LAYERS},(_,l)=>draw(k,f,l)));
  const width=S*SCALE*F,height=S*SCALE*LAYERS,raw=new Uint8Array(height*(width+1));
  for(let y=0;y<height;y++){
   let layer=Math.floor(y/(S*SCALE)),row=Math.floor((y%(S*SCALE))/SCALE);
   let base=y*(width+1)+1;
   for(let f=0;f<F;f++){
    let cel=cels[f][layer];
    for(let x=0;x<S;x++){const col=cel[row*S+x],o=base+f*S*SCALE+x*SCALE;raw[o]=col;raw[o+1]=col;}
   }
  }
  const pal=concat(new Uint8Array([0,0,0]),...PALETTES[k].map(hex=>new Uint8Array([1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)))));
  const trns=new Uint8Array([0,...PALETTES[k].map(()=>255)]);
  const bytes=concat(new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',concat(be(width),be(height),new Uint8Array([8,3,0,0,0]))),
    chunk('PLTE',pal),chunk('tRNS',trns),chunk('IDAT',stored(raw)),chunk('IEND',new Uint8Array()));
  return {id,name:MOVE_NAMES[k],type:MOVE_TYPES[k],bytes,width,height,counts:cels.map(x=>x.map(m=>m.reduce((n,a)=>n+(a>0),0)))};
 }
 return MOVE_IDS.map(png);
}
