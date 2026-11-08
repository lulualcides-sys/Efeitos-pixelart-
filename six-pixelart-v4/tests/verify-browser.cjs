'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const crypto=require('node:crypto');
const {chromium}=require('playwright-core');

const dir=path.resolve('six-pixelart-v4');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const png=fs.readFileSync(path.join(dir,manifest.atlas));
assert.equal(crypto.createHash('sha256').update(png).digest('hex'),manifest.atlasSHA256);
assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
assert.equal(png.readUInt32BE(16),384);
assert.equal(png.readUInt32BE(20),2304);
assert.equal(manifest.research.length,6);
assert.equal(manifest.totalFrames,96);
assert.equal(manifest.gameIntegration,false);

const server=http.createServer((req,res)=>{
 const u=new URL(req.url||'/','http://localhost');
 const file=path.resolve(dir,'.'+(u.pathname==='/'?'/index.html':u.pathname));
 if(!file.startsWith(dir+path.sep)){res.writeHead(403);res.end();return}
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404);res.end('missing');return}
  res.writeHead(200,{'content-type':file.endsWith('.png')?'image/png':file.endsWith('.html')?'text/html':'application/json'});
  res.end(data);
 });
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:720},isMobile:mobile,hasTouch:mobile});
   const errors=[];const badResponses=[];
   page.on('pageerror',e=>errors.push(String(e)));
   page.on('response',r=>{if(r.status()>=400)badResponses.push(r.status()+' '+r.url())});
   await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',{waitUntil:'load',timeout:20000});
   await page.waitForFunction(()=>window.__vfxV4&&window.__vfxV4.loaded,{timeout:20000});
   assert.equal(await page.locator('[data-move]').count(),6);
   for(let i=0;i<manifest.research.length;i++){
    const id=manifest.research[i].id;
    await page.locator('[data-move="'+id+'"]').click();
    assert.equal(await page.evaluate(()=>window.__vfxV4.state.index),i);
    await page.locator('#impact').click();
    assert.equal(await page.evaluate(()=>window.__vfxV4.frame),10);
    await page.locator('#next').click();
    assert.equal(await page.evaluate(()=>window.__vfxV4.frame),11);
    await page.locator('#replay').click();
    assert.equal(await page.evaluate(()=>window.__vfxV4.state.paused),false);
   }
   await page.waitForTimeout(450);
   const count=await page.evaluate(()=>window.__vfxV4.state.shown);
   assert.ok(count>15,'draw() must render actual frames; count='+count);
   assert.deepEqual(errors,[]);
   assert.deepEqual(badResponses,[]);
   fs.mkdirSync('six-pixelart-v4/test-evidence',{recursive:true});
   await page.screenshot({path:'six-pixelart-v4/test-evidence/'+(mobile?'mobile':'desktop')+'.png',fullPage:true});
   console.log('PASS six animated pixelsheets in real Chromium',mobile?'mobile':'desktop','frames drawn',count);
   await page.close();
  }
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
