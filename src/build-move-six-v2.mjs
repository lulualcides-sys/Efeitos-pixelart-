// Six new ORIGINAL Pokemon move animations V2 – hand-composed independent silhouettes.
// The approved Slash V5.4 and the rejected six-v1 are never overwritten.
// 144px indexed sheets, 16 variable-duration frames × 5 separately animated layers.
// No source sprites or trace data imported from commercial or third-party pixel art.
export const MOVE_IDS=Object.freeze(['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash']);
export const MOVE_NAMES=Object.freeze(['Flame Burst','Frost Breath','Air Slash','Razor Shell','Shadow Punch','Meteor Mash']);
export const MOVE_TYPES=Object.freeze(['FIRE','ICE','FLYING','WATER','GHOST','STEEL']);
export const S=144,F=16,LAYERS=5,CONTACT_FRAME=9;
export const FRAME_MS=Object.freeze([62,47,43,40,37,36,36,40,43,105,54,57,59,66,74,75]);
export const LAYER_NAMES=Object.freeze(['atmosphere','silhouette','highlight','fragments','contact']);
const PALETTES=[
 ['#552633','#852932','#b83d2c','#dc6029','#f48935','#ffc34e','#ffdf8d','#fff7d5'],
 ['#204d78','#296d9b','#3a9fcb','#68c8de','#a3e6f0','#d3f8ff','#ffffff','#a1f4fb'],
 ['#294c6b','#477f9d','#6fb5c9','#a6d3e1','#d2f0f7','#ffffff','#74cfdf','#afebf4'],
 ['#163f6e','#1b6a97','#249cbd','#4fc6df','#8ee5f3','#c7f9ff','#ffffff','#4cbfd6'],
 ['#221d35','#37224f','#583471','#7e53a0','#ae7acf','#d3b2e8','#f1d9fc','#fdf4fd'],
 ['#23384e','#445d72','#718ba0','#a9c2d2','#d6e7ef','#ffffff','#eac879','#fff4c9']
];
export function createMoveSheetsV2(){
 const sq=x=>x*x,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const ease=t=>1-sq(1-clamp(t)),seed=(a,b=0)=>{let q=Math.sin((a+23.17)*97.71+b*23.29)*43483.531;return q-Math.floor(q)};
 function paint(id,f,l){
  const img=new Uint8Array(S*S);
  function p(x,y,c){let a=Math.round(x),b=Math.round(y);if(c>0&&a>=0&&a<S&&b>=0&&b<S)img[b*S+a]=c;}
  const rect=(x,y,w,h,c)=>{for(let iy=0;iy<h;iy++)for(let ix=0;ix<w;ix++)p(x+ix,y+iy,c)};
  const line=(x,y,ex,ey,c,w=1)=>{let n=Math.max(1,Math.ceil(Math.hypot(ex-x,ey-y)*1.6));
   for(let i=0;i<=n;i++){const a=i/n;for(let d=0;d<w;d++)for(let e=0;e<w;e++)p(x+(ex-x)*a+d,y+(ey-y)*a+e,c)}};
  function poly(pts,c){if(pts.length<3)return;let lo=Math.max(0,Math.floor(Math.min(...pts.map(q=>q[1])))),
    hi=Math.min(S-1,Math.ceil(Math.max(...pts.map(q=>q[1]))));
   for(let y=lo;y<=hi;y++){let hits=[];
    for(let i=0;i<pts.length;i++){let a=pts[i],b=pts[(i+1)%pts.length];
     if(a[1]<=y&&b[1]>y||b[1]<=y&&a[1]>y)hits.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
    hits.sort((a,b)=>a-b);for(let i=0;i<hits.length;i+=2){
     if(i+1>=hits.length)break;
     for(let x=Math.ceil(hits[i]);x<=Math.floor(hits[i+1]);x++)p(x,y,c)
    }
   }
  }
  const oval=(x,y,rx,ry,c)=>{if(rx<=0||ry<=0)return;
   for(let py=-Math.ceil(ry);py<=Math.ceil(ry);py++){
    if(Math.abs(py)>ry)continue;let half=Math.floor(rx*Math.sqrt(1-sq(py/ry)));
    for(let px=-half;px<=half;px++)p(x+px,y+py,c)
   }
  };
  const B=(a,b,c,t)=>{let u=1-t;return u*u*a+2*u*t*b+t*t*c};
  function arc(a,b,c,color,{from=0,to=1,width=1}={}){
   let prev=null;for(let j=0;j<=65;j++){let t=from+(to-from)*j/65;
    let q=[B(a[0],b[0],c[0],t),B(a[1],b[1],c[1],t)];
    if(prev)line(prev[0],prev[1],q[0],q[1],color,width);prev=q}
  }
  function ribbon(a,b,c,thick,col){
   let A=[],C=[];
   for(let i=0;i<=28;i++){let t=i/28,u=1-t,dx=2*u*(b[0]-a[0])+2*t*(c[0]-b[0]),
    dy=2*u*(b[1]-a[1])+2*t*(c[1]-b[1]),len=Math.hypot(dx,dy)||1,
    n=Math.sin(Math.PI*t)*thick*(.84+.16*Math.cos(t*9));
    let x=B(a[0],b[0],c[0],t),y=B(a[1],b[1],c[1],t);
    A.push([x-dy/len*n,y+dx/len*n]);C.push([x+dy/len*n,y-dx/len*n])
   }
   poly([...A,...C.reverse()],col)
  }
  function star(x,y,r,c,w=1){
   line(x-r,y,x+r,y,c,w);line(x,y-r,x,y+r,c,w);
   line(x-r*.48,y-r*.48,x+r*.48,y+r*.48,c);line(x+r*.48,y-r*.48,x-r*.48,y+r*.48,c)
  }
  const diamond=(x,y,r,c)=>poly([[x,y-r],[x+r*.72,y],[x,y+r],[x-r*.72,y]],c);
  function scatter(cx,cy,age,count,kind){
   for(let i=0;i<count;i++){
    let a=i*2.399+kind*.13,rr=9+age*(3.7+seed(i,3)*2.4)+seed(i,9)*18;
    let x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.83;
    if(kind===1)diamond(x,y,Math.max(1,3-age*.31),3+i%4);
    else if(kind===3)oval(x,y,1+i%3,Math.max(1,3-age*.3),3+i%4);
    else if(kind===4){p(x,y,2+i%5);if(i%4===0)line(x-3,y-2,x,y+3,3+i%4)}
    else if(kind===5){if(i%5===0)star(x,y,Math.max(1,3-age*.4),6+i%2);else p(x,y,2+i%5)}
    else p(x,y,2+i%5)
   }
  }
  // Transparent first/last frame, spacious composition with contact near right edge.
  if(f===0||f===15)return img;
  const hit=f===9,age=f-9;
  if(id===0){ // Flame Burst: forked flame sphere, explosive radial tongues, embers.
   let t=ease((f-1)/8),x=22+91*t,y=76+Math.sin(f*1.05)*3;
   let wiggle=Math.sin(f*1.75)*5,tip=Math.cos(f*1.33)*5;
   if(f<=8){
    if(l===0){for(let i=0;i<3;i++){
     const bx=x-18-i*9,by=y+(i-1)*8+Math.sin(f+i)*2;
     poly([[bx+6,by-4],[bx-8,by-6],[bx-19,by-2],[bx-11,by+2],[bx-4,by+5],[bx+7,by+2]],1+i%2);
    }}
    if(l===1){
     poly([[x+21,y],[x+12,y-12],[x+6,y-9],[x+2,y-19-tip*.5],[x-5,y-10],[x-11,y-14+wiggle*.5],
      [x-20-wiggle,y-5],[x-12,y+5],[x-21+tip,y+14],[x-6,y+9],[x+2,y+16+wiggle*.3],[x+15,y+11]],2);
     poly([[x+19,y],[x+10,y-10],[x+7,y-5],[x-1,y-13],[x-7,y-3],
      [x-11,y+5],[x-3,y+11],[x+13,y+9]],4);
    }
    if(l===2){oval(x+5,y+1,11,8,6);oval(x+9,y+1,5,5,7);
     line(x+12,y-5,x+15,y-9,8);p(x-1,y-7,6)}
    if(l===3)for(let j=0;j<10;j++){
     let dx=(j*8+f*3)%54,dy=Math.sin(f*.6+j*1.9)*15;
     if(j%3===0)oval(x-dx-11,y+dy,2,3,4+j%4);else p(x-dx-11,y+dy,4+j%4);
    }
   }else{
    if(l===0&&age<4){let R=23+age*5;arc([112-R,76],[112,76-14-age*2],[112+R,76],1,{width:1});arc([112-R,76],[112,76+14+age*2],[112+R,76],1)}
    if(l===1&&age<3){
     if(age===0)oval(111,76,21,17,5);
     for(let j=0;j<9-age*2;j++){let a=j*2*Math.PI/9+.22,len=23+age*5+j%3*4;
      const X=111+Math.cos(a)*len,Y=76+Math.sin(a)*len;
      poly([[111+Math.cos(a-.22)*10,76+Math.sin(a-.22)*10],
       [X+Math.cos(a+.12)*9,Y+Math.sin(a+.12)*9],[111+Math.cos(a+.24)*12,76+Math.sin(a+.24)*12]],2+j%4)
     }
    }
    if(l===2&&age<=2){star(111,76,Math.max(5,19-age*5),age===0?8:6,age===0?2:1);
     if(age===0)oval(111,76,7,7,8)}
    if(l===3)scatter(111,76,Math.max(0,age),Math.max(0,24-age*3),0);
    if(l===4&&age===0)star(111,76,29,8,3);
   }
  }else if(id===1){ // Frost Breath: shaped conical pressure stream plus crystal snowburst.
   let end=27+Math.min(1,(f-1)/8)*88;
   if(f<=9){
    if(l===0){
     poly([[22,78],[end,76-(end-22)*.32],[end,76+(end-22)*.32]],1);
    }
    if(l===1){
     for(let j=0;j<5;j++){
      let off=(j-2)*8.6;let X=Math.min(112,end+5*Math.sin(f+j));
      ribbon([26,77+off*.12],[60,77+off*.54+Math.sin(f+j)*3],[X,77+off*2.1],1.7+j%2,2+j%3)
     }
    }
    if(l===2){
     ribbon([28,77],[73,77+Math.sin(f)*2],[end,77],3.5,5);
     for(let j=0;j<4;j++){let xx=38+j*18+Math.min(f*2,18),yy=77+Math.sin(f*.85+j)*8;
      arc([xx-5,yy],[xx,yy-3],[xx+8,yy],7,{width:1})}
    }
    if(l===3)for(let j=0;j<15;j++){
     let x=24+seed(j,4)*Math.max(10,end-26),spread=(x-24)*.32,
      y=77+(seed(j,5)*2-1)*(4+spread);
     if(j%3===0)diamond(x,y,2+j%2,5+j%3);else p(x,y,3+j%5)
    }
   }else{
    if(l===0&&age<3){arc([88-age*3,76],[111,49-age*2],[133+age*2,76],1);arc([88-age*3,76],[111,103+age*2],[133+age*2,76],1)}
    if(l===1&&age<3)for(let j=0;j<Math.max(2,8-age*2);j++){
     let a=j*Math.PI/4,r=9+age*4,R=32-age*3;
     let cx=111+Math.cos(a)*r,cy=76+Math.sin(a)*r;
     poly([[cx,cy],[cx+Math.cos(a-.19)*R,cy+Math.sin(a-.19)*R],
      [cx+Math.cos(a+.19)*R,cy+Math.sin(a+.19)*R]],2+j%3)
    }
    if(l===2&&age<=2){for(let j=0;j<4;j++){
     let xx=111+(j-1.5)*13,yy=76+(j%2?10:-8);
     diamond(xx,yy,10-age*2,7);
     line(xx,yy-8+age,xx,yy+6-age,8)
    }}
    if(l===3)scatter(111,76,age,Math.max(0,25-age*4),1);
    if(l===4&&age===0){star(111,76,20,8,2);diamond(111,76,9,8)}
   }
  }else if(id===2){ // Air Slash: alternating staggered tapered ribbons and edge-line vortices.
   if(f<=10){
    let travel=ease((f-1)/9)*78;
    for(let j=0;j<3;j++){
     if(f<1+j||f>6+j*2)continue;
     const dx=travel-(2-j)*11,dy=(j-1)*12;
     let a=[34+dx,108+dy],b=[60+dx,83+dy],c=[83+dx,42+dy];
     if(l===0)ribbon([a[0]-7,a[1]+8],[b[0]-8,b[1]+9],[c[0]-9,c[1]+8],3,1+j%2);
     if(l===1)ribbon(a,b,c,5-j*.55,2+j%3);
     if(l===2){arc([a[0]+3,a[1]-2],[b[0]+3,b[1]-2],[c[0]+3,c[1]-2],6,{from:.08,to:.97});
      line(a[0]+3,a[1]+2,a[0]+9,a[1]-2,5)}
     if(l===3){for(let i=0;i<3;i++){
      let x=a[0]-13-i*7,y=a[1]-(i%2)*8;
      line(x-6,y+2,x+4,y-3,3+i%2)
     }}
    }
    if(l===4&&f===9)star(113,72,15,6,1);
   }else{
    if(l===1&&age<4)for(let i=0;i<3;i++)
     arc([108-i*4,98+i*2],[121+i*2,75],[118+i*2,48-i*5],2+i%3,{from:Math.min(.8,age*.21),to:.95,width:1});
    if(l===3)for(let i=0;i<Math.max(0,15-age*3);i++){
     let x=96+age*5+seed(i)*26,y=45+seed(i,2)*66;
     line(x-5,y+2,x+3,y-2,2+i%5)
    }
   }
  }else if(id===3){ // Razor Shell: scalloped polished shell moves on an arc, water fans out.
   let t=ease((f-1)/8),x=29+79*t,y=111-41*t;
   let a=-.6*t,co=Math.cos(a),si=Math.sin(a);
   const P=(u,v)=>[x+u*co-v*si,y+u*si+v*co];
   if(f<=9){
    if(l===0)for(let i=0;i<3;i++){
     let xx=x-12-i*9,yy=y+8+i*4;arc([xx-8,yy],[xx+5,yy+6],[xx+16,yy+1],1+i%2)
    }
    if(l===1){
     poly([P(-18,8),P(-16,-6),P(-8,-16),P(8,-22),P(19,-12),P(20,5),P(3,16),P(-10,15)],2);
     poly([P(-13,7),P(-11,-7),P(-3,-15),P(11,-16),P(15,-6),P(12,9),P(0,13)],4);
     // Serrations are shell scallops, not a generic luminous slash.
     for(let j=0;j<4;j++){
      let y0=-12+j*7;line(...P(-6,y0),...P(14-j*2,y0-3),3+j%2)
     }
     ribbon(P(-24,11),P(8,29),P(26,-24),2.5,3);
    }
    if(l===2){arc(P(-18,4),P(8,20),P(25,-24),7,{width:2});
     arc(P(-14,-5),P(0,-17),P(18,-11),6,{width:1});p(...P(17,-11),8)
    }
    if(l===3)for(let j=0;j<8;j++){
     let ang=j*2.41+f*.37,rad=23+seed(j)*12;
     oval(x+Math.cos(ang)*rad,y+Math.sin(ang)*rad*.7,2+j%3,3,3+j%4)
    }
   }else{
    if(l===0&&age<4)ribbon([87,91],[119,102+age*3],[132,55],4,1);
    if(l===1&&age<3)ribbon([90,105],[127,101],[132,39],Math.max(1,8-age*3),2+age);
    if(l===2&&age<3)arc([91,104],[129,99],[131,41],7,{from:.1+age*.2,to:.95,width:2});
    if(l===3)scatter(112,70,age,Math.max(0,25-age*4),3);
    if(l===4&&age===0)star(112,70,21,7,2)
   }
  }else if(id===4){ // Shadow Punch: manifest an actual anatomically readable fist from wisp portal.
   let t=ease((f-1)/8),x=25+t*87,y=75+Math.sin(f*.6)*4;
   if(f<=9){
    if(l===0){oval(21,75,18,26,1);oval(21,75,12,18,2);
     for(let j=0;j<3;j++)arc([x-26-j*9,y+13],[x-32-j*7,y-9],[x-44-j*7,y-17],2+j%2)}
    if(l===1){
     poly([[x-22,y-15],[x-8,y-22],[x+9,y-21],[x+21,y-14],[x+22,y+2],
      [x+11,y+15],[x-6,y+18],[x-20,y+11]],2);
     poly([[x-14,y-13],[x-4,y-18],[x+9,y-16],[x+16,y-10],[x+16,y+6],
      [x+4,y+12],[x-14,y+7]],3);
     for(let j=0;j<4;j++){
      let xx=x+13+j%2*2,yy=y-14+j*7;
      poly([[xx-4,yy-1],[xx+8,yy-2],[xx+12,yy+1],[xx+8,yy+5],[xx-2,yy+4]],4+j%2)
     }
     poly([[x-6,y+7],[x+10,y+8],[x+7,y+15],[x-2,y+15]],3);
    }
    if(l===2){line(x-12,y-9,x+1,y-10,6);for(let j=0;j<4;j++)
     line(x+12,y-11+j*7,x+21,y-12+j*7,6+j%2);
     p(x+11,y-14,8)}
    if(l===3)for(let j=0;j<12;j++){
     let dx=20+j*5,yy=y+(seed(j,f)*2-1)*(6+j*.7);
     if(j%3===0)oval(x-dx,yy,3,2,2+j%4);else p(x-dx,yy,3+j%4)
    }
    if(l===4&&hit){star(110,76,24,8,2);oval(110,76,7,7,7)}
   }else{
    if(l===0&&age<3){arc([88,76],[112,49+age*2],[135,76],1);arc([88,76],[112,103-age*2],[135,76],1)}
    if(l===1&&age<3)for(let j=0;j<5;j++){
     let a=j*2*Math.PI/5,rr=14+age*8;arc([111,76],
      [111+Math.cos(a+.3)*(rr+11),76+Math.sin(a+.3)*(rr+11)],
      [111+Math.cos(a)*rr,76+Math.sin(a)*rr],3+j%3,{width:2});
    }
    if(l===3)scatter(111,76,age,Math.max(0,23-age*4),4);
   }
  }else{ // Meteor Mash: metallic gauntlet, star tail and forceful radiating impact.
   let t=ease((f-1)/8),x=23+90*t,y=115-42*t;
   if(f<=9){
    if(l===0){for(let j=0;j<3;j++){
     let v=j*12;line(x-20-v,y+4+v*.5,x-40-v,y+18+v*.5,1+j%2,2)}}
    if(l===1){
     // Steel knuckle silhouette with a wrist and four distinctly stepped plates.
     poly([[x-25,y-11],[x-18,y-17],[x-8,y-20],[x+5,y-18],[x+15,y-14],
      [x+23,y-9],[x+26,y-3],[x+26,y+9],[x+12,y+18],
      [x-7,y+18],[x-20,y+11],[x-28,y+6]],2);
     poly([[x-19,y-12],[x-7,y-16],[x+7,y-14],[x+17,y-6],[x+19,y+6],[x+9,y+13],[x-13,y+8]],4);
     // Contrasting finger plate boundaries: the fist no longer reads as a rock.
     for(let j=0;j<4;j++){
      let yy=y-12+j*7;
      poly([[x+12,yy-2],[x+25-(j%2)*2,yy-2],[x+29-(j%2)*2,yy+1],
        [x+25-(j%2)*2,yy+5],[x+12,yy+4]],2+j%2);
      line(x+15,yy-1,x+26-(j%2)*2,yy-1,5+j%2);
      line(x+16,yy+4,x+25-(j%2)*2,yy+4,1);
     }
     for(let j=0;j<3;j++){
      poly([[x-12+j*8,y-17],[x-8+j*8,y-22],[x-1+j*8,y-18],[x-2+j*8,y-14]],5)
     }
     poly([[x-12,y+7],[x+6,y+11],[x+3,y+18],[x-9,y+14]],3);
    }
    if(l===2){line(x-16,y-10,x+2,y-15,6,2);line(x+3,y-15,x+15,y-9,6);
     line(x+14,y+2,x+8,y+12,7);star(x-29,y-16,7,7,1)}
    if(l===3)for(let j=0;j<10;j++){
     let xx=x-25-j*6,yy=y+12+j*3.4;
     if(j%3===0)star(xx,yy,3,6+j%2);else p(xx,yy,3+j%4)}
    if(l===4&&hit){star(110,75,35,8,3);diamond(110,75,15,6)}
   }else{
    if(l===0&&age<3){arc([85-age*4,75],[110,52-age*2],[135+age*4,75],1);arc([85-age*4,75],[110,98+age*2],[135+age*4,75],1)}
    if(l===1&&age<3){for(let j=0;j<8;j++){
     let a=j*2*Math.PI/8,rr=13+age*11;
     line(110+Math.cos(a)*11,75+Math.sin(a)*11,
      110+Math.cos(a)*rr,75+Math.sin(a)*rr,3+j%3,2)}}
    if(l===2&&age<=2)star(110,75,Math.max(3,26-age*9),7-age,age===0?2:1);
    if(l===3)scatter(110,75,age,Math.max(0,20-age*4),5);
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


 function png(id,index){
  const frames=Array.from({length:F},(_,f)=>Array.from({length:LAYERS},(_,l)=>paint(index,f,l)));
  const w=S*F,h=S*LAYERS,raw=new Uint8Array(h*(w+1));
  for(let y=0;y<h;y++){let layer=Math.floor(y/S),v=y%S;
   for(let f=0;f<F;f++)raw.set(frames[f][layer].subarray(v*S,(v+1)*S),y*(w+1)+1+f*S)}
  const pal=concat(new Uint8Array([0,0,0]),...PALETTES[index].map(hex=>new Uint8Array([1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)))));
  const trns=new Uint8Array([0,...PALETTES[index].map(()=>255)]);
  const bytes=concat(new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',concat(be(w),be(h),new Uint8Array([8,3,0,0,0]))),
   chunk('PLTE',pal),chunk('tRNS',trns),chunk('IDAT',stored(raw)),chunk('IEND',new Uint8Array()));
  return {id,name:MOVE_NAMES[index],type:MOVE_TYPES[index],width:w,height:h,bytes,
   counts:frames.map(frame=>frame.map(a=>a.reduce((n,b)=>n+(b!==0),0)))};
 }
 return MOVE_IDS.map(png);
}
