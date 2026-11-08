// Six hand-authored elemental move VFX. Standalone preview only.
// 16 frames of 144x144 pixels, TWO independent 16-frame rows (body / accents).
// Generated PNGs are deterministic; zero copies from third-party libraries.
export const MOVE_IDS=['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash'];
export const MOVE_NAMES=['Flame Burst','Frost Breath','Air Slash','Razor Shell','Shadow Punch','Meteor Mash'];
export const MOVE_TYPES=['FIRE','ICE','FLYING','WATER','GHOST','STEEL'];
export const FRAME_MS=[50,45,43,42,40,38,37,40,44,85,55,52,55,60,65,70];
export const CONTACT_FRAME=9,S=144,F=16;
const COLORS=[
 ['#6f2333','#c33a32','#f36b35','#ffa34e','#ffd584','#fff2be'],
 ['#22536f','#278aa9','#58bddd','#9ae3ee','#d7f7ff','#ffffff'],
 ['#3b617f','#588ba8','#87c0d1','#b2dce6','#dcf3f5','#ffffff'],
 ['#184767','#276f99','#329dbe','#68cde6','#b4f2f7','#f4ffff'],
 ['#27233b','#4e3d70','#7652aa','#a17cd0','#dac2ee','#fff1db'],
 ['#34475e','#60768b','#8ea8bb','#c4d9e7','#edf5f9','#fff6ce']
];
export function createMoveSheets(){
 function paint(k,f,l){
  const buf=new Uint8Array(S*S);
  const put=(x,y,c)=>{const a=Math.round(x),b=Math.round(y);if(c>0&&a>=0&&a<S&&b>=0&&b<S)buf[b*S+a]=c};
  const box=(x,y,w,h,c)=>{for(let u=0;u<w;u++)for(let v=0;v<h;v++)put(x+u,y+v,c)};
  const seg=(x,y,u,v,c,w=1)=>{let n=Math.max(1,Math.ceil(Math.hypot(u-x,v-y)*2));
   for(let i=0;i<=n;i++){let t=i/n;for(let a=0;a<w;a++)for(let b=0;b<w;b++)put(x+(u-x)*t+a,y+(v-y)*t+b,c)}};
  const poly=(p,c)=>{const y0=Math.max(0,Math.floor(Math.min(...p.map(x=>x[1])))),y1=Math.min(S-1,Math.ceil(Math.max(...p.map(x=>x[1]))));
   for(let y=y0;y<=y1;y++){let hits=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];
    if(a[1]<=y&&b[1]>y||b[1]<=y&&a[1]>y)hits.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
    hits.sort((a,b)=>a-b);for(let i=0;i+1<hits.length;i+=2)for(let x=Math.ceil(hits[i]);x<=Math.floor(hits[i+1]);x++)put(x,y,c)}};
  const oval=(x,y,rx,ry,c)=>{for(let j=-Math.floor(ry);j<=Math.floor(ry);j++){
   let w=Math.floor(rx*Math.sqrt(Math.max(0,1-j*j/(ry*ry))));for(let i=-w;i<=w;i++)put(x+i,y+j,c)}};
  const bez=(a,b,c,t)=>{let u=1-t;return u*u*a+2*u*t*b+t*t*c};
  const curve=(a,b,c,color,start=0,end=1,wide=1)=>{let last=null;
   for(let i=0;i<=45;i++){let t=start+(end-start)*i/45,p=[bez(a[0],b[0],c[0],t),bez(a[1],b[1],c[1],t)];
    if(last)seg(...last,...p,color,wide);last=p}};
  const rand=(x,seed=0)=>{let n=Math.sin((x+17)*111.7+seed*77.1)*43758.5453;return n-Math.floor(n)};
  if(f===0||f===15)return buf;
  if(k===0){
   // Flame Burst: warm uneven fireball with trailing tongues, then fractured flame crown.
   if(f<=8){const x=30+Math.max(0,f-2)*12,y=77+Math.sin(f*1.2)*3;
    if(l===0){poly([[x-16,y+2],[x-8,y-7],[x-9,y-13],[x,y-8],[x+5,y-9],[x+11,y+1],[x+4,y+7],[x-7,y+6]],2);
     poly([[x-14,y+3],[x-5,y-3],[x+7,y-5],[x+12,y+2],[x+4,y+7],[x-4,y+5]],3);
     oval(x+3,y+1,8,6,4);oval(x+5,y,4,3,5);seg(x+2,y-3,x+7,y-5,6);
    }else for(let i=0;i<8;i++)put(x-13-i*5-rand(i,f)*7,y+(rand(i,f+1)*2-1)*(6+i),2+i%4);
   }else{let a=f-9,cx=111,cy=77;
    if(l===0&&a<3){oval(cx,cy,Math.max(2,9-3*a),Math.max(2,8-3*a),5-a);
     for(let i=0;i<8;i++){let ang=i*Math.PI/4,r=13+a*5;
      poly([[cx+Math.cos(ang)*5,cy+Math.sin(ang)*5],[cx+Math.cos(ang-.14)*r,cy+Math.sin(ang-.14)*r],
       [cx+Math.cos(ang+.12)*(r+5),cy+Math.sin(ang+.12)*(r+5)]],2+i%3)}}
    if(l===1)for(let i=0;i<Math.max(0,20-a*3);i++){let ang=i*2.399,r=8+a*(4+rand(i)*3)+rand(i,3)*18;
     box(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r*.7,a<3&&i%5===0?2:1,1,2+i%4)}
   }
  }else if(k===1){
   // Frost Breath: turbulent widening fan with crystalline snow; no laser tube.
   if(f<=10){let len=16+Math.min(f,9)*9,ox=26,oy=79;
    if(l===0)for(let i=0;i<5;i++)for(let j=0;j<10;j++){
     let a=j/10,b=(j+1)/10,s=(i-2)*.14;
     seg(ox+len*a,oy+s*len*a+Math.sin(a*14+i+f*.7)*2,
      ox+len*b,oy+s*len*b+Math.sin(b*14+i+f*.7)*2,1+(i+j)%4,j%4===0?2:1)}
    if(l===1)for(let i=0;i<18;i++){let x=ox+rand(i,4)*len,y=oy+(rand(i,5)*2-1)*(5+(x-ox)*.25);
     if(i%3===0){poly([[x-4,y],[x,y-4],[x+4,y],[x,y+4]],3+i%3);seg(x-2,y,x+2,y,6)}
     else put(x,y,3+i%3)}
   }else if(l===1)for(let i=0;i<Math.max(0,18-(f-10)*3);i++)put(65+rand(i,1)*58+(f-10)*2,48+rand(i,2)*61,2+i%4);
  }else if(k===2){
   // Air Slash: three staggered transparent aerodynamic sickles.
   if(f<=10){let move=(f-2)*8;
    if(l===0)for(let i=0;i<3;i++){if(f<2+i)continue;let x=27+move+i*6,y=91+(i-1)*11;
     curve([x-9,y+22],[x+22,y+2],[x+48,y-31],2+i%2,.08,.96);
     curve([x-5,y+17],[x+24,y+10],[x+46,y-29],5,.19,.86)}
    else for(let i=0;i<12;i++){let x=22+move+rand(i)*58,y=40+rand(i,3)*67;
     seg(x-5,y+2,x+4,y-2,2+i%4);if(i%3===0)put(x+6,y-3,6)}
   }else if(l===1)for(let i=0;i<Math.max(0,14-(f-10)*3);i++){let x=107+(f-10)*3+rand(i)*20,y=39+rand(i,2)*65;
    seg(x-3,y+1,x+3,y-1,2+i%4)}
  }else if(k===3){
   // Razor Shell: conch-like scalloped crescent with water droplets on contact.
   let q=Math.max(0,Math.min(1,(f-1)/9)),cx=32+q*81,cy=92-q*30;
   if(f<=10){if(l===0){curve([cx-20,cy+20],[cx+8,cy+16],[cx+24,cy-25],2,.03,.96,3);
     curve([cx-10,cy+15],[cx+16,cy+6],[cx+22,cy-25],5,.05,.98);
     poly([[cx+15,cy-12],[cx+25,cy-28],[cx+23,cy-9],[cx+20,cy+1]],4);
     for(let i=0;i<4;i++)seg(cx+3+i*3,cy-12+i*7,cx+9+i*3,cy-15+i*7,3)}
    else for(let i=0;i<12;i++){let ang=i*2.4+f*.33,r=15+rand(i)*13;
     if(i%3===0)oval(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r,2,3,4);
     else put(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r,3+i%4)}
   }else if(l===1)for(let i=0;i<Math.max(0,19-(f-10)*4);i++){let ang=i*1.1,r=8+(f-10)*6+rand(i)*15;
    oval(111+Math.cos(ang)*r,63+Math.sin(ang)*r,1+i%3,2,3+i%4)}
  }else if(k===4){
   // Shadow Punch: recognizable flying spectral fist and four knuckles.
   let x=25+Math.min(1,(f-1)/8)*80,y=76+Math.sin(f*.5)*3;
   if(f<=10){if(l===0){poly([[x-17,y-9],[x-8,y-13],[x+7,y-12],[x+16,y-5],[x+13,y+9],[x+1,y+13],[x-14,y+8]],2);
     box(x-10,y-7,20,16,3);
     for(let i=0;i<4;i++)box(x+7,y-10+i*5,8-i%2*2,4,4+i%3);
     box(x-1,y+7,9,5,4);box(x-14,y+1,9,3,1)}
    else{for(let i=0;i<9;i++)oval(x-20-i*5-rand(i)*7,y+(rand(i,3)*2-1)*(6+i),Math.max(1,4-i*.37),2,1+i%4);
     if(f>=8)for(let i=0;i<6;i++){let ang=i*Math.PI/3;
      seg(109+Math.cos(ang)*10,76+Math.sin(ang)*10,109+Math.cos(ang)*22,76+Math.sin(ang)*22,4+i%2)}}}
   else if(l===1)for(let i=0;i<Math.max(0,18-(f-10)*4);i++){let ang=i*2.4,r=11+(f-10)*7+rand(i)*12;
    put(109+Math.cos(ang)*r,77+Math.sin(ang)*r*.7,2+i%4)}
  }else{
   // Meteor Mash: silver plated fist with a stellar comet-tail and sharp impact rays.
   let t=Math.min(1,(f-1)/8),x=28+t*83,y=38+t*49;
   if(f<=10){if(l===0){poly([[x-21,y-18],[x-9,y-12],[x+7,y-14],[x+15,y-5],[x+10,y+10],[x-4,y+13],[x-14,y+4]],1);
     poly([[x-12,y-10],[x+6,y-10],[x+13,y-2],[x+9,y+8],[x-6,y+7]],2);
     box(x-6,y-7,13,12,3);box(x+3,y-6,5,8,4);
     for(let i=0;i<3;i++)box(x-10+i*6,y-12,5,5,5-i%2);
     seg(x-22,y-14,x-37,y-25,1,2)}
    else{for(let i=0;i<10;i++){let X=x-16-i*7,Y=y-8-i*3;
     if(i%3===0){seg(X-3,Y,X+3,Y,6);seg(X,Y-3,X,Y+3,5)}
     else put(X,Y,2+i%4)}
     if(f>=8)for(let i=0;i<8;i++){let ang=i*Math.PI/4,r=14+(f-8)*4;
      seg(111+Math.cos(ang)*7,86+Math.sin(ang)*7,111+Math.cos(ang)*r,86+Math.sin(ang)*r,3+i%3)}}}
   else if(l===1)for(let i=0;i<Math.max(0,19-(f-10)*4);i++){let ang=i*2.399,r=12+(f-10)*7+rand(i)*12;
    put(111+Math.cos(ang)*r,86+Math.sin(ang)*r,2+i%5)}
  }
  return buf;
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
  const frames=Array.from({length:F},(_,f)=>[paint(k,f,0),paint(k,f,1)]);
  const w=S*F,h=S*2,raw=new Uint8Array(h*(w+1));
  for(let y=0;y<h;y++){let layer=Math.floor(y/S),yy=y%S;
   for(let f=0;f<F;f++)raw.set(frames[f][layer].subarray(yy*S,(yy+1)*S),y*(w+1)+1+f*S)}
  const pal=concat(new Uint8Array([0,0,0]),...COLORS[k].map(hex=>new Uint8Array([1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)))));
  const trns=new Uint8Array([0,...COLORS[k].map(()=>255)]);
  const bytes=concat(new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',concat(be(w),be(h),new Uint8Array([8,3,0,0,0]))),
   chunk('PLTE',pal),chunk('tRNS',trns),chunk('IDAT',stored(raw)),chunk('IEND',new Uint8Array()));
  return {id,name:MOVE_NAMES[k],type:MOVE_TYPES[k],bytes,width:w,height:h,
   counts:frames.map(p=>p.map(a=>a.reduce((n,b)=>n+(b!==0),0)))};
 }
 return MOVE_IDS.map(png);
}
