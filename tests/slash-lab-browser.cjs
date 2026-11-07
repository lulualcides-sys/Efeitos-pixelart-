'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{
 let file;
 try{file=path.resolve(root,'.'+decodeURI((req.url||'/').split('?')[0]));}
 catch{res.writeHead(400).end();return}
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,buffer)=>{
  if(err){res.writeHead(404).end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
  res.end(buffer);
 });
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
  headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 try{
  for(const [id,viewport,isMobile] of [
   ['desktop',{width:1280,height:900},false],['mobile-landscape',{width:844,height:390},true]
  ]){
   const page=await browser.newPage({viewport,isMobile,hasTouch:isMobile});
   const errors=[],httpErrors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   page.on('response',r=>{
    if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))
      httpErrors.push(r.status()+' '+r.url());
   });
   await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>window.__vfxLab?.ready===true,null,{timeout:45000});
   await page.waitForTimeout(240);
   const framesBefore=await page.evaluate(()=>window.__vfxLab.animationFrames.slice());
   await page.waitForTimeout(210);
   const framesAfter=await page.evaluate(()=>window.__vfxLab.animationFrames.slice());
   const state=await page.evaluate(()=>({
    renderer:window.__vfxLab.renderer,ready:window.__vfxLab.ready,
    sheets:window.__vfxLab.sheetCount,sprites:window.__vfxLab.liveSprites,
    canvas:[document.querySelector('#stage canvas')?.width,document.querySelector('#stage canvas')?.height]
   }));
   assert.equal(state.ready,true,id);assert.equal(state.renderer,'WebGL',id);
   assert.equal(state.sheets,18,id);assert.equal(state.sprites,6,id);
   assert.deepEqual(state.canvas,[960,582],id);
   assert.notDeepEqual(framesBefore,framesAfter,id+' frames frozen');
   assert.deepEqual(errors,[],id+' browser exceptions');
   assert.deepEqual(httpErrors,[],id+' missing local assets');
   const out=path.join(root,'evidence/slash-v3');
   fs.mkdirSync(out,{recursive:true});
   await page.screenshot({path:path.join(out,id+'-v3.png'),fullPage:true});
   await page.locator('#before').click();
   await page.waitForFunction(()=>window.__vfxLab.version==='v1');
   assert.equal(await page.evaluate(()=>window.__vfxLab.liveSprites),6,id+' V1 comparison');
   if(id==='desktop')await page.screenshot({path:path.join(out,'desktop-v1-comparison.png'),fullPage:true});
   await page.locator('#arc').click();
   await page.waitForFunction(()=>window.__vfxLab.version==='v2');
   assert.equal(await page.evaluate(()=>window.__vfxLab.liveSprites),6,id+' V2 comparison');
   if(id==='desktop')await page.screenshot({path:path.join(out,'desktop-v2-comparison.png'),fullPage:true});
   await page.locator('#elemental').click();
   await page.waitForFunction(()=>window.__vfxLab.version==='v3');
   await page.locator('#pause').click();await page.locator('#pause').click();
   await page.locator('#slow').click();await page.locator('#normal').click();
   assert.deepEqual(errors,[],id+' UI errors');
   console.log('PASS',id,'Phaser/WebGL: 18 sheets, 6 elemental sprites, V1/V2/V3 comparisons');
   await page.close();
  }
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1});
