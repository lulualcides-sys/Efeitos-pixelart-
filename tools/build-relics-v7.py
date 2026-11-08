from PIL import Image, ImageDraw
from pathlib import Path
from math import sin

W=112;H=112;FRAMES=16
OUT=Path('assets/v7/relics');OUT.mkdir(parents=True,exist_ok=True)

PALETTES={
 'ghost':['#20132c','#39234e','#553172','#764396','#905bb1','#b77cd7','#d6a3ec','#e9d1f8','#fff3ff','#683d88'],
 'steel':['#1b2a38','#304658','#496379','#68869a','#8cabbc','#b8d1df','#deedf5','#f8fdff','#ffe3a6','#c99e59'],
 'shell':['#0b304a','#0e5976','#167fa3','#219ebd','#35b4ce','#63d2e6','#99eaf5','#d2f8fc','#f6ffff','#2c849f']}

def rgb(hex):return tuple(int(hex[i:i+2],16) for i in (1,3,5))+(255,)
def make_brush(name):return [rgb(c) for c in PALETTES[name]]

def fist(which):
 c=make_brush(which);im=Image.new('RGBA',(112,112));d=ImageDraw.Draw(im)
 # Wispy wrist filaments vs rigid armored sleeve
 if which=='ghost':
  for k,poly in enumerate([[(13,48),(1,34),(11,51),(5,68),(27,69)],[(9,73),(0,85),(25,76),(27,63)],[(29,34),(17,12),(35,29)],[(20,61),(4,47),(29,55)] ]):d.polygon(poly,fill=c[1 if k%2==0 else 2])
  d.line([(6,75),(15,65),(28,64)],fill=c[5],width=2)
 else:
  d.polygon([(8,38),(25,31),(37,34),(38,70),(25,75),(9,67)],fill=c[0]);d.polygon([(12,42),(27,36),(31,40),(32,66),(23,70),(11,64)],fill=c[2]);d.line([(13,43),(27,38),(29,45)],fill=c[5],width=2)
  for x,y in [(19,44),(21,61)]:d.ellipse((x-2,y-2,x+2,y+2),fill=c[8],outline=c[0])
 # Distinct polygonal palm, no elliptical ball
 d.polygon([(28,39),(36,26),(50,21),(67,24),(76,33),(76,65),(61,78),(41,79),(27,65)],fill=c[0])
 d.polygon([(31,42),(40,30),(51,26),(66,30),(71,37),(71,64),(59,73),(43,73),(32,62)],fill=c[3])
 d.polygon([(37,40),(43,29),(54,27),(65,32),(60,44),(44,47)],fill=c[5])
 d.polygon([(35,57),(49,54),(64,56),(63,68),(53,71),(39,68)],fill=c[2])
 d.line([(36,53),(42,58),(51,58)],fill=c[1],width=2)
 d.line([(42,36),(49,32),(60,35)],fill=c[6],width=2)
 # Four separate, visibly segmented knuckles
 for j,top in enumerate([26,38,50,62]):
  # each finger starts at palm but ends as its own protruding profile
  reach=[91,97,95,85][j];start=[65,67,65,61][j]
  d.polygon([(start-2,top+3),(start+4,top-3),(reach-6,top-4),(reach+1,top+1),(reach+1,top+7),(reach-4,top+10),(start,top+10)],fill=c[0])
  d.polygon([(start,top+2),(start+5,top-1),(reach-7,top-1),(reach-2,top+3),(reach-3,top+7),(start+3,top+8)],fill=c[4 if which=='ghost' else 3])
  d.polygon([(start+5,top+1),(start+10,top),(reach-9,top),(reach-7,top+3),(start+6,top+4)],fill=c[6 if which=='ghost' else 5])
  d.line([(start+8,top+7),(reach-6,top+7)],fill=c[1],width=1)
  d.line([(reach-5,top+2),(reach-3,top+4)],fill=c[7],width=1)
  if which=='steel':
   d.line([(start+8,top+3),(start+13,top+4)],fill=c[8],width=1)
   d.point((reach-10,top+5),fill=c[8])
  else:
   d.line([(start+8,top+2),(start+15,top+2)],fill=c[7],width=1)
 # Actual tucked thumb with crease
 d.polygon([(45,67),(60,68),(70,79),(61,88),(44,84),(37,73)],fill=c[0])
 d.polygon([(44,72),(58,71),(65,79),(59,83),(46,80)],fill=c[3])
 d.polygon([(46,73),(56,72),(59,76),(47,76)],fill=c[6])
 d.line([(51,80),(60,81)],fill=c[1],width=1)
 if which=='steel':
  d.line([(30,43),(32,60)],fill=c[6],width=2)
  d.polygon([(33,53),(35,46),(44,46),(49,52),(44,57)],fill=c[8])
  d.line([(30,66),(40,74),(50,77)],fill=c[6],width=1)
 else:
  for px,py in [(17,35),(11,53),(22,77),(7,67),(38,18),(8,80),(26,13),(28,84)]:
   d.point((px,py),fill=c[5]);d.point((px+1,py-1),fill=c[7])
 return im

