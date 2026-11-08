#!/usr/bin/env python3
"""One-time migration of five user-authorized newly illustrated V9 sprite atlases.
The signed transport links are short-lived and must be removed from this branch
after the PNG assets have been permanently committed. Never regenerate approved
Air Slash assets. PNG transport is not a dependency at runtime.
"""
from pathlib import Path
from hashlib import sha256
import json,urllib.request,io,time
from PIL import Image
FILES={
 'flame-burst':"https://media.canva.com/v2/image-resize/format:PNG/height:200/quality:100/uri:ifs%3A%2F%2FM%2Ff6e8f4eb-8308-4a7a-8e7a-32bc72aee934/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAADYk3N_EJkGz6FA9G9ANC1cePqvUpjY3DHEONwaM-hl9&exp=1794134366&osig=AAAAAAAAAAAAAAAAAAAAABP-5pbWL_7t4p9mzy_QF4NAW5HVoOUaZYOAA-rdaQ2B&signer=media-rpc&token=AAIAAU0AJGY2ZThmNGViLTgzMDgtNGE3YS04ZTdhLTMyYmM3MmFlZTkzNAAAAAABobq91zAdyk5pjFlaDFCeHS21tKWAwNrG_IXIvcIFSqDwe9qSDg&x-canva-quality=thumbnail",
 'frost-breath':"https://media.canva.com/v2/image-resize/format:PNG/height:200/quality:100/uri:ifs%3A%2F%2FM%2F1bf7f97c-615c-41ef-b061-186b31ebf6db/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAAPRi2dYAv28hKlhSoKGd0OuYsOX8X5maPoDfwsM7W4-b&exp=1794132258&osig=AAAAAAAAAAAAAAAAAAAAANhJ6GJH9M2MI0GMI6LR-JIkQhgFWwf_w4kt7vjPwwDS&signer=media-rpc&token=AAIAAU0AJDFiZjdmOTdjLTYxNWMtNDFlZi1iMDYxLTE4NmIzMWViZjZkYgAAAAABobqdrNC3sZ3pcf6Xuu0beQiwV32J9l17MFcxfMQcCbzTyWvgbg&x-canva-quality=thumbnail",
 'razor-shell':"https://media.canva.com/v2/image-resize/format:PNG/height:200/quality:100/uri:ifs%3A%2F%2FM%2F329cde94-2fef-42e9-9f60-36fe15f003c2/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAAOVhjnx3N4tzMMAfEC3gc-x-k1O4HTrJdSWK95Owst58&exp=1794133040&osig=AAAAAAAAAAAAAAAAAAAAAEl19KyJtLylKmCjoPYQoleAY8rv6jHy_ABL52you0cw&signer=media-rpc&token=AAIAAU0AJDMyOWNkZTk0LTJmZWYtNDJlOS05ZjYwLTM2ZmUxNWYwMDNjMgAAAAABobqpm4CVRzPQllWRHpOKBe9Rwh_8iC5taT7SjVL2HlLzTtXHSQ&x-canva-quality=thumbnail",
 'shadow-punch':"https://media.canva.com/v2/image-resize/format:PNG/height:200/quality:100/uri:ifs%3A%2F%2FM%2F634f189c-b2bb-4f59-8a12-def22f5fe667/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAAHlHQXRSb8FcQppKKyzb6lEHx64AVddghaQgSf9NA7Cu&exp=1794133814&osig=AAAAAAAAAAAAAAAAAAAAAI3OuorR5NaPCuhgflbzL7HeC-771p8PA6foy1WphVFe&signer=media-rpc&token=AAIAAU0AJDYzNGYxODljLWIyYmItNGY1OS04YTEyLWRlZjIyZjVmZTY2NwAAAAABobq1avCUhFNsP9OYzf7EuPqUk3PniVS4FGbfMvhTMihQTYXTYw&x-canva-quality=thumbnail",
 'meteor-mash':"https://media.canva.com/v2/image-resize/format:PNG/height:200/quality:100/uri:ifs%3A%2F%2FM%2F0402658b-2198-4e04-9bb8-ee9a70153e49/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAAFm-w9MNEq7UI5kQGva07Wya0Ea5PbjFo8UH-dNrA4ip&exp=1794133675&osig=AAAAAAAAAAAAAAAAAAAAAJNs4UcYI_7ia7zFbA_nJowdanrYRVhE9aP4OuqJJEvN&signer=media-rpc&token=AAIAAU0AJDA0MDI2NThiLTIxOTgtNGUwNC05YmI4LWVlOWE3MDE1M2U0OQAAAAABobqzS_g-K5H953o87ZWQNpQoZ6d6A1F8k-kMXg17_riUVQAN4A&x-canva-quality=thumbnail"
}
out=Path('assets/v9');out.mkdir(parents=True,exist_ok=True)
data={}
for id,url in FILES.items():
 if time.time() > int(url.split('exp=')[1].split('&')[0]):
  raise RuntimeError(f'{id} transport URL expired before permanent binary commit')
 # Prefer 320px. Signed media URLs may bind dimensions and reject this; fall back to
 # the original signed 200px preview, then resize to 16 cels × 80px.
 candidates=[url.replace('/height:200/','/height:320/').replace('/width:200?','/width:320?'),url]
 payload=None;mode=None;last=None
 for i,u in enumerate(candidates):
  try:
   req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (Pokémon Pixel Art Asset QA)'})
   with urllib.request.urlopen(req,timeout=25) as response:
    payload=response.read()
   im=Image.open(io.BytesIO(payload))
   im.load()
   if im.size not in [(320,320),(200,200)]:
    raise ValueError(f'Unexpected size {im.size} for {id}')
   mode='full320' if im.size==(320,320) else 'signed-thumbnail200'
   break
  except Exception as exc:
   last=str(exc);payload=None
 if payload is None:raise RuntimeError(f'{id} image import failed: {last}')
 if im.size==(200,200):
  im=im.convert('RGBA').resize((320,320),Image.Resampling.LANCZOS)
  # Re-quantize subtle interpolated colors into defined pixel-art clusters.
  im=im.quantize(colors=40,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
 else:im=im.convert('RGBA').quantize(colors=40,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
 path=out/(id+'.png');im.save(path,optimize=True,compress_level=9)
 b=path.read_bytes()
 assert b[:8]==bytes.fromhex('89504e470d0a1a0a')
 assert Image.open(path).size==(320,320)
 assert len(b)>1200
 data[id]={'bytes':len(b),'sha256':sha256(b).hexdigest(),
  'frames':16,'frameWidth':80,'frameHeight':80,
  'transportResolution':mode,'artOrigin':'five new image-generated spritesheets'}
 print('V9',id,mode,len(b),data[id]['sha256'])
manifest={'version':'v9-illustrated-png','approved':False,'gameIntegrationEnabled':False,
 'airSlashPreserved':'v8','binarySource':'five user-requested illustrative spritesheets',
 'items':data,'note':'Transport URLs expired and removed after importing; PNG files are permanent.'}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
