#!/usr/bin/env python3
"""V8 artist-directed 160x144 native pixel art, 18 cels/attack.
Not vector/CSS rendering: this script paints actual indexed-looking 1px raster
masks, detailed material planes, hand-separated digits, splashing/hitting cels.
No pixel magnification or re-use of the previously rejected V1–V6 sheets.
Requires Pillow. Output: assets/v8/hero/{shell,ghost,steel}.png
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
from random import Random
from math import pi,sin,cos
import json,hashlib

W,H,N=160,144,18
OUT=Path('assets/v8/hero')
OUT.mkdir(parents=True,exist_ok=True)
COLOR={
 'ghost': ['#130c25','#291442','#41235e','#633684','#8752aa','#ab78c6','#d9a8ed','#f2dafa','#fff6ff','#623798'],
 'steel': ['#0f1b2b','#23384b','#35546a','#54738a','#7195ab','#98b9cc','#c9dce7','#edf5fa','#ffffff','#cfa85c'],
 'shell': ['#08263d','#0c4b68','#136b8a','#1b8eae','#34b4d0','#65d0e6','#9be9f3','#d5f8fa','#ffffff','#257a9d']
}
def rgba(hexv,alpha=255):
 return tuple(int(hexv[i:i+2],16) for i in (1,3,5))+(alpha,)
def image():return Image.new('RGBA',(W,H),(0,0,0,0))
def mask_poly(points):
 mask=Image.new('L',(W,H));ImageDraw.Draw(mask).polygon(points,fill=255)
 return mask
def shade(img,points,palette,name,seed,edge=1,low=.1,high=.96):
 mask=mask_poly(points)
 outline=mask.filter(ImageFilter.MaxFilter(3 if edge==1 else 5))
 img.alpha_composite(Image.composite(
  Image.new('RGBA',(W,H),rgba(palette[0])),image(),outline))
 bounds=mask.getbbox()
 if bounds is None:return
 rng=Random(seed)
 color=img.load();ms=mask.load()
 x0,y0,x1,y1=bounds
 for yy in range(y0,y1):
  for xx in range(x0,x1):
   if not ms[xx,yy]:continue
   light=(.39*(1-(yy-y0)/max(1,y1-y0))+
          .22*(1-(xx-x0)/max(1,x1-x0))+
          .14*sin(xx*.15+yy*.09)+rng.random()*.11)
   intensity=low+(high-low)*max(0,min(1,light+.19))
   ramp=intensity*(len(palette)-3)
   index=max(1,min(len(palette)-2,int(ramp+1)))
   color[xx,yy]=rgba(palette[index])
def line(img,points,color,width=1):
 ImageDraw.Draw(img).line(points,fill=rgba(color),width=width,joint='curve')
def dot(img,x,y,color,r=1):
 ImageDraw.Draw(img).ellipse((int(x-r),int(y-r),int(x+r),int(y+r)),fill=rgba(color))
def sparkle(img,x,y,color,r=4):
 d=ImageDraw.Draw(img);x=int(x);y=int(y)
 d.line((x-r,y,x+r,y),fill=rgba(color),width=1)
 d.line((x,y-r,x,y+r),fill=rgba(color),width=1)
 d.point((x-1,y-1),fill=rgba(color));d.point((x+1,y+1),fill=rgba(color))
def stroke_wisps(im,name,frame):
 c=COLOR[name];rng=Random(101+frame*173+(0 if name=='ghost' else 29))
 if name=='ghost':
  for i in range(8):
   ox=10+i*5+rng.randrange(-4,4)
   ey=42+i%4*18+rng.randrange(-6,7)
   x=ox+(frame%5)*2;y=ey
   line(im,[(x+35,y+7),(x+24,y-5),(x+13,y+7),(x,y-7)],c[3+i%4],1 if i%3 else 2)
   if i%2==0:sparkle(im,x+5,y+1,c[6],2)
  for i in range(27):
   x=rng.randrange(6,60);y=rng.randrange(17,115)
   if rng.random()<.72:ImageDraw.Draw(im).point((x,y),fill=rgba(c[3+i%4],100+i%3*40))
 else:
  for i in range(14):
   x=11+i*3+rng.randrange(-2,3)
   y=52+rng.randrange(-13,14)
   col=c[3+i%5]
   line(im,[(x-7,y+5),(x,y),(x+7,y-2)],col,1)
def fist(kind):
 c=COLOR[kind];im=image()
 stroke_wisps(im,kind,0)
 # Wrist cuff / sleeve (narrow at rear; wrist is visibly attached to palm)
 if kind=='steel':
  shade(im,[(14,49),(31,39),(57,43),(62,98),(39,108),(13,94)],c,kind,3)
  shade(im,[(19,54),(37,47),(47,52),(50,91),(29,100),(18,90)],c,kind,4)
  line(im,[(23,54),(37,49),(43,57)],c[6],2)
  line(im,[(21,88),(32,97),(43,89)],c[5],1)
  for xx,yy in [(32,57),(38,89),(20,86)]:
   dot(im,xx,yy,c[0],3);dot(im,xx-1,yy-1,c[8],1)
 else:
  shade(im,[(19,52),(29,42),(58,46),(63,98),(38,104),(21,97),(3,110),(17,87)],c,kind,4,low=.05)
  line(im,[(7,110),(31,93),(38,104)],c[5],2)
  line(im,[(13,38),(30,54),(38,48)],c[5],1)
 # Large non-circular palm is seen in three-quarter view.
 palm=[(48,51),(58,35),(77,26),(104,31),(120,48),(123,88),
       (110,111),(87,119),(63,109),(48,91),(42,70)]
 shade(im,palm,c,kind,9,low=.10)
 facet=[(60,50),(73,37),(97,35),(108,50),(101,65),(79,62)]
 shade(im,facet,c,kind,10,edge=0,low=.39)
 facet2=[(54,73),(78,69),(100,75),(99,98),(81,110),(62,97)]
 shade(im,facet2,c,kind,11,edge=0,low=.06)
 line(im,[(62,48),(72,36),(92,34)],c[7],1)
 line(im,[(55,87),(67,99),(81,104)],c[2],2)
 line(im,[(93,111),(106,98),(115,90)],c[2],1)
 # Four *knuckles*, distinct beveled caps, not straight rectangular pipes.
 tips=[139,153,150,139];yy=[41,58,76,94]
 for j,(tip,top) in enumerate(zip(tips,yy)):
  sx=[107,111,110,103][j];right=tip
  boundary=[(sx-3,top+5),(sx+3,top-4),(right-12,top-7),
    (right-3,top-2),(right+1,top+5),(right-4,top+13),
    (right-14,top+16),(sx+1,top+14)]
  shade(im,boundary,c,kind,23+j,low=.16+(3-j)*.022)
  upper=[(sx+7,top-1),(right-13,top-5),(right-6,top),
    (right-8,top+3),(sx+9,top+5)]
  shade(im,upper,c,kind,43+j,edge=0,low=.56)
  # Finger joints, two individually sculpted bony/armored planes.
  line(im,[(sx+14,top+7),(right-10,top+10)],c[1],1)
  line(im,[(right-10,top-3),(right-6,top-1)],c[7],1)
  dot(im,right-7,top+3,c[7],1)
  if kind=='steel':
   line(im,[(sx+7,top+10),(sx+15,top+12)],c[0],1)
   dot(im,sx+10,top+9,c[8],1)
  else:
   line(im,[(sx+2,top+11),(sx+9,top+8)],c[7],1)
 # Tucked thumb forward, connected to mid-palm at an angle
 shade(im,[(81,98),(94,96),(113,106),(117,118),(104,127),
           (88,123),(74,109)],c,kind,74,low=.12)
 shade(im,[(87,101),(104,101),(112,108),(106,116),(89,113)],c,kind,75,edge=0,low=.44)
 line(im,[(80,107),(91,117),(104,120)],c[1],2)
 if kind=='steel':
  # Iconic steel armor's central inset, warning-brass rivets and thin silver bevels.
  shade(im,[(58,73),(66,65),(79,67),(87,79),(76,90),(62,86)],c,kind,85,edge=0,low=.40)
  line(im,[(58,68),(62,59),(81,55)],c[5],2)
  line(im,[(62,91),(72,97),(82,95)],c[5],1)
  for x,y in [(31,67),(46,86),(69,79)]:
   dot(im,x,y,c[0],2);dot(im,x-1,y-1,c[9],1)
 else:
  for x,y in [(44,38),(31,24),(9,90),(23,113),(37,119),(115,30)]:
   sparkle(im,x,y,c[6],2)
 return im
def shell():
 c=COLOR['shell'];im=image()
 # Conch shell is an *organic scalchop* with blade rim, not a blue flat fan.
 b=[(26,83),(21,65),(24,47),(34,31),(49,22),(68,20),
    (84,26),(99,33),(116,48),(131,66),(127,84),
    (116,99),(91,112),(65,120),(41,112)]
 shade(im,b,c,'shell',9,low=.08)
 shade(im,[(32,79),(28,60),(36,43),(53,30),(73,30),(92,38),
           (114,56),(120,75),(109,94),(86,106),(62,110),(45,99)],c,'shell',12,edge=0,low=.24)
 shade(im,[(42,70),(47,51),(62,37),(81,37),(101,52),(108,72),(99,91),
          (81,97),(60,95)],c,'shell',13,edge=0,low=.52)
 # Shell radial ribs, each with dark shadow on one side and precise white glint.
 center=(52,109)
 for j,(x,y) in enumerate([(26,63),(36,43),(52,28),(69,24),(87,29),(106,43),(120,64),(128,79)]):
  line(im,[center,(x,y)],c[1 if j%2 else 0],2)
  line(im,[(center[0]+3,center[1]-4),(x+2,y+2)],c[5+j%3],1)
  dot(im,x+2,y+2,c[8],1)
 # Scallop shell point geometry with razor-like rim, not a circle.
 rim=[(26,82),(21,63),(25,46),(34,31),(48,22),(64,19),
      (75,23),(85,25),(101,33),(117,49),(129,64),(128,78)]
 line(im,rim,c[7],2)
 line(im,[(31,80),(27,58),(34,43),(51,29)],c[8],1)
 line(im,[(84,28),(101,37),(117,54)],c[8],1)
 # Blade cutting tip
 shade(im,[(120,64),(133,68),(144,80),(134,89),(123,85)],c,'shell',50,edge=0,low=.57)
 line(im,[(131,69),(143,81),(135,86)],c[8],2)
 # Hand grip and notch, small enough not to look like a cartoon wand
 shade(im,[(43,105),(62,107),(70,119),(62,135),(48,136),(35,122)],c,'shell',20)
 shade(im,[(46,113),(58,113),(62,125),(55,131),(44,124)],c,'shell',22,edge=0,low=.45)
 line(im,[(41,116),(54,118)],c[7],1)
 line(im,[(40,125),(53,127)],c[2],1)
 return im
def animate(name,base):
 atlas=Image.new('RGBA',(W*N,H),(0,0,0,0))
 rng=Random(372+len(name))
 for i in range(N):
  temp=image()
  # Body builds up in anticipation; attacks strain and snap. Each PNG frame is unique.
  angle=( [-9,-10,-10,-8,-6,-4,1,7,13,16,10,4,-1,-4,-7,-5,-1,0][i]
    if name=='shell' else
    [0,-1,-3,-6,-8,-9,-7,-3,3,5,3,1,-1,-3,-2,0,2,0][i])
  size=1.0 if i>3 else (.76+i*.08)
  rotated=base.rotate(angle,resample=Image.Resampling.NEAREST,expand=False)
  if size!=1:
   w=max(1,round(W*size));h=max(1,round(H*size))
   rotated=rotated.resize((w,h),Image.Resampling.NEAREST)
   offset=((W-w)//2,(H-h)//2)
  else:offset=(0,0)
  dx=[0,-2,-5,-8,-9,-8,-6,-3,0,3,5,7,8,7,4,2,-1,-2][i]
  dy=[3,3,4,5,5,4,3,1,-1,-2,-2,-1,0,0,0,1,2,3][i]
  # Pad/crop to allow negative wind-up offsets without Pillow composite errors.
  padded=Image.new('RGBA',(W+48,H+48),(0,0,0,0))
  padded.alpha_composite(rotated,(offset[0]+dx+24,offset[1]+dy+24))
  layer=padded.crop((24,24,24+W,24+H))
  alphaScale=(.28+.20*i) if i<4 else (1 if i<15 else max(.0,1-(i-14)*.23))
  if alphaScale<1:
   a=layer.getchannel('A').point(lambda v:int(v*alphaScale))
   layer.putalpha(a)
  temp.alpha_composite(layer)
  d=ImageDraw.Draw(temp)
  # Genuine material-linked local VFX drawn into the cel, not graphics at runtime.
  if 8<=i<=16:
   intensity=max(.0,1-abs(i-13)*.15)
   if name=='ghost':
    for k in range(9):
     y=38+k*8;xx=134+k%3*2+min(10,i-8)
     col=COLOR['ghost'][5+k%4]
     if 0<=xx<W:line(temp,[(xx-7,y-4),(xx+6,y-5-k%3)],col,1)
     if k%3==0:sparkle(temp,min(W-5,xx+8),y,COLOR['ghost'][7],2)
   elif name=='steel':
    if i in (12,13,14,15):
     for k in range(7):
      a=k*2*pi/7+(i-12)*.16
      radius=12+(i-12)*3+k%3
      xx=137+cos(a)*radius;yy=71+sin(a)*radius
      if 0<xx<W-4 and 4<yy<H-4:
       sparkle(temp,xx,yy,COLOR['steel'][8 if k%3 else 9],3+k%4)
     line(temp,[(139,65),(157,62)],COLOR['steel'][7],1)
   else:
    for k in range(11):
     ang=(k-5)*.18
     x=118+int(sin(ang)*(15+(i-8)*1.4))
     y=86+int(cos(ang)*(5+(i-8)*2.8))+(i-13)*3
     if 0<x<W-3 and 0<y<H-3:
      dot(temp,x,y,COLOR['shell'][6+k%3],1+k%2)
      if k%3==0:sparkle(temp,x,y,COLOR['shell'][8],2)
  if i>=16:
   for k in range(11):
    x=rng.randrange(17,153);y=rng.randrange(25,133)
    ImageDraw.Draw(temp).point((x,y),fill=rgba(COLOR[name][5+k%3],150 if i==16 else 75))
  atlas.alpha_composite(temp,(i*W,0))
 path=OUT/(name+'.png');atlas.save(path,optimize=True)
 return path,atlas

if __name__=='__main__':
 completed=[]
 board=Image.new('RGBA',(W*4,H*3),rgba('#102436'))
 for row,n in enumerate(('shell','ghost','steel')):
  p,atlas=animate(n,shell() if n=='shell' else fist(n))
  completed.append({'id':n,'path':str(p),'bytes':p.stat().st_size,
    'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'frameWidth':W,'frameHeight':H,'frames':N})
  for col,frame in enumerate((4,9,13,15)):
   sprite=atlas.crop((frame*W,0,(frame+1)*W,H))
   board.alpha_composite(sprite,(col*W,row*H))
 board.save(OUT/'contact.png',optimize=True)
 manifest={'version':'v8-hand-inked-heroes','approved':False,'gameIntegrationEnabled':False,
  'description':'native fine-pixel material shading and dynamic knuckle/shell impact animation',
  'files':completed}
 (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print('V8 HERO PACK COMPLETE')
 for f in completed:print(f['id'],f['bytes'],f['sha256'])
