// Original 96x96, 16-frame studies: contact-first impacts inspired by general overworld combat design.

// Independent of HnS Legends source/assets and Pokémon Torre 2. Keep stable for reproducing outputs.

export const IMPACT_SPECS = [
  {
    "id": "ember-hit",
    "label": "Impacto de brasa",
    "color": "fire",
    "palette": [
      "#000000",
      "#7e2430",
      "#d53b2c",
      "#ff9439",
      "#ffe29b",
      "#ffffff"
    ]
  },
  {
    "id": "frost-hit",
    "label": "Fratura de gelo",
    "color": "ice",
    "palette": [
      "#000000",
      "#154a73",
      "#1c90bc",
      "#72dbeb",
      "#d5f9ff",
      "#ffffff"
    ]
  },
  {
    "id": "volt-hit",
    "label": "Estalo elétrico",
    "color": "electric",
    "palette": [
      "#000000",
      "#42325f",
      "#8960da",
      "#f5ca55",
      "#fff3a8",
      "#ffffff"
    ]
  },
  {
    "id": "tide-hit",
    "label": "Onda de impacto",
    "color": "water",
    "palette": [
      "#000000",
      "#12467e",
      "#1478c7",
      "#34c9df",
      "#b7f7f3",
      "#ffffff"
    ]
  }
];

export const IMPACT_DELAYS_CS = [4,4,4,4,5,7,7,6,5,5,5,5,5,5,5,7];

