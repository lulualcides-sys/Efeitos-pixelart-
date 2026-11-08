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
  const line=(x,y,u,v,c)=>{const n=Math.max(1,Math.ceil(Math.hypot(u-x,v-y)*2));for(let i=0;i<=n;i++){const a=i/n;put(x+(u-x)*a,y+(v-y)*a,c)}};
  const poly=(pts,c)=>{const min=Math.max(0,Math.floor(Math.min(...pts.map(p=>p[1])))),max=Math.min(S-1,Math.ceil(Math.max(...pts.map(p=>p[1]))));for(let y=min;y<=max;y++){let inter=[];for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length];if((p[1]<=y&&q[1]>y)||(q[1]<=y&&p[1]>y))inter.push(p[0]+(y-p[1])*(q[0]-p[0])/(q[1]-p[1]))}inter.sort((a,b)=>a-b);for(let i=0;i+1<inter.length;i+=2)for(let x=Math.ceil(inter[i]);x<=Math.floor(inter[i+1]);x++)put(x,y,c)}};
  if(f<3||f>7)return pixels;
  const amount=[0,0,0,1,3,3,2,1][f];
  const k=spec.kind;
  for(let i=0;i<amount;i++){
   const q=[.22,.49,.77][i];
   const p=path(q),v=tangent(q);
   const lateral=([8,-11,10][i])+(f-4)*(i%2?2:-2);
   const forward=(f-4)*(2+i);
   const x=p.x+v.nx*lateral+v.tx*forward,y=p.y+v.ny*lateral+v.ty*forward;
   const Q=(a,b)=>[x+v.tx*a+v.nx*b,y+v.ty*a+v.ny*b];
   if(k==='fire'){
    // A forked fire tongue is *not* a crystal diamond or a simple sparkle.
    const a=Q(-6,-1),b=Q(-1,-2),tip=Q(6+(i%2)*2,1),s=Q(2,4),fork=Q(5,-4);
    poly([a,b,tip,s],2);line(...a,...tip,3);line(...b,...fork,4);
    put(...Q(-2,1),3);put(...Q(3,2),4);
   }else if(k==='solar'){
    // One extended hairline stroke and a precisely placed four-ray lens star.
    line(...Q(-9,0),...Q(7,0),3);
    line(...Q(-3,2),...Q(7,2),2);
    const u=Q(3,-2);line(u[0]-3,u[1],u[0]+3,u[1],4);
    line(u[0],u[1]-3,u[0],u[1]+3,4);
   }else if(k==='ice'){
    // True angular shard/facet with separate near-white specular cut.
    const a=Q(-6,0),b=Q(-1,-5),c=Q(7,-1),d=Q(0,5);
    poly([a,b,c,d],1);poly([b,c,Q(0,0)],2);
    line(...a,...c,4);line(...b,...Q(0,0),3);
    put(...Q(4,-1),4);
   }else if(k==='wind'){
    // Fine, parallel aerodynamic strokes with intentional transparent gaps.
    line(...Q(-11,-3),...Q(7,-3),2);
    line(...Q(-7,2),...Q(10,2),3);
    line(...Q(0,6),...Q(8,6),4);
   }else if(k==='nature'){
    // Tapered asymmetric leaf blade, central vein, one short stalk.
    const a=Q(-6,0),b=Q(0,-4),c=Q(7,1),d=Q(1,4);
    poly([a,b,c,d],2);poly([a,b,Q(2,0)],3);
    line(...a,...c,4);
    line(...Q(-6,0),...Q(-9,-1),1);
   }else{
    // Ether-like curving wisp plus detached motes, never a circular slash.
    line(...Q(-7,2),...Q(-3,-1),1);
    line(...Q(-3,-1),...Q(2,-4),2);
    line(...Q(2,-4),...Q(7,-2),3);
    put(...Q(0,2),4);
    put(...Q(9,-7),3);
    put(...Q(-7,-6),2);
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
