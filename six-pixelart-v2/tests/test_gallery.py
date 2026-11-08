#!/usr/bin/env python3
"""Focused visual QA for the independent six-move pixel-art gallery."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from hashlib import sha256
import json,os
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
MANIFEST=json.loads((ROOT/"manifest.json").read_text())
NAMES=["sacred-fire","aeroblast","octazooka","spider-web","venoshock","signal-beam"]
def check_frames():
    assert [m["id"] for m in MANIFEST["moves"]]==NAMES
    atlas=ROOT/"assets/all-six-16frames.png"
    data=atlas.read_bytes()
    assert sha256(data).hexdigest()==MANIFEST["atlasSHA256"]
    im=Image.open(atlas).convert("RGBA")
    assert im.size==(384,2304)
    for i,name in enumerate(NAMES):
        frames=[]
        for f in range(16):
            x=(f%4)*96;y=(i*4+f//4)*96
            cell=im.crop((x,y,x+96,y+96))
            assert cell.getchannel("A").getextrema()[0]==0,(name,f)
            frames.append(sha256(cell.tobytes()).hexdigest())
        assert len(set(frames))==16,name
        print("16 unique transparent frames OK:",name)

def check_browser():
    handler=partial(SimpleHTTPRequestHandler,directory=str(ROOT))
    server=ThreadingHTTPServer(("127.0.0.1",0),handler)
    thread=Thread(target=server.serve_forever,daemon=True);thread.start()
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True,executable_path=os.environ.get("CHROME_BIN","/usr/bin/google-chrome"),args=["--no-sandbox","--disable-dev-shm-usage"])
            try:
                for width,height in [(390,844),(1280,720)]:
                    page=browser.new_page(viewport={"width":width,"height":height})
                    errors=[];missing=[]
                    page.on("pageerror",lambda e: errors.append(str(e)))
                    page.on("response",lambda r:missing.append((r.status,r.url)) if r.status>=400 else None)
                    page.goto(f"http://127.0.0.1:{server.server_port}/index.html",wait_until="load")
                    page.wait_for_function("window.__torre2FxPreview?.loaded===true",timeout=20000)
                    assert page.locator("nav button").count()==6
                    for i,name in enumerate(NAMES):
                        page.locator(f'[data-id="{i}"]').click()
                        assert page.evaluate("window.__torre2FxPreview.state.index")==i
                        page.locator("#impact").click()
                        assert page.evaluate("window.__torre2FxPreview.state.frame")==10
                        page.locator("#step").click()
                        assert page.evaluate("window.__torre2FxPreview.state.frame")==11
                        page.locator("#again").click()
                        assert not page.evaluate("window.__torre2FxPreview.state.paused")
                    page.wait_for_timeout(750)
                    assert page.evaluate("window.__torre2FxPreview.state.shown")>10
                    assert not errors,errors
                    assert not missing,missing
                    out=ROOT/"test-evidence";out.mkdir(exist_ok=True)
                    page.screenshot(path=str(out/f"v2-{width}.png"),full_page=True)
                    print("PASS actual Chrome",width,height,"six selectable attacks, actual animation, no JS/asset failures")
                    page.close()
            finally: browser.close()
    finally:
        server.shutdown();server.server_close()

if __name__=="__main__":
    check_frames()
    check_browser()
