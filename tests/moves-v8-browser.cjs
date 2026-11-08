'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.mjs':'text/javascript; charset=utf-8','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{
 let file;
 try{file=path.resolve(root,'.'+decodeURI((req.url||'/').split('?')[0]))}
 catch{res.writeHead(400).end();return}
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 if(file===root)file=path.join(root,'moves-v8.html');
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404).end('missing');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(data);
 });
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
  headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle',
  '--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 try{
  for(const [device,viewport,mobile] of [
   ['desktop',{width:1280,height:900},false],
   ['mobile',{width:390,height:844},true]
  ]){
   const page=await browser.newPage({viewport,hasTouch:mobile,isMobile:mobile});
   const jsErrors=[],badResponses=[];
   page.on('pageerror',e=>jsErrors.push(String(e)));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))
    badResponses.push(r.status()+' '+r.url())});
   await page.goto('http://127.0.0.1:'+server.address().port+'/moves-v8.html',
    {waitUntil:'domcontentloaded',timeout:40000});
   await page.waitForFunction(()=>window.__v8lab?.ready===true,null,{timeout:55000});
   let init=await page.evaluate(()=>({
    renderer:window.__v8lab.renderer,pixelfx:window.__v8lab.pixelfxAtlases,
    relics:window.__v8lab.relics,v8Heroes:window.__v8lab.relicsV8,textures:window.__v8lab.textures,
    selected:window.__v8lab.selected,
    errors:window.__v8lab.errors,
    dimensions:[document.querySelector('#stage canvas')?.width,document.querySelector('#stage canvas')?.height]
   }));
   assert.deepEqual(init,{renderer:'WebGL',pixelfx:9,relics:3,v8Heroes:3,textures:15,
    selected:'flame-burst',errors:[],dimensions:[620,370]},device);
   const out=path.join(root,'evidence/moves-v8');fs.mkdirSync(out,{recursive:true});
   const ids=['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash'];
   for(const id of ids){
    await page.locator('#move').selectOption(id);
    await page.waitForFunction(k=>window.__v8lab.selected===k,id);
    await page.locator('#travel').click();
    await page.waitForFunction(()=>window.__v8lab.paused&&window.__v8lab.frame===9);
    if(device==='desktop')await page.screenshot({path:path.join(out,id+'-travel-desktop.png'),fullPage:true});
    if(device==='desktop'){
      const j=await page.locator('#stage').screenshot({type:'jpeg',quality:56});
      console.log('V8_TRAVEL_'+id.toUpperCase().replaceAll('-','_')+'='+j.toString('base64'));
    }
    await page.locator('#hit').click();
    await page.waitForFunction(()=>window.__v8lab.frame===14);
    await page.screenshot({path:path.join(out,id+'-contact-'+device+'.png'),fullPage:true});
    if(device==='desktop'&&['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash'].includes(id)){
     const jpeg=await page.locator('#stage').screenshot({type:'jpeg',quality:56});
     console.log('V8_INSPECT_'+id.toUpperCase().replaceAll('-','_')+'='+jpeg.toString('base64'));
    }
    await page.locator('#decay').click();
    await page.waitForFunction(()=>window.__v8lab.frame===20);
    if(device==='mobile')await page.screenshot({path:path.join(out,id+'-decay-mobile.png'),fullPage:true});
    await page.locator('#pause').click();
    await page.waitForFunction(()=>!window.__v8lab.paused);
   }
   // Viewability and controls: switches must actually change state, not CSS-only decoration.
   await page.locator('#battle').click();
   await page.waitForFunction(()=>window.__v8lab.background==='battle');
   await page.screenshot({path:path.join(out,device+'-battle.png'),fullPage:true});
   await page.locator('#light').click();
   await page.waitForFunction(()=>window.__v8lab.background==='light');
   await page.locator('#dark').click();
   await page.waitForFunction(()=>window.__v8lab.background==='dark');
   await page.locator('#half').click();
   assert.equal(await page.locator('#half').getAttribute('aria-pressed'),'true');
   await page.locator('#normal').click();
   assert.equal(await page.locator('#normal').getAttribute('aria-pressed'),'true');
   await page.locator('#version-v7').click();
   await page.waitForFunction(()=>window.__v8lab.version==='v7');
   if(device==='desktop')await page.screenshot({path:path.join(out,'desktop-v7-before.png'),fullPage:true});
   await page.locator('#version-v8').click();
   await page.waitForFunction(()=>window.__v8lab.version==='v8'&&window.__v8lab.active===true);
   await page.locator('#prev').click();
   await page.waitForFunction(()=>window.__v8lab.selected==='shadow-punch');
   await page.locator('#next').click();
   await page.waitForFunction(()=>window.__v8lab.selected==='meteor-mash');
   await page.waitForFunction(()=>new Set(window.__v8lab.frameSeen).size>2,null,{timeout:10000});
   assert.deepEqual(jsErrors,[],device+' JavaScript errors');
   assert.deepEqual(badResponses,[],device+' failed resources');
   console.log('PASS '+device+' V8 director with nine source PixelFX atlases, three handmade relics, six distinct gestures, preview frames & mobile playback');
   await page.close();
  }
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
