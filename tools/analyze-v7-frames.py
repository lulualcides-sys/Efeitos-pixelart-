#!/usr/bin/env python3
"""Art inspection: measure actual source-sheet pixel coverage and brightness per cel.
This is independent of existing six-move implementations and can be rerun
after the imported PixelFX PNGs change. Requires Pillow.
"""
from PIL import Image,ImageStat
from pathlib import Path
import json
root=Path('assets/v7/atlas')
for source in sorted(root.glob('*.json')):
    data=json.loads(source.read_text())
    im=Image.open(source.with_suffix('.png')).convert('RGBA')
    measures=[]
    for i,frame in enumerate(data['frames']):
        r=frame['frame'];tile=im.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
        alpha=tile.getchannel('A');hist=alpha.histogram()
        ink=sum(hist[16:]);solid=sum(hist[96:])
        bb=alpha.getbbox()
        brightness=0
        if ink:
            small=tile.convert('RGB').convert('L')
            brightness=sum(v*(alpha.getpixel((k%tile.width,k//tile.width))>40) for k,v in enumerate(small.getdata()))/max(1,ink)
        measures.append((i,ink,solid,int(brightness),bb))
    top=sorted(measures,key=lambda x:x[1],reverse=True)[:8]
    print(source.stem,'n='+str(len(measures)),'top coverage:',[(x[0],x[1],x[2]) for x in top])
    print(source.stem,'timeline first 28:',[(x[0],x[1]) for x in measures[:28]])