export function framesFor(spec){
 const W=96,H=96,frames=[];
 const cx=57,cy=48;
 for(let f=0;f<16;f++){
  const a=new Uint8Array(W*H);
  const put=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<W&&y<H&&c>0)a[y*W+x]=c;};
  const rect=(x,y,w,h,c)=>{for(let yy=Math.round(y);yy<Math.round(y+h);yy++)for(let xx=Math.round(x);xx<Math.round(x+w);xx++)put(xx,yy,c);};
  const line=(x,y,xx,yy,c,t=1)=>{let n=Math.max(1,Math.ceil(Math.hypot(xx-x,yy-y)*1.7));for(let k=0;k<=n;k++){const px=x+(xx-x)*k/n,py=y+(yy-y)*k/n;rect(px-Math.floor(t/2),py-Math.floor(t/2),t,t,c);}};
  const diamond=(x,y,r,c)=>{for(let yy=-r;yy<=r;yy++){const wd=r-Math.abs(yy);for(let xx=-wd;xx<=wd;xx++)put(x+xx,y+yy,c);}};
  const circ=(x,y,r,c,start=0,end=Math.PI*2)=>{for(let t=start;t<=end;t+=.04){put(x+Math.cos(t)*r,y+Math.sin(t)*r,c);}};
  const shard=(x,y,ang,size,c)=>{const vx=Math.cos(ang),vy=Math.sin(ang),nx=-vy,ny=vx;
    const x1=x+vx*size,y1=y+vy*size;
    line(x,y,x1,y1,c,size>10?3:2);
    line(x+nx*2,y+ny*2,x1,y1,Math.min(c+1,5),1);
    line(x1-vx*3+nx*2,y1-vy*3+ny*2,x1,y1,5,1);
  };
  // Approaching projectile occupies the left side; no premature collision flash.
  if(f<=4){
   const x=8+f*11.8, y=cy+Math.round(Math.sin(f*1.5)*2);
   if(spec.color==="fire"){
    diamond(x,y,3+(f%2),3);rect(x-2,y-1,4,2,5);
    line(x-14,y+2,x-5,y,2,2);line(x-10,y-3,x-3,y-1,4,1);
    line(x-7,y+6,x-3,y+3,1,2);
   }else if(spec.color==="ice"){
    shard(x-5,y,0,9,3);diamond(x+2,y,3,4);
    line(x-12,y-2,x-5,y-2,2,1);put(x-14,y+3,4);
   }else if(spec.color==="electric"){
    line(x-18,y-4,x-11,y+3,3,2);line(x-11,y+3,x-4,y-5,4,2);
    line(x-4,y-5,x+4,y,5,2);put(x-7,y+8,2);put(x+6,y-6,4);
   }else{
    circ(x,y,7,3,Math.PI*.5,Math.PI*1.85);circ(x+2,y,4,4,1,4.8);
    diamond(x+5,y,2,5);put(x-9,y-7,3);put(x-13,y+3,2);
   }
  }
  // A bright but short CONTACT frame, then a distinct directional burst.
  if(f>=4&&f<=8){
   const age=f-4, power=[2,11,18,16,11][age];
   if(f===4)diamond(cx,cy,3,5);
   else {
    if(spec.color==="fire"){
      diamond(cx,cy,Math.max(3,11-age),2);
      diamond(cx,cy,Math.max(2,8-age),3);
      if(f<=6)diamond(cx,cy,3,5);
      for(let i=0;i<11;i++){
       const ang=i*Math.PI*2/11+Math.sin(i*1.7)*.09;
       const len=power*(.68+.40*((i*7)%5)/4);
       const ox=cx+Math.cos(ang)*6,oy=cy+Math.sin(ang)*6;
       line(ox,oy,cx+Math.cos(ang)*len,cy+Math.sin(ang)*len,i%3===0?4:3,i%3===0?2:3);
       if(i%3===0)diamond(cx+Math.cos(ang)*(len+3),cy+Math.sin(ang)*(len+3),2,4);
      }
      for(let j=0;j<5;j++){const x=cx-13+j*7,y=cy-8-Math.abs(Math.sin(j*1.5))*age*2;
       line(x,cy-3,x+(-2+j%3),y,age<=2?4:3,2);}
    } else if(spec.color==="ice"){
      diamond(cx,cy,age<=2?6:3,4);if(f<=6)diamond(cx,cy,2,5);
      for(let i=0;i<8;i++){
        const ang=i*Math.PI/4, len=power*(i%2===0?1.04:.78);
        shard(cx+Math.cos(ang)*4,cy+Math.sin(ang)*4,ang,len,i%2===0?2:3);
        if(age>1){line(cx+Math.cos(ang)*14,cy+Math.sin(ang)*14,cx+Math.cos(ang+0.2)*18,cy+Math.sin(ang+0.2)*18,4,1);}
      }
    } else if(spec.color==="electric"){
      diamond(cx,cy,age<=2?7:3,3);diamond(cx,cy,age<=2?3:1,5);
      for(let i=0;i<8;i++){
        const ang=i*Math.PI/4+.1;
        const len=power*((i%3===0)?1.15:.8);
        const mx=cx+Math.cos(ang)*len*.46+Math.cos(ang+Math.PI/2)*((i%2)?4:-4);
        const my=cy+Math.sin(ang)*len*.46+Math.sin(ang+Math.PI/2)*((i%2)?4:-4);
        line(cx,cy,mx,my,i%2===0?4:3,2);
        line(mx,my,cx+Math.cos(ang)*len,cy+Math.sin(ang)*len,i%3===0?5:3,2);
        if(i%3===0)put(cx+Math.cos(ang)*(len+4),cy+Math.sin(ang)*(len+4),5);
      }
    } else {
      diamond(cx,cy,age<=2?5:2,4);if(f<=6)diamond(cx,cy,2,5);
      const radius=power*.82;
      circ(cx,cy,radius,3,Math.PI*.12,Math.PI*1.87);
      circ(cx+1,cy,radius-3,4,Math.PI*.4,Math.PI*1.72);
      for(let i=0;i<9;i++){
        const ang=i*Math.PI*2/9+(f-5)*.17;
        const len=radius+2+(i%3)*3;
        line(cx+Math.cos(ang)*radius*.65,cy+Math.sin(ang)*radius*.65,cx+Math.cos(ang)*len,cy+Math.sin(ang)*len,i%2?3:4,i%3===0?2:1);
        if(i%2===0)diamond(cx+Math.cos(ang)*(len+3),cy+Math.sin(ang)*(len+3),2,4);
      }
    }
   }
  }
  // Debris moves away from the hit, shrinks and disappears rather than freezing.
  if(f>=6&&f<=14){
    const drift=f-6,decay=Math.max(1,5-Math.floor((f-6)/2));
    for(let i=0;i<13;i++){
      if(f>=12&&i%2===0)continue;
      if(f>=14&&i%3!==0)continue;
      const ang=i*2.399963+(spec.color==="water"?.37:spec.color==="electric"?.11:0);
      const radius=9+drift*(3+(i%4))+(i*5)%7;
      const x=cx+Math.cos(ang)*radius,y=cy+Math.sin(ang)*radius*(spec.color==="fire"?.85:1);
      const p=(i%4===0?4:i%3===0?3:2);
      if(spec.color==="fire"){
        diamond(x,y-Math.floor(drift*.7),Math.min(decay,2),p);
        if(f<10)line(x-1,y+3,x+2,y+5,2,1);
      }else if(spec.color==="ice"){
        shard(x,y,ang,Math.max(2,decay+2),p);
      }else if(spec.color==="electric"){
        line(x-2,y-1,x+1,y-3,p,1);line(x+1,y-3,x+2,y+1,Math.min(p+1,5),1);
      }else{
        diamond(x,y,Math.max(1,Math.floor(decay/2)),p);
        if(f<11)put(x-2,y-3,3);
      }
    }
  }
  if(f===15){ // exactly blank end-frame for clean reset in loop
    a.fill(0);
  }
  frames.push(a);
 }
 return frames;
};

export function crc32(bytes){const table=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[i]=c>>>0;}let c=-1;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return(c^-1)>>>0;};

export function concat(...xs){const out=new Uint8Array(xs.reduce((s,a)=>s+a.length,0));let p=0;for(const x of xs){out.set(x,p);p+=x.length;}return out;};

export function be(n){return Uint8Array.from([n>>>24&255,n>>>16&255,n>>>8&255,n&255]);};

export function le(n){return Uint8Array.from([n&255,(n>>>8)&255]);};

