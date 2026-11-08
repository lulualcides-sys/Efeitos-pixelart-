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
 if(file===root)file=path.join(root,'moves-v5.html');
 fs.readFile(file,(err,bytes)=>{
  if(err){res.writeHead(404).end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(bytes);
 });
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
  headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader',
    '--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 try{
  for(const [id,viewport,isMobile] of [['desktop',{width:1280,height:920},false],['mobile-landscape',{width:844,height:390},true]]){
   const page=await browser.newPage({viewport,isMobile,hasTouch:isMobile});
   const errors=[],bad=[];
   page.on('pageerror',e=>errors.push(String(e)));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))bad.push(r.status()+' '+r.url())});
   await page.goto('http://127.0.0.1:'+server.address().port+'/moves-v5.html',{waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>window.__movesLab?.ready===true,null,{timeout:55000});
   const state=await page.evaluate(()=>({
    renderer:window.__movesLab.renderer,textures:window.__movesLab.textureCount,
    effects:window.__movesLab.effectCount,sprites:window.__movesLab.layerSpriteCount,
    version:window.__movesLab.activeVersion,canvas:[document.querySelector('#stage canvas')?.width,document.querySelector('#stage canvas')?.height]
   }));
   assert.deepEqual(state,{renderer:'WebGL',textures:30,effects:6,sprites:18,version:'v5',canvas:[960,615]},id);
   await page.waitForFunction(()=>window.__movesLab.animationFrames.length===6);
   let frames=await page.evaluate(()=>window.__movesLab.animationFrames.slice());
   await page.waitForFunction(before=>window.__movesLab.animationFrames.some((f,i)=>f!==before[i]),frames,{timeout:8000});
   const dir=path.join(root,'evidence/moves-six-v5');
   fs.mkdirSync(dir,{recursive:true});
   await page.locator('#impact').click();
   await page.waitForFunction(()=>window.__movesLab.paused&&window.__movesLab.previewFrame===10&&window.__movesLab.animationFrames.every(x=>x===10));
   await page.screenshot({path:path.join(dir,id+'-contact-v5.png'),fullPage:true});
   await page.locator('#battle').click();
   await page.waitForFunction(()=>window.__movesLab.backgroundTheme==='battle');
   await page.screenshot({path:path.join(dir,id+'-battle-v5.png'),fullPage:true});
   await page.locator('#light').click();
   await page.waitForFunction(()=>window.__movesLab.backgroundTheme==='light');
   if(id==='desktop')await page.screenshot({path:path.join(dir,'desktop-light-v5.png'),fullPage:true});
   await page.locator('#dark').click();
   await page.locator('#fragments').click();
   await page.waitForFunction(()=>window.__movesLab.previewFrame===13&&window.__movesLab.animationFrames.every(x=>x===13));
   await page.screenshot({path:path.join(dir,id+'-dissipate-v5.png'),fullPage:true});
   await page.locator('#sparks').click();
   await page.waitForFunction(()=>!window.__movesLab.sparksEnabled);
   await page.locator('#sparks').click();
   await page.waitForFunction(()=>window.__movesLab.sparksEnabled);
   await page.locator('#glow').click();
   await page.waitForFunction(()=>!window.__movesLab.glowEnabled);
   await page.locator('#glow').click();
   await page.waitForFunction(()=>window.__movesLab.glowEnabled);
   await page.locator('#version-v4').click();
   await page.waitForFunction(()=>window.__movesLab.activeVersion==='v4'&&window.__movesLab.layerSpriteCount===18);
   if(id==='desktop')await page.screenshot({path:path.join(dir,'desktop-v4-rejected.png'),fullPage:true});
   await page.locator('#version-v3').click();
   await page.waitForFunction(()=>window.__movesLab.activeVersion==='v3'&&window.__movesLab.layerSpriteCount===18);
   if(id==='desktop')await page.screenshot({path:path.join(dir,'desktop-v3-rejected.png'),fullPage:true});
   await page.locator('#version-v2').click();
   await page.waitForFunction(()=>window.__movesLab.activeVersion==='v2'&&window.__movesLab.layerSpriteCount===30);
   if(id==='desktop')await page.screenshot({path:path.join(dir,'desktop-v2-rejected.png'),fullPage:true});
   await page.locator('#version-v1').click();
   await page.waitForFunction(()=>window.__movesLab.activeVersion==='v1'&&window.__movesLab.layerSpriteCount===12);
   await page.locator('#version-v5').click();
   await page.waitForFunction(()=>window.__movesLab.activeVersion==='v5'&&window.__movesLab.layerSpriteCount===18);
   await page.locator('#slow').click();
   await page.waitForFunction(()=>window.__movesLab.speed===.5);
   await page.locator('#normal').click();
   await page.waitForFunction(()=>window.__movesLab.speed===1);
   await page.locator('#pause').click();
   await page.waitForFunction(()=>window.__movesLab.paused===false);
   assert.deepEqual(errors,[],id+' JS errors');
   assert.deepEqual(bad,[],id+' local assets missing');
   console.log('PASS',id,'WebGL V5 native 180px sprites; 30 textures/18 sprites; V1-V4 comparisons; frame 10 contact and 13 breakup');
   await page.close();
  }
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(err=>{console.error(err);process.exitCode=1});
