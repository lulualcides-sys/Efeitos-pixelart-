// V5.3 material-specific geometry — independently generated original pixel art.
// These distinguishing shapes are sparse and transient; they do not alter the V5/V5.1
// assets or widen the approved thin slash.
export function createV53MaterialMotifs(){
 const S=144,F=12;
 const kinds=[
  {id:'ember-rake',kind:'fire',palette:['#ff733e','#ffa963','#ffe0aa','#fff2cf']},
  {id:'solar-crescent',kind:'solar',palette:['#e6b84d','#ffe081','#fff4cb','#ffffff']},
  {id:'frost-shatter',kind:'ice',palette:['#49a9d6','#97e6f8','#d8faff','#ffffff']},
  {id:'ivory-gale',kind:'wind',palette:['#6ea9cc','#b5e2f0','#f1ffff','#ffffff']},
  {id:'verdant-sickle',kind:'nature',palette:['#29af70','#7fe2ae','#d3ffd7','#ffffff']},
  {id:'astral-reaver',kind:'ghost',palette:['#9587c1','#d6adf2','#e5e0a4','#fff6dc']}
 ];
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
 const bez=(a,b,c,d,t)=>{const u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d};
 function path(q){
  if(q<.67){const t=q/.67;return{x:bez(15,42,93,120,t),y:bez(101,116,112,84,t)}}
  const t=(q-.67)/.33;return{x:bez(120,135,122,87,t),y:bez(84,61,39,35,t)}
 }
 function tangent(q){
  const a=path(clamp(q-.002)),b=path(clamp(q+.002)),dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;
  return{tx:dx/l,ty:dy/l,nx:-dy/l,ny:dx/l};
 }

 function frame(spec,f){
  const pixels=new Uint8Array(S*S);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<S&&y>=0&&y<S)pixels[y*S+x]=c};
  const line=(x,y,u,v,c)=>{const n=Math.max(1,Math.ceil(Math.hypot(u-x,v-y)*1.65));for(let j=0;j<=n;j++){const t=j/n;put(x+(u-x)*t,y+(v-y)*t,c)}};
  const pathLine=(points,c)=>{for(let j=1;j<points.length;j++)line(...points[j-1],...points[j],c)};
  const poly=(pts,c)=>{
   const low=Math.max(0,Math.floor(Math.min(...pts.map(p=>p[1]))));
   const high=Math.min(S-1,Math.ceil(Math.max(...pts.map(p=>p[1]))));
   for(let y=low;y<=high;y++){
    const xs=[];
    for(let j=0;j<pts.length;j++){const a=pts[j],b=pts[(j+1)%pts.length];
     if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
    xs.sort((a,b)=>a-b);
    for(let j=0;j+1<xs.length;j+=2)for(let x=Math.ceil(xs[j]);x<=Math.floor(xs[j+1]);x++)put(x,y,c);
   }
  };
  if(f<3||f>7)return pixels;
  const amount=[0,0,0,1,3,3,2,1][f];
  const phase=f-4;
  for(let i=0;i<amount;i++){
   const q=[.22,.49,.77][i];
   const p=path(q),v=tangent(q);
   const side=([8,-11,10][i])+phase*(i%2?1.6:-1.5);
   const drift=phase*(2.2+i*.8);
   const x=p.x+v.nx*side+v.tx*drift;
   const y=p.y+v.ny*side+v.ty*drift;
   const Q=(a,b)=>[x+v.tx*a+v.nx*b,y+v.ty*a+v.ny*b];
   const dot=(a,b,c)=>put(...Q(a,b),c);
   const seg=(a,b,c,d,color)=>line(...Q(a,b),...Q(c,d),color);
   // Final debris breaks away from the arc; no static frozen silhouettes.
   if(f===7){
    if(spec.kind==='fire'){dot(-3,-1,2);dot(1,2,3);dot(5,-3,4);seg(-5,3,-3,3,1)}
    else if(spec.kind==='solar'){seg(-4,1,-1,1,2);dot(4,-2,4);dot(6,-3,3)}
    else if(spec.kind==='ice'){seg(-3,-2,0,-3,3);dot(3,1,4);dot(7,-1,2)}
    else if(spec.kind==='wind'){seg(-6,1,0,1,2);seg(3,-2,7,-2,3)}
    else if(spec.kind==='nature'){seg(-3,-2,-1,-1,2);dot(2,3,3);dot(6,0,1)}
    else {dot(-5,2,1);dot(1,-3,3);dot(5,0,2);dot(8,-4,4)}
    continue;
   }
   if(f===6){
    if(spec.kind==='fire'){seg(-5,-2,0,-1,2);seg(2,0,5,2,3);dot(8,-2,4)}
    else if(spec.kind==='solar'){seg(-6,0,3,0,2);dot(6,-3,4);dot(8,1,3)}
    else if(spec.kind==='ice'){poly([Q(-5,-1),Q(0,-4),Q(4,-1),Q(-1,1)],2);seg(-1,-4,2,-2,4);dot(8,2,3)}
    else if(spec.kind==='wind'){seg(-9,-2,0,-2,2);seg(-4,3,5,3,3);dot(9,1,4)}
    else if(spec.kind==='nature'){poly([Q(-4,0),Q(0,-2),Q(4,1),Q(-1,2)],2);seg(-3,0,2,0,4);dot(7,-3,3)}
    else {seg(-6,2,-2,-1,1);seg(0,-3,4,-4,2);dot(7,-2,3);dot(-5,-4,4)}
    continue;
   }
   const flicker=(f===3?-1:f===5?1:0)+(i===1?1:0);
   if(spec.kind==='fire'){
    // Bifurcated fine flame tips with restrained cinders.
    poly([Q(-7,-1),Q(-3,-2),Q(1,-1),Q(7+flicker,1),Q(2,3),Q(-3,2)],2);
    seg(-6,0,3,1,3);seg(1,0,8+flicker,-3,4);seg(-1,2,4,5,3);
    dot(8,3,2);dot(-8,-4,3);
    if(f===5){dot(10,0,4);seg(-10,1,-8,0,1)}
   }else if(spec.kind==='solar'){
    // Hairline glints and restrained four-ray sun caustic.
    seg(-11,-1,7,-1,2);seg(-7,1,9,1,3);
    seg(-3,3,3,3,2);seg(3,-4,3,2,4);seg(0,-1,6,-1,4);
    dot(9,-3,3);dot(-9,3,1);
    if(f===5)seg(-4,-4,0,-4,2);
   }else if(spec.kind==='ice'){
    // Angular translucent crystal facets and a fracture line.
    poly([Q(-7,0),Q(-1,-5),Q(7,-2),Q(2,2),Q(-2,3)],1);
    poly([Q(-1,-5),Q(7,-2),Q(1,0)],2);
    seg(-7,0,6,-2,4);seg(-1,-5,1,2,3);
    seg(5,4,8,1,2);dot(9,-4,4);
    if(f===5){dot(-7,-4,3);seg(-3,5,-1,4,2)}
   }else if(spec.kind==='wind'){
    // Interrupted streams, no opaque broad rectangle.
    seg(-12,-3,-4,-3,2);seg(-2,-3,6,-3,3);
    seg(-9,1,-3,1,2);seg(-1,1,11,1,3);
    seg(-4,5,4,5,2);seg(7,5,10,5,4);
    dot(9,-4,3);if(f===5)seg(-13,2,-11,2,1);
   }else if(spec.kind==='nature'){
    // Slim leaf with off-axis tip, visible vein and drifting seeds.
    poly([Q(-8,0),Q(-3,-3),Q(4,-2),Q(7,0),Q(1,2),Q(-4,1)],2);
    poly([Q(-8,0),Q(-3,-3),Q(2,-2),Q(1,0)],3);
    seg(-7,0,6,0,4);seg(-5,2,-9,3,1);
    seg(1,0,3,-3,3);dot(9,-3,3);
    if(f===5){dot(-8,-5,1);seg(3,4,5,4,2)}
   }else{
    // Two airy spectral filaments with detached motes.
    pathLine([Q(-9,3),Q(-5,0),Q(-1,-3),Q(4,-4),Q(8,-2)],2);
    pathLine([Q(-6,5),Q(-2,2),Q(2,1),Q(6,2)],1);
    seg(-4,-1,1,-3,3);dot(9,-6,4);dot(-8,-4,3);
    dot(3,5,2);if(f===5){seg(7,3,9,2,1);dot(-11,1,3)}
   }
  }
  return pixels;
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
 function png(spec){
  const frames=Array.from({length:F},(_,i)=>frame(spec,i)),w=S*F;
  const raw=new Uint8Array(S*(w+1));
  for(let y=0;y<S;y++)for(let f=0;f<F;f++)raw.set(frames[f].subarray(y*S,(y+1)*S),y*(w+1)+1+f*S);
  const palette=concat(new Uint8Array([0,0,0]),...spec.palette.map(h=>new Uint8Array([1,3,5].map(i=>parseInt(h.slice(i,i+2),16)))));
  const trns=new Uint8Array([0,255,255,255,255]);
  const bytes=concat(new Uint8Array([137,80,78,71,13,10,26,10]),
   chunk('IHDR',concat(be(w),be(S),new Uint8Array([8,3,0,0,0]))),
   chunk('PLTE',palette),chunk('tRNS',trns),chunk('IDAT',stored(raw)),chunk('IEND',new Uint8Array()));
  return{bytes,counts:frames.map(a=>a.reduce((n,v)=>n+(v!==0),0)),width:w,height:S};
 }
 return kinds.map(x=>({...png(x),id:x.id,kind:x.kind}));
}
