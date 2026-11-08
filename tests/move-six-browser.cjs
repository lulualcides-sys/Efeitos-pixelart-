'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{
 let file;
 try{file=path.resolve(root,'.'+decodeURI((req.url||'/').split('?')[0]))}
 catch{res.writeHead(400).end();return}
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 if(file===root)file=path.join(root,'moves.html');
 fs.readFile(file,(err,bytes)=>{
  if(err){res.writeHead(404).end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(bytes);
 });
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({
  executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,
  args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
 });
 try{
  for(const [id,viewport,isMobile] of [
   ['desktop',{width:1280,height:920},false],
   ['mobile-landscape',{width:844,height:390},true]
  ]){
   const page=await browser.newPage({viewport,isMobile,hasTouch:isMobile});
   const errs=[],badHttp=[];
   page.on('pageerror',e=>errs.push(String(e)));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))badHttp.push(r.url()+' '+r.status())});
   await page.goto('http://127.0.0.1:'+server.address().port+'/moves.html',{waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>window.__movesLab?.ready===true,null,{timeout:50000});
   const stats=await page.evaluate(()=>({
    renderer:window.__movesLab.renderer,textures:window.__movesLab.textureCount,
    effects:window.__movesLab.effectCount,sprites:window.__movesLab.layerSpriteCount,
    errors:window.__movesLab.errors,canvas:[document.querySelector('#stage canvas')?.width,document.querySelector('#stage canvas')?.height]
   }));
   assert.deepEqual(stats,{renderer:'WebGL',textures:6,effects:6,sprites:12,errors:[],canvas:[960,615]},id);
   await page.waitForFunction(()=>window.__movesLab.animationFrames.length===6);
   const before=await page.evaluate(()=>window.__movesLab.animationFrames.slice());
   await page.waitForFunction(before=>window.__movesLab.animationFrames.some((n,i)=>n!==before[i]),before,{timeout:9000});
   const out=path.join(root,'evidence/moves-six-v1');fs.mkdirSync(out,{recursive:true});
   await page.locator('#impact').click();
   await page.waitForFunction(()=>window.__movesLab.previewFrame===9&&window.__movesLab.paused&&window.__movesLab.animationFrames.every(x=>x===9));
   await page.screenshot({path:path.join(out,id+'-impact-dark.png'),fullPage:true});
   await page.locator('#light').click();
   await page.waitForFunction(()=>window.__movesLab.backgroundTheme==='light');
   if(id==='desktop')await page.screenshot({path:path.join(out,'desktop-impact-light.png'),fullPage:true});
   await page.locator('#battle').click();
   await page.waitForFunction(()=>window.__movesLab.backgroundTheme==='battle');
   await page.screenshot({path:path.join(out,id+'-impact-battle.png'),fullPage:true});
   await page.locator('#dark').click();
   await page.locator('#fragments').click();
   await page.waitForFunction(()=>window.__movesLab.previewFrame===12&&window.__movesLab.animationFrames.every(x=>x===12));
   await page.screenshot({path:path.join(out,id+'-dissipation.png'),fullPage:true});
   await page.locator('#sparks').click();
   await page.waitForFunction(()=>window.__movesLab.sparksEnabled===false);
   assert.equal(await page.locator('#sparks').getAttribute('data-active'),'false');
   await page.locator('#sparks').click();
   await page.waitForFunction(()=>window.__movesLab.sparksEnabled===true);
   await page.locator('#slow').click();
   await page.waitForFunction(()=>window.__movesLab.speed===.5);
   await page.locator('#normal').click();
   await page.waitForFunction(()=>window.__movesLab.speed===1);
   await page.locator('#pause').click();
   await page.waitForFunction(()=>window.__movesLab.paused===false&&window.__movesLab.previewFrame===null);
   await page.waitForTimeout(160);
   assert.deepEqual(errs,[],id+' JS errors');
   assert.deepEqual(badHttp,[],id+' local HTTP errors');
   console.log('PASS',id,stats.renderer,'6 unique sheets, 12 animated layers, frame 9 impact, frame 12 breakup, 3 backgrounds, sparks toggle');
   await page.close();
  }
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
