// Fourteen ORIGINAL elemental impact studies. The four earlier prototypes stay unchanged.
// 96x96 pixels, 16 frames; generated on demand with the existing tested PNG/GIF encoders.
// Visual-only studies. No Pokemon game mechanics, sprites, ROM data or third-party asset imports.
import {toPNG,toGIF,IMPACT_DELAYS_CS} from './hns-impact-studies.mjs';

export const NEW_TYPE_IMPACTS = Object.freeze([
 {type:'normal',id:'normal-hit',label:'Normal · onda cinética',palette:['#000000','#545268','#9e8d92','#d2c6b7','#fff0db','#ffffff']},
 {type:'grass',id:'grass-hit',label:'Planta · chicote de folhas',palette:['#000000','#154e31','#28864d','#78ce68','#cffca1','#ffffff']},
 {type:'fighting',id:'fighting-hit',label:'Lutador · golpe de punho',palette:['#000000','#603041','#ba493c','#f78c5b','#ffdfa6','#ffffff']},
 {type:'poison',id:'poison-hit',label:'Veneno · estouro tóxico',palette:['#000000','#3d2659','#8543b0','#c16ee5','#e3b0ff','#ffffff']},
 {type:'ground',id:'ground-hit',label:'Terra · fissura eruptiva',palette:['#000000','#694125','#a56d3d','#dc9c53','#f3d59d','#ffffff']},
 {type:'flying',id:'flying-hit',label:'Voador · lâminas de vento',palette:['#000000','#30587b','#6594b8','#b2d6ed','#e5f8ff','#ffffff']},
 {type:'psychic',id:'psychic-hit',label:'Psíquico · pulso mental',palette:['#000000','#70295b','#ba477d','#f275bc','#ffb7e4','#ffffff']},
 {type:'bug',id:'bug-hit',label:'Inseto · asas cortantes',palette:['#000000','#536022','#92a72f','#bad35d','#e1ee9d','#ffffff']},
 {type:'rock',id:'rock-hit',label:'Pedra · blocos quebrados',palette:['#000000','#514c51','#918c80','#c9bda5','#fff0cf','#ffffff']},
 {type:'ghost',id:'ghost-hit',label:'Fantasma · espectros',palette:['#000000','#30254e','#644a9b','#ab8cd2','#e0c5ff','#ffffff']},
 {type:'dragon',id:'dragon-hit',label:'Dragão · fúria dracônica',palette:['#000000','#303d81','#5f62d8','#a38df6','#d3c7ff','#ffffff']},
 {type:'dark',id:'dark-hit',label:'Sombrio · eclipse cortante',palette:['#000000','#252b46','#455273','#7e7396','#bcabc9','#ffffff']},
 {type:'steel',id:'steel-hit',label:'Aço · choque metálico',palette:['#000000','#304c5e','#7395a8','#bed5e0','#e0f5ff','#ffffff']},
 {type:'fairy',id:'fairy-hit',label:'Fada · explosão estelar',palette:['#000000','#844a87','#d17cbd','#ffabd9','#ffe3ee','#ffffff']}
]);

