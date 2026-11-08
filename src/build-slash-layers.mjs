import {createV5} from './build-slash-v5.mjs';

// Each 12-frame row is an actual, independently controllable visual layer.
// Order is intentionally grouped by blend mode in Phaser to limit WebGL batch flushes.
export const V5_LAYERS = Object.freeze([
 'residualTrail', 'core', 'outerAccent', 'breakup', 'innerGlow'
]);
export const V5_LAYER_FRAMES=12;
export const V5_LAYER_PIXELS=144;

function join(...arrays) {
 const out=new Uint8Array(arrays.reduce((n,a)=>n+a.length,0));
 let p=0;for(const a of arrays){out.set(a,p);p+=a.length}return out;
}
const be=n=>new Uint8Array([n>>>24&255,n>>>16&255,n>>>8&255,n&255]);
const chars=s=>Uint8Array.from(s, c=>c.charCodeAt(0));
const table=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);return c>>>0});
function crc(data){let c=-1;for(const v of data)c=table[(c^v)&255]^(c>>>8);return(c^-1)>>>0}
function chunk(n,data){let label=chars(n);return join(be(data.length),label,data,be(crc(join(label,data))))}
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
 return join(new Uint8Array([0x78,0x01]),new Uint8Array(output),be(((b<<16)|a)>>>0));
}
function inflateStored(z){
 const raw=[];let p=2,final=false;
 while(!final&&p<z.length-4){
  const flag=z[p++];final=(flag&1)!==0;
  if((flag>>1)!==0)throw new Error('Expected stored-deflate base V5 PNG; use canonical createV5()');
  const length=z[p]|(z[p+1]<<8),nlength=z[p+2]|(z[p+3]<<8);p+=4;
  if(((length^nlength)&65535)!==65535)throw new Error('Corrupt stored-deflate block');
  raw.push(z.subarray(p,p+length));p+=length;
 }
 return join(...raw);
}
function decode(png){
 if(png[0]!==137||png[1]!==80||png[2]!==78||png[3]!==71)throw new Error('Invalid V5 PNG signature');
 const get32=p=>(png[p]*16777216)+(png[p+1]<<16)+(png[p+2]<<8)+png[p+3];
 let pal,alpha,idat=[];
 for(let p=8;p<png.length;){
  const len=get32(p),kind=String.fromCharCode(...png.subarray(p+4,p+8));
  const data=png.subarray(p+8,p+8+len);
  if(kind==='PLTE')pal=data;
  if(kind==='tRNS')alpha=data;
  if(kind==='IDAT')idat.push(data);
  p+=len+12;
 }
 if(!pal||!alpha||alpha[0]!==0)throw new Error('Indexed palette and transparent background required');
 const raw=inflateStored(join(...idat)),width=144*12,height=144;
 if(raw.length!==height*(width+1))throw new Error('V5 frame dimensions do not match generator');
 for(let y=0;y<height;y++)if(raw[y*(width+1)]!==0)throw new Error('Unexpected PNG row filter');
 return {raw,pal,alpha,width,height};
}
function position(q) {
 const bez=(a,b,c,d,t)=>{const u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d};
 if(q<.67){const t=q/.67;return [bez(15,42,93,120,t),bez(101,116,112,84,t)]}
 const t=(q-.67)/.33;
 return [bez(120,135,122,87,t),bez(84,61,39,35,t)];
}
function nearestPath() {
 const c=Array.from({length:161},(_,i)=>({p:position(i/160),q:i/160}));
 const distance=new Float32Array(144*144),at=new Float32Array(144*144);
 for(let y=0;y<144;y++)for(let x=0;x<144;x++){
  let minimum=1e10,q=0;
  for(const s of c){
   const dx=x-s.p[0],dy=y-s.p[1],d=dx*dx+dy*dy;
   if(d<minimum){minimum=d;q=s.q}
  }
  const i=y*144+x;distance[i]=Math.sqrt(minimum);at[i]=q;
 }
 return {distance,at};
}
function encodePalettePNG(raw,width,height,pal,alpha){
 return join(new Uint8Array([137,80,78,71,13,10,26,10]),
 chunk('IHDR',join(be(width),be(height),new Uint8Array([8,3,0,0,0]))),
 chunk('PLTE',pal),chunk('tRNS',alpha),chunk('IDAT',storedDeflate(raw)),
 chunk('IEND',new Uint8Array()));
}

/** Creates 5 rows (one row/layer), each row containing 12 frames of 144px.
 * Four opaque layers partition each original pixel exactly once; innerGlow is
 * a low-opacity duplicate of selected existing highlights (no shape inflation).
 * The merged opaque layers reproduce the original V5 byte-for-byte in color index.
 */
export function buildV5Layers(sheets=createV5()) {
 const path=nearestPath(),output=[];
 const head=[.065,.22,.49,.77,1,1,1,1,1,1,1,1];
 for(const sheet of sheets){
  const {raw,pal,alpha,width}=decode(sheet.bytes);
  const rowWidth=144*12,rowHeight=144*V5_LAYERS.length,stride=rowWidth+1;
  const layerRaw=new Uint8Array(stride*rowHeight);
  const counts=Object.fromEntries(V5_LAYERS.map(x=>[x,Array(12).fill(0)]));
  let glowCount=0,nonzero=0;
  const layerIndex=Object.fromEntries(V5_LAYERS.map((v,i)=>[v,i]));
  for(let f=0;f<12;f++)for(let y=0;y<144;y++)for(let x=0;x<144;x++){
   const src=raw[y*(width+1)+1+f*144+x];if(!src)continue;
   const pixel=y*144+x,q=path.at[pixel],dist=path.distance[pixel];
   const belongsToBlade=(q<=head[f]+.016 && dist<=5.0 && f<=5);
   let name;
   if(belongsToBlade)name='core';
   else if(f<=5)name=dist<=14&&src<=5?'residualTrail':'outerAccent';
   else if(f<=8)name=dist<=5&&src<=3?'residualTrail':'breakup';
   else name=src>=6&&f===9?'breakup':'residualTrail';
   const dest=(layerIndex[name]*144+y)*stride+1+f*144+x;
   layerRaw[dest]=src;counts[name][f]++;nonzero++;
   // Glow only repeats original high-index core pixels: no extrusion/halo,
   // and the runtime draws it at alpha 0.16 in ADD above NORMAL layers.
   if(belongsToBlade&&f>=2&&src>=6&&((x*7+y*11+f)%5)!==0){
    const glowIndex=(layerIndex.innerGlow*144+y)*stride+1+f*144+x;
    layerRaw[glowIndex]=src;counts.innerGlow[f]++;glowCount++;
   }
  }
  const bytes=encodePalettePNG(layerRaw,rowWidth,rowHeight,pal,alpha);
  output.push({id:sheet.id,type:sheet.type,bytes,counts,nonzero,glowCount,
   frameSize:144,frames:12,rows:V5_LAYERS.length});
 }
 return output;
}
