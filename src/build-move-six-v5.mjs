// V5: original 180px-resolution finely painted battle VFX, NO 2x pixel scaling.
// Each attack has its own artist-directed geometry and physically different
// breakup. Materials are 1-pixel fine clusters in indexed 16-colour palettes.
// The rasterisation is offline PNG artwork, NOT CSS, Canvas 2D or Phaser.Graphics.
export const MOVE_IDS=['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash'];
export const MOVE_NAMES=['Flame Burst','Frost Breath','Air Slash','Razor Shell','Shadow Punch','Meteor Mash'];
export const MOVE_TYPES=['FIRE','ICE','FLYING','WATER','GHOST','STEEL'];
export const S=180,F=18,LAYERS=3,CONTACT_FRAME=10;
export const FRAME_MS=[60,52,44,40,37,33,32,32,35,40,89,55,56,59,64,72,81,93];
export const LAYER_NAMES=['form','highlights','debris'];
const PALETTES=[
 ['#431a1b','#6a2221','#8c2b21','#b03620','#d7441e','#e85b20','#f57622','#fa8e2e','#ffae40','#ffcb5f','#ffdd83','#ffe5aa','#fff3d2','#ffebbd','#b72b1d','#fffaee'],
 ['#163b59','#215372','#297296','#368fae','#47a8c4','#66bbd3','#84ccdf','#a6ddec','#c9eaf2','#dcf5f7','#f0fbff','#ffffff','#7dbcd6','#b7f3ff','#2e789a','#e8feff'],
 ['#24465b','#325a70','#427d93','#61a0b6','#81bace','#9bcfdf','#b8e1ec','#d6f0f4','#f1fbfd','#ffffff','#6fabc0','#e8ffff','#5f91aa','#a4d7e5','#355f7f','#ffffff'],
 ['#11334a','#144b6d','#1a688d','#2186ac','#30a4c7','#48bed8','#6cd3e6','#93e5f0','#b6eff6','#d9faff','#f5ffff','#ffffff','#1688a6','#78e5f3','#236088','#a6fbff'],
 ['#17132b','#292041','#3b2a56','#543770','#70498f','#8b60ae','#ad84cb','#c2a1dc','#dcc3eb','#f0e1f7','#fbf3ff','#ffffff','#492b64','#966bc1','#201737','#f9eeff'],
 ['#1c2939','#2e4155','#425d72','#5c768a','#7693a7','#96b0c2','#b5cedb','#d3e1e9','#e6f1f7','#f5faff','#ffffff','#ffe9ae','#d9a950','#ffe7cb','#7f9eb7','#ffffff']
];
export function createMoveSheetsV5(){
 const seed=(n,k=0)=>{const v=Math.sin((n+23.73)*173.23+k*27.71)*43758.5453;return v-Math.floor(v)};
 const lerp=(a,b,t)=>a+(b-a)*t,clamp=(a,b,c)=>Math.max(b,Math.min(c,a));
 const ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
 function paint(kind,f,layer){
  const arr=new Uint8Array(S*S);
  const P=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<S&&y>=0&&y<S&&c>0)arr[y*S+x]=c};
  const dot=(x,y,c,r=0)=>{
   if(r<=0){P(x,y,c);return}
   const k=Math.ceil(r);
   for(let j=-k;j<=k;j++)for(let i=-k;i<=k;i++)if(i*i+j*j<=r*r+.01)P(x+i,y+j,c);
  };
  function line(x,y,ex,ey,c,w=1){
   let steps=Math.max(1,Math.ceil(Math.hypot(ex-x,ey-y)*1.5));
   for(let j=0;j<=steps;j++){const t=j/steps;dot(x+(ex-x)*t,y+(ey-y)*t,c,Math.max(0,(w-1)/2))}
  }
  function rect(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)P(x+i,y+j,c)}
  function poly(points,c){
   let ymin=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1]))));
   let ymax=Math.min(S-1,Math.ceil(Math.max(...points.map(p=>p[1]))));
   for(let y=ymin;y<=ymax;y++){
    let intersections=[];
    for(let i=0;i<points.length;i++){
     const a=points[i],b=points[(i+1)%points.length];
     if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))
      intersections.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));
    }
    intersections.sort((a,b)=>a-b);
    for(let i=0;i+1<intersections.length;i+=2)
     for(let x=Math.ceil(intersections[i]);x<=Math.floor(intersections[i+1]);x++)P(x,y,c);
   }
  }
  const Q=(a,b,c,t)=>{let s=1-t;return [s*s*a[0]+2*s*t*b[0]+t*t*c[0],s*s*a[1]+2*s*t*b[1]+t*t*c[1]]};
  function sweep(a,b,c,thickness,col,{start=0,end=1,seedIndex=0}={}){
   let count=80;for(let n=0;n<=count;n++){
    let t=start+(end-start)*n/count,pt=Q(a,b,c,t);
    let wobble=.3*Math.sin(n*.43+seedIndex);
    const dx=2*(1-t)*(b[0]-a[0])+2*t*(c[0]-b[0]),dy=2*(1-t)*(b[1]-a[1])+2*t*(c[1]-b[1]);
    const d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d;
    let taper=Math.pow(Math.sin(Math.PI*t),.68);
    dot(pt[0]+nx*wobble,pt[1]+ny*wobble,col,Math.max(.4,thickness*taper/2));
   }
  }
  function ellipse(x,y,rx,ry,c){
   if(rx<=0||ry<=0)return;
   for(let yy=-Math.ceil(ry);yy<=Math.ceil(ry);yy++){
    if(Math.abs(yy)>ry)continue;
    let w=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry))));
    for(let xx=-w;xx<=w;xx++)P(x+xx,y+yy,c)
   }
  }
  function diamond(x,y,rx,ry,c){poly([[x,y-ry],[x+rx,y],[x,y+ry],[x-rx,y]],c)}
  function burst(x,y,r,c){
   line(x-r,y,x+r,y,c);line(x,y-r,x,y+r,c);
   if(r>=4){line(x-r*.52,y-r*.52,x+r*.52,y+r*.52,c);
    line(x+r*.52,y-r*.52,x-r*.52,y+r*.52,c)}
  }
  function scatter(cx,cy,count,age,mode=0){
   for(let j=0;j<count;j++){
    const theta=j*2.399+age*.08+mode*.25,dist=9+age*(4.1+seed(j,2)*2.5)+seed(j,5)*21;
    const x=cx+Math.cos(theta)*dist,y=cy+Math.sin(theta)*dist*(mode===1?.83:.65);
    if(mode===1&&j%4===0)diamond(x,y,2+seed(j,4)*3,3+seed(j,5)*4,5+j%5);
    else if(mode===2&&j%4===0)line(x-4,y+1,x+3,y-1,5+j%5);
    else if(mode===3&&j%3===0)ellipse(x,y,1.5,3.3,5+j%5);
    else if(mode===4&&j%3===0){dot(x,y,5+j%4,1);P(x-2,y,3+j%4)}
    else if(mode===5&&j%4===0)burst(x,y,3+(j%3),10+j%4);
    else dot(x,y,2+j%10,j%5===0?1:0);
   }
  }
  if(f===0||f===17)return arr;
  const launch=ease((f-2)/8),travel=f<=9,age=f-10;
  if(kind===0){ // FLAME BURST: animated asymmetric flame body + separate fire tongues.
   let x=43+102*launch,y=98+Math.sin(f*1.13)*4,r=(f<3?6:15);
   if(travel){
    if(layer===0){
     // Jagged, backward-stretched silhouette, no symmetrical orb.
     poly([[x-31,y-7],[x-42,y-16],[x-34,y+3],[x-53,y+8],
      [x-24,y+10],[x-36,y+22],[x-7,y+14],[x+5,y+14],
      [x+19,y+6],[x+22,y-6],[x+11,y-15],[x-4,y-12],[x-21,y-20]],2);
     poly([[x-26,y-4],[x-35,y-13],[x-21,y-10],[x-32,y+8],
      [x-9,y+9],[x+8,y+9],[x+15,y+1],[x+11,y-9],[x-8,y-9]],5);
     // Flames are physically separate flickering tongues.
     for(let k=0;k<5;k++){
      const phase=f*1.37+k*2.2,ex=x-27-k*4+Math.sin(phase)*8,
       ey=y-16+(k-2)*9+Math.cos(phase)*8,rr=4+(k%3)*2;
      poly([[x-4-k*4,y+(k-2)*3],[ex-rr,ey-rr*.5],
       [ex-12,ey-rr*1.4],[ex+rr,ey+rr],[x+8-k*4,y+(k-2)*3+3]],2+k%4);
     }
    }
    if(layer===1){
     ellipse(x+3,y,11,9,10);ellipse(x+9,y-1,6,5,13);
     sweep([x-25,y+6],[x-12,y+12],[x+8,y+9],3,8);
     sweep([x-18,y-10],[x-5,y-14],[x+12,y-6],2,11);
    }
    if(layer===2){
     for(let k=0;k<18;k++){
      const dx=k*4.1+f*.7,yy=y+(seed(k,5)*2-1)*(5+k*.63);
      P(x-23-dx,yy,3+k%8);
      if(k%5===0)dot(x-23-dx,yy-2,7,1);
     }
    }
   }else{
    const x=144,y=97;
    if(layer===0&&age<4){
     if(age===0)ellipse(x,y,23,20,6);
     for(let j=0;j<9;j++){
      const a=j*Math.PI*2/9+.08,ex=x+Math.cos(a)*(24+age*13+(j%3)*7),
       ey=y+Math.sin(a)*(18+age*12)-((j%3)===0?7:0),tip=8-age*1.5;
      poly([[x+Math.cos(a-.2)*11,y+Math.sin(a-.2)*11],
       [ex+Math.cos(a-.1)*tip,ey+Math.sin(a-.1)*tip],
       [ex+Math.cos(a)*15,ey+Math.sin(a)*13-((j%2)?8:0)],
       [ex+Math.cos(a+.15)*tip,ey+Math.sin(a+.15)*tip],
       [x+Math.cos(a+.2)*14,y+Math.sin(a+.2)*14]],3+(j+age)%6);
     }
    }
    if(layer===1&&age<=2){
     if(age===0){ellipse(x,y,15,12,11);ellipse(x,y,7,6,16)}
     for(let j=0;j<6;j++){
      const a=j*Math.PI/3+.2,ex=x+Math.cos(a)*(21+age*8),ey=y+Math.sin(a)*(21+age*8);
      sweep([x,y],[ex-6,ey-7],[ex,ey],3,10+j%4);
     }
    }
    if(layer===2)scatter(x,y,Math.max(0,34-age*6),age,0);
   }
  }else if(kind===1){ // FROST BREATH: streaming frost plumes, crystalline burst.
   const end=42+Math.min(10,f)*10;
   if(travel){
    if(layer===0)for(let j=0;j<6;j++){
     const ofs=(j-2.5)*7,w=2+j%3;
     sweep([30,98],[84,98+ofs*.3+Math.sin(f*.7+j)*7],
       [end,98+ofs*1.75+Math.sin(f*.9+j)*6],w,2+j%4,
       {start:j%2?.05:.0,end:1,seedIndex:j});
    }
    if(layer===1){
     for(let j=0;j<8;j++){
      const n=(j+1)/9,X=27+n*(end-27),Y=98+(j-3.5)*3+Math.sin(f+j)*5;
      sweep([X-9,Y],[X,Y+3],[X+12,Y-1],2,8+j%4);
      if(j%2===0)diamond(X+3,Y-4,2,4,11);
     }
    }
    if(layer===2){
     for(let j=0;j<24;j++){
      const xx=30+seed(j,1)*(end-30),sp=6+(xx-30)*.25;
      const yy=98+(seed(j,6)*2-1)*sp;
      if(j%4===0)diamond(xx,yy,2+j%3,3+j%3,6+j%5);
      else P(xx,yy,5+j%7);
     }
    }
   }else{
    const x=145,y=98;
    if(layer===0&&age<4){
     for(let j=0;j<9;j++){
      const a=j*Math.PI*2/9,rad=7+age*7+seed(j,4)*7,
       X=x+Math.cos(a)*rad,Y=y+Math.sin(a)*rad;
      poly([[X-5,Y+1],[X-2,Y-9-age*2],[X+3,Y-19-age*3],
       [X+8,Y-6],[X+4,Y+5]],2+j%5);
     }
    }
    if(layer===1&&age<=2){
     for(let j=0;j<7;j++){
      const a=j*2*Math.PI/7,X=x+Math.cos(a)*(10+age*4),Y=y+Math.sin(a)*(9+age*4);
      diamond(X,Y,4+seed(j)*4,9-age*2,11+j%5);
      line(X,Y-6,X,Y+2,16);
     }
    }
    if(layer===2)scatter(x,y,Math.max(0,28-age*4),age,1);
   }
  }else if(kind===2){ // AIR SLASH: 3 distinct highly tapered wind blades.
   if(travel){
    const progress=ease((f-2)/8);
    for(let j=0;j<3;j++){
     if(f<j+2||f>j+8)continue;
     const x=35+86*progress+(j-1)*9,dy=(j-1)*13;
     const a=[x-19,126+dy],b=[x+14,102+dy],c=[x+38,58+dy];
     if(layer===0){
      sweep(a,b,c,10-j,2+j%3,{start:.03,end:.93,seedIndex:j});
      sweep([a[0]+4,a[1]-5],[b[0]+6,b[1]-2],[c[0]+5,c[1]+2],5,5+j%3,{start:.07,end:.97});
     }
     if(layer===1){
      sweep([a[0]+6,a[1]-5],[b[0]+10,b[1]-3],[c[0]+7,c[1]+4],2.6,9,{start:.04,end:.93});
      sweep([a[0]+2,a[1]+3],[b[0]+2,b[1]+4],[c[0]+6,c[1]-3],1.5,11+j%2,{start:.24,end:.79});
     }
    }
    if(layer===2)for(let j=0;j<13;j++){
     const xx=34+86*progress+seed(j,5)*38-14,yy=65+seed(j,4)*70;
     if(j%3===0)line(xx-5,yy+2,xx+4,yy-3,4+j%4);
     else P(xx,yy,6+j%5);
    }
   }else{
    const x=146,y=92;
    if(layer===0&&age<3){
     for(let j=0;j<3;j++)
      sweep([x-28+j*7,y+27],[x+j*5,y],[x+9+j*4,y-30],6-age*2,4+j%3,
       {start:Math.min(.9,age*.24),end:.96});
    }
    if(layer===1&&age===0)burst(x,y,10,10);
    if(layer===2)scatter(x,y,Math.max(0,15-age*3),age,2);
   }
  }else if(kind===3){ // RAZOR SHELL: a fan shell with radiating RIBS and real blade of water.
   const t=ease((f-2)/8),x=51+t*89,y=131-t*46,ang=-t*.46;
   const T=(a,b)=>[x+a*Math.cos(ang)-b*Math.sin(ang),y+a*Math.sin(ang)+b*Math.cos(ang)];
   const PS=(ar)=>ar.map(z=>T(z[0],z[1]));
   if(travel){
    if(layer===0){
     // Seven distinct scalloped tips: shell, not a blue crescent orb.
     poly(PS([[-20,12],[-29,-1],[-28,-19],[-18,-27],[-5,-34],
      [7,-33],[18,-25],[25,-13],[29,1],[20,13],[6,19],[-10,19]]),2);
     poly(PS([[-15,9],[-22,-4],[-20,-17],[-11,-24],[0,-28],
      [12,-23],[20,-11],[22,2],[13,13],[-4,15]]),6);
     poly(PS([[-8,7],[-14,-7],[-8,-19],[3,-23],[12,-14],
      [16,-3],[7,9],[-4,10]]),9);
     const h=T(-17,13);
     for(let j=0;j<7;j++){
      const a=j*Math.PI/9+.15,
       tx=-14+Math.cos(a)*39,ty=12-Math.sin(a)*45;
      const goal=T(tx,ty);
      line(h[0],h[1],goal[0],goal[1],3+j%4,j%2?1.6:2.2);
     }
     const handle=T(-26,19);
     poly(PS([[-30,10],[-24,9],[-16,18],[-20,28],[-29,25]]),3);
     line(handle[0],handle[1],...T(-18,20),12,2);
    }
    if(layer===1){
     const a=T(-23,19),b=T(7,27),c=T(28,-29);
     sweep(a,b,c,8,6,{start:.09,end:.95});
     sweep(T(-19,17),T(9,20),T(27,-26),2,12,{start:.06,end:.95});
     const tip=T(20,-21);burst(tip[0],tip[1],4,14);
    }
    if(layer===2)for(let j=0;j<14;j++){
     const a=j*2.4+f*.3,r=21+seed(j,7)*19;
     ellipse(x+Math.cos(a)*r,y+Math.sin(a)*r,1+j%2,2+j%2,4+j%8);
    }
   }else{
    const x=143,y=86;
    if(layer===0&&age<3)
     sweep([x-45,y+30],[x+20,y+27],[x+46,y-43],12-age*3,2+age,{start:.04,end:.94});
    if(layer===1&&age<=2){
     sweep([x-40,y+26],[x+19,y+24],[x+44,y-41],4-age,12,{start:.17+age*.2,end:.95});
     if(age===0)burst(x,y,19,11);
    }
    if(layer===2)scatter(x,y,Math.max(0,32-age*5),age,3);
   }
  }else if(kind===4){ // SHADOW PUNCH: actual side-on four-knuckle ghost fist.
   let t=ease((f-2)/8),x=48+t*98,y=98+Math.sin(f)*2;
   if(travel){
    if(layer===0){
     // Wrist cuff joins fist; finger pads jut from right and four grooves separate them.
     poly([[x-43,y-15],[x-29,y-25],[x-12,y-26],[x+9,y-23],
       [x+24,y-19],[x+24,y+23],[x-6,y+29],[x-28,y+20],[x-43,y+11]],2);
     poly([[x-35,y-16],[x-12,y-21],[x+13,y-17],[x+18,y+17],
       [x-10,y+22],[x-31,y+13]],5);
     // Hand-painted purple knuckle gradation and palm folds.
     poly([[x-26,y-15],[x-8,y-19],[x+8,y-14],
       [x+13,y-5],[x-8,y+2],[x-26,y-1]],7);
     poly([[x-20,y+5],[x-4,y+8],[x+9,y+3],[x+3,y+16],[x-14,y+17]],6);
     line(x-24,y+10,x-13,y+13,9,1.3);line(x-16,y-10,x-1,y-10,9,2);
     for(let j=0;j<4;j++){
      const yy=y-22+j*12;
      poly([[x+9,yy],[x+28,yy-2],[x+40+(j%2)*3,yy+2],
       [x+42+(j%2)*3,yy+8],[x+22,yy+10],[x+12,yy+9]],3+j%3);
      line(x+20,yy+2,x+37,yy+2,8,1.5);
      line(x+20,yy+3,x+33,yy+3,10,1);
      line(x+18,yy+10,x+35,yy+10,1,1.2);
     }
     poly([[x-5,y+14],[x+12,y+20],[x+21,y+34],[x+11,y+40],[x-9,y+28]],4);
    }
    if(layer===1){
     sweep([x-42,y-9],[x-61,y-30],[x-81,y-25],6,4,{start:.02,end:1});
     sweep([x-39,y+13],[x-61,y+22],[x-82,y+14],4,7);
     for(let j=0;j<4;j++){
      const yy=y-19+j*12;line(x+19,yy+2,x+35,yy+3,10,2);
     }
     burst(x+16,y-8,3,12);
    }
    if(layer===2){
     for(let j=0;j<14;j++){
      const px=x-48-j*4+seed(j,1)*6,py=y+(seed(j,2)*2-1)*(15+j*.8);
      dot(px,py,2+j%8,j%5===0?2:1)
     }
    }
   }else{
    const x=146,y=98;
    if(layer===0&&age<3){
     for(let j=0;j<7;j++){
      const a=j*2*Math.PI/7,r=14+age*11,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;
      sweep([x,y],[xx+9,yy-9],[xx,yy],4,3+j%5);
     }
    }
    if(layer===1&&age===0){burst(x,y,25,11);ellipse(x,y,7,8,9)}
    if(layer===2)scatter(x,y,Math.max(0,27-age*5),age,4);
   }
  }else{ // METEOR MASH: chamfered chrome gauntlet with reinforced knuckles, metallic momentum.
   let t=ease((f-2)/8),x=49+t*96,y=132-t*52;
   if(travel){
    if(layer===0){
     poly([[x-42,y-19],[x-30,y-34],[x-9,y-37],[x+12,y-28],
       [x+26,y-17],[x+29,y+19],[x+6,y+31],[x-19,y+27],[x-41,y+11]],2);
     poly([[x-32,y-22],[x-8,y-29],[x+9,y-25],[x+20,y-12],
       [x+22,y+11],[x+5,y+23],[x-22,y+17]],5);
     poly([[x-13,y-23],[x+5,y-22],[x+20,y-10],
       [x+12,y+1],[x-4,y-3]],8);
     poly([[x-25,y-16],[x-12,y-22],[x-2,y-20],[x-13,y-9]],7);
     poly([[x-9,y+9],[x+13,y+12],[x+4,y+20],[x-15,y+18]],6);
     line(x-20,y+15,x+2,y+19,3,1.4);
     for(let j=0;j<4;j++){
      const yy=y-25+j*14;
      poly([[x+15,yy-2],[x+32,yy-6],[x+44,yy-1],[x+47,yy+9],
       [x+37,yy+12],[x+18,yy+10]],3+j%3);
      line(x+24,yy-1,x+42,yy-1,10,2);
      line(x+26,yy+2,x+43,yy+2,8,1.8);
      line(x+26,yy+10,x+41,yy+10,1,1.5);
     }
     poly([[x-8,y+13],[x+11,y+16],[x+18,y+32],
       [x+4,y+42],[x-13,y+30]],4);
    }
    if(layer===1){
     for(let j=0;j<5;j++){
      const ex=x-53-j*10,ey=y+25+j*7;
      if(j%2===0)burst(ex,ey,3+j%3,12+j%4);
      else dot(ex,ey,10+j%3,1);
     }
     sweep([x-37,y+15],[x-67,y+34],[x-96,y+46],4,4);
     line(x-20,y-27,x+7,y-25,9,2);
    }
    if(layer===2)for(let j=0;j<17;j++){
     const px=x-40-j*6,py=y+26+j*3+Math.sin(j*2.1)*6;
     if(j%4===0)burst(px,py,3,12);
     else P(px,py,4+j%8);
    }
   }else{
    const x=146,y=88;
    if(layer===0&&age<3){
     for(let j=0;j<9;j++){
      const a=j*2*Math.PI/9,r=13+age*13;
      const X=x+Math.cos(a)*r,Y=y+Math.sin(a)*r;
      sweep([x,y],[X+Math.cos(a)*6,Y+Math.sin(a)*8],[X,Y],7-age*2,4+j%4);
     }
    }
    if(layer===1&&age<=2){
     burst(x,y,30-age*8,age===0?16:11);
     if(age===0)diamond(x,y,13,13,10);
    }
    if(layer===2)scatter(x,y,Math.max(0,26-age*4),age,5);
   }
  }
  return arr;
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
  const cels=Array.from({length:F},(_,f)=>Array.from({length:LAYERS},(_,layer)=>paint(k,f,layer)));
  const width=S*F,height=S*LAYERS,raw=new Uint8Array(height*(width+1));
  for(let y=0;y<height;y++){
   const layer=Math.floor(y/S),yy=y%S,start=y*(width+1)+1;
   for(let f=0;f<F;f++)raw.set(cels[f][layer].subarray(yy*S,(yy+1)*S),start+f*S);
  }
  const palette=concat(new Uint8Array([0,0,0]),...PALETTES[k].map(hex=>new Uint8Array([1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)))));
  const transparency=new Uint8Array([0,...PALETTES[k].map(()=>255)]);
  const bytes=concat(new Uint8Array([137,80,78,71,13,10,26,10]),
   chunk('IHDR',concat(be(width),be(height),new Uint8Array([8,3,0,0,0]))),
   chunk('PLTE',palette),chunk('tRNS',transparency),chunk('IDAT',stored(raw)),chunk('IEND',new Uint8Array()));
  return {id,name:MOVE_NAMES[k],type:MOVE_TYPES[k],width,height,bytes,
   counts:cels.map(frames=>frames.map(px=>px.reduce((acc,n)=>acc+(n!==0),0)))};
 }
 return MOVE_IDS.map(png);
}