export function framesForType(spec){
 const frames=[],CX=53,CY=48,W=96,H=96,TWO=Math.PI*2;
 for(let f=0;f<16;f++){
  const pixels=new Uint8Array(W*H);
  function put(x,y,c=3){x=Math.round(x);y=Math.round(y);if(x>=0&&x<W&&y>=0&&y<H&&c>0)pixels[y*W+x]=c;}
  function disk(x,y,r,c=3){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(dx*dx+dy*dy<=r*r)put(x+dx,y+dy,c);}
  function diamond(x,y,r,c=3){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(Math.abs(dx)+Math.abs(dy)<=r)put(x+dx,y+dy,c);}
  function line(x,y,u,v,c=3,w=1){const n=Math.max(1,Math.ceil(Math.hypot(u-x,v-y)*1.5));for(let i=0;i<=n;i++){const p=i/n;if(w===1)put(x+(u-x)*p,y+(v-y)*p,c);else disk(x+(u-x)*p,y+(v-y)*p,Math.max(1,Math.floor(w/2)),c);}}
  function arc(x,y,r,from,to,c=3,width=1){const n=Math.max(8,Math.ceil(Math.abs(to-from)*r*1.7));for(let i=0;i<=n;i++){const a=from+(to-from)*i/n,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(width===1)put(px,py,c);else disk(px,py,Math.floor(width/2),c);}}
  function spark(x,y,r,c=4){line(x-r,y,x+r,y,c);line(x,y-r,x,y+r,c);put(x,y,5);}
  function poly(points,c=3){let lo=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))),hi=Math.min(95,Math.ceil(Math.max(...points.map(p=>p[1]))));for(let y=lo;y<=hi;y++){const xs=[];for(let j=0;j<points.length;j++){const a=points[j],b=points[(j+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)for(let x=Math.ceil(xs[j]);x<=Math.floor(xs[j+1]);x++)put(x,y,c);}}
  const at=(a,r)=>[CX+Math.cos(a)*r,CY+Math.sin(a)*r];
  // Approach: readable origin on the left, with a type-specific projectile.
  if(f<=4){
   const x=8+f*11.1,y=CY+Math.sin(f*1.2)*2;
   if(spec.type==='normal'){disk(x,y,4,3);diamond(x,y,2,5);line(x-14,y,x-7,y,2,2);}
   if(spec.type==='grass'){poly([[x-8,y],[x-1,y-6],[x+7,y-2],[x+2,y+5]],3);line(x-6,y+1,x+6,y-2,4);line(x-13,y+3,x-5,y,2);}
   if(spec.type==='fighting'){disk(x,y,5,2);diamond(x+2,y-2,3,4);line(x-15,y+4,x-6,y+1,3,3);line(x-13,y-5,x-5,y-2,4);}
   if(spec.type==='poison'){disk(x,y,6,2);disk(x+2,y-2,3,4);disk(x-7,y-5,2,3);disk(x-10,y+5,2,3);}
   if(spec.type==='ground'){poly([[x-7,y+3],[x-5,y-5],[x+4,y-7],[x+8,y+1],[x+1,y+6]],2);line(x-6,y-3,x+5,y-2,4);put(x-13,y+3,3);}
   if(spec.type==='flying'){arc(x,y,8,-2.2,1.4,3);arc(x-5,y+1,10,-1.9,1.25,4);line(x-17,y-3,x-8,y-3,2);}
   if(spec.type==='psychic'){diamond(x,y,8,2);diamond(x,y,5,4);diamond(x,y,2,5);spark(x-10,y-8,2,3);}
   if(spec.type==='bug'){poly([[x-7,y],[x,y-6],[x+6,y-3],[x+1,y+1]],3);poly([[x-6,y+2],[x+1,y+2],[x+4,y+6]],2);line(x-14,y,x-8,y,4);}
   if(spec.type==='rock'){poly([[x-7,y+3],[x-3,y-6],[x+5,y-5],[x+8,y+4],[x-2,y+7]],2);line(x-3,y-5,x+4,y+4,4);put(x-13,y+7,3);}
   if(spec.type==='ghost'){arc(x,y,8,1.5,5.8,3,2);arc(x-4,y+1,7,1.0,3.5,2);disk(x+4,y-3,2,5);}
   if(spec.type==='dragon'){poly([[x-9,y],[x-2,y-7],[x+7,y-3],[x+9,y+5],[x-3,y+4]],3);diamond(x+4,y,2,5);line(x-13,y+3,x-7,y+2,2);}
   if(spec.type==='dark'){disk(x,y,7,3);disk(x+3,y-2,6,0);arc(x,y,7,1.5,4.9,4);line(x-13,y-3,x-7,y,2);}
   if(spec.type==='steel'){poly([[x-8,y-3],[x+3,y-7],[x+9,y],[x+3,y+7],[x-8,y+4]],2);line(x-7,y,x+7,y,4,2);spark(x,y,2,5);}
   if(spec.type==='fairy'){spark(x,y,5,3);diamond(x,y,2,5);spark(x-10,y+7,2,4);spark(x-8,y-9,2,2);}
  }
  // Contact: distinctive structures per type; not a palette-swapped generic explosion.
  if(f>=4&&f<=8){
   const age=f-4,r=[2,9,15,19,14][age],bright=f<=6?5:4;
   if(spec.type==='normal'){
    arc(CX,CY,r,0,TWO,3,2);arc(CX,CY,r+4,0,TWO,2);
    for(let i=0;i<8;i++){const a=i*TWO/8;line(...at(a,r+2),...at(a,r+10),i%2?3:4,2);}
    if(f<=6)diamond(CX,CY,4,bright);
   }else if(spec.type==='grass'){
    for(let i=0;i<8;i++){const a=i*TWO/8+.15,near=at(a,4),tip=at(a,r+11),side=at(a+.18,r+1);
     poly([near,at(a-.16,r*.75),tip,side],i%2?2:3);
     line(...at(a,7),...at(a,r+7),4);}
    arc(CX,CY,r*.48,1.1,5.5,2,2);
    if(f===5)spark(CX,CY,5,5);
   }else if(spec.type==='fighting'){
    const s=r;poly([[CX-11,CY+4],[CX-4-s*.6,CY+10],[CX+5,CY+4],[CX+13+s*.55,CY-11],[CX+15,CY-15],[CX+2,CY-6]],3);
    line(CX-9,CY+10,CX+9+s*.5,CY-15,4,3);
    for(let j=0;j<4;j++){line(CX-20-j*2,CY-13+j*8,CX-7-j*2,CY-15+j*8,j%2?2:4,2);}
    if(f<=6)disk(CX+6,CY-4,3,5);
   }else if(spec.type==='poison'){
    for(let i=0;i<9;i++){const a=i*TWO/9,R=r*(.55+(i%3)*.18),p=at(a,R);
      disk(...p,Math.max(2,6-age),i%3===0?4:2);
      disk(p[0]-1,p[1]-1,Math.max(1,3-Math.floor(age/2)),3);
    }
    arc(CX,CY,Math.max(3,r-1),.3,2.6,4,2);
    if(f<=6)disk(CX,CY,5,bright);
   }else if(spec.type==='ground'){
    for(let i=0;i<7;i++){const a=Math.PI*.12+i*Math.PI*.12,p=at(a,r+10),mid=at(a,r*.6);
      line(CX,CY,mid[0],mid[1],2,3);line(mid[0],mid[1],p[0]+(i%2?3:-3),p[1],4,2);
      poly([[p[0]-3,p[1]+2],[p[0]+2,p[1]-7-(i%3)*2],[p[0]+7,p[1]+1]],i%2?2:3);
    }
    line(CX-18,CY+13,CX+22,CY+13,3,2);
    if(f<=6)diamond(CX,CY,4,5);
   }else if(spec.type==='flying'){
    for(let i=0;i<4;i++){const off=i*3,a=-2.7+i*.5;arc(CX+off,CY-off,Math.max(5,r+6-off),a,a+2.3,i%2?3:4,2);}
    line(CX-r,CY-7,CX+r+10,CY-13,3,2);line(CX-r-7,CY+9,CX+r+6,CY+5,2);
    if(f<=6)spark(CX,CY,4,5);
   }else if(spec.type==='psychic'){
    for(let i=0;i<3;i++){const R=r+6-i*5;diamond(CX,CY,R,i===0?2:i===1?3:4);}
    diamond(CX,CY,Math.max(2,r*.65|0),0);
    for(let j=0;j<4;j++){const p=at(j*Math.PI/2,r+5);spark(...p,3,j%2?4:5);}
    if(f<=6)spark(CX,CY,5,5);
   }else if(spec.type==='bug'){
    for(let s of [-1,1]){
     poly([[CX,CY],[CX+s*r*.45,CY-r*.75],[CX+s*(r+10),CY-r*.45],[CX+s*(r+4),CY+2],[CX+s*r*.5,CY+7]],s<0?2:3);
     line(CX,CY,CX+s*(r+9),CY-r*.44,4,2);
     arc(CX+s*r*.55,CY+r*.2,Math.max(3,r*.7),s<0?0:1.55,s<0?1.4:3.1,4);
    }
    if(f<=6)diamond(CX,CY,3,5);
   }else if(spec.type==='rock'){
    for(let i=0;i<9;i++){const a=i*TWO/9,R=r+4+(i%3)*3,p=at(a,R),p2=at(a+.24,R+7);
      poly([[p[0]-5,p[1]+3],[p[0]+2,p[1]-8],[p2[0]+5,p2[1]+2],[p[0]+1,p[1]+7]],i%2?2:3);
      line(p[0]-3,p[1]+1,p2[0]+2,p2[1],4);
    }
    if(f<=6)diamond(CX,CY,5,5);
   }else if(spec.type==='ghost'){
    for(let i=0;i<5;i++){const a=(i*TWO/5)+age*.13,p=at(a,r*.9);
      arc(p[0],p[1],Math.max(3,7-age),.5+i*.4,4.9+i*.4,i%2?2:3,2);
      line(...at(a,r*.5),...at(a+.25,r+9),4);
    }
    if(f<=6){disk(CX,CY,7,2);disk(CX+2,CY-2,3,5);}
   }else if(spec.type==='dragon'){
    for(let i=0;i<7;i++){const a=i*TWO/7+age*.11,p1=at(a,2),p2=at(a+.17,r*.7),p3=at(a-.14,r+13);
      poly([p1,p2,p3,at(a+.31,r*.76)],i%2?2:3);
      line(...p1,...p3,4,2);
    }
    arc(CX,CY,r*.75,-.6,4.9,3,2);
    if(f<=6)spark(CX,CY,4,5);
   }else if(spec.type==='dark'){
    for(let i=0;i<4;i++){const a=i*TWO/4+age*.15;
      arc(...at(a,r*.4),r*.67,a+.3,a+3.25,i%2?2:3,3);
      line(...at(a,r*.65),...at(a+.17,r+12),4,2);
    }
    if(f<=6)diamond(CX,CY,4,5);
   }else if(spec.type==='steel'){
    for(let i=0;i<8;i++){const a=i*TWO/8,p=at(a,r+9),q=at(a+.12,r*.58);
      poly([at(a-.12,5),q,p,at(a+.12,r*.65)],i%2?2:3);
      line(...at(a,9),...p,4,2);}
    spark(CX,CY,Math.max(4,8-age),bright);
   }else if(spec.type==='fairy'){
    for(let i=0;i<10;i++){const a=i*TWO/10+age*.08,p=at(a,r+7+(i%3)*3);
      spark(...p,i%3===0?5:3,i%2?3:4);
    }
    arc(CX,CY,r*.65,.2,5.8,3,2);
    if(f<=6)spark(CX,CY,9,5);
   }
  }
  // Distinct outward-moving debris, decaying to a fully empty last frame.
  if(f>=7&&f<=14){
   const d=f-7,num=f>=12?6:13;
   for(let i=0;i<num;i++){
    const a=i*2.39996+(spec.type.length%5)*.24,rr=11+d*(2.4+(i%4)*.65)+i%7,p=at(a,rr);
    const c=i%5===0?4:i%3===0?3:2;
    if(spec.type==='grass'||spec.type==='bug')poly([[p[0]-3,p[1]],[p[0]+1,p[1]-4],[p[0]+4,p[1]]],c);
    else if(spec.type==='rock'||spec.type==='ground'||spec.type==='steel')diamond(...p,Math.max(1,3-Math.floor(d/3)),c);
    else if(spec.type==='psychic'||spec.type==='fairy')spark(...p,d<4?3:1,c);
    else if(spec.type==='poison')disk(...p,d<4?3:1,c);
    else if(spec.type==='ghost'||spec.type==='dark')arc(...p,Math.max(2,5-d/2),1.3,3.9,c);
    else if(spec.type==='flying'||spec.type==='normal')line(p[0]-4,p[1],p[0]+3,p[1]-2,c);
    else if(spec.type==='dragon'||spec.type==='fighting')line(p[0]-2,p[1]+2,p[0]+3,p[1]-4,c,2);
   }
  }
  if(f===15)pixels.fill(0);
  frames.push(pixels);
 }
 return frames;
}
export function buildTypeImpact(spec){
 const frames=framesForType(spec);
 return {frames,png:toPNG(spec,frames),gif:toGIF(spec,frames,IMPACT_DELAYS_CS)};
}