export function chunk(type,body){const name=Uint8Array.from(type,x=>x.charCodeAt(0));return concat(be(body.length),name,body,be(crc32(concat(name,body))));};

export function deflateFixed(bytes){
 // Simple RFC1951 fixed-Huffman compressor, optimised for transparent pixel runs.
 const lens=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
 const eb=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 let bits=0,used=0,a=1,b=0;const out=[];
 const write=(v,n)=>{bits|=v<<used;used+=n;while(used>=8){out.push(bits&255);bits>>>=8;used-=8;}};
 const reverse=(v,n)=>{let r=0;for(let i=0;i<n;i++){r=r<<1|(v&1);v>>>=1;}return r;};
 const symbol=(v)=>{let c,w;if(v<=143){c=v+0x30;w=8;}else if(v<=255){c=v-144+0x190;w=9;}else if(v<=279){c=v-256;w=7;}else{c=v-280+0xc0;w=8;}write(reverse(c,w),w);};
 const match=(n)=>{let j=n===258?28:0;if(n!==258)for(let i=0;i<28;i++){if(n>=lens[i]&&n<=lens[i]+(1<<eb[i])-1){j=i;break;}}symbol(257+j);if(eb[j])write(n-lens[j],eb[j]);write(0,5);};
 write(3,3);
 for(let p=0;p<bytes.length;){
  const v=bytes[p];a=(a+v)%65521;b=(b+a)%65521;
  if(v){symbol(v);p++;continue;}
  let n=1;while(p+n<bytes.length&&bytes[p+n]===0)n++;b=(b+(n-1)*a)%65521;
  if(n<4)for(let k=0;k<n;k++)symbol(0);
  else{symbol(0);let rem=n-1;while(rem>=3){const k=Math.min(258,rem);match(k);rem-=k;}while(rem-->0)symbol(0);}
  p+=n;
 }
 symbol(256);if(used)out.push(bits&255);
 return concat(Uint8Array.from([0x78,0x01]),Uint8Array.from(out),be(((b<<16)|a)>>>0));
};

export function toPNG(spec,frames){
 const W=96,H=96,F=16,w=W*F;const raw=new Uint8Array(H*(w+1));
 for(let y=0;y<H;y++)for(let f=0;f<F;f++)raw.set(frames[f].subarray(y*W,(y+1)*W),y*(w+1)+1+f*W);
 const rgb=spec.palette.flatMap(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
 return concat(Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",concat(be(w),be(H),Uint8Array.from([8,3,0,0,0]))),chunk("PLTE",Uint8Array.from(rgb)),chunk("tRNS",Uint8Array.from(spec.palette.map((_,i)=>i?255:0))),chunk("IDAT",deflateFixed(raw)),chunk("IEND",new Uint8Array()));
};

export function toGIF(spec,frames,delays){
 const bytes=[];const push=(...nums)=>bytes.push(...nums);const str=(s)=>{for(const ch of s)bytes.push(ch.charCodeAt(0));};const word=(n)=>push(n&255,n>>>8&255);
 str("GIF89a");word(96);word(96);push(0xf2,0,0);
 for(let i=0;i<8;i++){const h=spec.palette[i]??"#000000";push(...[1,3,5].map(p=>parseInt(h.slice(p,p+2),16)));}
 push(0x21,0xff,0x0b);str("NETSCAPE2.0");push(3,1,0,0,0);
 for(let f=0;f<frames.length;f++){
  const frame=frames[f];let xmin=96,ymin=96,xmax=-1,ymax=-1;
  for(let y=0;y<96;y++)for(let x=0;x<96;x++)if(frame[y*96+x]){xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);}
  if(xmax<0){xmin=ymin=0;xmax=ymax=0;}
  const fw=xmax-xmin+1,fh=ymax-ymin+1;
  push(0x21,0xf9,0x04,0x09);word(delays[f]);push(0,0);
  push(0x2c);word(xmin);word(ymin);word(fw);word(fh);push(0);
  push(3); // min LZW code size, 8 palette entries
  // Safe GIF-LZW literal stream with dictionary reset per pixel.
  // Transparency + cropped frames keep assets reasonably small.
  const compressed=[];let acc=0,nbits=0;
  const emit=(code)=>{acc|=code<<nbits;nbits+=4;while(nbits>=8){compressed.push(acc&255);acc>>>=8;nbits-=8;}};
  for(let y=ymin;y<=ymax;y++)for(let x=xmin;x<=xmax;x++){emit(8);emit(frame[y*96+x]);}
  emit(9);if(nbits)compressed.push(acc&255);
  for(let i=0;i<compressed.length;i+=255){const n=Math.min(255,compressed.length-i);push(n);for(let j=0;j<n;j++)bytes.push(compressed[i+j]);}
  push(0);
 }
 push(0x3b);return Uint8Array.from(bytes);
};

export function createImpactArtifacts(spec){const frames=framesFor(spec);return {frames,png:toPNG(spec,frames),gif:toGIF(spec,frames,IMPACT_DELAYS_CS)};}
