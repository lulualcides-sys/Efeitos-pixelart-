// V5.2 micro-specular accents — independently generated original pixel art.
// These light flecks are tiny and transient; they do not alter the V5/V5.1
// assets or widen the approved thin slash.
export function createV52Microglints(){
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
  const a=new Uint8Array(S*S);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<S&&y>=0&&y<S)a[y*S+x]=c};
  const line=(x,y,u,v,c)=>{const n=Math.max(1,Math.ceil(Math.hypot(u-x,v-y)*2));for(let i=0;i<=n;i++){const t=i/n;put(x+(u-x)*t,y+(v-y)*t,c)}};
  if(f<3||f>7)return a;
  const count=f===3?2:f===4?4:f===5?3:f===6?2:1;
  for(let i=0;i<count;i++){
   const q=[.19,.42,.66,.86][i],p=path(q),v=tangent(q);
   const normal=[-9,11,-12,10][i]+(f-4)*(i%2?1:-1);
   const tang=(f-4)*(i%3+1);
   const x=Math.round(p.x+normal*v.nx+tang*v.tx),y=Math.round(p.y+normal*v.ny+tang*v.ty);
   const k=spec.kind;
   if(k==='fire'){
    // A hooked 2-5px hot ember, not a repeated round lightbulb.
    put(x,y,2);put(x+1,y-1,3);put(x+1,y-2,4);
    if(f===4||f===5){put(x-1,y+1,1);put(x,y+1,2)}
   }else if(k==='solar'){
    const radius=i%2?2:3;
    line(x-radius,y,x+radius,y,3);line(x,y-radius,x,y+radius,4);
    put(x,y,4);
   }else if(k==='ice'){
    // A small diamond-cut crystal flake.
    put(x,y-2,4);line(x-2,y,x+2,y,3);put(x,y+2,2);
    put(x-1,y-1,2);put(x+1,y-1,4);
   }else if(k==='wind'){
    // Short weightless air scratch with a sharp luminous tip.
    line(x-3*v.tx,y-3*v.ty,x+4*v.tx,y+4*v.ty,2);
    put(x+4*v.tx,y+4*v.ty,4);
   }else if(k==='nature'){
    // One fine leaf profile with white vein.
    put(x-2,y,1);put(x-1,y-1,2);put(x,y-1,3);
    put(x+1,y,2);put(x,y+1,1);put(x,y,4);
   }else{
    // Two lilac motes with warm-colored center.
    put(x,y,4);put(x-1,y,2);put(x,y-1,3);
    if(f===4){put(x+2,y-2,2);put(x+2,y-3,3)}
   }
  }
  return a;
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
