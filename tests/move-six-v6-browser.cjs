'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.mjs':'text/javascript; charset=utf-8','.png':'image/png','.json':'application/json','.md':'text/markdown'};
const server=http.createServer((req,res)=>{
 let file;try{file=path.resolve(root,'.'+decodeURI((req.url||'/').split('?')[0]))}
 catch{res.writeHead(400).end();return}
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 if(file===root)file=path.join(root,'moves-v6.html');
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404).end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(data);
 });
});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await chromium.launch({
  executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,
  args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle',
   '--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
 });
 try{
  for(const [id,viewport,mobile] of [
   ['desktop',{width:1280,height:900},false],
   ['mobile',{width:844,height:390},true]
  ]){
   const page=await browser.newPage({viewport,isMobile:mobile,hasTouch:mobile});
   const errors=[],missing=[];
   page.on('pageerror',err=>errors.push(String(err)));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))missing.push(r.status()+' '+r.url())});
   await page.goto('http://127.0.0.1:'+server.address().port+'/moves-v6.html',
    {waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>window.__v6lab?.ready===true,null,{timeout:55000});
   const st=await page.evaluate(()=>({
    renderer:window.__v6lab.renderer,textures:window.__v6lab.textures,
    imported:window.__v6lab.externalAssets,effects:window.__v6lab.effects,
    layers:window.__v6lab.layers,version:window.__v6lab.version,
    canvas:[document.querySelector('#stage canvas')?.width,document.querySelector('#stage canvas')?.height],
    errors:window.__v6lab.errors
   }));
   assert.deepEqual(st,{renderer:'WebGL',textures:17,imported:11,effects:6,layers:108,
    version:'v6',canvas:[960,620],errors:[]},id);
   await page.waitForFunction(()=>window.__v6lab.frameIndex.length===6);
   const previous=await page.evaluate(()=>window.__v6lab.frameIndex.slice());
   await page.waitForFunction(before=>window.__v6lab.frameIndex.some((n,i)=>n!==before[i]),previous,{timeout:9000});
   const dest=path.join(root,'evidence/moves-six-v6');fs.mkdirSync(dest,{recursive:true});
   await page.locator('#travel').click();
   await page.waitForFunction(()=>window.__v6lab.paused&&window.__v6lab.previewFrame===7&&
    window.__v6lab.frameIndex.every(n=>n===7)&&window.__v6lab.visibleMaterialCount>0);
   await page.screenshot({path:path.join(dest,id+'-travel.png'),fullPage:true});
   if(id==='desktop'){
    const jpeg=await page.locator('#stage').screenshot({type:'jpeg',quality:53});
    console.log('V6_INSPECT_TRAVEL_JPEG='+jpeg.toString('base64'));
   }
   await page.locator('#impact').click();
   await page.waitForFunction(()=>window.__v6lab.paused&&window.__v6lab.previewFrame===10&&
    window.__v6lab.frameIndex.every(n=>n===10)&&window.__v6lab.visibleMaterialCount>0);
   const withMaterial=await page.evaluate(()=>window.__v6lab.visibleMaterialCount);
   assert.ok(withMaterial>5,id+' actual art textures visible at contact');
   await page.screenshot({path:path.join(dest,id+'-impact-cc0-on.png'),fullPage:true});
   if(id==='desktop'){
    const jpeg=await page.locator('#stage').screenshot({type:'jpeg',quality:53});
    console.log('V6_INSPECT_CONTACT_JPEG='+jpeg.toString('base64'));
   }
   await page.locator('#material').click();
   await page.waitForFunction(()=>window.__v6lab.material===false&&window.__v6lab.visibleMaterialCount===0);
   await page.screenshot({path:path.join(dest,id+'-impact-cc0-off.png'),fullPage:true});
   await page.locator('#material').click();
   await page.waitForFunction(()=>window.__v6lab.material&&window.__v6lab.visibleMaterialCount>0);
   await page.locator('#battle').click();
   await page.waitForFunction(()=>window.__v6lab.background==='battle');
   await page.screenshot({path:path.join(dest,id+'-battle.png'),fullPage:true});
   await page.locator('#light').click();
   await page.waitForFunction(()=>window.__v6lab.background==='light');
   if(id==='desktop')await page.screenshot({path:path.join(dest,'desktop-light.png'),fullPage:true});
   await page.locator('#dark').click();
   await page.locator('#decay').click();
   await page.waitForFunction(()=>window.__v6lab.previewFrame===13&&window.__v6lab.frameIndex.every(n=>n===13));
   await page.screenshot({path:path.join(dest,id+'-decay.png'),fullPage:true});
   await page.locator('#v5').click();
   await page.waitForFunction(()=>window.__v6lab.version==='v5'&&window.__v6lab.layers===18);
   if(id==='desktop')await page.screenshot({path:path.join(dest,'desktop-v5-rejected-comparison.png'),fullPage:true});
   await page.locator('#v6').click();
   await page.waitForFunction(()=>window.__v6lab.version==='v6'&&window.__v6lab.layers===108);
   await page.locator('#slow').click();
   await page.waitForFunction(()=>window.__v6lab.speed===.5);
   await page.locator('#normal').click();
   await page.waitForFunction(()=>window.__v6lab.speed===1);
   await page.locator('#pause').click();
   await page.waitForFunction(()=>window.__v6lab.paused===false);
   assert.deepEqual(errors,[],id+' JavaScript exception');
   assert.deepEqual(missing,[],id+' missing local textures');
   console.log('PASS',id,'6 moves 11 imported CC0 PNGs 108 Phaser sprites, visible real texture check',withMaterial,
    'V5 A/B, three backgrounds, pause, speed, frame 10 hit and 13 breakup');
   await page.close();
  }
 }finally{await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error(e);process.exitCode=1});
