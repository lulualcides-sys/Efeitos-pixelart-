"""Visual QA: six independent pixel-art attack sprites from the standalone V7 gallery."""
import base64
import hashlib
import io
import json
import re
from pathlib import Path
from functools import partial
from threading import Thread
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
NAMES = ["metal-burst","power-whip","dark-void","dragon-hammer","fleur-cannon","steam-eruption"]

def art_check():
    page=(ROOT/"index.html").read_text()
    manifest=json.loads((ROOT/"manifest.json").read_text())
    encoded=re.search(r"atlas\.src='data:image/png;base64,([^']+)'",page)
    assert encoded, "Standalone gallery must include the actual spritesheet, never external files"
    pixels=base64.b64decode(encoded.group(1),validate=True)
    assert hashlib.sha256(pixels).hexdigest()==manifest["atlas"]["sha256"]
    atlas=Image.open(io.BytesIO(pixels)).convert("RGBA")
    assert atlas.size==(384,2304)
    assert manifest["gameIntegration"] is False
    assert manifest["approved"] is False
    assert [x["id"] for x in manifest["moves"]]==NAMES
    for mi,name in enumerate(NAMES):
        hashes=[]
        for i in range(16):
            x=(i%4)*96;y=(mi*4+i//4)*96
            frame=atlas.crop((x,y,x+96,y+96))
            assert frame.getbbox() is not None,(name,i)
            assert frame.getchannel("A").getextrema()[0]==0,(name,i)
            hashes.append(hashlib.sha256(frame.tobytes()).hexdigest())
        assert len(set(hashes))==16,name
    print("PASS 96 unique transparent PNG frames, six distinct moves and verified SHA-256")

def chrome_check():
    http=ThreadingHTTPServer(("127.0.0.1",0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
    Thread(target=http.serve_forever,daemon=True).start()
    try:
        with sync_playwright() as p:
            import os
            executable=os.environ.get("CHROME_BIN","/usr/bin/google-chrome")
            browser=p.chromium.launch(executable_path=executable,headless=True,args=["--no-sandbox","--disable-dev-shm-usage","--enable-unsafe-swiftshader"])
            try:
                for width,height in [(390,844),(1280,720)]:
                    page=browser.new_page(viewport={"width":width,"height":height},device_scale_factor=1)
                    errors=[];http_errors=[]
                    page.on("pageerror",lambda e:errors.append(str(e)))
                    page.on("response",lambda r:http_errors.append((r.url,r.status)) if r.status>=400 else None)
                    page.goto(f"http://127.0.0.1:{http.server_port}/index.html",wait_until="load",timeout=30000)
                    page.wait_for_function("window.__vfxV7?.loaded===true",timeout=15000)
                    assert page.locator("#moves button").count()==6
                    for i,name in enumerate(NAMES):
                        page.locator(f'[data-move="{name}"]').click()
                        assert page.evaluate("window.__vfxV7.state.move")==i
                        page.locator("#impact").click()
                        assert page.evaluate("window.__vfxV7.state.frame")==9
                        page.locator("#step").click()
                        assert page.evaluate("window.__vfxV7.state.frame")==10
                        page.locator("#play").click()
                        assert page.evaluate("window.__vfxV7.state.paused") is False
                        page.wait_for_timeout(120)
                        page.locator("#impact").click()
                        out=ROOT/"evidence"
                        out.mkdir(exist_ok=True)
                        page.screenshot(path=str(out/f"{width}-{name}.png"),full_page=False)
                    assert page.evaluate("window.__vfxV7.state.draws")>40
                    assert page.evaluate("window.__vfxV7.state.errors")==[]
                    assert not errors,errors
                    assert not http_errors,http_errors
                    print("PASS Chrome preview",width,height,"six attack selectors and frame actions")
                    page.close()
            finally:browser.close()
    finally:
        http.shutdown();http.server_close()

if __name__=="__main__":
    art_check()
    chrome_check()
