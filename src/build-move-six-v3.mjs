// Six V3 pixel-art moves, based on original hand-pixeled glyphs and stepped 72px animation.
// Art direction: native pixel silhouettes, 8-tone ramps, no bloom masks/vector postprocessing.
// Native Poké Arena 2D scene/palette architecture was studied, no art is copied.
// This file generates brand new PNGs. V5.4 approved effects and prior rejected tests untouched.
export const MOVE_IDS=['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash'];
export const MOVE_NAMES=['Flame Burst','Frost Breath','Air Slash','Razor Shell','Shadow Punch','Meteor Mash'];
export const MOVE_TYPES=['FIRE','ICE','FLYING','WATER','GHOST','STEEL'];
export const S=72,SCALE=2,F=18,LAYERS=3,CONTACT_FRAME=10;
export const FRAME_MS=[75,55,46,40,37,35,34,33,33,40,86,56,52,55,57,62,66,82];
export const LAYER_NAMES=['body','detail','impact'];
export const PALETTES=[
 ['#651c18','#a32c13','#dd4a1b','#ff7820','#ffac40','#ffd35b','#ffe9a0','#fff8d9'],
 ['#183f5c','#23628b','#398eaf','#5dbbd6','#8edbeb','#bef3f7','#e7feff','#ffffff'],
 ['#274e64','#3e7d95','#66a8bc','#9dd4e3','#c6eaf0','#e5f9ff','#ffffff','#81d2e5'],
 ['#113d65','#1b6088','#237da5','#35a6cb','#66d4e5','#a2e8f2','#dbfaff','#ffffff'],
 ['#19162b','#30234b','#50356d','#754c9c','#a176c5','#c59de1','#ead2f7','#ffffff'],
 ['#263447','#435b73','#658299','#91a9bd','#b9d0dd','#e1eff5','#fff9d9','#ffd373']
];
const FIRE=[
 '....11............',
 '...1221.....1.....',
 '...123321..1221...',
 '..12344321123321..',
 '.1234554433344321.',
 '12345666555454321.',
 '123456777665544321',
 '.12345677877654431',
 '..123456777665431.',
 '...12345566554421.',
 '..12345554443321..',
 '.1234433221221....',
 '..1221.............'
];
const ICE=[
 '......77......',
 '.....6776.....',
 '....566665....',
 '...45677654...',
 '..3456776543..',
 '.234456765432.',
 '12334566543321',
 '.123345543321.',
 '..1233443321..',
 '...12333321...',
 '....122221....',
 '.....1111.....'
];
const SHELL=[
 '..........11...........',
 '........122221.........',
 '......123444321.......',
 '.....123456654321......',
 '....12345677654321.....',
 '...1234556666554321....',
 '..123444556665554321...',
 '.1233334445555554321...',
 '123222333444444443321..',
 '122222333344444433221..',
 '.1222233333444332221...',
 '..12222233333332221....',
 '...11222222222211......',
 '.....1111111111........'
];
const GHOST_FIST=[
 '........1111111.......',
 '.....112222222211.....',
 '...1123333444333211...',
 '..12334445555443321...',
 '.12334445566655443211.',
 '123344556677665543321',
 '123455667777665543321',
 '123455667777665543321',
 '123344556666655543321',
 '.1233445555555433221.',
 '..12333444444333221..',
 '...1123333333332211...',
 '.....11222222111......'
];
const METAL_FIST=[
 '...........1111........',
 '.....111112233211......',
 '...1122334455543211....',
 '..12234455666554321....',
 '.1233455666665543211...',
 '1234455667776655433211.',
 '1234456777776655433211.',
 '1234456777776655433211.',
 '12334556666665544321..',
 '.1233455555555443321..',
 '..122334444444333221..',
 '...1122333333322211....',
 '.....111222222111......'
];
export function createMoveSheetsV3(){
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),ease=t=>1-(1-clamp(t))**3;
 const rnd=(n,s=0)=>{let x=Math.sin((n+71.21)*74.823+s*27.61)*43658.541;return x-Math.floor(x)};
 const idx=(x,y)=>y*S+x;
 function draw(kind,f,layer){
  const img=new Uint8Array(S*S);
  const dot=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<S&&y>=0&&y<S&&c>0)img[idx(x,y)]=c};
  const box=(x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)dot(x+i,y+j,c)};
  const line=(x,y,ex,ey,c,w=1)=>{let n=Math.max(1,Math.ceil(Math.hypot(ex-x,ey-y)*1.45));for(let i=0;i<=n;i++){
   let t=i/n;for(let d=0;d<w;d++)dot(x+(ex-x)*t,y+(ey-y)*t+d,c);
  }};
  const oval=(x,y,rx,ry,c)=>{if(rx<=0||ry<=0)return;for(let v=-Math.ceil(ry);v<=Math.ceil(ry);v++){
   if(Math.abs(v)>ry)continue;let hw=Math.floor(rx*Math.sqrt(Math.max(0,1-v*v/(ry*ry))));
   for(let i=-hw;i<=hw;i++)dot(x+i,y+v,c);
  }};
  const poly=(pts,c)=>{const lo=Math.max(0,Math.floor(Math.min(...pts.map(p=>p[1])))),hi=Math.min(S-1,Math.ceil(Math.max(...pts.map(p=>p[1]))));
   for(let y=lo;y<=hi;y++){let xs=[];for(let i=0;i<pts.length;i++){let a=pts[i],b=pts[(i+1)%pts.length];
    if(a[1]<=y&&b[1]>y||b[1]<=y&&a[1]>y)xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
    xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)for(let x=Math.ceil(xs[j]);x<=Math.floor(xs[j+1]);x++)dot(x,y,c)
   }};
  function stamp(pattern,x,y,scale=1,{flipX=false,flipY=false}={}){
   const h=pattern.length,w=Math.max(...pattern.map(row=>row.length));
   for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const sourceRow=pattern[flipY?h-j-1:j],ch=sourceRow?.[flipX?w-i-1:i]??'.';
    if(!/^[1-8]$/.test(ch))continue;
    for(let yy=0;yy<scale;yy++)for(let xx=0;xx<scale;xx++)dot(x+i*scale+xx,y+j*scale+yy,Number(ch))
   }
  }
  const quad=(a,b,c,t)=>{let u=1-t;return u*u*a+2*u*t*b+t*t*c};
  function arc(a,b,c,color,start=0,end=1,w=1){
   let last;for(let i=0;i<=32;i++){let t=start+(end-start)*i/32,pt=[quad(a[0],b[0],c[0],t),quad(a[1],b[1],c[1],t)];
    if(last)line(last[0],last[1],pt[0],pt[1],color,w);last=pt;
   }
  }
  const shard=(x,y,r,c)=>poly([[x,y-r],[x+r*.56,y],[x,y+r],[x-r*.56,y]],c);
  const spark=(x,y,r,c)=>{line(x-r,y,x+r,y,c);line(x,y-r,x,y+r,c);if(r>4){dot(x-2,y-2,c);dot(x+2,y+2,c)}};
  function embers(cx,cy,age,count,type){
   for(let i=0;i<count;i++){
    let a=i*2.399+type,dist=4+age*(2.7+rnd(i,5)*1.9)+rnd(i,8)*12;
    let x=cx+Math.cos(a)*dist,y=cy+Math.sin(a)*dist*.68;
    if(type===0){if(i%5===0)line(x-2,y+1,x,y-3,3+i%5);else dot(x,y,3+i%5)}
    else if(type===1){if(i%4===0)shard(x,y,2+rnd(i)*3,3+i%5);else dot(x,y,3+i%4)}
    else if(type===3){if(i%3===0)oval(x,y,1,2,3+i%5);else dot(x,y,3+i%4)}
    else if(type===5){if(i%5===0)spark(x,y,2+rnd(i)*2,5+i%3);else dot(x,y,3+i%5)}
    else dot(x,y,2+i%5)
   }
  }
  if(f===0||f===17)return img;
  const travel=clamp((f-3)/7),q=ease(travel),age=f-10,impact=f===10;
  if(kind===0){ // FLAME BURST: turbulent flame projectile -> radial small fires
   const cx=Math.round(16+39*q),cy=Math.round(36+Math.sin(f*1.7)*2);
   if(f<=9){
    if(layer===0){
     if(f<=3){oval(15,36,3+f,3+f,2);stamp(FIRE,12,31,1)}
     else {
      stamp(FIRE,cx-10,cy-6,1,{flipY:f%2===0});
      if(f%2){line(cx-12,cy+2,cx-23,cy-1,2);line(cx-15,cy-4,cx-20,cy-8,3)}
      else{line(cx-10,cy+6,cx-18,cy+11,4);line(cx-9,cy-7,cx-19,cy-10,2)}
     }
    }
    if(layer===1){
     for(let i=0;i<9;i++){
      let x=cx-12-i*4-rnd(i,2)*3,y=cy+(rnd(i,3)*2-1)*(3+i*.43);
      if(i%3===0)oval(x,y,1,2,3+i%5);else dot(x,y,3+i%4)
     }
     if(f>3)stamp(FIRE,cx-8,cy-5,1,{flipX:f%2===0})
    }
   }else{
    let x=55,y=36;
    if(layer===0&&age<=3){
     for(let i=0;i<8;i++){
      let a=i*Math.PI/4+age*.14,r=7+age*4;
      let bx=x+Math.cos(a)*r,by=y+Math.sin(a)*r;
      // Deliberately irregular rising tongues, not a uniform radial star.
      poly([[x+Math.cos(a)*4,y+Math.sin(a)*4],[bx-2,by+3],
       [bx+Math.cos(a)*(7-age),by+Math.sin(a)*(9-age)-3],[bx+2,by-1]],2+(i+age)%5);
     }
     if(age===0)oval(x,y,9,8,5);
    }
    if(layer===1)embers(x,y,Math.max(0,age),Math.max(0,28-age*4),0);
    if(layer===2&&impact){spark(x,y,11,8);oval(x,y,4,4,8)}
   }
  }else if(kind===1){ // FROST BREATH: distinct flowing spiral wisps, fractured ice plates on contact
   let end=18+Math.floor(39*ease((f-1)/9));
   if(f<=10){
    if(layer===0){
     // Several separate icy air-currents with visible gaps (no opaque spray cone).
     for(let i=0;i<5;i++){
      let drift=(i-2)*5,opening=(end-15)*.14;
      arc([10,36+i*.7],[29,36+drift*.5+Math.sin(f+i)*3],[end,36+drift+opening*(i-2)*.24],2+(i%4),.02,.99,1);
     }
     if(f>4){arc([12,35],[31,26+Math.sin(f)*2],[end,21],3,.08,.91);
      arc([13,38],[32,44+Math.cos(f)*2],[end,52],2,.04,.88)}
    }
    if(layer===1){
     for(let i=0;i<12;i++){
      let x=13+rnd(i,1)*(end-13),spread=(x-11)*.37;
      let y=36+(rnd(i,4)*2-1)*(3+spread);
      if(i%3===0)shard(x,y,2+(i%4),4+i%4);
      else dot(x,y,4+i%4);
     }
    }
   }
   if(f>=10){
    let x=55,y=36;
    if(layer===0&&age<=3){
     for(let i=0;i<6;i++){
      let a=i*Math.PI/3+.1,rr=10+age*4;
      shard(x+Math.cos(a)*rr,y+Math.sin(a)*rr,Math.max(2,8-age),2+i%4);
     }
    }
    if(layer===1)embers(x,y,age,Math.max(0,23-age*3),1);
    if(layer===2&&impact){stamp(ICE,49,29,1);spark(x,y,10,8)}
   }
  }else if(kind===2){ // AIR SLASH: 3 thin aerodynamic pressure slices without generic white stripes
   if(f<=10){
    let front=14+42*ease((f-1)/9);
    for(let i=0;i<3;i++){
     if(f<2+i||f>7+i*2)continue;
     let x=front-12+i*2,cy=35+(i-1)*7;
     if(layer===0)arc([x-9,cy+14],[x+2,cy+5],[x+17,cy-17],2+i,.08,.91,2);
     if(layer===1){
      arc([x-6,cy+12],[x+5,cy+2],[x+18,cy-15],7,.11,.92,1);
      line(x-11,cy+15,x-18,cy+19,3+i)
     }
    }
    if(layer===2&&impact){spark(55,35,6,7)}
   }else{
    if(layer===0&&age<3)arc([48+age*2,45],[61,33],[58,23],2,.14+age*.2,.96);
    if(layer===1)embers(55,35,age,Math.max(0,15-age*3),2);
   }
  }else if(kind===3){ // RAZOR SHELL: scallop shell actually slashes on curved swing arc with water
   let t=ease((f-2)/8),cx=Math.round(17+39*t),cy=Math.round(49-23*t);
   if(f<=10){
    if(layer===0){
     stamp(SHELL,cx-11,cy-8,1,{flipY:f>=7});
     for(let i=0;i<4;i++){
      let ax=cx-5+i*3,ay=cy+3;
      line(ax,ay,ax+4,ay-8+i,4+i%3);
     }
    }
    if(layer===1){
     arc([cx-16,cy+12],[cx+3,cy+16],[cx+16,cy-16],6,.07,.98,2);
     arc([cx-13,cy+9],[cx+7,cy+12],[cx+14,cy-13],8,.18,.94);
     for(let i=0;i<9;i++){
      let a=i*2.4+f*.2,r=10+i%4*2;
      if(i%3===0)oval(cx+Math.cos(a)*r,cy+Math.sin(a)*r,1,2,4+i%4);
      else dot(cx+Math.cos(a)*r,cy+Math.sin(a)*r,3+i%5)
     }
    }
    if(layer===2&&impact){spark(55,29,11,8)}
   }
   if(f>10){
    if(layer===1)embers(55,29,age,Math.max(0,23-age*3),3);
    if(layer===0&&age<=2)arc([42,42],[62,40],[63,17],3,.15+age*.18,.9);
   }
  }else if(kind===4){ // SHADOW PUNCH: articulated spectral gauntlet with fingers and thumb
   let x=Math.round(15+41*ease((f-2)/8)),y=36;
   if(f<=10){
    if(layer===0){
     stamp(GHOST_FIST,x-11,y-7,1,{flipY:f===9});
     // Four discrete finger ridges and underside thumb, to read as a fist.
     for(let i=0;i<4;i++){box(x+7,y-4+i*3,5-i%2,2,4+i%3)}
     box(x-2,y+5,5,3,4);
    }
    if(layer===1){
     for(let i=0;i<8;i++){
      let bx=x-14-i*5+rnd(i)*4,by=y+(rnd(i,5)*2-1)*8;
      if(i%3===0)oval(bx,by,3,2,2+i%3);else dot(bx,by,2+i%4)
     }
     if(f<7){oval(11,36,6,11,1)}
    }
    if(layer===2&&impact){spark(55,36,9,8)}
   }else{
    if(layer===1)embers(55,36,age,Math.max(0,19-age*3),4);
    if(layer===0&&age<=2){arc([44,45],[61,26],[65,33],3,.1+age*.23,.95)}
   }
  }else{ // METEOR MASH: angular segmented metal gauntlet with a golden starlit trail
   let t=ease((f-2)/8),x=Math.round(15+42*t),y=Math.round(52-17*t);
   if(f<=10){
    if(layer===0){
     stamp(METAL_FIST,x-12,y-6);
     for(let i=0;i<4;i++){let yy=y-5+i*3;
      box(x+7,yy,5,2,4+i%3);line(x+8,yy+2,x+11,yy+2,2)}
     box(x-4,y+5,6,3,4);
    }
    if(layer===1){
     for(let i=0;i<9;i++){
      let bx=x-15-i*4,by=y+9+i*1.8;
      if(i%3===0)spark(bx,by,2,7);else dot(bx,by,4+i%4)
     }
     if(f>=8)line(x-16,y+10,x-24,y+17,7);
    }
    if(layer===2&&impact){spark(56,35,14,8);spark(56,35,9,7)}
   }else{
    if(layer===0&&age<3){for(let i=0;i<6;i++){
     let a=i*Math.PI/3,r=9+age*4;
     line(56+Math.cos(a)*5,35+Math.sin(a)*5,56+Math.cos(a)*r,35+Math.sin(a)*r,3+i%4)
    }}
    if(layer===1)embers(56,35,age,Math.max(0,18-age*3),5);
   }
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
  // Native 72px hand-drawn pixels are enlarged exactly 2x at export.
  const frames=Array.from({length:F},(_,f)=>Array.from({length:LAYERS},(_,l)=>draw(k,f,l)));
  const w=S*SCALE*F,h=S*SCALE*LAYERS,raw=new Uint8Array(h*(w+1));
  for(let y=0;y<h;y++){let layer=Math.floor(y/(S*SCALE)),logicalY=Math.floor((y%(S*SCALE))/SCALE);
   const row=y*(w+1)+1;
   for(let f=0;f<F;f++){const pixels=frames[f][layer];
    for(let x=0;x<S;x++){let v=pixels[logicalY*S+x];let pos=row+f*S*SCALE+x*SCALE;
     raw[pos]=v;raw[pos+1]=v;
    }
   }
  }
  const pal=concat(new Uint8Array([0,0,0]),...PALETTES[k].map(hex=>new Uint8Array([1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)))));
  const trans=new Uint8Array([0,...PALETTES[k].map(()=>255)]);
  const bytes=concat(new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',concat(be(w),be(h),new Uint8Array([8,3,0,0,0]))),
   chunk('PLTE',pal),chunk('tRNS',trans),chunk('IDAT',stored(raw)),chunk('IEND',new Uint8Array()));
  return{id,name:MOVE_NAMES[k],type:MOVE_TYPES[k],width:w,height:h,bytes,
   counts:frames.map(a=>a.map(z=>z.reduce((n,v)=>n+(v>0),0)))};
 }
 return MOVE_IDS.map(png);
}
