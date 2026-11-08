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
 if(file===root)file=path.join(root,'moves-v9.html');
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404).end('not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(data);
 });
});
(async()=>{
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
  headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle',
  '--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 try{
  const names=['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash'];
  for(const [device,viewport,mobile] of [
   ['desktop',{width:1280,height:900},false],
   ['mobile',{width:390,height:844},true]
  ]){
   const page=await browser.newPage({viewport,isMobile:mobile,hasTouch:mobile});
   const exceptions=[],missing=[];
   page.on('pageerror',err=>exceptions.push(String(err)));
   page.on('response',res=>{if(res.status()>=400&&res.url().startsWith('http://127.0.0.1'))
    missing.push(res.status()+' '+res.url())});
   await page.goto('http://127.0.0.1:'+server.address().port+'/moves-v9.html',
    {waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>window.__v9lab?.ready===true,null,{timeout:55000});
   const start=await page.evaluate(()=>({
    renderer:window.__v9lab.renderer,v9:window.__v9lab.v9Textures,
    preserve:window.__v9lab.airSlashV8,selected:window.__v9lab.selected,
    canvas:[document.querySelector('#stage canvas')?.width,document.querySelector('#stage canvas')?.height],
    errors:window.__v9lab.errors
   }));
   assert.deepEqual(start,{renderer:'WebGL',v9:5,preserve:true,
    selected:'flame-burst',canvas:[620,370],errors:[]},device);
   const dest=path.join(root,'evidence/moves-v9');fs.mkdirSync(dest,{recursive:true});
   for(const id of names){
    await page.locator('#move').selectOption(id);
    await page.waitForFunction(v=>window.__v9lab.selected===v,id);
    const approved=id==='air-slash';
    await page.waitForFunction(v=>window.__v9lab.version===(v?'v8':'v9'),approved);
    await page.locator('#travel').click();
    await page.waitForFunction(v=>window.__v9lab.paused&&window.__v9lab.frame===(v?9:6),approved);
    if(device==='desktop')await page.screenshot({path:path.join(dest,id+'-travel-desktop.png'),fullPage:true});
    await page.locator('#impact').click();
    await page.waitForFunction(v=>window.__v9lab.frame===(v?14:9),approved);
    await page.screenshot({path:path.join(dest,id+'-impact-'+device+'.png'),fullPage:true});
    await page.locator('#decay').click();
    await page.waitForFunction(v=>window.__v9lab.frame===(v?20:13),approved);
    await page.locator('#pause').click();
    await page.waitForFunction(()=>!window.__v9lab.paused);
   }
   await page.locator('#battle').click();
   await page.waitForFunction(()=>window.__v9lab.background==='battle');
   await page.screenshot({path:path.join(dest,device+'-battle.png'),fullPage:true});
   await page.locator('#light').click();
   await page.waitForFunction(()=>window.__v9lab.background==='light');
   await page.locator('#dark').click();
   await page.waitForFunction(()=>window.__v9lab.background==='dark');
   await page.locator('#slow').click();
   assert.equal(await page.locator('#slow').getAttribute('aria-pressed'),'true');
   await page.locator('#normal').click();
   assert.equal(await page.locator('#normal').getAttribute('aria-pressed'),'true');
   await page.locator('#previous').click();
   await page.waitForFunction(()=>window.__v9lab.selected==='shadow-punch');
   await page.locator('#next').click();
   await page.waitForFunction(()=>window.__v9lab.selected==='meteor-mash');
   await page.waitForFunction(()=>new Set(window.__v9lab.frameSeen).size>=3,null,{timeout:12000});
   assert.deepEqual(exceptions,[],device+' JS errors');
   assert.deepEqual(missing,[],device+' missing PNG files');
   console.log('PASS '+device+' V9: five real PNG sprites and unchanged V8 Air Slash, 6 move choices, controls, WebGL, no download');
   await page.close();
  }
 }finally{await browser.close();await new Promise(done=>server.close(done))}
})().catch(e=>{console.error(e);process.exitCode=1});