def shell():
 c=make_brush('shell');im=Image.new('RGBA',(112,112));d=ImageDraw.Draw(im)
 # Retain a hand-held shell blade: grip at bottom-left and seven scalloped tips
 d.polygon([(23,68),(18,60),(14,50),(16,40),(20,32),(26,24),(35,19),(45,16),(54,18),(62,22),(68,28),(75,33),(79,42),(82,52),(79,63),(67,71),(51,79),(34,81)],fill=c[0])
 d.polygon([(24,63),(19,50),(23,39),(30,29),(40,23),(51,24),(62,29),(73,40),(77,52),(71,63),(60,70),(46,75),(34,73)],fill=c[2])
 d.polygon([(28,61),(26,49),(30,37),(39,30),(49,28),(59,34),(69,43),(72,54),(66,64),(55,68),(40,69)],fill=c[4])
 d.polygon([(35,58),(33,47),(39,37),(48,33),(57,39),(64,46),(64,56),(57,64),(45,65)],fill=c[5])
 d.polygon([(42,52),(42,44),(49,39),(55,43),(59,51),(55,58),(48,60)],fill=c[6])
 d.polygon([(49,44),(55,47),(55,53),(49,55)],fill=c[7])
 # Fine scalloped light rim, jagged organic edge, no symmetric glow
 rim=[(18,58),(15,49),(17,37),(24,25),(32,20),(36,16),(45,18),(54,16),(61,23),(70,27),(75,35),(80,40),(81,51),(79,59)]
 d.line(rim,fill=c[7],width=2)
 d.line([(22,57),(20,46),(26,33),(34,25),(45,22),(55,24),(69,31)],fill=c[6],width=1)
 # Seven structural radial grooves, one apex, different lengths
 pivot=(31,74)
 for i,(x,y) in enumerate([(19,44),(27,28),(36,21),(47,20),(60,27),(72,36),(78,50)]):
  d.line([pivot,(x,y)],fill=c[0],width=2 if i%2==0 else 1)
  d.line([(pivot[0]+2,pivot[1]-3),(x+2,y+3)],fill=c[6],width=1)
  d.point((x+1,y+2),fill=c[8])
 # Foot grip not a sphere
 d.polygon([(20,69),(35,70),(39,84),(31,94),(20,89),(15,78)],fill=c[0]);d.polygon([(19,75),(31,75),(34,84),(28,89),(20,84)],fill=c[2])
 d.line([(20,78),(29,79)],fill=c[6],width=2)
 d.line([(21,86),(29,87)],fill=c[1],width=2)
 return im

def build(name):
 base=shell() if name=='shell' else fist(name)
 atlas=Image.new('RGBA',(W*FRAMES,H))
 for frame in range(FRAMES):
  # anticipation small, travel sharp rotational wind-up, contact holds readable silhouette, recovery dissipates
  angle=([0,-2,-5,-7,-8,-4,3,10,17,18,19,16,9,4,0,0][frame] if name=='shell' else [0,-1,-2,0,2,2,3,1,-1,-1,0,0,0,0,0,0][frame]);
  art=base.rotate(angle,resample=Image.Resampling.NEAREST,expand=False)
  if frame>11:
   alpha=art.getchannel('A').point(lambda p:int(p*(max(0,(16-frame)/5))))
   art.putalpha(alpha)
  dx=round((frame-5)*1.1) if frame<11 else round(5-(frame-11)*1.4)
  dy=-round(2*sin(frame/4))
  canvas=Image.new('RGBA',(W,H))
  canvas.alpha_composite(art,(dx,dy))
  atlas.alpha_composite(canvas,(frame*W,0))
 atlas.save(OUT/(name+'.png'),optimize=True)
 # diagnostic preview 3 frames each
 return [atlas.crop((x*W,0,(x+1)*W,H)) for x in [3,8,10]]

if __name__=='__main__':
 frames=[build(x) for x in ['shell','ghost','steel']]
 board=Image.new('RGBA',(3*112,3*112),(15,29,44,255))
 for row,row_frames in enumerate(frames):
  for col,tile in enumerate(row_frames):board.alpha_composite(tile,(col*112,row*112))
 board.resize((672,672),resample=Image.Resampling.NEAREST).convert('RGB').save(OUT/'inspection.png')
 print('generated 3x16 spritesheets',[(p.name,p.stat().st_size) for p in OUT.glob('*.png')])
