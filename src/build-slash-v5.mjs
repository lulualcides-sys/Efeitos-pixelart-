// V5 — Original thin calligraphic sweep followed by element-specific breakup.
// Reproducible indexed-PNG artwork. Reference is for motion observation only;
// no third-party pixels or watermarks have been extracted.
export function createV5() {
 const size=144,count=12;
 const styles=[
 ["ember-rake","fire",17,["#1c1625","#571b2a","#8a2632","#c83939","#ec5543","#ff9c68","#ffe7b3"]],
 ["solar-crescent","solar",23,["#241b24","#6b4425","#a47222","#d7a337","#f3ca53","#ffe997","#fffbed"]],
 ["frost-shatter","ice",29,["#173044","#1b5e80","#2a87ab","#41b8d6","#7ddcf4","#c8f5ff","#f5ffff"]],
 ["ivory-gale","wind",37,["#19364a","#3b6a80","#70a2b5","#a6ced9","#d5eaf0","#f3ffff","#ffffff"]],
 ["verdant-sickle","nature",43,["#19372c","#235e43","#2b9254","#38c07c","#79e8ac","#baf8d0","#f0fff2"]],
 ["astral-reaver","ghost",59,["#27332a","#4b573b","#6e8251","#7965a6","#a587d0","#d6bce9","#ffe1a1"]]
 ];
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
 function bez(a,b,c,d,t){const u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d}
 function P(q){if(q<.67){const t=q/.67;return [bez(15,42,93,120,t),bez(101,116,112,84,t)]}
 const t=(q-.67)/.33;return [bez(120,135,122,87,t),bez(84,61,39,35,t)]}
 function T(q){const p=P(clamp(q-.002)),n=P(clamp(q+.002)),dx=n[0]-p[0],dy=n[1]-p[1],l=Math.hypot(dx,dy)||1;return{tx:dx/l,ty:dy/l,nx:-dy/l,ny:dx/l}}
 function frame(style,f){
  const [id,kind,seed]=style,buf=new Uint8Array(size*size);
  const rng=n=>((Math.imul(n+seed*301,2654435761)^Math.imul(n+seed*29,2246822519))>>>0)/4294967295;
  const dot=(x,y,c,z=1)=>{x=Math.round(x);y=Math.round(y);for(let j=0;j<z;j++)for(let i=0;i<z;i++)if(x+i>=0&&y+j>=0&&x+i<size&&y+j<size&&c)buf[(y+j)*size+x+i]=c};
  const line=(x,y,u,v,c,z=1)=>{const n=Math.max(1,Math.ceil(Math.hypot(u-x,v-y)*1.6));for(let i=0;i<=n;i++){const t=i/n;dot(x+(u-x)*t,y+(v-y)*t,c,z)}};
  const poly=(pts,c)=>{let y0=Math.max(0,Math.floor(Math.min(...pts.map(p=>p[1])))),y1=Math.min(size-1,Math.ceil(Math.max(...pts.map(p=>p[1]))));for(let y=y0;y<=y1;y++){let cuts=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]))}cuts.sort((a,b)=>a-b);for(let i=0;i+1<cuts.length;i+=2)for(let x=Math.ceil(cuts[i]);x<=Math.floor(cuts[i+1]);x++)dot(x,y,c)}};
  const at=(q,d=0,t=0)=>{let p=P(q),v=T(q);return {x:p[0]+v.nx*d+v.tx*t,y:p[1]+v.ny*d+v.ty*t,...v}};
  const len=[.065,.22,.49,.77,1,1,1,1,1,1,1,1][f];
  const keep=[1,1,1,1,1,1,.92,.78,.54,.31,.13,.025][f];
  function alive(q,i){return q<=len&&(f<6||((i*19+seed*7+f*29)%101)<Math.round(keep*101))}
  const width=q=>.25+3.75*Math.pow(Math.max(0,Math.sin(Math.PI*q)),.73)*(1-.19*q);
  // Thin luminous BEVEL, on screen primarily frames 2–5.
  if(f<=5)for(let i=0;i<=520;i++){
   const q=i/520;if(q>len)break;
   if(f===0&&i%27>14)continue;
   let p=P(q),v=T(q),w=width(q)*(f===5?.72:1);
   for(let d=-Math.ceil(w);d<=Math.ceil(w);d++){
    let r=Math.abs(d)/(w+.001);if(r>1)continue;
    const c=kind==="ghost"?(r<.18?3:r<.56?2:1):kind==="nature"?(r<.2?7:r<.56?5:3):(r<.18?7:r<.55?6:d<0?4:3);
    dot(p[0]+v.nx*d,p[1]+v.ny*d,c);
   }
  }
  // Fine interrupted taper trails instead of C-shaped tubes.
  if(f>=2&&f<=5)for(const [start,end,offset,shade,gap] of [
   [.02,.54,-8,kind==="ghost"?2:3,35],
   [.10,.78,8,kind==="nature"?5:6,32],
   [.59,.98,-10,kind==="fire"?4:5,40]
  ]){
   let last=null;
   for(let j=0;j<230;j++){
    const q=start+(end-start)*j/230;if(q>len)break;
    if(j%gap>gap-11){last=null;continue}
    const a=at(q,offset+Math.sin(q*11+seed)*.4,(f>=6?f-5:0)*.5);
    if(last&&Math.hypot(a.x-last.x,a.y-last.y)<5)line(last.x,last.y,a.x,a.y,shade);
    last=a;
   }
  }
  // Distinct elemental geometry. At frame 5+ fragments move away tangentially.
  const frag=(q,d,i)=>at(q,d+(f>=5?(f-4)*1.9*(.5+i%3):0),(f>=5?(f-4)*(i%3+1)*1.3:0));
  const piece=(v,L,W,shade,bright)=>{
   const Q=(l,n)=>[v.x+v.tx*l+v.nx*n,v.y+v.ty*l+v.ny*n];
   const a=Q(-L*.47,-W*.4),b=Q(L*.3,-W*.4),c=Q(L*.57,0),d=Q(L*.11,W*.48);
   poly([a,b,c,d],shade);line(...a,...c,bright);
  };
  const glint=(v,L,shade)=>{line(v.x-L,v.y,v.x+L,v.y,shade);line(v.x,v.y-L,v.x,v.y+L,shade)};
  const leaf=(v,i)=>{
   const Q=(l,n)=>[v.x+v.tx*l+v.nx*n,v.y+v.ty*l+v.ny*n],l=6+i%4,w=2+(i%2);
   const a=Q(-l,0),b=Q(0,-w),c=Q(l,0),d=Q(0,w);
   poly([a,b,c,d],i%3===0?3:5);line(...a,...c,7);
  };
  if(kind==="fire"){
   for(let i=0;i<13;i++){const q=.08+i*.069;if(!alive(q,100+i))continue;piece(frag(q,((i%4)-1.5)*4.3,i),6+i%3*2,1.7+i%2,3+i%3,6)}
   for(let i=0;i<6;i++){const q=.13+i*.14;if(!alive(q,140+i))continue;const v=frag(q,7+i%3*2,i);line(v.x-v.tx*2,v.y-v.ty*2,v.x+v.tx*5+v.nx*2,v.y+v.ty*5+v.ny*2,7)}
  } else if(kind==="solar"){
   for(let i=0;i<10;i++){const q=.10+i*.082;if(!alive(q,200+i))continue;const v=frag(q,12+i%3*4,i);glint(v,i%3===0?3:1,7)}
   for(let i=0;i<5;i++){const q=.16+i*.17;if(!alive(q,240+i))continue;const v=frag(q,-4+i%2*12,i);line(v.x-v.tx*3,v.y-v.ty*3,v.x+v.tx*7,v.y+v.ty*7,6)}
  } else if(kind==="ice"){
   for(let i=0;i<5;i++){const q=.17+i*.162;if(!alive(q,300+i))continue;
    const v=frag(q,i%2?8:-10,i),r=5+i%3*1.5;const Q=(l,n)=>[v.x+v.tx*l+v.nx*n,v.y+v.ty*l+v.ny*n];
    const a=Q(-r,0),b=Q(0,-r*.8),c=Q(r*1.3,0),d=Q(0,r);
    poly([a,b,c,d],i%2?3:5);poly([a,b,c],6);line(...a,...c,7)
   }
   for(let i=0;i<5;i++){const q=.12+i*.17;if(!alive(q,350+i))continue;const v=frag(q,12+i%3*3,i);dot(v.x,v.y,7)}
  } else if(kind==="wind"){
   for(let i=0;i<8;i++){const q=.08+i*.112;if(!alive(q,400+i))continue;const v=frag(q,8+i%3*4,i);line(v.x-v.tx*3,v.y-v.ty*3,v.x+v.tx*7,v.y+v.ty*7,i%3?5:7)}
  } else if(kind==="nature"){
   for(let i=0;i<9;i++){const q=.10+i*.101;if(!alive(q,500+i))continue;leaf(frag(q,i%2?10:-8,i),i)}
   for(let i=0;i<5;i++){const q=.1+i*.17;if(!alive(q,540+i))continue;const v=frag(q,14+i%3*4,i);dot(v.x,v.y,6)}
  } else {
   for(let i=0;i<12;i++){const q=.11+i*.069;if(!alive(q,600+i))continue;const v=frag(q,(i%4-1.5)*5,i);
    if(i%4===0)glint(v,2,7);else if(i%3===0)piece(v,3,2,3,6);else dot(v.x,v.y,i%2?5:6,i%3===0?2:1);
   }
  }
  // Independent accent motifs: restrained at contact, carried away during the breakup.
  // These are separate hand-authored geometric grammars, not recolors of a shared effect.
  if(f>=3&&f<=8) {
   if(kind==="fire"){
    // Three rose-like ember knots held by black thorn fragments.
    for(let j=0;j<3;j++){const q=[.16,.53,.88][j];if(!alive(q,801+j))continue;
     const v=frag(q,(-1+j)*7,j),x=v.x,y=v.y;
     dot(x-3,y-2,2,4);dot(x+1,y-4,4,3);dot(x,y,5,3);dot(x-1,y,6);
     line(x-5,y+3,x-8,y+5,2);line(x+3,y+3,x+6,y+5,3);
    }
   } else if(kind==="solar"){
    // Separated thin fork flashes, not a full secondary rainbow ring.
    for(let j=0;j<4;j++){const q=.19+j*.20;if(!alive(q,830+j))continue;
     const v=frag(q,(j%2?-12:13),j),x=v.x,y=v.y;
     line(x-7*v.tx,y-7*v.ty,x+7*v.tx,y+7*v.ty,j%2?5:7);
     line(x-2*v.nx,y-2*v.ny,x+3*v.nx,y+3*v.ny,7);
    }
   } else if(kind==="ice"){
    // A few flat-cut polygonal diamonds float above the base sweep.
    for(let j=0;j<3;j++){const q=[.27,.58,.86][j];if(!alive(q,860+j))continue;
     const v=frag(q,j%2?16:-16,j),x=v.x,y=v.y,r=5+j*1.4;
     poly([[x-r,y],[x,y-r*.75],[x+r*1.2,y],[x,y+r*.8]],j%2?3:5);
     poly([[x-r,y],[x,y-r*.75],[x+r*1.2,y]],6);
     line(x-r,y,x+r*1.2,y,7);
    }
   } else if(kind==="wind"){
    // Crisp air cuts separated in the direction of the blow.
    for(let j=0;j<5;j++){const q=.18+j*.14;if(!alive(q,890+j))continue;
     const v=frag(q,13+j%3*3,j);line(v.x-v.tx*5,v.y-v.ty*5,v.x+v.tx*9,v.y+v.ty*9,j%2?5:7);
    }
   } else if(kind==="nature"){
    // Distinct leaf blades with bright veins.
    for(let j=0;j<4;j++){const q=.18+j*.21;if(!alive(q,920+j))continue;
     const v=frag(q,j%2?14:-13,j);leaf(v,j+4);
     dot(v.x+v.nx*3,v.y+v.ny*3,7);
    }
   } else {
    // Greenish spectral blade, tiny lilac flowers and warm light motes.
    for(let j=0;j<5;j++){const q=.15+j*.175;if(!alive(q,950+j))continue;
     const v=frag(q,(j%3-1)*12,j),x=v.x,y=v.y;
     dot(x-2,y-1,5,2);dot(x+1,y-1,5,2);dot(x,y-3,6,2);
     dot(x,y+1,6,2);dot(x,y,7);
    }
   }
  }
  // No static particles held around one circle after the blow.
  if(f>=6)for(let i=0;i<10;i++){const q=.09+i*.081;if(!alive(q,750+i))continue;
   const v=frag(q,(i%4-1.5)*5,i),shade=kind==="fire"?5:kind==="solar"?6:kind==="ice"?5:kind==="wind"?6:kind==="nature"?5:4;
   line(v.x-v.tx*2,v.y-v.ty*2,v.x+v.tx*(3+f-6),v.y+v.ty*(3+f-6),shade);
  }
  return buf;
 }
 const tab=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});
 function crc(a){let c=-1;for(const x of a)c=tab[(c^x)&255]^(c>>>8);return (c^-1)>>>0}
 const B=n=>new Uint8Array([n>>>24&255,n>>>16&255,n>>>8&255,n&255]);
 const A=s=>new Uint8Array([...s].map(x=>x.charCodeAt(0)));
 function join(...a){const b=new Uint8Array(a.reduce((n,x)=>n+x.length,0));let k=0;for(const x of a){b.set(x,k);k+=x.length}return b}
 const chunk=(s,d)=>join(B(d.length),A(s),d,B(crc(join(A(s),d))));
 function pack(raw){let a=1,b=0,parts=[new Uint8Array([0x78,0x01])];for(const x of raw){a=(a+x)%65521;b=(b+a)%65521}for(let p=0;p<raw.length;){const n=Math.min(65535,raw.length-p);parts.push(new Uint8Array([p+n>=raw.length?1:0,n&255,n>>>8,(~n)&255,((~n)>>>8)&255]),raw.subarray(p,p+n));p+=n}parts.push(B(((b<<16)|a)>>>0));return join(...parts)}
 function png(spec){
  const frames=Array.from({length:count},(_,f)=>frame(spec,f)),w=size*count,raw=new Uint8Array(size*(w+1));
  for(let y=0;y<size;y++)for(let f=0;f<count;f++)raw.set(frames[f].subarray(y*size,(y+1)*size),y*(w+1)+1+f*size);
  const pal=join(new Uint8Array([0,0,0]),...spec[3].map(s=>new Uint8Array([1,3,5].map(i=>parseInt(s.slice(i,i+2),16)))));
  const tr=new Uint8Array([0,...spec[3].map(()=>255)]);
  const bytes=join(new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",join(B(w),B(size),new Uint8Array([8,3,0,0,0]))),chunk("PLTE",pal),chunk("tRNS",tr),chunk("IDAT",pack(raw)),chunk("IEND",new Uint8Array()));
  return {bytes,counts:frames.map(f=>f.reduce((n,c)=>n+(c!==0),0))};
 }
 return styles.map(spec=>({...png(spec),id:spec[0],type:spec[1]}));
}
